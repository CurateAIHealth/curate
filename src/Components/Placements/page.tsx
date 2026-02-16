"use client";
let cachedUsersFullInfo: any;
let cachedDeploymentInfo: any[] | null = null;
let cachedReplacementInfo:any[]
let cachedTermination:any[]


import React, { useEffect, useState } from "react";
import { CalendarCheck2, CircleCheckBig,ChevronsRight , FilePenLine, MapPin, Trash, CircleX,Plus , X } from "lucide-react";
import { DeleteHCAStatus, DeleteHCAStatusInFullInformation, DeleteDeployMent, GetDeploymentInfo, GetRegidterdUsers, GetReplacementInfo, GetTerminationInfo, GetTimeSheetInfo, GetUserInformation, GetUsersFullInfo, InserTerminationData, InserTimeSheet, PostReason, TestInserTimeSheet, UpdateHCAnstatus, UpdateHCAnstatusInFullInformation, UpdateReason, UpdateReplacmentData, UpdateUserContactVerificationstatus, TestInsertTimeSheet, updateServicePrice, InsertDeployment, PostInvoice, GetInvoiceInfo, RemoveClient } from "@/Lib/user.action";
import { useDispatch, useSelector } from "react-redux";
import { UpdateClient, UpdateInvoiceInfo, UpdateMonthFilter, UpdateSubHeading, UpdateUserInformation, UpdateUserType, UpdateYearFilter } from "@/Redux/action";
import TerminationTable from "../Terminations/page";
import { LoadingData } from "../Loading/page";
import PaymentModal from "../PaymentInfoModel/page";
import { filterColors, months, Placements_Filters, years } from "@/Lib/Content";
import ReplacementsTable from "../ReplacementsTable/page";
import { getDaysBetween, getPopularArea, rupeeToNumber, toProperCaseLive } from "@/Lib/Actions";
import { useRouter } from "next/navigation";
import { div } from "framer-motion/client";



type AttendanceStatus = "Present" | "Absent" | "Leave" | "Holiday"|"Not Marked"|"Half Day";
const statusCycle: AttendanceStatus[] = ["Present", "Absent", "Leave", "Holiday","Not Marked","Half Day"];

const parseEnInDate = (dateStr: string) => {
  if (!dateStr || typeof dateStr !== "string") return new Date(NaN);
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};
interface AttendanceData {
  date: string;
  day: string;
  updatedAt: string;
  status: "Present" | "Absent" | "Leave"|"Not Marked";
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
  const [selectedAssignHCP,setselectedAssignHCP]=useState<any>()
  const [selectedClient,setselectedClient]=useState<any>()
  const [isChecking, setIsChecking] = useState(true);
  const [selectedHCP,setselectedHCP]=useState<any>()
  const [selectedCase, setSelectedCase] = useState<any>(null);
const [ReplacementTime,setReplacementTime]=useState("")
const [ReplacementDate,setReplacementDate]=useState("")
  const [UpdatedCareTakerStatus,setUpdatedCareTakerStatus]=useState("")
  const [users, setUsers] = useState<User[]>([]);
  const [Fineldate, setFineldate] = useState({
    date: '', day: "",
    updatedAt: "",
    status: ""
  })
  const [refreshKey, setRefreshKey] = useState(0);

  const [CareTakerName,SetCareTakerName]=useState('')
  const [HCPName,setHCPName]=useState("")
  const [ShowReassignmentPopUp,setShowReassignmentPopUp]=useState(false)
  const [showAssignPopup, setShowAssignPopup] = useState(false);
 const [updatedAttendance, setUpdatedAttendance] = useState<AttendanceState>({});
 const [SaveButton,setSaveButton]=useState(false)
 const [TerminationInfo,SetTerminationInfo]=useState<any>()
const now = new Date();


const SearchMonth=useSelector((state:any)=>state.FilterMonth) 
const SearchYear=useSelector((state:any)=>state.FilterYear) 



const [enableStatus,setenableStatus]=useState(false)
  const [TimeSheet_UserId, setTimeSheet_UserId] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showTimeSheet, setShowTimeSheet] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<any>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showExtendPopup,setshowExtendPopup]=useState(false)
  const [ExtendInfo,setExtendInfo]=useState<any>({})
  const [deleteTargetId, setDeleteTargetId] =  useState<any>();
  const [ActionStatusMessage,SetActionStatusMessage]= useState<any>("");
  const [SearchResult,setSearchResult]=useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
const [lastDateOfMonth, setLastDateOfMonth] = useState("");
const [updateServiceCharge, setUpdateServiceCharge] = useState(false);
const [serviceCharge, setServiceCharge] = useState("");
    const [search, setSearch] = useState("On Service");
  const [billingRecord, setBillingRecord] = useState<any>(null);
const TimeStamp=useSelector((state:any)=>state.TimeStampInfo)
  
  const dispatch = useDispatch();
const router=useRouter()
 const TimeStampInfo = useSelector(
    (state: any) => state.TimeStampInfo
  );
useEffect(() => {
  let mounted = true;

  const fetchData = async (forceFresh = false) => {
    try {
      // 🔹 Use cache only when not forcing fresh data
      if (
        !forceFresh &&
        cachedUsersFullInfo &&
        cachedDeploymentInfo &&
        cachedReplacementInfo &&
        cachedTermination
      ) {
        setUsers([...cachedUsersFullInfo]);
        setClientsInformation([...cachedDeploymentInfo]);
        setReplacementInformation([...cachedReplacementInfo]);
        SetterminationInfo([...cachedTermination]);
        setIsChecking(false);
        return;
      }

      const [
        ,
        usersResult,
        placementInfo,
        replacementInfo,
        terminationInfo,
      ] = await Promise.all([
        GetRegidterdUsers(),
        GetUsersFullInfo(),
        GetDeploymentInfo(),
        GetReplacementInfo(),
        GetTerminationInfo(),
      ]);

      if (!mounted) return;

      cachedUsersFullInfo = usersResult ?? [];
      cachedDeploymentInfo = placementInfo ?? [];
      cachedReplacementInfo = replacementInfo ?? [];
      cachedTermination = terminationInfo ?? [];

      setUsers(cachedUsersFullInfo);
      setClientsInformation(cachedDeploymentInfo);
      setReplacementInformation(cachedReplacementInfo);
      SetterminationInfo(cachedTermination);

      dispatch(UpdateSubHeading("On Service"));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      mounted && setIsChecking(false);
    }
  };

  // 🔥 Always fetch fresh when ActionStatusMessage changes
  fetchData(true);

  return () => {
    mounted = false;
  };
}, [ActionStatusMessage]);



useEffect(() => {
  if (!selectedDate) {
    setLastDateOfMonth("");
    return;
  }

  const d = new Date(selectedDate);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);

  const yyyy = lastDay.getFullYear();
  const mm = String(lastDay.getMonth() + 1).padStart(2, "0");
  const dd = String(lastDay.getDate()).padStart(2, "0");

  setLastDateOfMonth(`${yyyy}-${mm}-${dd}`);
}, [selectedDate]);

const matchesSearchAndMonth = (
  item: any,
  searchText: string,
  searchMonth: string, 
  searchYear: string
) => {
  const search = searchText?.toLowerCase() || "";

  const name = item.name?.toLowerCase() || "";
  const email = item.email?.toLowerCase() || "";
  const contact = item.contact?.toLowerCase() || "";
  const hca = item.HCA_Name?.toLowerCase() || "";

  const matchesSearch =
    !search ||
    name.includes(search) ||
    email.includes(search) ||
    contact.includes(search) ||
    hca.includes(search);

  if (!searchMonth && !searchYear) return matchesSearch;
  if (!item.StartDate) return false;


  const [day, month, year] = item.StartDate.split("/");

  if (!month || !year) return false;

  const monthNumber = Number(month); 

  const matchesMonth =
    !searchMonth || monthNumber === Number(searchMonth);

  const matchesYear =
    !searchYear || Number(year) === Number(searchYear);

  return matchesSearch && matchesMonth && matchesYear;
};


  const ShowDompleteInformation = async (userId: any, ClientName: any) => {
    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      dispatch(UpdateUserType("patient"));
      router.push("/UserInformation");
    }
  };

const GenerateBillPDF=async(Info:any)=>{

const GetInvoiceList=await  GetInvoiceInfo();
const getUserInvoiceInfo = GetInvoiceList?.filter(
  (each: any) =>
    each?.Email === Info?.email ||
    each?.contact === Info?.contact
) || [];

  const selectedInvoice = getUserInvoiceInfo?.[0];

  const ArgumentInfo = {
    ...selectedInvoice,
    StartDate: Info?.StartDate,
  };

  const payloadToDispatch =
    selectedInvoice?.StartDate
      ? selectedInvoice
      : ArgumentInfo;
      console.log('CaretTakerCharge-----',Info)
  const FinelInfo = {
    ...payloadToDispatch,
    CareTakeCharge:Info?.CareTakeChare||Info?.ServiceCharge,
    name: Info?.
      PatientName
  }

  dispatch(UpdateInvoiceInfo(FinelInfo));
  SetActionStatusMessage("")
     router.push("/MailInvoiceTemplate")
}

  const FinelTimeSheet = ClientsInformation.map((each: any) => {
const normalizedAttendance =
  Array.isArray(each.Attendance) && each.Attendance.length > 0
    ? each.Attendance.map((att: any) => {
        const hcp =
          att.HCPAttendence ??
          att.HCPAttendance ??
          att.hcpAttendence ??
          false;

        const admin =
          att.AdminAttendece ??
          att.AdminAttendence ??
          att.AdminAttendance ??
          att.adminAttendence ??
          false;

        let status: "Present" | "Half Day" | "Absent";

        if (hcp === true && admin === true) {
          status = "Present";
        } else if (hcp === true || admin === true) {
          status = "Half Day";
        } else {
          status = "Absent";
        }

        return {
          date: att.AttendenceDate,
          status,
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
    ServiceCharge:each.CareTakerPrice,
    StartDate:each.StartDate,
    EndDate:each.EndDate
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
    CurrentStatus:each.CurrentStatus,
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

  const UpdateAssignHca = async () => {
  try {
   
    if (!selectedClient || !selectedAssignHCP) {
      SetActionStatusMessage("Invalid client or HCA selection.");
      return;
    }

    const {
      Client_Id: clientId,
      name: clientName,
      email: clientEmail,
      contact: clientContact,
      location: address,
      PatientName: patientName,
      Patient_PhoneNumber: patientPhone,
      hcpSource: source,
    } = selectedClient;

    const {
      userId: hcaUserId,
      FirstName: hcaName,
      Contact: hcaContact,
      Type = "HCA",
    } = selectedAssignHCP;

    if (!clientId || !hcaUserId) {
      SetActionStatusMessage("Missing client or HCA ID.");
      return;
    }

    SetActionStatusMessage("Please wait, assigning HCA...");

   
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
    const todayDate = now.toLocaleDateString("en-IN");
    const timestamp = now.toISOString();



    const attendanceRecord = {
      date: todayDate,
      checkIn: now.toLocaleTimeString(),
      status: "Present",
    };

  
    await Promise.all([
      UpdateUserContactVerificationstatus(clientId, "Placed"),
      UpdateHCAnstatus(hcaUserId, "Assigned"),
      UpdateHCAnstatusInFullInformation(hcaUserId),
    ]);

  
    const placementInfo = await GetTimeSheetInfo();
    const invoiceNumber = `BSV${now.getFullYear()}_${(placementInfo?.length || 0) + 1}`;

    // const response = await TestInsertTimeSheet(
    //   todayDate,
    //   lastDateOfMonth,
    //   "Active",
    //   address,
    //   clientContact,
    //   clientName,
    //   patientName,
    //   patientPhone,
    //   source,
    //   hcaUserId,
    //   clientId,
    //   hcaName,
    //   hcaContact,
    //   "Google",
    //   "Not Provided",
    //   "PP",
    //   "21000",
    //   "700",
    //   "1800",
    //   "900",
    //   currentMonth,
    //   ["P"],
    //   timestamp,
    //   invoiceNumber,
    //   Type
    // );
const StarteDate=new Date().toLocaleDateString("en-In")
    const lastDateOfMonthCurrent = new Date(
  now.getFullYear(),
  now.getMonth() + 1,
  0
);

const LastDate = lastDateOfMonthCurrent.toLocaleDateString("en-IN");

   const attendance = [
        {
          AttendenceDate: today,
          HCPAttendence: true,
          AdminAttendece: true,
        },
      ];
      const ClientAttendece = [
        {
          AttendenceDate: today,
          AttendeceStatus: "Present"
        }
      ]
  const GetInfo=await  GetUserInformation(selectedClient.Client_Id)
const SelectedCareTakerCharges=GetInfo.serviceCharges
   
     const deploymentRes = await InsertDeployment(
        StarteDate,
        LastDate,
        "Active",
        selectedClient.Address,
        selectedClient.contact,
        selectedClient.name,
        selectedClient.PatientName,
        selectedClient.Patient_PhoneNumber,
        selectedClient.RreferralName,
        selectedAssignHCP.userId,
        selectedClient.Client_Id,
        selectedAssignHCP.FirstName,
        selectedAssignHCP.Contact,
        "Google",
        "Not Provided",
        "PP",
        "21000",
        "700",
        "1800",
        SelectedCareTakerCharges,
        currentMonth,
        attendance,
        TimeStampInfo,
        ExtendInfo.invoice,
        ExtendInfo.Type,
        SelectedCareTakerCharges,
        ClientAttendece
      );

    if (!deploymentRes?.success) {
      throw new Error(deploymentRes?.message || "Failed to assign HCA.");
    }

    SetActionStatusMessage("Additional HCP Assigned Successfully");

    // Optional navigation / refresh (enable if needed)
    // dispatch(UpdateRefresh(1));
    // router.push("/PDRView");
    // dispatch(Update_Main_Filter_Status("Deployment"));

  } catch (error: any) {
    console.error("UpdateAssignHca Error:", error);
    SetActionStatusMessage(
      error?.message || "Something went wrong while assigning HCA."
    );
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

  const ExtendTimeSheet = async () => {
SetActionStatusMessage("Please Wait Working On Time Sheet Extention")

    // const PostTimeSheet: any = await TestInserTimeSheet(DateofToday, LastDateOfMonth, ExtendInfo.Status, ExtendInfo.Address, ExtendInfo.contact, ExtendInfo.name, ExtendInfo.PatientName, ExtendInfo.Patient_PhoneNumber, ExtendInfo.RreferralName, ExtendInfo.HCA_Id, ExtendInfo.Client_Id, ExtendInfo.HCA_Name, ExtendInfo.HCAContact, ExtendInfo.
    //   hcpSource, ExtendInfo.provider, ExtendInfo.payTerms, ExtendInfo.cTotal, ExtendInfo.cPay, ExtendInfo.hcpTotal, ExtendInfo.hcpPay, CurrentMonth, ["P"], TimeStamp, ExtendInfo.invoice, ExtendInfo.Type)
    
    const GetInfo=await  GetUserInformation(ExtendInfo.Client_Id)

    const StarteDate=new Date(selectedDate).toLocaleDateString("en-In")
    const LastDate=new Date(lastDateOfMonth).toLocaleDateString("en-In")
    const currentMonth = `${new Date(selectedDate).getFullYear()}-${new Date(selectedDate).getMonth() + 1}`;
    const CareTakerCharges=serviceCharge?serviceCharge:GetInfo.serviceCharges
   if(serviceCharge){
     const { success } = await updateServicePrice(
  ExtendInfo.Client_Id,
serviceCharge
);
   }
      const attendance = [
        {
          AttendenceDate: today,
          HCPAttendence: true,
          AdminAttendece: true,
        },
      ];
      const ClientAttendece = [
        {
          AttendenceDate: today,
          AttendeceStatus: "Present"
        }
      ]
      console.log('Check for Tha Datata-----',ExtendInfo)
 const deploymentRes = await InsertDeployment(
        StarteDate,
        LastDate,
        "Active",
        ExtendInfo.Address,
        ExtendInfo.contact,
        ExtendInfo.name,
        ExtendInfo.PatientName,
        ExtendInfo.Patient_PhoneNumber,
        ExtendInfo.RreferralName,
        ExtendInfo.HCA_Id,
        ExtendInfo.Client_Id,
        ExtendInfo.HCA_Name,
        ExtendInfo.HCAContact,
        "Google",
        "Not Provided",
        "PP",
        "21000",
        "700",
        "1800",
        CareTakerCharges,
        currentMonth,
        attendance,
        TimeStampInfo,
         ExtendInfo.invoice,
        ExtendInfo.Type,
        CareTakerCharges,
        ClientAttendece
      );
  
if (deploymentRes.success) {
  SetActionStatusMessage("TimeSheet Successfully Extended");

  setTimeout(() => {
    setshowExtendPopup(false);
    setSelectedDate("");
    SetActionStatusMessage('')
  }, 2000);
}

    
  }
  const HCA_List = Finel.filter((each: any) => {
  const typeMatch =
    ["healthcare-assistant", "HCA", "HCP", "HCPT"].includes(each.userType);

  const isNotAssigned =
    !each.Status?.some((s: string) => s === "Assigned");

  const isValidCurrentStatus =
    !["Sick", "Leave", "Terminated"].includes(each.CurrentStatus);

  return typeMatch && isNotAssigned && isValidCurrentStatus;
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

  const handleDeleteClick = (Info: any,Name:any) => {
    SetTerminationInfo(Info)
SetCareTakerName(Name)
    setShowDeletePopup(true);
  };

const HandleRemove=async(Info: any,Name:any)=>{
  try{

    
const RemoeClientFromDeploy=await RemoveClient(Info.Client_Id)
if(RemoeClientFromDeploy.success){
  SetActionStatusMessage(RemoeClientFromDeploy.message)
  setRefreshKey(1)
}
  }catch(err:any){

  }
}

const confirmDelete = async (selectedReason: string) => {
  if (!TerminationInfo) {
    SetActionStatusMessage("Unable to delete. Required information is missing.");
    return;
  }

  try {
    SetActionStatusMessage("Please wait, deleting placement...");

    await UpdateHCAnstatus(
      TerminationInfo.HCA_Id,
      UpdatedCareTakerStatus
    );

 
    await UpdateUserContactVerificationstatus(
      TerminationInfo.Client_Id,
      "Lost"
    );


    const deleteTimeSheetResponse = await DeleteDeployMent(
      TerminationInfo.Client_Id
    );

  
    await PostReason(
      TerminationInfo.HCA_Id,
      TerminationInfo.Client_Id,
      selectedReason,
      otherReason,
         ReplacementDate,
      ReplacementTime,
    );

 
    await InserTerminationData(
      TerminationInfo.Client_Id,
      TerminationInfo.HCA_Id,
      TerminationInfo.HCA_Name,
      TerminationInfo.name,
      TerminationInfo.email,
      TerminationInfo.contact,
      TerminationInfo.location,
      TerminationInfo.HCAContact,
      TerminationInfo.TimeSheet
    );

   if (deleteTimeSheetResponse?.success) {
  SetActionStatusMessage("Placement deleted successfully.");

  setTimeout(() => {
    setShowDeletePopup(false);
  }, 400);
}
 else {
      SetActionStatusMessage(
        "Placement deleted, but some records could not be removed completely."
      );
    }
  } catch (error) {
    console.error("Error while deleting placement:", error);
    SetActionStatusMessage(
      "Something went wrong while deleting the placement. Please try again."
    );
  } finally {
    setShowDeletePopup(false);
    setDeleteTargetId(null);
  }
};



const FilterFinelTimeSheet = FinelTimeSheet.filter((item) =>
  matchesSearchAndMonth(
    item,
    SearchResult,
    SearchMonth,
    SearchYear
  )
);

console.log("Check for ----",FinelTimeSheet)
const today:any = new Date().getDate();
const isInvoiceDay = [ 28, 29, 30, 31].includes(today);
console.log("Test Today------",isInvoiceDay

)



const UpdateReplacement = async (
  Available_HCP: any,
  Exsting_HCP: any
) => {

  try {
    SetActionStatusMessage("Please wait...");

  
    if (!Available_HCP?.userId || !Exsting_HCP?.HCA_Id) {
      SetActionStatusMessage("Invalid HCP information.");
      return;
    }

    const localValue = localStorage.getItem("UserId");
    if (!localValue) {
      SetActionStatusMessage("User session expired. Please login again.");
      return;
    }


    const Sign_in_UserInfo: any = await GetUserInformation(localValue);
    if (!Sign_in_UserInfo) {
      SetActionStatusMessage("Unable to fetch user details.");
      return;
    }

   
    const postReasonRes = await UpdateReason(
      Available_HCP.userId,
      Exsting_HCP.HCA_Id,
      selectedReason,
      otherReason,
       ReplacementDate,
      ReplacementTime,
    );

    if (!postReasonRes?.success) {
      SetActionStatusMessage("Failed to update replacement reason.");
      return;
    }

 
    const TimeStampData = `${Sign_in_UserInfo.FirstName} ${Sign_in_UserInfo.LastName}, Email: ${Sign_in_UserInfo.Email}`;

    const UpdateReplacmentInfo = await UpdateReplacmentData(
      Available_HCP,
      Exsting_HCP,
      TimeStampData,
      ReplacementDate,
      ReplacementTime,
    );

    if (!UpdateReplacmentInfo?.success) {
      SetActionStatusMessage("Replacement update failed.");
      return;
    }

  
    await Promise.all([
      UpdateHCAnstatus(Exsting_HCP.HCA_Id, UpdatedCareTakerStatus),
      UpdateHCAnstatusInFullInformation(Available_HCP.userId),
    ]);

  const reove=await DeleteHCAStatus(Exsting_HCP.HCA_Id)


    SetActionStatusMessage("Replacement updated successfully.");
      setTimeout(() => {
    setShowReassignmentPopUp(!ShowReassignmentPopUp)
  }, 400);

   
  } catch (err: any) {
    console.error("UpdateReplacement Error:", err);
    SetActionStatusMessage("Something went wrong. Please try again.");
  }

  
};



const UpdateServiceCharge=async(A:any)=>{
  SetActionStatusMessage("Please Wait...")
const GetInfo=await  GetUserInformation(A)
console.log('Check for Informatio-----',GetInfo.serviceCharges)
const { success } = await updateServicePrice(
  A,
GetInfo.serviceCharges
);

if (success) {
 SetActionStatusMessage("Price updated successfully,Refresh To Get Updated Price");
} else {
SetActionStatusMessage("Update failed");
}

}


const OmServiceView = () => {
    return (
      <div className="w-full flex flex-col gap-8 p-2 bg-gray-50">
       
    
           
        <div className="flex itemcs-center gap-2 justify-end">
    
{ActionStatusMessage && (
  <p
    className={`mt-3 text-center text-sm font-medium ${
      ActionStatusMessage .includes("Sucessfull") 
        ? "text-green-700"
        : "text-gray-700"
    }`}
  >
    {ActionStatusMessage}
  </p>
)}
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
      onChange={(e) => dispatch(UpdateMonthFilter(e.target.value))}
      className="
        w-full h-[44px] rounded-xl
        border border-gray-300
        px-4 text-sm bg-white text-gray-800
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        focus:border-transparent transition-all
      "
    >
      <option value="">All Months</option>
      {[...Array(12)].map((_, i) => (
            <option key={i} value={`${i + 1}`}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
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
       onChange={(e) => dispatch(UpdateYearFilter(e.target.value))}
      className="
        w-full rounded-xl border border-gray-300
        px-4 py-3 text-sm bg-white text-gray-800
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        focus:border-transparent transition-all
      "
    >
      <option value="">All Years</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>
    <button
      onClick={() => setenableStatus(!enableStatus)}
      className="
        px-5 py-2.5 text-xs font-semibold
        bg-gradient-to-r from-teal-600 to-emerald-500
        hover:from-teal-700 hover:to-emerald-600
        text-white rounded-xl shadow-md
        transition whitespace-nowrap cursor-pointer
        w-fit sm:w-auto
      "
    >
      {enableStatus ? "Disable Generate Bill" : "Enable Generate Bill"}
    </button>
  </div>
  {/* {showPaymentModal && billingRecord && (
  <PaymentModal
    record={billingRecord}
    onClose={() => {
      setShowPaymentModal(false);
      setBillingRecord(null);
    }}
    onConfirm={(billingResult: any) => {
      console.log("Saving billing:", billingResult);
    }}
  />
)} */}

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
    
  
  <thead className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white  text-[10px] font-semibold">
  <tr>
    <th className="w-10 px-2 py-2 text-left">S.No</th>

    <th className="min-w-[90px] max-w-[140px] px-2 py-2 text-left truncate">
      Client Name
    </th>

    <th className="w-[90px] px-2 py-2 text-left">
      Start Date
    </th>

    <th className="w-[90px] px-2 py-2 text-left">
      End Date
    </th>

    <th className="w-[120px] px-2 py-2 text-left">
      Service Charge
    </th>

    <th className="min-w-[120px] max-w-[150px] px-2 py-2 text-left truncate">
      Patient Name
    </th>

    <th className="w-[120px] px-2 py-2 text-left">
      Contact
    </th>

    <th className="min-w-[100px] max-w-[140px] px-2 py-2 text-left truncate">
      Location
    </th>

    <th className="min-w-[120px] max-w-[150px] px-2 py-2 text-left truncate">
      HCP Name
    </th>

    <th className="w-[90px] px-2 py-2 text-center">
      Status
    </th>

    <th className="w-[110px] px-2 py-2 text-center">
      Replacement
    </th>

    <th className="w-[80px] px-2 py-2 text-center">
      Time Sheet
    </th>

    {(isInvoiceDay || enableStatus) && (
      <th className="w-[80px] px-2 py-2 text-center">
        Invoice
      </th>
    )}

    <th className="w-[120px] px-2 py-2 text-center">
      Service Continue
    </th>

    <th className="w-[70px] px-2 py-2 text-center">
      Add HCP
    </th>

    <th className="w-[70px] px-2 py-2 text-center">
      Terminate
    </th>
      <th className="w-[70px] px-2 py-2 text-center">
      Remove
    </th>
  </tr>
</thead>



   
    <tbody className="bg-white divide-y divide-gray-200">
      {[...FilterFinelTimeSheet].reverse().map((c, i) => 
        
     {
         const [, month, year] = c.StartDate.split("/").map(Number);

const monthIndex = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
].indexOf(SearchMonth) + 1;

const isMatch = Number(month) === Number( new Date().getMonth() + 1) && Number(year) ===Number(now.getFullYear());


      return(
          <tr key={i} className="hover:bg-teal-50/30 transition-all">
           <td className="px-3 py-3 font-semibold text-xs text-gray-900 break-words">
           {i+1}
          </td>
          <td className="px-3 py-3 font-semibold text-xs text-gray-900 break-words">
            {toProperCaseLive(c.name)}
          </td>
{/* <td className="px-3 py-3 text-gray-700 text-xs">
  {!c?.ServiceCharge ? (
    <span className="text-red-600 font-medium">
      Care Taker Charge Missing
    </span>
  ) : (
    <div className="flex flex-col leading-tight">
      <span>
        ₹{(
          getDaysBetween(c.StartDate, c.EndDate) *
          rupeeToNumber(c.ServiceCharge)
        ).toFixed(2)}{" "}
        <span className="text-gray-500">/ Month</span>
      </span>

      <span>
        ₹{rupeeToNumber(c.ServiceCharge).toFixed(2)}{" "}
        <span className="text-gray-500">/ Day</span>
      </span>
    </div>
  )}
</td> */}
    <td className="px-3 py-3 font-semibold text-xs text-gray-900 break-words">
            {c.StartDate}
          </td>   
          <td className="px-3 py-3 font-semibold text-xs text-gray-900 break-words">
            {c.EndDate}
          </td>
<td className="px-3 py-3 text-gray-700 text-xs">
  {!c?.ServiceCharge ? (
    <div className="flex flex-col items-center gap-2">
      <span className="text-red-600 text-[9px] whitespace-nowrap">
        Care Taker Charge Missing
      </span>

      <button
   onClick={()=>UpdateServiceCharge(c.Client_Id)}
        className="px-2 py-0.5 text-[9px] font-semibold
                   text-white bg-blue-600 hover:bg-blue-700 cursor-pointer
                   rounded-md"
      >
        Get Price
      </button>
    </div>
  ) : (
    <div className="flex flex-col leading-tight">
      <span>
        ₹{(
          getDaysBetween(c.StartDate, c.EndDate) *
          rupeeToNumber(c.ServiceCharge)
        ).toFixed(2)}{" "}
        <span className="text-gray-500">/M</span>
      </span>

      <span>
        ₹{rupeeToNumber(c.ServiceCharge).toFixed(2)}{" "}
        <span className="text-gray-500">/D</span>
      </span>
    </div>
  )}
</td>


          <td className="px-1 py-1 font-semibold text-[11px] text-gray-900 ">
            {toProperCaseLive(c.PatientName)}
          </td>

          <td className="px-3 py-3 text-gray-700  text-xs break-words">
            {c.contact}
          </td>

       <td className="px-1 py-3 text-gray-900 font-semibold text-[11px] flex items-center gap-1">
  <MapPin size={14} className="text-green-600 shrink-0" />
  {getPopularArea(c.location)}
</td>




 <td
  className="px-3 py-3 max-w-[140px]"
  onClick={() => ShowDompleteInformation(c.HCA_Id, c.HCA_Name)}
>
  <span
    className="
      inline-flex
      items-start
      gap-1
      px-1 py-1
      text-[10px]
      font-medium
      rounded-md
      bg-white
      cursor-pointer
      hover:text-blue-800
    "
  >
    🩺
    <span className="hover:underline font-semibold line-clamp-2 break-words leading-tight">
      {toProperCaseLive(c.HCA_Name)}
    </span>
  </span>
</td>




          <td className="px-1 pl-4 py-3 break-words">
            <div className="flex items-center gap-2 rounded-full bg-green-100 p-1">
              <CircleCheckBig className="w-3 h-3 text-emerald-600" />
              <p className="text-xs font-medium text-emerald-700">Active</p>
            </div>
          </td>

          <td className="px-3 py-3 break-words">
         <button
  className="
    px-1 py-1
    text-[9px] font-semibold
    text-teal-600
    border-1 border-teal-500
    rounded-lg
    shadow-[0_0_0_0_rgba(20,184,166,0.5)]
    transition-all duration-300
    hover:shadow-[0_0_12px_2px_rgba(20,184,166,0.6)]
    bg-teal-150
    active:scale-95 
    cursor-pointer
  "
  onClick={()=>{setShowReassignmentPopUp(!ShowReassignmentPopUp),SetCareTakerName(toProperCaseLive(c.HCA_Name)),setselectedHCP(null),setSelectedCase(c)}}
>
  Reassignment
</button>

{ShowReassignmentPopUp && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center "
    onClick={() => setShowReassignmentPopUp(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="
      flex
      flex-col
        relative
        w-[500px]
        rounded-2xl
        bg-white/80
        border border-white/60
        overflow-hidden
      "
    >
    
      <button
        onClick={() => setShowReassignmentPopUp(false)}
        className="ml-auto absolute cursor-pointer top-4 right-4  text-gray-900 hover:text-gray-800 transition"
      >
        ✕
      </button>


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

          <img
            src="/Icons/Curate-logoq.png"
            className="h-8"
            alt="Company Logo"
          />
        </div>

  
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reason for Replacement
          </label>

          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="
              w-full rounded-xl bg-white/90 border border-gray-300
              px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-400
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
              w-full rounded-xl bg-white/90 border border-gray-300
              px-4 py-2.5 text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
          />
        )}

 {selectedReason &&
          (selectedReason !== "Other" || otherReason) && (
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">
      Replacement Date
    </label>
    <input
      type="date"
      onChange={(e)=>setReplacementDate(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
    />
  </div>

  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">
      Replacement Time
    </label>
    <input
      type="time"
      onChange={(e)=>setReplacementTime(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
    />
  </div>
</div>
          )}

        {selectedReason &&
          (selectedReason !== "Other" || otherReason) && (
            <div>
              <select
  className="w-full p-2 text-sm border rounded-lg cursor-pointer text-center"
   value={selectedHCP?.userId || ""}
  onChange={(e) => {
    const selected = HCA_List.find(
      (hca) => hca.userId === e.target.value
    );
    setselectedHCP(selected);
  }}
>
  <option value="">Assign New HCA</option>

  {HCA_List.map((each) => (
    <option key={each.id} value={each.userId}>
      {each.FirstName}
    </option>
  ))}
</select>


              <select
                className={`
                  w-full p-2 text-sm border rounded-lg cursor-pointer text-center mt-2
                  ${
                    UpdatedCareTakerStatus === "Available"
                      ? "bg-green-100 border-green-300 text-green-800"
                      : UpdatedCareTakerStatus === "Sick"
                      ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                      : UpdatedCareTakerStatus === "Leave"
                      ? "bg-blue-100 border-blue-300 text-blue-800"
                      : UpdatedCareTakerStatus === "Terminated"
                      ? "bg-red-100 border-red-300 text-red-800"
                      : "bg-gray-100 border-gray-300 text-gray-800"
                  }
                `}
                value={UpdatedCareTakerStatus || ""}
                onChange={(e) => setUpdatedCareTakerStatus(e.target.value)}
              >
                <option>
            Manage {CareTakerName} Status
                </option>
                <option value="Active">🟢 Active</option>
                <option value="Available">🟢 Available for Work</option>
                <option value="Sick">🟡 Sick</option>
                <option value="Leave">🔵 Leave</option>
                <option value="Bench">🟣 Bench</option>
                <option value="None">⚪ None</option>
                <option value="Terminated">🔴 Terminated</option>
              </select>
            </div>
          )}

        {ActionStatusMessage && (
  <p
    className={`mt-3 text-center text-sm font-medium ${
      ActionStatusMessage .includes(" Sucessfull") 
        ? "text-green-700"
        : "text-gray-700"
    }`}
  >
    {ActionStatusMessage}
  </p>
)}

        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={() => setShowReassignmentPopUp(false)}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => UpdateReplacement(selectedHCP, selectedCase)}
            disabled={
              !(
               selectedHCP&& selectedReason &&
                (selectedReason !== "Other" || otherReason)
              )
            }
            className={`
              inline-flex items-center justify-center
              px-7 py-3 text-sm font-semibold rounded-full transition-all
              ${
                selectedHCP&&selectedReason &&
                (selectedReason !== "Other" || otherReason)
                  ? "text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:scale-95"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Confirm Replacement
          </button>
        </div>
      </div>
    </div>
  </div>
)}

          
          </td>

          <td className="px-3 py-3 text-center break-words">
            <button
              className="px-4 cursor-pointer py-2 text-xs font-medium hover:bg-gray-100 hover:rounded-full  text-white "
              onClick={() => UpdateClient_UserId(c.Client_Id, c.name)}
            >
             <CalendarCheck2 size={19} className="text-teal-600"/>
            </button>
          </td>

          {(isInvoiceDay || enableStatus) && (
           <td className="px-3 py-3 text-center">
  <button
    className="inline-block px-1 py-2 text-[9px] hover:bg-gray-100 hover:rounded-full font-medium cursor-pointer  text-white"
    onClick={() => {
      SetActionStatusMessage("Please Wait......")
      GenerateBillPDF(c)
    }}
  >
<FilePenLine  size={19} className="text-teal-600" />
  </button>
</td>

          )}

  

<td className="px-3 py-3 text-center break-words">
  {isMatch ? (
    <p className="inline-flex items-center justify-center px-1 py-1 
              text-[10px] 
              font-medium text-emerald-700 
              bg-emerald-50 border border-emerald-200 
              rounded-full whitespace-nowrap">
  Already On Service
</p>

  ) : (
    <button
      className="px-4 py-2 text-xs font-medium hover:bg-gray-100 hover:rounded-full"
     onClick={() =>{ UpdatePopup(c),setSelectedDate("")}}
    >
      <ChevronsRight size={22} className="text-teal-600"/>
    </button>
  )}

   {/* <button
      className="px-4 py-2 text-xs font-medium hover:bg-gray-100 hover:rounded-full"
      onClick={() =>{ UpdatePopup(c),setSelectedDate("")}}
    >
  <ChevronsRight size={22} className="text-teal-600"/>
    </button> */}
</td>

 <td     className="inline-block px-1 ml-4 cursor-pointer py-2 text-[10px] mt-4 hover:bg-gray-100 hover:rounded-full font-medium cursor-pointer ">
            <button
            className="cursor-pointer"
             onClick={() => {setShowAssignPopup(true),setselectedClient(c),setselectedAssignHCP(null)}}
            >
       <Plus size={19} className="h-5 w-5 text-center text-teal-600"/>
            </button>
          </td>
          <td className="px-3 py-3 text-center break-words">
            <button
            
              className="px-3 py-2 text-xs font-medium cursor-pointer rounded-lg hover:rounded-full hover:bg-gray-100"
              onClick={() => handleDeleteClick(c,c.HCA_Name)}
            >
              <Trash />
            </button>
          </td>
               <td className="px-3 py-3 text-center break-words">
            <button
            
              className="px-3 py-2 text-xs font-medium cursor-pointer rounded-lg hover:rounded-full hover:bg-gray-100"
              onClick={() => HandleRemove(c,c.HCA_Name)}
            >
              <CircleX size={22} className="text-red-600" />

            </button>
          </td>
 
        </tr>
      )
     }
      )}
    </tbody>

  </table>
</div>


  
  )}
 {showAssignPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    
  
    <div className="relative w-[460px] rounded-lg bg-white border border-gray-200 shadow-lg">
      
     
      <button
        onClick={() => setShowAssignPopup(false)}
        className="absolute top-2 cursor-pointer right-4 text-gray-400 hover:text-gray-600
                   text-lg leading-none"
        aria-label="Close"
      >
        ×
      </button>

    
      <div className="px-6 py-4 border-b">
        <div className="flex w-full items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Assign Additional  HCP general professionals
            </h2>
            <p className="text-xs text-gray-500">
           Select a healthcare professional to assign
            </p>
          </div>

          <img
            src="/Icons/Curate-logoq.png"
            alt="Curate Logo"
            className="h-7"
          />
        </div>
      </div>

    
      <div className="px-6 py-5 space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          HCA Name
        </label>

        <select
          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md bg-white
                     focus:outline-none focus:ring-1 focus:ring-emerald-600
                     focus:border-emerald-600"
          value={selectedHCP?.userId || ""}
        onChange={(e) => {
    const selected:any = HCA_List.find(
      (hca) => hca.userId === e.target.value
    );
  
    setselectedAssignHCP(selected);
  }}
>
  <option value="">Assign New HCA</option>

  {HCA_List.map((each) => (
    <option key={each.id} value={each.userId}>
      {each.FirstName}
    </option>
  ))}
        </select>

        {selectedAssignHCP && (
          <div className="text-xs text-gray-600">
            Selected:{" "}
            <span className="font-medium text-gray-900">
              {selectedAssignHCP.FirstName}
            </span>
          </div>
        )}
      </div>
    
{ActionStatusMessage && (
  <p
    className={`mt-3 text-center text-sm font-medium ${
      ActionStatusMessage === "Replacement Updated Sucessfull"|| ActionStatusMessage === "Placement deleted successfully."||ActionStatusMessage ===  "HCA Assigned Successfully, For More Information Check in Deployments"
        ? "text-green-700"
        : "text-gray-700"
    }`}
  >
    {ActionStatusMessage}
  </p>
)}
    
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
        <button
          onClick={() => setShowAssignPopup(false)}
          className="px-4 py-2 text-sm border rounded-md
                     text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
        onClick={UpdateAssignHca}
          disabled={!selectedAssignHCP}
          className={`px-4 py-2 text-sm rounded-md text-white
            ${
              selectedAssignHCP
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          Assign HCA
        </button>
      </div>

    </div>
  </div>
)}


{showExtendPopup && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-[360px] p-6 border border-gray-200">

     <div className="flex items-center justify-between">
       <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Extend Service
      </h2>

      <X size={15} className="mb-10 cursor-pointer" onClick={()=>setshowExtendPopup(false)}/>
      </div>

  
      <div className="mb-4">
        <label className="text-sm text-gray-600 mb-1 block">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>

    
      {lastDateOfMonth && (
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            Last Date of Service
          </label>
          <input
            type="date"
            value={lastDateOfMonth}
            readOnly
            className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100"
          />
        </div>
      )}

   
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={updateServiceCharge}
          onChange={(e) => setUpdateServiceCharge(e.target.checked)}
          className="w-4 h-4 accent-green-600"
        />
        <span className="text-sm text-gray-700">
          Update Service Charge
        </span>
      </div>


      {updateServiceCharge && (
        <div className="mb-4">
          <input
            type="number"
            placeholder="Enter service charge"
            value={serviceCharge}
            onChange={(e) => setServiceCharge(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      )}

      <div className="border-t border-gray-200 my-4"></div>

     
     {selectedDate&& <div className="flex justify-center gap-4">
        <button
          onClick={() => setshowExtendPopup(false)}
          className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          No
        </button>
        <button
          onClick={ExtendTimeSheet}
          className="px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700"
        >
          Yes
        </button>
      </div>}
  <p
  className={`text-[9px] mt-1 text-center ${
    ActionStatusMessage?.includes("TimeSheet Successfully Extended")
      ? "text-green-600"
      : "text-red-600 font-bold"
  }`}
>
  {ActionStatusMessage}
</p>
    </div>
  </div>
)}

 {showDeletePopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] p-7 border border-gray-200">
      
     
      <button
        onClick={() => setShowDeletePopup(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition cursor-pointer"
        aria-label="Close"
      >
        ✕
      </button>

     
      <div className="text-center mb-6 flex flex-col items-center gap-2">
        <img
          src="/Icons/Curate-logoq.png"
          alt="Company Logo"
          className="h-10 w-auto object-contain"
        />

        <h2 className="text-xl font-bold text-gray-800">
          Request Termination
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Please select a reason for requesting a Termination
        </p>
      </div>

   
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700">
          Reason for Termination
        </label>

        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className="
            w-full rounded-xl border border-gray-300
            px-4 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-teal-500
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

        {selectedReason === "Other" && (
          <textarea
            rows={3}
            placeholder="Please specify the reason"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            className="
              w-full rounded-xl border border-gray-300
              px-4 py-2.5 text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-teal-500
            "
          />
        )}
      </div>
 {selectedReason &&
          (selectedReason !== "Other" || otherReason) && (
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">
      Termination Date
    </label>
    <input
      type="date"
      onChange={(e)=>setReplacementDate(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
    />
  </div>

  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">
      Termination Time
    </label>
    <input
      type="time"
      onChange={(e)=>setReplacementTime(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
    />
  </div>
</div>
          )}

   
      {selectedReason && (selectedReason !== "Other" || otherReason) && (
        <div className="mt-4">
          <select
            className={`w-full p-2 text-sm border rounded-lg cursor-pointer text-center
              ${
                UpdatedCareTakerStatus === "Available"
                  ? "bg-green-100 border-green-300 text-green-800"
                  : UpdatedCareTakerStatus === "Sick"
                  ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                  : UpdatedCareTakerStatus === "Leave"
                  ? "bg-blue-100 border-blue-300 text-blue-800"
                  : UpdatedCareTakerStatus === "Terminated"
                  ? "bg-red-100 border-red-300 text-red-800"
                  : "bg-gray-100 border-gray-300 text-gray-800"
              }
            `}
            value={UpdatedCareTakerStatus || ""}
            onChange={(e) => setUpdatedCareTakerStatus(e.target.value)}
          >
            <option>
              Manage {toProperCaseLive(CareTakerName)} Status
            </option>
            <option value="Active">🟢 Active</option>
            <option value="Available">🟢 Available for Work</option>
            <option value="Sick">🟡 Sick</option>
            <option value="Leave">🔵 Leave</option>
            <option value="Bench">🟣 Bench</option>
            <option value="None">⚪ None</option>
            <option value="Terminated">🔴 Terminated</option>
          </select>
        </div>
      )}
 {ActionStatusMessage && (
  <p
    className={`mt-3 text-center text-sm font-medium ${
      ActionStatusMessage === "Replacement Updated Sucessfull"|| ActionStatusMessage === "Placement deleted successfully."
        ? "text-green-700"
        : "text-gray-700"
    }`}
  >
    {ActionStatusMessage}
  </p>
)}
 
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => setShowDeletePopup(false)}
          className="
            px-5 py-2.5 text-sm font-medium
            text-gray-700 bg-gray-100 rounded-xl
            hover:bg-gray-200 transition
          "
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={!selectedReason}
          className="
            px-5 py-2.5 text-sm font-semibold
            text-white bg-teal-600 rounded-xl shadow-md
            hover:bg-teal-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
          "
        >
          Confirm Termination
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

      
const isHalfDay =
  record?.HCPAttendence === true ||
  record?.AdminAttendece === true;

const currentStatus:any =
  updatedAttendance?.[day]?.status ??
  (isHalfDay ? "Half Day" : record?.status) ??
  "Not Marked";



       const statusColor =
  currentStatus === "Present"
    ? "bg-green-100 text-green-700 border-green-300"
    : currentStatus === "Absent"
    ? "bg-red-100 text-red-700 border-red-300"
    : currentStatus === "Leave"
    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
    : currentStatus === "Half Day"
    ? "bg-blue-100 text-blue-700 border-blue-300"
    : "bg-gray-100 text-gray-500 border-gray-300"; 



          
          const handleStatusClick = (day:any) => {
            if (isFuture) return;

            setSaveButton(true);

            setUpdatedAttendance((prev) => {
             const current: AttendanceStatus =
  prev?.[day]?.status ??
  record?.status ??
  "Not Marked";


             const nextStatus: AttendanceStatus =
  current === "Not Marked"
    ? "Present"
    : current === "Present"
    ? "Leave"
    : current === "Leave"
    ? "Absent"
    : "Present";



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
              // onClick={() => handleStatusClick(day)}
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



const monthMap: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const parseDate = (date?: string): Date | null => {
  if (!date) return null;
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const getMiddleMonth = (item: any): number | null => {
  if (item.StartDate && item.EndDate) {
    const start = parseDate(item.StartDate);
    const end = parseDate(item.EndDate);
    if (start && end) {
      const middleTime =
        start.getTime() + (end.getTime() - start.getTime()) / 2;
      return new Date(middleTime).getMonth() + 1;
    }
  }

  if (Array.isArray(item.Attendance) && item.Attendance.length > 0) {
    const dates = item.Attendance
      .map((a: any) => parseDate(a.AttendenceDate))
      .filter(Boolean) as Date[];

    if (dates.length > 0) {
      dates.sort((a, b) => a.getTime() - b.getTime());
      const middleIndex = Math.floor(dates.length / 2);
      return dates[middleIndex].getMonth() + 1;
    }
  }

  const single =
    parseDate(item.StartDate) ||
    parseDate(item.AttendenceDate);

  return single ? single.getMonth() + 1 : null;
};

const searchMonthNumber = monthMap[SearchMonth];

const count =
  cachedDeploymentInfo?.filter(
    (each) => getMiddleMonth(each) === searchMonthNumber
  ).length ?? 0;

const Terminationcount =
  cachedTermination?.filter(
    (each) => getMiddleMonth(each) === searchMonthNumber
  ).length ?? 0;

  const ReplasementCount=
  cachedReplacementInfo?.filter(
    (each) => getMiddleMonth(each) === searchMonthNumber
  ).length ?? 0;

const onServiceCount = FinelTimeSheet.filter((item) =>
  matchesSearchAndMonth(
    item,
    SearchResult,
    SearchMonth,
    SearchYear
  )
).length;

const GetFilterCount = (type: string) => {
  switch (type) {
    case "On Service":
      return onServiceCount;
    case "Termination":
      return terminationInfo.filter(item =>
        matchesSearchAndMonth(item, "", SearchMonth, SearchYear)
      ).length;
    case "Replacements":
      return ReplacementInformation.filter(item =>
        matchesSearchAndMonth(item, "", SearchMonth, SearchYear)
      ).length;
    default:
      return 0;
  }
};

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

function Th({ children, className = "" }: any) {
  return <th className={`px-3 py-2 whitespace-nowrap ${className}`}>{children}</th>;
}

function Td({ children, className = "" }: any) {
  return <td className={`px-3 py-2 whitespace-nowrap ${className}`}>{children}</td>;
}

export default ClientTable;
