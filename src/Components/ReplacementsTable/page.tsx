"use client";
import { filterColors, Placements_Filters, years } from "@/Lib/Content";
import { GetReasonsInfoInfo, GetReplacementInfo } from "@/Lib/user.action";
import { UpdateClient, UpdateMonthFilter, UpdateUserInformation, UpdateUserType, UpdateYearFilter } from "@/Redux/action";
import { useRouter } from "next/navigation";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingData } from "../Loading/page";

let ReplacementCach : any[] | null = null;
let ReplacementReasonsCache: any[] | null = null;
const ReplacementTable = ({ StatusMessage }: any) => {
  const [rawData, setRawData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [HeadingSearch,setHeadingSearch]=useState('')
  const [isChecking, setIsChecking] = useState(true);
 const now = new Date();


const month=useSelector((state:any)=>state.FilterMonth) 
const year=useSelector((state:any)=>state.FilterYear) 

const [ReplacementReasons,setReplacementReasons]=useState<any[]>([]);
const [showPopup, setShowPopup] = useState(false);
const [popupInfo, setPopupInfo] = useState("");
const dispatch=useDispatch()
const router=useRouter()
  useEffect(() => {
    const Fetch = async () => {

      if(ReplacementCach&&ReplacementReasonsCache){
        setRawData(ReplacementCach);
        setReplacementReasons(ReplacementReasonsCache)
        setIsChecking(false)
        return
      }
      const [PlacementInformation,ReplacementReasons]=await Promise.all([
        GetReplacementInfo(),
        GetReasonsInfoInfo()

      ])
      // const PlacementInformation: any = await GetReplacementInfo();
      // const ReplacementReasons:any= await GetReasonsInfoInfo()
      if (!PlacementInformation || PlacementInformation.length === 0) return;



      const formatted = PlacementInformation.map((record: any) => ({
        CurrentHCA_id:record.HCAId||"",
        AssignedHCA_id:record.NewHCAId||"",
        Month: record.Month || "Unknown",
        invoice: record.invoice || "",
        startDate: record.StartDate || "",
        endDate: record.EndDate || "",
        status: record.Status || "Inactive",
        location: record.Address || "N/A",
        NewHCA:record.NewHCAName,
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
      console.log('Check for Ids-------',formatted)
ReplacementCach=formatted?? [],
ReplacementReasonsCache=ReplacementReasons?? []
      setRawData(formatted);
      setReplacementReasons(ReplacementReasons?? [])
      setIsChecking(false)
    };

    Fetch();
  }, [StatusMessage]);
  
  const ShowDompleteInformation = async (userId: any, ClientName: any) => {
    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      dispatch(UpdateUserType("patient"));
      router.push("/UserInformation");
    }
  };

const filteredData = useMemo(() => {
  return rawData.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.clientName?.toLowerCase().includes(searchText) ||
      item.patientName?.toLowerCase().includes(searchText) ||
      item.invoice?.toLowerCase().includes(searchText) ||
      item.clientPhone?.includes(searchText);

    if (!item.startDate) return false;

    const [, itemMonth, itemYear] = item.startDate.split("/");

    const matchesMonth = month
      ? Number(itemMonth) === Number(month)
      : true;

    const matchesYear = year
      ? Number(itemYear) === Number(year)
      : true;

    return matchesSearch && matchesMonth && matchesYear;
  });
}, [rawData, search, month, year]);


  
const GetReplacementMessage = (A: any, B: any) => {
  const results =
    ReplacementReasons?.filter(
      (each: any) => each?.ExistingHCP === A && each?.AvailableHCP === B
    ) ?? [];

  const firstReason = results[0]?.Reason ?? "";
  const secondReason = results[0]?.EnterdReason ?? "";
  const DateandTime=results[0]?.DateandTime??""

if (firstReason && secondReason) {
  return `${firstReason} And ${secondReason}. Replacement Happend On ${DateandTime}`.trim();
}

return `${firstReason}${secondReason}. Replacement Happend On  ${DateandTime}`.trim();


};



 if (isChecking) {
    return (
<div className="flex flex-col items-center justify-center h-full gap-3">
  

  <div className="w-8 h-8 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin"></div>


  <p className="text-sm font-medium text-gray-600 tracking-wide">
    Please wait...
  </p>

</div>

    );
  }

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
          className="border px-3 py-2 rounded-md text-sm"
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

 
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white  text-[10px] font-semibold">
            <tr>
                 <th className="px-3 py-2 text-left">S.No</th>
              <th className="px-3 py-2 text-left">Invoice</th>
              <th className="px-3 py-2 text-left">Client</th>
              <th className="px-3 py-2 text-left">Patient</th>
              <th className="px-3 py-2 text-left">Previous HCA</th>
              {/* <th className="px-3 py-2 text-left">Status</th> */}
              <th className="px-3 py-2 text-left">New Assigned HCA</th>
              <th className="px-3 py-2 text-left">Start</th>
              <th className="px-3 py-2 text-left">End</th>
              <th className="px-3 py-2 text-left">Reason</th>
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
                  <td className="px-3 py-2">{idx+1}</td>
                  <td className="px-3 py-2">{item.invoice}</td>
                  <td className="px-3 py-2">{item.clientName}</td>
                  <td className="px-3 py-2">{item.patientName}</td>
                  <td className="px-3 py-2 hover:underline hover:text-blue-900 cursor-pointer"
                  onClick={()=>ShowDompleteInformation(item.CurrentHCA_id,item.hcpName)}
                  >{item.hcpName}</td>
                      <td className="px-3 py-2 hover:underline hover:text-blue-900 cursor-pointer"
                  onClick={()=>ShowDompleteInformation(item.AssignedHCA_id,item.NewHCA)}
                  >{item.NewHCA}</td>
                  
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
       <td className="px-3 py-2">
  <button
    onClick={() => {
      setPopupInfo(GetReplacementMessage(item.CurrentHCA_id,item.AssignedHCA_id));
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



                  <td className="px-3 py-2 text-right">₹{item.cTotal}</td>
                  <td className="px-3 py-2 text-right">₹{item.hcpTotal}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
{showPopup && (
  <div
    className="
      fixed top-20 right-6 z-50
      w-[380px] max-w-[92%]
      animate-[floatIn_0.25s_ease-out]
    "
  >
    <div
      className="
        relative rounded-xl bg-white
        shadow-xl border border-gray-200
        overflow-hidden
      "
    >
      {/* Accent */}
      <div className="h-1 bg-gradient-to-r from-gray-800 to-gray-500" />

      {/* Content */}
      <div className="px-5 py-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">
          Information
        </h4>

        <p className="text-sm text-gray-600 leading-relaxed">
          {popupInfo}
        </p>
      </div>

      {/* Actions */}
      <div className="px-5 py-3 flex justify-end bg-gray-50">
        <button
          className="
            text-sm font-medium text-gray-600
            hover:text-gray-900
            transition
          "
          onClick={() => setShowPopup(false)}
        >
          Dismiss
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default ReplacementTable;
