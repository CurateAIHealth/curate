"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Eye, Download, CheckCircle, Clock, Slice, Pencil, SquarePen, EllipsisVertical, LogOut, Loader, List, PencilOff, Info, PrinterCheck, ListFilterPlus, ChevronDown, RotateCcw } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { GetInvoiceInfo, GetInvoiceInfoforAdvanceFilterInvoicePage, GetInvoiceInfoforInvoicePage, GetRegidterdUsers, GetSentInvoiceData, GetSentInvoiceDataforDownloadpdf, UpdateStatusPayment } from "@/Lib/user.action";
import { GeneratePDF, getDaysBetween, GetFulladress, parseFlexibleDate } from "@/Lib/Actions";
import { LoadingData } from "@/Components/Loading/page";

import { Update_Main_Filter_Status, UpdateAdminMonthFilter, UpdateAdminYearFilter, UpdateInvoiceInfo, UpdateInvoiceIntialStatus, UpdateInvoiceStatus, UpdateUserType } from "@/Redux/action";
import { useDispatch, useSelector } from "react-redux";
import ReusableInvoice from "@/Components/InvioseTemplate/page";
import { useRouter } from "next/navigation";
import PaymentPopup from "@/Components/PaymentMethod/page";
import PassbookPopup from "@/Components/Trasactions/page";
import { ImportedinvoiceData, IndianStates, teams, } from "@/Lib/Content";
import EmptyState from "@/Components/NoDeployments/page";


type InvoiceStatus = "Draft" | "Sent" | "Overdue";

interface Invoice {
  id: string;
  name: string;
  contact: string;
  status: InvoiceStatus;
  dueDate: string;
  balancepending: any,
  totalamount: any
}

export default function InvoicesPage() {
  const now = new Date();
  const [monthFilter, setMonthFilter] =useState<any>(now.getMonth() + 1);
  const [activeTeam, setActiveTeam] = useState<number | "All">("All");
  const [yearFilter, setYearFilter] =useState(String(now.getFullYear()));
    const [openTransactions, setOpenTransactions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [FetchedInfo, setFetchedInfo] = useState<any>([])
  const [isAdvancedFilterActive, setIsAdvancedFilterActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openPaymentMethods, setOpenPaymentMethods] = useState(false);
  const [PaymentInformation,SetPaymentInformation]=useState<any>()
  const [isChecking, setisChecking] = useState(true)
  const [isSending, setIsSending] = useState(false);
  const [search, setSearch] = useState("");
  const [SelectedServiceStates, setSelectedServiceStates] = useState("Telangana");
  const [filter, setFilter] = useState<"All" | InvoiceStatus>("All");
  const [page, setPage] = useState(1);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
 const [CurrentPaymentStatus,SetCurrentPaymentStatus]=useState<any>(null)
 const [invoiceTransactionData,setinvoiceTransactionData]=useState(ImportedinvoiceData)
  const [InvoiceData, setInvoiceData] = useState<any>()
const [activeTab, setActiveTab] = useState("due");
  const RegUserInfo=useSelector((state:any)=>state.AdminUsers)
  const [status, setStatus] = useState<any>(null);
  const Router = useRouter()
  const dispatch = useDispatch()
  const pageSize = 4;
const invoiceEditStatus = useSelector((s: any) => s.InvoiceEditStatus);
const ShowMailTemplate=useSelector((A:any)=>A.RevertInvoices)

const refreshInvoices = async (showLoader = true) => {
  try {
    if (showLoader) {
      setisChecking(true);
    }

    const data:any = await GetInvoiceInfoforInvoicePage(
      monthFilter,
      yearFilter
    );

  

    setFetchedInfo(data);
  } catch (err) {
    console.error("Error fetching invoices:", err);
  } finally {
    if (showLoader) {
      setisChecking(false);
    }
  }
};




useEffect(() => {
  if (RegUserInfo?.length === 0) {
    Router.push("/");
    return;
  }

  refreshInvoices(true);
  
}, [monthFilter, yearFilter]);

const GetAdvanceFilterData = async () => {
  if (!fromDate || !toDate) {
    setStatus("Please select both From Date and To Date");
    return;
  }

  if (new Date(fromDate) > new Date(toDate)) {
    setStatus("From Date cannot be after To Date");
    return;
  }

  try {
    setStatus("Please wait, fetching filtered data...");

    const GetFilterData =
      await GetInvoiceInfoforAdvanceFilterInvoicePage(
        fromDate,
        toDate
      );

    setFetchedInfo(
      Array.isArray(GetFilterData) ? GetFilterData : []
    );

    setIsAdvancedFilterActive(true);
    setPage(1);
    setStatus("Filtered data fetched successfully");

    setShowAdvancedFilter(false);
  } catch (error) {
    console.error("Advanced filter error:", error);
    setStatus("Failed to fetch filtered data");
  }
};
const downloadExcel = () => {
  try {
    // Keep Excel order same as the table
    const invoicesToExport = [...filteredInvoices].reverse();

    const exportData = invoicesToExport.map((inv: any, index: number) => {
      const dueInfo = getDueStatus(inv.StartDate);

      // Same Total calculation used in the table
      const draftTotal =
        Number(inv.CareTakeCharge || 0) +
        Number(inv.RegistrationFee || 0);

      const total =
        inv.status === "Draft"
          ? Number(draftTotal)
          : Number(inv.RoundedTotal || 0);

      // Same Balance calculation used in the table
      const balance = inv.balanceDue
        ? Number(inv.balanceDue)
        : Number(total) - Number(inv.AdvanceReceived || 0);

      // Same Invoice Number shown in table
      const invoiceNumber = String(
        inv.InvoiceNumber ||
        inv.id ||
        inv.number ||
        "-"
      ).includes("#")
        ? String(
            inv.InvoiceNumber ||
            inv.id ||
            inv.number ||
            "-"
          )
        : `#${
            inv.InvoiceNumber ||
            inv.id ||
            inv.number ||
            "-"
          }`;

      // Same Actions information
      const actions =
        inv.status === "Draft"
          ? "Edit & Send"
          : "Sent";

      // Edit information
      const edit =
        inv.status === "Draft"
          ? "Disabled"
          : "Edit";

      // Payment information
      let payment = "";

      if (inv.status === "Draft") {
        payment = "Not Available";
      } else if (inv.PaymentStatus) {
        payment = "Paid";
      } else {
        payment = "Due - Record Payment";
      }

      // Payment history
      const transactionCount = Array.isArray(inv.Trasaction)
        ? inv.Trasaction.length
        : 0;

      const history =
        transactionCount > 0
          ? `${transactionCount} Transaction(s)`
          : "No Transactions";

      // Download status
      const download =
        inv.status !== "Draft"
          ? "Available"
          : "Not Available";

      return {
        "S.No.": index + 1,

        "Invoice No.": invoiceNumber,

        "Client": inv.ClientName || "-",

        "Patient": inv.name || "-",

        "Contact": inv.contact
          ? inv.contact
          : "-",

        "Status": inv.status || "-",

        "Due Date": dueInfo.label || "-",

        "Total": `₹${Number(total).toFixed(2)}`,

        "Advance": `₹${Number(
          inv.AdvanceReceived || 0
        ).toFixed(2)}`,

        "Balance": `₹${Number(balance).toFixed(2)}`,

        "Actions": actions,

        "Edit": edit,

        "Payment": payment,

        "Team": inv.Team || "-",

        "History": history,

        "Download": download,
      };
    });

    // Create Excel worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Column widths
    worksheet["!cols"] = [
      { wch: 8 },   // S No.
      { wch: 20 },  // Invoice No.
      { wch: 25 },  // Client
      { wch: 25 },  // Patient
      { wch: 16 },  // Contact
      { wch: 14 },  // Status
      { wch: 18 },  // Due Date
      { wch: 15 },  // Total
      { wch: 15 },  // Advance
      { wch: 15 },  // Balance
      { wch: 18 },  // Actions
      { wch: 15 },  // Edit
      { wch: 25 },  // Payment
      { wch: 10 },  // Team
      { wch: 22 },  // History
      { wch: 18 },  // Download
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Invoices"
    );

    // Generate Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create file
    const fileData = new Blob(
      [excelBuffer],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    // Download
    saveAs(
      fileData,
      `Invoice_Report_${new Date()
        .toISOString()
        .split("T")[0]}.xlsx`
    );

  } catch (error) {
    console.error(
      "Error downloading invoice Excel:",
      error
    );

    alert("Unable to download invoice Excel file.");
  }
};

const GetTeamNumber = (A: any) => {
    if (!RegUserInfo?.length || !A) return "Not Entered";

    const ImpTeamNumber=RegUserInfo.find((each:any)=>each.userType==="patient"&&each.userId===A)

    return Number(ImpTeamNumber.Team) ?? "Not Entered";
  };
 const DownloadInvoice = async (InvoiceInfo: any) => {
  try {
    setIsSending(true);
    dispatch(UpdateInvoiceIntialStatus(false));

   

    const SentInvoices: any =
      await GetSentInvoiceDataforDownloadpdf(InvoiceInfo);

    const FilteredResult = SentInvoices?.data?.[0];

    if (!FilteredResult) {
      alert("Invoice Not Found");
      return;
    }

   

    // Keep React state updated if the UI needs it
    setInvoiceData(FilteredResult);

    // Generate directly - no setTimeout
    const Result = await GeneratePDF(FilteredResult);

    if (!Result?.status) {
      alert(Result?.message || "Unable to generate invoice");
      return;
    }

  } catch (err: any) {
    console.error("Invoice download error:", err);
    alert("Unable to download invoice");
  } finally {
    setIsSending(false);
    dispatch(UpdateInvoiceIntialStatus(true));
  }
};



  const EditInvoice = async (id: any) => {
    try {

      const SentInvoices: any = await GetSentInvoiceData();
      const FilteredResult = SentInvoices.insertedId.filter((each: any) => each.number === id);
          SetCurrentPaymentStatus(FilteredResult[0].PaymentStatus)
      setInvoiceData(FilteredResult[0]);
      dispatch(UpdateInvoiceStatus(true))
      setTimeout(async () => {

        dispatch(UpdateInvoiceIntialStatus(false))
        

      }, 300)
    } catch (err: any) {
      console.log("Error", err)
    }
  }
  
  const PreviewInfo =useMemo(()=>{
    return FetchedInfo.map((each: any) => {



    return {
       id: each.Invoice || each.number || each.InvoiceNumber ||each.Invoice|| "",
  InvoiceNumber: each.Invoice || each.number || each.InvoiceNumber || "",
      ClienId:each.ClienId,
      HCAId:each.HCAId||each.HCA_Id,
      ClientName: each.ClientName,
    
      Adress: each.Adress,
      name: each.Patient||each.patientName,
      contact: each.contact||each.contact,
      Email: each.Email||each.email,
      status: each.status,
      DeployDate:each.DeployDate,
      StartDate: each.SeriviceStartDate,
      ServiceEndDate: each.ServiceEndDate,
      RegistrationFee: each.RegistrationFee,
      CareTakeCharge: each.CareTakeChare,
      AdvanceReceived: each.AdvanceReceived||each.AdvancePaid,
      PaymentStatus:each.PaymentStatus,
      balanceDue:each.balanceDue,
      Trasaction:each.Trasaction||[],
      RoundedTotal:each.RoundedTotal,
      ServiceState:
  !each.ServiceState ||
  each.ServiceState === "Not Provided"
    ? "Telangana"
    : each.ServiceState,
      Team:GetTeamNumber(each.ClienId)||"1",
      RefundAmount:each.RefundAmount||"",
      RefundDate:each.RefundDate||"",
      RefundDays:each.RefundDays||"",
      HACAttendeceforRefund:each.HACAttendeceforRefund||[]


    }

  }
  )
  },[[FetchedInfo, RegUserInfo]])
  
  
  
  
  const statusStyles: any = {
    Draft:
      "bg-[#50c89612] text-[#50c896] border border-[#50c89655]",
    Sent:
      "bg-[#1392d312] text-[#1392d3] border border-[#1392d355]",
    Overdue:
      "bg-[#ff149312] text-[#ff1493] border border-[#ff149355]",
  };
  const computedInvoices =useMemo(()=>{
    return  PreviewInfo.map((inv: any) => {
    const dueInfo = getDueStatus(inv.StartDate);

    const newStatus: InvoiceStatus =
      dueInfo.status === "overdue" ? "Overdue" : inv.status;

    return {
      ...inv,
      OverDuestatus: newStatus,
      dueInfo
    };
  });
  },[
    [PreviewInfo]
  ])
  
  
  
  
  

const filteredInvoices = useMemo(() => {
  let data = [...computedInvoices];

  // MONTH + YEAR
// MONTH + YEAR FILTER
// Skip this filter when Advanced Filter is active.

if (
  !isAdvancedFilterActive &&
  (monthFilter !== "All" || yearFilter !== "All")
) {
  data = data.filter((inv: any) => {
    const date = parseFlexibleDate(
      inv.StartDate ??
      inv.SeriviceStartDate ??
      inv.ServiceStartDate ??
      inv.DeployDate
    );

    if (!date) return false;

    const monthMatches =
      monthFilter === "All" ||
      date.getMonth() + 1 === Number(monthFilter);

    const yearMatches =
      yearFilter === "All" ||
      date.getFullYear() === Number(yearFilter);

    return monthMatches && yearMatches;
  });
}

  // SEARCH
  if (search.trim() !== "") {
    const q = search.trim().toLowerCase();

    data = data.filter((x: any) =>
      x.name?.toLowerCase().includes(q) ||
      x.ClientName?.toLowerCase().includes(q) ||
      x.contact?.toString().toLowerCase().includes(q)
    );
  }

  // STATUS
  if (filter !== "All") {
    data = data.filter(
      (each: any) => each.status === filter
    );
  }

  // SERVICE STATE
  if (SelectedServiceStates !== "All") {
    data = data.filter(
      (each: any) =>
        each.ServiceState === SelectedServiceStates
    );
  }

  // TEAM
  if (activeTeam !== "All") {
    data = data.filter(
      (each: any) => each.Team === activeTeam
    );
  }


  if(activeTab==="completed"){
       data = data.filter((each)=>each.balanceDue===Number(0))
  }
  if(activeTab!=="completed"){
       data = data.filter((each)=>each.balanceDue!==Number(0))
  }

  return data;
}, [
  computedInvoices,
  monthFilter,
  yearFilter,
  search,
  filter,
  SelectedServiceStates,
  activeTeam,
  activeTab,
  isAdvancedFilterActive
]);



  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / pageSize)
  );

  const paginatedData = filteredInvoices.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalDraft = filteredInvoices.filter((x: any) => x.status === "Draft").length;
  const totalSent = filteredInvoices.filter((x: any) => x.status === "Sent").length;
const totalOverdue = filteredInvoices.filter((x: any) => {


  return getDueStatus(x.StartDate ??
    x.SeriviceStartDate ??
    x.ServiceStartDate ??
    x.DeployDate).label === "Overdue";
}).length;

  const currentYear = new Date().getFullYear();

  const availableYears = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const BalanceDue = filteredInvoices
  ?.filter((each: any) => each?.PaymentStatus === false)
  .map((each: any) => Number(each?.balanceDue) || 0)
  .reduce((total: number, value: number) => total + value, 0);
  
// const BalancePaid = filteredInvoices
//   ?.filter((each: any) => each?.PaymentStatus === true)
//   .reduce((total: number, each: any) => {
//     const balance = Number(each?.balanceDue) || 0;
//     const advance =
//       Number(each?.AdvanceReceived) ||
//       Number(each?.AdvancePaid) ||
//       0;

//     return total + balance + advance;
//   }, 0);

const BalancePaid = filteredInvoices.reduce(
  (total: number, invoice: any) => {
    // Advance payment
    const advance =
      Number(invoice?.AdvanceReceived) ||
      Number(invoice?.AdvancePaid) ||
      0;

    // All transaction payments
    const transactionsTotal = Array.isArray(invoice?.Trasaction)
      ? invoice.Trasaction.reduce(
          (transactionTotal: number, transaction: any) => {
            return transactionTotal + Number(transaction?.amount || 0);
          },
          0
        )
      : 0;

    return Math.round(total + advance + transactionsTotal);
  },
  0
);


const TotalRoundedAmount = filteredInvoices.reduce((total: number, invoice: any) => total + (Number(invoice?.RoundedTotal) || 0), 0);

const RefundAmount = filteredInvoices
  ?.filter((each: any) => 
    each?.PaymentStatus === true &&
    each?.marginStatus?.type === "Refund"
  )
  .map((each: any) => Number(each?.marginStatus?.amount) || 0)
  .reduce((total: number, value: number) => total + value, 0);


const UpdatePaymentStatus = async (A: any) => {
  setOpenPaymentMethods(false)
  setStatus("Updating Payment Status...");

  try {
    const UpdatePayment: any = await UpdateStatusPayment(
      PaymentInformation,
      A
    );

    if (UpdatePayment.success === true) {
 

      // Get fresh data WITHOUT showing full-page LoadingData
      await refreshInvoices(false);

      setStatus("Payment Status Updated Successfully");
    }
  } catch (err: any) {
    console.error("Payment Status Update Error:", err);
  }
};
  const resetToFirstPage = () => setPage(1);
  function convertToISO(dateString: any) {
  if (!dateString || typeof dateString !== "string" || !dateString.includes("/")) {
    console.warn("Invalid date received:", dateString);
    return null;
  }

  const [day, month, year] = dateString.split("/");
  if (!day || !month || !year) return null;

  return `${year}-${month}-${day}`;
}

const handleLogout = () => {
  
  Router.push('/DashBoard'); 
       
};

  const handleMainLogout = async () => {
    localStorage.removeItem("UserId");
    Router.prefetch("/");
    Router.push("/");
  };

 function getDueStatus(placementDate: any) {
  const iso = convertToISO(placementDate);

  if (!iso) {
    return { label: "Invalid Date", days: 0, status: "unknown" };
  }

  const today:any = new Date();
  const placed:any = new Date(iso);

  today.setHours(0, 0, 0, 0);
  placed.setHours(0, 0, 0, 0);

  const diffTime:any = today - placed;
  const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const daysLeft = 5 - daysPassed;

  if (daysLeft < 0) {
    return { label: "Overdue", days: daysLeft, status: "overdue" };
  }

  return { label: `${daysLeft} days left`, days: daysLeft, status: "upcoming" };
}

const GetTitiles=(ImpId:any)=>{

   if (!RegUserInfo?.length || !ImpId) return "Not Entered";

    const TitleValue =RegUserInfo?.filter((info: any) => info?.userId === ImpId)

    return TitleValue||"Not Profided"

}
const GetHCAType=(ImpId:any)=>{

   if (!RegUserInfo?.length || !ImpId) return "Not Entered";

    const TitleValue =RegUserInfo?.filter((info: any) => info?.userId === ImpId)

    return TitleValue||"Not Profided"

}
  const UpdateInvoiceMailTemplate = (MainTemplateInfo: any) => {

    const Values=GetTitiles(MainTemplateInfo.ClienId)
   const HCAType=GetHCAType(MainTemplateInfo.HCAId)

     dispatch(
    UpdateInvoiceInfo({
      ...MainTemplateInfo,
      title: Values[0].title||"",
      Patienttitle: Values[0].Patienttitle||"",
      HCAType:HCAType[0].PreviewUserType||""

    })
  )
    Router.push("/MailInvoiceTemplate")
  }

  const invoiceProps = {
    invoice: {
      number: InvoiceData?.number ?? "-",
      date: InvoiceData?.serviceFrom,
      dueDate: InvoiceData?.serviceTo,
      serviceFrom: InvoiceData?.serviceFrom,
      serviceTo: InvoiceData?.serviceTo,
      terms: InvoiceData?.terms ?? "7 Days",
      patientName: InvoiceData?.patientName,
      ClientName:InvoiceData?.ClientName,
      invoiceName: InvoiceData?.name,
      Adress  : InvoiceData?.Adress
    },

    billTo: {
      ClientName: InvoiceData?.ClientName,
      name: InvoiceData?.ClientName,
      patientName: InvoiceData?.name,
      contact: InvoiceData?.contact,
      email: InvoiceData?.Email,
      addressLines: InvoiceData?.Adress,
    },

    items: InvoiceData?.items?.map((srv: any) => ({
      description: srv.description,
      days: srv.days,
      rate: srv.rate,
      amount: srv.amount,
    })),

    totals: {
      BaseAmount: InvoiceData?.BaseAmount,
      Tax: InvoiceData?.Tax,
      Discount: InvoiceData?.Discount,
      OtherExpenses: InvoiceData?.OtherExpenses,
      total: InvoiceData?.RoundedTotal,
      AdvancePaid: InvoiceData?.AdvancePaid,
      balanceDue: InvoiceData?.balanceDue,
      RegistraionFee: InvoiceData?.RegistraionFee,
CheckPaymentStatus:CurrentPaymentStatus


    }
  };

  if (isChecking) {
    return (
      <LoadingData />
    );
  }
  return (
    <div>
      <>{isSending && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white shadow-xl rounded-2xl px-8 py-6 text-center w-[90%] max-w-sm">
            <div className="animate-spin h-10 w-10 border-4 border-slate-300 border-t-slate-900 rounded-full mx-auto mb-4"></div>

            <h2 className="text-lg font-semibold text-slate-800">
              Please Wait…
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Downloading Invoice
            </p>
          </div>
        </div>
      )}
      </>
      {ShowMailTemplate ?
        <div className="min-h-screen bg-[#f5f7fb] p-2 md:p-2">


         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
  {showOptions && (
        <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-xl shadow-lg w-40 py-2 z-50">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("Call Enquiry"));
          dispatch(UpdateUserType("patient"));
          dispatch(UpdateAdminMonthFilter(new Date(now.getFullYear(), now.getMonth()).toLocaleString("default", { month: "long" })));
      dispatch(UpdateAdminYearFilter(String(now.getFullYear())))
        setShowOptions(false)}
          }>
       Call Enquiry
          </button>
           <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("HCP List"));
            dispatch(UpdateUserType("healthcare-assistant"));
      Router.push("/AdminPage")
        setShowOptions(false)}
          }>
       HCP List
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("Deployment"));
          dispatch(UpdateUserType("patient"));
            Router.push("/AdminPage")
        setShowOptions(false)}
          }>
         Deployment
          </button>
           <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>{  dispatch(Update_Main_Filter_Status("Timesheet"));
          dispatch(UpdateUserType("patient"));
          Router.push("/AdminPage")
        setShowOptions(false)}
          }>
          Timesheet
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>Router.push("/Invoices")}>
          Invoice
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>Router.push("/PDRView")}>
        PDR 
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={()=>Router.push("/PaymentsInfo")}>
        Payments 
          </button>
          
        </div>
      )}
  <div className="flex items-center ">
      
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
             <List size={40} className='text-teal-800  p-2'/>
        </button>
    <img
      src="https://curate-pearl.vercel.app/Icons/UpdateCurateLogo.png"
      alt="Curate Health Services Logo"
      className="h-14 md:h-14 md:mr-4 "
    />

    <div className="flex flex-col">
      <h1
        className="text-xl md:text-xl text-center font-semibold tracking-tight"
        style={{ color: "#ff1493" }}
      >
        Invoice Management
      </h1>

      {/* <p className="text-gray-500 text-sm">
        Billing overview for patients & clients
      </p> */}
    </div>
  </div>
<div className="inline-flex rounded-2xl bg-gray-100 p-1.5 shadow-inner">
  {teams.map((team:any) => (
    <button
      key={team}
      onClick={() => setActiveTeam(team)}
      className={`rounded-xl px-6 py-2.5 cursor-pointer text-sm font-semibold transition-all duration-200 ${
        activeTeam === team
  ? "bg-white text-pink-600 border border-pink-600 shadow-md scale-105"
  : "text-gray-600 hover:bg-white hover:text-pink-600"
      }`}
    >
      { `Team${team}`}
    </button>
  ))}
</div>
<div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
  <button
    onClick={() => setActiveTab("due")}
    className={`px-5 py-2.5 rounded-lg text-xs cursor-pointer font-semibold transition-all duration-200 ${
      activeTab === "due"
        ? "bg-teal-600 text-white shadow-md"
        : " text-gray-600 bg-white hover:text-teal-600"
    }`}
  >
    Payment Due Clients
  </button>

  <button
    onClick={() => setActiveTab("completed")}
    className={`px-5 py-2.5 rounded-lg text-xs cursor-pointer font-semibold transition-all duration-200 ${
      activeTab === "completed"
        ? "bg-teal-600 text-white shadow-md"
        : " text-gray-600 bg-white hover:text-teal-600"
    }`}
  >
   Payment Completed Clients
  </button>
</div>

  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative">
      <select
        value={SelectedServiceStates}
      onChange={(e) => setSelectedServiceStates(e.target.value)}
        className="w-full text-center h-10 appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-700 outline-none transition-all hover:border-gray-400 focus:border-[#1392d3] focus:ring-2 focus:ring-[#1392d3]/20"
      >
      
  
        {IndianStates.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
  
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
    <button
      onClick={handleLogout}
      className="
        flex items-center justify-center gap-2 cursor-pointer
        px-5 py-2.5
        bg-gradient-to-br from-[#00A9A5] to-[#005f61]
        hover:from-[#01cfc7] hover:to-[#00403e]
        text-white rounded-xl
        font-semibold shadow-md
        transition
      "
    >
      Dashboard
    </button>

    {/* <button
      onClick={handleMainLogout}
      className="
        flex items-center justify-center gap-2
        px-5 py-2.5
        text-sm font-medium
        text-red-600
        border border-red-200
        rounded-xl
        hover:bg-red-50
        transition
      "
    >
      <LogOut size={16} />
      Logout
    </button> */}
  </div>
</div>



          <div className="flex flex-col gap-4 mt-4">

            <div className="flex flex-col lg:flex-row gap-4 justify-between">

              <div className="flex flex-col gap-1 w-full lg:w-72">
                <label className="text-xs font-medium text-gray-500">
                  Search by name or contact
                </label>

                <div className="flex items-center gap-2 bg-white px-3 py-2 border border-gray-200 rounded-xl shadow-sm">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. Savita, 9876..."
                    className="w-full outline-none text-gray-700 text-sm"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetToFirstPage();
                    }}
                  />
                </div>
              </div>
<div className="flex flex-col md:flex-row items-center justify-between gap-3 border border-gray-300 shadow-lg p-3 rounded-md w-full">
    <div className="flex items-center gap-2 bg-blue-50 border-l-4 border-blue-600 text-blue-700 p-2 rounded w-full md:w-auto">
    <p className="text-xs font-semibold whitespace-nowrap">● Total Amount</p>
    <h3 className="text-sm md:text-base font-bold">
       
      ₹{Math.round(TotalRoundedAmount)}
    </h3>
  </div>


  <div className="flex items-center gap-2 bg-green-50 border-l-4 border-green-600 text-green-700 p-2 rounded w-full md:w-auto">
    <p className="text-xs font-semibold whitespace-nowrap">✔ Total Received</p>
    <h3 className="text-sm md:text-base font-bold">₹{  BalancePaid}</h3>
  </div>


  <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-600 text-red-700 p-2 rounded w-full md:w-auto">
    <p className="text-xs font-semibold whitespace-nowrap">⚠ Pending Amount</p>
    <h3 className="text-sm md:text-base font-bold">₹{Math.round(BalanceDue)}</h3>
  </div>

  
  <div className="flex items-center gap-2 bg-yellow-50 border-l-4 border-yellow-600 text-yellow-700 p-2 rounded w-full md:w-auto">
    <p className="text-xs font-semibold whitespace-nowrap">↩ Refund Issued</p>
    <h3 className="text-sm md:text-base font-bold">₹{RefundAmount}</h3>
  </div>

</div>



              <div className="flex flex-wrap gap-3 items-center">


                

<div className="flex flex-wrap gap-2 items-center">
  <span className="text-xs text-gray-500">Status</span>

  {["All", "Draft", "Sent"].map((s) => {
    const active = filter === s;

    return (
      <button
        key={s}
        onClick={() => {
          setFilter(s as any);
          resetToFirstPage();
        }}
        className={
          "px-3 py-1.5 rounded-full text-xs font-medium border transition " +
          (active
            ? "bg-[#1392d3] text-white border-[#1392d3]"
            : "bg-white text-gray-600 border-gray-200")
        }
      >
        {s}
      </button>
    );
  })}

  {/* Advanced Filter Button */}
  <button
    onClick={() => setShowAdvancedFilter(true)}
    className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-[#1392d3] hover:text-[#1392d3] transition"
  >
    <ListFilterPlus  size={14} />
    <span className="text-xs font-medium">Advanced</span>
  </button>
{isAdvancedFilterActive && (
  <button
    onClick={()=>{refreshInvoices(true);setIsAdvancedFilterActive(false)}}
    className="
      inline-flex items-center justify-center gap-2
      rounded-lg border border-red-200
      bg-red-50 px-4 py-2
      text-sm font-semibold text-red-600
      shadow-sm
      transition-all duration-200
      hover:border-red-300 hover:bg-red-100
      hover:text-red-700 hover:shadow
      active:scale-95
      focus:outline-none focus:ring-2
      focus:ring-red-300 focus:ring-offset-2
    "
  >
    <RotateCcw size={16} />
    Reset
  </button>
)}
</div>
{!isAdvancedFilterActive &&
<div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Month</span>
                  <select
                    value={monthFilter}
                    onChange={(e) => {
                      setMonthFilter(e.target.value);
                      resetToFirstPage();
                    }}
                    className="px-3 py-1.5 rounded-full text-xs border border-gray-300 bg-white text-gray-700"
                  >
                    <option value="All">All</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("en", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Year</span>
                  <select
                    value={yearFilter}
                    onChange={(e) => {
                      setYearFilter(e.target.value);
                      resetToFirstPage();
                    }}
                    className="px-3 py-1.5 rounded-full text-xs border border-gray-300 bg-white text-gray-700"
                  >
                    <option value="All">All</option>
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
                 </div>}

              </div>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryCard label="Total Invoices" value={filteredInvoices.length} subtleLabel="For this Month" borderColor="#1392d3" />
              <SummaryCard label="Draft" value={totalDraft} subtleLabel="Need review" borderColor="#50c896" />
              <SummaryCard label="Sent" value={totalSent} subtleLabel="Shared with Client" borderColor="#1392d3" />
              <SummaryCard label="Overdue" value={totalOverdue} subtleLabel="Needs follow-up" borderColor="#ff1493" />
            </div>
          </div>


          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto mt-5">
  <div className="min-w-[900px]">
    <div className="flex justify-between items-center px-5 py-3 border-b border-gray-400">
      <div>
        <p className="text-sm font-medium text-gray-800">Invoice list</p> 
    
        {/* <p className="text-xs text-gray-500">
          Showing {paginatedData.length} of {filteredInvoices.length} filtered invoices
        </p> */}
      </div>
 <>
    {status === "Updating Payment Status..." && (
      <div className="px-3 py-1 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded-full text-xs font-semibold w-fit">
        Updating Payment Status...
      </div>
    )}

    {status === "Payment Status Updated Successfully" && (
      <div className="px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded-full text-xs font-semibold w-fit">
        Payment Status Updated Successfully!
      </div>
    )}
  </>
  {
  showAdvancedFilter && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
{/* <img
            src="/Icons/Curate-logoq.png"
            className="h-10"
            alt="Company Logo"
          /> */}

          <h3 className="text-lg font-semibold text-[#1392d3]">
            Advanced Filter
          </h3>
          </div>

          <button
            onClick={() => setShowAdvancedFilter(false)}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1392d3]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1392d3]"
            />
          </div>
        </div>
        {status&&
<p
  className="
    inline-flex items-center justify-center gap-2 mt-2
    rounded-full border border-blue-200
    bg-blue-50 px-3 py-1.5
    text-sm font-semibold text-blue-700
    shadow-sm
  "
>
  <span className="h-2 w-2 rounded-full bg-blue-500" />
  {status}
</p>}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
              setStatus("")
            }}
            className="px-4 py-2 border rounded-lg text-gray-600"
          >
            Clear
          </button>

          <button
            onClick={
              
              GetAdvanceFilterData
            }
            className="px-4 py-2 bg-[#1392d3] text-white rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
 <PassbookPopup
        open={openTransactions}
        onClose={() => setOpenTransactions(false)}
        data={{
          ...invoiceTransactionData,
          ClienId: (invoiceTransactionData as any).ClienId ?? "",
          StartDate:
            (invoiceTransactionData as any).StartDate ??
            (invoiceTransactionData as any).ServiceStartDate ??
            "",
        }}
      />

      <button
        className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg bg-[#1392d3] text-white text-xs font-semibold shadow-sm hover:bg-[#117bb1] transition"
        onClick={downloadExcel}
      >
        <Download className="w-4 h-4" />
        Download Invoices
      </button>
    </div>
   <PaymentPopup
        open={openPaymentMethods}
        loading={loading}
      ImportedAmount={PaymentInformation?.balanceDue}
        onClose={() => setOpenPaymentMethods(false)}
        onSubmit={(Data:any)=>UpdatePaymentStatus(Data)}
      />
   
{filteredInvoices.length > 0 ? (
  <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">

    {/* =========================================================
        DESKTOP / TABLET HEADER
    ========================================================= */}
   <div
  className="
    hidden lg:grid
    w-full
    grid-cols-[45px_140px_1.1fr_1.1fr_100px_85px_95px_75px_75px_80px_120px_55px_110px_60px_70px_70px]
    items-center
    gap-2
    bg-teal-800
    px-3
    py-3
    text-[11px]
    font-semibold
    text-white
  "
>
      <div>S.No.</div>
      <div>Invoice No.</div>
      <div>Client</div>
      <div>Patient</div>
      <div>Contact</div>
      <div>Status</div>
      <div>Due Date</div>
      <div>Total</div>
      <div>Advance</div>
      <div>Balance</div>
      <div>Actions</div>
      <div>Edit</div>
      <div>Payment</div>
      <div>Team</div>
      <div>History</div>
      <div>Download</div>
    </div>

    {/* =========================================================
        MOBILE / TABLET HEADER
    ========================================================= */}
    <div className="flex lg:hidden items-center justify-between bg-teal-800 px-4 py-3">
      <span className="text-sm font-semibold text-white">
        Invoices
      </span>

      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
        {filteredInvoices.length}
      </span>
    </div>

    {/* =========================================================
        INVOICE LIST
    ========================================================= */}
    <div className="max-h-[600px] overflow-y-auto">

      {[...filteredInvoices].reverse().map((inv: any, index: number) => {

        const dueInfo = getDueStatus(inv.StartDate);

        /*
         * IMPORTANT:
         * Your original total expression is missing an operator.
         * Update this calculation according to your actual business logic.
         */
        const total =
          Number(inv.CareTakeCharge || 0) +
          Number(inv.RegistrationFee || 0);

        const balance = inv.balanceDue
          ? Number(inv.balanceDue)
          : Number(total) - Number(inv.AdvanceReceived || 0);

        return (
          <div
            key={`${inv.id}-${inv.createdAt || index}`}
            className="
              border-b border-gray-200
              transition-colors
              hover:bg-slate-50
            "
          >

            {/* =====================================================
                MOBILE CARD
            ===================================================== */}
            <div className="block lg:hidden p-4">

              {/* Top section */}
              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0 flex-1">

                  <div className="flex items-center gap-2">

                    <span
                      className="
                        flex h-7 w-7 shrink-0 items-center justify-center
                        rounded-full bg-teal-100
                        text-xs font-bold text-teal-800
                      "
                    >
                      {index + 1}
                    </span>

                  {/* Client */}
<div className="min-w-0">
  <span
    className="
      block
      whitespace-normal
      break-words
      leading-4
      text-[11px]
      font-semibold
      text-gray-800
    "
    title={inv.ClientName || "-"}
  >
    {inv.ClientName || "-"}
  </span>
</div>

{/* Patient */}
<div className="min-w-0">
  <span
    className="
      block
      whitespace-normal
      break-words
      leading-4
      text-[11px]
      font-semibold
      text-gray-800
    "
    title={inv.name || "-"}
  >
    {inv.name || "-"}
  </span>
</div>

                  </div>

                </div>

                {/* Status */}
                <div className="shrink-0">

                  {inv.status === "Sent" ? (
                    <span
                      className="
                        inline-flex items-center gap-1
                        rounded-full
                        bg-green-50
                        px-2.5 py-1
                        text-[10px] font-semibold
                        text-green-700
                        border border-green-200
                      "
                    >
                      <CheckCircle className="h-3 w-3" />
                      Sent
                    </span>
                  ) : (
                    <span
                      className="
                        inline-flex items-center gap-1
                        rounded-full
                        bg-yellow-50
                        px-2.5 py-1
                        text-[10px] font-semibold
                        text-yellow-700
                        border border-yellow-200
                      "
                    >
                      <Clock className="h-3 w-3" />
                      Draft
                    </span>
                  )}

                </div>

              </div>


              {/* Contact */}
              <div className="mt-4 grid grid-cols-2 gap-3">

                <div>
                  <p className="text-[10px] font-medium uppercase text-gray-400">
                    Contact
                  </p>

                  <p className="mt-1 truncate text-xs font-medium text-gray-700">
                    {inv.contact || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase text-gray-400">
                    Team
                  </p>

                  <span
                    className="
                      mt-1 inline-flex
                      rounded-full
                      bg-pink-100
                      px-2.5 py-1
                      text-[10px] font-bold
                      text-pink-700
                    "
                  >
                    {inv.Team || "-"}
                  </span>
                </div>

              </div>


              {/* Financial information */}
              <div
                className="
                  mt-4
                  grid grid-cols-3
                  divide-x divide-gray-200
                  rounded-lg
                  border border-gray-200
                  bg-gray-50
                "
              >

                <div className="px-2 py-3 text-center">

                  <p className="text-[9px] font-medium uppercase text-gray-400">
                    Total
                  </p>

                  <p className="mt-1 text-xs font-bold text-gray-800">
                    ₹{Number(total).toFixed(2)}
                  </p>

                </div>


                <div className="px-2 py-3 text-center">

                  <p className="text-[9px] font-medium uppercase text-gray-400">
                    Advance
                  </p>

                  <p className="mt-1 text-xs font-bold text-blue-700">
                    ₹{Number(inv.AdvanceReceived || 0).toFixed(2)}
                  </p>

                </div>


                <div className="px-2 py-3 text-center">

                  <p className="text-[9px] font-medium uppercase text-gray-400">
                    Balance
                  </p>

                  <p className="mt-1 text-xs font-bold text-red-600">
                    ₹{Number(balance).toFixed(2)}
                  </p>

                </div>

              </div>


              {/* Due information */}
              <div className="mt-3 flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-medium uppercase text-gray-400">
                    Payment
                  </p>

                  {inv.PaymentStatus ? (

                    <span
                      className="
                        mt-1 inline-flex
                        rounded-full
                        border border-green-300
                        bg-green-50
                        px-2.5 py-1
                        text-[10px] font-semibold
                        text-green-600
                      "
                    >
                      Paid
                    </span>

                  ) : dueInfo.status === "overdue" ? (

                    <span
                      className="
                        mt-1 inline-flex
                        rounded-full
                        border border-red-300
                        bg-red-50
                        px-2.5 py-1
                        text-[10px] font-semibold
                        text-red-600
                      "
                    >
                      Overdue
                    </span>

                  ) : (

                    <span className="mt-1 block text-xs text-gray-700">
                      {dueInfo.label}
                    </span>

                  )}

                </div>


                <div className="text-right">

                  <p className="text-[10px] font-medium uppercase text-gray-400">
                    Invoice
                  </p>

                  <p className="mt-1 text-xs font-semibold text-gray-700">
                    #{inv.id}
                  </p>

                </div>

              </div>


              {/* Mobile actions */}
              <div
                className="
                  mt-4
                  grid grid-cols-2
                  gap-2
                  sm:grid-cols-4
                "
              >

                {/* Edit / Send */}
                {inv.status === "Draft" ? (

                  <button
                    className="
                      flex items-center justify-center gap-1.5
                      rounded-lg
                      bg-red-50
                      px-3 py-2
                      text-[11px] font-semibold
                      text-red-600
                      border border-red-200
                    "
                    onClick={() => UpdateInvoiceMailTemplate(inv)}
                  >
                    <SquarePen className="h-3.5 w-3.5" />
                    Edit & Send
                  </button>

                ) : (

                  <button
                    className="
                      flex items-center justify-center gap-1.5
                      rounded-lg
                      bg-blue-50
                      px-3 py-2
                      text-[11px] font-semibold
                      text-blue-700
                      border border-blue-200
                    "
                    onClick={() => UpdateInvoiceMailTemplate(inv)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>

                )}


                {/* Payment */}
                {inv.status !== "Draft" && !inv.PaymentStatus ? (

                  <button
                    className="
                      flex items-center justify-center gap-1
                      rounded-lg
                      bg-teal-800
                      px-3 py-2
                      text-[11px] font-semibold
                      text-white
                      hover:bg-teal-900
                    "
                    onClick={() => {
                      SetPaymentInformation(inv);
                      setOpenPaymentMethods(true);
                    }}
                  >
                    Record Payment
                  </button>

                ) : (

                  <div
                    className="
                      flex items-center justify-center
                      rounded-lg
                      bg-gray-50
                      px-3 py-2
                      text-[11px] font-medium
                      text-gray-500
                      border border-gray-200
                    "
                  >
                    {inv.PaymentStatus ? "Payment Received" : "Draft"}
                  </div>

                )}


                {/* History */}
                <button
                  className="
                    flex items-center justify-center gap-1.5
                    rounded-lg
                    border border-gray-200
                    bg-white
                    px-3 py-2
                    text-[11px] font-semibold
                    text-gray-700
                    hover:bg-gray-50
                  "
                  onClick={() => {
                    setOpenTransactions(true);
                    setinvoiceTransactionData(inv);
                  }}
                >
                  <PrinterCheck className="h-3.5 w-3.5 text-teal-700" />
                  History
                </button>


                {/* Download */}
                {inv.status !== "Draft" ? (

                  <button
                    className="
                      flex items-center justify-center gap-1.5
                      rounded-lg
                      border border-gray-200
                      bg-white
                      px-3 py-2
                      text-[11px] font-semibold
                      text-gray-700
                      hover:bg-gray-50
                    "
                    onClick={() => DownloadInvoice(inv)}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>

                ) : (

                  <div
                    className="
                      flex items-center justify-center gap-1.5
                      rounded-lg
                      border border-gray-200
                      bg-gray-50
                      px-3 py-2
                      text-[11px]
                      text-gray-400
                    "
                  >
                    <Loader className="h-3.5 w-3.5" />
                    Download
                  </div>

                )}

              </div>

            </div>


            {/* =====================================================
                DESKTOP TABLE ROW
            ===================================================== */}
            <div
              className="
                hidden lg:grid
             grid-cols-[45px_140px_1.1fr_1.1fr_100px_85px_95px_75px_75px_80px_120px_55px_110px_60px_70px_70px]
                items-center gap-2
                px-3 py-3
                text-xs
                hover:bg-[#f7f9fd]
              "
            >

              {/* S No */}
              <div className="font-medium text-gray-600">
                {index + 1}
              </div>
{/* Invoice Number */}
{/* Invoice Number */}
<div className="min-w-0 w-full">
  <span
    className="
      block
      whitespace-nowrap
      text-left
      text-[10px]
      font-semibold
      text-teal-700
    "
  >
    {(() => {
      const invoice =
        inv.Invoice ||
        inv.InvoiceNumber ||
        inv.number ||
        inv.id ||
        "-";

      const invoiceString = String(invoice);

      return invoiceString.startsWith("#")
        ? invoiceString
        : `#${invoiceString}`;
    })()}
  </span>
</div>

              {/* Client */}
              {/* Client */}
<div className="min-w-0">
  <span
    className="
      block
      whitespace-normal
      break-words
      leading-4
      text-[11px]
      font-semibold
      text-gray-800
    "
    title={inv.ClientName || "-"}
  >
    {inv.ClientName || "-"}
  </span>
</div>

{/* Patient */}
<div className="min-w-0">
  <span
    className="
      block
      whitespace-normal
      break-words
      leading-4
      text-[11px]
      font-semibold
      text-gray-800
    "
    title={inv.name || "-"}
  >
    {inv.name || "-"}
  </span>
</div>


              {/* Contact */}
              <div className="truncate text-[11px] text-gray-600">
                {inv.contact || "-"}
              </div>


              {/* Status */}
              <div>

                <span
                  className={`
                    inline-flex items-center gap-1
                    rounded-full
                    px-2 py-1
                    text-[10px] font-medium
                    ${statusStyles[inv.status]}
                  `}
                >
                  {inv.status === "Sent" ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}

                  {inv.status}
                </span>

              </div>


              {/* Due Date */}
              <div>

                {inv.PaymentStatus ? (

                  <span
                    className="
                      inline-flex
                      rounded-full
                      border border-green-300
                      bg-green-50
                      px-2 py-1
                      text-[10px] font-medium
                      text-green-600
                    "
                  >
                    Paid
                  </span>

                ) : dueInfo.status === "overdue" ? (

                  <span
                    className="
                      inline-flex
                      rounded-full
                      border border-red-300
                      bg-red-50
                      px-2 py-1
                      text-[10px] font-medium
                      text-red-600
                    "
                  >
                    Overdue
                  </span>

                ) : (

                  <span className="text-[10px] text-gray-700">
                    {dueInfo.label}
                  </span>

                )}

              </div>


              {/* Total */}
              <div className="font-medium text-gray-700">
                ₹{inv.status === "Draft"?Number(total):Number(inv.RoundedTotal)}
              </div>


              {/* Advance */}
              <div className="font-medium text-blue-700">
                ₹{Number(inv.AdvanceReceived || 0)}
              </div>


              {/* Balance */}
              <div className="font-semibold text-red-600">
                ₹{inv.status === "Draft"?Number(total) - Number(inv.AdvanceReceived || 0):Math.round(Number(inv.balanceDue))}
              </div>


              {/* Actions */}
              <div>

                {inv.status === "Draft" ? (

                  <button
                    className="
                      flex items-center gap-1
                      rounded-md
                      px-2 py-1
                      text-[10px] font-medium
                      text-red-500
                      hover:bg-red-50
                    "
                    onClick={() => UpdateInvoiceMailTemplate(inv)}
                  >
                    <SquarePen className="h-3.5 w-3.5" />
                    Edit & Send
                  </button>

                ) : (

                  <span className="flex items-end justify-center gap-1 text-[10px] font-medium text-green-700">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Sent
                  </span>

                )}

              </div>


              {/* Edit */}
              <div className="flex justify-center">

                {inv.status === "Draft" ? (

                  <div className="group relative">

                    <PencilOff
                      size={15}
                      className="text-gray-400"
                    />

                    <span
                      className="
                        absolute
                        bottom-full
                        left-1/2
                        z-50
                        mb-2
                        hidden
                        -translate-x-1/2
                        whitespace-nowrap
                        rounded
                        bg-gray-800
                        px-2 py-1
                        text-[10px]
                        text-white
                        group-hover:block
                      "
                    >
                      Send invoice before editing
                    </span>

                  </div>

                ) : (

                  <Pencil
                    className="h-4 w-4 cursor-pointer text-gray-700 hover:text-teal-700"
                    onClick={() => UpdateInvoiceMailTemplate(inv)}
                  />

                )}

              </div>


              {/* Payment */}
              <div>

                {inv.status !== "Draft" ? (

                  <div
                    className={`
                      flex items-center justify-between gap-2
                      rounded-md
                      border
                      px-2 py-1
                      text-[9px] font-medium
                      ${
                        inv.PaymentStatus
                          ? "border-green-400 bg-green-50 text-green-600"
                          : "border-red-400 bg-red-50 text-red-600"
                      }
                    `}
                  >

                    <span>
                      {inv.PaymentStatus ? "Received" : "Due"}
                    </span>

                    {!inv.PaymentStatus && (

                      <button
                        className="
                          rounded-full
                          bg-teal-800
                          px-2 py-1
                          text-[8px]
                          leading-tight
                          text-white
                          hover:bg-teal-900
                        "
                        onClick={() => {
                          SetPaymentInformation(inv);
                          setOpenPaymentMethods(true);
                        }}
                      >
                        Record
                      </button>

                    )}

                  </div>

                ) : (

                 <div className="group relative flex justify-center">

  <Info
    size={17}
    className="cursor-help text-gray-500"
  />

  <span
    className="
      absolute
      left-1/2
      top-1/2
      ml-2
      -translate-y-1/2
      z-50
      hidden
      whitespace-nowrap
      rounded
      bg-gray-800
      px-2 py-1
      text-[10px]
      text-white
      group-hover:block
    "
  >
    Complete invoice sending to update status
  </span>

</div>

                )}

              </div>


              {/* Team */}
              <div className="flex justify-center">

                <span
                  className="
                    inline-flex
                    rounded-full
                    bg-pink-100
                    px-2 py-1
                    text-[9px] font-bold
                    text-pink-700
                  "
                >
                  {inv.Team || "-"}
                </span>

              </div>


              {/* History */}
              <div className="flex justify-center">

                <PrinterCheck
                  size={17}
                  className="cursor-pointer text-teal-700 hover:text-teal-900"
                  onClick={() => {
                    setOpenTransactions(true);
                    setinvoiceTransactionData(inv);
                  }}
                />

              </div>


        

             {inv.status !== "Draft" ? (
  <div className="flex items-center justify-center">
    <Download
      size={17}
      className="cursor-pointer text-gray-700 hover:text-teal-700"
      onClick={() => DownloadInvoice(inv)}
    />
  </div>
) : (
  <div className="group relative flex items-center justify-center">
    <Loader className="h-4 w-4 text-red-600" />

    <span
      className="
        absolute
        bottom-full
        left-1/2
        z-50
        mb-2
        hidden
        -translate-x-1/2
        whitespace-nowrap
        rounded
        bg-black
        px-2 py-1
        text-[10px]
        text-white
        group-hover:block
      "
    >
      Send invoice before downloading
    </span>
  </div>
)}


            </div>

          </div>
        );
      })}

    </div>

  </div>
) : (
  <EmptyState
    title="No Invoices Found"
    description="No invoice records match the selected filters. Try changing or clearing your filters."
  />
)}


  </div>
</div>



          {/* <div className="flex justify-between items-center mt-5 text-xs text-gray-600">
            <span>Page {page} of {totalPages}</span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div> */}
        </div> :
        <div id="invoice-pdf-area">
          <ReusableInvoice
            invoice={invoiceProps?.invoice}
            billTo={invoiceProps.billTo}
            items={invoiceProps.items}
            totals={invoiceProps.totals}
          />
        </div>}
    </div>
  );

}

function SummaryCard({
  label,
  value,
  subtleLabel,
  borderColor,
}: {
  label: string;
  value: number;
  subtleLabel: string;
  borderColor: string;
}) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 px-3 py-2 shadow-sm flex items-center"
      style={{ minHeight: "60px" }}
    >


      <div className="flex items-center gap-2 w-full">

        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{
            backgroundColor: borderColor + "22",
            color: borderColor,
            fontWeight: "bold",
            fontSize: "10px",
          }}
        >
          ●
        </div>


        <div className="flex flex-col leading-tight">
          <span className="text-[10px] text-gray-500">{label}</span>

          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: borderColor }}
          >
            {value}
          </span>

          <span className="text-[10px] text-gray-400">{subtleLabel}</span>
        </div>
      </div>
    </div>
  );
}
