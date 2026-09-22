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
          to: "tsiddu805@gmail.com",

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

          pdfFileName:
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

  let runningBalance = data.RoundedTotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
      <div className="max-h-[95vh] w-full max-w-6xl overflow-auto rounded-xl bg-white shadow-2xl">

      

        <div className="sticky top-0 z-10 flex items-center justify-end  border-b bg-white p-4">
         

          <div className="flex justify-end gap-2">
              {ActionMessage&&
<div className="relative overflow-hidden rounded-xl border border-[#1392d3]/20 bg-white px-4 py-3.5 shadow-sm">
  {/* Project color indicators */}
  <div className="absolute left-0 top-0 flex h-full w-1 flex-col">
    {ActionMessage!=="Transaction history sent successfully."?
    <span className="flex-1 bg-[#ff1493]" />
:
    <span className="flex-1 bg-[#50c896]" />}
  </div>

  <div className="flex items-center gap-3 pl-1">
  
 
      
    <div className="min-w-0">
  

      <p className="text-sm font-semibold leading-relaxed text-gray-700">
        {ActionMessage}
      </p>
    </div>
  </div>
</div>}
            <button
              onClick={sharePDF}
              disabled={isSending}
              className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending
                ? "Sending..."
                : "Share PDF as Email"}
            </button>

            <button
              onClick={downloadPDF}
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            >
              Download PDF
            </button>

            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg p-2"
            >
              <CircleX
                className="text-gray-800"
                size={20}
              />
            </button>

          </div>
        </div>



        <div
          id="transaction-pdf-area"
          ref={pdfRef}
          className="bg-[#ffffff] p-6 text-[#000000]"
        >



          <div className="mb-3 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#ffffff] shadow-lg">

   

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

         

          <div className="grid gap-3 bg-[#ffffff] p-3 text-base md:grid-cols-2">

  <div className="rounded-xl border border-[#f1f5f9] bg-[#f8fafc] p-3">

    <h3 className="mb-2 text-xs uppercase tracking-[2px] text-[#64748b]">
      Client
    </h3>

    <div className="space-y-2">

      <p>
        <span className="text-[#64748b]">
          Name:
        </span>{" "}

        <span className="text-[#1e293b]">
          {data.ClientName}
        </span>
      </p>

      <p>
        <span className="text-[#64748b]">
          Patient:
        </span>{" "}

        <span className="text-[#1e293b]">
          {data.Patient || data.name}
        </span>
      </p>

      <p>
        <span className="text-[#64748b]">
          Phone:
        </span>{" "}

        <span className="text-[#1e293b]">
          {data.contact}
        </span>
      </p>

    </div>
  </div>

  <div className="rounded-xl border border-[#f1f5f9] bg-[#ffffff] p-3">

    <h3 className="mb-2 text-xs uppercase tracking-[2px] text-[#64748b]">
      Billing
    </h3>

    <div className="space-y-2">

      <p>
        <span className="text-[#64748b]">
          Service:
        </span>{" "}

        <span className="text-[#1e293b]">
          {data.StartDate}
          {" - "}
          {data.ServiceEndDate}
        </span>
      </p>

      <p>
        <span className="text-[#64748b]">
          Total:
        </span>{" "}

        <span className="text-[#059669]">
          ₹{data.RoundedTotal}
        </span>
      </p>

      <p>
        <span className="text-[#64748b]">
          Address:
        </span>{" "}

        <span className="text-[#1e293b]">
          {data.Adress || GetFulladress(RegUserInfo, data.ClienId)}
        </span>
      </p>

    </div>
  </div>

</div>
          </div>



          <table
            className="w-full border-collapse text-sm"
              id="transaction-pdf-area"
            style={{
              color: "#000000",
              backgroundColor: "#ffffff",
            }}
          >
            <thead
              style={{
                backgroundColor: "#e5e7eb",
                color: "#111827",
              }}
            >
              <tr>

                <th
                  className="border p-2"
                  style={{ borderColor: "#d1d5db" }}
                >
                  Date
                </th>

                <th
                  className="border p-2"
                  style={{ borderColor: "#d1d5db" }}
                >
                  Transaction ID
                </th>

                <th
                  className="border p-2"
                  style={{ borderColor: "#d1d5db" }}
                >
                  Method
                </th>

                <th
                  className="border p-2"
                  style={{ borderColor: "#d1d5db" }}
                >
                  Credit
                </th>

                <th
                  className="border p-2"
                  style={{ borderColor: "#d1d5db" }}
                >
                  Balance
                </th>

              </tr>
            </thead>

            <tbody>

              {data.Trasaction.map((txn, i) => {
                runningBalance -= Number(txn.amount);

                return (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#111827",
                    }}
                  >

                    <td
                      className="border p-2 text-center"
                      style={{
                        borderColor: "#d1d5db",
                      }}
                    >
                      {txn.PaymentDate}
                    </td>

                    <td
                      className="border p-2 text-center"
                      style={{
                        borderColor: "#d1d5db",
                      }}
                    >
                      {txn.transactionId}
                    </td>

                    <td
                      className="border p-2 text-center uppercase"
                      style={{
                        borderColor: "#d1d5db",
                      }}
                    >
                      {txn.paymentMethod}
                    </td>

                    <td
                      className="border p-2 text-center font-bold"
                      style={{
                        borderColor: "#d1d5db",
                        color: "#16a34a",
                      }}
                    >
                      ₹{txn.amount}
                    </td>

                    <td
                      className="border p-2 text-center font-bold"
                      style={{
                        borderColor: "#d1d5db",
                        color: "#111827",
                      }}
                    >
                      ₹{Math.round(runningBalance)}
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