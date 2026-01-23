"use client";
import React, { useEffect, useState } from "react";
import { Stethoscope, Shirt, CircleX } from "lucide-react";
import { GetTerminationInfo } from "@/Lib/user.action";
import { LoadingData } from "../Loading/page";
import { Placements_Filters, filterColors } from "@/Lib/Content";

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
   const [search, setSearch] = useState("Termination");
const [isChecking, setIsChecking] = useState(true);
  useEffect(()=>{
    const Fetch=async()=>{
try{
   const FetchData=await GetTerminationInfo()
   console.log("Test Time Sheet---",FetchData)
   const Result:any=FetchData?.map((each:any)=>(
    {
      clientName: each.ClientName,
      contact: each.HCAContact,
      location: each.Adress,
      hcaName: each.HCAName,
      TimeSheetAttendence:each.Attendence,
      status: "Terminated",
   }
   ))
   setIsChecking(false)
    setPlacements(Result)
}catch(err:any){

}
    }

    Fetch()
  },[])
console.log("Check------",placements)
  const handleDelete = (id: string) => {
    setPlacements((prev) => prev.filter((placement) => placement.id !== id));
  };
  if (isChecking) {
    return (
     <LoadingData/>

    );
  }
  return (
    <div className="p-2 bg-gray-50">
      <div className="flex gap-3">
                {Placements_Filters.map((each:any,Index:any)=>
              <button
               key={Index}
               onClick={()=>setSearch(each)}
                      className={`cursor-pointer px-1 py-1 text-xs flex-1 sm:flex-none sm:min-w-[100px] ${
                        search === each && "border-3"
                      } rounded-xl shadow-md font-medium transition-all duration-200 ${
                        filterColors[each]
                      }`}
                    >
                    
              {each}
                      
                    </button>)}
            </div>
      <div className="flex items-center justify-end mb-2">
        <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-medium shadow-sm">
          {placements.length} Records
        </span>
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
          {["Client", "Contact", "Location", "HCA", "Status", "Action"].map(
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
        {placements.map((placement, idx) => (
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
  </div>
</div>

    </div>
  );
};

export default TerminationTable;
