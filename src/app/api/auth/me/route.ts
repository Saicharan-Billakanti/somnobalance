import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user }, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Vary": "Cookie",
    },
  });
}
