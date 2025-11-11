"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Bell,
  LogOut,
  Search,
  Calendar,
  IndianRupee,
  UserPlus,
  UserX,
  Eye,
  Wallet,
  Building2,
  FileCheck,
  FileText,
  GraduationCap,
  Users,
  FileClock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  Update_Main_Filter_Status,
  UpdateClient,
  UpdateTimeStamp,
  UpdateUserInformation,
  UpdateUserType,
} from "@/Redux/action";
import { GetRegidterdUsers, GetUserInformation } from "@/Lib/user.action";
import useSWR from "swr";

const fetcher = async () => {
  const data = await GetRegidterdUsers();
  return data;
};


const tabs = [
  {
    name: "Client Enquiry",
    count: 120,
    growth: "+15%",
    icon: Bell,
    color: "bg-gradient-to-tr from-blue-500 to-indigo-500",
  },
  {
    name: "Deployment",
    count: 42,
    growth: "-3%",
    icon: Calendar,
    color: "bg-gradient-to-tr from-pink-500 to-rose-500",
  },
  {
    name: "Timesheet",
    count: 18,
    growth: "+5%",
    icon: User,
    color: "bg-gradient-to-tr from-teal-500 to-green-500",
  },
  {
    name: "Referral Pay",
    count: 76,
    growth: "+9%",
    icon: IndianRupee,
    color: "bg-gradient-to-tr from-amber-500 to-orange-500",
  },
  {
    name: "Payments",
    count: 22,
    growth: "-2%",
    icon: Wallet,
    color: "bg-gradient-to-tr from-indigo-500 to-violet-500",
  },
  {
    name: "HCP List",
    count: 5,
    growth: "+1%",
    icon: Users,
    color: "bg-gradient-to-tr from-red-500 to-rose-600",
  },
  {
    name: "Pending PDR",
    count: 12,
    growth: "+4%",
    icon: FileClock,
    color: "bg-gradient-to-tr from-sky-500 to-cyan-600",
  },

  
  {
    name: "Vendors",
    count: 24,
    growth: "+6%",
    icon: Building2,
    color: "bg-gradient-to-tr from-purple-500 to-indigo-600",
  },
  {
    name: "Training",
    count: 14,
    growth: "+10%",
    icon: GraduationCap,
    color: "bg-gradient-to-tr from-emerald-500 to-teal-600",
  },
  {
    name: "Document Compliance",
    count: 8,
    growth: "+3%",
    icon: FileCheck,
    color: "bg-gradient-to-tr from-yellow-500 to-orange-600",
  },
  {
    name: "Registration",
    count: 19,
    growth: "+7%",
    icon: FileText,
    color: "bg-gradient-to-tr from-fuchsia-500 to-pink-600",
  },
];


export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const updatedRefresh = useSelector((afterEach: any) => afterEach.updatedCount);

  
  useEffect(() => {
     
    router.prefetch("/AdminPage");
    router.prefetch("/NewLead");
    router.prefetch("/UserInformation");
  }, [router]);

  
  const { data: BenchList = [], isLoading, mutate } = useSWR(
    "bench-list",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );



  useEffect(() => {
    if (updatedRefresh) mutate();
  }, [updatedRefresh, mutate]);

 
  const RoutToAdminPage = async (A: any) => {
    dispatch(Update_Main_Filter_Status(A));
    dispatch(UpdateUserType("patient"));
     router.prefetch("/AdminPage");
    router.push("/AdminPage");
  };
  const Switching = (A: any) => {
    switch (A) {
      case "Client Enquiry":
      case "Deployment":
        case 'Timesheet':
        return RoutToAdminPage(A)
      case "Registration":
        return router.push('/UserTypeRegistration');
        case "HCP List":
        return NavigatetoFullHCPlIST();
        case "Pending PDR":
          return router.push("/PDRView")

      default:
        return null
    }
  }
  const UpdateNewLead = async () => {
     router.prefetch("/NewLead");
    router.push("/NewLead");
  };

  const handleLogout = async () => {
    localStorage.removeItem("UserId");
    await router.prefetch("/");
    router.push("/");
  };

  const ShowDompleteInformation = async (userId: any, ClientName: any) => {
    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      dispatch(UpdateUserType("patient"));
      await router.prefetch("/UserInformation");
      router.push("/UserInformation");
    }
  };

  const NavigatetoFullHCPlIST =  () => {
    dispatch(UpdateUserType("healthcare-assistant"));
    router.push("/AdminPage");
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center bg-gray-400 text-white px-4 sm:px-6 py-3 shadow-md gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/Icons/Curate-logo.png" alt="user" className="w-8 h-8" />
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

    
        <main className="p-4 sm:p-2 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                    onClick={
                     ()=>Switching(tab.name)
                    }
                  >
                    {tab.name}
                  </p>

             
                  <div className="relative group inline-block">
                    <h2 className="text-base sm:text-lg font-bold text-gray-700 mt-1 cursor-pointer">
                      {tab.count.toLocaleString()}
                    </h2>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max max-w-xs rounded-md bg-gray-800 text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap text-center">
                      {tab.count > 0
                        ? `${tab.count.toLocaleString()} ${tab.name} processed this month 📊`
                        : "No payments processed this month ❌"}
                    </div>
                  </div>

                  {/* Growth + Buttons */}
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    <div className="relative group inline-block">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer ${
                          tab.growth.startsWith("+")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tab.growth}
                      </span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max max-w-xs rounded-md bg-gray-800 text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                        {tab.growth.startsWith("+")
                          ? "Growth compared to the previous month 📈"
                          : "Fall compared to the previous month 📉"}
                      </div>
                    </div>

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
          </div>

          {/* Bench List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white flex flex-col p-2 sm:p-4 rounded-xl shadow-md">
              <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">
               Active Bench List
              </h2>
              {isLoading ? (
                <p>Bench List Loading...</p>
              ) : (
                <ul className="space-y-3 sm:space-y-4">
                  {BenchList.slice(0, 9).map((user: any) => (
                    <li
                      key={user.ContactNumber}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src="Icons/DashBoardNurse.png"
                          className="w-8 h-8 sm:w-10 sm:h-10"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {user.FirstName} {user.LastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.ContactNumber}
                          </p>
                        </div>
                      </div>
                      <button
                        className="px-2 sm:px-3 py-1 text-xs bg-green-100 text-green-600 rounded-lg cursor-pointer whitespace-nowrap"
                        onClick={() =>
                          ShowDompleteInformation(user.userId, user.FirstName)
                        }
                      >
                        <Eye />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex justify-end mt-2">
                <button
                  className="px-2 py-2 w-[100px] text-center bg-teal-600 text-white text-sm font-medium rounded-lg shadow cursor-pointer transition-all duration-200"
                  onClick={NavigatetoFullHCPlIST}
                >
                  See more
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
