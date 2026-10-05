import { getSupportMessages } from "@/lib/affiliateMockData";
import { SupportChat } from "@/components/partner-portal/SupportChat";

export default async function MessagesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const messages = getSupportMessages();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{tx("Messages", "Nachrichten")}</h1>
      <p className="mt-2 text-ink/70">{tx("Get in touch with our support team about your affiliate account.", "Kontaktieren Sie unser Support-Team zu Ihrem Partnerkonto.")}</p>
      <div className="mt-8">
        <SupportChat initialMessages={messages} />
      </div>
    </div>
  );
}
