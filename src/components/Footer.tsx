import Link from "next/link";
import { business } from "@/lib/site";

const legal = [
  { href: "/legal/impressum", label: "Impressum" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/shipping", label: "Shipping & Delivery" },
  { href: "/legal/withdrawal", label: "Right of Withdrawal" },
  { href: "/legal/returns", label: "Refund & Return Policy" },
  { href: "/legal/cancellation", label: "Cancellation Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
];

const explore = [
  { href: "/for-me", label: "For me" },
  { href: "/for-business", label: "For my business" },
  { href: "/partner", label: "Become a partner" },
  { href: "/shop", label: "Shop" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-mauve/10 bg-sand/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="font-serif text-lg text-mauve-dark">SomnoBalance</div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/70">
            Regeneration begins long before you fall asleep. A calm, sensory system for
            transitioning into rest.
          </p>
        </div>

        <div>
          <div className="text-sm font-medium text-ink">Explore</div>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            {explore.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-mauve-dark">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium text-ink">Legal</div>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-mauve-dark">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium text-ink">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li>{business.email}</li>
            <li>{business.addressLine2}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-mauve/10 px-4 py-5 text-center text-xs text-ink/50 sm:px-6">
        © {new Date().getFullYear()} SomnoBalance. All rights reserved.
      </div>
    </footer>
  );
}
