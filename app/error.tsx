"use client";

// Route-level safety net: if something unexpected throws on the client, show a calm fallback instead of a blank error page.
export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="section grid min-h-[70vh] place-items-center text-center">
      <div>
        <p className="eyebrow mb-4">GK Botanicals</p>
        <h1 className="h-display text-5xl md:text-6xl">Something went wrong.</h1>
        <p className="mx-auto mt-5 max-w-md text-ivory/65">Please try again. If it keeps happening, email us at sales@gkbotanicals.com.</p>
        <button type="button" onClick={reset} className="mt-8 rounded-full border border-gold-400/60 px-8 py-3 font-mono text-xs uppercase tracking-[.2em] text-gold-200 transition-colors hover:bg-gold-400/15">Try again</button>
      </div>
    </main>
  );
}
