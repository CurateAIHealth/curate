"use client";

import React, { useState } from "react";
import {
  Search,
  Star,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

interface HCAFeedbackData {
  id: number;
  hca: string;
  client: string;
  rating: number;
  type: "Positive" | "Neutral" | "Negative";
  feedback: string;
  date: string;
  followUp: boolean;
  image: boolean;
}

const testHCAFeedback: HCAFeedbackData[] = [
  {
    id: 1,
    hca: "Anjali Kale",
    client: "Sunrise Care",
    rating: 5,
    type: "Positive",
    feedback:
      "Client is very happy with the support and communication from our team.",
    date: "15 Aug 2026",
    followUp: false,
    image: true,
  },
  {
    id: 2,
    hca: "Priya Sharma",
    client: "Green Valley Care",
    rating: 3,
    type: "Neutral",
    feedback:
      "Client requested better communication regarding schedule changes.",
    date: "14 Aug 2026",
    followUp: true,
    image: false,
  },
  {
    id: 3,
    hca: "Kavya Reddy",
    client: "Care Plus Services",
    rating: 5,
    type: "Positive",
    feedback:
      "Excellent relationship with the client. No issues reported.",
    date: "12 Aug 2026",
    followUp: false,
    image: false,
  },
];

const HCAFeedback: React.FC = () => {
  const [search, setSearch] = useState<string>("");

  const filteredData = testHCAFeedback.filter(
    (item: HCAFeedbackData) =>
      item.hca.toLowerCase().includes(search.toLowerCase()) ||
      item.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <SummaryCard
          title="Total Feedback"
          value="42"
          color="#1392d3"
        />

        <SummaryCard
          title="Positive"
          value="34"
          color="#50c896"
        />

        <SummaryCard
          title="Follow Up"
          value="6"
          color="#ff1493"
        />

        <SummaryCard
          title="With Images"
          value="18"
          color="#1392d3"
        />

      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              HCA Feedback
            </h2>

            <p className="text-sm text-slate-500">
              Feedback received from HCAs
            </p>
          </div>

          <div className="relative w-full md:w-72">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              placeholder="Search HCA or Client..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#1392d3] focus:bg-white"
            />

          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">HCA</th>
                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4">Rating</th>
                <th className="px-5 py-4">Feedback</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Attachment</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredData.map((item: HCAFeedbackData) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-slate-50"
                >

                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-800">
                      {item.hca}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {item.client}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-0.5">

                      {Array.from({ length: 5 }).map((_, index) => {
                        const starNumber = index + 1;

                        return (
                          <Star
                            key={starNumber}
                            size={15}
                            fill={
                              starNumber <= item.rating
                                ? "#ff1493"
                                : "none"
                            }
                            className={
                              starNumber <= item.rating
                                ? "text-[#ff1493]"
                                : "text-slate-300"
                            }
                          />
                        );
                      })}

                    </div>
                  </td>

                  <td className="max-w-md px-5 py-4 text-sm text-slate-600">
                    {item.feedback}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {item.date}
                  </td>

                  <td className="px-5 py-4">

                    {item.followUp ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#ff1493]">
                        <AlertCircle size={13} />
                        Follow Up
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#50c896]">
                        <CheckCircle2 size={13} />
                        Completed
                      </span>
                    )}

                  </td>

                  <td className="px-5 py-4">

                    {item.image ? (
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#1392d3] hover:text-[#1392d3]"
                      >
                        <ImageIcon size={14} />
                        View
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">
                        No file
                      </span>
                    )}

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
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
          style={{ backgroundColor: color }}
        />

        <p className="text-2xl font-bold text-slate-800">
          {value}
        </p>

      </div>

    </div>
  );
};

export default HCAFeedback;