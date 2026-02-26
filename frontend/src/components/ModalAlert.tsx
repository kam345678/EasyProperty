"use client";
import React from "react";

type ModalProps = {
  open: boolean;
  type?: "success" | "error" | "info";
  title?: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
  onConfirm?: () => void;
};

export default function ModalAlert({
  open,
  type = "info",
  title,
  message,
  onClose,
  onConfirm,
  autoClose = false,
  duration = 2000,
}: ModalProps) {
  React.useEffect(() => {
    if (autoClose && open) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, open, duration, onClose]);

  if (!open) return null;

  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";

  // ── Icon ring & accent colours ──────────────────────────────────────────────
  const iconRing =
    type === "success"
      ? "bg-green-50 ring-4 ring-green-100"
      : type === "error"
        ? "bg-red-50 ring-4 ring-red-100"
        : "bg-blue-50 ring-4 ring-blue-100";

  // ── Confirm button ───────────────────────────────────────────────────────────
  const confirmBtn =
    type === "success"
      ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
      : type === "error"
        ? "bg-red-500 hover:bg-red-600 shadow-red-200"
        : "bg-blue-500 hover:bg-blue-600 shadow-blue-200";

  // ── Close button ─────────────────────────────────────────────────────────────
  const closeBtn =
    type === "success"
      ? "bg-green-500 hover:bg-green-600 shadow-green-200"
      : type === "error"
        ? "bg-red-500 hover:bg-red-600 shadow-red-200"
        : "bg-blue-500 hover:bg-blue-600 shadow-blue-200";

  // ── Top accent bar ────────────────────────────────────────────────────────────
  const accentBar =
    type === "success"
      ? "from-emerald-400 to-green-500"
      : type === "error"
        ? "from-red-400 to-rose-500"
        : "from-blue-400 to-sky-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      {/* Card */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Top accent bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${accentBar}`} />

        <div className="px-8 pb-8 pt-7 text-center">
          {/* Icon */}
          <div
            className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${iconRing}`}
          >
            {icon}
          </div>

          {/* Title */}
          <h2 className="mb-2 text-[1.1rem] font-bold tracking-tight text-gray-800">
            {title ||
              (type === "success"
                ? "สำเร็จ"
                : type === "error"
                  ? "เกิดข้อผิดพลาด"
                  : "แจ้งเตือน")}
          </h2>

          {/* Message */}
          <p className="mb-6 text-sm leading-relaxed text-gray-500">{message}</p>

          {/* Buttons */}
          <div className="flex flex-col gap-2.5">
            {onConfirm && (
              <button
                onClick={onConfirm}
                className={`w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-150 active:scale-95 ${confirmBtn}`}
              >
                ยืนยัน
              </button>
            )}
            <button
              onClick={onClose}
              className={`w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-150 active:scale-95 ${closeBtn}`}
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}