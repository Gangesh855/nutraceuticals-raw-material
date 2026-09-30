# Deploying the Next.js site to Cloudflare (Workers Builds + OpenNext)

The repo root is configured for Cloudflare Workers with the [OpenNext adapter](https://opennext.js.org/cloudflare):
`wrangler.jsonc` (Worker `nutraceuticals-raw-material`, static assets, Images binding), `open-next.config.ts`
(prerendered pages served from the static-assets bundle — no KV/R2 needed).

## One-time setup (Git integration)
1. Merge the branch you want to deploy into `main` (or pick that branch in step 3).
2. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** → choose this GitHub repo.
3. Settings:
   - **Worker name:** the name Cloudflare gives the Worker when you import the repo (it defaults to the repo name, `nutraceuticals-raw-material`); it must match `name` in `wrangler.jsonc`. If you rename it in the dashboard, update `wrangler.jsonc` to match.
   - **Production branch:** `main`
   - **Root directory:** `/` (leave blank)
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx opennextjs-cloudflare deploy`
4. **Build variables** (Settings → Build → Variables and secrets): `NEXT_PUBLIC_SITE_URL` = your final URL, e.g. `https://www.gkbotanicals.com`
   (used at build time for canonical URLs, sitemap and schema markup).
   Optional: `NEXT_PUBLIC_EXTRACTION_VIDEO`.
5. **Runtime secrets** (Settings → Variables and secrets, type *Secret*) for the contact form:
   `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (from-address must be on a domain verified in Resend).
   Without them the form shows visitors an error asking them to email the sales address.
6. Save and deploy. Add a custom domain under **Settings → Domains & Routes**.

Every push to `main` then builds and deploys automatically; other branches get preview builds.

## Local checks
```bash
npm run preview   # opennextjs-cloudflare build + run in the local Workers runtime (workerd)
npm run deploy    # manual deploy with Wrangler (needs `wrangler login` or CLOUDFLARE_API_TOKEN)
```
For local secrets create `.dev.vars` (git-ignored) with the same three variables.

## Notes
- `next/image` optimisation uses the Cloudflare **Images binding** (`IMAGES` in `wrangler.jsonc`), billed per unique
  transformation; the free allowance comfortably covers this site. To turn it off, remove the binding and set
  `images: { unoptimized: true }` in `next.config.mjs`.
- The contact form's rate limit is in-memory per Worker isolate — best effort. For strict limits use Cloudflare's
  Rate Limiting rules (WAF) or a KV/Durable Object counter.
- The `astro-landing/` folder is a separate project and is not part of this deployment.

## Troubleshooting
- **`ERROR Could not find compiled Open Next config, did you run the build command?`** — the dashboard's *Build command*
  is empty and *Deploy command* is still the default `npx wrangler deploy`, so the site was never built. Set
  **Build command** `npx opennextjs-cloudflare build` and **Deploy command** `npx opennextjs-cloudflare deploy`
  (Settings → Build → Build configuration), then retry the build. Alternatively leave *Build command* empty and set
  *Deploy command* to `npm run deploy`, which runs the build and deploy together.
- **Worker name mismatch** — `name` in `wrangler.jsonc` must equal the Worker's name in the dashboard
  (here `nutraceuticals-raw-material`).
