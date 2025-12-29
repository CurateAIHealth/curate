"use client";

import { useMemo, useState } from "react";
import { User, Download } from "lucide-react";

const payments = [
  {
    id: 1,
    name: "Meena R",
    role: "HCA",
    month: "September 2024",
    salary: 18500,
    hostelDays: 20,
    hostelPerDay: 150,
    advancePaid: 3000,
    margin: 2500,
    status: "Pending",
  },
  {
    id: 2,
    name: "Suresh K",
    role: "HCN",
    month: "September 2024",
    salary: 24000,
    hostelDays: 25,
    hostelPerDay: 200,
    advancePaid: 5000,
    margin: 3000,
    status: "Paid",
  },
  {
    id: 3,
    name: "Anitha P",
    role: "HCA",
    month: "August 2023",
    salary: 21000,
    hostelDays: 18,
    hostelPerDay: 150,
    advancePaid: 2000,
    margin: 2800,
    status: "Paid",
  },
];

export default function PaymentsUI() {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const years = useMemo(
    () => Array.from(new Set(payments.map(p => p.month.split(" ")[1]))),
    []
  );

  const processedPayments = useMemo(() => {
    return payments
      .map(p => {
        const hostelCharge = p.hostelDays * p.hostelPerDay;
        const netPayable = p.salary - hostelCharge - p.advancePaid;
        const totalBilling = netPayable + p.margin;

        return {
          ...p,
          hostelCharge,
          netPayable,
          totalBilling,
        };
      })
      .filter(p => {
        const [m, y] = p.month.split(" ");
        if (selectedMonth !== "All" && m !== selectedMonth) return false;
        if (selectedYear !== "All" && y !== selectedYear) return false;
        return true;
      });
  }, [selectedMonth, selectedYear]);

  const generateInvoice = (payment: any) => {
    console.log("Generate invoice for:", payment);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100">

      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
  <div className="p-4 sm:p-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

      {/* LEFT : LOGO + TITLE */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border border-gray-300 shadow-lg flex items-center justify-center">
          <img
            src="/Icons/Curate-logoq.png"
            alt="Curate Logo"
            className="h-8 sm:h-12 object-contain"
          />
        </div>

        <div className="leading-tight">
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#ff1493]">
            Payments Overview
          </h2>
          <p className="text-sm sm:text-base text-[#50c896]">
            Manage employee & HCP payments
          </p>
        </div>
      </div>

      {/* RIGHT : FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 
                     font-semibold text-sm focus:outline-none 
                     focus:ring-2 focus:ring-[#ff1493]"
        >
          <option value="All">All Months</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 
                     font-semibold text-sm focus:outline-none 
                     focus:ring-2 focus:ring-[#1392d3]"
        >
          <option value="All">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
</div>


      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Staff</th>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Salary</th>
              <th className="px-4 py-3">Hostel</th>
              <th className="px-4 py-3">Hostel Days</th>
              <th className="px-4 py-3">Advance</th>
              <th className="px-4 py-3 text-green-700">Net Payable</th>
              <th className="px-4 py-3 text-blue-700">Margin</th>
              <th className="px-4 py-3 font-bold">Total Billing</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Invoice</th>
            </tr>
          </thead>

          <tbody>
            {processedPayments.map(p => (
              <tr key={p.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1392d3] flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.role}</p>
                    </div>
                  </div>
                </td>

                <td className="text-center">{p.month}</td>

                <td className="text-center">
                  ₹{p.salary.toLocaleString()}
                </td>

                <td className="text-center text-red-600">
                  ₹{p.hostelCharge.toLocaleString()}
                </td>
<td className="text-center font-semibold text-gray-700">
  {p.hostelDays}
</td>

                <td className="text-center text-amber-600">
                  ₹{p.advancePaid.toLocaleString()}
                </td>

                <td className="text-center font-bold text-[#50c896]">
                  ₹{p.netPayable.toLocaleString()}
                </td>

                <td className="text-center text-[#1392d3]">
                  ₹{p.margin.toLocaleString()}
                </td>

                <td className="text-center font-bold">
                  ₹{p.totalBilling.toLocaleString()}
                </td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${p.status === "Paid"
                      ? "bg-green-100 text-[#50c896]"
                      : "bg-pink-100 text-[#ff1493]"}`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="text-center">
                  <button
                    onClick={() => generateInvoice(p)}
                    className="px-4 py-2 rounded-xl bg-[#1392d3] text-white font-semibold inline-flex gap-2"
                  >
                    <Download size={14} /> Generate
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
