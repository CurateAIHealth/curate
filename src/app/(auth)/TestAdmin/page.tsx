
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import {
  User,
  Bell,
  Menu,
  X,
  Users,
  Clock,
  IndianRupee ,
  CreditCard,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { Update_Main_Filter_Status } from "@/Redux/action";

const tabs = [
  { name: "Client Enquiry", count: 35, icon: Users, growth: "+17%", color: "from-blue-400 to-blue-600" },
  { name: "Deployment", count: 55, icon: User, growth: "+5%", color: "from-teal-400 to-teal-600" },
  { name: "Timesheet", count: 45, icon: Clock, growth: "-8%", color: "from-pink-400 to-pink-600" },
  { name: "Referral Pay", count: 28, icon: IndianRupee , growth: "+12%", color: "from-purple-400 to-purple-600" },
];

const lineData = [
  { month: "Jan", value: 30 },
  { month: "Feb", value: 60 },
  { month: "Mar", value: 40 },
  { month: "Apr", value: 80 },
  { month: "May", value: 100 },
  { month: "Jun", value: 90 },
];

const barData = [
  { name: "Enquiries", value: 35 },
  { name: "Placements", value: 55 },
  { name: "Timesheets", value: 45 },
  { name: "Referral Pay", value: 28 },

];

const pieData = [
  { name: "Paid", value: 70 },
  { name: "Pending", value: 30 },
];

const COLORS = ["#34D399", "#F87171"];

export default function Dashboard() {
   const router = useRouter();
   const dispatch = useDispatch();
const RoutToAdminPage=(A:any)=>{
router.push("/AdminPage");
 dispatch(Update_Main_Filter_Status(A))
}
const UpdateNewLead=()=>{
    router.push("/NewLead")
  }
 const handleLogout = () => {
    localStorage.removeItem('UserId');
    router.push('/');
  };
  return (
    <div className="flex h-screen bg-gray-100">
 

  
      <div className="flex-1 flex flex-col">

        <header className="flex justify-between items-center bg-gray-400 text-white px-6 py-3 shadow-md">
          {/* <h1 className="text-lg font-semibold">{activeTab}</h1> */}
            <div className="flex items-center gap-2">
              <img
               src="/Icons/Curate-logo.png"
                alt="user"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:inline text-sm font-medium">
              Hi Admin – Welcome to Admin Dashboard
              </span>
            </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-gray-800 px-3 py-1 rounded-lg">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm px-2 text-white"
              />
            </div>
            <button className="relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
          >
            <LogOut size={20} /> Logout
          </button>
          </div>
        </header>

     
        <main className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
     
          <div className="lg:col-span-8 space-y-6">
         
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {tabs.map((tab) => (
                <div
                  key={tab.name}
                  className={`bg-gradient-to-r ${tab.color}  text-white p-6 rounded-xl shadow-lg flex flex-col`}
                 
                >
                  <div className="flex justify-between items-center mb-2">
                    <tab.icon size={28} />
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {tab.growth}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{tab.count.toLocaleString()}</h2>
                  <div className="flex items-center ">  
                  <p className="text-sm opacity-80 cursor-pointer hover:underline"  onClick={()=>RoutToAdminPage(tab.name)}>{tab.name}</p>
                  {tab.name==="Client Enquiry"&&<p className='rounded-md text-sm text-center ml-1 bg-green-800 p-1 cursor-pointer' onClick={UpdateNewLead}>New Lead + </p>}
                   </div>
                </div>
              ))}
            </div>

      
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Enquiries Over Time
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

        
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Stats Overview
                </h2>
                <ResponsiveContainer width="100%" height={260}>
  <BarChart data={barData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#067852ff" radius={[8, 8, 0, 0]} barSize={55} />
  </BarChart>
</ResponsiveContainer>

              </div>
            </div>
          </div>

      
          <div className="lg:col-span-4 space-y-2">
        
            <div className="bg-white p-2 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Payment Status
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

           
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                New Users
              </h2>
              <ul className="space-y-4">
                {[
                  { name: "Sidd", email: "tsiddu805@gmail.com" },
                  { name: "Curate", email: "admin@curatehealth.in" },
                  { name: "TestData", email: "curatetest@gmail.com" },
                ].map((user) => (
                  <li key={user.email} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="Icons/Curate-logoq.png"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-lg">
                      SIGNUP
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
