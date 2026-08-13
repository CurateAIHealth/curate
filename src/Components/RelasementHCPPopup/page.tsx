"use client";

import React, { useState } from "react";
import { X, Eye, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { calculateAgeIndianFormat, GetPreviewUserType } from "@/Lib/Actions";
import { UpdateClient, UpdateUserInformation } from "@/Redux/action";

interface HCP {
  Gender: string;
  CurrentAddress: string;
  DateOfBirth: string | number | Date;
  UserId: string;
  HCPFirstName: string;
  HCPSurName?: string;
  HCPLastName?: string;
  HCPContactNumber?: string;
  ProfilePic?: string;
  Languages?: string;
  Experience?: number;
  Status?: string[];
  ["Date of Birth"]?: string;
  ["Current Address"]?: string;
}

interface RepleasementHCPPopup {
  open: boolean;
  ClientInformation:any
  onClose: () => void;
  filteredHcps: HCP[];
  title?: string;
  statusMessage?: string;
  onAssign?: (hcp: HCP) => void;
  onUpdate?: (hcp: HCP) => void;
}

const RepleasementHCPPopup = ({
  open,
  ClientInformation,
  onClose,
  filteredHcps,
  title = "Friendly Care Matches",
  statusMessage,
  onAssign,
  onUpdate,
}: RepleasementHCPPopup) => {
  const [searchResult, setSearchResult] = useState("");
  const users=useSelector((state:any)=>state.AdminFullInfo)
  const Regusers=useSelector((state:any)=>state.AdminUsers)
 const [form, setForm] = useState({
    hcpType:"HCA" as any,
    Gender: "Male" as any,
  });
  const router = useRouter();
  const dispatch = useDispatch();

  if (!open) return null;

  const showCompleteInformation = (
    userId: string,
    clientName: string
  ) => {
    dispatch(UpdateClient(clientName));
    dispatch(UpdateUserInformation(userId));

    router.push("/UserInformation");
  };


console.log ("Check information of Hcps-----",ClientInformation)
const HCA_List = Array.isArray(filteredHcps)
  ? filteredHcps.filter((each: any) => {
      if (!each) return false;

      const userType = String(each.userType ?? "").trim().toLowerCase();
      const currentStatus = String(each.CurrentStatus ?? "").trim().toLowerCase();
      const gender = String(each.Gender ?? "").trim().toLowerCase();
      const formGender = String(form?.Gender ?? "").trim().toLowerCase();
      const formHcpType = String(form?.hcpType ?? "").trim();

      // Allowed HCA/HCP types
      const typeMatch = [
        "healthcare-assistant",
        "hca",
        "hcp",
        "hcpt",
      ].includes(userType);

      // Preview user type
      const previewType = String(
        GetPreviewUserType(
          Array.isArray(Regusers) ? Regusers : [],
          each.UserId
        ) ?? ""
      ).trim();

      const previewTypeMatch =
        !!formHcpType && previewType === formHcpType;

      // Must NOT already be Assigned
      const isNotAssigned =
        !Array.isArray(each.Status) ||
        !each.Status.some(
          (status: any) =>
            String(status ?? "").trim().toLowerCase() === "assigned"
        );

      // Must currently be on Bench
      const isValidCurrentStatus = currentStatus === "bench";

      // Gender must match
      const genderMatch =
        !!formGender && gender === formGender;

      return (
        typeMatch &&
        isNotAssigned &&
        isValidCurrentStatus &&
        genderMatch &&
        previewTypeMatch
      );
    })
  : [];

  const searchedHcps = HCA_List.filter((hcp) =>
    `${hcp.HCPFirstName} ${hcp.HCPLastName || ""}`
      .toLowerCase()
      .includes(searchResult.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3">
      
      <div className="relative w-full max-w-7xl rounded-3xl bg-white shadow-2xl overflow-hidden">

        {/* Search + Status */}
     <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
  <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex items-center gap-2">
      <img
            src="/Icons/Curate-logoq.png"
            className="h-8"
            alt="Company Logo"
          />
   
     </div>
<div className="flex items-center gap-3">
  

  <div>
    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#ff1493]">
      Choose Replacement HCP
    </h1>

    <p className="mt-1 text-sm font-medium text-[#50c896]">
      Select the best healthcare professional for replacement
    </p>
  </div>
</div>
    <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
      

      <button
        onClick={onClose}
        className="flex h-6 w-6 items-center justify-center cursor-pointer rounded-2xl border border-red-200 bg-red-50 transition-all duration-200 hover:scale-105 hover:bg-red-100 active:scale-95"
      >
        <X size={12} className="text-red-500" />
      </button>
    </div>
  </div>
</div>
  <div className="flex items-center">
  {/* Filters + Results */}
<div className="w-full overflow-x-hidden bg-slate-50/40 mb-auto">

  {/* ================= FILTER ================= */}
  <div className="w-full px-4 pt-4">

    <div className="w-full max-w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      {/* Filter Header */}
      <div className="mb-4 flex items-start justify-between gap-3">

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1392d3]/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-[#1392d3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-8.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-sm font-bold leading-5 text-slate-800">
              Find the Right HCP
            </h2>

            <p className="mt-1 text-[10px] font-medium leading-4 text-slate-400">
              Filter healthcare professionals by your requirements
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[9px] font-semibold text-slate-500">
          Filters
        </span>

      </div>
<div className="w-full max-w-[320px] rounded-[22px] border border-sky-400 bg-white p-3 shadow-sm">

  {/* Header */}
  <div className="flex items-center gap-3">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 font-bold text-sky-600 mb-2">
      {ClientInformation?.name?.[0]?.toUpperCase() || "N"}
    </div>

    <div className="min-w-0 flex-1">
      <p className="truncate text-[16px] font-bold text-slate-900">
        {ClientInformation?.name || "Nuzhath shakeel"}
      </p>

      <p className="truncate text-[13px] text-slate-500">
       {ClientInformation?.
Address?.trim() || "Not Assigned"}
      </p>
    </div>

    <span className="rounded-full bg-sky-500 px-3 py-1.5 text-[10px] font-semibold text-white">
      {ClientInformation?.Status || "Active"}
    </span>
  </div>

  {/* Information Grid */}
  <div className="mt-3 grid grid-cols-2 gap-2">

    {/* Patient */}
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-2.5">
      <p className="text-[9px] uppercase tracking-wide text-slate-500">
        Patient
      </p>

      <p className="mt-1 truncate text-[14px] font-bold text-slate-900">
        {ClientInformation?.PatientName || "Not Provided"}
      </p>
    </div>

    {/* HCA */}
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-2.5">
      <p className="text-[9px] uppercase tracking-wide text-slate-500">
        
Contact
      </p>

      <p className="mt-1 truncate text-[14px] font-bold text-slate-900">
      
   {ClientInformation?.email ||
          ClientInformation?.Patient_PhoneNumber }
      </p>
    </div>



    

  </div>

  

</div>
      {/* Filter Controls */}
      <div className="space-y-4 mt-2">

        {/* Search HCP */}
        <div className="w-full">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Search HCP
          </label>

          <div className="relative">
            <input
              type="search"
              placeholder="Search HCP..."
              value={searchResult}
              onChange={(e) => setSearchResult(e.target.value)}
              className="
                h-10 w-full rounded-xl border border-slate-200
                bg-slate-50 px-4 pl-10 text-sm font-medium text-slate-700
                shadow-sm outline-none transition-all
                placeholder:text-slate-400
                hover:border-slate-300
                focus:border-[#1392d3]
                focus:bg-white
                focus:ring-4 focus:ring-[#1392d3]/10
              "
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Preferred Gender
          </label>

          <div className="flex w-fit rounded-xl border border-slate-200 bg-slate-50 p-1">
            {["Male", "Female"].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    Gender: gender,
                  }))
                }
                className={`min-w-[90px] rounded-lg px-4 cursor-pointer py-2 text-xs font-semibold transition-all ${
                  form.Gender === gender
                    ? "bg-[#1392d3] text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-[#1392d3]"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* HCP Type */}
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
            HCP Type
          </label>

          <div className="flex flex-wrap gap-2">
            {["HCA", "HCN", "HCPT"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    hcpType: type,
                  }))
                }
                className={`rounded-lg border px-3 py-2 cursor-pointer text-xs font-semibold transition-all ${
                  form.hcpType === type
                    ? "border-[#1392d3] bg-[#1392d3] text-white shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-[#1392d3]/40 hover:bg-white hover:text-[#1392d3]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>


 

</div>
        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto p-5">
          {searchedHcps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <img
                src="/Icons/NoInformation.gif"
                alt="No Data"
                className="h-40"
              />

              <h2 className="mt-5 text-2xl font-bold text-gray-800">
                No Suitable HCPs Found
              </h2>

              <p className="mt-2 text-sm text-gray-500 max-w-md">
                No healthcare professionals matched the
                current filters or requirements.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {searchedHcps.map((hcp) => {
                const isAssigned =
                  Array.isArray(hcp?.Status) &&
                  hcp.Status.includes("Assigned");

                return (
                  <div
                    key={hcp.UserId}
                    className="relative w-[190px] rounded-2xl border bg-white shadow-md hover:shadow-xl transition overflow-hidden"
                  >
                    {/* Top */}
                    <div className="h-16 bg-teal-600 relative">
                      <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full border-4 border-white overflow-hidden shadow">
                        <img
                          src={
                            hcp.ProfilePic ||
                            "/Icons/DefaultProfileIcon.png"
                          }
                          alt={hcp.HCPFirstName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-10 pb-4 px-3 text-center">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {hcp.HCPSurName}{" "}
                        {hcp.HCPFirstName}{" "}
                        {hcp.HCPLastName}
                      </h3>

                      <p className="text-[11px] text-gray-500 mt-1">
                        +91 {hcp.HCPContactNumber}
                      </p>

                      <p className="text-[10px] text-gray-500 truncate mt-1">
                        {hcp.CurrentAddress || "-"}
                      </p>

                      {/* Tags */}
                      <div className="flex justify-center flex-wrap gap-1 mt-2">
                        <span className="text-[9px] px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Age :
                          {hcp.DateOfBirth
                            ? calculateAgeIndianFormat(
                                new Date(
                                  hcp.DateOfBirth
                                ).toLocaleDateString("en-IN")
                              )
                            : "-"}
                        </span>

                        <span className="text-[9px] px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          Exp : {hcp?.Experience || 0} yrs
                        </span>
                      </div>

                <div className="flex items-center justify-center gap-1.5 m-1 border border-gray-400 shadow-lg  rounded p-1">
  <span className="text-[10px] font-medium  tracking-wide text-gray-800">
    Gender:
  </span>
  <span className="text-[10px] font-semibold text-gray-500">
    {hcp.Gender || "N/A"}
  </span>
</div>
                      {/* Languages */}
                      <div className="mt-2">
                        {hcp.Languages ? (
                          <p className="text-[10px] px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 border border-yellow-300">
                            {hcp.Languages}
                          </p>
                        ) : (
                          <p className="text-[10px] px-2 py-1 rounded-lg bg-red-100 text-red-600 border border-red-300">
                            Languages Not Updated
                          </p>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="mt-3 flex items-center justify-center gap-2">
                        
                          <button
                            onClick={() => onAssign?.(hcp)}
                            className="px-4 py-1 rounded-full text-[10px] bg-green-600 text-white hover:bg-green-700"
                          >
                            Assign
                          </button>
                        
                      </div>
                    </div>

                    {/* View */}
                    <button
                      onClick={() =>
                        showCompleteInformation(
                          hcp.UserId,
                          hcp.HCPFirstName
                        )
                      }
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white shadow border flex items-center justify-center hover:scale-105 transition"
                    >
                      <Eye
                        size={13}
                        className="text-teal-600"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default RepleasementHCPPopup;