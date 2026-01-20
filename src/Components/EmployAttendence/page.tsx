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

interface AttendanceProps {
  userId: string;
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
 SickLeaves,
  CasualLeaves,
  usedLeaves,
}: AttendanceProps) {
  const [attendance, setAttendance] = useState<any>({
    userId,
    userName,
    status: "",
    date: new Date().toISOString().split("T")[0],
    fromDate: "",
    toDate: "",
  });
const[statusMessage,setStatusMessage]=useState<any>()
  const isLeave = attendance.status === "Leave";
  const totalLeaves=SickLeaves+CasualLeaves
  const remainingLeaves = totalLeaves - usedLeaves;

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


  const UpdateDailyAttendance = async () => {
  setStatusMessage("Please wait, marking attendance...");

  try {
    const result = await PostEmployeeAttendance(attendance);
    if(result?.message !=="A leave request for the selected dates is already submitted and pending approval."){
await axios.post("/api/MailSend", {
  to: "tsiddu805@gmail.com",
  subject: "Leave Request Submitted – Approval Required",
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Leave Request</title>
</head>

<body style="margin:0; padding:0; background:#f8fafc; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:50px 12px;">

        <!-- CARD -->
        <table width="640" cellpadding="0" cellspacing="0"
          style="
            background:#ffffff;
            border-radius:24px;
            box-shadow:0 24px 60px rgba(15,23,42,0.15);
            overflow:hidden;
          ">

          <!-- 🚀 NEW HEADER (INDIGO HERO) -->
          <tr>
            <td style="padding:0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td
                    align="center"
                    style="
                      background:linear-gradient(145deg, #1e293b, #334155);
                      padding:60px 28px 56px;
                    "
                  >
                    <!-- Logo -->
                    <img
                      src="https://curate-pearl.vercel.app/Icons/UpdateCurateLogo.png"
                      alt="Curate Health Care"
                      style="
                        height:44px;
                        display:block;
                        margin:0 auto 20px;
                      "
                    />

                    <!-- Title -->
                    <div
                      style="
                        color:#f8fafc;
                        font-size:22px;
                        font-weight:800;
                        letter-spacing:0.8px;
                        margin-bottom:14px;
                      "
                    >
                      Leave Request
                    </div>

                    <!-- Badge -->
                    <div
                      style="
                        display:inline-block;
                        padding:6px 16px;
                        background:#38bdf8;
                        border-radius:999px;
                        color:#0f172a;
                        font-size:13px;
                        font-weight:700;
                        letter-spacing:0.4px;
                      "
                    >
                      ACTION REQUIRED
                    </div>
                  </td>
                </tr>

                <!-- Smooth Cut -->
                <tr>
                  <td
                    style="
                      height:28px;
                      background:#ffffff;
                      border-top-left-radius:24px;
                      border-top-right-radius:24px;
                      position:relative;
                      top:-24px;
                    "
                  ></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:44px 44px 34px;">

              <h1
                style="
                  margin:0 0 14px;
                  color:#0f172a;
                  font-size:28px;
                  font-weight:800;
                "
              >
                New Leave Request 📩
              </h1>

              <p
                style="
                  margin:0 0 36px;
                  color:#475569;
                  font-size:15px;
                  line-height:1.8;
                "
              >
                A new leave request has been submitted and is awaiting your review and approval.
              </p>

              <!-- INFO CARD -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="
                  background:#eff6ff;
                  border:1px solid #bfdbfe;
                  border-radius:18px;
                  margin-bottom:34px;
                ">
                <tr>
                  <td style="padding:26px 28px;">
                    <p style="margin:0 0 14px; font-size:15px; color:#0f172a;">
                      <strong>Employee Name:</strong> ${userName}
                    </p>
                    <p style="margin:0 0 14px; font-size:15px; color:#0f172a;">
                      <strong>Leave From:</strong> ${attendance.fromDate}
                    </p>
                    <p style="margin:0 0 14px; font-size:15px; color:#0f172a;">
                      <strong>Leave To:</strong> ${attendance.toDate}
                    </p>
                    <p style="margin:0; font-size:15px; color:#0f172a;">
                      <strong>Total Days:</strong> ${totalDays}
                    </p>
                  </td>
                </tr>
              </table>

              <p
                style="
                  margin:0 0 22px;
                  color:#64748b;
                  font-size:14px;
                  line-height:1.7;
                "
              >
                Please review the request and take the necessary action at the earliest.
              </p>

              <p style="margin:0; color:#334155; font-size:14px;">
                Regards,<br />
                <strong>Curate Health Care System</strong>
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td
              style="
                background:#f1f5f9;
                padding:20px;
                text-align:center;
                border-top:1px solid #e2e8f0;
              "
            >
              <p style="margin:0; font-size:12px; color:#64748b;">
                © ${new Date().getFullYear()} Curate Health Care Services. All rights reserved.
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
    setStatusMessage(result?.message || "Request processed");
  } catch (err) {
    setStatusMessage("Something went wrong");
  } finally {
   
    setTimeout(() => {
      onClose?.();
    }, 1500); 
  }
};

  return (
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
    
  {isLeave&&     <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm border-l-4 border-[#00A9A5]">
  <div className="flex gap-6 text-gray-700">
    <span>
      Total Leaves <strong>{totalLeaves}</strong>
    </span>

    <span>
      Left{" "}
      <strong
        className={
          remainingLeaves <= 3 ? "text-red-600" : "text-green-600"
        }
      >
        {remainingLeaves}
      </strong>
    </span>

    <span>
      Absents <strong className="text-red-500">{usedLeaves}</strong>
    </span>
  </div>

  <div className="flex gap-2">
    <span className="px-2 py-0.5 rounded-md text-xs bg-blue-50 text-blue-700">
      Casual · {CasualLeaves}
    </span>
    <span className="px-2 py-0.5 rounded-md text-xs bg-pink-50 text-pink-700">
      Sick · {SickLeaves}
    </span>
  </div>
</div>}


  
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
            ? "bg-green-100/60 text-green-800 border-green-200"
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
        </div>
      </div>
    </div>
  );
}
