import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminOrPartnerAccess } from "@/lib/adminAuth";
import { getStoreSettings, updateStoreSettings } from "@/lib/storeService";

export async function GET() {
  const settings = await getStoreSettings();
  return NextResponse.json({ settings });
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

  const updated = await updateStoreSettings({
    vatRateStandard: Number(body.vatRateStandard ?? 19),
    vatRateReduced: Number(body.vatRateReduced ?? 7),
    pricesIncludeTax: Boolean(body.pricesIncludeTax ?? true),
    shippingFlatRate: Number(body.shippingFlatRate ?? 4.9),
    freeShippingThreshold: Number(body.freeShippingThreshold ?? 59),
    deliveryCourier: body.deliveryCourier || "DHL GoGreen",
    estimatedDeliveryDays: body.estimatedDeliveryDays || "1-3 Business Days",
  });

  return NextResponse.json({ success: true, settings: updated });
}
