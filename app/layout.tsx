import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Cursor from "@/components/ui/Cursor";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-display", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

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
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <SmoothScroll>
          <Cursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
