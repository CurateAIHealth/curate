"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Stethoscope, Shirt, CircleX, Search, X, ChevronsRight } from "lucide-react";
import { GetReasonsInfoInfo, GetRegidterdUsers, GetTerminationInfo, GetUserInformation, GetUsersFullInfo, InsertDeployment, PostInvoiceFromDeployment, updateServicePrice } from "@/Lib/user.action";
import { LoadingData } from "../Loading/page";
import { Placements_Filters, filterColors, years } from "@/Lib/Content";
import { AssignSuitableIcon, getDaysBetween, rupeeToNumber } from "@/Lib/Actions";
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

const TerminationTable: React.FC = () => {
  const [placements, setPlacements] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [RegisterdUsers, setRegisterdUsers] = useState<any[]>([])
  const [ReplacementReasons, setReplacementReasons] = useState<any[]>([]);
  const [updateServiceCharge, setUpdateServiceCharge] = useState(false);
  const [rawData, setRawData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [HeadingSearch, setHeadingSearch] = useState('')
  const [ActionStatusMessage, SetActionStatusMessage] = useState<any>("");
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState("");
  const [lastDateOfMonth, setLastDateOfMonth] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [showExtendPopup, setshowExtendPopup] = useState(false)
  const [isChecking, setIsChecking] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupInfo, setPopupInfo] = useState("");
  const [ExtendInfo, setExtendInfo] = useState<any>({})
  const TimeStamp = useSelector((state: any) => state.TimeStampInfo)
  const month = useSelector((state: any) => state.FilterMonth)
  const year = useSelector((state: any) => state.FilterYear)
  const dispatch = useDispatch()
  useEffect(() => {
    const Fetch = async () => {
      try {
        if (terminationCache) {
          setPlacements(terminationCache);
          setRegisterdUsers(RegisredUsersCache ?? [])
          setUsers(CompliteInfoCache ?? []);
          setReplacementReasons(ReplacementReasonsCache ?? [])
          setIsChecking(false);
          return;
        }

        const [RegisterdUsers,
          usersResult, FetchData, ReplacementReasons] = await Promise.all([
            GetRegidterdUsers(),
            GetUsersFullInfo(),
            GetTerminationInfo(),
            GetReasonsInfoInfo()

          ])

        ReplacementReasonsCache = ReplacementReasons ?? []
        RegisredUsersCache = RegisterdUsers ?? []
        CompliteInfoCache = usersResult ?? []
        setRegisterdUsers(RegisredUsersCache ?? [])
        setUsers(CompliteInfoCache ?? [])
        const Result = FetchData?.map((each: any) => ({
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


        setPlacements(Result);
        setReplacementReasons(ReplacementReasons ?? [])
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
      ?.['Gender'] || "Not Provided";

    return address ?? "Not Entered";
  };


  const GetHCPType = (A: any) => {
    if (!RegisterdUsers?.length || !A) return "Not Entered";

    const CurrentPreviewUserType: any =
      RegisterdUsers.filter((each: any) => each.userId === A)

    return CurrentPreviewUserType[0]?.PreviewUserType ?? "Not Entered";
  };

  const handleDelete = (id: string) => {
    setPlacements((prev) => prev.filter((placement) => placement.id !== id));
  };

  const UpdatePopup = async (a: any) => {
    setshowExtendPopup(true)
    setExtendInfo(a)

  }

  const GetPatientName = (A:any) => {
  const filtered = RegisterdUsers?.find(
    (each: any) => each.userId === A
  );

  return filtered
};
//   const ExtendTimeSheet = async () => {
//     console.log("Check for Tha Datata-----", ExtendInfo);
    
 
    
//     try {
//       SetActionStatusMessage("Please Wait Working On Service Extention");

//       if (!ExtendInfo?.
// ClientId
// ) {
//         throw new Error("Invalid client information");
//       }

//       const GetInfo = await GetUserInformation(ExtendInfo.ClientId);
//            const HCPInfo = await GetUserInformation(ExtendInfo.HCA_Id);



//       const startDateObj = new Date(selectedDate);
//       const endDateObj = new Date(selectedEndDate);

//       const StarteDate = startDateObj.toLocaleDateString("en-IN");
//       const LastDate = endDateObj.toLocaleDateString("en-IN");

//       const currentMonth = `${startDateObj.getFullYear()}-${startDateObj.getMonth() + 1}`;

//       const CareTakerCharges = serviceCharge || GetInfo?.serviceCharges;

//       // Update service price if provided
//       if (serviceCharge) {
//         await updateServicePrice(ExtendInfo.ClientId, serviceCharge);
//       }

//       const attendance = [
//         {
//           AttendenceDate: new Date().toISOString().split("T")[0],
//           HCPAttendence: true,
//           AdminAttendece: true,
//         },
//       ];
//       const today: any = new Date().getDate();

//       const ClientAttendece = [
//         {
//           AttendenceDate: today,
//           AttendeceStatus: "Present",
//         },
//       ];

//       console.log("Check for Tha Datata-----", ExtendInfo);

//       const deploymentRes = await InsertDeployment(
//         StarteDate,
//         LastDate,
//         "Active",
//         ExtendInfo.location,
//         ExtendInfo.contact,
//         ExtendInfo.clientName, 
//         GetInfo.patientName,
//         GetInfo.patientPhone,
//         GetInfo.Source,
//         ExtendInfo.HCA_Id,
//         ExtendInfo.ClientId,
//         HCPInfo.FirstName,
//         HCPInfo.ContactNumber,
//         "Google",
//         "Not Provided",
//         "PP",
//         "21000",
//         "700",
//         "1800",
//         CareTakerCharges,
//         currentMonth,
//         attendance,
//         TimeStamp,
//         "",
//         ExtendInfo.Type,
//         CareTakerCharges,
//         ClientAttendece
//       );

//       const UpdatedData = {
//         userId: ExtendInfo.ClientId,
//         serviceLocation: ExtendInfo.location,
//         FirstName: ExtendInfo.clientName,
//         patientName:GetInfo.patientName,//Required for Invoice
//         ContactNumber: ExtendInfo.contact,
//         Email: GetInfo.Email,//Required for Invoice
//         serviceCharges: CareTakerCharges,
//         RegistrationFee: 0,
//       };

//       const CompliteInvoiceInfo = await PostInvoiceFromDeployment(
//         UpdatedData,
//         0,
//         "",
//         StarteDate,
//         LastDate
//       );

//       if (CompliteInvoiceInfo?.success) {
//         SetActionStatusMessage(CompliteInvoiceInfo.message);
//       }

//       if (deploymentRes?.success) {
//         SetActionStatusMessage("TimeSheet Successfully Extended");

//         setTimeout(() => {
//           setshowExtendPopup(false);
//           setSelectedDate("");
//           SetActionStatusMessage("");
//         }, 2000);
//       }
//     } catch (error: any) {
//       console.error("ExtendTimeSheet Error:", error);
//       SetActionStatusMessage(
//         error?.message || "Something went wrong while extending timesheet"
//       );
//     }
//   };


const ExtendTimeSheet = async () => {


try {
SetActionStatusMessage("Please Wait Working On Service Extention");


if (!ExtendInfo?.ClientId) {
  throw new Error("Invalid client information");
}


// const [GetInfo, HCPInfo] = await Promise.all([
//   GetUserInformation(ExtendInfo.ClientId),
//   GetUserInformation(ExtendInfo.HCA_Id),
// ]);
const GetInfo = GetPatientName(ExtendInfo.ClientId);
const HCPInfo =GetPatientName(ExtendInfo.ClientId);

if (!GetInfo || !HCPInfo) {
  throw new Error("Failed to fetch user information");
}

const startDateObj = new Date(selectedDate);
const endDateObj = new Date(selectedEndDate);

const StarteDate = startDateObj.toLocaleDateString("en-IN");
const LastDate = endDateObj.toLocaleDateString("en-IN");

const currentMonth = `${startDateObj.getFullYear()}-${startDateObj.getMonth() + 1}`;

const CareTakerCharges = serviceCharge || GetInfo?.serviceCharges;

// Update service price if provided
if (serviceCharge) {
  await updateServicePrice(ExtendInfo.ClientId, serviceCharge);
}

const todayISO = new Date().toISOString().split("T")[0];
const todayDate = new Date().getDate();

const attendance = [
  {
    AttendenceDate: todayISO,
    HCPAttendence: true,
    AdminAttendece: true,
  },
];

const ClientAttendece = [
  {
    AttendenceDate: todayDate,
    AttendeceStatus: "Present",
  },
];



const deploymentRes = await InsertDeployment(
  StarteDate,
  LastDate,
  "Active",
  ExtendInfo.location,
  ExtendInfo.contact,
  ExtendInfo.clientName,
  GetInfo.patientName,
  GetInfo.patientPhone,
  GetInfo.Source,
  ExtendInfo.HCA_Id,
  ExtendInfo.ClientId,
  HCPInfo.FirstName,
  HCPInfo.ContactNumber,
  "Google",
  "Not Provided",
  "PP",
  "21000",
  "700",
  "1800",
  GetPatientName(ExtendInfo.ClientId)?.MonthlyServiceCharge || CareTakerCharges,
  currentMonth,
  attendance,
  TimeStamp,
  "",
  ExtendInfo.Type,
  GetPatientName(ExtendInfo.ClientId)?.MonthlyServiceCharge || CareTakerCharges,
  ClientAttendece
);

const UpdatedData = {
  userId: ExtendInfo.ClientId,
  serviceLocation: ExtendInfo.location,
  FirstName: ExtendInfo.clientName,
  patientName: GetInfo.patientName, // Required for Invoice
  ContactNumber: ExtendInfo.contact,
  Email: GetInfo.Email, // Required for Invoice
  serviceCharges:GetPatientName(ExtendInfo.ClientId)?.MonthlyServiceCharge || CareTakerCharges,
  MonthlyPayment:GetPatientName(ExtendInfo.ClientId)?.MonthlyServiceCharge ?true:false,
  RegistrationFee: 0,
};

const CompliteInvoiceInfo = await PostInvoiceFromDeployment(
  UpdatedData,
  0,
  "",
  StarteDate,
  LastDate
);

if (CompliteInvoiceInfo?.success) {
  SetActionStatusMessage(CompliteInvoiceInfo.message);
}

if (deploymentRes?.success) {
  SetActionStatusMessage("TimeSheet Successfully Extended");

  setTimeout(() => {
    setshowExtendPopup(false);
    setSelectedDate("");
    SetActionStatusMessage("");
  }, 2000);
}

} catch (error: any) {
console.error("ExtendTimeSheet Error:", error);
SetActionStatusMessage(
error?.message || "Something went wrong while extending timesheet"
);
}
};
  if (isChecking) {
    return (
      <LoadingData />

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

    const results = ReplacementReasons?.filter((each: any) => each?.HCA_id === A) ?? [];
    if (results.length === 0) {
      return "No Reasond Found.Try Again"
    }

    const firstReason = results[0]?.Reason ?? "";
    const secondReason = results[0]?.EnterdReason ?? "";
    const DateandTime = results[0]?.DateandTime ?? ""

    if (firstReason && secondReason) {
      return `${firstReason} And ${secondReason}. Replacement Happend On ${DateandTime}`.trim();
    }

    return `${firstReason}${secondReason}. Replacement Happend On  ${DateandTime}`.trim();


  };

  return (
    <div className="p-2 bg-gray-50">

      <div className="flex flex-wrap gap-3 items-center justify-end">


        <div className="relative w-auto m-1">
          <p>{ActionStatusMessage}</p>
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
        {showExtendPopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[360px] p-6 border border-gray-200">

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Extend Service
                </h2>

                <X size={15} className="mb-10 cursor-pointer" onClick={() => setshowExtendPopup(false)} />
              </div>


              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-1 block">
                  Select Start Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedDate(e.target.value)
                    if (!value) {
                      setShowWarning(false);
                      return;
                    }

                    const selected = new Date(value);
                    const today = new Date();

                    const isCurrentMonth =
                      selected.getMonth() === today.getMonth() &&
                      selected.getFullYear() === today.getFullYear();


                    setShowWarning(!isCurrentMonth);

                  }}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-1 block">
                  Select End Date
                </label>
                <input
                  type="date"
                  value={selectedEndDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedEndDate(e.target.value)
                    if (!value) {
                      setShowWarning(false);
                      return;
                    }

                    const selected = new Date(value);
                    const today = new Date();

                    const isCurrentMonth =
                      selected.getMonth() === today.getMonth() &&
                      selected.getFullYear() === today.getFullYear();


                    setShowWarning(!isCurrentMonth);

                  }}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              {showWarning && (
                <p className="text-xs text-center text-red-500 mt-1">
                  ⚠ Selected date Sholud be belongs to the current month
                </p>
              )}

              {lastDateOfMonth && (
                <div className="mb-4">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Last Date of Service
                  </label>
                  <input
                    type="date"
                    value={lastDateOfMonth}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100"
                  />
                </div>
              )}

              {serviceCharge && <div className="flex items-center">
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Current Charges:</span>


                </p>
                <div className="flex flex-col">  <span className="text-blue-600 text-xs font-semibold ml-1">
                  {serviceCharge}/day
                </span>
                  {(selectedDate && selectedEndDate) && <span className="text-blue-600 text-xs font-semibold ml-1">

                    {(getDaysBetween(selectedDate, selectedEndDate) *
                      rupeeToNumber(serviceCharge)
                    ).toFixed(2)}/M
                  </span>}
                </div>
              </div>}
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="radio"
                  checked={updateServiceCharge}
                  onChange={(e) => { setServiceCharge(""), setUpdateServiceCharge(e.target.checked) }}
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-sm text-gray-700">
                  Update Service Charge
                </span>
              </div>


              {updateServiceCharge && (
                <div className="mb-4">
                  <input
                    type="number"
                    placeholder="Enter service charge"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              )}

              <div className="border-t border-gray-200 my-4"></div>


              {selectedDate && !showWarning && <div className="flex justify-center gap-4">
                <button
                  onClick={() => setshowExtendPopup(false)}
                  className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  No
                </button>
                <button
                  onClick={ExtendTimeSheet}
                  className="px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700"
                >
                  Yes
                </button>
              </div>}
              <p
                className={`text-[9px] mt-1 text-center ${ActionStatusMessage?.includes("TimeSheet Successfully Extended")
                    ? "text-green-600"
                    : "text-red-600 font-bold"
                  }`}
              >
                {ActionStatusMessage}
              </p>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm border-separate border-spacing-0">


            <thead className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white  text-[10px] font-semibold">




              <tr className="border-b border-gray-300">
                {["S.No", "Client","Patient","HCA", "Contact", "Location",  "Status", "Reason", "Service Continue", "Action"].map(
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
         
            <tbody className="bg-white divide-y divide-gray-200">
              {FilterValues.map((placement, idx) => (
                <tr
                  key={idx}
                  className="bg-white divide-y divide-gray-200"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {idx + 1}
                  </td>
                  {/* CLIENT */}
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {placement.clientName || "Not Provided"}
                  </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                  {GetPatientName(placement.ClientId)?.patientName || "Not Provided"}
                  </td>
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
                  {/* CONTACT */}
                  <td className="px-6 py-4 text-gray-700">
                    {placement.contact || "Not Provided"}
                  </td>

                  {/* LOCATION */}
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                    {placement.location || "UnFilled"}
                  </td>

                
                


                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm ${placement.status === "Active"
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

                  <td className="px-3 py-2">
                    <button
                      className=" ml-8
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
                      onClick={() => {
                        SetActionStatusMessage("");

                        UpdatePopup(placement);
                        setServiceCharge(rupeeToNumber(placement.ServiceCharge).toFixed(2));
                        setSelectedDate("");
                        setSelectedEndDate("");
                        setShowWarning(false);
                        SetActionStatusMessage("");
                      }}
                    >
                      <ChevronsRight size={22} className="text-teal-600" />
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
