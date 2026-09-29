# GK Botanicals — Cinematic Site Concept

Company: **GK Botanicals**. Premium B2B nutraceutical raw-material manufacturer: Moringa, Ashwagandha, Turmeric (Curcumin), Bacopa, Ginger, Boswellia and more.

Stack: Next.js (App Router) · React Three Fiber (+ drei) · TailwindCSS · Framer Motion · GSAP ScrollTrigger · Lenis smooth scroll.

---

## 1. Design System

### Palette
| Token | Hex | Use |
|---|---|---|
| `--charcoal-950` | `#0A0D0C` | Page background |
| `--charcoal-800` | `#141A18` | Section base / panels |
| `--emerald-500` | `#10B981` | Primary accent, glows, active states |
| `--emerald-700` | `#047857` | Gradients, leaf veins |
| `--emerald-glow` | `rgba(16,185,129,.35)` | Box-shadow / bloom |
| `--gold-400` | `#D4AF37` | Certification seals, CTAs, hairlines |
| `--gold-200` | `#F2E2A6` | Highlights, headline emphasis |
| `--ivory` | `#EDEBE4` | Body text (92% on charcoal) |

### Typography
- Display: **Cormorant Garamond** / **Fraunces** (light, large, tight tracking) for manifesto and headings.
- UI/body: **Inter** or **Manrope**. Data/specs: **JetBrains Mono** (assay %, CAS numbers, batch IDs).
- Scale: hero 8–11vw, section titles 5vw, body 17–18px.

### Glassmorphism recipe
```
background: linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
backdrop-filter: blur(20px) saturate(140%);
border: 1px solid rgba(255,255,255,.12);
box-shadow: 0 10px 40px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.15);
```
- **Glowing edge:** a conic-gradient border (emerald → gold) masked to 1px, angle rotated toward the cursor.
- **Depth layers:** z0 background video/canvas → z1 parallax botanicals → z2 glass panels → z3 floating particles → z4 cursor.
- Global film grain (2% opacity noise) and a soft vignette unify the sections.

### Motion language
- Easing: `cubic-bezier(.22,1,.36,1)` (expo-out). Durations 0.8–1.4s for reveals.
- Rule: nothing pops — everything fades up 24px with a blur-to-sharp (`blur(8px)→0`).
- `prefers-reduced-motion`: disable parallax/particles, keep opacity fades.

---

## 2. Global Layer: Custom Cursor
- **Core dot** (6px, gold) + **trailing ring** (36px, emerald hairline) lerped at 0.15.
- States:
  - *Default*: ring + dot.
  - *Link/button*: ring expands to 64px, fills with emerald 15% glass, dot vanishes.
  - *Product card*: ring becomes a "DRAG" label with arrows.
  - *Video*: ring becomes "PLAY".
  - *Certification*: ring becomes a gold spotlight (radial gradient 200px) following the pointer.
- Hidden on touch devices; native cursor restored.

---

## 3. Full-Site Wireframe (header → footer)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 00 PRELOADER  (full-viewport, charcoal)                                  │
│                                                                          │
│                     ╱╲   large SVG leaf outline                          │
│                    ╱  ╲  midrib + veins draw in (stroke-dashoffset)      │
│                   ╱────╲ emerald fill rises bottom→top with the %        │
│                                                                          │
│         ━━━━━━━━━━━━━━━━━━━━━━━●─────────  (progress line, vein-tipped)  │
│                          0 7 3 %   (mono, gold, fades in cinematically)  │
│                       GK BOTANICALS · PURE BOTANICALS                         │
└──────────────────────────────────────────────────────────────────────────┘
      ↓ leaf scales up & becomes the mask (iris reveal) into hero

┌──────────────────────────────────────────────────────────────────────────┐
│ 01 HEADER  (fixed, transparent → frosted on scroll)                      │
│ ◈ GK BOTANICALS   Products▾  Manufacturing  Certifications  Blog  Contact  [Request COA ▸] │
│              └ mega-menu (glass): Categories → Adaptogens · Curcuminoids│
│                Boswellia · Nootropics · Greens · Custom Extracts        │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ 02 HERO  (100vh, sticky 3D canvas)                                       │
│  ░ R3F canvas: turmeric rhizome (default) ⇄ moringa tree (toggle)        │
│  ░ ~600 gold/emerald pollen particles, volumetric light shafts           │
│                                                                          │
│   PURE BOTANICALS,            ← word-by-word mask reveal, gold italic    │
│   PRECISION MANUFACTURING.      on "Precision"                           │
│   Standardised extracts. Full traceability. 60+ countries.               │
│                                                                          │
│   [ Explore Extracts ⟶ ]  (magnetic)     ▷ Watch the process             │
│                                                                          │
│   ┌ glass stat ┐ ┌ glass stat ┐ ┌ glass stat ┐   floating, parallax       │
│   │ 98% curcumin│ │ 0 ppm heavy│ │ 25+ yrs    │   at different depths      │
│   └────────────┘ └────────────┘ └────────────┘                           │
│                       ⌄ scroll                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

### Hero 3D detail (React Three Fiber)
- **Turmeric root scene:** procedural rhizome (merged noise-displaced capsules, orange-gold PBR, subsurface fake via rim light). Slow Y rotation; mouse tilts the group ±12°. On scroll the root *slices open* (clip plane sweeps) revealing a glowing curcumin-orange interior and molecular lattice, then the camera dollies into the next section.
- **Moringa alternative:** low-poly tree with instanced leaves swaying via vertex shader wind; leaves detach on scroll and drift as particles.
- **Post-processing:** subtle bloom (gold highlights), depth-of-field, vignette. Environment: dark studio HDRI + emerald rim light + gold key light.
- **Fallback:** poster image + CSS parallax for low-power GPUs / `prefers-reduced-motion`; canvas lazy-loaded after LCP (`next/dynamic`, `ssr:false`).
- **Magnetic CTA:** button translates toward cursor within 120px radius (spring, stiffness 150), inner label moves at 40% for depth; gold glow ring pulses.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 03 PHILOSOPHY / ABOUT  (pinned section, GSAP ScrollTrigger, ~300vh)       │
│  ▓ background: muted video loop — herbal extraction (steam, copper       │
│    percolators, amber liquid). Overlay: charcoal 70% + emerald gradient. │
│                                                                          │
│   ── 01 / MANIFESTO ──                                                   │
│   "We don't process plants."       ← each line fades in as scroll        │
│   "We translate nature            advances; words light up ivory         │
│    into measurable,               from 20% → 100% opacity (scrub)        │
│    verifiable purity."                                                   │
│                                                                          │
│   Pillars (glass cards slide in from right, staggered):                  │
│   [ Purity ] [ Innovation ] [ Compliance ]                               │
│                                                                          │
│   Spotlight reveal: radial mask follows cursor to uncover a secondary    │
│   line of copy ("Every batch, a story from seed to certificate.")        │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ 04 PRODUCT SHOWCASE  (pinned; vertical scroll → horizontal translate)    │
│  Title: "The Extract Library"     ◀ ── drag / scroll ── ▶   01 / 08      │
│                                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  …      │
│  │ MORINGA     │ │ ASHWAGANDHA │ │ TURMERIC    │ │ BACOPA      │         │
│  │ [3D capsule │ │ [3D capsule │ │ [3D capsule │ │ [3D capsule │         │
│  │  rotating]  │ │  rotating]  │ │  rotating]  │ │  rotating]  │         │
│  │ Leaf 4:1…   │ │ Withanolides│ │ Curcuminoids│ │ Bacosides   │         │
│  │ 10% spec    │ │ 5%/10%      │ │ 95% HPLC    │ │ 20%/50%     │         │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘         │
│  Ginger · Boswellia (AKBA 30%) · Shatavari · Green Tea · "+ Custom"      │
└──────────────────────────────────────────────────────────────────────────┘
```

### Product card behaviour
- **Idle:** glass card, small R3F capsule (split gelatin shell, half emerald / half gold) rotating slowly; herbal powder swirl as instanced particles.
- **Hover:**
  1. Card lifts (`translateZ(40px)`, tilt toward cursor via `useMotionValue` 3D tilt, max 8°).
  2. Glowing edge intensifies; spotlight follows pointer inside the card.
  3. Capsule opens; particles of that botanical (leaf / rhizome flakes / resin tears) burst and orbit.
  4. **Extraction visual** cross-fades in behind: looping macro clip / Lottie of droplets, percolation, or crystallisation for that herb.
  5. Key benefits slide up: 3 chips (e.g. *Adaptogen · Stress · Sleep*) + spec table (marker compound, assay method, mesh size).
  6. CTA row: `Spec Sheet (PDF)` · `Request Sample`.
- Neighbour cards dim to 60% and blur 2px to focus attention.
- Each card links to `/products/[slug]` (SSG page with `Product` schema).
- Progress bar (gold) under the rail; keyboard arrows supported; mobile = native snap scroll.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 05 MANUFACTURING TIMELINE  (vertical, ~400vh)                            │
│                                                                          │
│        Background image crossfades per stage (fields → plant → lab →     │
│        packaging), darkened, with parallax                               │
│                                                                          │
│   ┃                                                                      │
│   ◉───  01 SOURCING          [animated icon: sprout grows, GPS pin drops]│
│   ┃      Farm-traceable, GAP-audited, batch-QR                           │
│   ┃   glowing line fills emerald as you scroll                           │
│   ◉───  02 EXTRACTION        [icon: flask fills, droplets, steam]        │
│   ┃      Ethanol/water, CO₂ supercritical, low-temp concentration        │
│   ┃                                                                      │
│   ◉───  03 TESTING           [icon: HPLC peak line draws, checkmark]     │
│   ┃      HPLC · HPTLC · heavy metals · pesticide · microbial             │
│   ┃                                                                      │
│   ◉───  04 PACKAGING         [icon: drum seals, lid rotates 3D, tamper]  │
│          Nitrogen-flushed, COA per batch, global logistics               │
└──────────────────────────────────────────────────────────────────────────┘
```
- Nodes alternate left/right on desktop; single column on mobile.
- Active node: pulsing emerald halo + gold ring; inactive at 30% opacity.
- Line is an SVG path with `stroke-dashoffset` bound to scroll progress; a small glowing orb rides the tip.
- Icons: hand-authored SVG with GSAP timelines (or Lottie), triggered on enter.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 06 CERTIFICATIONS & COMPLIANCE                                           │
│  "Verified. Audited. Trusted."                                           │
│                                                                          │
│  ╔═══════════╗ ╔═══════════╗ ╔═══════════╗ ╔═══════════╗ ╔═══════════╗   │
│  ║  GMP      ║ ║ ISO 9001  ║ ║ ISO 22000 ║ ║ USDA/EU   ║ ║ Kosher/   ║   │
│  ║ (seal)    ║ ║ (seal)    ║ ║ (seal)    ║ ║ Organic   ║ ║ Halal/FSSC║   │
│  ╚═══════════╝ ╚═══════════╝ ╚═══════════╝ ╚═══════════╝ ╚═══════════╝   │
│   [ Download compliance dossier ]   [ Request audit report ]             │
└──────────────────────────────────────────────────────────────────────────┘
```
- **Holographic hover:** on `pointermove` compute tilt + gradient angle; overlay a rainbow-iridescent conic gradient (`mix-blend-mode: color-dodge`, 25% opacity) and moving specular sheen; gold foil seal parallaxes above the panel (translateZ 60px). Scanline shimmer sweeps once on enter.
- Click opens a glass modal: certificate scope, body, validity, PDF.
- Placeholder logos only until real certificates are supplied (never fabricate certification claims in production).

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 07 BLOG / INSIGHTS  ("Botanical Intelligence")                           │
│  ┌ Featured (2 col) ─────────────┐ ┌ Article ┐ ┌ Article ┐               │
│  │ hero image, category chip,    │ │ img     │ │ img     │               │
│  │ H2 title, excerpt, 6 min read │ │ title   │ │ title   │               │
│  └───────────────────────────────┘ └─────────┘ └─────────┘               │
│  Filter chips: All · Science · Manufacturing · Regulation · Market       │
│  Newsletter glass strip:  [ email ______ ] [ Subscribe ]                 │
└──────────────────────────────────────────────────────────────────────────┘
```
- Cards: glass, image zoom 1.06 + emerald edge glow on hover; reading time; author + date.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 08 FOOTER  (grand, cinematic)                                            │
│   giant outlined type slowly parallaxing:                                │
│                                                                          │
│      LET'S GROW                                                          │
│      SOMETHING PURE.        [ Contact Us ⟶ ] (large magnetic, gold)      │
│                                                                          │
│   Background: R3F drifting leaves + fireflies, emerald horizon glow      │
│  ─────────────────────────────────────────────────────────────────────── │
│  Products        Company        Resources       Contact                  │
│  Moringa         About          Blog            sales@…  +91 …           │
│  Ashwagandha     Manufacturing  COA Library     Address                  │
│  Turmeric        Certifications Spec Sheets     [in] [X] [▶] [ig]        │
│  Bacopa …        Careers        Sitemap         (icons: lift, glow,      │
│                                                  ripple, gold underline) │
│  © 2026 · Privacy · Terms · Cookie preferences                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Signature 3D Micro-Animations (R3F)
| Element | Implementation |
|---|---|
| Hero turmeric / moringa | GLTF (Draco) or procedural; drei `Float`, `useFrame` rotation; scroll-linked clip-plane |
| Rotating capsules | Two `CapsuleGeometry` halves, `MeshPhysicalMaterial` (transmission .6, clearcoat 1); opens on hover via spring |
| Molecular structures | Instanced spheres + cylinder bonds (curcumin, withanolide-A); slow rotation, atoms pulse gold on hover |
| Herbal particles | `InstancedMesh`/`Points` with custom shader, curl-noise drift, cursor repulsion |
| Animated leaves | Instanced leaf plane, vertex-shader sway; leaves peel away on scroll velocity |
| Footer scene | Low-density leaves + fireflies, single shared `<Canvas>` with `View` portals to avoid multiple WebGL contexts |

Performance: one persistent canvas (drei `View`), DPR clamp `[1,1.75]`, `frameloop="demand"` when off-screen, Draco/KTX2 assets, `PerformanceMonitor` to degrade particles.

---

## 5. Scroll Choreography Summary
| Section | Technique |
|---|---|
| Preloader → Hero | Leaf mask iris-reveal (GSAP timeline) |
| Hero | Cursor parallax (3 depth layers), scroll dolly-in |
| Philosophy | GSAP pin + scrubbed word-opacity, video parallax |
| Products | Pin + horizontal translate, hover 3D tilt |
| Timeline | SVG path scrub, per-node enter animations, bg crossfades |
| Certifications | Framer Motion stagger, pointer-driven holographic shader |
| Blog | Framer Motion `whileInView` fade-up |
| Footer | Parallax type, magnetic CTA, particle scene |

Lenis provides smooth scroll; GSAP ScrollTrigger synced via `lenis.on('scroll', ScrollTrigger.update)`.

---

## 6. Next.js Architecture

```
app/
  layout.tsx            // fonts, metadata base, Organization JSON-LD, Lenis provider
  page.tsx              // home (sections composed)
  products/[slug]/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx  // MDX, Article JSON-LD, BreadcrumbList
  certifications/page.tsx
  contact/page.tsx
  sitemap.ts            // dynamic sitemap.xml
  robots.ts             // robots.txt
components/
  ui/ (GlassPanel, MagneticButton, Cursor, Preloader)
  sections/ (Hero, Philosophy, Products, Timeline, Certs, Blog, Footer)
  three/ (Scene, Rhizome, MoringaTree, Capsule, Molecule, Particles, Leaves)
lib/ (gsap.ts, products.ts, posts.ts, seo.ts)
content/blog/*.mdx
public/ (models/*.glb, video/*.mp4 + webm, og/*.jpg)
```

### Rendering strategy
- All content sections are **Server Components** (fully crawlable HTML). Only cursor, canvas and animation wrappers are client components.
- 3D + video are loaded lazily (`next/dynamic`, `IntersectionObserver`); hero copy renders immediately for LCP.
- Blog + product pages: **SSG/ISR**.

---

## 7. SEO & Performance Plan

**Metadata:** per-route `generateMetadata` (title ≤60, description ≤155, canonical, OpenGraph, Twitter, hreflang for target markets).

**Schema markup (JSON-LD):**
- `Organization` + `LocalBusiness` (site-wide), `WebSite` with `SearchAction`
- `Product` (each extract: name, description, brand, additionalProperty for assay/spec)
- `Article`/`BlogPosting` + `BreadcrumbList` (blog)
- `FAQPage` where the article has Q&A

**Crawl files:** `app/sitemap.ts` (pages, products, posts with `lastModified`), `app/robots.ts` (allow all, disallow `/api`, sitemap link).

**Performance budget:** LCP < 2.5s, CLS < 0.1, INP < 200ms.
- `next/image` (AVIF/WebP, sizes, blur placeholders); video as compressed WebM/MP4 (<2 MB, poster, `preload="none"`, muted loop, paused off-screen).
- Fonts via `next/font` (subset, `display: swap`).
- Code-split Three.js/GSAP; tree-shake drei; no 3D on mobile-lite tier (static poster + CSS motion).
- `content-visibility: auto` for below-fold sections.

**Accessibility:** WCAG AA contrast (ivory on charcoal), visible focus rings (gold), skip link, semantic headings, alt text, reduced-motion support, keyboard-operable product rail, cursor effects never required.

**Responsive:** ≥1280 full experience · 768–1279 reduced parallax, 2-col grids · <768 native cursor, snap-scroll products, single-column timeline, static hero image option.

---

## 8. Build Roadmap
1. Scaffold Next.js + Tailwind tokens + fonts + Lenis/GSAP setup.
2. Glass primitives, cursor, magnetic button, preloader.
3. Hero canvas (rhizome, particles) with fallback.
4. Philosophy + Products rail (capsule scene, hover states).
5. Timeline + Certifications (holographic effect).
6. Blog (MDX, schema) + Footer.
7. SEO files, Lighthouse/CWV tuning, a11y pass, content & real assets.

> Assets to source: real certificate documents, product spec sheets/COAs, licensed extraction footage, brand logo, GLB models (or commission).
