import { SiteHeader } from "@gk/ui";

export default function Header() {
  return (
    <SiteHeader
      links={[
        { href: "#library", label: "Ingredients" },
        { href: "#process", label: "Process" },
        { href: "#console", label: "CO₂ lab" },
        { href: "#quality", label: "Quality" },
      ]}
    />
  );
}
