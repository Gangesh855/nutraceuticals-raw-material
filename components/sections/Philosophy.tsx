"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LINES = ["We don't process plants.", "We translate nature into measurable,", "verifiable purity —", "one batch, one certificate, one promise."];
const PILLARS = [
  { t: "Purity", d: "Validated HPLC assays and full contaminant screening on every lot." },
  { t: "Innovation", d: "Low-temperature and CO₂ extraction that preserves actives." },
  { t: "Compliance", d: "GMP-aligned systems with batch-level traceability." },
];

export default function Philosophy() {
  const root = useRef<HTMLElement>(null);
  const spot = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".word").forEach((w) => {
        gsap.fromTo(w, { opacity: 0.12 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: w, start: "top 80%", end: "top 45%", scrub: true } });
      });
      gsap.from(".pillar", { y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".pillars", start: "top 85%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const r = spot.current!.getBoundingClientRect();
    spot.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
    spot.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section ref={root} id="about" className="section overflow-hidden py-24 md:py-40">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal-950 via-charcoal-800 to-charcoal-950" aria-hidden />
      <Image src="/images/ashwagandha.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-[.14] blur-[2px]" />
      {/* Set NEXT_PUBLIC_EXTRACTION_VIDEO (e.g. /video/extraction.mp4) to enable the background video */}
      {process.env.NEXT_PUBLIC_EXTRACTION_VIDEO && (
        <video className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" src={process.env.NEXT_PUBLIC_EXTRACTION_VIDEO} autoPlay muted loop playsInline preload="none" />
      )}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_20%_30%,rgba(16,185,129,.18),transparent)]" aria-hidden />
      <p className="eyebrow mb-10">01 / Manifesto</p>
      <h2 className="h-display max-w-5xl text-[9vw] md:text-[5.5vw]">
        {LINES.map((l, i) => (
          <span key={i} className="block">
            {l.split(" ").map((w, j) => <span key={j} className="word inline-block pr-[.28em]">{w}</span>)}
          </span>
        ))}
      </h2>
      <p ref={spot} onPointerMove={onMove} data-cursor="view"
        className="mt-10 max-w-xl text-xl md:mt-16 md:text-2xl font-display italic text-ivory/15"
        style={{ backgroundImage: "radial-gradient(circle 160px at var(--x,-999px) var(--y,-999px), #F2E2A6, transparent)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", backgroundColor: "rgba(237,235,228,.15)" } as React.CSSProperties}>
        Every batch, a story from seed to certificate.
      </p>
      <div className="pillars mt-16 grid md:mt-24 gap-6 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.t} className="pillar glass glow-edge p-8">
            <h3 className="font-display text-3xl text-gold-200">{p.t}</h3>
            <p className="mt-3 text-ivory/65">{p.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
