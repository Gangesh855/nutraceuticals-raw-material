"use client";
import { useEffect, useRef } from "react";
import type { Seq } from "@/lib/heroSeq";

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };
type Drop = { x: number; y: number; r: number; max: number; born: number; slide: number };

/**
 * 2D extraction effects drawn over the close-ups, one per material:
 * 0 powder being ground · 1 golden powder pouring · 2 droplets condensing on glass · 3 oil separating from water · 4 golden liquid filtering through glass tubes.
 */
type Ctx = CanvasRenderingContext2D;
// roundRect is missing in older Safari/Firefox; fall back to a plain rectangle
const rrect = (c: Ctx, x: number, y: number, w: number, h: number, r: number | number[]) => {
  if (typeof (c as Ctx & { roundRect?: unknown }).roundRect === "function") c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h);
};

export default function IntroFX({ seq }: { seq: React.MutableRefObject<Seq> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0, last = performance.now(), scene = -1, clock = 0;
    let parts: P[] = [], drops: Drop[] = [], bubbles: P[] = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(c);
    const glowDot = (x: number, y: number, r: number, rgb: string, a: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    };
    const spawn = (n: number, f: () => P) => { for (let i = 0; i < n && parts.length < 420; i++) parts.push(f()); };
    const step = (dt: number, gy: number) => {
      parts = parts.filter((p) => (p.life += dt) < p.max);
      for (const p of parts) { p.vy += gy * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.995; }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt;
      const s = seq.current;
      ctx.clearRect(0, 0, w, h);
      if (s.lab < 0.02) return;
      const f = s.sceneF, idx = Math.min(4, Math.floor(Math.max(0, f))), u = f >= 5 ? 1 : f - Math.floor(f);
      if (idx !== scene) { scene = idx; parts = []; drops = []; bubbles = []; }
      const fade = Math.min(1, u / 0.12, idx === 4 ? 1 : (1 - u) / 0.12) * s.lab;
      ctx.globalAlpha = Math.max(0, fade);
      const m = Math.min(w, h);

      if (idx === 0) { // powder ground: green dust blooming from the centre
        spawn(Math.round(160 * dt), () => ({ x: w * 0.5 + (Math.random() - 0.5) * m * 0.2, y: h * 0.62, vx: (Math.random() - 0.5) * m * 0.5, vy: -Math.random() * m * 0.45, life: 0, max: 1.4 + Math.random(), r: m * (0.02 + Math.random() * 0.05) }));
        step(dt, m * 0.12);
        ctx.globalCompositeOperation = "lighter";
        for (const p of parts) glowDot(p.x, p.y, p.r, "150,230,110", 0.28 * (1 - p.life / p.max));
        glowDot(w * 0.5, h * 0.64, m * 0.28, "120,210,100", 0.12 + 0.1 * Math.sin(clock * 6));
      } else if (idx === 1) { // golden powder pouring
        spawn(Math.round(220 * dt), () => ({ x: w * 0.5 + Math.sin(clock * 2) * m * 0.03 + (Math.random() - 0.5) * m * 0.05, y: -10, vx: (Math.random() - 0.5) * 30, vy: m * (0.5 + Math.random() * 0.4), life: 0, max: 2.2, r: m * (0.008 + Math.random() * 0.016) }));
        step(dt, m * 0.4);
        parts = parts.filter((p) => p.y < h * 0.74);
        ctx.globalCompositeOperation = "lighter";
        for (const p of parts) glowDot(p.x, p.y, p.r * 2.2, "255,190,70", 0.5);
        const pile = Math.min(1, u * 1.2);
        glowDot(w * 0.5, h * 0.76, m * (0.18 + 0.34 * pile), "255,170,50", 0.2 + 0.2 * pile);
      } else if (idx === 2) { // droplets condensing on glass
        while (drops.length < Math.min(70, u * 110)) drops.push({ x: Math.random() * w, y: Math.random() * h, r: 0, max: m * (0.008 + Math.random() * 0.03), born: clock, slide: Math.random() < 0.14 ? 1 : 0 });
        ctx.globalCompositeOperation = "source-over";
        for (const d of drops) {
          d.r = Math.min(d.max, d.r + dt * d.max * 0.9);
          if (d.slide && d.r >= d.max * 0.98) { d.y += dt * m * 0.18; ctx.strokeStyle = "rgba(220,240,230,.07)"; ctx.lineWidth = d.r * 0.5; ctx.beginPath(); ctx.moveTo(d.x, d.y - m * 0.06); ctx.lineTo(d.x, d.y); ctx.stroke(); }
          const g = ctx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.35, d.r * 0.1, d.x, d.y, d.r);
          g.addColorStop(0, "rgba(235,250,240,.36)"); g.addColorStop(0.7, "rgba(190,225,205,.10)"); g.addColorStop(1, "rgba(10,25,18,.32)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.beginPath(); ctx.arc(d.x - d.r * 0.38, d.y - d.r * 0.42, d.r * 0.2, 0, Math.PI * 2); ctx.fill();
        }
      } else if (idx === 3) { // oil separating from water
        const top = h * 0.5, bot = h * 0.92, split = top + (bot - top) * (0.68 - 0.34 * Math.min(1, u * 1.25));
        const wavy = (x: number, y0: number, a: number) => y0 + Math.sin(x * 0.012 + clock * 2) * a + Math.sin(x * 0.027 - clock * 1.4) * a * 0.5;
        ctx.globalCompositeOperation = "source-over";
        const water = ctx.createLinearGradient(0, split, 0, bot); water.addColorStop(0, "rgba(120,200,150,.20)"); water.addColorStop(1, "rgba(30,90,70,.34)");
        const oil = ctx.createLinearGradient(0, top, 0, split); oil.addColorStop(0, "rgba(255,200,80,.04)"); oil.addColorStop(1, "rgba(255,190,60,.30)");
        ctx.fillStyle = oil; ctx.beginPath(); ctx.moveTo(0, top);
        for (let x = 0; x <= w; x += 12) ctx.lineTo(x, wavy(x, top, 1.5)); for (let x = w; x >= 0; x -= 12) ctx.lineTo(x, wavy(x, split, 3)); ctx.fill();
        ctx.fillStyle = water; ctx.beginPath(); ctx.moveTo(0, bot);
        for (let x = 0; x <= w; x += 12) ctx.lineTo(x, wavy(x, split, 3)); ctx.lineTo(w, bot); ctx.fill();
        ctx.strokeStyle = "rgba(255,235,170,.55)"; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 0; x <= w; x += 8) ctx[x === 0 ? "moveTo" : "lineTo"](x, wavy(x, split, 3)); ctx.stroke();
        if (Math.random() < dt * 14) bubbles.push({ x: Math.random() * w, y: bot, vx: 0, vy: -m * (0.1 + Math.random() * 0.18), life: 0, max: 99, r: m * (0.004 + Math.random() * 0.012) });
        bubbles = bubbles.filter((b) => b.y > split - m * 0.03);
        for (const b of bubbles) { b.y += b.vy * dt; b.x += Math.sin(clock * 3 + b.r * 99) * 0.4; ctx.strokeStyle = "rgba(255,240,190,.5)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke(); }
      } else { // golden liquid filtering through glass tubes
        const tubes = [0.34, 0.5, 0.66], tw = Math.min(w, h) * 0.085, top = h * 0.16, bot = h * 0.8;
        tubes.forEach((fx, i) => {
          const x = w * fx, k = Math.min(1, Math.max(0, (u * 1.15 - i * 0.12)));
          const lvl = bot - (bot - top - tw) * k * 0.82;
          // a botanical sprig standing in the tube (stem + leaves), as in a lab specimen
          ctx.globalCompositeOperation = "source-over";
          const leaf = i === 1 ? "rgba(120,200,110,.75)" : i === 2 ? "rgba(235,200,90,.7)" : "rgba(90,170,100,.75)";
          ctx.strokeStyle = leaf; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, bot - tw * 0.4); ctx.quadraticCurveTo(x + tw * 0.15, (top + bot) / 2, x - tw * 0.05, top + tw * 1.4); ctx.stroke();
          for (let j = 0; j < 6; j++) {
            const ly = bot - tw * 0.8 - j * ((bot - top - tw * 2.4) / 6), side = j % 2 ? 1 : -1;
            ctx.fillStyle = leaf; ctx.beginPath(); ctx.ellipse(x + side * tw * 0.2, ly, tw * 0.2, tw * 0.07, side * -0.5 + Math.sin(clock + j) * 0.05, 0, Math.PI * 2); ctx.fill();
          }
          ctx.globalCompositeOperation = "lighter";
          const g = ctx.createLinearGradient(x - tw / 2, 0, x + tw / 2, 0); g.addColorStop(0, "rgba(255,170,40,.10)"); g.addColorStop(0.5, "rgba(255,210,110,.38)"); g.addColorStop(1, "rgba(255,150,30,.10)");
          ctx.fillStyle = g; ctx.beginPath(); rrect(ctx, x - tw / 2, lvl, tw, bot - lvl, [0, 0, tw / 2, tw / 2]); ctx.fill();
          glowDot(x, lvl, tw * 0.9, "255,220,140", 0.35);
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = "rgba(235,248,242,.5)"; ctx.lineWidth = 2.5; ctx.beginPath(); rrect(ctx, x - tw / 2, top, tw, bot - top, [tw / 2, tw / 2, tw / 2, tw / 2]); ctx.stroke();
          ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - tw * 0.28, top + tw * 0.6); ctx.lineTo(x - tw * 0.28, bot - tw * 0.7); ctx.stroke();
          if (k > 0.05 && Math.random() < dt * 2.4) parts.push({ x, y: bot + tw * 0.2, vx: 0, vy: 0, life: 0, max: 1.4, r: tw * 0.16 });
        });
        step(dt, m * 0.9);
        ctx.globalCompositeOperation = "lighter";
        for (const p of parts) glowDot(p.x, p.y, p.r * 2, "255,190,70", 0.7 * (1 - p.life / p.max));
      }
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [seq]);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
