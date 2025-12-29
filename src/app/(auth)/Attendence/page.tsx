"use client";

import { GetUserInformation, UpdateAttendence, } from "@/Lib/user.action";
import { UpdateTimeStamp } from "@/Redux/action";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function UpdateAttendance() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null);
  const now = new Date();
const currentYear = now.getFullYear().toString();
const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

   const dispatch=useDispatch()
   const TimeStampData=useSelector((state:any)=>state.TimeStampInfo)
  useEffect(() => {
     const Fetch = async () => {
       const localValue = localStorage.getItem('UserId');
 
       const Sign_in_UserInfo = await GetUserInformation(localValue)
 
       dispatch(UpdateTimeStamp(`${Sign_in_UserInfo?.FirstName} ${Sign_in_UserInfo?.LastName}, Email: ${Sign_in_UserInfo?.Email}`))
     }
     Fetch()
   }, [])
  const hcpId = "72934d29-9c06-4d28-a1bb-8776b30adeaf";
  const Month = "2025-11";
  const UpdatedBy = "Admin";

  const handleUpdate = async () => {
    if (!status) return alert("Please select a status");
    setLoading(true);
    setResponse(null);

    try {
      const AttendenceUpdateResult:any=await  UpdateAttendence(
  "72934d29-9c06-4d28-a1bb-8776b30adeaf", 
  `${currentYear}-${currentMonth}`,                              
  {
    HCPAttendence: true,
    AdminAttendece: false
  },
TimeStampData
);

     
    setResponse(AttendenceUpdateResult);
      
      
    } catch (err) {
      setResponse({
        success: false,
        message: "Something went wrong while updating attendance.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-8 transition-all duration-300 hover:shadow-blue-200">
        <h2 className="text-2xl font-semibold text-[#ff1493] text-center mb-6">
          🩺 Update Your Attendance
        </h2>

       
        <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4 shadow-inner">
          <button
            onClick={() => setStatus("P")}
            className={`w-1/2 mr-2 py-3 text-center font-medium cursor-pointer rounded-xl border-2 transition-all duration-300 ${
              status === "P"
                ? "bg-green-500 text-white border-green-600"
                : "border-green-400 text-green-600 hover:bg-green-100"
            }`}
          >
            Present
          </button>

          <button
            onClick={() => setStatus("A")}
            className={`w-1/2 ml-2 py-3 text-center font-medium cursor-pointer rounded-xl border-2 transition-all duration-300 ${
              status === "A"
                ? "bg-red-500 text-white border-red-600"
                : "border-red-400 text-red-600 hover:bg-red-100"
            }`}
          >
            Absent
          </button>
              <button
            onClick={() => setStatus("L")}
            className={`w-1/2 ml-2 py-3 text-center font-medium cursor-pointer rounded-xl border-2 transition-all duration-300 ${
              status === "L"
                ? "bg-yellow-500 text-white border-yellow-600"
                : "border-yellow-400 text-yellow-600 hover:bg-yellow-100"
            }`}
          >
            Leave
          </button>
        </div>

    
        <button
          onClick={handleUpdate}
          disabled={loading || !status}
          className="mt-6 w-full py-3 bg-blue-600 cursor-pointer text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-300"
        >
          {loading ? " Please Wait Updating..." : "Update Attendance"}
        </button>

   
        {response && (
          <div
            className={`mt-6 text-center text-sm font-medium ${
              response.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {response.message}
          </div>
        )}

  
        <div className="mt-8 text-center bg-gray-50 p-4 rounded-xl text-sm text-gray-600 border border-gray-100">
        
          <p>
            <span className="font-medium text-gray-700">HCA ID:</span> {hcpId}
          </p>
          <p>
            <span className="font-medium text-gray-700">Month:</span> {Month}
          </p>
          <p>
            <span className="font-medium text-gray-700">Updated By:</span> {UpdatedBy}
          </p>
        </div>
      </div>
    </div>
  );
}
