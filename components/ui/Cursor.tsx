"use client";
import { useEffect, useRef, useState } from "react";

type Mode = "default" | "link" | "drag" | "view";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");
    let x = 0, y = 0, rx = 0, ry = 0, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement | null;
      const c = t?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor as Mode | undefined;
      setMode(c ?? (t?.closest("a,button,input,textarea") ? "link" : "default"));
    };
    const loop = () => {
      rx += (x - rx) * 0.15; ry += (y - ry) * 0.15;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;
  const size = mode === "default" ? 36 : mode === "link" ? 64 : 84;
  const label = mode === "drag" ? "DRAG" : mode === "view" ? "VIEW" : "";
  return (
    <>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[100]">
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/70 flex items-center justify-center font-mono text-[10px] tracking-widest text-gold-200 transition-all duration-500 ease-expo"
          style={{ width: size, height: size, background: mode === "default" ? "transparent" : "rgba(16,185,129,.15)", backdropFilter: mode === "default" ? undefined : "blur(4px)" }}
        >{label}</div>
      </div>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100]">
        <div className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-gold-400 transition-opacity" style={{ opacity: mode === "default" ? 1 : 0 }} />
      </div>
    </>
  );
}
