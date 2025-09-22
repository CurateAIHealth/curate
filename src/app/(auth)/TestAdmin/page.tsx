"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import {
  User,
  Bell,
  LogOut,
  Search,
  Calendar,
  IndianRupee,
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
  { name: "Client Enquiry", count: 120, growth: "+15%", icon: Bell, color: "bg-gradient-to-tr from-blue-500 to-indigo-500" },
  { name: "Deployment", count: 42, growth: "-3%", icon: Calendar, color: "bg-gradient-to-tr from-pink-500 to-rose-500" },
  { name: "Timesheet", count: 18, growth: "+5%", icon: User, color: "bg-gradient-to-tr from-teal-500 to-green-500" },
  { name: "Referral Pay", count: 76, growth: "+9%", icon: IndianRupee, color: "bg-gradient-to-tr from-amber-500 to-orange-500" },
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

  const RoutToAdminPage = (A: any) => {
    router.push("/AdminPage");
    dispatch(Update_Main_Filter_Status(A));
  };
  const UpdateNewLead = () => {
    router.push("/NewLead");
  };
  const handleLogout = () => {
    localStorage.removeItem("UserId");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
     
        <header className="flex flex-wrap justify-between items-center bg-gray-400 text-white px-4 sm:px-6 py-3 shadow-md gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/Icons/Curate-logo.png"
              alt="user"
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <span className="inline text-[15px] uppercase truncate">
              Hi Admin – Welcome to Admin Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
            
            <div className="flex items-center bg-gray-800 px-2 sm:px-3 py-1 rounded-lg flex-1 sm:flex-none">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm px-2 text-white w-full"
              />
            </div>

            <button className="relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-lg sm:rounded-xl font-semibold shadow-lg transition-all duration-150 text-sm sm:text-base"
            >
              <LogOut size={18} className="flex-shrink-0" /> 
              <span className="hidden xs:inline">Logout</span>
            </button>
          </div>
        </header>

   
        <main className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
      
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {tabs.map((tab, index) => (
                <motion.div
                  key={tab.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 p-3 sm:p-1"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-md ${tab.color}`}
                  >
                    <tab.icon size={20} className="text-white" />
                  </div>

                  <p
                    className="mt-2 sm:mt-3 text-xs sm:text-sm hover:underline font-semibold cursor-pointer text-gray-900 text-center"
                    onClick={() => RoutToAdminPage(tab.name)}
                  >
                    {tab.name}
                  </p>

                  <h2 className="text-base sm:text-lg font-bold text-gray-700 mt-1">
                    {tab.count.toLocaleString()}
                  </h2>

                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        tab.growth.startsWith("+")
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tab.growth}
                    </span>

                    {tab.name === "Client Enquiry" && (
                      <button
                        onClick={UpdateNewLead}
                        className="rounded-md cursor-pointer text-xs px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium hover:from-teal-400 transition"
                      >
                        + New Lead
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

         
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                  Enquiries Over Time
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                  Stats Overview
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#067852ff" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

     
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">
                Payment Status
              </h2>
              <ResponsiveContainer width="100%" height={220}>
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
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">
                New Users
              </h2>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  { name: "Sidd", email: "tsiddu805@gmail.com" },
                  { name: "Curate", email: "admin@curatehealth.in" },
                  { name: "TestData", email: "curatetest@gmail.com" },
                ].map((user) => (
                  <li
                    key={user.email}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src="Icons/Curate-logoq.png"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button className="px-2 sm:px-3 py-1 text-xs bg-green-100 text-green-600 rounded-lg whitespace-nowrap">
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
