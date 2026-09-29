"use client";
import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";

// Placeholder scope — replace with real certificates and validity details before launch.
const CERTS = [
  { code: "GMP", name: "Good Manufacturing Practice", note: "Site quality system" },
  { code: "ISO 9001", name: "Quality Management", note: "Process consistency" },
  { code: "ISO 22000", name: "Food Safety Management", note: "Hazard control" },
  { code: "ORGANIC", name: "Organic Certification", note: "Selected products" },
  { code: "KOSHER · HALAL", name: "Religious dietary compliance", note: "Selected products" },
];

function CertCard({ c }: { c: (typeof CERTS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current!, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(800px) rotateY(${(x - 0.5) * 16}deg) rotateX(${(0.5 - y) * 16}deg)`;
    el.style.setProperty("--mx", `${x * 100}%`); el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--hue", `${x * 360}deg`);
    el.style.setProperty("--holo", "1");
  };
  const leave = () => { const el = ref.current!; el.style.transform = ""; el.style.setProperty("--holo", "0"); };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} data-cursor="view"
      className="glass glow-edge relative overflow-hidden p-8 transition-transform duration-300 ease-out [transform-style:preserve-3d]">
      <div className="pointer-events-none absolute inset-0 mix-blend-color-dodge transition-opacity duration-500"
        style={{ opacity: "calc(var(--holo,0) * .35)", background: "conic-gradient(from var(--hue,0deg) at var(--mx,50%) var(--my,50%), #ff6ec7, #ffd86e, #6effc5, #6ec7ff, #c76eff, #ff6ec7)" }} />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500" style={{ opacity: "var(--holo,0)", background: "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.18), transparent 60%)" }} />
      <div className="relative [transform:translateZ(50px)]">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full border-2 border-gold-400/80 bg-gold-400/10 text-center font-mono text-[11px] font-semibold leading-tight text-gold-200 shadow-gold">{c.code}</div>
        <h3 className="font-display text-2xl">{c.name}</h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ivory/50">{c.note}</p>
      </div>
    </div>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="section py-32">
      <Reveal><p className="eyebrow mb-4">04 / Compliance</p></Reveal>
      <Reveal as="h2" className="h-display mb-16 text-6xl md:text-7xl">Verified. Audited. <span className="italic text-gold-200">Trusted.</span></Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CERTS.map((c, i) => <Reveal key={c.code} delay={i * 0.08}><CertCard c={c} /></Reveal>)}
      </div>
    </section>
  );
}
