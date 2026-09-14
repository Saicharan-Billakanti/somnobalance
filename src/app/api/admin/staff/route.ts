import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminOrPartnerAccess } from "@/lib/adminAuth";
import {
  getStaffAccounts,
  createStaffAccount,
  updateStaffStatus,
  deleteStaffAccount,
  type StaffRole,
} from "@/lib/storeService";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminOrPartnerAccess(session))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const staff = await getStaffAccounts();
  return NextResponse.json({ staff });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminOrPartnerAccess(session))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { action } = body;

  if (action === "create") {
    const { name, email, role, roleTitle, department } = body;
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required." },
        { status: 400 }
      );
    }

    const staff = await createStaffAccount({
      name,
      email,
      role: role as StaffRole,
      roleTitle,
      department,
    });
    return NextResponse.json({ success: true, staff });
  }

  if (action === "update_status") {
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required." }, { status: 400 });
    }
    const staff = await updateStaffStatus(id, status as "active" | "suspended");
    return NextResponse.json({ success: true, staff });
  }

  if (action === "delete") {
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }
    await deleteStaffAccount(id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
