"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Eye, Download, CheckCircle, Clock, Slice } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { GetInvoiceInfo } from "@/Lib/user.action";
import { getDaysBetween } from "@/Lib/Actions";
import { LoadingData } from "@/Components/Loading/page";
import { useRouter } from "next/navigation";
import { UpdateInvoiceInfo } from "@/Redux/action";
import { useDispatch } from "react-redux";

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
  const [isChecking,setisChecking]=useState(true)
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | InvoiceStatus>("All");
  const [page, setPage] = useState(1);
  const Router=useRouter()
  const dispatch=useDispatch()
  const pageSize = 4;

  useEffect(() => {
    const Fetch = async () => {
      const FetchInvioces = await GetInvoiceInfo();
      console.log('Invoise List-----', FetchInvioces)
      setFetchedInfo(FetchInvioces)
      setisChecking(false)
    }

    Fetch()
  }, [])
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




  const PreviewInfo = FetchedInfo.map((each: any) => {



    return {
      id: each.Invoice,
      ClientName: each.ClientName,
      Adress: each.Adress,
      name: each.Patient,
      contact: each.contact,
      Email: each.Email,
      status: each.status,
      StartDate: each.DeployDate,
      ServiceEndDate: each.ServiceEndDate,
      RegistrationFee: each.RegistrationFee,
      CareTakeCharge: each.CareTakeChare,
      AdvanceReceived: each.AdvanceReceived
    }

  }
  )
  const statusStyles:any = {
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
        const month = new Date(convertToISO(inv.StartDate)).getMonth() + 1;
        return month === Number(monthFilter);
      });
    }

    if (yearFilter !== "All") {
      data = data.filter((inv) => {
        const d = new Date(convertToISO(inv.StartDate));
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


  const resetToFirstPage = () => setPage(1);
  function convertToISO(dateString: string) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }


  function getDueStatus(placementDate: any) {
    const today = new Date();
    const FormatedDate = convertToISO(placementDate)
    const placed = new Date(FormatedDate);

    today.setHours(0, 0, 0, 0);
    placed.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - placed.getTime();
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 7 day window
    const daysLeft = 7 - daysPassed;

    if (daysLeft < 0) {
      return { label: "Overdue", days: daysLeft, status: "overdue" };
    }

    return { label: `${daysLeft} days left`, days: daysLeft, status: "upcoming" };
  }
const UpdateInvoiceMailTemplate=(MainTemplateInfo:any)=>{

  dispatch(UpdateInvoiceInfo(MainTemplateInfo))
Router.push("/MailInvoiceTemplate")
}

  if (isChecking) {
    return (
      <LoadingData/>
    );
  }
  return (
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
          <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-800">Invoice list</p>
              <p className="text-xs text-gray-500">
                Showing {paginatedData.length} of {filteredInvoices.length} filtered invoices
              </p>
            </div>

            <button
              className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg bg-[#1392d3] text-white text-xs font-semibold shadow-sm hover:bg-[#117bb1] transition"
              onClick={downloadExcel}
            >
              <Download className="w-4 h-4" />
              Download Invoices
            </button>
          </div>


          <div className="grid grid-cols-9 gap-x-8 text-xs font-semibold text-gray-500 px-5 py-2 border-b bg-[#f9fafc]">
            <div>Patient / Client</div>
            <div>Contact</div>
            <div>Status</div>
            <div>Due date</div>
            <div>Total Amount</div>
            <div>Advance Paid</div>
            <div>Balance</div>
            <div>Remarks</div>
            <div className="text-right pr-4">Actions</div>
          </div>


          {paginatedData.map((inv, i) => {
            const dueInfo = getDueStatus(inv.StartDate);
            return (
              <div
                key={inv.id}
                className="grid grid-cols-9 gap-x-8 px-5 py-3 border-b text-sm hover:bg-[#f7f9fd] transition"
              >

                <div className="flex flex-col">
                  <span className="font-medium">{inv.name}</span>
                  <span className="text-[10px] text-gray-500">Invoice ID: {inv.id}</span>
                </div>


                <div>+91{inv.contact}</div>


                <div>
                  <span
                    className={
                      "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 " +
                      statusStyles[inv.status]
                    }
                  >
                    {inv.status === "Sent" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {inv.status}
                  </span>
                </div>


                <div>
                  {dueInfo.status === "overdue" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#ff149312] text-[#ff1493] border border-[#ff149355]">
                      Overdue
                    </span>
                  ) : (
                    <span className="text-gray-700 text-sm">{dueInfo.label}</span>
                  )}
                </div>

                <div>₹{getDaysBetween(inv.StartDate, inv.ServiceEndDate) * Number(inv.CareTakeCharge.replace("₹", "")) + Number(inv.RegistrationFee)}/-</div>

                <div> ₹{inv.AdvanceReceived}/-</div>

                <div>₹{
                  getDaysBetween(inv.StartDate, inv.ServiceEndDate) *
                  Number(inv.CareTakeCharge.replace("₹", "")) +
                  Number(inv.RegistrationFee) -
                  Number(inv.AdvanceReceived)
                }
                  /-
                </div>


                <div>
                  <input
                    type="text"
                    className="border rounded-md w-[120px] text-[14px] pl-2"
                    placeholder="Enter Remark..."
                  />
                </div>


                <div className="flex justify-end pr-4">
                  {inv.status === "Draft" ? (
                    <button
                      className="px-2 py-1.5 rounded-md text-xs cursor-pointer font-semibold flex items-center gap-2 bg-[#50c896] text-white"
                    onClick={()=>UpdateInvoiceMailTemplate(inv)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth="2">
                        <path d="M16.5 3.5l3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                      Edit & Send
                    </button>
                  ) : (
                    <button
                      className="px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 bg-[#1392d3] text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Sent
                    </button>
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
