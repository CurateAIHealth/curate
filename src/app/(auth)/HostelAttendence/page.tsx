"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  BedDouble,
  Filter,
  Pencil,
  Eye,
} from "lucide-react";
import { GetHostelAttendenceData, GetRegidterdUsers, GetUsersFullInfo, UpdateHostelAttendence, UpdateWholeTeamHostelAttendence } from "@/Lib/user.action";
import { inflate } from "zlib";
import { AttendanceCalendarModal } from "@/Components/HostelAttendecePreview/page";



const stats = [
  {
    label: "Total Residents",
    value: 128,
    icon: Users,
    color: "from-[#1392d3] to-[#50c896]",
  },
  {
    label: "Present",
    value: 96,
    icon: CheckCircle,
    color: "from-[#50c896] to-emerald-600",
  },
  {
    label: "Absent",
    value: 22,
    icon: XCircle,
    color: "from-[#ff1493] to-rose-600",
  },
  {
    label: "Pending",
    value: 10,
    icon: Clock,
    color: "from-[#1392d3] to-sky-600",
  },
];

const attendanceData = [
  { UserId: 1, Name: "Meena", status: "Present" },
  { UserId: 2, Name: "Siddharth", status: "Absent" },
  { UserId: 3, Name: "Pramela Mam", status: "Pending" },
];

export default function HostelAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [Infodata, setData] = useState<any>(attendanceData);
  const [HCP_List,setHCPList]=useState<any>()
  const [stausMessage,setstausMessage]=useState<any>(null)
  const [EditStatus,setEditStatus]=useState(false)
  const [CurrentIndex,setCurrentIndex]=useState<any>(0)
const [showCalendar, setShowCalendar] = useState(false);
const [calendarUser, setCalendarUser] = useState<any>(null);
const [calendarMonth, setCalendarMonth] = useState(new Date());

type AttendanceItem = {
  date: any;
  status: any;
};

useEffect(() => {
  const Fetch = async () => {
    const [attendanceRes, usersRes] = await Promise.all([
      GetHostelAttendenceData(),
      GetUsersFullInfo(),
    ]);

 
    const attendanceList: any[] = Array.isArray(attendanceRes?.data)
      ? attendanceRes.data
      : [];

    const today = new Date().toISOString().split("T")[0];

    const formatted = usersRes
      ?.map((u: any) => u.HCAComplitInformation)
      ?.filter((u: any) => !u?.Status?.includes("Assigned"))
      ?.map((user: any) => {
        
        const userAttendanceDoc = attendanceList.find(
          (a: any) => a.UserId === user.UserId
        );

       
        const todayAttendance = userAttendanceDoc?.attendance?.find(
          (a: any) => a.date === selectedDate
        );

        return {
          UserId: user.UserId,
          Name: `${user.HCPFirstName} ${user.HCPSurName}`,
          status:todayAttendance?.status || "Attendece Not Updated",
        };
      });

    setHCPList(formatted || []);
    setData(formatted || []);
  };

  Fetch();
}, [selectedDate,stausMessage]);










const UpdateAttendence = async (name: any, Id: any, AttendanceVaue: any) => {
  const res:any = await UpdateHostelAttendence(Id, name, AttendanceVaue,selectedDate);

  if (res.success) {
    setstausMessage("Attendance marked successfully ✅");
    setEditStatus(false)
    return;
  }

  if (res.warning) {
    setstausMessage("⚠️ Attendance already marked for Selected Day");
    return;
  }

  setstausMessage("❌ Failed to mark attendance");
};

console.log("Checkk0-------",Infodata)


const UpdateWholeAttendece=async()=>{
try{
  const teamUsers = Infodata.map((row: any) => ({
  UserId: row.UserId,
  Name: row.Name,
  UpdatedStatus: "Present", 
}));

  const res:any=await UpdateWholeTeamHostelAttendence(teamUsers,selectedDate)
    if (res.success) {
    setstausMessage("Attendance marked successfully ✅");
    setEditStatus(false)
    return;
  }

  if (res.warning) {
    setstausMessage("⚠️ Attendance already marked for Selected Day");
    return;
  }

  setstausMessage("❌ Failed to mark attendance");
}catch(err:any){

}
}


  return (
    <div className="min-h-screen bg-slate-50 p-2">
 
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <BedDouble className="w-7 h-7 text-emerald-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Hostel Attendance
            </h1>
            <p className="text-sm text-slate-500">
              Track hostel attendance by specific date
            </p>
          </div>
        </div>

   
          

            <img
              src="https://curate-pearl.vercel.app/Icons/UpdateCurateLogo.png"
              alt="Curate Health Services Logo"
              className="h-16 md:h-24 w-auto object-contain mx-auto md:mx-0"
            />
       
    
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl p-5 text-white bg-gradient-to-tr ${item.color} shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{item.label}</p>
                <h2 className="text-3xl font-bold mt-1">{item.value}</h2>
              </div>
              <item.icon className="w-10 h-10 opacity-80" />
            </div>
          </div>
        ))}
      </div>


      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 border-b">
          <h3 className="font-semibold text-slate-800">Daily Attendance List</h3>
          <div className="flex gap-2">
            <button
              onClick={UpdateWholeAttendece}
              
              className="px-4 py-2 rounded-lg text-white text-sm cursor-pointer hover:shadow-lg"
              style={{ backgroundColor: "#50c896" }}
            >
              Mark All Present
            </button>
           
          </div>
          {stausMessage && (
        <p
  className={`
    mt-2 px-4 py-2 rounded-lg text-sm font-medium w-fit
    ${stausMessage?.includes("successfully") && "bg-green-100 text-green-700 border border-green-300"}
    ${stausMessage?.includes("already") && "bg-yellow-100 text-yellow-700 border border-yellow-300"}
    ${stausMessage?.includes("Failed") && "bg-red-100 text-red-700 border border-red-300"}
  `}
>
  {stausMessage}
</p>
)}

             <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white cursor-pointer hover:shadow-lg"
          />
          <button className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
{showCalendar && calendarUser && (
  <AttendanceCalendarModal
    user={calendarUser}
    onClose={() => setShowCalendar(false)}
  />
)}

        <table className="w-full text-sm">
          <thead className="text-white" style={{ backgroundColor: "#50c896" }}>
            <tr>
              <th className="p-3">#</th>
              <th className="p-3 text-left">Name</th>
              
              <th className="p-3 text-left">Status</th>
               <th className="p-3 text-left">Edit Attendece</th>
                <th className="p-3 text-left">View Full Attendece</th>
            </tr>
          </thead>
          <tbody>
            {Infodata.map((row:any, i:any) => (
              <tr key={row.UserId} className="border-b last:border-none">
                <td className="p-3 text-center">{i + 1}</td>
                <td className="p-3 font-medium">{row.Name}</td>
                <td className="p-3">
                  {row.status==="Attendece Not Updated"?
                  <select
                    defaultValue={row.status}
                    onChange={(e:any)=>UpdateAttendence(row.Name,row.UserId,e.target.value)}
                    className="px-3 py-2 rounded-lg border text-sm font-semibold cursor-pointer hover:shadow-lg"
                   style={{
  borderColor:
    row.status === "Attendece Not Updated"
      ? "#ffc800ff" 
      : row.status === "Present"
      ? "#50c896"
      : row.status === "Absent"
      ? "#ff1493"
      : "#1392d3",

  color:
    row.status === "Attendece Not Updated"
      ? "#edbb09ff" 
      : row.status === "Present"
      ? "#50c896"
      : row.status === "Absent"
      ? "#ff1493"
      : "#1392d3",
}}

                  >
                     <option value="Attendece Not Updated">Attendece Not Updated</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Pending">Pending</option>
                  </select>:
                  <p
  style={{
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    border: "1px solid",
    fontWeight: 700,          
    fontSize: "11px",
    letterSpacing: "0.4px",
    textTransform: "capitalize",

    backgroundColor:
      row.status === "Attendece Not Updated"
        ? "#ffe6e6"
        : row.status === "Present"
        ? "#e8f7f1"
        : row.status === "Absent"
        ? "#fdeaea"
        : "#eaf4fb",

    borderColor:
      row.status === "Attendece Not Updated"
        ? "#ff4d4f"
        : row.status === "Present"
        ? "#50c896"
        : row.status === "Absent"
        ? "#e11d48"
        : "#1392d3",

    color:
      row.status === "Attendece Not Updated"
        ? "#c53030"
        : row.status === "Present"
        ? "#047857"
        : row.status === "Absent"
        ? "#ff4d4f"
        : "#0369a1",
  }}
>
  {row.status}
</p>

                  }
                </td>
               <td className="pl-10">
  {EditStatus && CurrentIndex === i ? (
    <div className="flex items-center gap-4">
      {["Present", "Absent", "Pending"].map((status) => (
        <label
          key={status}
          className="flex items-center gap-2 cursor-pointer text-sm font-semibold"
          style={{
            color:
              status === "Present"
                ? "#50c896"
                : status === "Absent"
                ? "#ff1493"
                : "#1392d3",
          }}
        >
          <input
            type="checkbox"
            checked={row.status === status}
            onChange={() => {
              UpdateAttendence(
                row.Name,
                row.UserId,
                status
              );
              setEditStatus(false);
              setCurrentIndex(null);
            }}
            className="cursor-pointer accent-current"
          />
          {status}
        </label>
      ))}
    </div>
  ) : (
    <Pencil
      className="cursor-pointer"
      onClick={() => {
        setEditStatus(true);
        setCurrentIndex(i);
        setstausMessage(null);
      }}
    />
  )}
</td>

                <td className="pl-10 cursor-pointer">
  <Eye
    className="text-slate-600 hover:text-emerald-600"
    onClick={() => {
      setCalendarUser(row);
      setShowCalendar(true);
    }}
  />
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
