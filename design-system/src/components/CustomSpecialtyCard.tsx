import type { ReactNode } from "react";

export type CustomSpecialtyCardProps = {
  title?: ReactNode;
  body?: ReactNode;
  /** Short bullet points of what is offered. */
  points?: string[];
  ctaLabel?: ReactNode;
  ctaHref?: string;
};

/** The closing card of the ingredient track: invites visitors to brief the R&D team for a custom extract. */
export function CustomSpecialtyCard({
  title = "Your specification, developed in our lab",
  body = "Need a marker, ratio, solubility or carrier we don't list? Our R&D team develops pharmaceutical-grade extracts to your brief and validates the actives by HPLC.",
  points = ["Custom markers and ratios", "Water-soluble and beadlet grades", "Clean-label carriers"],
  ctaLabel = "Brief our R&D team",
  ctaHref = "#atelier",
}: CustomSpecialtyCardProps) {
  return (
    <article className="custom">
      <div>
        <p className="eyebrow">Custom specialty</p>
        <h3>{title}</h3>
        <p className="body">{body}</p>
        <ul>{points.map((p) => <li key={p}>{p}</li>)}</ul>
      </div>
      <a className="btn" href={ctaHref}>{ctaLabel}</a>
    </article>
  );
}
