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
      {/* leaf shadows swaying across the scene, as sunlight filters through foliage */}
      <svg className="leaf-shadow" viewBox="0 0 100 60" preserveAspectRatio="xMaxYMin slice" aria-hidden>
        {[[78, 6, 40, -24], [90, 14, 34, 18], [66, 16, 30, -48], [84, 30, 44, 8], [96, 4, 26, 62], [58, 4, 28, 30], [74, 38, 30, -14]].map(([x, y, l, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${l / 40})`}>
            <path d="M0 0 C 14 -11 34 -11 48 0 C 34 11 14 11 0 0Z" />
            <path d="M0 0 L48 0" stroke="rgba(0,0,0,.0)" />
          </g>
        ))}
      </svg>
      {/* legibility + depth */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,7,.88)_0%,rgba(5,8,7,.5)_42%,rgba(5,8,7,.1)_75%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,8,7,.95)_0%,transparent_38%),linear-gradient(to_bottom,rgba(5,8,7,.6)_0%,transparent_22%)]" />
    </div>
  );
}
