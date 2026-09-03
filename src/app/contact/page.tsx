import { business } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Contact — SomnoBalance" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">Contact</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">We&apos;d like to hear from you</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/70">
        Questions about an order, a wholesale enquiry, or a partnership — reach us directly.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-ink">Email</h3>
          <p className="mt-1 text-ink/70">{business.email}</p>
          <p className="text-ink/70">{business.supportEmail}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-ink">Phone</h3>
          <p className="mt-1 text-ink/70">{business.phone}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-ink">Postal address</h3>
          <p className="mt-1 text-ink/70">
            {business.legalEntityName}
            <br />
            {business.addressLine1}
            <br />
            {business.addressLine2}
          </p>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
