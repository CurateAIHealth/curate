'use client';

import {
  GetDeploymentInfo,
  GetRegidterdUsers,
  GetUserInformation,
  GetUsersFullInfo,
  InserTimeSheet,
  UpdatedClientPriority,
  UpdatedPreviewUserType,
  UpdatedServiceArea,
  UpdatedUserJoingDate,
  UpdateHCAnstatus,
  UpdateUserContactVerificationstatus,
  UpdateUserCurrentstatus,
  UpdateUserEmailVerificationstatus
} from '@/Lib/user.action';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CircleCheckBig, Delete, LogOut, Pencil, Trash, Trash2 } from 'lucide-react';
import {  Update_Main_Filter_Status, UpdateClient, UpdateClientSuggetion, UpdateSubHeading, UpdateUserInformation, UpdateUserType } from '@/Redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { ClientEnquiry_Filters, filterColors, hyderabadAreas, Main_Filters, Payments_Filters, Placements_Filters, ReferralPay_Filters, Timesheet_Filters } from '@/Lib/Content';

import { select, thead, tr } from 'framer-motion/client';
import ClientTable from '@/Components/Placements/page';
import { HCAList } from '@/Redux/reducer';
import WorkingOn from '@/Components/CurrentlyWoring/page';
import axios from 'axios';
import { setTimeout } from 'timers/promises';
import { decrypt, encrypt } from '@/Lib/Actions';
import InvoiceMedicalTable from '@/Components/TimeSheetInfo/page';
import { LoadingData } from '@/Components/Loading/page';
import ReplacementsTable from '@/Components/ReplacementsTable/page';
let cachedUserInfo: any = null;
let cachedRegisteredUsers: any[] | null = null;
let cachedFullInfo: any[] | null = null;
let Deployed:any[] 
export default function UserTableList() {
  const [updatedStatusMsg, setUpdatedStatusMsg] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [UserFirstName, setUserFirstName] = useState("");
const [SearchDate,SetSearchDate]=useState<any>(null)
  const [search, setSearch] = useState('');
  const [AsignStatus,setAsignStatus]=useState("")
  const [LoginEmail, setLoginEmail] = useState("");
const [ShowDeletePopUp,setShowDeletePopUp]=useState(false)
  const Status =["Processing", "Converted", "Waiting List", "Lost", ];
  const EmailVerificationStatus = ['Verified', 'Pending'];
  const CurrentStatusOptions = ["Active", "Sick", "Leave", "Terminated"];

  const [UserFullInfo, setFullInfo] = useState([])
  const router = useRouter();
  const dispatch = useDispatch();
const UpdateMainFilter=useSelector((state:any)=>state.Main_Filter)
const CurrentClientStatus=useSelector((state:any)=>state.Submitted_Current_Status)
const UpdateduserType=useSelector((state:any)=>state.ViewHCPList)
const CurrentCount=useSelector((state:any)=>state.updatedCount)
const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const UpdateStatus = async (first: string, e: string, UserId: any) => {
    setUpdatedStatusMsg(`Updating ${first} Contact Status....`);
    try {
      const res = await UpdateUserContactVerificationstatus(UserId, e);
      if (res?.success === true) {
        setUpdatedStatusMsg(`${first} Verification Status Updated Successfully`);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const UpdateEmailVerificationStatus = async (first: string, e: string, UserId: any) => {
    setUpdatedStatusMsg(`Updating ${first} Email Verification Status....`);
    try {
      const res = await UpdateUserEmailVerificationstatus(UserId, e);
      if (res?.success === true) {
        setUpdatedStatusMsg(`${first} Email Verification Status Updated Successfully`);
      }
      
    } catch (err: any) {
      console.error(err);
    }
  };
   const UpdateCurrentstatus = async (first: string, e: string, UserId: any) => {
    setUpdatedStatusMsg(`Updating ${first} Current Status....`);
    try {
      const res = await UpdateUserCurrentstatus(UserId, e);
      if (res?.success === true) {
        setUpdatedStatusMsg(`${first} Current Status Updated Successfully`);
      }
      
    } catch (err: any) {
      console.error(err);
    }
  };

  const Finel = users.map((each: any) => ({
    id: each.userId,
    FirstName: each.FirstName,
    AadharNumber: each.AadharNumber,
    Age: each.Age,
    userType: each.userType,
    Location: each.Location||each.serviceLocation||'Not Provided',
    Email: each.Email,
    Contact: each.ContactNumber,
    userId: each.userId,
    VerificationStatus: each.VerificationStatus,
    DetailedVerification: each.FinelVerification,
    EmailVerification: each.EmailVerification,
    ClientStatus: each.ClientStatus||"Processing",
    Status:each.Status,
    CurrentStatus:each.CurrentStatus||"Sick",
    LeadSource:each.Source,
    ClientPriority:each.ClientPriority,
    LeadDate:each.LeadDate,
    ServiceArea:each.ServiceArea,
    ServiceLocation:each.ServiceArea,
    PreviewUserType:each.PreviewUserType
  }));

const UpdatedFilterUserType = useMemo(() => {
  return Finel
    .filter((each) => {
      const matchesType = !UpdateduserType || each.userType === UpdateduserType;
      const matchesSearch = !search || each.ClientStatus === search;
      const matchesDate = !SearchDate || each.LeadDate === SearchDate;
      const notAdmin = each.Email !== "admin@curatehealth.in";

      return matchesType && matchesSearch && matchesDate && notAdmin;
    })
    .slice()   
    .reverse(); 
}, [Finel, UpdateduserType, search, SearchDate]);



console.log("Check For Issues-----",UpdatedFilterUserType)
useEffect(() => {
  const Fetch = async () => {
    try {
      const localValue = localStorage.getItem("UserId");
      if (!localValue) return;

  
      if (UpdateduserType) {
        cachedUserInfo = null;
        cachedRegisteredUsers = null;
        cachedFullInfo = null;
      }

  
      const [profile, registeredUsers, fullInfo,DeployedLength] = await Promise.all([
        cachedUserInfo ?? GetUserInformation(localValue),
        cachedRegisteredUsers ?? GetRegidterdUsers(),
        cachedFullInfo ?? GetUsersFullInfo(),
        Deployed?? GetDeploymentInfo()
      ]);

    
      cachedUserInfo ||= profile;
      cachedRegisteredUsers ||= registeredUsers;
      cachedFullInfo ||= fullInfo;
      Deployed ||=DeployedLength 

     
      setUsers(registeredUsers);
      setUserFirstName(profile.FirstName);
      setLoginEmail(profile.Email);
      setFullInfo(fullInfo);
    

      const email = profile?.Email?.toLowerCase();


      if (email === "info@curatehealth.in") {
        dispatch(UpdateUserType("patient"));
      } else if (email === "gouricurate@gmail.com") {
        dispatch(UpdateUserType("healthcare-assistant"));
      }

     
      const restricted = [
        "admin@curatehealth.in",
        "info@curatehealth.in",
        "gouricurate@gmail.com"
      ];

      if (!restricted.includes(email)) {
        router.push("/");
        return;
      }

    } catch (err: any) {
      console.error("Error fetching data:", err);
    } finally {
      setIsChecking(false);
    }
  };

  Fetch();
}, [updatedStatusMsg, CurrentClientStatus, UpdateduserType]);



 const FilterUserType = (e: any) => {
  if (e.target.value !== "patient") {

  }
  dispatch(UpdateUserType(e.target.value));
};


  const UpdateFilterValue = (UpdatedValue: any) => {
    setSearch(UpdatedValue)
    // dispatch(UpdateSubHeading(UpdatedValue))
    // dispatch(Update_Main_Filter_Status(UpdatedValue))
  };

  const UpdateMainFilterValue=(Z:any)=>{

    // SetUpdateMainFilter(Z)
    dispatch(Update_Main_Filter_Status(Z))
  }


  

console.log("Set Searchhhh------",search)
  const UpdateMainFilterValues = () => {
    switch (UpdateMainFilter) {
      case "Client Enquiry":
              
        return ClientEnquiry_Filters;
      case "Deployment":
        return Placements_Filters;
      case "Timesheet":
        return []
      case "Referral Pay":
        return ReferralPay_Filters;
      case "Payments":
        return Payments_Filters;
      default:
        return []

    }
  }


  const UpdateFilterHCA=(e:any)=>{
setAsignStatus(e.target.value)
  }
  if(isChecking){
  return <LoadingData/>
}
  const ContetUserInterface=()=>{
      switch (UpdateMainFilter) {
      case "Client Enquiry":
        case "HCP List":
        return ClientEnquiryUserInterFace()
      case "Deployment":
        return <ClientTable/>
      case "Timesheet":
        return <InvoiceMedicalTable/>
         case "Replacements":
        return <ReplacementsTable/>
      case "Referral Pay":
        return <WorkingOn ServiceName="Referral Pay"/>
      case "Payments":
        return <WorkingOn ServiceName="Payments"/>
      default:
        return null

    }
  }
const sendWhatsApp = async (clientNumber: string, hcaNumber: string) => {
  const res = await axios.post("/api/send-whatsapp", {
    clientNumber,
    hcaNumber,
  });


};

const UpdateClientPriority=async(ClientName:any,ClientUserId:any,UpdatedValue:any)=>{
try{
   setUpdatedStatusMsg(`Please Wait,${ClientName} Priority Updateding...`);
const PriorityResult:any=await UpdatedClientPriority(ClientUserId,UpdatedValue)

if(PriorityResult.success===true){
 setUpdatedStatusMsg(`${ClientName} Priority Updated Successfully`);
}
}catch(err:any){

}
}

const UpdateClientServiceLocation=async(ClientName:any,ClientUserId:any,UpdatedValue:any)=>{
try{
   setUpdatedStatusMsg(`Please Wait,${ClientName} Priority Updateding...`);
const AreaUpdateResult:any=await UpdatedServiceArea(ClientUserId,UpdatedValue)

if(AreaUpdateResult.success===true){
 setUpdatedStatusMsg(`${ClientName} Priority Updated Successfully`);
}
}catch(err:any){

}
}

const UpdatePreviewUserType=async(ClientName:any,ClientUserId:any,UpdatedValue:any)=>{
try{
   setUpdatedStatusMsg(`Please Wait,${ClientName} Priority Updateding...`);
const AreaUpdateResult:any=await UpdatedPreviewUserType(ClientUserId,UpdatedValue)

if(AreaUpdateResult.success===true){
 setUpdatedStatusMsg(`${ClientName} Priority Updated Successfully`);
}
}catch(err:any){

}
}



const UpdateJoiningDate=async(ClientName:any,ClientUserId:any,UpdatedValue:any)=>{
try{
   setUpdatedStatusMsg(`Please Wait,${ClientName} Priority Updateding...`);
const PriorityResult:any=await UpdatedUserJoingDate(ClientUserId,UpdatedValue)

if(PriorityResult.success===true){
 setUpdatedStatusMsg(`${ClientName} Priority Updated Successfully`);
}
}catch(err:any){

}
}

  const UpdateAssignHca = async (UserIDClient: any, UserIdHCA: any, ClientName: any, ClientEmail: any, ClientContact: any,Adress:any, HCAName: any, HCAContact: any) => {
    setUpdatedStatusMsg("Please Wait Assigning HCA...")
    try {
      const today = new Date();
      const attendanceRecord = {
        date: today.toLocaleDateString('EN-In'),
        checkIn: today.toLocaleTimeString(),
        status: "Present",
      };

    
      const TimeSheetData: any[] = [];
      TimeSheetData.push(attendanceRecord)
      const UpdateStatus=await UpdateUserContactVerificationstatus(UserIDClient,"Placced")
      const UpdateHcaStatus= await UpdateHCAnstatus(UserIdHCA,"Assigned")
      const PostTimeSheet:any = await InserTimeSheet(UserIDClient, UserIdHCA, ClientName, ClientEmail, ClientContact,Adress, HCAName, HCAContact, TimeSheetData)
      if(PostTimeSheet.success=== true){
setUpdatedStatusMsg("HCA Assigned Successfully, For More Information Check in Placemets")

sendWhatsApp("+919347877159","+919347877159"); 




      }
      
    } catch (err: any) {
setUpdatedStatusMsg(err)
    }
  }
const toCamelCase = (value?: string | null) => {
  if (!value) return "Not Provided"; 

  return value
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
};



const ClientEnquiryUserInterFace = () => {
  return (
    <div className="w-full">
      {ShowDeletePopUp && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg">

  <div className="w-full max-w-md bg-white rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.35)] animate-fadeIn">

    {/* Icon */}
    <div className="flex justify-center pt-8">
      <div className="h-14 w-14 rounded-full border border-red-200 bg-red-50 flex items-center justify-center">
        <Trash2 size={22} className="text-red-600" />
      </div>
    </div>

    {/* Content */}
    <div className="px-8 pt-6 pb-8 text-center">
      <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
        Delete Client
      </h2>

      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
        This client and all associated data will be permanently deleted.
        This action cannot be undone.
      </p>

      <p className="mt-4 text-sm font-medium text-gray-900">
        Do you want to continue?
      </p>
    </div>

   
    <div className="flex border-t border-gray-200">
      <button
        onClick={() => setShowDeletePopUp(false)}
        className="flex-1 py-4 text-sm font-medium text-gray-700
        hover:bg-gray-50 transition rounded-bl-[28px]"
      >
        Cancel
      </button>

      <div className="w-px bg-gray-200" />

      <button
     
        className="flex-1 py-4 text-sm font-semibold text-red-600
        hover:bg-red-50 transition rounded-br-[28px]"
      >
        Delete
      </button>
    </div>

  </div>
</div>

)}
      {UpdatedFilterUserType.length > 0 ? (
        <div className="bg-white/90 rounded-2xl shadow-2xl border border-gray-100">
          <div className=" overflow-y-auto">
            <div className="w-full overflow-x-auto sm:overflow-x-hidden">
              <table className="table-fixed w-full min-w-[800px] text-[11px] sm:text-[13px] text-left text-gray-700 border-collapse">
                <thead className="bg-[#f5faff] sticky top-0 z-10">
                  <tr>
                    {UpdateduserType === "patient"&&
                      <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">Date</th>}
                      {UpdateduserType === "patient"&&
                    <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">Lead Source</th>}
                    {UpdateduserType === "patient"&&
                    <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">Client Priority</th>}
                     {UpdateduserType === "healthcare-assistant"&&
                    <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">User type</th>}
                    <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">Name</th>
                    {/* <th className="px-2 py-2 sm:px-4 sm:py-3 w-[18%]">Email</th> */}
                    <th className="px-2 py-2 w-[12%]">Contact</th>
                    {/* <th className="px-2 py-2 w-[10%]">Role</th>
                    <th className="px-2 py-2 w-[12%]">Aadhar</th> */}
                    <th className="px-2 py-2 w-[12%]">Location</th>
                    <th className="px-2 py-2 w-[14%]">Email Verification</th>
                    {UpdateduserType !== "healthcare-assistant" && (
                      <th className="px-4 py-2 w-[14%]">Client Status</th>
                    )}
                    {UpdateduserType === "healthcare-assistant" && (
                      <th className="px-4 py-2 w-[14%]">Current Status</th>
                    )}
                    {/* {UpdateMainFilter === "Client Enquiry" && search === "Converted" && (
                      <th className="px-2 py-2 w-[14%]">Designate</th>
                    )} */}
                    <th className="px-4 py-2 w-[10%]">Action</th>
                    {UpdateduserType==='patient'&&<th className="px-2 py-2 w-[10%]">Suitable HCP</th>}
                        {UpdateduserType==='patient'&&<th className="px-2 py-2 w-[10%]">Delete</th>}
                  </tr>
                </thead>
                <tbody>
                  {UpdatedFilterUserType.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-400 even:bg-[#f8fafd] hover:bg-[#e7fbfc] transition-colors"
                    >
                       {UpdateduserType === "patient"&&    <td><input
  type="date"
  value={user.LeadDate||''}
  className="
    h-11 w-[150px] px-4
    rounded-xl
    bg-white
    border border-slate-300
    text-sm font-semibold text-slate-700
    shadow-sm

    transition-all duration-200 ease-in-out

    hover:border-slate-400 hover:shadow-md
    focus:outline-none
    focus:border-[#62e0d9]
    focus:ring-2 focus:ring-[#caf0f8]

    disabled:bg-slate-100 disabled:cursor-not-allowed

  "
  onChange={(e:any)=>UpdateJoiningDate(user.FirstName,user.userId,e.target.value)}
/>
</td>}
                   {UpdateduserType === "patient"&&
                      <td className='pl-6'>{user.LeadSource||"Not Mentioned"}</td>}
                      {UpdateduserType === "patient"&&
                      <td>
                        <select
  className={`
    h-11 w-[130px] px-3
    ml-auto cursor-pointer
    rounded-xl bg-white
    border border-slate-300
    text-sm font-semibold text-slate-700
    shadow-sm
    transition-all duration-200 ease-in-out

    hover:border-slate-400 hover:shadow-md
    focus:outline-none
    focus:border-[#62e0d9]
    focus:ring-2 focus:ring-[#caf0f8]
  `}
  value={user?.ClientPriority ?? "Stable"}

  onChange={(e)=>UpdateClientPriority(user.FirstName,user.userId,e.target.value)}
>
  <option value="Important">⭐Important</option>
  <option value="stable">🟢 Stable</option>
  <option value="VIP">👑VIP</option>
  <option value="Critical">🔴 Critical </option>
</select>
                      </td>}
 {UpdateduserType === "healthcare-assistant"&&
<td className="px-6 py-2 break-words">
 
    <div className="flex items-center gap-2">
    
      <span
        className={`text-sm ${
          user.PreviewUserType
            ? "text-slate-700 font-medium"
            : "italic text-slate-400"
        }`}
      >
        {user.PreviewUserType || "Not mentioned"}
      </span>

  
      <button
        onClick={() => setEditingUserId(user.userId)}
        className="
          rounded-lg p-1
          text-slate-500
          transition-all
          hover:bg-slate-100 hover:text-slate-700
        "
        title="Edit service area"
      >
        <Pencil size={14} />
      </button>

  
    {editingUserId === user.userId && (
  <div
    className="
      absolute z-50
      mt-2
      w-56
      rounded-xl
      bg-white
      border border-slate-200
      shadow-[0_12px_30px_rgba(0,0,0,0.12)]
      p-2
      animate-in fade-in zoom-in-95
    "
  >
    <select
      autoFocus
      onChange={(e) => {
        UpdatePreviewUserType(user.FirstName,user.userId,e.target.value)
        setEditingUserId(null);
      }}
      onBlur={() => setEditingUserId(null)}
      className="
        h-10 w-full px-3
        rounded-lg
        border border-slate-300
        bg-[#f8fafc]
        text-sm font-medium text-slate-700
        cursor-pointer

        focus:outline-none
        focus:border-[#62e0d9]
        focus:ring-2 focus:ring-[#caf0f8]
      "
    >
      <option value="">Select Type</option>
      {["HCA", "HCP", "HCN"].map((area: any) => (
        <option key={area} value={area}>
          {area}
        </option>
      ))}
    </select>
  </div>
)}

    </div>
  
</td>
 }

                      <td className="px-2 py-2 truncate">
                        <div className="flex items-center gap-2">
                          {/* <img
                            src={
                              FilterProfilePic.filter((each:any) => each.UserId === user.id)[0]?.Documents?.ProfilePic ||
                              FilterProfilePic.filter((each:any) => each.UserId === user.id)[0]?.ProfilePic ||
                              "Icons/DefaultProfileIcon.png"
                            }
                            className="rounded-full h-7 w-7 sm:h-10 sm:w-10 object-cover"
                          /> */}
                          <span className="font-semibold text-[#007B7F] truncate">
  {toCamelCase(user.FirstName)}
</span>

                        </div>
                      </td>
                      {/* <td className="px-2 py-2 break-words">{user?.Email?.toLowerCase()||"Not Provided"}</td> */}
                      <td className="px-2 py-2">+91{user?.Contact||"Not Provided"}</td>
                      {/* <td className="px-2 py-2">
                        <span className="px-2 sm:px-3 py-1 rounded-full bg-[#ecfefd] text-[#009688] font-semibold uppercase text-[9px] sm:text-xs">
                          {user.userType === "healthcare-assistant" ? "HCA" : user.userType}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        {user.AadharNumber ? user.AadharNumber : "Aadhaar Pending"}
                      </td> */}
<td className="px-2 py-2 break-words">
  {UpdateduserType === "patient" ? (
    <div className="flex items-center gap-2">
      {/* Display Value */}
      <span
        className={`text-sm ${
          user.ServiceLocation
            ? "text-slate-700 font-medium"
            : "italic text-slate-400"
        }`}
      >
        {user.ServiceLocation || "Not mentioned"}
      </span>

      {/* Pencil Icon */}
      <button
        onClick={() => setEditingUserId(user.userId)}
        className="
          rounded-lg p-1
          text-slate-500
          transition-all
          hover:bg-slate-100 hover:text-slate-700
        "
        title="Edit service area"
      >
        <Pencil size={14} />
      </button>

  
    {editingUserId === user.userId && (
  <div
    className="
      absolute z-50
      mt-2
      w-56
      rounded-xl
      bg-white
      border border-slate-200
      shadow-[0_12px_30px_rgba(0,0,0,0.12)]
      p-2
      animate-in fade-in zoom-in-95
    "
  >
    <select
      autoFocus
      onChange={(e) => {
        UpdateClientServiceLocation(user.FirstName,user.userId,e.target.value)
        setEditingUserId(null);
      }}
      onBlur={() => setEditingUserId(null)}
      className="
        h-10 w-full px-3
        rounded-lg
        border border-slate-300
        bg-[#f8fafc]
        text-sm font-medium text-slate-700
        cursor-pointer

        focus:outline-none
        focus:border-[#62e0d9]
        focus:ring-2 focus:ring-[#caf0f8]
      "
    >
      <option value="">Select area</option>
      {hyderabadAreas.map((area: any) => (
        <option key={area} value={area}>
          {area}
        </option>
      ))}
    </select>
  </div>
)}

    </div>
  ) : (
    <span className="text-sm text-slate-700">
      {GetPermanentAddress(user.userId)}
    </span>
  )}
</td>

                      <td className="px-2 py-2">
                        <select
                          className="w-full text-center px-2 py-1 rounded-lg bg-[#f9fdfa] border border-gray-200 cursor-pointer text-xs sm:text-sm"
                          defaultValue={user.EmailVerification ? "Verified" : "Pending"}
                          onChange={(e) =>
                            UpdateEmailVerificationStatus(user.FirstName, e.target.value, user.userId)
                          }
                        >
                          {EmailVerificationStatus.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      {user.userType === "patient" && (
                        <td className="px-2 py-2">
                          <select
                            className={`w-full px-2 py-2 rounded-xl text-center font-medium transition-all duration-200 cursor-pointer ${
                              user.ClientStatus === "Placced"
                                ? "text-[13px] font-bold shadow-lg"
                                : "shadow-md"
                            } ${filterColors[user.ClientStatus]}`}
                            value={user.ClientStatus}
                            onChange={(e) => UpdateStatus(user.FirstName, e.target.value, user.userId)}
                          >
                            {Status.map((status) => (
                              <option key={status} value={status}>
                                {status === "Deployed" ? "Deployed ✅" : status}
                              </option>
                            ))}
                          </select>
                    
                        </td>
                      )}
                      {/* {UpdateMainFilter === "Client Enquiry" && search === "Converted" && (
                        <td className="px-2 py-2">
                          <select
                            onChange={(e) => {
                              const selectedHCA = Filter_HCA.find(
                                (each) => each.FirstName === e.target.value
                              );
                              UpdateAssignHca(
                                user.id,
                                selectedHCA?.id,
                                user.FirstName,
                                user.Email,
                                user.Contact,
                                user.Location,
                                selectedHCA?.FirstName,
                                selectedHCA?.Contact
                              );
                            }}
                            className="w-full text-center px-2 py-1 rounded-lg bg-[#f9fdfa] border border-gray-200 cursor-pointer text-xs sm:text-sm"
                          >
                            <option>Assign HCA</option>
                            {Filter_HCA.map((each) => (
                              <option key={each.userId}>{each.FirstName}</option>
                            ))}
                          </select>
                        </td>
                      )} */}
                      {UpdateduserType === "healthcare-assistant" && (
        <td className="px-8 py-2 w-[14%]">
  <select
    className={` text-center px-2 py-1 rounded-lg border cursor-pointer text-xs sm:text-sm transition-all duration-200 font-semibold
      ${
        user.CurrentStatus === "Active"
          ? "bg-green-100 border-green-300 text-green-800"
          : user.CurrentStatus === "Sick"
          ? "bg-yellow-100 border-yellow-300 text-yellow-800"
          : user.CurrentStatus === "Leave"
          ? "bg-blue-100 border-blue-300 text-blue-800"
          : user.CurrentStatus === "Terminated"
          ? "bg-red-100 border-red-300 text-red-800"
          : "bg-gray-100 border-gray-300 text-gray-800"
      }
    `}
    value={user.CurrentStatus||""}
    onChange={(e) =>
      UpdateCurrentstatus(user.FirstName, e.target.value, user.userId)
    }
  >
    <option value="Active">🟢 Active</option>
    <option value="Sick">🟡 Sick</option>
    <option value="Leave">🔵 Leave</option>
    <option value="Terminated">🔴 Terminated</option>
  </select>
</td>


                    )}
                      <td className="px-2 py-2">
                        {(user?.DetailedVerification === false&&UpdateduserType === "healthcare-assistant")?<p>FillFullInfo</p>:
                        <button
                          className="w-full text-white bg-gradient-to-br from-[#00A9A5] to-[#007B7F] hover:from-[#01cfc7] hover:to-[#00403e] rounded-lg px-2 py-2 transition cursor-pointer text-xs sm:text-sm"
                          onClick={() => ShowDompleteInformation(user.userId, user.FirstName)}
                        >
                          {user.DetailedVerification ? "View" : "Preview"}
                        </button>}
                     
                      </td>
                         {UpdateduserType==='patient'&&
                      <td className="md:px-8 md:py-2">
                     
                         <button
onClick={()=>UpdateNavigattosuggetions(user.userId)}
            className="flex   cursor-pointer items-center gap-2 w-full sm:w-auto justify-center  py-2
 text-white    h-10 text-[9px] transition-all duration-150"
          >
            {/* <img src="Icons/HCP.png" className='h-10 w-10 rounded-full'/> */}
             <img src="Icons/FemaleHCA.png" className='h-15 w-15 rounded-full'/>
            
          </button>
                      </td>}
                       {UpdateduserType==='patient'&&
                      <td className="md:px-8 md:py-2">
                     
                         <button

            className="flex   cursor-pointer items-center gap-2 w-full sm:w-auto justify-center  py-2
    h-10 text-[9px] transition-all duration-150"
          >
            <Trash onClick={()=>setShowDeletePopUp(true)}/>
            
          </button>
                      </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
<div className="flex items-center justify-center py-20">
  <div className="
    w-full max-w-md
    rounded-3xl
    bg-white/70 backdrop-blur-xl
    border border-slate-200
    shadow-[0_20px_50px_rgba(0,0,0,0.08)]
    px-8 py-10
    text-center
    transition-all
  ">
    <div className="
      mx-auto mb-5
      flex h-16 w-16
      items-center justify-center
      rounded-full
      bg-gradient-to-br from-[#e0f7f5] to-[#f1faf8]
      shadow-inner
    ">
      <span className="text-3xl">🗂️</span>
    </div>

   
    <h3 className="text-lg font-semibold tracking-tight text-slate-800">
      No data available
    </h3>

 
    <p className="mt-2 text-sm leading-relaxed text-slate-500">
      We couldn’t find any records matching your current selection.
      Try changing filters or come back later.
    </p>

    <button
      onClick={() => window.location.reload()}
      className="
        mt-6
        inline-flex items-center justify-center
        rounded-xl
        bg-gradient-to-r from-[#62e0d9] to-[#3bcfc8]
        px-6 py-2.5
        text-sm font-semibold text-white
        shadow-md

        transition-all duration-200
        hover:scale-[1.03] hover:shadow-lg
        active:scale-[0.97]
      "
    >
      Refresh
    </button>
  </div>
</div>

      )}

      {updatedStatusMsg && (
        <div className="fixed bottom-4 sm:bottom-6 left-3 sm:left-10 bg-gradient-to-br from-[#00A9A5] to-[#005f61] text-white px-3 sm:px-6 py-2 sm:py-4 rounded-xl shadow-2xl font-semibold text-xs sm:text-base z-50 max-w-[90vw] sm:max-w-xs">
          {updatedStatusMsg}
        </div>
      )}
    </div>
  );
};




  const ShowDompleteInformation = (userId: any, ClientName: any) => {
   
    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      router.push("/UserInformation");
    }
  };

  

const handleLogout = () => {
  dispatch(Update_Main_Filter_Status(""))
  router.push('/DashBoard'); 
       
};


  if (isChecking) {
     <LoadingData/>
  }




const Filter_HCA = Finel.filter((each:any) => {
  const isHCA = each.userType === "healthcare-assistant"; 
  const isAvailable = each.Status !== "Assigned";         
  const matchesName =
    !AsignStatus || each.FirstName.toLowerCase().includes(AsignStatus.toLowerCase()); 

  return isHCA && isAvailable && matchesName;
});


const UpdateNavigattosuggetions=(D:any)=>{
  console.log("Testing------")
  router.push("/Clientsuggetions")
  dispatch(UpdateClientSuggetion(D))
}

const GetPermanentAddress = (A: any) => {
  if (!UserFullInfo?.length || !A) return "Not Entered";

  const address =
    UserFullInfo
      ?.map((each: any) => each?.HCAComplitInformation)
      ?.find((info: any) => info?.UserId === A)
      ?.["Permanent Address"];

  return address ?? "Not Entered";
};





  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafc] via-[#e3f6f5] to-[#f9f9ff] text-gray-900 p-2 ">

    
      <div className="sticky top-0 z-50 bg-opacity-90 backdrop-blur-lg mb-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/90 rounded-xl p-3 shadow-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <img src="/Icons/Curate-logo.png" onClick={()=>router.push("/DashBoard")}  alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl" />
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#007B7F] tracking-tight leading-tight">
              Hi,<span className="text-[#ff1493]">{UserFirstName}</span>
            </h1>
          </div>
         
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
          >
            <LogOut size={20} /> DashBoard
          </button>
        </div>

       
       <div className="flex flex-col md:flex-row gap-4 justify-between mt-2">
          {/* {UpdateduserType === "patient" && (
            <div className="flex gap-2 flex-wrap w-full sm:w-auto">
              {Filters.map((each, index) => (
                <button
                  key={index}
                  onClick={() => UpdateFilterValue(each)}
                  className={` cursor-pointer px-3 py-2 text-sm sm:text-base flex-1 sm:flex-none sm:min-w-[160px] ${search === each && "border-3"} rounded-xl shadow-md font-medium transition-all duration-200 ${filterColors[each]}`}
                >
                  {each}
                </button>
              ))}
            </div>
          )} */}
          {UpdateduserType==="patient"&&
<div className="flex  flex-col gap-2 flex-wrap w-full ">
 {/* <div className="flex gap-3 flex-wrap w-full sm:w-auto">
  {Main_Filters.map((each, index) => {


    return (
      <button
        key={index}
        onClick={() => UpdateMainFilterValue(each)}
        className={`px-4 py-2 rounded-xl shadow-md font-medium text-sm sm:text-base 
          transition-all duration-200 flex-1 sm:flex-none sm:min-w-[160px]
          ${
            each===UpdateMainFilter
 ? "bg-[#50c896] text-white border border-white-700 scale-105"
 
    : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 hover:scale-105"
          }
        `}
      >
        {each === "Client Enquiry"
          ? `${each} (${Finel.filter((item) => item.userType === "patient").length})`
          : each}
      </button>
    );
  })}
</div> */}

           <div className="flex gap-2 flex-wrap w-full items-center">

  <div className="flex gap-2 flex-wrap">

    {UpdateMainFilterValues().map((each: any, index: any) => (
      <button
        key={index}
        onClick={() => UpdateFilterValue(each)}
        className={`cursor-pointer px-1 py-1 text-xs flex-1 sm:flex-none sm:min-w-[100px] ${
          search === each && "border-3"
        } rounded-xl shadow-md font-medium transition-all duration-200 ${
          filterColors[each]
        }`}
      >
        {
  UpdateMainFilter === "Client Enquiry"
    ? `${each} (${
        UpdatedFilterUserType?.filter(
          (Try) => Try.ClientStatus === each
        )?.length ||0
      })`
    : each 
}

        
      </button>
    ))}
  </div>

{/*   
  {UpdateMainFilter === "Client Enquiry" && search === "Converted" && (
    <input
      placeholder="Search HCA..."
      className="text-center border-2 rounded-md w-[150px] ml-auto"
      onChange={UpdateFilterHCA}
    />
  )} */}
</div>

             
            </div>}
          {/* <button
onClick={()=>UpdateNavigattosuggetions()}
            className="flex mt-7 cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-2 py-2 bg-gradient-to-br from-[#10b981] to-[#065f46] hover:from-[#34d399] hover:to-[#064e3b]
 text-white rounded-xl  hover:shadow-lg hover:rounded-full h-8 text-[9px] transition-all duration-150"
          >
            Show Placement Suggetions
          </button> */}
          {(UpdateMainFilter!=="Deployment")&&(UpdateMainFilter!=="Timesheet") &&(UpdateduserType!=='healthcare-assistant')&&
<div className="relative">
  <input
    type="date"
    className="
      peer w-full rounded-xl border border-[#cce5e1]
      bg-[#f1faf8] px-4 pt-5 pb-2 text-sm text-[#004d40]
      focus:border-[#00796b] focus:bg-white
      focus:ring-2 focus:ring-[#00796b]/30 focus:outline-none
    "
    onChange={(e:any)=>SetSearchDate(e.target.value)}
    value={SearchDate||''}
  />
  <label
    className="
      pointer-events-none absolute left-4 top-2
      text-xs text-[#00796b]
      transition-all
      peer-focus:text-[#00695c]
    "
  >
 Search By Date
  </label>
</div>


}

        </div>
      </div>



{ContetUserInterface()}




    </div>
  );
}
function each(value: { id: any; FirstName: any; AadharNumber: any; Age: any; userType: any; Location: any; Email: any; Contact: any; userId: any; VerificationStatus: any; DetailedVerification: any; EmailVerification: any; ClientStatus: any; }, index: number, array: { id: any; FirstName: any; AadharNumber: any; Age: any; userType: any; Location: any; Email: any; Contact: any; userId: any; VerificationStatus: any; DetailedVerification: any; EmailVerification: any; ClientStatus: any; }[]): value is { id: any; FirstName: any; AadharNumber: any; Age: any; userType: any; Location: any; Email: any; Contact: any; userId: any; VerificationStatus: any; DetailedVerification: any; EmailVerification: any; ClientStatus: any; } {
  throw new Error('Function not implemented.');
}



