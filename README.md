# GK Botanicals

Cinematic B2B website for a nutraceutical raw-material manufacturer.
Next.js 15 (App Router) · React Three Fiber · Tailwind CSS · Framer Motion · GSAP · Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint     # type-check
```

Design concept: [`docs/DESIGN_CONCEPT.md`](docs/DESIGN_CONCEPT.md)

## Structure
- `app/` — routes (`/`, `/products/[slug]`, `/blog`, `/blog/[slug]`), `sitemap.ts`, `robots.ts`, JSON-LD schema
- `components/sections/` — Header, Hero, Philosophy, Products, Timeline, Certifications, Blog, Footer
- `components/three/` — R3F scenes (turmeric rhizome, capsule, molecule, particles); loaded lazily, client-only
- `components/ui/` — Cursor, Preloader, MagneticButton, Reveal, SmoothScroll
- `lib/` — site config, product and blog content

## Before launch
- Set `NEXT_PUBLIC_SITE_URL` (sitemap, canonical, schema).
- Set `NEXT_PUBLIC_EXTRACTION_VIDEO` (e.g. `/video/extraction.mp4`) for the Philosophy background loop.
- Replace placeholder contact details in `lib/site.ts`, and product specs in `lib/products.ts` with verified data.
- Replace placeholder certification cards with real certificates (scope, body, validity). Do not publish unverified claims.
- Replace sample blog copy in `lib/posts.ts`; the hero stats are placeholders too.
