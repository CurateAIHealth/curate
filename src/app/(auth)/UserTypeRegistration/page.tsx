"use client";
import { useEffect, useState } from "react";
import { User, Building2, GraduationCap, FileText, ClipboardList, CircleHelp, Hospital, Stethoscope, UserCog, HeartPlus, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { UpdateRegisterdType, UpdateVendorPopUpStatus } from "@/Redux/action";
import CommonSection from "@/Components/StaffRegistration/page";
import CommonFormSection from "@/Components/StaffRegistration/page";
import CommonMedicalSection from "@/Components/StaffRegistration/page";
import { VendorScreens } from "@/Lib/Content";
import { GetUserInformation } from "@/Lib/user.action";
import EmployRegistration from "@/Components/EmployRegistration/page";



export default function UserTypeSelector() {
  const [selected, setSelected] = useState("");
  const [UpdateStatus, SetUpdateStatus] = useState(true)
  const router = useRouter();
  const dispatch = useDispatch()
  const showConfirmPopup = useSelector((state: any) => state.ReferalPopup)

  const [isManagement, setIsManagement] = useState<boolean | null>(null);

useEffect(() => {
  
   const fetch=async()=>{
     const localValue = localStorage.getItem('UserId');
  
        const Sign_in_UserInfo = await GetUserInformation(localValue)
  
     
  if (Sign_in_UserInfo) {
    
    setIsManagement(Sign_in_UserInfo.Email === "admin@curatehealth.in");
  } else {
    setIsManagement(false);
  }
   }
   fetch()
}, []);

  
useEffect(() => {
  const redirectTypes = ["HCA", "HCP", "HCN"];
  if (UpdateStatus === false && redirectTypes.includes(selected)) {
    dispatch(UpdateRegisterdType(selected))
   
    router.push("/HCARegistraion");
  }
}, [selected, UpdateStatus, router]);


const userTypes = [
  {
    label: "HCA",
    icon: <UserCog className="w-6 h-6 text-indigo-600" />,
    info: "Healthcare Assistants providing essential care and support services.",
  },
  {
    label: "HCN",
    icon: <Stethoscope className="w-6 h-6 text-indigo-600" />,
    info: "Healthcare Nurses responsible for patient care and clinical tasks.",
  },
  {
    label: "HCP",
    icon: <HeartPlus className="w-6 h-6 text-indigo-600" />,
    info: "Healthcare Professionals including doctors, physiotherapists, and specialists.",
  },
  {
    label: "HCP Vendor",
    icon: <Building2 className="w-6 h-6 text-indigo-600" />,
    info: "Vendors providing staffing services or contract-based healthcare staff.",
  },
  {
    label: "Business Vendor",
    icon: <FileText className="w-6 h-6 text-indigo-600" />,
    info: "Vendors associated with client-side operations and project execution.",
  },
  {
    label: "Institute",
    icon: <GraduationCap className="w-6 h-6 text-indigo-600" />,
    info: "Institutions or training centers collaborating for healthcare education.",
  },
  {
    label: "Individual Vendor",
    icon: <User className="w-6 h-6 text-indigo-600" />,
    info: "Independent professionals or freelancers offering healthcare-related services.",
  },

 
  {
    label: "Employee Registration",
    icon: <UserCheck className="w-6 h-6 text-indigo-600" />,
    info: "Register internal employees for organizational roles, access control, and operational management.",
  },

  {
    label: "Other",
    icon: <CircleHelp className="w-6 h-6 text-indigo-600" />,
    info: "For roles or categories not listed above. Please specify further details if applicable.",
  },
];




  const handleRegister = () => {
    if (selected) {
      alert(`You selected: ${selected}`);

    } else {
      alert("Please select a user type before proceeding.");
    }
  };

const UpdateView = () => {
  if (!selected) return null;

  
  if (selected === "Employee Registration") {
    if (isManagement === false) {
      return (
      <div className="flex items-center justify-center min-h-screen 
                bg-gradient-to-br from-slate-50 to-slate-100">
  <div className="relative max-w-md w-full text-center p-8 rounded-2xl 
                  bg-white/80 backdrop-blur-xl
                  border border-red-200
                  shadow-[0_20px_40px_-15px_rgba(220,38,38,0.35)]">

    {/* Decorative Glow */}
    <div className="absolute -top-10 -right-10 w-28 h-28 bg-red-200 rounded-full blur-3xl opacity-40" />
    <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-rose-300 rounded-full blur-3xl opacity-30" />

    {/* Icon */}
    <div className="mx-auto mb-5 w-16 h-16 rounded-full 
                    bg-red-100 text-red-600 
                    flex items-center justify-center shadow-inner">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 11c0-1.1.9-2 2-2h2a2 2 0 012 2v3a2 2 0 01-2 2h-6m-4 0H6a2 2 0 01-2-2v-3a2 2 0 012-2h2c1.1 0 2 .9 2 2"
        />
      </svg>
    </div>

    {/* Content */}
    <h2 className="text-2xl font-bold text-gray-800 mb-2">
      Access Restricted
    </h2>

    <p className="text-sm text-gray-600 leading-relaxed">
      This section is reserved for{" "}
      <span className="font-semibold text-red-600">Management users</span>.
      <br />
      You do not currently have permission to view this page.
    </p>

    {/* Divider */}
    <div className="my-6 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent" />

    {/* Action Hint */}
    <p className="text-xs text-gray-500">
      If you believe this is a mistake, please contact your administrator.
    </p>
  </div>
</div>


      );
    }

    if (isManagement === true) {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-0">
         

          
          <EmployRegistration />
        </div>
      );
    }

    return null;
  }

  // ✅ Existing Vendor / Other Screens (unchanged)
  const screenData = VendorScreens[selected];
  if (!screenData) return null;

  return (
    <CommonMedicalSection
      mainTitle={screenData.mainTitle}
      sections={screenData.sections}
    />
  );
};


  return (
<div>
  <div>
     {showConfirmPopup && (
 <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
  <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl 
                  rounded-3xl p-8 w-[420px] text-center relative">

  
<div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-2xl animate-bounce">

  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 text-white animate-[pop_0.6s_ease-out]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path
      d="M5 13l4 4L19 7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>



    <h2 className="text-2xl font-semibold text-gray-800 mb-3">
      Vendor Registration Succesfull
    </h2>


    <p className="text-white mb-8 text-sm leading-relaxed">
      Are  you want to register your referred member?
    </p>


    <div className="flex justify-center gap-5 mt-6">
      <button
      onClick={()=>  router.push("/register")}
        className="px-6 py-2.5 cursor-pointer rounded-xl text-white font-medium shadow-lg 
                   bg-green-600 
                   hover:from-red-600 hover:to-red-700 transition-all duration-300"
      >
        Yes, Register
      </button>

      <button
      onClick={()=>{dispatch(UpdateVendorPopUpStatus(false));SetUpdateStatus(!UpdateStatus)}}
        className="px-6 py-2.5 rounded-xl cursor-pointer font-medium shadow bg-gray-100 text-gray-800 
                   hover:bg-gray-200 transition-all duration-300"
      >
        No, Cancel
      </button>
    </div>
  </div>
</div>

  )}
  </div>
 {UpdateStatus?

     <div className="relative w-full  mx-auto bg-gradient-to-b from-white via-sky-50 to-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-4 border border-gray-100 overflow-hidden">

  
  <div className="w-full h-2  rounded-t-3xl" />


  <div className="text-center mb-6">
   
    <h1 className="md:text-4xl text-[30px] font-extrabold text-[#ff1493] mb-2">Select Your User Type</h1>
    <p className="text-gray-500 text-base md:text-lg leading-relaxed">
      Choose the category that best describes your role to continue the setup process.
    </p>
  </div>


  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {userTypes.map((type) => (
      <div
        key={type.label}
        onClick={() => setSelected(type.label)}
        className={`group relative cursor-pointer rounded-2xl border transition-all duration-500 p-2
          ${
            selected === type.label
              ? "border-sky-500 bg-gradient-to-b from-sky-50 to-white shadow-xl shadow-sky-100"
              : "border-gray-200 bg-white hover:border-sky-300 hover:shadow-lg hover:shadow-sky-50"
          }`}
      >
      
        {selected === type.label && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-100/40 via-transparent to-transparent blur-2xl pointer-events-none"></div>
        )}


        <div
          className={`mb-4 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-500 
            ${
              selected === type.label
                ? "bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-md"
                : "bg-gray-100 text-gray-500 group-hover:bg-sky-50 group-hover:text-sky-600"
            }`}
        >
          {type.icon}
        </div>

    
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {type.label}
        </h3>


        <p className="text-sm text-gray-500 leading-snug">
          {type.info}
        </p>

     
        {selected === type.label && (
          <div className="absolute top-4 right-4 bg-sky-500 text-white rounded-full p-1.5 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    ))}
  </div>

<div className="flex justify-center mt-8">  
    
    <button
  onClick={()=>SetUpdateStatus(!UpdateStatus)}
  className="px-12 py-3 rounded-full text-white font-semibold text-lg 
    bg-[#50c896] cursor-pointer shadow-lg hover:shadow-xl transition-all 
    duration-500 hover:scale-105 focus:outline-none"
>
  Register
</button>
</div>

</div>:UpdateView()}

</div>

  );
}
