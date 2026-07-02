"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ClientRecord = {
  id: number;
  client: string;
  month: string;
  year: string;
  expectedRevenue: number;
  revenueReceived: number;
  pending: number;
  hcaSalary: number;
  advance: number;
  hostel: number;
  travel: number;
  other: number;
};

const data: ClientRecord[] = [
  { id: 1, client: "Ramesh", month: "January", year: "2026", expectedRevenue: 1280000, revenueReceived: 1125000, pending: 155000, hcaSalary: 220000, advance: 42000, hostel: 26000, travel: 14000, other: 12000 },
  { id: 2, client: "Prem", month: "January", year: "2026", expectedRevenue: 980000, revenueReceived: 910000, pending: 70000, hcaSalary: 180000, advance: 31000, hostel: 24000, travel: 12000, other: 9000 },
  { id: 3, client: "Suresh", month: "January", year: "2026", expectedRevenue: 1430000, revenueReceived: 1260000, pending: 170000, hcaSalary: 240000, advance: 50000, hostel: 28000, travel: 16000, other: 13000 },
  { id: 4, client: "Neha", month: "January", year: "2026", expectedRevenue: 1185000, revenueReceived: 1090000, pending: 95000, hcaSalary: 210000, advance: 38000, hostel: 23000, travel: 14500, other: 10500 },

  { id: 5, client: "Priya", month: "February", year: "2026", expectedRevenue: 1175000, revenueReceived: 1043000, pending: 131000, hcaSalary: 205000, advance: 35000, hostel: 22500, travel: 15000, other: 10000 },
  { id: 6, client: "Amit", month: "February", year: "2026", expectedRevenue: 860000, revenueReceived: 770000, pending: 90000, hcaSalary: 165000, advance: 29000, hostel: 19000, travel: 13000, other: 8500 },
  { id: 7, client: "Sneha", month: "February", year: "2026", expectedRevenue: 1490000, revenueReceived: 1355000, pending: 135000, hcaSalary: 245000, advance: 47000, hostel: 29000, travel: 17000, other: 14000 },
  { id: 8, client: "Rahul", month: "February", year: "2026", expectedRevenue: 1010000, revenueReceived: 930000, pending: 80000, hcaSalary: 192000, advance: 33000, hostel: 21000, travel: 12500, other: 9500 },

  { id: 9, client: "Kavita", month: "March", year: "2026", expectedRevenue: 1325000, revenueReceived: 1210000, pending: 115000, hcaSalary: 215000, advance: 43000, hostel: 25000, travel: 14500, other: 11500 },
  { id: 10, client: "Rohit", month: "March", year: "2026", expectedRevenue: 940000, revenueReceived: 830000, pending: 110000, hcaSalary: 185000, advance: 32000, hostel: 22000, travel: 12500, other: 10000 },
  { id: 11, client: "Seema", month: "March", year: "2026", expectedRevenue: 1570000, revenueReceived: 1410000, pending: 160000, hcaSalary: 250000, advance: 52000, hostel: 29000, travel: 17000, other: 14000 },
  { id: 12, client: "Kiran", month: "March", year: "2026", expectedRevenue: 1090000, revenueReceived: 995000, pending: 95000, hcaSalary: 198000, advance: 36000, hostel: 22000, travel: 13500, other: 10000 },

  { id: 13, client: "Ajay", month: "April", year: "2026", expectedRevenue: 1110000, revenueReceived: 1060000, pending: 50000, hcaSalary: 202000, advance: 33000, hostel: 23000, travel: 13500, other: 10500 },
  { id: 14, client: "Anita", month: "April", year: "2026", expectedRevenue: 990000, revenueReceived: 920000, pending: 70000, hcaSalary: 188000, advance: 30000, hostel: 21500, travel: 12500, other: 9500 },
  { id: 15, client: "Vivek", month: "April", year: "2026", expectedRevenue: 1235000, revenueReceived: 1135000, pending: 100000, hcaSalary: 222000, advance: 41000, hostel: 25500, travel: 15000, other: 12000 },
  { id: 16, client: "Divya", month: "April", year: "2026", expectedRevenue: 1460000, revenueReceived: 1330000, pending: 130000, hcaSalary: 238000, advance: 45000, hostel: 27500, travel: 16000, other: 12800 },

  { id: 17, client: "Rajesh", month: "May", year: "2026", expectedRevenue: 1580000, revenueReceived: 1490000, pending: 90000, hcaSalary: 262000, advance: 54000, hostel: 30000, travel: 17500, other: 14500 },
  { id: 18, client: "Pooja", month: "May", year: "2026", expectedRevenue: 1045000, revenueReceived: 940000, pending: 105000, hcaSalary: 200000, advance: 34000, hostel: 22500, travel: 14000, other: 11500 },
  { id: 19, client: "Tanu", month: "May", year: "2026", expectedRevenue: 1360000, revenueReceived: 1220000, pending: 140000, hcaSalary: 228000, advance: 46000, hostel: 27000, travel: 16000, other: 12500 },
  { id: 20, client: "Arjun", month: "May", year: "2026", expectedRevenue: 1150000, revenueReceived: 1040000, pending: 110000, hcaSalary: 208000, advance: 39000, hostel: 23500, travel: 14500, other: 11000 },

  { id: 21, client: "Meena", month: "June", year: "2026", expectedRevenue: 1275000, revenueReceived: 1190000, pending: 85000, hcaSalary: 218000, advance: 41000, hostel: 25000, travel: 15000, other: 11800 },
  { id: 22, client: "Sanjay", month: "June", year: "2026", expectedRevenue: 1420000, revenueReceived: 1305000, pending: 115000, hcaSalary: 236000, advance: 47000, hostel: 28000, travel: 16500, other: 13200 },
  { id: 23, client: "Lakshmi", month: "June", year: "2026", expectedRevenue: 980000, revenueReceived: 890000, pending: 90000, hcaSalary: 182000, advance: 32000, hostel: 21000, travel: 12500, other: 9800 },
  { id: 24, client: "Harish", month: "June", year: "2026", expectedRevenue: 1610000, revenueReceived: 1515000, pending: 95000, hcaSalary: 268000, advance: 55000, hostel: 30500, travel: 17800, other: 14800 },

  { id: 25, client: "Naveen", month: "July", year: "2026", expectedRevenue: 1200000, revenueReceived: 1105000, pending: 95000, hcaSalary: 214000, advance: 40000, hostel: 24000, travel: 14500, other: 11200 },
  { id: 26, client: "Bhavana", month: "July", year: "2026", expectedRevenue: 1340000, revenueReceived: 1240000, pending: 100000, hcaSalary: 226000, advance: 43000, hostel: 25500, travel: 15500, other: 12000 },
  { id: 27, client: "Manoj", month: "July", year: "2026", expectedRevenue: 1085000, revenueReceived: 985000, pending: 100000, hcaSalary: 194000, advance: 34000, hostel: 22000, travel: 13500, other: 10400 },
  { id: 28, client: "Deepika", month: "July", year: "2026", expectedRevenue: 1520000, revenueReceived: 1410000, pending: 110000, hcaSalary: 252000, advance: 51000, hostel: 29200, travel: 17000, other: 13800 },
];
const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const yearOptions = ["2024", "2025","2026", "2027", "2028"];


function formatCurrency(value: number) {
  return value.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function getStatus(client: ClientRecord) {
  if (client.pending > client.revenueReceived * 0.2) return "Critical";
  if (client.revenueReceived < client.expectedRevenue * 0.85) return "At Risk";
  return "On Track";
}

export default function RevenueAnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [activeTab, setActiveTab] = useState<"current" | "Carry Forward">("current");
  const [showCurrentInOutstanding, setShowCurrentInOutstanding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const router = useRouter();
  const filteredData = useMemo(() => {
    return data.filter((record) => {
      const matchesYear = record.year === selectedYear;
      const matchesMonth = activeTab === "Carry Forward"
        ? showCurrentInOutstanding
          ? record.month === selectedMonth
          : true
        : record.month === selectedMonth;
      const matchesSearch = record.client.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesYear && matchesMonth && matchesSearch;
    });
  }, [selectedMonth, selectedYear, searchTerm, activeTab, showCurrentInOutstanding]);

  const currentMonthName = monthOptions[new Date().getMonth()];
  const currentYearName = new Date().getFullYear().toString();
  const showExpectedRevenue = activeTab === "current" && selectedMonth === currentMonthName && selectedYear === currentYearName;

  const analytics = useMemo(() => {
    const expectedRevenue = filteredData.reduce((sum, item) => sum + item.expectedRevenue, 0);
    const revenueReceived = filteredData.reduce((sum, item) => sum + item.revenueReceived, 0);
    const pendingCollection = filteredData.reduce((sum, item) => sum + item.pending, 0);
    const totalExpenses = filteredData.reduce((sum, item) => sum + item.hcaSalary + item.advance + item.hostel + item.travel + item.other, 0);
    const netProfitLoss = revenueReceived - totalExpenses;
    const collectionPercent = expectedRevenue ? revenueReceived / expectedRevenue : 0;
    const profitMarginPercent = revenueReceived ? netProfitLoss / revenueReceived : 0;
    const expenseRatioPercent = revenueReceived ? totalExpenses / revenueReceived : 0;

    return {
      expectedRevenue,
      revenueReceived,
      pendingCollection,
      totalExpenses,
      netProfitLoss,
      collectionPercent,
      profitMarginPercent,
      expenseRatioPercent,
    };
  }, [filteredData]);

  const topProfitable = useMemo(() => {
    return [...filteredData]
      .map((item) => ({
        ...item,
        profitLoss: item.revenueReceived - (item.hcaSalary + item.advance + item.hostel + item.travel + item.other),
      }))
      .sort((a, b) => b.profitLoss - a.profitLoss)
      .slice(0, 5);
  }, [filteredData]);

  const topLossMaking = useMemo(() => {
    return [...filteredData]
      .map((item) => ({
        ...item,
        profitLoss: item.revenueReceived - (item.hcaSalary + item.advance + item.hostel + item.travel + item.other),
      }))
      .sort((a, b) => a.profitLoss - b.profitLoss)
      .slice(0, 5);
  }, [filteredData]);

  const pendingOverflow = useMemo(() => {
    return filteredData.filter((item) => item.pending > 12000);
  }, [filteredData]);
const handleLogout = () => {
  
  router.push("/DashBoard");
}
  return (
    <main className="h-screen bg-slate-50 p-2 text-slate-900 overflow-hidden flex flex-col">
      <div className="mx-auto max-w-full flex-1 overflow-y-auto">
        <div className="mb-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-[#1392d3]/10 text-[#1392d3] shadow-sm">
              
                      <img
                          src="/Icons/Curate-logoq.png"
                          className="h-10"
                          alt="Company Logo"
                        />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Revenue Analytics</p>
                <h1 className="mt-1 text-lg font-semibold text-slate-900">Curate Health Healthcare Service {selectedMonth} {selectedYear} </h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["current", "Carry Forward"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab);
                        if (tab === "current") setShowCurrentInOutstanding(false);
                      }}
                      className={`rounded-2xl cursor-pointer px-4 py-2 text-sm font-semibold ${activeTab === tab ? "bg-[#1392d3] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                    >
                      {tab === "current" ? "Current" : "Carry Forward"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
              {activeTab !== "Carry Forward"&&
            <div className="grid gap-4 sm:grid-cols-4">
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Year
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition focus:border-[#1392d3]"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Month
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition focus:border-[#1392d3] disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Search
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search clients"
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 shadow-sm outline-none transition focus:border-[#1392d3]"
                />
              </label>
                <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 w-full mt-auto sm:w-auto justify-center px-2 py-2  bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
            >
              DashBoard
            </button>
            </div>}
     
          </div>
        </div>

        <section className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: showExpectedRevenue ? "Expected Revenue" : "Revenue", value: showExpectedRevenue ? analytics.expectedRevenue : analytics.revenueReceived, color: "#1392d3" },
            { label: "Payment received", value: analytics.revenueReceived, color: "#50c896" },
            { label: "Pending payments", value: analytics.pendingCollection, color: "#ff1493" },
            { label: "Total Expenses", value: analytics.totalExpenses, color: "#1392d3" },
            { label: "Net Profit/Loss", value: analytics.netProfitLoss, color: analytics.netProfitLoss >= 0 ? "#50c896" : "#ff1493" },
            { label: "Collection %", value: analytics.collectionPercent, percent: true, color: "#1392d3" },
            { label: "Profit Margin %", value: analytics.profitMarginPercent, percent: true, color: "#50c896" },
            { label: "Expense Ratio %", value: analytics.expenseRatioPercent, percent: true, color: "#ff1493" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl bg-white p-2 shadow-sm">
              <p className="text-xs uppercase tracking-[0.1em] text-slate-500">{card.label}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {card.percent ? formatPercent(card.value) : formatCurrency(card.value)}
              </p>
              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(Math.max((card.percent ? card.value : card.value / (analytics.expectedRevenue || 1)) * 100, 0), 100)}%`,
                    backgroundColor: card.color,
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="mt-3 grid gap-3 xl:grid-cols-[1.4fr_0.6fr] h-[calc(100vh-310px)]">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm flex flex-col">
            <div className="border-b border-slate-200 px-3 py-2">
              <h2 className="text-sm font-semibold text-slate-900">Client Revenue Table</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Detailed view {activeTab === "Carry Forward" ? (showCurrentInOutstanding ? `for ${selectedMonth} ${selectedYear}` : `for all months ${selectedYear}`) : `for ${selectedMonth} ${selectedYear}`}
              </p>
            </div>
            <div className="overflow-x-auto overflow-y-auto flex-1 px-2 py-2">
              <table className="min-w-full border-separate border-spacing-0 text-left text-xs text-slate-700">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 sticky top-0">
                    {['Client', 'Revenue', 'Received', 'Pending', 'HCA Salary', 'Advance', 'Hostel', 'Travel', 'Other', 'Total Expense', 'Profit/Loss', 'Profit %', 'Collection %', 'Status'].map((heading) => (
                      <th key={heading} className="whitespace-nowrap px-2 py-1 font-semibold text-xs">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="px-2 py-4 text-center text-slate-500 text-xs">No clients found for this month.</td>
                    </tr>
                  ) : (
                    filteredData.map((item) => {
                      const totalExpense = item.hcaSalary + item.advance + item.hostel + item.travel + item.other;
                      const profitLoss = item.revenueReceived - totalExpense;
                      const profitPercent = item.revenueReceived ? profitLoss / item.revenueReceived : 0;
                      const collectionPercentValue = item.expectedRevenue ? item.revenueReceived / item.expectedRevenue : 0;
                      const status = getStatus(item);

                      return (
                        <tr key={item.id} className="border-t border-slate-200 hover:bg-slate-50">
                          <td className="px-2 py-1 font-medium text-slate-900 text-xs">{item.client}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.expectedRevenue)}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.revenueReceived)}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.pending)}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.hcaSalary)}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.advance)}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.hostel)}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.travel)}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.other)}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(totalExpense)}</td>
                          <td className={`px-2 py-1 text-xs ${profitLoss >= 0 ? 'text-emerald-600' : 'text-pink-600'}`}>{formatCurrency(profitLoss)}</td>
                          <td className="px-2 py-1 text-xs">{formatPercent(profitPercent)}</td>
                          <td className="px-2 py-1 text-xs">{formatPercent(collectionPercentValue)}</td>
                          <td className="px-2 py-1 text-xs">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status === 'On Track' ? 'bg-[#50c896]/15 text-[#50c896]' : status === 'At Risk' ? 'bg-[#1392d3]/15 text-[#1392d3]' : 'bg-[#ff1493]/15 text-[#ff1493]'}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto flex flex-col">
            <div className="rounded-xl bg-white p-2 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Pending Overflow</h2>
              <p className="mt-1 text-xs text-slate-500">Clients with extended pending balances.</p>
              <div className="mt-4 space-y-4">
                {pendingOverflow.length > 0 ? (
                  pendingOverflow.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">{item.client}</p>
                          <p className="text-xs text-slate-500">Pending {formatCurrency(item.pending)} · Received {formatCurrency(item.revenueReceived)}</p>
                        </div>
                        <span className="rounded-full bg-[#ff1493]/15 px-2 py-0.5 text-xs font-semibold text-[#ff1493] whitespace-nowrap">High</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min((item.pending / (item.expectedRevenue || 1)) * 100, 100)}%`, backgroundColor: "#ff1493" }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 text-xs">No pending overflow clients for this month.</div>
                )}
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="rounded-xl bg-white p-2 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Top 5 Profitable</h3>
                <div className="mt-1 space-y-1">
                  {topProfitable.length > 0 ? (
                    topProfitable.map((item) => {
                      const profitLoss = item.revenueReceived - (item.hcaSalary + item.advance + item.hostel + item.travel + item.other);
                      return (
                        <div key={item.id} className="rounded-lg bg-slate-50 p-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-slate-900 text-xs">{item.client}</span>
                            <span className="text-xs text-slate-600">{formatCurrency(profitLoss)}</span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-[#50c896]" style={{ width: `${Math.min((profitLoss / item.revenueReceived) * 100, 100)}%` }} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500">No profitable clients match the current filters.</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-white p-2 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Top 5 Loss Makers</h3>
                <div className="mt-1 space-y-1">
                  {topLossMaking.length > 0 ? (
                    topLossMaking.map((item) => {
                      const profitLoss = item.revenueReceived - (item.hcaSalary + item.advance + item.hostel + item.travel + item.other);
                      return (
                        <div key={item.id} className="rounded-lg bg-slate-50 p-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-slate-900 text-xs">{item.client}</span>
                            <span className="text-xs text-slate-600">{formatCurrency(profitLoss)}</span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-[#ff1493]" style={{ width: `${Math.min(Math.abs(profitLoss) / (item.revenueReceived || 1) * 100, 100)}%` }} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500">No loss-making clients match the current filters.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
