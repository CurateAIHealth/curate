"use client";

import { LoadingData } from "@/Components/Loading/page";
import { GetEmail } from "@/Lib/Actions";
import axios from "axios";
import { MapPin } from "lucide-react";
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
  const [showFullMonth, setShowFullMonth] = useState(false);
  const [LoadingLeaves,setLoadingLeaves]=useState(false)
const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [leaveBalanceStaff, setLeaveBalanceStaff] = useState<any>(null);

  const [spentLeaves,setspentLeaves]=useState(0)
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
           Month:each.Month,
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
const updateLeave = async (ImpValue: any) => {
 setLeaveBalanceStaff(ImpValue)
          setLoadingLeaves(true);
  try {
  
    const employeeId = String(ImpValue.UserId).trim();
 

    const response = await axios.get("/api/leavesinfo", {
      params: { userId: employeeId },
      timeout: 15000,
    });

    const leaveData = response?.data?.GetData;
    if (!leaveData || typeof leaveData !== "object") {
      throw new Error("Leave information not found.");
    }

    const parseLeaveCount = (value: unknown): number => {
      if (
        (typeof value !== "number" && typeof value !== "string") ||
        (typeof value === "string" && value.trim() === "")
      ) {
        throw new Error("Leave information contains an invalid count.");
      }

      const count = Number(value);
      if (!Number.isFinite(count) || count < 0) {
        throw new Error("Leave information contains an invalid count.");
      }
      return count;
    };

    const sickLeaves = parseLeaveCount(leaveData.sick);
    const casualLeaves = parseLeaveCount(leaveData.Casual);
    
    setspentLeaves(parseLeaveCount(leaveData.usedLeaves))
    setLeaveTotalInput((Number(sickLeaves) + Number(casualLeaves)));
 setSickLeaves(sickLeaves)
 setCasualLeaves(casualLeaves)
    setLoadingLeaves(false);
  } catch (err: unknown) {
   

    // Keep existing leave values if the request fails.
    // Do not update attendance status after a failed request.
  }
};
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
      TotalLeaves: employee.TotalLeaves ?? 10,
      FromDate:employee.FromDate,
      Month:employee.Month,
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

    setPopupMessage(
      error.response?.data?.message ||
        "Unable to update leave status. Please try again."
    );
  } finally {
    setUpdatingUserId(null);
    setUpdatingAction(null);
  }
};

const getSpentLeaves = (userId: string) => {
  const approvedLeaves = employeeRoster.filter(
    (item: any) => item.UserId === userId && item.Status === "Leave" && item.ApprovalStatus === "Approved"
  );
  const ranges = new Set<string>();
  return approvedLeaves.reduce((total: number, leave: any) => {
    const from = leave.FromDate ? new Date(leave.FromDate) : null;
    const to = leave.ToDate ? new Date(leave.ToDate) : from;
    if (!from || !to || Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return total;
    const key = `${from.toISOString().slice(0, 10)}:${to.toISOString().slice(0, 10)}`;
    if (ranges.has(key)) return total;
    ranges.add(key);
    const days = Math.max(1, Math.floor((to.getTime() - from.getTime()) / 86400000) + 1);
    return total + days;
  }, 0);
};

const updateLeaveBalance = async () => {
  const userId = leaveBalanceStaff?.UserId;

  if (!userId) {
    console.error("Missing UserId in leaveBalanceStaff:", leaveBalanceStaff);
    setPopupMessage("Employee UserId is missing. Please check the attendance API response.");
    return;
  }
  
  try {
    setUpdatingLeaveBalance(true);
    const Update=await axios.post("/api/UpdateStaffLeaveBalance", {
      UserId: userId,
      CasualLeaves: Number(CasualLeaves),
      SickLeaves: Number(SickLeaves),
    });
   
    setPopupMessage(`Leave balance updated successfully. Casual Leaves: ${Number(CasualLeaves)}. Sick Leaves: ${Number(SickLeaves)}.`);
    setLeaveBalanceStaff(null);
  } catch (error: any) {
    console.error("Failed to update leave balance:", error.response?.data || error.message || error);
    setPopupMessage(error.response?.data?.message || "Unable to update leave balance. Please try again.");
  } finally {
    setUpdatingLeaveBalance(false);
  }
};

  if (isChecking) {
   return <LoadingData />
  }
  return (
    <main className="w-full min-w-0 bg-slate-50 p-3 text-slate-900 sm:p-5 lg:p-7">
      {popupMessage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setPopupMessage(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="Notification"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <p className="text-sm leading-6 text-slate-700">{popupMessage}</p>
            <button
              type="button"
              onClick={() => setPopupMessage(null)}
              className="mt-5 w-full rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              OK
            </button>
          </div>
        </div>
      )}
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
        className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-indigo-200 hover:shadow-md"
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
      
<div className="mt-auto border-t border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-3 py-3 sm:px-5">
  <div className="flex min-w-0 items-center gap-2 sm:gap-3">

    {/* Leave Management */}
    <button
      type="button"
      onClick={() => {
         
        updateLeave(employee);
       
       
      }}
      className="group inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-amber-200 bg-amber-50 px-2 text-xs font-semibold text-amber-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-600 hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:gap-2 sm:px-4"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01" />
      </svg>
      <span>Leave Management</span>
    </button>

    {/* Full Month Attendance */}
    <button
      type="button"
      onClick={() => openFullMonthAttendance(employee)}
      className="group inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-teal-200 bg-teal-50 px-2 text-xs font-semibold text-teal-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-600 hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:gap-2 sm:px-4"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
      </svg>
      <span>Full Month Attendance</span>
    </button>
  </div>

  {/* View Location — bottom row */}
  {coordinates && (
    <button
      type="button"
      onClick={() => openLocation(employee)}
      className="group mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.2 7-12a7 7 0 10-14 0c0 6.8 7 12 7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
      <span>View Location</span>
    </button>
  )}
</div>

{leaveBalanceStaff?.UserId === employee.UserId &&
  (() => {
   
 
    const availableLeaves = Math.max(0, Number(SickLeaves)+Number(CasualLeaves) - spentLeaves);

    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
        onClick={() => setLeaveBalanceStaff(null)}
        role="presentation"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Leave balance for ${employee.EmployeeName}`}
          onClick={(event) => event.stopPropagation()}
          className="relative my-auto flex max-h-[calc(100dvh-24px)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl shadow-slate-950/20 sm:max-h-[calc(100dvh-40px)]"
        >
          {/* Header */}
          <div className="relative shrink-0 overflow-hidden bg-teal-600 px-5 py-4 text-white">
            <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 right-16 h-24 w-24 rounded-full bg-white/10" />

            <div className="relative flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                 <img
                src="/Icons/Curate-logoq.png"
                className="h-12"
                alt="Company Logo"
              />

                <div className="min-w-0">
                  <h3 className="text-lg font-bold tracking-tight">
                    Leave Balance
                  </h3>
                  <p className="mt-1 truncate text-sm text-amber-50">
                    {employee.EmployeeName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLeaveBalanceStaff(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-xl text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close leave balance"
              >
                ×
              </button>
            </div>
          </div>
          {!LoadingLeaves?
<div>
          {/* Scrollable Content */}
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-5">
            {/* Total Leaves Input */}
            
            <div>
              <label
                htmlFor="leave-total-input"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Total allocated leaves
              </label>

     
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
  {/* Casual Leaves */}
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="mb-3 flex items-center justify-between">
      <label
        htmlFor="casual-leaves-input"
        className="text-sm font-semibold text-slate-700"
      >
        Casual Leaves
      </label>

      <button
        type="button"
        onClick={() => setIsEditingCasualLeaves((prev) => !prev)}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
          isEditingCasualLeaves
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
        }`}
      >
        {isEditingCasualLeaves ? "Done" : "Edit"}
      </button>
    </div>

    <div className="flex items-center gap-2">
      <input
        id="casual-leaves-input"
        type="number"
        min="0"
        step="1"
        value={CasualLeaves}
        readOnly={!isEditingCasualLeaves}
        onChange={(event) => {
          const value = event.target.value;
          setCasualLeaves(Number(value));
        }}
        className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-blue-100 ${
          isEditingCasualLeaves
            ? "border-blue-300 bg-white text-slate-800"
            : "border-slate-100 bg-slate-50 text-slate-600"
        }`}
      />
      <span className="text-xs text-slate-500">Days</span>
    </div>
  </div>

  {/* Sick Leaves */}
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="mb-3 flex items-center justify-between">
      <label
        htmlFor="sick-leaves-input"
        className="text-sm font-semibold text-slate-700"
      >
        Sick Leaves
      </label>

      <button
        type="button"
        onClick={() => setIsEditingSickLeaves((prev) => !prev)}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
          isEditingSickLeaves
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
            : "bg-rose-50 text-rose-700 hover:bg-rose-100"
        }`}
      >
        {isEditingSickLeaves ? "Done" : "Edit"}
      </button>
    </div>

    <div className="flex items-center gap-2">
      <input
        id="sick-leaves-input"
        type="number"
        min="0"
        step="1"
        value={SickLeaves}
        readOnly={!isEditingSickLeaves}
        onChange={(event) => {
          const value = event.target.value;
          setSickLeaves(value);
        }}
        className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-rose-100 ${
          isEditingSickLeaves
            ? "border-rose-300 bg-white text-slate-800"
            : "border-slate-100 bg-slate-50 text-slate-600"
        }`}
      />
      <span className="text-xs text-slate-500">Days</span>
    </div>
  </div>
</div>

            </div>

            {/* Leave Summary Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Total */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13H4V6a1 1 0 011-1z"
                    />
                  </svg>
                </div>

                <p className="text-[11px] font-medium text-slate-500">
                  Total
                </p>

                <p className="mt-1 text-xl font-bold text-slate-800">
                  {Number(SickLeaves)+Number(CasualLeaves)}
                </p>
              </div>

              {/* Spent */}
              <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-3 text-center shadow-sm">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7v5l3 2"
                    />
                  </svg>
                </div>

                <p className="text-[11px] font-medium text-amber-800">
                  Spent
                </p>

                <p className="mt-1 text-xl font-bold text-amber-700">
                  {spentLeaves}
                </p>
              </div>

              {/* Available */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-center shadow-sm">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12l4 4L19 6"
                    />
                  </svg>
                </div>

                <p className="text-[11px] font-medium text-emerald-800">
                  Available
                </p>

                <p className="mt-1 text-xl font-bold text-emerald-700">
                  {availableLeaves}
                </p>
              </div>
            </div>
          </div>

          {/* Fixed Action Footer */}
          <div className="flex shrink-0 gap-3 border-t border-slate-100 bg-white p-4 sm:px-5">
            <button
              type="button"
              onClick={() => setLeaveBalanceStaff(null)}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={updateLeaveBalance}
              disabled={updatingLeaveBalance}
              className="group relative inline-flex h-11 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl border border-amber-500 bg-teal-600 px-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-600 hover:from-amber-600 hover:via-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-500/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {updatingLeaveBalance ? (
                <>
                  <svg
                    className="h-5 w-5 shrink-0 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12l4 4L19 6"
                      />
                    </svg>
                  </span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
         </div>: <div className="flex h-32 w-full items-center justify-center gap-2 text-gray-500">
  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#00A9A5]" />
  <span className="text-sm font-medium">
    Loading leave information...
  </span>
</div>}
        </div>
      </div>
    );
  })()}

      </article>
    );
  })}
</div>
              </>
          )}
        </section>

 

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
      className="flex h-full max-h-[100dvh] w-full max-w-[1600px] flex-col overflow-hidden rounded-none border border-slate-200 bg-white shadow-2xl sm:h-auto sm:max-h-[98dvh] sm:rounded-[24px]"
    >
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-4 px-4 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-7 lg:flex-row lg:items-center lg:justify-between">
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
          </select> */}

          {/* <select
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
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 sm:px-6 sm:pb-6">
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
                    <div key={item.label} className={`rounded-xl border p-3 text-center ${item.style}`}>
                      <p className="text-xs font-medium">{item.label}</p>
                      <p className="mt-1 text-2xl font-bold">{item.count}</p>
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
                        className="flex min-h-[125px] min-w-0 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-1.5 py-2 shadow-[0_1px_3px_rgba(15,23,42,0.12)] transition-shadow hover:shadow-md sm:min-h-[127px] sm:px-2"
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

                        <p
                          className={`mt-1 max-w-full truncate text-center text-[9px] leading-3 ${
                            isNotMarked
                              ? "invisible"
                              : "font-medium text-slate-500"
                          }`}
                        >
                          {`HCA: ${
                            selectedStaff.HCAName ??
                            selectedStaff.HCA ??
                            selectedStaff.EmployeeName ??
                            ""
                          }`}
                        </p>

                      <button
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


        </div>
    </main>
  );
}
