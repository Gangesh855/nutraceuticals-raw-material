"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const STATS = [
  { k: "95%", v: "Curcuminoids by HPLC" },
  { k: "100%", v: "Batches shipped with a COA" },
  { k: "60+", v: "Countries served" },
];

export default function Hero() {
  const [show3d, setShow3d] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const bgX = useTransform(mx, (v) => v * -20), bgY = useTransform(my, (v) => v * -20);
  const fgX = useTransform(mx, (v) => v * 30), fgY = useTransform(my, (v) => v * 20);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setShow3d(!reduce), 300);
    return () => clearTimeout(t);
  }, []);

  const words = ["Pure", "Botanicals,", "Precision", "Manufacturing."];

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden section pb-24 pt-28 md:pb-0"
      onPointerMove={(e) => { mx.set(e.clientX / window.innerWidth - 0.5); my.set(e.clientY / window.innerHeight - 0.5); }}>
      <motion.div style={{ x: bgX, y: bgY }} className="pointer-events-none absolute -inset-10 bg-[radial-gradient(60%_50%_at_70%_45%,rgba(16,185,129,.22),transparent),radial-gradient(40%_40%_at_20%_80%,rgba(212,175,55,.10),transparent)]" />
      <div className="absolute inset-0 opacity-90" aria-hidden>{show3d && <HeroScene />}</div>
      <div className="relative z-10 max-w-4xl">
        <p className="eyebrow mb-6">GK Botanicals · Extract Manufacturer</p>
        <h1 className="h-display text-[13vw] md:text-[8vw]">
          {words.map((w, i) => (
            <span key={w} className="inline-block overflow-hidden align-bottom pr-[.25em]">
              <motion.span className={`inline-block ${i === 2 ? "italic text-gold-200" : ""}`} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 2.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: 1 }} className="mt-8 max-w-xl text-lg text-ivory/70">
          Standardised extracts. Full traceability. Compliance built into every batch — for the world&apos;s leading nutraceutical brands.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.3, duration: 1 }} className="mt-10 flex flex-wrap items-center gap-6">
          <MagneticButton href="/#products" variant="gold">Explore Extracts →</MagneticButton>
          <MagneticButton href="/#manufacturing" variant="ghost">See the process</MagneticButton>
        </motion.div>
      </div>
      <motion.div style={{ x: fgX, y: fgY }} className="absolute bottom-16 right-6 z-10 hidden gap-4 lg:flex xl:right-20">
        {STATS.map((s, i) => (
          <motion.div key={s.v} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.4 + i * 0.15, duration: 1 }} className="glass glow-edge w-44 p-5" style={{ marginTop: i * 24 }}>
            <div className="font-display text-4xl text-gold-200">{s.k}</div>
            <div className="mt-1 text-xs text-ivory/60">{s.v}</div>
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 font-mono md:block text-[10px] uppercase tracking-[.3em] text-ivory/40">Scroll ↓</div>
    </section>
  );
}
