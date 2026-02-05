"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
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
  CircleUser,
  HelpCircle,
  Settings,
  Shield,
} from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

import { useDispatch, useSelector } from "react-redux";
import {
  Update_Main_Filter_Status,
  UpdateClient,
  UpdateTimeStamp,
  UpdateUserInformation,
  UpdateUserType,
} from "@/Redux/action";
import { CallEnquiryRegistration, GetDeploymentInfo, GetInvoiceInfo, GetRegidterdUsers, GetTimeSheetInfo, GetUserInformation, GetUsersFullInfo } from "@/Lib/user.action";






import { UserCheck } from "lucide-react";
import { hyderabadAreas } from "@/Lib/Content";

import PermissionDeniedPopup from "@/Components/Permission/page";
import ProfileDrawer from "@/Components/ProfileView/page";
import MarkAttendance from "@/Components/EmployAttendence/page";
import axios from "axios";
import PostExpense from "@/Components/Expences/page";

const DOCUMENT_KEYS = [
  "AadharAttachmentURL",
  "PANAttachmentURL",
  "BankProofURL",
  "CompanyPANAttachmentURL",
  "VideoFileURL",
  "CertificateURL",
];





export default function Dashboard() {
  const router =useRouter()
  const dispatch = useDispatch();
  
  const updatedRefresh = useSelector((afterEach: any) => afterEach.updatedCount);
  const [isManagement, setIsManagement] = useState<boolean | null>(null);
  const [OtherArea,setOtherArea]=useState<any>("")
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showCallEnquiry, setShowCallEnquiry] = useState(false);
  const [EnquiryMessage, setEnquiryMessage] = useState<any>(null)
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);
  const [ProfileName,SetProfileName]=useState<any>("")
  const [openProfile, setOpenProfile] = useState(false);
  const [AttendeceView,setAttendeceView]=useState(false)
  const [openExpense,setOpenExpense]=useState<any>(false)
  const [compliteInfo,setcompliteInfo]=useState<any>()
  const [showProfileOptions,setShowProfileOptions]=useState(false)
const [BechListInfo,setBechListInfo]=useState<any>()
  const [loading, setLoading] = useState<boolean>(true);
      const [benchSource, setBenchSource] = useState<any>(null);
  

  const [loggedInEmail, setloggedInEmail] = useState<any>("")
  const [EnquiryForm, setEnquiryForm] = useState<any>({
    ClientName: "",
    CliecntContact: '',
    ClientEmail: '',
    ClientArea: '',
    ClientNote: ""
  })

  const [stats, setStats] = useState<any>({
    registeredUsers: "Loading...",
    timesheetcount: 'Loading....',
    ReferalCount: "0",
    PaymentCount: "0",
    hcpListCount: "Loading...",
    vendorsCount: "Loading...",
    hostelAttendanceCount: "Loading...",
    registrationCount: "Loading...",
    invoiceCount: "Loading...",
    deployedLength: "Loading...",
    pendingPdrCount: "Loading...",
    documentComplianceCount: "Loading...",
    Notifications: "Loading...",
    Employs: "Loading..."
  });

const DASHBOARD_CACHE_KEY = "dashboardStats";
const CACHE_TTL = 20* 60 * 1000;
const BENCH_CACHE_KEY = "benchListInfo";
const BENCH_CACHE_TTL = 10 * 60 * 1000;

  useEffect(() => {
    let mounted = true;

    const run = async () => {
       const userId = localStorage.getItem("UserId");
          if (userId) {
      const user = await GetUserInformation(userId);
      if (mounted && user?.Email) {
       setloggedInEmail(user?.Email)
      }
    }
      const cachedStats = localStorage.getItem(DASHBOARD_CACHE_KEY);
      const cachedBench = localStorage.getItem(BENCH_CACHE_KEY);

      let statsValid = false;
      let benchValid = false;

      if (cachedStats) {
        const { data, timestamp } = JSON.parse(cachedStats);
        if (Date.now() - timestamp < CACHE_TTL) {
          setStats(data);
          statsValid = true;
        }
      }

      if (cachedBench) {
        const { data, timestamp } = JSON.parse(cachedBench);
        if (Date.now() - timestamp < CACHE_TTL) {
          setBenchSource(data);
          benchValid = true;
        }
      }

      if (statsValid && benchValid) {
        setLoading(false);
        return;
      }

  

      const [user, results] = await Promise.all([
        userId ? GetUserInformation(userId) : null,
        Promise.allSettled([
          GetRegidterdUsers(),
          GetUsersFullInfo(),
          GetDeploymentInfo(),
          GetInvoiceInfo(),
          GetTimeSheetInfo(),
        ]),
      ]);

      if (!mounted) return;

      

      const getArr = (r: any) =>
        r.status === "fulfilled"
          ? Array.isArray(r.value)
            ? r.value
            : r.value?.data ?? []
          : [];

      const [
        registeredUsers,
        fullUsers,
        deployments,
        invoices,
        timesheets,
      ] = results.map(getArr);

      if (fullUsers.length > 0) {
        setBenchSource(fullUsers);
        localStorage.setItem(
          BENCH_CACHE_KEY,
          JSON.stringify({ data: fullUsers, timestamp: Date.now() })
        );
      }

    let patient = 0;
let hcp = 0;
let vendor = 0;
let active = 0;
let monthReg = 0;
let currentMonthPatientCount = 0;

      const now = new Date();
      const activeSet = new Set<string>();




const currentUTCYear = now.getUTCFullYear();
const currentUTCMonth = now.getUTCMonth(); 

const VALID_USER_TYPES = new Set([
  "healthcare-assistant",
  
]);

const getISODate = (value: any): Date | null => {
  if (!value) return null;

  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  if (value?.toDate) return value.toDate();

  return null;
};


let healthcareUserCount = 0;

for (const u of registeredUsers) {
  const leadDate = getISODate(u.LeadDate);
  const createdDate = getISODate(u.createdAt);

  const isCurrentMonth =
    (leadDate &&
      leadDate.getUTCFullYear() === currentUTCYear &&
      leadDate.getUTCMonth() === currentUTCMonth) ||
    (createdDate &&
      createdDate.getUTCFullYear() === currentUTCYear &&
      createdDate.getUTCMonth() === currentUTCMonth);
 
  if (!isCurrentMonth) continue;
 monthReg++;


   if (u.userType === "patient" || u.userType === "CallEnquiry") {
    currentMonthPatientCount++;
  } else if (VALID_USER_TYPES.has(u.userType)) {
    healthcareUserCount++;
  } else {
    vendor++;
  }
}




 
const currentMonth = now.getMonth() + 1; 
const currentYear = now.getFullYear();

const deployedUnique =  deployments
      .filter((i: any) => {
        if (!i?.StartDate || !i?.ClientId) return false;

        const [, month, year] = i.StartDate.split("/").map(Number);
        return month === currentMonth && year === currentYear;
      })

const Invoice =  invoices
      .filter((i: any) => {
        if (!i?.DeployDate) return false;

        const [, month, year] = i.DeployDate.split("/").map(Number);
        return month === currentMonth && year === currentYear && i.status!=="Draft";
      })
const PDRcurrentMonth = now.getMonth();
const PDRcurrentYear = now.getFullYear();

const pendingPdr = timesheets.filter((t: any) => {
  if (!t.StartDate || t.PDRStatus !== false) return false;

  const [day, month, year] = t.StartDate.split("/").map(Number);

  const date = new Date(year, month - 1, day);

  
  if (isNaN(date.getTime())) return false;

  return (
    date.getMonth() === PDRcurrentMonth &&
    date.getFullYear() === PDRcurrentYear
  );
}).length;


      const finalStats = {
        registeredUsers: currentMonthPatientCount,
        hcpListCount: healthcareUserCount,
        vendorsCount: vendor,
        hostelAttendanceCount: active,
        registrationCount: monthReg,
        invoiceCount: Invoice.length,
        deployedLength: deployedUnique.length,
        timesheetcount: deployedUnique.length,
        pendingPdrCount: pendingPdr,
        documentComplianceCount: 0,
        Notifications: 0,
        Employs: 0,
      };

      setStats(finalStats);
      localStorage.setItem(
        DASHBOARD_CACHE_KEY,
        JSON.stringify({ data: finalStats, timestamp: Date.now() })
      );

      setLoading(false);
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const BenchList = useMemo(() => {
    if (!benchSource) return [];

    return benchSource
      .map((e: any) => e?.HCAComplitInformation)
      .filter(Boolean)
      .map((u: any) => ({
        userId: u.UserId,
        FirstName: u.HCPFirstName,
        Contact: u.HCPContactNumber,
        userType: u.userType,
        Status: u.Status,
        CurrentStatus: u.CurrentStatus,
      }))
      .filter(
        (u: any) =>
          ["healthcare-assistant", "HCA", "HCP", "HCPT"].includes(u.userType) &&
          !u.Status?.includes("Assigned") &&
          !["Sick", "Leave", "Terminated"].includes(u.CurrentStatus)
      );
  }, [benchSource]);


  const handleChange = (e: any) => {
    try {
      const name = e.target.name
      const value = e.target.value
      setEnquiryForm({ ...EnquiryForm, [name]: value })
    } catch (err: any) {

    }
  }

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
        name: "Accounts",
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

  const UpdateCallEnquiry = async () => {
    setEnquiryMessage("Please Wait.....")
    try {
      const generatedUserId = uuidv4()
      const payload: any = {
        userType: "CallEnquiry",
        FirstName: EnquiryForm.ClientName || "",
        ContactNumber: EnquiryForm.ClientContact || "",
        Email: EnquiryForm.ClientEmail || "",
        Location: EnquiryForm.ClientArea || "",
        ClientNote: EnquiryForm.ClientNote || "",
        userId: generatedUserId,

      };

      const registrationResult = await CallEnquiryRegistration(payload);

      if (registrationResult.success === true) {
        setEnquiryMessage("Client Enquiry Registered Successfully");

        setTimeout(() => {
          setShowCallEnquiry(false);
        }, 3500);
      }

    } catch (err: any) {

    }
  }


//   const loadUsers =  () => {
//   const users = BechListInfo
//   const filterProfilePic = users.map(
//     (each: any) => each?.HCAComplitInformation ?? {}
//   );

//   const Finel = filterProfilePic.map((each: any) => ({
//     id: each.UserId,
//     FirstName: each.HCPFirstName,
//     AadharNumber: each.HCPAdharNumber,
//     Age: each.Age,
//     userType: each.userType,
//     Location: each["Permanent Address"] || "",
//     Email: each.HCPEmail,
//     Contact: each.HCPContactNumber,
//     CurrentStatus: each.CurrentStatus,
//     userId: each.UserId,
//     VerificationStatus: each.VerificationStatus,
//     DetailedVerification: each.FinelVerification,
//     EmailVerification: each.EmailVerification,
//     ClientStatus: each.ClientStatus,
//     Status: each.Status,
//     provider: each.provider,
//     payTerms: each.payTerms,
//   }));

//   const HCA_List = Finel.filter((each: any) => {
//     const typeMatch = ["healthcare-assistant", "HCA", "HCP", "HCPT"].includes(
//       each.userType
//     );

//     const isNotAssigned =
//       !each.Status?.some((s: string) => s === "Assigned");

//     const isValidCurrentStatus =
//       !["Sick", "Leave", "Terminated"].includes(each.CurrentStatus);

//     return typeMatch && isNotAssigned && isValidCurrentStatus;
//   });

//   return HCA_List;
// };
//   const { data: BenchList = [], isLoading } = useSWR(
//   BechListInfo ? "bench-list" : null,
//   loadUsers,
//   { revalidateOnFocus: false }
// );






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

  const navigateToHostel = () => {
    router.push("/HostelAttendence")
  }

  const navigateToEmployes = () => {
    console.log('Check Email Status-----', isManagement)



    if (isManagement === false) {
      setShowAccessDenied(true);
      return;
    }

    if (isManagement === true) {
      router.push("/Employes")
    }


  }

  const navigateToPayments = () => {
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
const TAB_ACCESS_CONTROL: Record<string, string[]> = {
  "Client Enquiry": [
    "tsiddu805@gmail.com",
    "info@curatehealth.in",
  ],

  "Deployment": [
    "tsiddu805@gmail.com",
    "panducurate@gmail.com",
  ],

  "Timesheet": [
    "panducurate@gmail.com",
    "srivanikasham@curatehealth.in",
  ],

  "Referral Pay": [
    "info@curatehealth.in",
  ],

  "Payments": [
    "info@curatehealth.in",
  ],

  "HCP List": [
    "sravanthicurate@gmail.com",
  ],

  "Pending PDR": [
    "gouricurate@gmail.com",
    
  ],

  "Vendors": [
    "kirancuratehealth@gmail.com",
  ],

  "Training": [
    "info@curatehealth.in",
  ],

  "Document Compliance": [
    "info@curatehealth.in",
  ],

  "Registration": [
    "tsiddu805@gmail.com",
  ],

  "Invoices": [
    "rpandu823@gmail.com",
  ],

  "Notifications": [
    "info@curatehealth.in",
  ],

  "Hostel Attendance": [
    "srinivasnew0803@gmail.com",
  ],

  "Employees": [
    "info@curatehealth.in",
  ],

  ALL: [
    "tsiddu805@gmail.com",
    "admin@curatehealth.in",
    "sravanthicurate@gmail.com",
    "srinivasnew0803@gmail.com",
    "srivanikasham@curatehealth.in",
    "info@curatehealth.in",
  ],
};

const canAccessTab = useCallback(
  (tab: string, email: string | null) => {
    if (!email) return false;
    if (TAB_ACCESS_CONTROL.ALL?.includes(email)) return true;
    return TAB_ACCESS_CONTROL[tab]?.includes(email);
  },
  []
);



const Switching = (name: string) => {
 
  if (!loggedInEmail) return;
 
  if (!canAccessTab(name, loggedInEmail)) {
    setShowPermissionPopup(true);
    return;
  }

  
  switch (name) {
    case "Client Enquiry":
    case "Deployment":
    case "Timesheet":
      dispatch(Update_Main_Filter_Status(name));
      dispatch(UpdateUserType("patient"));
      router.push("/AdminPage");
      break;

    case "HCP List":
      dispatch(Update_Main_Filter_Status(name));
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

    case "Registration":
      router.push("/UserTypeRegistration");
      break;

    case "Hostel Attendance":
      router.push("/HostelAttendence");
      break;

    case "Notifications":
      router.push("/Notifications");
      break;
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
    <img src="/Icons/Curate-logo.png" alt="logo" className="w-8 h-8" />
    <span className="text-[15px] uppercase truncate">
      Hi Admin – Welcome to Admin Dashboard...
    </span>
  </div>

  
  <div className="flex items-center gap-3 sm:gap-5 w-full sm:w-auto justify-between sm:justify-end">
 
    <div className="flex items-center bg-gray-800 px-2 sm:px-3 py-1 rounded-lg flex-1 sm:flex-none">
      <Search size={18} className="text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent outline-none text-sm px-2 text-white w-full"
      />
    </div>

    
    <button type="button" className="relative">
      <Bell size={22} />
      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
    </button>

 
<div className="relative inline-block">


<div className="relative inline-block group">

  {/* Profile Button */}
  <button
    type="button"
    onClick={() => setShowProfileOptions(prev => !prev)}
    className="
      flex items-center gap-2
      px-2 py-1
      rounded-xl
      bg-gradient-to-br from-[#00A9A5] to-[#005f61]
      hover:from-[#01cfc7] hover:to-[#00403e]
      focus:outline-none
      cursor-pointer
    "
  >
    <CircleUser size={18} className="text-gray-200" />

    <div className="hidden sm:flex flex-col items-start leading-tight">
      <span className="text-sm font-semibold text-white">
        {ProfileName || "Admin"}
      </span>
    </div>
  </button>

  {/* Bottom Tooltip */}
  <div
    className="
      absolute left-1/2 -translate-x-1/2 top-full mt-2
      whitespace-nowrap
      rounded-md
      bg-gray-900 text-white
      text-xs font-medium
      px-2 py-1

      opacity-0 scale-95
      pointer-events-none

      group-hover:opacity-100
      group-hover:scale-100

      transition-all duration-200
      z-50
    "
  >
    Click to get options

    {/* Arrow (Top pointing) */}
    <div
      className="
        absolute left-1/2 -translate-x-1/2 -top-1
        w-2 h-2
        bg-gray-900
        rotate-45
      "
    />
  </div>
</div>


  {showProfileOptions && (
    <div
      className="
        absolute right-0 mt-3 w-56
        bg-white text-gray-800
        rounded-2xl shadow-xl
        border border-gray-200
        z-50 overflow-hidden
      "
    >
 
      <div className="px-4 py-3 bg-gray-50 border-b">
        <p className="text-sm font-semibold text-gray-900">
          {ProfileName || "Admin User"}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {loggedInEmail}
        </p>
      </div>

     
      <div className="py-1">
        <button
        type="button"
          onClick={() => {
            setOpenProfile(true);
            setShowProfileOptions(false);
          }}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-slate-100"
        >
          <User size={16} className="text-slate-500" />
          My Profile
        </button>

        <button
        type="button"
          onClick={() => {
            setAttendeceView(true);
            setShowProfileOptions(false);
          }}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-slate-100"
        >
          <ClipboardCheck size={16} className="text-slate-500" />
          Attendance
        </button>

        <button
        type="button"
          onClick={() => {
            setOpenExpense(true);
            setShowProfileOptions(false);
          }}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-slate-100"
        >
          <IndianRupee size={16} className="text-slate-500" />
          Post Expense
        </button>

        <button type="button" className="w-full px-4 py-2 flex items-center gap-3 text-sm hover:bg-slate-100">
          <Shield size={16} className="text-slate-500" />
          Security
        </button>

        <button type="button" className="w-full px-4 py-2 flex items-center gap-3 text-sm hover:bg-slate-100">
          <Settings size={16} className="text-slate-500" />
          Settings
        </button>

        <button type="button" className="w-full px-4 py-2 flex items-center gap-3 text-sm hover:bg-slate-100">
          <HelpCircle size={16} className="text-slate-500" />
          Help & Support
        </button>
      </div>

      <div className="h-px bg-gray-200" />

    
      <button
      type="button"
        onClick={() => {
          handleLogout();
          setShowProfileOptions(false);
        }}
        className="
          w-full px-4 py-2.5
          flex items-center gap-3
          text-sm font-medium
          text-red-600
          hover:bg-red-50
        "
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  )}
</div>




    {/* Logout Button (optional – can be removed if dropdown logout is used) */}
    {/* <button
      onClick={handleLogout}
      className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150 text-sm"
    >
      <LogOut size={18} />
      Logout
    </button> */}
  </div>
</header>

  <ProfileDrawer
  open={openProfile}
  onClose={() => setOpenProfile(false)}
  profileName={ProfileName}
  ProfileEmail={loggedInEmail}
  Designation="Developer"
/>


{AttendeceView && (
<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  onClick={() => setAttendeceView(false)}
>
    
      <div
    className="relative w-full max-w-xl mx-4"
    onClick={(e) => e.stopPropagation()}
  >
      <MarkAttendance
        userId={compliteInfo?.userId}
        userName={ProfileName}
        SickLeaves={compliteInfo?.Sick}
        CasualLeaves={compliteInfo?.Casual}
        usedLeaves={compliteInfo?.UsedLeaves}
        onSubmit={async (data) => {
          console.log("Attendance Data:", data);
          await axios.post("/api/attendance", data);
        }}
        onClose={() => setAttendeceView(false)}
      />
    </div>

  </div>
)}

    {openExpense && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <PostExpense
      employeeId="EMP123"
      employeeName={ProfileName}
      expenseTypes={[
        "Travel",
        "Food",
        "Accommodation",
        "Medical",
        "Other",
      ]}
      onSubmit={(data) => console.log(data)}
      onClose={() => setOpenExpense(false)}
    />
  </div>
)}
 <PermissionDeniedPopup
                    open={showPermissionPopup}
                    onClose={() => setShowPermissionPopup(false)}
                  />

        <main className="p-4 sm:p-2 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {tabs.map((tab: any, index) => (
             <div
  className="cursor-pointer"
  key={tab.name}
   onClick={
                      () => {if(tab.name!=="Client Enquiry"){Switching(tab.name)}}
                    }
>

                <div
  key={tab.name}
  className="flex flex-col items-center cursor-pointer hover:shadow-lg justify-center bg-white rounded-xl shadow-md border border-gray-100 p-3 sm:p-1 transition-transform hover:scale-[1.05]"
>

                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md ${tab.bg}`}
                  >
                    <tab.icon size={20} className="text-white" />
                  </div>


<p
  className="mt-2 sm:mt-3 text-xs sm:text-sm hover:underline font-semibold cursor-pointer text-gray-900 text-center"
    onClick={
                      () => {if(tab.name==="Client Enquiry"){Switching(tab.name)}}
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
                      <div className="flex items-center gap-2">
                        <button
                        type="button"
                          onClick={UpdateNewLead}
                          className="rounded-md cursor-pointer text-xs px-2 py-1
      bg-gradient-to-r from-blue-400 to-blue-500
      text-white font-medium
      hover:from-teal-400 transition"
                        >
                          + New Lead
                        </button>

                        <button
                        type="button"
                          onClick={() => setShowCallEnquiry(true)}
                          className="rounded-md cursor-pointer text-xs px-2 py-1
      bg-gradient-to-r from-green-400 to-green-500
      text-white font-medium
      hover:from-emerald-400 transition"
                        >
                          📞 Call Enquiry
                        </button>
                      </div>
                    )}

                  </div>
                </div>
                </div>

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
                  type="button"
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

          {showCallEnquiry && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">


              <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">


                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="Icons/Curate-logoq.png" className="h-9" alt="CompanyLogo" />
                    <div>

                      <h3 className="text-lg font-semibold text-gray-800">
                        Call Enquiry
                      </h3>
                      <p className="text-xs text-gray-500">
                        Log a quick enquiry from a phone call
                      </p>
                    </div>
                  </div>
                  <button
                  type="button"
                    onClick={() => setShowCallEnquiry(false)}
                    className="h-8 w-8 rounded-full flex items-center justify-center
          text-gray-500 hover:bg-gray-100 hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                </div>


                <div className="px-6 py-5 space-y-4">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        name="ClientName"
                        onChange={handleChange}
                        placeholder="Full name"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3
              text-sm focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                      />
                    </div>

                    <div>
  <label className="block text-xs font-medium text-gray-500 mb-1">
    Mobile Number
  </label>

  <input
    type="tel"
    name="ClientContact"
    value={EnquiryForm.ClientContact || ""}
    onChange={(e) => {
     
      const value = e.target.value.replace(/\D/g, "");

    
      if (value.length <= 10) {
        handleChange({
          target: {
            name: "ClientContact",
            value,
          },
        } as any);
      }
    }}
    pattern="^[6-9]\d{9}$"
    maxLength={10}
    placeholder="10-digit Indian mobile number"
    className="w-full rounded-lg border border-gray-300 px-4 py-3
      text-sm tracking-widest focus:ring-2 focus:ring-gray-800
      focus:border-transparent"
  />

 
  {EnquiryForm.ClientContact &&
    !/^[6-9]\d{9}$/.test(EnquiryForm.ClientContact) && (
      <p className="mt-1 text-xs text-red-500">
        Enter a valid Indian mobile number
      </p>
    )}
</div>

                    <div className="w-full">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="ClientEmail"
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className="
      w-full
      rounded-xl
      border border-gray-300
      px-4 py-3
      text-sm text-gray-800
      placeholder-gray-400
      focus:outline-none
      focus:ring-2 focus:ring-indigo-500
      focus:border-transparent
      transition-all
    "
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Area
                      </label>
                      <select
                        name="ClientArea"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3
            text-sm bg-white focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    onChange={(e)=>{
                      setOtherArea(e.target.value==="Other")
                      setEnquiryForm({ ...EnquiryForm, ClientArea: e.target.value==="Other"?"":e.target.value })
                    }}
                      >
                        <option value="">Select Area</option>
                        {hyderabadAreas.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {OtherArea&&  <input
   
                        name="ClientArea"
                        onChange={handleChange}
                        placeholder="Enter client area"
                        className="
      w-full
      px-3 py-2
      text-sm
      rounded-xl
      border border-gray-300
      bg-white
      text-gray-800
      placeholder-gray-400
      mt-2
      focus:outline-none  
      focus:ring-2
      focus:ring-[#1392d3]/40
      focus:border-[#1392d3]
hover:border-[#ff1493]
      transition
    "
                      />}
                    </div>
                  </div>





                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="ClientNote"
                      onChange={handleChange}
                      placeholder="Short call summary"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3
            text-sm resize-none h-24 focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    />
                  </div>
                  {EnquiryMessage && (
                    <p
                      className="
      flex items-center gap-2
      px-4 py-2 mt-3
      rounded-lg
      text-sm font-medium
      shadow-sm
      transition-all duration-300
      bg-blue-50 text-blue-700 border border-blue-200
    "
                    >

                      <span className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />

                      {EnquiryMessage}
                    </p>
                  )}

                </div>


                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                  <button
                  type="button"
                    onClick={() => setShowCallEnquiry(false)}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300
          text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                  type="button"
                    onClick={UpdateCallEnquiry}
                    className="px-5 py-2 text-sm rounded-lg font-medium text-white
          bg-gray-900 hover:bg-gray-800 transition"
                  >
                    Save Enquiry
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

    { BenchList.length === 0 ? (
  <p className="text-sm text-gray-500">Please Wait....</p>
) : (
      <ul className="space-y-3 sm:space-y-4">
        {BenchList.slice(0, 9).map((user: any, index: number) => (
          <li
            key={user.userId ?? `${user.ContactNumber}-${index}`}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="Icons/DashBoardNurse.png"
                alt="User"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />

              <div className="min-w-0">
                <p className="font-medium text-sm truncate">
                  {user.FirstName} {user.LastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.
Contact}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
              type="button"
                className="
                  px-4 py-2
                  rounded-md
                  border border-gray-300
                  bg-white
                  text-gray-700 text-sm font-medium
                  cursor-pointer
                  hover:bg-gray-50
                  transition
                  hover:shadow-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-gray-400
                  focus:ring-offset-1
                "
              >
                Send Profile
              </button>

              <button
              type="button"
                className="px-2 sm:px-3 py-1 text-xs bg-green-100 text-green-600 rounded-lg cursor-pointer whitespace-nowrap"
                onClick={() =>
                  ShowDompleteInformation(user.userId, user.FirstName)
                }
              >
                <Eye />
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}

    <div className="flex justify-end mt-2">
      <button
      type="button"
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