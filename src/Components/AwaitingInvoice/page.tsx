"use client";
let cachedUsersFullInfo: any[] = [];
let cachedDeploymentInfo: any[] = [];
let cachedReplacementInfo: any[] = [];
let cachedTermination: any[] = [];
let cachedRegisterdUsers: any[] = [];

import { GetAllUsersData, GetUserInformation, InsertDeployment, updateServicePrice } from "@/Lib/user.action";
import { UpdateMonthFilter, UpdateSubHeading, UpdateYearFilter } from "@/Redux/action";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingData } from "../Loading/page";
import { AssignSuitableIcon, getDaysBetween, getPopularArea, rupeeToNumber, toProperCaseLive } from "@/Lib/Actions";
import { CalendarCheck2, ChevronsRight, CircleCheckBig, CirclePause, MapPin, X } from "lucide-react";
import { years } from "@/Lib/Content";

const    AwaitingInvoice=()=>{
     const [ActionStatusMessage,SetActionStatusMessage]= useState<any>("");
     const [lastDateOfMonth, setLastDateOfMonth] = useState("");
       const [ExtendInfo,setExtendInfo]=useState<any>({})
       const [SearchResult,setSearchResult]=useState("")
       const [showWarning, setShowWarning] = useState(false);
       const [showExtendPopup,setshowExtendPopup]=useState(false)
       const [users, setUsers] = useState<any[]>([]);
         const [ClientsInformation, setClientsInformation] = useState<any[]>([]);
          const [RegisterdUsers,setRegisterdUsers]=useState<any[]>([])
          const [updateServiceCharge, setUpdateServiceCharge] = useState(false);
          const [serviceCharge, setServiceCharge] = useState("");
           const [ReplacementInformation,setReplacementInformation]=useState<any[]>([])
           const [terminationInfo,SetterminationInfo]=useState<any[]>([])
       const [isChecking, setIsChecking] = useState(true);
       const router=useRouter()
       const dispatch=useDispatch()
       const loggedInEmail=useSelector((each:any)=>each.loggedInEmail)
       const SearchMonth=useSelector((state:any)=>state.FilterMonth) 
       const SearchYear=useSelector((state:any)=>state.FilterYear) 
       const TimeStamp=useSelector((state:any)=>state.TimeStampInfo)
         const [selectedDate, setSelectedDate] = useState("");
         const [selectedEndDate, setSelectedEndDate] = useState("");
    
    useEffect(() => {
      let mounted = true;
    
      const isSuccessUpdate = ActionStatusMessage?.includes("Successfully");
    
      const fetchData = async () => {
        try {
          setIsChecking(true);
     if(loggedInEmail===""){
        router.push("/DashBoard")
      }
          if (!isSuccessUpdate && cachedDeploymentInfo?.length > 0) {
            setUsers([...cachedUsersFullInfo]);
            setClientsInformation([...cachedDeploymentInfo]);
            setReplacementInformation([...cachedReplacementInfo]);
            SetterminationInfo([...cachedTermination]);
            setRegisterdUsers([...cachedRegisterdUsers])
            return;
          }
    
          // const [
          //   RegisterdUsers,
          //   usersResult,
          //   placementInfo,
          //   replacementInfo,
          //   terminationInfo,
          // ] = await Promise.all([
          //    GetRegidterdUsers() ,
          //   GetUsersFullInfo(),
          //   GetDeploymentInfo(),
          //   GetReplacementInfo(),
          //   GetTerminationInfo(),
          // ]);
          const {
      RegisterdUsers,
      usersResult,
      placementInfo,
      replacementInfo,
      terminationInfo,
    } = await GetAllUsersData();
    
          if (!mounted) return;
    
          cachedUsersFullInfo = usersResult ?? [];
          cachedDeploymentInfo = placementInfo ?? [];
          cachedReplacementInfo = replacementInfo ?? [];
          cachedTermination = terminationInfo ?? [];
        cachedRegisterdUsers=RegisterdUsers??[]
          setUsers([...cachedUsersFullInfo]);
          setClientsInformation([...cachedDeploymentInfo]);
          setReplacementInformation([...cachedReplacementInfo]);
          SetterminationInfo([...cachedTermination]);
           setRegisterdUsers([...cachedRegisterdUsers])
    
          dispatch(UpdateSubHeading("Awaiting Invoice"));
        } catch (err) {
          console.error(err);
        } finally {
          if (mounted) setIsChecking(false);
        }
      };
    
      fetchData();
    
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

    const now = new Date();

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
    EndDate:each.EndDate,
    Month:each.Month,
    Replacement:each.Replacement,
    
  };
});

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

     const WorkingDays=getDaysBetween(item.EndDate, new Date().toISOString().split("T")[0])-1

  return matchesSearch && matchesMonth && matchesYear&&WorkingDays<=3;
};
const FilterFinelTimeSheet = FinelTimeSheet.filter((item) =>
  matchesSearchAndMonth(
    item,
    SearchResult,
    SearchMonth,
    SearchYear
  )
);
const today:any = new Date().getDate();
const UpdatePopup=async(a:any)=>{
  setshowExtendPopup(true)
  setExtendInfo(a)

}
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


 const ExtendTimeSheet = async () => {
SetActionStatusMessage("Please Wait Working On Service Extention")

    // const PostTimeSheet: any = await TestInserTimeSheet(DateofToday, LastDateOfMonth, ExtendInfo.Status, ExtendInfo.Address, ExtendInfo.contact, ExtendInfo.name, ExtendInfo.PatientName, ExtendInfo.Patient_PhoneNumber, ExtendInfo.RreferralName, ExtendInfo.HCA_Id, ExtendInfo.Client_Id, ExtendInfo.HCA_Name, ExtendInfo.HCAContact, ExtendInfo.
    //   hcpSource, ExtendInfo.provider, ExtendInfo.payTerms, ExtendInfo.cTotal, ExtendInfo.cPay, ExtendInfo.hcpTotal, ExtendInfo.hcpPay, CurrentMonth, ["P"], TimeStamp, ExtendInfo.invoice, ExtendInfo.Type)
    
    const GetInfo=await  GetUserInformation(ExtendInfo.Client_Id)

    const StarteDate=new Date(selectedDate).toLocaleDateString("en-In")
    const LastDate=new Date(selectedEndDate).toLocaleDateString("en-In")
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
        TimeStamp,
        //  ExtendInfo.invoice,
        "",
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
      if (isChecking) {
        return (
      <LoadingData/>
    
        );
      }

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
          Select Start Date
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
       <div className="mb-4">
        <label className="text-sm text-gray-600 mb-1 block">
          Select End Date
        </label>
        <input
          type="date"
          value={selectedEndDate}
          onChange={(e) => {
              const value = e.target.value;
setSelectedEndDate(e.target.value)
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
     <table className="w-full table-fixed border-collapse bg-white">
       
  <thead className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white text-xs font-semibold shadow-md">
  <tr className="[&>th]:w-auto">
    <th className="px-2 py-2 text-center">S.No</th>

    <th className="px-2 py-2 text-left truncate overflow-hidden whitespace-nowrap">
      Client Name
    </th>

    <th className="px-2 py-2 text-left">Start Date</th>
    <th className="px-2 py-2 text-left">End Date</th>

    <th className="px-2 py-2 text-left truncate">
      Service Charge
    </th>

    <th className="px-2 py-2 text-left truncate overflow-hidden whitespace-nowrap">
      Patient Name
    </th>

    <th className="px-2 py-2 text-left">Contact</th>

    <th className="px-2 py-2 text-left truncate">
      Location
    </th>

    <th className="px-2 py-2 text-center truncate">
      HCP Name
    </th>
      <th className="px-2 py-2 text-center ">
      Days Left For Extentiion
    </th>

    <th className="px-2 py-2 text-center">
      Service Continue
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
   const WorkingDays=getDaysBetween(c.EndDate, new Date().toISOString().split("T")[0])-1
         return(
             <tr key={i} className="hover:bg-teal-50/30 transition-all">
              <td className="px-3 py-3 font-semibold text-xs text-gray-900 break-words text-center">
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
   
             <td className="px-2 py-3 text-gray-700  text-xs break-words">
               {c.contact}
             </td>
   
          <td className="px-1 py-3 text-gray-900 font-semibold text-[10px] flex items-center gap-1">
     <MapPin size={14} className="text-green-600 shrink-0" />
     {getPopularArea(c.location)}
   </td>
   
   
   
   
    <td
     className="px-1 py-3 text-center cursor-pointer"
 
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

 <td className="px-1 py-3 text-center break-words">
     
      {WorkingDays===1?`${WorkingDays} Day`:  `${WorkingDays} Days`   } 
    
 
   </td>
   <td className="px-1 py-3 text-center break-words">
     {(isMatch
     && WorkingDays <= 3)? (
    
   <button
         className="px-4 py-2 text-xs font-medium hover:bg-gray-100 hover:rounded-full"
        onClick={() =>{ UpdatePopup(c),setSelectedDate(""),setShowWarning(false),SetActionStatusMessage("")}}
       >
         <ChevronsRight size={22} className="text-teal-600"/>
       </button>
     ) : (
          <img src="Icons/AlreadyOnService.png" className="h-8 ml-8"/>
     )}
   
      {/* <button
         className="px-4 py-2 text-xs font-medium hover:bg-gray-100 hover:rounded-full"
         onClick={() =>{ UpdatePopup(c),setSelectedDate("")}}
       >
     <ChevronsRight size={22} className="text-teal-600"/>
       </button> */}
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
   
   </td> */}
    
           </tr>
         )
        }
         )}
       </tbody>
   
     </table>
   </div>
   
   
     
     )}
 
   
   
   
    
   
   
 
   
   </div>
   
       );
    
    }


export default AwaitingInvoice;