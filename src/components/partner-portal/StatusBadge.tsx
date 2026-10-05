"use client";

import { useLang } from "@/lib/useLang";

const STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-green-100 text-green-800",
  suspended: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
  approved: "bg-blue-100 text-blue-800",
  available: "bg-green-100 text-green-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-700",
  refunded: "bg-gray-200 text-gray-700",
  requested: "bg-blue-100 text-blue-800",
  processing: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-800",
  connected: "bg-green-100 text-green-800",
  restricted: "bg-amber-100 text-amber-800",
  paused: "bg-red-100 text-red-800",
  not_connected: "bg-gray-200 text-gray-700",
};

const LABELS_DE: Record<string, string> = {
  pending: "Ausstehend",
  active: "Aktiv",
  suspended: "Gesperrt",
  rejected: "Abgelehnt",
  approved: "Genehmigt",
  available: "Verfügbar",
  paid: "Ausgezahlt",
  cancelled: "Storniert",
  refunded: "Erstattet",
  requested: "Angefordert",
  processing: "In Bearbeitung",
  failed: "Fehlgeschlagen",
  connected: "Verbunden",
  restricted: "Eingeschränkt",
  paused: "Pausiert",
  not_connected: "Nicht verbunden",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const { lang } = useLang();
  const style = STYLES[status] ?? "bg-gray-200 text-gray-700";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${style}`}>
      {label ?? (lang === "de" ? (LABELS_DE[status] ?? status.replace(/_/g, " ")) : status.replace(/_/g, " "))}
    </span>
  );
}
