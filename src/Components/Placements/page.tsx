"use client";
import React, { useEffect, useState } from "react";
import { CircleCheckBig, Trash } from "lucide-react";
import { DeleteTimeSheet, GetRegidterdUsers, GetTimeSheetInfo, InserTerminationData, InserTimeSheet, TestInserTimeSheet, UpdateHCAnstatus, UpdateUserContactVerificationstatus } from "@/Lib/user.action";
import { useDispatch, useSelector } from "react-redux";
import { UpdateSubHeading } from "@/Redux/action";
import TerminationTable from "../Terminations/page";

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

  useEffect(() => {
    const Fetch = async () => {
      const RegisterdUsersResult = await GetRegidterdUsers();
      setUsers(RegisterdUsersResult || []);
      const PlacementInformation: any = await GetTimeSheetInfo();
      console.log("Test Adress-----",PlacementInformation)
      setClientsInformation(PlacementInformation);
      dispatch(UpdateSubHeading("On Service"));
      setIsChecking(false);
    };
    Fetch();
  }, [ActionStatusMessage]);

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
      Address:each.Address,
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




    };
  });

  const Finel = users.map((each: any) => ({
    id: each.userId,
    FirstName: each.FirstName,
    AadharNumber: each.AadharNumber,
    Age: each.Age,
    userType: each.userType,
    Location: each.Location,
    Email: each.Email,
    Contact: each.ContactNumber,
    userId: each.userId,
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
           const DeleteTimeSheetData=await DeleteTimeSheet(deleteTargetId.Client_Id)
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
console.log("Check Finel Time Sheet---",ClientsInformation)
  const OmServiceView = () => {
    return (
      <div className="w-full flex flex-col gap-8 p-6 bg-gray-50">


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
    <div className="overflow-x-auto flex flex-col">
     <div className="flex justify-end w-full mb-2">
  <div className="flex items-center bg-white shadow-lg rounded-full px-4 py-2 w-[350px] border border-gray-200 focus-within:border-blue-500 transition duration-300">
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
      className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
      onChange={(e:any)=>setSearchResult(e.target.value)}
    />
  </div>
</div>


      <table className="w-full border-collapse rounded-2xl shadow-xl overflow-hidden bg-white">
        <thead className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white uppercase text-xs font-semibold sticky top-0 shadow-md">
          <tr>
            <th className="px-6 py-4 text-left">Client Name</th>
            <th className="px-6 py-4 text-left">Contact</th>
            <th className="px-6 py-4 text-left">Location</th>
            <th className="px-8 py-4 text-left">HCA Name</th>
            <th className="px-9 py-4 text-left">Status</th>
            <th className="px-8 py-4 text-left">Replacement</th>
           
            <th className="px-6 py-4 text-center">Time Sheet</th>
             <th className="px-8 py-4 text-left">Service Continue</th>
            <th className="px-6 py-4 text-center">Terminate</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {FilterFinelTimeSheet.reverse().map((c, i) => (
            <tr
              key={i}
              className="hover:bg-teal-50/30 transition-all border-b border-gray-100"
            >
              <td className="px-6 py-4 font-semibold text-gray-900">{c.name}</td>
              <td className="px-6 py-4 text-gray-700">{c.contact}</td>
              <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">{c.location}</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-[11.5px] rounded-md font-medium shadow-sm bg-white/70 border border-gray-200 flex items-center gap-1">
                  🩺 {c.HCA_Name} 👚
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 rounded-full bg-green-100/50 px-3 py-1 shadow-sm">
                  <CircleCheckBig className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs font-medium text-emerald-700">Active</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <select className="p-2 text-sm border cursor-pointer rounded-lg focus:ring-2 focus:ring-teal-300 outline-none transition w-[150px] bg-white/70 shadow-sm">
                  <option>Assign New HCA</option>
                  {HCA_List.map((each: any) => (
                    <option key={each.FirstName}>{each.FirstName}</option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  className="px-5 py-2 text-xs cursor-pointer font-medium bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white rounded-lg shadow-md transition"
                  onClick={() => UpdateClient_UserId(c.Client_Id,c.name)}
                >
                  View
                </button>
              </td>
                 <td className="px-6 py-4 text-center">
                <button
                  className="px-5 py-2 text-xs cursor-pointer font-medium bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white rounded-lg shadow-md transition"
                  onClick={() =>UpdatePopup(c)}
                >
                  Extend
                </button>
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  className="px-5 py-2 text-xs font-medium text-gray-800 rounded-lg shadow-md hover:bg-gray-100 transition"
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
        
        {ActionStatusMessage && (
          <div className="flex flex-col items-center justify-center gap-4 mt-4 bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 px-4 py-4">
            <div className="w-5 h-5 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-center text-red-500 font-semibold">
              {ActionStatusMessage}
            </p>
          </div>
        )}
      </div>
      
    </div>
}

  {showDeletePopup && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-[400px] text-center backdrop-blur-md border border-gray-200">
        <h2 className="text-xl font-bold mb-5">Confirm Delete Placement</h2>

 
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Reason:
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Choose a Reason --</option>
            <option value="Patient Expiry">Patient Expiry</option>
            <option value="Price Issue">Price Issue</option>
            <option value="Recovery">Recovery</option>
            <option value="Other">Other</option>
          </select>

          
          {selectedReason === "Other" && (
            <input
              type="text"
              placeholder="Enter custom reason"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="w-full mt-3 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        </div>

 
        <div className="flex justify-center gap-5 mt-6">
          {!isDeleteDisabled && (
            <button
              onClick={handleDelete}
              className="px-5 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition"
            >
              Yes
            </button>
          )}
          <button
            onClick={() => setShowDeletePopup(false)}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl shadow hover:bg-gray-300 transition"
          >
            No
          </button>
        </div>

  
        {ActionStatusMessage && (
          <div className="flex flex-col items-center justify-center gap-4 mt-4 bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 px-4 py-4">
            <div className="w-5 h-5 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-center text-red-500 font-semibold">
              {ActionStatusMessage}
            </p>
          </div>
        )}
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
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border p-2 rounded-md"
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const year = new Date().getFullYear() - 2 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>
    </div>

    <div className="grid grid-cols-7 gap-3 text-center">
      {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
        const day = dayIndex + 1;

        const record = TimeSheet_Info.TimeSheet?.find((t: any) => {
          const parsed = parseEnInDate(t.date);
          return (
            parsed.getDate() === day &&
            parsed.getMonth() === selectedMonth &&
            parsed.getFullYear() === selectedYear
          );
        });

        const today = new Date();
        const currentDate = new Date(selectedYear, selectedMonth, day);
        const isFuture = currentDate > today;

        const currentStatus =
          updatedAttendance?.[day]?.status || record?.status || "Absent";

        const statusColor =
          currentStatus === "Present"
            ? "bg-green-100 text-green-700 border-green-300"
            : currentStatus === "Absent"
            ? "bg-red-100 text-red-700 border-red-300"
            : "bg-yellow-100 text-yellow-700 border-yellow-300";

        // ✅ Update function with full date/day/time in Indian format
        const handleStatusClick = (day: number) => {
          if (isFuture) return;
          setSaveButton(true) 
          setUpdatedAttendance((prev: any) => {
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
setFineldate({...Fineldate, 
               date: formattedDate,
                day: formattedDay,
                updatedAt: updateTime,
                status: nextStatus,})
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

        const dayData = updatedAttendance?.[day];

        return (
          <div
            key={day}
            onClick={() => handleStatusClick(day)}
            className={`p-3 border rounded-lg flex flex-col items-center justify-center 
              ${isFuture ? "opacity-40 blur-[1px] cursor-not-allowed" : "cursor-pointer hover:scale-105"} 
              ${statusColor} 
              transition-transform`}
          >
            <span className="text-sm font-semibold">{day}</span>
            <span className="text-xs font-medium">{currentStatus}</span>

         
          </div>
        );
      })}
    </div>
{SaveButton&&<p
  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-900 md:mt-2 active:bg-indigo-800 transition-colors duration-200 cursor-pointer select-none"
  onClick={UpdateInformation}
>
  Save Attendance
</p>
}
    <div className="mt-5 text-right">
      <button
        onClick={() => setShowTimeSheet(false)}
        className="px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition"
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

  const CurrentUserInterfacevIew = () => {
    switch (SubHeading) {
      case "On Service":
        return OmServiceView();
      case "Termination":
        return <TerminationTable/>;
      case "Replacements":
        return <p>Currently Working</p>;
      default:
        return null;
    }
  };

  if (isChecking) {
    return (
     <div className="h-[50vh] mt-20 flex items-center justify-center">
  <div className="flex flex-col items-center justify-center gap-4 
                  bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl 
                  border border-gray-100 px-10 py-8">
    
    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent 
                    rounded-full animate-spin"></div>
    
    <p className="text-lg font-semibold text-gray-900 tracking-wide">
      Loading <span className="text-emerald-600">Please Wait...</span>
    </p>
  </div>
</div>

    );
  }

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  return <div>{CurrentUserInterfacevIew()}</div>;
};

export default ClientTable;
