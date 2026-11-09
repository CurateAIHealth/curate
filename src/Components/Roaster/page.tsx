
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Save,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { indianStates } from "@/Lib/Content";

interface StaffOption {
  id: string;
  name: string;
  designation?: string;
  profileImage?: string;
  serviceState?: string;
  ServiceState?: string;
}

interface RosterEntry {
  Date: string;
  Day: string;
  StaffId: string;
  StaffName: string;
  ServiceState: string;
  CompOffDate: string;
}

interface RosterRow extends RosterEntry {
  RowId: string;
}

interface SundayDutyRosterProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffOption[];

  onLoad: (
    month: number,
    year: number
  ) => Promise<{
    entries: RosterEntry[];
    revision: number;
  }>;

  onSave: (
    month: number,
    year: number,
    entries: RosterEntry[],
    revision: number
  ) => Promise<number>;

  initialMonth?: number;
  initialYear?: number;
}

const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];





const createRowId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getDayName = (dateString: string): string => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
};

const isValidDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const formatDisplayDate = (dateString: string): string => {
  if (!dateString || !isValidDate(dateString)) return "Not selected";

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getEmptyEntry = (): RosterRow => ({
  RowId: createRowId(),
  Date: "",
  Day: "",
  StaffId: "",
  StaffName: "",
  ServiceState: "",
  CompOffDate: "",
});
const isEntryEmpty = (entry: RosterEntry) =>
  !entry.Date &&
  !entry.StaffId &&
  !entry.StaffName &&
  !entry.CompOffDate;

export default function SundayDutyRoster({
  isOpen,
  onClose,
  staffList,
  initialMonth,
  initialYear,
  onLoad,
  onSave,
}: SundayDutyRosterProps) {
  const today = new Date();

  const [month, setMonth] = useState(
    initialMonth ?? today.getMonth() + 1
  );

  const [year, setYear] = useState(
    initialYear ?? today.getFullYear()
  );

  const [entries, setEntries] = useState<RosterRow[]>([
    getEmptyEntry(),
  ]);
const [revision, setRevision] = useState(0);
const [isLoading, setIsLoading] = useState(true);
  const [noDataNotice, setNoDataNotice] = useState(false);
  const [search, setSearch] = useState("");
  const [serviceStateFilter, setServiceStateFilter] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load saved entries for the selected month.
  // If no saved entries exist, show one empty row.
 useEffect(() => {
  if (!isOpen) return;

  let active = true;
  let noticeTimeout: ReturnType<typeof setTimeout> | undefined;

  const loadRoster = async () => {
    setIsLoading(true);
    setError("");
    setSuccess(false);
    setNoDataNotice(false);

    try {
      const result = await onLoad(month, year);

      if (!active) return;

 const loadedRows: RosterRow[] = result.entries.map((entry) => {
  const staff = staffList.find(
    (item) => item.id === entry.StaffId
  );

  return {
    ...entry,
    ServiceState:
      entry.ServiceState || "Telangana" ,
    Day: getDayName(entry.Date),
    RowId: createRowId(),
  };
});

      setEntries(
        loadedRows.length ? loadedRows : [getEmptyEntry()]
      );

      if (loadedRows.length === 0) {
        setNoDataNotice(true);
        noticeTimeout = setTimeout(() => setNoDataNotice(false), 3500);
      }

      setRevision(result.revision);
    } catch (error) {
      if (!active) return;

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load holiday roster."
      );

      setEntries([getEmptyEntry()]);
    } finally {
      if (active) setIsLoading(false);
    }
  };

  loadRoster();

  return () => {
    active = false;
    if (noticeTimeout) clearTimeout(noticeTimeout);
  };
}, [isOpen, month, year, onLoad]);

  const changeMonth = (direction: number) => {
    const nextDate = new Date(year, month - 1 + direction, 1);

    setMonth(nextDate.getMonth() + 1);
    setYear(nextDate.getFullYear());
    setError("");
    setSuccess(false);
  };

  const updateEntry = (
    rowId: string,
    changes: Partial<RosterEntry>
  ) => {
    setEntries((previous) =>
      previous.map((entry) =>
        entry.RowId === rowId
          ? { ...entry, ...changes }
          : entry
      )
    );

    setError("");
    setSuccess(false);
  };

  const handleDateChange = (rowId: string, date: string) => {
    updateEntry(rowId, {
      Date: date,
      Day: date ? getDayName(date) : "",
    });
  };

const handleStaffChange = (rowId: string, staffId: string) => {
  const selectedStaff = staffList.find(
    (staff) => staff.id === staffId
  );

  updateEntry(rowId, {
    StaffId: selectedStaff?.id ?? "",
    StaffName: selectedStaff?.name ?? "",
    ServiceState:"Telangana" ,
  });
};

  const addRow = () => {
    setEntries((previous) => [
      ...previous,
      getEmptyEntry(),
    ]);

    setError("");
    setSuccess(false);
  };

  const removeRow = (rowId: string) => {
    setEntries((previous) => {
      const remaining = previous.filter(
        (entry) => entry.RowId !== rowId
      );

      return remaining.length ? remaining : [getEmptyEntry()];
    });

    setError("");
    setSuccess(false);
  };

  const assignedEntries = useMemo(
    () => entries.filter((entry) => entry.StaffId),
    [entries]
  );

  const assignedCount = assignedEntries.length;

  const pendingCount = entries.filter(
    (entry) => !entry.StaffId
  ).length;

const filteredEntries = useMemo(() => {
  const searchValue = search.trim().toLowerCase();

  return entries.filter((entry) => {
    const staffName = entry.StaffName.toLowerCase();

    const staff = staffList.find(
      (item) => item.id === entry.StaffId
    );

    const entryState =
      entry.ServiceState ||"Telangana" ;

    // Keep empty rows visible so they can be assigned.
    const matchesState =
      !serviceStateFilter ||
      !entry.StaffId ||
      entryState.toLowerCase() === serviceStateFilter.toLowerCase();

    const matchesSearch =
      !searchValue ||
      staffName.includes(searchValue) ||
      entry.Date.includes(searchValue) ||
      entry.CompOffDate.includes(searchValue) ||
      entry.Day.toLowerCase().includes(searchValue);

    return matchesState && matchesSearch;
  });
}, [entries, search, serviceStateFilter, staffList]);

  const handleSave = async () => {
    if (isSaving) return;

    setError("");
    setSuccess(false);

    // Ignore completely empty rows.
    const activeEntries = entries.filter(
      (entry) => !isEntryEmpty(entry)
    );

    if (!activeEntries.length) {
      setError("Please add at least one holiday duty assignment.");
      return;
    }

    // Validate all active rows.
    for (let index = 0; index < activeEntries.length; index++) {
      const entry = activeEntries[index];
      const rowNumber = index + 1;

      if (!entry.Date) {
        setError(`Please select a duty date in row ${rowNumber}.`);
        return;
      }

      if (!isValidDate(entry.Date)) {
        setError(`Invalid duty date in row ${rowNumber}.`);
        return;
      }

      const [entryYear, entryMonth] = entry.Date
        .split("-")
        .map(Number);

      if (entryYear !== year || entryMonth !== month) {
        setError(
          `Duty date in row ${rowNumber} must belong to ${MONTH_NAMES[month - 1]} ${year}.`
        );
        return;
      }

      if (!entry.StaffId) {
        setError(`Please select a staff member in row ${rowNumber}.`);
        return;
      }

      if (!entry.CompOffDate) {
        setError(`Please select a Comp-off date in row ${rowNumber}.`);
        return;
      }

      if (!isValidDate(entry.CompOffDate)) {
        setError(`Invalid Comp-off date in row ${rowNumber}.`);
        return;
      }

      const validStaff = staffList.find(
        (staff) => staff.id === entry.StaffId
      );

      if (!validStaff) {
        setError(`Invalid staff selection in row ${rowNumber}.`);
        return;
      }
    }

    // Prevent duplicate duty dates.
    const dutyDates = activeEntries.map((entry) => entry.Date);

    if (new Set(dutyDates).size !== dutyDates.length) {
      setError("Duplicate duty dates are not allowed.");
      return;
    }

    // Prevent assigning one staff member multiple times.
    const staffIds = activeEntries.map((entry) => entry.StaffId);

  

    // Prevent duplicate Comp-off dates.
    const compOffDates = activeEntries.map(
      (entry) => entry.CompOffDate
    );

    if (new Set(compOffDates).size !== compOffDates.length) {
      setError("Duplicate Comp-off dates are not allowed.");
      return;
    }

    // A Comp-off date cannot overlap with another duty date.
    const dutyDateSet = new Set(dutyDates);

    const hasOverlap = compOffDates.some((date) =>
      dutyDateSet.has(date)
    );

    if (hasOverlap) {
      setError(
        "A Comp-off date cannot be the same as a duty date in this roster."
      );
      return;
    }

    // Resolve names from the trusted staff list before posting.
   const payload: RosterEntry[] = activeEntries.map((entry) => {
  const staff = staffList.find(
    (item) => item.id === entry.StaffId
  );

  return {
    Date: entry.Date,
    Day: getDayName(entry.Date),
    StaffId: entry.StaffId,
    StaffName: staff?.name ?? "",
    ServiceState: "Telangana" ,
    CompOffDate: entry.CompOffDate,
  };
});

    setIsSaving(true);

    try {
      const newRevision = await onSave(
  month,
  year,
  payload,
  revision
);

setRevision(newRevision);

      // Keep rows in the UI so they can be edited and saved again.
      setSuccess(true);
      setError("");
    } catch (err) {
      console.error("Holiday roster save failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the holiday roster. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSaving
        ) {
          onClose();
        }
      }}
    >
      <div className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-white/90" role="status" aria-live="polite">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
            <p className="text-sm font-medium text-slate-600">Loading roster...</p>
          </div>
        )}
        {noDataNotice && !isLoading && (
          <div className="absolute bottom-5 right-5 z-40 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-lg" role="status">
            No saved roster data found. You can add a new entry.
          </div>
        )}

        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-700 px-5 py-6 text-white sm:px-7">
          <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/[0.07]" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white p-1.5 shadow-lg">
                <img
                  src="/Icons/Curate-logoq.png"
                  alt="Curate Company Logo"
                  className="h-full w-full rounded-lg object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-100">
                  <CalendarDays size={15} />
                  Staff Management
                </div>

                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                  Holiday Duty Roster
                </h2>

                <p className="mt-1.5 text-xs text-teal-100 sm:text-sm">
                  Schedule holiday duties and manage Comp-off dates.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              aria-label="Close roster"
              className="shrink-0 rounded-xl border border-white/20 bg-white/10 p-2.5 transition hover:bg-white/20 disabled:opacity-50"
            >
              <X size={19} />
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
                Add any holiday date. Sundays are not generated automatically.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100"
                title="Previous month"
              >
                <ChevronLeft size={19} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMonth(today.getMonth() + 1);
                  setYear(today.getFullYear());
                  setError("");
                  setSuccess(false);
                }}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                Current Month
              </button>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100"
                title="Next month"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Total Rows
                </p>
                <CalendarDays className="text-indigo-500" size={20} />
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {entries.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Holiday duty entries
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
                {pendingCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Rows awaiting assignment
              </p>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-slate-800">
                  Holiday Duty Assignments
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Select a duty date, staff member and Comp-off date.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  aria-label="Filter by service state"
                  value={serviceStateFilter}
                  onChange={(event) => setServiceStateFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-48"
                >
                  <option value="">All Service States</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-52"
                />

                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <Plus size={17} />
                  Add Row
                </button>
              </div>
            </div>

            {/* RESPONSIVE TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="w-14 px-4 py-3 text-center">#</th>
                    <th className="px-4 py-3">Holiday / Duty Date</th>
                    <th className="px-4 py-3">Day</th>
                    <th className="px-4 py-3">Staff Member</th>
                    <th className="px-4 py-3">Comp-off Date</th>
                    <th className="w-24 px-4 py-3 text-center">Status</th>
                    {/* <th className="w-20 px-4 py-3 text-center">Action</th> */}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.map((entry, index) => {
                    const isAssigned = Boolean(entry.StaffId);

                    return (
                      <tr
                        key={entry.RowId}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 text-center text-sm font-semibold text-slate-500">
                          {entries.findIndex(
                            (item) => item.RowId === entry.RowId
                          ) + 1}
                        </td>

                        {/* DUTY DATE */}
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={entry.Date}
                            onChange={(event) =>
                              handleDateChange(
                                entry.RowId,
                                event.target.value
                              )
                            }
                            className="w-full min-w-[155px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                          />
                        </td>

                        {/* DAY */}
                        <td className="px-4 py-3">
                          <span className="inline-flex min-w-[100px] items-center rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700">
                            {entry.Day || "—"}
                          </span>
                        </td>

                        {/* STAFF */}
                        <td className="px-4 py-3">
                          <select
                            value={entry.StaffId}
                            onChange={(event) =>
                              handleStaffChange(
                                entry.RowId,
                                event.target.value
                              )
                            }
                            className="w-full min-w-[190px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                          >
                            <option value="">Select staff member</option>

   {staffList.map((staff) => (
  <option key={staff.id} value={staff.id}>
    {staff.name}
   
  </option>
))}
                          </select>
                        </td>

                        {/* COMP-OFF DATE */}
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={entry.CompOffDate}
                            onChange={(event) =>
                              updateEntry(entry.RowId, {
                                CompOffDate: event.target.value,
                              })
                            }
                            disabled={!entry.StaffId}
                            className="w-full min-w-[155px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              isAssigned
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {isAssigned ? "Assigned" : "Pending"}
                          </span>
                        </td>

                        {/* ACTION */}
                        {/* <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeRow(entry.RowId)}
                            title="Remove row"
                            className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td> */}
                      </tr>
                    );
                  })}

                  {filteredEntries.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center"
                      >
                        <CalendarDays
                          size={32}
                          className="mx-auto text-slate-300"
                        />
                        <p className="mt-3 text-sm font-semibold text-slate-600">
                          No matching assignments found
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Try another search term or add a new row.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}
            <div className="flex flex-col justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                {assignedCount} assigned out of {entries.length} rows
              </p>

              <button
                type="button"
                onClick={addRow}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
              >
                <Plus size={16} />
                Add another row
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={18} />
              Holiday duty roster saved successfully. You can still edit the rows and save again.
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
            className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
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
