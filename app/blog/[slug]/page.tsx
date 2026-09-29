import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { POSTS } from "@/lib/posts";
import { SITE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title, description: post.excerpt, alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

export default async function Post({ params }: Params) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();
  const url = `${SITE.url}/blog/${post.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BlogPosting", headline: post.title, description: post.excerpt, datePublished: post.date, dateModified: post.date, mainEntityOfPage: url, author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ] },
    ],
  };
  return (
    <>
      <Header />
      <main className="section mx-auto max-w-3xl pb-32 pt-40">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <nav aria-label="Breadcrumb" className="eyebrow mb-8"><Link href="/blog">← Blog</Link></nav>
        <article>
          <span className="eyebrow">{post.category}</span>
          <h1 className="h-display mt-4 text-5xl md:text-6xl">{post.title}</h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-ivory/40"><time dateTime={post.date}>{post.date}</time> · {post.readMins} min read</p>
          <div className="mt-12 space-y-6 text-lg leading-relaxed text-ivory/80">{post.body.map((b, i) => <p key={i}>{b}</p>)}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}
