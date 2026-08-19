"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Clock3,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Mail,
  Eye,
  FileText,
  CalendarDays,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type ReviewStatus = "Pending" | "Completed";

interface GoogleReviewData {
  id: number;

  clientName: string;
  ptName: string;

  enrollmentDate: string;
  terminated: string;

  team: string;
  note: string;

  status: ReviewStatus;

  // Pending
  reviewRequested: boolean;
  reviewRequestMethod?: "Email" | "WhatsApp" | "Both" | null;

  // Completed
  review?: string | null;
  suggestions?: string | null;
  reviewDate?: string | null;
}

/* =========================================================
   TEST DATA
========================================================= */

const testGoogleReviews: GoogleReviewData[] = [
  {
    id: 1,
    clientName: "Srinivas",
    ptName: "XXXX",
    enrollmentDate: "05/06/2024",
    terminated: "NA",
    team: "Team 1",
    note: "like to fill follow up info",
    status: "Pending",
    reviewRequested: false,
    reviewRequestMethod: null,
  },

  {
    id: 2,
    clientName: "Srivani",
    ptName: "XXXX",
    enrollmentDate: "05/06/2024",
    terminated: "07/08/2026",
    team: "Team 2",
    note: "",
    status: "Pending",
    reviewRequested: true,
    reviewRequestMethod: "WhatsApp",
  },

  {
    id: 3,
    clientName: "Client name",
    ptName: "XXXX",
    enrollmentDate: "05/06/2024",
    terminated: "07/08/2026",
    team: "Team 3",
    note: "",
    status: "Pending",
    reviewRequested: false,
    reviewRequestMethod: null,
  },

  {
    id: 4,
    clientName: "Srinivas",
    ptName: "XXXX",
    enrollmentDate: "05/06/2024",
    terminated: "NA",
    team: "Team 1",
    note: "",
    status: "Completed",
    reviewRequested: true,
    reviewRequestMethod: "Both",
    review:
      "The service was very good and the staff was supportive.",
    suggestions:
      "Everything was good. Continue the same service.",
    reviewDate: "15/08/2026",
  },

  {
    id: 5,
    clientName: "Srivani",
    ptName: "XXXX",
    enrollmentDate: "05/06/2024",
    terminated: "NA",
    team: "Team 2",
    note: "",
    status: "Completed",
    reviewRequested: true,
    reviewRequestMethod: "Email",
    review:
      "Very happy with the service provided.",
    suggestions:
      "Good communication and support.",
    reviewDate: "14/08/2026",
  },

  {
    id: 6,
    clientName: "Client name",
    ptName: "XXXX",
    enrollmentDate: "05/06/2024",
    terminated: "NA",
    team: "Team 3",
    note: "",
    status: "Completed",
    reviewRequested: true,
    reviewRequestMethod: "WhatsApp",
    review:
      "Excellent service.",
    suggestions:
      "No suggestions.",
    reviewDate: "12/08/2026",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

const GoogleReviews: React.FC = () => {
  const [search, setSearch] = useState("");

  const [reviewFilter, setReviewFilter] =
    useState<ReviewStatus>("Pending");

  const [selectedReview, setSelectedReview] =
    useState<GoogleReviewData | null>(null);

  /* -------------------------------------------------------
     COUNTS
  ------------------------------------------------------- */

  const pendingCount = testGoogleReviews.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedCount = testGoogleReviews.filter(
    (item) => item.status === "Completed"
  ).length;

  /* -------------------------------------------------------
     FILTER
  ------------------------------------------------------- */

  const filteredData = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return testGoogleReviews.filter((item) => {
      const matchesStatus =
        item.status === reviewFilter;

      const matchesSearch =
        !searchText ||
        item.clientName.toLowerCase().includes(searchText) ||
        item.ptName.toLowerCase().includes(searchText) ||
        item.team.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [search, reviewFilter]);

  return (
    <div className="space-y-6">

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <SummaryCard
          title="Total Reviews"
          value={testGoogleReviews.length}
          color="#1392d3"
        />

        <SummaryCard
          title="Pending Review"
          value={pendingCount}
          color="#ff1493"
        />

        <SummaryCard
          title="Completed Review"
          value={completedCount}
          color="#50c896"
        />

        <SummaryCard
          title="Review Rate"
          value={
            testGoogleReviews.length
              ? `${Math.round(
                  (completedCount /
                    testGoogleReviews.length) *
                    100
                )}%`
              : "0%"
          }
          color="#1392d3"
        />

      </div>

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="border-b border-slate-200 p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}
            <div>

              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">

                <MessageCircle
                  size={20}
                  className="text-[#ff1493]"
                />

                Google Reviews

              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track pending and completed Google reviews
              </p>

            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search client, PT or team..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#1392d3] focus:bg-white"
              />

            </div>

          </div>

          {/* =================================================
              PENDING / COMPLETED BUTTONS
          ================================================= */}

          <div className="mt-5 flex flex-wrap items-center gap-3">

            {/* Pending */}
            <button
              type="button"
              onClick={() =>
                setReviewFilter("Pending")
              }
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                reviewFilter === "Pending"
                  ? "bg-[#1392d3] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#1392d3]"
              }`}
            >

              <Clock3 size={17} />

              Pending Review

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  reviewFilter === "Pending"
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
              onClick={() =>
                setReviewFilter("Completed")
              }
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                reviewFilter === "Completed"
                  ? "bg-[#50c896] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#50c896]"
              }`}
            >

              <CheckCircle2 size={17} />

              Completed Review

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  reviewFilter === "Completed"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {completedCount}
              </span>

            </button>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-x-auto">

          {reviewFilter === "Pending" ? (
            <PendingReviewTable
              data={filteredData}
              onSelect={setSelectedReview}
            />
          ) : (
            <CompletedReviewTable
              data={filteredData}
              onSelect={setSelectedReview}
            />
          )}

        </div>

      </div>

      {/* =================================================
          REVIEW POPUP
      ================================================= */}

      {selectedReview && (
        <ReviewModal
          data={selectedReview}
          onClose={() =>
            setSelectedReview(null)
          }
        />
      )}

    </div>
  );
};

/* =========================================================
   PENDING REVIEW TABLE
========================================================= */

interface ReviewTableProps {
  data: GoogleReviewData[];
  onSelect: (item: GoogleReviewData) => void;
}

const PendingReviewTable: React.FC<ReviewTableProps> = ({
  data,
  onSelect,
}) => {
  return (
    <table className="w-full min-w-[1250px]">

      <thead>

        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

          <th className="px-5 py-4">
            S.No
          </th>

          <th className="px-5 py-4">
            Client Name
          </th>

          <th className="px-5 py-4">
            PT Name
          </th>

          <th className="px-5 py-4">
            Enrollment Date
          </th>

          <th className="px-5 py-4">
            Terminated
          </th>

          <th className="px-5 py-4">
            Team
          </th>

          <th className="px-5 py-4">
            Note
          </th>

          <th className="px-5 py-4">
            Status
          </th>

          <th className="px-5 py-4">
            Request Review
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

              {/* S.No */}
              <td className="px-5 py-4 text-sm font-semibold text-slate-500">
                {index + 1}
              </td>

              {/* Client */}
              <td className="px-5 py-4">

                <span className="font-semibold text-slate-800">
                  {item.clientName}
                </span>

              </td>

              {/* PT */}
              <td className="px-5 py-4 text-sm text-slate-600">
                {item.ptName}
              </td>

              {/* Enrollment */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-2 text-sm text-slate-600">

                  <CalendarDays
                    size={14}
                    className="text-[#1392d3]"
                  />

                  {item.enrollmentDate}

                </div>

              </td>

              {/* Terminated */}
              <td className="px-5 py-4">

                {item.terminated === "NA" ? (

                  <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#50c896]">
                    Active
                  </span>

                ) : (

                  <span className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500">
                    {item.terminated}
                  </span>

                )}

              </td>

              {/* Team */}
              <td className="px-5 py-4">

                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">

                  <span className="h-2 w-2 rounded-full bg-[#1392d3]" />

                  <span className="text-sm font-semibold text-slate-700">
                    {item.team}
                  </span>

                </span>

              </td>

              {/* Note */}
              <td className="max-w-[240px] px-5 py-4">

                {item.note ? (

                  <span className="text-sm text-slate-600">
                    {item.note}
                  </span>

                ) : (

                  <button
                    type="button"
                    onClick={() =>
                      onSelect(item)
                    }
                    className="inline-flex items-center rounded-lg border border-[#1392d3]/30 bg-[#1392d3]/10 px-3 py-2 text-xs font-semibold text-[#1392d3] transition hover:bg-[#1392d3] hover:text-white"
                  >
                    + Add Note
                  </button>

                )}

              </td>

              {/* Status */}
              <td className="px-5 py-4">

                <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-semibold text-[#ff1493]">

                  <Clock3 size={13} />

                  Pending

                </span>

              </td>

              {/* Request Review */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      onSelect(item)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1392d3] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                  >

                    <ExternalLink size={14} />

                    Request Review

                  </button>

                  {/* Email */}
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-[#1392d3] hover:text-[#1392d3]"
                    title="Send Email"
                  >
                    <Mail size={15} />
                  </button>

                  {/* WhatsApp */}
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-[#50c896] hover:text-[#50c896]"
                    title="Send WhatsApp"
                  >
                    <MessageCircle size={15} />
                  </button>

                </div>

              </td>

            </tr>

          ))

        ) : (

          <EmptyRow colSpan={9} />

        )}

      </tbody>

    </table>
  );
};

/* =========================================================
   COMPLETED REVIEW TABLE
========================================================= */

const CompletedReviewTable: React.FC<ReviewTableProps> = ({
  data,
  onSelect,
}) => {
  return (
    <table className="w-full min-w-[1050px]">

      <thead>

        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

          <th className="px-5 py-4">
            S.No
          </th>

          <th className="px-5 py-4">
            Client Name
          </th>

          <th className="px-5 py-4">
            PT Name
          </th>

          <th className="px-5 py-4">
            Enrollment Date
          </th>

          <th className="px-5 py-4">
            Terminated
          </th>

          <th className="px-5 py-4">
            Review
          </th>

          <th className="px-5 py-4">
            Suggestions
          </th>

          <th className="px-5 py-4">
            Action
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

              {/* S.No */}
              <td className="px-5 py-4 text-sm font-semibold text-slate-500">
                {index + 1}
              </td>

              {/* Client */}
              <td className="px-5 py-4">

                <span className="font-semibold text-slate-800">
                  {item.clientName}
                </span>

              </td>

              {/* PT */}
              <td className="px-5 py-4 text-sm text-slate-600">
                {item.ptName}
              </td>

              {/* Enrollment */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-2 text-sm text-slate-600">

                  <CalendarDays
                    size={14}
                    className="text-[#1392d3]"
                  />

                  {item.enrollmentDate}

                </div>

              </td>

              {/* Terminated */}
              <td className="px-5 py-4">

                {item.terminated === "NA" ? (

                  <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#50c896]">
                    Active
                  </span>

                ) : (

                  <span className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500">
                    {item.terminated}
                  </span>

                )}

              </td>

              {/* Review */}
              <td className="max-w-[300px] px-5 py-4">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

                  <p className="line-clamp-3 text-sm leading-5 text-slate-600">
                    {item.review || "No review available"}
                  </p>

                </div>

              </td>

              {/* Suggestions */}
              <td className="max-w-[280px] px-5 py-4">

                <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-3">

                  <p className="line-clamp-3 text-sm leading-5 text-slate-600">
                    {item.suggestions || "No suggestions"}
                  </p>

                </div>

              </td>

              {/* Action */}
              <td className="px-5 py-4">

                <button
                  type="button"
                  onClick={() =>
                    onSelect(item)
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-[#1392d3]/30 bg-[#1392d3]/10 px-3 py-2 text-xs font-semibold text-[#1392d3] transition hover:bg-[#1392d3] hover:text-white"
                >

                  <Eye size={14} />

                  View Review

                </button>

              </td>

            </tr>

          ))

        ) : (

          <EmptyRow colSpan={8} />

        )}

      </tbody>

    </table>
  );
};

/* =========================================================
   EMPTY ROW
========================================================= */

interface EmptyRowProps {
  colSpan: number;
}

const EmptyRow: React.FC<EmptyRowProps> = ({
  colSpan,
}) => {
  return (
    <tr>

      <td
        colSpan={colSpan}
        className="px-5 py-14 text-center"
      >

        <div className="flex flex-col items-center">

          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

            <FileText
              size={22}
              className="text-slate-400"
            />

          </div>

          <p className="font-semibold text-slate-600">
            No reviews found
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Try changing your search or filter.
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
  value: number | string;
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

/* =========================================================
   REVIEW MODAL
========================================================= */

interface ReviewModalProps {
  data: GoogleReviewData;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  data,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-[#1392d3]">
              Google Review
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-800">
              {data.clientName}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              PT: {data.ptName}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200"
          >
            ×
          </button>

        </div>

        {/* Content */}
        <div className="space-y-5 p-5">

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs text-slate-400">
                Enrollment Date
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {data.enrollmentDate}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs text-slate-400">
                Team
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {data.team}
              </p>

            </div>

          </div>

          {/* Status */}
          <div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                data.status === "Completed"
                  ? "bg-emerald-50 text-[#50c896]"
                  : "bg-pink-50 text-[#ff1493]"
              }`}
            >

              {data.status === "Completed" ? (
                <CheckCircle2 size={14} />
              ) : (
                <Clock3 size={14} />
              )}

              {data.status}

            </span>

          </div>

          {/* Pending */}
          {data.status === "Pending" && (
            <div className="space-y-4">

              <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wide text-[#ff1493]">
                  Note
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {data.note || "No note added."}
                </p>

              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1392d3] py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <MessageCircle size={17} />
                Request Google Review
              </button>

            </div>
          )}

          {/* Completed */}
          {data.status === "Completed" && (
            <>

              <div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Review
                </p>

                <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {data.review || "No review available."}
                </div>

              </div>

              <div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Suggestions
                </p>

                <div className="rounded-xl bg-pink-50/50 p-4 text-sm leading-6 text-slate-600">
                  {data.suggestions || "No suggestions available."}
                </div>

              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">

                <CalendarDays
                  size={16}
                  className="text-[#1392d3]"
                />

                Review Date:

                <span className="font-semibold text-slate-700">
                  {data.reviewDate || "—"}
                </span>

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default GoogleReviews;