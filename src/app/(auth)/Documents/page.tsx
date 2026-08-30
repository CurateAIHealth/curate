"use client";

import { LoadingData } from "@/Components/Loading/page";
import { statusFilters } from "@/Lib/Content";
import { GetRegidterdUsers, GetUsersFullInfo, GetUsersFullInfoForMissingDocuments, UpdateDocumentFollowUpStatus, UpdateDocumentFollowUpStatusInFullInfo } from "@/Lib/user.action";
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


const GetHCPFullName = (A: any) => {
  if (!UserFullInfo?.length || !A) return "";

  const info = UserFullInfo
    ?.map((each: any) => each?.HCAComplitInformation)
    ?.find((info: any) => info?.UserId === A);

  if (!info) return "";

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
    try {
      setisChecking(true);

      const cachedData = sessionStorage.getItem("FullInfo");

      if (cachedData) {
        setFullInfo(JSON.parse(cachedData));
        return;
      }

      const Full: any = await GetUsersFullInfoForMissingDocuments();

      setFullInfo(Full);

      sessionStorage.setItem("FullInfo", JSON.stringify(Full));
    } catch (error) {
      console.error("Error fetching full info:", error);
      setFullInfo([]);
    } finally {
      setisChecking(false);
    }
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
console.log ("Check Priti Docs-----",getDocumentsByUserId("778af4ef-5a87-426a-bd27-2d2257480038"))
 const result = useMemo(() => {
  return RegisterdInfo
    .map((each: any) => {
      const doc = getDocumentsByUserId(each.userId) || {};

   const missingDocs = Object.keys(doc).filter((key) => {
  const value = doc[key];
  return value === "" || value === null || value === undefined;
});

const availableDocs = Object.entries(doc)
  .filter(([_, value]) => {
    return (
      typeof value === "string" &&
      value.trim() !== "" &&
      value.toLowerCase().includes("cloudinary.com")
    );
  })
  .map(([key]) => key);

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
const filteredPreviewData = useMemo(() => {
  const search = query.trim().toLowerCase();

  if (!search) {
    return PreviwData;
  }

  return PreviwData.filter((item: any) => {
    const name = item.FirstName?.toLowerCase() || "";
    const contact = item.ContactNumber?.toLowerCase() || "";
    const userId = item.UserId?.toLowerCase() || "";

    return (
      name.includes(search) ||
      contact.includes(search) ||
      userId.includes(search)
    );
  });
}, [PreviwData, query]);
  useEffect(() => {
    if (FinelPreviewData.length === 0) return;

    const cleaned = FinelPreviewData.map((p) => ({
      ...p,
      followTime: p.followTime || "",
      followDate: p.followDate || "",
      responsible: p.responsible || "",
      DocumentSkipReason: p.DocumentSkipReason || "",
    }));

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

  {/* ================= SCROLLABLE TABLE ================= */}
<div
  className="
    relative
    max-h-[calc(100vh-205px)]
    w-full
    overflow-x-auto
    overflow-y-auto
    overscroll-contain
    scrollbar-hide
  "
>

    {/* ================= TABLE ================= */}
    <div className="min-w-[1510px] w-max">

      {/* ================= TABLE HEADER ================= */}
      <div
        className="
          sticky top-0 z-30
          grid
          grid-cols-[70px_180px_repeat(9,140px)]
          min-h-[56px]
          bg-[#dff9f7]
          border-b border-gray-200
          shadow-sm
        "
      >

        {/* S No */}
        <div
          className="
            sticky left-0 z-40
            flex items-center justify-center
            px-3 py-3
            text-xs sm:text-sm
            font-semibold
            text-[#093c3a]
            text-center
            border-r border-gray-200
            bg-[#dff9f7]
          "
        >
          S No
        </div>

        {/* Names */}
        <div
          className="
            sticky left-[70px] z-40
            flex items-center justify-center
            px-3 py-3
            text-xs sm:text-sm
            font-semibold
            text-[#093c3a]
            text-center
            border-r border-gray-200
            bg-[#dff9f7]
          "
        >
          Names
        </div>

        {[
          "Aadhar",
          "PAN",
          "BVR",
          "Bank",
          "Education",
          "Experience",
          "Reference",
          "Health",
          "Other",
        ].map((h) => (
          <div
            key={h}
            className="
              flex items-center justify-center
              px-3 py-3
              text-xs sm:text-sm
              font-semibold
              text-[#093c3a]
              text-center
              border-r border-gray-200
              whitespace-normal
              leading-tight
            "
          >
            {h}
          </div>
        ))}
      </div>

      {/* ================= TABLE ROWS ================= */}
      {filteredPreviewData.map((p: any, i: number) => {

        const availableDocs = (p.availableDocs || []).map(
          (doc: string) =>
            doc.toLowerCase().replace(/[^a-z0-9]/g, "")
        );

const hasDocument = (...names: string[]) => {
  return names.some((name) => {
    const normalizedName = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    return availableDocs.some((doc: string) => {
      const normalizedDoc = doc
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      return (
        normalizedDoc === normalizedName ||
        normalizedDoc.includes(normalizedName) ||
        normalizedName.includes(normalizedDoc)
      );
    });
  });
};

      const documents = [
  {
    label: "Aadhar",
    available: hasDocument(
      "AadharAttachmentURL",
      "AadharCard",
      "Aadhar",
      "Aadhaar",
      "Adhar"
    ),
  },
  {
    label: "PAN",
    available: hasDocument(
      "PanCard",
      "PANAttachmentURL",
      "PAN",
      "Pancard"
    ),
  },
  {
    label: "BVR",
    available: hasDocument(
      "BVR",
      "BVRDocument",
      "BVRCertificate"
    ),
  },
  {
    label: "Bank",
    available: hasDocument(
      "AccountPassBook",
      "BankProofURL",
      "Bank",
      "BankProof",
      "BankPassBook"
    ),
  },
  {
    label: "Education",
    available: hasDocument(
      "CertificateOne",
   
      "Education",
      "EducationCertificate",
      "PrimaryEducation",
      "CertificatOne"
    ),
  },
  {
    label: "Experience",
    available: hasDocument(
      "Experience",
      "ExperienceCertificate",
      "PrimaryExperience",
         "CertificateTwo",
      "CertificatTwo"
    ),
  },
  {
    label: "Reference",
    available: hasDocument(
      "ReferenceCertificate",
      "Reference",
      "ReferenceDocument"
    ),
  },
  {
    label: "Health",
    available: hasDocument(
      "HealthCertificate",
      "Health",
      "MedicalCertificate",
      "Medical"
    ),
  },
  {
    label: "Other",
    available: hasDocument(
      "Other",
      "OtherDocument",
      "OtherCertificate"
    ),
  },
];
        return (
          <div
            key={p.UserId || i}
            className="
              grid
              grid-cols-[70px_180px_repeat(9,140px)]
              items-center
              border-b border-gray-200
              hover:bg-[#f4fffe]
              transition-colors
            "
          >

            {/* S No */}
            <div
              className="
                sticky left-0 z-20
                py-5 px-3
                flex items-center justify-center
                text-center
                text-sm
                font-medium
                text-gray-700
                border-r border-gray-200
                bg-white
              "
            >
              {i + 1}
            </div>

            {/* Name */}
            <div
              className="
                sticky left-[70px] z-20
                py-5 px-3
                flex items-center justify-center
                text-center
                text-sm
                font-semibold
                text-[#093c3a]
                border-r border-gray-200
                bg-white
                whitespace-normal
                break-words
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
                  flex items-center justify-center
                  border-r border-gray-200
                  bg-white
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
