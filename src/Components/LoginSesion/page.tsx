"use client";

import Image from "next/image";

interface SessionExpiredPopupProps {
  isOpen: boolean;
  onRefresh?: () => void;
  onLoginAgain?: () => void;
  onClose?: () => void;
  title?: string;
  message?: string;
  showRefreshButton?: boolean;
  showLoginButton?: boolean;
  showCloseButton?: boolean;
  logoSrc?: string;
}

export default function SessionExpiredPopup({
  isOpen,
  onRefresh,
  onLoginAgain,
  onClose,
  title = "Session Expired",
  message = "We couldn't verify your login session. Please refresh the page or sign in again to continue accessing the dashboard.",
  showRefreshButton = true,
  showLoginButton = true,
  showCloseButton = true,
  logoSrc = "/logo.png",
}: SessionExpiredPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">


        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            ✕
          </button>
        )}

        <div className="p-8 text-center">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#0B4F9C]/10 bg-[#0B4F9C]/5">
            <Image
              src={logoSrc}
              alt="Company Logo"
              width={60}
              height={60}
              className="object-contain"
            />
          </div>

          <h2 className="text-2xl font-bold text-red-500">
            {title}
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            {message}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {showRefreshButton && (
              <button
                onClick={onRefresh}
                className="flex-1 rounded-xl bg-[#0B4F9C] px-5 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Refresh Page
              </button>
            )}

            {showLoginButton && (
              <button
                onClick={onLoginAgain}
                className="flex-1 rounded-xl border border-[#0B4F9C] bg-white px-5 py-3 font-semibold text-[#0B4F9C] transition hover:bg-[#0B4F9C]/5"
              >
                Login Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}