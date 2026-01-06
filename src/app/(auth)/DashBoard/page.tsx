"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [stats, setStats] = useState<any>({
    registeredUsers: "Loading...",
    timesheetcount:'Loading....',
    ReferalCount:"0",
    PaymentCount:"0",
    hcpListCount: "Loading...",
    vendorsCount: "Loading...",
    hostelAttendanceCount: "Loading...",
    registrationCount: "Loading...",
    invoiceCount: "Loading...",
    deployedLength: "Loading...",
    pendingPdrCount: "Loading...",
    documentComplianceCount: "Loading...",
    Notifications:"Loading...",
    Employs:"Loading..."
  });



useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
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

        if (!mounted) return;

        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();

        let patient = 0, hcp = 0, vendor = 0, active = 0, monthReg = 0;
        const activeSet = new Set<string>();

        for (const u of registeredUsersData) {
          if (!u) continue;
          if (u.userType === "patient" && u.ClientStatus !== "Placed") patient++;
          if (u.userType === "healthcare-assistant") hcp++;
          if (u.userType === "Vendor") vendor++;

          if (u.CurrentStatus === "Active") {
            active++;
            u.userId && activeSet.add(u.userId);
          }

          if (u.createdAt) {
            const d = new Date(u.createdAt);
            if (d.getFullYear() === y && d.getMonth() === m) monthReg++;
          }
        }

        const missingDocSet = new Set<string>();
        for (const e of HCPFullInfo) {
          const info = e?.HCAComplitInformation;
          if (info?.UserId && !("Status" in info)) {
            missingDocSet.add(info.UserId);
          }
        }

        let docCompliance = 0;
        for (const id of activeSet) {
          if (missingDocSet.has(id)) docCompliance++;
        }

        const pendingPdr = timesheetData.reduce(
          (c: number, t: any) => c + (t?.PDRStatus === false ? 1 : 0),
          0
        );

        setStats({
          registeredUsers: patient,
          hcpListCount: hcp,
          timesheetcount:timesheetData.length,
          vendorsCount: vendor,
          hostelAttendanceCount: active,
          registrationCount: monthReg,
          invoiceCount: invoiceData.length,
          deployedLength: deployedData.length,
          pendingPdrCount: pendingPdr,
          documentComplianceCount: docCompliance,
          Notifications:0,
          Employs:0
        });

        const userId = localStorage.getItem("UserId");
        if (userId) {
          const user = await GetUserInformation(userId);
          mounted && setIsManagement(user?.Email === "admin@curatehealth.in");
        }
      } catch (e) {
        console.error("Dashboard Error:", e);
      }
    };

    fetchDashboard();
    return () => {
      mounted = false;
    };
  }, []);



const tabs = useMemo(
  () => [
    {
      name: "Client Enquiry",
      count: stats.registeredUsers,
      icon: Bell,
      bg: "bg-blue-500",
    },
    {
      name: "Deployment",
      count: stats.deployedLength,
      icon: Calendar,
      bg: "bg-pink-500",
    },
    {
      name: "Timesheet",
      count: stats.timesheetcount,
      icon: User,
      bg: "bg-green-500",
    },
    {
      name: "Referral Pay",
      count: stats.ReferalCount,
      icon: IndianRupee,
      bg: "bg-orange-500",
    },
    {
      name: "Payments",
      count: stats.PaymentCount,
      icon: Wallet,
      bg: "bg-purple-500",
    },
    {
      name: "HCP List",
      count: stats.hcpListCount,
      icon: Users,
      bg: "bg-red-500",
    },
    {
      name: "Pending PDR",
      count: stats.pendingPdrCount,
      icon: FileClock,
      bg: "bg-cyan-500",
    },
    {
      name: "Vendors",
      count: stats.vendorsCount,
      icon: Building2,
      bg: "bg-indigo-500",
    },
    {
      name: "Training",
      count: 0,
      icon: GraduationCap,
      bg: "bg-emerald-500",
    },
    {
      name: "Document Compliance",
      count: stats.documentComplianceCount,
      icon: FileCheck,
      bg: "bg-amber-500",
    },
    {
      name: "Registration",
      count: stats.registrationCount,
      icon: FileText,
      bg: "bg-fuchsia-500",
    },
    {
      name: "Invoices",
      count: stats.invoiceCount,
      icon: ReceiptIndianRupee,
      bg: "bg-lime-500",
    },
    {
      name: "Notifications",
      count: stats.Notifications,
      icon: BellRing,
      bg: "bg-sky-500",
    },
    {
      name: "Hostel Attendance",
      count: stats.hostelAttendanceCount,
      icon: ClipboardCheck,
      bg: "bg-green-600",
    },
    {
      name: "Employees",
      count: stats.Employs,
      icon: UserCheck,
      bg: "bg-teal-500",
    },
  ],
  [stats]
);


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

  // const Switching = (A: string) => {
  //   switch (A) {
  //     case "Client Enquiry":
  //     case "Deployment":
  //     case "Timesheet":
  //       return RoutToAdminPage(A);

  //     case "Registration":
  //       return navigateToRegistration();

  //     case "HCP List":
  //       return navigateToHCPList();

  //     case "Pending PDR":
  //       return navigateToPDRView();

  //     case "Vendors":
  //       return navigateToVendors();

  //     case "Document Compliance":
  //       return navigateToDocuments();

  //     case "Invoices":
  //       return navigateToInvoices();

  //     case "Hostel Attendance":
  //       return navigateToHostel();
  //     case "Employees":
  //       return navigateToEmployes();
  //     case "Payments":
  //       return navigateToPayments();

  //     default:
  //       return;
  //   }
  // };

  const Switching = useCallback(
    (name: string) => {
      switch (name) {
        case "Client Enquiry":
        case "Deployment":
          dispatch(Update_Main_Filter_Status(name));
          dispatch(UpdateUserType("patient"));
          router.push("/AdminPage");
          break;
        case "HCP List":
          dispatch(Update_Main_Filter_Status("HCP List"));
          dispatch(UpdateUserType("healthcare-assistant"));
          router.push("/AdminPage");
          break;
        case "Pending PDR":
          router.push("/PDRView");
          break;
        case "Vendors":
          router.push("/VendorsPanel");
          break;
        case "Document Compliance":
          router.push("/Documents");
          break;
        case "Invoices":
          router.push("/Invoices");
          break;
        case "Hostel Attendance":
          router.push("/HostelAttendence");
          break;
      }
    },
    [dispatch, router]
  );
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
              Hi Admin – Welcome to Admin Dashboard.
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
              {tabs.map((tab:any, index) => (
                <motion.div
                  key={tab.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 p-3 sm:p-1"
                >
                 <div
  className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md ${tab.bg}`}
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
                      {tab.count}
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
