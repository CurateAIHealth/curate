"use client";

import { GenerateBillPDF, getDaysBetween } from "@/Lib/Actions";
import { UpdateInvoiceData } from "@/Lib/user.action";
import { UpdateInvoiceStatus } from "@/Redux/action";
import axios from "axios";
import React, { useMemo, useState } from "react";

type DayStatus = "P" | "HP" | "A" | "NA";

function normalizeDaysStatusFromTimeSheet(timeSheet: any[]): DayStatus[] {
  if (!Array.isArray(timeSheet)) return [];
  return timeSheet.map((d: any) => {
    const hcp = Boolean(d?.HCPAttendence === true);
    const admin = Boolean(d?.AdminAttendece === true);
    if (hcp && admin) return "P";
    if (hcp || admin) return "HP";
    return "A";
  });
}

function calculateBilling(record: any) {
  const baseStatuses = normalizeDaysStatusFromTimeSheet(record?.TimeSheet || []);
  const baseCounts = baseStatuses.reduce(
    (a: any, s: DayStatus) => {
      a[s]++;
      return a;
    },
    { P: 0, HP: 0, A: 0, NA: 0 }
  );

  const counts = {
    P: Number(record.editP ?? baseCounts.P),
    HP: Number(record.editHP ?? baseCounts.HP),
    A: Number(record.editA ?? baseCounts.A),
    NA: Number(record.editNA ?? baseCounts.NA),
  };

  const hcpDaily = Number(record.cPay || 0);
  const clientDaily = Number(record.hcpPay || 0);
  const taxRate = Number(record.taxRate || 0);

  const clientFromP = counts.P * clientDaily;
  const clientFromHP = counts.HP * clientDaily * 0.5;
  const clientTotal = clientFromP + clientFromHP;

  const hcpFromP = counts.P * hcpDaily;
  const hcpFromHP = counts.HP * hcpDaily * 0.5;
  const hcpCalculated = hcpFromP + hcpFromHP;

  const hcpOverride =
    record.hcpTotal !== undefined && record.hcpTotal !== ""
      ? Number(record.hcpTotal)
      : undefined;

  const payableToHcp = hcpOverride ?? hcpCalculated;
  const taxAmount = clientTotal * taxRate;
  const receivableFromClient = clientTotal + taxAmount;
  const margin = receivableFromClient - payableToHcp;

  return {
    counts,
    hcpDaily,
    clientDaily,
    clientFromP,
    clientFromHP,
    clientTotal,
    hcpFromP,
    hcpFromHP,
    hcpCalculated,
    hcpOverride,
    payableToHcp,
    receivableFromClient,
    margin,
  };
}

export function PaymentInfoModal({
  record,
  onClose,
}: {
  record: any;
  onClose: () => void;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [HideForDownload,setHideForDownload]=useState(false)
  const [editableRecord, setEditableRecord] = useState({
    ...record,
    taxRate: 0.01,
  });
  const [loading, setLoading] = useState(false);
const [MailStatusMessage,setMailStatusMessage]=useState<any>(null)
  const result = useMemo(
    () => calculateBilling(editableRecord),
    [editableRecord]
  );
const handleSendEmail = async(record:any) => {
setHideForDownload(true)
  setMailStatusMessage("Sending Invoice Email...") 
     setTimeout(async () => {
         const element:any = document?.getElementById("invoice-pdf-area");
     
   
     
      
         const html = element.outerHTML;
         const pdfResponse = await axios.post("/api/generate-pdf", { html });
         const pdfBase64 = pdfResponse.data.pdf;
     
         await axios.post("/api/MailSend", {
           to: "tsiddu805@gmail.com",
           subject:
             "Here’s Your  Invoice 😊 from Curate Health Services",
        html:`<div style="
  max-width:720px;
  margin:auto;
  background:#ffffff;
  border:1px solid #d1d5db;
  border-radius:10px;
  font-family:Arial, Helvetica, sans-serif;
  color:#111827;
">

  <!-- HEADER -->
  <div style="
    padding:22px 24px;
    border-bottom:1px solid #e5e7eb;
  ">
    <table style="width:100%;">
      <tr>
        <td>
          <img
            src="https://curate-pearl.vercel.app/Icons/UpdateCurateLogo.png"
            style="height:46px;"
          />
        </td>
        <td style="text-align:right;">
          <p style="margin:0;font-size:14px;">
            <strong>Invoice No:</strong> ${record?.invoice.slice(0,9)}
          </p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">
            Payment Information
          </p>
        </td>
      </tr>
    </table>
  </div>

  <!-- BODY -->
  <div style="padding:26px 24px;">

    <p style="margin-top:0;font-size:15px;line-height:24px;">
      Dear Customer,
    </p>

    <p style="font-size:15px;line-height:24px;">
      The payment details for the caregiver listed below have been
      <strong>updated</strong>.
      Please refer to the attached PDF for the complete and final breakdown.
    </p>

    <!-- BASIC INFO ONLY -->
    <table style="margin-top:18px;font-size:14px;">
      <tr>
        <td style="padding:4px 0;"><strong>Caregiver Name</strong></td>
        <td style="padding:4px 10px;">:</td>
        <td style="padding:4px 0;">${record?.HCA_Name}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;"><strong>Patient Name</strong></td>
        <td style="padding:4px 10px;">:</td>
        <td style="padding:4px 0;">${record?.PatientName}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;"><strong>Status</strong></td>
        <td style="padding:4px 10px;">:</td>
        <td style="padding:4px 0;">${record?.Status}</td>
      </tr>
    </table>

    <p style="margin-top:22px;font-size:14px;color:#374151;line-height:22px;">
      If you have any questions regarding this invoice,
      please contact our support team.
    </p>

    <p style="margin-top:26px;font-size:14px;">
      Regards,<br />
      <strong>Curate Health Services</strong>
    </p>

  </div>
</div>
`,
     
           pdfBase64,
         });
     
    
        setHideForDownload(false)
      setMailStatusMessage("Invoice email has been sent successfully") 
         
       }, 4000);
   
       
    
  };
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-2" id="invoice-pdf-area">
      <div className="bg-white w-full max-w-[90%] rounded-2xl shadow-xl p-5">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
          <div className="flex gap-4">
            <h3 className="text-xl font-bold">
            Payment Info — {record?.HCA_Name}
          </h3>
          {MailStatusMessage && (
  <div
    className={`
      mt-4 px-6 py-3 rounded-xl text-center text-lg font-semibold
      transition-all duration-300 ease-in-out
      ${
        MailStatusMessage.includes("Sending")
          ? "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse"
          : MailStatusMessage.includes("sent")
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }
    `}
  >
    {MailStatusMessage}
  </div>
)}

          </div>
{HideForDownload===false&&
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1 bg-gray-100 rounded"
            >
              Close
            </button>

            <button
              onClick={() => setIsEdit((v) => !v)}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              {isEdit ? "Save" : "Edit"}
            </button>
<button
  className="flex items-center gap-2 cursor-pointer px-5 py-2.5 
             rounded-md bg-teal-800 
             text-white font-semibold text-sm
             hover:bg-teal-700 
             shadow-sm hover:shadow-md
             transition"

             onClick={()=>handleSendEmail(record)}
>
  📤 Send Email Invoice 
</button>


            <button
              disabled={loading}
              onClick={async () => {
                if (loading) return;
               setLoading(true);
                try {
             
                  const Check=await GenerateBillPDF({
                    number: record?.invoice || "Payment_Info",
                    ...editableRecord,
                  });
                       console.log('Fine Ites Working........%%$',Check)
                } finally {
                  setLoading(false);
                }
              }}
              className="px-3 py-1 bg-teal-800 text-white rounded disabled:opacity-50"
            >
              {loading ? "Exporting..." : "Export PDF"}
            </button>
          </div>}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <h4 className="font-semibold">Days Summary</h4>

            <div>
              Full (P):{" "}
              {isEdit ? (
                <input
                  className="border px-2 w-16"
                  value={editableRecord.editP ?? result.counts.P}
                  onChange={(e) =>
                    setEditableRecord({
                      ...editableRecord,
                      editP: e.target.value,
                    })
                  }
                />
              ) : (
                result.counts.P
              )}
            </div>

            <div>
              Half (HP):{" "}
              {isEdit ? (
                <input
                  className="border px-2 w-16"
                  value={editableRecord.editHP ?? result.counts.HP}
                  onChange={(e) =>
                    setEditableRecord({
                      ...editableRecord,
                      editHP: e.target.value,
                    })
                  }
                />
              ) : (
                result.counts.HP
              )}
            </div>

            <div>
              Absent (A):{" "}
              {isEdit ? (
                <input
                  className="border px-2 w-16"
                  value={editableRecord.editA ?? result.counts.A}
                  onChange={(e) =>
                    setEditableRecord({
                      ...editableRecord,
                      editA: e.target.value,
                    })
                  }
                />
              ) : (
                result.counts.A
              )}
            </div>

            <div>
              NA:{" "}
              {isEdit ? (
                <input
                  className="border px-2 w-16"
                  value={editableRecord.editNA ?? result.counts.NA}
                  onChange={(e) =>
                    setEditableRecord({
                      ...editableRecord,
                      editNA: e.target.value,
                    })
                  }
                />
              ) : (
                result.counts.NA
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold">Rates</h4>

            <div>
              We pay (HCP daily):{" "}
              {isEdit ? (
                <input
                  className="border px-2 w-24"
                  value={editableRecord.cPay}
                  onChange={(e) =>
                    setEditableRecord({
                      ...editableRecord,
                      cPay: e.target.value,
                    })
                  }
                />
              ) : (
                `₹${result.hcpDaily}`
              )}
            </div>

            <div>
              We charge (Client daily):{" "}
              {isEdit ? (
                <input
                  className="border px-2 w-24"
                  value={editableRecord.hcpPay}
                  onChange={(e) =>
                    setEditableRecord({
                      ...editableRecord,
                      hcpPay: e.target.value,
                    })
                  }
                />
              ) : (
                `₹${result.clientDaily}`
              )}
            </div>
          </div>

          <div className="md:col-span-2 mt-2">
            <h4 className="font-semibold">Client Charges</h4>
            <div>From P: ₹{result.clientFromP}</div>
            <div>From HP: ₹{result.clientFromHP}</div>
            <div className="font-bold">
              Client Total: ₹{Math.round(result.clientTotal)}
            </div>
          </div>

          <div className="md:col-span-2 mt-2">
            <h4 className="font-semibold">HCP Payment</h4>
            <div>From P: ₹{result.hcpFromP}</div>
            <div>From HP: ₹{result.hcpFromHP}</div>
            <div>Calculated HCP total: ₹{result.hcpCalculated}</div>

            <div>
              Override:{" "}
              {isEdit ? (
                <input
                  className="border px-2 w-24"
                  value={editableRecord.hcpTotal ?? ""}
                  onChange={(e) =>
                    setEditableRecord({
                      ...editableRecord,
                      hcpTotal: e.target.value,
                    })
                  }
                />
              ) : result.hcpOverride ? (
                `₹${result.hcpOverride}`
              ) : (
                "-"
              )}
            </div>
          </div>

          <div className="md:col-span-2 mt-4 border-t pt-3 flex justify-between">
            <div>
              <div className="text-sm text-gray-600">Payable to HCP</div>
              <div className="text-lg font-bold">
                ₹{Math.round(result.payableToHcp)}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">
                Receivable from Client
              </div>
              <div className="text-lg font-bold">
                ₹{Math.round(result.receivableFromClient)}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Margin</div>
              <div className="text-lg font-bold">
                ₹{Math.round(result.margin)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
