"use client";
let cachedRegisteredUsers: any[] = [];
let cachedTimeSheetInfo: any[] = [];

import React, { useEffect, useState } from "react";
import { CircleCheckBig, Eye, LogOut, Trash } from "lucide-react";
import { DeleteDeployMent, GetRegidterdUsers, GetTimeSheetInfo, GetUserInformation, InserTerminationData, InserTimeSheet, TestInserTimeSheet, UpdateHCAnstatus, UpdateUserContactVerificationstatus } from "@/Lib/user.action";
import { useDispatch, useSelector } from "react-redux";
import { GetCurrentDeploymentData, Update_Main_Filter_Status, UpdateFetchedInformation, UpdateSubHeading } from "@/Redux/action";
import TerminationTable from "@/Components/Terminations/page";
import { useRouter } from "next/navigation";
import { LoadingData } from "@/Components/Loading/page";


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


type AttendanceState = Record<number, AttendanceData>;
const ClientTable = () => {
  const [ClientsInformation, setClientsInformation] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(true); 
  const [isChecking, setIsChecking] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [Fineldate, setFineldate] = useState({
    date: '', day: "",
    updatedAt: "",
    status: ""
  })
  const [HCPName,setHCPName]=useState("")
 const [updatedAttendance, setUpdatedAttendance] = useState<AttendanceState>({});
 const [SaveButton,setSaveButton]=useState(false)
  console.log("Test Attendence Status----",Fineldate)

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
const TimeStamp=useSelector((state:any)=>state.TimeStampInfo)
  const SubHeading = useSelector((state: any) => state.SubHeadinList);
  const dispatch = useDispatch();
const Router=useRouter()
 useEffect(() => {
  let mounted = true;

  const fetchData = async (forceFresh = false) => {
    try {
      
      if (!forceFresh && cachedRegisteredUsers.length && cachedTimeSheetInfo.length) {
        if (!mounted) return;

        setUsers([...cachedRegisteredUsers]);
        setClientsInformation([...cachedTimeSheetInfo]);
        dispatch(UpdateSubHeading("On Service"));
        setIsChecking(false);
        return;
      }

  
      const [usersResult, timesheetInfo] = await Promise.all([
        GetRegidterdUsers(),
        GetTimeSheetInfo(),
      ]);

      if (!mounted) return;

      cachedRegisteredUsers = usersResult ?? [];
      // cachedTimeSheetInfo = timesheetInfo ?? [];

      cachedTimeSheetInfo = [
        ...new Map(
          [...(cachedTimeSheetInfo ?? []), ...(timesheetInfo ?? [])]
            .map((item) => [item.ClientId, item])
        ).values(),
      ];


      setUsers(cachedRegisteredUsers);
      setClientsInformation(cachedTimeSheetInfo);
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
      Array.isArray(each.Attendence) && each.Attendence.length > 0
        ? each.Attendence.map((att: any) => ({
            date: att.date,
            status: att.status || "Absent",
          }))
        : [];
    return {
      Client_Id: each.ClientId,
      HCA_Id: each.HCAId,
      Address:each.Address||"UnFilled",
      name: each.ClientName,
      email: each.ClientEmail,
      contact: each.ClientContact,
      HCAContact: each.HCAContact,
      HCA_Name: each.HCAName,
      location: each.Address||"UnFilled",
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
      PDRStatus:each.PDRStatus




    };
  });

  const Finel = users.map((each: any) => ({
    id: each.userId,
    FirstName: each.FirstName,
    AadharNumber: each.AadharNumber,
    Age: each.Age,
    userType: each.userType,
    Location: each.Location||"UnFilled",
    Email: each.Email,
    Contact: each.ContactNumber,
    userId: each.userId,
    VerificationStatus: each.VerificationStatus,
    DetailedVerification: each.FinelVerification,
    EmailVerification: each.EmailVerification,
    ClientStatus: each.ClientStatus,
    Status: each.Status,
    provider:each.provider,
    payTerms:each.payTerms,


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
dispatch(GetCurrentDeploymentData(a))
const data = await GetUserInformation(a.Client_Id);
   dispatch(UpdateFetchedInformation(data))
   Router.push("/PDR")

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
    console.log("Test Updated Result----", PostTimeSheet)

    if(PostTimeSheet.success===true){
     
       SetActionStatusMessage("TimeSheet Succesfully Extended")
       const Timer=setInterval(()=>{
         setshowExtendPopup(false)
         SetActionStatusMessage("")
       },2000)
       return ()=>clearInterval(Timer)
    }
    
  }
  
  const HCA_List = Finel.filter(
    (each: any) =>
      each.userType === "healthcare-assistant" && each.Status !== "Assigned"
  );

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
           const DeleteTimeSheetData=await DeleteDeployMent(deleteTargetId.Client_Id)
           const PostTimeSheet:any = await InserTerminationData(deleteTargetId.Client_Id, deleteTargetId?.HCA_Id, deleteTargetId.name, deleteTargetId.email, deleteTargetId.contact,deleteTargetId.location, deleteTargetId.role, deleteTargetId.HCAContact, deleteTargetId.TimeSheet)
                console.log("Compare Data--",DeleteTimeSheetData)
                if(DeleteTimeSheetData.success===true){
          SetActionStatusMessage("Seccessfully Deleted Placement")

                }
           
    }
    setShowDeletePopup(false);
    setDeleteTargetId(null);
  };


const FilterFinelTimeSheet = FinelTimeSheet.filter((each:any) => {
  const search = SearchResult?.toLowerCase() || "";
  const name = each.name?.toLowerCase() || "";
  const email = each.email?.toLowerCase() || "";
  const contact = each.contact?.toLowerCase() || "";
  const role=each.role?.toLowerCase() || "";

  return (
    name.includes(search) ||
    email.includes(search) ||
    contact.includes(search)||
    role.includes(search)
  );
});


const handleLogout = () => {
  dispatch(Update_Main_Filter_Status(""))
  Router.push('/DashBoard'); 
       
};

  const handleMainLogout = async () => {
    localStorage.removeItem("UserId");
    Router.prefetch("/");
    Router.push("/");
  };



  if (isChecking) {
    return (
    <LoadingData/>

    );
  }

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  const filteredClients = FilterFinelTimeSheet.filter(client =>
 client.PDRStatus === activeTab
);


 return (
<div className="w-full min-h-screen bg-gradient-to-br from-[#f9fbfa] via-[#f0fdfa] to-[#ecfeff] flex flex-col gap-10 p-10 relative overflow-hidden">


  <div className="absolute inset-0 -z-10">
    <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] bg-emerald-100/40 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[5%] right-[10%] w-[250px] h-[250px] bg-cyan-100/30 rounded-full blur-3xl"></div>
  </div>

  
  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_6px_30px_rgba(0,0,0,0.08)] border border-gray-100 px-8 py-6">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">🩺 Patient Daily Record</h1>
      <p className="text-gray-500 text-sm mt-1">Monitor, manage, and complete pending PDRs with ease.</p>
    </div>
    <div className="relative w-full sm:w-[320px]">
      <input
        type="search"
        placeholder="Search clients..."
        onChange={(e: any) => setSearchResult(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gradient-to-r from-white to-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none shadow-sm hover:shadow-md transition-all"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-3.5 top-2.5 w-5 h-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
        />
      </svg>
    </div>
     <div className='flex items-center'>
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
          >
          DashBoard
          </button>
          <button
                onClick={handleMainLogout}
                className="
                  w-full px-4 py-2.5
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


  {ClientsInformation.length === 0 && (
    <div className="flex flex-col items-center justify-center text-center gap-8 h-[65vh] rounded-3xl bg-white/70 backdrop-blur-xl border border-emerald-100 shadow-[0_8px_40px_rgba(16,185,129,0.08)] p-16">
      <h2 className="text-4xl font-extrabold text-gray-800">
        No Pending <span className="text-emerald-600">PDRs</span> Found
      </h2>
      <p className="text-gray-500 text-lg">
        Everything looks clear. You can review past verifications under{" "}
        <span className="font-semibold text-emerald-700">Terminations</span>.
      </p>
      <button className="mt-4 px-10 py-3 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-md hover:shadow-lg hover:scale-[1.04] transition-all duration-300">
        Go to Terminations
      </button>
    </div>
  )}


  {ClientsInformation.length > 0 && (
    <div className="flex flex-col gap-6 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.05)] p-8 transition-all hover:shadow-[0_12px_60px_rgba(0,0,0,0.08)]">


<div className="flex flex-col gap-4 mb-6 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">

  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
    PDR List
  </h3>


  <div className="flex items-center gap-4">
 
    <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-1">
      <button
        onClick={() => setActiveTab(true)}
        className={`px-4 py-1.5 text-sm font-medium cursor-pointer rounded-md transition
          ${
            activeTab
              ? "bg-emerald-600 text-white shadow"
              : "text-gray-600 hover:bg-white"
          }`}
      >
        Pending PDRs
      </button>

      <button
        onClick={() => setActiveTab(false)}
        className={`px-4 py-1.5 text-sm font-medium cursor-pointer rounded-md transition
          ${
            !activeTab
              ? "bg-emerald-600 text-white shadow"
              : "text-gray-600 hover:bg-white"
          }`}
      >
        Completed PDRs
      </button>
    </div>

    {/* Count */}
    <span className="text-sm text-gray-500">
      Total:
      <span className="ml-1 font-semibold text-emerald-600">
        {filteredClients.length}
      </span>
    </span>
  </div>
</div>


      <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-inner">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-white uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-8 py-4 ">Status</th>
              <th className="px-6 py-4 text-center">PDR</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.reverse().map((c, i) => (
              <tr
                key={i}
                className="border-b border-gray-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-cyan-50 transition-all duration-300"
              >
                
                <td className="px-6 py-4 font-semibold text-gray-900">{c.name}</td>
                <td className="px-6 py-4">{c.contact}</td>
                <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">{c.location}</td>
                <td className="px-6 py-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 rounded-full px-3 py-1 shadow-sm">
                    <CircleCheckBig className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium">Converted</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => UpdatePopup(c)}
                    className="px-6 py-2 text-xs cursor-pointer font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full shadow-md hover:shadow-lg hover:scale-[1.05] transition-all duration-300"
                  >
                  <Eye/>
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

export default ClientTable;
