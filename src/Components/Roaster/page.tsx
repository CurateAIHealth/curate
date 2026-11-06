"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Save,
  Trash2,
  UserRound,
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
  Search,
  RotateCcw,
} from "lucide-react";

 interface StaffOption {
  id: string;
  name: string;
  designation?: string;
  profileImage?: string;
}

 interface RosterEntry {
  Date: string;
  Day: "Sunday";
  StaffId: string;
  StaffName: string;
  CompOffDate: string;
}

 interface SundayDutyRosterProps {
  isOpen: boolean;
  onClose: () => void;

  staffList: StaffOption[];

  initialRoster?: RosterEntry[];

  initialMonth?: number;
  initialYear?: number;

  onSave: (
    month: number,
    year: number,
    entries: RosterEntry[]
  ) => Promise<void>;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateString: string) => {
  if (!dateString) return "Not selected";

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getSundays = (month: number, year: number): string[] => {
  const dates: string[] = [];

  const lastDay = new Date(year, month, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month - 1, day);

    if (date.getDay() === 0) {
      dates.push(formatDate(date));
    }
  }

  return dates;
};

const getEmptyEntry = (date: string): RosterEntry => ({
  Date: date,
  Day: "Sunday",
  StaffId: "",
  StaffName: "",
  CompOffDate: "",
});

export default function SundayDutyRoster({
  isOpen,
  onClose,
  staffList,
  initialRoster = [],
  initialMonth,
  initialYear,
  onSave,
}: SundayDutyRosterProps) {
  const today = new Date();

  const [month, setMonth] = useState(
    initialMonth ?? today.getMonth() + 1
  );

  const [year, setYear] = useState(
    initialYear ?? today.getFullYear()
  );

  const [entries, setEntries] = useState<RosterEntry[]>([]);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const sundays = useMemo(
    () => getSundays(month, year),
    [month, year]
  );

  // Load the roster whenever the selected month changes
  // or the parent provides updated roster data.
  useEffect(() => {
    if (!isOpen) return;

    const existingEntries = new Map(
      initialRoster.map((entry) => [entry.Date, entry])
    );

    const generatedEntries = getSundays(month, year).map(
      (date) => existingEntries.get(date) ?? getEmptyEntry(date)
    );

    setEntries(generatedEntries);
    setError("");
    setSuccess(false);
    setEditingDate(null);
  }, [isOpen, month, year, initialRoster]);

  // Month navigation
  const changeMonth = (direction: number) => {
    const nextDate = new Date(year, month - 1 + direction, 1);

    setMonth(nextDate.getMonth() + 1);
    setYear(nextDate.getFullYear());
    setSearch("");
  };

  // Assign staff to a Sunday
  const handleStaffChange = (
    date: string,
    staffId: string
  ) => {
    const selectedStaff = staffList.find(
      (staff) => staff.id === staffId
    );

    if (
      selectedStaff &&
      entries.some(
        (entry) =>
          entry.Date !== date &&
          entry.StaffId === staffId
      )
    ) {
      setError(
        `${selectedStaff.name} is already assigned to another Sunday this month.`
      );
      return;
    }

    setError("");

    setEntries((previous) =>
      previous.map((entry) =>
        entry.Date === date
          ? {
              ...entry,
              StaffId: selectedStaff?.id ?? "",
              StaffName: selectedStaff?.name ?? "",
            }
          : entry
      )
    );
  };

  // Update Comp-off date
  const handleCompOffChange = (
    date: string,
    compOffDate: string
  ) => {
    setEntries((previous) =>
      previous.map((entry) =>
        entry.Date === date
          ? { ...entry, CompOffDate: compOffDate }
          : entry
      )
    );
  };

  // Clear individual assignment
  const clearEntry = (date: string) => {
    setEntries((previous) =>
      previous.map((entry) =>
        entry.Date === date ? getEmptyEntry(date) : entry
      )
    );

    setError("");
    setEditingDate(null);
  };

  // Restore all entries from initial data
  const resetRoster = () => {
    const existingEntries = new Map(
      initialRoster.map((entry) => [entry.Date, entry])
    );

    setEntries(
      sundays.map(
        (date) => existingEntries.get(date) ?? getEmptyEntry(date)
      )
    );

    setError("");
    setSuccess(false);
  };

  const assignedCount = entries.filter(
    (entry) => entry.StaffId
  ).length;

  const unassignedCount = entries.length - assignedCount;

  const filteredEntries = entries.filter((entry) => {
    const staff = staffList.find(
      (item) => item.id === entry.StaffId
    );

    return (
      !search ||
      staff?.name.toLowerCase().includes(search.toLowerCase()) ||
      formatDisplayDate(entry.Date)
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  // Validate and save
  const handleSave = async () => {
    setError("");
    setSuccess(false);

    if (!entries.length) {
      setError("No Sundays found for this month.");
      return;
    }

    const incomplete = entries.filter(
      (entry) => entry.StaffId && !entry.CompOffDate
    );

    if (incomplete.length) {
      setError(
        "Please select a Comp-off date for every assigned Sunday."
      );
      return;
    }

    const invalidStaff = entries.filter(
      (entry) =>
        entry.StaffId &&
        !staffList.some((staff) => staff.id === entry.StaffId)
    );

    if (invalidStaff.length) {
      setError("One or more selected staff members are invalid.");
      return;
    }

    const assignedStaffIds = entries
      .filter((entry) => entry.StaffId)
      .map((entry) => entry.StaffId);

    if (new Set(assignedStaffIds).size !== assignedStaffIds.length) {
      setError("A staff member cannot be assigned to multiple Sundays.");
      return;
    }

    // Do not save blank Sunday rows.
    const payload = entries.filter(
      (entry) => entry.StaffId
    );

    setIsSaving(true);

    try {
      await onSave(month, year, payload);

      setSuccess(true);
      setEditingDate(null);

      // Allow the parent to refresh its roster data.
    } catch (err) {
      console.error("Duty roster save failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the duty roster. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

     {/* HEADER */}
<div className="relative overflow-hidden bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-700 px-5 py-6 text-white sm:px-7">

  {/* Decorative Background */}
  <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/[0.07]" />
  <div className="pointer-events-none absolute -bottom-20 right-36 h-40 w-40 rounded-full bg-cyan-300/[0.08] blur-2xl" />

  <div className="relative flex items-start justify-between gap-4">

    <div className="flex min-w-0 items-start gap-4">

      {/* Company Logo */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white p-1.5 shadow-lg shadow-teal-950/20">
        <img
          src="/Icons/Curate-logoq.png"
          alt="Curate Company Logo"
          className="h-full w-full rounded-lg object-contain"
        />
      </div>

      {/* Header Content */}
      <div className="min-w-0">

        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-100">
          <CalendarDays size={15} strokeWidth={2.2} />
          Staff Management
        </div>

        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          Sunday Duty Roster
        </h2>

        <p className="mt-1.5 text-xs leading-relaxed text-teal-100 sm:text-sm">
          Manage monthly Sunday duty assignments and Comp-off.
        </p>

      </div>
    </div>

    {/* Close Button */}
    <button
      type="button"
      onClick={onClose}
      disabled={isSaving}
      aria-label="Close roster"
      className="shrink-0 rounded-xl border border-white/20 bg-white/10 p-2.5 text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:rotate-90 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <X size={19} strokeWidth={2.2} />
    </button>

  </div>
</div>

        {/* BODY */}
        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/70 p-4 sm:p-6">

          {/* MONTH SELECTOR */}
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Selected period
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-800">
                {MONTH_NAMES[month - 1]} {year}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Only Sundays are included in this roster.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100"
                title="Previous month"
              >
                <ChevronLeft size={19} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMonth(today.getMonth() + 1);
                  setYear(today.getFullYear());
                }}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                Current Month
              </button>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100"
                title="Next month"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Total Sundays
                </p>
                <CalendarDays className="text-indigo-500" size={20} />
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {sundays.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                This month
              </p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Assigned
                </p>
                <CheckCircle2 className="text-emerald-500" size={20} />
              </div>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {assignedCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Staff assignments
              </p>
            </div>

            <div className="rounded-xl border border-amber-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Pending
                </p>
                <Clock className="text-amber-500" size={20} />
              </div>

              <p className="mt-2 text-2xl font-bold text-amber-600">
                {unassignedCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Awaiting assignment
              </p>
            </div>
          </div>

          {/* ROSTER SECTION */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-slate-800">
                  Sunday Assignments
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Assign one staff member to each Sunday.
                </p>
              </div>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-56"
                />
              </div>
            </div>

            {/* TABLE HEADER */}
            <div className="hidden grid-cols-[1fr_1.4fr_1.3fr_80px] gap-3 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <span>Sunday Date</span>
              <span>Staff Member</span>
              <span>Comp-off Date</span>
              <span className="text-center">Action</span>
            </div>

            {/* TABLE ROWS */}
            <div className="divide-y divide-slate-100">
              {filteredEntries.map((entry, index) => {
                const assignedStaff = staffList.find(
                  (staff) => staff.id === entry.StaffId
                );

                const isAssigned = Boolean(entry.StaffId);

                return (
                  <div
                    key={entry.Date}
                    className={`grid grid-cols-1 gap-3 p-4 transition hover:bg-slate-50/80 md:grid-cols-[1fr_1.4fr_1.3fr_80px] md:items-center md:gap-3 md:px-5 ${
                      !isAssigned ? "bg-amber-50/30" : ""
                    }`}
                  >
                    {/* DATE */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50">
                        <span className="text-[10px] font-bold uppercase text-indigo-500">
                          SUN
                        </span>

                        <span className="text-base font-bold leading-5 text-indigo-800">
                          {Number(entry.Date.split("-")[2])}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatDisplayDate(entry.Date)}
                        </p>
                        <p className="text-xs text-slate-400">
                          Sunday #{sundays.indexOf(entry.Date) + 1}
                        </p>
                      </div>
                    </div>

                    {/* STAFF SELECT */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500 md:hidden">
                        Staff Member
                      </label>

                      <div className="relative">
                        <UserRound
                          size={16}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                          value={entry.StaffId}
                          onChange={(e) =>
                            handleStaffChange(
                              entry.Date,
                              e.target.value
                            )
                          }
                          className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        >
                          <option value="">Select staff member</option>

                          {staffList
                            .filter(
                              (staff) =>
                                !entries.some(
                                  (item) =>
                                    item.StaffId === staff.id &&
                                    item.Date !== entry.Date
                                )
                            )
                            .map((staff) => (
                              <option
                                key={staff.id}
                                value={staff.id}
                              >
                                {staff.name}
                                {staff.designation
                                  ? ` - ${staff.designation}`
                                  : ""}
                              </option>
                            ))}

                          {assignedStaff &&
                            !staffList.some(
                              (staff) => staff.id === entry.StaffId
                            ) && (
                              <option value={entry.StaffId}>
                                {entry.StaffName}
                              </option>
                            )}
                        </select>
                      </div>
                    </div>

                    {/* COMP OFF DATE */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500 md:hidden">
                        Comp-off Date
                      </label>

                      <div className="relative">
                        <CalendarCheck
                          size={16}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="date"
                          value={entry.CompOffDate}
                          disabled={!isAssigned}
                          onChange={(e) =>
                            handleCompOffChange(
                              entry.Date,
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center justify-between gap-2 md:justify-center">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold md:hidden ${
                          isAssigned
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {isAssigned ? "Assigned" : "Pending"}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingDate(entry.Date);
                          clearEntry(entry.Date);
                        }}
                        disabled={!isAssigned}
                        title="Remove assignment"
                        className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* MOBILE COMP-OFF INFO */}
                    {isAssigned && (
                      <div className="flex items-center justify-between rounded-lg bg-emerald-50/60 px-3 py-2 md:hidden">
                        <span className="text-xs text-slate-500">
                          Assigned to
                        </span>
                        <span className="text-xs font-semibold text-emerald-700">
                          {assignedStaff?.name ?? entry.StaffName}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredEntries.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <CalendarDays
                    size={32}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    No matching assignments found
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try another search term.
                  </p>
                </div>
              )}
            </div>
          </div>

       

          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={18} />
              Monthly duty roster saved successfully.
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:px-6">
       

        
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Roster
                </>
              )}
            </button>
         
        </div>
      </div>
    </div>
  );
}