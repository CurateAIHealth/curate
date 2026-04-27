"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Stethoscope, Shirt, CircleX, Search, X } from "lucide-react";
import { GetReasonsInfoInfo, GetRegidterdUsers, GetTerminationInfo, GetUsersFullInfo } from "@/Lib/user.action";
import { LoadingData } from "../Loading/page";
import { Placements_Filters, filterColors, years } from "@/Lib/Content";
import { AssignSuitableIcon } from "@/Lib/Actions";
import { useDispatch, useSelector } from "react-redux";
import { UpdateMonthFilter, UpdateYearFilter } from "@/Redux/action";
let terminationCache: any[] | null = null;
let ReplacementReasonsCache: any[] | null = null;
let RegisredUsersCache: any[] | null = null;

let CompliteInfoCache: any[] | null = null;
interface TerminationData {
  id: string;
  clientName: string;
  contact: string;
  location: string;
  hcaName: string;
  status: "Active" | "Inactive" | "Terminated";
}
type TimeSheetTerminatonTableProps = {

  UpdateTerminationScreen: (Status: any) => void
}

const TimeSheetTerminationTableInfo = ({

  UpdateTerminationScreen,
}: TimeSheetTerminatonTableProps) => {
  const [placements, setPlacements] = useState<any[]>([]);
   const [users, setUsers] = useState<any[]>([]);
   const [RegisterdUsers,setRegisterdUsers]=useState<any[]>([])
  const [ReplacementReasons,setReplacementReasons]=useState<any[]>([]);
 const [rawData, setRawData] = useState<any[]>([]);
   const [search, setSearch] = useState("");
   const [HeadingSearch,setHeadingSearch]=useState('')
 
  const now = new Date();
 


const [isChecking, setIsChecking] = useState(true);
const [showPopup, setShowPopup] = useState(false);
const [popupInfo, setPopupInfo] = useState("");


const month=useSelector((state:any)=>state.FilterMonth) 
const year=useSelector((state:any)=>state.FilterYear)
const dispatch=useDispatch()
useEffect(() => {
  const Fetch = async () => {
    try {
      if (
        terminationCache &&
        RegisredUsersCache &&
        CompliteInfoCache &&
        ReplacementReasonsCache
      ) {
        setPlacements(terminationCache);
        setRegisterdUsers(RegisredUsersCache);
        setUsers(CompliteInfoCache);
        setReplacementReasons(ReplacementReasonsCache);
        setIsChecking(false);
        return;
      }

      const [
        RegisterdUsers,
        usersResult,
        FetchData,
        ReplacementReasons,
      ] = await Promise.all([
        GetRegidterdUsers(),
        GetUsersFullInfo(),
        GetTerminationInfo(),
        GetReasonsInfoInfo(),
      ]);

      RegisredUsersCache = RegisterdUsers ?? [];
      CompliteInfoCache = usersResult ?? [];
      ReplacementReasonsCache = ReplacementReasons ?? [];

      const Result =
        FetchData?.map((each: any) => ({
          ClientId: each.ClientId,
          HCA_Id: each.HCAid,
          clientName: each.ClientName,
          contact: each.HCAContact,
          location: each.Adress,
          hcaName: each.HCAName,
          TimeSheetAttendence: each.Attendence,
          StartDate: each.StartDate,
          status: "Terminated",
        })) ?? [];

      terminationCache = Result;

      setPlacements(Result);
      setRegisterdUsers(RegisredUsersCache);
      setUsers(CompliteInfoCache??[]);
      setReplacementReasons(ReplacementReasonsCache);
      setIsChecking(false);
    } catch (err) {
      setIsChecking(false);
    }
  };

  Fetch();
}, []);

 const GetHCPGender = (A: any) => {
    if (!users?.length || !A) return "Not Entered";

    const address =
      users
        ?.map((each: any) => each?.HCAComplitInformation)
        ?.find((info: any) => info?.UserId === A)
      ?.['Gender']||"Not Provided";

    return address ?? "Not Entered";
  };


     const GetHCPType = (A: any) => {
    if (!RegisterdUsers?.length || !A) return "Not Entered";

    const CurrentPreviewUserType:any =
      RegisterdUsers.filter((each:any)=>each.userId===A)

    return CurrentPreviewUserType[0]?.PreviewUserType ?? "Not Entered";
  };

  const handleDelete = (id: string) => {
    setPlacements((prev) => prev.filter((placement) => placement.id !== id));
  };
  if (isChecking) {
    return (
     <LoadingData/>

    );
  }

const FilterValues =
  placements?.filter((item) => {
    const searchText = search?.toLowerCase() || "";

    const matchesSearch =
      !searchText ||
      item.clientName?.toLowerCase().includes(searchText) ||
      item.patientName?.toLowerCase().includes(searchText) ||
      item.invoice?.toLowerCase().includes(searchText) ||
      item.clientPhone?.includes(searchText);

    if (!item.StartDate) return false;

    const [, itemMonth, itemYear] = item.StartDate.split("/");

    const matchesMonth = month
      ? Number(itemMonth) === Number(month)
      : true;

    const matchesYear = year
      ? Number(itemYear) === Number(year)
      : true;

    return matchesSearch && matchesMonth && matchesYear;
  }) || [];

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
      
  <div className="flex w-full items-center justify-between">
       
<div className="flex items-center gap-3">
    <button
    className="flex items-center gap-2 px-4 py-2 rounded-lg 
               bg-white text-blue-600 text-sm font-medium
               border border-blue-200 shadow-sm
               hover:bg-blue-50 hover:border-blue-300
               active:scale-[0.98] transition-all cursor-pointer"

               onClick={()=>UpdateTerminationScreen("Repleasment")}
  >
    🔄 Replacements
  </button>

    <button
      onClick={() => UpdateTerminationScreen("TimeSheet")}
      className="flex items-center gap-2 px-4 py-2 rounded-xl
                 bg-emerald-50 text-emerald-600 text-sm font-semibold
                 border border-emerald-200
                 hover:bg-emerald-100 hover:border-emerald-300
                 active:scale-[0.97] transition-all duration-200 cursor-pointer"
    >
      🟢 Active TimeSheet
    </button>
  </div>

<div className="relative w-auto m-1">

  <Search
    size={16}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
  />


  <header className="sticky top-0 z-30 bg-white border-b">
  <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

      {/* Search */}
      <div className="relative w-full md:max-w-sm">
        <input
          type="text"
          placeholder="Search client / phone"
          className="w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Search icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      </div>

   
      <div className="flex gap-2 w-full md:w-auto">
        <select
          className="w-full md:w-auto border px-3 py-2 rounded-md text-sm bg-white"
          value={month}
            onChange={(e) => dispatch(UpdateMonthFilter(e.target.value))}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={`${i + 1}`}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className="w-full md:w-auto border px-3 py-2 rounded-md text-sm bg-white"
          value={year}
            onChange={(e) => dispatch(UpdateYearFilter(e.target.value))}
        >
          <option value="">All Years</option>
          {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
        </select>
      </div>

    </div>
  </div>
</header>


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
      
 
<thead className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white  text-[10px] font-semibold">




        <tr className="border-b border-gray-300">
          {["S.No","Client", "Contact", "Location", "HCA", "Status", "Reason", "Action"].map(
            (head) => (
              <th
                key={head}
                className="px-6 py-4  text-[11px] font-semibold tracking-wider  "
              >
                {head}
              </th>
            )
          )}
        </tr>
      </thead>

      {/* ===== BODY ===== */}
      <tbody className="bg-white divide-y divide-gray-200">
        {FilterValues.map((placement, idx) => (
          <tr
            key={idx}
           className="bg-white divide-y divide-gray-200"
          >
            <td className="px-6 py-4 font-semibold text-gray-900">
              {idx+1}
            </td>
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
  <div className="relative inline-block group">

    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium border border-gray-200 hover:shadow-lg transition group-hover:bg-indigo-100 cursor-pointer">
      
      {/* Icon */}
      <img
        className="h-5 w-5 transition-all duration-300 group-hover:scale-110"
        src={
          AssignSuitableIcon(
            GetHCPGender(placement.HCA_Id),
            GetHCPType(placement.HCA_Id)
          ).image
        }
      />

      {placement.hcaName || "NA"}
    </span>

   
    <div
      className="absolute left-1/2 -translate-x-1/2 -top-12 z-50
                 opacity-0 group-hover:opacity-100
                 translate-y-2 group-hover:translate-y-0
                 transition-all duration-300 ease-out
                 bg-gradient-to-br from-[#00A9A5] to-[#005f61]
                 text-white text-xs font-medium
                 px-3 py-2 rounded-xl shadow-xl
                 whitespace-nowrap pointer-events-none"
    >
      {
        AssignSuitableIcon(
          GetHCPGender(placement.HCA_Id),
          GetHCPType(placement.HCA_Id)
        ).caseType
      }
    </div>

  </div>
</td>

           
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

export default TimeSheetTerminationTableInfo;
