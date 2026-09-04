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
       <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        px-2
        py-2
        backdrop-blur-sm
        sm:px-3
        sm:py-4
      "
    >
      {/* ================= MAIN POPUP ================= */}
      <div
        className="
          relative
          flex
          w-full
          max-w-[1600px]
          max-h-[96vh]
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
          sm:rounded-3xl
        "
      >
        {/* ================= HEADER ================= */}
        <div
          className="
            sticky
            top-0
            z-30
            shrink-0
            border-b
            border-slate-200
            bg-white/95
            shadow-sm
            backdrop-blur-md
          "
        >
          <div
            className="
              flex
              min-h-[72px]
              flex-col
              gap-3
              px-4
              py-3
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-5
              lg:px-6
            "
          >
            {/* Logo */}
            <div className="hidden shrink-0 sm:flex sm:items-center">
              <img
                src="/Icons/Curate-logoq.png"
                className="h-8 w-auto lg:h-9"
                alt="Company Logo"
              />
            </div>

            {/* Title */}
            <div
              className="
                min-w-0
                flex-1
                text-center
                sm:text-left
                lg:text-center
              "
            >
              <h1
                className="
                  truncate
                  text-xl
                  font-extrabold
                  tracking-tight
                  text-[#ff1493]
                  sm:text-2xl
                  lg:text-3xl
                "
              >
                Choose Replacement HCP
              </h1>

              <p
                className="
                  mt-1
                  truncate
                  text-xs
                  font-medium
                  text-[#50c896]
                  sm:text-sm
                "
              >
                Select the best healthcare professional
                for replacement
              </p>
            </div>

            {/* Close Button */}
            <div className="flex shrink-0 justify-end sm:w-10">
              <button
                onClick={onClose}
                type="button"
                aria-label="Close"
                className="
                  flex
                  h-8
                  w-8
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-red-200
                  bg-red-50
                  transition-all
                  duration-200
                  hover:scale-105
                  hover:bg-red-100
                  active:scale-95
                "
              >
                <X
                  size={14}
                  className="text-red-500"
                />
              </button>
            </div>
          </div>
        </div>

        {/* ================= FILTER + RESULTS ================= */}
        <div
          className="
            flex
            min-h-0
            w-full
            flex-1
            flex-col
            overflow-hidden
            bg-slate-50/40
            lg:flex-row
          "
        >
          {/* ==================================================
              FILTER SECTION
          ================================================== */}
          <aside
            className="
              w-full
              shrink-0
              overflow-y-auto
              border-b
              border-slate-200
              bg-white
              p-3
              sm:p-4
              lg:w-[300px]
              lg:border-b-0
              lg:border-r
              xl:w-[320px]
            "
          >
            <div
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-3
                shadow-sm
                sm:p-4
              "
            >
              {/* ================= FILTER HEADER ================= */}
              <div
                className="
                  mb-4
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#1392d3]/10
                    "
                  >
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

                  <div className="min-w-0">
                    <h2 className="text-sm font-bold leading-5 text-slate-800">
                      Find the Right HCP
                    </h2>

                    <p className="mt-1 text-[10px] font-medium leading-4 text-slate-400">
                      Filter healthcare professionals by
                      your requirements
                    </p>
                  </div>
                </div>

                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1
                    text-[9px]
                    font-semibold
                    text-slate-500
                  "
                >
                  Filters
                </span>
              </div>

              {/* ================= CLIENT INFORMATION ================= */}
              <div
                className="
                  w-full
                  rounded-[22px]
                  border
                  border-sky-400
                  bg-white
                  p-3
                  shadow-sm
                "
              >
                {/* Client Header */}
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="
                      mb-2
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-sky-100
                      font-bold
                      text-sky-600
                    "
                  >
                    {ClientInformation?.name?.[0]?.toUpperCase() ||
                      "N"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-[16px]
                        font-bold
                        text-slate-900
                      "
                    >
                      {ClientInformation?.name ||
                        "Nuzhath shakeel"}
                    </p>

                    <p
                      className="
                        truncate
                        text-[13px]
                        text-slate-500
                      "
                    >
                      {ClientInformation?.Address?.trim() ||
                        "Not Assigned"}
                    </p>
                  </div>

                  <span
                    className="
                      shrink-0
                      rounded-full
                      bg-sky-500
                      px-3
                      py-1.5
                      text-[10px]
                      font-semibold
                      text-white
                    "
                  >
                    {ClientInformation?.Status ||
                      "Active"}
                  </span>
                </div>

                {/* Information Grid */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {/* Patient */}
                  <div
                    className="
                      min-w-0
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50/50
                      px-2.5
                      py-2.5
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Patient
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-[14px]
                        font-bold
                        text-slate-900
                      "
                    >
                      {ClientInformation?.PatientName ||
                        "Not Provided"}
                    </p>
                  </div>

                  {/* Contact */}
                  <div
                    className="
                      min-w-0
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50/50
                      px-2.5
                      py-2.5
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Contact
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-[14px]
                        font-bold
                        text-slate-900
                      "
                    >
                      {ClientInformation?.email ||
                        ClientInformation?.Patient_PhoneNumber ||
                        "Not Provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= FILTER CONTROLS ================= */}
              <div className="mt-4 space-y-4">
                {/* Search HCP */}
                <div className="w-full">
                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Search HCP
                  </label>

                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Search HCP..."
                      value={searchResult}
                      onChange={(e) =>
                        setSearchResult(e.target.value)
                      }
                      className="
                        h-10
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        pl-10
                        text-sm
                        font-medium
                        text-slate-700
                        shadow-sm
                        outline-none
                        transition-all
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-[#1392d3]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#1392d3]/10
                      "
                    />

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        h-3.5
                        w-3.5
                        -translate-y-1/2
                        text-slate-400
                      "
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

                {/* Preferred Gender */}
                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Preferred Gender
                  </label>

                  <div
                    className="
                      flex
                      w-fit
                      max-w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-1
                    "
                  >
                    {["Male", "Female"].map(
                      (gender) => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              Gender: gender,
                            }))
                          }
                          className={`
                            min-w-[80px]
                            cursor-pointer
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            transition-all
                            sm:min-w-[90px]
                            sm:px-4
                            ${
                              form.Gender === gender
                                ? "bg-[#1392d3] text-white shadow-sm"
                                : "text-slate-600 hover:bg-white hover:text-[#1392d3]"
                            }
                          `}
                        >
                          {gender}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* HCP Type */}
                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    HCP Type
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {["HCA", "HCN", "HCPT"].map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              hcpType: type,
                            }))
                          }
                          className={`
                            cursor-pointer
                            rounded-lg
                            border
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            transition-all
                            ${
                              form.hcpType === type
                                ? "border-[#1392d3] bg-[#1392d3] text-white shadow-sm"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-[#1392d3]/40 hover:bg-white hover:text-[#1392d3]"
                            }
                          `}
                        >
                          {type}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ==================================================
              HCP RESULTS
          ================================================== */}
          <main
            className="
              min-h-0
              min-w-0
              flex-1
              overflow-y-auto
            "
          >
            <div
              className="
                min-h-full
                p-3
                sm:p-4
                lg:p-5
                xl:p-6
              "
            >
              {searchedHcps.length === 0 ? (
                /* ================= EMPTY STATE ================= */
                <div
                  className="
                    flex
                    min-h-[300px]
                    flex-col
                    items-center
                    justify-center
                    px-4
                    py-12
                    text-center
                    sm:min-h-[400px]
                    sm:py-16
                  "
                >
                  <img
                    src="/Icons/NoInformation.gif"
                    alt="No Data"
                    className="
                      h-32
                      w-auto
                      sm:h-40
                    "
                  />

                  <h2
                    className="
                      mt-5
                      text-xl
                      font-bold
                      text-gray-800
                      sm:text-2xl
                    "
                  >
                    No Suitable HCPs Found
                  </h2>

                  <p
                    className="
                      mt-2
                      max-w-md
                      text-xs
                      text-gray-500
                      sm:text-sm
                    "
                  >
                    No healthcare professionals matched
                    the current filters or requirements.
                  </p>
                </div>
              ) : (
                /* ================= HCP GRID ================= */
                <div
                  className="
                    grid
                    grid-cols-1
                    items-start
                    gap-4
                    sm:grid-cols-2
                    md:grid-cols-3
                    xl:grid-cols-4
                    2xl:grid-cols-5
                  "
                >
                  {searchedHcps.map((hcp) => {
                    const isAssigned =
                      Array.isArray(hcp?.Status) &&
                      hcp.Status.includes(
                        "Assigned"
                      );

                    return (
                      <div
                        key={hcp.UserId}
                        className="
                          relative
                          w-full
                          min-w-0
                          overflow-hidden
                          rounded-2xl
                          border
                          border-slate-200
                          bg-white
                          shadow-md
                          transition-all
                          duration-200
                          hover:-translate-y-0.5
                          hover:shadow-xl
                        "
                      >
                        {/* ================= CARD HEADER ================= */}
                        <div
                          className="
                            relative
                            h-16
                            bg-teal-600
                          "
                        >
                          {/* Profile Image */}
                          <div
                            className="
                              absolute
                              left-1/2
                              top-full
                              h-16
                              w-16
                              -translate-x-1/2
                              -translate-y-1/2
                              overflow-hidden
                              rounded-full
                              border-4
                              border-white
                              bg-white
                              shadow
                            "
                          >
                            <img
                              src={
                                hcp.ProfilePic ||
                                "/Icons/DefaultProfileIcon.png"
                              }
                              alt={
                                hcp.HCPFirstName
                              }
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          </div>
                        </div>

                        {/* ================= CARD CONTENT ================= */}
                        <div
                          className="
                            px-3
                            pb-4
                            pt-10
                            text-center
                          "
                        >
                          {/* Name */}
                          <h3
                            className="
                              truncate
                              text-sm
                              font-semibold
                              text-gray-800
                            "
                            title={`
                              ${hcp.HCPSurName || ""}
                              ${hcp.HCPFirstName || ""}
                              ${hcp.HCPLastName || ""}
                            `}
                          >
                            {hcp.HCPSurName}{" "}
                            {hcp.HCPFirstName}{" "}
                            {hcp.HCPLastName}
                          </h3>

                          {/* Contact */}
                          <p
                            className="
                              mt-1
                              truncate
                              text-[11px]
                              text-gray-500
                            "
                          >
                            +91{" "}
                            {hcp.HCPContactNumber ||
                              "-"}
                          </p>

                          {/* Address */}
                          <p
                            className="
                              mt-1
                              truncate
                              text-[10px]
                              text-gray-500
                            "
                            title={
                              hcp.CurrentAddress ||
                              "-"
                            }
                          >
                            {hcp.CurrentAddress ||
                              "-"}
                          </p>

                          {/* ================= TAGS ================= */}
                          <div
                            className="
                              mt-2
                              flex
                              flex-wrap
                              justify-center
                              gap-1
                            "
                          >
                            <span
                              className="
                                rounded-full
                                bg-green-100
                                px-2
                                py-1
                                text-[9px]
                                text-green-700
                              "
                            >
                              Age :
                              {hcp.DateOfBirth
                                ? calculateAgeIndianFormat(
                                    new Date(
                                      hcp.DateOfBirth
                                    ).toLocaleDateString(
                                      "en-IN"
                                    )
                                  )
                                : "-"}
                            </span>

                            <span
                              className="
                                rounded-full
                                bg-blue-100
                                px-2
                                py-1
                                text-[9px]
                                text-blue-700
                              "
                            >
                              Exp :{" "}
                              {hcp?.Experience ||
                                0}{" "}
                              yrs
                            </span>
                          </div>

                          {/* ================= GENDER ================= */}
                          <div
                            className="
                              m-1
                              flex
                              items-center
                              justify-center
                              gap-1.5
                              rounded
                              border
                              border-gray-400
                              p-1
                              shadow-sm
                            "
                          >
                            <span
                              className="
                                text-[10px]
                                font-medium
                                tracking-wide
                                text-gray-800
                              "
                            >
                              Gender:
                            </span>

                            <span
                              className="
                                text-[10px]
                                font-semibold
                                text-gray-500
                              "
                            >
                              {hcp.Gender ||
                                "N/A"}
                            </span>
                          </div>

                          {/* ================= LANGUAGES ================= */}
                          <div className="mt-2">
                            {hcp.Languages ? (
                              <p
                                className="
                                  truncate
                                  rounded-lg
                                  border
                                  border-yellow-300
                                  bg-yellow-100
                                  px-2
                                  py-1
                                  text-[10px]
                                  text-yellow-700
                                "
                                title={
                                  hcp.Languages
                                }
                              >
                                {hcp.Languages}
                              </p>
                            ) : (
                              <p
                                className="
                                  rounded-lg
                                  border
                                  border-red-300
                                  bg-red-100
                                  px-2
                                  py-1
                                  text-[10px]
                                  text-red-600
                                "
                              >
                                Languages Not Updated
                              </p>
                            )}
                          </div>

                          {/* ================= ASSIGN BUTTON ================= */}
                          <div
                            className="
                              mt-3
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                onAssign?.(hcp)
                              }
                              className="
                                cursor-pointer
                                rounded-full
                                bg-green-600
                                px-4
                                py-1.5
                                text-[10px]
                                font-medium
                                text-white
                                transition
                                hover:bg-green-700
                                active:scale-95
                              "
                            >
                              Assign
                            </button>
                          </div>
                        </div>

                        {/* ================= VIEW BUTTON ================= */}
                        <button
                          type="button"
                          aria-label={`View ${
                            hcp.HCPFirstName ||
                            "HCP"
                          }`}
                          onClick={() =>
                            showCompleteInformation(
                              hcp.UserId,
                              hcp.HCPFirstName
                            )
                          }
                          className="
                            absolute
                            right-2
                            top-2
                            flex
                            h-7
                            w-7
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-full
                            border
                            bg-white
                            shadow
                            transition
                            hover:scale-105
                            active:scale-95
                          "
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default RepleasementHCPPopup;