import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json({ error: "Supabase Auth is not configured." }, { status: 503 });
  }

  return NextResponse.json(
    { url, anonKey },
    { headers: { "Cache-Control": "no-store" } }
  );
}
