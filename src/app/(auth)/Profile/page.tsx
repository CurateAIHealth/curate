"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  ClipboardList,
  Clock,
  IndianRupee,
  LogOut,
  User,
  UserCircle,
} from "lucide-react";
import UpdateAttendance from "../Attendence/page";
import { GetUserInformation } from "@/Lib/user.action";
import { useRouter } from "next/navigation";

/* ---------------- HELPERS ---------------- */

function getDutyStatus(status: string) {
  switch (status) {
    case "P":
      return { label: "On Duty", color: "bg-[#50c896]/10 text-[#50c896]" };
    case "HP":
      return { label: "Partial Duty", color: "bg-[#1392d3]/10 text-[#1392d3]" };
    case "A":
      return { label: "Off Duty", color: "bg-[#ff1493]/10 text-[#ff1493]" };
    default:
      return {
        label: "Attendance Not Marked",
        color: "bg-gray-100 text-gray-600",
      };
  }
}



export default function HCPHome() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showHostelInfo, setShowHostelInfo] = useState(false);
  const [showNetPay, setShowNetPay] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);

  const router=useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId =
          typeof window !== "undefined"
            ? localStorage.getItem("UserId")
            : null;

        if (!userId) return;

        const res = await GetUserInformation(userId);
        setUserInfo(res);
      } catch (error) {
        console.error("User fetch failed", error);
      }
    };

    fetchUser();
  }, []);



  const attendanceStatus = "P";
  const duty = getDutyStatus(attendanceStatus);

  const grossEarnings = userInfo?.monthlyEarnings ?? 42000;

  const hostelInfo = {
    hostelName: "Curate Staff Hostel – Madhapur",
    days: userInfo?.hostelDays ?? 18,
    perDay: userInfo?.hostelPerDay ?? 250,
  };

  const hostelApplicable =
    !userInfo?.workStatus?.placement &&
    !userInfo?.workStatus?.training;

  const hostelDeduction = hostelApplicable
    ? hostelInfo.days * hostelInfo.perDay
    : 0;

  const netPay = grossEarnings - hostelDeduction;

 const handleLogout = async () => {
    localStorage.removeItem("UserId");
   
    router.push("/");
  };

  return (
    <>
   
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/Icons/Curate-logoq.png"
              alt="Curate Logo"
              className="h-10"
            />
            <span className="hidden sm:block text-lg font-extrabold text-[#1392d3]">
              Curate Healthcare
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-600" />
            <UserCircle className="w-7 h-7 text-gray-600" />
            <button
                          onClick={handleLogout}
                          className="flex items-center cursor-pointer gap-2 px-3 sm:px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-lg sm:rounded-xl font-semibold shadow-lg transition-all duration-150 text-sm sm:text-base"
                        >
                          <LogOut size={18} className="flex-shrink-0" />
                          <span className="hidden xs:inline">Logout</span>
                        </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
       
        <div className="bg-white rounded-2xl p-5 shadow border flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#50c896]">
              Welcome, {userInfo?.FirstName} {userInfo?.LastName}
            </h1>
            <p className="text-sm text-gray-500 capitalize">
              {userInfo?.userType?.replace("-", " ")}
            </p>
          </div>

            <span
            className={`px-4 py-1 rounded-full text-sm font-semibold w-fit
              flex items-center justify-center whitespace-nowrap
              ${duty.color}`}
          >
            {duty.label}
          </span>
        </div>

       
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Assignments" value="3" icon={<ClipboardList />} color="#1392d3" />
          <StatCard title="Completed Visits" value="28" icon={<User />} color="#50c896" />
          <StatCard title="Monthly Earnings" value={`₹${grossEarnings}`} icon={<IndianRupee />} color="#ff1493" />
          <StatCard title="Pending Payments" value="₹8,000" icon={<Clock />} color="#ff1493" />
        </div>


        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ActionButton label="Mark Attendance" active={showAttendance}
            onClick={() => {
              setShowAttendance(!showAttendance);
              setShowHostelInfo(false);
              setShowNetPay(false);
            }}
          />

          <ActionButton label="View Timesheet" onClick={() => {}} />

          <ActionButton label="Hostel Info" active={showHostelInfo}
            onClick={() => {
              setShowHostelInfo(!showHostelInfo);
              setShowAttendance(false);
              setShowNetPay(false);
            }}
          />

          <ActionButton label="Net Pay" active={showNetPay}
            onClick={() => {
              setShowNetPay(!showNetPay);
              setShowAttendance(false);
              setShowHostelInfo(false);
            }}
          />
        </div>

        {showAttendance && <UpdateAttendance />}


        {showHostelInfo && hostelApplicable && (
          <div className="bg-white rounded-2xl p-5 shadow border">
            <h2 className="text-lg font-bold text-[#1392d3] mb-4">
              Hostel Information
            </h2>

            <InfoRow label="Hostel Name" value={hostelInfo.hostelName} />
            <InfoRow label="Days Stayed" value={`${hostelInfo.days} days`} />
            <InfoRow label="Charge / Day" value={`₹${hostelInfo.perDay}`} />

            <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
              <span>Total Deduction</span>
              <span className="text-[#ff1493]">₹{hostelDeduction}</span>
            </div>
          </div>
        )}


        {showNetPay && (
          <div className="bg-white rounded-2xl p-5 shadow border">
            <h2 className="text-lg font-bold text-[#1392d3] mb-4">
              Payment Summary
            </h2>

            <InfoRow label="Gross Earnings" value={`₹${grossEarnings}`} />
            <InfoRow label="Hostel Deduction" value={`- ₹${hostelDeduction}`} highlight />

            <div className="border-t mt-3 pt-3 flex justify-between text-lg font-extrabold">
              <span>Net Pay</span>
              <span className="text-[#50c896]">₹{netPay}</span>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white rounded-xl p-4 shadow border">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-extrabold" style={{ color }}>
            {value}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={highlight ? "text-[#ff1493] font-semibold" : "text-gray-800"}>
        {value}
      </span>
    </div>
  );
}

function ActionButton({ label, onClick, active }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl p-4 text-sm font-semibold border transition
        ${
          active
            ? "border-[#ff1493] text-[#ff1493] bg-[#ff1493]/5"
            : "bg-white border-gray-200 hover:border-[#ff1493] hover:text-[#ff1493]"
        }`}
    >
      {label}
    </button>
  );
}
