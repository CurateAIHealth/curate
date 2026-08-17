"use client";

import React, { useState } from "react";
import {
  Search,
  Star,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Image as ImageIcon,
  ExternalLink,
  MessageCircle,
  UserCheck,
} from "lucide-react";

type GoogleReviewStatus =
  | "Given"
  | "Waiting"
  | "Follow Up"
  | "Not Asked";

interface GoogleReviewData {
  id: number;
  client: string;
  hca: string;
  status: GoogleReviewStatus;
  requestedDate: string | null;
  reviewDate: string | null;
  rating: number | null;
  review: string | null;
  image: boolean;
  followUp: boolean;
  lastFollowUp: string | null;
  collectedBy: string | null;
}

const testGoogleReviews: GoogleReviewData[] = [
  {
    id: 1,
    client: "Sunrise Care",
    hca: "Anjali Kale",
    status: "Given",
    requestedDate: "08 Aug 2026",
    reviewDate: "12 Aug 2026",
    rating: 5,
    review:
      "Excellent service. The staff member is very professional and caring.",
    image: true,
    followUp: false,
    lastFollowUp: null,
    collectedBy: "Kiran",
  },
  {
    id: 2,
    client: "Green Valley Care",
    hca: "Priya Sharma",
    status: "Follow Up",
    requestedDate: "10 Aug 2026",
    reviewDate: null,
    rating: null,
    review: null,
    image: false,
    followUp: true,
    lastFollowUp: "16 Aug 2026",
    collectedBy: null,
  },
  {
    id: 3,
    client: "Care Plus Services",
    hca: "Kavya Reddy",
    status: "Waiting",
    requestedDate: "15 Aug 2026",
    reviewDate: null,
    rating: null,
    review: null,
    image: false,
    followUp: false,
    lastFollowUp: null,
    collectedBy: null,
  },
  {
    id: 4,
    client: "Happy Hearts Care",
    hca: "Sakshi Ghatwade",
    status: "Not Asked",
    requestedDate: null,
    reviewDate: null,
    rating: null,
    review: null,
    image: false,
    followUp: false,
    lastFollowUp: null,
    collectedBy: null,
  },
  {
    id: 5,
    client: "Helping Hands Care",
    hca: "Mayuri Randaye",
    status: "Given",
    requestedDate: "05 Aug 2026",
    reviewDate: "08 Aug 2026",
    rating: 5,
    review:
      "Wonderful service and very supportive staff.",
    image: true,
    followUp: false,
    lastFollowUp: null,
    collectedBy: "Srinivas",
  },
  {
    id: 6,
    client: "Royal Care Services",
    hca: "Samiksha Kurekar",
    status: "Follow Up",
    requestedDate: "07 Aug 2026",
    reviewDate: null,
    rating: null,
    review: null,
    image: false,
    followUp: true,
    lastFollowUp: "15 Aug 2026",
    collectedBy: null,
  },
];

const GoogleReviews: React.FC = () => {

  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] =
    useState<"All" | GoogleReviewStatus>("All");

  const [selectedReview, setSelectedReview] =
    useState<GoogleReviewData | null>(null);

  const filteredData = testGoogleReviews.filter((item) => {

    const matchesSearch =
      `${item.client} ${item.hca}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalClients = 76;

  const reviewsGiven = testGoogleReviews.filter(
    (item) => item.status === "Given"
  ).length;

  const waiting = testGoogleReviews.filter(
    (item) => item.status === "Waiting"
  ).length;

  const followUp = testGoogleReviews.filter(
    (item) => item.status === "Follow Up"
  ).length;

  const notAsked = testGoogleReviews.filter(
    (item) => item.status === "Not Asked"
  ).length;

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <ReviewCard
          title="Total Clients"
          value={totalClients}
          icon={<UserCheck size={20} />}
          color="#1392d3"
        />

        <ReviewCard
          title="Reviews Given"
          value={reviewsGiven}
          icon={<CheckCircle2 size={20} />}
          color="#50c896"
        />

        <ReviewCard
          title="Waiting"
          value={waiting}
          icon={<Clock3 size={20} />}
          color="#1392d3"
        />

        <ReviewCard
          title="Follow Up"
          value={followUp}
          icon={<AlertCircle size={20} />}
          color="#ff1493"
        />

        <ReviewCard
          title="Not Asked"
          value={notAsked}
          icon={<MessageCircle size={20} />}
          color="#ff1493"
        />

      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="border-b border-slate-200 p-5">

          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <Star
                  size={20}
                  className="text-[#ff1493]"
                  fill="#ff1493"
                />
                Google Review Collection
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track Google reviews, requests and client follow-ups
              </p>
            </div>

            <div className="rounded-xl bg-pink-50 px-4 py-2">
              <span className="text-xs text-slate-500">
                Collection Rate
              </span>

              <p className="text-lg font-bold text-[#ff1493]">
                {Math.round(
                  (reviewsGiven / totalClients) * 100
                )}
                %
              </p>
            </div>

          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Client or HCA..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#ff1493] focus:bg-white"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "All"
                    | GoogleReviewStatus
                )
              }
              className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff1493]"
            >
              <option value="All">All Status</option>
              <option value="Given">Review Given</option>
              <option value="Waiting">Waiting</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Not Asked">Not Asked</option>
            </select>

          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4">Assigned HCA</th>
                <th className="px-5 py-4">Review Status</th>
                <th className="px-5 py-4">Requested</th>
                <th className="px-5 py-4">Review Date</th>
                <th className="px-5 py-4">Follow Up</th>
                <th className="px-5 py-4">Collected By</th>
                <th className="px-5 py-4">Action</th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* Client */}
                  <td className="px-5 py-4">

                    <p className="font-semibold text-slate-800">
                      {item.client}
                    </p>

                  </td>

                  {/* HCA */}
                  <td className="px-5 py-4">

                    <span className="text-sm text-slate-600">
                      {item.hca}
                    </span>

                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    <ReviewStatus
                      status={item.status}
                    />

                    {item.rating && (
                      <div className="mt-1 flex items-center gap-1">

                        <Star
                          size={13}
                          fill="#ff1493"
                          className="text-[#ff1493]"
                        />

                        <span className="text-xs font-semibold text-slate-600">
                          {item.rating}/5
                        </span>

                      </div>
                    )}

                  </td>

                  {/* Requested */}
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {item.requestedDate || "—"}
                  </td>

                  {/* Review Date */}
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {item.reviewDate || "—"}
                  </td>

                  {/* Follow Up */}
                  <td className="px-5 py-4">

                    {item.followUp ? (
                      <div>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#ff1493]">
                          <AlertCircle size={13} />
                          Required
                        </span>

                        {item.lastFollowUp && (
                          <p className="mt-1 text-[11px] text-slate-400">
                            Last: {item.lastFollowUp}
                          </p>
                        )}

                      </div>
                    ) : item.status === "Given" ? (
                      <span className="text-xs text-slate-400">
                        —
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        Not required yet
                      </span>
                    )}

                  </td>

                  {/* Collected By */}
                  <td className="px-5 py-4">

                    {item.collectedBy ? (
                      <span className="text-sm font-medium text-slate-600">
                        {item.collectedBy}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        —
                      </span>
                    )}

                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      {item.status === "Given" ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedReview(item)
                            }
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-[#1392d3] hover:text-[#1392d3]"
                            title="View Review"
                          >
                            <ExternalLink size={16} />
                          </button>

                          {item.image && (
                            <button
                              type="button"
                              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-[#ff1493] hover:text-[#ff1493]"
                              title="View Screenshot"
                            >
                              <ImageIcon size={16} />
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedReview(item)
                          }
                          className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${
                            item.status === "Follow Up"
                              ? "bg-[#ff1493]"
                              : "bg-[#1392d3]"
                          }`}
                        >
                          {item.status === "Follow Up"
                            ? "Follow Up"
                            : "Request Review"}
                        </button>
                      )}

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Review Modal */}
      {selectedReview && (
        <GoogleReviewModal
          data={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}

    </div>
  );
};

interface ReviewCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  title,
  value,
  icon,
  color,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-800">
          {value}
        </p>
      </div>

      <div
        className="rounded-xl p-3 text-white"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

    </div>

  </div>
);

interface ReviewStatusProps {
  status: GoogleReviewStatus;
}

const ReviewStatus: React.FC<ReviewStatusProps> = ({
  status,
}) => {

  const config: Record<
    GoogleReviewStatus,
    {
      label: string;
      className: string;
      icon: React.ReactNode;
    }
  > = {
    Given: {
      label: "Review Given",
      className: "bg-emerald-50 text-[#50c896]",
      icon: <CheckCircle2 size={13} />,
    },

    Waiting: {
      label: "Waiting",
      className: "bg-sky-50 text-[#1392d3]",
      icon: <Clock3 size={13} />,
    },

    "Follow Up": {
      label: "Follow Up",
      className: "bg-pink-50 text-[#ff1493]",
      icon: <AlertCircle size={13} />,
    },

    "Not Asked": {
      label: "Not Asked",
      className: "bg-slate-100 text-slate-500",
      icon: <MessageCircle size={13} />,
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${item.className}`}
    >
      {item.icon}
      {item.label}
    </span>
  );
};

interface GoogleReviewModalProps {
  data: GoogleReviewData;
  onClose: () => void;
}

const GoogleReviewModal: React.FC<GoogleReviewModalProps> = ({
  data,
  onClose,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b p-5">

        <div>
          <h3 className="font-bold text-slate-800">
            Google Review
          </h3>

          <p className="text-sm text-slate-500">
            {data.client}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-2xl text-slate-400 hover:text-slate-700"
        >
          ×
        </button>

      </div>

      <div className="space-y-5 p-5">

        {/* Client / HCA */}
        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">
              Client
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {data.client}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">
              Assigned HCA
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {data.hca}
            </p>
          </div>

        </div>

        {/* Status */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
            Status
          </p>

          <ReviewStatus status={data.status} />
        </div>

        {/* Review */}
        {data.review ? (
          <div>

            <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
              Review
            </p>

            {data.rating && (
              <div className="mb-2 flex gap-1">

                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    fill={
                      index < data.rating!
                        ? "#ff1493"
                        : "none"
                    }
                    className={
                      index < data.rating!
                        ? "text-[#ff1493]"
                        : "text-slate-300"
                    }
                  />
                ))}

              </div>
            )}

            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {data.review}
            </div>

          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">

            <MessageCircle
              size={30}
              className="mx-auto text-slate-300"
            />

            <p className="mt-2 font-semibold text-slate-600">
              No Google Review Yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              This client still needs to provide a review.
            </p>

          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-xs text-slate-400">
              Requested Date
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {data.requestedDate || "Not requested"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Review Date
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {data.reviewDate || "Not received"}
            </p>
          </div>

        </div>

        {/* Attachment */}
        {data.image && (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-[#1392d3] hover:bg-sky-50"
          >
            <ImageIcon size={18} />
            View Review Screenshot
          </button>
        )}

        {/* Action */}
        {data.status !== "Given" && (
          <button
            type="button"
            className="w-full rounded-xl bg-[#ff1493] py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {data.status === "Follow Up"
              ? "Record Follow Up"
              : "Mark Review as Requested"}
          </button>
        )}

      </div>

    </div>

  </div>
);

export default GoogleReviews;