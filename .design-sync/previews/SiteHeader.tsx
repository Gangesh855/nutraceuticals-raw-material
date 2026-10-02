import { SiteHeader } from '@gk/botanical-ui';

const Night = ({ children, pad = 28, width }: { children?: React.ReactNode; pad?: number; width?: number }) => (
  <div style={{ background: "#102D26", color: "#E8DCC4", padding: pad, width, borderRadius: 4 }}>{children}</div>
);

const links = [
  { href: "#library", label: "Ingredients" },
  { href: "#process", label: "Process" },
  { href: "#console", label: "CO₂ lab" },
  { href: "#quality", label: "Quality" },
];

// The header is position:fixed; a transformed parent makes it fixed inside the card.
export const Default = () => (
  <div style={{ transform: "translateZ(0)", height: 84, background: "#102D26", overflow: "hidden" }}>
    <SiteHeader links={links} />
  </div>
);
export const CustomCta = () => (
  <div style={{ transform: "translateZ(0)", height: 84, background: "#102D26", overflow: "hidden" }}>
    <SiteHeader links={links} ctaLabel="Request a quote" ctaHref="#atelier" />
  </div>
);
