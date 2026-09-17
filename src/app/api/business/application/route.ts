import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import {
  getBusinessApplicationByEmail,
  getBusinessApplicationById,
  submitBusinessApplication,
  addCatalogProductToBusiness,
} from "@/lib/businessService";
import { getCombinedProducts } from "@/lib/storeService";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return NextResponse.json({ application: null, catalog: await getCombinedProducts() });
  }

  const { searchParams } = new URL(request.url);
  const requestedId = searchParams.get("id");
  const requestedEmail = searchParams.get("email")?.trim().toLowerCase();
  const application = requestedId
    ? await getBusinessApplicationById(requestedId)
    : await getBusinessApplicationByEmail(requestedEmail || user.email);

  if (application && application.email.toLowerCase() !== user.email.toLowerCase()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json({ application, catalog: await getCombinedProducts() });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Please log in or sign up before sending a business request so we can keep track of it." },
      { status: 401 }
    );
  }

  if (body.action === "add_catalog_product") {
    const application = user.email ? await getBusinessApplicationByEmail(user.email) : null;
    if (!application || application.status !== "approved") {
      return NextResponse.json({ error: "Your approved business account is required." }, { status: 403 });
    }
    const product = (await getCombinedProducts()).find((item: any) =>
      item.slug === body.productSlug || item.id === body.productId
    );
    if (!product) return NextResponse.json({ error: "Catalog product was not found." }, { status: 404 });
    const assigned = await addCatalogProductToBusiness({
      applicationId: application.id,
      product,
      discountRate: Number(application.discountRate || 20),
    });
    const updated = await getBusinessApplicationById(application.id);
    return NextResponse.json({ success: true, product: assigned, application: updated });
  }

  const { companyName, contactName, email, phone, businessType, vatId, address, city, country, estimatedVolume, notes } = body;

  if (!companyName || !contactName || !email) {
    return NextResponse.json({ error: "Company name, contact name, and email are required" }, { status: 400 });
  }

  try {
    const app = await submitBusinessApplication({
      userId: user.id,
      companyName,
      contactName,
      email,
      phone,
      businessType,
      vatId,
      address,
      city,
      country,
      estimatedVolume,
      notes,
    });

    return NextResponse.json({ success: true, application: app });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit application" }, { status: 500 });
  }
}
