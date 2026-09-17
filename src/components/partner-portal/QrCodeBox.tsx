"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QrCodeBox({ value }: { value: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, { width: 200, margin: 1, color: { dark: "#3a2f27", light: "#faf6ef" } })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-mauve/10 bg-white/60 p-5">
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- small client-generated data URL, not worth Next/Image's pipeline
        <img src={dataUrl} alt="QR code for your referral link" width={160} height={160} className="rounded-lg" />
      ) : (
        <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-sand/60 text-xs text-ink/40">
          Generating…
        </div>
      )}
      {dataUrl && (
        <a
          href={dataUrl}
          download="somnobalance-referral-qr.png"
          className="rounded-full border border-mauve/30 px-4 py-2 text-xs font-medium text-mauve-dark transition hover:bg-sand"
        >
          Download QR Code
        </a>
      )}
    </div>
  );
}
