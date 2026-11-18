"use client";

import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CircleX } from "lucide-react";
import axios from "axios";
import { GetFulladress } from "@/Lib/Actions";
import { useSelector } from "react-redux";

interface TransactionItem {
  paymentType: string;
  amount: string | number;
  paymentMethod: string;
  transactionId: string;
  receipt?: string;
  PaymentDate: string;
}

interface PassbookProps {
  open: boolean;
  onClose: () => void;
  data: {
    ClienId: any;
    StartDate: any;
    name: any;
    Invoice: string;
    ClientName: string;
    Patient: string;
    contact: string;
    Adress: string;
    ServiceStartDate: string;
    ServiceEndDate: string;
    RoundedTotal: number;
    balanceDue: number;
    Trasaction: TransactionItem[];
    ComplteTransactionData:any
  };
}

export default function PassbookPopup({
  open,
  onClose,
  data,
}: PassbookProps) {
  const pdfRef = useRef<HTMLDivElement>(null);
const [ActionMessage, setActionMessage] = useState("");
  const [TransactionView, setTransactionView] = useState(true);
  const [isSending, setIsSending] = useState(false);
const RegUserInfo=useSelector((state:any)=>state.AdminUsers)
  useEffect(() => {
    if (open) {
      setTransactionView(true);
    }
  }, [open]);


console.log("Task Data------",data)

  if (!open) return null;



  const downloadPDF = async () => {
    try {
      const element = document.getElementById("transaction-pdf-area");

      if (!element) {
        throw new Error("Transaction history HTML not found");
      }
setActionMessage("Please Wait......")
      const { default: html2pdf } = await import("html2pdf.js");

      await html2pdf()
        .from(element)
        .set({
          margin: 10,
          filename: `${data.ClientName}- Payment history.pdf`,

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
        })
        .save();

        setActionMessage("Downloaded Sucessfully")
    } catch (error: any) {
      console.error("Download PDF Error:", error);

      alert(
        error?.message ||
          "Failed to download transaction history."
      );
    }
  };


const monthlyData: any[] = Array.isArray(
  data?.ComplteTransactionData?.CompliteClientTransactionInfo
)
  ? data.ComplteTransactionData.CompliteClientTransactionInfo
  : [];

const financialSummary = monthlyData.reduce(
  (summary: any, month: any) => {

    if (!month || typeof month !== "object") {
      return summary;
    }

    const transactions = Array.isArray(month.Trasaction)
      ? month.Trasaction
      : [];

    const charges = Array.isArray(month.additionalCharges)
      ? month.additionalCharges
      : [];

    const refunds = Array.isArray(month.freezeDaysRefund)
      ? month.freezeDaysRefund
      : [];

    const received = transactions.reduce(
      (sum: number, txn: any) =>
        sum + Number(txn?.amount || 0),
      0
    );

    const additionalCharges = charges.reduce(
      (sum: number, item: any) =>
        sum +
        Number(item?.bounceCheque || 0) +
        Number(item?.chequeCollectionCharges || 0) +
        Number(item?.equipmentBedRentMonth || 0) +
        Number(item?.lateFee || 0),
      0
    );

    const freezeRefund = refunds.reduce(
      (sum: number, item: any) =>
        sum + Number(item?.Amount || 0),
      0
    );

    summary.totalInvoices += 1;
    summary.totalInvoiceAmount += Number(month.RoundedTotal || 0);
    summary.totalReceived += received;
    summary.totalAdditionalCharges += additionalCharges;
    summary.totalFreezeRefund += freezeRefund;
    summary.totalBaseDue += Number(month.balanceDue || 0);

    return summary;
  },
  {
    totalInvoices: 0,
    totalInvoiceAmount: 0,
    totalReceived: 0,
    totalAdditionalCharges: 0,
    totalFreezeRefund: 0,
    totalBaseDue: 0,
  }
);


const TotalPayable =
  financialSummary.totalInvoiceAmount +
  financialSummary.totalAdditionalCharges -
  financialSummary.totalFreezeRefund;

const TotalDue =
  financialSummary.totalBaseDue +
  financialSummary.totalAdditionalCharges -
  financialSummary.totalFreezeRefund;

const TotalReceived = financialSummary.totalReceived;


type LedgerEntry = {
  date: string;
  description: string;
  transactionId: string;
  debit: number;
  credit: number;
  sortDate: number;
  balance?: number;
};

const parseLedgerDate = (value: any): number => {
  if (!value) return 0;

  const raw = String(value);
  const dmy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (dmy) {
    return new Date(
      Number(dmy[3]),
      Number(dmy[2]) - 1,
      Number(dmy[1])
    ).getTime();
  }

  const timestamp = new Date(raw).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const formatLedgerDate = (value: any): string => {
  const timestamp = parseLedgerDate(value);
  return timestamp
    ? new Date(timestamp).toLocaleDateString("en-GB")
    : "-";
};

const ledgerEntries: LedgerEntry[] = [];

monthlyData.forEach((month: any) => {
const invoiceDate =
  month.InvoiceDate ||
  month.invoiceDate ||
  month.StartDate ||
  month.startDate ||
  month.Date ||
  month.CreatedAt ||
  month.createdAt ||
  month.SeriviceStartDate ||
  month.MonthDate ||
  month.InvoiceMonth ||
  month.MonthYear ||
  month.Month ||
  null;

  // Monthly invoice: Debit
  const invoiceAmount = Number(month.RoundedTotal || 0);
  if (invoiceAmount > 0) {
    ledgerEntries.push({
      date: formatLedgerDate(invoiceDate),
      description: month.InvoiceDescription || "Monthly Invoice",
      transactionId: "-",
      debit: invoiceAmount,
      credit: 0,
      sortDate: parseLedgerDate(invoiceDate),
    });
  }

  // Client payments: Credit (retain the actual transaction ID)
  const transactions = Array.isArray(month.Trasaction)
    ? month.Trasaction
    : [];

  transactions.forEach((txn: any) => {
    const amount = Number(txn.amount || 0);
    if (amount <= 0) return;

    ledgerEntries.push({
      date: formatLedgerDate(txn.PaymentDate),
      description: `Payment - ${txn.paymentMethod || "Payment"}`,
      transactionId: txn.transactionId || "-",
      debit: 0,
      credit: amount,
      sortDate: parseLedgerDate(txn.PaymentDate),
    });
  });

  // Additional charges: Debit
  const charges = Array.isArray(month.additionalCharges)
    ? month.additionalCharges
    : [];

  charges.forEach((charge: any) => {
    const chargeDate =
      charge.date ||
      charge.Date ||
      charge.createdAt ||
      charge.updatedAt ||
      invoiceDate;

    const chargeTypes = [
      { key: "bounceCheque", label: "Bounce Cheque" },
      { key: "chequeCollectionCharges", label: "Cheque Collection Charges" },
      { key: "equipmentBedRentMonth", label: "Equipment / Bed Rent" },
      { key: "lateFee", label: "Late Fee" },
    ];

    chargeTypes.forEach(({ key, label }) => {
      const amount = Number(charge[key] || 0);
      if (amount <= 0) return;

      ledgerEntries.push({
        date: formatLedgerDate(chargeDate),
        description: label,
        transactionId: "-",
        debit: amount,
        credit: 0,
        sortDate: parseLedgerDate(chargeDate),
      });
    });
  });

  // Freeze-day refunds: Credit
  const refunds = Array.isArray(month.freezeDaysRefund)
    ? month.freezeDaysRefund
    : [];

  refunds.forEach((refund: any) => {
    const refundDate =
      refund.refundDate ||
      refund.RefundDate ||
      refund.updatedAt ||
      refund.fromDate ||
      invoiceDate;

    const amount = Number(refund.Amount || 0);
    if (amount <= 0) return;

    const fromDate = formatLedgerDate(
  refund.fromDate || refund.FromDate
);

const toDate = formatLedgerDate(
  refund.toDate || refund.ToDate
);

const refundDays = Number(refund.RefundDays || 0);

ledgerEntries.push({
  date: formatLedgerDate(refundDate),
  description: `Freeze Days Refund (${refundDays} Days) ${
    fromDate !== "-" && toDate !== "-"
      ? `(${fromDate} - ${toDate})`
      : ""
  }`,
  transactionId: "-",
  debit: 0,
  credit: amount,
  sortDate: parseLedgerDate(refundDate),
});
  });
});

// Stable chronological ordering; original insertion order is retained for same-day items.
ledgerEntries.sort((a, b) => a.sortDate - b.sortDate);

let ledgerRunningBalance = 0;
const finalLedger = ledgerEntries.map((entry) => {
  ledgerRunningBalance += entry.debit - entry.credit;
  return { ...entry, balance: ledgerRunningBalance };
});

const totalDebit = finalLedger.reduce((sum, item) => sum + item.debit, 0);
const totalCredit = finalLedger.reduce((sum, item) => sum + item.credit, 0);
const finalBalance = totalDebit - totalCredit;

console.log("WHOLE CLIENT FINANCIAL SUMMARY", {
  ...financialSummary,
  TotalPayable,
  TotalDue,
  TotalReceived
});

  const sharePDF = async () => {
    try {
      setIsSending(true);

      const element = document.getElementById(
        "transaction-pdf-area"
      );

      if (!element) {
        throw new Error("Transaction history HTML not found");
      }
setActionMessage("Sending Transaction History via Email...");
      const { default: html2pdf } = await import("html2pdf.js");

      const pdfBlob: Blob = await html2pdf()
        .from(element)
        .set({
          margin: 10,

          filename: `${data.ClientName}-Transaction-History.pdf`,

          html2canvas: {
            scale: 4,
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
          to: "info@curatehealth.in",

          subject: `Transaction History - ${data.ClientName}`,

 html: `
  <div style="
    margin: 0;
    padding: 32px 16px;
    background-color: #f5f7fa;
    font-family: Arial, Helvetica, sans-serif;
  ">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e8edf2;
      border-radius: 14px;
      overflow: hidden;
    ">

      <!-- Company Logo -->
      <div style="
        padding: 24px 32px 0;
        text-align: left;
      ">
        <img
         src="https://www.curatehealthservices.com/Icons/Curate-logoq.png"
          alt="Curate Health Services"
          style="
            display: block;
            width: 80px;
            height: auto;
          "
        />
      </div>

      <!-- Email Content -->
      <div style="padding: 28px 32px 36px;">

       

        <h2 style="
          margin: 0 0 24px;
          color: #1f2937;
          font-size: 25px;
          line-height: 1.3;
        ">
           Transaction History
        </h2>

        <p style="
          margin: 0 0 16px;
          color: #374151;
          font-size: 15px;
          line-height: 1.7;
        ">
          Dear <strong>${data.ClientName || "Customer"}</strong>,
        </p>

        <p style="
          margin: 0 0 24px;
          color: #6b7280;
          font-size: 15px;
          line-height: 1.7;
        ">
          Please find your transaction history attached to this email as a PDF document for your reference.
        </p>

        <!-- Attachment Info -->
        <div style="
          padding: 16px 18px;
          margin-bottom: 28px;
          background-color: #f8fafc;
          border: 1px solid #e5e7eb;
          border-left: 4px solid #1392d3;
          border-radius: 8px;
        ">
          <p style="
            margin: 0;
            color: #374151;
            font-size: 14px;
            font-weight: 600;
          ">
            📄 Transaction History.pdf
          </p>

          <p style="
            margin: 5px 0 0;
            color: #9ca3af;
            font-size: 12px;
          ">
            PDF document attached to this email
          </p>
        </div>

        <p style="
          margin: 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.7;
        ">
          If you have any questions regarding your transaction history, please feel free to contact our team.
        </p>

      </div>

      <!-- Footer -->
      <div style="
        padding: 22px 32px;
        background-color: #f8fafc;
        border-top: 1px solid #e8edf2;
      ">
        <p style="
          margin: 0 0 5px;
          color: #374151;
          font-size: 14px;
        ">
          Regards,
        </p>

        <p style="
          margin: 0;
          color: #1392d3;
          font-size: 15px;
          font-weight: 700;
        ">
          Curate Health Services
        </p>
      </div>

    </div>
  </div>
`,

          pdfBase64: base64.split(",")[1],

          fileName:
            `${data.ClientName}-Transaction History.pdf`,
        }
      );


      setActionMessage("Transaction history sent successfully.");
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
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-2 sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

      

        <div className="sticky top-0 z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white p-3 sm:p-4">
         

         <div className="flex w-full flex-wrap items-center justify-between gap-3">

  {/* Action Message - Left Side */}
  <div className="min-w-0 flex-1">
    {ActionMessage && (
      <div className="relative inline-flex max-w-full overflow-hidden rounded-xl border border-[#1392d3]/20 bg-white px-4 py-3 shadow-sm">
        <div className="absolute left-0 top-0 h-full w-1">
          <span
            className={`block h-full ${
              ActionMessage === "Transaction history sent successfully."
                ? "bg-[#50c896]"
                : "bg-[#ff1493]"
            }`}
          />
        </div>

        <p className="pl-1 text-sm font-semibold leading-relaxed text-gray-700">
          {ActionMessage}
        </p>
      </div>
    )}
  </div>

  {/* Action Buttons - Right Side */}
  <div className="flex shrink-0 items-center justify-end gap-2">

    <button
      onClick={sharePDF}
      disabled={isSending}
      className="cursor-pointer whitespace-nowrap rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSending ? "Sending..." : "Share PDF as Email"}
    </button>

    <button
      onClick={downloadPDF}
      className="cursor-pointer whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
    >
      Download PDF
    </button>

    <button
      onClick={onClose}
      className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 transition hover:bg-slate-100"
      title="Close"
    >
      <CircleX
        className="text-gray-800"
        size={20}
      />
    </button>

  </div>

</div>
        </div>



        <div className="min-h-0 flex-1 overflow-y-auto">
        <div
          id="transaction-pdf-area"
          ref={pdfRef}
          className="w-full min-w-0 bg-white p-3 text-black sm:p-6"
        >



          <div className="mb-5 w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

   

            <div className="border-b border-[#f1f5f9] bg-[#007f7d] px-4 py-3 text-[#ffffff]">

              <div className="flex items-center justify-between gap-3">


                <div className="flex items-center gap-2">

                  <div className="rounded-xl bg-[#ffffff] p-1.5 shadow-sm">
                    <img
                      src="/Icons/Curate-logoq.png"
                      alt="Company Logo"
                      className="h-8 w-8 object-contain"
                    />
                  </div>

                  <div>
                    <h2 className="text-base font-bold leading-tight text-[#ffffff]">
                       Payment History
                    </h2>

                    {/* <p className="text-[11px] text-[#cbd5e1]">
                      #{data.Invoice}
                    </p> */}
                  </div>

                </div>


                {/* <div className="rounded-xl bg-[#006d6b] px-3 py-1.5 text-right">

                  <p className="text-[9px] uppercase tracking-[2px] text-[#cbd5e1]">
                    Amount Due
                  </p>

                  <p className="text-base font-bold text-[#ffffff]">
                    ₹{data.balanceDue}
                  </p>

                </div> */}

              </div>
            </div>

         

          <div className="grid grid-cols-1 items-stretch gap-4 bg-white p-3 text-sm sm:p-4 md:grid-cols-2">

  <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">

    <h3 className="mb-2 text-xs uppercase tracking-[2px] text-[#64748b]">
      Client
    </h3>

    <div className="space-y-2">

      <p className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2">
        <span className="text-[#64748b]">
          Name:
        </span>{" "}

        <span className="min-w-0 break-words text-slate-800">
          {data.ClientName}
        </span>
      </p>

      <p className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2">
        <span className="text-[#64748b]">
          Patient:
        </span>{" "}

        <span className="min-w-0 break-words text-slate-800">
          {data.Patient || data.name}
        </span>
      </p>

      <p className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2">
        <span className="text-[#64748b]">
          Phone:
        </span>{" "}

        <span className="min-w-0 break-words text-slate-800">
          {data.contact}
        </span>
      </p>

    </div>
  </div>

  <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">

    <h3 className="mb-2 text-xs uppercase tracking-[2px] text-[#64748b]">
      Billing
    </h3>

    <div className="space-y-2">

      <p className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2">
        <span className="text-[#64748b]">
          Service:
        </span>{" "}

        <span className="min-w-0 break-words text-slate-800">
          {data.StartDate}
          {" - "}
          {data.ServiceEndDate}
        </span>
      </p>

      <p className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2">
        <span className="text-[#64748b]">
          Current Month Total:
        </span>{" "}

        <span className="min-w-0 break-words font-semibold text-emerald-600">
          ₹{data.RoundedTotal}
        </span>
      </p>

      <p className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2">
        <span className="text-[#64748b]">
          Address:
        </span>{" "}

        <span className="min-w-0 break-words text-slate-800">
          {data.Adress || GetFulladress(RegUserInfo, data.ClienId)}
        </span>
      </p>
     







    </div>
  </div>
            </div>
          </div>
      {/* Complete Client Passbook Ledger */}
      <div className="mt-5 w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Transaction Ledger
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Complete debit and credit history across all months
            </p>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            {finalLedger.length} Transactions
          </span>
        </div>
                  
        <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Total Debit</p>
            <p className="mt-1 text-lg font-bold text-red-600">
              ₹{totalDebit.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Total Credit</p>
            <p className="mt-1 text-lg font-bold text-emerald-600">
              ₹{totalCredit.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Closing Balance</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              ₹{finalBalance.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="border-b border-slate-200 p-3 text-left">Date</th>
                <th className="border-b border-slate-200 p-3 text-left">Description</th>
                <th className="border-b border-slate-200 p-3 text-left">Transaction ID</th>
                <th className="border-b border-slate-200 p-3 text-right">Debit (₹)</th>
                <th className="border-b border-slate-200 p-3 text-right">Credit (₹)</th>
                <th className="border-b border-slate-200 p-3 text-right">Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              {finalLedger.map((item, index) => (
                <tr
                  key={`${item.sortDate}-${item.transactionId}-${index}`}
                  className={`border-b border-slate-100 transition hover:bg-teal-50/50 ${index % 2 === 1 ? "bg-slate-50/70" : "bg-white"}`}
                >
                  <td className="whitespace-nowrap p-3 text-slate-600">
                    {item.date}
                  </td>
                  <td className="p-3 font-medium text-slate-800">
                    {item.description}
                  </td>
                  <td className="max-w-[220px] break-all p-3 font-mono text-xs text-slate-500">
                    {item.transactionId || "-"}
                  </td>
                  <td className="whitespace-nowrap p-3 text-right font-semibold text-red-600">
                    {item.debit > 0
                      ? item.debit.toLocaleString("en-IN")
                      : "-"}
                  </td>
                  <td className="whitespace-nowrap p-3 text-right font-semibold text-emerald-600">
                    {item.credit > 0
                      ? item.credit.toLocaleString("en-IN")
                      : "-"}
                  </td>
                  <td className="whitespace-nowrap p-3 text-right font-bold text-slate-800">
                    ₹{Number(item.balance || 0).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
              {finalLedger.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No financial transactions found.
                  </td>
                </tr>
              )}
            </tbody>
            {finalLedger.length > 0 && (
              <tfoot className="bg-slate-100 font-bold">
                <tr>
                  <td colSpan={3} className="p-3 text-slate-700">
                    Closing Summary
                  </td>
                  <td className="whitespace-nowrap p-3 text-right text-red-600">
                    ₹{totalDebit.toLocaleString("en-IN")}
                  </td>
                  <td className="whitespace-nowrap p-3 text-right text-emerald-600">
                    ₹{totalCredit.toLocaleString("en-IN")}
                  </td>
                  <td className="whitespace-nowrap p-3 text-right text-slate-900">
                    ₹{finalBalance.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>



        
  </div>
  </div>
      </div>
    </div>
  );
}