"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Eye, Download, CheckCircle, Clock, Slice, Pencil, SquarePen, EllipsisVertical } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { GetInvoiceInfo, GetSentInvoiceData, UpdateStatusPayment } from "@/Lib/user.action";
import { GeneratePDF, getDaysBetween } from "@/Lib/Actions";
import { LoadingData } from "@/Components/Loading/page";

import { UpdateInvoiceInfo, UpdateInvoiceIntialStatus, UpdateInvoiceStatus } from "@/Redux/action";
import { useDispatch, useSelector } from "react-redux";
import ReusableInvoice from "@/Components/InvioseTemplate/page";
import { useRouter } from "next/navigation";

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

  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [FetchedInfo, setFetchedInfo] = useState<any>([])
  const [isChecking, setisChecking] = useState(true)
  const [isSending, setIsSending] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | InvoiceStatus>("All");
  const [page, setPage] = useState(1);
 const [CurrentPaymentStatus,SetCurrentPaymentStatus]=useState<any>(null)
  const [InvoiceData, setInvoiceData] = useState<any>()
  const [status, setStatus] = useState<any>(null);
  const Router = useRouter()
  const dispatch = useDispatch()
  const pageSize = 4;
const invoiceEditStatus = useSelector((s: any) => s.InvoiceEditStatus);
const ShowMailTemplate=useSelector((A:any)=>A.RevertInvoices)
  useEffect(() => {
    const Fetch = async () => {
      const FetchInvioces = await GetInvoiceInfo();

      setFetchedInfo(FetchInvioces)
      setisChecking(false)
    }

    Fetch()
  }, [status,(ShowMailTemplate)])
  
  const downloadExcel = () => {
    const exportData = paginatedData.map((inv) => {
      const totalAmount =
        getDaysBetween(inv.StartDate, inv.ServiceEndDate) *
        Number(inv.CareTakeCharge.replace("₹", "")) +
        Number(inv.RegistrationFee);

      const balance =
        totalAmount - Number(inv.AdvanceReceived);

      return {
        InvoiceID: inv.id,
        ClientName: inv.ClientName,
        Address: inv.Adress,
        PatientName: inv.name,
        Contact: inv.contact,
        Email: inv.Email,
        Status: inv.status,
        StartDate: inv.StartDate,
        EndDate: inv.ServiceEndDate,
        RegistrationFee: inv.RegistrationFee,
        CareTakerCharge: inv.CareTakeCharge,
        AdvanceReceived: inv.AdvanceReceived,
        TotalAmount: totalAmount,
        Balance: balance,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices Preview");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "Invoice_Preview.xlsx");
  };


  const DownloadInvoice = async (id: any) => {
    try {
      console.log("Test Invoice is ----", id);
      setIsSending(true)
      dispatch(UpdateInvoiceIntialStatus(false))
      const SentInvoices: any = await GetSentInvoiceData();


      const FilteredResult = SentInvoices.insertedId.filter((each: any) => each.number === id);
  
      setInvoiceData(FilteredResult[0]);

      setTimeout(async () => {
        const Result = await GeneratePDF(FilteredResult[0]);
        if (Result?.status === true) {
          setIsSending(false)
        
             dispatch(UpdateInvoiceIntialStatus(true))
        }
      }, 500)


      if (FilteredResult.length === 0) {
        alert("Invoice Not Found");
        return;
      }





    } catch (err: any) {
      console.log("Error", err)
    }
  }

const BalanceDue = FetchedInfo
  ?.filter((each: any) => each?.PaymentStatus === false)
  .map((each: any) => Number(each?.balanceDue) || 0)
  .reduce((total: number, value: number) => total + value, 0);

const BalancePaid = FetchedInfo
  ?.filter((each: any) => each?.PaymentStatus === true)
  .map((each: any) => Number(each?.balanceDue) || 0)
  .reduce((total: number, value: number) => total + value, 0);

const RefundAmount = FetchedInfo
  ?.filter((each: any) => 
    each?.PaymentStatus === true &&
    each?.marginStatus?.type === "Refund"
  )
  .map((each: any) => Number(each?.marginStatus?.amount) || 0)
  .reduce((total: number, value: number) => total + value, 0);


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
  
  const PreviewInfo = FetchedInfo.map((each: any) => {



    return {
      id: each.Invoice||each.number,
      ClientName: each.ClientName||each.patientName,
      Adress: each.Adress,
      name: each.Patient||each.patientName,
      contact: each.contact||each.contact,
      Email: each.Email||each.email,
      status: each.status,
      StartDate: each.DeployDate,
      ServiceEndDate: each.ServiceEndDate,
      RegistrationFee: each.RegistrationFee,
      CareTakeCharge: each.CareTakeChare,
      AdvanceReceived: each.AdvanceReceived||each.AdvancePaid,
      PaymentStatus:each.PaymentStatus


    }

  }
  )
  const statusStyles: any = {
    Draft:
      "bg-[#50c89612] text-[#50c896] border border-[#50c89655]",
    Sent:
      "bg-[#1392d312] text-[#1392d3] border border-[#1392d355]",
    Overdue:
      "bg-[#ff149312] text-[#ff1493] border border-[#ff149355]",
  };
  const computedInvoices = PreviewInfo.map((inv: any) => {
    const dueInfo = getDueStatus(inv.StartDate);

    const newStatus: InvoiceStatus =
      dueInfo.status === "overdue" ? "Overdue" : inv.status;

    return {
      ...inv,
      status: newStatus,
      dueInfo
    };
  });

  const filteredInvoices = useMemo(() => {
    let data = [...computedInvoices];


   if (monthFilter !== "All") {
  data = data.filter((inv) => {
    const iso = convertToISO(inv.StartDate);
    if (!iso) return false;
    const month = new Date(iso).getMonth() + 1;
    return month === Number(monthFilter);
  });
}


    if (yearFilter !== "All") {
      data = data.filter((inv:any) => {
        const d:any = convertToISO(inv.StartDate);

        return d.getFullYear() === Number(yearFilter);
      });
    }

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      data = data.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          x.contact.toLowerCase().includes(q)
      );
    }

    return data;
  }, [computedInvoices, filter, search]);


  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / pageSize)
  );

  const paginatedData = filteredInvoices.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalDraft = computedInvoices.filter((x: any) => x.status === "Draft").length;
  const totalSent = computedInvoices.filter((x: any) => x.status === "Sent").length;
  const totalOverdue = computedInvoices.filter((x: any) => x.status === "Overdue").length;

  const currentYear = new Date().getFullYear();

  const availableYears = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

const UpdatePaymentStatus=async(A:any)=>{
  setStatus("Updating Payment Status...")
try{
const UpdatePayment:any= await UpdateStatusPayment(A)
if(UpdatePayment.success===true){
setStatus("Payment Status Updated Successfully")
}
}catch(err:any){

}
}
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

  const daysLeft = 7 - daysPassed;

  if (daysLeft < 0) {
    return { label: "Overdue", days: daysLeft, status: "overdue" };
  }

  return { label: `${daysLeft} days left`, days: daysLeft, status: "upcoming" };
}

  const UpdateInvoiceMailTemplate = (MainTemplateInfo: any) => {
    console.log("Check Registratio Fee----", MainTemplateInfo)
    dispatch(UpdateInvoiceInfo(MainTemplateInfo))
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
      invoiceName: InvoiceData?.name,
    },

    billTo: {

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
  console.log("Check Regisratio Fee--", invoiceProps)
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


          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0">


            <div className="flex flex-col gap-2">
              <h1
                className="text-2xl md:text-3xl font-semibold tracking-tight"
                style={{ color: "#ff1493" }}
              >
                Invoice Management
              </h1>

              <p className="text-gray-500 text-sm">
                Billing overview for patients & clients
              </p>
            </div>


            <img
              src="https://curate-pearl.vercel.app/Icons/UpdateCurateLogo.png"
              alt="Curate Health Services Logo"
              className="h-16 md:h-24 w-auto object-contain mx-auto md:mx-0"
            />
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

  <div className="flex items-center gap-2 bg-green-50 border-l-4 border-green-600 text-green-700 p-2 rounded w-full md:w-auto">
    <p className="text-xs font-semibold whitespace-nowrap">✔ Total Received</p>
    <h3 className="text-sm md:text-base font-bold">₹{  BalancePaid}/-</h3>
  </div>


  <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-600 text-red-700 p-2 rounded w-full md:w-auto">
    <p className="text-xs font-semibold whitespace-nowrap">⚠ Pending Amount</p>
    <h3 className="text-sm md:text-base font-bold">₹{BalanceDue}/-</h3>
  </div>

  
  <div className="flex items-center gap-2 bg-yellow-50 border-l-4 border-yellow-600 text-yellow-700 p-2 rounded w-full md:w-auto">
    <p className="text-xs font-semibold whitespace-nowrap">↩ Refund Issued</p>
    <h3 className="text-sm md:text-base font-bold">₹{RefundAmount}/-</h3>
  </div>

</div>



              <div className="flex flex-wrap gap-3 items-center">


                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500">Status</span>
                  {["All", "Draft", "Sent", "Overdue"].map((s) => {
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
                </div>

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

              </div>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryCard label="Total Invoices" value={paginatedData.length} subtleLabel="All statuses" borderColor="#1392d3" />
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
        <p className="text-xs text-gray-500">
          Showing {paginatedData.length} of {filteredInvoices.length} filtered invoices
        </p>
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


      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1392d3] text-white text-xs font-semibold shadow-sm hover:bg-[#117bb1] transition"
        onClick={downloadExcel}
      >
        <Download className="w-4 h-4" />
        Download Invoices
      </button>
    </div>

    <div className="w-full">
      <div
        className="
        grid text-xs font-semibold text-gray-600 bg-[#f9fafc] border-b px-5 py-2 gap-2
        grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-12
        "
      >
        <div>Patient / Client</div>
        <div>Contact</div>
        <div className="hidden sm:block">Status</div>
        <div className="hidden sm:block">Due Date</div>
        <div className="hidden md:block">Total Amount</div>
        <div className="hidden md:block">Advance Paid</div>
        <div className="hidden md:block">Balance</div>
        <div className="hidden lg:block">Remarks</div>
        <div>Actions</div>
        <div>Edit</div>
        <div>Payment Status</div>
        <div>Download</div>
      </div>
    </div>

    {paginatedData.map((inv, i) => {
      const dueInfo = getDueStatus(inv.StartDate);
      const total =
        getDaysBetween(inv.StartDate, inv.ServiceEndDate) *
          Number(String(inv.CareTakeCharge || "0").replace("₹", ""))
 +
        Number(inv.RegistrationFee);

      const balance = Number(total) - Number(inv.AdvanceReceived);

      return (
        <div
          key={inv.id}
          className="
          grid px-4 py-3 border-b text-sm gap-2 hover:bg-[#f7f9fd] transition
          grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-12
          "
        >
          <div className="flex flex-col">
            <span className="font-medium">{inv.name}</span>
            <span className="text-[9px] text-gray-500">Invoice ID: {inv.id}</span>
          </div>

          <div>+91{inv.contact}</div>

          <div className="hidden sm:block">
            <span
              className={
                "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 " +
                statusStyles[inv.status]
              }
            >
              {inv.status === "Sent" ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {inv.status}
            </span>
          </div>
 {inv.PaymentStatus ? <span className="px-3 py-1 rounded-full text-[8px] text-center font-medium  text-green-600 border border-green-300">
                Received with in Due Date
              </span> : 
          <div className="hidden sm:block">
            {dueInfo.status === "overdue" ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 border border-red-300">
                Overdue
              </span>
            ) : (
              <span className="text-gray-700 text-xs">{dueInfo.label}</span>
            )}
          </div>}

          <div className="hidden md:block">₹{total}/-</div>

          <div className="hidden md:block">₹{Number(inv.AdvanceReceived)||0}/-</div>

          <div className="hidden md:block">₹{Number(balance)}/-</div>

          <div className="hidden lg:block">
            <input
              type="text"
              className="border rounded-md w-[100px] text-[13px] pl-2"
              placeholder="Enter Remark..."
            />
          </div>

          <div className="flex items-center">
            {inv.status === "Draft" ? (
              <button
                className="px-2 py-1  rounded-md text-[13px] flex items-center gap-2 text-red-500"
                onClick={() => UpdateInvoiceMailTemplate(inv)}
              >
                <SquarePen className="w-4 h-4" /> Edit & Send
              </button>
            ) : (
              <button className="text-green-700 flex items-center gap-1 text-[13px]">
                <CheckCircle className="w-4 h-4" /> Sent
              </button>
            )}
          </div>

          <div className="flex items-center cursor-pointer">
            <Pencil className="w-4 h-4" onClick={() => EditInvoice(inv.id)} />
          </div>

    <div
  className={`flex px-1 py-1 text-[10px] font-medium border rounded-md w-fit h-fit 
  items-center gap-2 relative 
  ${inv.PaymentStatus
    ? "border-green-400 text-green-600 bg-green-50"
    : "border-red-400 text-red-600 bg-red-50"
  }`}
>
  {inv.PaymentStatus ? "Received" : "Due"}

  {!inv.PaymentStatus && (
    <button
      className="
        transition-all duration-300
        px-3 py-[3px]
        bg-teal-800 text-white text-[10px]
        rounded-full shadow-sm
        cursor-pointer
        hover:bg-teal-900
      "
      onClick={() => UpdatePaymentStatus(inv.id)}
    >
      Update
    </button>
  )}
</div>



          <div className="flex items-center cursor-pointer">
            {inv.status !== "Draft" && (
              <Download onClick={() => DownloadInvoice(inv.id)} />
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>



          <div className="flex justify-between items-center mt-5 text-xs text-gray-600">
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
          </div>
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
