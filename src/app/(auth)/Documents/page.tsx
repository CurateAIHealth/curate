"use client";

import { LoadingData } from "@/Components/Loading/page";
import { GetRegidterdUsers, GetUsersFullInfo, UpdateDocumentFollowUpStatus, UpdateDocumentFollowUpStatusInFullInfo } from "@/Lib/user.action";
import { Update_Main_Filter_Status } from "@/Redux/action";
import { Eye, Search, FileUser, LogOut, Clock, Calendar, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";

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
  const [RegisterdInfo, setRegisterdInfo] = useState<any>([]);
  const [CurrentIndexNumber, setCurrentIndexNumber] = useState<any>()
   const [selectedRecord, setSelectedRecord] = useState<any>(false);




  useEffect(() => {
    const Fetch = async () => {
      const [Registerd, Full] = await Promise.all([
        GetRegidterdUsers(),
        GetUsersFullInfo(),
      ]);
    
   

  setFullInfo(Full);

      setRegisterdInfo(Registerd);
      setisChecking(false)
    };
    Fetch();
  }, [selectedRecord]);

  const handleChange = useCallback(
    (index: number, field: keyof PreviewRow, value: string) => {
      setPreviwData(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [field]: value
        };
        return updated;
      });

    },
    []
  );



  const handleSave = useCallback(async(info: any) => {
setSelectedRecord(true)
    if (info.userType === "Vendor") {
     const Post_Update:any=await UpdateDocumentFollowUpStatus(info.UserId,info)
     if(Post_Update.success===true){
      setUpdatingStatus("✅ Updated Successfully")
     }
    } else {
      const NewNotificationTriger=await UpdateDocumentFollowUpStatus(info.UserId,info)
      const Post_Update:any=await UpdateDocumentFollowUpStatusInFullInfo(info.UserId,info)
     if(Post_Update.success===true){
      setUpdatingStatus("✅ Updated Successfully")
     }
    }

  }, []);

  const handleLogout = useCallback(() => {
    dispatch(Update_Main_Filter_Status(""));
    router.push("/DashBoard");
  }, [dispatch, router]);


 const result = useMemo(() => {
  return fullInfo
    .map((each: any) => {
      const doc = each?.HCAComplitInformation?.Documents || {};

      const missingDocs = Object.keys(doc).filter((key) => {
        const value = doc[key];
        return value === "" || value === null || value === undefined;
      });

      return {
        FirstName: each?.HCAComplitInformation?.HCPFirstName || "Not Provided",
        LastName: each?.HCAComplitInformation?.HCPSurName || "Not Provided",
        DocumentSkipReason: each?.HCAComplitInformation?.DocumentSkipReason || "",
        followTime: each?.HCAComplitInformation?.followTime || "",
        followDate: each?.HCAComplitInformation?.followDate || "",
        ContactNumber:
          each?.HCAComplitInformation?.HCPContactNumber ||
          each?.HCAComplitInformation?.["Phone No 1"] ||
          "+91**********",
        UserId: each?.HCAComplitInformation?.UserId || "",
        missingDocs,
        userType: each?.HCAComplitInformation?.userType || "",
      };
    })
    .filter((item:any) => item.missingDocs.length > 0); 
}, [fullInfo]);


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

  const FinelPreviewData = useMemo(
    () => [...result, ...Valueresult],
    [result, Valueresult]
  );
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

  console.log("Saved Row Data:", FinelPreviewData);
  if (isChecking) {
    return (
      <LoadingData />
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8fdf9] via-[#eefcfb] to-[#f4fefd] p-4">


      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-5">

        <div className="flex items-center gap-3">
          <FileUser size={36} className="text-[#0EA5A3]" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#ff1493]">
            Document Compliance
          </h1>
        </div>


        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-white/60 border border-[#cceeea] shadow px-4 py-3 rounded-xl w-full sm:w-[360px]">
            <Search size={20} className="text-[#50c896]" />
            <input
              type="text"
              placeholder="Search by name..."
              className="bg-transparent flex-1 outline-none text-[#073e3b]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>


          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#00A9A5] hover:bg-[#008f8b] text-white rounded-xl shadow-md transition"
          >
            <LogOut size={20} /> DashBoard
          </button>
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

      <div className="rounded-2xl bg-white/50 backdrop-blur-xl border border-white/30 shadow overflow-hidden">

        <div className="hidden md:grid grid-cols-9 bg-[#dff9f7]/70 border-b border-white/40">
          {[
            "View",
            "Name",
            "Missing Documents",
            "Status",
            "Contact",
            "Follow Up",
            "Responsible",
            "Reason",
            "Update",
          ].map((h) => (
            <div
              key={h}
              className="py-4 px-4 text-sm font-semibold text-[#093c3a] text-center"
            >
              {h}
            </div>
          ))}
        </div>


        {PreviwData.map((p: any, i: any) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-9 items-center">


            <div className="hidden md:flex justify-center items-center py-6">
              <Eye size={22} className="text-[#083634]" />
            </div>

            <div className="py-4 md:py-6 text-center">{p.FirstName}</div>



            <div className="py-4 md:py-6 flex flex-col items-center gap-2">
              <div className="flex flex-wrap gap-2 justify-center max-w-[200px]">
                {(showAll ? p.missingDocs : p.missingDocs.slice(0, 2)).map((d: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-red-200/40 text-red-700 text-xs rounded-full whitespace-nowrap"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {p.missingDocs.length > 2 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-[10px] text-[#00A9A5] hover:underline cursor-pointer"
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              )}
            </div>



            <div className="py-4 md:py-6 flex justify-center">
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                Pending
              </span>
            </div>


            <div className="py-4 md:py-6 text-center text-[#0EA5A3]">
              {p.ContactNumber}
            </div>

           <div className="py-4 md:py-6 flex items-center justify-center gap-6">


  <div className="flex flex-col items-center">
    <div className="relative">
    
      <button
        onClick={() => document.getElementById(`time_${i}`)?.click()}
        className="h-10 w-10 flex items-center justify-center rounded-full border border-[#00A9A5] text-[#00A9A5] bg-white shadow hover:bg-[#e8fdf9] transition"
      >
        <Clock size={18} strokeWidth={2} />
      </button>

      <input
        id={`time_${i}`}
        type="time"
        className="absolute inset-0 opacity-0 cursor-pointer"
        value={p.followTime || ""}
        onChange={(e) => handleChange(i, "followTime", e.target.value)}
      />
    </div>

  
    {p.followTime && (
      <p className="text-xs mt-1 text-[#036b68] font-medium">
        {p.followTime}
      </p>
    )}
  </div>

  <div className="flex flex-col items-center">
    <div className="relative">
      <button
        onClick={() => document.getElementById(`date_${i}`)?.click()}
        className="h-10 w-10 flex items-center justify-center rounded-full border border-[#00A9A5] text-[#00A9A5] bg-white shadow hover:bg-[#e8fdf9] transition"
      >
        <Calendar size={18} strokeWidth={2} />
      </button>

      <input
        id={`date_${i}`}
        type="date"
        className="absolute inset-0 opacity-0 cursor-pointer"
        value={p.followDate || ""}
        onChange={(e) => handleChange(i, "followDate", e.target.value)}
      />
    </div>


    {p.followDate && (
      <p className="text-xs mt-1 text-[#036b68] font-medium">
        {new Date(p.followDate).toLocaleDateString('En-in')}
      </p>
    )}
  </div>

</div>


            <input
              type="text"
              value={p.responsible}
              placeholder="Enter Responsible..."
              className="w-[150px] px-3 py-1.5 text-sm text-center bg-white/70 border border-[#cceeea] rounded-lg"
              onChange={(e) => handleChange(i, "responsible", e.target.value)}
            />

            <div className="py-4 md:py-6 flex justify-center">
              {CurrentIndexNumber === i ? (

                <div className="flex flex-col ml-4 items-center gap-2">
                  <input
                    type="text"
                    value={p.DocumentSkipReason || ""}
                    placeholder="Enter reason..."
                    className="w-[180px] px-3 py-2 text-sm text-center bg-white/80 border border-[#b4e1ff] rounded-lg shadow-sm"
                    onChange={(e) => {
                      setCurrentIndexNumber(i);
                      handleChange(i , "DocumentSkipReason", e.target.value);
                    }}
                  />

                  <button
                    onClick={() => setCurrentIndexNumber(-1)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              ) : p.DocumentSkipReason && p.DocumentSkipReason.trim() !== "" ? (
          
                <button
                  onClick={() => setCurrentIndexNumber(i)}
                  className="px-4 py-2 bg-[#1392d3] text-white rounded-lg"
                >
                  Update Reason
                </button>
              ) : (
       
                <div className="flex flex-col ml-4 items-center gap-2">
                  <input
                    type="text"
                    value={p.DocumentSkipReason || ""}
                    placeholder="Enter reason..."
                    className="w-[180px] px-3 py-2 text-sm text-center bg-white/80 border border-[#b4e1ff] rounded-lg"
                    onChange={(e) => {
                      setCurrentIndexNumber(i);  
                      handleChange(i, "DocumentSkipReason", e.target.value);
                    }}
                  />

                  <button
                    onClick={() => setCurrentIndexNumber(-1)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>




            <div className="py-4 md:py-6 flex justify-center">
              <button
                onClick={() => handleSave(p)}
                className="px-4 py-1.5 text-xs cursor-pointer font-semibold bg-[#00A9A5] text-white rounded-full shadow-md hover:bg-[#008f8b] transition"
              >
                Save
              </button>
            </div>

          </div>
        ))}
        
      </div>
    </div>
  );
}
