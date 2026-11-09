
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  MinusCircle,
  ClipboardEdit,
  X,
  Coffee,
  LogIn,
  LogOut,
  Play,
  Clock,
  RefreshCw,
  MapPin,
  Info
} from "lucide-react";

import axios from "axios";
import { useSelector } from "react-redux";

import {
  PostEmployeeAttendance,
  StartEmployeeBreak,
  EndEmployeeBreak,
  CheckoutEmployee,
  GetTodayAttendance
} from "@/Lib/user.action";
type AttendanceLocation = {
  Latitude: number;
  Longitude: number;
  Accuracy: number;
  CapturedAt: string;
} | null;
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
  CheckoutAt?: string;
  
};
interface AttendanceProps {
  userId: any;
  userName: string;
  onSubmit: (data: any) => void;
  onClose?: () => void;
}
function getLocalDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function getCoordinates(location?: AttendanceLocation) {
  if (!location) return null;
  const latitude = Number(location.Latitude);
  const longitude = Number(location.Longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  return { latitude, longitude };
}
const getToday = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata"
  }).format(new Date());
};

const formatTime = (date: any) => {
  if (!date) return "--";

  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata"
  });
};

const formatDuration = (minutes = 0) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours}h ${mins}m`;
};
const getAttendanceBreakMinutes = (record: any) => {
  if (record?.TotalBreakMinutes != null) {
    return Number(record.TotalBreakMinutes) || 0;
  }

  return (record?.Breaks ?? []).reduce(
    (total: number, item: any) => {
      if (item.DurationMinutes != null) {
        return total + Number(item.DurationMinutes);
      }

      if (item.StartTime) {
        const start = new Date(item.StartTime).getTime();
        const end = item.EndTime
          ? new Date(item.EndTime).getTime()
          : Date.now();

        if (Number.isFinite(start) && end > start) {
          return total + Math.floor((end - start) / 60000);
        }
      }

      return total;
    },
    0
  );
};

const getAttendanceWorkingMinutes = (record: any) => {
  const recordedMinutes = Number(record?.TotalWorkingMinutes ?? 0);

  if (record?.AttendanceState === "Working" ||
      record?.AttendanceState === "OnBreak") {

    const checkIn = new Date(record?.CheckIn?.Time).getTime();

    if (!Number.isFinite(checkIn)) return recordedMinutes;

    const elapsed = Math.max(
      0,
      Math.floor((Date.now() - checkIn) / 60000)
    );

    return Math.max(
      0,
      elapsed - getAttendanceBreakMinutes(record)
    );
  }

  return recordedMinutes;
};
export default function MarkAttendance({
  userId,
  userName,
  onSubmit,
  onClose
}: AttendanceProps) {

  const SearchMonth = useSelector(
    (state: any) => state.FilterMonth
  );

  const SearchYear = useSelector(
    (state: any) => state.FilterYear
  );

  const loggedInEmail = useSelector(
    (state: any) => state.LoggedInEmail
  );

  const [attendance, setAttendance] = useState<any>({
    userId,
    userName,
    status: "",
    date: getToday(),
    fromDate: "",
    toDate: "",
    Month: `${SearchYear}-${SearchMonth}`
  });

  const [leaveType, setLeaveType] = useState("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveDescription, setLeaveDescription] = useState("");
const [selectedStaff, setSelectedStaff] = useState<any>(null);
const [monthlyAttendance, setMonthlyAttendance] = useState<any[]>([]);
  const [showFullMonth, setShowFullMonth] = useState(false);
  const [loadingMonthlyAttendance, setLoadingMonthlyAttendance] = useState(false);
  const [SickLeaves, setSickLeaves] = useState(0);
  const [CasualLeaves, setCasualLeaves] = useState(0);
  const [OtherLeaves, setOtherLeaves] = useState(0);
  const [usedLeaves, setUsedLeaves] = useState(0);

  const [LoadingLeaves, setLoadingLeaves] = useState(false);
  const [loading, setLoading] = useState(false);
const [attendanceInfoStaff, setAttendanceInfoStaff] =
  useState<any>(null);
  const [statusMessage, setStatusMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState(getLocalDate());
   const selectedDateObj = new Date(`${selectedDate}T12:00:00`);
const selectedMonth = selectedDateObj.getMonth();
  const selectedYear = selectedDateObj.getFullYear();
  const [todayAttendance, setTodayAttendance] =
    useState<any>(null);

  const [loadingAttendance, setLoadingAttendance] =
    useState(true);

  const isLeave = attendance.status === "Leave";

  const totalLeaves = SickLeaves + CasualLeaves;

  const remainingLeaves = totalLeaves;

  const calculateLeaveDays = (
    fromDate: string,
    toDate: string
  ) => {
    if (!fromDate || !toDate) return 0;

    const start = new Date(`${fromDate}T00:00:00`);
    const end = new Date(`${toDate}T00:00:00`);

    return Math.floor(
      (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24)
    ) + 1;
  };

  const totalDays = calculateLeaveDays(
    attendance.fromDate,
    attendance.toDate
  );
const handleOpenLeaveForm = async () => {
  setLeaveType("");
  setLeaveDescription("");

  setAttendance((prev: any) => ({
    ...prev,
    status: "Leave",
    fromDate: getToday(),
    toDate: getToday(),
  }));

  setShowLeaveModal(true);
  await updateLeave("Leave");
};
  // FETCH TODAY'S ATTENDANCE
  const refreshAttendance = useCallback(async () => {
    try {
      setLoadingAttendance(true);

      const result = await GetTodayAttendance(userId);

      if (result?.success) {
        setTodayAttendance(result.data);
      }

    } catch (error) {
      console.error("Attendance refresh:", error);
    } finally {
      setLoadingAttendance(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshAttendance();
  }, [refreshAttendance]);
const openFullMonthAttendance = async (employee: any) => {
  
  setSelectedStaff(employee);
  setShowFullMonth(true);
  setLoadingMonthlyAttendance(true);
  setMonthlyAttendance([]);

  try {
    const response = await axios.post("/api/FullMonthStaffAttendance",  {
        UserId: employee.UserId,
        Month: employee.Month,
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

  const openLocation = (employee: EmployeeAttendance) => {
    const coordinates = getCoordinates(employee.Location);
    if (!coordinates) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`, "_blank", "noopener,noreferrer");
  };
  // GET EMPLOYEE GPS LOCATION
  const getEmployeeLocation = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error("Geolocation is not supported.")
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(
                new Error("Please allow location access.")
              );
              break;

            case error.POSITION_UNAVAILABLE:
              reject(
                new Error("Your location is unavailable.")
              );
              break;

            case error.TIMEOUT:
              reject(
                new Error("Location request timed out.")
              );
              break;

            default:
              reject(
                new Error("Unable to get your location.")
              );
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  };

  // LOAD LEAVE INFORMATION
  const updateLeave = async (value: string) => {
    try {
      setLoadingLeaves(true);

      const response = await axios.get(
        "/api/leavesinfo",
        {
          params: { userId },
          timeout: 15000
        }
      );

      const data = response?.data?.GetData;

      if (!data) {
        throw new Error("Leave information not found.");
      }

      setSickLeaves(Number(data.sick ?? 0));
      setCasualLeaves(Number(data.Casual ?? 0));
      setOtherLeaves(Number(data.OtherLeaves ?? 0));
      setUsedLeaves(Number(data.usedLeaves ?? 0));

      setAttendance((prev: any) => ({
        ...prev,
        status: value
      }));

    } catch (error: any) {
      setStatusMessage(
        error?.message || "Unable to load leave information."
      );
    } finally {
      setLoadingLeaves(false);
    }
  };

  // MARK ATTENDANCE
  const UpdateDailyAttendance = async () => {

    if (isLeave && !leaveType) {
      setStatusMessage("Please select a leave type.");
      return;
    }

    if (
      isLeave &&
      (!attendance.fromDate || !attendance.toDate)
    ) {
      setStatusMessage("Please select leave dates.");
      return;
    }

    if (
      isLeave &&
      attendance.toDate < attendance.fromDate
    ) {
      setStatusMessage("Invalid leave date range.");
      return;
    }

    if (
      isLeave &&
      leaveType === "Casual" &&
      totalDays > 1
    ) {
      setStatusMessage(
        "Casual leave can only be taken for one day."
      );
      return;
    }

    if (
      isLeave &&
      leaveType === "Other" &&
      !leaveDescription.trim()
    ) {
      setStatusMessage("Please enter leave description.");
      return;
    }

    setLoading(true);
    setStatusMessage("Please wait...");

    try {

      let payload: any = {
        ...attendance,
        ...(isLeave
          ? {
              leaveType,
              leaveDescription:
                leaveType === "Other"
                  ? leaveDescription
                  : ""
            }
          : {})
      };

      // GPS ONLY FOR CHECK-IN / NORMAL ATTENDANCE
      if (attendance.status === "Present") {

        if (attendance.date !== getToday()) {
          throw new Error(
            "Present attendance must be marked for today."
          );
        }

        const location =
          loggedInEmail === "srinivasnew0803@gmail.com"
            ? {
                latitude: 17.5186369,
                longitude: 78.3962529,
                accuracy: 50
              }
            : await getEmployeeLocation();

        payload = {
          ...payload,
          location,
          City: "Telangana" 
        };
      }

      const result = await PostEmployeeAttendance(payload);

      if (!result?.success) {
        throw new Error(
          result?.message || "Attendance submission failed."
        );
      }

      setStatusMessage(
        result?.message || "Attendance marked successfully."
      );

  

      if (attendance.status === "Present") {
        await refreshAttendance();
      } else {

        // Preserve your existing leave notification workflow.
        if (isLeave) {
          await axios.post("/api/MailSend", {
            to: "tsiddu805@gmail.com",
            subject: "Leave Request Submitted – Approval Required",
            html: `
              <h2>New Leave Request</h2>
              <p>Employee: ${userName}</p>
              <p>Leave Type: ${leaveType}</p>
              <p>From: ${attendance.fromDate}</p>
              <p>To: ${attendance.toDate}</p>
              <p>Total Days: ${totalDays}</p>
              <p>Description: ${leaveDescription || "N/A"}</p>
            `
          });
        }

        setTimeout(() => onClose?.(), 1500);
      }

    } catch (error: any) {

      setStatusMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  };

  // START BREAK
  const handleStartBreak = async () => {
    try {
      setLoading(true);
      setStatusMessage("Starting break...");

      const result = await StartEmployeeBreak(userId);

      if (!result.success) {
        throw new Error(result.message);
      }

      setStatusMessage(result.message);

      await refreshAttendance();

    } catch (error: any) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // RESUME WORK
  const handleEndBreak = async () => {
    try {
      setLoading(true);
      setStatusMessage("Resuming work...");

      const result = await EndEmployeeBreak(userId);

      if (!result.success) {
        throw new Error(result.message);
      }

      setStatusMessage(result.message);

      await refreshAttendance();

    } catch (error: any) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // CHECK OUT
  const handleCheckout = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to check out for today?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setStatusMessage("Checking out...");

      const result = await CheckoutEmployee(userId);

      if (!result.success) {
        throw new Error(result.message);
      }

      setStatusMessage(result.message);

      await refreshAttendance();

    } catch (error: any) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const state = todayAttendance?.AttendanceState;
  const isOnApprovedLeave =
  todayAttendance?.Status === "Leave" &&
  todayAttendance?.ApprovalStatus === "Approved";

  const breaks = todayAttendance?.Breaks ?? [];

  const checkInTime = todayAttendance?.CheckIn?.Time;

  const checkOutTime = todayAttendance?.CheckOut?.Time;

  const totalBreakMinutes =
    todayAttendance?.TotalBreakMinutes ?? 0;

  const totalWorkingMinutes =
    todayAttendance?.TotalWorkingMinutes ?? 0;

  const isCheckedIn =
  !!todayAttendance &&
  todayAttendance?.Status !== "Leave";
const employee = {
  UserId: userId,
  EmployeeName: userName,
  Month: `${SearchYear}-${SearchMonth}`,
  // Initialize other properties as needed
};
  return (
    <div className="relative w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border overflow-hidden">
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
           <select
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
          </select>

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
const getDayAttendanceRecord = (day: number) => {
  const date = `${selectedYear}-${String(
    selectedMonth + 1
  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return monthlyAttendance.find((record) => {
    if (
      String(record.UserId) !== String(selectedStaff.UserId)
    ) {
      return false;
    }

    if (record.Status === "Leave") return false;

    return (
      String(record.AttendanceDate || "").slice(0, 10) === date
    );
  });
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
            const monthlyWorkingMinutes = monthlyAttendance.reduce(
              (total, record) => {
                if (
                  String(record.UserId) !== String(selectedStaff.UserId) ||
                  record.Status === "Leave"
                ) {
                  return total;
                }

                return total + getAttendanceWorkingMinutes(record);
              },
              0
            );

            return (
              <>
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {[
                    { label: "Present Days", value: dayCounts.Present, style: "border-emerald-100 bg-emerald-50 text-emerald-700" },
                    { label: "Absent Days", value: dayCounts.Absent, style: "border-rose-100 bg-rose-50 text-rose-700" },
                    { label: "Leave Days", value: dayCounts.Leave, style: "border-amber-100 bg-amber-50 text-amber-700" },
                    { label: "Not Marked", value: dayCounts["Not Marked"], style: "border-slate-200 bg-slate-50 text-slate-600" },
                    { label: "Total Working Hours", value: formatDuration(monthlyWorkingMinutes), style: "border-indigo-100 bg-indigo-50 text-indigo-700" },
                  ].map((item) => (
                    <div key={item.label}className={`rounded-xl border p-2 text-center ${item.style}`}>
                      <p className="text-xs font-medium">{item.label}</p>
                    <p className="mt-1 text-xl font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>
{attendanceInfoStaff && (() => {
  const record = attendanceInfoStaff;

  const breaks = Array.isArray(record.Breaks)
    ? record.Breaks
    : [];

  const workingMinutes = getAttendanceWorkingMinutes(record);
  const breakMinutes = getAttendanceBreakMinutes(record);

  const isWorking = record.AttendanceState === "Working";
  const isOnBreak = record.AttendanceState === "OnBreak";

  const formatAttendanceDuration = (minutes: number) => {
    const safeMinutes = Math.max(0, Math.floor(minutes || 0));

    return `${Math.floor(safeMinutes / 60)}h ${safeMinutes % 60}m`;
  };

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm"
      onClick={() => setAttendanceInfoStaff(null)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Attendance information"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >

        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#087F8C] to-[#075985] px-5 py-5 text-white">

          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative flex items-center justify-between">

            <div>
              <div className="flex items-center gap-2">
                <Clock size={20} />

                <h3 className="text-lg font-bold">
                  Attendance Details
                </h3>
              </div>

              <p className="mt-1 text-sm text-white/80">
                {record.EmployeeName || userName}
              </p>

              <p className="mt-1 text-xs text-white/70">
                {new Date(
                  `${record.DisplayDate}T12:00:00`
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAttendanceInfoStaff(null)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-white/15"
            >
              ×
            </button>

          </div>
        </div>

        {/* BODY */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">

          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Clock size={17} />
                <span className="text-xs font-semibold">
                  Working Hours
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-indigo-800">
                {formatAttendanceDuration(workingMinutes)}
              </p>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-amber-600">
                <Coffee size={17} />
                <span className="text-xs font-semibold">
                  Total Breaks
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-amber-800">
                {formatAttendanceDuration(breakMinutes)}
              </p>

              <p className="mt-1 text-xs text-amber-700">
                {breaks.length} break{breaks.length !== 1 ? "s" : ""}
              </p>
            </div>

          </div>

          {/* STATUS */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">

            <div>
              <p className="text-xs text-slate-500">
                Attendance Status
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {record.Status || "Present"}
              </p>
            </div>

            <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              isWorking
                ? "bg-emerald-100 text-emerald-700"
                : isOnBreak
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-700"
            }`}>
              {isWorking
                ? "Currently Working"
                : isOnBreak
                ? "On Break"
                : "Completed"}
            </span>

          </div>

          {/* CHECK IN / OUT */}
          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-800">
              Attendance Timeline
            </h4>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                <LogIn size={17} className="mb-2 text-emerald-600" />

                <p className="text-xs text-slate-500">
                  Check In
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {formatTime(record.CheckIn?.Time)}
                </p>
              </div>

              <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-3">
                <LogOut size={17} className="mb-2 text-rose-600" />

                <p className="text-xs text-slate-500">
                  Check Out
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {record.CheckOut?.Time
                    ? formatTime(record.CheckOut.Time)
                    : "Not checked out"}
                </p>
              </div>

            </div>
          </div>

          {/* BREAK HISTORY */}
          <div className="rounded-xl border border-slate-200 p-4">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-2">
                <Coffee size={17} className="text-amber-600" />

                <h4 className="text-sm font-bold text-slate-800">
                  Break Information
                </h4>
              </div>

              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                {breaks.length} Breaks
              </span>

            </div>

            {breaks.length > 0 ? (

              <div className="space-y-3">

                {breaks.map((item: any, index: number) => (

                  <div
                    key={item.BreakNumber ?? index}
                    className="rounded-xl border border-amber-100 bg-amber-50/40 p-3"
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <p className="text-sm font-bold text-slate-800">
                        Break {item.BreakNumber ?? index + 1}
                      </p>

                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-700">
                        {item.EndTime
                          ? formatAttendanceDuration(
                              Number(item.DurationMinutes) ||
                              getAttendanceBreakMinutes({
                                Breaks: [item],
                              })
                            )
                          : "Ongoing"}
                      </span>

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <div>
                        <p className="text-[11px] text-slate-400">
                          Started At
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatTime(item.StartTime)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400">
                          Ended At
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {item.EndTime
                            ? formatTime(item.EndTime)
                            : "In Progress"}
                        </p>
                      </div>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="rounded-lg bg-slate-50 py-5 text-center">
                <Coffee className="mx-auto h-6 w-6 text-slate-300" />

                <p className="mt-2 text-xs text-slate-500">
                  No breaks taken
                </p>
              </div>

            )}

            <div className="mt-4 flex justify-between border-t border-slate-100 pt-3">
              <span className="text-xs font-semibold text-slate-500">
                Total Break Duration
              </span>

              <span className="text-sm font-bold text-amber-700">
                {formatAttendanceDuration(breakMinutes)}
              </span>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50 p-4">
          <button
            type="button"
            onClick={() => setAttendanceInfoStaff(null)}
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
})()}
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
  onClick={() => openLocation(selectedStaff)}
  disabled={isNotMarked}
  title="View attendance location"
  aria-label={`View location for day ${day}`}
  className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full transition hover:bg-red-50 ${
    isNotMarked
      ? "cursor-not-allowed opacity-40"
      : "cursor-pointer"
  }`}
>
  <MapPin className="h-4 w-4 text-red-500" />
</button> */}
  <button
    type="button"
    disabled={!getDayAttendanceRecord(day)}
    onClick={() => {
      const record = getDayAttendanceRecord(day);

      if (!record) return;

      setAttendanceInfoStaff({
        ...record,
        DisplayDate: `${selectedYear}-${String(
          selectedMonth + 1
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      });
    }}
    title="View attendance information"
    aria-label={`View attendance information for day ${day}`}
    className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-blue-50 disabled:opacity-30"
  >
    <Info className="h-4 w-4 text-blue-500" />
  </button>
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
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#00A9A5] to-[#005f61]">

        <div className="flex items-center gap-3">

          <img
            src="/Icons/Curate-logoq.png"
            alt="Curate Health"
            className="h-9 w-9 bg-white rounded-full p-1"
          />

          <div className="text-white">
            <h2 className="text-lg font-bold">
              Attendance
            </h2>

            <p className="text-xs opacity-90">
              {userName}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="px-6 py-6 space-y-6">

   

        {/* TODAY'S ATTENDANCE */}
        {loadingAttendance ? (

          <div className="flex justify-center py-5">
            <RefreshCw className="animate-spin text-teal-600" />
          </div>

        ) :isOnApprovedLeave ? (
<div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5">

  <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-amber-100/60" />

  <div className="relative">

    <div className="flex items-center justify-between gap-3">

      <div className="flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
          <ClipboardEdit className="h-6 w-6 text-amber-600" />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-amber-900">
            On Leave Today
          </h3>

          <p className="text-xs text-amber-700">
            Approved leave request
          </p>
        </div>

      </div>

      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
        Approved
      </span>

    </div>

    <div className="mt-5 grid grid-cols-2 gap-3">

      <div className="rounded-xl border border-amber-100 bg-white/80 p-3">
        <p className="text-xs text-gray-500">From Date</p>
        <p className="mt-1 text-sm font-bold text-gray-800">
          {todayAttendance?.FromDate}
        </p>
      </div>

      <div className="rounded-xl border border-amber-100 bg-white/80 p-3">
        <p className="text-xs text-gray-500">To Date</p>
        <p className="mt-1 text-sm font-bold text-gray-800">
          {todayAttendance?.ToDate}
        </p>
      </div>

    </div>

    <div className="mt-3 rounded-xl border border-amber-100 bg-white/80 p-3">

      <p className="text-xs text-gray-500">Leave Type</p>

      <p className="mt-1 text-sm font-bold text-gray-800">
        {todayAttendance?.leaveType || todayAttendance?.LeaveType || "Leave"}
      </p>

      <p className="mt-3 text-xs text-gray-500">
        Reason
      </p>

      <p className="mt-1 text-sm font-medium text-gray-700">
        {todayAttendance?.Description ||
          todayAttendance?.leaveDescription ||
          "No description provided"}
      </p>

    </div>

    <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-700">
      <CheckCircle size={18} />
      Your leave has been approved. Enjoy your day!
    </div>

  </div>

</div>
): isCheckedIn ? (

          <div className="border rounded-2xl p-4 space-y-4">

            
<div className="space-y-3">

  {/* HEADER */}
  <div className="flex items-center justify-between gap-3">

    <h3 className="font-bold text-gray-800 text-base">
      Today's Attendance
    </h3>

    <span
      className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
        state === "Working"
          ? "bg-green-100 text-green-700"
          : state === "OnBreak"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {state}
    </span>

  </div>

  {/* MONTH ATTENDANCE BUTTON */}
  <button
    type="button"
     onClick={() => openFullMonthAttendance(employee)}
    className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#00A9A5] px-4 py-2.5 text-sm font-bold text-[#005f61] hover:bg-[#00A9A5]/10 transition-colors"
  >
    View Full Month Attendance
  </button>

</div>


            <div className="grid grid-cols-2 gap-3">

              <div className="bg-gray-50 p-3 rounded-xl">
                <LogIn className="text-green-600 mb-2" size={20}/>
                <p className="text-xs text-gray-500">Check In</p>
                <p className="font-bold">
                  {formatTime(checkInTime)}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl">
                <Coffee className="text-yellow-600 mb-2" size={20}/>
                <p className="text-xs text-gray-500">Total Break</p>
                <p className="font-bold">
                  {formatDuration(totalBreakMinutes)}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl">
                <Clock className="text-teal-600 mb-2" size={20}/>
                <p className="text-xs text-gray-500">
                  Working Time
                </p>
                <p className="font-bold">
                  {state === "CheckedOut"
                    ? formatDuration(totalWorkingMinutes)
                    : "Calculated at checkout"}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl">
                <LogOut className="text-red-500 mb-2" size={20}/>
                <p className="text-xs text-gray-500">
                  Check Out
                </p>
                <p className="font-bold">
                  {formatTime(checkOutTime)}
                </p>
              </div>

            </div>

            {/* BREAK HISTORY */}
            {breaks.length > 0 && (
              <div className="space-y-2">

                <h4 className="text-sm font-bold text-gray-700">
                  Break History
                </h4>

                {breaks.map((item: any, index: number) => (

                  <div
                    key={index}
                    className="flex justify-between items-center bg-yellow-50 rounded-lg px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-semibold">
                        Break {item.BreakNumber}
                      </p>

                      <p className="text-xs text-gray-500">
                        {formatTime(item.StartTime)} -{" "}
                        {item.EndTime
                          ? formatTime(item.EndTime)
                          : "In Progress"}
                      </p>
                    </div>

                    <span className="font-semibold text-gray-700">
                      {item.EndTime
                        ? formatDuration(item.DurationMinutes)
                        : "Active"}
                    </span>

                  </div>
                ))}

              </div>
            )}

            {/* ACTION BUTTONS */}
            {state === "Working" && (

              <div className="grid grid-cols-2 gap-3">

                <button
                  disabled={loading}
                  onClick={handleStartBreak}
                  className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white py-3 font-bold disabled:opacity-50"
                >
                  <Coffee size={18}/>
                  Start Break
                </button>

                <button
                  disabled={loading}
                  onClick={handleCheckout}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white py-3 font-bold disabled:opacity-50"
                >
                  <LogOut size={18}/>
                  Check Out
                </button>

              </div>
            )}

            {state === "OnBreak" && (

              <button
                disabled={loading}
                onClick={handleEndBreak}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white py-3 font-bold disabled:opacity-50"
              >
                <Play size={18}/>
                Resume Work
              </button>
            )}

            {state === "CheckedOut" && (

              <div className="bg-green-50 text-green-700 rounded-xl p-3 text-center font-semibold">
                <CheckCircle className="inline mr-2" size={18}/>
                Attendance completed for today.
              </div>
            )}

          </div>

        ) : (

          <>
            {/* ATTENDANCE STATUS */}
            <div>

<div className="flex items-center justify-between gap-3 mb-3">

  <label className="text-xs font-semibold text-gray-500 uppercase">
    Attendance Status
  </label>

  <button
    type="button"
onClick={() => openFullMonthAttendance(employee)}
    className="shrink-0 rounded-lg border border-[#00A9A5] px-3 py-2 text-xs font-bold text-[#005f61] hover:bg-[#00A9A5]/10 transition-colors"
  >
    View Full Month Attendance
  </button>

</div>

              

              <div className="grid grid-cols-2 gap-3">

                {[
                  {
                    label: "Present",
                    value: "Present",
                    icon: CheckCircle
                  },
                  {
                    label: "Absent",
                    value: "Absent",
                    icon: XCircle
                  },
                  {
                    label: "Half Day",
                    value: "Half Day",
                    icon: MinusCircle
                  },
                  {
                    label: "Leave",
                    value: "Leave",
                    icon: ClipboardEdit
                  }
                ].map((item) => {

                  const active =
                    attendance.status === item.value;

                  return (

                    <button
                      key={item.value}
                      disabled={loading}
                      onClick={() => {

                        if (item.value === "Leave") {
                          updateLeave(item.value);
                        } else {
                          setAttendance({
                            ...attendance,
                            status: item.value
                          });
                        }

                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold ${
                        active
                          ? "bg-[#00A9A5]/10 border-[#00A9A5] text-[#005f61]"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <item.icon size={18}/>
                      {item.label}
                    </button>

                  );
                })}

              </div>

            </div>

            {/* DATE */}
            {!isLeave ? (

              <div>

                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Date
                </label>

                <input
                  type="date"
                  value={attendance.date}
                  max={getToday()}
                  onChange={(e) =>
                    setAttendance({
                      ...attendance,
                      date: e.target.value
                    })
                  }
                  className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
                />

              </div>

            ) : (

              <div className="space-y-4">

                {/* LEAVE BALANCE */}
                <div className="rounded-xl bg-teal-50 p-3">

                  {LoadingLeaves ? (
                    <p className="text-sm text-gray-500">
                      Loading leave information...
                    </p>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Total Leaves</span>
                        <strong>
                          {totalLeaves + usedLeaves}
                        </strong>
                      </div>

                      <div className="flex justify-between text-sm mt-1">
                        <span>Remaining</span>
                        <strong>{remainingLeaves}</strong>
                      </div>

                      <div className="flex gap-2 mt-3 flex-wrap text-xs">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Casual: {CasualLeaves}
                        </span>

                        <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded">
                          Sick: {SickLeaves}
                        </span>

                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                          Other: {OtherLeaves}
                        </span>
                      </div>
                    </>
                  )}

                </div>

                {/* LEAVE TYPE */}
                <div>

                  <label className="text-xs font-semibold text-gray-500">
                    Leave Type
                  </label>

                  <select
                    value={leaveType}
                    onChange={(e) => {
                      setLeaveType(e.target.value);

                      if (e.target.value !== "Other") {
                        setLeaveDescription("");
                      }
                    }}
                    className="mt-1 w-full rounded-xl border px-4 py-3"
                  >
                    <option value="">Choose leave type</option>
                    <option value="Casual">Casual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Other">Other</option>
                  </select>

                </div>

                {leaveType === "Other" && (

                  <textarea
                    value={leaveDescription}
                    onChange={(e) =>
                      setLeaveDescription(e.target.value)
                    }
                    placeholder="Describe your leave reason"
                    rows={3}
                    className="w-full rounded-xl border p-3"
                  />

                )}

                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="text-xs font-semibold text-gray-500">
                      From Date
                    </label>

                    <input
                      type="date"
                      value={attendance.fromDate}
                      onChange={(e) =>
                        setAttendance({
                          ...attendance,
                          fromDate: e.target.value
                        })
                      }
                      className="mt-1 w-full rounded-xl border px-3 py-3"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500">
                      To Date
                    </label>

                    <input
                      type="date"
                      value={attendance.toDate}
                      min={attendance.fromDate || undefined}
                      onChange={(e) =>
                        setAttendance({
                          ...attendance,
                          toDate: e.target.value
                        })
                      }
                      className="mt-1 w-full rounded-xl border px-3 py-3"
                    />
                  </div>

                </div>

                <p className="text-sm text-teal-700 font-semibold">
                  Total Leave Days: {totalDays || 0}
                </p>

                {leaveType === "Casual" && totalDays > 1 && (
                  <p className="text-sm text-red-600">
                    Casual leave can only be taken for one day.
                  </p>
                )}

              </div>

            )}

            {/* SUBMIT */}
            <button
              disabled={
                loading ||
                !attendance.status ||
                (isLeave && (
                  !leaveType ||
                  !attendance.fromDate ||
                  !attendance.toDate ||
                  totalDays < 1 ||
                  (leaveType === "Other" &&
                    !leaveDescription.trim()) ||
                  (leaveType === "Casual" &&
                    totalDays > 1)
                ))
              }
              onClick={UpdateDailyAttendance}
              className="w-full py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#00A9A5] to-[#005f61] disabled:bg-gray-300 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : attendance.status === "Present"
                ? "Check In"
                : "Submit Attendance"}
            </button>

          </>

        )}
{/* APPLY LEAVE - AVAILABLE IN ALL ATTENDANCE STATES */}
{isCheckedIn&&
<button
  type="button"
  onClick={handleOpenLeaveForm}
  disabled={loading}
  className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
>
  <ClipboardEdit size={19} />
  Apply for Leave
</button>}

{showLeaveModal && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Apply for Leave
          </h2>
          <p className="text-sm text-slate-500">
            Submit your leave request for approval.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowLeaveModal(false)}
          className="rounded-full bg-slate-100 p-2 text-slate-600"
        >
          <X size={18} />
        </button>
      </div>
{/* AVAILABLE LEAVE INFORMATION */}
<div className="rounded-xl border border-teal-100 bg-teal-50 p-4">

  <div className="mb-3 flex items-center justify-between">
    <h3 className="text-sm font-bold text-teal-800">
      Available Leave Information
    </h3>

    {LoadingLeaves && (
      <RefreshCw size={15} className="animate-spin text-teal-600" />
    )}
  </div>

  {LoadingLeaves ? (
    <p className="text-sm text-gray-500">
      Loading leave information...
    </p>
  ) : (
    <>
      <div className="flex justify-between text-sm">
        <span>Total Leaves</span>
        <strong>{totalLeaves + usedLeaves}</strong>
      </div>

      <div className="mt-2 flex justify-between text-sm">
        <span>Remaining Leaves</span>
        <strong className="text-teal-700">
          {remainingLeaves}
        </strong>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-blue-100 px-2 py-1 text-blue-700">
          Casual: {CasualLeaves}
        </span>

        <span className="rounded bg-pink-100 px-2 py-1 text-pink-700">
          Sick: {SickLeaves}
        </span>

        <span className="rounded bg-green-100 px-2 py-1 text-green-700">
          Other: {OtherLeaves}
        </span>
      </div>
    </>
  )}
</div>
      {/* Leave Type */}
      <label className="text-sm font-semibold text-gray-600">
        Leave Type
      </label>

      <select
        value={leaveType}
        onChange={(e) => {
          setLeaveType(e.target.value);
          if (e.target.value !== "Other") {
            setLeaveDescription("");
          }
        }}
        className="mt-2 w-full rounded-xl border p-3"
      >
        <option value="">Choose leave type</option>
        <option value="Casual">Casual Leave</option>
        <option value="Sick">Sick Leave</option>
        <option value="Other">Other</option>
      </select>

      {/* Description */}
      {leaveType === "Other" && (
        <textarea
          value={leaveDescription}
          onChange={(e) => setLeaveDescription(e.target.value)}
          placeholder="Describe your leave reason"
          className="mt-4 w-full rounded-xl border p-3"
          rows={3}
        />
      )}

      {/* Dates */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500">
            From Date
          </label>
          <input
            type="date"
            value={attendance.fromDate}
            onChange={(e) =>
              setAttendance((prev: any) => ({
                ...prev,
                fromDate: e.target.value,
              }))
            }
            className="mt-1 w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500">
            To Date
          </label>
          <input
            type="date"
            min={attendance.fromDate}
            value={attendance.toDate}
            onChange={(e) =>
              setAttendance((prev: any) => ({
                ...prev,
                toDate: e.target.value,
              }))
            }
            className="mt-1 w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <p className="mt-3 text-sm font-semibold text-teal-700">
        Total Leave Days: {totalDays}
      </p>

                {leaveType === "Casual" && totalDays > 1 && (
                  <p className="text-sm text-red-600">
                    Casual leave can only be taken for one day.
                  </p>
                )}
      <button
        type="button"
        disabled={
          loading ||
          LoadingLeaves ||
          !leaveType ||
          !attendance.fromDate ||
          !attendance.toDate ||
          totalDays < 1 ||
          (leaveType === "Casual" && totalDays > 1) ||
          (leaveType === "Other" && !leaveDescription.trim())
        }
        onClick={UpdateDailyAttendance}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#00A9A5] to-[#005f61] py-3 font-bold text-white disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Leave Request"}
      </button>
   {/* STATUS MESSAGE */}
        {statusMessage && (

          <div className="rounded-xl bg-gray-100 border px-4 py-3 text-center text-sm font-semibold text-gray-700">
            {statusMessage}
          </div>

        )}
    </div>
  </div>
)}
     
   {/* STATUS MESSAGE */}
        {statusMessage && (

          <div className="rounded-xl bg-gray-100 border px-4 py-3 text-center text-sm font-semibold text-gray-700">
            {statusMessage}
          </div>

        )}
      </div>

    </div>
  );
}
