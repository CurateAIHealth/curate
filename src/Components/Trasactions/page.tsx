"use client";

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CircleX } from "lucide-react";

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
  };
}

export default function PassbookPopup({
  open,
  onClose,
  data,
}: PassbookProps) {
  const pdfRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const downloadPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${data.Invoice}-Passbook.pdf`);
  };

  const sharePDF = async () => {
    const input = pdfRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    const blob = pdf.output("blob");
    const file = new File([blob], `${data.Invoice}.pdf`, {
      type: "application/pdf",
    });

    if (navigator.share) {
      await navigator.share({
        title: "Transaction Passbook",
        files: [file],
      });
    } else {
      alert("Sharing not supported on this device");
    }
  };

  let runningBalance = data.RoundedTotal;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-auto">

        {/* Header */}
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">
            Transaction History 
          </h2>

          <div className="flex gap-2">
            <button
              onClick={sharePDF}
              className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer"
            >
              Share PDF as Email
            </button>

            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
            >
              Download PDF
            </button>

            <button
              onClick={onClose}
              className="px-1 py-2  text-white rounded-lg cursor-pointer"
            >
              <CircleX className="text-gray-800"size={18}/>
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div ref={pdfRef} className="p-6 bg-white text-black">

          {/* Client Info */}
<div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

  {/* Header */}
  <div className="relative border-b border-slate-100 bg-gradient-to-br from-[#00A9A5] to-[#005f61] px-4 py-3 text-white">

    {/* Decoration */}
    <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/5"></div>

    <div className="relative flex items-center justify-between gap-3">

      {/* Left */}
      <div className="flex items-center gap-2">
        <div className="rounded-xl bg-white p-1.5 shadow-sm">
          <img
            src="/Icons/Curate-logoq.png"
            alt="Company Logo"
            className="h-8 w-8 object-contain"
          />
        </div>

        <div>
          <h2 className="text-base font-bold leading-tight">
            Invoice
          </h2>
          <p className="text-[11px] text-slate-300">
            #{data.Invoice}
          </p>
        </div>
      </div>

      {/* Due */}
      <div className="rounded-xl bg-white/10 px-3 py-1.5 text-right">
        <p className="text-[9px] uppercase tracking-[2px] text-slate-300">
          Amount Due
        </p>
        <p className="text-base font-bold">
          ₹{data.balanceDue}
        </p>
      </div>

    </div>
  </div>

  {/* Content */}
  <div className="grid gap-3 p-3 md:grid-cols-2 text-sm">

    {/* Client */}
    <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="absolute -right-4 -top-4 h-10 w-10 rounded-full bg-slate-200"></div>

      <div className="relative">
        <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
          Client
        </h3>

        <div className="space-y-1.5">
          <p><span className="text-slate-400">Name:</span> <span className="font-medium">{data.ClientName}</span></p>
          <p><span className="text-slate-400">Patient:</span> <span className="font-medium">{data.Patient}</span></p>
          <p><span className="text-slate-400">Phone:</span> <span className="font-medium">{data.contact}</span></p>
        </div>
      </div>
    </div>

    {/* Billing */}
    <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3">
      <div className="absolute bottom-0 right-0 h-12 w-12 rounded-tl-full bg-slate-100"></div>

      <div className="relative">
        <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
          Billing
        </h3>

        <div className="space-y-1.5">
          <p><span className="text-slate-400">Service:</span> <span className="font-medium">{data.ServiceStartDate} - {data.ServiceEndDate}</span></p>
          <p><span className="text-slate-400">Total:</span> <span className="font-bold text-emerald-600">₹{data.RoundedTotal}</span></p>
          <p><span className="text-slate-400">Address:</span> <span className="font-medium">{data.Adress}</span></p>
        </div>
      </div>
    </div>

  </div>
</div>

          {/* Table */}
          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Txn ID</th>
                <th className="border p-2">Method</th>
                <th className="border p-2">Credit</th>
                <th className="border p-2">Balance</th>
              </tr>
            </thead>

            <tbody>
              {data.Trasaction.map((txn, i) => {
                runningBalance -= Number(txn.amount);

                return (
                  <tr key={i}>
                    <td className="border p-2 text-center">{txn.PaymentDate}</td>
                    <td className="border p-2 text-center">{txn.transactionId}</td>
                    <td className="border p-2 uppercase text-center">
                      {txn.paymentMethod}
                    </td>
                    <td className="border p-2 text-green-600 font-bold text-center">
                      ₹{txn.amount}
                    </td>
                    <td className="border p-2 font-bold text-center">
                      ₹{runningBalance}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}