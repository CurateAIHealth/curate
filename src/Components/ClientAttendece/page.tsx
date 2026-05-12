"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

type AttendanceStatus = "Present" | "Absent" | "Half Day";

export interface Client {
  Client_Id: string | number;
  name: string;
  HCA_Id: string | number;
  HCA_Name: string;
}

export interface AttendancePayload {
  Client_Id: string | number;
  Client_Name: string;
  HCA_Id: string | number;
  HCA_Name: string;
  date: string;
  status: AttendanceStatus;
}

interface AttendanceModalProps {
  clients: Client[];
  title?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (payload: AttendancePayload[]) => void;
}

const ATTENDANCE_OPTIONS: AttendanceStatus[] = [
  "Present",
  "Absent",
  "Half Day",
];

export default function AttendanceModal({
  clients,
  title = "Attendance Management",
  isOpen,
  setIsOpen,
  onSubmit,
}: AttendanceModalProps) {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] =
    useState<AttendanceStatus>("Present");

  const [filters, setFilters] = useState({
    date: new Date().toISOString().split("T")[0], 
    client: "",
    hcp: "",
  });

  const getSelectionKey = (client: Client) =>
    `${client.Client_Id}-${client.HCA_Id}`;

  const filteredClients = useMemo(() => {
    return clients.filter(
      (item) =>
        item.name
          .toLowerCase()
          .includes(filters.client.toLowerCase()) &&
        item.HCA_Name.toLowerCase().includes(filters.hcp.toLowerCase())
    );
  }, [clients, filters]);

  const isAllSelected =
    filteredClients.length > 0 &&
    filteredClients.every((item) =>
      selectedClients.includes(getSelectionKey(item))
    );

  const toggleClientSelection = (client: Client) => {
    const key = getSelectionKey(client);

    setSelectedClients((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedClients([]);
    } else {
      setSelectedClients(
        filteredClients.map((item) => getSelectionKey(item))
      );
    }
  };

  const resetModal = () => {
    setSelectedClients([]);
    setSelectedStatus("Present");
    setFilters({
      date: "",
      client: "",
      hcp: "",
    });
  };

  const closeModal = () => {
    resetModal();
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (!selectedClients.length) return;

    const payload: AttendancePayload[] = clients
      .filter((client) =>
        selectedClients.includes(getSelectionKey(client))
      )
      .map((client) => ({
        Client_Id: client.Client_Id,
        Client_Name: client.name,
        HCA_Id: client.HCA_Id,
        HCA_Name: client.HCA_Name,
        date: filters.date,
        status: selectedStatus,
      }));

    onSubmit(payload);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 p-2 sm:p-4">
      <div className="mx-auto flex h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between bg-gray-200 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white p-2 shadow-md">
              <Image
                src="/Icons/Curate-logoq.png"
                alt="Company Logo"
                width={42}
                height={42}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#ff1493] sm:text-xl">
                {title}
              </h2>
              <p className="text-sm text-gray-800">
                Manage Clients attendance efficiently
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="cursor-pointer rounded-lg bg-white/20 p-2 text-gray-700 transition hover:bg-white/40"
          >
            ✕
          </button>
        </div>

        <div className="grid shrink-0 grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50 p-4 md:grid-cols-3 sm:px-6">
          <input
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                date: e.target.value,
              }))
            }
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#1392d3]"
          />

          <input
            type="text"
            placeholder="Search client name"
            value={filters.client}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                client: e.target.value,
              }))
            }
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#1392d3]"
          />

          <input
            type="text"
            placeholder="Search HCP name"
            value={filters.hcp}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                hcp: e.target.value,
              }))
            }
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#1392d3]"
          />
        </div>

        <div className="flex shrink-0 flex-col gap-4 border-b border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between sm:px-6">
          <button
            onClick={toggleSelectAll}
            className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
            style={{ backgroundColor: "#ff1493" }}
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </button>

          <div className="flex flex-wrap gap-2">
            {ATTENDANCE_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition"
                style={{
                  backgroundColor:
                    selectedStatus === status ? "#50c896" : "white",
                  color:
                    selectedStatus === status ? "white" : "#334155",
                  border:
                    selectedStatus === status
                      ? "1px solid #50c896"
                      : "1px solid #cbd5e1",
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <p
            className="text-sm font-semibold"
            style={{ color: "#1392d3" }}
          >
            Selected Clients: {selectedClients.length}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:px-6">
          {filteredClients.map((item) => {
            const key = getSelectionKey(item);

            return (
              <div
                key={key}
                className="mb-3 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <input
                  type="checkbox"
                  checked={selectedClients.includes(key)}
                  onChange={() => toggleClientSelection(item)}
                  className="h-5 w-5 cursor-pointer accent-[#ff1493]"
                />

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-800">
                    {item.name}
                  </h3>
                  <p className="truncate text-xs text-slate-500">
                    HCP:<span className="text-slate-700">{item.HCA_Name}</span> 
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white p-4 sm:px-6">
          <button
            onClick={handleSubmit}
            disabled={!selectedClients.length}
            className="h-12 w-full cursor-pointer rounded-xl text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: "#08c36cee" }}
          >
            Update Attendance for Selected Clients
          </button>
        </div>
      </div>
    </div>
  );
}