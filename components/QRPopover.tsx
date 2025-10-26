"use client";
import QRCode from "react-qr-code";
import { useState } from "react";

export default function QRPopover({ url, label = "QR" }: { url: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5"
        aria-expanded={open}
        aria-label="Show QR code"
      >
        {label}
      </button>
      {open ? (
        <div className="absolute inset-0 z-20 grid place-items-center pointer-events-none">
          <div className="pointer-events-auto rounded-2xl border border-(--line) bg-(--panel) p-3 shadow-lg">
            <div className="p-2 rounded-xl bg-black">
              <QRCode value={url} size={148} style={{ height: "auto", maxWidth: "100%", width: "148px" }} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
