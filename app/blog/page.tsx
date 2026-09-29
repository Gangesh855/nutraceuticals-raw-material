import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Blog from "@/components/sections/Blog";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Blog — Botanical Extract Insights",
  description: "Articles on standardised botanical extracts, manufacturing quality and global supplement regulation.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (<><Header /><main className="pt-28"><Blog /></main><Footer /></>);
}
