import type { NotificationEntry } from "@/lib/affiliateMockData";

export function NotificationsList({ notifications }: { notifications: NotificationEntry[] }) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-mauve/10 bg-white/60 p-10 text-center">
        <p className="text-ink/70">You are all caught up.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-mauve/10 rounded-2xl border border-mauve/10 bg-white/60">
      {notifications.map((n) => (
        <li key={n.id} className="flex items-start gap-3 px-5 py-4">
          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-mauve" aria-hidden="true" />}
          <div className={n.read ? "ml-5" : ""}>
            <p className="text-sm text-ink/80">{n.message}</p>
            <p className="mt-1 text-xs text-ink/40">
              {new Date(n.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
