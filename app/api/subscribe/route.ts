import { promises as dns } from "node:dns";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  WAITLIST_AI_FREQUENCY_VALUES,
  WAITLIST_ROLE_VALUES,
} from "../../../lib/waitlist-options";
import { SubscribeSchema, ToolsSchema } from "../../../lib/subscribe-schema";
import {
  isWaitlistProfileTokenConfigured,
  issueWaitlistProfileToken,
  verifyWaitlistProfileToken,
} from "../../../lib/waitlist-profile-token";

export const runtime = "nodejs";

const ProfileSchema = z
  .object({
    profile_token: z.string().min(1).max(2048),
    role: z.enum(WAITLIST_ROLE_VALUES),
    tools: ToolsSchema.optional(),
    ai_frequency: z.enum(WAITLIST_AI_FREQUENCY_VALUES).optional(),
  })
  .strict();

let adminSupabaseClient: SupabaseClient | null = null;
let hasLoggedMissingProfileConfig = false;
let hasLoggedMissingAgentsColumn = false;

// PostgREST reports a column that is not in its schema cache as PGRST204 (naming the column);
// Postgres itself as 42703. Either way the row can still be saved without that column.
function isMissingColumnError(error: { code?: string; message?: string }, column: string) {
  return (
    error.code === "42703" ||
    (error.code === "PGRST204" && (error.message || "").includes(`'${column}'`))
  );
}

function getAdminSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  if (!adminSupabaseClient) {
    adminSupabaseClient = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminSupabaseClient;
}

async function parseJson(request: Request) {
  try {
    return { body: (await request.json()) as unknown, error: null };
  } catch {
    return {
      body: null,
      error: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }),
    };
  }
}

async function hasValidMxRecord(domain: string) {
  try {
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords.length > 0;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const parsed = await parseJson(request);
  if (parsed.error) return parsed.error;

  const result = SubscribeSchema.safeParse(parsed.body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Invalid input" },
      { status: 400 },
    );
  }

  const { email, role, tools, ai_frequency, agents } = result.data;
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    if (process.env.NODE_ENV === "development") {
      console.info("Waitlist submission validated in development mode; no database is configured.");
      return NextResponse.json(
        {
          message: "Success (Development Mode)",
          profile_token: null,
          profile_available: false,
          development_mode: true,
        },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { error: "Waitlist is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const domain = email.split("@")[1];
  if (!(await hasValidMxRecord(domain))) {
    return NextResponse.json(
      { error: "This domain has no valid mail server. Check for typos." },
      { status: 400 },
    );
  }

  const country = request.headers.get("x-vercel-ip-country") || null;
  const city = request.headers.get("x-vercel-ip-city") || null;

  try {
    const lead = {
      email,
      role: role || null,
      tools: tools?.length ? tools : null,
      ai_frequency: ai_frequency || null,
      country,
      city,
    };
    // Landing textarea → leads.agents only (see supabase/migrations/20260914000000_add_leads_agents.sql).
    // If that column does not exist yet, the signup is still saved without it.
    let { error: insertError } = await supabase
      .from("leads")
      .insert([agents ? { ...lead, agents } : lead]);

    if (insertError && agents && isMissingColumnError(insertError, "agents")) {
      if (!hasLoggedMissingAgentsColumn) {
        console.error(
          "leads.agents is missing, so the landing page's answer was dropped. Run: alter table public.leads add column if not exists agents text;",
        );
        hasLoggedMissingAgentsColumn = true;
      }
      ({ error: insertError } = await supabase.from("leads").insert([lead]));
    }

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json({ error: "You are already on the waitlist!" }, { status: 409 });
      }
      throw insertError;
    }

    let profileToken: string | null = null;
    const profileConfigured = Boolean(
      getAdminSupabaseClient() && isWaitlistProfileTokenConfigured(),
    );
    if (!profileConfigured && process.env.NODE_ENV === "production" && !hasLoggedMissingProfileConfig) {
      console.error(
        "Waitlist questionnaire is disabled: configure SUPABASE_SERVICE_ROLE_KEY and a 32-byte WAITLIST_PROFILE_SECRET.",
      );
      hasLoggedMissingProfileConfig = true;
    }

    if (profileConfigured) {
      try {
        profileToken = issueWaitlistProfileToken(email);
      } catch (tokenError) {
        console.error("Waitlist questionnaire token error:", tokenError);
      }
    }

    return NextResponse.json(
      {
        message: "Success",
        profile_token: profileToken,
        profile_available: Boolean(profileToken),
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Waitlist database error:", error);
    return NextResponse.json({ error: "System error, please try again." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const parsed = await parseJson(request);
  if (parsed.error) return parsed.error;

  const result = ProfileSchema.safeParse(parsed.body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Invalid input" },
      { status: 400 },
    );
  }

  if (!isWaitlistProfileTokenConfigured()) {
    return NextResponse.json(
      { error: "Your signup is saved, but the questionnaire is temporarily unavailable." },
      { status: 503 },
    );
  }

  const email = verifyWaitlistProfileToken(result.data.profile_token);
  if (!email) {
    return NextResponse.json(
      { error: "This questionnaire link has expired. Your waitlist signup is still saved." },
      { status: 401 },
    );
  }

  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Your signup is saved, but the questionnaire is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const { data, error: updateError } = await supabase
      .from("leads")
      .update({
        role: result.data.role,
        tools: result.data.tools?.length ? result.data.tools : null,
        ai_frequency: result.data.ai_frequency || null,
      })
      .eq("email", email)
      .select("id");

    if (updateError) throw updateError;
    if (!data?.length) {
      return NextResponse.json({ error: "Waitlist signup not found." }, { status: 404 });
    }
    if (data.length !== 1) {
      throw new Error("Waitlist questionnaire update affected an unexpected number of rows.");
    }

    return NextResponse.json({ message: "Preferences saved." }, { status: 200 });
  } catch (error) {
    console.error("Waitlist questionnaire error:", error);
    return NextResponse.json(
      { error: "Your signup is saved, but we could not save these answers." },
      { status: 500 },
    );
  }
}
