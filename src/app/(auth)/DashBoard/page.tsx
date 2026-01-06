"use client";

import { useEffect, useMemo, useState } from "react";
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
  ReceiptIndianRupee,
  BellRing,
  ClipboardCheck,
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
import { GetDeploymentInfo, GetInvoiceInfo, GetRegidterdUsers, GetTimeSheetInfo, GetUserInformation, GetUsersFullInfo } from "@/Lib/user.action";
import useSWR from "swr";

const fetcher = async () => {
  const data = await GetRegidterdUsers();
const FiltersHCPS=data.filter((each:any)=>each.userType==="healthcare-assistant"&&each.Email!=='admin@curatehealth.in')
  return FiltersHCPS;
};


import { UserCheck } from "lucide-react";

const DOCUMENT_KEYS = [
  "AadharAttachmentURL",
  "PANAttachmentURL",
  "BankProofURL",
  "CompanyPANAttachmentURL",
  "VideoFileURL",
  "CertificateURL",
];





export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const updatedRefresh = useSelector((afterEach: any) => afterEach.updatedCount);
    const [isManagement, setIsManagement] = useState<boolean | null>(null);
    const [showAccessDenied, setShowAccessDenied] = useState(false);
const [registeredUsers, setRegisteredUsers] = useState<any>('Loading...');
const [deployedLength, setDeployedLength] = useState<any>('Loading...');
const [timesheetCount, setTimesheetCount] = useState<any>('Loading...');
const [referralPayCount, setReferralPayCount] = useState<any>(0);
const [paymentsCount, setPaymentsCount] = useState<any>('Loading...');
const [hcpListCount, setHcpListCount] = useState<any>('Loading...');
const [pendingPdrCount, setPendingPdrCount] = useState<any>('Loading...');
const [vendorsCount, setVendorsCount] = useState<any>('Loading...');
const [trainingCount, setTrainingCount] = useState<any>(0);
const [documentComplianceCount, setDocumentComplianceCount] = useState<any>('Loading...');
const [registrationCount, setRegistrationCount] = useState<any>('Loading...');
const [invoiceCount, setInvoiceCount] = useState<any>('Loading...');
const [notificationCount, setNotificationCount] = useState<any>(0);
const [hostelAttendanceCount, setHostelAttendanceCount] = useState<any>('Loading...');
const [employeesCount, setEmployeesCount] = useState<any>(7);
const [Fix,setFix]=useState([])



useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    try {
      const [
        registeredUsersData = [],
        HCPFullInfo = [],
        deployedData = [],
        invoiceData = [],
        timesheetData = [],
      ] = await Promise.all([
        GetRegidterdUsers(),
        GetUsersFullInfo(),
        GetDeploymentInfo(),
        GetInvoiceInfo(),
        GetTimeSheetInfo(),
      ]);

      if (!isMounted) return;

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      let patientCount = 0;
      let hcpCount = 0;
      let vendorCount = 0;
      let activeCount = 0;
      let currentMonthRegistrations = 0;

      const activeUserIdSet = new Set<string>();

   
      for (const user of registeredUsersData) {
        if (!user) continue;

        const {
          userType,
          ClientStatus,
          CurrentStatus,
          createdAt,
          userId,
        } = user;

        if (userType === "patient" && ClientStatus !== "Placed") {
          patientCount++;
        }

        if (userType === "healthcare-assistant") hcpCount++;
        if (userType === "Vendor") vendorCount++;

        if (CurrentStatus === "Active") {
          activeCount++;
          if (userId) activeUserIdSet.add(userId);
        }

        if (createdAt) {
          const createdDate = new Date(createdAt);
          if (
            createdDate.getFullYear() === currentYear &&
            createdDate.getMonth() === currentMonth
          ) {
            currentMonthRegistrations++;
          }
        }
      }

 
      const hcaWithoutStatusUserIds = new Set<string>();

      for (const each of HCPFullInfo) {
        const info = each?.HCAComplitInformation;
        if (info?.UserId && !("Status" in info)) {
          hcaWithoutStatusUserIds.add(info.UserId);
        }
      }

    
      let documentComplianceCount = 0;
      for (const userId of activeUserIdSet) {
        if (hcaWithoutStatusUserIds.has(userId)) {
          documentComplianceCount++;
        }
      }

      if (!isMounted) return;

   
      setRegisteredUsers(patientCount);
      setHcpListCount(hcpCount);
      setVendorsCount(vendorCount);
      setHostelAttendanceCount(activeCount);
      setRegistrationCount(currentMonthRegistrations);

      setInvoiceCount(invoiceData.length);
      setDeployedLength(deployedData.length);

      setPendingPdrCount(
        timesheetData.reduce(
          (count: number, t: any) => count + (t?.PDRStatus === false ? 1 : 0),
          0
        )
      );

      setDocumentComplianceCount(documentComplianceCount);

   
      const localUserId = localStorage.getItem("UserId");
      if (localUserId) {
        const signInUser = await GetUserInformation(localUserId);
        if (isMounted) {
          setIsManagement(signInUser?.Email === "admin@curatehealth.in");
        }
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  fetchData();

  return () => {
    isMounted = false;
  };
}, []);


console.log("Check Fix=====",Fix)
const tabs = [
  {
    name: "Client Enquiry",
    count: registeredUsers,
    growth: "+15%",
    icon: Bell,
    color: "bg-gradient-to-tr from-blue-500 to-indigo-500",
  },
  {
    name: "Deployment",
    count: deployedLength,
    growth: "-3%",
    icon: Calendar,
    color: "bg-gradient-to-tr from-pink-500 to-rose-500",
  },
  {
    name: "Timesheet",
    count: deployedLength,
    growth: "+5%",
    icon: User,
    color: "bg-gradient-to-tr from-teal-500 to-green-500",
  },
  {
    name: "Referral Pay",
    count: referralPayCount,
    growth: "+9%",
    icon: IndianRupee,
    color: "bg-gradient-to-tr from-amber-500 to-orange-500",
  },
  {
    name: "Payments",
    count: 0,
    growth: "-2%",
    icon: Wallet,
    color: "bg-gradient-to-tr from-indigo-500 to-violet-500",
  },
  {
    name: "HCP List",
    count: hcpListCount,
    growth: "+1%",
    icon: Users,
    color: "bg-gradient-to-tr from-red-500 to-rose-600",
  },
  {
    name: "Pending PDR",
    count: pendingPdrCount,
    growth: "+4%",
    icon: FileClock,
    color: "bg-gradient-to-tr from-sky-500 to-cyan-600",
  },
  {
    name: "Vendors",
    count: vendorsCount,
    growth: "+6%",
    icon: Building2,
    color: "bg-gradient-to-tr from-purple-500 to-indigo-600",
  },
  {
    name: "Training",
    count: trainingCount,
    growth: "+10%",
    icon: GraduationCap,
    color: "bg-gradient-to-tr from-emerald-500 to-teal-600",
  },
  {
    name: "Document Compliance",
    count: documentComplianceCount,
    growth: "+3%",
    icon: FileCheck,
    color: "bg-gradient-to-tr from-yellow-500 to-orange-600",
  },
  {
    name: "Registration",
    count: registrationCount,
    growth: "+7%",
    icon: FileText,
    color: "bg-gradient-to-tr from-fuchsia-500 to-pink-600",
  },
  {
    name: "Invoices",
    count: invoiceCount,
    growth: "+12%",
    icon: ReceiptIndianRupee,
    color: "bg-gradient-to-tr from-lime-500 to-green-600",
  },
  {
    name: "Notifications",
    count: notificationCount,
    growth: "+8%",
    icon: BellRing,
    color: "bg-gradient-to-tr from-cyan-500 to-sky-600",
  },
  {
    name: "Hostel Attendance",
    count: hostelAttendanceCount,
    growth: "+11%",
    icon: ClipboardCheck,
    color: "bg-gradient-to-tr from-green-500 to-emerald-600",
  },

  {
    name: "Employees",
    count: employeesCount,
    growth: "+6%",
    icon: UserCheck,
    color: "bg-gradient-to-tr from-[#1392d3] to-[#50c896]",
  },
];

  const { data: BenchList = [], isLoading, mutate } = useSWR(
    "bench-list",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );



    useEffect(() => {
    if (updatedRefresh) {
      mutate(); 
    }
  }, [updatedRefresh, mutate]);


    const RoutToAdminPage = (A: string) => {
    dispatch(Update_Main_Filter_Status(A)); 
    dispatch(UpdateUserType("patient"));    
    router.push("/AdminPage");              
  };

 const navigateToRegistration = () => {
    router.push("/UserTypeRegistration");
  };

  const navigateToHCPList = () => {
    dispatch(Update_Main_Filter_Status("HCP List")); 
    dispatch(UpdateUserType("healthcare-assistant"));
    router.push("/AdminPage");
  };

  const navigateToPDRView = () => {
    router.push("/PDRView");
  };

  const navigateToVendors = () => {
    router.push("/VendorsPanel");
  };

  const navigateToDocuments = () => {
    router.push("/Documents");
  };

  const navigateToInvoices = () => {
    router.push("/Invoices");
  };

  const navigateToHostel=()=>{
    router.push("/HostelAttendence")
  }

  const navigateToEmployes=()=>{
console.log('Check Email Status-----',isManagement)



      if (isManagement === false) {
    setShowAccessDenied(true);
    return;
  }

    if (isManagement === true) {
      router.push("/Employes")
    }
 
  
  }

  const navigateToPayments=()=>{
  router.push("/Payments")
  }

  const Switching = (A: string) => {
    switch (A) {
      case "Client Enquiry":
      case "Deployment":
      case "Timesheet":
        return RoutToAdminPage(A);

      case "Registration":
        return navigateToRegistration();

      case "HCP List":
        return navigateToHCPList();

      case "Pending PDR":
        return navigateToPDRView();

      case "Vendors":
        return navigateToVendors();

      case "Document Compliance":
        return navigateToDocuments();

      case "Invoices":
        return navigateToInvoices();

      case "Hostel Attendance":
        return navigateToHostel();
      case "Employees":
        return navigateToEmployes();
      case "Payments":
        return navigateToPayments();

      default:
        return;
    }
  };
  const UpdateNewLead = async () => {
    router.prefetch("/NewLead");
    router.push("/NewLead");
  };

  const handleLogout = async () => {
    localStorage.removeItem("UserId");
     router.prefetch("/");
    router.push("/");
  };

  const ShowDompleteInformation = async (userId: any, ClientName: any) => {
    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      dispatch(UpdateUserType("patient"));
      router.push("/UserInformation");
    }
  };

  const NavigatetoFullHCPlIST = () => {
    dispatch(Update_Main_Filter_Status("HCP List")); 
    dispatch(UpdateUserType("healthcare-assistant"));
 
    router.push("/AdminPage");
  };


  

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <div className="flex-1 flex flex-col">
      
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
            >Logout
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
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-md ${tab.color}`}
                  >
                    <tab.icon size={20} className="text-white" />
                  </div>

                  <p
                    className="mt-2 sm:mt-3 text-xs sm:text-sm hover:underline font-semibold cursor-pointer text-gray-900 text-center"
                    onClick={
                      () => Switching(tab.name)
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

            
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {/* <div className="relative group inline-block">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer ${tab.growth.startsWith("+")
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
                    </div> */}

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

   {showAccessDenied && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
  <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl">

    <div className="flex items-center justify-center gap-3 rounded-t-xl bg-red-600 px-6 py-4 text-white">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
        <UserX className="h-5 w-5" />
      </div>
      <h2 className="text-lg font-semibold tracking-wide">
        Access Restricted
      </h2>
    </div>


    <div className="px-6 py-6 text-center">
      <p className="text-sm leading-relaxed text-gray-700">
        This section is reserved for{" "}
        <span className="font-semibold text-red-600">Management</span>.
        <br />
        You do not have permission to access Employees.
      </p>
    </div>


    <div className="flex justify-end border-t border-gray-200 px-6 py-4">
      <button
        onClick={() => setShowAccessDenied(false)}
        className="rounded-lg bg-red-600 px-5 py-2 text-sm cursor-pointer font-semibold text-white
                   shadow transition hover:bg-red-700 active:scale-95"
      >
        Close
      </button>
    </div>
  </div>
</div>

)}


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
