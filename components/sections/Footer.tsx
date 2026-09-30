"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import ContactForm from "@/components/sections/ContactForm";
import { PRODUCTS } from "@/lib/products";
import { POSTS } from "@/lib/posts";
import { SITE } from "@/lib/site";

const FooterScene = dynamic(() => import("@/components/three/FooterScene"), { ssr: false });

const SOCIAL = [
  { n: "LinkedIn", d: "M4 9h4v11H4zM6 4a2 2 0 110 4 2 2 0 010-4zM10 9h4v1.5c.6-1 2-1.8 3.6-1.8 3 0 3.4 2 3.4 4.6V20h-4v-5.6c0-1.3 0-2.4-1.5-2.4S14 13 14 14.4V20h-4z" },
  { n: "X", d: "M4 4l16 16M20 4L4 20" },
  { n: "YouTube", d: "M3 8a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3zM10 9l5 3-5 3z" },
  { n: "Instagram", d: "M6 3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3zM12 8a4 4 0 100 8 4 4 0 000-8zM17 7h.01" },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden pt-40">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_100%,rgba(16,185,129,.25),transparent)]" aria-hidden />
      <div className="absolute inset-0 -z-10 opacity-70" aria-hidden><FooterScene /></div>
      <div className="section text-center">
        <p className="eyebrow mb-6">06 / Let&apos;s talk</p>
        <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="h-display text-[14vw] md:text-[9vw]">
          Let&apos;s grow<br /><span className="italic text-gold-200">something pure.</span>
        </motion.h2>
        <div className="mt-12"><MagneticButton href="#contact-form" variant="gold" className="!px-12 !py-6 !text-sm">Contact us →</MagneticButton></div>
        <div className="mt-20"><ContactForm /></div>
      </div>

      <div className="section mt-32 border-t border-white/10 py-14">
        <nav aria-label="Sitemap" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="eyebrow mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-ivory/70">{PRODUCTS.map((p) => <li key={p.slug}><Link className="hover:text-emerald-400" href={`/products/${p.slug}`}>{p.name}</Link></li>)}</ul>
          </div>
          <div>
            <h3 className="eyebrow mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-ivory/70">
              <li><Link className="hover:text-emerald-400" href="/#about">About</Link></li>
              <li><Link className="hover:text-emerald-400" href="/#manufacturing">Manufacturing</Link></li>
              <li><Link className="hover:text-emerald-400" href="/#certifications">Certifications</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="eyebrow mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-ivory/70">
              <li><Link className="hover:text-emerald-400" href="/blog">Blog</Link></li>
              {POSTS.map((p) => <li key={p.slug}><Link className="hover:text-emerald-400" href={`/blog/${p.slug}`}>{p.title.split(":")[0]}</Link></li>)}
            </ul>
          </div>
          <div>
            <h3 className="eyebrow mb-4">Contact</h3>
            <p className="text-sm text-ivory/70"><a className="hover:text-emerald-400" href={`mailto:${SITE.email}`}>{SITE.email}</a><br />{SITE.phone}</p>
            <div className="mt-6 flex gap-3">
              {SOCIAL.map((s) => (
                <motion.a key={s.n} href="#" aria-label={s.n} whileHover={{ y: -6, scale: 1.1 }} className="glass grid h-11 w-11 place-items-center text-ivory/70 transition-colors hover:text-gold-200 hover:shadow-gold">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={s.d} /></svg>
                </motion.a>
              ))}
            </div>
          </div>
        </nav>
        <div className="mt-14 flex flex-wrap justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-ivory/40">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span>Privacy · Terms · Cookie preferences</span>
        </div>
      </div>
    </footer>
  );
}
