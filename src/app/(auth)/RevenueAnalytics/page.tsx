"use client";

import { LoadingData } from "@/Components/Loading/page";
import { getDaysBetween } from "@/Lib/Actions";
import axios from "axios";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

type ClientRecord = {
  PerDaySalary: any;
  hcaWorkingDays: any;
  id: number;
  client: string;
  HCAId: string;
  month: string;
  year: string;
  expectedRevenue: number;
  Refund:any;
  revenueReceived: number;
  pending: number;
  hcaSalary: number;
  advance: number;
  hostel: number;
  travel: number;
  other: number;
};


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
  const [ImportedData, setImportedData] = useState<any[]>([]);
    const [isChecking, setIsChecking] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [activeTab, setActiveTab] = useState<"current" | "Carry Forward">("current");
  const [showCurrentInOutstanding, setShowCurrentInOutstanding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const UserFullInfo=useSelector((state:any)=>state.AdminFullInfo)
const router = useRouter();


let revenueCache: any[] | null = null;
let revenueCacheTime = 0;

const CACHE_TIME = 5 * 60 * 1000; 



const FetchDatFromDb = async (forceRefresh = false) => {
  try {
      if (
    UserFullInfo?.length === 0 
  ) {
    router.push("/");
  }
  const userId = localStorage.getItem("UserId");

  if (!userId) {
         router.push("/sign-in");
    return;
  }
    setIsChecking(true);

    const now = Date.now();
    if (
      !forceRefresh &&
      revenueCache &&
      now - revenueCacheTime < CACHE_TIME
    ) {
      console.log("Using Cached Revenue Data");
      setImportedData(revenueCache);
      return;
    }

    console.log("Fetching Revenue Data...");

    const { data } = await axios.get("/api/revenue-data");

    revenueCache = data.data;
    revenueCacheTime = now;
console.log("Fetched Revenue Data:", revenueCache);
    setImportedData(revenueCache || []);

    console.log(
      "Sent Records:",
      revenueCache?.filter((record: any) => record.status === "Sent")
    );
  } catch (error) {
    console.error(error);
  } finally {
    setIsChecking(false);
  }
};

useEffect(() => {
  FetchDatFromDb();
}, []);




const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
   const GetHCPPayment = (A: any) => {
    if (!UserFullInfo?.length || !A) return 0;

    const address =
      UserFullInfo
        ?.map((each: any) => each?.HCAComplitInformation)
        ?.find((info: any) => info?.UserId === A)
      ?.["PaymentforStaff"] || 0;

    return Number(address) || 0;
  };
  const getDaysInMonth = (monthName: string, year: string) => {
  const monthIndex = monthNames.indexOf(monthName);
  return new Date(Number(year), monthIndex + 1, 0).getDate();
};
const revenueData: ClientRecord[] = ImportedData
  .filter((record: any) => record.status === "Sent")
  .map((record: any, index: number) => {
    const startDate =
      record.SeriviceStartDate ||
      record.ServiceStartDate ||
      record.serviceFrom ||
      record.DeployDate;

    const [day, month, year] = startDate.split("/");

console.log("Start Date:", record);
    return {
      id: index + 1,
      client: record.ClientName,
      HCAId: record.HCAId || record.UserId || "",
      month: monthNames[Number(month) - 1],
      year,
      expectedRevenue: Number(record.RoundedTotal || 0),
      revenueReceived:
        (record.Trasaction?.reduce(
          (sum: number, transaction: any) =>
            sum + Number(transaction.amount || 0),
          0
        ) || 0) +
        Number(
          record.AdvancePaid ||
          record.AdvanceReceived ||
          0
        ),
      pending: Number(record.balanceDue || 0),
      hcaSalary: GetHCPPayment(record.HCAId)/Number(getDaysInMonth(selectedMonth, selectedYear))*getDaysBetween(startDate, record.ServiceEndDate) || 0,
      hcaWorkingDays: getDaysBetween(startDate, record.ServiceEndDate),
      PerDaySalary: GetHCPPayment(record.HCAId)/Number(getDaysInMonth(selectedMonth, selectedYear)) || 0,
      advance: Number(record.AdvancePaid || 0),
      hostel: 0,
      travel: 0,
      other: Number(record.OtherExpenses || 0),
      Refund: Number(record.
RefundAmount || 0),
    };
  });


  const filteredData = useMemo(() => {
    return revenueData.filter((record) => {
      const matchesYear = record.year === selectedYear;
      const matchesMonth = activeTab === "Carry Forward"
        ? showCurrentInOutstanding
          ? record.month === selectedMonth
          : true
        : record.month === selectedMonth;
      const matchesSearch = record.client.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesYear && matchesMonth && matchesSearch;
    });
  }, [ImportedData,UserFullInfo,selectedMonth, selectedYear, searchTerm, activeTab, showCurrentInOutstanding]);
console.log("ImpData----",GetHCPPayment("22d311d0-daea-4fe2-a5bf-814e1d332820"));
  const currentMonthName = monthOptions[new Date().getMonth()];
  const currentYearName = new Date().getFullYear().toString();
  const showExpectedRevenue = activeTab === "current"&&currentMonthName===selectedMonth&&currentYearName===selectedYear;

  const analytics = useMemo(() => {
    const expectedRevenue = filteredData.reduce((sum, item) => sum + item.expectedRevenue, 0);
    const revenueReceived = filteredData.reduce((sum, item) => sum + item.revenueReceived, 0);
    const RefundAmount = filteredData.reduce((sum, item) => sum + item.Refund, 0);
    const pendingCollection = filteredData.reduce((sum, item) => sum + item.pending - item.Refund, 0);
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
      RefundAmount,
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

 if (isChecking) {
    return (
      <LoadingData />
    );
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
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Revenue Analytics {selectedMonth}</p>
                <h1 className="mt-1 text-lg font-semibold text-slate-900">Curate Health Healthcare Service {currentMonthName} </h1>
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
            { label: showExpectedRevenue ? "Expected Revenue" : "Revenue", value: showExpectedRevenue ? analytics.expectedRevenue : analytics.expectedRevenue, color: "#1392d3" },
            { label: "Payment received", value: analytics.revenueReceived, color: "#50c896" },
            { label: "Pending payments", value: analytics.pendingCollection, color: "#ff1493" },
            { label: "Total Expenses", value: analytics.totalExpenses, color: "#1392d3" },
            { label: "Refund Amount", value: analytics.RefundAmount, color: "#ff1493" },
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
                    {['Client', 'Revenue', 'Received', 'Pending', 'HCA Salary', 'Advance', 'Hostel', 'Travel', 'Other', "Refund", 'Total Expense', 'Profit/Loss', 'Profit %', 'Collection %', 'Status'].map((heading) => (
                      <th key={heading} className="whitespace-nowrap px-2 py-1 font-semibold text-xs">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="px-2 py-4 text-center text-slate-500 text-xs">No clients found for this month.</td>
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
                        
                          <td className="px-2 py-1 text-xs">  
  <div className="flex items-center gap-1">
    {formatCurrency(item.hcaSalary)}

    <div className="relative group cursor-pointer">
      <Info size={12} className="text-slate-500" />

      <div className="absolute left-1/2 top-5 z-50 hidden w-64 -translate-x-1/2 rounded-lg bg-slate-800 px-3 py-2 text-[11px] text-white shadow-lg group-hover:block">
        Monthly Salary: {item.PerDaySalary ? Math.round(item.PerDaySalary * item.hcaWorkingDays) :0}
        <br />
        Days Worked: {item.hcaWorkingDays}
      
        <br />
      Per Day: {item.PerDaySalary ?Math.round(item.PerDaySalary) : 0}
      </div>
    </div>
  </div>
</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.advance)}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.hostel)}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.travel)}</td>
                          <td className="px-2 py-1 text-xs">{formatCurrency(item.other)}</td>
                            <td className="px-2 py-1 text-xs">{formatCurrency(item.Refund)}</td>
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
                            <span className="text-xs text-slate-600">{formatCurrency(profitLoss)} ({item.hcaWorkingDays} days)</span>
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
