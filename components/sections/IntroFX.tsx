"use client";
import { useEffect, useRef } from "react";
import type { Seq } from "@/lib/heroSeq";

type Haze = { x: number; y: number; vx: number; vy: number; born: number; life: number; r0: number; r1: number };
type Drop = { x: number; y: number; r: number; max: number; slide: boolean; grow: number };

const rrect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  if (typeof (c as CanvasRenderingContext2D & { roundRect?: unknown }).roundRect === "function") c.roundRect(x, y, w, h, r);
  else c.rect(x, y, w, h);
};

/**
 * Quiet 2D extraction details laid over the close-ups, one per material (all slow, soft and sparse):
 * 0 powder dispersing as a faint haze · 1 powder falling in a single fine stream · 2 droplets forming on glass ·
 * 3 oil and water settling into layers · 4 golden liquid rising slowly in glass tubes.
 */
export default function IntroFX({ seq }: { seq: React.MutableRefObject<Seq> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0, last = performance.now(), scene = -1, clock = 0, acc = 0;
    let haze: Haze[] = [], drops: Drop[] = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(c);

    const soft = (x: number, y: number, r: number, rgb: string, a: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    };
    const drift = (rgb: string, peak: number, m: number) => {
      haze = haze.filter((p) => clock - p.born < p.life);
      for (const p of haze) {
        const k = (clock - p.born) / p.life, e = Math.sin(Math.PI * k); // fade in and out
        soft(p.x + p.vx * (clock - p.born), p.y + p.vy * (clock - p.born), (p.r0 + (p.r1 - p.r0) * k) * (m / 800), rgb, peak * e);
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt; acc += dt;
      const s = seq.current;
      ctx.clearRect(0, 0, w, h);
      if (s.lab < 0.02) return;
      const f = s.sceneF, idx = Math.min(4, Math.floor(Math.max(0, f))), u = f >= 5 ? 1 : f - Math.floor(f);
      if (idx !== scene) { scene = idx; haze = []; drops = []; acc = 0; }
      const fade = Math.min(1, u / 0.25, idx === 4 ? 1 : (1 - u) / 0.25) * s.lab;
      ctx.globalAlpha = Math.max(0, fade);
      const m = Math.min(w, h) * 1.0;

      if (idx === 0) { // powder dispersing: a few very soft clouds rising and widening
        if (acc > 0.22) { acc = 0; haze.push({ x: w * (0.36 + Math.random() * 0.22), y: h * (0.5 + Math.random() * 0.15), vx: (Math.random() - 0.3) * 14, vy: -(10 + Math.random() * 16), born: clock, life: 3.4, r0: 50, r1: 150 }); }
        ctx.globalCompositeOperation = "lighter"; drift("200,236,176", 0.075, m);
      } else if (idx === 1) { // powder falling: one fine, gently swaying stream and a soft glow where it lands
        const x = w * 0.5 + Math.sin(clock * 0.9) * m * 0.012, top = 0, land = h * 0.7;
        const g = ctx.createLinearGradient(0, top, 0, land); g.addColorStop(0, "rgba(255,206,120,0)"); g.addColorStop(0.35, "rgba(255,206,120,.34)"); g.addColorStop(1, "rgba(255,196,100,.1)");
        ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = g;
        const wd = m * (0.004 + 0.003 * Math.sin(clock * 2.1)); ctx.fillRect(x - wd / 2, top, wd, land - top);
        ctx.filter = "blur(6px)"; ctx.fillRect(x - wd * 2.2, top, wd * 4.4, land - top); ctx.filter = "none";
        if (acc > 0.3) { acc = 0; haze.push({ x: x + (Math.random() - 0.5) * m * 0.1, y: land, vx: (Math.random() - 0.5) * 18, vy: -(6 + Math.random() * 10), born: clock, life: 3.2, r0: 40, r1: 130 }); }
        drift("255,190,95", 0.07, m);
      } else if (idx === 2) { // condensation: a handful of droplets slowly form on the glass
        while (drops.length < Math.min(12, 2 + u * 14)) drops.push({ x: w * (0.15 + Math.random() * 0.7), y: h * (0.12 + Math.random() * 0.62), r: 0, max: m * (0.012 + Math.random() * 0.026), slide: drops.length === 5, grow: 0.5 + Math.random() * 0.4 });
        ctx.globalCompositeOperation = "source-over";
        for (const d of drops) {
          d.r = Math.min(d.max, d.r + dt * d.max * d.grow);
          if (d.slide && d.r >= d.max * 0.97) { d.y += dt * m * 0.05; ctx.strokeStyle = "rgba(225,242,232,.05)"; ctx.lineWidth = d.r * 0.6; ctx.beginPath(); ctx.moveTo(d.x, d.y - m * 0.07); ctx.lineTo(d.x, d.y); ctx.stroke(); }
          const g = ctx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.35, d.r * 0.1, d.x, d.y, d.r);
          g.addColorStop(0, "rgba(240,252,244,.26)"); g.addColorStop(0.7, "rgba(200,230,212,.07)"); g.addColorStop(1, "rgba(8,22,16,.22)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.arc(d.x - d.r * 0.38, d.y - d.r * 0.42, d.r * 0.18, 0, Math.PI * 2); ctx.fill();
        }
      } else if (idx === 3) { // oil and water settling into two calm layers
        const top = h * 0.52, bot = h * 0.9, split = top + (bot - top) * (0.7 - 0.36 * Math.min(1, u * 1.2));
        const wave = (x: number, y0: number, a: number) => y0 + Math.sin(x * 0.008 + clock * 0.9) * a + Math.sin(x * 0.019 - clock * 0.6) * a * 0.5;
        ctx.globalCompositeOperation = "source-over";
        const oil = ctx.createLinearGradient(0, top, 0, split); oil.addColorStop(0, "rgba(255,200,80,.02)"); oil.addColorStop(1, "rgba(255,192,64,.22)");
        const water = ctx.createLinearGradient(0, split, 0, bot); water.addColorStop(0, "rgba(130,205,160,.14)"); water.addColorStop(1, "rgba(30,90,70,.28)");
        ctx.fillStyle = oil; ctx.beginPath(); ctx.moveTo(0, top); for (let x = 0; x <= w; x += 14) ctx.lineTo(x, wave(x, top, 1)); for (let x = w; x >= 0; x -= 14) ctx.lineTo(x, wave(x, split, 2)); ctx.fill();
        ctx.fillStyle = water; ctx.beginPath(); ctx.moveTo(0, bot); for (let x = 0; x <= w; x += 14) ctx.lineTo(x, wave(x, split, 2)); ctx.lineTo(w, bot); ctx.fill();
        ctx.strokeStyle = "rgba(255,236,176,.4)"; ctx.lineWidth = 1.5; ctx.beginPath(); for (let x = 0; x <= w; x += 8) ctx[x === 0 ? "moveTo" : "lineTo"](x, wave(x, split, 2)); ctx.stroke();
      } else { // golden liquid rising slowly in three glass tubes
        const tubes = [0.38, 0.5, 0.62], tw = m * 0.07, top = h * 0.17, bot = h * 0.8;
        tubes.forEach((fx, i) => {
          const x = w * fx, k = Math.min(1, Math.max(0, u * 1.1 - i * 0.14)), lvl = bot - (bot - top - tw) * k * 0.78;
          ctx.globalCompositeOperation = "lighter";
          const g = ctx.createLinearGradient(x - tw / 2, 0, x + tw / 2, 0); g.addColorStop(0, "rgba(255,170,40,.07)"); g.addColorStop(0.5, "rgba(255,210,110,.26)"); g.addColorStop(1, "rgba(255,150,30,.07)");
          ctx.fillStyle = g; ctx.beginPath(); rrect(ctx, x - tw / 2, lvl, tw, bot - lvl, tw / 2); ctx.fill();
          soft(x, lvl, tw * 0.8, "255,222,150", 0.22);
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = "rgba(235,248,242,.4)"; ctx.lineWidth = 2; ctx.beginPath(); rrect(ctx, x - tw / 2, top, tw, bot - top, tw / 2); ctx.stroke();
          ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - tw * 0.26, top + tw * 0.6); ctx.lineTo(x - tw * 0.26, bot - tw * 0.7); ctx.stroke();
        });
      }
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [seq]);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
