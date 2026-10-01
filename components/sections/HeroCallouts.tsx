"use client";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/lib/products";

// Top → bottom, matching the capsule's layers (the capsule fills bottom → top: moringa first, boswellia last).
const ROWS = [
  { slug: "boswellia", y: 24 },
  { slug: "bacopa", y: 33 },
  { slug: "ginger", y: 42 },
  { slug: "turmeric-curcumin", y: 51 },
  { slug: "moringa", y: 60 },
].map((r) => ({ ...r, p: PRODUCTS.find((x) => x.slug === r.slug)! }));

/** Leader-line callouts that name the extract in each layer of the finished capsule (desktop only). */
export default function HeroCallouts({ show }: { show: boolean }) {
  return (
    <ul aria-label="Extracts in the capsule" className="pointer-events-none absolute inset-0 z-[25] m-0 hidden list-none p-0 lg:block">
      {ROWS.map((r, i) => (
        <li key={r.slug} className="absolute left-0 w-full" style={{ top: `${r.y}%` }}>
          <motion.span aria-hidden className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-200/90 bg-charcoal-950/60 shadow-[0_0_10px_rgba(242,226,166,.7)]"
            style={{ left: "74.5%" }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: show ? 1 : 0, opacity: show ? 1 : 0 }} transition={{ delay: show ? 1.2 + i * 0.12 : 0, duration: 0.5 }} />
          <motion.span aria-hidden className="absolute h-px origin-left bg-gradient-to-r from-gold-200/80 to-gold-200/20"
            style={{ left: "75.2%", width: "6.6%" }} initial={{ scaleX: 0 }} animate={{ scaleX: show ? 1 : 0 }} transition={{ delay: show ? 1.3 + i * 0.12 : 0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
          <motion.span className="absolute -translate-y-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[.16em] text-ivory/80"
            style={{ left: "82.4%" }} initial={{ opacity: 0, x: -8 }} animate={{ opacity: show ? 1 : 0, x: show ? 0 : -8 }} transition={{ delay: show ? 1.6 + i * 0.12 : 0, duration: 0.7 }}>
            <span className="text-gold-200">{r.p.name.split(" / ")[0]}</span> — {r.p.marker}
          </motion.span>
        </li>
      ))}
    </ul>
  );
}
