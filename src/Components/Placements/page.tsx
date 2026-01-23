"use client";
let cachedUsersFullInfo: any;
let cachedDeploymentInfo: any[] | null = null;
let cachedReplacementInfo:any[]
let cachedTermination:any[]


import React, { useEffect, useState } from "react";
import { CircleCheckBig, Trash } from "lucide-react";
import { DeleteHCAStatus, DeleteHCAStatusInFullInformation, DeleteTimeSheet, GetDeploymentInfo, GetRegidterdUsers, GetReplacementInfo, GetTerminationInfo, GetTimeSheetInfo, GetUserInformation, GetUsersFullInfo, InserTerminationData, InserTimeSheet, TestInserTimeSheet, UpdateHCAnstatus, UpdateHCAnstatusInFullInformation, UpdateReason, UpdateReplacmentData, UpdateUserContactVerificationstatus } from "@/Lib/user.action";
import { useDispatch, useSelector } from "react-redux";
import { UpdateSubHeading } from "@/Redux/action";
import TerminationTable from "../Terminations/page";
import { LoadingData } from "../Loading/page";
import PaymentModal from "../PaymentInfoModel/page";
import { filterColors, months, Placements_Filters, years } from "@/Lib/Content";
import ReplacementsTable from "../ReplacementsTable/page";


type AttendanceStatus = "Present" | "Absent" | "Leave" | "Holiday";
const statusCycle: AttendanceStatus[] = ["Present", "Absent", "Leave", "Holiday"];

const parseEnInDate = (dateStr: string) => {
  if (!dateStr || typeof dateStr !== "string") return new Date(NaN);
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};
interface AttendanceData {
  date: string;
  day: string;
  updatedAt: string;
  status: "Present" | "Absent" | "Leave";
}

type User = any;
type Deployment = any;
type Replace = any;
type Termination=any;
type AttendanceState = Record<number, AttendanceData>;
const ClientTable = () => {
  const [ClientsInformation, setClientsInformation] = useState<Deployment[]>([]);
  const [ReplacementInformation,setReplacementInformation]=useState<Replace[]>([])
  const [terminationInfo,SetterminationInfo]=useState<Termination[]>([])
  const [isChecking, setIsChecking] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [Fineldate, setFineldate] = useState({
    date: '', day: "",
    updatedAt: "",
    status: ""
  })
  const [HCPName,setHCPName]=useState("")
  const [ShowReassignmentPopUp,setShowReassignmentPopUp]=useState(false)
 const [updatedAttendance, setUpdatedAttendance] = useState<AttendanceState>({});
 const [SaveButton,setSaveButton]=useState(false)
const [SearchMonth, setSearchMonth] = useState("");
const [SearchYear, setSearchYear] = useState("");
const [enableStatus,setenableStatus]=useState(false)
  const [TimeSheet_UserId, setTimeSheet_UserId] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showTimeSheet, setShowTimeSheet] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showExtendPopup,setshowExtendPopup]=useState(false)
  const [ExtendInfo,setExtendInfo]=useState<any>({})
  const [deleteTargetId, setDeleteTargetId] =  useState<any>();
  const [ActionStatusMessage,SetActionStatusMessage]= useState<any>();
  const [SearchResult,setSearchResult]=useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [search, setSearch] = useState("On Service");
  const [billingRecord, setBillingRecord] = useState<any>(null);
const TimeStamp=useSelector((state:any)=>state.TimeStampInfo)
  
  const dispatch = useDispatch();

useEffect(() => {
  let mounted = true;

  const fetchData = async (forceFresh = false) => {
    try {
    
      if (!forceFresh && cachedUsersFullInfo && cachedDeploymentInfo) {
        if (!mounted) return;

        setUsers([...cachedUsersFullInfo]);           
        setClientsInformation([...cachedDeploymentInfo]);
        setReplacementInformation([...cachedReplacementInfo])
        SetterminationInfo([...cachedTermination])
        dispatch(UpdateSubHeading("On Service"));
        setIsChecking(false);
        return;
      }

      
      const [usersResult, placementInfo,ReplacementInfo,TerminationInformation] = await Promise.all([
        GetUsersFullInfo(),
        GetDeploymentInfo(),
        GetReplacementInfo(),
        GetTerminationInfo()
      ]);

      if (!mounted) return;

      cachedUsersFullInfo = usersResult ?? [];
      cachedDeploymentInfo = placementInfo ?? [];
      cachedReplacementInfo=ReplacementInfo ?? [];
      cachedTermination=TerminationInformation?? [];

      setUsers(cachedUsersFullInfo);                 
      setClientsInformation(cachedDeploymentInfo);    
      dispatch(UpdateSubHeading("On Service"));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      mounted && setIsChecking(false);
    }
  };

  fetchData(!!ActionStatusMessage);

  return () => {
    mounted = false;
  };
}, [ActionStatusMessage, dispatch]);



  const FinelTimeSheet = ClientsInformation.map((each: any) => {
 const normalizedAttendance =
  Array.isArray(each.Attendance) && each.Attendance.length > 0
    ? each.Attendance.map((att: any) => {
        const hcp = att.HCPAttendence ?? att.HCPAttendance ?? att.hcpAttendence;
        const admin =
          att.AdminAttendece ??
          att.AdminAttendence ??
          att.AdminAttendance ??
          att.adminAttendence;

        return {
          date: att.AttendenceDate,
          status: hcp === true && admin === true ? "Present" : "Absent",
        };
      })
    : [];


  return {
    Client_Id: each.ClientId,
    HCA_Id: each.HCAId,
    Address: each.Address,
    name: each.ClientName,
    email: each.ClientEmail,
    contact: each.ClientContact,
    HCAContact: each.HCAContact,
    HCA_Name: each.HCAName,
    location: each.Address,
    TimeSheet: normalizedAttendance,
    StartDate:each.StartDate,
    PatientName: each.patientName,
    Patient_PhoneNumber: each.patientPhone,
    RreferralName: each.referralName,
    Type: each.Type,
    Status: each.Status,
    cPay: each.cPay,
    cTotal: each.cTotal,
    hcpPay: each.hcpPay,
    hcpSource: each.hcpSource,
    hcpTotal: each.hcpTotal,
    invoice: each.invoice,
  };
});

 const filterProfilePic = (users || []).map(
        (each: any) => each?.HCAComplitInformation ?? {}
      );
  const Finel = filterProfilePic.map((each: any) => ({
    id: each.UserId,
    FirstName: each.HCPFirstName,
    AadharNumber: each.HCPAdharNumber,
    Age: each.Age,
    userType: each.userType,
    Location: each['Permanent Address']||'',
    Email: each.HCPEmail,
    Contact: each.HCPContactNumber,
    userId: each.UserId,
    VerificationStatus: each.VerificationStatus,
    DetailedVerification: each.FinelVerification,
    EmailVerification: each.EmailVerification,
    ClientStatus: each.ClientStatus,
    Status: each.Status,
    provider:each.provider,
    payTerms:each.payTerms
  }));

 const handleDelete = () => {
    if (selectedReason === "Other") {
      confirmDelete(otherReason.trim());
    } else {
      confirmDelete(selectedReason);
    }
  };

  const isDeleteDisabled =
    !selectedReason || (selectedReason === "Other" && !otherReason.trim());
  const UpdateClient_UserId = (id: any,Name:any) => {
    setHCPName(Name)
    setTimeSheet_UserId(id);
    setShowTimeSheet(true);
  };
const UpdateInformation=()=>{
const message = `
Dear Healthcare Professional,

Please find below the attendance confirmation details of the Healthcare Professional:

👤 *Name:* ${HCPName}

✅ *Attendance Status:* ${Fineldate.status}
📅 *Date:* ${Fineldate.date}
   *Day:* ${Fineldate.day}
⏰ *Updated Time:* ${Fineldate.updatedAt}

Kind regards,  
*Curate Health Care Service*
`;


const phoneNumber='919347877159'

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;


  window.open(whatsappUrl, "_blank");
  setShowTimeSheet(false);
}

const UpdatePopup=async(a:any)=>{
  setshowExtendPopup(true)
  setExtendInfo(a)

}

  const ExtendTimeSheet = async (a: any) => {
SetActionStatusMessage("Please Wait Working On Time Sheet Extention")
    const CurrentMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 2}`
    const DateofToday = new Date().toLocaleDateString('In-en')
    const DateOfCurrentDay = new Date()
    const LastDateOfMonth = new Date(DateOfCurrentDay.getFullYear(), DateOfCurrentDay.getMonth() + 1, 0)
      .toLocaleDateString('en-IN');
    const PostTimeSheet: any = await TestInserTimeSheet(DateofToday, LastDateOfMonth, ExtendInfo.Status, ExtendInfo.Address, ExtendInfo.contact, ExtendInfo.name, ExtendInfo.PatientName, ExtendInfo.Patient_PhoneNumber, ExtendInfo.RreferralName, ExtendInfo.HCA_Id, ExtendInfo.Client_Id, ExtendInfo.HCA_Name, ExtendInfo.HCAContact, ExtendInfo.
      hcpSource, ExtendInfo.provider, ExtendInfo.payTerms, ExtendInfo.cTotal, ExtendInfo.cPay, ExtendInfo.hcpTotal, ExtendInfo.hcpPay, CurrentMonth, ["P"], TimeStamp, ExtendInfo.invoice, ExtendInfo.Type)
   

    if(PostTimeSheet.success===true){
     
       SetActionStatusMessage("TimeSheet Succesfully Extended")
       const Timer=setInterval(()=>{
         setshowExtendPopup(false)
         SetActionStatusMessage("")
       },2000)
       return ()=>clearInterval(Timer)
    }
    
  }
  const HCA_List = Finel.filter((each: any) => {
  const typeMatch =
    each.userType === "healthcare-assistant" ||
    each.userType === "HCA" ||
    each.userType === "HCP" ||
    each.userType === "HCPT";

  const isNotAssigned = !each.Status?.some((s: string) => s === "Assigned");

  return typeMatch && isNotAssigned;
});



  const TimeSheet_Info = FinelTimeSheet.find(

    (each) => each.Client_Id === TimeSheet_UserId
  );

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const handleStatusClick = (day: number) => {
    if (!TimeSheet_Info) return;
    const updatedTimeSheet = [...(TimeSheet_Info.TimeSheet || [])];
    const clickedDate = new Date(selectedYear, selectedMonth, day);
    const existingRecordIndex = updatedTimeSheet.findIndex((t) => {
      const parsed = parseEnInDate(t.date);
      return (
        parsed.getDate() === clickedDate.getDate() &&
        parsed.getMonth() === clickedDate.getMonth() &&
        parsed.getFullYear() === clickedDate.getFullYear()
      );
    });
    if (existingRecordIndex > -1) {
      const currentStatus = updatedTimeSheet[existingRecordIndex].status;
      const nextStatus =
        statusCycle[
          (statusCycle.indexOf(currentStatus) + 1) % statusCycle.length
        ];
      updatedTimeSheet[existingRecordIndex].status = nextStatus;
    } else {
      updatedTimeSheet.push({
        date: clickedDate.toLocaleDateString("en-IN"),
        status: "Present",
      });
    }
    TimeSheet_Info.TimeSheet = updatedTimeSheet;
    setClientsInformation([...ClientsInformation]);
  };

  const handleDeleteClick = (clientId: any) => {
    setDeleteTargetId(clientId);
    setShowDeletePopup(true);
  };

  const confirmDelete = async(selectedReason: string) => {
    if (deleteTargetId) {
        SetActionStatusMessage("Please Wait Deleting Placement...")

           const UpdateHcaStatus= await UpdateHCAnstatus(deleteTargetId?.HCA_Id,"Available")
         const UpdateStatus=await UpdateUserContactVerificationstatus(deleteTargetId.Client_Id,"Converted")
           const DeleteTimeSheetData=await DeleteTimeSheet(deleteTargetId.Client_Id)
           const PostTimeSheet:any = await InserTerminationData(deleteTargetId.Client_Id, deleteTargetId?.HCA_Id, deleteTargetId.name, deleteTargetId.email, deleteTargetId.contact,deleteTargetId.location, deleteTargetId.role, deleteTargetId.HCAContact, deleteTargetId.TimeSheet)
                
                if(DeleteTimeSheetData.success===true){
          SetActionStatusMessage("Seccessfully Deleted Placement")

                }
           
    }
    setShowDeletePopup(false);
    setDeleteTargetId(null);
  };


const FilterFinelTimeSheet = FinelTimeSheet.filter((each: any) => {
  
  const search = SearchResult?.toLowerCase() || "";

  const name = each.name?.toLowerCase() || "";
  const email = each.email?.toLowerCase() || "";
  const contact = each.contact?.toLowerCase() || "";
  const role = each.role?.toLowerCase() || "";

  const matchesSearch =
    name.includes(search) ||
    email.includes(search) ||
    contact.includes(search) ||
    role.includes(search);

 
  const startDate = each.StartDate || "";

  let matchesMonth = true;
  let matchesYear = true;

  if (startDate) {
    const [day, month, year] = startDate.split("/");


    const monthName = new Date(
      Number(year),
      Number(month) - 1
    ).toLocaleString("default", { month: "long" });

    if (SearchMonth) {
      matchesMonth = monthName === SearchMonth;
    }

    if (SearchYear) {
      matchesYear = year === SearchYear;
    }
  }

  /* ---------- FINAL RETURN ---------- */
  return matchesSearch && matchesMonth && matchesYear;
});

const today:any = new Date().getDate();
const isInvoiceDay = [ 28, 29, 30, 31].includes(today);
console.log("Test Today------",isInvoiceDay

)
const UpdateReplacement=async(Available_HCP:any,Exsting_HCP:any)=>{
  SetActionStatusMessage("Please Wait....")

try{
    const localValue = localStorage.getItem('UserId');
  const Sign_in_UserInfo:any = await GetUserInformation(localValue)
 
   const PostReason=await UpdateReason(Available_HCP,Exsting_HCP,selectedReason,otherReason)
   const TimeStampData=   `${Sign_in_UserInfo.FirstName} ${Sign_in_UserInfo.LastName}, Email: ${Sign_in_UserInfo.Email}`
const UpdateReplacmentInfo=await UpdateReplacmentData(Available_HCP,Exsting_HCP,TimeStampData)
console.log("Find Mistake--",UpdateReplacmentInfo)
if(UpdateReplacmentInfo.success=== true){
  const UpdateHcaStatus = await UpdateHCAnstatus(Available_HCP?.userId, "Assigned")
  const reove=await DeleteHCAStatus(Exsting_HCP.HCA_Id)
const UpdateAssignStatus= await UpdateHCAnstatusInFullInformation(Available_HCP?.userId)
const RemoveStatus= await DeleteHCAStatusInFullInformation(Exsting_HCP.HCA_Id)
SetActionStatusMessage("Replacement Updated Sucessfull")

}

}catch(err:any){

}
}



  const OmServiceView = () => {
    return (
      <div className="w-full flex flex-col gap-8 p-2 bg-gray-50">
       
     
           
        <div className="flex itemcs-center gap-2 justify-end">
            <div
    className="
      flex items-center bg-white shadow-md rounded-xl
      px-4 h-[36px]
      border border-gray-200
      focus-within:border-indigo-500
      transition
       md:w-[220px]
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
  </div>
  <div className="w-full sm:w-[130px]">
    {/* <label className="block text-xs font-semibold text-gray-600 mb-1">
      Month
    </label> */}

    <select
      value={SearchMonth}
      onChange={(e) => setSearchMonth(e.target.value)}
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
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
      ].map((month) => (
        <option key={month} value={month}>
          {month}
        </option>
      ))}
    </select>
  </div>
<div >
    {/* <label className="block text-xs font-semibold text-gray-600 mb-1">
      Year
    </label> */}

    <select
      value={SearchYear}
      onChange={(e) => setSearchYear(e.target.value)}
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
  </div>
  
  {ClientsInformation.length === 0 && (
    <div className="flex flex-col items-center justify-center gap-6 h-[60vh] mt-10 rounded-3xl bg-white/60 backdrop-blur-lg border border-gray-200 shadow-2xl p-12">
      <p className="text-3xl font-extrabold text-gray-900 text-center">
        ✨ Sorry to Inform You, <span className="text-emerald-600">No Placements Available</span>
      </p>
      <p className="bg-gradient-to-r from-emerald-200 to-teal-200 text-emerald-900 px-8 py-3 rounded-full shadow-lg font-semibold text-sm tracking-wide">
        🔎 Check <span className="font-bold text-emerald-800">Terminations</span> for Previous Placements
      </p>
    </div>
  )}


  {ClientsInformation.length > 0 && (
    <div className="w-full max-h-[75vh] overflow-y-auto rounded-2xl shadow-xl">
  <table className="w-full table-fixed border-collapse bg-white">
    
    {/* TABLE HEADER */}
    <thead className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white uppercase text-xs font-semibold">
      <tr>
        <th className="px-3 py-3 text-left break-words">Client Name</th>
        <th className="px-3 py-3 text-left break-words">Patient Name</th>
        <th className="px-3 py-3 text-left break-words">Contact</th>
        <th className="px-3 py-3 text-left break-words">Location</th>
        <th className="px-3 py-3 text-left break-words">HCA Name</th>
        <th className="px-3 py-3 text-left break-words">Status</th>
        <th className="px-3 py-3 text-left break-words">Replacement</th>
        <th className="px-3 py-3 text-center break-words">Time Sheet</th>

        {(isInvoiceDay || enableStatus) && (
          <th className="px-3 py-3 text-center break-words">Invoice</th>
        )}

        <th className="px-3 py-3 text-center break-words">Service Continue</th>
        <th className="px-3 py-3 text-center break-words">Terminate</th>
      </tr>
    </thead>

    {/* TABLE BODY */}
    <tbody className="bg-white divide-y divide-gray-200">
      {[...FilterFinelTimeSheet].reverse().map((c, i) => (
        <tr key={i} className="hover:bg-teal-50/30 transition-all">
          
          <td className="px-3 py-3 font-semibold text-gray-900 break-words">
            {c.name}
          </td>

          <td className="px-3 py-3 font-semibold text-gray-900 break-words">
            {c.PatientName}
          </td>

          <td className="px-3 py-3 text-gray-700 break-words">
            {c.contact}
          </td>

          <td className="px-3 py-3 text-gray-600 break-words">
            {c.location}
          </td>

         <td className="px-3 py-3 w-auto text-center">
  <span className="inline-flex items-center justify-center px-1 py-1 text-[11px] rounded-md font-medium border bg-white gap-1">
    🩺 {c.HCA_Name}
  </span>
</td>


          <td className="px-3 py-3 break-words">
            <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1">
              <CircleCheckBig className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-medium text-emerald-700">Active</p>
            </div>
          </td>

          <td className="px-3 py-3 break-words">
         <button
  className="
    px-2 py-2.5
    text-xs font-semibold
    text-teal-600
    border-2 border-teal-500
    rounded-lg
    shadow-[0_0_0_0_rgba(20,184,166,0.5)]
    transition-all duration-300
    hover:shadow-[0_0_12px_2px_rgba(20,184,166,0.6)]
    hover:bg-teal-50
    active:scale-95
    cursor-pointer
  "
  onClick={()=>setShowReassignmentPopUp(!ShowReassignmentPopUp)}
>
  Reassignment
</button>

{ShowReassignmentPopUp&&<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px]">
  

  <div
    className="
      w-[500px]
      rounded-2xl
      bg-white/80
     
      border border-white/60
      overflow-hidden
    "
  >
  
    <div className="h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500" />


    <div className="px-7 py-6 space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-gray-800">
          Request Replacement
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Let us know the reason to proceed
        </p>
      </div>
     <img src='Icons/Curate-logoq.png' className="h-8" alt="Company Logo"/>
</div>
    
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Reason for Replacement
        </label>

        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className="
            w-full
            rounded-xl
            bg-white/90
            border border-gray-300
            px-4 py-2.5
            text-sm
            focus:outline-none
            focus:ring-2 focus:ring-blue-400
          "
        >
          <option value="">Choose reason</option>
          <option value="Service Quality Issue">Service Quality Issue</option>
          <option value="Staff Unavailable">Staff Unavailable</option>
          <option value="Schedule Mismatch">Schedule Mismatch</option>
          <option value="Patient Recovered">Patient Recovered</option>
          <option value="Cost Concern">Cost Concern</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {selectedReason === "Other" && (
        <textarea
          rows={3}
          placeholder="Please specify"
          value={otherReason}
          onChange={(e) => setOtherReason(e.target.value)}
          className="
            w-full
            rounded-xl
            bg-white/90
            border border-gray-300
            px-4 py-2.5
            text-sm
            resize-none
            focus:outline-none
            focus:ring-2 focus:ring-blue-400
          "
        />
      )}
{selectedReason &&
  (selectedReason !== "Other" || otherReason)&& 
  <select
              className="w-full p-2 text-sm border rounded-lg cursor-pointer"
              onChange={(e) => {
                const selected = HCA_List.find(
                  (hca) => hca.FirstName === e.target.value
                );
                selected && UpdateReplacement(selected, c);
              }}
            >
              <option>Assign New HCA</option>
              {HCA_List.map((each: any, index: any) => (
                <option key={index}>{each.FirstName}</option>
              ))}
            </select> }
  
      <div className="flex justify-end gap-4 pt-2">
        <button
          onClick={() => setShowReassignmentPopUp(!ShowReassignmentPopUp)}
          className="
            text-sm font-medium
            text-gray-600
            hover:text-gray-800
            transition cursor-pointer
          "
        >
          Cancel
        </button>

    {/* <button
  onClick={handleDelete}

  className={`
    inline-flex items-center justify-center
    px-7 py-3
    text-sm font-semibold
    rounded-full
    transition-all duration-300 ease-out

    ${
      selectedReason && (selectedReason !== "Other" || otherReason)
        ?
         `
          text-white
          bg-gradient-to-r from-blue-600 to-cyan-600
          shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)]
          hover:from-blue-700 hover:to-cyan-700
          hover:shadow-[0_14px_40px_-12px_rgba(59,130,246,0.9)]
          active:scale-95
          cursor-pointer
        `: `
          bg-gray-200
          text-gray-500
          cursor-not-allowed
          shadow-none
        `
    }
  `}
>
  Confirm Replacement
</button> */}

      </div>
    </div>
  </div>
</div>
}
          
          </td>

          <td className="px-3 py-3 text-center break-words">
            <button
              className="px-4 py-2 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md"
              onClick={() => UpdateClient_UserId(c.Client_Id, c.name)}
            >
              View
            </button>
          </td>

          {(isInvoiceDay || enableStatus) && (
            <td className="px-3 py-3 text-center break-words">
              <button
                className="px-4 py-2 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md"
                onClick={() => {
                  setBillingRecord(c);
                  setShowPaymentModal(true);
                }}
              >
                Generate Bill
              </button>
            </td>
          )}

          <td className="px-3 py-3 text-center break-words">
            <button
              className="px-4 py-2 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md"
              onClick={() => UpdatePopup(c)}
            >
              Extend
            </button>
          </td>

          <td className="px-3 py-3 text-center break-words">
            <button
              className="px-3 py-2 text-xs font-medium rounded-lg hover:bg-gray-100"
              onClick={() => handleDeleteClick(c)}
            >
              <Trash />
            </button>
          </td>

        </tr>
      ))}
    </tbody>

  </table>
</div>


  
  )}
   {ActionStatusMessage && (
          <div className="flex flex-col items-center justify-center gap-4 mt-4 bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 px-4 py-4">
          {ActionStatusMessage!=="Replacement Updated Sucessfull"&&  <div className="w-5 h-5 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>}
            <p className={`text-center ${ActionStatusMessage==="Replacement Updated Sucessfull"?"text-green-800":"text-red-500"} font-semibold`}>
              {ActionStatusMessage}
            </p>
          </div>
        )}
{showExtendPopup&&
 <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[350px] p-6 text-center border border-gray-200">
     
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Are you sure you want to extend?
        </h2>

   
        <div className="border-t border-gray-200 mb-4"></div>

    
        <div className="flex justify-center gap-4">
          <button
        onClick={()=>setshowExtendPopup(false)}
            className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
          >
            No
          </button>
          <button
            onClick={ExtendTimeSheet}
            className="px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all"
          >
            Yes
          </button>
        </div>
        
        
      </div>
      
    </div>
}

  {showDeletePopup && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-7 border border-gray-200">
    
   
    <div className="text-center mb-6">
      <h2 className="text-xl font-bold text-gray-800">
        Request Replacement
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Please select a reason for requesting a replacement
      </p>
    </div>

    {/* Reason Selection */}
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Reason for Replacement
      </label>

      <select
        value={selectedReason}
        onChange={(e) => setSelectedReason(e.target.value)}
        className="
          w-full
          rounded-xl
          border border-gray-300
          px-4 py-2.5
          text-sm
          focus:outline-none
          focus:ring-2 focus:ring-teal-500
        "
      >
        <option value="">-- Select Reason --</option>
        <option value="Service Quality Issue">Service Quality Issue</option>
        <option value="Staff Unavailable">Staff Unavailable</option>
        <option value="Schedule Mismatch">Schedule Mismatch</option>
        <option value="Patient Recovered">Patient Recovered</option>
        <option value="Cost Concern">Cost Concern</option>
        <option value="Other">Other</option>
      </select>

      {/* Custom Reason */}
      {selectedReason === "Other" && (
        <textarea
          rows={3}
          placeholder="Please specify the reason"
          value={otherReason}
          onChange={(e) => setOtherReason(e.target.value)}
          className="
            w-full
            rounded-xl
            border border-gray-300
            px-4 py-2.5
            text-sm
            resize-none
            focus:outline-none
            focus:ring-2 focus:ring-teal-500
          "
        />
      )}
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-4 mt-8">
      <button
        onClick={() => setShowDeletePopup(false)}
        className="
          px-5 py-2.5
          text-sm font-medium
          text-gray-700
          bg-gray-100
          rounded-xl
          hover:bg-gray-200
          transition
        "
      >
        Cancel
      </button>

      <button
        onClick={handleDelete}
        disabled={!selectedReason}
        className="
          px-5 py-2.5
          text-sm font-semibold
          text-white
          bg-teal-600
          rounded-xl
          shadow-md
          hover:bg-teal-700
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition
        "
      >
        Confirm Replacement
      </button>
    </div>
  </div>
</div>

  )}


{showTimeSheet && TimeSheet_Info && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl shadow-2xl p-6 w-[750px] max-h-[90vh] overflow-y-auto backdrop-blur-md border border-gray-200">

    
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          📅 Attendance - {monthNames[selectedMonth]} {selectedYear}
        </h2>

        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border p-2 rounded-md"
          >
            {monthNames.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border p-2 rounded-md"
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
      </div>


      
      <div className="grid grid-cols-7 gap-3 text-center">

        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const day = dayIndex + 1;

          
          const record = TimeSheet_Info.TimeSheet?.find((t:any) => {
            let d = t.date;

     
            if (d instanceof Date) {
              return (
                d.getDate() === day &&
                d.getMonth() === selectedMonth &&
                d.getFullYear() === selectedYear
              );
            }

          
            const parsed = new Date(d);
            return (
              parsed.getDate() === day &&
              parsed.getMonth() === selectedMonth &&
              parsed.getFullYear() === selectedYear
            );
          });

     
          const today = new Date();
          const currentDateObj = new Date(selectedYear, selectedMonth, day);
          const isFuture = currentDateObj > today;

      
          const currentStatus =
            updatedAttendance?.[day]?.status ??
            record?.status ??
            "Absent";

      
          const statusColor =
            currentStatus === "Present"
              ? "bg-green-100 text-green-700 border-green-300"
              : currentStatus === "Absent"
              ? "bg-red-100 text-red-700 border-red-300"
              : "bg-yellow-100 text-yellow-700 border-yellow-300";

          
          const handleStatusClick = (day:any) => {
            if (isFuture) return;

            setSaveButton(true);

            setUpdatedAttendance((prev) => {
              const current = prev?.[day]?.status || record?.status || "Absent";

              const nextStatus =
                current === "Absent"
                  ? "Present"
                  : current === "Present"
                  ? "Leave"
                  : "Absent";

              const currentDate = new Date(selectedYear, selectedMonth, day);

              const formattedDate = currentDate.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                timeZone: "Asia/Kolkata",
              });

              const formattedDay = currentDate.toLocaleDateString("en-IN", {
                weekday: "long",
                timeZone: "Asia/Kolkata",
              });

              const updateTime = new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata",
              });

              setFineldate({
                ...Fineldate,
                date: formattedDate,
                day: formattedDay,
                updatedAt: updateTime,
                status: nextStatus,
              });

              return {
                ...prev,
                [day]: {
                  date: formattedDate,
                  day: formattedDay,
                  updatedAt: updateTime,
                  status: nextStatus,
                },
              };
            });
          };

          return (
            <div
              key={day}
              onClick={() => handleStatusClick(day)}
              className={`p-3 border rounded-lg flex flex-col items-center justify-center 
                ${
                  isFuture
                    ? "opacity-40 blur-[1px] cursor-not-allowed"
                    : "cursor-pointer hover:scale-105"
                } 
                ${statusColor}
                transition-transform`}
            >
              <span className="text-sm font-semibold">{day}</span>
              <span className="text-xs font-medium">{currentStatus}</span>
            </div>
          );
        })}
      </div>

      {SaveButton && (
        <p
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-900 md:mt-2 transition-colors cursor-pointer select-none"
          onClick={UpdateInformation}
        >
          Save Attendance
        </p>
      )}

      <div className="mt-5 text-right">
        <button
          onClick={() => setShowTimeSheet(false)}
          className="px-4 py-2 bg-red-500 text-white cursor-pointer rounded-xl shadow hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

</div>

    );
  };
const GetFilterCount=(A:any)=>{
  switch(A){
     case "On Service":
        return cachedDeploymentInfo?.length;
      case "Termination":
        return cachedTermination.length;
      case "Replacements":
        return cachedReplacementInfo.length;
      default:
        return null;

  }
}
  const CurrentUserInterfacevIew = () => {
    switch (search) {
      case "On Service":
        return OmServiceView();
      case "Termination":
        return <TerminationTable/>;
      case "Replacements":
        return <ReplacementsTable/>;
      default:
        return null;
    }
  };

  if (isChecking) {
    return (
  <LoadingData/>

    );
  }

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  return <div>
      <div className="flex gap-3">
          {Placements_Filters.map((each:any,Index:any)=>
        <button
         key={Index}
         onClick={()=>setSearch(each)}
                className={`cursor-pointer px-1 py-1 text-xs flex-1 sm:flex-none sm:min-w-[100px] ${
                  search === each && "border-3"
                } rounded-xl shadow-md font-medium transition-all duration-200 ${
                  filterColors[each]
                }`}
              >
              
        {`${each} (${GetFilterCount(each) || 0})`}

                
              </button>)}
      </div>
    {CurrentUserInterfacevIew()}
    </div>;
};

export default ClientTable;
