"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS } from "@/lib/products";

const LINKS = [
  { href: "/#manufacturing", label: "Manufacturing" },
  { href: "/#certifications", label: "Certifications" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-expo ${scrolled ? "glass !rounded-none border-x-0 border-t-0 py-3" : "py-6"}`}>
      <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20" aria-label="Primary">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-400/70 font-display text-lg text-gold-200">GK</span>
          <span className="font-display text-xl tracking-wide">GK Botanicals</span>
        </Link>
        <ul className="hidden items-center gap-9 font-mono text-[11px] uppercase tracking-[.2em] md:flex">
          <li className="relative" onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)}>
            <Link href="/#products" className="py-3 hover:text-gold-200 transition-colors">Products ▾</Link>
            <AnimatePresence>
              {menu && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}
                  className="glass absolute left-1/2 top-full w-[26rem] -translate-x-1/2 p-5">
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-3 normal-case tracking-normal font-sans text-sm">
                    {PRODUCTS.map((p) => (
                      <li key={p.slug}><Link href={`/products/${p.slug}`} className="text-ivory/80 hover:text-emerald-400 transition-colors">{p.name}</Link></li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
          {LINKS.map((l) => (
            <li key={l.href}><Link href={l.href} className="py-3 hover:text-gold-200 transition-colors">{l.label}</Link></li>
          ))}
        </ul>
        <Link href="/#contact" className="hidden rounded-full border border-gold-400/60 px-5 py-2 font-mono text-[11px] uppercase tracking-[.2em] text-gold-200 transition-colors hover:bg-gold-400/15 md:block">Request COA</Link>
        <button className="md:hidden font-mono text-xs uppercase tracking-widest" aria-label="Toggle menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>{menu ? "Close" : "Menu"}</button>
      </nav>
      {menu && (
        <div className="glass mx-4 mt-3 p-5 md:hidden">
          <ul className="space-y-3 font-mono text-xs uppercase tracking-widest">
            <li><Link href="/#products" onClick={() => setMenu(false)}>Products</Link></li>
            {LINKS.map((l) => <li key={l.href}><Link href={l.href} onClick={() => setMenu(false)}>{l.label}</Link></li>)}
          </ul>
        </div>
      )}
    </header>
  );
}
