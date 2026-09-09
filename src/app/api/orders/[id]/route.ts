import { NextResponse } from "next/server";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "No database configured" }, { status: 503 });
  }

  const { id } = await params;
  const { data: order, error } = await getSupabase()
    .from("Order")
    .select("*, items:OrderItem(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
