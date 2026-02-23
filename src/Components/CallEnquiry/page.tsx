"use client";



import { toProperCaseLive } from "@/Lib/Actions";
import { ClearEnquiry, GetUserInformation, UpdateClientStatusinCallEnquiry, UpdateClientStatusToProcessing, UpdatedUserJoingDate } from "@/Lib/user.action";
import { Refresh } from "@/Redux/action";
import {
  Phone,
  MapPin,
  Mail,
  CalendarDays,
  Trash2,
  Send,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface CallEnquiryUser {
  ClientStatus: string | number | readonly string[] | undefined;
  NewLead: string | undefined;
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
  SearchData:any
}

export default function CallEnquiryList({
  data,
  SearchData,
  title = "Call Enquiries",
}: Props) {
 
  const SearchMonth=useSelector((state:any)=>state.MonthFilterAdmin)
  const SearchYear=useSelector((state:any)=>state.YearFilterAdmin)
  
    const loggedInEmail=useSelector((state:any)=>state.LoggedInEmail)
      const StatusMessage=useSelector((each:any)=>each.GlobelRefresh)
  const dispatch=useDispatch()
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-6 text-center text-gray-500">
        No call enquiries found
      </div>
    );
  }


  const handleDelete = async (Clearuser: CallEnquiryUser) => {
   
      dispatch(Refresh("Please Wait...."))
      const userId = localStorage.getItem("UserId");
    
   
      if (loggedInEmail === "srivanikasham@curatehealth.in") {
     
              dispatch(Refresh('You don’t have the required permissions to proceed'))
        return
      }
      const DeletCallEnquiry = await ClearEnquiry(Clearuser?.userId)
      if (DeletCallEnquiry.success === true) {
       
        dispatch(Refresh(DeletCallEnquiry.message))
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


          const matchesSearchResult =
    !SearchData ||
    [each.FirstName, each.Email, each.ContactNumber]
      .filter(Boolean)
      .some((value) =>
        value
          .toString()
          .toLowerCase()
          .includes(SearchData.toLowerCase())
      );

        return matchesMonth && matchesYear&&matchesSearchResult;
      };

      return checkDate(each.createdAt) || checkDate(each.LeadDate);
    })
    .slice()
    .reverse();
}, [data, SearchMonth, SearchYear]);

const UpdateClientStatus=async(UserId:any,Value:any)=>{
try{
  
  dispatch(Refresh("Please Wait....."))
const UpdateCurrentClientStatus=await   UpdateClientStatusinCallEnquiry(UserId,Value)
if(UpdateCurrentClientStatus.success){

  dispatch(Refresh("Status Updated Successfully"))
}
}catch(err:any){

}
}

const GRID_COLS =
  "grid-cols-[60px_120px_1.2fr_1.5fr_1.3fr_120px_1.2fr_2fr_80px]";


  


const lastUpdatedDates: Record<string, string> = {};

const UpdateJoiningDate = async (
  ClientName: any,
  ClientUserId: any,
  UpdatedValue: any
) => {
  try {
    
    if (!UpdatedValue) return;

   
    if (lastUpdatedDates[ClientUserId] === UpdatedValue) return;

    lastUpdatedDates[ClientUserId] = UpdatedValue;

    dispatch(Refresh("Please Wait..."));

    const PriorityResult: any = await UpdatedUserJoingDate(
      ClientUserId,
      UpdatedValue
    );

    if (PriorityResult.success === true) {
      dispatch(Refresh(`Lead Date Updated Successfully`));
    }
  } catch (err: any) {
    console.error(err);
  }
};


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
  className={`hidden md:grid ${GRID_COLS} gap-4 px-4 py-3 text-xs bg-gradient-to-r from-teal-600 to-emerald-500 text-white text-[10px] font-semibold`}
>
  <span>S.No</span>
  <span className="text-center">Date</span>
  <span>Lead Source</span>
  <span>Client Name</span>
  <span>Phone</span>
  <span className="text-center">Status</span>
  <span>Location</span>
  <span>Comments</span>
  <span className="text-center">Action</span>
</div>




{UpdatedFilterUserType.map((user, index) => (
 <div
 key={index}
  className={`hidden md:grid ${GRID_COLS} gap-4 items-center px-4 py-3 text-sm border-b border-gray-300`}
>
  <span className="text-gray-500 font-medium">
    {index + 1}
  </span>
 <span className="flex items-center justify-start gap-1 text-xs text-gray-400 whitespace-nowrap">
 
 <input
                            
                              className="
    h-8 w-[90px] px-1
    rounded-xl
    bg-white
    border border-slate-300
    text-[10px] font-semibold text-slate-700
    shadow-sm

    transition-all duration-200 ease-in-out

    hover:border-slate-400 hover:shadow-md
    focus:outline-none
    focus:border-[#62e0d9]
    focus:ring-2 focus:ring-[#caf0f8]
text-left
    disabled:bg-slate-100 disabled:cursor-not-allowed

  "
                       
   type="text"
  placeholder="DD-MM-YYYY"
  defaultValue={user.LeadDate || ""}
  onKeyDown={(e: any) => {
    if (e.key === "Enter") {
      const val = e.currentTarget.value;
      
      UpdateJoiningDate(user.FirstName, user.userId, val);
    }
  }}
                            />
                            
  </span>
   <span className="font-medium text-gray-800 truncate">
  {toProperCaseLive(user.NewLead) || "Not Provided"}
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
<span className="flex items-center w-fit text-center">
  <div className="relative w-fit text-center">
    <select
    defaultValue={user.ClientStatus}
    onChange={(e:any)=>UpdateClientStatus(user.userId,e.target.value)}
      className="w-fit text-center appearance-none text-xs font-medium
      px-3 py-1.5 pr-5 rounded-full
      bg-gradient-to-r from-slate-50 to-white
      border border-slate-200 text-slate-700
      shadow-sm
      hover:border-emerald-400 hover:shadow-md
      focus:outline-none focus:ring-2 focus:ring-emerald-400
      transition-all duration-200 cursor-pointer"
    >
      {["Save","Send","Converted","Waiting List","Lost"].map((each:any,i:number)=>(
        <option key={i} value={each}>{each}</option>
      ))}
    </select>

  
    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
      ▼
    </span>
  </div>
</span>


  <span className="flex items-center gap-1 text-gray-600 truncate">
    <MapPin size={16} className="shrink-0 text-green-600" />
    <span className="truncate">
      {user.Location || "Not Provided"}
    </span>
  </span>

  <span className="text-xs text-gray-500 truncate">
    {toProperCaseLive(user.comments) || "No comments"}
  </span>

  {/* <div className="flex justify-center">
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
  </div> */}

 

  <div className="flex justify-center">
    <button
      onClick={() => handleDelete(user)}
      className="p-2 rounded-lg hover:bg-red-50 transition"
    >
      <Trash2 size={16} className="text-red-600 cursor-pointer" />
    </button>
  </div>
</div>

))}

</div>

  );
}
