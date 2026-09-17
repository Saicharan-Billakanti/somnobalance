import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ADMIN_COOKIE_NAME, adminConfigured, verifyAdminOrPartnerAccess } from "@/lib/adminAuth";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { getAllOrders } from "@/lib/userService";
import { getAllAdminAffiliateData } from "@/lib/affiliateService";
import { getAllBusinessApplications } from "@/lib/businessService";
import { getStoreSettings, getCombinedProducts, getStaffAccounts } from "@/lib/storeService";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

async function loadContactMessages(supabase: ReturnType<typeof getSupabase>) {
  const { data } = await supabase
    .from("ContactMessage")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(50);
  return data ?? [];
}

export default async function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  if (!adminConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-2xl text-ink">{dict.admin.notConfiguredTitle}</h1>
        <p className="mt-3 text-ink/70">{dict.admin.notConfiguredCopy}</p>
      </div>
    );
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthorized = await verifyAdminOrPartnerAccess(session);
  if (!isAuthorized) {
    redirect(`/${lang}/login?redirect=/${lang}/admin`);
  }

  const dbConfigured = supabaseConfigured();

  let messages: any[] = [];
  if (dbConfigured) {
    try {
      messages = await loadContactMessages(getSupabase());
    } catch {}
  }

  const [
    orders,
    { affiliates, coupons, commissions, payouts },
    businessApps,
    storeSettings,
    allProducts,
    staffAccounts,
  ] = await Promise.all([
    getAllOrders(),
    getAllAdminAffiliateData(),
    getAllBusinessApplications(),
    getStoreSettings(),
    getCombinedProducts(),
    getStaffAccounts(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mauve/15 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal/15 px-3 py-0.5 text-xs font-semibold tracking-wider text-teal-dark uppercase">
              SomnoBalance Admin Hub
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">{dict.admin.title}</h1>
          <p className="text-sm text-ink/60">{dict.admin.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/${lang}`}
            className="rounded-full border border-mauve/20 bg-white px-4 py-2 text-xs font-medium text-ink/80 hover:bg-sand transition"
          >
            ← View Storefront
          </a>
          <a
            href="/api/admin/logout"
            className="rounded-full bg-mauve px-4 py-2 text-xs font-medium text-white hover:bg-mauve-dark transition"
          >
            {dict.admin.logout}
          </a>
        </div>
      </div>

      <div className="mt-8">
        <AdminDashboardClient
          lang={lang as Locale}
          dict={dict}
          initialOrders={orders}
          initialMessages={messages}
          initialAffiliates={affiliates}
          initialCoupons={coupons}
          initialCommissions={commissions}
          initialPayouts={payouts}
          initialBusinessApps={businessApps}
          initialStoreSettings={storeSettings}
          initialProducts={allProducts}
          initialStaff={staffAccounts}
        />
      </div>
    </div>
  );
}


