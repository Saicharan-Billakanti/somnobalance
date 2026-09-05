import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "../globals.css";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { CookieConsentProvider } from "@/components/CookieConsent";
import { AuthProvider } from "@/components/AuthProvider";
import { notFound } from "next/navigation";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SomnoBalance — Regeneration, Calm, Balance",
  description:
    "SomnoBalance is a regeneration and lifestyle brand. A holistic, sensory ritual system for calmer transitions into rest.",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang} className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <AuthProvider>
          <CookieConsentProvider dict={dict}>
            <CartProvider>
              <Header lang={lang as Locale} dict={dict} />
              <main className="flex-1">{children}</main>
              <Footer lang={lang as Locale} dict={dict} />
            </CartProvider>
          </CookieConsentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
