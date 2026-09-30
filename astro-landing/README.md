# GK Botanicals — Astro landing page

Standalone cinematic landing page: **Astro 5 + Tailwind CSS v4 + Three.js + GSAP**.
The whole page is `src/pages/index.astro` (markup, styles and the three embedded scripts).

```bash
cd astro-landing
npm install
npm run dev      # http://localhost:4321
npm run build && npm run preview
```

To drop it into an existing Astro project: copy `src/pages/index.astro`, `src/styles/global.css`
(`@import "tailwindcss"` + theme fonts) and `public/images/`, then `npm i gsap three` and add the
`@tailwindcss/vite` plugin (see `astro.config.mjs`).

## What's inside
- **Hero**: Three.js GPU-shader particle field (curl-style noise flow + slow vortex = scCO₂ fluid) with stylised
  curcumin-like molecules. Particles and molecules are repelled by the cursor; camera has cursor parallax.
  Pauses when off-screen, respects `prefers-reduced-motion`, degrades gracefully if WebGL is unavailable.
- **Cursor + magnetic**: `gsap.quickTo` trailing ring/dot with `link` / `view` states. Any element with
  `data-magnetic="0.3"` drifts toward the cursor as it approaches.
- **Portfolio**: 5 flip cards (hover, keyboard focus, or tap on touch) revealing marker compounds.
- **Technology**: Aqueous / Ethanol / Supercritical CO₂ panels; image, copy card, ghost numeral and media
  frame scroll at different speeds (ScrollTrigger scrub).
- **Reveals**: masked word-split headlines, batched staggered fade-ups.

## Imagery
Large images use Unsplash URLs (`IMG` map in the frontmatter, cinematic tone applied with CSS filters) with a local
fallback in `public/images/`. The Unsplash IDs are best-effort placeholders that could not be verified from the build
sandbox — check them, or replace with your own photography. Portfolio cards use local images (crops of a client-supplied
AI-generated reference, which carries a "Made with AI" badge on the moringa panel).
Specs on the cards are typical industry ranges for illustration; confirm against real batch data.
