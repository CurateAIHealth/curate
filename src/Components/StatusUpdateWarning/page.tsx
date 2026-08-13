"use client";

import React from "react";
import Image from "next/image";

interface StatusUpdateWarningProps {
  isOpen: boolean;
  onClose: () => void;
  logoSrc?: string;
  title?: string;
  message?: string;
}

const StatusUpdateWarning: React.FC<StatusUpdateWarningProps> = ({
  isOpen,
  onClose,
  logoSrc = "/logo.png",
  title = "Status Update Not Allowed",
  message = "This HCA's current status does not allow status updates at this time.",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Top Accent */}
        <div className="h-1 w-full bg-[#1392d3]" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-3">
            {/* Logo */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt="Company Logo"
                  width={30}
                  height={30}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1392d3] text-sm font-bold text-white">
                  C
                </div>
              )}
            </div>

            {/* Title */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-center gap-2">
           

                <h3 className="text-sm font-bold text-slate-800">
                  {title}
                </h3>
              </div>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                {message}
              </p>
            </div>
          </div>

          {/* Status Info */}
         <div className="mt-4 rounded-xl border border-[#1392d3]/15 bg-[#1392d3]/5 px-3 py-2.5">
  <div className="flex items-center justify-center gap-2">
  

    <p className="text-xs font-medium text-red-600">
    
     
        ⚠️   Restricted to Update   ⚠️
      
    </p>
  </div>
</div>

          {/* Action */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-xl bg-[#1392d3] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#107fb8] active:scale-[0.98]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateWarning;