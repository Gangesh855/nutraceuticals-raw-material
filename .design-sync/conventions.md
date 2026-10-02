## GK Botanical conventions

**One dark world.** The brand is a deep-green page with warm paper text and a single gold accent. `styles.css` already sets `html`/`body` to `var(--night)` with `var(--vellum)` text, so do not add a light page background. Fonts are loaded for you: Cormorant Garamond for headings (`var(--f-display)`) and Alegreya for everything else (`var(--f-body)`). Never set another font family.

**No provider needed.** Components are plain React, styled by global class names that ship in `styles.css`. Mount them anywhere; no wrapper or theme provider.

**Tokens, use `var(--*)` only.** Colours: `--night` (page), `--canopy` (raised panels), `--vellum` (text), `--sage` (muted text), `--absolute` (gold accent), `--olive` (green panels), `--cream`, `--rule` (hairlines, gold at 20 %). Type scale: `--t-display`, `--t-h1`, `--t-h2`, `--t-h3`, `--t-lead`, `--t-body`, `--t-small`. Layout: `--gutter`, `--ease`. Do not invent hex values.

**Layout idiom (plain classes, no utility framework).** Wrap page content in `<section class="band"><div class="wrap">…</div></section>`: `.wrap` is the 1320 px centred container with `--gutter` side padding, `.band` adds generous vertical padding. Headings are plain `h1`/`h2`/`h3`; put the gold emphasis in `<strong>` inside the heading ("A certificate travels with <strong>every drum</strong>"). Put an `Eyebrow` above each heading. Body copy colour for secondary text is `var(--sage)`. Write your own glue with inline styles using the tokens above; reach for components first: `Button`, `TextLink`, `Eyebrow`, `Facts`, `SpecimenCard`, `ProcessStage`, `QualityTest`, `CertificateOfAnalysis`, `CertList`, `FormField`, `Chip`, `SiteHeader`.

**Composition rules.** One solid `Button` per view, other actions `variant="ghost"` or `TextLink`. Lists of `QualityTest` go inside `<div class="tests">`. `FormField`s go inside `<div class="form">` (two-column grid; use `full` to span). `SiteHeader` is `position: fixed` and must be the first element of the page. Chips go inside `<div class="chips">`.

**Where the truth lives.** Read `styles.css` and the `_ds_bundle.css` it imports before styling anything custom, and each component's `<Name>.prompt.md` and `<Name>.d.ts` for its props.

**Build snippet.**

```jsx
const { Eyebrow, Button, TextLink, Facts } = window.GKBotanical;

<section className="band"><div className="wrap">
  <Eyebrow>The house</Eyebrow>
  <h2>Standardization is only as honest as <strong>the method behind it.</strong></h2>
  <Facts items={[
    { figure: "95 %", text: "Curcuminoids in our turmeric extract" },
    { figure: "HPLC", text: "Marker-specific assay, never gravimetric" },
  ]} />
  <div style={{ display: "flex", gap: 28, alignItems: "center", marginTop: 40 }}>
    <Button href="#atelier">Request samples</Button>
    <TextLink href="#library">Explore ingredients</TextLink>
  </div>
</div></section>
```
