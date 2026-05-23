"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Loader2, Info } from "lucide-react";

export default function PopupToast({
  isOpen = false,
  message = "",
  type = "success",
  logo = "/logo.png",
  autoClose = true,
  duration = 3000,
  showClose = true,
  showProgress = true,
  onClose = () => {},
}) {
  useEffect(() => {
    if (!isOpen || !autoClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, autoClose, duration, onClose]);

  if (!isOpen) return null;

  const styles:any = {
    success: {
      bg: "bg-green-50 border-green-200",
      icon: <CheckCircle className="text-green-600 w-5 h-5" />,
    },
    error: {
      bg: "bg-red-50 border-red-200",
      icon: <AlertCircle className="text-red-600 w-5 h-5" />,
    },
    loading: {
      bg: "bg-amber-50 border-amber-200",
      icon: <Loader2 className="text-amber-600 w-5 h-5 animate-spin" />,
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      icon: <Info className="text-blue-600 w-5 h-5" />,
    },
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top duration-300">
      <div
        className={`relative flex items-center gap-3 min-w-[320px] max-w-md px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md ${styles[type].bg}`}
      >
        {/* Company Logo */}
        <div className="shrink-0">
          <Image
            src={logo}
            alt="Company Logo"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>

        {/* Status Icon */}
        <div>{styles[type].icon}</div>

        {/* Message */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{message}</p>
        </div>

        {/* Close */}
        {showClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition"
          >
            <X size={18} />
          </button>
        )}

        {/* Progress Bar */}
        {autoClose && showProgress && (
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200 rounded-b-2xl overflow-hidden">
            <div
              className="h-full bg-blue-500 animate-progress"
              style={{
                animationDuration: `${duration}ms`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}