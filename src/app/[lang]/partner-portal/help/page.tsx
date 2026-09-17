import Link from "next/link";
import { getNotifications } from "@/lib/affiliateMockData";
import { NotificationsList } from "@/components/partner-portal/NotificationsList";

export default async function HelpPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const notifications = getNotifications();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Help</h1>

      <h2 className="mt-8 font-serif text-xl text-ink">Notifications</h2>
      <div className="mt-4">
        <NotificationsList notifications={notifications} />
      </div>

      <h2 className="mt-10 font-serif text-xl text-ink">Common questions</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <h3 className="font-medium text-ink">How is my commission calculated?</h3>
          <p className="mt-2 text-sm text-ink/70">
            Commission is calculated as a percentage of the order value placed through your referral link or coupon
            code. It becomes available for payout after the configured approval period, and refunded or cancelled
            orders do not produce an active commission.
          </p>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <h3 className="font-medium text-ink">When will I receive my payout?</h3>
          <p className="mt-2 text-sm text-ink/70">
            Once your available balance reaches the minimum payout threshold and your selected payout method
            (Stripe Connect or bank transfer) is fully verified, you can request a payout from the Payouts section.
          </p>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <h3 className="font-medium text-ink">Why does Stripe show &ldquo;verification required&rdquo;?</h3>
          <p className="mt-2 text-sm text-ink/70">
            Stripe sometimes asks for additional identity or bank information after the initial onboarding. Continue
            the verification directly in Stripe&rsquo;s hosted flow from the Payment Settings page.
          </p>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <h3 className="font-medium text-ink">Still need help?</h3>
          <p className="mt-2 text-sm text-ink/70">
            Reach out directly through the{" "}
            <Link href={`/${lang}/partner-portal/messages`} className="text-mauve-dark underline">
              Messages
            </Link>{" "}
            section and our support team will get back to you.
          </p>
        </div>
      </div>
    </div>
  );
}
