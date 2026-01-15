"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  MinusCircle,
  ClipboardEdit,
  PhoneCall,
  X,
} from "lucide-react";

interface AttendanceProps {
  userId: string;
  userName: string;
  onSubmit: (data: any) => void;
  onClose?: () => void;
}

export default function MarkAttendance({
  userId,
  userName,
  onSubmit,
  onClose,
}: AttendanceProps) {
  const [attendance, setAttendance] = useState({
    userId,
    date: new Date().toISOString().split("T")[0],
    status: "",
  });

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
            <h2 className="text-lg font-bold leading-tight">
              Daily Attendance
            </h2>
            <p className="text-xs opacity-90">{userName}</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
          >
            <X size={18} />
          </button>
        )}
      </div>


      <div className="px-6 py-6 space-y-6">
   
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Date
          </label>
          <input
            type="date"
            
            onChange={(e) =>
              setAttendance({ ...attendance, date: e.target.value })
            }
            className="
              mt-1 w-full rounded-xl border px-4 py-3
              text-sm font-medium
              focus:ring-2 focus:ring-[#00A9A5]
              focus:border-transparent
              outline-none
            "
          />
        </div>

        
    
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
                    setAttendance({ ...attendance, status: item.value })
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


        <div className="pt-4">
          <button
            disabled={!attendance.status}
            onClick={() => {
              onSubmit(attendance);
              onClose?.();
            }}
            className={`
              w-full py-3 rounded-full
              text-sm font-bold text-white
              shadow-lg transition-all
              ${
                attendance.status
                  ? "bg-gradient-to-r from-[#00A9A5] to-[#005f61] hover:scale-[1.02]"
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
