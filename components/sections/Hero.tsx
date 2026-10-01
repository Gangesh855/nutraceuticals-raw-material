"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import HeroBackdrop from "@/components/sections/HeroBackdrop";
import { PRODUCTS } from "@/lib/products";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

// The botanicals shown in the hero loop (order = playback order).
const SLIDE_SLUGS = ["moringa", "ashwagandha", "turmeric-curcumin", "bacopa", "ginger", "boswellia"];
const SLIDES = SLIDE_SLUGS.map((s) => PRODUCTS.find((p) => p.slug === s)!);
const SLIDE_MS = 7000;

export default function Hero() {
  const [show3d, setShow3d] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(true);
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const bgX = useTransform(mx, (v) => v * -16), bgY = useTransform(my, (v) => v * -10);
  const panelX = useTransform(mx, (v) => v * 14), panelY = useTransform(my, (v) => v * 10);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAuto(!reduce);
    const t = setTimeout(() => setShow3d(!reduce), 300);
    return () => clearTimeout(t);
  }, []);

  // Autoplay through the botanicals; pauses on hover/focus and when the tab is hidden.
  useEffect(() => {
    if (!auto || paused) return;
    timer.current = setInterval(() => { if (!document.hidden) setIndex((i) => (i + 1) % SLIDES.length); }, SLIDE_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [auto, paused, index]);

  const cur = SLIDES[index];
  const words = ["Pure", "Botanicals,", "Precision", "Manufacturing."];

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden section pb-24 pt-28 md:pb-0"
      onPointerMove={(e) => { mx.set(e.clientX / window.innerWidth - 0.5); my.set(e.clientY / window.innerHeight - 0.5); }}>
      <motion.div style={{ x: bgX, y: bgY, scale: 1.04 }} className="absolute inset-0 -z-20">
        <HeroBackdrop slides={SLIDES} index={index} />
      </motion.div>

      {/* Foreground 3D: translucent capsules, softgels and extract droplets floating in front of the glass panel */}
      <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>{show3d && <HeroScene />}</div>

      <div className="relative z-10 max-w-4xl">
        <p className="eyebrow mb-6">GK Botanicals · Extract Manufacturer</p>
        <h1 className="h-display text-[13vw] md:text-[7.5vw] lg:text-[6.6vw]">
          {words.map((w, i) => (
            <span key={w} className="inline-block overflow-hidden align-bottom pr-[.25em]">
              <motion.span className={`inline-block ${i === 2 ? "italic text-gold-200" : ""}`} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 2.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: 1 }} className="mt-8 max-w-xl text-lg text-ivory/75">
          Standardised extracts. Full traceability. Compliance built into every batch — for the world&apos;s leading nutraceutical brands.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.3, duration: 1 }} className="mt-10 flex flex-wrap items-center gap-6">
          <MagneticButton href="/#products" variant="gold">Explore Extracts →</MagneticButton>
          <MagneticButton href="/#manufacturing" variant="ghost">See the process</MagneticButton>
        </motion.div>
      </div>

      {/* Glass panel: what's on screen right now */}
      <motion.aside
        style={{ x: panelX, y: panelY }}
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1 }} transition={{ delay: 3.4, duration: 1.2 }}
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
        aria-label="Featured botanical"
        className="glass glow-edge absolute right-6 top-1/2 z-10 hidden w-[21rem] -translate-y-1/2 p-7 lg:block xl:right-20 xl:w-[23rem]"
      >
        <p className="eyebrow">Now featuring</p>
        <AnimatePresence mode="wait">
          <motion.div key={cur.slug} initial={{ opacity: 0, y: 14, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(6px)" }} transition={{ duration: 0.6 }}>
            <h2 className="mt-3 font-display text-5xl leading-none">{cur.name}</h2>
            <p className="mt-2 font-mono text-[11px] italic text-ivory/55">{cur.latin}</p>
            <dl className="mt-6 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between gap-4"><dt className="text-ivory/50">Marker</dt><dd className="text-right text-gold-200">{cur.marker}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ivory/50">Spec</dt><dd className="text-right text-gold-200">{cur.spec}</dd></div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {cur.benefits.map((b) => <span key={b} className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-ivory/80">{b}</span>)}
            </div>
            <Link href={`/products/${cur.slug}`} className="mt-6 inline-block py-2 font-mono text-[11px] uppercase tracking-[.2em] text-emerald-400 transition-colors hover:text-gold-200">View spec sheet →</Link>
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 flex gap-1.5" role="tablist" aria-label="Choose botanical">
          {SLIDES.map((s, i) => (
            <button key={s.slug} role="tab" aria-selected={i === index} aria-label={s.name} onClick={() => setIndex(i)} className="group relative h-6 flex-1">
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded bg-white/15">
                <span className="block h-full origin-left rounded bg-gold-400"
                  style={i < index ? { transform: "scaleX(1)" } : i === index ? { transform: "scaleX(1)", animation: auto && !paused ? `fill ${SLIDE_MS}ms linear` : undefined } : { transform: "scaleX(0)" }} />
              </span>
            </button>
          ))}
        </div>
      </motion.aside>

      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-[.3em] text-ivory/40 md:block">Scroll ↓</div>
    </section>
  );
}
