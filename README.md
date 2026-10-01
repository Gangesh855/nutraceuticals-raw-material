# GK Botanicals

Cinematic B2B website for a nutraceutical raw-material manufacturer.
Next.js 15 (App Router) · React Three Fiber · Tailwind CSS · Framer Motion · GSAP · Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint     # type-check
```

Hero footage: [`docs/HERO_FOOTAGE.md`](docs/HERO_FOOTAGE.md)

Deploy to Cloudflare: [`docs/CLOUDFLARE.md`](docs/CLOUDFLARE.md)

Design concept: [`docs/DESIGN_CONCEPT.md`](docs/DESIGN_CONCEPT.md)

## Structure
- `app/` — routes (`/`, `/products/[slug]`, `/blog`, `/blog/[slug]`), `sitemap.ts`, `robots.ts`, JSON-LD schema
- `components/sections/` — Header, Hero, Philosophy, Products, Timeline, Certifications, Blog, Footer
- `components/three/` — R3F scenes (turmeric rhizome, capsule, molecule, particles); loaded lazily, client-only
- `components/ui/` — Cursor, Preloader, MagneticButton, Reveal, SmoothScroll
- `lib/` — site config, product and blog content

## Before launch
- Contact form (`/api/contact`): set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (see `.env.example`). Without them, production returns a friendly error and dev just logs submissions. The in-memory rate limit is per instance; use a shared store if you scale out.
- Set `NEXT_PUBLIC_SITE_URL` (sitemap, canonical, schema).
- Set `NEXT_PUBLIC_EXTRACTION_VIDEO` (e.g. `/video/extraction.mp4`) for the Philosophy background loop.
- Replace placeholder contact details in `lib/site.ts`, and product specs in `lib/products.ts` with verified data.
- Replace placeholder certification cards with real certificates (scope, body, validity). Do not publish unverified claims.
- Replace sample blog copy in `lib/posts.ts`; the hero stats are placeholders too.

## Imagery
`public/images/*.webp` are crops of a single AI-generated reference image supplied by the client (it carries a "Made with AI" badge in the moringa panel). Replace them with licensed, real photography of your own materials and facility before launch; keep the filenames or update `image` in `lib/products.ts` and `lib/posts.ts`.
