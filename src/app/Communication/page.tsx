"use client";

import { Update_Main_Filter_Status } from "@/Redux/action";
import axios from "axios";
import { CircleX, CrossIcon, FilterX } from "lucide-react";
import { Rethink_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function BulkMessagePage() {
  const [tab, setTab] = useState<
  "clients" | "hcas" | "leads" | "others"|"Employs"
>("clients");
const [communicationType, setCommunicationType] =
useState<"email" | "whatsapp" | "both">("email");
  const [clientFilters, setClientFilters] = useState<string[]>([]);
  const [hcaFilters, setHcaFilters] = useState<string[]>([]);
  const [ActionMessage,setActionMessage]=useState("")
  const [phoneInput, setPhoneInput] = useState("");
const [otherNumbers, setOtherNumbers] = useState<string[]>([]);
const [search, setSearch] = useState("");
const users=useSelector((state:any)=>state.AdminUsers)
const [OtherEMail,setOtherEMail]=useState<any>([])
const [emailInput, setEmailInput] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const dispatch=useDispatch()
  const router=useRouter()
  useEffect(() => {
    if (
      users?.length === 0
     
    ) {
      router.push("/");
    }
    const userId = localStorage.getItem("UserId");
  
    if (!userId) {
       
            router.push("/sign-in")
      return;
    }
  
   
  }, [router]);
const hca=users.filter((each:any)=>
each.userType
===
"healthcare-assistant")
console.log ("Check for Comunicate Usres----",hca)
const hcas = users
  .filter((each: any) => each.userType === "healthcare-assistant")
  .map((each: any) => ({
    _id: each._id,
    name: `${each.FirstName} ${each.Surname || ""}`.trim(),
    location: each.Location,
    email: each.Email,
       Phone:each.ContactNumber,
    currentStatus: each.CurrentStatus,
    userType: each.PreviewUserType || "HCA",
  }));
const clients = users
  .filter((each: any) => each.userType === "patient")
  .map((each: any) => ({
    _id: each._id,
    patientName: each.FirstName,
    Adress: each.Location,
    email: each.Email || "",
    clientStatus: each.ClientStatus,
    Phone:each.ContactNumber,
    leadSource: each.NewLead || "",
    invoiceStatus:
      each.RegistrationFee > 0
        ? "Paid"
        : each.ClientStatus === "Lost"
        ? "Cancelled"
        : "Pending",
  }));
console.log ("Check Contact.....",users
  .filter((each: any) => each.userType === "patient"))
const Leads = users
  .filter((each: any) => each.userType === "CallEnquiry")
  .map((each: any) => ({
    _id: each._id,
    name: each.FirstName,
    location: each.Location,
    email: each.Email || "",
    phone: each.ContactNumber,
    currentStatus: each.CurrentStatus,
    userType: "Lead",
  }));
const Employs = [
   {
    _id: "1",
    name: "Srinivas",
    email: "srinivasnew0803@gmail.com",
  },
  {
    _id: "2",
    name: "Srivani",
    email: "srivanikasham@curatehealth.in",
  },
 
  {
    _id: "3",
    name: "Kiran",
    email: "kirancuratehealth@gmail.com",
  },
  {
    _id: "4",
    name: "Admin",
    email: "admin@curatehealth.in",
  },
  {
    _id: "5",
    name: "Sravanthi",
    email: "sravanthicurate@gmail.com",
  },
 
  {
    _id: "6",
    name: "Info",
    email: "info@curatehealth.in",
  },
   {
    _id: "7",
    name: "Siddu",
    email: "tsiddu805@gmail.com",
  },
  {
    _id: "8",
    name: "Gouri",
    email: "gouricurate@gmail.com",
  },
  {
    _id: "9",
    name: "Shreeshma",
    email: "shreeshmacurate@gmail.com",
  },
  {
    _id: "10",
    name: "Pandu",
    email: "panducurate@gmail.com",
  },
];

  const toggleClientFilter = (value: string) => {
    setClientFilters((prev) =>
      prev.includes(value)
        ? prev.filter((x) => x !== value)
        : [...prev, value]
    );
  };

  const toggleHcaFilter = (value: string) => {
    setHcaFilters((prev) =>
      prev.includes(value)
        ? prev.filter((x) => x !== value)
        : [...prev, value]
    );
  };
  const handleLogout = () => {
    
 router.push( '/DashBoard')
     ;
    dispatch(Update_Main_Filter_Status(""))
 
  };


  const filteredEmploys = useMemo(() => {
  const keyword = search.toLowerCase();

  return Employs.filter((emp: any) =>
    emp.name?.toLowerCase().includes(keyword) ||
    emp.email?.toLowerCase().includes(keyword) ||
    emp.Phone?.toLowerCase().includes(keyword)
  );
}, [Employs, search]);
 const filteredClients = useMemo(() => {
  return clients.filter((client: any) => {
    const matchesFilter =
      !clientFilters.length ||
      clientFilters.includes(client.clientStatus) ||
      clientFilters.includes(client.invoiceStatus);

    const keyword = search.toLowerCase();

    const matchesSearch =
      client.patientName?.toLowerCase().includes(keyword) ||
      client.email?.toLowerCase().includes(keyword) ||
      client.phone?.toLowerCase().includes(keyword);

    return matchesFilter && matchesSearch;
  });
}, [clients, clientFilters, search]);

const filteredHCAs = useMemo(() => {
  return hcas.filter((hcp: any) => {
    const matchesFilter =
      !hcaFilters.length ||
      hcaFilters.includes(hcp.currentStatus) ||
      hcaFilters.includes(hcp.location);

    const keyword = search.toLowerCase();

    const matchesSearch =
      hcp.name?.toLowerCase().includes(keyword) ||
      hcp.email?.toLowerCase().includes(keyword) ||
      hcp.phone?.toLowerCase().includes(keyword);

    return matchesFilter && matchesSearch;
  });
}, [hcas, hcaFilters, search]);

const filteredLeads = useMemo(() => {
  const keyword = search.toLowerCase();

  return Leads.filter((lead: any) =>
    lead.name?.toLowerCase().includes(keyword) ||
    lead.email?.toLowerCase().includes(keyword) ||
    lead.phone?.toLowerCase().includes(keyword)
  );
}, [Leads, search]);

const selectedCount =
  tab === "clients"
    ? filteredClients.length
    : tab === "hcas"
    ? filteredHCAs.length
    : tab === "leads"
    ? filteredLeads.length
    : tab === "Employs"
    ? filteredEmploys.length
    : tab === "others"
    ? 1
    : 0;
const SendEmail = async () => {
  try {
    setActionMessage("Preparing email...");

    const recipients =
  tab === "clients"
    ? filteredClients
    : tab === "hcas"
    ? filteredHCAs
    : tab === "leads"
    ? filteredLeads
    : tab === "Employs"
    ? filteredEmploys
    : tab === "others"
    ? OtherEMail.map((email: any) => ({ email: email.trim() }))
    : [];

    const emails = [
      ...new Set(
        recipients
          .map((item: any) => item?.email?.trim().toLowerCase())
          .filter(
            (email: string) =>
              email &&
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          )
      ),
    ];

    if (!emails.length) {
      setActionMessage("No valid email recipients found.");
      return;
    }

    if (!subject?.trim()) {
      setActionMessage("Please enter the email subject.");
      return;
    }

    if (!message?.trim()) {
      setActionMessage("Please enter the email message.");
      return;
    }

    setActionMessage(`Sending email to ${emails.length} recipient${emails.length > 1 ? "s" : ""}...`);

    const formattedMessage = message
      .trim()
      .replace(/\n/g, "<br/>");

    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0;padding:30px 15px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td align="center">

<table width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,.08);">

<tr>
<td align="center" style="background:#50c896;padding:30px;">
<img
src="https://www.curatehealthservices.com/Icons/Curate-logoq.png"
alt="Curate"
style="height:60px;"
/>

<h2 style="margin:15px 0 0;color:#fff;font-weight:600;">
Curate Healthcare Services
</h2>
</td>
</tr>

<tr>
<td style="padding:35px 30px 15px;">
<h2 style="margin:0;color:#222;">
Hello,
</h2>

<p style="font-size:15px;color:#555;line-height:1.8;margin-top:15px;">
We hope you're doing well.
</p>

<div style="
margin-top:25px;
background:#f8fafc;
border-left:4px solid #1392d3;
padding:20px;
border-radius:8px;
color:#374151;
font-size:15px;
line-height:1.8;
">
${formattedMessage}
</div>
</td>
</tr>

<tr>
<td style="padding:25px 30px;background:#fafafa;border-top:1px solid #eee;">

<p style="margin:0;font-size:14px;color:#555;">
Kind Regards,
</p>

<p style="margin:6px 0 20px;font-size:16px;font-weight:bold;color:#222;">
Curate Healthcare Services Team
</p>

<p style="margin:0;">
<a href="https://www.curatehealthservices.com"
style="color:#1392d3;text-decoration:none;">
🌐 www.curatehealthservices.com
</a>
</p>

<p style="margin-top:25px;font-size:12px;color:#888;line-height:1.6;">
This is an automated email from Curate Healthcare Services.
Please do not reply directly to this email.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

    const { data } = await axios.post("/api/MailSend", {
      to: emails,
      subject: subject.trim(),
      html: htmlTemplate,
    });

    if (data?.success) {
      setActionMessage(
        `Email sent successfully to ${emails.length} recipient${emails.length > 1 ? "s" : ""}.`
      );
      setSubject("")
      setMessage("")
      setOtherEMail([])
    } else {
      setActionMessage(data?.message || "Failed to send email.");
    }
  } catch (err: any) {
    console.error(err);

    setActionMessage(
      err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while sending the email."
    );
  }
};
  return (
<div className="w-full min-w-0 overflow-x-hidden bg-slate-50 min-h-screen px-3 py-4 sm:px-4 md:px-6">



 <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-5 lg:p-6 mb-4 lg:mb-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

<div className="flex flex-1 items-center gap-3 min-w-0">
      <img
        src="/Icons/Curate-logoq.png"
        className="h-10 sm:h-11 lg:h-12 flex-shrink-0"
        alt="Company Logo"
      />

      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 break-words">
          Communication
        </h1>

        <p className="text-xs sm:text-sm lg:text-base text-slate-500 leading-relaxed">
          Send Emails to Clients and Healthcare Assistants
        </p>
      </div>
    </div>

    <button
      onClick={handleLogout}
      className="
        w-full
        sm:w-auto
     sm:min-w-[160px]
        px-4
        py-3
        bg-gradient-to-br
        from-[#00A9A5]
        to-[#005f61]
        hover:from-[#01cfc7]
        hover:to-[#00403e]
        text-white
        rounded-xl
        font-semibold
        shadow-md
        cursor-pointer
        transition-all
      "
    >
      Dashboard
    </button>

  </div>
</div>


<div className="p-2 bg-white">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by Name, Email or Contact..."
    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1392d3]"
  />
</div>
<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">

  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
    <p className="text-sm text-slate-500">Total Clients</p>
    <h2 className="mt-2 text-3xl font-bold text-[#1392d3] break-words">
      {clients.length}
    </h2>
  </div>

  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
    <p className="text-sm text-slate-500">Total HCAs</p>
    <h2 className="mt-2 text-3xl font-bold text-[#50c896] break-words">
      {hcas.length}
    </h2>
  </div>

  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
    <p className="text-sm text-slate-500">Total Leads</p>
    <h2 className="mt-2 text-3xl font-bold text-[#50c896] break-words">
      {Leads.length}
    </h2>
  </div>

  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
    <p className="text-sm text-slate-500">Selected Recipients</p>
    <h2 className="mt-2 text-3xl font-bold text-[#ff1493] break-words">
      {selectedCount}
    </h2>
  </div>

</div>


<div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

<div className="w-fit  bg-white rounded-2xl border border-slate-200 shadow-sm p-1 flex flex-wrap gap-1 ">

  <button
    onClick={() => setTab("clients")}
    className={`flex-1 sm:flex-none min-w-[110px] px-5 py-3 rounded-xl font-medium transition-all cursor-pointer ${
      tab === "clients"
        ? "bg-[#1392d3] text-white shadow"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    Clients
  </button>

  <button
    onClick={() => setTab("hcas")}
    className={`flex-1 sm:flex-none min-w-[110px] px-5 py-3 rounded-xl font-medium transition-all cursor-pointer ${
      tab === "hcas"
        ? "bg-[#50c896] text-white shadow"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    HCAs
  </button>

  <button
    onClick={() => setTab("leads")}
    className={`flex-1 sm:flex-none min-w-[110px] px-5 py-3 rounded-xl font-medium transition-all cursor-pointer ${
      tab === "leads"
        ? "bg-[#f59e0b] text-white shadow"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    Leads
  </button>
 <button
    onClick={() => setTab("Employs")}
    className={`flex-1 sm:flex-none min-w-[110px] px-5 py-3 rounded-xl font-medium transition-all cursor-pointer ${
      tab === "Employs"
        ? "bg-gray-300 text-gray-800 shadow"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    Employs
  </button>
  <button
    onClick={() => setTab("others")}
    className={`flex-1 sm:flex-none min-w-[110px] px-5 py-3 rounded-xl font-medium transition-all cursor-pointer ${
      tab === "others"
        ? "bg-gray-300 text-gray-800 shadow"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    Others
  </button>
  

</div>

  {/* Communication Type */}
  <div className="flex flex-wrap gap-3">

    <button
      onClick={() => setCommunicationType("email")}
      className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all cursor-pointer ${
        communicationType === "email"
          ? "bg-blue-50 border-blue-500 text-blue-700 shadow-md"
          : "bg-white border-slate-200 hover:border-blue-300"
      }`}
    >
      <span className="text-2xl">📧</span>

      <div className="text-left">
        <h3 className="font-semibold text-sm">
          Email
        </h3>

        
      </div>
    </button>

    <button
      onClick={() => setCommunicationType("whatsapp")}
      className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all cursor-pointer ${
        communicationType === "whatsapp"
          ? "bg-green-50 border-green-500 text-green-700 shadow-md"
          : "bg-white border-slate-200 hover:border-green-300"
      }`}
    >
      <img
        src="/Icons/whatsapp.png"
        className="h-7 w-7"
        alt="WhatsApp"
      />

      <div className="text-left">
        <h3 className="font-semibold text-sm">
          WhatsApp
        </h3>

       
      </div>
    </button>



  </div>

</div>

 

<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-slate-800">
          Filters
        </h2>

        <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
          {tab }
        </span>
      </div>



      {tab === "clients" && (
    <>
          <p className="font-medium text-slate-700 mb-3">
            Client Status
          </p>

          {[
          "On going service"
,"Hold client"
,"Terminated client"

          
   
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 mb-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-[#50c896]"
                onChange={() =>
                  toggleHcaFilter(item)
                }
              />
              {item}
            </label>
          ))}
        </>
      )}

      {tab === "hcas" && (
        <>
          <p className="font-medium text-slate-700 mb-3">
            HCA Status
          </p>

          {[
            "Active",
            "Bench",
            "Training",
            "Sick",
            "Leave",
            "Terminated",
          
   
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 mb-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-[#50c896]"
                onChange={() =>
                  toggleHcaFilter(item)
                }
              />
              {item}
            </label>
          ))}
        </>
      )}
      {tab === "leads" && (
        <>
          <p className="font-medium text-slate-700 mb-3">
            Lead Status
          </p>

          {[
           "Waiting List",
            "Lost",
            "Pending",
          
   
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 mb-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-[#50c896]"
                onChange={() =>
                  toggleHcaFilter(item)
                }
              />
              {item}
            </label>
          ))}
        </>
      )}

      {(tab ==="Employs"||tab ==="others")&&
      <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5h18M6 12h12m-8 7h4"
          />
        </svg>
      </div>

      <h3 className="text-sm font-semibold text-slate-700">
        No Filters Available
      </h3>

      <p className="mt-2 text-xs text-slate-500 max-w-[220px]">
        This section doesn't have any filters. Select another tab to view
        available filtering options.
      </p>
    </div>}
    </div>

    

   <div className="lg:col-span-3 min-w-0 space-y-6">

    
{tab!=="others"&&
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b bg-slate-50 flex justify-between items-center">

          <h2 className="font-semibold text-lg">
            Selected Recipients
          </h2>

          <span className="bg-[#1392d3]/10 text-[#1392d3] px-4 py-1 rounded-full font-medium">
            {selectedCount}
          </span>

        </div>
<div className="max-h-[420px] overflow-y-auto">

  {/* Header */}
  <div className="grid grid-cols-[1fr_auto] items-center bg-slate-50 px-5 py-3 rounded-t-xl border-b border-slate-200">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      Recipient
    </h3>

    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      Type
    </h3>
  </div>

  {/* Clients */}
  {tab === "clients" &&
    filteredClients.map((client:any) => (
      <div
        key={client._id}
        className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm shrink-0">
            {client.patientName?.charAt(0)?.toUpperCase()}
          </div>

          <div className="min-w-0">

            <h4 className="font-semibold text-slate-800 truncate">
              {client.patientName}
            </h4>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">

  {communicationType === "email" ? (
    <span className="flex items-center gap-1 truncate">
      📧 {client.email}
    </span>
  ) : (
    <span className="flex items-center gap-1 truncate">
      <img
        src="/Icons/whatsapp.png"
        alt="WhatsApp"
        className="w-4 h-4 object-contain"
      />
      <span>{client.Phone}</span>
    </span>
  )}

  <span className="flex items-center gap-1 truncate">
    📍 {client.Adress||"Not Privided"}
  </span>

</div>

          </div>

        </div>

        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          Client
        </span>
      </div>
    ))}

  {/* HCAs */}
  {tab === "hcas" &&
    filteredHCAs.map((hcp:any) => (
      <div
        key={hcp._id}
        className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-sm shrink-0">
            {hcp.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="min-w-0">

            <h4 className="font-semibold text-slate-800 truncate">
              {hcp.name}
            </h4>

               <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">

  {communicationType === "email" ? (
    <span className="flex items-center gap-1 truncate">
      📧 {hcp.email}
    </span>
  ) : (
    <span className="flex items-center gap-1 truncate">
      <img
        src="/Icons/whatsapp.png"
        alt="WhatsApp"
        className="w-4 h-4 object-contain"
      />
      <span>{hcp.Phone}</span>
    </span>
  )}

  <span className="flex items-center gap-1 truncate">
    📍 {hcp.location||"Not Privided"}
  </span>

</div>

          </div>

        </div>

        <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-200">
          HCA
        </span>
      </div>
    ))}

  {/* Leads */}
  {tab === "leads" &&
    filteredLeads.map((lead:any) => (
      <div
        key={lead._id}
        className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-sm shrink-0">
            {lead.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="min-w-0">

            <h4 className="font-semibold text-slate-800 truncate">
              {lead.name}
            </h4>

                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">

  {communicationType === "email" ? (
    <span className="flex items-center gap-1 truncate">
      📧 {lead.email}
    </span>
  ) : (
    <span className="flex items-center gap-1 truncate">
      <img
        src="/Icons/whatsapp.png"
        alt="WhatsApp"
        className="w-4 h-4 object-contain"
      />
      <span>{lead.phone}</span>
    </span>
  )}

  <span className="flex items-center gap-1 truncate">
    📍 {lead.location||"Not Privided"}
  </span>

</div>

          </div>

        </div>

        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
          Lead
        </span>
      </div>
    ))}

      {tab === "Employs" &&
  filteredEmploys.map((emp: any) => (
    <div
      key={emp._id}
      className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 hover:bg-slate-50 transition"
    >
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-semibold text-sm shrink-0">
          {emp.name?.charAt(0)?.toUpperCase()}
        </div>

        <div className="min-w-0">
          <h4 className="font-semibold text-slate-800 truncate">
            {emp.name}
          </h4>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
            {communicationType === "email" ? (
              <span className="flex items-center gap-1 truncate">
                📧 {emp.email}
              </span>
            ) : (
              <span className="flex items-center gap-1 truncate">
                <img
                  src="/Icons/whatsapp.png"
                  className="w-4 h-4"
                  alt="WhatsApp"
                />
                <span>{emp.Phone}</span>
              </span>
            )}

            <span className="flex items-center gap-1 truncate">
              📍 {emp.location || "Not Provided"}
            </span>
          </div>
        </div>
      </div>

      <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold border border-pink-200">
        Employee
      </span>
    </div>
  ))}
</div>

      </div>
}
    

     

      {communicationType === "whatsapp" ? 
  <div className="bg-white rounded-3xl border border-green-200 shadow-sm p-6">

    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
        <img
          src="/Icons/whatsapp.png"
          alt="WhatsApp"
          className="h-7 w-7"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          WhatsApp Message
        </h2>

        <p className="text-sm text-slate-500">
          Send WhatsApp messages to selected recipients
        </p>
      </div>
    </div>
    

    {tab === "others" && (
 <div className="mb-6 rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-5 shadow-sm">

  <div className="flex items-center gap-3 mb-4">
    <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center text-xl">
      💬
    </div>

    <div>
      <h3 className="text-lg font-semibold text-slate-800">
        Custom Recipient
      </h3>

      <p className="text-sm text-slate-500">
        Send a WhatsApp message to any mobile number.
      </p>
    </div>
  </div>

  <label className="block text-sm font-medium text-slate-700 mb-2">
    WhatsApp Number
  </label>

  <div className="rounded-xl border border-slate-300 bg-white p-2 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100 transition-all">

  <div className="flex flex-wrap items-center gap-2">

    {otherNumbers.map((number, index) => (
      <div
        key={index}
        className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
      >
        <span>🇮🇳 +91 {number}</span>

        <CircleX
          size={16}
          className="cursor-pointer hover:text-red-500"
          onClick={() =>
            setOtherNumbers((prev) => prev.filter((_, i) => i !== index))
          }
        />
      </div>
    ))}

    <div className="flex items-center flex-1 min-w-[180px]">
      <span className="mr-2 text-sm font-medium text-slate-600">
        🇮🇳 +91
      </span>

      <input
        type="tel"
        placeholder="Enter mobile numbers..."
        value={phoneInput}
        maxLength={10}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          setPhoneInput(value);
        }}
        onKeyDown={(e) => {
          if (["Enter", ",", "Tab", " "].includes(e.key)) {
            e.preventDefault();

            if (
              phoneInput.length === 10 &&
              !otherNumbers.includes(phoneInput)
            ) {
              setOtherNumbers((prev) => [...prev, phoneInput]);
            }

            setPhoneInput("");
          }

          if (e.key === "Backspace" && phoneInput === "") {
            setOtherNumbers((prev) => prev.slice(0, -1));
          }
        }}
        className="flex-1 min-w-[150px] bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
      />
    </div>

  </div>

</div>

  <p className="mt-3 text-xs text-slate-500">
    Enter a valid WhatsApp mobile number. The number doesn't need to be registered in the application.
  </p>

</div>
)}

    {/* Message */}

    <label className="block text-sm font-medium text-slate-700 mb-2">
      Message
    </label>

    <textarea
      rows={8}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type your WhatsApp message..."
      className="
      w-full
      rounded-2xl
      border
      border-slate-300
      p-4
      focus:outline-none
      focus:ring-2
      focus:ring-green-500
      "
    />





    <div className="mt-8">

      <h3 className="font-semibold text-slate-700 mb-3">
        Preview
      </h3>

      <div className="max-w-md rounded-3xl bg-[#DCF8C6] p-4 shadow">

        <p className="font-semibold mb-2">
          Hi ,
        </p>

        <p className="whitespace-pre-wrap">
          {message || "Your WhatsApp message will appear here..."}
        </p>

        <p className="text-right text-xs text-slate-500 mt-4">
      {new Date().toLocaleTimeString("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})}✓✓
        </p>

      </div>

    </div>



    <button
      className="
      mt-8
      w-full
      sm:w-auto
      bg-green-600
      hover:bg-green-700
      text-white
      px-8
      py-3
      rounded-xl
      font-semibold
      transition-all
      "
    onClick={() => {
  console.log({
    message,
    recipients:
      tab === "clients"
        ? filteredClients
        : tab === "hcas"
        ? filteredHCAs
        : tab === "leads"
        ? filteredLeads
        : tab === "others"
        ? []
        : [],
  });
}}
    >
      <div className="flex items-center justify-center gap-2">
        <img
          src="/Icons/whatsapp.png"
          className="h-5"
          alt=""
        />

        Send WhatsApp to {selectedCount} Users
      </div>
    </button>

  </div>
: <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

        <h2 className="font-semibold text-xl mb-5">
          Compose Message
        </h2>
{tab === "others" && (
  <div className="mb-6 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">

    <div className="flex items-center gap-3 mb-4">
      <div className="h-11 w-11 rounded-xl bg-violet-100 flex items-center justify-center text-xl">
        📧
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800">
          Custom Recipient
        </h3>

        <p className="text-sm text-slate-500">
          Send a message to an email address outside the system.
        </p>
      </div>
    </div>

    <label className="block text-sm font-medium text-slate-700 mb-2">
      Recipient Email Address 
    </label>
<input
  type="text"
  placeholder="Enter email addresses..."
  value={emailInput}
  onChange={(e) => setEmailInput(e.target.value)}
  onKeyDown={(e) => {
    if (["Enter", "Tab", ",", " "].includes(e.key)) {
      e.preventDefault();

      const email = emailInput.trim().replace(/,$/, "");

      if (
        email &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        !OtherEMail.includes(email)
      ) {
        setOtherEMail((prev:any[]) => [...prev, email]);
      }

      setEmailInput("");
    }

    // Backspace removes last chip when input is empty
    if (e.key === "Backspace" && emailInput === "") {
      setOtherEMail((prev:any[]) => prev.slice(0, -1));
    }
  }}
  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
/>{OtherEMail.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-2">
    {OtherEMail.map((email:any, index:any) => (
      <div
        key={index}
        className="flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-800"
      >
        <span>{email}</span>

        <CircleX
          size={16}
          className="cursor-pointer hover:text-red-500"
          onClick={() =>
            setOtherEMail((prev:any[]) => prev.filter((_:any, i:any) => i !== index))
          }
        />
      </div>
    ))}
  </div>
)}

    <p className="mt-3 text-xs text-slate-500">
      You can enter any valid email address that is not registered in the application.
    </p>

  </div>
)}
        <input
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
          placeholder="Email Subject"
          className="
            w-full
            border
            border-slate-300
            rounded-xl
            p-3
            mb-4
            focus:outline-none
            focus:ring-2
            focus:ring-[#1392d3]
          "
        />

        <textarea
          rows={8}
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Type your message..."
          className="
            w-full
            border
            border-slate-300
            rounded-xl
            p-3
            focus:outline-none
            focus:ring-2
            focus:ring-[#1392d3]
          "
        />
<div
  className={`mt-4 flex items-start gap-3 rounded-xl border p-4 transition-all duration-300 ${
    ActionMessage?.includes("success")
      ? "border-green-200 bg-green-50"
      : ActionMessage?.includes("Failed") ||
        ActionMessage?.includes("No valid") ||
        ActionMessage?.includes("Please")
      ? "border-red-200 bg-red-50"
      : "border-[#1392d3]/20 bg-[#1392d3]/5"
  }`}
>
  {ActionMessage === "Preparing email..." ||
  ActionMessage?.includes("Sending") ? (
    <svg
      className="mt-0.5 h-5 w-5 animate-spin text-[#1392d3]"
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  ) : (
    <span className="text-xl">
      {ActionMessage?.includes("success")
        ? "✅"
        : ActionMessage?.includes("Failed") ||
          ActionMessage?.includes("No valid") ||
          ActionMessage?.includes("Please")
        ? "❌"
        : "ℹ️"}
    </span>
  )}

  <p
    className={`whitespace-pre-wrap break-words text-[15px] leading-7 font-medium ${
      ActionMessage?.includes("success")
        ? "text-green-700"
        : ActionMessage?.includes("Failed") ||
          ActionMessage?.includes("No valid") ||
          ActionMessage?.includes("Please")
        ? "text-red-700"
        : "text-slate-700"
    }`}
  >
    {ActionMessage || "Ready to send email."}
  </p>
</div>
        <button
         className="
mt-5
w-full
sm:w-auto
bg-[#1392d3]
hover:bg-[#0f7bb3]
text-white
px-8
py-3
rounded-xl
cursor-pointer
font-semibold
transition-colors
"
           onClick={SendEmail}
        >
          Send Email To {tab==="others" ?   OtherEMail.length:selectedCount} Users
        </button>

      </div>}

    </div>

  </div>

</div>
  );
}