"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STAGES = [
  { t: "Sourcing", d: "Farm-traceable, GAP-audited raw material with batch QR lineage.", tone: "from-emerald-700/40", img: "/images/bacopa.webp", pos: "15% 50%" },
  { t: "Extraction", d: "Ethanol/water and supercritical CO₂ routes, low-temperature concentration.", tone: "from-gold-600/30", img: "/images/ashwagandha.webp", pos: "70% 50%" },
  { t: "Testing", d: "HPLC, HPTLC, heavy metals, pesticide residues and microbial screening.", tone: "from-emerald-500/30", img: "/images/turmeric.webp", pos: "85% 50%" },
  { t: "Packaging", d: "Nitrogen-flushed, tamper-evident drums with a COA for every batch.", tone: "from-gold-400/25", img: "/images/ginger.webp", pos: "85% 50%" },
];

function Icon({ i, active }: { i: number; active: boolean }) {
  const s = { stroke: "currentColor", strokeWidth: 1.5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const draw = { initial: { pathLength: 0 }, animate: { pathLength: active ? 1 : 0.15 }, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const } };
  return (
    <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden>
      {i === 0 && (<><motion.path {...draw} {...s} d="M24 42V22" /><motion.path {...draw} {...s} d="M24 26c-8 0-12-5-12-12 8 0 12 4 12 12z" /><motion.path {...draw} {...s} d="M24 22c0-7 4-11 12-11 0 7-4 11-12 11z" /></>)}
      {i === 1 && (<><motion.path {...draw} {...s} d="M19 6h10M21 6v14L10 40a3 3 0 002.6 4h22.8a3 3 0 002.6-4L27 20V6" /><motion.path {...draw} {...s} d="M14 34h20" /></>)}
      {i === 2 && (<><motion.path {...draw} {...s} d="M4 34h8l4-16 5 22 5-30 5 24h13" /></>)}
      {i === 3 && (<><motion.path {...draw} {...s} d="M10 14h28v26H10zM8 14l4-8h24l4 8" /><motion.path {...draw} {...s} d="M18 26l4 4 8-9" /></>)}
    </svg>
  );
}

export default function Timeline() {
  const root = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(line.current, { scaleY: 0 }, { scaleY: 1, ease: "none", transformOrigin: "top", scrollTrigger: { trigger: ".tl-list", start: "top 60%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((el, i) =>
        ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 60%", onToggle: (s) => s.isActive && setActive(i) }));
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="manufacturing" className="section relative overflow-hidden py-32">
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${STAGES[active].tone} via-charcoal-950 to-charcoal-950 transition-all duration-1000`} aria-hidden />
      {STAGES.map((st, i) => (
        <Image key={st.t} src={st.img} alt="" fill sizes="100vw" style={{ objectPosition: st.pos }}
          className={`-z-10 object-cover blur-[3px] transition-opacity duration-1000 ${active === i ? "opacity-[.16]" : "opacity-0"}`} />
      ))}
      <p className="eyebrow mb-4">03 / Manufacturing Process</p>
      <h2 className="h-display mb-24 text-6xl md:text-7xl">From field to <span className="italic text-gold-200">drum.</span></h2>
      <div className="tl-list relative mx-auto max-w-5xl">
        <div className="absolute left-5 top-0 h-full w-px bg-white/10 md:left-1/2" />
        <div ref={line} className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-emerald-400 to-gold-400 shadow-glow md:left-1/2" />
        {STAGES.map((s, i) => (
          <div key={s.t} className={`tl-item relative mb-32 flex last:mb-0 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-16" : "md:pr-16 md:text-right"} pl-16 md:pl-0`}>
            <span className={`absolute left-5 top-6 h-4 w-4 -translate-x-1/2 rounded-full border-2 transition-all duration-700 md:left-auto ${i % 2 ? "md:-left-0 md:-translate-x-1/2" : "md:right-0 md:translate-x-1/2"} ${active >= i ? "border-gold-400 bg-emerald-400 shadow-glow scale-125" : "border-white/30 bg-charcoal-900"}`} />
            <div className={`glass glow-edge w-full p-8 transition-opacity duration-700 ${active === i ? "opacity-100" : "opacity-40"}`}>
              <div className="relative mb-5 h-28 overflow-hidden rounded-xl">
                <Image src={s.img} alt={`${s.t} stage`} fill sizes="(min-width: 768px) 400px, 90vw" style={{ objectPosition: s.pos }} className={`object-cover transition-transform duration-1000 ease-expo ${active === i ? "scale-110" : "scale-100"}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 to-transparent" />
              </div>
              <div className={`mb-4 text-emerald-400 ${i % 2 ? "" : "md:flex md:justify-end"}`}><Icon i={i} active={active >= i} /></div>
              <p className="eyebrow">0{i + 1}</p>
              <h3 className="mt-2 font-display text-4xl">{s.t}</h3>
              <p className="mt-3 text-ivory/65">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
