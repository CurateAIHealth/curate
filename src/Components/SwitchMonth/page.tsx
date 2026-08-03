"use client";

import React from "react";
import { CalendarDays } from "lucide-react";

interface LoadingPopupProps {
  open: boolean;
  title?: string;
  description?: string;
}

export default function LoadingPopup({
  open,
  title = "Loading",
  description = "Please wait a moment...",
}: LoadingPopupProps) {
  if (!open) return null;

  return (
 <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/25 backdrop-blur-sm">

    <div className="w-[340px] rounded-3xl bg-white shadow-2xl border border-gray-100">

      <div className="p-7">

        {/* Loader */}
        <div className="mx-auto relative flex h-20 w-20 items-center justify-center">

          <div className="absolute h-20 w-20 rounded-full border-4 border-[#1392d3]/15"></div>

          <div className="absolute h-20 w-20 rounded-full border-4 border-t-[#1392d3] border-r-[#1392d3] border-b-transparent border-l-transparent animate-spin"></div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1392d3]/10">
            <span className="text-2xl">📅</span>
          </div>

        </div>

        <h2 className="mt-5 text-center text-xl font-bold text-gray-800">
          Switching Month
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Loading deployment data for
        </p>

       

        {/* Progress */}

        <div className="mt-7">
         

          <p className="mt-3 text-center text-xs text-gray-400">
            Please wait a moment...
          </p>
        </div>

      </div>
    </div>
  </div>

  );
}