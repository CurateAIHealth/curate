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
      <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center bg-white shadow-md rounded-xl px-4 h-[40px] border border-gray-200 focus-within:border-indigo-500 transition w-full sm:w-[220px]">
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
            className="w-full bg-transparent outline-none text-sm text-gray-700"
          />
        </div>

        <select
          value={SearchMonth}
          onChange={(e) => setSearchMonth(e.target.value)}
          className="w-full sm:w-[140px] h-[40px] rounded-xl border border-gray-300 px-3 text-sm bg-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Months</option>
          {[
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
          ].map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <select
          value={SearchYear}
          onChange={(e) => setSearchYear(e.target.value)}
          className="w-full sm:w-[120px] h-[40px] rounded-xl border border-gray-300 px-3 text-sm bg-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Years</option>
          {[2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {ClientsInformation.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-6 h-[60vh] mt-10 rounded-3xl bg-white/60 backdrop-blur-lg border border-gray-200 shadow-2xl p-6 sm:p-12">
          <p className="text-xl sm:text-3xl font-extrabold text-gray-900 text-center">
            ✨ Sorry to Inform You, <span className="text-emerald-600">No Placements Available</span>
          </p>
          <p className="bg-gradient-to-r from-emerald-200 to-teal-200 text-emerald-900 px-6 py-3 rounded-full shadow-lg font-semibold text-sm text-center">
            🔎 Check <span className="font-bold">Terminations</span> for Previous Placements
          </p>
        </div>
      )}

      {ClientsInformation.length > 0 && (
        <div className="w-full overflow-x-auto rounded-2xl shadow-xl">
          <div className="min-w-[1100px]">
            <table className="w-full border-collapse bg-white">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white text-xs font-semibold">
                <tr>
                  <th className="px-3 py-3 text-left">Client Name</th>
                  <th className="px-3 py-3 text-left">Patient Name</th>
                  <th className="px-3 py-3 text-left">Contact</th>
                  <th className="px-3 py-3 text-left">Location</th>
                  <th className="px-3 py-3 text-center">HCA Name</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-left">Replacement</th>
                  <th className="px-3 py-3 text-center">Time Sheet</th>
                  {(isInvoiceDay || enableStatus) && (
                    <th className="px-3 py-3 text-center">Invoice</th>
                  )}
                  <th className="px-3 py-3 text-center">Service Continue</th>
                  <th className="px-3 py-3 text-center">Terminate</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {[...FilterFinelTimeSheet].reverse().map((c, i) => (
                  <tr key={i} className="hover:bg-teal-50/30 transition">
                    <td className="px-3 py-3 font-semibold">{c.name}</td>
                    <td className="px-3 py-3 font-semibold">{c.PatientName}</td>
                    <td className="px-3 py-3">{c.contact}</td>
                    <td className="px-3 py-3">{c.location}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-1 text-[11px] rounded-md border bg-white">
                        🩺 {c.HCA_Name}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-700">Active</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        className="px-3 py-2 text-xs font-semibold text-teal-600 border-2 border-teal-500 rounded-lg hover:bg-teal-50 transition"
                        onClick={() => setShowReassignmentPopUp(!ShowReassignmentPopUp)}
                      >
                        Reassignment
                      </button>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        className="px-3 py-2 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
                        onClick={() => UpdateClient_UserId(c.Client_Id, c.name)}
                      >
                        View
                      </button>
                    </td>
                    {(isInvoiceDay || enableStatus) && (
                      <td className="px-3 py-3 text-center">
                        <button
                          className="px-3 py-2 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
                          onClick={() => {
                            setBillingRecord(c);
                            setShowPaymentModal(true);
                          }}
                        >
                          Generate Bill
                        </button>
                      </td>
                    )}
                    <td className="px-3 py-3 text-center">
                      <button
                        className="px-3 py-2 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
                        onClick={() => UpdatePopup(c)}
                      >
                        Extend
                      </button>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        className="px-3 py-2 rounded-lg hover:bg-gray-100"
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
