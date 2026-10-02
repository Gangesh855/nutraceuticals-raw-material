// @ts-nocheck
/*
 * Client-side behaviour for the page: scroll-driven scenes, the particle layer, the ingredient flow,
 * the process tubes, the CO₂ phase console and the sample-request form.
 *
 * It is a direct port of the original single-file design and works on the DOM rendered by the
 * components in components/sections. `startExperience()` returns a cleanup function so it is safe
 * under React strict mode and client-side navigation.
 */
import Lenis from "lenis";
import { BOTANICALS, CAT_DESC } from "@/lib/botanicals";

export function startExperience(): () => void {
  const root = document.documentElement;
  let dead = false;
  const observers: IntersectionObserver[] = [];
  const timers: number[] = [];
  let lenis: Lenis | null = null;
  const cleanups: Array<() => void> = [];
  let raf = 0;

  // Record every listener added during setup so cleanup can remove them again.
  const added: [EventTarget, string, any, any][] = [];
  const nativeAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type: string, fn: any, opts?: any) {
    added.push([this, type, fn, opts]);
    return nativeAdd.call(this, type, fn, opts);
  };

  try {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.toggle('motion', !reduce);
  lenis = !reduce ? new Lenis({ autoRaf: true, anchors: true, lerp: .085 }) : null;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const smooth = (a, b, v) => { const k = clamp((v - a) / (b - a)); return k * k * (3 - 2 * k); };
  const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* ---------- Masked line reveal: vanilla port of 21st.dev "Text Reveal (Mask)" (soralabs), lines mode ---------- */
  const splitEls = [...document.querySelectorAll('[data-split]')];
  function tokens(node, em = false, out = []) {
    for (const n of node.childNodes) {
      if (n.nodeType === 3) n.textContent.split(/[ \t\n\r]+/).filter(Boolean).forEach(t => out.push({ t, em }));
      else if (n.nodeName === 'BR') out.push({ br: true });
      else if (n.nodeType === 1) tokens(n, em || /^(STRONG|B)$/.test(n.nodeName), out);
    }
    return out;
  }
  const word = w => w.em ? `<strong>${esc(w.t)}</strong>` : esc(w.t);
  function split(el) {
    el._src ??= el.innerHTML;
    el.innerHTML = el._src;
    const toks = tokens(el);
    el.innerHTML = toks.map((w, i) => w.br ? '<br>' : `<span data-w="${i}">${word(w)}</span>`).join(' ');
    const lines = []; let last = null;
    for (const s of el.querySelectorAll('[data-w]')) {
      const top = s.offsetTop, br = s.previousElementSibling?.nodeName === 'BR';
      if (last === null || top > last + 2 || br) lines.push([]);
      lines.at(-1).push(toks[+s.dataset.w]);
      last = top;
    }
    el.innerHTML = lines.map((l, i) => `<span class="sl"><span class="su" style="--d:${(+(el.dataset.delay || 0) + i * .1).toFixed(2)}s">${l.map(word).join(' ')}</span></span>`).join('');
    el.classList.add('split');
  }
  function initSplit() {
    if (reduce) return;
    splitEls.forEach(split);
    void document.body.offsetHeight;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -20% 0px' });
    observers.push(io);
    splitEls.forEach(el => el.hasAttribute('data-now') ? requestAnimationFrame(() => el.classList.add('in')) : io.observe(el));
  }
  let splitDone = false;
  const runSplit = () => { if (!splitDone) { splitDone = true; initSplit(); } };
  (document.fonts?.ready || Promise.resolve()).then(() => { if (!dead) runSplit(); });
  timers.push(setTimeout(() => { if (!dead) runSplit(); }, 1800));
  let splitW = innerWidth;
  addEventListener('resize', () => { if (!reduce && splitDone && Math.abs(innerWidth - splitW) > 40) { splitW = innerWidth; splitEls.forEach(el => { const was = el.classList.contains('in'); split(el); if (was) el.classList.add('in'); }); } });

  /* ---------- Library ---------- */
  const grid = document.getElementById('grid');
  const byId = Object.fromEntries(BOTANICALS.map(b => [b.id, b]));
  grid.addEventListener('pointermove', e => {
    const c = e.target.closest('.specimen'); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--tilt', (((e.clientX - r.left) / r.width - .5) * 28).toFixed(1) + 'deg');
  });
  grid.addEventListener('pointerout', e => {
    const c = e.target.closest('.specimen');
    if (c && !c.contains(e.relatedTarget)) c.style.setProperty('--tilt', '0deg');
  });

  const filterBtns = [...document.querySelectorAll('.filters button')];
  filterBtns.forEach(b => b.addEventListener('click', () => {
    filterBtns.forEach(x => x.setAttribute('aria-pressed', x === b));
    const f = b.dataset.f;
    document.getElementById('catDesc').textContent = CAT_DESC[f];
    grid.querySelectorAll('.specimen').forEach(c => c.hidden = f !== 'all' && !c.dataset.cats.split(' ').includes(f));
    layoutFlow();
    if (flowOn) { const y = lib.getBoundingClientRect().top + scrollY; lenis ? lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); }
    else libView.scrollTo({ left: 0 });
    frame();
  }));

  /* ---------- Sample request ---------- */
  const picked = new Set();
  const chips = document.getElementById('chips'), chipsEmpty = document.getElementById('chipsEmpty'), trayN = document.getElementById('trayN');
  function renderPicked() {
    grid.querySelectorAll('.add').forEach(b => {
      const on = picked.has(b.dataset.id);
      b.setAttribute('aria-pressed', on);
      b.textContent = on ? 'In your request ✓' : 'Add to sample request';
    });
    chips.innerHTML = [...picked].map(id => `<button type="button" class="chip" data-id="${id}" aria-label="Remove ${byId[id].name}">${byId[id].name} <span aria-hidden="true">×</span></button>`).join('');
    chipsEmpty.hidden = picked.size > 0;
    trayN.hidden = picked.size === 0;
    trayN.textContent = picked.size;
    if (!reduce) { trayN.classList.remove('bump'); void trayN.offsetWidth; trayN.classList.add('bump'); }
  }
  grid.addEventListener('click', e => {
    const b = e.target.closest('.add'); if (!b) return;
    picked.has(b.dataset.id) ? picked.delete(b.dataset.id) : picked.add(b.dataset.id);
    renderPicked();
  });
  chips.addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    picked.delete(c.dataset.id); renderPicked();
  });

  const form = document.getElementById('reqForm'), done = document.getElementById('reqDone'), reqText = document.getElementById('reqText'), copyStatus = document.getElementById('copyStatus');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const lines = [
      'Sample request · GK Botanical', '',
      `Name: ${f.get('name')}`, `Company: ${f.get('company')}`, `Email: ${f.get('email')}`,
      `Application: ${f.get('application')}`, `Annual volume: ${f.get('volume')}`,
      `Botanicals: ${[...picked].map(id => byId[id].name).join(', ') || 'See notes'}`,
    ];
    if (f.get('notes').trim()) lines.push(`Notes: ${f.get('notes').trim()}`);
    reqText.textContent = lines.join('\n');
    copyStatus.textContent = '';
    form.hidden = true; done.hidden = false; done.focus();
  });
  document.getElementById('editReq').addEventListener('click', () => { done.hidden = true; form.hidden = false; form.querySelector('input').focus(); });
  document.getElementById('copyReq').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(reqText.textContent); copyStatus.textContent = 'Copied to your clipboard.'; }
    catch {
      const r = document.createRange(); r.selectNodeContents(reqText);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      copyStatus.textContent = 'Selected. Press Ctrl+C or ⌘C to copy.';
    }
  });

  /* ---------- CO2 console ---------- */
  const TC = 31.1, PC = 73.8;
  const psat = t => Math.exp(10.986 - 2033.8 / (t + 273.15)); // Clausius–Clapeyron fit through 20 °C/57.3 bar and the critical point
  const phase = (t, p) => t >= TC && p >= PC ? 'Supercritical' : t < TC && p >= psat(t) ? 'Liquid' : 'Gas';
  function describe(t, p, ph) {
    let d = ph === 'Gas' ? 'Too thin to dissolve much. Almost nothing leaves the vessel.'
      : ph === 'Liquid' ? 'Cold liquid CO₂ lifts only the lightest aromatics: bright top notes and little else.'
      : p < 150 ? 'Select extract. Only the volatile, essential-oil fraction comes across, clean and nearly free of waxes.'
      : p < 250 ? 'Between our two windows. Aromatics plus some of the heavier resins and pigments.'
      : 'Total extract. CO₂ now carries the full lipophilic profile, including oleoresins, pigments, waxes and heavier actives.';
    if (t > 60) d += ' Above 60 °C, heat-sensitive compounds begin to break down.';
    return d;
  }
  const svg = document.getElementById('phaseSvg');
  const X0 = 64, X1 = 544, Y0 = 372, Y1 = 28, TMAX = 80, PMAX = 400;
  const sx = t => X0 + t / TMAX * (X1 - X0), sy = p => Y0 - p / PMAX * (Y0 - Y1);
  const pts = a => a.map(([x, y]) => x.toFixed(1) + ',' + y.toFixed(1)).join(' ');
  const curve = []; for (let i = 0; i <= 24; i++) { const t = TC * i / 24; curve.push([sx(t), sy(psat(t))]); }
  let s = '';
  for (let p = 100; p <= PMAX; p += 100) s += `<line class="gl" x1="${X0}" x2="${X1}" y1="${sy(p)}" y2="${sy(p)}"/>`;
  for (let t = 20; t <= TMAX; t += 20) s += `<line class="gl" x1="${sx(t)}" x2="${sx(t)}" y1="${Y1}" y2="${Y0}"/>`;
  s += `<polygon class="liq" points="${pts([[sx(0), Y1], [sx(TC), Y1], ...curve.slice().reverse()])}"/>`;
  s += `<rect class="sc" x="${sx(TC)}" y="${Y1}" width="${X1 - sx(TC)}" height="${sy(PC) - Y1}"/>`;
  s += `<rect class="win" x="${sx(35)}" y="${sy(150)}" width="${sx(60) - sx(35)}" height="${sy(80) - sy(150)}"/><text class="wl" x="${sx(35) + 8}" y="${sy(150) + 16}">SELECT</text>`;
  s += `<rect class="win" x="${sx(40)}" y="${sy(350)}" width="${sx(60) - sx(40)}" height="${sy(250) - sy(350)}"/><text class="wl" x="${sx(40) + 8}" y="${sy(350) + 16}">TOTAL</text>`;
  s += `<polyline class="curve" points="${pts(curve)}"/>`;
  s += `<path class="bound" d="M${sx(TC)} ${sy(PC)}V${Y1}M${sx(TC)} ${sy(PC)}H${X1}"/>`;
  s += `<text class="lbl" x="${sx(4)}" y="${sy(230)}">LIQUID</text><text class="lbl" x="${sx(TC) + 12}" y="${Y1 + 20}">SUPERCRITICAL</text><text class="lbl" x="${sx(52)}" y="${sy(26)}">GAS</text>`;
  s += `<circle class="cp" cx="${sx(TC)}" cy="${sy(PC)}" r="4"/><text class="tk" x="${sx(TC) - 10}" y="${sy(PC) - 24}" text-anchor="end">Critical point</text><text class="tk" x="${sx(TC) - 10}" y="${sy(PC) - 9}" text-anchor="end">31.1 °C · 73.8 bar</text>`;
  s += `<path class="ax" d="M${X0} ${Y1}V${Y0}H${X1}"/>`;
  for (let t = 0; t <= TMAX; t += 20) s += `<text class="tk" x="${sx(t)}" y="${Y0 + 18}" text-anchor="middle">${t}</text>`;
  for (let p = 0; p <= PMAX; p += 100) s += `<text class="tk" x="${X0 - 10}" y="${sy(p) + 4}" text-anchor="end">${p}</text>`;
  s += `<text class="tk" x="${X1}" y="${Y0 + 40}" text-anchor="end">Temperature, °C</text><text class="tk" x="${X0}" y="${Y1 - 12}">Pressure, bar</text>`;
  s += `<line class="xh" id="xhH"/><line class="xh" id="xhV"/><g id="mk"><circle class="halo" r="17"/><circle class="dot" r="5"/></g>`;
  svg.innerHTML = s;
  const tIn = document.getElementById('temp'), pIn = document.getElementById('pres');
  const tOut = document.getElementById('tOut'), pOut = document.getElementById('pOut');
  const phaseEl = document.getElementById('phase'), descEl = document.getElementById('phaseDesc');
  const mk = svg.querySelector('#mk'), xhH = svg.querySelector('#xhH'), xhV = svg.querySelector('#xhV');
  function setState(t, p) {
    t = Math.round(clamp(t, 0, TMAX) * 2) / 2; p = Math.round(clamp(p, 1, PMAX));
    tIn.value = t; pIn.value = p;
    tOut.textContent = t.toFixed(1) + ' °C'; pOut.textContent = p + ' bar';
    const ph = phase(t, p);
    if (phaseEl.textContent !== ph) phaseEl.textContent = ph;
    descEl.textContent = describe(t, p, ph);
    const x = sx(t), y = sy(p);
    mk.setAttribute('transform', `translate(${x} ${y})`);
    xhH.setAttribute('x1', X0); xhH.setAttribute('x2', x); xhH.setAttribute('y1', y); xhH.setAttribute('y2', y);
    xhV.setAttribute('x1', x); xhV.setAttribute('x2', x); xhV.setAttribute('y1', Y0); xhV.setAttribute('y2', y);
  }
  tIn.addEventListener('input', () => setState(+tIn.value, +pIn.value));
  pIn.addEventListener('input', () => setState(+tIn.value, +pIn.value));
  document.querySelectorAll('.presets button').forEach(b => b.addEventListener('click', () => setState(+b.dataset.t, +b.dataset.p)));
  let drag = false;
  function fromEvent(e) {
    const r = svg.getBoundingClientRect();
    const vx = (e.clientX - r.left) / r.width * 560, vy = (e.clientY - r.top) / r.height * 420;
    setState((vx - X0) / (X1 - X0) * TMAX, (Y0 - vy) / (Y0 - Y1) * PMAX);
  }
  svg.addEventListener('pointerdown', e => { drag = true; svg.setPointerCapture(e.pointerId); fromEvent(e); });
  svg.addEventListener('pointermove', e => { if (drag) fromEvent(e); });
  svg.addEventListener('pointerup', () => drag = false);
  svg.addEventListener('pointercancel', () => drag = false);
  setState(50, 300);

  /* ---------- 3D particle layer: turmeric flecks -> capsule -> spin and warp into the products section ---------- */
  const hero = document.getElementById('top'), lib = document.getElementById('library'), cv = document.getElementById('petals'), ctx = cv.getContext('2d');
  const PET = [[196,128,40],[168,96,32],[214,160,74],[140,82,34],[186,140,92]];
  const GOLD = [[217,184,108],[240,214,150],[232,204,140]]; // capsule shell
  const FILL = [[226,150,30],[238,172,52],[204,122,24]];    // turmeric powder inside
  const FOCAL = 900; // perspective focal length, px
  let W = 0, H = 0, parts = [], mx = -1e4, my = -1e4, running = false, layerOn = true, trans = 0, transEnd = 0;
  const TC0 = Math.cos(-.35), TS0 = Math.sin(-.35); // capsule leans about 20°
  const CR = .42, CH = 1 - CR; // capsule (stadium): half-width CR, straight half-length CH, round ends
  function capsulePt(kind) { // kind: 0 fill, 1 outline, 2 seam
    if (kind === 2) return [(Math.random() * 2 - 1) * CR, .12];
    if (kind === 1) {
      const d = Math.random() * (4 * CH + 2 * Math.PI * CR);
      if (d < 2 * CH) return [CR, -CH + d];
      if (d < 4 * CH) return [-CR, CH - (d - 2 * CH)];
      const a = (d - 4 * CH) / CR;
      return [CR * Math.cos(a), (a < Math.PI ? CH : -CH) + CR * Math.sin(a)];
    }
    for (;;) {
      const x = (Math.random() * 2 - 1) * CR, y = Math.random() * 2 - 1, dy = Math.max(0, Math.abs(y) - CH);
      if (x * x + dy * dy <= CR * CR) return [x, y];
    }
  }
  function build() {
    const d = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    const n = Math.round(clamp(W * H / 950, 480, 1500));
    parts = Array.from({ length: n }, () => {
      const r = Math.random(), kind = r < .3 ? 1 : r < .36 ? 2 : 0;
      const [nx, ny] = capsulePt(kind), pal = kind ? GOLD : FILL;
      const half = Math.sqrt(Math.max(0, CR * CR - nx * nx)); // capsule half-thickness at this x
      const nz = kind === 1 ? 0 : kind === 2 ? (Math.random() < .5 ? -half : half) : (Math.random() * 2 - 1) * half;
      const ang = Math.random() * 6.283;
      return { hx: Math.random(), hy: Math.random(), hz: Math.random(), nx, ny, nz, dx: Math.cos(ang), dy: Math.sin(ang), sp: Math.random(), keep: Math.random() < .35,
        vy: .012 + Math.random() * .03, ph: Math.random() * 6.283, sw: .5 + Math.random(),
        rot: Math.random() * 6.283, rs: (Math.random() - .5) * .0016, s: 1.6 + Math.random() * 3.4, dl: Math.random() * .36,
        c0: PET[Math.random() * PET.length | 0], c1: pal[Math.random() * pal.length | 0], ox: 0, oy: 0 };
    });
  }
  function draw(now) {
    const p = hero._p || 0, mob = W < 760, tt = reduce ? 0 : now, t = reduce ? 0 : trans;
    const turn = ease(clamp(t / .45)), warp = ease(clamp((t - .3) / .7));
    const R = Math.min(W, H) * (mob ? .25 : .24);
    let dcx = W * (mob ? .5 : .7);
    const dcy = H * (mob ? .46 : .5) - H * .1 * turn;
    dcx += (W * .5 - dcx) * warp;
    const spin = turn * Math.PI * .95, cs = Math.cos(spin), sn = Math.sin(spin);
    const after = Math.min(700, Math.max(0, scrollY - transEnd)); // scroll beyond the transition drives dust parallax
    ctx.clearRect(0, 0, W, H);
    const g = smooth(.6, 1, p) * (1 - warp);
    if (g > 0) {
      const gr = ctx.createRadialGradient(dcx, dcy + R * .3, 0, dcx, dcy + R * .3, R * 2.4);
      gr.addColorStop(0, `rgba(217,184,108,${.3 * g})`); gr.addColorStop(1, 'rgba(217,184,108,0)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    }
    for (const q of parts) {
      const k = ease(clamp((p - q.dl) / .55));
      const hx = q.hx * W + Math.sin(tt * .0005 * q.sw + q.ph) * 22;
      const hy = ((q.hy * (H + 60) + tt * q.vy) % (H + 60)) - 30;
      // capsule-local 3D point (tilted 20°), spun about the vertical axis as the hero scrolls away
      let X = (q.nx * TC0 - q.ny * TS0) * R, Y = -(q.nx * TS0 + q.ny * TC0) * R, Z = q.nz * R;
      const X1 = X * cs + Z * sn; Z = -X * sn + Z * cs; X = X1;
      let al = .5 + .45 * k;
      if (warp > 0) {
        if (q.keep) { // settle into a deep field of dust behind the products
          X += ((q.hx - .5) * W * 1.15 - X) * warp + Math.sin(tt * .0003 + q.ph) * 24 * warp;
          Y += ((q.hy - .5) * H * 1.15 - Y) * warp;
          Z += (q.hz * FOCAL * 1.4 - Z) * warp;
          al *= 1 - .55 * warp;
        } else { // burst toward and past the camera
          X += q.dx * warp * W * .45; Y += q.dy * warp * H * .45; Z -= warp * FOCAL * (1.05 + q.sp);
          al *= 1 - smooth(.55, .95, warp);
        }
      }
      const den = FOCAL + Z; if (den < 60 || al < .02) continue;
      const pz = FOCAL / den;
      const tx = dcx + X * pz + Math.sin(tt * .002 + q.ph) * k * 1.2 * (1 - warp);
      const ty = dcy + Y * pz - after * .18 * pz;
      const x = hx + (tx - hx) * k + q.ox, y = hy + (ty - hy) * k + q.oy;
      if (t < .02) {
        const ddx = x - mx, ddy = y - my, d2 = ddx * ddx + ddy * ddy;
        if (d2 < 14400 && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / 120) * (1 - k * .8) * 2.4; q.ox += ddx / d * f; q.oy += ddy / d * f; }
      }
      q.ox *= .93; q.oy *= .93;
      const c = q.c0.map((v, i) => v + (q.c1[i] - v) * k | 0);
      const sz = Math.min(6, (q.s + (q.s * .3 + .5 - q.s) * k) * (1 - k + k * pz));
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${al.toFixed(2)})`;
      ctx.beginPath(); ctx.ellipse(x, y, sz, sz * (.5 + .4 * k), q.rot + tt * q.rs * (1 - k), 0, 6.2832); ctx.fill();
    }
  }
  function loop(now) { if (dead) return; draw(now); if (!reduce && layerOn) raf = requestAnimationFrame(loop); else running = false; }
  function wake() { if (!reduce && layerOn && !running) { running = true; raf = requestAnimationFrame(loop); } }
  hero.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
  hero.addEventListener('pointerleave', () => { mx = my = -1e4; });

  /* ---------- Field interlude: footage seen through the letters, scrubbed by scroll ---------- */
  const attar = document.getElementById('attar'), aw = attar.querySelector('.aw'), attarT = document.getElementById('attarT');
  const fieldVid = document.getElementById('fieldVid');
  function scrubField() { // scroll position drives the footage, like a camera rising through the field
    if (reduce || !fieldVid.duration) return;
    const t = clamp((attar._p || 0) / .95) * (fieldVid.duration - .05);
    if (Math.abs(fieldVid.currentTime - t) > .03 && !fieldVid.seeking) fieldVid.currentTime = t;
  }
  fieldVid.addEventListener('loadedmetadata', scrubField);
  fieldVid.addEventListener('seeked', scrubField);
  addEventListener('touchstart', () => { fieldVid.play().then(() => fieldVid.pause()).catch(() => {}); }, { once: true, passive: true }); // lets iOS seek a paused video
  function originAttar() { // zoom into the stem of the I
    aw.style.transformOrigin = `${attarT.offsetLeft + attarT.offsetWidth * .5}px ${attarT.offsetTop + attarT.offsetHeight * .6}px`;
  }
  document.fonts?.ready.then(() => { if (!dead) originAttar(); });

  /* ---------- Ingredients flow: vertical scroll drives a horizontal, interactive track ---------- */
  const libView = document.getElementById('libView'), libNow = document.getElementById('libNow'), libTotal = document.getElementById('libTotal'), libBar = lib.querySelector('.lib-bar i');
  let flowOn = false, flowDist = 0, flowActive = -1;
  const flowCards = () => [...grid.children].filter(c => !c.hidden);
  function layoutFlow() {
    flowOn = !reduce && innerWidth >= 900;
    lib.classList.toggle('flow', flowOn);
    grid.style.transform = '';
    flowDist = flowOn ? Math.max(0, grid.offsetWidth - libView.clientWidth) : 0;
    lib.style.height = flowOn ? (flowDist + innerHeight) + 'px' : '';
    libTotal.textContent = String(grid.querySelectorAll('.specimen:not([hidden])').length).padStart(2, '0');
    flowActive = -1;
  }
  function updateFlow() {
    const p = lib._p || 0, tx = -flowDist * p, vw = libView.clientWidth, cards = flowCards();
    grid.style.transform = `translate3d(${tx.toFixed(1)}px,0,0)`;
    libBar.style.transform = `scaleX(${p.toFixed(4)})`;
    let best = 0, bestD = 1e9;
    cards.forEach((c, i) => {
      const off = c.offsetLeft + tx + c.offsetWidth / 2 - vw * (.28 + .44 * p); // focus point travels left to right, so the first and last cards get their turn
      c.style.setProperty('--fd', clamp(off / vw, -1, 1).toFixed(3));
      if (Math.abs(off) < bestD) { bestD = Math.abs(off); best = i; }
    });
    if (best !== flowActive) {
      flowActive = best;
      cards.forEach((c, i) => { c.classList.toggle('is-active', i === best); const v = c.querySelector('.pv'); if (v) i === best ? playClip(v) : stopClip(v); });
      libNow.textContent = String(Math.min(best + 1, +libTotal.textContent)).padStart(2, '0');
    }
  }
  function playClip(v) { v.classList.add('on'); v.play?.().catch(() => {}); }
  function stopClip(v) { v.classList.remove('on'); v.pause?.(); }
  if (!reduce) { // clips pause whenever they leave the screen; on phones they play when in view
    const io = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target;
      if (!e.isIntersecting) return stopClip(v);
      if (!flowOn || v.closest('.is-active')) playClip(v);
    }), { threshold: .6 });
    observers.push(io);
    grid.querySelectorAll('.pv').forEach(v => io.observe(v));
  }
  const flowTo = y => lenis ? lenis.scrollTo(y) : scrollTo({ top: y, behavior: 'smooth' });
  let drag0 = null;
  libView.addEventListener('pointerdown', e => {
    if (!flowOn || e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button, a')) return;
    drag0 = { x: e.clientX, y: lenis ? lenis.targetScroll : scrollY }; libView.setPointerCapture(e.pointerId); libView.classList.add('dragging');
  });
  libView.addEventListener('pointermove', e => {
    if (!drag0) return;
    const y = drag0.y - (e.clientX - drag0.x);
    lenis ? lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
  });
  const endDrag = () => { drag0 = null; libView.classList.remove('dragging'); };
  libView.addEventListener('pointerup', endDrag); libView.addEventListener('pointercancel', endDrag);
  libView.addEventListener('wheel', e => { // sideways trackpad swipes move the flow too
    if (!flowOn || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(lenis.targetScroll + e.deltaX) : scrollBy(0, e.deltaX);
  }, { passive: false });
  grid.addEventListener('focusin', e => { // keyboard focus brings the card to the centre
    if (!flowOn) return;
    const c = e.target.closest('.specimen, .custom'); if (!c) return;
    const top = lib.getBoundingClientRect().top + scrollY;
    const vw = libView.clientWidth, cx = c.offsetLeft + c.offsetWidth / 2; // solve cx - dist*p = vw*(.28 + .44p) for p
    flowTo(top + clamp((cx - vw * .28) / Math.max(1, flowDist + vw * .44)) * flowDist);
  });

  /* ---------- Scroll engine: each [data-scene] gets --p (0→1) ---------- */
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const nav = document.getElementById('nav'), roPct = document.getElementById('roPct');
  const proc = document.getElementById('process'), stages = [...proc.querySelectorAll('.stage')], tubeBtns = [...proc.querySelectorAll('.tube')];
  let cur = 0, ticking = false;
  function setStage(i) {
    if (i === cur) return; cur = i;
    stages.forEach((st, j) => st.classList.toggle('on', j === i));
    tubeBtns.forEach((b, j) => j === i ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current'));
  }
  tubeBtns.forEach((b, i) => b.addEventListener('click', () => {
    if (reduce) { stages[i].scrollIntoView({ block: 'center' }); return; }
    const top = proc.getBoundingClientRect().top + scrollY, pin = proc.offsetHeight - innerHeight;
    const y = top + pin * (i + .5) / stages.length;
    lenis ? lenis.scrollTo(y) : scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }));
  function frame() {
    ticking = false;
    if (dead) return;
    const vh = innerHeight, max = root.scrollHeight - vh;
    root.style.setProperty('--scroll', max > 0 ? (scrollY / max).toFixed(4) : 0);
    nav.classList.toggle('solid', scrollY > 40);
    for (const sc of scenes) {
      const r = sc.getBoundingClientRect(), pin = r.height - vh;
      const p = clamp(pin > 1 ? -r.top / pin : (vh - r.top) / (vh + r.height));
      sc._p = p; sc.style.setProperty('--p', p.toFixed(4));
    }
    if (flowOn) updateFlow();
    if (!reduce) {
      const hp = hero._p;
      roPct.textContent = (3 + 92.8 * hp).toFixed(1) + ' %';
      setStage(Math.min(stages.length - 1, Math.floor(proc._p * stages.length)));
      tubeBtns.forEach((b, i) => b.style.setProperty('--f', smooth(i / 5, (i + .6) / 5, proc._p).toFixed(3)));
      const ap = attar._p, z = smooth(.08, .78, ap);
      attar.style.setProperty('--s', (1 + z * z * z * 60).toFixed(3));
      attar.style.setProperty('--mo', (1 - smooth(.6, .8, ap)).toFixed(3));
      attar.style.setProperty('--co', smooth(.8, .92, ap).toFixed(3));
      scrubField();
      const hs = hero.getBoundingClientRect().bottom + scrollY - vh, le = lib.getBoundingClientRect().top + scrollY - vh * .25;
      transEnd = le; trans = clamp((scrollY - hs) / Math.max(1, le - hs));
      hero.style.setProperty('--lt', (1 - smooth(0, .08, trans)).toFixed(3));
    }
    const ga = clamp((lib.getBoundingClientRect().bottom - vh * .3) / (vh * .5)); // fade the layer out as the products section ends
    cv.style.opacity = ga.toFixed(3); layerOn = ga > .01;
    if (reduce) { if (layerOn) draw(0); } else wake();
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  let lastW = 0, lastH = 0;
  function onResize() {
    const w = cv.clientWidth, h = cv.clientHeight;
    if (Math.abs(w - lastW) > 2 || Math.abs(h - lastH) > 120) { lastW = w; lastH = h; build(); if (reduce) draw(0); }
    originAttar(); layoutFlow();
    frame();
  }
  addEventListener('resize', onResize);
  onResize();

  /* ---------- Motion layer: reveals, count-up figures, magnetic buttons, nav highlight, back to top ---------- */
  if (!reduce) {
    const REVEAL = ['.facts > div', '.tests .test', '.certs li', '.at-facts > div', '.foot-grid > div', '.form > .field', '.form > fieldset', '.form > .submit-row', '.tag-line'];
    const countUp = (el) => {
      const m = /^(\d+(?:\.\d+)?)(\s*%?)$/.exec(el.textContent.trim());
      if (!m) return;
      const to = parseFloat(m[1]), dec = (m[1].split('.')[1] || '').length, t0 = performance.now(), dur = 1400;
      const tick = (now) => {
        if (dead) return;
        const k = clamp((now - t0) / dur), v = to * (1 - Math.pow(1 - k, 3));
        el.textContent = v.toFixed(dec) + m[2];
        if (k < 1) requestAnimationFrame(tick);
      };
      el.textContent = (0).toFixed(dec) + m[2];
      requestAnimationFrame(tick);
    };
    const revealIO = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); revealIO.unobserve(e.target);
      const dt = e.target.matches('.facts > div') ? e.target.querySelector('dt') : null;
      if (dt) countUp(dt);
    }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    observers.push(revealIO);
    REVEAL.forEach(sel => document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--rd', ((i % 6) * .07).toFixed(2) + 's');
      revealIO.observe(el);
    }));

    if (matchMedia('(hover: hover) and (pointer: fine)').matches) { // buttons and links lean toward the pointer
      document.querySelectorAll('.btn:not(.add), .textlink').forEach(el => {
        el.addEventListener('pointermove', e => {
          const r = el.getBoundingClientRect();
          el.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * .22).toFixed(1) + 'px');
          el.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * .32).toFixed(1) + 'px');
        });
        el.addEventListener('pointerleave', () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); });
      });
    }

    const spy = [...document.querySelectorAll('.nav nav a')].map(a => ({ a, s: document.querySelector(a.getAttribute('href')) })).filter(x => x.s);
    const toTop = document.createElement('button');
    toTop.type = 'button'; toTop.className = 'to-top'; toTop.setAttribute('aria-label', 'Back to top'); toTop.textContent = '↑';
    document.body.appendChild(toTop);
    cleanups.push(() => toTop.remove());
    toTop.addEventListener('click', () => lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' }));
    let spyTick = false;
    const spyFrame = () => {
      spyTick = false;
      const mid = innerHeight * .4;
      spy.forEach(({ a, s }) => { const r = s.getBoundingClientRect(); a.classList.toggle('on', r.top <= mid && r.bottom > mid); });
      toTop.classList.toggle('show', scrollY > innerHeight * .8);
    };
    addEventListener('scroll', () => { if (!spyTick) { spyTick = true; requestAnimationFrame(spyFrame); } }, { passive: true });
    spyFrame();
  }
  } finally {
    EventTarget.prototype.addEventListener = nativeAdd;
  }

  return () => {
    dead = true;
    added.forEach(([el, type, fn, opts]) => el.removeEventListener(type, fn, opts));
    observers.forEach((o) => o.disconnect());
    timers.forEach((t) => clearTimeout(t));
    cancelAnimationFrame(raf);
    cleanups.forEach((f) => f());
    lenis?.destroy();
    root.classList.remove("motion");
  };
}
