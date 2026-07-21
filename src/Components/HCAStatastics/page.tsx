"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
  Landmark,
  CreditCard,
} from "lucide-react";
import axios from "axios";

interface Transaction {
  title: string;
  amount: number;
  type: "credit" | "debit";
  description?: string;
}

interface PaymentSummary {
  month: string;
  total: number;
  finalAmount: number;
  paid: boolean;
  bank?: string;
  transactionNumber?: string;
  paymentMode?: string;
  paymentDate?: string;
}

interface PaymentPassbookProps {
  summary: PaymentSummary;
  transactions: Transaction[];
}


type PaymentHistory = {
  Bank: string;
  CreatedAt: string;
  Month: string;
  NeftTransactionNumber: string;
  Other: number;
  advance: number;
  amount: number;
  hostelFee: number;
  incentive: number;
 neft: string;
  others: number;
  reject: number;
  revert: number;
  total: number;
};

type Props = {
  PAYMENT_HISTORY: PaymentHistory[];
  HCAName:any
};
export default function PaymentPassbook({ PAYMENT_HISTORY ,HCAName }: Props) {

  const [monthDate, setMonthDate] = useState<Date>(() => new Date());
const [ActionMessage,setActionMessage]=useState("")
  const built:any = PAYMENT_HISTORY?.map((p:any) => {
    const monthStr = p.Month; 
    const monthParts = monthStr.split("-");
    const monthNum = Number(monthParts[1]) - 1;
    const yearNum = Number(monthParts[0]);
    const monthDateObj = new Date(yearNum, monthNum);
    const TotalHcpPayment=Number(p.TotalHcaPayment)
    const transactions: Transaction[] = [];
    if (p.total && p.total > 0) transactions.push({ title: "Total", amount: p.total, type: "credit", description: "Primary payment total" });
    if (TotalHcpPayment) transactions.push({ title: "TDS", amount: TotalHcpPayment*1/100, type: "debit", description: "TDS" });
    if (p.advance && p.advance > 0) transactions.push({ title: "Advance", amount: p.advance, type: "debit", description: "Advance deduction" });
    if (p.hostelFee && p.hostelFee > 0) transactions.push({ title: "Hostel Fee", amount: p.hostelFee, type: "debit", description: "Hostel fee deduction" });
    if (p.Other && p.Other > 0) transactions.push({ title: "Other", amount: p.Other, type: "debit", description: "Other deduction" });
    if (p.others && p.others > 0) transactions.push({ title: "Others", amount: p.others, type: "credit", description: "Other credit addition" });
    if (p.incentive && p.incentive > 0) transactions.push({ title: "Incentive", amount: p.incentive, type: "credit", description: "Incentive credit" });

    const totalCredit = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDebit = transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const summary: PaymentSummary = {
      month: monthDateObj.toDateString(),
      total: p.total,
      finalAmount: totalCredit - totalDebit,
      paid: totalCredit - totalDebit > 0,
      bank: p.Bank,
      transactionNumber: p.NeftTransactionNumber,
      paymentMode: p.neft ? "NEFT" : "Bank Transfer",
      paymentDate: p.CreatedAt,
    };

    
    return { summary, transactions, monthDate: monthDateObj, TotalHcpPayment };
  });



const current = built?.find(
  (item:any) =>
    item.monthDate.getFullYear() === monthDate.getFullYear() &&
    item.monthDate.getMonth() === monthDate.getMonth()
);
  const transactions = current?.transactions ?? [];

const summary =
  current?.summary ?? {
    month: monthDate.toDateString(),
    total: 0,
    finalAmount: 0,
    paid: false,
    bank: "",
    transactionNumber: "",
    paymentMode: "",
    paymentDate: "",
  };
console.log("Check For Current------",current)
  const totalCredit = transactions
    .filter((t:any) => t.type === "credit")
    .reduce((sum:any, t:any) => sum + t.amount, 0);
      const totalPerformanceCredit = transactions
    .filter((t:any) => t.type === "credit"&&t.title
!=="Total")
    .reduce((sum:any, t:any) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t:any) => t.type === "debit")
    .reduce((sum:any, t:any) => sum + t.amount, 0);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const parseMonthYear = (monthString: string) => {
    const parsed = new Date(monthString);
    if (!Number.isNaN(parsed.getTime())) {
      return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    }

    const [name, year] = monthString.split(" ");
    const month = monthNames.indexOf(name);
    if (month >= 0 && year && !Number.isNaN(Number(year))) {
      return new Date(Number(year), month, 1);
    }

    return new Date();
  };




const handlePrevMonth = () =>
  setMonthDate(
    (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
  );

const handleNextMonth = () =>
  setMonthDate(
    (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
  );

  const formatMonthYear = (date: Date) =>
    date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const periodLabel = summary.month ? formatMonthYear(monthDate) : "All-time";

  const formatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

   const downloadPDF = async () => {
     try {
      setActionMessage("Please Wait Downloading Salary Slip.......")
       const element = document.getElementById("ComplitePaySlip");
 
       if (!element) {
         throw new Error("Transaction history HTML not found");
       }
 
       const { default: html2pdf } = await import("html2pdf.js");
 
      const options: any = {
        margin: 5,
      
      pagebreak: {
  mode: ["css", "legacy"],
},
        filename: `${HCAName}-SalarySlip.pdf`,
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      } as any;

      await html2pdf().from(element).set(options).save();
      setActionMessage("DownLoaded Salary Slip")
     } catch (error: any) {
       console.error("Download PDF Error:", error);
 
       alert(
         error?.message ||
           "Failed to download transaction history."
       );
     }
   };
   
     const handleShare = async () => {
    try {
    

      const element = document.getElementById(
        "ComplitePaySlip"
      );

      if (!element) {
        throw new Error("Transaction history HTML not found");
      }
setActionMessage("Sending Salary Slip via Email...");
      const { default: html2pdf } = await import("html2pdf.js");

      const pdfBlob: Blob = await html2pdf()
        .from(element)
        .set({
          margin: 10,

          filename: `${HCAName}-Salary Slip.pdf`,

          html2canvas: {
            scale: 3,
            useCORS: true,
            allowTaint: false,
            logging: false,
            backgroundColor: "#ffffff",
          },

          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .outputPdf("blob");

      const base64 = await new Promise<string>(
        (resolve, reject) => {
          const reader = new FileReader();

          reader.readAsDataURL(pdfBlob);

          reader.onloadend = () => {
            if (reader.result) {
              resolve(reader.result as string);
            } else {
              reject(
                new Error(
                  "Failed to convert PDF to Base64"
                )
              );
            }
          };

          reader.onerror = () => {
            reject(new Error("FileReader error"));
          };
        }
      );

      const mailResponse = await axios.post(
        "/api/MailSend",
        {
          to: "srinivasnew0803@gmail.com",

      subject: `Salary Slip - ${HCAName} (${periodLabel})`,

 html: `
<div style="
  margin:0;
  padding:32px 16px;
  background:#f5f7fa;
  font-family:Arial,Helvetica,sans-serif;
">
  <div style="
    max-width:620px;
    margin:auto;
    background:#ffffff;
    border:1px solid #e5e7eb;
    border-radius:14px;
    overflow:hidden;
  ">

    <!-- Logo -->
    <div style="padding:28px 32px 0;">
      <img
        src="https://www.curatehealthservices.com/Icons/Curate-logoq.png"
        alt="Curate Health Services"
        style="width:80px;height:auto;"
      />
    </div>

    <div style="padding:28px 32px 36px;">

      <div style="
        display:inline-block;
        padding:7px 14px;
        background:#eef8fd;
        color:#1392d3;
        font-size:12px;
        font-weight:700;
        border-radius:6px;
        margin-bottom:18px;
      ">
        HCP SALARY SLIP
      </div>

      <h2 style="
        margin:0 0 20px;
        color:#1f2937;
        font-size:26px;
      ">
        Salary Slip Generated
      </h2>

      <p style="
        color:#374151;
        font-size:15px;
        line-height:1.7;
      ">
        Dear Management,
      </p>

      <p style="
        color:#6b7280;
        font-size:15px;
        line-height:1.8;
      ">
        Please find the attached salary slip generated for the following Healthcare Professional.
      </p>

      <table style="
        width:100%;
        border-collapse:collapse;
        margin:24px 0;
        font-size:14px;
      ">
        <tr>
          <td style="padding:10px 0;color:#6b7280;width:180px;">
            HCP Name
          </td>
          <td style="font-weight:600;color:#111827;">
            ${HCAName}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Salary Month
          </td>
          <td style="font-weight:600;color:#111827;">
            ${periodLabel}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Generated On
          </td>
          <td style="font-weight:600;color:#111827;">
            ${new Date().toLocaleString("en-IN")}
          </td>
        </tr>
      </table>

      <div style="
        background:#f8fafc;
        border:1px solid #e5e7eb;
        border-left:4px solid #1392d3;
        border-radius:8px;
        padding:18px;
        margin-bottom:24px;
      ">
        <div style="
          font-size:14px;
          color:#1f2937;
          font-weight:700;
          margin-bottom:6px;
        ">
          📄 Attached File
        </div>

        <div style="
          font-size:13px;
          color:#6b7280;
        ">
          ${HCAName}-SalarySlip.pdf
        </div>
      </div>

      <p style="
        color:#6b7280;
        font-size:14px;
        line-height:1.8;
      ">
        This salary slip has been generated from the Curate Health Services payroll system and is attached for management review and record purposes.
      </p>

    </div>

    <div style="
      background:#f8fafc;
      border-top:1px solid #e5e7eb;
      padding:22px 32px;
    ">
      <p style="
        margin:0 0 6px;
        color:#374151;
        font-size:14px;
      ">
        Regards,
      </p>

      <p style="
        margin:0;
        color:#1392d3;
        font-weight:700;
        font-size:15px;
      ">
        Curate Health Services<br>
        Payroll Management System
      </p>
    </div>

  </div>
</div>
`,
          pdfBase64: base64.split(",")[1],

          pdfFileName:
            `${HCAName}-Transaction-History.pdf`,
        }
      );

      console.log(
        "Mail Response:",
        mailResponse?.data
      );
setActionMessage("Sent Email as Successfully")
     
    } catch (error: any) {
      console.error(
        "Send Transaction History Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send transaction history."
      );
    } 
  };
  

  return (
    <div>
      {ActionMessage&&
  <div className="my-4 rounded-xl border border-green-200 bg-green-50 px-5 py-4 shadow-sm">
  <p className="text-sm font-medium text-green-800">
    {ActionMessage}
  </p>
</div>}
  
    <div className="max-w-6xl mx-auto space-y-3 px-4 py-4" id="ComplitePaySlip" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
      <div className="overflow-hidden rounded-[28px] border border-[#e2e8f0] bg-[#ffffff]" style={{ borderColor: '#e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
        {/* Modern Header */}
        <div className="px-6 py-6 text-[#ffffff]" style={{ backgroundColor: '#1392d3', color: '#ffffff' }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
              <div className="rounded-xl bg-[#ffffff] p-3 flex items-center justify-center w-20 h-20" style={{ backgroundColor: 'rgba(255,255,255,.80)' }}>
                    <img
            src="/Icons/Curate-logoq.png"
            alt="Company Logo"
            className="h-12 w-12 object-contain"
          />
              </div>
              <div>
<p className="text-xs uppercase tracking-[0.18em] text-[#f1f5f9]" style={{ color: 'rgba(241,245,249,.90)' }}>Career Passbook</p>
                <h1 className="mt-1 text-2xl sm:text-2xl font-semibold tracking-tight" style={{ color: '#ffffff' }}>{HCAName}  Payment Info</h1>
                <div className="mt-3 flex items-center gap-2 text-sm text-[#f1f5f9]" style={{ color: '#f1f5f9' }}>
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={handlePrevMonth}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ffffff] transition hover:bg-[#ffffff]"
                    style={{ backgroundColor: 'rgba(255,255,255,.10)', color: 'rgba(255,255,255,.90)' }}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <span className="font-medium" style={{ color: '#ffffff' }}>{periodLabel}</span>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={handleNextMonth}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ffffff] transition hover:bg-[#ffffff]"
                    style={{ backgroundColor: 'rgba(255,255,255,.10)', color: 'rgba(255,255,255,.90)' }}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <div className="rounded-2xl bg-[#ffffff] px-2 py-2 text-xs text-center text-[#ffffff]" style={{ backgroundColor: 'rgba(255,255,255,.08)', color: '#ffffff' }}>
                {summary.bank ?? "Bank Unavailable"}
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl px-2 py-2 text-sm font-semibold" style={{ backgroundColor: summary.paid ? 'rgba(16,185,129,.20)' : 'rgba(251,191,36,.20)', color: summary.paid ? '#ecfdf5' : '#fffbeb' }}>
                {summary.paid ? <CheckCircle2 size={18} className="text-[#ecfdf5]" style={{ color: '#ecfdf5' }} /> : <Clock3 size={18} className="text-[#fffbeb]" style={{ color: '#fffbeb' }} />}
                {summary.paid ? "Paid" : "Pending"}
              </div>
        <div className="flex overflow-hidden rounded-2xl bg-[#ffffff]" style={{ backgroundColor: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}>

  <button
    type="button"
    onClick={downloadPDF}
    className="flex items-center gap-2 border-r border-[#e2e8f0] px-5 py-3 text-[#334155] hover:bg-[#f8fafc] transition"
    style={{ borderColor: '#e2e8f0', color: '#334155', backgroundColor: '#ffffff' }}
  >
    <ArrowDownCircle size={18} />
    <span className="text-sm font-semibold">Download</span>
  </button>

  <button
    type="button"
    onClick={handleShare}
    className="flex items-center gap-2 px-5 py-3 text-[#334155] hover:bg-[#f8fafc] transition"
    style={{ color: '#334155', backgroundColor: '#ffffff' }}
  >
    <ArrowUpCircle size={18} />
    <span className="text-sm font-semibold">Share</span>
  </button>

</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-b border-[#e2e8f0] px-6 py-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Gross Amount"   value={current?.TotalHcpPayment ?? 0} color="#0f172a" formatter={formatter} />
          <Card title="Performance" value={totalPerformanceCredit} color="#047857" formatter={formatter} />
          <Card title="Deduction (Includeing TDS)" value={totalDebit} color="#e11d48" formatter={formatter} />
          <Card title="NetPay" value={summary.total} color="#0f172a" formatter={formatter} />
        </div>

        <div className="border-b border-[#e2e8f0] px-6 py-5">
          <h2 className="text-xl font-semibold text-[#0f172a]">Transaction History</h2>
          <p className="mt-1 text-sm text-[#64748b]">Complete career transaction history for the HCP.</p>
        </div>

        <div className="px-4 py-4">
          <div className="hidden md:flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-3 text-sm uppercase tracking-[0.12em] text-[#64748b]">
  <span>Description</span>
  <span>Amount</span>
</div>

          {transactions.length === 0 ? (
            <div className="px-6 py-10 text-center text-[#64748b]">No transactions found for this period.</div>
          ) : (
            <div className="space-y-1">
              {transactions.map((item:any, index:any) => (
                <div
  key={index}
className={`flex flex-col gap-2 rounded-xl border border-[#e2e8f0] p-4 ${
  index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#f8fafc]"
} md:grid md:grid-cols-[1fr_auto]`}
>
                  <div>
                   <span className="font-medium text-[#0f172a]">{item.title}</span>
                    {item.description ? <div className={`mt-1 text-sm ${item.type === "credit" ? "text-[#059669]" : "text-[#e11d48]"}`}>{item.description} {item.type === "credit" ? "+" : "-"}</div> : null}
                  </div>

                  <div className={`md:text-right font-semibold ${item.type === "credit" ? "text-[#059669]" : "text-[#e11d48]"}`}>₹{formatter.format(item.amount)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 bg-[#f1f5f9] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[#64748b]">Net balance after transactions</p>
            <p className="mt-1 text-2xl font-semibold text-[#0f172a]">₹{formatter.format(summary.total)}</p>
          </div>
          <div className="rounded-2xl bg-[#ffffff] p-4" style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
            <p className="text-xs uppercase tracking-[0.2em] text-[#94a3b8]">Statement generated</p>
            <p className="mt-1 text-sm text-[#334155]">{periodLabel}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#e2e8f0] bg-[#ffffff]" style={{ boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
        <div className="border-b border-[#e2e8f0] px-6 py-5">
          <h2 className="text-xl font-semibold text-[#0f172a]">Payment Information</h2>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <Info icon={<CreditCard size={18} />} label="Payment Mode" value={summary.paymentMode ?? "N/A"} />
          <Info icon={<Landmark size={18} />} label="Bank" value={summary.bank ?? "N/A"} />
          <Info icon={<CreditCard size={18} />} label="Transaction No" value={summary.transactionNumber ?? "N/A"} />
          <Info icon={summary.paid ? <CheckCircle2 size={18} className="text-[#059669]" /> : <XCircle size={18} className="text-[#f43f5e]"  />} label="Status" value={summary.paid ? "Paid" : "Pending"} />
          {summary.paymentDate ? <Info icon={<Clock3 size={18} />} label="Payment Date" value={summary.paymentDate} /> : null}
        </div>
      </div>
    </div>
      </div>
  );
}

/* ----------------------- Helper Components ---------------------- */

function Card({
  title,
  value,
  color,
  formatter,
}: {
  title: string;
  value: number;
  color: string;
  formatter: Intl.NumberFormat;
}) {
  return (
<div className="rounded-xl bg-[#f8fafc] border border-[#e2e8f0] p-5 text-center">

<p className="text-sm text-[#64748b]">
        {title}
      </p>
<h3
  className="mt-2 text-2xl font-bold"
  style={{ color }}
>
        ₹
        {formatter.format(value)}
      </h3>

    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">

   
<div className="flex items-center gap-2 text-[#475569]">
        {icon}
        <span>{label}</span>
      </div>
<span className="font-semibold text-[#1e293b]">
        {value}
      </span>

    </div>
  );
}