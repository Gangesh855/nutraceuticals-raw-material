import type { Metadata, Viewport } from "next";
import { Alegreya, Cormorant_Garamond } from "next/font/google";
import "../design-system/src/styles.css";

// Display: Cormorant Garamond. Body and UI: Alegreya. (Typefaces from the brand palette sheet.)
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const body = Alegreya({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-body", display: "swap" });

const DESCRIPTION =
  "GK Botanical manufactures HPLC-standardized botanical extracts for nutraceutical, beverage, food, personal care and animal health brands.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://gkbotanical.example"),
  title: "GK Botanical",
  description: DESCRIPTION,
  openGraph: { title: "GK Botanical", description: DESCRIPTION, type: "website" },
};

export const viewport: Viewport = { themeColor: "#102D26", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
