"use client";

import React, { useState } from "react";
import {
  MessageSquareText,
  Users,
  Star,
} from "lucide-react";
import HCAFeedback from "@/Components/HCAFeedback/page";
import ClientFeedback from "@/Components/ClientFeedback/page";
import GoogleReviews from "@/Components/GoogleReviews/page";
import { useRouter } from "next/navigation";



type QualityTab = "hca" | "client" | "google";

interface QualityOption {
  key: QualityTab;
  label: string;
  icon: React.ElementType;
  color: string;
}

const qualityOptions: QualityOption[] = [
  {
    key: "hca",
    label: "HCA Feedback",
    icon: Users,
    color: "#1392d3",
  },
  {
    key: "client",
    label: "Client Feedback",
    icon: MessageSquareText,
    color: "#50c896",
  },
  {
    key: "google",
    label: "Google Reviews",
    icon: Star,
    color: "#ff1493",
  },
];

const QualityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QualityTab>("hca");
const router=useRouter()
  const renderQualityComponent = (): React.ReactNode => {
    switch (activeTab) {
      case "hca":
        return <HCAFeedback />;

      case "client":
        return <ClientFeedback />;

      case "google":
        return <GoogleReviews />;

      default:
        return <HCAFeedback />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* Header */}
<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  {/* Left Side */}
  <div className="flex items-center gap-3">
    {/* Company Logo */}
    <div className="shrink-0">
      <img
        src="/Icons/Curate-logoq.png"
        alt="Curate Health"
        className="h-12 w-auto object-contain sm:h-14"
      />
    </div>

    <div className="min-w-0">
      <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
        Quality
      </h1>

      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
        Manage feedback, client satisfaction and Google reviews
      </p>
    </div>
  </div>

  {/* Right Side Button */}
   <button
              onClick={()=>router.replace('/DashBoard')}
              className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
            >
              DashBoard
            </button>
</div>

      {/* Quality Navigation */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">

          {qualityOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeTab === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setActiveTab(option.key)}
                className={`flex items-center justify-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                style={{
                  backgroundColor: isActive
                    ? option.color
                    : "transparent",
                }}
              >
                <Icon size={19} />

                <span>{option.label}</span>
              </button>
            );
          })}

        </div>
      </div>

      {/* Active Component */}
      <div>
        {renderQualityComponent()}
      </div>

    </div>
  );
};

export default QualityPage;