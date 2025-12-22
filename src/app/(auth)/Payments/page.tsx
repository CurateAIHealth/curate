"use client";

import { useMemo, useState } from "react";
import { CalendarDays, User, Download } from "lucide-react";

const payments = [
  { id: 1, name: "Meena R", role: "HCA", month: "September 2024", payable: 18500, margin: 2500, total: 21000, status: "Pending" },
  { id: 2, name: "Suresh K", role: "HCN", month: "September 2024", payable: 24000, margin: 3000, total: 27000, status: "Paid" },
  { id: 3, name: "Anitha P", role: "HCA", month: "August 2023", payable: 21000, margin: 2800, total: 23800, status: "Paid" },
  { id: 4, name: "Ramesh V", role: "HCP", month: "July 2024", payable: 32000, margin: 4500, total: 36500, status: "Pending" },
  { id: 5, name: "Lakshmi S", role: "HCA", month: "June 2024", payable: 19500, margin: 2200, total: 21700, status: "Paid" },
  { id: 6, name: "Prakash N", role: "HCN", month: "September 2023", payable: 26000, margin: 3100, total: 29100, status: "Paid" },
  { id: 7, name: "Kavitha M", role: "HCA", month: "May 2024", payable: 18000, margin: 2100, total: 20100, status: "Pending" },
  { id: 8, name: "Arun S", role: "HCP", month: "April 2024", payable: 35000, margin: 5200, total: 40200, status: "Paid" },
  { id: 9, name: "Divya R", role: "HCN", month: "March 2024", payable: 24500, margin: 2900, total: 27400, status: "Pending" },
  { id: 10, name: "Vignesh T", role: "HCA", month: "February 2024", payable: 19000, margin: 2300, total: 21300, status: "Paid" },
  { id: 11, name: "Swathi P", role: "HCN", month: "January 2024", payable: 25500, margin: 3200, total: 28700, status: "Paid" },
  { id: 12, name: "Sathish K", role: "HCP", month: "December 2023", payable: 33000, margin: 4800, total: 37800, status: "Pending" },
  { id: 13, name: "Deepa L", role: "HCA", month: "November 2023", payable: 17500, margin: 2000, total: 19500, status: "Paid" },
  { id: 14, name: "Manoj R", role: "HCN", month: "October 2023", payable: 26500, margin: 3400, total: 29900, status: "Pending" },
  { id: 15, name: "Revathi S", role: "HCA", month: "September 2023", payable: 18500, margin: 2400, total: 20900, status: "Paid" },
  { id: 16, name: "Karthik B", role: "HCP", month: "August 2024", payable: 36000, margin: 5400, total: 41400, status: "Paid" },
  { id: 17, name: "Nithya V", role: "HCN", month: "July 2023", payable: 25000, margin: 3000, total: 28000, status: "Pending" },
  { id: 18, name: "Gokul S", role: "HCA", month: "June 2023", payable: 17000, margin: 1900, total: 18900, status: "Paid" },
  { id: 19, name: "Bhavani R", role: "HCN", month: "May 2023", payable: 24000, margin: 2800, total: 26800, status: "Pending" },
  { id: 20, name: "Srinivas P", role: "HCP", month: "April 2023", payable: 34000, margin: 5000, total: 39000, status: "Paid" },
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

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const [m, y] = p.month.split(" ");
      if (selectedMonth !== "All" && m !== selectedMonth) return false;
      if (selectedYear !== "All" && y !== selectedYear) return false;
      return true;
    });
  }, [selectedMonth, selectedYear]);

  const generateInvoice = (payment: any) => {
    console.log("Generate invoice for:", payment.name);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100">


      <div className="sticky top-0 z-30 bg-white p-4 sm:p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-gray-300 shadow-lg flex items-center justify-center pl-2">
              <img src="/Icons/Curate-logoq.png" className="h-10 sm:h-16" />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#ff1493]">
                Payments Overview
              </h2>
              <p className="text-sm sm:text-base text-[#50c896]">
                Manage employee & HCP payments
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded-xl border font-semibold"
            >
              <option value="All">All Months</option>
              {months.map(m => <option key={m}>{m}</option>)}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-xl border font-semibold"
            >
              <option value="All">All Years</option>
              {years.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

 
      <div className="hidden sm:block md:max-h-[520px] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-20">
            <tr className="text-sm text-gray-600">
              <th className="px-4 py-3 text-left">Staff</th>
              <th className="px-4 py-3 hidden sm:table-cell">Month</th>
              <th className="px-4 py-3 hidden md:table-cell">Payable</th>
              <th className="px-4 py-3 hidden md:table-cell">Margin</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Invoice</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map(p => (
              <tr key={p.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1392d3] flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.role}</p>
                    </div>
                  </div>
                </td>

                <td className="hidden sm:table-cell text-center">{p.month}</td>
                <td className="hidden md:table-cell text-center">₹{p.payable.toLocaleString()}</td>
                <td className="hidden md:table-cell text-center text-[#1392d3]">₹{p.margin.toLocaleString()}</td>

                <td className="text-center font-bold">₹{p.total.toLocaleString()}</td>

                <td className="text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${p.status === "Paid"
                      ? "bg-green-100 text-[#50c896]"
                      : "bg-pink-100 text-[#ff1493]"}`}>
                    {p.status}
                  </span>
                </td>

                <td className="text-center">
                  <button
                    onClick={() => generateInvoice(p)}
                    className="px-4 py-2 rounded-xl bg-[#1392d3] text-white font-semibold inline-flex gap-2"
                  >
                    <Download size={16} /> Generate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="block sm:hidden p-4 space-y-4">
        {filteredPayments.map(p => (
          <div key={p.id} className="border rounded-2xl p-4 shadow-sm">
            <div className="flex gap-3 items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1392d3] flex items-center justify-center">
                <User size={18} />
              </div>
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-gray-500">{p.role}</p>
              </div>
            </div>

            <p className="text-sm"><b>Month:</b> {p.month}</p>
            <p className="text-sm"><b>Total:</b> ₹{p.total.toLocaleString()}</p>

            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
              ${p.status === "Paid"
                ? "bg-green-100 text-[#50c896]"
                : "bg-pink-100 text-[#ff1493]"}`}>
              {p.status}
            </span>

            <button
              onClick={() => generateInvoice(p)}
              className="mt-3 w-full flex justify-center items-center gap-2
                         px-4 py-2 rounded-xl bg-[#1392d3] text-white font-semibold"
            >
              <Download size={16} /> Generate Invoice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
