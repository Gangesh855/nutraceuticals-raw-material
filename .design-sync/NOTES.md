# Design sync notes

- The design system lives in `design-system/` (`@gk/botanical-ui`) and the site imports it through the `@gk/ui` alias (tsconfig `paths`). Styles are one file, `design-system/src/styles.css`, imported by `app/layout.tsx`.
- Build order: `npm run build --prefix design-system` (esbuild ESM bundle + `tsc` declarations + copies `styles.css`) BEFORE the converter. Entry for the converter: `--entry ./design-system/dist/index.js --node-modules ./node_modules` (react is hoisted to the repo root).
- Config paths (`cssEntry`, `extraFonts`) resolve relative to the package dir `design-system/`, not the repo root. Fonts come from the devDependencies `@fontsource/cormorant-garamond` and `@fontsource/alegreya` (latin subsets). On the site, fonts come from `next/font` instead, and `--font-display`/`--font-body` are set by it; the CSS falls back to the family names for the design project.
- Playwright for the render check: `cd .ds-sync && npm i playwright`, run validate/capture with `DS_CHROMIUM_PATH=/opt/pw-browsers/chromium` (cloud sandbox).
- Previews wrap each story in a dark `Night` box because the card page background is white while the system is a dark theme. `SiteHeader` is `position: fixed`; its preview sits in a `transform: translateZ(0)` parent and uses `cardMode: single`.
- Previews do not use `clip` on `SpecimenCard`: media files live in the site's `public/media` and are not part of the synced bundle.

## Re-sync risks
- Nothing has been uploaded yet: no `projectId` is pinned and no `_ds_sync.json` anchor exists remotely. First sync must run from an interactive session after `/design-login` (the cloud session could not authorize DesignSync).
- `extraFonts` points into `node_modules/@fontsource/*`; a missing install makes validate report `[FONT_MISSING]`.
- Conventions file names tokens and classes (`--night`, `.wrap`, `.band`, `.tests`, `.form`, `.chips`) that were checked against the build; re-validate after CSS changes.
- Components not extracted (scroll-driven library track, CO₂ phase console, hero particle layer) are behaviours in `components/experience.ts`, not part of the design system.
