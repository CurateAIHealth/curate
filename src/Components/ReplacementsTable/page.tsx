"use client";
import { filterColors, Placements_Filters } from "@/Lib/Content";
import { GetReplacementInfo } from "@/Lib/user.action";
import React, { useEffect, useMemo, useState } from "react";


const ReplacementTable = ({ StatusMessage }: any) => {
  const [rawData, setRawData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [HeadingSearch,setHeadingSearch]=useState('')
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");


  useEffect(() => {
    const Fetch = async () => {
      const PlacementInformation: any = await GetReplacementInfo();
      if (!PlacementInformation || PlacementInformation.length === 0) return;

      console.log("Check for Data-", PlacementInformation);

      const formatted = PlacementInformation.map((record: any) => ({
        Month: record.Month || "Unknown",
        invoice: record.invoice || "",
        startDate: record.StartDate || "",
        endDate: record.EndDate || "",
        status: record.Status || "Inactive",
        location: record.Address || "N/A",

        clientName: record.ClientName || "",
        clientPhone: record.ClientContact || "",
        ClientId: record.ClientId || "",

        patientName: record.patientName || "",
        referralName: record.referralName || "",

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
      }));

      setRawData(formatted);
    };

    Fetch();
  }, [StatusMessage]);


  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      const matchesSearch =
        item.clientName.toLowerCase().includes(search.toLowerCase()) ||
        item.patientName.toLowerCase().includes(search.toLowerCase()) ||
        item.invoice.toLowerCase().includes(search.toLowerCase()) ||
        item.clientPhone.includes(search);

      const [itemYear, itemMonth] = item.Month?.split("-") || [];

      const matchesMonth = month ? itemMonth === month : true;
      const matchesYear = year ? itemYear === year : true;

      return matchesSearch && matchesMonth && matchesYear;
    });
  }, [rawData, search, month, year]);

  return (
    <div className="space-y-4">


      <div className="flex flex-wrap gap-3 items-center justify-end">
        <input
          type="text"
          placeholder="Search client / patient / invoice / phone"
          className="border px-3 py-2 rounded-md text-sm w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-md text-sm"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={`${i + 1}`}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded-md text-sm"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">All Years</option>
          {[...new Set(rawData.map((d) => d.Month?.split("-")[0]))].map(
            (y) =>
              y && (
                <option key={y} value={y}>
                  {y}
                </option>
              )
          )}
        </select>
      </div>

 
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-br from-[#00A9A5] to-[#005f61] text-white">
            <tr>
              <th className="px-3 py-2 text-left">Invoice</th>
              <th className="px-3 py-2 text-left">Client</th>
              <th className="px-3 py-2 text-left">Patient</th>
              <th className="px-3 py-2 text-left">HCA</th>
              {/* <th className="px-3 py-2 text-left">Status</th> */}
              <th className="px-3 py-2 text-left">Start</th>
              <th className="px-3 py-2 text-left">End</th>
              <th className="px-3 py-2 text-left">Month</th>
              <th className="px-3 py-2 text-right">Client Pay</th>
              <th className="px-3 py-2 text-right">HCP Pay</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-400">
                  No records found
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{item.invoice}</td>
                  <td className="px-3 py-2">{item.clientName}</td>
                  <td className="px-3 py-2">{item.patientName}</td>
                  <td className="px-3 py-2">{item.hcpName}</td>
                  {/* <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td> */}
                  <td className="px-3 py-2">{item.startDate}</td>
                  <td className="px-3 py-2">{item.endDate}</td>
                  <td className="px-3 py-2">{item.Month}</td>
                  <td className="px-3 py-2 text-right">₹{item.cTotal}</td>
                  <td className="px-3 py-2 text-right">₹{item.hcpTotal}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReplacementTable;
