'use client'
import { GetHostelAttendenceData } from "@/Lib/user.action";
import { useState, useEffect } from "react";

export function AttendanceCalendarModal({ user, onClose }: any) {
  const [month, setMonth] = useState(new Date());
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const res: any = await GetHostelAttendenceData();
      const userDoc = res?.data?.find(
        (u: any) => u.UserId === user.UserId
      );
      setAttendance(userDoc?.attendance || []);
    };
    fetchAttendance();
  }, [user]);

  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();

  const getStatus = (day: number) => {
    const date = `${month.getFullYear()}-${String(
      month.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return attendance.find((a: any) => a.date === date)?.status;
  };
const monthKey = `${month.getFullYear()}-${String(
  month.getMonth() + 1
).padStart(2, "0")}`;

const monthlyStats = attendance
  .filter((a: any) => a.date.startsWith(monthKey))
  .reduce(
    (acc: any, cur: any) => {
      if (cur.status === "Present") acc.present += 1;
      else if (cur.status === "Absent") acc.absent += 1;
      else acc.leave += 1; 
      return acc;
    },
    { present: 0, absent: 0, leave: 0 }
  );

  const statusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Absent":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">
            {user.Name} – Monthly Attendance
          </h3>
          <button onClick={onClose} className="text-xl">✖</button>
        </div>

<div className="flex gap-3 mb-4">
  <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-3 text-center">
    <p className="text-sm text-green-700 font-semibold">Present</p>
    <p className="text-xl font-bold text-green-800">
      {monthlyStats.present}
    </p>
  </div>

  <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
    <p className="text-sm text-red-700 font-semibold">Absent</p>
    <p className="text-xl font-bold text-red-800">
      {monthlyStats.absent}
    </p>
  </div>

  <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
    <p className="text-sm text-blue-700 font-semibold">Leaves</p>
    <p className="text-xl font-bold text-blue-800">
      {monthlyStats.leave}
    </p>
  </div>
</div>




    
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() =>
              setMonth(
                new Date(month.getFullYear(), month.getMonth() - 1)
              )
            }
          >
            ◀
          </button>
          <p className="font-semibold">
            {month.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <button
            onClick={() =>
              setMonth(
                new Date(month.getFullYear(), month.getMonth() + 1)
              )
            }
          >
            ▶
          </button>
        </div>

     
        <div className="grid grid-cols-7 gap-2">
          {[...Array(daysInMonth)].map((_, i) => {
            const status = getStatus(i + 1);
            return (
              <div
                key={i}
                className={`p-2 rounded-lg text-center text-xs font-semibold ${statusColor(
                  status
                )}`}
              >
                <p>{i + 1}</p>
                <p>{status || "NA"}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
