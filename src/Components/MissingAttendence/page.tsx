'use client'
let cachedDeploymentInfo: any = null;
import { GetDeploymentInfo, UpdatehcpDailyAttendce, UpdateAttendence, UpdateMultipleAttendance, EditAttendanceByClientId } from "@/Lib/user.action"
import { useEffect, useState } from "react"
import { LoadingData } from "../Loading/page"
import { useSelector } from "react-redux"



const MissingAttendence = () => {
  const [AttendenceInfo, SetAttendenceInfo] = useState<any>([])
  const [isChecking, setisChecking] = useState<any>(true)
  const [StatusMessage, setStatusMessage] = useState("")
  const now = new Date();
  const currentYear = now.getFullYear().toString()
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
  const TimeStampData = useSelector((state: any) => state.TimeStampInfo)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [ChooseMultiple,setChooseMultiple]=useState(true)
  const [selectedHCPIds,setselectedHCPIds]=useState<any>([])
  const [SearchResults,setSearchResults]=useState("")


const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

const selectedDateObject = new Date(selectedDate);


useEffect(() => {
  let mounted = true;

  const isInitialLoad = StatusMessage === "";
  const isSuccessUpdate = StatusMessage?.includes("Successfully");

  if (!isInitialLoad && !isSuccessUpdate) return;

  const fetchFreshData = async () => {
    try {
      // Use cache instantly
      if (!isSuccessUpdate && cachedDeploymentInfo?.length) {
        SetAttendenceInfo(cachedDeploymentInfo);
        return;
      }

      setisChecking(true);

      const deploymentData = await GetDeploymentInfo();

      if (!mounted) return;

      cachedDeploymentInfo = deploymentData ?? [];
      SetAttendenceInfo(cachedDeploymentInfo);

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      if (mounted) setisChecking(false);
    }
  };

  fetchFreshData();

  return () => {
    mounted = false;
  };
}, [StatusMessage]);

	
const normalizeDate = (value: any) => {
  if (!value) return "";

  // If already in YYYY-MM-DD format
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // If in DD/MM/YYYY format
  if (typeof value === "string" && value.includes("/")) {
    const [day, month, year] = value.split("/");
    if (year && month && day) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }


  const d = new Date(value);

  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
 const result = AttendenceInfo.filter((item: any) => {
  const attendance = Array.isArray(item.Attendance)
    ? item.Attendance
    : [];



const hasToday = attendance.some((a: any) =>
  normalizeDate(a?.dateKey || a?.AttendenceDate) === normalizeDate(selectedDate)
);

  
  
  const matchesSearch = SearchResults
    ? item.HCAName?.toLowerCase().includes(SearchResults.toLowerCase())
    : true;

 
  const isCurrentMonth = (() => {
  if (!item.StartDate) return false;

  const [day, month, year] = item.StartDate.split("/").map(Number);
  const startDate = new Date(year, month - 1, day);

  const selected = new Date(selectedDate);

  return (
    startDate.getMonth() === selected.getMonth() &&
    startDate.getFullYear() === selected.getFullYear()
  );
})();


  return !hasToday && matchesSearch && isCurrentMonth;
});

const UpdateCurrentAttendence = async () => {
  setStatusMessage("Please Wait...");


      const UpdateDailyattendece = await UpdatehcpDailyAttendce(
      selectedYear,
      selectedMonth,
      selectedDate
    );

  if (UpdateDailyattendece.success) {
    setStatusMessage("HCPs Attendance Updated Successfully ✅");
  }
};
;
 const handleUpdate = async (A: any,B:any) => {
  setStatusMessage("Please Wait...");

  try {
    const flexDate = `${selectedYear}-${selectedMonth}-${String(
       new Date(selectedDate).getDate()
    ).padStart(2, "0")}`;
    console.log("First Check-----",`${selectedYear}-${selectedMonth}`)
    console.log("Second Check----",flexDate)
    const AttendenceUpdateResult: any = await EditAttendanceByClientId(
      A,
      B,
      `${selectedYear}-${selectedMonth}`, 
      flexDate,                      
      "FULL",
      TimeStampData
    );

    if (AttendenceUpdateResult.success) {
      setStatusMessage(AttendenceUpdateResult.message);
    
    }
  } catch (err) {
    console.error(err);
    setStatusMessage("Something went wrong");
  }
};

  const UpdateMultipleAttendence=async()=>{
    try{
      setStatusMessage("Please Wait.....")
console.log("Check for Ids----",selectedHCPIds)
const AttendenceUpdateResult: any = await UpdateMultipleAttendance(
        selectedHCPIds,
        `${currentYear}-${currentMonth}`,
        {
          HCPAttendence: true,
          AdminAttendece: true
        },
        TimeStampData
      );

      if (AttendenceUpdateResult.success === true) {
        setStatusMessage(AttendenceUpdateResult.message)
      }
    }catch(err:any){

    }
  }

  if (isChecking) {
    return <LoadingData />
  }
  return (
    <div className="p-6 w-full">
   <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
        HCPs Without Attendance {selectedYear} {Number(selectedMonth)}
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        {new Date(selectedDate).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>

    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-600 font-medium">
        Select Date
      </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e:any) =>{ setSelectedDate(e.target.value); setSelectedYear(new Date(e.target.value).getFullYear().toString());setSelectedMonth(String(new Date(e.target.value).getMonth() + 1).padStart(2, "0"))}}
        className="
          rounded-lg 
          border border-gray-300 
          bg-white 
          px-3 py-2 
          text-sm 
          text-gray-700
          focus:outline-none
          focus:ring-2 focus:ring-[#1392d3]/40
          focus:border-[#1392d3]
          transition
        "
      />
    </div>

  </div>
</div>
  {result.length !== 0&&
<div className="w-full flex items-center justify-between">
           
                <button className=" p-2  shadow-lg  bg-[#1392d3] text-white rounded-md cursor-pointer m-2 text-xs" onClick={UpdateCurrentAttendence}>Check In All HCP's </button>
                {/* <button className=" p-2  shadow-lg  bg-[#cbd5e1] text-grey-800 rounded-md cursor-pointer m-2 text-xs" onClick={()=>{if(ChooseMultiple){ setChooseMultiple(false);}else{ UpdateMultipleAttendence(); setChooseMultiple(true);}}}>{ChooseMultiple?"Select Multiple HCP's":"Check In Selected HCP's"}</button> */}
              
                   <div className="relative w-full max-w-sm">
  <input
    type="search"
    placeholder="Search..."
    onChange={(e)=>setSearchResults(e.target.value)}
    className="
      w-full
      rounded-lg
      border border-gray-300
      bg-white
      px-4 py-2
      pr-10
      text-sm
      text-gray-700
      placeholder-gray-400
      focus:border-[#1392d3]
      focus:ring-2 focus:ring-[#1392d3]/30
      outline-none
      transition
    "
  />

  <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
    🔍
  </span>
</div>
              </div>}

      {result.length === 0 ? (
        <p className="text-green-600 font-semibold text-center">
          🎉 All HCPs have marked attendance !
        </p>
      ) : (
        <div className=" flex flex-col overflow-x-auto shadow-xl rounded-xl  border-gray-200">
          <div className="flex justify-between">
            {StatusMessage && <p className={`mb-2 text-sm font-medium px-2 py-2 rounded-lg ${StatusMessage?.includes("success") || StatusMessage?.includes("✅")
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
              }`}>{StatusMessage}</p>}
              
          </div>
          <div className="max-h-[500px] overflow-y-auto border rounded-lg">
  <table className="w-full text-center border-collapse">
    <thead className="bg-[#50c896] text-white text-sm uppercase tracking-wide sticky top-0 z-10">
      <tr>
        <th className="py-3 px-4">#</th>
        <th className="py-3 px-4">HCP Name</th>
        <th className="py-3 px-4">Contact</th>
        <th className="py-3 px-4">Client Name</th>
        <th className="py-3 px-4">Status</th>
        <th className="py-3 px-4">Action</th>
      </tr>
    </thead>

    <tbody className="bg-white">
      {result.map((item: any, index: number) => (
        <tr
          key={index}
          className="border-b hover:bg-gray-50 transition"
        >
          <td className="py-3 px-4 font-semibold text-gray-700">
            {index + 1}
          </td>

          <td className="py-3 px-4 text-[#1392d3] font-medium">
            {item.HCAName}
          </td>

          <td className="py-3 px-4">
            {item.HCAContact || "Not Available"}
          </td>

          <td className="py-3 px-4 text-gray-700">
            {item.ClientName}
          </td>

          <td className="py-3 px-4">
            <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 font-semibold">
              Pending
            </span>
          </td>
      {item.Status==="Freeze"?<button className="mt-2 inline-flex items-center px-3 py-1 text-xs font-bold tracking-wide text-red-700 bg-purple-100 rounded-md shadow-sm">
  ❄ On Freeze
</button>:
          <td className="py-3 px-4 flex items-center justify-center text-gray-700">
            {ChooseMultiple && (

        
              <button
                className="bg-teal-800 text-white px-6 py-2 rounded-md
                           font-medium hover:opacity-90 active:scale-95 transition"
                onClick={() => handleUpdate(item.ClientId,item.HCAId)}
              >
                ✔ {item.HCAName}'s Attendance Check-in
              </button>
            )}

            {!ChooseMultiple && (
              <input
                type="radio"
                className="h-5 w-5 cursor-pointer accent-[#1392d3]"
                onChange={(e) => {
                  setselectedHCPIds((prev: any) =>
                    e.target.checked
                      ? [...prev, item.HCAId]
                      : prev.filter((id: any) => id !== item.HCAId)
                  );
                }}
              />
            )}
          </td>}
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </div>
      )}
    </div>
  );
}


export default MissingAttendence