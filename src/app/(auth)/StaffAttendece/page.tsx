"use client";

import { LoadingData } from "@/Components/Loading/page";
import { GetEmail } from "@/Lib/Actions";
import axios from "axios";
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

type EmployeeAttendance = {
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

// const employeeRoster: Employee[] = [
//   { UserId: "TEST001", EmployeeName: "Srinivas", Area: "Hitech City", Latitude: 17.4435, Longitude: 78.3772 },
//   { UserId: "TEST002", EmployeeName: "Ramesh Kumar", Area: "Gachibowli", Latitude: 17.4401, Longitude: 78.3489 },
//   { UserId: "TEST003", EmployeeName: "Priya Sharma", Area: "Secunderabad", Latitude: 17.4399, Longitude: 78.4983 },
//   { UserId: "TEST004", EmployeeName: "Anil Kumar", Area: "Kukatpally", Latitude: 17.4948, Longitude: 78.3996 },
//   { UserId: "TEST005", EmployeeName: "Sneha Reddy", Area: "Miyapur", Latitude: 17.4968, Longitude: 78.3565 },
//   { UserId: "TEST006", EmployeeName: "Vijay Kumar", Area: "Charminar", Latitude: 17.3616, Longitude: 78.4747 },
//   { UserId: "TEST007", EmployeeName: "Lakshmi Devi", Area: "LB Nagar", Latitude: 17.3457, Longitude: 78.5522 },
//   { UserId: "TEST008", EmployeeName: "Kiran Reddy", Area: "Begumpet", Latitude: 17.4435, Longitude: 78.4676 },
//   { UserId: "TEST009", EmployeeName: "Pooja Singh", Area: "Madhapur", Latitude: 17.4483, Longitude: 78.3915 },
//   { UserId: "TEST010", EmployeeName: "Mahesh Babu", Area: "Kondapur", Latitude: 17.4616, Longitude: 78.3647 },
//   { UserId: "TEST011", EmployeeName: "Divya Rao", Area: "Uppal", Latitude: 17.4058, Longitude: 78.5591 },
//   { UserId: "TEST012", EmployeeName: "Naveen Raju", Area: "Mehdipatnam", Latitude: 17.3949, Longitude: 78.4439 },
//   { UserId: "TEST013", EmployeeName: "Swathi Reddy", Area: "Ameerpet", Latitude: 17.4375, Longitude: 78.4483 },
//   { UserId: "TEST014", EmployeeName: "Arjun Varma", Area: "Banjara Hills", Latitude: 17.4126, Longitude: 78.4482 },
//   { UserId: "TEST015", EmployeeName: "Keerthi Nair", Area: "Jubilee Hills", Latitude: 17.4316, Longitude: 78.407 },
//   { UserId: "TEST016", EmployeeName: "Rahul Verma", Area: "Dilsukhnagar", Latitude: 17.3688, Longitude: 78.5247 },
//   { UserId: "TEST017", EmployeeName: "Mounika", Area: "Manikonda", Latitude: 17.405, Longitude: 78.383 },
//   { UserId: "TEST018", EmployeeName: "Imran Khan", Area: "Tolichowki", Latitude: 17.4008, Longitude: 78.4325 },
//   { UserId: "TEST019", EmployeeName: "Harish Goud", Area: "Kompally", Latitude: 17.54, Longitude: 78.488 },
//   { UserId: "TEST020", EmployeeName: "Farah Begum", Area: "Shamshabad", Latitude: 17.202, Longitude: 78.3957 },
// ];

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

function formatTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Present: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Absent: "border-rose-200 bg-rose-50 text-rose-700",
    Leave: "border-amber-200 bg-amber-50 text-amber-700",
    "Not marked": "border-slate-200 bg-slate-100 text-slate-600",
    Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Pending: "border-amber-200 bg-amber-50 text-amber-700",
    Rejected: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] || styles["Not marked"]}`}>{status}</span>;
}

export default function ManagerAttendanceDashboard() {
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingAction, setUpdatingAction] = useState<{
  userId: string;
  action: "Approve" | "Reject";
} | null>(null);
  const [leaveDecisions, setLeaveDecisions] = useState<Record<string, "Approved" | "Rejected">>({});
  const [isChecking, setIsChecking] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [employeeRoster,setemployeeRoster]=useState<any[]>([])
const router=useRouter()
const employees = useMemo(
  () => makeTestAttendance(selectedDate),
  [selectedDate, employeeRoster]
);
const loggedInEmail=useSelector((state:any)=>state.LoggedInEmail)
  const selectedDateObj = new Date(`${selectedDate}T12:00:00`);
  const selectedMonth = selectedDateObj.getMonth();
  const selectedYear = selectedDateObj.getFullYear();
  const users=useSelector((state:any)=>state.AdminUsers)
useEffect(() => {
  let isMounted = true;

  const fetchStaffAttendance = async () => {
    setIsChecking(true);

    try {
      // Reuse cached data only when it belongs to the selected date
      if (
        cachedAttendeceInfo?.date === selectedDate
      ) {
        if (isMounted) {
          setemployeeRoster(cachedAttendeceInfo.data);
        }
        return;
      }

      const response = await axios.post("/api/StaffAttendance", {
        selectedDate,
      });

      const filtered = response.data.AttendeceResuls.map(
        (each: any) => ({
          UserId: each.UserId,
          EmployeeName: each.EmployeeName?.trim() || "Unknown",
          Area: each.Area || "—",
          Latitude: each.Location?.Latitude ?? null,
          Longitude: each.Location?.Longitude ?? null,
          CreatedAt:each.CreatedAt,
          Status:each.Status,
          ApprovalStatus:each.ApprovalStatus,
           ToDate: each.ToDate,
  FromDate: each.FromDate
        })
      );

      cachedAttendeceInfo = {
        date: selectedDate,
        data: filtered,
      };

      if (isMounted) {
        setemployeeRoster(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch staff attendance:", error);

      if (isMounted) {
        setemployeeRoster([]);
      }
    } finally {
      if (isMounted) {
        setIsChecking(false);
      }
    }
  };

  fetchStaffAttendance();

  return () => {
    isMounted = false;
  };
}, [selectedDate]);

function makeTestAttendance(date: string): EmployeeAttendance[] {
  return employeeRoster.map((employee:any, index:any) => {
    const pattern = index % 10;
    const status: "Present" | "Absent" | "Leave" | undefined =employee.Status

    const hasLocation = status === "Present";
    const hour = 8 + (index % 3);
    const minute = (index * 7) % 60;
    const capturedAt = employee.CreatedAt
    const checkoutHour = 17 + (index % 3);
    const checkoutMinute = (index * 11) % 60;
    const checkoutAt = `${date}T${String(checkoutHour).padStart(2, "0")}:${String(checkoutMinute).padStart(2, "0")}:00+05:30`;

    return {
      UserId: employee.UserId,
      EmployeeName: employee.EmployeeName,
      Area: employee.Area,
      AttendanceDate: date,
      FromDate:employee.FromDate,
      ToDate:employee.ToDate,
       CreatedAt: employee.CreatedAt,
            CheckoutAt: checkoutAt,
            ApprovalStatus: employee.ApprovalStatus,
      ...(status ? { Status: status } : {}),
      ...(hasLocation
        ? {
            Location: {
              Latitude: employee.Latitude,
              Longitude: employee.Longitude,
              Accuracy: 10 + (index % 35),
              CapturedAt: capturedAt,
            },
           
          }
        : {}),
    };
  });
}



  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const matchesSearch = `${employee.EmployeeName} ${employee.UserId} ${employee.Area}`.toLowerCase().includes(search.trim().toLowerCase());
    const status = employee.Status || "Not marked";
    return matchesSearch && (statusFilter === "All" || status === statusFilter);
  }), [employees, search, statusFilter]);

  const summary = useMemo(() => ({
    total: employees.length,
    present: employees.filter((e) => e.Status === "Present").length,
    absent: employees.filter((e) => e.Status === "Absent").length,
    notMarked: employees.filter((e) => !e.Status).length,
    locations: employees.filter((e) => e.Status === "Present" && getCoordinates(e.Location)).length,
    pending: employees.filter((e) => e.ApprovalStatus === "Pending").length,
  }), [employees]);

  const updateMonth = (month: number) => {
    const [year, , day] = selectedDate.split("-").map(Number);
    const lastDay = new Date(year, month + 1, 0).getDate();
    setSelectedDate(`${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(day, lastDay)).padStart(2, "0")}`);
  };

  const updateYear = (year: number) => {
    const [, month, day] = selectedDate.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    setSelectedDate(`${year}-${String(month).padStart(2, "0")}-${String(Math.min(day, lastDay)).padStart(2, "0")}`);
  };

  const years = Array.from({ length: 7 }, (_, index) => selectedYear - 3 + index);

  const openLocation = (employee: EmployeeAttendance) => {
    const coordinates = getCoordinates(employee.Location);
    if (!coordinates) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`, "_blank", "noopener,noreferrer");
  };


const UpdateStatus = async (
  employee: EmployeeAttendance,
  ImpStatus: "Approve" | "Reject"
) => {
  if (!employee?.UserId) {
    console.error("Employee UserId is missing");
    return;
  }
setUpdatingAction({
  userId: employee.UserId,
  action: ImpStatus,
});
  if (updatingUserId === employee.UserId) return;

  const approvalStatus =
    ImpStatus === "Approve" ? "Approved" : "Rejected";

  try {
    setUpdatingUserId(employee.UserId);

    // Replace this URL and payload with your actual update API.
    const response = await axios.post("/api/UpdateStaffLeaveStatus", {
      UserId: employee.UserId,
      AttendanceDate: employee.AttendanceDate,
      ApprovalStatus: approvalStatus,
      loggedInEmail:loggedInEmail
        
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to update leave status");
    }

    // Update the UI immediately after a successful API response.
    setemployeeRoster((previous: any[]) =>
      previous.map((item: any) =>
        item.UserId === employee.UserId
          ? { ...item, ApprovalStatus: approvalStatus }
          : item
      )
    );


// Send employee notification email
await axios.post("/api/MailSend", {
  // to:   GetEmail(
  //     users,
  //     employee.UserId
  //   ), 
  to:"tsiddu805@gmail.com",
  subject:
    approvalStatus === "Approved"
      ? "Leave Request Approved"
      : "Leave Request Rejected",

  html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>

  <body style="
    margin: 0;
    padding: 0;
    background-color: #f1f5f9;
    font-family: Arial, Helvetica, sans-serif;
    color: #1e293b;
  ">

    <table width="100%" cellpadding="0" cellspacing="0"
      style="padding: 35px 12px; background-color: #f1f5f9;">
      <tr>
        <td align="center">

          <table width="100%" cellpadding="0" cellspacing="0"
            style="
              max-width: 620px;
              background-color: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              border: 1px solid #e2e8f0;
            ">

            <!-- Header -->
            <tr>
              <td style="
                background-color: #0f766e;
                padding: 30px 28px;
                color: #ffffff;
              ">
                <p style="
                  margin: 0 0 12px;
                  font-size: 12px;
                  font-weight: bold;
                  letter-spacing: 2px;
                  color: #ccfbf1;
                ">
                  CURATE HEALTH CARE SERVICES
                </p>

                <h1 style="
                  margin: 0;
                  font-size: 26px;
                  line-height: 1.4;
                  font-weight: 700;
                ">
                  Leave Request Update
                </h1>

                <p style="
                  margin: 8px 0 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #d1fae5;
                ">
                  Your leave request has been reviewed by your manager.
                </p>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding: 30px 28px;">

                <p style="
                  margin: 0 0 12px;
                  font-size: 16px;
                  line-height: 1.7;
                ">
                  Hello ${employee.EmployeeName ?? "Employee"},
                </p>

                <p style="
                  margin: 0 0 24px;
                  font-size: 14px;
                  line-height: 1.8;
                  color: #475569;
                ">
                  Your leave application has been reviewed. Please find
                  the details and final status below.
                </p>

                <!-- Status -->
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="
                    background-color: ${
                      approvalStatus === "Approved"
                        ? "#f0fdf4"
                        : "#fef2f2"
                    };
                    border: 1px solid ${
                      approvalStatus === "Approved"
                        ? "#bbf7d0"
                        : "#fecaca"
                    };
                    border-radius: 10px;
                    margin-bottom: 24px;
                  ">
                  <tr>
                    <td style="padding: 18px;">

                      <span style="
                        display: inline-block;
                        padding: 7px 14px;
                        border-radius: 20px;
                        background-color: ${
                          approvalStatus === "Approved"
                            ? "#dcfce7"
                            : "#fee2e2"
                        };
                        color: ${
                          approvalStatus === "Approved"
                            ? "#166534"
                            : "#991b1b"
                        };
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        LEAVE ${approvalStatus.toUpperCase()}
                      </span>

                      <p style="
                        margin: 12px 0 0;
                        font-size: 14px;
                        line-height: 1.7;
                        color: #475569;
                      ">
                        ${
                          approvalStatus === "Approved"
                            ? "Your leave request has been approved. Please plan accordingly."
                            : "Your leave request has not been approved. Please contact your manager if you need clarification."
                        }
                      </p>

                    </td>
                  </tr>
                </table>

                <!-- Leave Details -->
                <h2 style="
                  margin: 0 0 16px;
                  font-size: 18px;
                  color: #0f172a;
                ">
                  Leave Details
                </h2>

                <table width="100%" cellpadding="0" cellspacing="0"
                  style="border: 1px solid #e2e8f0;">

                  <tr>
                    <td style="
                      padding: 14px 16px;
                      width: 40%;
                      background-color: #f8fafc;
                      border-bottom: 1px solid #e2e8f0;
                      font-size: 13px;
                      color: #64748b;
                    ">
                      Employee Name
                    </td>
                    <td style="
                      padding: 14px 16px;
                      border-bottom: 1px solid #e2e8f0;
                      font-size: 14px;
                      font-weight: bold;
                    ">
                      ${employee.EmployeeName ?? "N/A"}
                    </td>
                  </tr>

                

                  <tr>
                    <td style="
                      padding: 14px 16px;
                      background-color: #f8fafc;
                      border-bottom: 1px solid #e2e8f0;
                      font-size: 13px;
                      color: #64748b;
                    ">
                      From Date
                    </td>
                    <td style="
                      padding: 14px 16px;
                      border-bottom: 1px solid #e2e8f0;
                      font-size: 14px;
                    ">
                      ${employee.FromDate ?? "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      padding: 14px 16px;
                      background-color: #f8fafc;
                      border-bottom: 1px solid #e2e8f0;
                      font-size: 13px;
                      color: #64748b;
                    ">
                      To Date
                    </td>
                    <td style="
                      padding: 14px 16px;
                      border-bottom: 1px solid #e2e8f0;
                      font-size: 14px;
                    ">
                      ${employee.ToDate ?? "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      padding: 14px 16px;
                      background-color: #f8fafc;
                      font-size: 13px;
                      color: #64748b;
                    ">
                      Approval Status
                    </td>
                    <td style="
                      padding: 14px 16px;
                      font-size: 14px;
                      font-weight: bold;
                      color: ${
                        approvalStatus === "Approved"
                          ? "#15803d"
                          : "#b91c1c"
                      };
                    ">
                      ${approvalStatus}
                    </td>
                  </tr>

                </table>

                <p style="
                  margin: 26px 0 0;
                  font-size: 14px;
                  line-height: 1.8;
                  color: #475569;
                ">
                  Thank you,<br />
                  <strong style="color: #0f766e;">
                    Curate Health Care Services
                  </strong>
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="
                padding: 20px;
                text-align: center;
                background-color: #f8fafc;
                border-top: 1px solid #e2e8f0;
              ">
                <p style="
                  margin: 0;
                  font-size: 11px;
                  line-height: 1.8;
                  color: #94a3b8;
                ">
                  This is an automated notification from Curate Health
                  Care Services. Please do not reply directly to this email.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
});
    // Keep the local cache consistent.
    if (cachedAttendeceInfo?.date === selectedDate) {
      cachedAttendeceInfo = {
        ...cachedAttendeceInfo,
        data: cachedAttendeceInfo.data.map((item: any) =>
          item.UserId === employee.UserId
            ? { ...item, ApprovalStatus: approvalStatus }
            : item
        ),
      };
    }
  } catch (error: any) {
    console.error(
      "Failed to update leave approval:",
      error.response?.data || error.message || error
    );

    alert(
      error.response?.data?.message ||
        "Unable to update leave status. Please try again."
    );
  } finally {
    setUpdatingUserId(null);
    setUpdatingAction(null);
  }
};

  if (isChecking) {
   return <LoadingData />
  }
  return (
    <main className="w-full min-w-0 bg-slate-50 p-3 text-slate-900 sm:p-5 lg:p-7">
      <div className="mx-auto w-full max-w-screen-2xl space-y-5">
        <header className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            
          <div className="flex items-center gap-2">
              <img
                        src="/Icons/Curate-logoq.png"
                        alt="Company Logo"
                        className="h-10 w-10 object-contain"
                      />
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Employee Attendance</h1>
          
          </div>
          {selectedDate !== getLocalDate() && <button type="button" onClick={() => { setSelectedDate(getLocalDate()); setSearch(""); setStatusFilter("All"); }} className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Today&apos;s Attendance</button>}
      
                    <button
               onClick={() =>router.push("/DashBoard")}
              className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
            >
              DashBoard
            </button>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">⌕</span><div><h2 className="text-sm font-semibold">Find attendance</h2><p className="text-xs text-slate-500">Choose a date or search by employee and area.</p></div></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0"><label htmlFor="attendance-date" className="mb-1.5 block text-sm font-medium text-slate-700">Select date</label><input id="attendance-date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" /></div>
            <div className="min-w-0"><label htmlFor="attendance-month" className="mb-1.5 block text-sm font-medium text-slate-700">Month</label><select id="attendance-month" value={selectedMonth} onChange={(e) => updateMonth(Number(e.target.value))} className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50">{Array.from({ length: 12 }, (_, index) => <option key={index} value={index}>{new Date(2026, index, 1).toLocaleString("en-IN", { month: "long" })}</option>)}</select></div>
            <div className="min-w-0"><label htmlFor="attendance-year" className="mb-1.5 block text-sm font-medium text-slate-700">Year</label><select id="attendance-year" value={selectedYear} onChange={(e) => updateYear(Number(e.target.value))} className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50">{years.map((year) => <option key={year} value={year}>{year}</option>)}</select></div>
            <div className="min-w-0"><label htmlFor="employee-search" className="mb-1.5 block text-sm font-medium text-slate-700">Search employees</label><input id="employee-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, ID, or area..." className="w-full min-w-0 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" /></div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {[
            { label: "Total employees", value: summary.total, tone: "text-slate-900", mark: "👥" },
            { label: "Present", value: summary.present, tone: "text-emerald-700", mark: "✓" },
            { label: "Absent", value: summary.absent, tone: "text-rose-700", mark: "×" },
            { label: "Not marked", value: summary.notMarked, tone: "text-slate-700", mark: "—" },
            { label: "Locations captured", value: summary.locations, tone: "text-blue-700", mark: "⌖" },
      
          ].map((item) => <div key={item.label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium leading-5 text-slate-500 sm:text-sm">{item.label}</p><span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500 sm:flex">{item.mark}</span></div><p className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${item.tone}`}>{item.value}</p></div>)}
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex min-w-0 flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0"><h2 className="font-semibold text-slate-900">Employee list</h2><p className="mt-1 text-sm text-slate-500">Attendance for {selectedDateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p></div>
            <select aria-label="Filter attendance status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm sm:w-48"><option value="All">All statuses</option><option value="Present">Present</option><option value="Absent">Absent</option><option value="Leave">Leave</option><option value="Not marked">Not marked</option></select>
          </div>

          {filteredEmployees.length === 0 ? <div className="p-10 text-center"><p className="font-medium text-slate-800">No employees found for Slected Date</p><p className="mt-1 text-sm text-slate-500">Try another search or status filter.</p></div> : (
            <>
              {/* Responsive employee cards avoid clipped columns in narrow dialogs and side panels. */}
            <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-3 p-2 sm:grid-cols-2 sm:gap-4 sm:p-3 lg:grid-cols-3">
  {filteredEmployees.map((employee) => {
    const coordinates = getCoordinates(employee.Location);
    const status = employee.Status || "Not marked";

    return (
      <article
        key={employee.UserId}
        className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-indigo-200 hover:shadow-md"
      >
        {/* Employee Header */}
        <div className="flex min-w-0 items-center justify-between gap-3 p-3 sm:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700 ring-1 ring-indigo-100">
              {employee.EmployeeName
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                {employee.EmployeeName}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {status === "Leave" ? "Leave application" : "Attendance"}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Information Panel */}
        <div className="mx-3 mb-3 rounded-xl bg-slate-50 p-3 sm:mx-4 sm:mb-4 sm:p-4">
          <div
            className={`grid gap-3 ${
              status === "Leave"
                ? "grid-cols-1"
                : "grid-cols-1"
            }`}
          >
            {/* Applied At / Check-in */}
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">
                {status === "Leave" ? "Applied At" : "Check-in"}
              </p>

              <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                {employee.CreatedAt || "—"}
              </p>
            </div>

            {/* Leave Dates */}
            {status === "Leave" && (
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 3v4M8 3v4M3 10h18"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Leave period
                    </p>
                    <p className="text-xs text-slate-500">
                      Requested dates
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 sm:text-sm">
                    {employee.FromDate || "—"}
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-7-7 7 7-7 7"
                    />
                  </svg>

                  <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 sm:text-sm">
                    {employee.ToDate || "—"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Leave Approval */}
        {status === "Leave" &&
          (() => {
            const decisionKey = `${selectedDate}:${employee.UserId}`;
            const decision = employee.ApprovalStatus

            return (
              <div className="flex flex-wrap items-center gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
                {decision==="Approved" ? (
                  <StatusBadge status={decision} />
                ) : (
                  <>
                   <button
  type="button"
  disabled={updatingUserId === employee.UserId}
  onClick={() => UpdateStatus(employee, "Approve")}
  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
>
  {updatingAction?.userId === employee.UserId &&
updatingAction?.action === "Approve"
  ? "Approving..."
  : "Approve"}
</button>

<button
  type="button"
  disabled={updatingUserId === employee.UserId}
  onClick={() => UpdateStatus(employee, "Reject")}
  className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
>
  {updatingAction?.userId === employee.UserId &&
updatingAction?.action === "Reject"
  ? "Rejecting..."
  : "Reject"}
</button>
                  </>
                )}
              </div>
            );
          })()}

        {/* Footer */}
        <div className="mt-auto flex min-w-0 items-center justify-end border-t border-slate-100 px-3 py-3 sm:px-4">
          {coordinates && (
            <button
              type="button"
              onClick={() => openLocation(employee)}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span aria-hidden="true">⌖</span>
              View map
            </button>
          )}
        </div>
      </article>
    );
  })}
</div>
              </>
          )}
        </section>
        </div>
    </main>
  );
}
