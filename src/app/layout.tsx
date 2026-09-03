import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { CookieConsentProvider } from "@/components/CookieConsent";
import { AuthProvider } from "@/components/AuthProvider";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <AuthProvider>
          <CookieConsentProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </CookieConsentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
