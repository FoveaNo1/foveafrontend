import { promises as dns } from "node:dns";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { InterestSchema } from "../../../lib/interest-schema";

// "Hear about it first" (the landing page's Next section). Writes one row per (email, interest) to
// public.lead_interests (supabase/migrations/20261010000000_lead_interests.sql). A repeat sign-up
// succeeds quietly, so the answer never says whether an email is already known. Kept apart from
// /api/subscribe, whose waitlist form and 409 path stay as they are.

export const runtime = "nodejs";

let client: SupabaseClient | null = null;
function getAdminSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return client;
}

async function hasValidMxRecord(domain: string) {
  try {
    return (await dns.resolveMx(domain)).length > 0;
  } catch {
    return false;
  }
}

const done = () => NextResponse.json({ ok: true }, { status: 200 });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = InterestSchema.safeParse(body);
  if (!result.success) {
    // A filled honeypot gets the same answer as a real sign-up, and nothing is written.
    if ((body as { company?: unknown } | null)?.company) return done();
    return NextResponse.json({ error: "That doesn't look like an email address." }, { status: 400 });
  }

  const { email, interest } = result.data;
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    if (process.env.NODE_ENV === "development") {
      console.info("Interest sign-up validated in development mode; no database is configured.");
      return done();
    }
    return NextResponse.json({ error: "That didn't go through. Try again in a moment." }, { status: 503 });
  }

  if (!(await hasValidMxRecord(email.split("@")[1]))) {
    return NextResponse.json({ error: "That doesn't look like an email address." }, { status: 400 });
  }

  const { error } = await supabase.from("lead_interests").upsert(
    [
      {
        email,
        interest,
        country: request.headers.get("x-vercel-ip-country") || null,
        city: request.headers.get("x-vercel-ip-city") || null,
      },
    ],
    { onConflict: "email,interest", ignoreDuplicates: true },
  );
  if (error) {
    console.error("Interest sign-up failed:", error);
    return NextResponse.json({ error: "That didn't go through. Try again in a moment." }, { status: 500 });
  }
  return done();
}
