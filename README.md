# GK Botanical

Cinematic site for GK Botanical, a standardized botanical extract manufacturer.
Next.js 15 (App Router) · React 19 · Lenis smooth scroll. Deploys to Cloudflare Workers via OpenNext.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint     # type-check
```

Deploy to Cloudflare: [`docs/CLOUDFLARE.md`](docs/CLOUDFLARE.md)

## Structure
- `app/` — layout (Inter via `next/font`), the single page, global CSS (`globals.css` holds the whole design)
- `components/sections/` — one component per band: Header, Hero, Ticker, House, Library, Field, Approach, Process, Console, Quality, Atelier, Footer
- `components/experience.ts` — client behaviour: scroll scenes, particle layer, ingredient flow, process tubes, CO₂ phase console, sample-request form. Mounted by `components/Experience.tsx`
- `lib/botanicals.ts` — the 15 extracts (copy, specs, filters, optional footage)

## Media (`public/media`)
- `field.mp4` / `field.jpg` — scroll-scrubbed field interlude
- `<id>.mp4` + `<id>.jpg` (video) or `<id>.jpg` (still) — shown on a library card while it is in focus.
  Set `clip: { kind: 'video' | 'image', file: '<id>' }` on the extract in `lib/botanicals.ts`.
  Present: amla, grapeseed, greentea, marigold, mustard, pomegranate, quercetin, turmeric (video); ashwa, boswellia, fenugreek (still).
  Still to add: ginkgo, goji, milkthistle, reishi.

## Before launch
- The sample request form drafts a message and copies it; nothing is sent. Replace `samples@gkbotanical.example` (Atelier and Footer) with a real address, or wire the form to an endpoint.
- Set `NEXT_PUBLIC_SITE_URL` (metadata base).
- Replace placeholder specs, batch data, certifications and the specimen certificate with verified data.
