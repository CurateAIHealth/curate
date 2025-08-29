"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Status = "Present" | "Absent" | "Leave" | "Holiday";

export default function AttendanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());


  const [attendance, setAttendance] = useState<Record<number, Status>>({
    3: "Leave",
    5: "Absent",
    7: "Holiday",
    10: "Leave",
    15: "Holiday",
    18: "Absent",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();


  const totals = {
    Present: 0,
    Absent: 0,
    Leave: 0,
    Holiday: 0,
  };
  for (let i = 1; i <= daysInMonth; i++) {
    const status = attendance[i] || "Present";
    totals[status]++;
  }

  const colors: Record<Status, string> = {
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-400 text-red-700",
    Leave: "bg-yellow-100 text-yellow-700",
    Holiday: "bg-blue-100 text-blue-700",
  };

  const statuses: Status[] = ["Present", "Absent", "Leave", "Holiday"];

 
  const handleDayClick = (day: number) => {
    const currentStatus = attendance[day] || "Present";
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const newStatus = statuses[nextIndex];

    setAttendance((prev) => ({
      ...prev,
      [day]: newStatus,
    }));
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl ">
  
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft />
        </button>
        <h2 className="text-xl font-bold">{monthName}</h2>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronRight />
        </button>
      </div>

    
      <div className="grid grid-cols-7 gap-3 mb-4">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const status = attendance[day] || "Present";
          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`flex flex-col items-center justify-center h-9 rounded-lg cursor-pointer transition ${colors[status]} text-xs`}
              title={`Click to change status (Current: ${status})`}
            >
              <span>{day}</span>
              <span className="text-xs">{status}</span>
            </div>
          );
        })}
      </div>

  
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="h-11 rounded-lg bg-green-100 text-center">
          <p className="text-md font-bold text-green-700">{totals.Present}</p>
          <p className="text-xs">Present</p>
        </div>
        <div className="h-11 rounded-lg bg-green-100 text-center">
          <p className="text-md font-bold text-red-700">{totals.Absent}</p>
          <p className="text-xs">Absent</p>
        </div>
        <div className="h-11 rounded-lg bg-green-100 text-center">
          <p className="text-md font-bold text-yellow-700">{totals.Leave}</p>
          <p className="text-xs">Leave</p>
        </div>
        <div className="h-11   rounded-lg bg-green-100 text-center">
          <p className="text-md font-bold text-blue-700">{totals.Holiday}</p>
          <p className="text-xs">Holiday</p>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-gray-500">
  💡 Tip: Click on any day to edit its attendance status. 
  The status will cycle through <span className="font-medium">Present → Absent → Leave → Holiday</span>.
</p>
    </div>
  );
}
