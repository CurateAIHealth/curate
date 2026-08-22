"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Clock3,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Mail,
  Eye,
  FileText,
  CalendarDays,
  Upload,
  ImagePlus,
  X,
  UserRound,
  MessageSquareText,
  Star,
  Lightbulb,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { years } from "@/Lib/Content";
import { UpdateMonthFilter, UpdateYearFilter } from "@/Redux/action";
import { GetEmail } from "@/Lib/Actions";
import { LoadingData } from "../Loading/page";

/* =========================================================
   TYPES
========================================================= */

type ReviewStatus = "Pending" | "Completed";

interface GoogleReviewData {
  id: number;

  clientName: string;
  ptName: string;

  enrollmentDate: string;
  terminated: string;

  team: string;
  note: string;

  status: ReviewStatus;

  // Pending
  reviewRequested: boolean;
  reviewRequestMethod?: "Email" | "WhatsApp" | "Both" | null;

  // Completed
  review?: string | null;
  suggestions?: string | null;
  reviewDate?: string | null;
  ReviewImage?: string | null;
}

/* =========================================================
   TEST DATA
========================================================= */


/* =========================================================
   MAIN COMPONENT
========================================================= */


  const GoogleReviews: React.FC = () => {
  const [search, setSearch] = useState("");
const SearchMonth=useSelector((state:any)=>state.FilterMonth) 
const SearchYear=useSelector((state:any)=>state.FilterYear)
  const DeploymentInfo = useSelector(
    (state: any) => state.AdminDeployment
  );

const [reviewFilter, setReviewFilter] =
  useState<ReviewStatus>("Pending");

const [showTerminated, setShowTerminated] = useState(false);
const [ImportedInfo,setImportedInfo]=useState([])
const [selectedReview, setSelectedReview] = useState<{
  popupType: string;
  Info: any;
} | null>(null);


const users=useSelector((state:any)=>state.AdminUsers)
 const [isChecking, setisChecking] = useState(true)
 
const dispatch=useDispatch()
  /*
   * Convert DeploymentInfo into Google Review data
   */
const ImpMonth=`${SearchMonth}-${SearchYear}`
useEffect(()=>{
  const FetchGoogleReviewInfo=async()=>{
    
try{
const Get=await axios.post("/api/GetGoogleReview",{
ImpMonth
})

setImportedInfo(Get.data.data)
setisChecking(false)
}catch(err){
  
}
  }
  FetchGoogleReviewInfo()
},[SearchMonth,SearchYear])

const GetStatus = (
  importedInfo: any[],
  month: string,
  userId: string
): {
  status?: string;
  review?: string | null;
  suggestions?: string | null;
  reviewDate?: string | null;
  reviewImage?: string | null;
} | null => {
  const userInfo = importedInfo.find(
    (each: any) =>
      each?.Month === month &&
      each?.UserId === userId
  );

  return userInfo ?? null;
};

const TerminatedUsers = useMemo(() => {
  if (!Array.isArray(users) || !Array.isArray(DeploymentInfo)) {
    return [];
  }

  const deploymentUserIds = new Set(
    DeploymentInfo
      .map((item: any) => item?.UserId)
      .filter(Boolean)
  );

  return users.filter(
    (user: any) =>
      user?.userId &&
      !deploymentUserIds.has(user.userId)&&user.userType!=="healthcare-assistant"
  );
}, [users, DeploymentInfo]);

console.log ("Check Terminate Users---",TerminatedUsers)

const TerminationInformation = useMemo(() => {
  return TerminatedUsers.map((user: any, index: number) => ({
    id: user?.userId || user?._id || `terminated-${index}`,

    clientName: user?.FirstName?.trim() || "—",

    ptName: user?.patientName?.trim() || "—",

    enrollmentDate: user?.LeadDate || "—",

    terminated: "Terminated",

    team: user?.Team ?? "—",

    email: user?.Email || "—",

    contactNumber: user?.ContactNumber || "—",

    location: user?.Location || "—",

    serviceArea: user?.ServiceArea || "—",

    userId: user?.userId,

    clientStatus: user?.ClientStatus || "—",

    source: user?.Source || "—",
      status:GetStatus(ImportedInfo, ImpMonth, user?.userId || user?._id)?.status === "Completed"
              ? "Completed"
              : "Pending",

          reviewRequested: false,

          reviewRequestMethod: null,

          review:GetStatus(ImportedInfo, ImpMonth,user?.userId || user?._id)?.review|| null,

          suggestions:GetStatus(ImportedInfo, ImpMonth, user?.userId || user?._id)?.suggestions|| null,

          reviewDate:GetStatus(ImportedInfo, ImpMonth, user?.userId || user?._id)?.reviewDate|| null,
          ReviewImage:GetStatus(ImportedInfo, ImpMonth, user?.userId || user?._id)?.reviewImage|| null,
  }));
}, [TerminatedUsers]);
  const googleReviews = useMemo<GoogleReviewData[]>(() => {
    if (!Array.isArray(DeploymentInfo)) {
      return [];
    }

    return DeploymentInfo
      .filter(
        (item: any) =>
          item?.hcpSource?.toLowerCase() === "google"
      )
      .map((item: any, index: number) => {
        const endDate = item?.EndDate || "";

        return {
          id:
            item?._id?.toString() ||
            item?.ClientId ||
            `google-review-${index}`,

          clientName: item?.ClientName?.trim() || "—",

          ptName: item?.patientName?.trim() || "—",

          enrollmentDate: item?.StartDate || "—",

          terminated: endDate || "NA",

          // DeploymentInfo does not contain Team
          team: "—",

          // DeploymentInfo does not contain review note
          note: "",

          /*
           * Until your Google Review collection contains
           * review status, all new deployment records are Pending.
           */
          status:GetStatus(ImportedInfo, ImpMonth, item?.ClientId)?.status === "Completed"
              ? "Completed"
              : "Pending",

          reviewRequested: false,

          reviewRequestMethod: null,

          review:GetStatus(ImportedInfo, ImpMonth, item?.ClientId)?.review|| null,

          suggestions:GetStatus(ImportedInfo, ImpMonth, item?.ClientId)?.suggestions|| null,

          reviewDate:GetStatus(ImportedInfo, ImpMonth, item?.ClientId)?.reviewDate|| null,
          ReviewImage:GetStatus(ImportedInfo, ImpMonth, item?.ClientId)?.reviewImage|| null,
        };
      });
  }, [DeploymentInfo, ImportedInfo, ImpMonth]);

 
const ReviewFilterpopups=()=>{
  switch(selectedReview?.popupType){
case "Request Review":
  return  <ReviewModal
          data={selectedReview.Info}
          onClose={() =>
            setSelectedReview(null)
          }
        />;
case "Update Review":
 return   <SubmitReviewModal
    data={selectedReview.Info}
    onClose={() => setSelectedReview(null)}
    onSubmit={(reviewData) => {
    

      // API call here
      // await saveReview(reviewData);

      setSelectedReview(null);
    }}
  />

  case "View Review":
      return <ViewReviewModal
    data={selectedReview.Info}
    onClose={() => setSelectedReview(null)}
  />
        default:
          return null

  }
}
const pendingCount = googleReviews.filter(
  (item) => item.status === "Pending"
).length;

const completedCount = googleReviews.filter(
  (item) => item.status === "Completed"
).length;

  /* -------------------------------------------------------
     FILTER
  ------------------------------------------------------- */
console.log ("Current Check----",selectedReview)
const filteredData = useMemo(() => {
  const searchText = search.toLowerCase().trim();

  return googleReviews.filter((item) => {
    const matchesStatus =
      item.status === reviewFilter;

    const matchesSearch =
      !searchText ||
      item.clientName.toLowerCase().includes(searchText) ||
      item.ptName.toLowerCase().includes(searchText) ||
      item.team.toLowerCase().includes(searchText);

    return matchesStatus && matchesSearch;
  });
}, [googleReviews, search, reviewFilter]);
  if (isChecking) {
    return (
      <LoadingData />
    );
  }
  return (
    <div className="space-y-6">

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <SummaryCard
          title="Total Reviews"
        value={googleReviews.length}
          color="#1392d3"
        />

        <SummaryCard
          title="Pending Review"
          value={pendingCount}
          color="#ff1493"
        />

        <SummaryCard
          title="Completed Review"
          value={completedCount}
          color="#50c896"
        />

        <SummaryCard
          title="Review Rate"
        value={
  googleReviews.length
    ? `${Math.round(
        (completedCount / googleReviews.length) * 100
      )}%`
    : "0%"
}
          color="#1392d3"
        />

      </div>

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="border-b border-slate-200 p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}
            <div>

              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">

                <MessageCircle
                  size={20}
                  className="text-[#ff1493]"
                />

                Google Reviews

              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track pending and completed Google reviews 
              </p>

            </div>
            <div className="flex gap-2">
              {!showTerminated&&
 <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
             <select
      value={SearchMonth}
      onChange={(e) => dispatch(UpdateMonthFilter(e.target.value))}
      className="
        w-full sm:w-[140px] h-[40px]
        rounded-xl border border-gray-300
        px-3 text-sm bg-white text-gray-800
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
    >
      
      <option value="">All Months</option>
      {[...Array(12)].map((_, i) => (
        <option key={i} value={`${i + 1}`}>
          {new Date(0, i).toLocaleString("default", { month: "long" })}
        </option>
      ))}
    </select>

    {/* Year */}
    <select
      value={SearchYear}
      onChange={(e) => dispatch(UpdateYearFilter(e.target.value))}
      className="
        w-full sm:w-[120px] h-[40px]
        rounded-xl border border-gray-300
        px-3 text-sm bg-white text-gray-800
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
    >
      <option value="">All Years</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
          </div>}
            {/* Search */}
            <div className="relative w-full lg:w-80">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search client, PT or team..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#1392d3] focus:bg-white"
              />

            </div>
</div>
          </div>

          {/* =================================================
              PENDING / COMPLETED BUTTONS
          ================================================= */}
<div className="mt-5 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
  {/* Review Filters */}
  {showTerminated?<button
  type="button"
  onClick={() => setShowTerminated(!showTerminated)}
  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200
    ${
      !showTerminated
        ? "border border-[#1392d3] bg-[#1392d3] text-white shadow-[#1392d3]/20 hover:bg-[#1183bd] hover:shadow-md"
        : "border border-slate-200 bg-white text-slate-600 hover:border-[#1392d3] hover:bg-slate-50 hover:text-[#1392d3]"
    }`}
>
  <span
    className={`h-2 w-2 rounded-full ${
      !showTerminated ? "bg-white" : "bg-[#1392d3]"
    }`}
  />

  {showTerminated ? "View Active Deployments" : "Active Deployments"}
</button>:

  <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
    {/* Pending */}
    <button
      type="button"
      onClick={() => setReviewFilter("Pending")}
      className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:flex-none sm:px-5 ${
        reviewFilter === "Pending"
          ? "bg-[#1392d3] text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:border-[#1392d3] hover:text-[#1392d3]"
      }`}
    >
      <Clock3 size={17} className="shrink-0" />

      <span className="truncate">Pending Review</span>

      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
          reviewFilter === "Pending"
            ? "bg-white/20 text-white"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {pendingCount}
      </span>
    </button>

    {/* Completed */}
    <button
      type="button"
      onClick={() => setReviewFilter("Completed")}
      className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:flex-none sm:px-5 ${
        reviewFilter === "Completed"
          ? "bg-[#50c896] text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:border-[#50c896] hover:text-[#50c896]"
      }`}
    >
      <CheckCircle2 size={17} className="shrink-0" />

      <span className="truncate">Completed Review</span>

      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
          reviewFilter === "Completed"
            ? "bg-white/20 text-white"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {completedCount}
      </span>
    </button>
  </div>}

  {/* Terminated */}
<button
  type="button"
  onClick={() => setShowTerminated(true)}
  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 sm:w-auto ${
    showTerminated
      ? "border border-red-500 bg-red-500 text-white"
      : "border border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100 hover:shadow-md"
  }`}
>
  <span
    className={`h-2 w-2 shrink-0 rounded-full ${
      showTerminated ? "bg-white" : "bg-red-500"
    }`}
  />

  Terminated

  <span
    className={`rounded-full px-2 py-0.5 text-xs ${
      showTerminated
        ? "bg-white/20 text-white"
        : "bg-red-100 text-red-600"
    }`}
  >
    {TerminationInformation.length}
  </span>
</button>
</div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-x-auto">

     {showTerminated ? (
  <TerminationTable
    data={TerminationInformation}
  />
) : reviewFilter === "Pending" ? (
  <PendingReviewTable
    data={filteredData}
    onSelect={(review, popupType) => {
      setSelectedReview({
        Info: review,
        popupType,
      });
    }}
  />
) : (
  <CompletedReviewTable
    data={filteredData}
    onSelect={(review, popupType) => {
      setSelectedReview({
        Info: review,
        popupType,
      });
    }}
  />
)}

        </div>

      </div>

      {/* =================================================
          REVIEW POPUP
      ================================================= */}

{ReviewFilterpopups()}

    </div>
  );
};

/* =========================================================
   PENDING REVIEW TABLE
========================================================= */

interface ReviewTableProps {
  data: GoogleReviewData[];
  onSelect: (item: GoogleReviewData, popupType: string) => void;
}

const PendingReviewTable: React.FC<ReviewTableProps> = ({
  data,
  onSelect,
}) => {
  return (
    <table className="w-full min-w-[1250px]">

      <thead>

        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

          <th className="px-5 py-4">
            S.No
          </th>

          <th className="px-5 py-4">
            Client Name
          </th>

          <th className="px-5 py-4">
            PT Name
          </th>

          <th className="px-5 py-4">
            Enrollment Date
          </th>

          {/* <th className="px-5 py-4">
            Terminated
          </th> */}

          <th className="px-5 py-4">
            Team
          </th>


          <th className="px-5 py-4">
            Status
          </th>

          <th className="px-5 py-4">
            Request Review
          </th>

        </tr>

      </thead>

      <tbody className="divide-y divide-slate-100">

        {data.length > 0 ? (

          data.map((item, index) => (

            <tr
              key={index}
              className="transition hover:bg-slate-50"
            >

              {/* S.No */}
              <td className="px-5 py-4 text-sm font-semibold text-slate-500">
                {index + 1}
              </td>

              {/* Client */}
              <td className="px-5 py-4">

                <span className="font-semibold text-slate-800">
                  {item.clientName}
                </span>

              </td>

              {/* PT */}
              <td className="px-5 py-4 text-sm text-slate-600">
                {item.ptName}
              </td>

              {/* Enrollment */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-2 text-sm text-slate-600">

                  <CalendarDays
                    size={14}
                    className="text-[#1392d3]"
                  />

                  {item.enrollmentDate}

                </div>

              </td>

              {/* Terminated */}
              {/* <td className="px-5 py-4">

                {item.terminated === "NA" ? (

                  <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#50c896]">
                    Active
                  </span>

                ) : (

                  <span className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500">
                    {item.terminated}
                  </span>

                )}

              </td> */}

              {/* Team */}
             <td className="px-5 py-4">
  <span className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
    1
  </span>
</td>

            

              {/* Status */}
          <td className="px-5 py-4">
  <select
    defaultValue="Pending"
    onChange={(e) => {
      const value = e.target.value;

      if (value === "Successful") {
        onSelect(item,"Update Review");
      }
    }}
    className="w-full min-w-[130px] cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#1392d3] focus:ring-2 focus:ring-[#1392d3]/20 sm:w-auto"
  >
    <option value="Pending">Pending</option>
    <option value="Successful">Successful</option>
  </select>
</td>

              {/* Request Review */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      onSelect(item,"Request Review")
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1392d3] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                  >

                    <ExternalLink size={14} />

                    Request Review

                  </button>


                </div>

              </td>

            </tr>

          ))

        ) : (

          <EmptyRow colSpan={9} />

        )}

      </tbody>

    </table>
  );
};

/* =========================================================
   COMPLETED REVIEW TABLE
========================================================= */

const CompletedReviewTable: React.FC<ReviewTableProps> = ({
  data,
  onSelect,
}) => {
  return (
    <table className="w-full min-w-[1050px]">

      <thead>

        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

          <th className="px-5 py-4">
            S.No
          </th>

          <th className="px-5 py-4">
            Client Name
          </th>

          <th className="px-5 py-4">
            PT Name
          </th>

          <th className="px-5 py-4">
            Enrollment Date
          </th>

          <th className="px-5 py-4">
            Terminated
          </th>

          <th className="px-5 py-4">
            Review
          </th>

          <th className="px-5 py-4">
            Suggestions
          </th>

          <th className="px-5 py-4">
            Action
          </th>

        </tr>

      </thead>

      <tbody className="divide-y divide-slate-100">

        {data.length > 0 ? (

          data.map((item, index) => (

            <tr
              key={item.id}
              className="transition hover:bg-slate-50"
            >

              {/* S.No */}
              <td className="px-5 py-4 text-sm font-semibold text-slate-500">
                {index + 1}
              </td>

              {/* Client */}
              <td className="px-5 py-4">

                <span className="font-semibold text-slate-800">
                  {item.clientName}
                </span>

              </td>

              {/* PT */}
              <td className="px-5 py-4 text-sm text-slate-600">
                {item.ptName}
              </td>

              {/* Enrollment */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-2 text-sm text-slate-600">

                  <CalendarDays
                    size={14}
                    className="text-[#1392d3]"
                  />

                  {item.enrollmentDate}

                </div>

              </td>

              {/* Terminated */}
              <td className="px-5 py-4">

                {item.terminated === "NA" ? (

                  <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#50c896]">
                    Active
                  </span>

                ) : (

                  <span className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500">
                    {item.terminated}
                  </span>

                )}

              </td>

              {/* Review */}
              <td className="max-w-[300px] px-5 py-4">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

                  <p className="line-clamp-3 text-sm leading-5 text-slate-600">
                    {item.review || "No review available"}
                  </p>

                </div>

              </td>

              {/* Suggestions */}
              <td className="max-w-[280px] px-5 py-4">

                <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-3">

                  <p className="line-clamp-3 text-sm leading-5 text-slate-600">
                    {item.suggestions || "No suggestions"}
                  </p>

                </div>

              </td>

              {/* Action */}
              <td className="px-5 py-4">

                <button
                  type="button"
                  onClick={() =>

                   {
               
                     onSelect(item,"View Review")
                   }
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-[#1392d3]/30 bg-[#1392d3]/10 px-3 py-2 text-xs font-semibold text-[#1392d3] transition hover:bg-[#1392d3] hover:text-white"
                >

                  <Eye size={14} />

                  View Review

                </button>

              </td>

            </tr>

          ))

        ) : (

          <EmptyRow colSpan={8} />

        )}

      </tbody>

    </table>
  );
};
interface TerminationTableProps {
  data: any[];
}

const TerminationTable: React.FC<TerminationTableProps> = ({
  data,
}) => {
  return (
    <table className="w-full min-w-[1100px]">
      <thead>
        <tr className="border-b border-red-100 bg-red-50 text-left text-xs font-semibold uppercase tracking-wide text-red-500">
          <th className="px-5 py-4">S.No</th>
          <th className="px-5 py-4">Client Name</th>
          <th className="px-5 py-4">PT Name</th>
          <th className="px-5 py-4">Enrollment Date</th>
          <th className="px-5 py-4">Contact</th>
          <th className="px-5 py-4">Location</th>
          <th className="px-5 py-4">Team</th>
          <th className="px-5 py-4">Status</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {data.length > 0 ? (
          data.map((item: any, index: number) => (
            <tr
              key={item.id}
              className="transition hover:bg-red-50/40"
            >
              {/* S.No */}
              <td className="px-5 py-4 text-sm font-semibold text-slate-500">
                {index + 1}
              </td>

              {/* Client */}
              <td className="px-5 py-4">
                <span className="font-semibold text-slate-800">
                  {item.clientName}
                </span>

                <p className="mt-1 text-xs text-slate-400">
                  {item.email}
                </p>
              </td>

              {/* PT */}
              <td className="px-5 py-4 text-sm text-slate-600">
                {item.ptName}
              </td>

              {/* Enrollment */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CalendarDays
                    size={14}
                    className="text-[#1392d3]"
                  />

                  {item.enrollmentDate}
                </div>
              </td>

              {/* Contact */}
              <td className="px-5 py-4 text-sm text-slate-600">
                {item.contactNumber}
              </td>

              {/* Location */}
              <td className="px-5 py-4">
                <div className="text-sm font-medium text-slate-700">
                  {item.location}
                </div>

                <div className="text-xs text-slate-400">
                  {item.serviceArea}
                </div>
              </td>

              {/* Team */}
              <td className="px-5 py-4">
                <span className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                  {item.team}
                </span>
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Terminated
                </span>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={8} />
        )}
      </tbody>
    </table>
  );
};
/* =========================================================
   EMPTY ROW
========================================================= */

interface EmptyRowProps {
  colSpan: number;
}

const EmptyRow: React.FC<EmptyRowProps> = ({
  colSpan,
}) => {
  return (
    <tr>

      <td
        colSpan={colSpan}
        className="px-5 py-14 text-center"
      >

        <div className="flex flex-col items-center">

          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

            <FileText
              size={22}
              className="text-slate-400"
            />

          </div>

          <p className="font-semibold text-slate-600">
            No reviews found
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Try changing your search or filter.
          </p>

        </div>

      </td>

    </tr>
  );
};

/* =========================================================
   SUMMARY CARD
========================================================= */

interface SummaryCardProps {
  title: string;
  value: number | string;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  color,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <div className="mt-2 flex items-center gap-3">

        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />

        <p className="text-2xl font-bold text-slate-800">
          {value}
        </p>

      </div>

    </div>
  );
};

/* =========================================================
   REVIEW MODAL
========================================================= */

interface ReviewModalProps {
  data: GoogleReviewData;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  data,
  onClose,
}) => {
 
const [ReviewMessage,setReviewMessage]=useState("")
const users=useSelector((state:any)=>state.AdminUsers)
   const PostReview=async(ImpInfo:any)=>{
    try{
const ClientEmail= GetEmail(
  users,
  ImpInfo.id
)
setReviewMessage(`Please Wait sending Request to ${data.clientName}......`)
const mailResponse = await axios.post("/api/MailSend", {
  to:ClientEmail|| "tsiddu805@gmail.com",

  subject: `Curate Health Services-We'd Love Your Feedback`,

  html: `
<div style="
    max-width:720px;
    margin:30px auto;
    background:#ffffff;
    border:1px solid #e5e7eb;
    border-radius:20px;
    overflow:hidden;
    font-family:'Segoe UI',Arial,sans-serif;
    box-shadow:0 15px 40px rgba(15,23,42,.08);
">

    <!-- TOP BRAND AREA -->

    <div style="
        background:#f8fafc;
        padding:30px 35px;
        border-bottom:1px solid #e5e7eb;
    ">

        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="border-collapse:collapse;"
        >
            <tr>

                <!-- LOGO -->

                <td valign="middle">

                    <img
                        src="https://www.curatehealthservices.com/Icons/UpdateCurateLogo.png"
                        alt="Curate Health Services"
                        style="
                            height:65px;
                            width:auto;
                            display:block;
                        "
                    >

                </td>

                <!-- BADGE -->

                <td
                    align="right"
                    valign="middle"
                >

                    <div style="
                        display:inline-block;
                        background:#ffffff;
                        border:1px solid #dbeafe;
                        color:#1392D3;
                        padding:9px 16px;
                        border-radius:25px;
                        font-size:12px;
                        font-weight:700;
                        letter-spacing:1px;
                    ">
                        CUSTOMER FEEDBACK
                    </div>

                </td>

            </tr>
        </table>

    </div>


    <!-- MAIN CONTENT -->

    <div style="padding:40px 35px;">

        <!-- GREETING -->

        <div style="
            font-size:27px;
            font-weight:700;
            color:#0f172a;
            margin-bottom:12px;
        ">
            Hello ${data.clientName},
        </div>


        <p style="
            margin:0;
            color:#475569;
            font-size:16px;
            line-height:29px;
        ">
            Thank you for choosing <strong>Curate Health Services</strong>.
            We truly value the trust you place in our team and the care we provide.
        </p>


        <!-- REVIEW REQUEST CARD -->

        <div style="
            margin:32px 0;
            background:#f8fafc;
            border:1px solid #dbeafe;
            border-radius:18px;
            padding:32px 25px;
            text-align:center;
        ">

            <!-- STAR RATING -->

            <div style="
                font-size:30px;
                letter-spacing:5px;
                margin-bottom:15px;
            ">
                ★★★★★
            </div>


            <div style="
                font-size:23px;
                font-weight:700;
                color:#0f172a;
                margin-bottom:12px;
            ">
                We'd Love to Hear From You
            </div>


            <div style="
                color:#475569;
                font-size:15px;
                line-height:27px;
                max-width:520px;
                margin:0 auto;
            ">
                If you had a positive experience with Curate Health Services,
                would you take a moment to share your experience with us on Google?
                Your feedback means a lot to our team.
            </div>


            <!-- GOOGLE REVIEW BUTTON -->

            <div style="
                margin-top:28px;
            ">

              <a
    href="https://www.google.com/search?q=Curate+Health+Services+LLP+https%3A%2F%2Fshare.google%2FPDSlLBjPCYb7ednyI&oq=curate&gs_lcrp=EgZjaHJvbWUqBggBEEUYOzIGCAAQRRg5MgYIARBFGDsyBggCECMYJzIGCAMQIxgnMg0IBBAuGK8BGMcBGIAEMgcIBRAAGIAEMgcIBhAAGIAEMg0IBxAuGK8BGMcBGIAEMgcICBAAGI8CMgcICRAAGI8C0gEJNTAyOGowajE1qAIIsAIB8QVOQhkErsNjSA&sourceid=chrome&source=chrome.rb&ie=UTF-8&zx=1787420004746#lrd=0x3bcb95818e7628df:0x4398d692de34d5e2,3,,,,"
    target="_blank"
    rel="noopener noreferrer"
    style="
        display:inline-block;
        background:#1392D3;
        color:#ffffff;
        text-decoration:none;
        padding:15px 30px;
        border-radius:10px;
        font-size:16px;
        font-weight:700;
    "
>
    ★ &nbsp; Leave a Google Review
</a>

            </div>


            <div style="
                margin-top:15px;
                color:#64748b;
                font-size:12px;
            ">
                It only takes a minute.
            </div>

        </div>


        <!-- WHY IT MATTERS -->

        <div style="
            border:1px solid #e2e8f0;
            border-radius:16px;
            overflow:hidden;
            margin-bottom:30px;
        ">

            <div style="
                background:#1392D3;
                color:#ffffff;
                padding:15px 20px;
                font-size:17px;
                font-weight:600;
            ">
                Why Your Feedback Matters
            </div>


            <div style="
                padding:22px;
                color:#475569;
                font-size:15px;
                line-height:28px;
            ">

                Your review helps us understand what we're doing well
                and where we can continue to improve our services.

                <br><br>

                It also helps other families make informed decisions
                when choosing a trusted home healthcare provider.

            </div>

        </div>


        <!-- THANK YOU -->

        <div style="
            background:#f0fdfa;
            border-left:4px solid #50C896;
            border-radius:12px;
            padding:22px;
        ">

            <div style="
                color:#0f172a;
                font-size:18px;
                font-weight:600;
                margin-bottom:8px;
            ">
                Thank You ❤️
            </div>

            <div style="
                color:#475569;
                line-height:27px;
                font-size:15px;
            ">
                We appreciate your time, your trust, and the opportunity
                to serve you and your family.
            </div>

        </div>


        <!-- SIGNATURE -->

        <div style="
            margin-top:35px;
            border-top:1px solid #e2e8f0;
            padding-top:25px;
        ">

            <div style="
                color:#64748b;
                font-size:14px;
            ">
                Warm Regards,
            </div>

            <div style="
                color:#1392D3;
                font-size:20px;
                font-weight:700;
                margin-top:7px;
            ">
                Curate Health Services
            </div>

            <div style="
                color:#64748b;
                font-size:13px;
                margin-top:5px;
            ">
                Professional Home Healthcare Services
            </div>

        </div>

    </div>


    <!-- FOOTER -->

    <div style="
        background:#0f172a;
        color:#cbd5e1;
        text-align:center;
        padding:25px;
        font-size:13px;
        line-height:23px;
    ">

        <div style="
            color:#ffffff;
            font-weight:600;
            margin-bottom:6px;
        ">
            Curate Health Services
        </div>

        <div>
            info@curatehealth.in
        </div>

        <div>
            www.curatehealthservices.com
        </div>

        <div style="
            margin-top:10px;
            color:#94a3b8;
        ">
            Thank you for sharing your experience with us.
        </div>

    </div>

</div>
`,
});
  setReviewMessage(`Google Review Request Email Sent to ${data.clientName} `)

setTimeout(()=>{
  setReviewMessage("")

  onClose()

},1000)

    }catch(err:any){

    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-[#1392d3]">
              Google Review
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-800">
              {data.clientName}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              PT: {data.ptName}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200"
          >
            ×
          </button>

        </div>

        {/* Content */}
        <div className="space-y-5 p-5">

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs text-slate-400">
                Enrollment Date
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {data.enrollmentDate}
              </p>

            </div>
<div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                data.status === "Completed"
                  ? "bg-emerald-50 text-[#50c896]"
                  : "bg-pink-50 text-[#ff1493]"
              }`}
            >

              {data.status === "Completed" ? (
                <CheckCircle2 size={14} />
              ) : (
                <Clock3 size={14} />
              )}

              {data.status}

            </span>

          </div>
            {/* <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs text-slate-400">
                Team
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {data.team||1}
              </p>

            </div> */}

          </div>

          {/* Status */}
          

    
             <button
                type="button"
                onClick={()=>PostReview(data)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1392d3] py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <MessageCircle size={17} />
                Request Google Review
              </button>
{ReviewMessage && (
  <div
    className="
      mt-4
      w-full
      rounded-xl
      border
      border-emerald-200
      bg-emerald-50
      px-4
      py-3
      shadow-sm
    "
  >
    <div className="flex items-start gap-3">

      {/* Icon */}
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-emerald-100
          text-emerald-600
        "
      >
        ✓
      </div>

      {/* Message */}
      <div className="flex-1">
      

        <p className="mt-1 text-sm leading-6 text-emerald-700">
          {ReviewMessage}
        </p>
      </div>

    </div>
  </div>
)}
          {/* Completed */}
          {data.status === "Completed" && (
            <>

              <div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Review
                </p>

                <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {data.review || "No review available."}
                </div>

              </div>

              <div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Suggestions
                </p>

                <div className="rounded-xl bg-pink-50/50 p-4 text-sm leading-6 text-slate-600">
                  {data.suggestions || "No suggestions available."}
                </div>

              </div>

            

              <div className="flex items-center gap-2 text-sm text-slate-500">

                <CalendarDays
                  size={16}
                  className="text-[#1392d3]"
                />

                Review Date:

                <span className="font-semibold text-slate-700">
                  {data.reviewDate || "—"}
                </span>

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
};

interface SubmitReviewModalProps {
  data: GoogleReviewData;
  onClose: () => void;
  onSubmit: (reviewData: {
    UserId:any,
    review: string;
    suggestions: string;
    reviewImage: string;
    status: string;
    reviewDate: string;
    Month:any
  }) => void;
}

const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({
  data,
  onClose,
  onSubmit,
}) => {
  const SearchMonth = useSelector((state: any) => state.FilterMonth);
  const SearchYear = useSelector((state: any) => state.FilterYear);
  const ImpMonth = `${SearchMonth}-${SearchYear}`;

  const [review, setReview] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [status, setStatus] = useState("Completed");
  const [reviewImage, setReviewImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [reviewDate, setReviewDate] = useState("");

  // Indian date + time
  useEffect(() => {
    const now = new Date();
 
    const formattedDate = now.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setReviewDate(formattedDate);
  }, []);

  // Cloudinary Upload
  const handleImageUpload = 
  async (e: React.ChangeEvent<HTMLInputElement>) => {
       setImagePreview("Please Wait.....")
        const file = e.target.files?.[0];
      
        if (!file) return;
  
  
        if (file.size > 10 * 1024 * 1024) {
          alert('File too large. Max allowed is 10MB.');
          return;
        }
  
  
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg', 'application/pdf',];
        if (!allowedTypes.includes(file.type)) {
          alert('Only image or video files are allowed.');
          return;
        }
  
        const formData = new FormData();
        formData.append('file', file);
  
        try {
  
          
      
  
          const res = await axios.post('/api/Upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  setReviewImage(res.data.url)
  setImagePreview("✓ Image uploaded successfully")
       
    } catch (error) {
      console.error("Image upload error:", error);
      setImagePreview("");
      setReviewImage("");
    }
  };

  const handleSubmit = async() => {
   try{
     if (!review.trim()) {
      alert("Please enter the review.");
      return;
    }

        setImagePreview("Please Wait Submiting Review.....")
const postData={
      UserId: data.id,
      review,
      suggestions,
      reviewImage,
      status,
      reviewDate,
      Month:ImpMonth
    }
alert(postData.Month)
    const PostInDb=await axios.post("/api/GoogleReviewPost",{
postData

    })



setImagePreview(PostInDb.data.message)
setTimeout(()=>{
  onSubmit(postData)
},1000)
   }catch(err:any){
      
    }
  
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1392d3]">
              Google Review
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-800">
              Submit Review
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {data.clientName} · PT: {data.ptName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200"
          >
            ×
          </button>

        </div>

        {/* Content */}
        <div className="space-y-5 p-5">

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Enrollment Date
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {data.enrollmentDate}
              </p>
            </div>
   <div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Review Date
            </p>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">

              <CalendarDays
                size={17}
                className="text-[#1392d3]"
              />

              <span className="font-semibold text-slate-700">
                {reviewDate || "Loading..."}
              </span>

            </div>

          </div>
            {/* <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Team
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {data.team || 1}
              </p>
            </div> */}

          </div>

          {/* Review Date */}
       

          {/* Status */}
          <div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#1392d3] focus:ring-2 focus:ring-[#1392d3]/20"
            >
              <option value="Completed">
                Completed
              </option>

              <option value="Pending">
                Pending
              </option>
            </select>

          </div>

          {/* Review */}
          <div>

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Review
            </label>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              placeholder="Enter Google review..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1392d3] focus:ring-2 focus:ring-[#1392d3]/20"
            />

          </div>

          {/* Suggestions */}
          <div>

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Suggestions
            </label>

            <textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              rows={3}
              placeholder="Enter suggestions..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#ff1493] focus:ring-2 focus:ring-[#ff1493]/20"
            />

          </div>

          {/* Upload Image */}
          <div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Review Image
            </p>

            <label
              htmlFor="review-image"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 transition hover:border-[#1392d3] hover:bg-slate-100"
            >

              {reviewImage ? (
                <div className="relative w-full">

                  <img
                    src={reviewImage}
                    alt="Review preview"
                    className="mx-auto max-h-48 rounded-lg object-contain"
                  />

                  <div className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-[#1392d3]">
                    <Upload size={16} />
                    Change Image
                  </div>

                </div>
              ) : (
                <>
                  <ImagePlus
                    size={30}
                    className="mb-2 text-[#1392d3]"
                  />

                  <p className="text-sm font-semibold text-slate-600">
                    Upload Review Image
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    PNG, JPG or JPEG
                  </p>
                </>
              )}

              <input
                id="review-image"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageUpload}
                className="hidden"
              />

            </label>

            {imagePreview && (
              <p className="mt-2 truncate text-xs text-emerald-600">
                {imagePreview}
              </p>
            )}

          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1392d3] py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <MessageCircle size={17} />
            Submit Review
          </button>

        </div>
      </div>
    </div>
  );
};

interface ViewReviewModalProps {
  data: any;
  onClose: () => void;
}

const ViewReviewModal: React.FC<ViewReviewModalProps> = ({
  data,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1392d3]">
              Google Review
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-800">
              {data.clientName}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              PT: {data.ptName || "—"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 p-5">

          {/* Review Status */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Review Status
                </p>

                <p className="mt-1 text-lg font-bold text-emerald-700">
                  Review Submitted
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                ✓
              </div>

            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <UserRound
                  size={16}
                  className="text-[#1392d3]"
                />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Client
                </p>
              </div>

              <p className="mt-2 font-semibold text-slate-800">
                {data.clientName || "—"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-[#1392d3]"
                />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Review Date
                </p>
              </div>

              <p className="mt-2 font-semibold text-slate-800">
                {data.reviewDate || "—"}
              </p>
            </div>

          </div>

          {/* Review */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <MessageSquareText
                size={17}
                className="text-[#1392d3]"
              />

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Review
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={21}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-[15px] leading-7 text-slate-700">
                {data.review || "No review available."}
              </p>

            </div>
          </div>

          {/* Suggestions */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb
                size={17}
                className="text-[#ff1493]"
              />

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Suggestions
              </p>
            </div>

            <div className="rounded-2xl border border-pink-100 bg-pink-50/50 p-5">
              <p className="text-[15px] leading-7 text-slate-700">
                {data.suggestions || "No suggestions provided."}
              </p>
            </div>
          </div>

          {/* Review Image */}
          {data.ReviewImage && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Review Image
              </p>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <img
                  src={data.ReviewImage}
                  alt="Review"
                  className="h-auto max-h-[400px] w-full object-contain bg-slate-50"
                />
              </div>
            </div>
          )}

         
        

        </div>

        {/* Close Button */}
        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#1392d3] py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};



export default GoogleReviews;