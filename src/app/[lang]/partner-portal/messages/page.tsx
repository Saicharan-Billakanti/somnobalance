import { getSupportMessages } from "@/lib/affiliateMockData";
import { SupportChat } from "@/components/partner-portal/SupportChat";

export default function MessagesPage() {
  const messages = getSupportMessages();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Messages</h1>
      <p className="mt-2 text-ink/70">Get in touch with our support team about your affiliate account.</p>
      <div className="mt-8">
        <SupportChat initialMessages={messages} />
      </div>
    </div>
  );
}
