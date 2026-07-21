import axios from "axios";
import { useState } from "react";

type FullYearTransactionsProps = {
  PAYMENT_HISTORY: any[];
  HCAName: string;
};

export default function FullYearTransactions({
  PAYMENT_HISTORY,
  HCAName,
}: FullYearTransactionsProps) {
  const totalPaid = PAYMENT_HISTORY?.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const [ActionMessage,setActionMessage]=useState("")
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

      subject: `Full Transaction History - ${HCAName} `,

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
        TRANSACTION HISTORY
      </div>

      <h2 style="
        margin:0 0 20px;
        color:#1f2937;
        font-size:26px;
      ">
        Full Transaction History Generated
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
        Please find the attached complete transaction history generated for the following Healthcare Professional. This report contains the complete payment history available in the Curate Health Services Payroll Management System.
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
            Report Type
          </td>
          <td style="font-weight:600;color:#111827;">
            Full Transaction History
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
          📄 Attached Report
        </div>

        <div style="
          font-size:13px;
          color:#6b7280;
        ">
          ${HCAName}-Transaction-History.pdf
        </div>
      </div>

      <div style="
        background:#eef8fd;
        border:1px solid #cfe8f7;
        border-radius:8px;
        padding:16px;
        margin-bottom:24px;
      ">
        <div style="
          color:#1392d3;
          font-weight:700;
          font-size:14px;
          margin-bottom:8px;
        ">
          Report Includes
        </div>

        <ul style="
          margin:0;
          padding-left:18px;
          color:#4b5563;
          font-size:14px;
          line-height:1.8;
        ">
          <li>Complete payment transaction history</li>
          <li>Salary payments</li>
          <li>Bonus & incentive payments</li>
          <li>Advance & deduction records</li>
          <li>Expense reimbursements (if applicable)</li>
          <li>Transaction dates and payment references</li>
        </ul>
      </div>

      <p style="
        color:#6b7280;
        font-size:14px;
        line-height:1.8;
      ">
        This transaction history has been generated directly from the Curate Health Services Payroll Management System for management review, auditing, and record-keeping purposes.
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
  console.log ("Check----",PAYMENT_HISTORY)
  return (
    <div>
      {ActionMessage&&
  <div className="my-4 rounded-xl border border-green-200 bg-green-50 px-5 py-4 shadow-sm">
  <p className="text-sm font-medium text-green-800">
    {ActionMessage}
  </p>
</div>}
    <div className="mx-auto w-full max-w-6xl rounded-2xl border bg-white shadow-lg overflow-hidden" id="ComplitePaySlip">
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6"
        style={{ backgroundColor: "#1392d3", color: "#ffffff" }}
      >
        <div>
          <h2 className="text-2xl font-bold">Full Year Transactions</h2>
          <p style={{ color: "#fbcfe8" }}>{HCAName}</p>
        </div>

        <div className="flex items-center gap-4">
       

       
          <div className="flex gap-2">
            <button
              type="button"
              onClick={downloadPDF}
            >
              Download
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="rounded-md px-4 py-2 hover:opacity-90"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
            >
              Share
            </button>
          </div>
             <div className="rounded-xl px-5 py-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <p className="text-sm">Total Paid</p>
            <h3 className="text-3xl font-bold">₹{totalPaid?.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {PAYMENT_HISTORY===undefined?<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-10 px-6 text-center">
  <div className="mb-3 text-4xl">📄</div>
  <h3 className="text-lg font-semibold text-slate-800">
    No Transactions Found
  </h3>
  <p className="mt-1 max-w-sm text-sm text-slate-500">
    There are no transaction records available for the selected period.
  </p>
</div>:
        <table className="w-full">
          <thead
            style={{ backgroundColor: "#1392d3", color: "#ffffff" }}
          >
            <tr>
              <th className="px-5 py-3 text-left">Month</th>
              <th className="px-5 py-3 text-right">Salary</th>
              <th className="px-5 py-3 text-right">Advance</th>
              <th className="px-5 py-3 text-right">Hostel</th>
              <th className="px-5 py-3 text-right">Other</th>
              <th className="px-5 py-3 text-right">Incentive</th>
              <th className="px-5 py-3 text-right">Final Paid</th>
            </tr>
          </thead>

          <tbody>
            {PAYMENT_HISTORY?.map((item, index) => (
              <tr
                key={index}
                style={{ backgroundColor: index % 2 ? '#f8fafc' : '#ffffff' }}
              >
                <td className="px-5 py-4 font-medium">
                  {item.Month}
                </td>

                <td className="px-5 py-4 text-right">
                  ₹{item.total}
                </td>

                <td className="px-5 py-4 text-right" style={{ color: '#ef4444' }}>
                  ₹{item.advance}
                </td>

                <td className="px-5 py-4 text-right" style={{ color: '#ef4444' }}>
                  ₹{item.hostelFee}
                </td>

                <td className="px-5 py-4 text-right">
                  ₹{item.Other}
                </td>

                <td
                  className="px-5 py-4 text-right font-semibold"
                  style={{ color: "#50c896" }}
                >
                  +₹{item.incentive}
                </td>

                <td
                  className="px-5 py-4 text-right font-bold"
                  style={{ color: "#ff1493" }}
                >
                  ₹{item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </div>
    </div>
  );
}