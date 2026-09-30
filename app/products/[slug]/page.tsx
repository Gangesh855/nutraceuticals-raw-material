import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import MagneticButton from "@/components/ui/MagneticButton";
import { PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return PRODUCTS.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.name} Extract — ${p.spec}`;
  return { title, description: `${p.name} (${p.latin}) extract: ${p.spec}. ${p.blurb}`, alternates: { canonical: `/products/${p.slug}` } };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) notFound();
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: `${p.name} Extract`, description: p.blurb,
    brand: { "@type": "Brand", name: SITE.name }, url: `${SITE.url}/products/${p.slug}`,
    additionalProperty: [
      { "@type": "PropertyValue", name: "Botanical name", value: p.latin },
      { "@type": "PropertyValue", name: "Marker compound", value: p.marker },
      { "@type": "PropertyValue", name: "Specification", value: p.spec },
      { "@type": "PropertyValue", name: "Assay method", value: p.method },
    ],
  };
  const rows: [string, string][] = [["Botanical name", p.latin], ["Marker compound", p.marker], ["Specification", p.spec], ["Assay method", p.method]];
  return (
    <>
      <Header />
      <main className="section mx-auto max-w-4xl pb-32 pt-40">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <Link href="/#products" className="eyebrow">← All extracts</Link>
        <h1 className="h-display mt-6 text-6xl md:text-8xl" style={{ textShadow: `0 0 60px ${p.color}55` }}>{p.name}</h1>
        <p className="mt-4 max-w-xl text-lg text-ivory/70">{p.blurb}</p>
        <div className="mt-6 flex flex-wrap gap-2">{p.benefits.map((b) => <span key={b} className="rounded-full border border-white/15 px-3 py-1 text-xs">{b}</span>)}</div>
        <div className="relative mt-10 h-56 overflow-hidden rounded-2xl border border-white/10 md:h-72">
          <Image src={p.image} alt={`${p.name} raw material and extract`} fill priority sizes="(min-width: 896px) 896px, 100vw" style={{ objectPosition: p.imagePos }} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 to-transparent" />
        </div>
        <dl className="glass glow-edge mt-12 divide-y divide-white/10">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-2 gap-4 p-5"><dt className="font-mono text-xs uppercase tracking-widest text-ivory/50">{k}</dt><dd className="text-gold-200">{v}</dd></div>
          ))}
        </dl>
        <div className="mt-12"><MagneticButton href={`mailto:${SITE.email}?subject=${encodeURIComponent(p.name + " sample request")}`} variant="gold">Request sample & COA →</MagneticButton></div>
      </main>
      <Footer />
    </>
  );
}
