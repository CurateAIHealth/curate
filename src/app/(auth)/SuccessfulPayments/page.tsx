"use client";
let cachedSuccesfulpayments: any[] = [];
let cachedUsersFullInfo: any[] = [];
let cachedRegisterdUsers: any[] = [];
import { LoadingData } from "@/Components/Loading/page";
import { AssignSuitableIcon, toProperCaseLive } from "@/Lib/Actions";
import { IndianStates, menuItems, months, SuccussfulmenuItems, years } from "@/Lib/Content";
import { GetAllUsersData, GetSuccesfulPaymentData } from "@/Lib/user.action";
import { UpdateMonthFilter, UpdateYearFilter } from "@/Redux/action";
import { Eye, CheckCircle2, Search, Info, Minimize2, X, Menu, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SuccessfulPayments() {
//  const data = [
//   {
//     id: 1,
//     name: "Kanchan",
//     total: 520000,
//     neft: "HCA2026007",
//     dateTime: "01 Jun 2026 | 10:45 AM",
//   },
//   {
//     id: 2,
//     name: "Reddyvari",
//     total: 529500,
//     neft: "HCA2026002",
//     dateTime: "01 Jun 2026 | 11:20 AM",
//   },
//   {
//     id: 3,
//     name: "Khushiyavishnu",
//     total: 485030,
//     neft: "HCA2026005",
//     dateTime: "01 Jun 2026 | 12:10 PM",
//   },
//   {
//     id: 4,
//     name: "Kavita Koko",
//     total: 546000,
//     neft: "HCA2026009",
//     dateTime: "01 Jun 2026 | 03:15 PM",
//   },
//   {
//     id: 5,
//     name: "Roshani Sunkatrao",
//     total: 540000,
//     neft: "HCA2026010",
//     dateTime: "02 Jun 2026 | 09:10 AM",
//   },
//   {
//     id: 6,
//     name: "Priyanka",
//     total: 499000,
//     neft: "HCA2026011",
//     dateTime: "02 Jun 2026 | 09:45 AM",
//   },
//   {
//     id: 7,
//     name: "Sanjana",
//     total: 460000,
//     neft: "HCA2026012",
//     dateTime: "02 Jun 2026 | 11:05 AM",
//   },
//   {
//     id: 8,
//     name: "Kratika",
//     total: 520000,
//     neft: "HCA2026013",
//     dateTime: "02 Jun 2026 | 01:30 PM",
//   },
//   {
//     id: 9,
//     name: "Anjali",
//     total: 575000,
//     neft: "HCA2026014",
//     dateTime: "02 Jun 2026 | 02:40 PM",
//   },
//   {
//     id: 10,
//     name: "Niharika",
//     total: 495000,
//     neft: "HCA2026015",
//     dateTime: "02 Jun 2026 | 04:15 PM",
//   },
// ];
    const [isChecking, setIsChecking] = useState(true);
    const [showFullMonth,setShowFullMonth]=useState(false)
    const [attendanceInfo,setAttendenceInfo]=useState<any>()
const [SelectedServiceState,SetServiceState]=useState("Telangana")
    const RegisterdUsers=useSelector((state:any)=>state.AdminUsers)
    const users=useSelector((state:any)=>state.AdminFullInfo)
  const [menuOpen, setMenuOpen] = useState(false);
      
const [PreviewData,setPreviewData]=useState<any>()
  const SearchMonth = useSelector((state: any) => state.FilterMonth);
  const SearchYear = useSelector((state: any) => state.FilterYear);
  const [search, setSearch] = useState("");
  const dispatch=useDispatch()
const router=useRouter()
useEffect(() => {
  const FetchSuccessfullData = async () => {
    try {
      if (cachedSuccesfulpayments.length > 0) {
          //   setUsers([...cachedUsersFullInfo]);
          
          // setRegisterdUsers([...cachedRegisterdUsers])
        setPreviewData(cachedSuccesfulpayments);
        setIsChecking(false)
        return;
      }

      const GetData = await GetSuccesfulPaymentData();
        //   const {
        //   RegisterdUsers,
        //   usersResult,
        //   placementInfo,
        //   replacementInfo,
        //   terminationInfo,
        // } = await GetAllUsersData();

      console.log("Check ImportedData-------", GetData);
//  cachedUsersFullInfo = usersResult ?? [];
//    cachedRegisterdUsers=RegisterdUsers??[]
//         setUsers([...cachedUsersFullInfo]);
//       setRegisterdUsers([...cachedRegisterdUsers])
      cachedSuccesfulpayments = Array.isArray(GetData) ? GetData : [];
      setPreviewData(cachedSuccesfulpayments);
      setIsChecking(false)
    } catch (err: any) {
      console.error(err);
    }
  };

  FetchSuccessfullData();
}, []);

 const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate(); 
};
const NumberOfDaysInMonth = getDaysInMonth(
  Number(SearchMonth),
  Number(SearchYear)
);

  const GetHCPGender = (A: any) => {
    if (!users?.length || !A) return "Not Entered";

    const address =
      users
        ?.map((each: any) => each?.HCAComplitInformation)
        ?.find((info: any) => info?.UserId === A)
      ?.['Gender']||"Not Provided";

    return address ?? "Not Entered";
  };

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
}
     const GetHCPType = (A: any) => {
    if (!RegisterdUsers?.length || !A) return "Not Entered";

    const CurrentPreviewUserType:any =
      RegisterdUsers.filter((each:any)=>each.userId===A)

    return CurrentPreviewUserType[0]?.PreviewUserType ?? "Not Entered";
  };

const PaymentInformation = useMemo(
  () =>
    PreviewData?.map((each: any) => ({
      ...each,
      ClientId: each.ClientId,
      HCAId: each.HCAId,
      name: each.HCAName,
      attendanceInfo: each.Attendance,
      total: each.GrandTotalAmount,
      neft: each.NeftNumber||each.NeftTransactionNumber,
      dateTime: each.CreatedAt,
      Month:each.Month,
      ServiceState:each.ServiceState
    })) || [],
  [PreviewData]
);
console.log("Check Attendece----",PreviewData)
const matchesSearchAndMonth = (
  item: any,
  searchText: string,
  searchMonth: string,
  searchYear: string
) => {
  const search = searchText?.toLowerCase() || "";

  const name = item.name?.toLowerCase() || "";

  const matchesSearch =
    !search || name.includes(search);

  if (!searchMonth && !searchYear) {
    return matchesSearch;
  }

  if (!item.Month) {
    return false;
  }

  const [year, month] = item.Month.split("-");

  const matchesMonth =
    !searchMonth || Number(month) === Number(searchMonth);

  const matchesYear =
    !searchYear || Number(year) === Number(searchYear);

  return matchesSearch && matchesMonth && matchesYear;
};
const data = useMemo(
  () =>
    PaymentInformation.filter((item: any) =>
      item.ServiceState===SelectedServiceState&&
      matchesSearchAndMonth(
        item,
        search,
        SearchMonth,
        SearchYear
      )
    ),
  [SelectedServiceState,PaymentInformation, search, SearchMonth, SearchYear]
);
      function DayBadge({ status }: { status: any }) {
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
console.log("PreviewData", PreviewData);
console.log("PaymentInformation", PaymentInformation);
console.log("SearchMonth", SearchMonth);
console.log("SearchYear", SearchYear);
console.log("search", search);

  if (isChecking) {
      return (
    <LoadingData/>
  
      );
    }
  return (
    <div className="bg-white rounded-3xl border border-green-100 shadow-xl overflow-hidden">
<div className="border-b px-4 py-4 sm:px-6 sm:py-5">
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

    {/* Left */}
    <div className="relative flex w-full items-start gap-4 lg:w-auto">

      {/* Menu + Logo */}
      <div className="relative flex items-center gap-3">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 shrink-0 items-center cursor-pointer justify-center rounded-lg border border-slate-200 hover:bg-slate-100"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <img
          src="/Icons/Curate-logoq.png"
          alt="Curate Logo"
          className="h-10 w-10 object-contain"
        />

        {menuOpen && (
          <div className="absolute left-0 top-full z-50 mt-3 w-72 max-w-[90vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Advance Payment Options
              </p>
            </div>

            <div className="py-2">
              {SuccussfulmenuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    onClick={() => {
                      setMenuOpen(false);
                    router.push(item.route);
                    }}
                    className="group flex w-full items-center cursor-pointer justify-between px-5 py-3 transition hover:bg-teal-50 hover:text-teal-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-100 p-2 group-hover:bg-teal-100">
                        <Icon size={18} />
                      </div>

                      <span className="font-medium">{item.title}</span>
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-600"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="min-w-0">
        <h2 className="text-xl font-bold text-green-600 sm:text-2xl">
          Successful Payments
        </h2>

        <p className="text-sm text-slate-500">
          Successfully processed payroll transactions
        </p>
      </div>
    </div>

    {/* Right Controls */}
    <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
 <div className=" relative md:col-span-2">
     
      
        <select
          
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-teal-500"
          defaultValue={SelectedServiceState}
          onChange={(e) => {
           SetServiceState(e.target.value)
          }}
        >
          <option value="" disabled>
            Select Service State
          </option>
      
          {IndianStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      {/* Search */}
      <div className="relative w-full lg:w-[320px]">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4"
        />
      </div>

      {/* Filters */}
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:w-auto">

        <select
          value={SearchMonth}
          onChange={(e) => dispatch(UpdateMonthFilter(e.target.value))}
          className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm"
        >
          <option value="">All Months</option>

          {[...Array(12)].map((_, i) => (
            <option key={i} value={`${i + 1}`}>
              {new Date(0, i).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        <select
          value={SearchYear}
          onChange={(e) => dispatch(UpdateYearFilter(e.target.value))}
          className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm"
        >
          <option value="">All Years</option>

          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          onClick={() => router.push("/SubAccountings")}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#00A9A5] to-[#005f61] px-4 font-semibold text-white transition hover:from-[#01cfc7] hover:to-[#00403e] sm:w-auto"
        >
          Accounts Dashboard
        </button>
      </div>

    </div>

  </div>
</div>
  {showFullMonth && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-2">
          <div className="bg-white w-[70vw] h-[96vh] rounded-xl shadow-xl overflow-hidden flex flex-col">
            {(() => {
              const attendanceSummary = attendanceInfo.attendanceInfo?.reduce(
                (acc: any, att: any) => {
                  const hcp = att.HCPAttendence === true;
                  const admin = att.AdminAttendece === true;
      
                  if (hcp && admin) {
                    acc.present += 1;
                  } else if (hcp || admin) {
                    acc.halfDay += 1;
                  } else {
                    acc.absent += 1;
                  }
      
                  return acc;
                },
                {
                  present: 0,
                  halfDay: 0,
                  absent: 0,
                }
              );
      
              return (
                <>
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
                          {attendanceInfo.HCAName}
                        </p>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">
                          Attendance Dashboard
                        </h2>
                        <p className="text-xs text-gray-400">
                          {
                            months.find(
                              (month) =>
                                month.value === String(SearchMonth).padStart(2, "0")
                            )?.name
                          }{" "}
                          {SearchYear}
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
      
                  <div className="grid grid-cols-3 gap-3 px-4 py-3 bg-gray-50 shrink-0">
                    <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                      <p className="text-xs text-green-600 font-medium">
                        Present Days
                      </p>
                      <p className="text-xl font-bold text-green-700">
                        {attendanceSummary?.present || 0}
                      </p>
                    </div>
      
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                      <p className="text-xs text-amber-600 font-medium">Half Days</p>
                      <p className="text-xl font-bold text-amber-700">
                        {attendanceSummary?.halfDay || 0}
                      </p>
                    </div>
      
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                      <p className="text-xs text-red-600 font-medium">Absent Days</p>
                      <p className="text-xl font-bold text-red-700">
                        {attendanceSummary?.absent || 0}
                      </p>
                    </div>
                  </div>
      
                  <div className="flex-1 p-2 md:p-3">
                    <div className="grid grid-cols-7 gap-2 h-full">
                      {Array.from({ length: NumberOfDaysInMonth }, (_, i) => {
                        const today = new Date().getDate();
      
                        const dayInfo = attendanceInfo.attendanceInfo?.find(
                          (att: any) => {
                            const day = new Date(att.AttendenceDate).getDate();
                            return day === i + 1;
                          }
                        );
      
                        const hcp = dayInfo?.HCPAttendence === true;
                        const admin = dayInfo?.AdminAttendece === true;
      
                        let dayStatus = "-";
      
                        if (dayInfo) {
                          if (hcp && admin) {
                            dayStatus = "P";
                          } else if (hcp || admin) {
                            dayStatus = "HP";
                          } else {
                            dayStatus = "A";
                          }
                        }
      
                        const clientName = dayInfo?.Client_Name ?? "";
                        const UpdatedBy = dayInfo?.UpdatedBy ?? "-";
                        const AbsentReason = dayInfo?.Reason ?? "-";
                        const isFutureDate = i + 1 > today;
      
                        return (
                          <div
                            key={i}
                            className="rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col items-center justify-center p-1 min-h-0"
                          >
                            <span className="text-[10px] font-semibold text-gray-500 uppercase">
                              Day {i + 1}
                            </span>
      
                            {dayStatus === "-" ? (
                              <>
                                <span
                                  className={`text-[8px] w-fit font-medium font-semibold px-2 py-1 rounded bg-gray-300 text-gray-500 border-gray-300`}
                                >
                                  Not Marked
                                </span>
      
                                <span className="text-[8px] text-gray-400 truncate max-w-[70px]">
                                  {clientName}
                                </span>
                              </>
                            ) : (
                              <>
                                <DayBadge status={dayStatus} />
      
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
      
                                      {AbsentReason &&
                                        dayStatus !== "P" && (
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
                </>
              );
            })()}
          </div>
        </div>
      )}
{data?.length===0?     
          <div className="h-[100vh] flex flex-col items-center justify-center py-12 px-6 rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-cyan-50 shadow-md">
 
  <img
     src="/Icons/Curate-logoq.png"
    alt="Company Logo"
    className="w-20 h-20 mb-4 object-contain"
  />



 
  <h3 className="text-xl font-bold text-[#1392d3] mb-2">
No Successfull Payment for Selected Month
  </h3>


  <p className="text-gray-600 text-center max-w-md">
    We couldn't find any records for the selected criteria. Try changing the
    filters or check back later.
  </p>

 
 
</div>:
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full">
          <thead>
            <tr className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
              <th className="px-5 py-4 text-left">S.No</th>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-center">Time Sheet</th>
              <th className="px-5 py-4 text-center">Total</th>
              <th className="px-5 py-4 text-center">NEFT Number</th>
              <th className="px-5 py-4 text-center">
                Date & Time Of Pay
              </th>
            </tr>
          </thead>

          <tbody>
            {data?.map((row:any, index:any) => (
              <tr
                key={index}
                className="border-b border-slate-100 hover:bg-green-50"
              >
                <td className="px-5 py-5 font-semibold">
                  {index + 1}
                </td>

                <td className="px-5 py-5 font-semibold">
               <div className="relative flex gap-2 items-center justify-between w-[100px]  group ">
               
                
               
               
                     <span className="hover:underline font-semibold text-xm break-words leading-tight">
                     {GetHCPFullName(row.HCAId)
                   ? GetHCPFullName(row.HCAId)
                   : `${toProperCaseLive(row.name)} ${row.clientid}`}
                     </span>
               
                    <img
                     className="h-4 w-4"
                     src={
                       AssignSuitableIcon(
                         GetHCPGender(row.HCAId),
                         GetHCPType(row.HCAId)
                       ).image
                     }
                   />
                   <div
                     className="absolute -top-12 left-1/2 -translate-x-1/2
                                opacity-0 group-hover:opacity-100
                                translate-y-2 group-hover:translate-y-0
                                transition-all duration-300 ease-out
                                bg-gradient-to-br from-[#00A9A5] to-[#005f61]
                                text-white text-xs font-medium
                                px-3 py-2 rounded-xl shadow-xl
                                whitespace-nowrap pointer-events-none z-50"
                   >
                     {
                       AssignSuitableIcon(
                         GetHCPGender(row.HCAId),
                         GetHCPType(row.HCAId)
                       ).caseType
                     }
                   </div>
               
                 </div>
                </td>

                <td className="px-5 py-5 text-center">
                <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out active:scale-95"
                   onClick={() => {
                      setShowFullMonth(true)
                      setAttendenceInfo(row)
                    }}
                  >
  View  
</button>
                </td>

                <td className="px-5 py-5 text-center font-bold text-slate-800">
                  {row.total.toLocaleString()}
                </td>

                <td className="px-5 py-5 text-center">
                  <span className="px-4 py-2 rounded-xl bg-slate-100 font-semibold">
                    {row.neft}
                  </span>
                </td>

                <td className="px-5 py-5 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold">
                    <CheckCircle2 size={16} />
                    {row.dateTime}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}