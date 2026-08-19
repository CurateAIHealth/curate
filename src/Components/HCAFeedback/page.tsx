"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Clock3,
  CheckCircle2,
  FileText,
  CalendarDays,
  Eye,
} from "lucide-react";

type FeedbackStatus = "Pending" | "Completed";

interface HCAFeedbackData {
  id: number;
  enrollment: string;
  location: string;
  source: string;

  familyBackground?: string;
  hcaQuestions?: string;
  placementFeedback?: string;

  viewFile?: boolean;
  fileDate?: string;
  lastCallDate?: string;
  dueCallDate?: string;

  status: FeedbackStatus;
}

const testHCAFeedback: HCAFeedbackData[] = [
  {
    id: 1,
    enrollment: "Srinivas",
    location: "Odisha",
    source: "Pradeep sahu",
    familyBackground:
      "Family background and HCA questions are pending.",
    placementFeedback:
      "Placement feedback pending. Monthly follow-up required.",
    status: "Pending",
  },
  {
    id: 2,
    enrollment: "Siddu",
    location: "Telangana",
    source: "Urmila",
    familyBackground:
      "Need to discuss family background during the call.",
    placementFeedback:
      "Placement feedback is pending.",
    status: "Pending",
  },
  {
    id: 3,
    enrollment: "Srinivas",
    location: "Odisha",
    source: "Pradeep sahu",
    viewFile: true,
    fileDate: "15 Aug 2026",
    lastCallDate: "15 Aug 2026",
    dueCallDate: "15 Sep 2026",
    status: "Completed",
  },
  {
    id: 4,
    enrollment: "Siddu",
    location: "Telangana",
    source: "Urmila",
    viewFile: true,
    fileDate: "12 Aug 2026",
    lastCallDate: "12 Aug 2026",
    dueCallDate: "12 Sep 2026",
    status: "Completed",
  },
];

const HCAFeedback: React.FC = () => {
  const [search, setSearch] = useState("");
  const [feedbackFilter, setFeedbackFilter] =
    useState<FeedbackStatus>("Pending");

  const filteredData = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return testHCAFeedback.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.enrollment.toLowerCase().includes(searchText) ||
        item.location.toLowerCase().includes(searchText) ||
        item.source.toLowerCase().includes(searchText);

      const matchesStatus = item.status === feedbackFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, feedbackFilter]);

  const pendingCount = testHCAFeedback.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedCount = testHCAFeedback.filter(
    (item) => item.status === "Completed"
  ).length;

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <SummaryCard
          title="Total Feedback"
          value={testHCAFeedback.length}
          color="#1392d3"
        />

        <SummaryCard
          title="Pending"
          value={pendingCount}
          color="#ff1493"
        />

        <SummaryCard
          title="Completed"
          value={completedCount}
          color="#50c896"
        />

        <SummaryCard
          title="Due Calls"
          value={pendingCount}
          color="#1392d3"
        />

      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="border-b border-slate-200 p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                HCA Feedback
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Placement and monthly feedback tracking
              </p>
            </div>

            {/* Right */}
            <div className="relative w-full lg:w-80">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search enrollment, location..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#1392d3] focus:bg-white"
              />

            </div>

          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-wrap items-center gap-3">

            {/* Pending */}
            <button
              type="button"
              onClick={() => setFeedbackFilter("Pending")}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                feedbackFilter === "Pending"
                  ? "bg-[#1392d3] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#1392d3]"
              }`}
            >
              <Clock3 size={17} />

              Pending

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  feedbackFilter === "Pending"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {pendingCount}
              </span>
            </button>

            {/* Completed */}
            <button
              type="button"
              onClick={() => setFeedbackFilter("Completed")}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                feedbackFilter === "Completed"
                  ? "bg-[#50c896] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#50c896]"
              }`}
            >
              <CheckCircle2 size={17} />

              Completed

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  feedbackFilter === "Completed"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {completedCount}
              </span>
            </button>

          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          {feedbackFilter === "Pending" ? (
            <PendingTable
              data={filteredData}
            />
          ) : (
            <CompletedTable
              data={filteredData}
            />
          )}

        </div>

      </div>
    </div>
  );
};

/* =========================================================
   PENDING TABLE
========================================================= */

interface TableProps {
  data: HCAFeedbackData[];
}

const PendingTable: React.FC<TableProps> = ({ data }) => {
  return (
    <table className="w-full min-w-[1100px]">

      <thead>
        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

          <th className="px-5 py-4">
            S.No
          </th>

          <th className="px-5 py-4">
            Enrollment
          </th>

          <th className="px-5 py-4">
            Location / Coming State
          </th>

          <th className="px-5 py-4">
            Source
          </th>

          <th className="w-[280px] px-5 py-4">
            Family Background / HCA Questions
          </th>

          <th className="w-[320px] px-5 py-4">
            Placement Feedback
          </th>

        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">

        {data.length > 0 ? (
          data.map((item, index) => (

            <tr
              key={item.id}
              className="transition hover:bg-slate-50"
            >

              <td className="px-5 py-4 text-sm font-semibold text-slate-500">
                {index + 1}
              </td>

              <td className="px-5 py-4">
                <span className="font-semibold text-slate-800">
                  {item.enrollment}
                </span>
              </td>

              <td className="px-5 py-4">
                <span className="inline-flex rounded-lg bg-[#1392d3]/10 px-3 py-1.5 text-xs font-semibold text-[#1392d3]">
                  {item.location}
                </span>
              </td>

              <td className="px-5 py-4 text-sm text-slate-600">
                {item.source}
              </td>

              <td className="px-5 py-4">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

                  <p className="text-sm leading-5 text-slate-600">
                    {item.familyBackground || "Pending"}
                  </p>

                </div>

              </td>

              <td className="px-5 py-4">

                <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-3">

                  <p className="text-sm leading-5 text-slate-600">
                    {item.placementFeedback || "Pending"}
                  </p>

                </div>

              </td>

            </tr>

          ))
        ) : (
          <EmptyTable />
        )}

      </tbody>

    </table>
  );
};

/* =========================================================
   COMPLETED TABLE
========================================================= */

const CompletedTable: React.FC<TableProps> = ({ data }) => {
  return (
    <table className="w-full min-w-[1100px]">

      <thead>
        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

          <th className="px-5 py-4">
            S.No
          </th>

          <th className="px-5 py-4">
            Enrollment
          </th>

          <th className="px-5 py-4">
            Location / Coming State
          </th>

          <th className="px-5 py-4">
            Source
          </th>

          <th className="px-5 py-4">
            View File / Date
          </th>

          <th className="px-5 py-4">
            View File
          </th>

          <th className="px-5 py-4">
            Last Date of Call
          </th>

          <th className="px-5 py-4">
            Due Date of Call
          </th>

        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">

        {data.length > 0 ? (
          data.map((item, index) => (

            <tr
              key={item.id}
              className="transition hover:bg-slate-50"
            >

              <td className="px-5 py-4 text-sm font-semibold text-slate-500">
                {index + 1}
              </td>

              <td className="px-5 py-4">
                <span className="font-semibold text-slate-800">
                  {item.enrollment}
                </span>
              </td>

              <td className="px-5 py-4">

                <span className="inline-flex rounded-lg bg-[#1392d3]/10 px-3 py-1.5 text-xs font-semibold text-[#1392d3]">
                  {item.location}
                </span>

              </td>

              <td className="px-5 py-4 text-sm text-slate-600">
                {item.source}
              </td>

              {/* View File + Date */}
              <td className="px-5 py-4">

                <div className="flex flex-col gap-1.5">

                  <button
                    type="button"
                    className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#1392d3]/20 bg-[#1392d3]/10 px-3 py-2 text-xs font-semibold text-[#1392d3] transition hover:bg-[#1392d3] hover:text-white"
                  >
                    <FileText size={14} />
                    View File
                  </button>

                  {item.fileDate && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <CalendarDays size={13} />
                      {item.fileDate}
                    </span>
                  )}

                </div>

              </td>

              {/* View File */}
              <td className="px-5 py-4">

                {item.viewFile ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#1392d3] hover:text-[#1392d3]"
                  >
                    <Eye size={14} />
                    View
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">
                    No file
                  </span>
                )}

              </td>

              {/* Last Call */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CalendarDays
                    size={15}
                    className="text-[#1392d3]"
                  />

                  {item.lastCallDate || "—"}
                </div>

              </td>

              {/* Due Call */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-2">

                  <CalendarDays
                    size={15}
                    className="text-[#ff1493]"
                  />

                  <span className="rounded-lg bg-pink-50 px-3 py-1.5 text-xs font-semibold text-[#ff1493]">
                    {item.dueCallDate || "—"}
                  </span>

                </div>

              </td>

            </tr>

          ))
        ) : (
          <EmptyTable />
        )}

      </tbody>

    </table>
  );
};

/* =========================================================
   EMPTY TABLE
========================================================= */

const EmptyTable = () => {
  return (
    <tr>
      <td
        colSpan={8}
        className="px-5 py-12 text-center"
      >
        <div className="flex flex-col items-center justify-center">

          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FileText
              size={22}
              className="text-slate-400"
            />
          </div>

          <p className="font-semibold text-slate-600">
            No feedback found
          </p>

          <p className="mt-1 text-sm text-slate-400">
            There are no records matching your search.
          </p>

        </div>
      </td>
    </tr>
  );
};

/* =========================================================
   SUMMARY CARD
========================================================= */

interface SummaryCardProps {
  title: string;
  value: number;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  color,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <div className="mt-2 flex items-center gap-3">

        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />

        <p className="text-2xl font-bold text-slate-800">
          {value}
        </p>

      </div>

    </div>
  );
};

export default HCAFeedback;