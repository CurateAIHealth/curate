"use client";
import React, { useEffect, useState } from "react";
import { CircleCheckBig } from "lucide-react";
import { GetRegidterdUsers, GetTimeSheetInfo } from "@/Lib/user.action";
import { useSelector } from "react-redux";

const clients = [
    {
        name: "md",
        email: "siddFirst@gmail.com",
        contact: "9631457951",
        role: "Sunil",
        aadhar: "464651321654",
        location: "hyd",
        emailVerification: "Active",
        action: "Fill",
    },
    {
        name: "Iqbalunnisa",
        email: "mfirasath@gmail.com",
        contact: "9989190986",
        role: "Curate",
        aadhar: "882470629866",
        location: "165, CSK Villas, Rallaguda RD, Shamshabad, Hyderabad",
        emailVerification: "Active",
        action: "View",
    },
    {
        name: "Balaram",
        email: "vasudev1096@gmail.com",
        contact: "9810651430",
        role: "Gouri",
        aadhar: "646254100829",
        location: "B1105, Vajra Jasmine County, Nanakramguda",
        emailVerification: "Active",
        action: "View",
    },
    {
        name: "Balaram",
        email: "vasudev1096@gmail.com",
        contact: "9810651430",
        role: "Gouri",
        aadhar: "646254100829",
        location: "B1105, Vajra Jasmine County, Nanakramguda",
        emailVerification: "Active",
        action: "View",
    }, {
        name: "Balaram",
        email: "vasudev1096@gmail.com",
        contact: "9810651430",
        role: "Gouri",
        aadhar: "646254100829",
        location: "B1105, Vajra Jasmine County, Nanakramguda",
        emailVerification: "Active",
        action: "View",
    }, {
        name: "Balaram",
        email: "vasudev1096@gmail.com",
        contact: "9810651430",
        role: "Gouri",
        aadhar: "646254100829",
        location: "B1105, Vajra Jasmine County, Nanakramguda",
        emailVerification: "Active",
        action: "View",
    }, {
        name: "Balaram",
        email: "vasudev1096@gmail.com",
        contact: "9810651430",
        role: "Gouri",
        aadhar: "646254100829",
        location: "B1105, Vajra Jasmine County, Nanakramguda",
        emailVerification: "Active",
        action: "View",
    }, {
        name: "Balaram",
        email: "vasudev1096@gmail.com",
        contact: "9810651430",
        role: "Gouri",
        aadhar: "646254100829",
        location: "B1105, Vajra Jasmine County, Nanakramguda",
        emailVerification: "Active",
        action: "View",
    }, {
        name: "Balaram",
        email: "vasudev1096@gmail.com",
        contact: "9810651430",
        role: "Gouri",
        aadhar: "646254100829",
        location: "B1105, Vajra Jasmine County, Nanakramguda",
        emailVerification: "Active",
        action: "View",
    }, {
        name: "Balaram",
        email: "vasudev1096@gmail.com",
        contact: "9810651430",
        role: "Gouri",
        aadhar: "646254100829",
        location: "B1105, Vajra Jasmine County, Nanakramguda",
        emailVerification: "Active",
        action: "View",
    }, {
        name: "Balaram",
        email: "vasudev1096@gmail.com",
        contact: "9810651430",
        role: "Gouri",
        aadhar: "646254100829",
        location: "B1105, Vajra Jasmine County, Nanakramguda",
        emailVerification: "Active",
        action: "View",
    }, {
        name: "Balaram",
        email: "vasudev1096@gmail.com",
        contact: "9810651430",
        role: "Gouri",
        aadhar: "646254100829",
        location: "B1105, Vajra Jasmine County, Nanakramguda",
        emailVerification: "Active",
        action: "View",
    }, {
        name: "Balaram",
        email: "vasudev1096@gmail.com",
        contact: "9810651430",
        role: "Gouri",
        aadhar: "646254100829",
        location: "B1105, Vajra Jasmine County, Nanakramguda",
        emailVerification: "Active",
        action: "View",
    },
];

const ClientTable = () => {
    const [ClientsInformation,setClientsInformation]=useState([])
     const [isChecking, setIsChecking] = useState(true);
      const [users, setUsers] = useState<any[]>([]);
  
    useEffect(() => {
        const Fetch = async () => {
            const RegisterdUsersResult = await GetRegidterdUsers();
            setUsers(RegisterdUsersResult || []);
            const PlacementInformation:any = await GetTimeSheetInfo()
            setClientsInformation(PlacementInformation)
           setIsChecking(false)
        }
        Fetch()
    })

    const FinelTimeSheet=ClientsInformation.map((each:any)=>({
        name: each.ClientName,
        email: each.ClientEmail,
        contact: each.ClientContact,
        role:each.HCAName,
       location: each.Adress,  
    }))

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
    Status:each.Status
  }));

   const HCA_List=Finel.filter((each:any)=>{return each.userType==="healthcare-assistant"&& each.Status !== "Assigned"})

  if (isChecking) {
    return (
      <div className='h-screen flex items-center justify-center font-bold'>
        Loading....
      </div>
    );
  }
    return (
       <div className="overflow-x-auto">

            {ClientsInformation .length===0?<p className="flex items-center justify-center h-[80vh] font-semibold">Sorry to Inform You, Currently No Placements</p>:<div className="h-[500px] overflow-y-auto rounded-lg shadow">
                <table className="w-full text-sm text-left border-collapse">

                    <thead className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white uppercase text-xs font-semibold sticky top-0 z-10 shadow">
                        <tr>
                            <th className="px-6 py-4">Client Name</th>
                            {/* <th className="px-6 py-4">Email</th> */}
                            <th className="px-6 py-4">Contact</th>
                           <th className="px-6 py-4">Location</th>
                             <th className="px-8 py-4">HCA Name</th>
                            <th className="px-9 py-4">Status</th>
                            <th className="px-8 py-4">Replacement</th>
                            <th className="px-6 py-4 text-center">Time Sheet</th>
                        </tr>
                    </thead>

                    <tbody>
                        {FinelTimeSheet.map((c, i) => (
                            <tr
                                key={i}
                                className="hover:bg-teal-50/50 transition-all border-b border-gray-100"
                            >
                                <td className="px-6 py-4 font-semibold text-gray-900">{c.name}</td>
                                {/* <td className="px-6 py-4 text-gray-700">{c.email}</td> */}
                                <td className="px-6 py-4 text-gray-700">{c.contact}</td>
                                 <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">
                                    {c.location}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 text-xs  rounded-md font-medium shadow-sm">
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
                                    <select className="p-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-300 outline-none transition w-full bg-white/70 shadow-sm">
                                        <option>Assign New HCA</option>
                                        {HCA_List.map((each:any)=><option key={each.FirstName}>{each.FirstName}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="px-5 py-2 text-xs font-medium bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white rounded-lg shadow-md transition">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}
        </div>
        
        )}


export default ClientTable;
