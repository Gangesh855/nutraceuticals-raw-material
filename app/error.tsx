"use client";

// Route-level safety net: show a calm fallback instead of a blank error page.
export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="wrap" style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div>
        <p className="eyebrow">GK Botanical</p>
        <h1 style={{ fontSize: "var(--t-h1)", margin: "12px 0" }}>Something went wrong.</h1>
        <p style={{ color: "var(--sage)" }}>Please try again.</p>
        <p style={{ marginTop: 28 }}><button type="button" className="btn" onClick={reset}>Try again</button></p>
      </div>
    </main>
  );
}
