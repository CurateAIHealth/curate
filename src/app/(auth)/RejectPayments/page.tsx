"use client";

import { Eye, CornerUpLeft } from "lucide-react";

export default function RejectedPayments() {
 const data = [
  {
    id: 1,
    name: "Priyanka",
    total: 499000,
    reason: "Timesheet Not Approved",
  },
  {
    id: 2,
    name: "Sanjana",
    total: 460000,
    reason: "Amount Mismatch",
  },
  {
    id: 3,
    name: "Kavita Koko",
    total: 546000,
    reason: "Missing Documents",
  },
  {
    id: 4,
    name: "Roshani Sunkatrao",
    total: 540000,
    reason: "Invalid Account Number",
  },
  {
    id: 5,
    name: "Reddyvari",
    total: 529500,
    reason: "IFSC Code Error",
  },
  {
    id: 6,
    name: "Kanchan",
    total: 520000,
    reason: "Duplicate Payment Request",
  },
  {
    id: 7,
    name: "Khushiyavishnu",
    total: 485030,
    reason: "Salary Calculation Mismatch",
  },
  {
    id: 8,
    name: "Anjali",
    total: 575000,
    reason: "Bank Verification Pending",
  },
  {
    id: 9,
    name: "Niharika",
    total: 495000,
    reason: "Incorrect Timesheet Hours",
  },
  {
    id: 10,
    name: "Kratika",
    total: 520000,
    reason: "Missing Approval From Manager",
  },
];
  return (
    <div className="bg-white rounded-3xl border border-red-100 shadow-xl overflow-hidden">
    <div className="px-6 py-5 border-b">
  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center border border-slate-200">
        <img
          src="/Icons/Curate-logoq.png"
          alt="Curate Logo"
          className="h-10 w-10 object-contain"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-red-600">
          Rejected 
        </h2>

        <p className="text-slate-500 text-sm">
          Payments returned for correction
        </p>
      </div>
    </div>

    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="h-11 w-full md:w-[260px] px-4 rounded-xl border border-slate-200 outline-none focus:border-[#1392d3]"
        />
      </div>

      <select className="h-11 px-4 rounded-xl border border-slate-200 outline-none min-w-[130px]">
        <option>January</option>
        <option>February</option>
        <option>March</option>
        <option>April</option>
        <option>May</option>
        <option>June</option>
        <option>July</option>
        <option>August</option>
        <option>September</option>
        <option>October</option>
        <option>November</option>
        <option>December</option>
      </select>

      <select className="h-11 px-4 rounded-xl border border-slate-200 outline-none min-w-[110px]">
        <option>2026</option>
        <option>2025</option>
        <option>2024</option>
        <option>2023</option>
      </select>
    </div>
  </div>
</div>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full">
          <thead>
            <tr className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
              <th className="px-5 py-4 text-left">S.No</th>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-center">Time Sheet</th>
              <th className="px-5 py-4 text-center">Total</th>
              <th className="px-5 py-4 text-left">
                Reason For Rejection
              </th>
              <th className="px-5 py-4 text-center">Revert</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 hover:bg-red-50"
              >
                <td className="px-5 py-5 font-semibold">
                  {index + 1}
                </td>

                <td className="px-5 py-5 font-semibold">
                  {row.name}
                </td>

                <td className="px-5 py-5 text-center">
                  <button className="inline-flex items-center gap-2 bg-[#1392d3] text-white px-4 py-2 rounded-xl">
                    <Eye size={16} />
                    View
                  </button>
                </td>

                <td className="px-5 py-5 text-center font-bold">
                  {row.total.toLocaleString()}
                </td>

                <td className="px-5 py-5">
                  <span className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium">
                    {row.reason}
                  </span>
                </td>

                <td className="px-5 py-5 text-center">
                  <button className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl font-semibold">
                    <CornerUpLeft size={16} />
                    Revert
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}