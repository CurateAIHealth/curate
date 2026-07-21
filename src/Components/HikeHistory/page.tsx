import axios from "axios";
import { useState } from "react";

type SalaryHistory = {
  Salary: number;
  EffectiveDate: string;
  UpdatedBy?: string;
  Reason: string;
  NextHikeDate: string;
};

type HikeHistoryProps = {
  history: SalaryHistory[];
  HCAName: string;
};

export default function HikeHistory({
  history,
  HCAName,
}: HikeHistoryProps) {

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

      const mailResponse = await axios.post("/api/MailSend", {
  to: "srinivasnew0803@gmail.com",

  subject: `Hike History - ${HCAName}`,

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
        HCA HIKE HISTORY
      </div>

      <h2 style="
        margin:0 0 20px;
        color:#1f2937;
        font-size:26px;
      ">
        HCA Hike History Generated
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
        Please find the attached salary hike history for the following Healthcare Professional. This report provides a complete record of all salary revisions maintained in the Curate Health Services Payroll Management System.
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
            Hike History
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
          ${HCAName}-Hike-History.pdf
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
          <li>Complete salary hike history</li>
          <li>Previous and revised salary details</li>
          <li>Effective date of each salary revision</li>
          <li>Percentage and amount of salary increment</li>
          <li>Reason for salary revision (if available)</li>
          <li>Updated by and approval information (if available)</li>
        </ul>
      </div>

      <p style="
        color:#6b7280;
        font-size:14px;
        line-height:1.8;
      ">
        This salary hike history has been generated directly from the Curate Health Services Payroll Management System for management review, auditing, payroll verification, and employee record-keeping purposes.
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

  pdfFileName: `${HCAName}-Hike-History.pdf`,
});

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
    <div className="mx-auto max-w-4xl rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: "#ffffff" }} id="ComplitePaySlip">

      <div
        className="p-6 text-white"
        style={{ backgroundColor: "#1392d3" }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Salary Hike History</h2>
            <p style={{ color: "#fce7f3" }}>{HCAName}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadPDF}
              className="rounded-full px-4 py-2 text-sm font-semibold transition"
              style={{ backgroundColor: "#ffffff", color: "#1e293b", borderColor: "#e2e8f0" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              Download
            </button>
            <button
              type="button"
              onClick={handleShare}
             className="rounded-full px-4 py-2 text-sm font-semibold transition"
              style={{ backgroundColor: "#ffffff", color: "#1e293b", borderColor: "#e2e8f0" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
     <div className="relative ml-4" style={{ borderLeft: "4px solid #ec4899" }}>
  {history.map((item, index) => (
    <div key={index} className="relative mb-8 ml-8">
      {/* Timeline Dot */}
      <span
        className="absolute -left-[46px] top-6 h-6 w-6 rounded-full shadow"
        style={{ backgroundColor: "#50c896", borderWidth: "4px", borderColor: "#ffffff" }}
      />

      {/* Card */}
      <div className="rounded-xl p-6 shadow-sm transition" style={{ borderColor: "#e5e7eb", borderWidth: "1px", backgroundColor: "#ffffff" }}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm" style={{ color: "#6b7280" }}>Salary</p>

            <h3
              className="text-3xl font-bold"
              style={{ color: "#ff1493" }}
            >
              ₹{item.Salary.toLocaleString()}
            </h3>
          </div>

          <span
            className="rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: "#1392d3" }}
          >
            Hike #{index + 1}
          </span>
        </div>

        {/* Details */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm" style={{ color: "#6b7280" }}>Effective Date</p>
            <p className="font-semibold">{item.EffectiveDate}</p>
          </div>

          <div>
            <p className="text-sm" style={{ color: "#6b7280" }}>Updated By</p>
            <p className="font-semibold">{item.UpdatedBy}</p>
          </div>

          <div>
            <p className="text-sm" style={{ color: "#6b7280" }}>Reason for Hike</p>
            <p className="font-medium leading-6" style={{ color: "#374151" }}>
              {item.Reason}
            </p>
          </div>

          <div>
            <p className="text-sm" style={{ color: "#6b7280" }}>Next Hike Review</p>
            <p
              className="font-semibold"
              style={{ color: "#1392d3" }}
            >
              {item.NextHikeDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
      </div>

    </div>
    </div>
  );
}