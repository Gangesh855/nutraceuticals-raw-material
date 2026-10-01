"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "@/lib/site";

const icon = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Floating quick-contact actions (WhatsApp + call), common in B2B supplier sites. Appears after the preloader. */
export default function ContactDock() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 3600);
    return () => clearTimeout(t);
  }, []);
  const item = "glass grid h-12 w-12 place-items-center text-ivory/80 transition-all duration-300 hover:-translate-y-0.5 hover:text-gold-200 hover:shadow-gold focus-visible:text-gold-200";
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 z-40 flex flex-col gap-3 pb-[env(safe-area-inset-bottom)] md:bottom-6 md:left-6"
        >
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" title="Chat on WhatsApp" className={item}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" {...icon}><path d="M21 11.5a8.5 8.5 0 01-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1121 11.5z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.5-2-1-.8.800c-.8-.4-1.600-1.200-2-2l.8-.8-1-2z" /></svg>
          </a>
          <a href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`} aria-label={`Call ${SITE.phone}`} title="Call us" className={item}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" {...icon}><path d="M5 4h4l2 5-2.500 1.500a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
