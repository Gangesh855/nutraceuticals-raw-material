# Hero footage: real botanical video loops

The hero background is built to play real footage. **No footage is included** — until you add it, each botanical shows its
still photograph with a slow Ken Burns move, plus the cinematic lighting layers (sun shafts, dappled leaf light, golden glow).
The foreground glass panel, floating capsules/softgels and extract droplets render in WebGL on top either way.

## Turn it on
1. Add one clip per botanical to `public/video/`, named by product slug:
   `moringa`, `ashwagandha`, `turmeric-curcumin`, `bacopa`, `ginger`, `boswellia` — each as **`.mp4`** (H.264) and optionally **`.webm`** (VP9).
2. Set `NEXT_PUBLIC_HERO_VIDEO=1` (local `.env.local`, and a **build variable** in Cloudflare — it is read at build time).
3. Rebuild. Video is skipped automatically on small screens, with reduced-motion, or when the browser asks to save data; any clip that
   fails to load falls back to its still image.

To change which botanicals play, or their order, edit `SLIDE_SLUGS` in `components/sections/Hero.tsx`.

## Shot list (8–10 s seamless loops, no audio, no people/branding)
| Slug | Suggested footage |
|---|---|
| `moringa` | Sunlight filtering through moringa leaves in a breeze; macro of leaves, pods; green powder pouring into a bowl |
| `ashwagandha` | Roots being washed / sliced; macro of dried root pieces; amber extract dripping from a pipette |
| `turmeric-curcumin` | Fresh rhizome being cut to show orange interior; golden powder pour in backlight; curcumin solution swirling |
| `bacopa` | Bacopa leaves and small white flowers with dew; leaves in a glass flask of green extract |
| `ginger` | Ginger root slices rotating on dark wood; steam rising from fresh extract; macro of oleoresin |
| `boswellia` | Boswellia resin tears (frankincense) in warm light; resin dissolving / amber oil dropping |

Look to match the 3D layer: **warm golden key light from upper right, cool green fill, shallow depth of field, dark background areas
on the left** (headline sits there). Slow camera moves. Shoot or buy 4K, deliver 1080p.

## Export (ffmpeg)
```bash
# MP4 (fallback, widest support) — aim for 1.5–3 MB per clip
ffmpeg -i in.mov -an -vf "scale=1920:-2,fps=30" -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart moringa.mp4
# WebM (smaller in Chromium/Firefox)
ffmpeg -i in.mov -an -vf "scale=1920:-2,fps=30" -c:v libvpx-vp9 -crf 35 -b:v 0 -row-mt 1 moringa.webm
```
Make the loop seamless in your editor by cross-dissolving the last ~1 s of the clip into its first second. Keep each file under
**25 MiB** (Cloudflare static-asset limit); aim far lower for performance.

## Sourcing & licensing
Use footage you shot, commissioned, or licensed for commercial web use (check the licence for modification and for use as a website
background). Don't use footage of another company's facility or products. Credit/licence terms should be stored alongside the files.


## Opening sequence clips (optional)
The hero opens with a ~12 s sequence: five close-ups of materials being processed → extract streams flow into a large capsule that
fills and glows → the lab look dissolves into the glass hero. It plays once per browser session (a "Skip intro" button is always shown;
it is skipped entirely for reduced-motion users). The close-ups are still photographs with procedural extraction effects (powder grinding,
golden powder pouring, droplets condensing, oil separating, liquid filtering through glass tubes).

To use real footage for the close-ups, add `public/video/intro-<slug>.mp4` (+ optional `.webm`) for these slugs and keep
`NEXT_PUBLIC_HERO_VIDEO=1` set:

| Slug | Close-up (≈1.25 s each on screen; shoot 6–8 s) |
|---|---|
| `intro-moringa` | Moringa leaf / powder being ground |
| `intro-turmeric` | Turmeric root milling; golden powder pouring |
| `intro-ginger` | Ginger slices with condensation on glass |
| `intro-bacopa` | Bacopa extract separating into oil and water layers |
| `intro-boswellia` | Boswellia resin; golden liquid filtering through glass tubes |

Footage plays under the 2D effects layer, so keep it moody and slightly desaturated; the effects add glow and motion on top.
