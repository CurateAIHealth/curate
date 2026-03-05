"use client";

import { Refresh, Update_Main_Filter_Status, UpdateAdminMonthFilter, UpdateAdminYearFilter, UpdateUserType } from "@/Redux/action";
import { List, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type InvoiceRow = {
  invoiceNo: string;
  startDate: string;
  endDate: string;
  status: string;
  location: string;
  clientPhone: string;
  clientName: string;
  patientName: string;
  patientCondition: string;
  referralName: string;
  hcpType: string;
  hcpId: string;
  hcpName: string;
  hcpPhone: string;
  hcpSource: string;
  providerName: string;
  payTerms: string;
  cTotal: number;
  cPay: number;
  hcpTotal: number;
  hcpPay: number;
  pd: number;
  ad: number;
  hp: number;
  margin: number;
  actualCPay: number;
  actualHcpPay: number;
  actualMargin: number;
  actualMarginPercent: string;
  payCalculation: number;
  tax: number;
  pay: number;
  advancePayment: number;
  travelExpense: number;
  finalPay: number;
};

const testData: InvoiceRow[] = [
  {
    invoiceNo: "INV#25534",
    startDate: "01/01/2026",
    endDate: "31/01/2026",
    status: "Active",
    location: "Malakpet",
    clientPhone: "8886026108",
    clientName: "Syed Ali",
    patientName: "Syeda Sadia",
    patientCondition: "Stable",
    referralName: "Parikshith",
    hcpType: "Assistant",
    hcpId: "HCA327",
    hcpName: "Sapna Uikey",
    hcpPhone: "8305369342",
    hcpSource: "Curate",
    providerName: "Curate",
    payTerms: "PP",
    cTotal: 21000,
    cPay: 700,
    hcpTotal: 18000,
    hcpPay: 600,
    pd: 31,
    ad: 0,
    hp: 0,
    margin: 3000,
    actualCPay: 21700,
    actualHcpPay: 18600,
    actualMargin: 3100,
    actualMarginPercent: "14.29%",
    payCalculation: 18600,
    tax: 186,
    pay: 18414,
    advancePayment: 0,
    travelExpense: 0,
    finalPay: 18414,
  },
  {
    invoiceNo: "INV#25535",
    startDate: "01/02/2026",
    endDate: "28/02/2026",
    status: "Active",
    location: "Dilsukhnagar",
    clientPhone: "9876543210",
    clientName: "Rahul Sharma",
    patientName: "Anita Sharma",
    patientCondition: "Critical",
    referralName: "Mahesh",
    hcpType: "Nurse",
    hcpId: "HCN210",
    hcpName: "Priya Nair",
    hcpPhone: "9123456780",
    hcpSource: "Agency",
    providerName: "HealthCare",
    payTerms: "PP",
    cTotal: 24000,
    cPay: 800,
    hcpTotal: 20000,
    hcpPay: 650,
    pd: 28,
    ad: 1,
    hp: 0,
    margin: 4000,
    actualCPay: 24800,
    actualHcpPay: 20650,
    actualMargin: 4150,
    actualMarginPercent: "16.73%",
    payCalculation: 20650,
    tax: 200,
    pay: 20450,
    advancePayment: 1000,
    travelExpense: 200,
    finalPay: 19650,
  },
  {
    invoiceNo: "INV#25536",
    startDate: "05/02/2026",
    endDate: "05/03/2026",
    status: "Completed",
    location: "Banjara Hills",
    clientPhone: "9012345678",
    clientName: "Kiran Reddy",
    patientName: "Lakshmi Reddy",
    patientCondition: "Recovering",
    referralName: "Suresh",
    hcpType: "Caretaker",
    hcpId: "HCC145",
    hcpName: "Ramesh Kumar",
    hcpPhone: "9871203456",
    hcpSource: "Direct",
    providerName: "Curate",
    payTerms: "Monthly",
    cTotal: 30000,
    cPay: 1000,
    hcpTotal: 25000,
    hcpPay: 900,
    pd: 30,
    ad: 0,
    hp: 2,
    margin: 5000,
    actualCPay: 31000,
    actualHcpPay: 25900,
    actualMargin: 5100,
    actualMarginPercent: "16.45%",
    payCalculation: 25900,
    tax: 259,
    pay: 25641,
    advancePayment: 2000,
    travelExpense: 500,
    finalPay: 23141,
  },
  {
    invoiceNo: "INV#25537",
    startDate: "10/02/2026",
    endDate: "10/03/2026",
    status: "Active",
    location: "Kukatpally",
    clientPhone: "9988776655",
    clientName: "Vikram Singh",
    patientName: "Rohit Singh",
    patientCondition: "Stable",
    referralName: "Deepak",
    hcpType: "Assistant",
    hcpId: "HCA458",
    hcpName: "Anjali Verma",
    hcpPhone: "9345678123",
    hcpSource: "Curate",
    providerName: "Curate",
    payTerms: "PP",
    cTotal: 22000,
    cPay: 750,
    hcpTotal: 19000,
    hcpPay: 620,
    pd: 30,
    ad: 1,
    hp: 0,
    margin: 3000,
    actualCPay: 22750,
    actualHcpPay: 19620,
    actualMargin: 3130,
    actualMarginPercent: "13.75%",
    payCalculation: 19620,
    tax: 196,
    pay: 19424,
    advancePayment: 0,
    travelExpense: 150,
    finalPay: 19274,
  },
  {
    invoiceNo: "INV#25538",
    startDate: "15/02/2026",
    endDate: "15/03/2026",
    status: "Pending",
    location: "Secunderabad",
    clientPhone: "8899776655",
    clientName: "Arjun Patel",
    patientName: "Meena Patel",
    patientCondition: "Critical",
    referralName: "Ravi",
    hcpType: "Nurse",
    hcpId: "HCN398",
    hcpName: "Shalini Gupta",
    hcpPhone: "9011223344",
    hcpSource: "Agency",
    providerName: "CarePlus",
    payTerms: "PP",
    cTotal: 26000,
    cPay: 900,
    hcpTotal: 22000,
    hcpPay: 720,
    pd: 30,
    ad: 0,
    hp: 0,
    margin: 4000,
    actualCPay: 26900,
    actualHcpPay: 22720,
    actualMargin: 4180,
    actualMarginPercent: "15.54%",
    payCalculation: 22720,
    tax: 227,
    pay: 22493,
    advancePayment: 500,
    travelExpense: 300,
    finalPay: 21693,
  }
];

const allColumns = [
  "Invoice No.","Start Date","End Date","Status","Location","Client Phone","Client Name","Patient Name",
  "Patient Condition","Referral Name","HCP Type","HCP ID","HCP Name","HCP Phone","HCP Source",
  "Provider Name","Pay Terms","C Total","C Pay","HCP Total","HCP Pay","PD","AD","HP","Margin",
  "Actual C Pay","Actual HCP Pay","Actual Margin","Actual Margin %","Pay Calculation","1% Tax",
  "Pay","Advance Payment","Staff Travel Exp","Final Pay"
];

const limitedColumns = [
  "Invoice No.","Start Date","End Date","Status","Client Name","Patient Name","HCP Name","Final Pay"
];

export default function InvoiceTable() {
const [SearchResult, setSearchResult] = useState("")
  const [showFull, setShowFull] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const SearchMonth = useSelector((state: any) => state.MonthFilterAdmin)
      const SearchYear = useSelector((state: any) => state.YearFilterAdmin)
  const columns = showFull ? allColumns : limitedColumns;
  const dispatch=useDispatch()
  const router=useRouter()
 const handleLogout = () => {
    dispatch(Update_Main_Filter_Status(""))
    router.push('/DashBoard');
 dispatch(Refresh(""))
  };
    const handleMainLogout = async () => {
    localStorage.removeItem("UserId");
    router.prefetch("/");
    router.push("/");
  };

  return (
    <div className="w-full p-2">
<div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/90 rounded-xl p-3 shadow-2xl border border-gray-100">
        <div className="flex items-center gap-3 relative">
          {showOptions && (
    <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-xl shadow-lg w-40 py-2 z-50">
      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("Call Enquiry"));
      dispatch(UpdateUserType("patient"));
      router.push("/AdminPage");
    setShowOptions(false)}
      }>
   Call Enquiry
      </button>
       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("HCP List"));
        dispatch(UpdateUserType("healthcare-assistant"));
        router.push("/AdminPage");
    setShowOptions(false)}
      }>
   HCP List
      </button>
      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("Deployment"));
      dispatch(UpdateUserType("patient"));
      router.push("/AdminPage");
    setShowOptions(false)}
      }>
     Deployment
      </button>
       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("Timesheet"));
      dispatch(UpdateUserType("patient"));
      router.push("/AdminPage");
    setShowOptions(false)}
      }>
      Timesheet
      </button>
      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>router.push("/Invoices")}>
      Invoice
      </button>
      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>router.push("/PDRView")}>
    PDR 
      </button>
    </div>
  )}
    <button
      onClick={() => setShowOptions(!showOptions)}
      className="rounded-lg hover:bg-gray-100 transition cursor-pointer"
    >
         <List size={40} className='text-teal-800  p-2'/>
    </button>
  <img
    src="/Icons/Curate-logo.png"
    onClick={() => router.push("/DashBoard")}
    alt="Logo"
    className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl"
  />

  <h1 className="text-lg sm:text-2xl font-extrabold text-[#007B7F] tracking-tight leading-tight flex items-center gap-2">
    Hi,<span className="text-[#ff1493]">Admin</span>

    
  
  </h1>


  
</div>


          <div className='flex gap-2 items-center'>
            <div
                className="
      flex items-center bg-white shadow-md rounded-xl
      px-4 h-[44px]
      border border-gray-200
      focus-within:border-indigo-500
      transition
      w-full sm:w-[320px]
    "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-500 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                  />
                </svg>

                <input
                  type="search"
                  placeholder="Search..."
                  onChange={(e: any) => setSearchResult(e.target.value)}
                  className="
        w-full bg-transparent outline-none
        text-sm text-gray-700 placeholder-gray-400
      "
                />
              </div>

            
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
            >
              DashBoard
            </button>
            <button
              onClick={handleMainLogout}
              className="
                   px-4 py-2.5
                  text-sm flex items-center gap-2
                  text-red-600
                  hover:bg-red-50
                  font-medium
                "
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

      <div className="bg-white border border-gray-200 mt-2 rounded-xl shadow-md">

        <div className="flex items-center  justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-800">
            Payment Financial Report
          </h2>
<div className="flex items-center gap-3 md:w-[430px]">





              <div className="w-full sm:w-[130px]">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Month
                </label>

                <select
                  value={SearchMonth}
                  onChange={async (e) => {
    const month = e.target.value;

    dispatch(Refresh(`Please Wait... Fetching ${month || "All"} info...`));

    // ⏳ wait until month data updates
    await dispatch(UpdateAdminMonthFilter(month));

    // ✅ now trigger fresh reload + message
    dispatch(Refresh(`Successfully Fetched ${month || "All"} Data`));
  }}
                   className="
        w-full h-[44px] rounded-xl
        border border-gray-300
        px-4 text-sm bg-white text-gray-800
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        focus:border-transparent transition-all
      "
                >
                  <option value="">All Months</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>




              <div >
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Year
                </label>

                <select
                  value={SearchYear}
                  onChange={(e) => dispatch(UpdateAdminYearFilter(e.target.value))}
                  className="
        w-full rounded-xl border border-gray-300
        px-4 py-3 text-sm bg-white text-gray-800
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        focus:border-transparent transition-all
      "
                >
                  <option value="">All Years</option>
                  {[2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

            
          <button
            onClick={() => setShowFull(!showFull)}
            className="bg-gradient-to-br from-[#00A9A5] to-[#005f61] text-white mt-4 cursor-pointer px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            {showFull ? "Show Less Columns" : "Show Full Table"}
          </button>
          </div>
        </div>

        <div className="overflow-x-auto">

        <table className={`w-full text-sm ${showFull ? "min-w-[1600px]" : "table-fixed"}`}>

            <thead className="sticky top-0 z-10 bg-gradient-to-br from-[#00A9A5] to-[#005f61] text-white">
              <tr>
              {columns.map((col) => (
  <th
    key={col}
    className={`px-4 py-3 whitespace-nowrap font-semibold tracking-wide ${
      col === "Final Pay" ? "text-center" : "text-left"
    }`}
  >
    {col}
  </th>
))}
              </tr>
            </thead>

            <tbody>

              {testData.map((row, index) => (

                <tr
                  key={index}
                  className={`border-b border-gray-200 transition `}
                >

                  {columns.includes("Invoice No.") && <td className="px-4 py-3 font-medium text-gray-700">{row.invoiceNo}</td>}
                  {columns.includes("Start Date") && <td className="px-4 py-3">{row.startDate}</td>}
                  {columns.includes("End Date") && <td className="px-4 py-3">{row.endDate}</td>}

                  {columns.includes("Status") && (
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-md">
                        {row.status}
                      </span>
                    </td>
                  )}

                  {columns.includes("Location") && <td className="px-4 py-3">{row.location}</td>}
                  {columns.includes("Client Phone") && <td className="px-4 py-3">{row.clientPhone}</td>}
                  {columns.includes("Client Name") && <td className="px-4 py-3">{row.clientName}</td>}
                  {columns.includes("Patient Name") && <td className="px-4 py-3">{row.patientName}</td>}
                  {columns.includes("Patient Condition") && <td className="px-4 py-3">{row.patientCondition}</td>}
                  {columns.includes("Referral Name") && <td className="px-4 py-3">{row.referralName}</td>}
                  {columns.includes("HCP Type") && <td className="px-4 py-3">{row.hcpType}</td>}
                  {columns.includes("HCP ID") && <td className="px-4 py-3">{row.hcpId}</td>}
                  {columns.includes("HCP Name") && <td className="px-4 py-3">{row.hcpName}</td>}
                  {columns.includes("HCP Phone") && <td className="px-4 py-3">{row.hcpPhone}</td>}
                  {columns.includes("HCP Source") && <td className="px-4 py-3">{row.hcpSource}</td>}
                  {columns.includes("Provider Name") && <td className="px-4 py-3">{row.providerName}</td>}
                  {columns.includes("Pay Terms") && <td className="px-4 py-3">{row.payTerms}</td>}
                  {columns.includes("C Total") && <td className="px-4 py-3 text-right">₹{row.cTotal.toLocaleString()}</td>}
                  {columns.includes("C Pay") && <td className="px-4 py-3 text-right">₹{row.cPay.toLocaleString()}</td>}
                  {columns.includes("HCP Total") && <td className="px-4 py-3 text-right">₹{row.hcpTotal.toLocaleString()}</td>}
                  {columns.includes("HCP Pay") && <td className="px-4 py-3 text-right">₹{row.hcpPay.toLocaleString()}</td>}
                  {columns.includes("PD") && <td className="px-4 py-3">{row.pd}</td>}
                  {columns.includes("AD") && <td className="px-4 py-3">{row.ad}</td>}
                  {columns.includes("HP") && <td className="px-4 py-3">{row.hp}</td>}
                  {columns.includes("Margin") && <td className="px-4 py-3 text-right">₹{row.margin.toLocaleString()}</td>}
                  {columns.includes("Actual C Pay") && <td className="px-4 py-3 text-right">₹{row.actualCPay.toLocaleString()}</td>}
                  {columns.includes("Actual HCP Pay") && <td className="px-4 py-3 text-right">₹{row.actualHcpPay.toLocaleString()}</td>}
                  {columns.includes("Actual Margin") && <td className="px-4 py-3 text-right">₹{row.actualMargin.toLocaleString()}</td>}
                  {columns.includes("Actual Margin %") && <td className="px-4 py-3">{row.actualMarginPercent}</td>}
                  {columns.includes("Pay Calculation") && <td className="px-4 py-3 text-right">₹{row.payCalculation.toLocaleString()}</td>}
                  {columns.includes("1% Tax") && <td className="px-4 py-3 text-right">₹{row.tax.toLocaleString()}</td>}
                  {columns.includes("Pay") && <td className="px-4 py-3 text-right">₹{row.pay.toLocaleString()}</td>}
                  {columns.includes("Advance Payment") && <td className="px-4 py-3 text-right">₹{row.advancePayment.toLocaleString()}</td>}
                  {columns.includes("Staff Travel Exp") && <td className="px-4 py-3 text-right">₹{row.travelExpense.toLocaleString()}</td>}

                  {columns.includes("Final Pay") && (
                  <td className="px-4 py-3 text-center font-semibold text-green-700">
  ₹{row.finalPay.toLocaleString()}
</td>
                  )}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}