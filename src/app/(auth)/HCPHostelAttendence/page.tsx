"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  PauseCircle,
  Home,
} from "lucide-react";
import { PostHostelAttendence } from "@/Lib/user.action";
import { useRouter } from "next/navigation";



type Status = "PRESENT" | "ABSENT" | "LEAVE" | null;

export default function HCADailyCheckInUI() {
  const [status, setStatus] = useState<any>(null);
 const [stausMessage,setstausMessage]=useState<any>(null)
  const cards = [
    {
      value: "Pending",
      title: "I stayed in the hostel",
      subtitle: "Checked in for today",
      icon: CheckCircle2,
      gradient: "from-emerald-400 to-teal-500",
      glow: "shadow-emerald-200/50",
    },
    {
      value: "Absent",
      title: "I was away today",
      subtitle: "Not in the hostel",
      icon: XCircle,
      gradient: "from-rose-400 to-pink-500",
      glow: "shadow-rose-200/50",
    },
    {
      value: "Leave",
      title: "I’m on approved leave",
      subtitle: "Leave applied",
      icon: PauseCircle,
      gradient: "from-amber-400 to-orange-500",
      glow: "shadow-amber-200/50",
    },
  ];
  const router=useRouter()
const UpdateAttendance=async()=>{
    try{

const selectedDate=new Date().toISOString().split("T")[0]

const res = await PostHostelAttendence("b6cafc1b-eade-49fc-8830-5ef5e97bc9ca", "Priya Reddy", status,selectedDate);
  if (res.success) {
    setstausMessage("Attendance marked successfully ✅");
    return;
  }

  if (res.warning) {
    setstausMessage("⚠️ Attendance already marked for Selected Day");
    return;
  }

  setstausMessage("❌ Failed to mark attendance");

    }catch(err:any){

    }

}
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
    
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-22 h-22 p-4 rounded-full  text-white shadow-lg">
        <img src='Icons/Curate-logoq.png' onClick={()=>router.push("/DashBoard")}  alt="CurateLogo"/>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Hostel Daily Check-In
          </h1>
          <p className="text-sm text-gray-500">
            Confirm your hostel stay for today
          </p>
   {stausMessage && (
        <p
  className={`
    mt-2 px-4 py-2 rounded-lg text-sm font-medium w-fit
    ${stausMessage?.includes("successfully") && "bg-green-100 text-green-700 border border-green-300"}
    ${stausMessage?.includes("already") && "bg-yellow-100 text-yellow-700 border border-yellow-300"}
    ${stausMessage?.includes("Failed") && "bg-red-100 text-red-700 border border-red-300"}
  `}
>
  {stausMessage}
</p>
)}
        </div>

  
        <div className="space-y-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const active = status === card.value;

            return (
              <button
                key={card.value}
                onClick={() => setStatus(card.value as Status)}
                className={`relative w-full rounded-2xl p-4 transition-all duration-300 text-left
                  ${
                    active
                      ? `bg-gradient-to-r ${card.gradient} text-white shadow-xl ${card.glow} scale-[1.02]`
                      : "bg-white shadow-md hover:shadow-lg"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl
                      ${
                        active
                          ? "bg-white/20"
                          : "bg-slate-100 text-gray-600"
                      }`}
                  >
                    <Icon size={26} />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-base">
                      {card.title}
                    </p>
                    <p
                      className={`text-sm ${
                        active
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      {card.subtitle}
                    </p>
                  </div>

                  {active && (
                    <span className="absolute top-3 right-3 text-xs font-medium bg-white/25 px-3 py-1 rounded-full">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

   
        <button
          disabled={!status}
          onClick={UpdateAttendance}
          className={`w-full py-4 rounded-2xl text-lg font-semibold transition
            ${
              status
                ? "bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
                : "bg-indigo-200 text-white cursor-not-allowed"
            }`}
        >
          Confirm Check-In
        </button>

  
        <p className="text-xs text-center text-gray-400">
          Attendance can be updated once per day
        </p>
      </div>
    </div>
  );
}
