"use client";
import React, { useEffect, useState } from "react";
import { Stethoscope, Shirt, CircleX, Search, X } from "lucide-react";
import { GetReasonsInfoInfo, GetTerminationInfo } from "@/Lib/user.action";
import { LoadingData } from "../Loading/page";
import { Placements_Filters, filterColors } from "@/Lib/Content";
let terminationCache: any[] | null = null;
let ReplacementReasonsCache: any[] | null = null;
interface TerminationData {
  id: string;
  clientName: string;
  contact: string;
  location: string;
  hcaName: string;
  status: "Active" | "Inactive" | "Terminated";
}

const TerminationTable: React.FC = () => {
  const [placements, setPlacements] = useState<any[]>([]);
  const [ReplacementReasons,setReplacementReasons]=useState<any[]>([]);
   const [search, setSearch] = useState("");
     const [month, setMonth] = useState("");
     const [year, setYear] = useState("");
const [isChecking, setIsChecking] = useState(true);
const [showPopup, setShowPopup] = useState(false);
const [popupInfo, setPopupInfo] = useState("");




useEffect(() => {
  const Fetch = async () => {
    try {
      if (terminationCache) {
        setPlacements(terminationCache);
         setReplacementReasons(ReplacementReasonsCache?? [])
        setIsChecking(false);
        return;
      }

       const [FetchData,ReplacementReasons]=await Promise.all([
              GetTerminationInfo(),
          GetReasonsInfoInfo()
      
            ])

      ReplacementReasonsCache = ReplacementReasons ?? []

      const Result = FetchData?.map((each: any) => ({
        ClientId: each.ClientId,
        clientName: each.ClientName,
        contact: each.HCAContact,
        location: each.Adress,
        hcaName: each.HCAName,
        TimeSheetAttendence: each.Attendence,
        status: "Terminated",
      })) ?? [];

      terminationCache = [
        ...new Map(
          [...(terminationCache ?? []), ...Result]
            .map(item => [item.contact, item])
        ).values()
      ];

      setPlacements(terminationCache);
      setReplacementReasons(ReplacementReasons?? [])
      setIsChecking(false);
    } catch (err) {
      setIsChecking(false);
    }
  };

  Fetch();
}, []);


console.log("Checking Count------",ReplacementReasons)
  const handleDelete = (id: string) => {
    setPlacements((prev) => prev.filter((placement) => placement.id !== id));
  };
  if (isChecking) {
    return (
     <LoadingData/>

    );
  }

const FilterValues = placements.filter((each: any) => {
  if (!search) return true;

  const name = each?.clientName?.toLowerCase() || "";
  const contact = String(each?.contact || "");

  const searchValue = search.toLowerCase();

  return (
    name.includes(searchValue) ||
    contact.includes(searchValue)
  );
});


const GetReplacementMessage = (A: any) => {

  const results =ReplacementReasons?.filter((each: any) => each?.HCA_id=== A ) ?? [];
  if(results.length===0){
    return "No Reasond Found.Try Again"
  }

  const firstReason = results[0]?.Reason ?? "";
  const secondReason = results[0]?.EnterdReason ?? "";
  const DateandTime=results[0]?.DateandTime??""

if (firstReason && secondReason) {
  return `${firstReason} And ${secondReason}. Replacement Happend On ${DateandTime}`.trim();
}

return `${firstReason}${secondReason}. Replacement Happend On  ${DateandTime}`.trim();


};

  return (
    <div className="p-2 bg-gray-50">
      
  <div className="flex flex-wrap gap-3 items-center justify-end">
       

<div className="relative w-auto m-1">

  <Search
    size={16}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
  />


  <input
    type="text"
    placeholder="Search client / phone"
    className="w-full border border-gray-300 rounded-md py-2 pl-9 pr-9 text-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               transition"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />


  {search && (
    <button
      onClick={() => setSearch("")}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <X size={14} />
    </button>
  )}
</div>


        {/* <select
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
          {[...new Set(Result.map((d) => d.Month?.split("-")[0]))].map(
            (y) =>
              y && (
                <option key={y} value={y}>
                  {y}
                </option>
              )
          )}
        </select> */}
      </div>

     
    <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] h-[65vh] flex flex-col">

  <div className="flex-1 overflow-y-auto">
    <table className="w-full text-left text-sm border-separate border-spacing-0">
      
 
<thead className="
  sticky top-0 z-10
  bg-gradient-to-b from-teal-600 to-teal-700
  text-white
  shadow-md
">




        <tr className="border-b border-gray-300">
          {["Client", "Contact", "Location", "HCA", "Status", "Reason", "Action"].map(
            (head) => (
              <th
                key={head}
                className="px-6 py-4  text-[11px] font-semibold tracking-wider  uppercase"
              >
                {head}
              </th>
            )
          )}
        </tr>
      </thead>

      {/* ===== BODY ===== */}
      <tbody>
        {FilterValues.map((placement, idx) => (
          <tr
            key={idx}
            className="group transition-colors hover:bg-gray-50"
          >
            {/* CLIENT */}
            <td className="px-6 py-4 font-semibold text-gray-900">
              {placement.clientName || "Not Provided"}
            </td>

            {/* CONTACT */}
            <td className="px-6 py-4 text-gray-700">
              {placement.contact || "Not Provided"}
            </td>

            {/* LOCATION */}
            <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
              {placement.location||"UnFilled"}
            </td>

            {/* HCA */}
            <td className="px-6 py-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition group-hover:bg-indigo-100">
                <Stethoscope size={16} />
                {placement.hcaName||"NA"}
                <Shirt size={14} className="text-pink-500" />
              </span>
            </td>

            {/* STATUS */}
            <td className="px-6 py-4">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm ${
                  placement.status === "Active"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {placement.status}
              </span>
            </td>
  <td className="px-3 py-2">
  <button
    onClick={() => {
 setPopupInfo(GetReplacementMessage(placement.ClientId))
      setShowPopup(true);
      
    }}
    className="
      px-3 py-1.5
      text-sm font-medium
      text-blue-600
      border border-blue-600/60
      rounded-md
      cursor-pointer
      bg-transparent
      hover:bg-blue-600/10
      hover:border-blue-600
      transition
      duration-200
    "
  >
    Show
  </button>
</td>
            {/* ACTION */}
            <td className="px-6 py-4 text-center">
              <button
                onClick={() =>
                  console.log("Console TimeSheet---", placement.TimeSheetAttendence)
                }
                className="rounded-lg border border-emerald-600 px-5 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                View
              </button>
            </td>
          </tr>
        ))}

        {placements.length === 0 && (
          <tr>
            <td
              colSpan={6}
              className="px-6 py-10 text-center text-gray-400 italic"
            >
              No termination records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
{showPopup && (
  <div
    className="
      fixed top-24 right-6 z-50
      w-[400px] max-w-[94%]
      animate-[slideInRight_0.25s_ease-out]
    "
  >
    <div
      className="
        rounded-2xl bg-white
        border border-gray-200
        shadow-xl
        overflow-hidden
      "
    >
      
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h4 className="text-sm font-semibold text-gray-900">
          Information
        </h4>

        <button
          className="text-gray-400 cursor-pointer hover:text-gray-700 transition"
          onClick={() => setShowPopup(false)}
        >
          ✕
        </button>
      </div>

      <div className="px-5 py-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          {popupInfo}
        </p>
      </div>

      
      <div className="px-5 py-3 bg-gray-50 flex justify-end">
        <button
          className="
            px-4 py-1.5 text-sm font-medium
            rounded-md
            bg-gray-900 text-white
            hover:bg-black
            transition cursor-pointer
          "
          onClick={() => setShowPopup(false)}
        >
          Okay
        </button>
      </div>
    </div>
  </div>
)}

  </div>
</div>

    </div>
  );
};

export default TerminationTable;
