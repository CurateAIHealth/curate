"use client";
import { filterColors, months, Placements_Filters, years } from "@/Lib/Content";
import { GetReasonsInfoInfo, GetRegidterdUsers, GetReplacementInfo, GetUsersFullInfo, GetUsersFullInfoForRepleament } from "@/Lib/user.action";
import { UpdateClient, UpdateMonthFilter, UpdateUserInformation, UpdateUserType, UpdateYearFilter } from "@/Redux/action";
import { useRouter } from "next/navigation";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingData } from "../Loading/page";
import { AssignSuitableIcon, getDaysInMonth } from "@/Lib/Actions";
import { Info, Minimize2 } from "lucide-react";

let ReplacementCach : any[] | null = null;
let ReplacementReasonsCache: any[] | null = null;
let compliteHCPFullInfo: any[] | null = null;
let RegisterdCacheInfo: any[] | null = null;
const ReplacementTable = ({ StatusMessage }: any) => {
  const [rawData, setRawData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [HeadingSearch,setHeadingSearch]=useState('')
  const [isChecking, setIsChecking] = useState(true);
 const now = new Date();
const users=useSelector((state:any)=>state.AdminFullInfo)
  // const [RegisterdUsers,setRegisterdUsers]=useState<any[]>([])
const month=useSelector((state:any)=>state.FilterMonth) 
const year=useSelector((state:any)=>state.FilterYear) 
const [HCPSalaryData,setHCPSalaryData]=useState<any>([]);
const [ReplacementReasons,setReplacementReasons]=useState<any[]>([]);
const [showPopup, setShowPopup] = useState(false);
const [showFullMonth,setShowFullMonth]=useState(false)
const [attendanceInfo,setAttendenceInfo]=useState<any>()
const [popupInfo, setPopupInfo] = useState("");
const dispatch=useDispatch()
const router=useRouter()
useEffect(() => {
  const fetchData = async () => {
    try {
      if (ReplacementCach?.length && ReplacementReasonsCache?.length) {
        setRawData(ReplacementCach);
        setReplacementReasons(ReplacementReasonsCache);
        setHCPSalaryData(compliteHCPFullInfo || []);
        return;
      }

      const response = await fetch("/api/replacement-info");
      const result = await response.json();

      if (!result.success) return;

      const {
        placementInformation,
        replacementReasons,
        hcpFullInfo,
      } = result;

      const formatted = placementInformation.map((record: any) => ({
        CurrentHCA_id: record.HCAId || "",
        AssignedHCA_id: record.NewHCAId || "",
        Month: record.Month || "Unknown",
        invoice: record.invoice || "",
        startDate: record.StartDate || "",
        endDate: record.EndDate || "",
        status: record.Status || "Inactive",
        location: record.Address || "N/A",
        NewHCA: record.NewHCAName || "",
        clientName: record.ClientName || "",
        clientPhone: record.ClientContact || "",
        ClientId: record.ClientId || "",
        CareTakerPrice: record.CareTakerPrice || 0,
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
        ReplacementDate:record.ReplacementDate,
      }));

      ReplacementCach = formatted;
      ReplacementReasonsCache = replacementReasons;
      compliteHCPFullInfo = hcpFullInfo;

      setRawData(formatted);
      setReplacementReasons(replacementReasons);
      setHCPSalaryData(hcpFullInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  };

  fetchData();
}, [StatusMessage]);
  const NumberOfDaysInMonth = getDaysInMonth(
    Number(month),
    Number(year)
  );


  const GetHCPFullName = (A: any) => {
  if (!users?.length || !A) return "";

  const info = users
    ?.map((each: any) => each?.HCAComplitInformation)
    ?.find((info: any) => info?.UserId === A);

  if (!info) return "";

  const fullName = [
    info.HCPSurName,
    info.HCPFirstName,
    info.LastName,
  ]
    .filter(Boolean)
    .join(" ");

  return fullName;
};
  const ShowDompleteInformation = async (userId: any, ClientName: any) => {
    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      dispatch(UpdateUserType("patient"));
      router.push("/UserInformation");
    }
  };
const getStatus = (dayInfo: any) => {
  const admin = dayInfo?.AdminAttendece;
  const hcp = dayInfo?.HCPAttendence;

  // Attendance not marked
  if (admin === undefined && hcp === undefined) return "-";

  // Present
  if (admin && hcp) return "P";

  // Absent
  if (!admin && !hcp) return "A";


    if ((!admin && hcp)||(admin && !hcp))return "HP";
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



  //  const GetHCPGender = (A: any) => {
  //   if (!HCPSalaryData?.length) return "Not Entered";

  //   const address =
  //     HCPSalaryData
  //       ?.map((each: any) => each?.HCAComplitInformation)
  //       ?.find((info: any) => info?.UserId === A)
  //     ?.['Gender']||"Not Provided";

  //   return address ?? "Not Entered";
  // };


  //    const GetHCPType = (A: any) => {
  //   if (!RegisterdUsers?.length || !A) return "Not Entered";

  //   const CurrentPreviewUserType:any =
  //     RegisterdUsers.filter((each:any)=>each.userId===A)

  //   return CurrentPreviewUserType[0]?.PreviewUserType ?? "Not Entered";
  // };

const GetHCPSalary = (userId: string) => {
  try {

    const Employee=HCPSalaryData.map((each:any)=>each.
HCAComplitInformation)
    const employee = Employee
      ?.find((item: any) => item?.UserId === userId);

    return Math.ceil(employee?.PaymentforStaff/30)
      
  } catch (err) {
    console.error(err);
    return 0;
  }
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
{showFullMonth && (
<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 md:p-4">
  <div className="bg-white w-full sm:w-[90vw] md:w-[80vw] lg:w-[60vw] h-[85vh] sm:h-[82vh] md:h-[80vh] lg:h-[76vh] max-w-4xl rounded-xl shadow-xl overflow-hidden flex flex-col">
    <div className="flex items-center justify-between px-4 py-3  shrink-0">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow">
          <img
            src="/Icons/Curate-logoq.png"
            alt="Company Logo"
            className="h-6 w-6 object-contain"
          />
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#ff1493] font-semibold">
           {attendanceInfo.clientName}
          </p>
          <h2 className="text-lg md:text-xl font-bold text-slate-800">
            Attendance Dashboard
          </h2>
       <p className="text-xs text-gray-400">
  {
    months.find(
      (impmonth) => impmonth.value === String(month).padStart(2, "0")
    )?.name
  }{" "}
  {year}
</p>
        </div>
      </div>

      <button
        onClick={() => setShowFullMonth(false)}
        className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
      >
        <Minimize2 size={16} />
      </button>
    </div>

    <div className="flex-1 p-2 md:p-3">
      <div className="grid grid-cols-7 gap-2 h-full">
        {Array.from({ length: NumberOfDaysInMonth }, (_, i) => {
          const today = new Date().getDate();
         const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(
  i + 1
).padStart(2, "0")}`;

const dayInfo = attendanceInfo.days?.find((item: any) => {
  const attendanceDate = item?.dateKey
    ? item.dateKey
    : new Date(item?.AttendenceDate).toISOString().split("T")[0];

  return attendanceDate === dateKey;
});
          const dayStatus = dayInfo?.status ?? "-";
          const clientName = dayInfo?.clientName ?? "";
          const UpdatedBy = dayInfo?.UpdatedBy ?? "-";
          const AbsentReason=dayInfo?.Reason?? "-";
          const AttendecStatus:any=getStatus(dayInfo)
       console.log ("Checking----",AttendecStatus)
          const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

const cellDate = new Date(
  Number(year),
  Number(month) - 1,
  i + 1
);
cellDate.setHours(0, 0, 0, 0);

const isFutureDate = cellDate > currentDate;

          return (
            <div
              key={i}
              className=" rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col items-center justify-center p-1 "
            >
              <span className="text-[10px] font-semibold text-gray-500 uppercase">
                Day {i + 1} 
              </span>

              {AttendecStatus === "-" ? (
                <>
                  <div className=" rounded-full bg-gray-100 flex items-center justify-center mt-1">
                     <span
                className={`text-[8px] w-fit font-medium font-semibold px-2 py-1 rounded bg-gray-300 text-gray-500 border-gray-300`}
              >
             Not Marked
              </span>
                  </div>

                  <span className="text-[8px] text-gray-400 truncate max-w-[70px]">
                    {clientName}
                  </span>

               
                </>
              ) : (
                <>
                  <DayBadge status={AttendecStatus} />

                  {clientName && (
                    <span className="text-[8px] text-center leading-tight px-1 line-clamp-2">
                      {clientName}
                    </span>
                  )}

                {UpdatedBy && UpdatedBy !== "-" && (
  <div className="relative group mt-1">
    <div className="p-[2px] rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
      <Info className="w-3 h-3 text-gray-500" />
    </div>

    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-2 rounded whitespace-nowrap z-50">
      <div>Marked by: {UpdatedBy}</div>

      {AbsentReason && dayStatus!=="P" && (
        <div className="mt-1 border-t border-gray-700 pt-1">
          Reason: {AbsentReason}
        </div>
      )}
    </div>
  </div>
)}

                
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>
)}
 
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white  text-[10px] font-semibold">
            <tr>
                 <th className="px-3 py-2 text-left">S.No</th>
              {/* <th className="px-3 py-2 text-left">Invoice</th> */}
              <th className="px-3 py-2 text-left">Client</th>
              <th className="px-3 py-2 text-left">Patient</th>
              <th className="px-3 py-2 text-left">Previous HCA</th>
              {/* <th className="px-3 py-2 text-left">Status</th> */}
              <th className="px-3 py-2 text-left">New Assigned HCA</th>
              <th className="px-3 py-2 text-left">ReplacementDate</th>
              {/* <th className="px-3 py-2 text-left">End</th> */}
                <th className="px-3 py-2 text-left">TimeSheet</th>
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
                <tr key={idx} className="border-t border-gray-200 bg-gray-50">
                  <td className="px-3 py-2">{idx+1}</td>
                  {/* <td className="px-3 py-2">{item.invoice}</td> */}
                  <td className="px-3 py-2">{item.clientName}</td>
                  <td className="px-3 py-2">{item.patientName}</td>
                 <td
  className="px-3 py-2 cursor-pointer hover:underline hover:text-blue-900"
  onClick={() => ShowDompleteInformation(item.CurrentHCA_id, item.hcpName)}
>
  <div className="relative flex items-center gap-2 group w-fit">

  
    {/* <img
      className="h-5 w-5"
      src={
        AssignSuitableIcon(
          GetHCPGender(item.CurrentHCA_id),
          GetHCPType(item.CurrentHCA_id)
        ).image
      }
    /> */}

  
{GetHCPFullName(item.CurrentHCA_id)}
   
    {/* <div
      className="absolute left-0 -top-11 z-50
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
          GetHCPGender(item.CurrentHCA_id),
          GetHCPType(item.CurrentHCA_id)
        ).caseType
      }
    </div> */}

  </div>
</td>
<td
  className="px-3 py-2 cursor-pointer hover:underline hover:text-blue-900"
  onClick={() => ShowDompleteInformation(item.AssignedHCA_id, item.NewHCA)}
>
  <div className="relative flex items-center gap-2 group w-fit">

    {/* Icon */}
    {/* <img
      className="h-5 w-5"
      src={
        AssignSuitableIcon(
          GetHCPGender(item.AssignedHCA_id),
          GetHCPType(item.AssignedHCA_id)
        ).image
      }
    /> */}


    {GetHCPFullName(item.AssignedHCA_id)}

    {/* Premium Tooltip */}
    {/* <div
      className="absolute left-0 -top-11 z-50
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
          GetHCPGender(item.AssignedHCA_id),
          GetHCPType(item.AssignedHCA_id)
        ).caseType
      }
    </div> */}

  </div>
</td>
                  
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
                  <td className="px-3 py-2">
  {item.ReplacementDate
    ? new Date(item.ReplacementDate).toLocaleDateString("en-IN")
    : "-"}
</td>
                  {/* <td className="px-3 py-2">{item.endDate}</td> */}
                  <td className="px-3 py-2">
                   <button
                                  className="px-2 py-1 text-[10px] text-white bg-teal-800 rounded hover:bg-teal-600"
                                  onClick={()=>{setAttendenceInfo(item),setShowFullMonth(true) ;console.log("dd",item.days)}}
                                >
                                  View
                                </button>
                                </td>
             

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



                  <td className="px-3 py-2 text-right">{item.CareTakerPrice
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
function DayBadge({ status }: { status: any }) {
  console.log("Check Imp Data-----",status)
  const Wrapper = ({ children }: any) => (
    <div className="flex items-center justify-center w-full">
      {children}
    </div>
  );

  if (status === "P") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 text-emerald-600 bg-white shadow-sm">
          {status}
        </span>
      </Wrapper>
    );
  }

  if (status === "HP") {
    return (
      <Wrapper>
        <div className="relative w-8 h-8 rounded-full border-2 border-emerald-500 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-semibold text-emerald-600">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-emerald-500" />
          <span className="relative z-10">HP</span>
        </div>
      </Wrapper>
    );
  }

  if (status === "A") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 border-rose-600 text-rose-600 bg-white shadow-sm">
          {status}
        </span>
      </Wrapper>
    );
  }

  if (status === "NA") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 border-gray-500 text-gray-600 bg-white shadow-sm">
          {status}
        </span>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border border-gray-400 text-gray-500 bg-white shadow-sm">
        {status}
      </span>
    </Wrapper>
  );
}
export default ReplacementTable;


