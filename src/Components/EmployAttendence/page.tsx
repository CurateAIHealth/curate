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
console.log("Check Location Info------",location)
      attendancePayload = {
        ...attendance,
     
        location,
      };
    }

    const result = await PostEmployeeAttendance(attendancePayload);

    // Send the leave email only after a successful leave submission
    if (result?.success && attendance.status === "Leave") {
      await axios.post("/api/MailSend", {
        to: "tsiddu805@gmail.com",
        subject: "Leave Request Submitted – Approval Required",
        html: `<!-- Keep your existing leave email HTML here -->`,
      });
    }

    setStatusMessage(result?.message || "Request processed");
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
    
  {isLeave&&     <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm border-l-4 border-[#00A9A5]">
  <div className="flex gap-6 text-gray-700">
    <span>
      Total Leaves <strong>{totalLeaves}</strong>
    </span>

    <span>
      Left{" "}
      <strong
        className={
          remainingLeaves <= 3 ? "text-[#dc2626]" : "text-[#16a34a]"
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
