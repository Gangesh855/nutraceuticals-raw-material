"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import HeroBackdrop from "@/components/sections/HeroBackdrop";
import HeroIntro from "@/components/sections/HeroIntro";
import HeroCallouts from "@/components/sections/HeroCallouts";
import { makeSeq } from "@/lib/heroSeq";
import { PRODUCTS } from "@/lib/products";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

// The botanicals shown in the hero loop (order = playback order).
const SLIDE_SLUGS = ["moringa", "ashwagandha", "turmeric-curcumin", "bacopa", "ginger", "boswellia"];
const SLIDES = SLIDE_SLUGS.map((s) => PRODUCTS.find((p) => p.slug === s)!);
const SLIDE_MS = 7000;
const WORDS = ["Pure", "Botanicals,", "Precision", "Manufacturing."];
const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const seq = useRef(makeSeq(false));
  const [phase, setPhase] = useState<"pending" | "intro" | "done">("pending");
  const [reveal, setReveal] = useState(false);
  const [show3d, setShow3d] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(true);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const bgX = useTransform(mx, (v) => v * -16), bgY = useTransform(my, (v) => v * -10);
  const panelX = useTransform(mx, (v) => v * 14), panelY = useTransform(my, (v) => v * 10);

  // Decide how to start: skip the opening for reduced motion or repeat visits, otherwise wait for the preloader.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("gkIntro") === "1";
    setAuto(!reduce); setMobile(window.matchMedia("(max-width: 767px)").matches);
    const t3d = setTimeout(() => setShow3d(!reduce), 250);
    if (reduce || seen) {
      Object.assign(seq.current, makeSeq(true)); setReveal(true); setPhase("done");
      return () => clearTimeout(t3d);
    }
    const start = () => setPhase((p) => (p === "pending" ? "intro" : p));
    if ((window as unknown as { __gkReady?: boolean }).__gkReady) start();
    else window.addEventListener("gk:ready", start, { once: true });
    const fallback = setTimeout(start, 5000);
    return () => { clearTimeout(t3d); clearTimeout(fallback); window.removeEventListener("gk:ready", start); };
  }, []);

  // The opening sequence: close-ups → streams converge → capsule fills and glows → lab fades to glass → headline → settle.
  useEffect(() => {
    if (phase !== "intro") return;
    const s = seq.current;
    const t = gsap.timeline({
      onComplete: () => { sessionStorage.setItem("gkIntro", "1"); setPhase("done"); },
    });
    t.to(s, { sceneF: 5, duration: 6.25, ease: "none" }, 0)
      .to(s, { capsuleIn: 1, duration: 1.6, ease: "power2.out" }, 4.9)
      .to(s, { stream: 1, duration: 1.2, ease: "power1.in" }, 5.4)
      .to(s, { fill: 1, duration: 4.8, ease: "power1.inOut" }, 5.9)
      .to(s, { glow: 1, duration: 4.8, ease: "power2.in" }, 5.9)
      .to(s, { lab: 0, duration: 1.8, ease: "power2.inOut" }, 9.1)
      .to(s, { veil: 1, duration: 1.8, ease: "power2.inOut" }, 9.1)
      .call(() => setReveal(true), undefined, 11.0)
      .to(s, { stream: 0, duration: 0.9, ease: "power1.out" }, 10.0)
      .to(s, { settle: 1, duration: 1.9, ease: "power3.inOut" }, 9.9);
    tl.current = t;
    if (location.search.includes("seqdebug")) (window as unknown as { __gkTl?: gsap.core.Timeline }).__gkTl = t;
    return () => { t.kill(); };
  }, [phase]);

  const skip = () => { tl.current?.timeScale(9); };

  // Autoplay through the botanicals once the opening has finished; pauses on hover/focus and when the tab is hidden.
  useEffect(() => {
    if (!auto || paused || phase !== "done") return;
    const id = setInterval(() => { if (!document.hidden) setIndex((i) => (i + 1) % SLIDES.length); }, SLIDE_MS);
    return () => clearInterval(id);
  }, [auto, paused, index, phase]);

  const cur = SLIDES[index];
  const shown = reveal || phase === "done";
  const intro = phase === "intro";

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden section pb-20 pt-[20.5rem] md:pb-0 md:pt-28"
      onPointerMove={(e) => { mx.set(e.clientX / window.innerWidth - 0.5); my.set(e.clientY / window.innerHeight - 0.5); }}>
      <motion.div style={{ x: bgX, y: bgY, scale: 1.04 }} className="absolute inset-0 -z-20">
        <HeroBackdrop slides={SLIDES} index={index} />
      </motion.div>

      {/* Opening sequence: close-ups of materials being processed (lab look) */}
      {intro && <HeroIntro seq={seq} />}

      {/* WebGL: extract streams, the large filling capsule, floating accents */}
      <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>{show3d && <HeroScene seq={seq} mobile={mobile} />}</div>

      <HeroCallouts show={shown} />

      <div className="relative z-10 max-w-4xl">
        <motion.p className="eyebrow mb-6" initial={{ opacity: 0 }} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: 1 }}>GK Botanicals · Extract Manufacturer</motion.p>
        {/* Headline stays in the DOM from first paint (crawlable); only its visual reveal is animated */}
        <h1 className="h-display text-[13vw] md:text-[7.5vw] lg:text-[5.4vw]">
          {WORDS.map((w, i) => (
            <span key={w}>
              <span className="inline-block overflow-hidden align-bottom pr-[.25em]">
                <motion.span className={`inline-block ${i === 2 ? "italic text-gold-200" : ""}`} initial={{ y: "110%" }} animate={{ y: shown ? 0 : "110%" }} transition={{ duration: 1.2, delay: shown ? i * 0.12 : 0, ease: EASE }}>{w}</motion.span>
              </span>{" "}
              {i === 1 && <br className="hidden lg:block" />}
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 20 }} transition={{ delay: shown ? 0.7 : 0, duration: 1 }} className="mt-8 max-w-xl text-lg text-ivory/75">
          Standardised extracts. Full traceability. Compliance built into every batch — for the world&apos;s leading nutraceutical brands.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: shown ? 1 : 0 }} transition={{ delay: shown ? 1 : 0, duration: 1 }} className={`mt-10 flex flex-wrap items-center gap-6 ${shown ? "" : "pointer-events-none"}`}>
          <MagneticButton href="/#products" variant="gold">Explore Extracts →</MagneticButton>
          <MagneticButton href="/#manufacturing" variant="ghost">See the process</MagneticButton>
        </motion.div>
      </div>

      {/* Compact glass panel: the botanical currently featured */}
      <motion.aside
        style={{ x: panelX, y: panelY }}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 30 }} transition={{ delay: shown ? 1.2 : 0, duration: 1.1 }}
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
        aria-label="Featured botanical"
        className={`glass glow-edge absolute bottom-10 right-6 z-30 hidden w-[21rem] p-5 lg:block xl:right-20 ${shown ? "" : "pointer-events-none"}`}
      >
        <p className="eyebrow">Now featuring</p>
        <AnimatePresence mode="wait">
          <motion.div key={cur.slug} initial={{ opacity: 0, y: 12, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(6px)" }} transition={{ duration: 0.5 }}>
            <h2 className="mt-1.5 font-display text-3xl leading-none">{cur.name}</h2>
                        <dl className="mt-3 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between gap-4"><dt className="text-ivory/50">Marker</dt><dd className="text-right text-gold-200">{cur.marker}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ivory/50">Spec</dt><dd className="text-right text-gold-200">{cur.spec}</dd></div>
            </dl>
            <Link href={`/products/${cur.slug}`} className="mt-2 inline-block py-2 font-mono text-[11px] uppercase tracking-[.2em] text-emerald-400 transition-colors hover:text-gold-200">View spec sheet →</Link>
          </motion.div>
        </AnimatePresence>
        <div className="mt-1 flex gap-1.5" role="tablist" aria-label="Choose botanical">
          {SLIDES.map((s, i) => (
            <button key={s.slug} role="tab" aria-selected={i === index} aria-label={s.name} onClick={() => setIndex(i)} className="group relative h-6 flex-1">
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded bg-white/15">
                <span className="block h-full origin-left rounded bg-gold-400"
                  style={i < index ? { transform: "scaleX(1)" } : i === index ? { transform: "scaleX(1)", animation: auto && !paused && phase === "done" ? `fill ${SLIDE_MS}ms linear` : undefined } : { transform: "scaleX(0)" }} />
              </span>
            </button>
          ))}
        </div>
      </motion.aside>

      {intro && (
        <button type="button" onClick={skip} className="absolute right-6 top-24 z-40 rounded-full border border-white/20 bg-black/30 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[.2em] text-ivory/80 backdrop-blur-md transition-colors hover:text-gold-200 md:right-12 lg:right-20">
          Skip intro
        </button>
      )}
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-[.3em] text-ivory/40 md:block">Scroll ↓</div>
    </section>
  );
}
