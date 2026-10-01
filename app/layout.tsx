import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import ContactDock from "@/components/ui/ContactDock";

// One family throughout: Inter (variable, with italics). Display, body and label styles all derive from it.
const inter = Inter({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Botanical Extract Manufacturer`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { title: SITE.name, description: SITE.description, url: SITE.url, siteName: SITE.name, type: "website" },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0A0D0C", width: "device-width", initialScale: 1 };

const orgLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization", "@id": `${SITE.url}/#org`, name: SITE.name, url: SITE.url,
      description: SITE.description, email: SITE.email,
    },
    { "@type": "WebSite", "@id": `${SITE.url}/#site`, url: SITE.url, name: SITE.name, publisher: { "@id": `${SITE.url}/#org` } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <SmoothScroll>
          <a href="#main" className="sr-only z-[300] rounded-full bg-charcoal-900 px-5 py-3 font-mono text-xs uppercase tracking-widest text-gold-200 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
          <Cursor />
          {children}
          <ContactDock />
        </SmoothScroll>
      </body>
    </html>
  );
}
