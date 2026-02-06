"use client";



import { toProperCaseLive } from "@/Lib/Actions";
import { ClearEnquiry, GetUserInformation, UpdateClientStatusToProcessing } from "@/Lib/user.action";
import {
  Phone,
  MapPin,
  Mail,
  CalendarDays,
  Trash2,
  Send,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

interface CallEnquiryUser {
  LeadDate: any;
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
  const SearchMonth=useSelector((state:any)=>state.MonthFilterAdmin)
  const SearchYear=useSelector((state:any)=>state.YearFilterAdmin)
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-6 text-center text-gray-500">
        No call enquiries found
      </div>
    );
  }
console.log("Check for Data Info=======",data)

  const handleDelete = async (Clearuser: CallEnquiryUser) => {
    setStatusMessage("Please Wait....")
      const userId = localStorage.getItem("UserId");
    
    if (userId) {
      const user = await GetUserInformation(userId);
      console.log('Check for Info Mail-------', userId)
      if (user?.Email !== "admin@curatehealth.in") {
        setStatusMessage('You don’t have the required permissions to proceed')
        return
      }


      const DeletCallEnquiry = await ClearEnquiry(Clearuser?.userId)
      if (DeletCallEnquiry.success === true) {
        setStatusMessage(DeletCallEnquiry.message)
      }


    }
  };
const SendWhatsAppConfirmation=()=>{
  try{

  }catch(err:any){
    
  }
}
const UpdatedFilterUserType = useMemo(() => {
  return data
    .filter((each) => {
      const checkDate = (value: any) => {
        if (!value) return false;

        const date = new Date(value);
        if (isNaN(date.getTime())) return false;

        const matchesMonth =
          !SearchMonth ||
          date.toLocaleString("default", { month: "long" }) === SearchMonth;

        const matchesYear =
          !SearchYear || date.getFullYear() === Number(SearchYear);

        return matchesMonth && matchesYear;
      };

      return checkDate(each.createdAt) || checkDate(each.LeadDate);
    })
    .slice()
    .reverse();
}, [data, SearchMonth, SearchYear]);

const GRID_COLS =
  "grid-cols-[60px_1fr_1.2fr_1.2fr_2fr_120px_120px_60px]";

  

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 w-full">
  
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      
      <p className="text-sm text-gray-500 mt-1">
        Total enquiries: {UpdatedFilterUserType.length}
      </p>
      {/* <button
      onClick={async()=>{
const Post=await UpdateClientStatusToProcessing()

if(Post.success){
  alert("Done")
}
      }}
      >Updated</button> */}
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

  
<div
  className={`hidden md:grid ${GRID_COLS} gap-4 bg-blue-500 px-4 py-3 text-xs font-semibold text-white border-b`}
>
  <span>S.No</span>
  <span>Name</span>
  <span>Phone</span>
  <span>Location</span>
  <span>Comments</span>
  <span className="text-center">Message</span>
  <span>Date</span>
  <span className="text-center">Action</span>
</div>



{UpdatedFilterUserType.map((user, index) => (
 <div
 key={index}
  className={`hidden md:grid ${GRID_COLS} gap-4 items-center px-4 py-3 text-sm border-b`}
>
  <span className="text-gray-500 font-medium">
    {index + 1}
  </span>

  <span className="font-medium text-gray-800 truncate">
    {toProperCaseLive(user.FirstName) || "Not Provided"}
  </span>

  <span className="flex items-center gap-1 text-gray-600 truncate">
    <Phone size={12} className="shrink-0" />
    <span className="truncate">
      {user.ContactNumber || "Awaiting Info"}
    </span>
  </span>

  <span className="flex items-center gap-1 text-gray-600 truncate">
    <MapPin size={16} className="shrink-0 text-red-600" />
    <span className="truncate">
      {user.Location || "Not Provided"}
    </span>
  </span>

  <span className="text-xs text-gray-500 truncate">
    {toProperCaseLive(user.comments) || "No comments"}
  </span>

  <div className="flex justify-center">
    <button className="flex items-center cursor-pointer gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap" onClick={SendWhatsAppConfirmation}>
      <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="18"
      height="18"
      fill="currentColor"
    >
      <path d="M16 2.9C8.8 2.9 3 8.7 3 15.9c0 2.5.7 4.9 2.1 7L3 29l6.3-2c2 1.1 4.3 1.7 6.7 1.7 7.2 0 13-5.8 13-12.9S23.2 2.9 16 2.9zm0 23.4c-2.1 0-4.2-.6-6-1.7l-.4-.2-3.7 1.2 1.2-3.6-.2-.4c-1.2-1.9-1.9-4.1-1.9-6.4 0-6.2 5.1-11.3 11.4-11.3 6.3 0 11.4 5.1 11.4 11.3 0 6.2-5.1 11.3-11.4 11.3zm6.2-8.5c-.3-.2-1.8-.9-2.1-1s-.5-.2-.8.2-1 1.2-1.2 1.4-.4.3-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.2-.6.2-.2.3-.4.5-.6.2-.2.3-.4.4-.6.1-.2 0-.4 0-.6s-.8-2-1.1-2.8c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.1 1.4 3.3c.2.2 2.4 3.6 5.9 5 3.4 1.3 3.4.9 4 .9s2-.8 2.3-1.5c.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.5z" />
    </svg>
      Send
    </button>
  </div>

  <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
    <CalendarDays size={12} />
    {new Date(user.createdAt).toLocaleDateString()}
  </span>

  <div className="flex justify-center">
    <button
      onClick={() => handleDelete(user)}
      className="p-2 rounded-lg hover:bg-red-50 transition"
    >
      <Trash2 size={16} className="text-red-600" />
    </button>
  </div>
</div>

))}

</div>

  );
}
