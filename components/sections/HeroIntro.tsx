"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import IntroFX from "@/components/sections/IntroFX";
import type { Seq } from "@/lib/heroSeq";

// Five close-ups. Stills are crops of the supplied photograph; drop `public/video/intro-<slug>.mp4` + NEXT_PUBLIC_HERO_VIDEO=1 to use real footage.
const PLATES = [
  { slug: "moringa", img: "/images/moringa.webp", pos: "22% 50%", label: "Moringa leaf · grinding" },
  { slug: "turmeric", img: "/images/turmeric.webp", pos: "40% 50%", label: "Turmeric root · milling" },
  { slug: "ginger", img: "/images/bacopa.webp", pos: "38% 88%", label: "Ginger slice · condensation" },
  { slug: "bacopa", img: "/images/bacopa.webp", pos: "8% 40%", label: "Bacopa · oil separation" },
  { slug: "boswellia", img: "/images/ginger.webp", pos: "10% 60%", label: "Boswellia resin · filtration" },
];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function HeroIntro({ seq }: { seq: React.MutableRefObject<Seq> }) {
  const plates = useRef<(HTMLDivElement | null)[]>([]);
  const veil = useRef<HTMLDivElement>(null);
  const cap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const ptr = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [videos, setVideos] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)").matches;
    setVideos(process.env.NEXT_PUBLIC_HERO_VIDEO === "1" && !small);
    const onMove = (e: PointerEvent) => { ptr.current.tx = e.clientX / window.innerWidth - 0.5; ptr.current.ty = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener("pointermove", onMove, { passive: true });
    let raf = 0, lastIdx = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const s = seq.current, p = ptr.current;
      p.x += (p.tx - p.x) * 0.06; p.y += (p.ty - p.y) * 0.06;
      const f = s.sceneF;
      plates.current.forEach((el, i) => {
        if (!el) return;
        let w = clamp(1 - Math.abs(f - (i + 0.5)) * 1.8);
        if ((i === 0 && f < 0.5) || (i === PLATES.length - 1 && f > PLATES.length - 0.5)) w = 1;
        const push = 1.1 + 0.2 * clamp((f - i + 0.5) / 2);
        el.style.opacity = String(w * s.lab);
        el.style.transform = `translate3d(${-p.x * 26}px, ${-p.y * 16}px, 0) scale(${push})`;
      });
      if (veil.current) veil.current.style.opacity = String(Math.sin(Math.PI * clamp(s.veil)));
      if (root.current) root.current.style.opacity = s.lab < 0.01 && s.veil >= 1 ? "0" : "1";
      const idx = Math.min(PLATES.length - 1, Math.floor(clamp(f, 0, 4.999)));
      if (cap.current && idx !== lastIdx) { lastIdx = idx; cap.current.textContent = `0${idx + 1} / 05 — ${PLATES[idx].label}`; }
      if (cap.current) cap.current.style.opacity = String(clamp(s.lab * 1.5));
      if (bar.current) bar.current.style.transform = `scaleX(${clamp(f / 5)})`;
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, [seq]);

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {PLATES.map((p, i) => (
        <div key={p.slug} ref={(el) => { plates.current[i] = el; }} className="absolute -inset-[6%] will-change-transform" style={{ opacity: i === 0 ? 1 : 0 }}>
          {/* depth of field: blurred plate behind, sharp centre on top */}
          <Image src={p.img} alt="" fill sizes="100vw" priority={i < 2} style={{ objectPosition: p.pos }} className="scale-110 object-cover opacity-90 blur-2xl brightness-[.55] saturate-[1.1]" />
          <Image src={p.img} alt="" fill sizes="100vw" priority={i < 2} style={{ objectPosition: p.pos, WebkitMaskImage: "radial-gradient(55% 52% at 50% 50%, #000 35%, transparent 82%)", maskImage: "radial-gradient(55% 52% at 50% 50%, #000 35%, transparent 82%)" }} className="object-cover brightness-[.95] contrast-[1.08] saturate-[1.05]" />
          {videos && !failed[p.slug] && (
            <video muted loop playsInline autoPlay preload="auto" className="absolute inset-0 h-full w-full object-cover">
              <source src={`/video/intro-${p.slug}.webm`} type="video/webm" />
              <source src={`/video/intro-${p.slug}.mp4`} type="video/mp4" onError={() => setFailed((f) => ({ ...f, [p.slug]: true }))} />
            </video>
          )}
        </div>
      ))}
      {/* lab-like grade: cool tint, vignette, faint grid */}
      <div className="absolute inset-0 bg-[radial-gradient(75%_65%_at_50%_50%,transparent_35%,rgba(3,8,10,.78)_100%),linear-gradient(180deg,rgba(120,170,190,.10),rgba(5,12,14,.35))]" />
      <IntroFX seq={seq} />
      <div ref={cap} className="absolute bottom-8 left-6 font-mono text-[11px] uppercase tracking-[.25em] text-ivory/75 md:left-12 lg:left-20" />
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10"><span ref={bar} className="block h-full origin-left bg-gold-400" style={{ transform: "scaleX(0)" }} /></span>
      {/* frosted-glass transition between the lab and the final hero */}
      <div ref={veil} className="absolute inset-0 bg-charcoal-950/30 backdrop-blur-xl" style={{ opacity: 0 }} />
    </div>
  );
}
