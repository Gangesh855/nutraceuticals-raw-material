import { NextResponse } from "next/server";
import { validateContact, type ContactInput } from "@/lib/contact";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

// Best-effort per-instance rate limit (use a shared store such as Redis/KV for multi-instance production).
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

const clean = (s: unknown, max: number) => (typeof s === "string" ? s.slice(0, max) : "");
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  // Honeypot: bots fill the hidden field. Pretend success and drop it.
  if (typeof body.website === "string" && body.website.length > 0) return NextResponse.json({ ok: true });

  const input: ContactInput = {
    name: clean(body.name, 200), company: clean(body.company, 200), email: clean(body.email, 300),
    interest: clean(body.interest, 100), message: clean(body.message, 4000),
  };
  const errors = validateContact(input);
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please check the highlighted fields.", errors }, { status: 422 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] (dev, email not configured)", input);
      return NextResponse.json({ ok: true });
    }
    console.error("[contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL are not set");
    return NextResponse.json({ error: `We couldn't send your message right now. Please email ${SITE.email}.` }, { status: 503 });
  }

  const text = [
    `Name: ${oneLine(input.name)}`,
    `Company: ${oneLine(input.company) || "-"}`,
    `Email: ${oneLine(input.email)}`,
    `Interest: ${oneLine(input.interest) || "-"}`,
    "",
    input.message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from, to: [to], reply_to: oneLine(input.email),
      subject: `Website enquiry: ${oneLine(input.interest) || "General"} — ${oneLine(input.name)}`.slice(0, 200),
      text,
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.error("[contact] send failed", res?.status);
    return NextResponse.json({ error: `We couldn't send your message right now. Please email ${SITE.email}.` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
