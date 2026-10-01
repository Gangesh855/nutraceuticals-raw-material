"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const VEINS = ["M100 180 L100 20", "M100 140 Q70 125 45 100", "M100 140 Q130 125 155 100", "M100 105 Q75 90 55 65", "M100 105 Q125 90 145 65", "M100 70 Q85 58 72 42", "M100 70 Q115 58 128 42"];

export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    let p = 0, raf = 0, loaded = document.readyState === "complete";
    const onLoad = () => { loaded = true; };
    window.addEventListener("load", onLoad);
    const step = () => {
      // ease toward 90 while loading, then finish
      p += (loaded ? 3 : Math.max(0.15, (90 - p) * 0.03));
      if (p >= 100) { setPct(100); setTimeout(() => setDone(true), 500); return; }
      setPct(Math.floor(p));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("load", onLoad); };
  }, []);

  useEffect(() => {
    if (!done) return;
    document.documentElement.style.overflow = "";
    (window as unknown as { __gkReady?: boolean }).__gkReady = true;
    window.dispatchEvent(new Event("gk:ready")); // tells the hero it can start its opening sequence
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-charcoal-950"
          exit={{ clipPath: "circle(0% at 50% 50%)", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
        >
          <svg viewBox="0 0 200 200" className="h-56 w-56" aria-hidden>
            <defs>
              <clipPath id="leaf"><path d="M100 185 C30 150 25 70 100 15 C175 70 170 150 100 185Z" /></clipPath>
              <linearGradient id="fill" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stopColor="#047857" /><stop offset="1" stopColor="#34D399" /></linearGradient>
            </defs>
            <g clipPath="url(#leaf)">
              <rect x="0" width="200" height="200" y={200 - pct * 2} fill="url(#fill)" opacity=".55" />
            </g>
            <path d="M100 185 C30 150 25 70 100 15 C175 70 170 150 100 185Z" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
            {VEINS.map((d, i) => (
              <motion.path key={i} d={d} fill="none" stroke="#F2E2A6" strokeWidth="1" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: Math.min(1, Math.max(0, (pct - i * 8) / 30)) }} transition={{ duration: 0.3 }} />
            ))}
          </svg>
          <div className="mt-8 h-px w-64 bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-gold-400" style={{ width: `${pct}%` }} />
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="mt-6 font-mono text-3xl text-gold-200 tabular-nums">
            {String(pct).padStart(3, "0")}<span className="text-emerald-400">%</span>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1.2 }} className="eyebrow mt-3">GK Botanicals · Pure Botanicals</motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
