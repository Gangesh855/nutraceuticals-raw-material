import type { CSSProperties } from "react";

export type SpecimenClip = {
  /** `video` plays a muted loop while the card is in focus; `image` shows a still. */
  kind: "video" | "image";
  /** Base name of the file(s) in the media folder: `<file>.mp4` + `<file>.jpg` poster for video, `<file>.jpg` for image. */
  file: string;
};

export type SpecimenCardProps = {
  /** Stable id, used by the page script to track which extracts are in the sample request. */
  id: string;
  /** Common name, e.g. "Ashwagandha Extract". */
  name: string;
  /** Botanical (Latin) name, shown in italics above the title. */
  latin: string;
  /** One or two sentences describing the botanical. */
  description: string;
  /** Plant part used, e.g. "Root". */
  part: string;
  /** Active compounds. */
  actives: string;
  /** Standardisation claim with the assay method, e.g. "Withanolides 5 % (HPLC)". */
  standard: string;
  /** What the extract supports. */
  supports: string;
  /** Application categories joined with " · " under the specification. */
  categories: string[];
  /** Extract powder colour for the capsule. */
  color: string;
  /** Capsule fill level 0 to 1. */
  level: number;
  /** Optional footage or still shown behind the capsule when the card is active. */
  clip?: SpecimenClip;
  /** Folder URL of the media files. */
  mediaBase?: string;
  /** Space separated filter keys used by the ingredient filters. */
  filterKeys?: string[];
  /** Whether the extract is already in the sample request. */
  added?: boolean;
};

/**
 * Ingredient card: capsule specimen with optional footage, name, spec list and an "Add to sample request" button.
 * Lay these out in a horizontal track; one card at a time is "active".
 */
export function SpecimenCard(p: SpecimenCardProps) {
  const base = p.mediaBase ?? "/media";
  return (
    <article className="specimen" data-cats={(p.filterKeys ?? []).join(" ")}>
      <div className={`plinth${p.clip ? " has-media" : ""}`} style={{ "--liquid": p.color, "--level": p.level } as CSSProperties} aria-hidden="true">
        {p.clip?.kind === "video" && (
          <video className="pv" muted loop playsInline preload="none" poster={`${base}/${p.clip.file}.jpg`}>
            <source src={`${base}/${p.clip.file}.mp4`} type="video/mp4" />
          </video>
        )}
        {p.clip?.kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="pv pi" src={`${base}/${p.clip.file}.jpg`} alt="" loading="lazy" decoding="async" />
        )}
        <div className="vial powder"><span className="cap"></span><span className="glass"><span className="liquid"></span><span className="shine"></span></span></div>
      </div>
      <p className="latin">{p.latin}</p>
      <h3>{p.name}</h3>
      <p className="desc">{p.description}</p>
      <dl className="spec">
        <div><dt>Part</dt><dd>{p.part}</dd></div>
        <div><dt>Actives</dt><dd>{p.actives}</dd></div>
        <div><dt>Standard</dt><dd>{p.standard}</dd></div>
        <div><dt>Supports</dt><dd>{p.supports}</dd></div>
      </dl>
      <p className="tags">{p.categories.join(" · ")}</p>
      <button type="button" className="btn ghost add" data-id={p.id} aria-pressed={p.added ? "true" : "false"}>
        {p.added ? "In your request ✓" : "Add to sample request"}
      </button>
    </article>
  );
}
