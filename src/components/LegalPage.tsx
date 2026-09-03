import Link from "next/link";

const pages = [
  { href: "/legal/impressum", label: "Impressum" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/shipping", label: "Shipping & Delivery" },
  { href: "/legal/returns", label: "Returns & Withdrawal" },
  { href: "/legal/cookies", label: "Cookie Policy" },
];

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="grid gap-12 md:grid-cols-[200px_1fr]">
        <nav className="hidden md:block">
          <div className="sticky top-24 space-y-1 text-sm">
            {pages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="block rounded-lg px-3 py-2 text-ink/60 hover:bg-sand hover:text-mauve-dark"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </nav>
        <div>
          <h1 className="font-serif text-3xl text-ink">{title}</h1>
          <p className="mt-2 text-xs text-ink/40">Last updated: {updated}</p>
          <div className="prose-legal mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
