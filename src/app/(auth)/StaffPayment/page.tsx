"use client";

import { LoadingData } from "@/Components/Loading/page";
import { getDaysBetween, GetEmail } from "@/Lib/Actions";
import axios from "axios";
import { CalendarDays, CheckCircle2, Clock, FileText, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
let cachedAttendeceInfo: any = null;
type AttendanceLocation = {
  Latitude: number;
  Longitude: number;
  Accuracy: number;
  CapturedAt: string;
} | null;

type Employee = {
  UserId: string;
  EmployeeName: string;
  Area: string;
  Latitude: number;
  Longitude: number;
};

type EmployeeBreak = {
  BreakNumber: number;
  StartTime?: string;
  EndTime?: string;
  DurationMinutes?: number;
};

type EmployeeAttendance = {
  Description: any;
  LeaveType: any;
  TotalLeaves: number;
  ToDate: any;
  FromDate: any;
  UserId: string;
  EmployeeName: string;
  Area: string;
  Status?: "Present" | "Absent" | "Leave";
  AttendanceDate: string;
  Location?: AttendanceLocation;
  ApprovalStatus?: "Approved" | "Pending" | "Rejected";
  CreatedAt?: string;

  CheckIn?: {
    Time?: string;
    Location?: AttendanceLocation;
  };

  CheckOut?: {
    Time?: string;
  };

  Breaks?: EmployeeBreak[];
  TotalBreakMinutes?: number;
  TotalWorkingMinutes?: number;
  AttendanceState?: string;
};



const staff = [
  {
    UserId: "f09aac13-8757-4e5c-9d25-a98630df4b68",
    EmployeeName: "Pandu",
  },
  {
    UserId: "010f2b83-5fee-4e18-accd-86fd3de35816",
    EmployeeName: "Srinivas",
  },
  {
    UserId: "a6543782-4248-466d-9e1f-624658988a5a",
    EmployeeName: "Chamanthi",
  },
];

function getLocalDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}




export default function ManagerAttendanceDashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFullMonth, setShowFullMonth] = useState(false);
  const [LoadingLeaves,setLoadingLeaves]=useState(false)
const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [leaveBalanceStaff, setLeaveBalanceStaff] = useState<any>(null);

  const [spentLeaves,setspentLeaves]=useState(0)
  const [OtherLeaves,setOtherLeaves]=useState(0)
  const [updatingLeaveBalance, setUpdatingLeaveBalance] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
const [monthlyAttendance, setMonthlyAttendance] = useState<any[]>([]);
const [loadingMonthlyAttendance, setLoadingMonthlyAttendance] = useState(false);
const [isEditingCasualLeaves, setIsEditingCasualLeaves] =
  useState(false);

const [isEditingSickLeaves, setIsEditingSickLeaves] =
  useState(false);
  const [SickLeaves,setSickLeaves]=useState<any>()
  
  const [CasualLeaves,setCasualLeaves]=useState<any>()
    const [leaveTotalInput, setLeaveTotalInput] = useState(Number(SickLeaves)+Number(CasualLeaves));
  const [updatingAction, setUpdatingAction] = useState<{
  userId: string;
  action: "Approve" | "Reject";
} | null>(null);
const [isEditingLeaveTotal, setIsEditingLeaveTotal] = useState(false);
  const [leaveDecisions, setLeaveDecisions] = useState<Record<string, "Approved" | "Rejected">>({});
  const [isChecking, setIsChecking] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [employeeRoster,setemployeeRoster]=useState<any[]>([])
  const SearchMonth = useSelector((state: any) => state.MonthFilterAdmin)
  const SearchYear = useSelector((state: any) => state.YearFilterAdmin)
const loggedInEmail=useSelector((state:any)=>state.LoggedInEmail)
  const selectedDateObj = new Date(`${selectedDate}T12:00:00`);
  const selectedMonth = selectedDateObj.getMonth();
  const selectedYear = selectedDateObj.getFullYear();
  const users=useSelector((state:any)=>state.AdminUsers)





const openFullMonthAttendance = async (employee: any) => {
  setSelectedStaff(employee);
  setShowFullMonth(true);
  setLoadingMonthlyAttendance(true);
  setMonthlyAttendance([]);
  const getMonthNumber = (monthName:any) => {
  const date = new Date(`${monthName} 1, 2026`);
  return date.getMonth() + 1;
};


  try {
    const response = await axios.post("/api/FullMonthStaffAttendance",  {
        UserId: employee.UserId,
        Month:`${SearchYear}-${getMonthNumber(SearchMonth)}`,
      });

    setMonthlyAttendance(
      response.data.AttendeceResuls ?? []
    );
  } catch (error) {
    console.error("Failed to load monthly attendance:", error);
  } finally {
    setLoadingMonthlyAttendance(false);
  }
};







 
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-4">
          <img
            src="/Icons/Curate-logoq.png"
            alt="Curate company logo"
            className="h-14 w-14 shrink-0 rounded-xl object-contain"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[2px] text-teal-600">
              CurateAIHealth
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-800">
              Staff Payment
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review staff attendance and monthly payment details.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
         >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
            <path d="M9 12h12" />
          </svg>
          Back
        </button>
      </header>

    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

 

  {/* Table */}
  <div className="w-full overflow-x-auto">
    <table className="w-full min-w-[1050px] border-collapse text-sm">

   <thead>
  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100">

    <th className="w-16 px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-600">
      Sno
    </th>

    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">
      Staff Information
    </th>

    <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-600">
      Attendance
    </th>

    <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-600">
      Payment
    </th>

    <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-600">
      TDS
    </th>

    <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-600">
      Advance
    </th>

    <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-600">
      Net Payable
    </th>

    <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-600">
      Action
    </th>

  </tr>
</thead>

      <tbody className="divide-y divide-slate-100">

        {staff.map((employee: any, index: number) => (
          <tr
            key={employee.UserId}
            className="group transition-colors duration-150 hover:bg-slate-50/80"
          >
            {/* Sno */}
            <td className="px-5 py-4 text-center">
              <span className="text-xs font-semibold tabular-nums text-slate-400">
                {String(index + 1).padStart(2, "0")}
              </span>
            </td>

            {/* Staff Name */}
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-sm font-bold text-indigo-700">
                  {employee.EmployeeName?.charAt(0)?.toUpperCase() || "S"}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800">
                    {employee.EmployeeName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Staff Member
                  </p>
                </div>
              </div>
            </td>

            {/* Attendance */}
            <td className="px-5 py-4 text-center">
              <button
                type="button"
                onClick={() => openFullMonthAttendance(employee)}
                className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition-all hover:border-teal-400 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01"
                  />
                </svg>
                Full Month
              </button>
            </td>

            {/* Payment */}
            <td className="px-5 py-4 text-right">
              <span className="font-semibold tabular-nums text-slate-700">
                ₹0.00
              </span>
            </td>

            {/* TDS */}
            <td className="px-5 py-4 text-right">
              <span className="tabular-nums text-slate-600">
                ₹0.00
              </span>
            </td>

            {/* Advance */}
            <td className="px-5 py-4 text-right">
              <span className="tabular-nums text-slate-600">
                ₹0.00
              </span>
            </td>

            {/* Net Payable */}
            <td className="px-5 py-4 text-right">
              <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-2 font-bold tabular-nums text-emerald-700">
                ₹0.00
              </span>
            </td>

            {/* Action */}
            <td className="px-5 py-4 text-center">
              <button
                type="button"
                onClick={() => openFullMonthAttendance(employee)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14m-7-7h14"
                  />
                </svg>
                Complete Payment
              </button>
            </td>
          </tr>
        ))}

        {staff.length === 0 && (
          <tr>
            <td colSpan={8} className="px-5 py-14 text-center">
              <div className="flex flex-col items-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <svg
                    className="h-6 w-6 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M16 18a4 4 0 00-8 0m12 0a4 4 0 00-3-3.87M7 14.13A4 4 0 004 18m8-7a3 3 0 100-6 3 3 0 000 6z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-slate-700">
                  No staff members found
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Staff records will appear here.
                </p>
              </div>
            </td>
          </tr>
        )}

      </tbody>
    </table>
  </div>

  {/* Footer */}
 

</div>
      {showFullMonth && selectedStaff && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 p-0 backdrop-blur-[2px] sm:p-3"
          onClick={() => setShowFullMonth(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="monthly-attendance-title"
            onClick={(e) => e.stopPropagation()}
      className="flex h-[90dvh] max-h-[850px] w-full max-w-[1200px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:h-auto sm:max-h-[85dvh] sm:rounded-[24px]"
          >
            {/* Header */}
            <div className="flex shrink-0 flex-col gap-3 px-4 pb-3 pt-4 sm:px-5 sm:pb-3 sm:pt-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[19px] bg-white shadow-lg sm:h-[64px] sm:w-[64px]">
                  <img
                    src="/Icons/Curate-logoq.png"
                    alt="Curate Logo"
                    className="h-12 w-12 object-contain"
                  />
                </div>
      
                <div className="min-w-0">
                  <p className="mb-1 truncate text-[11px] font-bold uppercase tracking-[2.5px] text-pink-500 sm:text-xs sm:tracking-[3px]">
                    {selectedStaff.EmployeeName}
                  </p>
      
                  <h2
                    id="monthly-attendance-title"
                    className="text-xl font-extrabold leading-tight tracking-tight text-slate-800 sm:text-2xl"
                  >
                    Attendance Dashboard
                  </h2>
      
                  <p className="mt-1 text-sm font-medium text-slate-400">
                    {new Date(
                      selectedYear,
                      selectedMonth,
                      1
                    ).toLocaleString("en-IN", {
                      month: "long",
                    })}{" "}
                    {selectedYear}
                  </p>
                </div>
              </div>
      
              {/* Month, Year and Actions */}
              <div className="flex w-full items-center gap-2 sm:gap-3 lg:w-auto">
                 {/* <select
                  value={selectedMonth}
                  onChange={(e) => {
                    const month = Number(e.target.value);
      
                    setSelectedDate(
                      `${selectedYear}-${String(month + 1).padStart(2, "0")}-01`
                    );
                  }}
                  aria-label="Attendance month"
                  className="h-11 min-w-0 flex-1 cursor-pointer rounded-[14px] border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-400 focus:border-emerald-500 sm:min-w-[145px] sm:flex-none sm:px-4"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(2026, i, 1).toLocaleString("en-IN", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select> 
      
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    const year = Number(e.target.value);
      
                    setSelectedDate(
                      `${year}-${String(selectedMonth + 1).padStart(2, "0")}-01`
                    );
                  }}
                  aria-label="Attendance year"
                  className="h-11 min-w-0 flex-1 cursor-pointer rounded-[14px] border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-400 focus:border-emerald-500 sm:min-w-[110px] sm:flex-none sm:px-4"
                >
                  {Array.from(
                    { length: 7 },
                    (_, i) => new Date().getFullYear() - 5 + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select> */}
      
                <button
                  type="button"
                  title="Expand dashboard"
                  aria-label="Expand dashboard"
                  onClick={(e) => {
                    const dialog = e.currentTarget.closest(
                      '[role="dialog"]'
                    );
      
                    if (dialog) {
                      dialog.classList.toggle("sm:max-w-[1600px]");
                      dialog.classList.toggle("sm:max-w-none");
                      dialog.classList.toggle("sm:h-auto");
                      dialog.classList.toggle("sm:h-[98dvh]");
                    }
                  }}
                  className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 sm:h-11 sm:w-11"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6" />
                    <path d="m21 3-7 7" />
                    <path d="M9 21H3v-6" />
                    <path d="m3 21 7-7" />
                  </svg>
                </button>
        <button
                  type="button"
                  onClick={() => setShowFullMonth(false)}
                  aria-label="Close dashboard"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 "
                >
                  ✕
                </button>
                
              </div>
            </div>
      
            {/* Calendar */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-5 sm:pb-4">
              {loadingMonthlyAttendance ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
                    <p className="text-sm text-slate-500">
                      Loading full month attendance...
                    </p>
                  </div>
                </div>
              ) : (
                (() => {
                  const daysInMonth = new Date(
                    selectedYear,
                    selectedMonth + 1,
                    0
                  ).getDate();
      
                  const getDayStatus = (day: number) => {
                    const date = `${selectedYear}-${String(
                      selectedMonth + 1
                    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      
                    const records = monthlyAttendance.filter((record) => {
                      if (
                        String(record.UserId) !==
                        String(selectedStaff.UserId)
                      ) {
                        return false;
                      }
      
                      const from = String(
                        record.FromDate || record.AttendanceDate || ""
                      ).slice(0, 10);
      
                      const to = String(
                        record.ToDate || record.AttendanceDate || from
                      ).slice(0, 10);
      
                      if (record.Status === "Leave") {
                        return (
                          record.ApprovalStatus === "Approved" &&
                          date >= from &&
                          date <= to
                        );
                      }
      
                      return (
                        String(record.AttendanceDate || "").slice(0, 10) ===
                        date
                      );
                    });
      
                    const attendance = records.find(
                      (record) => record.Status !== "Leave"
                    );
      
                    const leave = records.find(
                      (record) => record.Status === "Leave"
                    );
      
                    if (attendance?.Status === "Present") {
                      return {
                        label: "P",
                        status: "Present",
                        circle: "border-emerald-500 text-emerald-600",
                      };
                    }
      
                    if (attendance?.Status === "Absent") {
                      return {
                        label: "A",
                        status: "Absent",
                        circle: "border-rose-500 text-rose-600",
                      };
                    }
      
                    if (leave) {
                      return {
                        label: "L",
                        status: "Leave",
                        circle: "border-amber-500 text-amber-600",
                      };
                    }
      
                    return {
                      label: "—",
                      status: "Not Marked",
                      circle: "border-slate-300 text-slate-400",
                    };
                  };
      
                  const dayCounts = Array.from(
                    { length: daysInMonth },
                    (_, index) => getDayStatus(index + 1).status
                  ).reduce(
                    (counts, status) => {
                      counts[status] += 1;
                      return counts;
                    },
                    { Present: 0, Absent: 0, Leave: 0, "Not Marked": 0 } as Record<string, number>
                  );
      
                  return (
                    <>
                      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                          { label: "Present Days", count: dayCounts.Present, style: "border-emerald-100 bg-emerald-50 text-emerald-700" },
                          { label: "Absent Days", count: dayCounts.Absent, style: "border-rose-100 bg-rose-50 text-rose-700" },
                          { label: "Leave Days", count: dayCounts.Leave, style: "border-amber-100 bg-amber-50 text-amber-700" },
                          { label: "Not Marked", count: dayCounts["Not Marked"], style: "border-slate-200 bg-slate-50 text-slate-600" },
                        ].map((item) => (
                          <div key={item.label}className={`rounded-xl border p-2 text-center ${item.style}`}>
                            <p className="text-xs font-medium">{item.label}</p>
                          <p className="mt-1 text-xl font-bold">{item.count}</p>
                          </div>
                        ))}
                      </div>
      
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
                      {Array.from(
                        { length: daysInMonth },
                        (_, i) => {
                          const day = i + 1;
                          const status = getDayStatus(day);
                          const isNotMarked =
                            status.status === "Not Marked";
      
                          return (
                            <div
                              key={day}
                             className="flex min-h-[95px] min-w-0 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-1.5 py-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.12)] transition-shadow hover:shadow-md sm:min-h-[100px] sm:px-2"
                            >
                              <p className="text-[10px] font-semibold uppercase leading-4 text-slate-500 sm:text-[11px]">
                                DAY {day}
                              </p>
      
                              {isNotMarked ? (
                                <span className="mt-4 max-w-full rounded-md bg-slate-300 px-2.5 py-1 text-center text-[9px] font-semibold leading-3 text-slate-600 sm:text-[10px]">
                                  Not Marked
                                </span>
                              ) : (
                                <div
                                  title={status.status}
                                  className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-white text-sm font-semibold ${status.circle}`}
                                >
                                  {status.label}
                                </div>
                              )}
      
                              
            
      
                              {/* <button
                                type="button"
                                disabled={isNotMarked}
                                onClick={() => {
                                  // Connect your existing day-edit handler here.
                                }}
                                className={`mt-0.5 rounded-full px-2.5 py-[3px] text-[9px] font-semibold leading-3 transition ${
                                  isNotMarked
                                    ? "cursor-not-allowed bg-slate-100 text-slate-300"
                                    : "bg-slate-700 text-white hover:bg-emerald-600"
                                }`}
                              >
                                Edit
                              </button> */}
                            </div>
                          );
                        }
                      )}
                    </div>
                    </>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}

    </div>


  );
}
