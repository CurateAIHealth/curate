"use client";

import React, { useState } from "react";
import { X, Eye, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { calculateAgeIndianFormat } from "@/Lib/Actions";
import { UpdateClient, UpdateUserInformation } from "@/Redux/action";

interface HCP {
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
  onClose: () => void;
  filteredHcps: HCP[];
  title?: string;
  statusMessage?: string;
  onAssign?: (hcp: HCP) => void;
  onUpdate?: (hcp: HCP) => void;
}

const RepleasementHCPPopup = ({
  open,
  onClose,
  filteredHcps,
  title = "Friendly Care Matches",
  statusMessage,
  onAssign,
  onUpdate,
}: RepleasementHCPPopup) => {
  const [searchResult, setSearchResult] = useState("");
 const [form, setForm] = useState({
   
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
  const HCA_List = filteredHcps.filter((each: any) => {
  const typeMatch =
    ["healthcare-assistant", "HCA", "HCP", "HCPT"].includes(each.userType);

  const isNotAssigned =
    !each.Status?.some((s: string) => s === "Assigned");

  const isValidCurrentStatus =each.CurrentStatus==="Bench"

  return typeMatch && isNotAssigned && isValidCurrentStatus&&each.Gender?.toLowerCase() === form.Gender?.toLowerCase();
});
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
   
    <div className="relative w-full lg:max-w-sm">
        
      <input
        type="search"
        placeholder="Search HCP..."
        value={searchResult}
        onChange={(e) => setSearchResult(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 pl-11 text-sm text-slate-700 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
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
      <div className="flex flex-col items-start sm:items-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#1392d3]">
          Preferred Gender
        </p>

        <div className="flex rounded-2xl bg-slate-100 p-1 shadow-inner">
          {["Male", "Female"].map((gender) => (
            <button
              key={gender}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  Gender: gender,
                }))
              }
              className={`min-w-[90px] rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200
                ${
                  form.Gender === gender
                    ? "bg-sky-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-white hover:text-sky-600"
                }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        className="flex h-6 w-6 items-center justify-center cursor-pointer rounded-2xl border border-red-200 bg-red-50 transition-all duration-200 hover:scale-105 hover:bg-red-100 active:scale-95"
      >
        <X size={12} className="text-red-500" />
      </button>
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
                    className="relative w-[180px] rounded-2xl border bg-white shadow-md hover:shadow-xl transition overflow-hidden"
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
                        {hcp["Current Address"] || "-"}
                      </p>

                      {/* Tags */}
                      <div className="flex justify-center flex-wrap gap-1 mt-2">
                        <span className="text-[9px] px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Age :
                          {hcp["Date of Birth"]
                            ? calculateAgeIndianFormat(
                                new Date(
                                  hcp["Date of Birth"]
                                ).toLocaleDateString("en-IN")
                              )
                            : "-"}
                        </span>

                        <span className="text-[9px] px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          Exp : {hcp?.Experience || 0} yrs
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
  );
};

export default RepleasementHCPPopup;