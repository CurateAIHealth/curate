"use client";

import {  LoadingData } from "@/Components/Loading/page";
import { GetRegidterdUsers, GetUsersFullInfo } from "@/Lib/user.action";
import { Update_Main_Filter_Status } from "@/Redux/action";
import { Eye, Search, FileUser, LogOut, Clock, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";

const patientsData = [
  {
    name: "Ramesh Kumar",
    missingDocs: ["Aadhar", "Bank PassBook"],
    status: "Pending",
    contact: "+918475632147",
    followup: "2 Days",
    responsible: "",
    reason: "",
  },
  {
    name: "Sanjay Verma",
    missingDocs: ["PAN Card"],
    status: "Pending",
    contact: "+919654712547",
    followup: "1 Day",
    responsible: "Sai",
    reason: "",
  },
];


const attachmentKeys = [
  "AadharAttachmentURL",
  "PANAttachmentURL",
  "BankProofURL",
  "CompanyPANAttachmentURL",
];

export default function MedicalGlassDashboardTable() {
  const [query, setQuery] = useState("");
  const [isChecking,setisChecking]=useState(true)
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [fullInfo, setFullInfo] = useState<any>([]);
  const [RegisterdInfo, setRegisterdInfo] = useState<any>([]);


  const [rows, setRows] = useState(
    patientsData.map((p) => ({
      ...p,
      followTime: "",
      followDate: "",
      reason: p.reason || "",
    }))
  );

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
  }, []);


  const handleChange = useCallback((index: number, field: any, value: any) => {
    setRows((prev) => {
      const updated: any = [...prev];
      updated[index][field] = value;
      return updated;
    });
  }, []);

  const handleSave = useCallback((index: number) => {
    console.log("Saved Row Data:", rows[index]);
  }, [rows]);

  const handleLogout = useCallback(() => {
    dispatch(Update_Main_Filter_Status(""));
    router.push("/DashBoard");
  }, [dispatch, router]);


  const result = useMemo(() => {
    return fullInfo.map((each: any) => {
      const doc = each?.HCAComplitInformation?.Documents || {};

      const missingDocs = Object.keys(doc).filter((key) => {
        const value = doc[key];
        return value === "" || value === null || value === undefined;
      });

      return {
        FirstName: each?.HCAComplitInformation?.HCPFirstName || "",
        LastName: each?.HCAComplitInformation?.HCPSurName || "",
        ContactNumber:
          each?.HCAComplitInformation?.HCPContactNumber ||
          each?.HCAComplitInformation?.["Phone No 1"] ||
          "",
        UserId: each?.HCAComplitInformation?.UserId || "",
        missingDocs,
      };
    });
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
          userId: obj.userId || "",
          FirstName: obj.VendorName || "",
          ContactNumber: obj.ContactNumber || "",
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
 if (isChecking) {
  return (
  <LoadingData/>
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


        {FinelPreviewData.slice(34).map((p: any, i: number) => (
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

            <div className="py-4 md:py-6 flex items-center justify-center gap-4">
              <div className="relative">
                <button
                  onClick={() =>
                    document.getElementById(`time_${i}`)?.click()
                  }
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-[#00A9A5] text-[#00A9A5] bg-white shadow hover:bg-[#e8fdf9] transition"
                >
                  <Clock size={18} strokeWidth={2} />
                </button>
                <input
                  id={`time_${i}`}
                  type="time"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleChange(i, "followTime", e.target.value)}
                />
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    document.getElementById(`date_${i}`)?.click()
                  }
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-[#00A9A5] text-[#00A9A5] bg-white shadow hover:bg-[#e8fdf9] transition"
                >
                  <Calendar size={18} strokeWidth={2} />
                </button>
                <input
                  id={`date_${i}`}
                  type="date"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleChange(i, "followDate", e.target.value)}
                />
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
              <input
                type="text"
                value={p.reason}
                placeholder="Enter reason..."
                className="w-[150px] px-3 py-1.5 text-sm text-center bg-white/70 border border-[#cceeea] rounded-lg"
                onChange={(e) => handleChange(i, "reason", e.target.value)}
              />
            </div>

            <div className="py-4 md:py-6 flex justify-center">
              <button
                onClick={() => handleSave(i)}
                className="px-4 py-1.5 text-xs font-semibold bg-[#00A9A5] text-white rounded-full shadow-md hover:bg-[#008f8b] transition"
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
