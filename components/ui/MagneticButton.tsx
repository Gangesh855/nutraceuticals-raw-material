"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

type Props = { href: string; children: React.ReactNode; variant?: "emerald" | "gold" | "ghost"; className?: string };

export default function MagneticButton({ href, children, variant = "emerald", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const tx = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const ty = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * 0.35); y.set(dy * 0.35); tx.set(dx * 0.15); ty.set(dy * 0.15);
  };
  const reset = () => { x.set(0); y.set(0); tx.set(0); ty.set(0); };

  const styles = {
    emerald: "bg-emerald-500/20 border-emerald-400/60 text-ivory shadow-glow hover:bg-emerald-500/35",
    gold: "bg-gold-400/15 border-gold-400/70 text-gold-200 shadow-gold hover:bg-gold-400/30",
    ghost: "border-white/20 text-ivory hover:bg-white/10",
  }[variant];

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className="inline-block p-6 -m-6">
      <motion.div style={{ x, y }}>
        <Link href={href} className={`inline-flex items-center gap-3 rounded-full border px-8 py-4 font-mono text-xs uppercase tracking-[.2em] backdrop-blur-md transition-colors duration-500 ${styles} ${className}`}>
          <motion.span style={{ x: tx, y: ty }} className="inline-flex items-center gap-3">{children}</motion.span>
        </Link>
      </motion.div>
    </div>
  );
}
