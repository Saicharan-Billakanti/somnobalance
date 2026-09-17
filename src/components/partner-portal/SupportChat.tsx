"use client";

import { useState } from "react";
import type { SupportMessage } from "@/lib/affiliateMockData";

const QUICK_ACTIONS = [
  "Ask about my commission",
  "Ask about a payout",
  "Ask about Stripe verification",
  "Report an incorrect order",
  "Contact support",
];

export function SupportChat({ initialMessages }: { initialMessages: SupportMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: `m${prev.length + 1}`, from: "affiliate", text, date: new Date().toISOString(), read: true },
    ]);
    setDraft("");
  }

  return (
    <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => send(action)}
            className="rounded-full border border-mauve/20 px-3 py-1.5 text-xs text-ink/70 transition hover:bg-sand"
          >
            {action}
          </button>
        ))}
      </div>

      <div className="mt-5 max-h-96 space-y-3 overflow-y-auto rounded-xl bg-sand/30 p-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "affiliate" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.from === "affiliate" ? "bg-mauve text-white" : "bg-white text-ink"
              }`}
            >
              <p>{m.text}</p>
              <p className={`mt-1 text-[10px] ${m.from === "affiliate" ? "text-white/70" : "text-ink/40"}`}>
                {new Date(m.date).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                {!m.read && m.from === "admin" && " · New"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          className="input-field flex-1"
        />
        <button type="submit" className="rounded-full bg-mauve px-5 py-2.5 text-sm text-white hover:bg-mauve-dark">
          Send
        </button>
      </form>
    </div>
  );
}
