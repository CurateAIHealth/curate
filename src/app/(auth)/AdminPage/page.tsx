'use client';
let cachedUserInfo: any = null;
let cachedRegisteredUsers: any = null;
let cachedFullInfo: any = null;
let cachedDeployed: any = null;

import {
  ClearEnquiry,
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
  UpdateUserEmailVerificationstatus,
  GetUserPDRInfo,
  UpdateUserCurrentstatusInHCPView,
  GetPopUpUserPDRInfo,
  
} from '@/Lib/user.action';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CircleCheckBig, Delete, LogOut, Pencil, Trash, Trash2 ,Hourglass ,BadgeCheck, MapPin,FileCheck,FileX, Router, List, Calendar1 } from 'lucide-react';
import { CurrrentPDRUserId, GetCurrentDeploymentData, Refresh, Update_Main_Filter_Status, UpdateAdminMonthFilter, UpdateAdminYearFilter, UpdateClient, UpdateClientSuggetion, UpdateFetchedInformation, UpdateSubHeading, UpdateUserInformation, UpdateUserType } from '@/Redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { ClientEnquiry_Filters, filterColors, HCPFilters, hyderabadAreas, LeadSources, Main_Filters, Payments_Filters, Placements_Filters, ReferralPay_Filters, Timesheet_Filters } from '@/Lib/Content';

import { select, thead, tr } from 'framer-motion/client';
import ClientTable from '@/Components/Placements/page';
import StatusPopup from '@/Components/PDRStatusPopup/page';
import { HCAList } from '@/Redux/reducer';
import WorkingOn from '@/Components/CurrentlyWoring/page';
import axios from 'axios';

import { AssignSuitableIcon, decrypt, encrypt, getPopularArea, normalizeDate, toCamelCase, toProperCaseLive } from '@/Lib/Actions';
import InvoiceMedicalTable from '@/Components/TimeSheetInfo/page';
import { LoadingData } from '@/Components/Loading/page';
import ReplacementsTable from '@/Components/ReplacementsTable/page';
import CallEnquiryList from '@/Components/CallEnquiry/page';
import { stat } from 'fs';
import { ClientsPopup } from '@/Components/SentProfile/page';


export default function UserTableList() {
 const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [UserFirstName, setUserFirstName] = useState("");
  const [HCPCurrentStatus,setHCPCurrentStatus]=useState("")
  const [SearchDate, SetSearchDate] = useState<any>(null)
  const now = new Date();
  const [showClients, setShowClients] = useState(false);
  const SearchMonth = useSelector((state: any) => state.MonthFilterAdmin)
  const SearchYear = useSelector((state: any) => state.YearFilterAdmin)
  const [HCPPreviewtype,setHCPPreviewtype]=useState("")
const [SearchResult, setSearchResult] = useState("")
  const [search, setSearch] = useState('');
  const [AsignStatus, setAsignStatus] = useState("")
  const [LoginEmail, setLoginEmail] = useState("");
  const [DeleteInformation, SetDeleteInformation] = useState<any>()
  const [showOptions, setShowOptions] = useState(false);
const [searchLead, setSearchLead] = useState("");
const [showSuggestions, setShowSuggestions] = useState(true);
  const [ShowDeletePopUp, setShowDeletePopUp] = useState(false)
  const Status = ["None","Converted", "Waiting List", "Lost",];
  const EmailVerificationStatus = ['Verified', 'Pending'];
  const CurrentStatusOptions = ["Active", "Sick", "Leave", "Terminated"];

  const [UserFullInfo, setFullInfo] = useState([])
  const router = useRouter();
  const dispatch = useDispatch();
  const UpdateMainFilter = useSelector((state: any) => state.Main_Filter)
  const CurrentClientStatus = useSelector((state: any) => state.Submitted_Current_Status)
  const UpdateduserType = useSelector((state: any) => state.ViewHCPList)
  const CurrentCount = useSelector((state: any) => state.updatedCount)
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const updatedStatusMsg=useSelector((each:any)=>each.GlobelRefresh)
const RESTRICTED_EMAILS = new Set([
  "info@curatehealth.in",
  "admin@curatehealth.in",
  "tsiddu805@gmail.com",
  "gouricurate@gmail.com",
  "srivanikasham@curatehealth.in",
  "sravanthicurate@gmail.com",
  "srinivasnew0803@gmail.com",
]);

useEffect(() => {
  let mounted = true;
  const isInitialLoad = updatedStatusMsg === "";
  const isSuccessUpdate = updatedStatusMsg?.includes("Successfully");

  if (!isInitialLoad && !isSuccessUpdate) return;

  const fetchFreshData = async () => {
    try {
      const userId = localStorage.getItem("UserId");
      if (!userId) return;

      setIsChecking(true);

      const [profile, registeredUsers, fullInfo, deployedLength] = await Promise.all([
        isSuccessUpdate ? GetUserInformation(userId) : (cachedUserInfo ?? GetUserInformation(userId)),
        isSuccessUpdate ? GetRegidterdUsers() : (cachedRegisteredUsers ?? GetRegidterdUsers()),
        isSuccessUpdate ? GetUsersFullInfo() : (cachedFullInfo ?? GetUsersFullInfo()),
        isSuccessUpdate ? GetDeploymentInfo() : (cachedDeployed ?? GetDeploymentInfo()),
      ]);

      if (!mounted) return;

      cachedUserInfo = profile;
      cachedRegisteredUsers = registeredUsers;
      cachedFullInfo = fullInfo;
      cachedDeployed = deployedLength;

      setUsers(registeredUsers);
      setUserFirstName(profile?.FirstName);
      setLoginEmail(profile?.Email);
      setFullInfo(fullInfo);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      if (mounted) setIsChecking(false);
    }
  };

  fetchFreshData();

  return () => {
    mounted = false;
  };
}, [updatedStatusMsg]);

useEffect(() => {
  const email = cachedUserInfo?.Email?.toLowerCase();
  if (!email) return;

  if (!RESTRICTED_EMAILS.has(email)) {
    router.push("/");
    return;
  }

  if (email === "info@curatehealth.in") {
    dispatch(UpdateUserType("patient"));
  } else if (email === "gouricurate@gmail.com") {
    dispatch(UpdateUserType("healthcare-assistant"));
  }
}, [dispatch, router, cachedUserInfo]);

const GetHCPTypeCount = (HCPType: string) => {
  try {
    const HCPTypeCount = users?.filter(
      (each: any) => each?.PreviewUserType === HCPType
    );

    return HCPTypeCount?.length || 0;
  } catch (err) {
    console.error("GetHCPTypeCount error:", err);
    return 0;
  }
};

  const UpdateStatus = async (first: string, e: string, UserId: any) => {
   
      dispatch(Refresh(`Updating ${first} Contact Status....`))
    try {
      const res = await UpdateUserContactVerificationstatus(UserId, e);
      if (res?.success === true) {
       
          dispatch(Refresh(`${first} Verification Status Updated Successfully`))
      }
    } catch (err: any) {
      console.error(err);
    }
  };
  const pillStyles: Record<string, string> = {
    HCA: "bg-yellow-200 text-yellow-900",
    HCP: "bg-green-200 text-green-900",
    HCN: "bg-purple-200 text-purple-900",
  };
  const UpdateEmailVerificationStatus = async (first: string, e: string, UserId: any) => {
   
     dispatch(Refresh(`Updating ${first} Email Verification Status....`))

    try {
      const res = await UpdateUserEmailVerificationstatus(UserId, e);
      if (res?.success === true) {
     
          dispatch(Refresh(`${first} Email Verification Status Updated Successfully`))
      }

    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredLeads = LeadSources.filter((lead: string) =>
  lead.toLowerCase().includes(searchLead.toLowerCase())
);
  const UpdateCurrentstatus = async (first: string, e: string, UserId: any) => {
  
      dispatch(Refresh(`Updating ${first} Current Status....`))
    try {
      const res = await UpdateUserCurrentstatusInHCPView(UserId, e);
    
        dispatch(Refresh(res.message))

    } catch (err: any) {
      console.error(err);
    }
  };


  const callEnquiryArray = users.filter((each) => each.userType === 'CallEnquiry')

  const clientsData= users.filter((each) => each.userType === 'patient')

  const Finel = users.map((each: any) => ({
    id: each.userId,
    FirstName: each.FirstName,
    PatientName: each.patientName || "Not Mentioned",
    AadharNumber: each.AadharNumber,
    Age: each.Age,
    userType: each.userType,

    Location: each.Location || each.serviceLocation ||each.Location|| 'Not Provided',
    Email: each.Email,
    Contact: each.ContactNumber,
    userId: each.userId,
    VerificationStatus: each.VerificationStatus,
    DetailedVerification: each.FinelVerification,
    EmailVerification: each.EmailVerification,
    ClientStatus: each.ClientStatus,
    Status: each.Status,
    CurrentStatus: each.CurrentStatus || "None",
    LeadSource: each.Source||each.NewLead,
    ClientPriority: each.ClientPriority,
    CreatedAt: each.createdAt,
    LeadDate: each.LeadDate,
    ServiceArea: each.ServiceArea,
    ServiceLocation: each.ServiceArea,
    PreviewUserType: each.PreviewUserType||"None",
    PDRStatus:each.PDRStatus||"No Available"
  }));
console.log("Check----",Finel)
  const UpdatedFilterUserType = Finel
  .filter((each) => {


  
    
    const matchesType =
      !UpdateduserType || each.userType === UpdateduserType;


      
    const matchesStatus =
      !search ||
      (search === "None"
        ? !each.ClientStatus
        : each.ClientStatus === search);

        
    // const notAdmin =
    //   each.Email?.toLowerCase() !== "admin@curatehealth.in";


      
    const matchesSearchResult =
      !SearchResult ||
      [each.FirstName, each.Email, each.Contact]
        .filter(Boolean)
        .some((value) =>
          value
            .toString()
            .toLowerCase()
            .includes(SearchResult.toLowerCase())
        );


        
    const matchesCurrentStatus =
      !HCPCurrentStatus || each.CurrentStatus === HCPCurrentStatus;

  const HCPUserType =
  !HCPPreviewtype ||
  each.PreviewUserType.toLowerCase() === HCPPreviewtype.toLowerCase();



    // Date Checker
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

    const matchesDate =
      (!SearchMonth && !SearchYear) ||
      checkDate(each.LeadDate) ||
      checkDate(each.CreatedAt);

    return (
      HCPUserType&&
      matchesType &&
      matchesStatus &&
      matchesSearchResult &&
      matchesCurrentStatus &&
      matchesDate 
      // &&notAdmin
    );
  })
  .slice()
  .reverse();

 
console.log("Check-----",Finel.filter((each:any)=>each.id==="2383a38f-8e39-47a0-bce1-f1f04ba20295"))

  const filterByMonthAndYear = (
    each: any,
    SearchMonth: string,
    SearchYear: string
  ) => {
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

    return checkDate(each.LeadDate) || checkDate(each.CreatedAt);
  };


  const MonthlyCount = Finel.filter((each) =>
    filterByMonthAndYear(each, SearchMonth, SearchYear)
  );

 










  // useEffect(() => {
  //   const Fetch = async () => {
  //     try {
  //       const localValue = localStorage.getItem("UserId");
  //       if (!localValue) return;  
  //       const [profile, registeredUsers, fullInfo,DeployedLength] = await Promise.all([
  //         cachedUserInfo ?? GetUserInformation(localValue),
  //         cachedRegisteredUsers ?? GetRegidterdUsers(),
  //         cachedFullInfo ?? GetUsersFullInfo(),
  //         Deployed?? GetDeploymentInfo()
  //       ]);


  //       cachedUserInfo ||= profile;
  //       cachedRegisteredUsers ||= registeredUsers;
  //       cachedFullInfo ||= fullInfo;
  //       Deployed ||=DeployedLength 


  //       setUsers(registeredUsers);
  //       setUserFirstName(profile.FirstName);
  //       setLoginEmail(profile.Email);
  //       setFullInfo(fullInfo);


  //       const email = profile?.Email?.toLowerCase();


  //       if (email === "info@curatehealth.in") {
  //         dispatch(UpdateUserType("patient"));
  //       } else if (email === "gouricurate@gmail.com") {
  //         dispatch(UpdateUserType("healthcare-assistant"));
  //       }


  //       const restricted = [
  //         "admin@curatehealth.in",
  //         "info@curatehealth.in",
  //         "gouricurate@gmail.com"
  //       ];

  //       if (!restricted.includes(email)) {
  //         router.push("/");
  //         return;
  //       }

  //     } catch (err: any) {
  //       console.error("Error fetching data:", err);
  //     } finally {
  //       setIsChecking(false);
  //     }
  //   };

  //   Fetch();
  // }, [updatedStatusMsg, CurrentClientStatus, UpdateduserType]);






  const FilterUserType = (e: any) => {
    if (e.target.value !== "patient") {

    }
    dispatch(UpdateUserType(e.target.value));
  };

  const DeleteClient = async () => {
    try {
      
       dispatch(Refresh("Please Wait Deleteing Client....."))
      const DeleteEnquiry = await ClearEnquiry(DeleteInformation.userId)
if (DeleteEnquiry?.success) {
  
 dispatch(Refresh("Client Deleted Successfully"))
  const timer:any = setInterval(() => {
    setShowDeletePopUp(false)
  }, 2000)

  return () => clearTimeout(timer)
}




    } catch (err: any) {

    }
  }

  const UpdateFilterValue = (UpdatedValue: any) => {
         dispatch(Refresh(''))
    setSearch(UpdatedValue)
    // dispatch(UpdateSubHeading(UpdatedValue))
    // dispatch(Update_Main_Filter_Status(UpdatedValue))
  };

  // const UpdateMainFilterValue=(Z:any)=>{

  //   // SetUpdateMainFilter(Z)
  //   dispatch(Update_Main_Filter_Status(Z))
  // }





  const UpdateMainFilterValues = () => {
    switch (UpdateMainFilter) {
      case "Call Enquiry":

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


  const UpdateFilterHCA = (e: any) => {
    setAsignStatus(e.target.value)
  }
  if (isChecking) {
    return <LoadingData />
  }
  const ContetUserInterface = () => {
    switch (UpdateMainFilter) {
      case "Call Enquiry":
      case "HCP List":
        return ClientEnquiryUserInterFace()
      case "Deployment":
        return <ClientTable />
      case "Timesheet":
        return <InvoiceMedicalTable />
      case "Replacements":
        return <ReplacementsTable />
      case "Referral Pay":
        return <WorkingOn ServiceName="Referral Pay" />
      case "Payments":
        return <WorkingOn ServiceName="Payments" />
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

  const UpdateClientPriority = async (ClientName: any, ClientUserId: any, UpdatedValue: any) => {
    try {
   
       dispatch(Refresh(`Please Wait,${ClientName} ...`))
      const PriorityResult: any = await UpdatedClientPriority(ClientUserId, UpdatedValue)

      if (PriorityResult.success === true) {
     
         dispatch(Refresh(`${ClientName}  Updated Successfully`))
      }
    } catch (err: any) {

    }
  }

  const UpdateClientServiceLocation = async (ClientName: any, ClientUserId: any, UpdatedValue: any) => {
    try {
    
       dispatch(Refresh(`Please Wait...`))
      const AreaUpdateResult: any = await UpdatedServiceArea(ClientUserId, UpdatedValue)

      if (AreaUpdateResult.success === true) {
        
         dispatch(Refresh(`${ClientName}  Updated Successfully`))
      }
    } catch (err: any) {

    }
  }

  const UpdatePreviewUserType = async (ClientName: any, ClientUserId: any, UpdatedValue: any) => {
    try {
      
       dispatch(Refresh(`Please Wait,${ClientName} ...`))
      const AreaUpdateResult: any = await UpdatedPreviewUserType(ClientUserId, UpdatedValue)

      if (AreaUpdateResult.success === true) {
      
         dispatch(Refresh(`${ClientName}  Updated Successfully`))
      }
    } catch (err: any) {

    }
  }

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

  const UpdateAssignHca = async (UserIDClient: any, UserIdHCA: any, ClientName: any, ClientEmail: any, ClientContact: any, Adress: any, HCAName: any, HCAContact: any) => {
    
     dispatch(Refresh("Please Wait Assigning HCA..."))
    try {
      const today = new Date();
      const attendanceRecord = {
        date: today.toLocaleDateString('EN-In'),
        checkIn: today.toLocaleTimeString(),
        status: "Present",
      };


      const TimeSheetData: any[] = [];
      TimeSheetData.push(attendanceRecord)
      const UpdateStatus = await UpdateUserContactVerificationstatus(UserIDClient, "Placced")
      const UpdateHcaStatus = await UpdateHCAnstatus(UserIdHCA, "Assigned")
      const PostTimeSheet: any = await InserTimeSheet(UserIDClient, UserIdHCA, ClientName, ClientEmail, ClientContact, Adress, HCAName, HCAContact, TimeSheetData)
      if (PostTimeSheet.success === true) {
       
         dispatch(Refresh("HCA Assigned Successfully, For More Information Check in Placemets"))

        sendWhatsApp("+919347877159", "+919347877159");




      }

    } catch (err: any) {
  
       dispatch(Refresh(err))
    }
  }

const UpdatePopup = async (a: any) => {
setOpen(true)
     const pdrRes = await GetPopUpUserPDRInfo(a.userId);
  
     if (pdrRes.success===false||pdrRes.data.PDRStatus === false){
setLoading(false)
return
     }
  dispatch(GetCurrentDeploymentData(a));

//  dispatch(Refresh("Redirecting to PDR…"))
  const data = await GetUserInformation(a.userId)

  dispatch(
    UpdateFetchedInformation({
      ...data,
      updatedAt: normalizeDate(data.updatedAt),
      createdAt: normalizeDate(data.createdAt),
    })
  );

  router.push("/PDR");
};


  const ClientEnquiryUserInterFace = () => {
    return (
      <div>
        {search === "CallEnquiry" ? <CallEnquiryList
          data={callEnquiryArray}
          SearchData={SearchResult}
          title="Recent Call Enquiries"
        />
          : <div className="w-full">
            {ShowDeletePopUp && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg">

                <div className="w-full max-w-md bg-white rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.35)] animate-fadeIn">


                  <div className="flex justify-center pt-8">
                    <div className="h-14 w-14 rounded-full border border-red-200 bg-red-50 flex items-center justify-center">
                      <Trash2 size={22} className="text-red-600" />
                    </div>
                  </div>

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
                      onClick={DeleteClient}
                      className="flex-1 py-4 text-sm font-semibold text-red-600
        hover:bg-red-50 transition rounded-br-[28px]"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>

            )}


            <ClientsPopup
  open={showClients}
  onClose={() => setShowClients(false)}
  clients={clientsData}
  title="Clients List"
/>
            <>
      <StatusPopup
        open={open}
        loading={loading}
        message="Assign an HCP and complete the PDR before making any updates."
         onClose={()=>setOpen(false)}
      />
    </>
            {UpdatedFilterUserType.length > 0 ? (
              <div className="bg-white/90 rounded-2xl shadow-2xl border border-gray-100">
                <div className=" overflow-y-auto">
                  <div className="w-full overflow-x-auto sm:overflow-x-hidden">
                    <table className="table-fixed w-full min-w-[800px] text-[11px] sm:text-[13px] text-left text-gray-700 border-collapse">
                      <thead className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white  text-[10px] font-semibold">
                        <tr>
                          <th className="px-2 py-2 w-[4%]">S.No</th>
                      
                            <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">{UpdateduserType === "patient"?"Date":"Joining Date"}</th>
                          {UpdateduserType === "patient" &&
                            <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">Lead Source</th>}
                          {UpdateduserType === "patient" &&
                            <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">Client Priority</th>}
                          {UpdateduserType === "healthcare-assistant" &&
                            <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">User type</th>}
                     {UpdateduserType === "healthcare-assistant"&&
                          <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">HCP Name</th>}
 {UpdateduserType === "patient" &&
                          <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">Client Name</th>}
                           {UpdateduserType === "patient" &&
                          <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">Patient Name</th>}
                          {/* <th className="px-2 py-2 sm:px-4 sm:py-3 w-[18%]">Email</th> */}
                          <th className="px-2 py-2 w-[12%]">Contact</th>
                          {/* <th className="px-2 py-2 w-[10%]">Role</th>
                    <th className="px-2 py-2 w-[12%]">Aadhar</th> */}
                          <th className="px-2 py-2 w-[12%]">Location</th>
                          <th className="px-2 py-2 w-[14%]">Email Verification</th>
                          {UpdateduserType === "healthcare-assistant" && (
                            <th className="px-4 py-2 w-[14%]">Working Status</th>
                          )}
                          {UpdateduserType === "healthcare-assistant" && (
                            <th className="px-4 py-2 text-center w-[14%]">Inform</th>
                          )}
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
                            {UpdateduserType === "patient" &&
                          <th className="px-4 py-2 text-center w-[10%]">PDR</th>}
                            
                          {UpdateduserType === 'patient' && <th className="px-2 py-2 w-[10%]">Suitable HCP</th>}
                          {UpdateduserType === 'patient' && <th className="px-2 py-2 w-[10%]">Delete</th>}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {UpdatedFilterUserType.map((user, index) => (
                          <tr
                            key={index}
                            
                          >
                          
                            <td className='pl-4'>{index + 1}</td>
                       <td><input
                             
                              className="
    h-8 w-[70px] px-1
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

    disabled:bg-slate-100 disabled:cursor-not-allowed

  "
                             type="text"
  placeholder="YYYY-MM-DD"
  defaultValue={user.LeadDate || ""}
    onChange={(e: any) => {
    let value = e.target.value.replace(/\D/g, ""); 

 
    if (value.length > 4 && value.length <= 6) {
      value = `${value.slice(0, 4)}-${value.slice(4)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
    }

    e.target.value = value;
  }}
  onKeyDown={(e: any) => {
    if (e.key === "Enter") {
      const val = e.currentTarget.value;
      
      UpdateJoiningDate(user.FirstName, user.userId, val);
    }
  }}
  
                            />

                            </td>
                            {UpdateduserType === "patient" &&
                            
                              <td className='pl-6'>{toProperCaseLive(user.LeadSource) || "Not Mentioned"} <button
                                    onClick={() => setEditingUserId(user.userId)}
                                    className="
          rounded-lg p-1
          text-slate-500
          transition-all
          hover:bg-slate-100 hover:text-slate-700
        "
                                    title="Edit service area"
                                  >
                                    <Pencil size={12} />
                                  </button> {editingUserId === user.userId && (
                                   <div
  className="
    absolute z-50 mt-2 w-56 rounded-xl bg-white
    border border-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.12)]
    p-2 animate-in fade-in zoom-in-95
  "
>

 <input
  autoFocus
  value={searchLead}
  placeholder="Enter Lead"
  onChange={(e) => {
    setSearchLead(e.target.value);
    setShowSuggestions(true);
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      UpdateClientServiceLocation(
        user.FirstName,
        user.userId,
        searchLead   
      );
      setEditingUserId(null);
    }
  }}
  onBlur={() => {
    UpdateClientServiceLocation(
      user.FirstName,
      user.userId,
      searchLead   
    );
    setEditingUserId(null);
  }}
  className="h-10 w-full px-3 rounded-lg border border-slate-300 bg-[#f8fafc]"
/>


  {showSuggestions && filteredLeads.length > 0 && (
    <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white">
      {filteredLeads.map((area: string) => (
        <div
          key={area}
          onMouseDown={() => {
            UpdateClientServiceLocation(
              user.FirstName,
              user.userId,
              area
            );
            setSearchLead(area);
            setEditingUserId(null);
          }}
          className="
            px-3 py-2 text-sm cursor-pointer
            hover:bg-[#f1f5f9] transition-colors
          "
        >
          {area}
        </div>
      ))}
    </div>
  )}
</div>
                                  )}</td>}
                                  
                            {UpdateduserType === "patient" &&
                              <td>
                                <select
                                  className={`
    h-11 w-fit  px-3
     cursor-pointer
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

                                  onChange={(e) => UpdateClientPriority(user.FirstName, user.userId, e.target.value)}
                                >
                                  <option value="Important">⭐</option>
                                  <option value="stable">🟢 </option>
                                  <option value="VIP">👑</option>
                                  <option value="Critical">🔴 </option>
                                </select>
                              </td>}
                            {UpdateduserType === "healthcare-assistant" &&
                              <td className="px-6 py-2 break-words">

                                <div className="flex items-center gap-2">

                                  <span
                                    className={`text-sm ${user.PreviewUserType
                                        ? "text-slate-700 font-medium"
                                        : "italic text-slate-400"
                                      }`}
                                  >
                                    {user.PreviewUserType}
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
                                    {/* <Pencil size={14} /> */}
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
                                          UpdatePreviewUserType(user.FirstName, user.userId, e.target.value)
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
                                          <option key={area} 
                                          value={area}>
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
{UpdateduserType === "healthcare-assistant" &&



<img className='h-4' src={AssignSuitableIcon(GetHCPGender(user.id),user.PreviewUserType)}/>
}
                                <span className="font-semibold  ">
                                  {toProperCaseLive(user.FirstName)}


                                </span>

                              </div>
                            </td>
                                    {UpdateduserType === "patient" &&
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

                                <span className="font-semibold ">
                                  {toProperCaseLive(user.PatientName)}


                                </span>

                              </div>
                              </td>}
                            {/* <td className="px-2 py-2 break-words">{user?.Email?.toLowerCase()||"Not Provided"}</td> */}
                            <td className="px-2 py-2">
                              {user?.Contact ? `${user.Contact}` : "Not Provided"}
                            </td>


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
                                   <MapPin size={14} className="text-green-600 shrink-0" />
                                  <span
                                    className={`text-xs ${user.ServiceLocation||user.Location
                                        ? "text-slate-700 font-medium"
                                        : "italic text-slate-400"
                                      }`}
                                  >
                                   
                                     {getPopularArea(user.ServiceLocation ||user.Location|| "Not mentioned")}
                                  </span>

                                
                                 


                                 

                                </div>
                              ) : (
   <div className="flex items-center gap-2">
                                 <MapPin size={14} className="text-green-600 shrink-0" />
                                <span className="text-[12px] text-slate-700">
                                 
                                  {GetPermanentAddress(user.userId)}
                                </span>
                                </div>
                              )}
                            </td>

                            <td className="px-2 py-2">
                              {/* <select
                                className="w-full text-center px-2 py-1 rounded-lg bg-[#f9fdfa] border border-gray-200 cursor-pointer text-xs sm:text-sm"
                                defaultValue={user.EmailVerification ? "Verified" : "Pending"}
                                onChange={(e) =>
                                  UpdateEmailVerificationStatus(user.FirstName, e.target.value, user.userId)
                                }
                              >
                                {EmailVerificationStatus.map((status) => (
                                  <option key={status} value={status}>
                                    {status==="Verified"?<BadgeCheck />:<Hourglass />}
                                  </option>
                                ))}
                              </select> */}

                               {user.EmailVerification ? (
  

<div className="relative group inline-block ml-10">
  <BadgeCheck
    size={30}
    className="text-green-600 cursor-pointer hover:bg-gray-300 p-1 rounded-full"
    onClick={(e:any) =>
     UpdateEmailVerificationStatus(user.FirstName, "Pending", user.userId)
    }
  />

 <div className="absolute top-0 right-full -translate-y-1/2 mr-2
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                bg-black text-white text-xs px-3 py-1 rounded-md whitespace-nowrap">
  Email Verified,Click to Update
</div>

</div>

  ) : (
    <div className="relative group inline-block ">
    <Hourglass className="text-yellow-500 cursor-pointer hover:bg-gray-300 p-1 rounded-full ml-10" size={30} onClick={(e:any) =>
                                  UpdateEmailVerificationStatus(user.FirstName, "Verified", user.userId)
                                }/>
                                 <div     className="absolute top-0 right-full -translate-y-1/2 mr-2
               opacity-0 group-hover:opacity-100
               transition-opacity duration-200
               bg-black text-white text-xs px-3 py-1 rounded-md whitespace-nowrap"
  >
  Email Verification Pending,Click to Update
</div>
</div>
  )}
                            </td>
                            {user.userType === "patient" && (
                            
                              <td className="px-2 py-2">
                                  
                                <select
                                  className={`w-full px-2 py-2 rounded-xl text-center font-medium transition-all duration-200 cursor-pointer ${user.ClientStatus === "Placced"
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

                           {UpdateduserType === "healthcare-assistant" && (() => {
  const workingStatus = HCPWorkingStatus(user.userId);
  const isAssigned =
    Array.isArray(workingStatus) && workingStatus.includes("Assigned");

  const handleUpdate = async () => {
 dispatch(Refresh("Please Wait....."))
    const res = await UpdateHCAnstatus(user.userId, "Available for Work");
    
     dispatch(Refresh(res.message))
  };

  return (
    <td className="px-2 py-2">
      

      {isAssigned ? (
       <div className="flex flex-col items-center justify-center text-center gap-1">
  
  {/* Current Status */}
  <p className="inline-flex items-center gap-1.5 rounded-full 
                 bg-gradient-to-r from-red-500 to-rose-500 
                 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
    🚫 Deployed
  </p>

 
  <button
    onClick={handleUpdate}
    className="text-[11px] font-medium text-blue-600 
               hover:text-blue-700 hover:underline  cursor-pointer
               transition"
  >
    Make Unassigned
  </button>

</div>

      ):<p className="inline-flex items-center rounded-full bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1 border border-amber-200">
  Yet to be Placed
</p>
}
    </td>
  );
})()}
  {UpdateduserType === "healthcare-assistant" &&
  
  
  <td className="md:px-8 md:py-2">

                                <button
  type="button"
  className="px-1 py-1.5 text-xs sm:text-xs cursor-pointer font-medium rounded-md bg-white/60 hover:shadow-lg backdrop-blur border border-gray-200 text-gray-800 hover:bg-white transition shadow-sm"  onClick={() => setShowClients(true)}
>
  Send Profile
</button>
                              </td>
  }
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
                              <td className="">
                             
                                <select
                                  className={` text-center w-[120px]  px-2 py-1 rounded-lg border cursor-pointer text-xs sm:text-sm transition-all duration-200 font-semibold
      ${user.CurrentStatus === "Available"
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
                                  value={user.CurrentStatus || ""}
                                  onChange={(e) =>
                                    UpdateCurrentstatus(user.FirstName, e.target.value, user.userId)
                                  }
                                >

                                 <option value="Active">🟢 Active</option>
<option value="Available for Work">🟢 Available for Work</option>
<option value="Training">🟠 Training</option>
<option value="Sick">🟡 Sick</option>
<option value="Leave">🔵 Leave</option>
<option value="Bench">🟣 Bench</option>
<option value="None">⚪ None</option>
<option value="Terminated">🔴 Terminated</option>
                                </select>
                              </td>


                            )}


                            <td className="px-2 py-2">
                              {(user?.DetailedVerification === false && UpdateduserType === "healthcare-assistant")||(UpdateduserType==='patient'&&user?.PDRStatus!=="Filled") ? <p className="inline-block px-2 py-1 text-[10px] text-center font-semibold 
              text-neutral-700 bg-neutral-100 rounded-md">
  Full Info Required
</p>
 :
                                <button
                                  className="w-full text-white bg-gradient-to-br from-[#00A9A5] to-[#007B7F] hover:from-[#01cfc7] hover:to-[#00403e] rounded-lg px-2 py-2 transition cursor-pointer text-xs sm:text-sm"
                                  onClick={() => ShowDompleteInformation(user.userId, user.FirstName)}
                                >
                                  {user.DetailedVerification ? "View" : "Preview"}
                                </button>}

                            </td>
                                 {UpdateduserType === 'patient' &&
                             <td className="px-2 py-2 text-center">
                        {user.ClientStatus==="Converted" ?<div>{user?.PDRStatus==="Filled" ?
  <span className="inline-flex items-center justify-center p-1.5 rounded-full cursor-pointer hover:shadow-lg
                   bg-emerald-100 text-emerald-600">
    <FileCheck size={18} strokeWidth={2.2} onClick={() => UpdatePopup(user)}/>
  </span>:  <span className="inline-flex items-center justify-center p-1.5 rounded-full cursor-pointer hover:shadow-lg
                   bg-red-100 text-red-600">
    <FileX size={18} strokeWidth={2.2}  onClick={()=>{dispatch(CurrrentPDRUserId(user.userId)) ; dispatch(Refresh("Please Wait......"));router.push("/NewLead")}}/>
  </span>}
</div>:<p className="inline-flex items-center gap-2 rounded-full w-[100px] h-[28px] border border-gray-200 px-3 shadow-lg py-1 text-[9px] text-gray-600">
  <span className="h-4 w-2 rounded-full bg-green-500"></span>
Awaiting Conversion
</p>
}


                            </td>}
                            {UpdateduserType === 'patient' &&
                              <td className="md:px-8 md:py-2">

                                <button
                                  onClick={() => UpdateNavigattosuggetions(user.userId)}
                                  className="flex   cursor-pointer items-center gap-2 w-full sm:w-auto justify-center  py-2
 text-white    h-10 text-[9px] transition-all duration-150"
                                >
                                  {/* <img src="Icons/HCP.png" className='h-10 w-10 rounded-full'/> */}
                                  <img src="Icons/FemaleHCA.png" className='h-10 w-15 rounded-full' />

                                </button>
                              </td>}
                            {UpdateduserType === 'patient' &&
                              <td className="md:px-8 md:py-2">

                                <button

                                  className="flex   cursor-pointer items-center gap-2 w-full sm:w-auto justify-center  py-2
    h-10 text-[9px] transition-all duration-150"
                                >
                                  <Trash onClick={() => { setShowDeletePopUp(true), SetDeleteInformation(user) }} />

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
                    No data available for Current Month/ Filter
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
          </div>}
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
 dispatch(Refresh(""))
  };

  const handleMainLogout = async () => {
    localStorage.removeItem("UserId");
    router.prefetch("/");
    router.push("/");
  };


  if (isChecking) {
    <LoadingData />
  }




  const Filter_HCA = Finel.filter((each: any) => {
    const isHCA = each.userType === "healthcare-assistant";
    const isAvailable = each.Status !== "Assigned";
    const matchesName =
      !AsignStatus || each.FirstName.toLowerCase().includes(AsignStatus.toLowerCase());

    return isHCA && isAvailable && matchesName;
  });


  const UpdateNavigattosuggetions = (D: any) => {
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
      ?.["PermanentState"]||"Not Provided";

    return address ?? "Not Entered";
  };


    const GetHCPGender = (A: any) => {
    if (!UserFullInfo?.length || !A) return "Not Entered";

    const address =
      UserFullInfo
        ?.map((each: any) => each?.HCAComplitInformation)
        ?.find((info: any) => info?.UserId === A)
      ?.['Gender']||"Not Provided";

    return address ?? "Not Entered";
  };






  const HCPWorkingStatus=(A:any)=>{
    try{
   if (!UserFullInfo?.length || !A) return "Not Entered";

    const address =
      UserFullInfo
        ?.map((each: any) => each?.HCAComplitInformation)
        ?.find((info: any) => info?.UserId === A)
      ?.["Status"];

    return address ?? "Not Entered";


    }catch(err:any){

    }
  }





  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafc] via-[#e3f6f5] to-[#f9f9ff] text-gray-900 p-2 ">


      <div className="sticky top-0 z-50 bg-opacity-90 backdrop-blur-lg mb-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/90 rounded-xl p-3 shadow-2xl border border-gray-100">
        <div className="flex items-center gap-3 relative">
          {showOptions && (
    <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-xl shadow-lg w-40 py-2 z-50">
      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("Call Enquiry"));
      dispatch(UpdateUserType("patient"));
    setShowOptions(false)}
      }>
   Call Enquiry
      </button>
       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("HCP List"));
        dispatch(UpdateUserType("healthcare-assistant"));
    setShowOptions(false)}
      }>
   HCP List
      </button>
      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("Deployment"));
      dispatch(UpdateUserType("patient"));
    setShowOptions(false)}
      }>
     Deployment
      </button>
       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("Timesheet"));
      dispatch(UpdateUserType("patient"));
    setShowOptions(false)}
      }>
      Timesheet
      </button>
      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>router.push("/Invoices")}>
      Invoice
      </button>
      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>router.push("/PDRView")}>
    PDR 
      </button>
    </div>
  )}
    <button
      onClick={() => setShowOptions(!showOptions)}
      className="rounded-lg hover:bg-gray-100 transition cursor-pointer"
    >
         <List size={40} className='text-teal-800  p-2'/>
    </button>
  <img
    src="/Icons/Curate-logo.png"
    onClick={() => router.push("/DashBoard")}
    alt="Logo"
    className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl"
  />

  <h1 className="text-lg sm:text-2xl font-extrabold text-[#007B7F] tracking-tight leading-tight flex items-center gap-2">
    Hi,<span className="text-[#ff1493]">{UserFirstName}</span>

    
  
  </h1>


  
</div>


          <div className='flex gap-2 items-center'>
            {(UpdateMainFilter === "Call Enquiry" || UpdateMainFilter === "HCP List")
              && <div
                className="
      flex items-center bg-white shadow-md rounded-xl
      px-4 h-[44px]
      border border-gray-200
      focus-within:border-indigo-500
      transition
      w-full sm:w-[320px]
    "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-500 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                  />
                </svg>

                <input
                  type="search"
                  placeholder="Search..."
                  onChange={(e: any) => setSearchResult(e.target.value)}
                  className="
        w-full bg-transparent outline-none
        text-sm text-gray-700 placeholder-gray-400
      "
                />
              </div>}

            
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
            >
              DashBoard
            </button>
            <button
              onClick={handleMainLogout}
              className="
                   px-4 py-2.5
                  text-sm flex items-center gap-2
                  text-red-600
                  hover:bg-red-50
                  font-medium
                "
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
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
          {UpdateduserType === "patient" &&
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
                {UpdateMainFilter === "Call Enquiry" && <div className="flex gap-2 flex-wrap">

                  {UpdateMainFilterValues().map((each: any, index: any) => (
                    <button
                      key={index}
                      onClick={() => UpdateFilterValue(each)}
                      className={`cursor-pointer px-1 py-1 text-xs flex-1 sm:flex-none sm:min-w-[100px] ${search === each && "border-3"
                        } rounded-xl shadow-md font-medium transition-all duration-200 ${filterColors[each]
                        }`}
                    >
                      {
                        UpdateMainFilter === "Call Enquiry"
                          ? `${each} (${MonthlyCount?.filter(
                            (Try) => Try.ClientStatus === each || Try.userType === each
                          )?.length || 0
                          })`
                          : each
                      }


                    </button>
                  ))}
                </div>}


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


          {UpdateduserType === "healthcare-assistant" && 
          <div className="flex gap-3 flex-wrap items-center">
  {["HCA", "HCP", "HCN"].map((each, index) => {
    const isActive = HCPPreviewtype === each;

    return (
      <span
        key={index}
        onClick={() => {setHCPPreviewtype(each);  dispatch(Refresh(""))}}
        className={`
          px-4 py-1.5
          rounded-full
          text-sm font-semibold
          cursor-pointer
          transition-all duration-200
          border
          ${
            isActive
              ? "bg-teal-600 text-white border-teal-600 shadow-md scale-105"
              : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
          }
        `}
      >
        {/* {each} ({GetHCPTypeCount(each)}) */} {each}({MonthlyCount?.filter(
                            (Try) => Try.PreviewUserType === each &&Try.userType==="healthcare-assistant"
                          )?.length || 0
                          })
      </span>
    );
  })}
</div>

          }
          {/* <button
onClick={()=>UpdateNavigattosuggetions()}
            className="flex mt-7 cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-2 py-2 bg-gradient-to-br from-[#10b981] to-[#065f46] hover:from-[#34d399] hover:to-[#064e3b]
 text-white rounded-xl  hover:shadow-lg hover:rounded-full h-8 text-[9px] transition-all duration-150"
          >
            Show Placement Suggetions
            
          </button> */}
    {UpdateduserType === "healthcare-assistant" &&
     <div className="w-[360px] flex flex-wrap items-center justify-center gap-1">
  {HCPFilters.map((status) => (
    <button
      key={status.value}
      type="button"
      onClick={() => setHCPCurrentStatus(status.value)}
      className={`px-2 py-1 rounded-md text-[10px] font-medium border transition whitespace-nowrap cursor-pointer
        ${
          HCPCurrentStatus === status.value
            ? "bg-teal-600 text-white border-teal-600 shadow-sm"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}
    >
      {status.label}
    </button>
  ))}
</div>
}


          {((UpdateMainFilter !== "Timesheet") && (UpdateMainFilter !== 'Deployment')) &&
            <div className="flex justify-between gap-3 md:w-[330px]">





              <div className="w-full sm:w-[130px]">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Month
                </label>

                <select
                  value={SearchMonth}
                  onChange={async (e) => {
    const month = e.target.value;

    dispatch(Refresh(`Please Wait... Fetching ${month || "All"} info...`));

    // ⏳ wait until month data updates
    await dispatch(UpdateAdminMonthFilter(month));

    // ✅ now trigger fresh reload + message
    dispatch(Refresh(`Successfully Fetched ${month || "All"} Data`));
  }}
                   className="
        w-full h-[44px] rounded-xl
        border border-gray-300
        px-4 text-sm bg-white text-gray-800
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        focus:border-transparent transition-all
      "
                >
                  <option value="">All Months</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>




              <div >
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Year
                </label>

                <select
                  value={SearchYear}
                  onChange={(e) => dispatch(UpdateAdminYearFilter(e.target.value))}
                  className="
        w-full rounded-xl border border-gray-300
        px-4 py-3 text-sm bg-white text-gray-800
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        focus:border-transparent transition-all
      "
                >
                  <option value="">All Years</option>
                  {[2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

            </div>}





        </div>
      </div>



      {ContetUserInterface()}




    </div>
  );
}
function each(value: { id: any; FirstName: any; AadharNumber: any; Age: any; userType: any; Location: any; Email: any; Contact: any; userId: any; VerificationStatus: any; DetailedVerification: any; EmailVerification: any; ClientStatus: any; }, index: number, array: { id: any; FirstName: any; AadharNumber: any; Age: any; userType: any; Location: any; Email: any; Contact: any; userId: any; VerificationStatus: any; DetailedVerification: any; EmailVerification: any; ClientStatus: any; }[]): value is { id: any; FirstName: any; AadharNumber: any; Age: any; userType: any; Location: any; Email: any; Contact: any; userId: any; VerificationStatus: any; DetailedVerification: any; EmailVerification: any; ClientStatus: any; } {
  throw new Error('Function not implemented.');
}



