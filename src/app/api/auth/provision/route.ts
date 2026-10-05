import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { getSupabaseServer } from "@/lib/supabase-server";
import { hashPassword } from "@/lib/auth";

const schema = z.object({
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
});

export async function POST(request: Request) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const authClient = await getSupabaseServer();
  const { data: authData } = await authClient.auth.getUser();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  const verifiedEmail = authData.user?.email || String(authData.user?.user_metadata?.email || "");
  if (!authData.user || !verifiedEmail || !parsed.success || verifiedEmail.toLowerCase() !== parsed.data.email.toLowerCase()) {
    return NextResponse.json({ error: "Verified email and profile details are required." }, { status: 400 });
  }

  const profile = parsed.data;
  const supabase = getSupabase();
  const { data: existing } = await supabase.from("User").select("id").eq("email", profile.email.toLowerCase()).maybeSingle();
  if (existing) return NextResponse.json({ success: true });

  const { error } = await supabase.from("User").insert({
    id: authData.user.id,
    email: profile.email.toLowerCase(),
    passwordHash: await hashPassword("supabase-auth-managed"),
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone || null,
    role: "customer",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
