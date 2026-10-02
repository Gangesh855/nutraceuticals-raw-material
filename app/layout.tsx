import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../design-system/src/styles.css";

// One family throughout: Inter (variable, with italics). Display, body and label styles all derive from it.
const inter = Inter({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-sans", display: "swap" });

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
