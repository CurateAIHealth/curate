"use client";

import React, { useEffect, useMemo, useState } from "react";

export interface Client {
  ClientAttendance: any;
  PatientName: any;
  Client_Id: string | number;
  name: string;
  contact?: string;
  HCA_Id: string | number;
  HCA_Name: string;
}

export interface AttendancePayload {
  Client_Id: string | number;
  Client_Name: string;
  HCA_Id: string | number;
  HCA_Name: string;
  date: string;
  status: "Present";
}

interface AttendanceModalProps {
  clients: Client[];
  title?: string;
  isOpen: boolean;
  Messsage?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (payload: AttendancePayload[]) => void;
}

export default function AttendanceModal({
  clients,
  title = "Client Attendance",
  isOpen,
  Messsage,
  setIsOpen,
  onSubmit,
  
}: AttendanceModalProps) {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [checkedIn, setCheckedIn] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
console.log("clients", clients);
const filteredClients = useMemo(() => {
  return clients.filter((item) => {
    const matchesSearch =
      item.HCA_Name.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());

    const alreadyMarked = item.ClientAttendance?.some((attendance:any) => {
      const attendanceDate =
        attendance.dateKey ||
        new Date(attendance.AttendanceDate).toISOString().split("T")[0];

      return attendanceDate === selectedDate;
    });

    return matchesSearch && !alreadyMarked;
  });
}, [clients, search, selectedDate]);

  const handleCheckIn = (client: Client) => {
    const key = `${client.Client_Id}-${client.HCA_Id}`;

    if (checkedIn.includes(key)) return;

    setCheckedIn((prev) => [...prev, key]);

    onSubmit([
      {
        Client_Id: client.Client_Id,
        Client_Name: client.name,
        HCA_Id: client.HCA_Id,
        HCA_Name: client.HCA_Name,
        date: selectedDate,
        status: "Present",
      },
    ]);
  };

  const handleCheckInAll = () => {
    const uncheckedClients = filteredClients.filter((client) => {
      const key = `${client.Client_Id}-${client.HCA_Id}`;
      return !checkedIn.includes(key);
    });

    if (!uncheckedClients.length) return;

    const newKeys = uncheckedClients.map(
      (client) => `${client.Client_Id}-${client.HCA_Id}`
    );

    setCheckedIn((prev) => [...prev, ...newKeys]);

    const payload = uncheckedClients.map((client) => ({
      Client_Id: client.Client_Id,
      Client_Name: client.name,
      HCA_Id: client.HCA_Id,
      HCA_Name: client.HCA_Name,
      date: selectedDate,
      status: "Present" as const,
    }));

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-3">
      <div className="mx-auto flex h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-2">
           <img
            src="/Icons/Curate-logoq.png"
            className="h-12"
            alt="Company Logo"
          />
          <div>

            <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {new Date(selectedDate).toDateString()}
            </p>
          </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-xl border px-4 py-2 outline-none"
            />

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full border px-5 py-2 font-medium hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <button
            onClick={handleCheckInAll}
            className="rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white shadow-md hover:bg-teal-700"
          >
            Check In All Client's
          </button>

          {Messsage && (
            <p className="text-sm font-medium text-green-600">{Messsage}</p>
          )}

          <div className="w-full md:w-[320px]">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-5 pb-5">
          <div className="h-full overflow-y-auto overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[1100px]">
              <thead className="sticky top-0 z-10 bg-emerald-400 text-white">
                <tr>
                  <th className="px-4 py-4 text-left">#</th>
                  <th className="px-4 py-4 text-left">CLIENT NAME</th>
                  <th className="px-4 py-4 text-left">CONTACT</th>
                  <th className="px-4 py-4 text-left">PATIENT NAME</th>
                  <th className="px-4 py-4 text-left">STATUS</th>
                  <th className="px-4 py-4 text-center">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredClients.map((item, index) => {
                  const key = `${item.Client_Id}-${item.HCA_Id}`;
                  const isPresent = checkedIn.includes(key);

                  return (
                    <tr key={key} className="border-b bg-white hover:bg-slate-50">
                      <td className="px-4 py-5 font-semibold">{index + 1}</td>
                      <td className="px-4 py-5 font-semibold text-sky-600">
                        {item.name}
                      </td>
                      <td className="px-4 py-5">{item.contact || "-"}</td>
                      <td className="px-4 py-5">{item.PatientName}</td>
                      <td className="px-4 py-5">
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${
                            isPresent
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {isPresent ? "Present" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <button
                          onClick={() => handleCheckIn(item)}
                          disabled={isPresent}
                          className={`rounded-xl px-5 py-3 font-semibold text-white shadow-md transition ${
                            isPresent
                              ? "cursor-not-allowed bg-green-500"
                              : "bg-teal-700 hover:bg-teal-800"
                          }`}
                        >
                          {isPresent
                            ? "✓ Attendance Updated"
                            : `✓ ${item.name}'s Attendance Check-in`}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!filteredClients.length && (
           <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-6 shadow-sm">
  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-md">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>

  <p className="text-center text-lg font-semibold text-emerald-700">
    Attendance Completed
  </p>

  <p className="mt-1 max-w-md text-center text-sm text-slate-600">
    All client attendance for the selected date has already been marked as present.
  </p>
</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}