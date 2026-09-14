import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminOrPartnerAccess } from "@/lib/adminAuth";
import { createCustomProduct, deleteCustomProduct, getCombinedProducts } from "@/lib/storeService";

export async function GET() {
  const products = await getCombinedProducts();
  return NextResponse.json({ products });
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
    const {
      name,
      category,
      price,
      tagline,
      description,
      image,
      phase,
      details,
      ingredients,
      shippingIncluded,
      returnPeriodDays,
      refundPolicy,
      returnEligible,
      refundRules,
      maxRetailQuantity,
    } = body;
    if (!name || price === undefined) {
      return NextResponse.json({ error: "Product name and price are required" }, { status: 400 });
    }
    const product = await createCustomProduct({
      name,
      category,
      price: Number(price),
      tagline,
      description,
      image,
      phase,
      details,
      ingredients,
      shippingIncluded: Boolean(shippingIncluded),
      returnPeriodDays: returnPeriodDays !== undefined ? Number(returnPeriodDays) : 30,
      refundPolicy: refundPolicy || "30-Day Money-Back Guarantee",
      returnEligible: returnEligible !== undefined ? Boolean(returnEligible) : true,
      refundRules: refundRules || "Hygienic seal must be intact upon return; items must be in original condition and packaging.",
      maxRetailQuantity: maxRetailQuantity !== undefined ? Number(maxRetailQuantity) : 10,
    });
    return NextResponse.json({ success: true, product });
  }

  if (action === "delete") {
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "Product id required" }, { status: 400 });
    }
    await deleteCustomProduct(id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
