'use client'

import { GetDeploymentInfo, UpdatehcpDailyAttendce, UpdateAttendence, UpdateMultipleAttendance } from "@/Lib/user.action"
import { useEffect, useState } from "react"
import { LoadingData } from "../Loading/page"
import { useSelector } from "react-redux"


const MissingAttendence = () => {
  const [AttendenceInfo, SetAttendenceInfo] = useState<any>([])
  const [isChecking, setisChecking] = useState<any>(true)
  const [StatusMessage, setStatusMessage] = useState("")
  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
  const TimeStampData = useSelector((state: any) => state.TimeStampInfo)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [ChooseMultiple,setChooseMultiple]=useState(true)
  const [selectedHCPIds,setselectedHCPIds]=useState<any>([])
  const [SearchResults,setSearchResults]=useState("")


  useEffect(() => {
    const Fetch = async () => {
      try {
        const PlacementInformation: any = await GetDeploymentInfo();
        SetAttendenceInfo(PlacementInformation)
        setisChecking(false)
      } catch (err: any) {
      }
    }

    Fetch()
  },[StatusMessage])
  const today = new Date().toISOString().split("T")[0];

 const result = AttendenceInfo.filter((item: any) => {
  const attendance = Array.isArray(item.Attendance)
    ? item.Attendance
    : [];


  const hasToday = attendance.some((a: any) => {
    if (!a?.AttendenceDate) return false;

    const dateOnly = new Date(a.AttendenceDate)
      .toISOString()
      .split("T")[0];

    return dateOnly === today;
  });

  
  const matchesSearch = SearchResults
    ? item.HCAName?.toLowerCase().includes(SearchResults.toLowerCase())
    : true;

 
  const isCurrentMonth = (() => {
    if (!item.StartDate) return false;

    const [day, month, year] = item.StartDate.split("/").map(Number);
    const startDate = new Date(year, month - 1, day);

    const now = new Date();
    return (
      startDate.getMonth() === now.getMonth() &&
      startDate.getFullYear() === now.getFullYear()
    );
  })();


  return !hasToday && matchesSearch && isCurrentMonth;
});


  const UpdateCurrentAttendence = async () => {
    try {
      setStatusMessage("Please Wait...")
      const UpdateDailyattendece = await UpdatehcpDailyAttendce(selectedYear, selectedMonth)
      if (UpdateDailyattendece.success === true) {
        setStatusMessage("HCPs Today's Attendance Updated Succesfully ✅")
      }

    } catch (err: any) {

    }
  }

  const handleUpdate = async (A: any) => {

    setStatusMessage("Please Wait...")
    try {
      const AttendenceUpdateResult: any = await UpdateAttendence(
        A,
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




    } catch (err) {

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
  console.log("Test Selected HCP Id's---",result)
  if (isChecking) {
    return <LoadingData />
  }
  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold text-center text-[#ff1493] mb-6">
        HCP's Without Today's Attendance ( {new Date().toLocaleDateString("En-In")} )
      </h2>
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


      {result.length === 0 ? (
        <p className="text-green-600 font-semibold text-center">
          🎉 All HCPs have marked attendance today!
        </p>
      ) : (
        <div className=" flex flex-col overflow-x-auto shadow-xl rounded-xl  border-gray-200">
          <div className="flex justify-between">
            {StatusMessage && <p className={`mb-2 text-sm font-medium px-2 py-2 rounded-lg ${StatusMessage?.includes("success") || StatusMessage?.includes("✅")
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
              }`}>{StatusMessage}</p>}
              <div className="flex gap-2">
                <button className=" p-2  shadow-lg  bg-[#1392d3] text-white rounded-md cursor-pointer m-2 text-xs" onClick={UpdateCurrentAttendence}>Check In All HCP's</button>
                <button className=" p-2  shadow-lg  bg-[#cbd5e1] text-grey-800 rounded-md cursor-pointer m-2 text-xs" onClick={()=>{if(ChooseMultiple){ setChooseMultiple(false);}else{ UpdateMultipleAttendence(); setChooseMultiple(true);}}}>{ChooseMultiple?"Select Multiple HCP's":"Check In Selected HCP's"}</button>
              </div>
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

          <td className="py-3 px-4 flex items-center justify-center text-gray-700">
            {ChooseMultiple && (
              <button
                className="bg-teal-800 text-white px-6 py-2 rounded-md
                           font-medium hover:opacity-90 active:scale-95 transition"
                onClick={() => handleUpdate(item.HCAId)}
              >
                ✔ {item.HCAName}'s Attendance Check-in
              </button>
            )}

            {!ChooseMultiple && (
              <input
                type="checkbox"
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
}


export default MissingAttendence