"use client";
import { filterColors, Placements_Filters, years } from "@/Lib/Content";
import { GetReasonsInfoInfo, GetRegidterdUsers, GetReplacementInfo, GetUsersFullInfo } from "@/Lib/user.action";
import { UpdateClient, UpdateMonthFilter, UpdateUserInformation, UpdateUserType, UpdateYearFilter } from "@/Redux/action";
import { useRouter } from "next/navigation";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingData } from "../Loading/page";
import { AssignSuitableIcon } from "@/Lib/Actions";
type TimeSheetReplacementTableProps = {

  UpdateScreen: (Status: any) => void
}
let ReplacementCach : any[] | null = null;
let ReplacementReasonsCache: any[] | null = null;
let cachedRegisterdUsers: any[] = [];
let compliteHCPFullInfo: any[] | null = null;
const TimeSheetReplacementTable =  ({

  UpdateScreen,
}: TimeSheetReplacementTableProps) => {
  const [rawData, setRawData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [HeadingSearch,setHeadingSearch]=useState('')
  const [isChecking, setIsChecking] = useState(true);
  const [showAttendancePopup, setShowAttendancePopup] = useState(false)
const [attendanceData, setAttendanceData] = useState<any>([])
 const now = new Date();


const month=useSelector((state:any)=>state.FilterMonth) 
const year=useSelector((state:any)=>state.FilterYear) 

const [ReplacementReasons,setReplacementReasons]=useState<any[]>([]);
const [HCPSalaryData,setHCPSalaryData]=useState<any[]>([]);
const [RegisterdUsers,setRegisterdUsers]=useState<any[]>([])
const [showPopup, setShowPopup] = useState(false);
const [showPermissionPopup,setShowPermissionPopup]=useState(false)
const [popupInfo, setPopupInfo] = useState("");
const dispatch=useDispatch()
const router=useRouter()
  useEffect(() => {
    const Fetch = async () => {

      if(ReplacementCach&&ReplacementReasonsCache){
        setRawData(ReplacementCach);
        setReplacementReasons(ReplacementReasonsCache)
        setHCPSalaryData(compliteHCPFullInfo??[])
         setRegisterdUsers([...cachedRegisterdUsers])
        setIsChecking(false)
        return
      }
      const [RegisterdUsers,PlacementInformation,ReplacementReasons,HCPFullInfo]=await Promise.all([
        GetRegidterdUsers() ,
        GetReplacementInfo(),
        GetReasonsInfoInfo(),
        GetUsersFullInfo()
     

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
CareTakerPrice:record.CareTakerPrice,
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
compliteHCPFullInfo=HCPFullInfo??[],
ReplacementReasonsCache=ReplacementReasons?? []
cachedRegisterdUsers=RegisterdUsers??[]
      setRawData(formatted);
       setRegisterdUsers([...cachedRegisterdUsers])
      setReplacementReasons(ReplacementReasons?? [])
      setHCPSalaryData(HCPFullInfo??[])
      setIsChecking(false)
    };

    Fetch();
  }, []);
  
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

   const GetHCPGender = (A: any) => {
    if (!HCPSalaryData?.length || !A) return "Not Entered";

    const address =
      HCPSalaryData
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

const GetHCPSalary=(A:any)=>{
  try{
const HCPSalaryInfo=HCPSalaryData.map((each:any)=>each.HCAComplitInformation
)

const FinelExpectedSalaryInfo:any=HCPSalaryInfo.filter((each:any)=>each.UserId===A)

return  Math.round(Number(FinelExpectedSalaryInfo[0].PaymentforStaff) / 30)||null

  }catch(err:any){

  }
}
console.log("Check For Salary Info--------",)


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


      <div className="flex flex-wrap items-center justify-between gap-4 
                p-3 rounded-xl border bg-white shadow-sm">

  {/* Action Buttons */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => UpdateScreen("")}
      className="flex items-center gap-2 px-4 py-2 rounded-xl
                 bg-rose-50 text-rose-600 text-sm font-semibold
                 border border-rose-200
                 hover:bg-rose-100 hover:border-rose-300
                 active:scale-[0.97] transition-all duration-200 cursor-pointer"
    >
      ⛔ Terminations
    </button>

    <button
      onClick={() => UpdateScreen("TimeSheet")}
      className="flex items-center gap-2 px-4 py-2 rounded-xl
                 bg-emerald-50 text-emerald-600 text-sm font-semibold
                 border border-emerald-200
                 hover:bg-emerald-100 hover:border-emerald-300
                 active:scale-[0.97] transition-all duration-200 cursor-pointer"
    >
      🟢 Active TimeSheet
    </button>
  </div>

  {/* Filters Section */}
<div className="flex flex-wrap items-center gap-2 ml-auto">

  {/* Search */}
  <input
    type="text"
    placeholder="Search client / patient / invoice / phone"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-72 h-10 px-4 text-sm rounded-full
               border border-gray-300 bg-white
               shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-200
               focus:border-blue-400 transition-all"
  />

  {/* Month */}
  <select
    value={month}
    onChange={(e) => dispatch(UpdateMonthFilter(e.target.value))}
    className="h-10 px-4 text-sm rounded-full
               bg-white border border-gray-300
               shadow-sm
               hover:border-gray-400
               focus:outline-none focus:ring-2 focus:ring-blue-200
               focus:border-blue-400 transition-all cursor-pointer"
  >
    <option value="">All Months</option>
    {[...Array(12)].map((_, i) => (
      <option key={i} value={`${i + 1}`}>
        {new Date(0, i).toLocaleString("default", { month: "long" })}
      </option>
    ))}
  </select>

  {/* Year */}
  <select
    value={year}
    onChange={(e) => dispatch(UpdateYearFilter(e.target.value))}
    className="h-10 px-4 text-sm rounded-full
               bg-white border border-gray-300
               shadow-sm
               hover:border-gray-400
               focus:outline-none focus:ring-2 focus:ring-blue-200
               focus:border-blue-400 transition-all cursor-pointer"
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
 
    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
  <table className="min-w-full text-sm">
    <thead className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white text-[10px] font-semibold">
      <tr>
        <th className="px-4 py-3 text-left whitespace-nowrap">S.No</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">Invoice</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">Client</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">Patient</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">Previous HCA</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">New Assigned HCA</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">Start</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">End</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">Reason</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">Attendance</th>
        <th className="px-4 py-3 text-right whitespace-nowrap">Client Pay</th>
        <th className="px-4 py-3 text-right whitespace-nowrap">HCP Pay</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {filteredData.length === 0 ? (
        <tr>
          <td colSpan={12} className="text-center py-10 text-gray-400">
            No records found
          </td>
        </tr>
      ) : (
        filteredData.map((item, idx) => (
          <tr
            key={idx}
            className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-colors"
          >
            <td className="px-4 py-3 font-medium text-gray-700">{idx + 1}</td>
            <td className="px-4 py-3 text-gray-700">{item.invoice}</td>
            <td className="px-4 py-3 text-gray-800 font-medium">{item.clientName}</td>
            <td className="px-4 py-3 text-gray-700">{item.patientName}</td>
            <td
              className="px-4 py-3 hover:underline hover:text-blue-900 cursor-pointer font-medium text-gray-700"
              onClick={() => ShowDompleteInformation(item.CurrentHCA_id, item.hcpName)}
            > <div className="flex  items-center gap-2">
               <img className='h-4 w-4' src={AssignSuitableIcon(GetHCPGender(item.CurrentHCA_id),GetHCPType(item.CurrentHCA_id))}/>
              {item.hcpName}
              </div>
            </td>
            <td
              className="px-4 py-3 hover:underline hover:text-blue-900 cursor-pointer font-medium text-gray-700"
              onClick={() => ShowDompleteInformation(item.AssignedHCA_id, item.NewHCA)}
            >    <div className="flex  items-center gap-2">
                <img className='h-4 w-4' src={AssignSuitableIcon(GetHCPGender(item.AssignedHCA_id),GetHCPType(item.AssignedHCA_id))}/>
              {item.NewHCA}
              </div>
            </td>
            <td className="px-4 py-3 text-gray-600">{item.startDate}</td>
            <td className="px-4 py-3 text-gray-600">{item.endDate}</td>

            <td className="px-4 py-3">
              <button
                onClick={() => {
                  setPopupInfo(GetReplacementMessage(item.CurrentHCA_id, item.AssignedHCA_id));
                  setShowPopup(true);
                }}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600/60 rounded-md cursor-pointer bg-transparent hover:bg-blue-600/10 hover:border-blue-600 transition duration-200"
              >
                Show
              </button>
            </td>

            <td className="px-4 py-3">
            
              <button
                onClick={() => {
                    console.log("Check Attendence-----",item)
                  setAttendanceData(item?.days || []);
                  setShowAttendancePopup(true);
                }}
                className="px-3 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-600/60 rounded-md cursor-pointer bg-transparent hover:bg-indigo-600/10 hover:border-indigo-600 transition duration-200"
              >
                View
              </button>
            </td>

            <td className="px-4 py-3 text-right font-semibold text-gray-800">{item.CareTakerPrice
    ? String(item.CareTakerPrice).includes("₹")
      ? item.CareTakerPrice
      : `₹${item.CareTakerPrice}`
    : "₹0"}/D</td>
            <td className="px-4 py-3 text-right font-semibold text-gray-800">{GetHCPSalary(item.AssignedHCA_id)?String(GetHCPSalary(item.AssignedHCA_id)).includes("₹")?GetHCPSalary(item.AssignedHCA_id):`₹${GetHCPSalary(item.AssignedHCA_id)}`:"₹0"}/D</td>
            
          </tr>
        ))
      )}
    </tbody>
  </table>

  {showPopup && (
    <div className="fixed top-20 right-6 z-50 w-[380px] max-w-[92%] animate-[floatIn_0.25s_ease-out]">
      <div className="relative rounded-xl bg-white shadow-xl border border-gray-200 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-gray-800 to-gray-500" />
        <div className="px-5 py-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Information</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{popupInfo}</p>
        </div>
        <div className="px-5 py-3 flex justify-end bg-gray-50">
          <button
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            onClick={() => setShowPopup(false)}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )}

 {showAttendancePopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="w-[760px] max-w-[96%] rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-indigo-600 to-blue-500" />

      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-semibold text-gray-900">
              Attendance Overview
            </h4>
            <p className="text-xs text-gray-500">
              {attendanceData?.length > 0
                ? new Date(attendanceData[0]?.AttendenceDate).toLocaleString(
                    "default",
                    { month: "long", year: "numeric" }
                  )
                : ""}
            </p>
          </div>

          <button
            onClick={() => setShowAttendancePopup(false)}
            className="text-gray-400 hover:text-gray-700 text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {attendanceData?.length === 0 ? (
          <p className="text-sm text-gray-400">No attendance data</p>
        ) : (
          <div className="grid grid-cols-7 gap-3">
            {attendanceData.map((d: any, i: any) => {
              const status =
                d?.AdminAttendece && d?.HCPAttendence
                  ? "Present"
                  : !d?.AdminAttendece && !d?.HCPAttendence
                  ? "Absent"
                  : "Half Day";

              return (
                <div
                  key={i}
                  className={`rounded-xl border p-3 flex flex-col items-center justify-center transition
                    ${
                      status === "Present"
                        ? "bg-emerald-50 border-emerald-200"
                        : status === "Absent"
                        ? "bg-rose-50 border-rose-200"
                        : "bg-amber-50 border-amber-200"
                    }`}
                >
                  <span className="text-[11px] text-gray-500">
                    {new Date(d?.AttendenceDate).toLocaleString("default", {
                      weekday: "short",
                    })}
                  </span>

                  <span className="text-lg font-semibold text-gray-900">
                    {new Date(d?.AttendenceDate).getDate()}
                  </span>

                  <span
                    className={`mt-1 text-[10px] font-semibold px-2 py-[2px] rounded-full
                      ${
                        status === "Present"
                          ? "bg-emerald-100 text-emerald-700"
                          : status === "Absent"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {status}
                  </span>
                <p className="text-xs sm:text-[10px] mt-2 font-semibold text-blue-700 cursor-pointer hover:underline" onClick={()=>setShowPermissionPopup(!showPermissionPopup)}>
  Edit
</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-6 py-4 flex justify-end bg-gray-50">
        <button
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition cursor-pointer"
          onClick={() => setShowAttendancePopup(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{/* Permission Popup */}
{showPermissionPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    
    <div className="w-[92%] max-w-md rounded-xl bg-white shadow-xl border border-gray-200 animate-[zoomIn_.2s_ease-out]">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-sm sm:text-base font-semibold text-gray-800">
          Permission From Management
        </h2>

        <button
          onClick={() => setShowPermissionPopup(false)}
          className="text-gray-400 hover:text-gray-700 text-lg"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <p className="text-xs sm:text-sm text-gray-600">
          This action requires approval from management. Please confirm
          before continuing.
        </p>

        <textarea
          placeholder="Add note or reason..."
          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-4 py-3 border-t bg-gray-50 rounded-b-xl">
        <button
          onClick={() => setShowPermissionPopup(false)}
          className="px-3 py-1.5 text-xs sm:text-sm rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          className="px-3 py-1.5 text-xs sm:text-sm rounded-md bg-gradient-to-br from-[#00A9A5] to-[#005f61] text-white font-medium"
        >
          Request Permission
        </button>
      </div>

    </div>
  </div>
)}
</div>
    </div>
  );
};

export default TimeSheetReplacementTable;
