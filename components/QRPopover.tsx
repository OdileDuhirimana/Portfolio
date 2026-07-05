"use client";
import QRCode from "react-qr-code";
import { useEffect, useRef, useState } from "react";

export default function QRPopover({ url, label = "QR" }: { url: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    // Return focus to the trigger so keyboard users don't lose their place
    // once the popover disappears.
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 ring-(--focus)"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Show QR code"
      >
        {label}
      </button>
      {open ? (
        <div className="absolute inset-0 z-20 grid place-items-center pointer-events-none">
          <div
            ref={popoverRef}
            role="dialog"
            aria-modal="false"
            aria-label="QR code"
            className="pointer-events-auto rounded-2xl border border-(--line) bg-(--panel) p-3 shadow-lg"
          >
            <div className="p-2 rounded-xl bg-black">
              <QRCode value={url} size={148} style={{ height: "auto", maxWidth: "100%", width: "148px" }} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
