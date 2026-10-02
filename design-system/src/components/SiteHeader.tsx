import type { ReactNode } from "react";

export type SiteHeaderProps = {
  /** Section links shown in the centre, e.g. `[{ href: "#library", label: "Ingredients" }]`. */
  links: Array<{ href: string; label: ReactNode }>;
  /** Label of the call-to-action button on the right. */
  ctaLabel?: ReactNode;
  /** Target of the call-to-action button. */
  ctaHref?: string;
  /** Short wordmark, bold. */
  mark?: string;
  /** Wordmark suffix, small caps; hidden on very narrow screens. */
  markSuffix?: string;
};

/**
 * Fixed top bar: wordmark on the left, section links in the centre, gold call-to-action on the right.
 * It turns into a blurred green bar once the page scrolls. Place it once, as the first element of the page.
 */
export function SiteHeader({ links, ctaLabel = "Samples", ctaHref = "#atelier", mark = "GK", markSuffix = "Botanical" }: SiteHeaderProps) {
  return (
    <header className="nav" id="nav">
      <a className="mark" href="#top" aria-label={`${mark} ${markSuffix}, back to top`}>
        <span className="m1">{mark}</span><span className="m2">{markSuffix}</span>
      </a>
      <nav aria-label="Sections">
        {links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
      </nav>
      <a className="btn" href={ctaHref}>{ctaLabel} <span className="tray-n" id="trayN" hidden>0</span></a>
    </header>
  );
}
