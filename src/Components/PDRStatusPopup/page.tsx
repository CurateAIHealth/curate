"use client";

import { Loader2, AlertCircle, X } from "lucide-react";

type PopupProps = {
  open: boolean;
  loading?: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;   // 👈 add this
};

export default function StatusPopup({
  open,
  loading = false,
  title = "Action Required",
  message,
  onClose,
}: PopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[360px] rounded-2xl bg-white shadow-xl p-6 text-center animate-in fade-in zoom-in-95">

    
        <button
          onClick={onClose}
          className="absolute cursor-pointer right-3 top-3 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={18} />
        </button>

        <div className="flex justify-center mb-4">
          {loading ? (
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          ) : (
            <AlertCircle className="w-10 h-10 text-red-500" />
          )}
        </div>

        {loading ? (
          <p className="text-gray-700 font-medium tracking-wide">
            Please Wait...
          </p>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {message}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
