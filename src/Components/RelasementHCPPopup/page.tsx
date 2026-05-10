"use client";

import React, { useState } from "react";
import { X, Eye } from "lucide-react";
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

interface RelasementHCPPopupProps {
  open: boolean;
  onClose: () => void;
  filteredHcps: HCP[];
  title?: string;
  statusMessage?: string;
  onAssign?: (hcp: HCP) => void;
  onUpdate?: (hcp: HCP) => void;
}

const RelasementHCPPopup = ({
  open,
  onClose,
  filteredHcps,
  title = "Friendly Care Matches",
  statusMessage,
  onAssign,
  onUpdate,
}: RelasementHCPPopupProps) => {
  const [searchResult, setSearchResult] = useState("");
 const [form, setForm] = useState({
    hcpType:"" as any,
    Gender: "" as any,
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

  const searchedHcps = filteredHcps.filter((hcp) =>
    `${hcp.HCPFirstName} ${hcp.HCPLastName || ""}`
      .toLowerCase()
      .includes(searchResult.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3">
      <div className="relative w-full max-w-7xl rounded-3xl bg-white shadow-2xl overflow-hidden">

        {/* Search + Status */}
        <div className="px-5 py-4 border-b bg-gray-50 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <input
            type="search"
            placeholder="Search HCP..."
            value={searchResult}
            onChange={(e) => setSearchResult(e.target.value)}
            className="w-full md:max-w-sm rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300"
          />

          {statusMessage && (
            <p className="px-4 py-2 rounded-xl text-sm text-red-700 bg-yellow-100 border border-yellow-200">
              {statusMessage}
            </p>
          )}
          <div className="flex  items-center justify-center  gap-8  border-t border-[#e2e8f0] pt-3 space-y-3">
            
            {/* HCP */}
            <div>
              <p className="text-[10px] font-semibold text-[#334155] mb-2">
                HCP Type
              </p>

              <div className="flex flex-wrap gap-1.5">
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
      className={`px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all
      ${
        form.hcpType === type
          ? "bg-[#0ea5e9] border-[#0ea5e9] text-white"
          : "bg-[#f8fafc] border-[#cbd5e1] text-[#334155]"
      }`}
    >
      {type}
    </button>
  ))}
</div>
            </div>

            {/* Gender */}
            <div>
              <p className="text-[10px] font-semibold text-[#334155] mb-2">
                Prefer Gender
              </p>

              <div className="flex gap-1.5">
                {["Male", "Female"].map((gender) => (
                  <button
                    key={gender}
                       onClick={() =>
        setForm((prev) => ({
          ...prev,
          Gender: gender,
        }))
      }
                className={`px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all
      ${
        form.Gender === gender
          ? "bg-[#0ea5e9] border-[#0ea5e9] text-white"
          : "bg-[#f8fafc] border-[#cbd5e1] text-[#334155]"
      }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

        
          </div>
           <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition"
          >
            <X size={18} className="text-red-600" />
          </button>
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
                        {isAssigned ? (
                          <>
                            <button className="px-3 py-1 rounded-full text-[10px] bg-red-500 text-white">
                              Assigned
                            </button>

                            <button
                              onClick={() => onUpdate?.(hcp)}
                              className="px-3 py-1 rounded-full text-[10px] bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Update
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onAssign?.(hcp)}
                            className="px-4 py-1 rounded-full text-[10px] bg-green-600 text-white hover:bg-green-700"
                          >
                            Assign
                          </button>
                        )}
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

export default RelasementHCPPopup;