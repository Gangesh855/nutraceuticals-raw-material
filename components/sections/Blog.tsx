import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { POSTS } from "@/lib/posts";

export default function Blog() {
  return (
    <section id="blog" className="section py-20 md:py-32">
      <Reveal><p className="eyebrow mb-4">05 / Insights</p></Reveal>
      <Reveal as="h2" className="h-display mb-10 text-5xl md:mb-14 md:text-7xl">Botanical <span className="italic text-gold-200">intelligence.</span></Reveal>
      <div className="grid gap-6 md:grid-cols-3">
        {POSTS.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.1} className={i === 0 ? "md:col-span-2" : ""}>
            <Link href={`/blog/${p.slug}`} className="group glass glow-edge flex h-full flex-col justify-between overflow-hidden p-8">
              <div className="relative mb-10 h-40 overflow-hidden rounded-xl">
                <Image src={p.image} alt="" fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
              </div>
              <div>
                <span className="eyebrow">{p.category}</span>
                <h3 className="mt-3 font-display text-3xl leading-tight">{p.title}</h3>
                <p className="mt-3 text-sm text-ivory/60">{p.excerpt}</p>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-ivory/40">
                  <time dateTime={p.date}>{new Date(p.date).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}</time> · {p.readMins} min read
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
