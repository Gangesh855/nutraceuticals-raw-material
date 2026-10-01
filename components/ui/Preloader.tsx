"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Leaf outline + midrib + veins. Each path draws itself as the percentage rises, then the leaf fills from the base.
const OUTLINE = "M100 186 C26 150 22 66 100 14 C178 66 174 150 100 186Z";
const VEINS = [
  "M100 186 L100 22",
  "M100 150 Q72 136 44 108", "M100 150 Q128 136 156 108",
  "M100 118 Q76 104 54 78", "M100 118 Q124 104 146 78",
  "M100 86 Q86 74 72 54", "M100 86 Q114 74 128 54",
];

export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    let p = 0, raf = 0, loaded = document.readyState === "complete";
    const onLoad = () => { loaded = true; };
    window.addEventListener("load", onLoad);
    const step = () => {
      // ease toward 90 while the page loads, then finish
      p += loaded ? 2.4 : Math.max(0.12, (90 - p) * 0.025);
      if (p >= 100) { setPct(100); setTimeout(() => setDone(true), 600); return; }
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

  const draw = Math.min(1, pct / 55); // outline completes by ~55 %
  const fill = Math.max(0, (pct - 35) / 65); // fill rises from 35 % to 100 %

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          role="status" aria-label="Loading"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-charcoal-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.1, ease: [0.4, 0, 0.2, 1] } }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_36%_at_50%_44%,rgba(16,185,129,.14),transparent)]" />
          <svg viewBox="0 0 200 200" className="relative h-44 w-44" aria-hidden>
            <defs>
              <clipPath id="leaf"><path d={OUTLINE} /></clipPath>
              <linearGradient id="fill" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stopColor="#047857" stopOpacity=".85" /><stop offset="1" stopColor="#34D399" stopOpacity=".55" /></linearGradient>
            </defs>
            <g clipPath="url(#leaf)"><rect x="0" width="200" height="200" y={200 - fill * 190} fill="url(#fill)" /></g>
            <motion.path d={OUTLINE} fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: draw }} />
            {VEINS.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#F2E2A6" strokeOpacity=".85" strokeWidth=".9" strokeLinecap="round"
                pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, Math.max(0, (pct - 12 - i * 6) / 34))} />
            ))}
          </svg>
          <div className="relative mt-10 h-px w-56 overflow-hidden bg-white/10">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-gold-400" style={{ width: `${pct}%` }} />
          </div>
          <div className="relative mt-5 text-2xl font-extralight tabular-nums tracking-wide text-ivory">{pct}<span className="ml-0.5 text-sm text-gold-400">%</span></div>
          <p className="eyebrow relative mt-4 text-[10px]">GK Botanicals</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
