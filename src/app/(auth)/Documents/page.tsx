"use client";

import { LoadingData } from "@/Components/Loading/page";
import { statusFilters } from "@/Lib/Content";
import { GetRegidterdUsers, GetUsersFullInfo, UpdateDocumentFollowUpStatus, UpdateDocumentFollowUpStatusInFullInfo } from "@/Lib/user.action";
import { Update_Main_Filter_Status } from "@/Redux/action";
import { Eye, Search, FileUser, LogOut, Clock, Calendar, X, Filter, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

interface PreviewRow {
  FirstName: string;
  LastName?: string;
  ContactNumber: string;
  UserId?: string;
  missingDocs: string[];
  responsible: string;
  followTime: string;
  followDate: string;
  DocumentSkipReason: string;
  [key: string]: any;
}



const attachmentKeys = [
  "AadharAttachmentURL",
  "PANAttachmentURL",
  "BankProofURL",
  "CompanyPANAttachmentURL",
];

export default function MedicalGlassDashboardTable() {
  const [query, setQuery] = useState("");
  const [isChecking, setisChecking] = useState(true)
  const [showAll, setShowAll] = useState(false);
  const [PreviwData, setPreviwData] = useState<PreviewRow[]>([]);
  const [UpdatingStatus,setUpdatingStatus]=useState("Please Wait Updating...")
  const dispatch = useDispatch();
  const router = useRouter();
  const [fullInfo, setFullInfo] = useState<any>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [CurrentIndexNumber, setCurrentIndexNumber] = useState<any>()
   const [selectedRecord, setSelectedRecord] = useState<any>(false);

const UserFullInfo=useSelector((state:any)=>state.AdminFullInfo)
const RegisterdInfo=useSelector((state:any)=>state.AdminUsers)
const GetCurrentStatus=(A:any)=>{
   if (!RegisterdInfo?.length || !A) return "";
     const info = RegisterdInfo?.find((info: any) => info?.userId === A);

   return info

}

console.log("Look For Contact-----",RegisterdInfo)
const GetHCPFullName = (A: any) => {
  if (!UserFullInfo?.length || !A) return "";

  const info = UserFullInfo
    ?.map((each: any) => each?.HCAComplitInformation)
    ?.find((info: any) => info?.UserId === A);

  if (!info) return "";
console.log("HCP Info:", info);
  const fullName = [
    info.HCPSurName,
    info.HCPFirstName,
    info.LastName,
  ]
    .filter(Boolean)
    .join(" ");

  return fullName;
};
 useEffect(() => {
  const Fetch = async () => {
    const [ Full] = await Promise.all([
   
      GetUsersFullInfo(),
    ]);

    setFullInfo(Full);
  
    setisChecking(false);
  };

  Fetch();
}, []);


const statusCounts = useMemo(() => {
  const counts: Record<string, number> = {
    Active: 0,
    Bench: 0,
    Training: 0,
    Sick: 0,
    Leave: 0,
    Terminated: 0,
  };

  RegisterdInfo
    ?.filter((item: any) => item?.userType === "healthcare-assistant")
    ?.forEach((item: any) => {
      const status = item?.CurrentStatus || "Sick";

      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

  return counts;
}, [RegisterdInfo]);

  const handleLogout = useCallback(() => {
    dispatch(Update_Main_Filter_Status(""));
    router.push("/DashBoard");
  }, [dispatch, router]);

 
  
    const handleMainLogout = async () => {
      localStorage.removeItem("UserId");
      router.prefetch("/");
      router.push("/");
    };
  
const getDocumentsByUserId = (userId: string) => {
  const userInfo = fullInfo.find(
    (each: any) =>
      each?.HCAComplitInformation?.UserId === userId
  );

  return userInfo?.HCAComplitInformation?.Documents || {};
};

 const result = useMemo(() => {
  return RegisterdInfo
    .map((each: any) => {
      const doc = getDocumentsByUserId(each.userId) || {};

   const missingDocs = Object.keys(doc).filter((key) => {
  const value = doc[key];
  return value === "" || value === null || value === undefined;
});

const availableDocs = Object.keys(doc).filter((key) => {
  const value = doc[key];
  return value !== "" && value !== null && value !== undefined;
});

      return {
        FirstName: GetHCPFullName(each?.userId) || "Not Provided",
        ContactNumber:
         GetCurrentStatus(each?.userId)?.
ContactNumber
||
          "+91**********",
        UserId:each?.userId|| "",
        missingDocs,
        availableDocs,
        userType: each?.userType || "",
        CurrentStatus:each.CurrentStatus || "Sick",
      };
    })
    .filter((item:any) =>(selectedFilter === "All" ||
      item.CurrentStatus === selectedFilter)&&item.userType===
"healthcare-assistant"); 
}, [fullInfo,selectedFilter]);

console.log ("Get Current Values-------",result)
  const Valueresult: any = useMemo(() => {
    return RegisterdInfo.filter((obj: any) => obj.userType === "Vendor").map(
      (obj: any) => {
        const present: any = [];
        const missing: any = [];

        attachmentKeys.forEach((key) => {
          if (obj[key] && obj[key] !== "") {
            present.push({ key, value: obj[key] });
          } else {
            missing.push(key);
          }
        });

        return {
          UserId: obj.userId || "",
          userType:obj.userType||"",
          FirstName: obj.VendorName || "Not Provided",
          ContactNumber: obj.ContactNumber || "+91**********",
          DocumentSkipReason:obj.DocumentSkipReason||'',
          followTime:obj.followTime||"",
          followDate:obj.followDate||"",
          presentAttachments: present,
          missingDocs: missing.map((each: any) => each.slice(0, 10)),
        };
      }
    );
  }, [RegisterdInfo]);

const FinelPreviewData = useMemo(() => {
  const map = new Map();

  [...result, ].forEach((item: any) => {
    if (!map.has(item.UserId)) {
      map.set(item.UserId, item);
    }
  });

  return Array.from(map.values());
}, [result, Valueresult]);

  useEffect(() => {
    if (FinelPreviewData.length === 0) return;

    const cleaned = FinelPreviewData.map((p) => ({
      ...p,
      followTime: p.followTime || "",
      followDate: p.followDate || "",
      responsible: p.responsible || "",
      DocumentSkipReason: p.DocumentSkipReason || "",
    }));
console.log("Check for Task-----",cleaned)
    setPreviwData(cleaned);
  }, [FinelPreviewData]);


  if (isChecking) {
    return (
      <LoadingData />
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8fdf9] via-[#eefcfb] to-[#f4fefd] p-4">


      {/* ================= DOCUMENT COMPLIANCE HEADER ================= */}
<div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

  {/* Top Header */}
  <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">

    {/* Company Logo + Title */}
    <div className="flex items-center gap-4 shrink-0">

      {/* Company Logo */}
      <div className="
        flex h-12 w-12 items-center justify-center
        overflow-hidden rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
      ">
        <img
          src="/Icons/Curate-logoq.png"
          alt="Company Logo"
          className="h-full w-full object-contain p-1.5"
        />
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
          Document Compliance
        </h1>

        <p className="mt-0.5 text-xs font-medium text-slate-400">
          Document verification & compliance
        </p>
      </div>
    </div>


    {/* Search + Actions */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

      {/* Search */}
      <div className="
        flex h-11 w-full items-center gap-2.5
        rounded-xl border border-slate-200
        bg-slate-50 px-3.5
        transition-all
        focus-within:border-[#0EA5A3]
        focus-within:bg-white
        focus-within:ring-2
        focus-within:ring-[#0EA5A3]/10
        sm:w-[300px]
      ">
        <Search size={18} className="shrink-0 text-slate-400" />

        <input
          type="text"
          placeholder="Search by name..."
          className="
            w-full bg-transparent
            text-sm text-slate-700
            outline-none
            placeholder:text-slate-400
          "
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>


      {/* Dashboard */}
      <button
        type="button"
        onClick={handleLogout}
        className="
          inline-flex h-11 items-center justify-center
          gap-2 rounded-xl
          bg-[#0EA5A3]
          px-5
          text-sm font-semibold text-white
          shadow-sm
          transition-all duration-200
          hover:bg-[#088b89]
          hover:shadow-md
          active:scale-[0.98]
        "
      >
        <LayoutDashboard size={17} />
        Dashboard
      </button>


      {/* Logout */}
      <button
        type="button"
        onClick={handleMainLogout}
        className="
          inline-flex h-11 items-center justify-center
          gap-2 rounded-xl
          border border-red-100
          bg-red-50
          px-4
          text-sm font-semibold text-red-600
          transition-all duration-200
          hover:bg-red-100
          active:scale-[0.98]
        "
      >
        <LogOut size={16} />
        Logout
      </button>

    </div>
  </div>


  {/* Uploaded Filters */}
  <div className="
    flex flex-col gap-3
    border-t border-slate-100
    bg-slate-50/60
    px-5 py-3.5
    lg:flex-row lg:items-center
  ">

    {/* Filter Label */}
    <div className="flex items-center gap-2 shrink-0">
      <Filter size={16} className="text-slate-500" />

    
    </div>


 {/* Status Filters */}
{/* Status Filters */}
<div className="flex flex-wrap items-center justify-center gap-2">

  {/* All */}
  <button
    type="button"
    onClick={() => setSelectedFilter("All")}
    className={`inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm border border-slate-100 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md ${
      selectedFilter === "All"
        ? "ring-2 ring-slate-400/40"
        : ""
    }`}
  >
    <span className="h-3 w-3 rounded-full bg-gradient-to-br from-slate-500 to-slate-700" />

    <span>All</span>

    <span className="min-w-[22px] rounded-full bg-slate-100 px-1.5 py-0.5 text-center text-xs font-bold text-slate-600">
      {Object.values(statusCounts).reduce((a, b) => a + b, 0)}
    </span>
  </button>


  {/* Status Buttons */}
  {statusFilters.map((status) => (
    <button
      key={status.label}
      type="button"
      onClick={() => setSelectedFilter(status.label)}
      className={`inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm border border-slate-100 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md ${
        selectedFilter === status.label
          ? `ring-2 ${status.ring}`
          : ""
      }`}
    >
      <span
        className={`h-3 w-3 rounded-full ${status.dot}`}
      />

      <span>{status.label}</span>

      <span
        className={`min-w-[22px] rounded-full bg-${status.color}-50 px-1.5 py-0.5 text-center text-xs font-bold text-${status.color}-600`}
      >
        {statusCounts[status.label] || 0}
      </span>
    </button>
  ))}

</div>
  </div>

</div>
{selectedRecord && (
       <div
  className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
  onClick={() => setSelectedRecord(null)}
>
  <div
    className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-6 w-[90%] max-w-lg relative animate-fadeIn"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      onClick={() => setSelectedRecord(null)}
      className="absolute top-3 right-3 text-gray-700 hover:text-red-600"
    >
      <X size={22} onClick={()=>setSelectedRecord(false)}/>
    </button>

  
    <div className="flex flex-col items-center justify-center py-10">
  {UpdatingStatus!=="✅ Updated Successfully"&&
      <svg
        className="animate-spin h-12 w-12 text-blue-600 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>}


      <p className="text-xl font-semibold text-gray-700 animate-pulse">
       {UpdatingStatus}
      </p>
    </div>
  </div>
</div>

      )}

   <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-lg overflow-hidden">

  {/* Header */}
<div
  className="
    grid
    grid-cols-[60px_160px_repeat(9,minmax(130px,1fr))]
    bg-[#dff9f7]/80
    border-b border-gray-200
    min-w-[1390px]
  "
>
  {[
    "S No",
    "Names",
    "Aadhar",
    "PAN",
    "BVR",
    "Bank",
    "Primary education certificate",
    "Primary experience certificate",
    "Reference Certificate",
    "Health Certificate",
    "Other",
  ].map((h) => (
    <div
      key={h}
      className="
        min-h-[56px]
        flex
        items-center
        justify-center
        px-3
        py-3
        text-xs
        sm:text-sm
        font-semibold
        text-[#093c3a]
        text-center
        border-r
        border-gray-200
        whitespace-normal
        leading-tight
      "
    >
      {h}
    </div>
  ))}
</div>

  {/* Rows */}
  <div className="overflow-x-auto">
    <div className="min-w-[1100px]">

      {PreviwData.map((p: any, i: number) => {

        const availableDocs = (p.availableDocs || []).map((doc: string) =>
          doc.toLowerCase().trim()
        );

        const missingDocs = (p.missingDocs || []).map((doc: string) =>
          doc.toLowerCase().trim()
        );

        // Checks whether document is available
        const hasDocument = (...names: string[]) => {
          return names.some((name) => {
            const normalized = name.toLowerCase().trim();

            return (
              availableDocs.includes(normalized) ||
              availableDocs.some((doc: string) =>
                doc.includes(normalized) || normalized.includes(doc)
              )
            );
          });
        };

      const documents = [
  {
    label: "Aadhar",
    available: hasDocument(
      "aadhar",
      "aadhaar",
      "aadhar card",
      "aadhaar card"
    ),
  },
  {
    label: "PAN",
    available: hasDocument(
      "pan",
      "pan card"
    ),
  },
  {
    label: "BVR",
    available: hasDocument(
      "bvr",
      "bvr document",
      "bvr certificate"
    ),
  },
  {
    label: "Bank",
    available: hasDocument(
      "bank",
      "bank document",
      "bank passbook",
      "bank account"
    ),
  },
  {
    label: "Primary education certificate",
    available: hasDocument(
      "primary education certificate",
      "education certificate",
      "primary education"
    ),
  },
  {
    label: "Primary experience certificate",
    available: hasDocument(
      "primary experience certificate",
      "experience certificate",
      "primary experience"
    ),
  },
  {
    label: "Reference Reference",
    available: hasDocument(
      "reference",
      "reference document",
      "reference certificate"
    ),
  },
  {
    label: "Health Certificate",
    available: hasDocument(
      "health certificate",
      "health certificate document",
      "medical certificate",
      "medical"
    ),
  },
  {
    label: "Other",
    available: hasDocument(
      "other",
      "other document",
      "other certificate"
    ),
  },
];

        return (
          <div
            key={p.UserId || i}
            className="
              grid
              grid-cols-[70px_180px_repeat(9,minmax(140px,1fr))]
              items-center
              border-b border-gray-200
              hover:bg-[#f4fffe]
              transition-colors
            "
          >

            {/* S No */}
            <div
              className="
                py-5 px-3
                text-center
                text-sm
                font-medium
                text-gray-700
                border-r border-gray-200
              "
            >
              {i + 1}
            </div>

            {/* Name */}
            <div
              className="
                py-5 px-3
                text-center
                text-sm
                font-semibold
                text-[#093c3a]
                border-r border-gray-200
              "
            >
              {p.FirstName || p.Name || "Unknown"}
            </div>

            {/* Documents */}
            {documents.map((doc) => (
              <div
                key={doc.label}
                className="
                  py-5 px-3
                  flex
                  items-center
                  justify-center
                  border-r border-gray-200
                "
              >
                <span
                  className={`
                    text-sm
                    font-semibold
                    ${
                      doc.available
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  `}
                >
                  {doc.available ? "Yes" : "No"}
                </span>
              </div>
            ))}

          </div>
        );
      })}

    </div>
  </div>

</div>
    </div>
  );
}
