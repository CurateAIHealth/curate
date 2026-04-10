"use client";

import { useState } from "react";
import { X, Upload, AlertTriangle } from "lucide-react";
import axios from "axios";

interface PostExpenseModalProps {
  employeeId: string;
  employeeName: string;
  expenseTypes: string[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export default function PostExpenseModal({
  employeeId,
  employeeName,
  expenseTypes,
  onSubmit,
  onClose,
}: PostExpenseModalProps) {
  const today = new Date().toISOString().split("T")[0];
const [ShowOtherExpence,setShowOtherExpence]=useState(false)
const [StatusMessage,setStatusMessage]=useState("")
  const [form, setForm] = useState({
    billDate: "",
    submissionDate: today,
    expenseType: "",
    amount: "",
    paymentAccount: "",
    paidTo: "Self",
    reason: "",
    gst: "",
    tds: "",
    receipt: null as File | null,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };



const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const handleFile = async (e: any) => {
  try {
    setStatusMessage("Please Wait Uploading.......")
    const file = e.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Invalid file type. Only JPG, PNG, and PDF are allowed.");
      return;
    }

  
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Optional: set loading state
    // setLoading(true);

   const res = await axios.post('/api/Upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

    const url = res?.data?.url;

    if (!url) {
      throw new Error("Upload failed: No URL returned");
    }

    setForm((prev) => ({
      ...prev,
      receipt: url,
    }));
setStatusMessage("Receipt Uploaded Successfully")
  } catch (error: any) {
    console.error("File upload error:", error);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong during upload";

    alert(message);
  } finally {
    // setLoading(false);
  }
};

  const handleSubmit = () => {
    onSubmit({
      employeeId,
      employeeName,
      ...form,
    });
  };

  const SentTestEmail=async ()=>{
    try {
      const ImageLink='https://res.cloudinary.com/db3dr9lf5/image/upload/v1775469496/uploads/zab8yjnkf8vnyij9mhkn.png'
await axios.post("/api/MailSend", {
  to: "tsiddu805@gmail.com",
  subject: "🎉 Registration Successful – Welcome to Curate Health Care Pvt. Ltd.",
html: `
<div style="background:#eef2f7;padding:30px 10px;font-family:Arial, Helvetica, sans-serif;">

  <div style="
    max-width:760px;
    margin:auto;
    background:#ffffff;
    border-radius:10px;
    overflow:hidden;
    border:1px solid #e5e7eb;
  ">

    <!-- WHITE HEADER (LOGO SAFE) -->
    <div style="
      background:#ffffff;
      padding:18px 22px;
      border-bottom:1px solid #e5e7eb;
    ">
      <table style="width:100%;">
        <tr>
          <td>
            <img src="https://curate-pearl.vercel.app/Icons/UpdateCurateLogo.png" style="height:42px;" />
          </td>
          <td style="text-align:right;font-size:12px;color:#6b7280;">
            Curate Health Care Pvt. Ltd.<br/>
            Registration Confirmation
          </td>
        </tr>
      </table>
    </div>

    <!-- MAIN CONTENT -->
    <table style="width:100%;border-collapse:collapse;">
      <tr>

        <!-- LEFT BRAND STRIP -->
        <td style="
          width:140px;
          background:#1392d3;
          color:#ffffff;
          vertical-align:top;
          padding:22px 14px;
        ">
          <div style="font-size:13px;line-height:20px;">
            <strong>Healthcare Services</strong>
          </div>

          <div style="
            margin-top:30px;
            font-size:12px;
            line-height:18px;
            opacity:0.9;
          ">
            Reliable caregiver support and patient care solutions.
          </div>

          <!-- STATUS -->
          <div style="
            margin-top:40px;
            background:#50c896;
            padding:8px;
            text-align:center;
            border-radius:6px;
            font-size:12px;
            font-weight:600;
          ">
            ACTIVE
          </div>
        </td>

        <!-- RIGHT CONTENT -->
        <td style="padding:28px 26px;vertical-align:top;">

          <!-- TITLE -->
          <div style="
            font-size:20px;
            font-weight:700;
            color:#111827;
            margin-bottom:6px;
          ">
            Registration Confirmed
          </div>

          <div style="
            font-size:13px;
            color:#6b7280;
            margin-bottom:18px;
          ">
            Your onboarding process has been successfully completed
          </div>

          <!-- MESSAGE -->
          <p style="font-size:14px;color:#374151;line-height:22px;">
            Dear <strong>Siddu</strong>,
          </p>

          <p style="font-size:14px;color:#374151;line-height:22px;">
            We are pleased to confirm that your registration with 
            <strong>Curate Health Care Pvt. Ltd.</strong> has been successfully completed.
          </p>

          <p style="font-size:14px;color:#374151;line-height:22px;">
            Your account is now active and ready for service engagement.
          </p>

          <!-- DIVIDER -->
          <div style="height:1px;background:#e5e7eb;margin:22px 0;"></div>

          <!-- DETAILS -->
          <table style="width:100%;font-size:14px;">
            <tr>
              <td style="color:#6b7280;">Name</td>
              <td style="text-align:right;"><strong>Siddu</strong></td>
            </tr>
           
          </table>

          <!-- AGREEMENT -->
          <div style="margin-top:26px;">

            <div style="
              font-size:14px;
              font-weight:600;
              margin-bottom:10px;
              color:#111827;
            ">
              Agreement Document
            </div>

            <div style="
              border:1px solid #e5e7eb;
              border-radius:8px;
              padding:12px;
              background:#fafafa;
            ">
              <img 
                src="${ImageLink}"
                style="width:100%;border-radius:6px;"
              />
            </div>

            <!-- BUTTON -->
            <div style="margin-top:14px;">
              <a href="${ImageLink}" target="_blank" style="
                display:inline-block;
                padding:10px 16px;
                background:#ff1493;
                color:#ffffff;
                text-decoration:none;
                border-radius:6px;
                font-size:13px;
                font-weight:600;
              ">
                View Agreement
              </a>
            </div>

          </div>

          <!-- FOOT -->
          <p style="margin-top:24px;font-size:13px;color:#6b7280;">
            For assistance, please contact our support team.
          </p>

          <p style="margin-top:16px;font-size:14px;">
            <strong style="color:#1392d3;">Curate Health Care Pvt. Ltd.</strong>
          </p>

        </td>
      </tr>
    </table>

  </div>

</div>
`
});
      setStatusMessage("Test Email Sent Successfully")
    } catch (error) {
      setStatusMessage("Failed to send Test Email")
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-gray-300">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <img src="/Icons/Curate-logo.png" className="h-8" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Expense Submission
              </h2>
              <button onClick={SentTestEmail}>Send Test Email</button>
              <p className="text-xs text-gray-500">
                {employeeName} • {employeeId}
              </p>
            </div>
          </div>
<div className="flex items-center gap-2">
{StatusMessage&&<p
  className={`text-sm px-3 py-2 rounded-md font-medium ${
    StatusMessage.includes("Successfully")
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {StatusMessage}
</p>}
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-red-600" />
          </button>
</div>
        </div>

        {/* BODY (NO SCROLL) */}
        <div className="px-6 py-4 grid grid-cols-12 gap-6 text-sm">

          {/* RECEIPT */}
          <div className="col-span-4">
            <label className="font-medium text-gray-700 mb-1 block">
              Receipt Upload
            </label>
            {form.receipt?<img src={form.receipt}/>:<label className="h-[170px] border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005f61]">
              <Upload className="text-gray-500" />
              <p className="mt-2 text-gray-600">
              "Upload bill / receipt"
              </p>
              <input type="file" className="hidden" onChange={handleFile} />
            </label>}
          </div>

         
          <div className="col-span-8 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-gray-700">Bill Date</label>
                <input
                  type="date"
                  name="billDate"
                  value={form.billDate}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">
                  Submission Date
                </label>
                <input
                  value={form.submissionDate}
                  disabled
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                />
              </div>
            </div>

            <div className="flex gap-2 bg-yellow-50 border border-yellow-300 rounded-md p-3">
              <AlertTriangle size={18} className="text-yellow-600 mt-0.5" />
              <p className="text-xs text-yellow-700 leading-snug">
                After <b>15 days</b> approval required ·{" "}
                <b>25 days</b> penalty · <b>30 days</b> rejected
              </p>
            </div>
             {ShowOtherExpence&&<div className="col-span-2">
              <label className="font-medium text-gray-700">Enter Other Expenses</label>
              <input
                name="expenseType"
                value={form.expenseType}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              />
            </div>}
          </div>


          <div className="col-span-12 grid grid-cols-6 gap-4">
            <div className="col-span-2">
              <label className="font-medium text-gray-700">Expense Type</label>
              <select
                name="expenseType"
                value={form.expenseType}
               onChange={(e:any)=>{
setShowOtherExpence(e.target.value==="Other")
setForm({...form,expenseType:e.target.value==="Other"?"":e.target.value})

               }}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select category</option>
                {expenseTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

           

            <div className="col-span-2">
              <label className="font-medium text-gray-700">Amount</label>
              <input
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="col-span-2">
              <label className="font-medium text-gray-700">Paid To</label>
              <input
                value="Self"
                disabled
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
          </div>

         
          <div className="col-span-12 grid grid-cols-6 gap-4">
            <div className="col-span-2">
              <label className="font-medium text-gray-700">
                Payment Account
              </label>
              <input
                name="paymentAccount"
                value={form.paymentAccount}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="col-span-2">
              <label className="font-medium text-gray-700">GST</label>
              <input
                name="gst"
                value={form.gst}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="col-span-2">
              <label className="font-medium text-gray-700">TDS</label>
              <input
                name="tds"
                value={form.tds}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

   
          <div className="col-span-12">
            <label className="font-medium text-gray-700">
              Expense Reason
            </label>
            <input
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Short description"
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

   
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-10 py-2.5 rounded-md bg-[#005f61] text-white font-semibold hover:bg-[#00494b]"
          >
            Submit Expense
          </button>
        </div>
      </div>
    </div>
  );
}
