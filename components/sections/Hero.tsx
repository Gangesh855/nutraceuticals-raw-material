"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import HeroBackdrop from "@/components/sections/HeroBackdrop";
import HeroIntro from "@/components/sections/HeroIntro";
import { makeSeq } from "@/lib/heroSeq";
import { webglOK } from "@/components/three/SafeCanvas";
import { PRODUCTS } from "@/lib/products";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

// The botanicals shown in the hero loop (order = playback order).
const SLIDE_SLUGS = ["moringa", "ashwagandha", "turmeric-curcumin", "bacopa", "ginger", "boswellia"];
const SLIDES = SLIDE_SLUGS.map((s) => PRODUCTS.find((p) => p.slug === s)!);
const WORDS = ["Pure", "Botanicals,", "Precision", "Manufacturing."];
const SECTORS = ["Pharmaceuticals", "Nutraceuticals", "Cosmetics", "Food & Beverages"];
const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const seq = useRef(makeSeq(false));
  const [phase, setPhase] = useState<"pending" | "intro" | "done">("pending");
  const [reveal, setReveal] = useState(false);
  const [show3d, setShow3d] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [glOk, setGlOk] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Decide how to start: skip the opening for reduced motion or repeat visits, otherwise wait for the preloader.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("gkIntro") === "1"; } catch { /* storage blocked: treat as first visit */ }
    const gl = webglOK(); setGlOk(gl);
    const noGL = !gl; // the sequence is built around the 3D capsule; without WebGL show the finished hero straight away
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    const t3d = setTimeout(() => setShow3d(!reduce), 250);
    // The opening sequence plays on the first visit of a session; repeat visits go straight to the finished hero.
    // NEXT_PUBLIC_HERO_INTRO=0 turns it off for everyone; ?intro replays it.
    const replay = new URLSearchParams(window.location.search).has("intro");
    const off = process.env.NEXT_PUBLIC_HERO_INTRO === "0";
    if (reduce || noGL || off || (seen && !replay)) {
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
      onComplete: () => { try { sessionStorage.setItem("gkIntro", "1"); } catch { /* ignore */ } setPhase("done"); },
    });
    t.to(s, { sceneF: 5, duration: 5.75, ease: "none" }, 0)
      .to(s, { capsuleIn: 1, duration: 1.8, ease: "power2.out" }, 4.6)
      .to(s, { stream: 1, duration: 1.4, ease: "power1.inOut" }, 5.0)
      .to(s, { fill: 1, duration: 4.8, ease: "power2.inOut" }, 5.4)
      .to(s, { glow: 1, duration: 4.8, ease: "power2.in" }, 5.4)
      .to(s, { lab: 0, duration: 2.0, ease: "power2.inOut" }, 9.4)
      .to(s, { veil: 1, duration: 2.0, ease: "power2.inOut" }, 9.4)
      .call(() => setReveal(true), undefined, 11.4)
      .to(s, { stream: 0, duration: 1.0, ease: "power1.out" }, 10.0)
      .to(s, { settle: 1, duration: 2.2, ease: "power3.inOut" }, 10.2);
    tl.current = t;
    if (location.search.includes("seqdebug")) (window as unknown as { __gkTl?: gsap.core.Timeline }).__gkTl = t;
    return () => { t.kill(); };
  }, [phase]);

  const skip = () => { tl.current?.timeScale(9); };

  const shown = reveal || phase === "done";
  const intro = phase === "intro";

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-end overflow-hidden section pb-16 pt-[22rem] md:items-center md:pb-0 md:pt-28">
      <div className="absolute inset-0 -z-20"><HeroBackdrop slides={SLIDES} index={0} /></div>

      {/* The finished hero: a sage panel that opens like an iris from the capsule, with a soft out-of-focus botanical behind it */}
      <motion.div aria-hidden className="absolute inset-x-0 top-0 bottom-0 -z-10 overflow-hidden rounded-b-[2rem] md:rounded-b-[3rem]"
        style={{ background: "radial-gradient(70% 80% at 62% 38%, #b9c0b8 0%, #a7aea6 55%, #98a097 100%)" }}
        initial={{ clipPath: "circle(0% at 68% 50%)" }} animate={{ clipPath: shown ? "circle(150% at 68% 50%)" : "circle(0% at 68% 50%)" }} transition={{ duration: 2.4, ease: [0.65, 0, 0.2, 1] }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/moringa.webp" alt="" className="kb absolute inset-0 h-full w-full scale-110 object-cover opacity-[.15] mix-blend-multiply blur-[14px]" />
        <div className="sun-shafts absolute inset-0 opacity-60 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgba(26,36,28,.38)_100%)]" />
        {/* one slow sweep of light as the hero lands */}
        <motion.div className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          initial={{ x: "-40%" }} animate={{ x: shown ? "460%" : "-40%" }} transition={{ duration: 3.2, delay: 1.2, ease: "easeInOut" }} />
      </motion.div>

      {/* Cinematic letterbox: bars part as the opening plays and fully clear when the headline arrives */}
      {intro && <>
        <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[35] bg-black" initial={{ height: "11vh" }} animate={{ height: shown ? 0 : "7vh" }} transition={{ duration: shown ? 1.6 : 6, ease: "easeInOut" }} />
        <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[35] bg-black" initial={{ height: "11vh" }} animate={{ height: shown ? 0 : "7vh" }} transition={{ duration: shown ? 1.6 : 6, ease: "easeInOut" }} />
      </>}

      {/* Opening sequence: close-ups of materials being processed (lab look) */}
      {intro && <HeroIntro seq={seq} />}

      {/* WebGL: the large capsule (clear while filling, matte and split once settled) */}
      <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>{show3d && <HeroScene seq={seq} mobile={mobile} />}</div>

      <div className="relative z-30 max-w-2xl md:pb-24 md:pt-24">
        <motion.span className="mb-5 inline-block rounded-full bg-[#d6f5a8] px-2.5 py-1 text-[11px] font-medium text-[#1d3a12]" initial={{ opacity: 0 }} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: 1 }}>
          Extract manufacturer
        </motion.span>
        {/* Headline stays in the DOM from first paint (crawlable); only its visual reveal is animated */}
        <h1 className="font-sans text-[9vw] font-light leading-[1.08] tracking-[-0.025em] text-white md:text-[3.3vw] lg:text-[3.4vw]">
          {WORDS.map((w, i) => (
            <span key={w}>
              <span className="inline-block overflow-hidden align-bottom pr-[.2em]">
                <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: shown ? 0 : "110%" }} transition={{ duration: 1.2, delay: shown ? i * 0.12 : 0, ease: EASE }}>{w}</motion.span>
              </span>{" "}
              {i === 1 && <br className="hidden md:block" />}
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 20 }} transition={{ delay: shown ? 0.7 : 0, duration: 1 }} className="mt-5 max-w-md text-[15px] leading-relaxed text-white/80">
          We produce concentrated plant-derived ingredients used in pharmaceuticals, nutraceuticals, cosmetics, and food &amp; beverages — standardised, traceable, compliant.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: shown ? 1 : 0 }} transition={{ delay: shown ? 1 : 0, duration: 1 }} className={`mt-8 flex flex-wrap items-center gap-3 ${shown ? "" : "pointer-events-none"}`}>
          <a href="/#products" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#1f2a1f] transition-transform hover:scale-[1.03]">Explore extracts</a>
          <a href="/#manufacturing" className="rounded-full px-5 py-3 text-sm font-medium text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline">See the process →</a>
        </motion.div>
        <motion.ul aria-label="Industries we serve" initial={{ opacity: 0, y: 12 }} animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 12 }} transition={{ delay: shown ? 1.3 : 0, duration: 1 }} className="mt-8 flex flex-wrap gap-2">
          {SECTORS.map((x) => <li key={x} className="rounded-full border border-white/35 px-3 py-1 text-[11px] font-medium tracking-wide text-white/85">{x}</li>)}
        </motion.ul>
      </div>

      {intro && (
        <button type="button" onClick={skip} className="absolute right-6 top-24 z-40 rounded-full border border-white/20 bg-black/30 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[.2em] text-ivory/80 backdrop-blur-md transition-colors hover:text-gold-200 md:right-12 lg:right-20">
          Skip intro
        </button>
      )}
    </section>
  );
}
