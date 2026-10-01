"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCTS, type Product } from "@/lib/products";

const CapsuleScene = dynamic(() => import("@/components/three/CapsuleScene"), { ssr: false });

function Card({ p, active, dim, onEnter, onLeave }: { p: Product; active: boolean; dim: boolean; onEnter: () => void; onLeave: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current!, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(30px)`;
    el.style.setProperty("--angle", `${Math.atan2(y, x) * 57.3 + 90}deg`);
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; onLeave(); };

  return (
    <div ref={ref} onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={leave} data-cursor="drag"
      className={`glass glow-edge relative h-[30rem] w-[19rem] shrink-0 snap-center overflow-hidden transition-[opacity,filter,transform] duration-500 ease-expo md:w-[22rem] ${dim ? "opacity-50 blur-[1.5px]" : ""}`}>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ opacity: active ? 1 : 0, background: `radial-gradient(240px circle at var(--sx,50%) var(--sy,50%), ${p.color}33, transparent 70%)` }} />
      {/* extraction visual: droplets */}
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-1/2 transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`} style={{ background: `linear-gradient(to top, ${p.color}44, transparent)` }}>
        {[...Array(6)].map((_, i) => (
          <span key={i} className="absolute h-2 w-2 rounded-full" style={{ left: `${12 + i * 15}%`, bottom: 0, background: p.color, animation: `drift ${2 + i * 0.4}s ease-in infinite alternate` }} />
        ))}
      </div>
      <Image src={p.image} alt={`${p.name} raw material and extract`} fill sizes="(min-width: 768px) 352px, 304px" style={{ objectPosition: p.imagePos }}
        className={`pointer-events-none object-cover transition-all duration-700 ease-expo [mask-image:linear-gradient(to_bottom,#000_0%,#000_28%,transparent_52%)] ${active ? "scale-110 opacity-40" : "scale-100 opacity-90"}`} />
      <div className="relative flex h-full flex-col p-7">
        <div className="flex items-start justify-between">
          <span className="eyebrow">{String(PRODUCTS.indexOf(p) + 1).padStart(2, "0")}</span>
          <span className="font-mono text-[10px] text-ivory/50">{p.latin}</span>
        </div>
        <div className="relative my-2 h-40">
          {active && <CapsuleScene color={p.color} open />}
        </div>
        <h3 className="font-display text-4xl">{p.name}</h3>
        <p className="mt-2 text-sm text-ivory/60">{p.blurb}</p>
        <div className={`mt-auto transition-all duration-500 ease-expo ${active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-70"}`}>
          <div className="mb-3 flex flex-wrap gap-2">
            {p.benefits.map((b) => <span key={b} className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-ivory/80">{b}</span>)}
          </div>
          <dl className="grid grid-cols-2 gap-y-1 font-mono text-[10px] text-ivory/60">
            <dt>Marker</dt><dd className="text-gold-200">{p.marker}</dd>
            <dt>Spec</dt><dd className="text-gold-200">{p.spec}</dd>
          </dl>
          <Link href={`/products/${p.slug}`} className="mt-2 inline-block py-2.5 font-mono text-[11px] uppercase tracking-[.2em] text-emerald-400 hover:text-gold-200">Spec sheet →</Link>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [fine, setFine] = useState(false);
  useEffect(() => { setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches); }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth + 160;
      gsap.to(t, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="products" className="relative flex min-h-screen flex-col justify-center overflow-hidden py-20 md:py-24">
      <div className="section mb-10">
        <p className="eyebrow mb-4">02 / The Extract Library</p>
        <h2 className="h-display text-5xl md:text-7xl">Standardised. <span className="italic text-gold-200">Traceable.</span></h2>
      </div>
      <div ref={track} className="flex snap-x gap-6 overflow-x-auto px-6 pb-6 md:overflow-visible md:px-20 md:snap-none [&::-webkit-scrollbar]:hidden">
        {PRODUCTS.map((p) => (
          <Card key={p.slug} p={p} active={fine && hover === p.slug} dim={fine && hover !== null && hover !== p.slug} onEnter={() => setHover(p.slug)} onLeave={() => setHover(null)} />
        ))}
      </div>
    </section>
  );
}
