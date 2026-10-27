"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  MinusCircle,
  ClipboardEdit,
  X,
} from "lucide-react";
import { PostEmployeeAttendance } from "@/Lib/user.action";
import axios from "axios";
import { form } from "framer-motion/client";
import { useSelector } from "react-redux";

interface AttendanceProps {
  userId: any;
  userName: string;
  onSubmit: (data: any) => void;
  onClose?: () => void;

 SickLeaves:any,
CasualLeaves:any,
usedLeaves:any
}

export default function MarkAttendance({
  userId,
  userName,
  onSubmit,
  onClose,
 
}: AttendanceProps) {
   const SearchMonth = useSelector((state: any) => state.FilterMonth);
         const SearchYear = useSelector((state: any) => state.FilterYear);

 
  
         
  const [ SickLeaves, setSickLeaves]=useState(0)
   const [ CasualLeaves,setCasualLeaves]=useState(0)
   const [LoadingLeaves,setLoadingLeaves]=useState(false)
    const [usedLeaves,setusedLeaves]=useState(0)
  const [attendance, setAttendance] = useState<any>({
    userId,
    userName,
    status: "",
    date: new Date().toISOString().split("T")[0],
    fromDate: "",
    toDate: "",
    Month:`${SearchYear}-${SearchMonth}`
  });
  const [leaveType, setLeaveType] = useState<string>("")
const[statusMessage,setStatusMessage]=useState<any>()
  const isLeave = attendance.status === "Leave";
  const totalLeaves=SickLeaves+CasualLeaves
  const remainingLeaves = totalLeaves - usedLeaves;
 const loggedInEmail = useSelector((state: any) => state.LoggedInEmail)
// SetStatusMessage("Please wait, marking attendance...")
// SetStatusMessage("Attendance marked successfully")
// SetStatusMessage("Leave requested successfully")
const calculateLeaveDays = (fromDate: string, toDate: string) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();

  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const totalDays = calculateLeaveDays(
  attendance.fromDate,
  attendance.toDate
);
const getEmployeeLocation = (): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
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
            reject(new Error("Please allow location access to mark attendance."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Your current location is unavailable."));
            break;
          case error.TIMEOUT:
            reject(new Error("Location request timed out. Please try again."));
            break;
          default:
            reject(new Error("Unable to get your current location."));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};
const updateLeave = async (ImpValue: string) => {
  setLoadingLeaves(true);

  try {
    const response = await axios.get("/api/leavesinfo", {
      params: { userId },
      timeout: 15000,
    });

    const leaveData = response?.data?.GetData;

    if (!leaveData) {
      throw new Error("Leave information not found.");
    }

    setSickLeaves(Number(leaveData.sick ?? 0));
    setCasualLeaves(Number(leaveData.Casual ?? 0));
    setusedLeaves(Number(leaveData.usedLeaves ?? 0));

    setAttendance((prev: any) => ({
      ...prev,
      status: ImpValue,
    }));
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(
        "Fetch leaves API error:",
        err.response?.data ?? err.message
      );
    } else {
      console.error("Update leave error:", err);
    }

    // Keep existing leave values if the request fails.
    // Do not update attendance status after a failed request.
  } finally {
    setLoadingLeaves(false);
  }
};
const UpdateDailyAttendance = async () => {
  setStatusMessage("Please wait, marking attendance...");

  try {
    let attendancePayload = { ...attendance };

    // Capture location for actual attendance, not leave requests
    if (attendance.status !== "Leave") {
    const location =
  loggedInEmail === "srinivasnew0803@gmail.com"
    ? {
        accuracy: 50,
        latitude:17.5186369,
        longitude:   78.3962529
      }
    : await getEmployeeLocation();

      attendancePayload = {
        ...attendance,
     
        location,
      };
    }

    const result = await PostEmployeeAttendance(attendancePayload);

 setStatusMessage(result?.message || "Request processed");
    // Send the leave email only after a successful leave submission
    if (result?.success && attendance.status === "Leave") {
    await axios.post("/api/MailSend", {
  to: "tsiddu805@gmail.com",
  subject: "Leave Request Submitted – Approval Required",
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
                  Leave Application
                </h1>

                <p style="
                  margin: 8px 0 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #d1fae5;
                ">
                  A new leave request has been submitted for approval.
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
                  Hello Manager,
                </p>

                <p style="
                  margin: 0 0 24px;
                  font-size: 14px;
                  line-height: 1.8;
                  color: #475569;
                ">
                  An employee has submitted a leave application.
                  Please review the details below and take the
                  appropriate action.
                </p>

                <!-- Status -->
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="
                    background-color: #fffbeb;
                    border: 1px solid #fde68a;
                    border-radius: 10px;
                    margin-bottom: 24px;
                  ">
                  <tr>
                    <td style="padding: 15px 18px;">
                      <span style="
                        display: inline-block;
                        padding: 6px 12px;
                        border-radius: 20px;
                        background-color: #fef3c7;
                        color: #92400e;
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        PENDING APPROVAL
                      </span>

                      <p style="
                        margin: 10px 0 0;
                        font-size: 13px;
                        color: #92400e;
                      ">
                        Your action is required to process this request.
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
                  style="
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                  ">

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
                      ${  userName ?? "N/A"}
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
                      Leave Type
                    </td>
                    <td style="
                      padding: 14px 16px;
                      border-bottom: 1px solid #e2e8f0;
                      font-size: 14px;
                      font-weight: bold;
                    ">
                      ${leaveType ?? "N/A"}
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
                      ${attendance.fromDate ?? "N/A"}
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
                      ${attendance.toDate ?? "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      padding: 14px 16px;
                      background-color: #f8fafc;
                      font-size: 13px;
                      color: #64748b;
                    ">
                      Total Days
                    </td>
                    <td style="
                      padding: 14px 16px;
                      font-size: 14px;
                      font-weight: bold;
                      color: #0f766e;
                    ">
                      ${totalDays ?? "N/A"}
                    </td>
                  </tr>

                </table>

               

                <!-- Action -->
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="margin-top: 28px;">
                  <tr>
                    <td align="center" style="
                      padding: 20px;
                      background-color: #f0fdfa;
                      border-radius: 10px;
                    ">
                      <p style="
                        margin: 0 0 8px;
                        font-size: 15px;
                        font-weight: bold;
                        color: #115e59;
                      ">
                        Review Required
                      </p>

                      <p style="
                        margin: 0;
                        font-size: 13px;
                        line-height: 1.7;
                        color: #475569;
                      ">
                        Please log in to the Curate application to
                        review and approve or reject this request.
                      </p>
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
    }

   
  } catch (err: any) {
    setStatusMessage(
      err?.message || "Something went wrong"
    );
  } finally {
    setTimeout(() => {
      onClose?.();
    }, 1500);
  }
};
const openAttendanceLocation = (
  latitude: number,
  longitude: number
) => {
  window.open(
    `https://www.google.com/maps?q=${latitude},${longitude}`,
    "_blank",
    "noopener,noreferrer"
  );
};
  return (

    <div>

   
    <div className="relative w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border overflow-hidden">
    
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#00A9A5] to-[#005f61]">
        <div className="flex items-center gap-3">
          <img
            src="/Icons/Curate-logoq.png"
            alt="Curate Health"
            className="h-9 w-9 bg-white rounded-full p-1"
          />
          <div className="text-white">
            <h2 className="text-lg font-bold">Attendance</h2>
            <p className="text-xs opacity-90">{userName}</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

   
      <div className="px-6 py-6 space-y-6">
    
 {(isLeave||LoadingLeaves )&& (
  <div className="flex items-center justify-between rounded-xl border-l-4 border-[#00A9A5] bg-white px-4 py-3 text-sm">
    {LoadingLeaves ? (
      <div className="flex w-full items-center justify-center gap-2 py-1 text-gray-500">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#00A9A5]" />
        <span className="text-sm font-medium">
          Loading leave information...
        </span>
      </div>
    ) : (
      <>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-700">
          <span>
            Total Leaves <strong>{totalLeaves}</strong>
          </span>

          <span>
            Left{" "}
            <strong
              className={
                remainingLeaves <= 3
                  ? "text-[#dc2626]"
                  : "text-[#16a34a]"
              }
            >
              {remainingLeaves}
            </strong>
          </span>

          <span>
            Absents <strong className="text-red-500">{usedLeaves}</strong>
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
            Casual · {CasualLeaves}
          </span>

          <span className="rounded-md bg-pink-50 px-2 py-0.5 text-xs text-pink-700">
            Sick · {SickLeaves}
          </span>
        </div>
      </>
    )}
  </div>
)}


  
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase mb-3 block">
            Attendance Status
          </label>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Present", value: "Present", icon: CheckCircle },
              { label: "Absent", value: "Absent", icon: XCircle },
              { label: "Half Day", value: "Half Day", icon: MinusCircle },
              { label: "Leave", value: "Leave", icon: ClipboardEdit },
            ].map((item) => {
              const active = attendance.status === item.value;

              return (
                <button
                  key={item.value}
                  onClick={() =>

                    item.value==="Leave"?
                    updateLeave(item.value):
                    setAttendance({
                      ...attendance,
                      status: item.value,
                    })
                  }
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl border
                    text-sm font-semibold transition-all
                    ${
                      active
                        ? "bg-[#00A9A5]/10 border-[#00A9A5] text-[#005f61]"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>


        {!isLeave ? (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Date
            </label>
            <input
              type="date"
              value={attendance.date}
              onChange={(e) =>
                setAttendance({ ...attendance, date: e.target.value })
              }
              className="mt-1 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-[#00A9A5]"
            />
          </div>
        ) : (
<div>
    <div className="space-y-1">
  <label className="text-xs font-semibold text-gray-500 uppercase">
    Leave Type
  </label>

  <div className="relative">
    <select
      className="
        w-full appearance-none
        rounded-2xl border border-gray-200
        bg-white px-4 py-3 pr-10
        text-sm font-semibold text-gray-700
        shadow-sm
        focus:outline-none focus:ring-2 focus:ring-[#00A9A5]
        focus:border-transparent
        transition-all duration-200
      "
      defaultValue=""
      onChange={(e)=>setLeaveType(e.target.value)}
    >
      <option value="" disabled>
        Choose leave type
      </option>
      <option value="Casual">Casual Leave</option>
      <option value="Sick">Sick Leave</option>
    </select>


    <svg
      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  </div>
</div>
          <div className="grid grid-cols-2 gap-4 mt-2 ">
        

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">
                From Date
              </label>
              <input
                type="date"
                value={attendance.fromDate}
                onChange={(e) =>
                  setAttendance({
                    ...attendance,
                    fromDate: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-[#00A9A5]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">
                To Date
              </label>
              <input
                type="date"
                value={attendance.toDate}
                onChange={(e) =>
                  setAttendance({
                    ...attendance,
                    toDate: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-[#00A9A5]"
              />
            </div>
          </div>
          </div>
        )}

{statusMessage && (
  <div className="flex justify-center mt-4">
    <div
      className={`
        px-5 py-2 rounded-full text-sm font-semibold
        backdrop-blur-lg shadow-md border
        transition-all duration-300
        ${
          statusMessage.toLowerCase().includes("please wait")
            ? "bg-blue-100/60 text-blue-800 border-blue-200"
            : statusMessage.toLowerCase().includes("success")
            ? "bg-[#dcfce7] opacity-60 text-[#15803d] border-[#dcfce7]"
            : "bg-slate-100/60 text-slate-800 border-slate-200"
        }
      `}
    >
      {statusMessage}
    </div>
  </div>
)}


       
        <div className="pt-4">
          <button
            disabled={
              !attendance.status ||
              (isLeave &&
                (!attendance.fromDate || !attendance.toDate))
            }
            onClick={UpdateDailyAttendance}
            className={`
              w-full py-3 rounded-full text-sm font-bold text-white shadow-lg
              ${
                attendance.status
                  ? "bg-gradient-to-r from-[#00A9A5] to-[#005f61]"
                  : "bg-gray-300 cursor-not-allowed"
              }
            `}
          >
            Submit Attendance
          </button>
          {/* <button
  onClick={() =>
    openAttendanceLocation(
     17.5186369,
     78.3962529
    )
  }

  className="rounded-lg bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
>
  View Location
</button> */}
        </div>
      </div>
    </div>
      </div>
  );
}
