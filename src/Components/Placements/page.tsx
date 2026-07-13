"use client";
let cachedUsersFullInfo: any[] = [];
let cachedDeploymentInfo: any[] = [];
let cachedReplacementInfo: any[] = [];
let cachedTermination: any[] = [];
let cachedRegisterdUsers: any[] = [];



import React, { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, CircleCheckBig,ChevronsRight , FilePenLine, MapPin, Trash, CircleX,Plus , X, CirclePause, CircleAlert, EllipsisVertical, CalendarDays, Minimize2, Info, ChevronDown } from "lucide-react";
import { DeleteHCAStatus, DeleteHCAStatusInFullInformation, DeleteDeployMent, GetDeploymentInfo, GetRegidterdUsers, GetReplacementInfo, GetTerminationInfo, GetTimeSheetInfo, GetUserInformation, GetUsersFullInfo, InserTerminationData, InserTimeSheet, PostReason, TestInserTimeSheet, UpdateHCAnstatus, UpdateHCAnstatusInFullInformation, UpdateReason, UpdateReplacmentData, UpdateUserContactVerificationstatus, TestInsertTimeSheet, updateServicePrice, InsertDeployment, PostInvoice, GetInvoiceInfo, RemoveClient, RemoveClientFromTimeSheet, HCASalaryUpdate, GetAllUsersData, getCreatedInvoiceInfo, PostInvoiceFromDeployment, UpdateDeploymentStatus, PostRefundRequest, UpdateClientDailyAttendance, PostAttendeceEditRequest, EditAttendanceByClientId, UpdateClientAttendanceStatus, GetApplicationData, UpdateHCAnstatusInDeplyoment,  } from "@/Lib/user.action";
import { useDispatch, useSelector } from "react-redux";
import { SetDeploymentInfo, setUsers, UpdateClient, UpdateInvoiceInfo, UpdateMonthFilter, UpdateSubHeading, UpdateUserInformation, UpdateUserType, UpdateYearFilter } from "@/Redux/action";
import TerminationTable from "../Terminations/page";
import { LoadingData } from "../Loading/page";
import PaymentModal from "../PaymentInfoModel/page";
import { filterColors, IndianStates, months, Placements_Filters, years } from "@/Lib/Content";
import ReplacementsTable from "../ReplacementsTable/page";
import { AssignSuitableIcon, getDaysBetween, getDueDaysStatus, getPopularArea, rupeeToNumber, toProperCaseLive } from "@/Lib/Actions";
import { useRouter } from "next/navigation";
import { button, div } from "framer-motion/client";
import SalaryPopup from "../HCPSalary/page";
import RefundPopup from "../RefundRequestPopup/page";
import AwaitingInvoice from "../AwaitingInvoice/page";
import axios from "axios";
import RelasementHCPPopup from "../RelasementHCPPopup/page";
import RepleasementHCPPopup from "../RelasementHCPPopup/page";
import AttendanceModal from "../ClientAttendece/page";
import { Console } from "console";
import EmptyState from "../NoDeployments/page";


type DayStatus = "P" | "NA" | "HP" | "A";

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

type Users = any;
type Deployment = any;
type Replace = any;
type Termination=any;
type AttendanceState = Record<number, AttendanceData>;
interface ClientTableProps {
  users: any;
  ImpClientsInformation: Deployment[];
  ReplacementInformation: Replace[];
  terminationInfo: Termination[];
  RegisterdUsers: any[];
}
const ClientTable = ({
  users,
  ImpClientsInformation,
  ReplacementInformation,
  terminationInfo,
  RegisterdUsers,
}: ClientTableProps) => {
const [ClientsInformation,setClientsInformation]=useState(ImpClientsInformation||[])
    const [EditDate,setEditDate]=useState<any>()
  const [selectedAssignHCP,setselectedAssignHCP]=useState<any>()
   const Timenow = new Date();
   const [ParticularDate,SetParticularDate]=useState<any>()
 const [AttendeceEditReason,SetAttendeceEditReason]=useState("")
 const [AbsentReason,setAbsentReason]=useState("")
  const currentYear = Timenow.getFullYear().toString();
  const currentMonth = String(Timenow.getMonth() + 1).padStart(2, "0");
  const [selectedClient,setselectedClient]=useState<any>()
  const [isChecking, setIsChecking] = useState(false);
  const [SelectedServiceStates, setSelectedServiceStates] = useState("Telangana");
  const [selectedHCP,setselectedHCP]=useState<any>()
  const [showHCAList, setShowHCAList] = useState(false);
  const [ShowFreezPopUp,setShowFreezPopUp]=useState(false)
  const [selectedCase, setSelectedCase] = useState<any>(null);
   const [ShowAttendencePopUp,setShowAttendencePopUp]=useState(false)
const [searchHCA, setSearchHCA] = useState("");
 const [showAttendanceModal, setShowAttendanceModal] =useState(false);
const [ShowRefundRequrstPopUp,setShowRefundRequrstPopUp]=useState(false)
const [FreezeInformation,setFreezeInformation]=useState<any>()
const [ShowcreatIvocePopup,setShowcreatIvocePopup]=useState(false)
const [ShowCareTakerPriceUpdate,setShowCareTakerPriceUpdate]=useState(false)
const [showWarning, setShowWarning] = useState(false);
const [ReplacementTime,setReplacementTime]=useState("")
const [ReplacementDate,setReplacementDate]=useState("")
  const [UpdatedCareTakerStatus,setUpdatedCareTakerStatus]=useState("")
  
  const [Fineldate, setFineldate] = useState({
    date: '', day: "",
    updatedAt: "",
    status: ""
  })
  const [refreshKey, setRefreshKey] = useState(0);
const loggedInEmail=useSelector((state:any)=>state.LoggedInEmail)
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


const [status, setStatus] = useState("Active");


const [enableStatus,setenableStatus]=useState(false)
  const [TimeSheet_UserId, setTimeSheet_UserId] = useState("");
  const [TimeSheet_HCAId,setTimeSheet_HCAId]=useState("")
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showTimeSheet, setShowTimeSheet] = useState(false)

  // const [selectedMonth, setSelectedMonth] = useState<any>(new Date().getMonth());
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showExtendPopup,setshowExtendPopup]=useState(false)
  const [ExtendInfo,setExtendInfo]=useState<any>({})
  const [deleteTargetId, setDeleteTargetId] =  useState<any>();
  const [ActionStatusMessage,SetActionStatusMessage]= useState<any>("");
  const [ShowUpdateAttendece,SetShowUpdateAttendece]=useState(false)
  const [AttenseceInformation,setAttenseceInformation]=useState<any>()
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
// useEffect(() => {
//   if (loggedInEmail === "") {
//     router.push("/DashBoard");
//     return;
//   }

//   let mounted = true;

//   const isSuccessUpdate =
//     ActionStatusMessage?.includes("Successfully");

//   const fetchData = async () => {
//     try {
//       setIsChecking(true);

//       if (!isSuccessUpdate && cachedDeploymentInfo?.length > 0) {
//         setUsers(cachedUsersFullInfo);
//         setClientsInformation(cachedDeploymentInfo);
//         setReplacementInformation(cachedReplacementInfo);
//         SetterminationInfo(cachedTermination);
//         setRegisterdUsers(cachedRegisterdUsers);
//         return;
//       }

//       console.time("GET_DEPLOYMENT_API");

//       const { data } = await axios.get("/api/Deployentinfo");
//       console.log("Check Deployment Data------",data.deploymentInfo)

//       console.timeEnd("GET_DEPLOYMENT_API");

//       if (!mounted) return;

//      const {
//   deploymentInfo = [],
//   registeredUsers = [],
//   usersFullInfo = [],
// } = data.data;

// cachedDeploymentInfo = deploymentInfo;
// cachedRegisterdUsers = registeredUsers;
// cachedUsersFullInfo = usersFullInfo;

//       setUsers(cachedUsersFullInfo);
//       setClientsInformation(cachedDeploymentInfo);
//       setReplacementInformation(cachedReplacementInfo);
//       SetterminationInfo(cachedTermination);
//       setRegisterdUsers(cachedRegisterdUsers);

//       dispatch(UpdateSubHeading("On Service"));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       if (mounted) {
//         setIsChecking(false);
//       }
//     }
//   };

//   fetchData();

//   return () => {
//     mounted = false;
//   };
// }, [ActionStatusMessage, loggedInEmail,]);






useEffect(() => {
  if (loggedInEmail===''){
  router.push("/DashBoard")
 }
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
  searchYear: string,
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

  if (!item.StartDate || !item.EndDate) return false;

  const [startDay, startMonth, startYear] = item.StartDate.split("/");
  const [endDay, endMonth, endYear] = item.EndDate.split("/");

  const serviceStart = new Date(
    Number(startYear),
    Number(startMonth) - 1,
    Number(startDay)
  );

  const serviceEnd = new Date(
    Number(endYear),
    Number(endMonth) - 1,
    Number(endDay)
  );

  const month = Number(searchMonth);
  const year = Number(searchYear);

  const searchStart = new Date(year, month - 1, 1);
  const searchEnd = new Date(year, month, 0);

  const overlaps =
    serviceStart <= searchEnd &&
    serviceEnd >= searchStart;

  return matchesSearch && overlaps;
};

  const UpdateFreezeInformation = async() => {

    try {
      SetActionStatusMessage(`Please Wait  Updating Status to ${status}.....`)

const { data: UpdateFreezeStatus } = await axios.post(
  "/api/DeploymentStatus",
  {
    ClientId: FreezeInformation.Client_Id,
    HCAId: FreezeInformation.HCA_Id,
    Month: FreezeInformation.Month,
    Status: status,
  }
);

  
      if (UpdateFreezeStatus.success) {
       
      setClientsInformation((prev: any[]) =>
        prev.map((item: any) => {
          const clientId = item.ClientId || item.Client_Id;

          if (
            String(clientId) === String(FreezeInformation.Client_Id) &&
            String(item.HCAId || item.HCA_Id) ===
              String(FreezeInformation.HCA_Id)
          ) {
            return {
              ...item,
              Status: status,
            };
          }

          return item;
        })
      );

      SetActionStatusMessage(UpdateFreezeStatus.message);

      setTimeout(() => {
        setShowFreezPopUp(false);
      }, 3000);
    }
    
    } catch (err: any) {

    }
  }



  const GetPatientName = (A:any) => {
  const filtered = RegisterdUsers?.find(
    (each: any) => each.userId === A
  );

  return filtered
};



  const ShowProfileInformation = async (userId: any, ClientName: any) => {
    SetActionStatusMessage("Please Wait.....")
    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      dispatch(UpdateUserType("patient"));
      router.push("/UserInformation");
    }
  };

const PostRefunRequest = async (data: any) => {

  try {

    SetActionStatusMessage("Please Wait....");

    const response = await axios.post("/api/RefundRequest", {
     data
    });
console.log ("Check Refund Data---------",response.data.success)
if(!response.data.success){
SetActionStatusMessage("Refund Request already submitted for this client. You will be notified once the status is updated.")
return
}

    const updateSalary = await PostRefundRequest(
      data,
      loggedInEmail,

    );

    if (updateSalary?.success) {
    
      

      const phoneNumber = "U04S43V513N";
      const message =
      

  await axios.post("/api/Slack", {
     userIds: phoneNumber,
     message:  `Dear Managment, Kindly requesting Refund Request update for Client ${data?.ClientName}. Please check notification in the application. Thank you.`,
   });
  SetActionStatusMessage(
          "Refund Request request submitted to management. You will be notified once the status is updated."
        )
    
    }
  } catch (error) {
    console.error("Salary update error:", error);
   SetActionStatusMessage("Something went wrong. Please try again.");
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
const GetMonthlyCharges = (A:any) => {
  const filtered = RegisterdUsers?.find(
    (each: any) => each.userId === A
  );

  return filtered?.MonthlyServiceCharge || "Not Provided";
};

  const FinelTimeSheet = ClientsInformation?.map((each: any) => {
const normalizedAttendance =
console.log("Check for Reason-----",each.Attendance)
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
        UpdatedBy: att.UpdatedBy,
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
    TerminatedTimeSheet:each.Attendance,
    PatientName: each.patientName||"Not Provided",
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
    MonthlyServiceCharge: each.MonthlyServiceCharge,
    ServiceCharge:each.CareTakerPrice,
    StartDate:each.StartDate,
    EndDate:each.EndDate,
    Month:each.Month,
    Replacement:each.Replacement,
    ClientAttendance: each.ClientAttendance || [],
    ReplacementDate:each.ReplacementDate,
    ServiceState:each.ServiceState||"Not Provided"
    
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
    payTerms:each.payTerms,
    HCPPrice:Math.round(Number(each.PaymentforStaff)) / 30||"Not Provided"
  }));

 const handleDelete = () => {
    if (selectedReason === "Other") {
      confirmDelete(otherReason.trim());
    } else {
      confirmDelete(selectedReason);
    }
  };

  const UpdateAssignHca = async () => {
      if (!selectedClient || !selectedAssignHCP) {
      SetActionStatusMessage("Invalid client or HCA selection.");
      return;
    }


    if(selectedAssignHCP.HCPPrice==="Not Provided"){
  SetActionStatusMessage("")
setShowAssignPopup(!showAssignPopup)
setShowCareTakerPriceUpdate(true)



return
}
  try {
   
  

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
      UpdateUserContactVerificationstatus(clientId, "Converted"),
      UpdateHCAnstatus(hcaUserId, "Active"),
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
        ClientAttendece,
           ExtendInfo.ServiceState
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

  const ShowDompleteInformation = (userId: any, ClientName: any) => {

    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      router.push("/UserInformation");
    }
  };

   const GetHCPGender = (A: any) => {
    if (!users?.length || !A) return "Not Entered";

    const address =
      users
        ?.map((each: any) => each?.HCAComplitInformation)
        ?.find((info: any) => info?.UserId === A)
      ?.['Gender']||"Not Provided";

    return address ?? "Not Entered";
  };


     const GetHCPType = (A: any) => {
    if (!RegisterdUsers?.length || !A) return "Not Entered";

    const CurrentPreviewUserType:any =
      RegisterdUsers.filter((each:any)=>each.userId===A)

    return CurrentPreviewUserType[0]?.PreviewUserType ?? "Not Entered";
  };
  const isDeleteDisabled =
    !selectedReason || (selectedReason === "Other" && !otherReason.trim());
  const UpdateClient_UserId = (id: any,Name:any,HCAId:any) => {
    setHCPName(Name)
    setTimeSheet_UserId(id);
    setTimeSheet_HCAId(HCAId)
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
SetActionStatusMessage("Please Wait Working On Service Extention")

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
          AttendenceDate:  new Date()
      .toISOString()
      .split("T")[0],
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
        //  ExtendInfo.invoice,
        "",
        ExtendInfo.Type,
        CareTakerCharges,
        ClientAttendece,
           ExtendInfo.ServiceState
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

  const isValidCurrentStatus =each.CurrentStatus==="Bench"

  return typeMatch && isNotAssigned && isValidCurrentStatus;
});




  const TimeSheet_Info = FinelTimeSheet.find(

    (each) => each.Client_Id === TimeSheet_UserId&&each.HCA_Id===TimeSheet_HCAId&&each.Month===`${SearchYear}-${String(SearchMonth)}`
  );



  const daysInMonth = new Date(SearchYear, SearchMonth + 1, 0).getDate();

  // const handleStatusClick = (day: number) => {
  //   if (!TimeSheet_Info) return;
  //   const updatedTimeSheet = [...(TimeSheet_Info.TimeSheet || [])];
  //   const clickedDate = new Date(selectedYear, selectedMonth, day);
  //   const existingRecordIndex = updatedTimeSheet.findIndex((t) => {
  //     const parsed = parseEnInDate(t.date);
  //     return (
  //       parsed.getDate() === clickedDate.getDate() &&
  //       parsed.getMonth() === clickedDate.getMonth() &&
  //       parsed.getFullYear() === clickedDate.getFullYear()
  //     );
  //   });
  //   if (existingRecordIndex > -1) {
  //     const currentStatus = updatedTimeSheet[existingRecordIndex].status;
  //     const nextStatus =
  //       statusCycle[
  //         (statusCycle.indexOf(currentStatus) + 1) % statusCycle.length
  //       ];
  //     updatedTimeSheet[existingRecordIndex].status = nextStatus;
  //   } else {
  //     updatedTimeSheet.push({
  //       date: clickedDate.toLocaleDateString("en-IN"),
  //       status: "Present",
  //     });
  //   }
  //   TimeSheet_Info.TimeSheet = updatedTimeSheet;
  //   setClientsInformation([...ClientsInformation]);
  // };
const toggleStatus = () => {
  setStatus((prev) => (prev === "Active" ? "Freeze" : "Active"));
};
  const handleDeleteClick = (Info: any,Name:any) => {
    console.log ("Check Termination Info-------",Info)
    SetTerminationInfo(Info)
SetCareTakerName(Name)
    setShowDeletePopup(true);
  };

const HandleRemove = async (Info: any, Name: any) => {

  if (!Info?.Client_Id || !Info?.HCA_Id) {
    SetActionStatusMessage("Invalid data. Please refresh and try again.");
    return;
  }
 if (loggedInEmail!=="srivanikasham@curatehealth.in") {
    SetActionStatusMessage("Access denied. You do not have authorization to perform this action. Management approval is required.");
    return;
  }
  try {
    SetActionStatusMessage("Please wait...");


 
    const removeDeployRes = await RemoveClient(Info.Client_Id,Info?.HCA_Id);
    if (!removeDeployRes?.success) {
      SetActionStatusMessage(removeDeployRes?.message || "Failed to remove client from deployment");
      return;
    }

    const removeTimesheetRes = await RemoveClientFromTimeSheet(Info.Client_Id);
    if (!removeTimesheetRes?.success) {
      SetActionStatusMessage(removeTimesheetRes?.message || "Failed to remove client from timesheet");
      return;
    }

  
    const updateResult = await UpdateHCAnstatus(Info.HCA_Id, "Active");
    if (!updateResult?.success) {
      SetActionStatusMessage(updateResult?.message || "HCP update failed");
      return;
    }

   
    SetActionStatusMessage("Client Removed Successfully");
    setRefreshKey((prev:any) => prev + 1);

  } catch (err: any) {
    console.error("HandleRemove Error:", err);
    SetActionStatusMessage("Something went wrong. Please try again.");
  }
};


const confirmDelete = async (selectedReason: string) => {
  if (!TerminationInfo) {
    SetActionStatusMessage(
      "Unable to delete. Required information is missing."
    );
    return;
  }

  if (UpdatedCareTakerStatus===""){
      SetActionStatusMessage(
"Update HCA Status!"
    );
    return
  }

  const {
    HCA_Id,
    Client_Id,
    Month,
    HCA_Name,
    name,
    email,
    contact,
    location,
    HCAContact,
    TimeSheet,
    ClientAttendance,
    TerminatedTimeSheet
  } = TerminationInfo;

  try {
    SetActionStatusMessage("Please wait, deleting placement...");

    
    await UpdateHCAnstatus(HCA_Id, UpdatedCareTakerStatus||"Bench");

    await UpdateUserContactVerificationstatus(Client_Id, "Lost");

    const deleteDeploymentResponse:any = await DeleteDeployMent(
      Client_Id,
      HCA_Id,
      Month
    );

    if (!deleteDeploymentResponse?.success) {
         SetActionStatusMessage(deleteDeploymentResponse.message||"Deployment deletion failed.");
         return
    }

    await Promise.all([
      PostReason(
        HCA_Id,
        Client_Id,
        selectedReason,
        otherReason,
        ReplacementDate,
        ReplacementTime
      ),
      InserTerminationData(
        Client_Id,
        HCA_Id,
        HCA_Name,
        name,
        email,
        contact,
        location,
        HCAContact,
        TimeSheet,
        ClientAttendance,
        TerminatedTimeSheet,
        TerminationInfo.ServiceState,
      ),
    ]);

    SetActionStatusMessage(
      "Placement deleted successfully. Fetching updated data..."
    );

    const userId = localStorage.getItem("UserId");

    if (userId) {
      try {
        const { data:result } = await axios.post("/api/AdminPageInfo", {
          userId,
          refreshType: "deployment",
        });
   const {
      profile,
      registeredUsers,
      fullInfo,
      deployedLength,
    } = result.data;
       dispatch( SetDeploymentInfo(deployedLength))

        SetActionStatusMessage(
      "Date Updated successfully"
    )
      } catch (refreshError) {
        console.error(
          "Failed to refresh deployment count:",
          refreshError
        );
      }
    }

    setTimeout(() => {
      setShowDeletePopup(false);
    }, 500);
  } catch (error: any) {
    console.error("Placement deletion failed:", error);

    SetActionStatusMessage(
      error?.message ||
        "Something went wrong while deleting the placement. Please try again."
    );
  } finally {
    setDeleteTargetId(null);
  }
};



const FilterFinelTimeSheet = FinelTimeSheet.filter((item) =>item.ServiceState===SelectedServiceStates&&
  matchesSearchAndMonth(
    item,
    SearchResult,
    SearchMonth,
    SearchYear
  )
);

const Invoiceday:any = new Date().getDate();
const isInvoiceDay = [ 28, 29, 30, 31].includes(Invoiceday);


const today = new Date().toISOString().split("T")[0]; 

const hasUnmarked = FilterFinelTimeSheet.some((r: any) => {
  const markedToday = r.ClientAttendance?.some(
    (att: any) =>
      new Date(att.AttendanceDate).toISOString().split("T")[0] === today
  );

  return !markedToday;
});



const UpdateReplacement = async (
  Available_HCP: any,
  Exsting_HCP: any
) => {
  try {
    SetActionStatusMessage("Please wait...");

    // Price validation
    if (Available_HCP?.HCPPrice === "Not Provided") {
      SetActionStatusMessage("");
      setShowReassignmentPopUp(false);
      setShowCareTakerPriceUpdate(true);
      return;
    }

    // Basic validation
    if (!Available_HCP?.userId || !Exsting_HCP?.HCA_Id) {
      SetActionStatusMessage("Invalid HCP information.");
      return;
    }

    const localValue = localStorage.getItem("UserId");

    if (!localValue?.trim()) {
      SetActionStatusMessage(
        "User session expired. Please login again."
      );
      return;
    }

    // Get logged-in user information
    const Sign_in_UserInfo: any =
      await GetUserInformation(localValue);

    if (!Sign_in_UserInfo) {
      SetActionStatusMessage(
        "Unable to fetch user details."
      );
      return;
    }

    // Update replacement reason
    const postReasonRes = await UpdateReason(
      Available_HCP.userId,
      Exsting_HCP.HCA_Id,
      selectedReason,
      otherReason,
      ReplacementDate,
      ReplacementTime
    );

    if (!postReasonRes?.success) {
      SetActionStatusMessage(
        "Failed to update replacement reason."
      );
      return;
    }

    const TimeStampData = `${Sign_in_UserInfo?.FirstName || ""} ${
      Sign_in_UserInfo?.LastName || ""
    }, Email: ${Sign_in_UserInfo?.Email || ""}`;

    // Update replacement data
    const UpdateReplacmentInfo =
      await UpdateReplacmentData(
        Available_HCP,
        Exsting_HCP,
        TimeStampData,
        ReplacementDate,
        ReplacementTime,
        selectedCase.Client_Id,
        selectedCase.Month,
        selectedCase.name,
        selectedCase.HCA_Name

      );
      console.log ("Check Replasement Info----",UpdateReplacmentInfo)
    if (!UpdateReplacmentInfo?.success) {
      SetActionStatusMessage(
        "Replacement update failed."
      );
      return;
    }

    // Status updates
    await Promise.all([
      UpdateHCAnstatus(
        Exsting_HCP.HCA_Id,
        UpdatedCareTakerStatus
      ),
      UpdateHCAnstatusInDeplyoment(
        Available_HCP.HCA_Id,
        "Active"
      ),
      UpdateHCAnstatusInFullInformation(
        Available_HCP.userId
      ),
      // DeleteHCAStatus(Exsting_HCP.HCA_Id),
    ]);

    SetActionStatusMessage(
      "Replacement Updated, Please Wait Fetching Updated Data..."
    );

    const userId = localStorage.getItem("UserId");

    if (userId) {
      const { data } = await axios.post(
        "/api/AdminPageInfo",
        {
          userId,
          refreshType: "deployment",
        }
      );

      console.log("Current Task------", data);

      dispatch(
        SetDeploymentInfo(
          data?.data?.deployedLength || 0
        )
      );
    }

    setTimeout(() => {
      setShowReassignmentPopUp(false);
      setReplacementDate("");
      router.push("/DashBoard");
    }, 400);
  } catch (err: any) {
    console.error(
      "UpdateReplacement Error:",
      err?.response?.data || err
    );

    SetActionStatusMessage(
      err?.message ||
        "Something went wrong. Please try again."
    );
  }
};

  const CreateInvoice = async (InvoiceData: any) => {
    try {
      setShowcreatIvocePopup(!ShowcreatIvocePopup),
        SetActionStatusMessage("Please wait while your invoice is being generated."
          
        )

      const ExistingInfo: any = await getCreatedInvoiceInfo(InvoiceData.
        Client_Id, 
        InvoiceData.StartDate,
        InvoiceData.HCA_Id
      );
      if (ExistingInfo) {
        SetActionStatusMessage("Invoice already exists");
        return;
      }
      const UpdatedData = {
        userId: InvoiceData.Client_Id,
        HCA_Name: InvoiceData.HCA_Name,
        HCA_Id: InvoiceData.HCA_Id,
        serviceLocation: InvoiceData.Address,
        FirstName: InvoiceData.name,
        patientName: InvoiceData.PatientName,
        ContactNumber: InvoiceData.contact,
        Email: InvoiceData.email,
       
         serviceCharges:GetPatientName(InvoiceData.Client_Id)?.MonthlyServiceCharge || InvoiceData.ServiceCharge,
  MonthlyPayment:GetPatientName(InvoiceData.Client_Id)?.MonthlyServiceCharge ?true:false,
        RegistrationFee: 0,
      }
   
      const CompliteInvoiceInfo=await PostInvoiceFromDeployment(UpdatedData, 0, '',InvoiceData.StartDate,InvoiceData.EndDate)
      if(CompliteInvoiceInfo?.success){
     SetActionStatusMessage(CompliteInvoiceInfo.message)
      }

    } catch (err: any) {

    }
  }


    const UpdateCurrentAttendence = async () => {
        try {
          setShowAttendencePopUp(true)
          SetActionStatusMessage("Please Wait...")

      const payload:any= FilterFinelTimeSheet
      .filter((each:any)=>each.Status!=="Freeze")
     .map((client:any) => ({
        Client_Id: client.Client_Id,
        Client_Name: client.name,
        HCA_Id: client.HCA_Id,
        HCA_Name: client.HCA_Name,
        date: new Date().toISOString().split("T")[0],
        status: "Present",
      }));

      const UpdateDailyattendece = await UpdateClientDailyAttendance(SearchYear,SearchMonth,payload,loggedInEmail);
  
  
       if (UpdateDailyattendece.success === true) {
  const today = new Date().toISOString().split("T")[0];

  setClientsInformation((prev: any) =>
    prev.map((client: any) => {
      const exists = client.ClientAttendance?.some(
        (att: any) =>
          new Date(att.AttendanceDate).toISOString().split("T")[0] === today
      );

      if (exists) return client;

      return {
        ...client,
        ClientAttendance: [
          ...(client.ClientAttendance || []),
          {
            AttendanceDate: today,
            Status: "Present",
            dateKey: today,
          },
        ],
      };
    })
  );

  SetActionStatusMessage(
    "Clients Today's Attendance Updated Successfully"
  );
 const userId = localStorage.getItem("UserId");

    if (userId) {
      try {const userId = localStorage.getItem("UserId");
        const { data } = await axios.post("/api/AdminPageInfo", {
          userId,
          refreshType: "deployment",
        });

        dispatch(
          SetDeploymentInfo(
            Number(data?.data?.deployedLength) || 0
          )
        );
        SetActionStatusMessage(
      "updated data Imported"
    )
      } catch (refreshError) {
        console.error(
          "Failed to refresh deployment count:",
          refreshError
        );
      }
    }
  return;
}
  
  
  
  
     
    
        } catch (err: any) {
    
        }
      }
const processedData = useMemo(() => {
  const search = SearchResult?.toLowerCase().trim() || "";

  return FilterFinelTimeSheet
    .filter((record: any) => {
      if (!search) return true;

      const name = record.name?.toLowerCase() || "";
      const phone = record.contact?.toString() || "";

      return name.includes(search) || phone.includes(search);
    })

    .map((record: any) => {
      const dayStatusArray = Array.from({ length: 31 }, () => "-");

     (record.ClientAttendance || []).forEach((att: any) => {
  const day = new Date(att.AttendanceDate).getDate();

  const status =
    att.Status ||
    att.AttendeceStatus ||
    "Absent";

  if (day >= 1 && day <= 31) {
    if (status === "Present") {
      dayStatusArray[day - 1] = "P";
    } else if (status === "Half Day") {
      dayStatusArray[day - 1] = "HP";
    } else {
      dayStatusArray[day - 1] = "A";
    }
  }
});
      const counts = dayStatusArray.reduce(
        (acc: any, v: string) => {
          if (v === "P") acc.pd++;
          if (v === "A") acc.ad++;
          if (v === "HP") acc.hpd++;
          return acc;
        },
        { pd: 0, ad: 0, hpd: 0 }
      );

      return {
        ...record,
        days: dayStatusArray,
        ...counts,
      };
    });
}, [
  ClientsInformation,
  SearchResult,
  refreshKey,
  SearchMonth,
SearchYear,
SelectedServiceStates
]);
const UpdateServiceCharge=async(A:any)=>{
  SetActionStatusMessage("Please Wait...")
  alert(A)
const GetInfo=await  GetUserInformation(A)

if(!GetInfo.serviceCharges){
 SetActionStatusMessage("Service Charges Not Found")
 return
}
const { success } = await updateServicePrice(
  A,
GetInfo.serviceCharges
);

if (success) {
 SetActionStatusMessage("Price updated Successfully,Refresh To Get Updated Price");
} else {
SetActionStatusMessage("Update failed");
}

}

const EditAttendence = async (): Promise<void> => {

 
  if (!AttenseceInformation?.Client_Id) return;

  try {
    SetActionStatusMessage("Please Wait...");

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    const flexDate = `${SearchYear}-${String(SearchMonth).padStart(2, "0")}-${String(ParticularDate).padStart(2, "0")}`;
    const yearMonth = `${SearchYear}-${String(SearchMonth).padStart(2, "0")}`;

    const currentStatus = status;

    if (!currentStatus) {
      SetActionStatusMessage("Please select a valid status");
      return;
    }
    
const payload = {
        Client_Id: AttenseceInformation.Client_Id,
        HCA_Id: AttenseceInformation.HCA_Id,
        Client_Name: AttenseceInformation.name,
        HCA_Name: AttenseceInformation.HCA_Name,
        date: EditDate,
        status: currentStatus,
      };

      const dateResponse = await UpdateClientAttendanceStatus(
        SearchYear,
        SearchMonth,
        [payload],
        loggedInEmail,
        AbsentReason
      );


if (dateResponse?.success) {


  setClientsInformation((prev: any[]) => {
   

    return prev.map((client: any, index: number) => {
      

      const currentClientId =
        client.ClientId || client.Client_Id;

      

      if (
        String(currentClientId) !==
        String(AttenseceInformation.Client_Id)
      ) {
        return client;
      }


      const attendance = [...(client.ClientAttendance || [])];

 ;

      const attendanceIndex = attendance.findIndex((att: any) => {
       

        if (!att?.AttendanceDate) {
      
          return false;
        }

        const dbDate = new Date(att.AttendanceDate)
          .toISOString()
          .split("T")[0];

       
        return dbDate === EditDate;
      });

    

      const updatedAttendanceRecord = {
        dateKey: EditDate,
        AttendanceDate: `${EditDate}T00:00:00.000Z`,
        Client_Id: AttenseceInformation.Client_Id,
        Client_Name: AttenseceInformation.name,
        HCA_Id: AttenseceInformation.HCA_Id,
        HCA_Name: AttenseceInformation.HCA_Name,
        Status: currentStatus,
        AttendeceStatus: currentStatus,
        UpdatedBy: loggedInEmail,
        Reason: AbsentReason,
        UpdatedAt: new Date().toISOString(),
      };

     

      if (attendanceIndex >= 0) {
      

        attendance[attendanceIndex] = {
          ...attendance[attendanceIndex],
          ...updatedAttendanceRecord,
        };
      } else {
  

        attendance.push(updatedAttendanceRecord);
      }

    

      return {
        ...client,
        ClientAttendance: attendance,
      };
    });
  });



  SetActionStatusMessage("Attendance Updated Successfully");

  return;
}
      // setTimeout(() => {
      //   setShowTimeSheet(false);
      //   SetShowUpdateAttendece(false);
      //   SetAttendeceEditReason("");
      // }, 3500);

      // return;
//     if (EditDate === today) {
//       const payload = {
//         Client_Id: AttenseceInformation.Client_Id,
//         HCA_Id: AttenseceInformation.HCA_Id,
//         Client_Name: AttenseceInformation.name,
//         HCA_Name: AttenseceInformation.HCA_Name,
//         date: EditDate,
//         status: currentStatus,
//       };
// console.log(
//   "Check Attendece Status",currentStatus
// )
//       const dateResponse = await UpdateClientAttendanceStatus(
//         SearchYear,
//         SearchMonth,
//         [payload],
//         loggedInEmail,
//         AbsentReason
//       );

//      if (dateResponse?.success) {
//   setClientsInformation((prev:any) =>
//     prev.map((client:any) => {
//       if (client.ClientId !== AttenseceInformation.Client_Id) return client;

//       const updatedAttendance = [...(client.ClientAttendance || [])];

//       const existingIndex = updatedAttendance.findIndex(
//         (att:any) =>
//           new Date(att.AttendanceDate).toISOString().split("T")[0] === EditDate
//       );

//       if (existingIndex >= 0) {
//         updatedAttendance[existingIndex] = {
//           ...updatedAttendance[existingIndex],
//           Status: currentStatus,
//         };
//       } else {
//         updatedAttendance.push({
//           AttendanceDate: EditDate,
//           Status: currentStatus,
//         });
//       }

//       return {
//         ...client,
//         ClientAttendance: updatedAttendance,
//       };
//     })
//   );

//   SetActionStatusMessage(
//     dateResponse?.message || "Attendance updated Successfully"
//   );
// }

//       setTimeout(() => {
//         setShowTimeSheet(false);
//         SetShowUpdateAttendece(false);
//         SetAttendeceEditReason("");
//       }, 3500);

//       return;
//     }

//     const info = {
//       ...AttenseceInformation,
//       flexDate,
//       yearMonth,
//       status: currentStatus,
//     };
// console.log ("Check Client Info Details------",info)
//     const response = await PostAttendeceEditRequest(
//       info,
//       AttendeceEditReason,
//       loggedInEmail,
//       AbsentReason,
//       "ClientAttendece"
//     );

//     if (!response?.success) {
//       SetActionStatusMessage(response?.message || "Failed to update attendance");
//       return;
//     }

//     try {
//       await axios.post("/api/Slack", {
//         userIds: "U04S43V513N",
//         message:
//           "Hi Madam, Kindly requesting Attendance Edit Request update. Please check notification in the application. Thank you.",
//       });
//     } catch (slackError) {
//       console.error("Slack notification failed:", slackError);
//     }

//     SetActionStatusMessage(`✅ ${response.message || "Attendance request submitted Successfully"}`);

//     setTimeout(() => {
//       setShowTimeSheet(false);
//       SetShowUpdateAttendece(false);
//       SetAttendeceEditReason("");
//     }, 3500);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while updating attendance";

    console.error("EditAttendence Error:", error);
    SetActionStatusMessage(message);
  }
};

const OmServiceView = () => {
    return (
      <div className="w-full flex flex-col gap-8 p-2 bg-gray-50">
       
    
           
        <div className="flex flex-wrap items-center gap-3 justify-between">
    

     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">

  {/* Search */}
  <div
    className="
      flex items-center bg-white shadow-md rounded-xl
      px-4 h-[40px]
      border border-gray-200
      focus-within:border-indigo-500
      transition
      w-full sm:max-w-[250px]
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
      className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
    />
  </div>
{ActionStatusMessage && (
  <div className="mt-4 flex justify-center">
    <p
      className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-300 ${
        ActionStatusMessage.includes("Sucessfull")
          ? "border border-green-200 bg-green-50 text-green-700"
          : "border border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {ActionStatusMessage}
    </p>
  </div>
)}
  {/* Filters */}

  <div className="flex flex-col items-center sm:flex-row gap-3 w-full sm:w-auto">
    
<button
  className="group inline-flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-sm font-semibold text-slate-800 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-200 hover:bg-slate-200"
onClick={() => setShowAttendanceModal(true)}
>
  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-teal-600 group-hover:text-white">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4"
      />
    </svg>
  </span>

  <div className="flex flex-col  leading-tight">
    <span className="text-xs">Pending Attendance</span>
    <span className="text-[10px] text-center font-medium text-slate-500">
      Client check-in
    </span>
  </div>
</button>
<div className="text-center">
  <label className="mb-1.5 block text-xs font-semibold text-gray-700">
    Service Work State
  </label>

  <div className="relative">
    <select
      value={SelectedServiceStates}
      onChange={(e) => setSelectedServiceStates(e.target.value)}
      className="w-full text-center h-10 appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-700 outline-none transition-all hover:border-gray-400 focus:border-[#1392d3] focus:ring-2 focus:ring-[#1392d3]/20"
    >
    

      {IndianStates.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>

    <ChevronDown
      size={16}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
    />
  </div>
</div>
    {/* Month */}
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

  </div>
</div>
    {/* <button
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
    </button> */}
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

  <AttendanceModal
        clients={FilterFinelTimeSheet}
        isOpen={showAttendanceModal}
        setIsOpen={setShowAttendanceModal}
        Messsage={ActionStatusMessage}
        onSubmit={async(Info: any) => {
          
          SetActionStatusMessage("Updating attendance, please wait...");
          const result = await UpdateClientDailyAttendance(SearchYear,SearchMonth,Info,loggedInEmail);
         
            SetActionStatusMessage("Updated Client attendance Successfully");
          setShowAttendanceModal(false);
        
        
          // Handle attendance submission logic here
        }}
      />
  <SalaryPopup
  open={ShowCareTakerPriceUpdate}
  defaultSalary={""}
  StatusMsg={ActionStatusMessage}
  title={selectedHCP?.FirstName||selectedAssignHCP?.FirstName}
  onClose={() => setShowCareTakerPriceUpdate(false)}
  onSubmit={async(value) => {
   
    const UpdateSalary= await HCASalaryUpdate(selectedHCP?.id||selectedAssignHCP?.id,value,loggedInEmail)
    if(UpdateSalary.success){
    SetActionStatusMessage(`${selectedHCP?.FirstName||selectedAssignHCP?.FirstName} ${UpdateSalary.message}`)
setTimeout(()=>{
setShowCareTakerPriceUpdate(false)
},2300)
    }

  }}
/>
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
{ShowcreatIvocePopup&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
  <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
    
  <div className="flex items-center justify-between  w-fill ">
<div>
  <h2 className="text-lg font-semibold text-gray-800 mb-2">
      Creating Invoice
    </h2>

    <p className={`text-xs ${ActionStatusMessage==="Invoice already exists"?"text-red-600":"text-gray-500"} mb-4`}>
      {ActionStatusMessage}
    </p>
    </div>
        <img
            src="/Icons/Curate-logoq.png"
            className="h-12"
            alt="Company Logo"
          />
    </div>
{ActionStatusMessage==="Please wait while your invoice is being generated."&&
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
      <span className="text-sm text-gray-600">Processing...</span>
    </div>}

    <div className="mt-6 flex justify-end">
      <button className="text-sm px-4 py-1.5 border border-gray-300 cursor-pointer rounded-md hover:bg-gray-100" onClick={()=>{setShowcreatIvocePopup(!ShowcreatIvocePopup),SetActionStatusMessage("")}}>
        Cancel
      </button>
    </div>

  </div>
</div>}
<RepleasementHCPPopup
  open={showHCAList}
  onClose={() => {setShowHCAList(false);setShowReassignmentPopUp(true)}}
  filteredHcps={filterProfilePic}
  onAssign={(hcp) => {

      const selected = HCA_List.find(
        (hca:any) => hca.userId ===  hcp.UserId
      );
      setselectedHCP(selected);
      setShowHCAList(false);setShowReassignmentPopUp(true)
    
      
  }}
  onUpdate={(hcp) => console.log("Updated HCP:", hcp.UserId)}
/>
  {ClientsInformation.length > 0 && (
  <div className="w-full overflow-x-auto rounded-2xl shadow-xl">
      {(ShowFreezPopUp&&status==="Freeze") && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    
    <div className="bg-white rounded-xl p-6 w-[320px] shadow-xl text-center animate-scaleIn">
      
      <div className="flex justify-center mb-3">
        <CircleAlert className="w-10 h-10 text-red-500" />
      </div>

      <h2 className="text-lg font-semibold mb-2">
        Freeze Deployment?
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        This Deployment will not be able to access the system until reactivated.
      </p>
<p>{ActionStatusMessage}</p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setShowFreezPopUp(false)}
          className="px-4 py-1 text-sm rounded-md border hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={UpdateFreezeInformation}
          className="px-4 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
        >
          Freeze
        </button>
      </div>

    </div>
  </div>
)}
     {(ShowFreezPopUp&&status!=="Freeze") && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    
    <div className="bg-white rounded-xl p-6 w-[320px] shadow-xl text-center animate-scaleIn">
      
      <div className="flex justify-center mb-3">
        <CircleAlert className="w-10 h-10 text-green-500" />
      </div>

      <h2 className="text-lg font-semibold mb-2">
        Active Deployment?
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        This Deployment will Enable to access the system .
      </p>
<p>{ActionStatusMessage}</p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setShowFreezPopUp(false)}
          className="px-4 py-1 text-sm rounded-md border hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={UpdateFreezeInformation}
          className="px-4 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600"
        >
          Active
        </button>
      </div>

    </div>
  </div>
)}
{   <RefundPopup
        isOpen={ShowRefundRequrstPopUp}
        onClose={() => setShowRefundRequrstPopUp(false)}
        data={selectedClient}
        CompliteInfo={users}
        onSubmit={(A)=>(PostRefunRequest(A))}
      />}


      {ShowAttendencePopUp && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
    
    <div className="relative w-[92%] max-w-md bg-white rounded-2xl shadow-2xl p-6 transform animate-scaleIn">

 
      <button
         onClick={() => {setShowAttendencePopUp(false),SetActionStatusMessage("Clients Today's Attendance Updated Successfully")}}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
      >
        ✕
      </button>

   
      <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-emerald-100">
        <span className="text-3xl text-emerald-600">✔</span>
      </div>

      
      <h2 className="mt-5 text-center text-lg font-semibold text-gray-800">
        {ActionStatusMessage}
      </h2>

      
      {ActionStatusMessage === "Please Wait..." && (
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

    
      {ActionStatusMessage !== "Please Wait..." && (
        <div className="mt-6 flex justify-center">
          <button
                onClick={() => {setShowAttendencePopUp(false),SetActionStatusMessage("Clients Today's Attendance Updated Successfully")}}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition"
          >
            Close
          </button>
        </div>
      )}
    </div>
  </div>
)}
{processedData.length > 0 ? 
  <table className="min-w-[900px] w-full border-collapse bg-white">
    
  
  <thead className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white  text-[11px] font-semibold">
  <tr>
    <th className="w-10 px-2 py-2 text-left">S.No</th>

    <th className="min-w-[90px] max-w-[140px] px-2 py-2 text-left truncate">
      Client 
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
      Patient 
    </th>

    <th className="w-[120px] px-2 py-2 text-left">
      Contact
    </th>

    <th className="px-2 w-[120px] py-2 text-left truncate">
      Location
    </th>

    <th className="min-w-[100px]  px-2 py-2 text-center truncate">
      HCP 
    </th>

    <th className="w-[120px] px-2 py-2 text-center">
      Status
    </th>

    <th className="w-[80px] px-2 py-2 text-center">
      Replacement
    </th>
    
   {Number(currentMonth) === Number(SearchMonth)  && Number(currentYear) === Number(SearchYear) &&
        <th className="w-[80px] px-2 py-2 text-center">
 <div className="flex flex-col items-center justify-between
                w-16 h-12
                bg-emerald-500
                rounded-lg
                text-white
                p-1 shadow-lg border border-gray-300">

  <div className="flex  items-center leading-none">
    <CalendarDays size={10} />
    <span className="text-[9px] ml-1 font-semibold">
      {/* {new Date().getDate()} */}
      {new Date().toLocaleDateString("En-In")}
    </span>
  </div>



  <button
    className={`text-[8px] px-1 py-0.5 rounded-md transition
      ${
        hasUnmarked
          ? "bg-white text-emerald-600 hover:bg-gray-100"
          : "bg-gray-200 text-gray-600 cursor-not-allowed"
      }`}
    onClick={hasUnmarked ? UpdateCurrentAttendence : undefined}
    disabled={!hasUnmarked}
  >
    {hasUnmarked ? "Mark All" : "Already Marked"}
  </button>

</div>
  </th>}
    <th className="w-[80px] px-2 py-2 text-center">
      Time Sheet
    </th>

    {/* {(isInvoiceDay || enableStatus) && (
      <th className="w-[70px] px-2 py-2 text-center">
        Invoice
      </th>
    )} */}
 <th className="w-[50px] px-2 py-2 text-center">
         Profile
      </th>
    {/* <th className="w-[100px] px-2 py-2 text-center">
      Service Continue
    </th> */}

    <th className="w-[70px] px-2 py-2 text-center">
      Add HCP
    </th>

   
      <th className="w-[70px] px-2 py-2 text-center">
   Rise Refund
    </th>
     <th className="w-[70px] px-2 py-2 text-center">
      Terminate
    </th>
      {/* <th className="w-[70px] px-2 py-2 text-center">
   Remove
    </th> */}
  </tr>
</thead>



   
    <tbody className="bg-white divide-y divide-gray-200">
      {processedData.map((c, i) => 
        
     {
         const [, month, year] = c.StartDate.split("/").map(Number);

const monthIndex = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
].indexOf(SearchMonth) + 1;

const isMatch = Number(month) === Number( new Date().getMonth() + 1) && Number(year) ===Number(now.getFullYear());
const todayIndex = Math.max(0, new Date().getDate() - 1);
const dayStatus = c.days?.[todayIndex] || "-";

const today = new Date();

const localToday = `${today.getFullYear()}-${String(
  today.getMonth() + 1
).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const EditDate =
  c?.ClientAttendance?.find((att: any) => att?.dateKey === localToday)
    ?.dateKey || localToday;
   

      return(
          <tr key={i} className="hover:bg-teal-50/30 transition-all">
           <td className="px-3 py-3 font-semibold text-xs text-gray-900 break-words">
           {i+1}
          </td>
        <td className="px-1 py-3 font-semibold text-[11px] text-gray-900 break-words">
  {c.Replacement ? (
    <span className="inline-flex items-center gap-1.5">
      <img
        src="Icons/RegisterIcone.png"
        alt="Replacement"
        className="w-5 h-5 object-contain"
      />
      {toProperCaseLive(c.name)}
    </span>
  ) : (
    toProperCaseLive(c.name)
  )}
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

    <td className="px-2 py-3 font-semibold text-[11px] text-gray-900 break-words">
            {c.StartDate}
          </td>   
          <td className="px-2 py-3 font-semibold text-[11px] text-gray-900 break-words">
            {c.EndDate}
          </td>
<td className="px-3 py-3 text-gray-700 text-xs">
 {GetMonthlyCharges(c.Client_Id)=== "Not Provided" ? 
    
    <div className="flex flex-col items-end leading-none text-right min-w-[70px]">
  <span className="text-[11px] font-medium whitespace-nowrap">
    ₹{(
      getDaysBetween(c.StartDate, c.EndDate) *
      rupeeToNumber(c.ServiceCharge)
    ).toFixed(2)}
    <span className="text-gray-500 text-[10px] ml-1">/M</span>
  </span>

  <span className="text-[11px] font-medium whitespace-nowrap mt-1">
    ₹{rupeeToNumber(c.ServiceCharge).toFixed(2)}
    <span className="text-gray-500 text-[10px] ml-1">/D</span>
  </span>
</div>:      <span>
        <span className="text-[10px] text-green-900 underline">* Monthly Payment </span>
         ₹{ GetMonthlyCharges(c.Client_Id)}/M
       
      
      </span>}
 
</td>


          <td className="px-1 py-1 font-semibold text-[11px] text-gray-900 ">
            {toProperCaseLive(c.PatientName)}
          </td>

          <td className="px-2 py-3 text-gray-700  text-xs break-words">
            {c.contact}
          </td>

       <td className="px-1 py-3 text-gray-900 font-semibold text-[10px] flex items-center gap-1">
  <MapPin size={14} className="text-green-600 shrink-0" />
  {getPopularArea(c.location)}
</td>




 <td
  className="px-1 py-3 text-center cursor-pointer"
  onClick={() => ShowDompleteInformation(c.HCA_Id, c.HCA_Name)}
>
  <div className="relative flex flex-col items-center  group w-fit mx-auto">

    <img
      className="h-4 w-4"
      src={
        AssignSuitableIcon(
          GetHCPGender(c.HCA_Id),
          GetHCPType(c.HCA_Id)
        ).image
      }
    />


    <span className="hover:underline font-semibold text-[10px] mb-4 break-words leading-tight">
      {toProperCaseLive(c.HCA_Name)}
    </span>

  
    <div
      className="absolute -top-12 left-1/2 -translate-x-1/2
                 opacity-0 group-hover:opacity-100
                 translate-y-2 group-hover:translate-y-0
                 transition-all duration-300 ease-out
                 bg-gradient-to-br from-[#00A9A5] to-[#005f61]
                 text-white text-xs font-medium
                 px-3 py-2 rounded-xl shadow-xl
                 whitespace-nowrap pointer-events-none z-50"
    >
      {
        AssignSuitableIcon(
          GetHCPGender(c.HCA_Id),
          GetHCPType(c.HCA_Id)
        ).caseType
      }
    </div>

  </div>
</td>



<td className="px-1 py-3 break-words">
  <div
    className={`flex items-center gap-2 rounded-full px-3 py-1 ${
      c.Status === "Active"
        ? "bg-green-100 text-emerald-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {c.Status === "Active" ? (
      <CircleCheckBig className="w-4 h-4 text-emerald-600" />
    ) : (
      <CirclePause className="w-4 h-4 text-red-600" />
    )}

    <select
      className="bg-transparent text-xs font-medium outline-none cursor-pointer appearance-none"
      value={c.Status}
      onChange={(e) => {
        const UpdatedStatus=e.target.value
        setStatus(UpdatedStatus)
        ;setFreezeInformation(c);
        SetActionStatusMessage('')
        setShowFreezPopUp(true)
        
      
      }}
    >
      <option value="Active">Active</option>
      <option value="Freeze">Freeze</option>
    </select>
  </div>
</td>
          <td className="px-4 py-3 break-words">
         {/* <button
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
  onClick={()=>{setShowReassignmentPopUp(!ShowReassignmentPopUp),SetCareTakerName(toProperCaseLive(c.HCA_Name)),setselectedHCP(null),setselectedAssignHCP(null),setSelectedCase(c),setReplacementDate("");SetActionStatusMessage(""),setShowWarning(false),setUpdatedCareTakerStatus(""),setSearchHCA("")}}
>
  Reassignment
</button> */}

<img src="Icons/Repleasement.png" alt="Repleasement Icons"  className="h-6 ml-4 cursor-pointer "   onClick={()=>{setShowReassignmentPopUp(!ShowReassignmentPopUp),SetCareTakerName(toProperCaseLive(c.HCA_Name)),setselectedHCP(null),setselectedAssignHCP(null),setSelectedCase(c),setReplacementDate("");SetActionStatusMessage(""),setShowWarning(false),setUpdatedCareTakerStatus(""),setSearchHCA(""),console.log("Check Test Data-----",)}}/>

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
    <label className="text-[12px] font-medium text-gray-700">
      Replacement Date ({new Date(ReplacementDate).toLocaleDateString("EN-In")||''})
    </label>
<input
  type="date"
  value={ReplacementDate}
  onChange={(e) => {
    const value = e.target.value;
    setReplacementDate(value);

    if (!value) {
      setShowWarning(false);
      return;
    }

    const selected = new Date(value);
    const today = new Date();

    const isCurrentMonth =
      selected.getMonth() === today.getMonth() &&
      selected.getFullYear() === today.getFullYear();

    
    setShowWarning(!isCurrentMonth);
  }}
  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
/>

{showWarning && (
  <p className="text-xs text-center text-red-500 mt-1">
    ⚠ Selected date Sholud be belongs to the current month
  </p>
)}

  </div>

  <div className="flex flex-col space-y-1">
    <label className="text-[12px] font-medium text-gray-700">
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
    <div className="flex flex-col gap-2">





  {/* <select
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


    {HCA_List.filter((hca: any) =>
  hca.FirstName?.toLowerCase().includes(searchHCA.toLowerCase())
).map((each: any) => (
      <option key={each.id} value={each.userId}>
        {each.FirstName}
      </option>
    ))}
  </select> */}
<div className="flex items-center justify-between bg-white shadow-md rounded-2xl p-4 border border-gray-200">
  
  <div>
    <p className="text-sm text-gray-500 mb-1">New HCA Status</p>

    <p className="text-base font-semibold text-gray-800">
      {selectedHCP
        ? `Selected: ${selectedHCP.FirstName}`
        : "No HCA selected"}
    </p>
  </div>

  <button
    onClick={() => {
      setShowHCAList(!showHCAList);
      setShowReassignmentPopUp(false);
    }}
    className={`px-2 py-2 rounded-xl text-[10px] cursor-pointer transition-all duration-300 shadow-sm
      ${
        showHCAList
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-teal-600 hover:bg-teal-700 text-white"
      }`}
  >
    {selectedHCP ? "Replace HCP" : "Show Available List"}
  </button>

</div>

</div>



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
               
                <option value="Sick">🟡 Sick</option>
                <option value="Leave">🔵 Leave</option>
                <option value="Bench">🟣 Bench</option>
            
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
               selectedHCP&& selectedReason &&UpdatedCareTakerStatus&&
                (selectedReason !== "Other" || otherReason)
              )
            }
            className={`
              inline-flex items-center justify-center
              px-7 py-3 text-sm font-semibold rounded-full transition-all
              ${
                selectedHCP&&selectedReason &&UpdatedCareTakerStatus&&showWarning===false&&
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

          {/* <td className="px-3 py-3 text-center break-words">
            <button
              className="px-4 cursor-pointer py-2 text-xs font-medium hover:bg-gray-100 hover:rounded-full  text-white "
              onClick={() => UpdateClient_UserId(c.Client_Id, c.name)}
            >
             <CalendarCheck2 size={19} className="text-teal-600"/>
            </button>
          </td> */}

          {Number(currentMonth) === Number(SearchMonth)  && Number(currentYear) === Number(SearchYear) &&
            <Td className="text-center align-middle">
              {dayStatus==="-"?(
                <span className="flex flex-col items-center leading-[10px] text-[9px] font-semibold text-gray-600">
                  <span>Not</span>
                  <span>Marked</span>
                </span>
              ):(
               <div className="flex flex-col items-center gap-1">
                  <DayBadge status={dayStatus as DayStatus}/>
                  <p
                    className="text-[10px] text-blue-600 cursor-pointer hover:underline"
                 onClick={()=>{
                   SetShowUpdateAttendece(true)
                      setAttenseceInformation(c)
                      setStatus("Choose")
                      SetActionStatusMessage("")
                      SetParticularDate(new Date().getDate())
                     setEditDate (EditDate)
                     setStatus ("")
                      setAbsentReason("")
                   
                 }}
                  >
                    Edit
                  </p>
                </div>
              )}
            </Td>
      }
<Td className="text-center align-middle">
              {c.Status==="Freeze"?<p className="inline-flex items-center px-3 py-1 text-xs font-bold tracking-wide text-red-700 bg-purple-100 rounded-md shadow-sm">
  ❄ On Freeze
</p>:
              <button
                className="px-2 py-1 text-[10px] text-white bg-teal-800 rounded hover:bg-teal-600"
                 onClick={() => {UpdateClient_UserId(c.Client_Id, c.name,c.HCA_Id),setAttenseceInformation(c),SetActionStatusMessage("")}}
              >
                Full Month 
              </button>}
            </Td>
          {/* {(isInvoiceDay || enableStatus) && (
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

          )} */}








  <td className="px-3 py-3 text-center">
{/* <button  className="
    px-1 py-1
    text-[9px] font-semibold
   text-emerald-600
border border-emerald-500
    rounded-lg

    transition-all duration-300
  shadow-[0_0_0_0_rgba(16,185,129,0.5)]
hover:shadow-[0_0_12px_2px_rgba(16,185,129,0.6)]
    bg-gray-150
    active:scale-95 
    cursor-pointer
  "
  onClick={()=>CreateInvoice(c)}
  >
  Create
</button> */}
<button  className="
    px-1 py-1
    text-[9px] font-semibold
   text-emerald-600
border border-emerald-500
    rounded-lg
text-white
    transition-all duration-300
  shadow-[0_0_0_0_rgba(16,185,129,0.5)]
hover:shadow-[0_0_12px_2px_rgba(16,185,129,0.6)]
   bg-gradient-to-br from-[#00A9A5] to-[#007B7F] hover:from-[#01cfc7] hover:to-[#00403e]
    active:scale-95 
    cursor-pointer
  "
  onClick={()=>ShowProfileInformation(c.Client_Id,c.name)}
  >
  Preview
</button>
{/* 
<img src="Icons/CreateInovoice.png" onClick={()=>CreateInvoice(c)} className="h-7 ml-3"/> */}
</td>



 <td     className="inline-block px-1 ml-4 cursor-pointer py-2 text-[10px] mt-4 hover:bg-gray-100 hover:rounded-full font-medium cursor-pointer ">
            <button
            className="cursor-pointer"
             onClick={() => {setShowAssignPopup(true),setselectedClient(c),setselectedAssignHCP(null),setselectedHCP(null),SetActionStatusMessage("")}}
            >
       <Plus size={19} className="h-5 w-5 text-center text-teal-600"/>
            </button>
          </td>
        
          <td className="px-3 py-3 text-center break-words relative">
  


        <img src="Icons/RiseRefund.png"  onClick={()=>{setShowRefundRequrstPopUp(true),setselectedClient(c)}} className="h-9"/>

</td>
  <td className="px-3 py-3 text-center break-words">
            <button
            
              className="px-3 py-2 text-xs font-medium cursor-pointer rounded-lg hover:rounded-full hover:bg-gray-100"
              onClick={() => {handleDeleteClick(c,c.HCA_Name),setUpdatedCareTakerStatus("")}}
            >
              <Trash />
            </button>
          </td>
 
{/* <td className="px-3 py-3 text-center break-words relative">
  
 

  <button
    className="px-3 py-2 text-xs font-medium cursor-pointer rounded-lg hover:rounded-full hover:bg-gray-100"
    onClick={() => {
      HandleRemove(c, c.HCA_Name);
    }}
  >
    <CircleX className="text-red-600" />
  </button>

</td>
  */}
        </tr>
      )
     }
      )}
    </tbody>

  </table>:  <EmptyState
    title="No Deployments Found"
    description="No deployment records match the selected filters. Try changing or clearing your filters."
  />}
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
          value={selectedAssignHCP?.userId || ""}
        onChange={(e) => {
    const selected:any = HCA_List.find(
      (hca:any) => hca.userId === e.target.value
    );
  
    setselectedAssignHCP(selected);
  }}
>
  <option value="">Assign New HCA</option>

  {HCA_List.map((each:any) => (
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
          onChange={(e) => {
              const value = e.target.value;
setSelectedDate(e.target.value)
    if (!value) {
      setShowWarning(false);
      return;
    }

    const selected = new Date(value);
    const today = new Date();

    const isCurrentMonth =
      selected.getMonth() === today.getMonth() &&
      selected.getFullYear() === today.getFullYear();

    
    setShowWarning(!isCurrentMonth);

          }}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
{showWarning && (
  <p className="text-xs text-center text-red-500 mt-1">
    ⚠ Selected date Sholud be belongs to the current month
  </p>
)}
    
      {/* {lastDateOfMonth && (
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
      )} */}

   
      <div className="flex items-center gap-2 mb-3">
        <input
          type="radio"
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

     
     {selectedDate&&!showWarning&& <div className="flex justify-center gap-4">
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

{ShowUpdateAttendece&&
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

  <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl">

    <div className="flex items-center justify-between border-b px-2 py-3">
      <p className="text-base font-semibold text-gray-800">
        Edit Attendance{EditDate}
      </p>
      <button
  onClick={()=>SetShowUpdateAttendece(!ShowUpdateAttendece)}
  className="flex justify-end cursor-pointer rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-black"
>
  <X size={14} />
</button>
    </div>



    <div className="px-5 py-4">
      <label className="mb-2 block text-sm font-medium text-gray-600">
        Attendance Status
      </label>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
      ><option value="">Choose Attendence</option>
        <option value="Present">Present</option>
        <option value="Half Day">Half Day</option>
        <option value="Absent">Absent</option>
      </select>
    </div>
{(status === "Absent" || status === "Half Day") && (
  <div className="mt-3">
    <label className="mb-2 block text-sm font-medium text-gray-600 p-1">
      Enter Reasonf for {status}
      </label>
    <input
      type="text"
      placeholder="Enter reason..."
      value={AbsentReason}
      onChange={(e) => setAbsentReason(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
    />
  </div>
)}
{EditDate!==new Date().toISOString().split('T')[0]&&

<div className="flex flex-col  border-b px-2 py-3">
  <label className="text-xs font-semibold text-gray-800">
    Reason for Attendance Edit 
  </label>

  <input
    type="text"
    value={AttendeceEditReason}
    placeholder="Enter Here....."
    onChange={(e: any) => SetAttendeceEditReason(e.target.value)}
    style={{
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      outline: "none"
    }}
  />
</div>}
<div className="flex items-center-justify-between">
   {ActionStatusMessage&&
            <p
  className={`mt-2 text-sm font-medium px-1 py-2 text-xs text-center rounded-lg ${
    ActionStatusMessage?.includes("success") || ActionStatusMessage?.includes("✅")
      ? " text-green-700  "
      : "text-red-700  "
  }`}
>
  {ActionStatusMessage}
</p>
      }
    <div className="flex w-full justify-end gap-2 border-t px-5 py-3">
      <button
        onClick={()=>SetShowUpdateAttendece(!ShowUpdateAttendece)}
        className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
      >
        Cancel
      </button>

      <button
        className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
onClick={EditAttendence}
      >
        Save
      </button>
    </div>
      </div>
  </div>
</div>
}

{showTimeSheet && TimeSheet_Info && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
<div className="
  bg-white rounded-3xl shadow-2xl
  p-4 sm:p-6
  w-[98vw] sm:w-[95vw] lg:w-[900px]
  max-h-[90vh]
  overflow-y-auto
  backdrop-blur-md
  border border-gray-200
">
      <div className="mb-4 bg-white/80 backdrop-blur-xl p-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg">
              <img
                src="/Icons/Curate-logoq.png"
                alt="Company Logo"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#ff1493] font-semibold">
                {TimeSheet_Info?.name || ""}
              </p>
              <h2 className="text-xl font-bold text-slate-800">
                Attendance Dashboard  
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {monthNames[SearchMonth-1]} {SearchYear}
              </p>
            </div>
          </div>

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
          </div>

          <button
            onClick={() => setShowTimeSheet(false)}
            className="px-2 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer transition"
          >
            <Minimize2 size={14} />
          </button>
        </div>
      </div>

      <div className="
  grid
  grid-cols-2
  sm:grid-cols-3
  md:grid-cols-5
  lg:grid-cols-7
  gap-3
  text-center
">
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const day = dayIndex + 1;

 const record = TimeSheet_Info.ClientAttendance?.find((t: any) => {
  if (!t?.dateKey) return false;
console.log("Check for Repleasment Date--------",TimeSheet_Info)
  const [year, month, date] = t.dateKey.split("-").map(Number);
  const parsed = new Date(year, month - 1, date);

  return (
    parsed.getDate() === day &&
    parsed.getMonth() + 1 === Number(SearchMonth) &&
    parsed.getFullYear() === Number(SearchYear)
  );
});

          const today = new Date();
          const currentDateObj = new Date(SearchYear, SearchMonth-1, day);
          const isFuture = currentDateObj > today;

    const startDate = TimeSheet_Info?.StartDate
  ? (() => {
      const [day, month, year] = TimeSheet_Info.StartDate
        .split("/")
        .map(Number);

      return new Date(year, month - 1, day);
    })()
  : null;

const isBeforeStartDate =
  startDate && currentDateObj < startDate;  

const replacementDate = TimeSheet_Info?.ReplacementDate
  ? new Date(TimeSheet_Info.ReplacementDate)
  : null;

const isBeforeReplacementDate =
  replacementDate && currentDateObj < replacementDate;

          const currentStatus =
  isBeforeStartDate
    ? "Not Marked"
    : updatedAttendance?.[day]?.status ??
      (record?.Status === "Present"
        ? "Present"
        : record?.Status === "Half Day"
        ? "Half Day"
        : record?.Status === "Absent"
        ? "Absent"
        : "Not Marked");

          const statusColor =
            (currentStatus as string) === "Present"
              ? "bg-green-100 text-green-700 border-green-300"
              : (currentStatus as string) === "Half Day"
              ? "bg-yellow-100 text-yellow-700 border-yellow-300"
              : (currentStatus as string) === "Absent"
              ? "bg-red-100 text-red-700 border-red-300"
              : "bg-gray-100 text-gray-500 border-gray-300";

          return (
            <div
              key={day}
className="
  rounded-lg
  w-full
  border border-gray-200
  bg-white
  shadow-sm
  flex flex-col
  items-center
  justify-center
  p-2
  min-h-[95px]
"
            >
              {/* {`${SearchYear}-0${SearchMonth}-${day<=9?
                `0${day}`:day}`} */}
              <span className="text-[10px] font-semibold text-gray-500 uppercase">
                Day {day}  
              </span>

           
              <DayBadge status={currentStatus as DayStatus} />


              {record?.HCA_Name && (
                <span className="text-[8px] text-gray-800 mt-1">
                  HCA: {record.HCA_Name}
                </span>
              )}

              {record?.UpdatedBy && (
                <div className="relative group inline-block">
                  <Info className="cursor-pointer" size={12} />

                  <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-black px-3 py-2 text-xs text-white group-hover:block whitespace-nowrap z-50">
                    <div>Attendance Marked By: {record.UpdatedBy}</div>

                    {record?.Reason && (
                      <div className="mt-1">
                        Reason For {currentStatus}: {record.Reason}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <span
                onClick={() => {
                  if (isFuture||isBeforeReplacementDate||isBeforeStartDate) return;
                  SetShowUpdateAttendece(!ShowUpdateAttendece);
                  SetParticularDate(day);
                  setEditDate(record?.dateKey?record?.dateKey:`${SearchYear}-0${SearchMonth}-${day<=9?
                `0${day}`:day}`);
                  setAttenseceInformation(record || AttenseceInformation);
                  setStatus(record?.Status || "");
                  setAbsentReason(record?.Reason || "");
                }}
                className={`text-[8px] px-2 py-[2px] rounded-full mt-1 cursor-pointer ${
                  isFuture||isBeforeReplacementDate||isBeforeStartDate
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-slate-700 text-white hover:bg-slate-800"
                }`}
              >
                Edit
              </span>
            </div>
          );
        })}
      </div>

      {ShowUpdateAttendece && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-2 py-3">
              <p className="text-base font-semibold text-gray-800">
                Edit Attendance{EditDate}
              </p>

              <button
                onClick={() => SetShowUpdateAttendece(!ShowUpdateAttendece)}
                className="flex justify-end cursor-pointer rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-black"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-5 py-4">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Attendance Status{EditDate}
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
              >
                <option value="">Choose Attendance</option>
                <option value="Present">Present</option>
                <option value="Half Day">Half Day</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            {(status === "Absent" || status === "Half Day") && (
              <div className="mt-3 px-5">
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Enter Reason for {status}
                </label>

                <input
                  type="text"
                  placeholder="Enter reason..."
                  value={AbsentReason}
                  onChange={(e) => setAbsentReason(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>
            )}

            {/* {EditDate !== new Date().toISOString().split("T")[0] && (
              <div className="flex flex-col border-b px-5 py-3">
                <label className="text-xs font-semibold text-gray-800">
                  Reason for Attendance Edit
                </label>

                <input
                  type="text"
                  value={AttendeceEditReason}
                  placeholder="Enter Here....."
                  onChange={(e: any) => SetAttendeceEditReason(e.target.value)}
                  className="mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>
            )} */}

            <div>
              {ActionStatusMessage && (
                <p
                  className={`mt-2 text-sm font-medium px-1 py-2 text-xs text-center rounded-lg ${
                    ActionStatusMessage?.includes("success") ||
                    ActionStatusMessage?.includes("✅")
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {ActionStatusMessage}
                </p>
              )}

              <div className="flex w-full justify-end gap-2 border-t px-5 py-3">
                <button
                  onClick={() => SetShowUpdateAttendece(!ShowUpdateAttendece)}
                  className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  onClick={EditAttendence}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

     <div className="mt-5 flex justify-center sm:justify-end">
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

const AwaitingInvoiceCount = FinelTimeSheet
  .filter((item) =>
    matchesSearchAndMonth(item, SearchResult, SearchMonth, SearchYear)
  )
  .filter((item: any) => {
    const [, month, year] = item.StartDate.split("/").map(Number);
    const isMatch =
      month === SearchMonth && year === SearchYear;
    const WorkingDays: any = getDueDaysStatus(item.EndDate);

  return isMatch 
    
  }).length;

 
function DayBadge({ status }: { status: any }) {
  const Wrapper = ({ children }: any) => (
    <div className="flex items-center justify-center w-full">
      {children}
    </div>
  );

  if (status === "Present"||status === "P") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 text-emerald-600 bg-white shadow-sm">
          {(status === "Present"||status === "P")&&"P"}
        </span>
      </Wrapper>
    );
  }

  if (status === "Half Day"||status === "HP") {
    return (
      <Wrapper>
        <div className="relative w-8 h-8 rounded-full border-2 border-emerald-500 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-semibold text-emerald-600">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-emerald-500" />
          <span className="relative z-10">HP</span>
        </div>
      </Wrapper>
    );
  }

  if (status === "Absent"||status === "A") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 border-rose-600 text-rose-600 bg-white shadow-sm">
         A
        </span>
      </Wrapper>
    );
  }

  if (status === "Not Marked") {
    return (
    
      <span
        className={`text-[8px] w-fit font-medium font-semibold px-2 py-1 rounded bg-gray-300 text-gray-500 border-gray-300`}
      >
        Not Marked
      </span>

    );
  }

  return (
    <Wrapper>
      <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border border-gray-400 text-gray-500 bg-white shadow-sm">
        {status}
      </span>
    </Wrapper>
  );
}
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

        case "Awaiting Invoice":
          return <AwaitingInvoice users={users} ClientsInformation={ClientsInformation} RegisterdUsers={RegisterdUsers} />;
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
              
        {`${each}   ${each !== "Awaiting Invoice"?(GetFilterCount(each) || 0):''}`}

                
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
