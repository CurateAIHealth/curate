"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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

const employeeRoster: Employee[] = [
  { UserId: "TEST001", EmployeeName: "Srinivas", Area: "Hitech City", Latitude: 17.4435, Longitude: 78.3772 },
  { UserId: "TEST002", EmployeeName: "Ramesh Kumar", Area: "Gachibowli", Latitude: 17.4401, Longitude: 78.3489 },
  { UserId: "TEST003", EmployeeName: "Priya Sharma", Area: "Secunderabad", Latitude: 17.4399, Longitude: 78.4983 },
  { UserId: "TEST004", EmployeeName: "Anil Kumar", Area: "Kukatpally", Latitude: 17.4948, Longitude: 78.3996 },
  { UserId: "TEST005", EmployeeName: "Sneha Reddy", Area: "Miyapur", Latitude: 17.4968, Longitude: 78.3565 },
  { UserId: "TEST006", EmployeeName: "Vijay Kumar", Area: "Charminar", Latitude: 17.3616, Longitude: 78.4747 },
  { UserId: "TEST007", EmployeeName: "Lakshmi Devi", Area: "LB Nagar", Latitude: 17.3457, Longitude: 78.5522 },
  { UserId: "TEST008", EmployeeName: "Kiran Reddy", Area: "Begumpet", Latitude: 17.4435, Longitude: 78.4676 },
  { UserId: "TEST009", EmployeeName: "Pooja Singh", Area: "Madhapur", Latitude: 17.4483, Longitude: 78.3915 },
  { UserId: "TEST010", EmployeeName: "Mahesh Babu", Area: "Kondapur", Latitude: 17.4616, Longitude: 78.3647 },
  { UserId: "TEST011", EmployeeName: "Divya Rao", Area: "Uppal", Latitude: 17.4058, Longitude: 78.5591 },
  { UserId: "TEST012", EmployeeName: "Naveen Raju", Area: "Mehdipatnam", Latitude: 17.3949, Longitude: 78.4439 },
  { UserId: "TEST013", EmployeeName: "Swathi Reddy", Area: "Ameerpet", Latitude: 17.4375, Longitude: 78.4483 },
  { UserId: "TEST014", EmployeeName: "Arjun Varma", Area: "Banjara Hills", Latitude: 17.4126, Longitude: 78.4482 },
  { UserId: "TEST015", EmployeeName: "Keerthi Nair", Area: "Jubilee Hills", Latitude: 17.4316, Longitude: 78.407 },
  { UserId: "TEST016", EmployeeName: "Rahul Verma", Area: "Dilsukhnagar", Latitude: 17.3688, Longitude: 78.5247 },
  { UserId: "TEST017", EmployeeName: "Mounika", Area: "Manikonda", Latitude: 17.405, Longitude: 78.383 },
  { UserId: "TEST018", EmployeeName: "Imran Khan", Area: "Tolichowki", Latitude: 17.4008, Longitude: 78.4325 },
  { UserId: "TEST019", EmployeeName: "Harish Goud", Area: "Kompally", Latitude: 17.54, Longitude: 78.488 },
  { UserId: "TEST020", EmployeeName: "Farah Begum", Area: "Shamshabad", Latitude: 17.202, Longitude: 78.3957 },
];

function getLocalDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function makeTestAttendance(date: string): EmployeeAttendance[] {
  return employeeRoster.map((employee, index) => {
    const pattern = index % 10;
    const status: "Present" | "Absent" | "Leave" | undefined =
      pattern === 3 || pattern === 8 ? "Absent" : pattern === 5 ? "Leave" : pattern === 6 ? undefined : "Present";
    const hasLocation = status === "Present";
    const hour = 8 + (index % 3);
    const minute = (index * 7) % 60;
    const capturedAt = `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+05:30`;
    const checkoutHour = 17 + (index % 3);
    const checkoutMinute = (index * 11) % 60;
    const checkoutAt = `${date}T${String(checkoutHour).padStart(2, "0")}:${String(checkoutMinute).padStart(2, "0")}:00+05:30`;

    return {
      UserId: employee.UserId,
      EmployeeName: employee.EmployeeName,
      Area: employee.Area,
      AttendanceDate: date,
      ...(status ? { Status: status } : {}),
      ...(hasLocation
        ? {
            Location: {
              Latitude: employee.Latitude,
              Longitude: employee.Longitude,
              Accuracy: 10 + (index % 35),
              CapturedAt: capturedAt,
            },
            CreatedAt: capturedAt,
            CheckoutAt: checkoutAt,
            ApprovalStatus: (index % 4 === 0 ? "Pending" : "Approved") as "Pending" | "Approved",
          }
        : status === "Leave"
          ? { ApprovalStatus: "Pending" as const, CreatedAt: capturedAt }
          : status === "Absent"
          ? { Location: null, ApprovalStatus: "Approved" as const, CreatedAt: capturedAt }
          : {}),
    };
  });
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
  const [leaveDecisions, setLeaveDecisions] = useState<Record<string, "Approved" | "Rejected">>({});
const router=useRouter()
  const employees = useMemo(() => makeTestAttendance(selectedDate), [selectedDate]);
  const selectedDateObj = new Date(`${selectedDate}T12:00:00`);
  const selectedMonth = selectedDateObj.getMonth();
  const selectedYear = selectedDateObj.getFullYear();

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

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {[
            { label: "Total employees", value: summary.total, tone: "text-slate-900", mark: "👥" },
            { label: "Present", value: summary.present, tone: "text-emerald-700", mark: "✓" },
            { label: "Absent", value: summary.absent, tone: "text-rose-700", mark: "×" },
            { label: "Not marked", value: summary.notMarked, tone: "text-slate-700", mark: "—" },
            { label: "Locations captured", value: summary.locations, tone: "text-blue-700", mark: "⌖" },
            { label: "Pending approval", value: summary.pending, tone: "text-amber-700", mark: "◷" },
          ].map((item) => <div key={item.label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium leading-5 text-slate-500 sm:text-sm">{item.label}</p><span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500 sm:flex">{item.mark}</span></div><p className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${item.tone}`}>{item.value}</p></div>)}
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex min-w-0 flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0"><h2 className="font-semibold text-slate-900">Employee list</h2><p className="mt-1 text-sm text-slate-500">Attendance for {selectedDateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p></div>
            <select aria-label="Filter attendance status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm sm:w-48"><option value="All">All statuses</option><option value="Present">Present</option><option value="Absent">Absent</option><option value="Leave">Leave</option><option value="Not marked">Not marked</option></select>
          </div>

          {filteredEmployees.length === 0 ? <div className="p-10 text-center"><p className="font-medium text-slate-800">No employees found</p><p className="mt-1 text-sm text-slate-500">Try another search or status filter.</p></div> : (
            <>
              {/* Responsive employee cards avoid clipped columns in narrow dialogs and side panels. */}
              <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredEmployees.map((employee) => {
                  const coordinates = getCoordinates(employee.Location);
                  const status = employee.Status || "Not marked";
                  return <article key={employee.UserId} className="flex h-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">{employee.EmployeeName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
                        <div className="min-w-0"><h3 className="truncate font-semibold text-slate-900">{employee.EmployeeName}</h3><p className="mt-0.5 text-xs text-slate-500">{employee.UserId}</p></div>
                      </div>
                      <StatusBadge status={status} />
                    </div>
                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="min-w-0"><p className="text-xs text-slate-500">Check-in</p><p className="mt-1 text-sm font-medium text-slate-800">{formatTime(employee.Location?.CapturedAt || employee.CreatedAt)}</p></div>
                        <div className="min-w-0"><p className="text-xs text-slate-500">Check-out</p><p className="mt-1 text-sm font-medium text-slate-800">{formatTime(employee.CheckoutAt)}</p></div>
                      </div>
                    </div>
                    {employee.Status === "Leave" && (() => {
                      const decisionKey = `${selectedDate}:${employee.UserId}`;
                      const decision = leaveDecisions[decisionKey];
                      return <div className="mt-3 flex items-center gap-2" aria-label="Leave approval">
                        {decision ? <StatusBadge status={decision} /> : <>
                          <button type="button" onClick={() => setLeaveDecisions((current) => ({ ...current, [decisionKey]: "Approved" }))} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700">Approve</button>
                          <button type="button" onClick={() => setLeaveDecisions((current) => ({ ...current, [decisionKey]: "Rejected" }))} className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700">Reject</button>
                        </>}
                      </div>;
                    })()}
                    <div className="mt-auto flex min-w-0 items-center justify-between gap-3 pt-4">
                     
                      {coordinates && <button type="button" onClick={() => openLocation(employee)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"><span aria-hidden="true">⌖</span> View map</button>}
                    </div>
                  </article>;
                })}
              </div>
              </>
          )}
        </section>
        </div>
    </main>
  );
}
