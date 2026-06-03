"use client";

import { Eye, CheckCircle2 } from "lucide-react";

export default function SuccessfulPayments() {
 const data = [
  {
    id: 1,
    name: "Kanchan",
    total: 520000,
    neft: "HCA2026007",
    dateTime: "01 Jun 2026 | 10:45 AM",
  },
  {
    id: 2,
    name: "Reddyvari",
    total: 529500,
    neft: "HCA2026002",
    dateTime: "01 Jun 2026 | 11:20 AM",
  },
  {
    id: 3,
    name: "Khushiyavishnu",
    total: 485030,
    neft: "HCA2026005",
    dateTime: "01 Jun 2026 | 12:10 PM",
  },
  {
    id: 4,
    name: "Kavita Koko",
    total: 546000,
    neft: "HCA2026009",
    dateTime: "01 Jun 2026 | 03:15 PM",
  },
  {
    id: 5,
    name: "Roshani Sunkatrao",
    total: 540000,
    neft: "HCA2026010",
    dateTime: "02 Jun 2026 | 09:10 AM",
  },
  {
    id: 6,
    name: "Priyanka",
    total: 499000,
    neft: "HCA2026011",
    dateTime: "02 Jun 2026 | 09:45 AM",
  },
  {
    id: 7,
    name: "Sanjana",
    total: 460000,
    neft: "HCA2026012",
    dateTime: "02 Jun 2026 | 11:05 AM",
  },
  {
    id: 8,
    name: "Kratika",
    total: 520000,
    neft: "HCA2026013",
    dateTime: "02 Jun 2026 | 01:30 PM",
  },
  {
    id: 9,
    name: "Anjali",
    total: 575000,
    neft: "HCA2026014",
    dateTime: "02 Jun 2026 | 02:40 PM",
  },
  {
    id: 10,
    name: "Niharika",
    total: 495000,
    neft: "HCA2026015",
    dateTime: "02 Jun 2026 | 04:15 PM",
  },
];

  return (
    <div className="bg-white rounded-3xl border border-green-100 shadow-xl overflow-hidden">
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
        <h2 className="text-2xl font-bold text-green-600">
          Successful Payments
        </h2>

        <p className="text-slate-500 text-sm">
          Successfully processed payroll transactions
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
        <table className="min-w-[1200px] w-full">
          <thead>
            <tr className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
              <th className="px-5 py-4 text-left">S.No</th>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-center">Time Sheet</th>
              <th className="px-5 py-4 text-center">Total</th>
              <th className="px-5 py-4 text-center">NEFT Number</th>
              <th className="px-5 py-4 text-center">
                Date & Time Of Pay
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 hover:bg-green-50"
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

                <td className="px-5 py-5 text-center font-bold text-slate-800">
                  {row.total.toLocaleString()}
                </td>

                <td className="px-5 py-5 text-center">
                  <span className="px-4 py-2 rounded-xl bg-slate-100 font-semibold">
                    {row.neft}
                  </span>
                </td>

                <td className="px-5 py-5 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold">
                    <CheckCircle2 size={16} />
                    {row.dateTime}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}