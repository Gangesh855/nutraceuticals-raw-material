"use client";

// Last-resort fallback (replaces the root layout), styled inline because global CSS may not have loaded.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#102D26", color: "#E8DCC4", fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", textAlign: "center" }}>
        <div style={{ padding: 24 }}>
          <p style={{ letterSpacing: ".3em", fontSize: 12, textTransform: "uppercase", color: "#D9B86C" }}>GK Botanical</p>
          <h1 style={{ fontWeight: 300, fontSize: 40, margin: "12px 0" }}>Something went wrong.</h1>
          <p style={{ opacity: 0.7 }}>Please reload the page.</p>
          <button type="button" onClick={reset} style={{ marginTop: 20, padding: "12px 28px", borderRadius: 999, border: "1px solid #D9B86C", background: "transparent", color: "#E8DCC4", cursor: "pointer" }}>Try again</button>
        </div>
      </body>
    </html>
  );
}
