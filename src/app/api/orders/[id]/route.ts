import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "No database configured" }, { status: 503 });
  }

  const { id } = await params;
  const order = await getPrisma().order.findUnique({ where: { id }, include: { items: true } });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
