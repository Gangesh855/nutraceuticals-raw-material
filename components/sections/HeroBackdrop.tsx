"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";

type Props = { slides: Product[]; index: number };

/**
 * Full-bleed hero background: one layer per botanical, cross-faded.
 *
 * Real footage: drop `public/video/<slug>.mp4` (+ optional `.webm`) and set NEXT_PUBLIC_HERO_VIDEO=1.
 * Until then each layer shows its still photograph with a slow Ken Burns move. Video is skipped on small screens,
 * with reduced motion, or when the browser asks to save data.
 */
export default function HeroBackdrop({ slides, index }: Props) {
  const [useVideo, setUseVideo] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const small = window.matchMedia("(max-width: 767px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setUseVideo(process.env.NEXT_PUBLIC_HERO_VIDEO === "1" && !small && !reduce && !nav.connection?.saveData);
  }, []);

  useEffect(() => {
    refs.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
    });
  }, [index, useVideo]);

  return (
    <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden bg-charcoal-950">
      {slides.map((s, i) => (
        <div key={s.slug} className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out" style={{ opacity: i === index ? 1 : 0 }}>
          <Image src={s.image} alt="" fill priority={i === 0} sizes="100vw" style={{ objectPosition: s.imagePos }}
            className="kb object-cover opacity-70 blur-[1.5px] saturate-[1.15] contrast-[1.05]" />
          {useVideo && !failed[s.slug] && (
            <video ref={(el) => { refs.current[i] = el; }} muted loop playsInline preload={i === 0 ? "auto" : "metadata"}
              className="absolute inset-0 h-full w-full object-cover saturate-[1.1] contrast-[1.05]">
              <source src={`/video/${s.slug}.webm`} type="video/webm" />
              {/* error events fire on <source>, not <video>; the last source failing means no usable clip → keep the still image */}
              <source src={`/video/${s.slug}.mp4`} type="video/mp4" onError={() => setFailed((f) => ({ ...f, [s.slug]: true }))} />
            </video>
          )}
        </div>
      ))}
      {/* Cinematic lighting */}
      <div className="golden-glow" />
      <div className="sun-shafts" />
      <div className="dapple" />
      {/* legibility + depth */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,7,.88)_0%,rgba(5,8,7,.5)_42%,rgba(5,8,7,.1)_75%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,8,7,.95)_0%,transparent_38%),linear-gradient(to_bottom,rgba(5,8,7,.6)_0%,transparent_22%)]" />
    </div>
  );
}
