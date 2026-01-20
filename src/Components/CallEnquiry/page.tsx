"use client";

import { ClearEnquiry, GetUserInformation } from "@/Lib/user.action";
import {
  Phone,
  MapPin,
  Mail,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface CallEnquiryUser {
  _id: string;
  userId: string;
  FirstName: string;
  ContactNumber: string;
  Email: string;
  Location: string;
  userType: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  data: CallEnquiryUser[];
  title?: string;
}

export default function CallEnquiryList({
  data,
  title = "Call Enquiries",
}: Props) {
  const [StatusMessage,setStatusMessage]=useState<any>("")
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-6 text-center text-gray-500">
        No call enquiries found
      </div>
    );
  }


  const handleDelete = async (user: CallEnquiryUser) => {
    const userId = localStorage.getItem("UserId");
    console.log('Check for Info-------', user?.userId)
    if (userId) {
      const user = await GetUserInformation(userId);
      if (user?.Email !== "srivanikasham@curatehealth.in") {
        setStatusMessage('You don’t have the required permissions to proceed')
        return
      }


      const DeletCallEnquiry = await ClearEnquiry(user?.userId)
      if (DeletCallEnquiry.success === true) {
        setStatusMessage(DeletCallEnquiry.message)
      }


    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 w-full">
  
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h2
        className="text-2xl font-extrabold"
        style={{ color: "#ff1493" }}
      >
        {title}
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Total enquiries: {data.length}
      </p>
    </div>
{StatusMessage && (
  <div
    className="
      mt-4
      flex items-center gap-2
      px-4 py-2.5
      rounded-xl
      text-sm font-medium
      border
      transition
    "
    style={{
      backgroundColor:
        StatusMessage === "Enquiry deleted successfully"
          ? "#50c89620"
          : "#ff149320",
      color:
        StatusMessage === "Enquiry deleted successfully"
          ? "#50c896"
          : "#ff1493",
      borderColor:
        StatusMessage === "Enquiry deleted successfully"
          ? "#50c89640"
          : "#ff149340",
    }}
  >
    {StatusMessage}
  </div>
)}

    <span
      className="self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: "#50c89620",
        color: "#50c896",
        border: "1px solid #50c89640",
      }}
    >
      ACTIVE
    </span>
  </div>

  
  <div className="hidden md:grid grid-cols-[1.5fr_1.2fr_1.5fr_1.2fr_2fr_1fr_60px] gap-4 px-4 py-2 text-xs font-semibold text-gray-500 border-b">
    <span>Name</span>
    <span>Phone</span>
    <span>Email</span>
    <span>Location</span>
    <span>Comments</span>
    <span>Date</span>
    <span className="text-center">Action</span>
  </div>

  
  {data.map((user) => (
    <div
      key={user._id}
      className="
        border-b
        px-4 py-4
        hover:bg-gray-50
        transition
      "
    >
      
      <div className="hidden md:grid grid-cols-[1.5fr_1.2fr_1.5fr_1.2fr_2fr_1fr_60px] gap-4 items-center text-sm">
        <span className="font-medium text-gray-800">
          {user.FirstName || "Not Provided"}
        </span>

        <span className="flex items-center gap-1 text-gray-600">
          <Phone size={12} color="#1392d3" />
          {user.ContactNumber || "Awaiting Info"}
        </span>

        <span className="text-gray-600 truncate">
          {user.Email || "Not Provided"}
        </span>

        <span className="flex items-center gap-1 text-gray-600">
          <MapPin size={12} color="#ff1493" />
          {user.Location || "Not Provided"}
        </span>

        <span className="text-xs text-gray-500 truncate">
          {user.comments || "No comments"}
        </span>

        <span className="flex items-center gap-1 text-xs text-gray-400">
          <CalendarDays size={12} />
          {new Date(user.createdAt).toLocaleDateString()}
        </span>

        <button
          onClick={() => handleDelete(user)}
          className="flex justify-center p-2 rounded-lg hover:bg-red-50 transition"
        >
          <Trash2 size={16} color="#f10707" />
        </button>
      </div>

      {/* Mobile Card */}
      <div className="md:hidden space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-800">
            {user.FirstName || "Not Provided"}
          </span>
          <button
            onClick={() => handleDelete(user)}
            className="p-2 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={16} color="#f10707" />
          </button>
        </div>

        <div className="text-gray-600">
          📞 {user.ContactNumber || "Awaiting Info"}
        </div>

        <div className="text-gray-600">
          📧 {user.Email || "Not Provided"}
        </div>

        <div className="text-gray-600">
          📍 {user.Location || "Not Provided"}
        </div>

        <div className="text-xs text-gray-500">
          💬 {user.comments || "No comments"}
        </div>

        <div className="text-xs text-gray-400">
          📅 {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  ))}
</div>

  );
}
