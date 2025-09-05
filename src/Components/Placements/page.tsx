"use client";
import React, { useEffect, useState } from "react";
import { CircleCheckBig, Trash } from "lucide-react";
import { DeleteTimeSheet, GetRegidterdUsers, GetTimeSheetInfo, InserTerminationData, InserTimeSheet, UpdateHCAnstatus, UpdateUserContactVerificationstatus } from "@/Lib/user.action";
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

const ClientTable = () => {
  const [ClientsInformation, setClientsInformation] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [TimeSheet_UserId, setTimeSheet_UserId] = useState("");
  const [showTimeSheet, setShowTimeSheet] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTargetId, setDeleteTargetId] =  useState<any>();
  const [ActionStatusMessage,SetActionStatusMessage]= useState<any>();

  const SubHeading = useSelector((state: any) => state.SubHeadinList);
  const dispatch = useDispatch();

  useEffect(() => {
    const Fetch = async () => {
      const RegisterdUsersResult = await GetRegidterdUsers();
      setUsers(RegisterdUsersResult || []);
      const PlacementInformation: any = await GetTimeSheetInfo();
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
      HCA_Id: each.HCAiD,
      name: each.ClientName,
      email: each.ClientEmail,
      contact: each.ClientContact,
      HCAContact:each.HCAContact,
      role: each.HCAName,
      location: each.Adress,
      TimeSheet: normalizedAttendance,

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
  }));

  const UpdateClient_UserId = (id: any) => {
    setTimeSheet_UserId(id);
    setShowTimeSheet(true);
  };

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

  const confirmDelete = async() => {
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

  const OmServiceView = () => {
    return (
      <div className="overflow-x-auto">
        {ClientsInformation.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-6 h-[50vh] mt-10 
                 backdrop-blur-md rounded-3xl  border border-gray-100 p-10">
  
  <p className="text-xl font-semibold text-gray-900 text-center tracking-wide">
    ✨ Sorry to Inform You, <span className="text-emerald-600">No Placements Available</span>
  </p>
  
  <p className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 
                px-6 py-3 rounded-full shadow-md text-sm font-medium tracking-wide">
    🔎 Check <span className="font-semibold text-emerald-900">Terminations</span> for Previous Placements
  </p>
  
</div>

        ) : (
          <div className="h-[500px] overflow-y-auto rounded-lg shadow">
          
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white uppercase text-xs font-semibold sticky top-0 z-10 shadow">
                <tr>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-8 py-4">HCA Name</th>
                  <th className="px-9 py-4">Status</th>
                  <th className="px-8 py-4">Replacement</th>
                  <th className="px-6 py-4 text-center">Time Sheet</th>
                  <th className="px-6 py-4 text-center">Delete Placcement</th>
                </tr>
              </thead>
              <tbody>
                {FinelTimeSheet.map((c, i) => (
                  <tr
                    key={i}
                    className="hover:bg-teal-50/50 transition-all border-b border-gray-100"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{c.contact}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">
                      {c.location}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs rounded-md font-medium shadow-sm">
                        🩺 {c.role} 👚
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 shadow-sm">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600" />
                        <p className="text-xs font-medium text-emerald-700">
                          Active
                        </p>
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
                        onClick={() => UpdateClient_UserId(c.Client_Id)}
                      >
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="px-5 py-2 text-xs cursor-pointer font-medium text-gray-800 rounded-lg shadow-md transition"
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


        {showDeletePopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] text-center">
              <h2 className="text-lg font-semibold mb-4">
                Are you Sure Want to Delete Placement ?
              </h2>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
                >
                  No
                </button>
              </div>
                {ActionStatusMessage&&   
         <div className="flex flex-col items-center justify-center gap-4 mt-2
                  bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl 
                  border border-gray-100 px-4 py-4">
    
    <div className="w-4 h-4 border-4 border-emerald-500 border-t-transparent 
                    rounded-full animate-spin"></div>
    
    <p className="text-center text-red-500 font-semibold">{ActionStatusMessage}</p>
  </div>}
            </div>
          </div>
        )}

      
        {showTimeSheet && TimeSheet_Info && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[750px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
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
                  const status: AttendanceStatus = record?.status || "Absent";
                  const statusColor =
                    status === "Present"
                      ? "bg-green-100 text-green-700 border-green-300"
                      : status === "Absent"
                      ? "bg-red-100 text-red-700 border-red-300"
                      : status === "Leave"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                      : "bg-blue-100 text-blue-700 border-blue-300";
                  return (
                    <div
                      key={day}
                      onClick={() => handleStatusClick(day)}
                      className={`p-3 border rounded-lg flex flex-col items-center justify-center cursor-pointer ${statusColor}`}
                    >
                      <span className="text-sm font-semibold">{day}</span>
                      <span className="text-xs">{status}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 text-right">
                <button
                  onClick={() => setShowTimeSheet(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
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
