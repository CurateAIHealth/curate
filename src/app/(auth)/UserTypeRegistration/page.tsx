"use client";
import { useEffect, useState } from "react";
import { User, Building2, GraduationCap, FileText, ClipboardList, CircleHelp, Hospital, Stethoscope, UserCog, HeartPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { UpdateRegisterdType } from "@/Redux/action";

export default function UserTypeSelector() {
    const [selected, setSelected] = useState("");
    const [UpdateStatus, SetUpdateStatus] = useState(true)
    const router = useRouter();
    const dispatch = useDispatch()
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
    icon:  <HeartPlus className="w-6 h-6 text-indigo-600" />,
    info: "Healthcare Professionals including doctors, physiotherapists, and specialists.",
  },
  {
    label: "Staff Vendor",
    icon: <Building2 className="w-6 h-6 text-indigo-600" />,
    info: "Vendors providing staffing services or contract-based healthcare staff.",
  },
  {
    label: "Client Vendor",
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
    switch (selected) {
      case "Staff Vendor":
      case "Client Vendor":
      case "Institute":
      case "Individual Vendor":
      case "Other":
        return <p className="text-xl font-semibold text-gray-700 flex items-center justify-center gap-2 animate-pulse mt-6">
  <span className="text-[#0077b6] font-bold">⏳</span>
  Working on it <span className="text-[#0096c7]">({selected})</span>...
</p>

      default:
        return null;
    }
  };

  return (
<div>
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
