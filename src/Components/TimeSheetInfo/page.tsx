"use client";

import { GetTimeSheetInfo } from "@/Lib/user.action";
import { UpdateClient, UpdateUserInformation } from "@/Redux/action";
import { Eye, X } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";

type DayStatus = "P" | "NA" | "HP" | "A";

export default function InvoiceMedicalTable() {
  const [selectedMonth, setSelectedMonth] = useState("11");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [ClientsInformation, setClientsInformation] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null); 
const dispatch=useDispatch()
const router=useRouter()
  useEffect(() => {
    const Fetch = async () => {
      const PlacementInformation: any = await GetTimeSheetInfo();
      if (!PlacementInformation || PlacementInformation.length === 0) return;
console.log('Time Sheet Length----',PlacementInformation.length)
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
          ClientId:record.ClientId||"",
          patientName: record.patientName || "",
          referralName: record.referralName || "",
          hcp: "Assist",
          VendorName:record.VendorName||"Curate",
          Type:record.Type||"HCA",
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
  }, []);

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

  const key: any = `${selectedYear}-${selectedMonth}`;
  const data: any = ClientsInformation[key] || [];

  const processedData = useMemo(() => {
    return data.map((record: any) => {
      const counts = record.days.reduce(
        (acc: any, status: DayStatus) => {
          if (status === "P") acc.pd += 1;
          else if (status === "A") acc.ad += 1;
          else if (status === "HP") acc.hp += 1;
          return acc;
        },
        { pd: 0, ad: 0, hp: 0 }
      );
      return { ...record, ...counts };
    });
  }, [data]);

  const RouteToClient=(A:any,ClientName:any)=>{
  if (A) {
        dispatch(UpdateClient(ClientName));
        dispatch(UpdateUserInformation(A));
        router.push("/UserInformation");
      }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">

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


      <div className="overflow-x-auto bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md rounded-2xl">
        <table className="min-w-[2800px] border-collapse text-sm text-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-left">
              <Th>View</Th>
              <Th>Invoice</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              {/* <Th>Status</Th> */}
              {/* <Th>Location</Th>
              <Th>Client Phone</Th> */}
              <Th>Client Name</Th>
              <Th>Patient Name</Th>
              <Th>Referral Name</Th>
              {/* <Th>HCP Role</Th>
              <Th>HCP ID</Th> */}
              <Th>HCP Name</Th>
              {/* <Th>HCP Phone</Th> */}
              <Th>HCP Referral</Th>
              <Th>Vendor</Th>
              <Th>Type</Th>
              {/* <Th>Provider</Th>
              <Th>Pay Terms</Th>
              <Th className="text-right">C Total</Th>
              <Th className="text-right">C Pay</Th>
              <Th className="text-right">HCP Total</Th>
              <Th className="text-right">HCP Pay</Th> */}
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
                {/* <Td>
                  <StatusBadge status={r.status} />
                </Td> */}
                {/* <Td>{r.location}</Td>
                <Td className="text-blue-700 underline">{r.clientPhone}</Td> */}
                <td className={`px-4 py-2 whitespace-nowrap font-medium hover:underline cursor-pointer hover:text-blue-600`} onClick={()=>RouteToClient(r.ClientId,r.clientName)}>{r.clientName}</td>

                <Td>{r.patientName}</Td>
                <Td className={`${r.referralName?'text-green-800 font-bold':'text-red-800 font-bold'}`}>{r.referralName}</Td>
                {/* <Td>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-semibold shadow-sm">
                    {r.hcp}
                  </span>
                </Td>
                <Td className="font-semibold text-gray-700">{r.hcpId}</Td> */}
         
                <td className={`px-4 py-2 whitespace-nowrap font-medium hover:underline cursor-pointer hover:text-blue-600`} onClick={()=>RouteToClient(r.hcpId,r.hcpName)}>{r.hcpName}</td>
                {/* <Td>{r.hcpPhone}</Td> */}
                <Td className={`${r.hcpSource?'text-green-800 font-bold':'text-red-800 font-bold'}`}>
           
                    {r.hcpSource}
               
                </Td>
                <Td className={`${r.VendorName?'text-green-800 font-bold':'text-red-800 font-bold'}`}>{r.VendorName}</Td>
                <Td>{r.Type}</Td>
                {/* <Td>{r.provider}</Td>
                <Td>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full shadow-sm">
                    {r.payTerms}
                  </span>
                </Td>
                <Td className="text-right text-gray-800">
                  {r.cTotal.toLocaleString()}
                </Td>
                <Td className="text-right text-red-500 font-semibold">
                  ₹{r.cPay.toFixed(2)}
                </Td>
                <Td className="text-right text-blue-600 font-semibold">
                  ₹{r.hcpTotal.toLocaleString()}
                </Td>
                <Td className="text-right text-green-700 font-semibold">
                  ₹{r.hcpPay.toFixed(2)}
                </Td> */}
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
              <p><strong>Client:</strong> {selectedRecord.clientName}</p>
              <p><strong>Location:</strong> {selectedRecord.location}</p>
              <p><strong>Patient:</strong> {selectedRecord.patientName}</p>
              <p><strong>Referral:</strong> {selectedRecord.referralName}</p>
              <p><strong>Phone:</strong> {selectedRecord.clientPhone}</p>
              <p><strong>HCP:</strong> {selectedRecord.hcpName} ({selectedRecord.hcpId})</p>
              <p><strong>Status:</strong> {selectedRecord.status}</p>
              <p><strong>Period:</strong> {selectedRecord.startDate} - {selectedRecord.endDate}</p>
              <p><strong>Pay Terms:</strong> {selectedRecord.payTerms}</p>
              <p><strong>Client Pay:</strong> ₹{selectedRecord.cPay}</p>
              <p><strong>HCP Pay:</strong> ₹{selectedRecord.hcpPay}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function Th({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <th className={`px-4 py-2 font-semibold text-sm whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <td className={`px-4 py-2 whitespace-nowrap ${className}`}>{children}</td>;
}
function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Active"
      ? "bg-green-100 text-green-800"
      : status === "Replc"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${color}`}>
      {status}
    </span>
  );
}
function DayBadge({ status }: { status: DayStatus }) {
  if (status === "P") {

    return (
       <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 text-emerald-600 text-emerald-600 bg-white shadow-sm">
        {status}
      </span>
    );
  }

  if (status === "HP") {

    return (
      <div className="relative w-8 h-8 rounded-full border-2 border-emerald-500 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-semibold text-emerald-600">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-emerald-500"></div>
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

  // Default fallback
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border border-gray-400 text-gray-500 bg-white shadow-sm">
      {status}
    </span>
  );
}



