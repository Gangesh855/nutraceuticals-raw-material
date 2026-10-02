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
   - **Build command:** leave empty (the site is built automatically at the end of `npm ci` on Workers Builds — see
     `scripts/cf-ci-build.mjs`), or set `npx opennextjs-cloudflare build` and add build variable `SKIP_CF_INSTALL_BUILD=1`
   - **Deploy command:** the default `npx wrangler deploy` (it delegates to `opennextjs-cloudflare deploy`)
4. **Build variables** (Settings → Build → Variables and secrets): `NEXT_PUBLIC_SITE_URL` = your final URL, e.g. `https://www.gkbotanicals.com`
   (used at build time for the metadata base URL).
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

## Troubleshooting
- **`ERROR Could not find compiled Open Next config, did you run the build command?`** — the deploy ran before the
  site was built. The repo now builds automatically during install on Workers Builds (`postinstall` →
  `scripts/cf-ci-build.mjs`, triggered by the `WORKERS_CI=1` variable Cloudflare injects), so the default empty
  *Build command* + `npx wrangler deploy` works. If you still see it, check the build log contains
  `[cf-ci-build] Workers Builds detected`; if not, set *Build command* to `npx opennextjs-cloudflare build`
  (Settings → Build → Build configuration).
- **Worker name mismatch** — `name` in `wrangler.jsonc` must equal the Worker's name in the dashboard
  (here `nutraceuticals-raw-material`).
