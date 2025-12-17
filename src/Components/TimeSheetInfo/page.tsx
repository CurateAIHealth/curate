"use client";

import { GetDeploymentInfo, UpdateAllPendingAttendance } from "@/Lib/user.action";
import { UpdateClient, UpdateUserInformation } from "@/Redux/action";
import { Eye, X } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import MissingAttendence from "../MissingAttendence/page";
import { PaymentInfoModal } from "../PaymentInfoModel/page";

type DayStatus = "P" | "NA" | "HP" | "A";

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function InvoiceMedicalTable() {
 const now = new Date();
const currentYear = now.getFullYear().toString();
const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

const [selectedMonth, setSelectedMonth] = useState(currentMonth);
const [selectedYear, setSelectedYear] = useState(currentYear);
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [billingRecord, setBillingRecord] = useState<any>(null);
  const [ClientsInformation, setClientsInformation] = useState<any>({});
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showPendingCalendar, setShowPendingCalendar] = useState(false);
   const [showMissingCalendar, setShowMissingCalendar] = useState(false);
  const [StatusMessage,SetStatusMessage]=useState<any>("")

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const Fetch = async () => {
      const PlacementInformation: any = await GetDeploymentInfo();
      if (!PlacementInformation || PlacementInformation.length === 0) return;

      const formattedData: any = {};
      PlacementInformation.forEach((record: any) => {
        const monthKey = record.Month || "Unknown";
        if (!formattedData[monthKey]) formattedData[monthKey] = [];
        formattedData[monthKey].push({
          invoice: record.invoice || "",
          startDate: record.StartDate || "",
          endDate: record.EndDate || "",
          status: record.Status || "Inactive",
          location: record.Address || "N/A",
          clientPhone: record.ClientContact || "",
          clientName: record.ClientName || "",
          ClientId: record.ClientId || "",
          patientName: record.patientName || "",
          referralName: record.referralName || "",
          hcp: "Assist",
          VendorName: record.VendorName || "Curate",
          Type: record.Type || "HCA",
          hcpId: record.HCAId || "",
          hcpName: record.HCAName || "",
          hcpPhone: record.HCAContact || "",
          hcpSource: record.hcpSource || "",
          provider: record.provider || "",
          payTerms: record.payTerms || "",
          cTotal: Number(record.cTotal) || 0,
          cPay: Number(record.cPay) || 0,
          hcpTotal: Number(record.hcpTotal) || 0,
          hcpPay: Number(record.hcpPay) || 0,
          days: record.Attendance || [],
        });
      });

      setClientsInformation(formattedData);
    };

    Fetch();
  }, [StatusMessage]);

  const months = [
    { value: "01", name: "January" },
    { value: "02", name: "February" },
    { value: "03", name: "March" },
    { value: "04", name: "April" },
    { value: "05", name: "May" },
    { value: "06", name: "June" },
    { value: "07", name: "July" },
    { value: "08", name: "August" },
    { value: "09", name: "September" },
    { value: "10", name: "October" },
    { value: "11", name: "November" },
    { value: "12", name: "December" },
  ];

  const years = ["2024", "2025", "2026"];

  // Current month key and records
  const monthKey = `${selectedYear}-${selectedMonth}`;
  const data: any[] = ClientsInformation[monthKey] || [];

  // How many days in this month
  const daysInMonth = new Date(
    Number(selectedYear),
    Number(selectedMonth),
    0
  ).getDate();

  // First day index & total cells for full 6-week grid
  const { firstDayIndex, totalCells } = useMemo(() => {
    const firstDay = new Date(
      Number(selectedYear),
      Number(selectedMonth) - 1,
      1
    ).getDay();
    const cells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    return { firstDayIndex: firstDay, totalCells: cells };
  }, [selectedYear, selectedMonth, daysInMonth]);

  // Pending summary – ONLY for the selected month/year
  const pendingSummary = useMemo(() => {
    const summaryMap: any = {};
    const currentRecords: any[] = ClientsInformation[monthKey] || [];

    // First add ALL HCPs (for this month) even if no pending yet
    currentRecords.forEach((rec: any) => {
      const key = rec.hcpId || rec.hcpName;
      if (!summaryMap[key]) {
        summaryMap[key] = {
          hcpId: rec.hcpId,
          hcpName: rec.hcpName,
          pendingDates: [] as Date[],
          pendingCount: 0,
        };
      }
    });

    // Now add pending attendance for selected month/year
    currentRecords.forEach((rec: any) => {
      const pending = (rec.days || []).filter((a: any) => {
        if (!(a.HCPAttendence === true && a.AdminAttendece === false))
          return false;
        // make sure the pending date itself is in selected month/year
        const d = new Date(a.AttendenceDate);
        return (
          d.getMonth() + 1 === Number(selectedMonth) &&
          d.getFullYear() === Number(selectedYear)
        );
      });

      if (!pending.length) return;

      const key = rec.hcpId || rec.hcpName;

      summaryMap[key].pendingDates.push(
        ...pending.map((p: any) => new Date(p.AttendenceDate))
      );
      summaryMap[key].pendingCount = summaryMap[key].pendingDates.length;
    });

    return Object.values(summaryMap).filter((p: any) => p.pendingCount > 0);
  }, [ClientsInformation, monthKey, selectedMonth, selectedYear]);

  // Day → list of HCPs pending (for current month)
  const pendingByDay = useMemo(() => {
    const map: Record<number, string[]> = {};

    pendingSummary.forEach((item: any) => {
      (item.pendingDates || []).forEach((d: Date) => {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(item.hcpName);
      });
    });

    return map;
  }, [pendingSummary]);

  // Colors for HCP chips
  const categoryColors = [
    "bg-red-100 text-red-700 border-red-200",
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-yellow-100 text-yellow-700 border-yellow-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-indigo-100 text-indigo-700 border-indigo-200",
  ];

  const getHCPColor = (name: string) => {
    let index = name.charCodeAt(0) % categoryColors.length;
    return categoryColors[index];
  };

  // Processed table data
  const processedData = useMemo(() => {
    return data.map((record: any) => {
      const dayStatusArray = Array.from({ length: 31 }, () => "-");

      (record.days || []).forEach((att: any) => {
        let d = att.AttendenceDate;
        const dateObj = new Date(d);
        const day = dateObj.getDate();

        const hcp = att.HCPAttendence === true;
        const admin = att.AdminAttendece === true;

        let status: DayStatus = "A";

        if (hcp && admin) {
          status = "P";
        } else if (hcp || admin) {
          status = "HP";
        } else {
          status = "A";
        }

        if (day >= 1 && day <= 31) {
          dayStatusArray[day - 1] = status;
        }
      });

      const counts = dayStatusArray.reduce(
        (acc: any, v: string) => {
          if (v === "P") acc.pd++;
          if (v === "A") acc.ad++;
          if (v === "HP") acc.hp++;
          return acc;
        },
        { pd: 0, ad: 0, hp: 0 }
      );

      return { ...record, days: dayStatusArray, ...counts };
    });
  }, [data]);

  const RouteToClient = (A: any, ClientName: any) => {
    if (A) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(A));
      router.push("/UserInformation");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight flex items-center gap-3">
            🩺 Curate Health — Time Sheet 
          </h1>
          <p className="text-gray-500 mt-1">
            View invoice and attendance details by month and year.
          </p>
        </div>

        

        <div className="flex gap-3">
           <button
          onClick={() => setShowMissingCalendar(true)}
          className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-lg shadow hover:bg-blue-800 self-start"
        >
          View Missing Attendance
        </button>
          <button
          onClick={() => setShowPendingCalendar(true)}
          className="px-4 py-2 bg-teal-600 cursor-pointer text-white rounded-lg shadow hover:bg-teal-800 self-start"
        >
          View Pending Attendance
        </button>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-xl border border-gray-300 p-2 bg-white shadow-sm hover:border-green-400 focus:border-green-500 focus:ring-1 focus:ring-green-400"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-xl border border-gray-300 p-2 bg-white shadow-sm hover:border-green-400 focus:border-green-500 focus:ring-1 focus:ring-green-400"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </header>
{showPaymentModal && billingRecord && (
  <PaymentInfoModal
    record={billingRecord}
    onClose={() => { setShowPaymentModal(false); setBillingRecord(null); }}
    onConfirm={(billingResult) => {
 
      console.log("Saving billing:", billingResult);
     
    
    }}
  />
)}
      {/* MAIN TABLE (unchanged) */}
      <div className="overflow-x-auto bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md rounded-2xl">
        <table className="min-w-[2800px] border-collapse text-sm text-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-left">
              <Th>View</Th>
              <Th>Invoice</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>Client Name</Th>
              <Th>Patient Name</Th>
              <Th>Referral Name</Th>
              <Th>HCP Name</Th>
              <Th>HCP Referral</Th>
              <Th>Vendor</Th>
              <Th>Type</Th>
               <Th className="bg-amber-400 text-center">Payment Info</Th>
              <Th className="bg-amber-400 text-center">PD</Th>
              <Th className="bg-amber-400 text-center">AD</Th>
              <Th className="bg-amber-400 text-center">HP</Th>
             
              {Array.from({ length: 31 }, (_, i) => (
                <Th key={i} className="text-center bg-cyan-500 text-white">
                  {i + 1}
                </Th>
              ))}
            </tr>
          </thead>

          <tbody>
            {processedData.map((r: any, idx: any) => (
              <tr
                key={idx}
                className={`border-t border-gray-200 ${
                  idx % 2 ? "bg-white" : "bg-green-50/40"
                } hover:bg-green-100/40 transition-colors`}
              >
                <Td>
                  <Eye
                    className="cursor-pointer text-blue-600 hover:text-blue-800 transition"
                    onClick={() => setSelectedRecord(r)}
                  />
                </Td>
                <Td>{r.invoice}</Td>
                <Td>{r.startDate}</Td>
                <Td>{r.endDate}</Td>
                <td
                  className="px-4 py-2 whitespace-nowrap font-medium hover:underline cursor-pointer hover:text-blue-600"
                  onClick={() => RouteToClient(r.ClientId, r.clientName)}
                >
                  {r.clientName}
                </td>

                <Td>{r.patientName}</Td>
                <Td
                  className={`${
                    r.referralName
                      ? "text-green-800 font-bold"
                      : "text-red-800 font-bold"
                  }`}
                >
                  {r.referralName}
                </Td>

                <td
                  className="px-4 py-2 whitespace-nowrap font-medium hover:underline cursor-pointer hover:text-blue-600"
                  onClick={() => RouteToClient(r.hcpId, r.hcpName)}
                >
                  {r.hcpName}
                </td>

                <Td
                  className={`${
                    r.hcpSource
                      ? "text-green-800 font-bold"
                      : "text-red-800 font-bold"
                  }`}
                >
                  {r.hcpSource}
                </Td>
                <Td
                  className={`${
                    r.VendorName
                      ? "text-green-800 font-bold"
                      : "text-red-800 font-bold"
                  }`}
                >
                  {r.VendorName}
                </Td>
                <Td>{r.Type}</Td>
<Td>
  <button
    className="p-2 text-center text-white bg-teal-700 rounded-full w-fit cursor-pointer"
    onClick={() => {
      setBillingRecord(r);
      setShowPaymentModal(true);
    }}
  >
    Generate Bill
  </button>
</Td>


                <Td className="bg-amber-50 text-center font-bold text-gray-800">
                  {r.pd}
                </Td>
                <Td className="bg-amber-50 text-center font-bold text-gray-800">
                  {r.ad}
                </Td>
                <Td className="bg-amber-50 text-center font-bold text-gray-800">
                  {r.hp}
                </Td>
                {Array.from({ length: 31 }, (_, i) => {
                  const dayStatus = r.days && r.days[i] ? r.days[i] : "-";
                  return (
                    <Td key={i} className="text-center">
                      {dayStatus === "-" ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <DayBadge status={dayStatus as DayStatus} />
                      )}
                    </Td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL (unchanged) */}
      {selectedRecord && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-6 w-[90%] max-w-lg relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-3 right-3 text-gray-700 hover:text-red-600"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Client Details
            </h2>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>Client:</strong> {selectedRecord.clientName}
              </p>
              <p>
                <strong>Location:</strong> {selectedRecord.location}
              </p>
              <p>
                <strong>Patient:</strong> {selectedRecord.patientName}
              </p>
              <p>
                <strong>Referral:</strong> {selectedRecord.referralName}
              </p>
              <p>
                <strong>Phone:</strong> {selectedRecord.clientPhone}
              </p>
              <p>
                <strong>HCP:</strong> {selectedRecord.hcpName} (
                {selectedRecord.hcpId})
              </p>
              <p>
                <strong>Status:</strong> {selectedRecord.status}
              </p>
              <p>
                <strong>Period:</strong> {selectedRecord.startDate} -{" "}
                {selectedRecord.endDate}
              </p>
              <p>
                <strong>Pay Terms:</strong> {selectedRecord.payTerms}
              </p>
              <p>
                <strong>Client Pay:</strong> ₹{selectedRecord.cPay}
              </p>
              <p>
                <strong>HCP Pay:</strong> ₹{selectedRecord.hcpPay}
              </p>
            </div>
          </div>
        </div>
      )}
{showMissingCalendar&&  <div className=" flex flex-col fixed inset-0 z-50 bg-black/85">
        <div className="flex justify-end mt-4 mr-2">
          <button
                onClick={() => setShowMissingCalendar(false)}
                className="inline-flex  cursor-pointer gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100"
              >
                <X size={16} />
                Close
              </button>
              </div>
              <MissingAttendence/></div>}
     
      {showPendingCalendar && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="h-full w-full bg-white md:m-6 md:rounded-2xl shadow-2xl flex flex-col">
         
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Pending Attendance Summary
                </h2>
                <p className="text-xs text-gray-500">
                  {months.find((m) => m.value === selectedMonth)?.name}{" "}
                  {selectedYear}
                </p>
              </div>
              {StatusMessage&&
            <p
  className={`mt-2 text-sm font-medium px-4 py-2 rounded-lg ${
    StatusMessage?.includes("success") || StatusMessage?.includes("✅")
      ? "bg-green-100 text-green-700 border border-green-300"
      : "bg-red-100 text-red-700 border border-red-300"
  }`}
>
  {StatusMessage}
</p>
      }

              <button
                onClick={() => setShowPendingCalendar(false)}
                className="inline-flex items-center cursor-pointer gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                <X size={16} />
                Close
              </button>
            </div>

            
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4 space-y-5">
           
              <div className="space-y-3">
                {pendingSummary.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No pending attendance for{" "}
                    {months.find((m) => m.value === selectedMonth)?.name}{" "}
                    {selectedYear}.
                  </p>
                )}

                {pendingSummary.map((p: any, i: number) => (
                  <div
                    key={i}
                    className="p-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 text-[12px]">
                        {p.hcpName}
                      </p>
                      <p className="text-[10px] text-gray-600">
                        Pending Days:{" "}
                        <strong className="text-gray-900">
                          {p.pendingCount}
                        </strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Pending Attendance Calendar
                </h3>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-1">
             
                  <div className="grid grid-cols-7 text-[11px] md:text-xs font-semibold text-slate-500 mb-2">
                    {weekdayNames.map((name) => (
                      <div
                        key={name}
                        className="flex items-center justify-center uppercase tracking-wide"
                      >
                        {name}
                      </div>
                    ))}
                  </div>

             
                  <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                    {Array.from({ length: totalCells }).map((_, index) => {
                      const day = index - firstDayIndex + 1;

                      if (day < 1 || day > daysInMonth) {
                      
                        return (
                          <div
                            key={index}
                            className="rounded-2xl border border-transparent min-h-[64px]"
                          />
                        );
                      }

                      const isPending = (pendingSummary || []).some(
                        (s: any) =>
                          (s.pendingDates || []).some((d: Date) => {
                            return (
                              d.getDate() === day &&
                              d.getMonth() + 1 === Number(selectedMonth) &&
                              d.getFullYear() === Number(selectedYear)
                            );
                          })
                      );

                      const dateObj = new Date(
                        `${selectedYear}-${selectedMonth}-${String(
                          day
                        ).padStart(2, "0")}`
                      );
                      const isWeekend =
                        dateObj.getDay() === 0 || dateObj.getDay() === 6;

                      return (
                        <div key={index} className="relative group">
                   
                          <div
                            className={`w-full min-h-[68px] md:min-h-[36px] rounded-2xl border flex flex-col items-start justify-start px-2 pt-1 pb-1.5 text-[11px] md:text-xs font-medium overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.06)] ${
                              isWeekend
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-white border-slate-200 text-slate-700"
                            } ${isPending ? "border-amber-400 ring-1 ring-amber-200" : ""}`}
                          >
                 
                            <span className="mb-0.5">{day}</span>

                         
                            <div className="mt-0.5 space-y-0.5 w-full">
                              {pendingByDay[day]?.map(
                                (name: string, idx: number) => {
                                  const colorClass = getHCPColor(name);
                                  return (
                                    <div
                                      key={idx}
                                      className={`px-1.5 py-0.5 rounded-lg text-[10px] md:text-[11px] font-semibold border shadow-sm truncate ${colorClass}`}
                                    >
                                      {name}
                                    </div>
                                  );
                                }
                              )}
                            </div>

                        
                            {isPending && (
                              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                            )}
                          </div>

                     
                          {isPending && (
                            <div
                              className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                                w-56 bg-white border border-gray-300 shadow-xl rounded-xl p-3 z-50
                                opacity-0 group-hover:opacity-100 pointer-events-none transition duration-200"
                            >
                              <h4 className="font-semibold text-sm text-blue-700 flex items-center gap-2 mb-2">
                                <span className="text-blue-600 text-lg">👤</span>
                                Pending HCPs
                              </h4>

                              <div className="space-y-1">
                                {pendingByDay[day]?.map(
                                  (name: string, i: number) => {
                                    const colorClass = getHCPColor(name);
                                    return (
                                      <div
                                        key={i}
                                        className={`px-2 py-1 text-sm rounded-lg shadow-sm border ${colorClass}`}
                                      >
                                        {name}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

       
              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
  onClick={async () => {
    SetStatusMessage("Please Wait...")
    const res = await UpdateAllPendingAttendance(selectedYear, selectedMonth);

    SetStatusMessage(`✅${res.message}`);

    if (res.success) setShowPendingCalendar(false);
  }}
  className="px-4 py-2 bg-teal-600 text-white cursor-pointer rounded-lg text-sm font-semibold hover:bg-teal-800"
>
  Update All the Attendance
</button>

                <button
                  onClick={() => {SetStatusMessage(null);setShowPendingCalendar(false)}}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



function Th({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <th className={`px-4 py-2 font-semibold text-sm whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <td className={`px-4 py-2 whitespace-nowrap ${className}`}>{children}</td>;
}

function DayBadge({ status }: { status: DayStatus }) {
  if (status === "P") {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 text-emerald-600 bg-white shadow-sm">
        {status}
      </span>
    );
  }

  if (status === "HP") {
    return (
      <div className="relative w-8 h-8 rounded-full border-2 border-emerald-500 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-semibold text-emerald-600">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-emerald-500" />
        <span className="relative z-10">HP</span>
      </div>
    );
  }

  if (status === "A") {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 border-rose-600 text-rose-600 bg-white shadow-sm">
        {status}
      </span>
    );
  }

  if (status === "NA") {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 border-gray-500 text-gray-600 bg-white shadow-sm">
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border border-gray-400 text-gray-500 bg-white shadow-sm">
      {status}
    </span>
  );
}
