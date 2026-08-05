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
       <div className="relative mx-auto flex h-24 w-24 items-center justify-center">

  {/* Soft Glow */}
  <div className="absolute h-24 w-24 rounded-full bg-[#1392d3]/15 blur-xl animate-pulse" />

  {/* Static Ring */}
  <div className="absolute h-24 w-24 rounded-full border-[3px] border-[#1392d3]/15" />

  {/* Rotating Ring */}
  <div className="absolute h-24 w-24 animate-spin rounded-full border-[3px] border-transparent border-t-[#1392d3] border-r-[#50c896]" />

  {/* Inner Glass Circle */}
  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white shadow-lg backdrop-blur-md">

    <div className="absolute inset-0 rounded-full bg-[#1392d3]/10 animate-ping opacity-20" />

   <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-[#1392d3]/10">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1392d3]/10">
    <CalendarDays
      className="text-[#1392d3]"
      size={22}
      strokeWidth={2.2}
    />
  </div>
</div>

  </div>

</div>

        <h2 className="mt-5 text-center text-xl font-bold text-gray-800">
          Switching Month
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
Switching to Selected Month. Please wait a moment........
        </p>

       

       

      </div>
    </div>
  </div>

  );
}