import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { POSTS } from "@/lib/posts";

export default function Blog() {
  return (
    <section id="blog" className="section py-32">
      <Reveal><p className="eyebrow mb-4">05 / Insights</p></Reveal>
      <Reveal as="h2" className="h-display mb-14 text-6xl md:text-7xl">Botanical <span className="italic text-gold-200">intelligence.</span></Reveal>
      <div className="grid gap-6 md:grid-cols-3">
        {POSTS.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.1} className={i === 0 ? "md:col-span-2" : ""}>
            <Link href={`/blog/${p.slug}`} className="group glass glow-edge flex h-full flex-col justify-between overflow-hidden p-8">
              <div className="mb-16 h-32 rounded-xl bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,.4),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(212,175,55,.3),transparent_60%)] transition-transform duration-700 ease-expo group-hover:scale-[1.04]" />
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
