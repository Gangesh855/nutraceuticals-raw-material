"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS } from "@/lib/products";
import { validateContact, LIMITS, type ContactInput, type FieldErrors } from "@/lib/contact";

const EMPTY: ContactInput = { name: "", company: "", email: "", interest: "", message: "" };
type Status = "idle" | "sending" | "success" | "error";

const field = "w-full rounded-xl border border-white/12 bg-white/[.04] px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none backdrop-blur transition-[border-color,box-shadow,background] duration-300 focus:border-emerald-400/70 focus:bg-white/[.07] focus:shadow-glow";

export default function ContactForm() {
  const [v, setV] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [honey, setHoney] = useState("");

  const set = (k: keyof ContactInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setV((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const errs = validateContact(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending"); setServerMsg("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, website: honey }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setStatus("success"); setV(EMPTY); return; }
      if (data.errors) setErrors(data.errors);
      setServerMsg(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const err = (k: keyof ContactInput) => errors[k] && <p id={`${k}-err`} role="alert" className="mt-1.5 text-xs text-red-300">{errors[k]}</p>;
  const a11y = (k: keyof ContactInput) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <div id="contact-form" className="glass glow-edge relative mx-auto w-full max-w-3xl scroll-mt-32 p-6 text-left md:p-10">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-10 text-center" role="status">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-emerald-400/60 bg-emerald-500/15 shadow-glow">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }} /></svg>
            </div>
            <h3 className="font-display text-4xl">Message received.</h3>
            <p className="mx-auto mt-3 max-w-sm text-ivory/65">Thank you — our team will reply within one business day.</p>
            <button type="button" onClick={() => setStatus("idle")} className="mt-8 font-mono text-[11px] uppercase tracking-[.2em] text-gold-200 hover:text-emerald-400">Send another →</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 md:grid-cols-2" aria-label="Contact GK Botanicals">
            <div className="md:col-span-2">
              <h3 className="font-display text-3xl md:text-4xl">Request a sample or quote</h3>
              <p className="mt-2 text-sm text-ivory/55">Tell us what you&apos;re formulating. We reply within one business day.</p>
            </div>
            <div>
              <label htmlFor="cf-name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[.2em] text-ivory/55">Name *</label>
              <input id="cf-name" name="name" autoComplete="name" required maxLength={LIMITS.name} value={v.name} onChange={set("name")} className={field} placeholder="Jane Doe" {...a11y("name")} />
              {err("name")}
            </div>
            <div>
              <label htmlFor="cf-company" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[.2em] text-ivory/55">Company</label>
              <input id="cf-company" name="company" autoComplete="organization" maxLength={LIMITS.company} value={v.company} onChange={set("company")} className={field} placeholder="Acme Nutrition" {...a11y("company")} />
              {err("company")}
            </div>
            <div>
              <label htmlFor="cf-email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[.2em] text-ivory/55">Work email *</label>
              <input id="cf-email" name="email" type="email" autoComplete="email" required maxLength={LIMITS.email} value={v.email} onChange={set("email")} className={field} placeholder="jane@acme.com" {...a11y("email")} />
              {err("email")}
            </div>
            <div>
              <label htmlFor="cf-interest" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[.2em] text-ivory/55">Interested in</label>
              <select id="cf-interest" name="interest" value={v.interest} onChange={set("interest")} className={`${field} appearance-none`} {...a11y("interest")}>
                <option value="" className="bg-charcoal-900">Select an extract</option>
                {PRODUCTS.map((p) => <option key={p.slug} value={p.name} className="bg-charcoal-900">{p.name}</option>)}
                <option value="Other" className="bg-charcoal-900">Other</option>
              </select>
              {err("interest")}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="cf-message" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[.2em] text-ivory/55">Message *</label>
              <textarea id="cf-message" name="message" rows={5} required maxLength={LIMITS.message} value={v.message} onChange={set("message")} className={`${field} resize-y`} placeholder="Specification, volumes, target market…" {...a11y("message")} />
              {err("message")}
            </div>
            {/* Honeypot — hidden from people and assistive tech */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>Website<input tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} /></label>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-2">
              <p role="alert" className="min-h-5 text-sm text-red-300">{status === "error" ? serverMsg : ""}</p>
              <button type="submit" disabled={status === "sending"} className="rounded-full border border-gold-400/70 bg-gold-400/15 px-10 py-4 font-mono text-xs uppercase tracking-[.2em] text-gold-200 shadow-gold backdrop-blur-md transition-all duration-500 hover:bg-gold-400/30 disabled:cursor-wait disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Send message →"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
