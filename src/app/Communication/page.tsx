"use client";

import { Update_Main_Filter_Status } from "@/Redux/action";
import { Rethink_Sans } from "next/font/google";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const clients = [
  {
    _id: "1",
    patientName: "Kondaiah",
    location: "Hyderabad",
    email: "kondaiah@gmail.com",
    clientStatus: "Waiting List",
    leadSource: "Google",
    invoiceStatus: "Pending",
  },
  {
    _id: "2",
    patientName: "Durga Nayak",
    location: "Kukatpally",
    email: "durga.nayak@gmail.com",
    clientStatus: "Converted",
    leadSource: "Facebook",
    invoiceStatus: "Paid",
  },
  {
    _id: "3",
    patientName: "Mukkera Subamma",
    location: "Warangal",
    email: "subamma@gmail.com",
    clientStatus: "Lost",
    leadSource: "Reference",
    invoiceStatus: "Pending",
  },
  {
    _id: "4",
    patientName: "Rajesh Kumar",
    location: "Vijayawada",
    email: "rajesh.kumar@gmail.com",
    clientStatus: "Follow Up",
    leadSource: "Website",
    invoiceStatus: "Paid",
  },
  {
    _id: "5",
    patientName: "Lakshmi Devi",
    location: "Guntur",
    email: "lakshmi.devi@gmail.com",
    clientStatus: "Converted",
    leadSource: "Instagram",
    invoiceStatus: "Paid",
  },
  {
    _id: "6",
    patientName: "Suresh Babu",
    location: "Nellore",
    email: "suresh.babu@gmail.com",
    clientStatus: "Waiting List",
    leadSource: "Walk-In",
    invoiceStatus: "Pending",
  },
  {
    _id: "7",
    patientName: "Anitha Reddy",
    location: "Kurnool",
    email: "anitha.reddy@gmail.com",
    clientStatus: "Converted",
    leadSource: "Google",
    invoiceStatus: "Paid",
  },
  {
    _id: "8",
    patientName: "Prakash Rao",
    location: "Tirupati",
    email: "prakash.rao@gmail.com",
    clientStatus: "Lost",
    leadSource: "Facebook",
    invoiceStatus: "Cancelled",
  },
  {
    _id: "9",
    patientName: "Sowmya",
    location: "Karimnagar",
    email: "sowmya@gmail.com",
    clientStatus: "Follow Up",
    leadSource: "Reference",
    invoiceStatus: "Pending",
  },
  {
    _id: "10",
    patientName: "Ramesh",
    location: "Nizamabad",
    email: "ramesh@gmail.com",
    clientStatus: "Converted",
    leadSource: "Google",
    invoiceStatus: "Paid",
  },
  {
    _id: "11",
    patientName: "Harika",
    location: "Visakhapatnam",
    email: "harika@gmail.com",
    clientStatus: "Waiting List",
    leadSource: "Website",
    invoiceStatus: "Pending",
  },
  {
    _id: "12",
    patientName: "Ganesh",
    location: "Khammam",
    email: "ganesh@gmail.com",
    clientStatus: "Converted",
    leadSource: "Instagram",
    invoiceStatus: "Paid",
  },
  {
    _id: "13",
    patientName: "Bhavani",
    location: "Anantapur",
    email: "bhavani@gmail.com",
    clientStatus: "Lost",
    leadSource: "Walk-In",
    invoiceStatus: "Cancelled",
  },
  {
    _id: "14",
    patientName: "Mahesh",
    location: "Rajahmundry",
    email: "mahesh@gmail.com",
    clientStatus: "Follow Up",
    leadSource: "Reference",
    invoiceStatus: "Pending",
  },
  {
    _id: "15",
    patientName: "Deepika",
    location: "Eluru",
    email: "deepika@gmail.com",
    clientStatus: "Converted",
    leadSource: "Google",
    invoiceStatus: "Paid",
  },
  {
    _id: "16",
    patientName: "Venkatesh",
    location: "Kadapa",
    email: "venkatesh@gmail.com",
    clientStatus: "Waiting List",
    leadSource: "Facebook",
    invoiceStatus: "Pending",
  },
  {
    _id: "17",
    patientName: "Ravi Teja",
    location: "Ongole",
    email: "raviteja@gmail.com",
    clientStatus: "Converted",
    leadSource: "Website",
    invoiceStatus: "Paid",
  },
  {
    _id: "18",
    patientName: "Keerthana",
    location: "Adilabad",
    email: "keerthana@gmail.com",
    clientStatus: "Lost",
    leadSource: "Instagram",
    invoiceStatus: "Cancelled",
  },
  {
    _id: "19",
    patientName: "Madhavi",
    location: "Mahabubnagar",
    email: "madhavi@gmail.com",
    clientStatus: "Follow Up",
    leadSource: "Walk-In",
    invoiceStatus: "Pending",
  },
  {
    _id: "20",
    patientName: "Chandrasekhar",
    location: "Srikakulam",
    email: "chandrasekhar@gmail.com",
    clientStatus: "Converted",
    leadSource: "Reference",
    invoiceStatus: "Paid",
  },
];

const hcas = [
  {
    _id: "101",
    name: "Paulsital Behera",
    location: "Odisha",
    email: "paulsital@gmail.com",
    currentStatus: "Active",
    userType: "HCA",
  },
  {
    _id: "102",
    name: "Bommathi Madhavi",
    location: "Hyderabad",
    email: "madhavi@gmail.com",
    currentStatus: "Bench",
    userType: "HCN",
  },
  {
    _id: "103",
    name: "Madavi Shilpa",
    location: "Warangal",
    email: "shilpa@gmail.com",
    currentStatus: "Leave",
    userType: "HCA",
  },
  {
    _id: "104",
    name: "Anil Kumar",
    location: "Vijayawada",
    email: "anilkumar@gmail.com",
    currentStatus: "Active",
    userType: "HCA",
  },
  {
    _id: "105",
    name: "Kavitha Reddy",
    location: "Visakhapatnam",
    email: "kavitha@gmail.com",
    currentStatus: "Training",
    userType: "HCN",
  },
  {
    _id: "106",
    name: "Ravi Teja",
    location: "Kurnool",
    email: "raviteja@gmail.com",
    currentStatus: "Bench",
    userType: "HCA",
  },
  {
    _id: "107",
    name: "Sneha Sharma",
    location: "Nellore",
    email: "sneha@gmail.com",
    currentStatus: "Active",
    userType: "HCA",
  },
  {
    _id: "108",
    name: "Mahesh Babu",
    location: "Rajahmundry",
    email: "mahesh@gmail.com",
    currentStatus: "Leave",
    userType: "HCN",
  },
  {
    _id: "109",
    name: "Divya Priya",
    location: "Kadapa",
    email: "divya@gmail.com",
    currentStatus: "Training",
    userType: "HCA",
  },
  {
    _id: "110",
    name: "Srinivas Rao",
    location: "Karimnagar",
    email: "srinivas@gmail.com",
    currentStatus: "Active",
    userType: "HCA",
  },
  {
    _id: "111",
    name: "Harika Devi",
    location: "Khammam",
    email: "harika@gmail.com",
    currentStatus: "Bench",
    userType: "HCN",
  },
  {
    _id: "112",
    name: "Venkatesh",
    location: "Guntur",
    email: "venkatesh@gmail.com",
    currentStatus: "Active",
    userType: "HCA",
  },
  {
    _id: "113",
    name: "Deepika Singh",
    location: "Tirupati",
    email: "deepika@gmail.com",
    currentStatus: "Training",
    userType: "HCA",
  },
  {
    _id: "114",
    name: "Ajay Kumar",
    location: "Anantapur",
    email: "ajay@gmail.com",
    currentStatus: "Leave",
    userType: "HCN",
  },
  {
    _id: "115",
    name: "Bhavani",
    location: "Nizamabad",
    email: "bhavani@gmail.com",
    currentStatus: "Active",
    userType: "HCA",
  },
  {
    _id: "116",
    name: "Pooja Rani",
    location: "Ongole",
    email: "pooja@gmail.com",
    currentStatus: "Bench",
    userType: "HCN",
  },
  {
    _id: "117",
    name: "Naresh Kumar",
    location: "Eluru",
    email: "naresh@gmail.com",
    currentStatus: "Training",
    userType: "HCA",
  },
  {
    _id: "118",
    name: "Keerthana",
    location: "Srikakulam",
    email: "keerthana@gmail.com",
    currentStatus: "Active",
    userType: "HCA",
  },
  {
    _id: "119",
    name: "Rohit Verma",
    location: "Mahabubnagar",
    email: "rohit@gmail.com",
    currentStatus: "Leave",
    userType: "HCN",
  },
  {
    _id: "120",
    name: "Swapna Lakshmi",
    location: "Adilabad",
    email: "swapna@gmail.com",
    currentStatus: "Active",
    userType: "HCA",
  },
];
const Leads = [
  {
    _id: "201",
    name: "Akhil Reddy",
    location: "Hyderabad",
    email: "akhil.reddy@gmail.com",
    currentStatus: "New",
    userType: "Lead",
  },
  {
    _id: "202",
    name: "Sneha Sharma",
    location: "Warangal",
    email: "sneha.sharma@gmail.com",
    currentStatus: "Contacted",
    userType: "Lead",
  },
  {
    _id: "203",
    name: "Rakesh Kumar",
    location: "Vijayawada",
    email: "rakesh.kumar@gmail.com",
    currentStatus: "Qualified",
    userType: "Lead",
  },
  {
    _id: "204",
    name: "Priyanka Devi",
    location: "Visakhapatnam",
    email: "priyanka.devi@gmail.com",
    currentStatus: "Converted",
    userType: "Lead",
  },
  {
    _id: "205",
    name: "Sai Kumar",
    location: "Guntur",
    email: "sai.kumar@gmail.com",
    currentStatus: "Lost",
    userType: "Lead",
  },
  {
    _id: "206",
    name: "Niharika",
    location: "Nellore",
    email: "niharika@gmail.com",
    currentStatus: "New",
    userType: "Lead",
  },
  {
    _id: "207",
    name: "Abhishek Rao",
    location: "Kurnool",
    email: "abhishek.rao@gmail.com",
    currentStatus: "Contacted",
    userType: "Lead",
  },
  {
    _id: "208",
    name: "Pallavi",
    location: "Kadapa",
    email: "pallavi@gmail.com",
    currentStatus: "Qualified",
    userType: "Lead",
  },
  {
    _id: "209",
    name: "Tejaswi",
    location: "Rajahmundry",
    email: "tejaswi@gmail.com",
    currentStatus: "Converted",
    userType: "Lead",
  },
  {
    _id: "210",
    name: "Vinay Kumar",
    location: "Karimnagar",
    email: "vinay@gmail.com",
    currentStatus: "Lost",
    userType: "Lead",
  },
  {
    _id: "211",
    name: "Ramya",
    location: "Khammam",
    email: "ramya@gmail.com",
    currentStatus: "New",
    userType: "Lead",
  },
  {
    _id: "212",
    name: "Mohan Krishna",
    location: "Nizamabad",
    email: "mohan.krishna@gmail.com",
    currentStatus: "Contacted",
    userType: "Lead",
  },
  {
    _id: "213",
    name: "Sharanya",
    location: "Anantapur",
    email: "sharanya@gmail.com",
    currentStatus: "Qualified",
    userType: "Lead",
  },
  {
    _id: "214",
    name: "Lokesh",
    location: "Tirupati",
    email: "lokesh@gmail.com",
    currentStatus: "Converted",
    userType: "Lead",
  },
  {
    _id: "215",
    name: "Jyothi",
    location: "Ongole",
    email: "jyothi@gmail.com",
    currentStatus: "Lost",
    userType: "Lead",
  },
  {
    _id: "216",
    name: "Naresh",
    location: "Eluru",
    email: "naresh@gmail.com",
    currentStatus: "New",
    userType: "Lead",
  },
  {
    _id: "217",
    name: "Sravani",
    location: "Srikakulam",
    email: "sravani@gmail.com",
    currentStatus: "Contacted",
    userType: "Lead",
  },
  {
    _id: "218",
    name: "Yashwanth",
    location: "Mahabubnagar",
    email: "yashwanth@gmail.com",
    currentStatus: "Qualified",
    userType: "Lead",
  },
  {
    _id: "219",
    name: "Sindhu",
    location: "Adilabad",
    email: "sindhu@gmail.com",
    currentStatus: "Converted",
    userType: "Lead",
  },
  {
    _id: "220",
    name: "Ajay Kumar",
    location: "Kakinada",
    email: "ajay.kumar@gmail.com",
    currentStatus: "Lost",
    userType: "Lead",
  },
];
export default function BulkMessagePage() {
  const [tab, setTab] = useState<
  "clients" | "hcas" | "leads" | "others"
>("clients");
const [communicationType, setCommunicationType] =
useState<"email" | "whatsapp" | "both">("email");
  const [clientFilters, setClientFilters] = useState<string[]>([]);
  const [hcaFilters, setHcaFilters] = useState<string[]>([]);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const dispatch=useDispatch()

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
    
 
      window.location.href ='/DashBoard';
    dispatch(Update_Main_Filter_Status(""))
 
  };
  const filteredClients = useMemo(() => {
    if (!clientFilters.length) return clients;

    return clients.filter(
      (client) =>
        clientFilters.includes(client.clientStatus) ||
        clientFilters.includes(client.invoiceStatus)
    );
  }, [clientFilters]);

  const filteredHCAs = useMemo(() => {
    if (!hcaFilters.length) return hcas;

    return hcas.filter(
      (hcp) =>
        hcaFilters.includes(hcp.currentStatus) ||
        hcaFilters.includes(hcp.location)
    );
  }, [hcaFilters]);

  const selectedCount =
  tab === "clients"
    ? filteredClients.length
    : tab === "hcas"
    ? filteredHCAs.length
    : tab === "leads"
    ? Leads.length
    : 0;

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



<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
    <p className="text-slate-500 text-sm">
      Total Clients
    </p>

    <h2 className="text-2xl sm:text-3xl font-bold text-[#1392d3] mt-2">
      {clients.length}
    </h2>
  </div>

  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
    <p className="text-slate-500 text-sm">
      Total HCAs
    </p>

    <h2 className="text-2xl sm:text-3xl font-bold text-[#50c896] mt-2">
      {hcas.length}
    </h2>
  </div>

  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
    <p className="text-slate-500 text-sm">
      Selected Recipients
    </p>

    <h2 className="text-2xl sm:text-3xl font-bold text-[#ff1493] mt-2">
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
            "Waiting List",
            "Converted",
            "Lost",
            "Pending",
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 mb-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-[#1392d3]"
                onChange={() =>
                  toggleClientFilter(item)
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
            "Leave",
          
   
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

      {(tab ==="leads"||tab ==="others")&&
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
    filteredClients.map((client) => (
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

              <span className="truncate">
                📧 {client.email}
              </span>

              <span>
                📍 {client.location}
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
    filteredHCAs.map((hcp) => (
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

              <span className="truncate">
                📧 {hcp.email}
              </span>

              <span>
                📍 {hcp.location}
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
    Leads.map((lead) => (
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

              <span className="truncate">
                📧 {lead.email}
              </span>

              <span>
                📍 {lead.location}
              </span>

            </div>

          </div>

        </div>

        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
          Lead
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

  <div className="flex rounded-xl border border-slate-300 overflow-hidden bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100 transition-all">
    <span className="flex items-center px-4 bg-slate-50 border-r border-slate-200 text-slate-600 text-sm font-medium">
      🇮🇳 +91
    </span>

    <input
      type="tel"
      placeholder="9876543210"
      maxLength={10}
      className="
        w-full
        px-4
        py-3
        text-sm
        outline-none
        placeholder:text-slate-400
      "
    />
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
              : filteredHCAs,
        });

        alert(
          `Sending WhatsApp message to ${selectedCount} users`
        );
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
      type="email"
      placeholder="example@gmail.com"
      className="
        w-full
        rounded-xl
        border
        border-slate-300
        bg-white
        px-4
        py-3
        text-sm
        outline-none
        transition-all
        placeholder:text-slate-400
        focus:border-violet-500
        focus:ring-4
        focus:ring-violet-100
      "
    />

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
          onClick={() => {
            console.log({
              subject,
              message,
              recipients:
                tab === "clients"
                  ? filteredClients
                  : filteredHCAs,
            });

            alert(
              `Sending mail to ${selectedCount} users`
            );
          }}
        >
          Send Email To {selectedCount} Users
        </button>

      </div>}

    </div>

  </div>

</div>
  );
}