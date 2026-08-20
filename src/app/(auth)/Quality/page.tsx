"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquareText,
  Users,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import HCAFeedback from "@/Components/HCAFeedback/page";
import ClientFeedback from "@/Components/ClientFeedback/page";
import GoogleReviews from "@/Components/GoogleReviews/page";

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
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<QualityTab>("hca");
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const users = useSelector(
    (state: any) => state.AdminUsers
  );

  const userFullInfo = useSelector(
    (state: any) => state.AdminFullInfo
  );

  useEffect(() => {
    const hasUsers = Array.isArray(users) && users.length > 0;
    const hasUserFullInfo =
      Array.isArray(userFullInfo) && userFullInfo.length > 0;

    if (!hasUsers || !hasUserFullInfo) {
      router.replace("/");
      return;
    }

    setIsCheckingAccess(false);
  }, [users, userFullInfo, router]);

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

  // Prevent the page from rendering before Redux data is available.
  if (isCheckingAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1392d3]" />

          <p className="text-sm font-medium text-slate-600">
            Loading Quality...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Left Side */}
        <div className="flex min-w-0 items-center gap-3">

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

        {/* Dashboard Button */}
        <button
          type="button"
          onClick={() => router.replace("/DashBoard")}
          className="
            flex w-full cursor-pointer items-center justify-center
            gap-2 rounded-xl bg-[#1392d3]
            px-4 py-2 font-semibold text-white
            shadow-sm transition-colors duration-150
            hover:bg-[#0f7fb9]
            focus:outline-none
            focus:ring-2 focus:ring-[#1392d3]
            focus:ring-offset-2
            sm:w-auto
          "
        >
          Dashboard
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
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex items-center justify-center gap-3
                  rounded-xl px-4 py-3.5
                  text-sm font-semibold
                  transition-colors duration-150
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-1
                  ${
                    isActive
                      ? "text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `}
                style={{
                  backgroundColor: isActive
                    ? option.color
                    : "transparent",
                }}
              >
                <Icon
                  size={19}
                  aria-hidden="true"
                />

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