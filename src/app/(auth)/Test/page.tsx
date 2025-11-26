'use client'

import { GetDeploymentInfo } from "@/Lib/user.action"
import { useEffect, useState } from "react"


const TestField = () => {
    const [AttendenceInfo,SetAttendenceInfo]=useState<any>([])
    useEffect(() => {
        const Fetch = async () => {
            try {
 const PlacementInformation: any = await GetDeploymentInfo();
SetAttendenceInfo(PlacementInformation)

            } catch (err: any) {

            }
        }

        Fetch()
    })
 const today = new Date().toISOString().split("T")[0];

    const result:any = AttendenceInfo.filter((item: { Attendance: { AttendenceDate: string | number | Date }[] }) => {
  const hasToday:any = item.Attendance?.some((a: { AttendenceDate: string | number | Date }) => {
    if (!a.AttendenceDate) return false;
    const dateOnly = new Date(a.AttendenceDate).toISOString().split("T")[0];
    return dateOnly === today;
  });

  return !hasToday;  
});

console.log("Test----",result)
 return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-[#ff1493] mb-6">
        HCPs Without Today's Attendance
      </h2>

      {result.length === 0 ? (
        <p className="text-green-600 font-semibold text-center">
          🎉 All HCPs have marked attendance today!
        </p>
      ) : (
        <div className=" flex flex-col overflow-x-auto shadow-xl rounded-xl border border-gray-200">
            <div className="flex justify-end">
            <button className=" p-2 border shadow-lg w-[120px] bg-[#1392d3] text-white rounded-md cursor-pointer m-2 text-xs">Mark Attendence</button>
            </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#50c896] text-white text-sm uppercase tracking-wide">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">HCP Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {result.map((item:any, index:any) => (
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


                  <td className="py-3 px-4 text-gray-700">{item.ClientName}</td>

                  <td className="py-3 px-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 font-semibold">
                      Pending
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


export default TestField