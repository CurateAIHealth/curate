"use client";
let cachedSuccesfulpayments: any[] = [];
let cachedUsersFullInfo: any[] = [];
let cachedRegisterdUsers: any[] = [];
import PopupToast from "@/Components/ExpencesPopUp/page";
import { LoadingData } from "@/Components/Loading/page";
import { AssignSuitableIcon, toProperCaseLive } from "@/Lib/Actions";
import { months, RejectedmenuItems, SuccussfulmenuItems, years } from "@/Lib/Content";
import { GetAllUsersData, GetRejectedPaymentData, UpdateStatusEnableinRejection } from "@/Lib/user.action";
import { UpdateMonthFilter, UpdateYearFilter } from "@/Redux/action";
import { Eye, CornerUpLeft, Search, Minimize2, Info, ChevronRight, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RejectedPayments() {
  // const data = [
  //   {
  //     id: 1,
  //     name: "Priyanka",
  //     total: 499000,
  //     reason: "Timesheet Not Approved",
  //   },
  //   {
  //     id: 2,
  //     name: "Sanjana",
  //     total: 460000,
  //     reason: "Amount Mismatch",
  //   },
  //   {
  //     id: 3,
  //     name: "Kavita Koko",
  //     total: 546000,
  //     reason: "Missing Documents",
  //   },
  //   {
  //     id: 4,
  //     name: "Roshani Sunkatrao",
  //     total: 540000,
  //     reason: "Invalid Account Number",
  //   },
  //   {
  //     id: 5,
  //     name: "Reddyvari",
  //     total: 529500,
  //     reason: "IFSC Code Error",
  //   },
  //   {
  //     id: 6,
  //     name: "Kanchan",
  //     total: 520000,
  //     reason: "Duplicate Payment Request",
  //   },
  //   {
  //     id: 7,
  //     name: "Khushiyavishnu",
  //     total: 485030,
  //     reason: "Salary Calculation Mismatch",
  //   },
  //   {
  //     id: 8,
  //     name: "Anjali",
  //     total: 575000,
  //     reason: "Bank Verification Pending",
  //   },
  //   {
  //     id: 9,
  //     name: "Niharika",
  //     total: 495000,
  //     reason: "Incorrect Timesheet Hours",
  //   },
  //   {
  //     id: 10,
  //     name: "Kratika",
  //     total: 520000,
  //     reason: "Missing Approval From Manager",
  //   },
  // ];
const [menuOpen, setMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [RegisterdUsers, setRegisterdUsers] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([]);
  const [PreviewData, setPreviewData] = useState<any>()
  const [showFullMonth,setShowFullMonth]=useState(false)
  const [attendanceInfo,setAttendenceInfo]=useState<any>()
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
  const SearchMonth = useSelector((state: any) => state.FilterMonth);
  const SearchYear = useSelector((state: any) => state.FilterYear);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch()
  const router = useRouter()
  useEffect(() => {
    const FetchSuccessfullData = async () => {
      try {
        if (cachedSuccesfulpayments.length > 0) {
          setUsers([...cachedUsersFullInfo]);

          setRegisterdUsers([...cachedRegisterdUsers])
          setPreviewData(cachedSuccesfulpayments);
          setIsChecking(false)
          return;
        }

        const GetData = await GetRejectedPaymentData();
        const {
          RegisterdUsers,
          usersResult,
          placementInfo,
          replacementInfo,
          terminationInfo,
        } = await GetAllUsersData();

        console.log("Check ImportedData-------", GetData);
        cachedUsersFullInfo = usersResult ?? [];
        cachedRegisterdUsers = RegisterdUsers ?? []
        setUsers([...cachedUsersFullInfo]);
        setRegisterdUsers([...cachedRegisterdUsers])
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
      ?.['Gender'] || "Not Provided";

    return address ?? "Not Entered";
  };


  const GetHCPType = (A: any) => {
    if (!RegisterdUsers?.length || !A) return "Not Entered";

    const CurrentPreviewUserType: any =
      RegisterdUsers.filter((each: any) => each.userId === A)

    return CurrentPreviewUserType[0]?.PreviewUserType ?? "Not Entered";
  };
console.log("Check Attendecence Information------",PreviewData)
  const PaymentInformation = useMemo(
    () =>
      PreviewData?.map((each: any) => ({
        
        ...each,
        ClientId: each.ClientId,
        HCAId: each.HCAId,
         attendanceInfo: each.Attendance,
        name: each.HCAName,
        total: each.GrandTotalAmount,
        neft: each.NeftNumber,
        dateTime: each.CreatedAt,
        Month: each.Month,
        reason:each.Reason
      })) || [],
    [PreviewData]
  );
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
        matchesSearchAndMonth(
          item,
          search,
          SearchMonth,
          SearchYear
        )
      ),
    [PaymentInformation, search, SearchMonth, SearchYear]
  );

  console.log("PreviewData", PreviewData);
  console.log("PaymentInformation", PaymentInformation);
  console.log("SearchMonth", SearchMonth);
  console.log("SearchYear", SearchYear);
  console.log("search", search);
const UpdateRevertStatus = async (ClientId:any,HCAId:any,Month:any) => {
try{
  setPopup({
      isOpen: true,
      message: "Please Wait Updating Payment Status...",
      type: "loading",
    });
const PostINPayblePageResult = await UpdateStatusEnableinRejection(HCAId,ClientId,Month);
   if(PostINPayblePageResult.success){
      
    

     setPopup({
        isOpen: true,
        message:"Revert Status Updated successfully!",
        type: "success",
      });
window.location.reload()
    }else{
        setPopup({
        isOpen: true,
        message:PostINPayblePageResult.message || "Failed to update payment status",
        type: "error",
      });
    }
}catch(err){
  console.error("Error updating revert status:", err);
}
}

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
  if (isChecking) {
    return (
      <LoadingData />

    );
  }
  return (
    <div className="bg-white rounded-3xl border border-red-100 shadow-xl overflow-hidden">
      <div className="px-6 py-5 border-b">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div className="flex items-center gap-4">
<div className="relative flex items-center gap-3">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 shrink-0 items-center cursor-pointer justify-center rounded-lg border border-slate-200 hover:bg-slate-100"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>   {menuOpen && (
                    <div className="absolute left-0 top-full z-50 mt-3 w-72 max-w-[90vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5">
                      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Advance Payment Options
                        </p>
                      </div>
          
                      <div className="py-2">
                        {RejectedmenuItems.map((item) => {
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
              <img
                src="/Icons/Curate-logoq.png"
                alt="Curate Logo"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-red-600">
                Rejected
              </h2>

              <p className="text-slate-500 text-sm">
                Payments returned for correction
              </p>
            </div>
          </div>

          
                <div className="relative min-w-[250px] flex-1 max-w-[350px]">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-2xl border border-[#d9e2ec] bg-white pl-12 pr-4 text-black"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={SearchMonth}
              onChange={(e) => dispatch(UpdateMonthFilter(e.target.value))}
              className="w-[140px] h-[40px] rounded-xl border border-gray-300 px-3 text-sm bg-white text-gray-800"
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
              className="w-[120px] h-[40px] rounded-xl border border-gray-300 px-3 text-sm bg-white text-gray-800"
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
          className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
        >
          Accounts Dashboard
        </button>
          </div>
       
        </div>
      </div>
<PopupToast
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        logo="/Icons/Curate-logoq.png"
        duration={4000}
        autoClose={false}
        showProgress={true}
        onClose={() =>
          setPopup((prev) => ({ ...prev, isOpen: false }))
        }
      />
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
      {data.length===0?    <div className="h-[100vh] flex flex-col items-center justify-center py-12 px-6 rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-cyan-50 shadow-md">
 
  <img
     src="/Icons/Curate-logoq.png"
    alt="Company Logo"
    className="w-20 h-20 mb-4 object-contain"
  />



 
  <h3 className="text-xl font-bold text-[#1392d3] mb-2">
No Rejected Payment for Selected Month
  </h3>


  <p className="text-gray-600 text-center max-w-md">
    We couldn't find any records for the selected criteria. Try changing the
    filters or check back later.
  </p>

 
 
</div>:
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full">
          <thead>
            <tr className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
              <th className="px-5 py-4 text-left">S.No</th>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-center">Time Sheet</th>
              <th className="px-5 py-4 text-center">Total</th>
              <th className="px-5 py-4 text-left">
                Reason For Rejection
              </th>
              <th className="px-5 py-4 text-center">Revert</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row:any, index:any) => (
              <tr
                key={index}
                className="border-b border-slate-100 hover:bg-red-50"
              >
                <td className="px-5 py-5 font-semibold">
                  {index + 1}
                </td>

                <td className="px-5 py-5 font-semibold">
                   <div className="relative flex gap-2 items-center justify-between w-[100px]  group ">
                                   
                                    
                                   
                                   
                                       <span className="hover:underline font-semibold text-xm break-words leading-tight">
                                         {toProperCaseLive(row.name)}{row.clientid}
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

                <td className="px-5 py-5 text-center font-bold">
                  {row.total.toLocaleString()}
                </td>

                <td className="px-5 py-5">
                  <span className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium">
                    {row.reason}
                  </span>
                </td>

                <td className="px-5 py-5 text-center">
                  <button className="inline-flex items-center cursor-pointer gap-2 bg-green-600 text-white px-5 py-2 rounded-xl font-semibold"
                 onClick={() => { 
  UpdateRevertStatus(row.ClientId,row.HCAId,row.Month)
 }}>
                    <CornerUpLeft size={16} />
                    Revert
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}