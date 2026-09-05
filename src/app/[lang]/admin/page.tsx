import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ADMIN_COOKIE_NAME, adminConfigured, verifySessionCookieValue } from "@/lib/adminAuth";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { formatPrice } from "@/lib/products";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type AdminOrderItem = { id: string; slug: string; name: string; price: number; qty: number };
type AdminOrder = {
  id: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  firstName: string;
  lastName: string;
  email: string;
  total: number;
  items: AdminOrderItem[];
};
type AdminMessage = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  topic: string;
  message: string;
};

async function loadAdminData(supabase: ReturnType<typeof getSupabase>) {
  const [ordersRes, messagesRes] = await Promise.all([
    supabase
      .from("Order")
      .select("*, items:OrderItem(*)")
      .order("createdAt", { ascending: false })
      .limit(50)
      .returns<AdminOrder[]>(),
    supabase
      .from("ContactMessage")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(50)
      .returns<AdminMessage[]>(),
  ]);
  if (ordersRes.error) throw ordersRes.error;
  if (messagesRes.error) throw messagesRes.error;
  return { orders: ordersRes.data ?? [], messages: messagesRes.data ?? [] };
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
  if (!verifySessionCookieValue(session)) {
    redirect(`/${lang}/admin/login`);
  }

  const dbConfigured = supabaseConfigured();

  let loadError: string | null = null;
  let data: Awaited<ReturnType<typeof loadAdminData>> | null = null;

  if (dbConfigured) {
    try {
      data = await loadAdminData(getSupabase());
    } catch {
      loadError = dict.admin.loadError;
    }
  }

  const orders = data?.orders ?? [];
  const messages = data?.messages ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink">{dict.admin.title}</h1>
          <p className="mt-1 text-sm text-ink/50">{dict.admin.subtitle}</p>
        </div>
        <a
          href="/api/admin/logout"
          className="rounded-full border border-mauve/30 px-4 py-2 text-sm text-mauve-dark hover:bg-sand"
        >
          {dict.admin.logout}
        </a>
      </div>

      {!dbConfigured && (
        <p className="mt-8 rounded-xl border border-teal/20 bg-teal/5 p-4 text-sm text-ink/70">
          {dict.admin.noDb}
        </p>
      )}

      {loadError && (
        <p className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </p>
      )}

      <section className="mt-10">
        <h2 className="font-serif text-xl text-ink">
          {dict.admin.orders} ({orders.length})
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-mauve/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-sand/50 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">{dict.admin.date}</th>
                <th className="px-4 py-3">{dict.admin.customer}</th>
                <th className="px-4 py-3">{dict.admin.items}</th>
                <th className="px-4 py-3">{dict.admin.total}</th>
                <th className="px-4 py-3">{dict.admin.payment}</th>
                <th className="px-4 py-3">{dict.admin.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mauve/10">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 text-ink/70">
                    {new Date(order.createdAt).toLocaleString("de-DE")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-ink">
                      {order.firstName} {order.lastName}
                    </div>
                    <div className="text-xs text-ink/50">{order.email}</div>
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {order.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                  </td>
                  <td className="px-4 py-3 font-medium text-mauve-dark">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3 text-ink/70">{order.paymentMethod}</td>
                  <td className="px-4 py-3 text-ink/70">{order.status}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-ink/50">
                    {dict.admin.noOrders}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-xl text-ink">
          {dict.admin.messages} ({messages.length})
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-mauve/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-sand/50 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">{dict.admin.date}</th>
                <th className="px-4 py-3">{dict.admin.from}</th>
                <th className="px-4 py-3">{dict.admin.topic}</th>
                <th className="px-4 py-3">{dict.admin.message}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mauve/10">
              {messages.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 text-ink/70">
                    {new Date(m.createdAt).toLocaleString("de-DE")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-ink">{m.name}</div>
                    <div className="text-xs text-ink/50">{m.email}</div>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{m.topic}</td>
                  <td className="px-4 py-3 text-ink/70">{m.message}</td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-ink/50">
                    {dict.admin.noMessages}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
