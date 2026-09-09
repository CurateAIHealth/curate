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

 


  // /api/test-slack.js


// const SentTestEmail = async () => {
//   try {
//     setStatusMessage("Sending Test Email.......");

//     // ==============================
//     // TEST DATA
//     // ==============================
//     const testClientName = "Mr. Rajesh Kumar";
//     const testPatientName = "Mrs. Lakshmi Devi";
//     const testProfessionalName = "Ms. Anitha Reddy";
//     const testProfessionalType = "Healthcare Assistant";
//     const testPlacementDate = "10 September 2026";
//     const testPlacementLocation =
//       "Jubilee Hills, Hyderabad, Telangana";

//     const mailResponse = await axios.post("/api/MailSend", {
//       to: "tsiddu805@gmail.com",

//       subject:
//         `New Placement Introduction – ${testProfessionalName} | Curate Health Services`,

//       html: `
//       <div style="
//         width:100%;
//         max-width:680px;
//         margin:0 auto;
//         background:#ffffff;
//         border-radius:18px;
//         border:1px solid #e5e7eb;
//         font-family:'Segoe UI',Arial,sans-serif;
//         overflow:hidden;
//         color:#1f2937;
//       ">

//         <!-- ================= HEADER ================= -->

//         <div style="
//           background:#f7f5ef;
//           padding:28px 25px 22px;
//           text-align:center;
//           border-bottom:1px solid #e5e7eb;
//         ">

//           <img
//             src="https://www.curatehealthservices.com/Icons/UpdateCurateLogo.png"
//             alt="Curate Health Services"
//             style="
//               height:82px;
//               width:auto;
//               display:block;
//               margin:0 auto 12px;
//             "
//           />

//           <div style="
//             font-size:13px;
//             font-weight:600;
//             color:#1392d3;
//             letter-spacing:1px;
//             text-transform:uppercase;
//           ">
//             Healthcare Placement
//           </div>

//         </div>


//         <!-- ================= INTRODUCTION ================= -->

//         <div style="padding:32px 30px 15px;">

//           <p style="
//             margin:0 0 8px;
//             font-size:15px;
//             color:#6b7280;
//           ">
//             Dear <strong>${testClientName}</strong>,
//           </p>

//           <h1 style="
//             margin:0 0 18px;
//             font-size:27px;
//             line-height:36px;
//             color:#111827;
//             font-weight:700;
//           ">
//             Your Healthcare Professional Has Been Placed
//           </h1>

//           <p style="
//             margin:0;
//             font-size:15px;
//             line-height:26px;
//             color:#4b5563;
//           ">
//             We are pleased to introduce the healthcare professional
//             selected by <strong>Curate Health Services</strong> to
//             support <strong>${testPatientName}</strong>.
//           </p>

//         </div>


//         <!-- ================= PLACEMENT DETAILS ================= -->

//         <div style="padding:18px 30px 10px;">

//           <div style="
//             background:#f8fafc;
//             border:1px solid #e5e7eb;
//             border-radius:14px;
//             padding:22px;
//           ">

//             <div style="
//               font-size:13px;
//               font-weight:700;
//               color:#1392d3;
//               text-transform:uppercase;
//               letter-spacing:.6px;
//               margin-bottom:16px;
//             ">
//               Placement Details
//             </div>

//             <table style="
//               width:100%;
//               border-collapse:collapse;
//               font-size:14px;
//             ">

//               <tr>
//                 <td style="
//                   padding:9px 0;
//                   color:#6b7280;
//                   width:42%;
//                 ">
//                   Patient / Client
//                 </td>

//                 <td style="
//                   padding:9px 0;
//                   color:#111827;
//                   font-weight:600;
//                 ">
//                   ${testPatientName}
//                 </td>
//               </tr>


//               <tr>
//                 <td style="
//                   padding:9px 0;
//                   color:#6b7280;
//                 ">
//                   Healthcare Professional
//                 </td>

//                 <td style="
//                   padding:9px 0;
//                   color:#111827;
//                   font-weight:600;
//                 ">
//                   ${testProfessionalName}
//                 </td>
//               </tr>


//               <tr>
//                 <td style="
//                   padding:9px 0;
//                   color:#6b7280;
//                 ">
//                   Professional Type
//                 </td>

//                 <td style="
//                   padding:9px 0;
//                   color:#111827;
//                   font-weight:600;
//                 ">
//                   ${testProfessionalType}
//                 </td>
//               </tr>


//               <tr>
//                 <td style="
//                   padding:9px 0;
//                   color:#6b7280;
//                 ">
//                   Placement Date
//                 </td>

//                 <td style="
//                   padding:9px 0;
//                   color:#111827;
//                   font-weight:600;
//                 ">
//                   ${testPlacementDate}
//                 </td>
//               </tr>


//               <tr>
//                 <td style="
//                   padding:9px 0;
//                   color:#6b7280;
//                 ">
//                   Service Location
//                 </td>

//                 <td style="
//                   padding:9px 0;
//                   color:#111827;
//                   font-weight:600;
//                 ">
//                   ${testPlacementLocation}
//                 </td>
//               </tr>

//             </table>

//           </div>

//         </div>


//         <!-- ================= MESSAGE ================= -->

//         <div style="padding:22px 30px 10px;">

//           <p style="
//             margin:0 0 14px;
//             font-size:15px;
//             line-height:26px;
//             color:#4b5563;
//           ">
//             Our team has completed the required placement process and
//             will continue to coordinate the service to ensure a smooth
//             and reliable healthcare experience.
//           </p>


//           <p style="
//             margin:0;
//             font-size:15px;
//             line-height:26px;
//             color:#4b5563;
//           ">
//             Please find the attached
//             <strong>Enrollment & Curate Health Services
//             Information PDF</strong>, which contains our company
//             information, services, care approach, service workflow,
//             values, and contact details for your reference.
//           </p>

//         </div>


//         <!-- ================= ATTACHMENT ================= -->

//         <div style="
//           margin:24px 30px;
//           padding:18px 20px;
//           background:#f0f9ff;
//           border:1px solid #bae6fd;
//           border-radius:12px;
//         ">

//           <div style="
//             font-size:14px;
//             font-weight:700;
//             color:#0369a1;
//             margin-bottom:5px;
//           ">
//             📎 Enrollment Copy Attached
//           </div>

//           <div style="
//             font-size:13px;
//             line-height:21px;
//             color:#475569;
//           ">
//             Curate Health Services – Enrollment & Company Information
//           </div>

//         </div>


//         <!-- ================= SUPPORT ================= -->

//         <div style="padding:5px 30px 28px;">

//           <p style="
//             margin:0 0 15px;
//             font-size:14px;
//             line-height:23px;
//             color:#4b5563;
//           ">
//             If you have any questions or require any assistance
//             regarding the placement, please feel free to contact
//             our team.
//           </p>


//           <p style="
//             margin:0;
//             font-size:14px;
//             line-height:24px;
//             color:#374151;
//           ">
//             Warm regards,<br />

//             <strong style="color:#111827;">
//               Curate Health Services LLP
//             </strong><br />

//             <span style="color:#6b7280;">
//               Experience truly personal, at-home healthcare
//             </span>
//           </p>

//         </div>


//         <!-- ================= FOOTER ================= -->

//         <div style="
//           background:#f7f5ef;
//           border-top:1px solid #e5e7eb;
//           padding:22px 25px;
//           text-align:center;
//         ">

//           <div style="
//             font-size:13px;
//             line-height:22px;
//             color:#4b5563;
//           ">

//             <strong style="color:#111827;">
//               Curate Health Services LLP
//             </strong>

//             <br />

//             📧 info@curatehealth.in
//             &nbsp; | &nbsp;
//             📞 +91 73860 45569

//           </div>


//           <div style="
//             margin-top:10px;
//             font-size:12px;
//             line-height:19px;
//             color:#6b7280;
//           ">

//             H. No. 2-117/7-53, Anagha Datta Nilayam,<br />

//             2-117/3, Manikonda Road,
//             Behind Preetham Hospital,<br />

//             OU Colony, Shaikpet,
//             Hyderabad, Telangana – 500104

//           </div>


//           <div style="
//             margin-top:13px;
//             font-size:11px;
//             color:#9ca3af;
//           ">
//             © 2026 Curate Health Services • All rights reserved.
//           </div>

//         </div>

//       </div>
//       `,


//     });

//     console.log("Test Email Response:", mailResponse.data);

//     setStatusMessage("Test Email Sent Successfully ✅");

//   } catch (error: any) {
//     console.error("Test Email Error:", error);

//     setStatusMessage(
//       error?.response?.data?.message ||
//       "Failed to Send Test Email ❌"
//     );
//   }
// };


const SentTestEmail = async () => {
  try {
    setStatusMessage("Sending Test Email.......");

    // =========================================================
    // TEST DATA - MATCHING YOUR REPLACEMENT FLOW
    // =========================================================

    const testClientName = "Mr. Rajesh Kumar";

    const testPatientName = "Mrs. Lakshmi Devi";

    // Existing HCA / Caregiver
    const testExistingHCPName = "Ms. Priya Sharma";

    // Newly placed HCA / Caregiver
    const testNewHCPName = "Ms. Anitha Reddy";

    const testProfessionalType = "Healthcare Assistant";

    const testReplacementDate = "10 September 2026";

    const testReplacementTime = "10:00 AM";

    const testServiceLocation =
      "Jubilee Hills, Hyderabad, Telangana";

    const testReplacementReason =
      "Existing caregiver unavailable";

    const testCaseName =
      "Lakshmi Devi - Home Healthcare Service";

    const testServiceStartDate =
      "01 September 2026";


    // =========================================================
    // SEND EMAIL
    // =========================================================

    const mailResponse = await axios.post("/api/MailSend", {
      to: "tsiddu805@gmail.com",

      subject:
        `Healthcare Professional Replacement – ${testPatientName} | Curate Health Services`,

      html: `
      <div style="
        width:100%;
        max-width:680px;
        margin:0 auto;
        background:#ffffff;
        border-radius:18px;
        border:1px solid #e5e7eb;
        font-family:'Segoe UI',Arial,sans-serif;
        overflow:hidden;
        color:#1f2937;
      ">

        <!-- ================================================= -->
        <!-- HEADER -->
        <!-- ================================================= -->

        <div style="
          background:#f7f5ef;
          padding:28px 25px 22px;
          text-align:center;
          border-bottom:1px solid #e5e7eb;
        ">

          <img
            src="https://www.curatehealthservices.com/Icons/UpdateCurateLogo.png"
            alt="Curate Health Services"
            style="
              height:82px;
              width:auto;
              display:block;
              margin:0 auto 12px;
            "
          />

          <div style="
            font-size:13px;
            font-weight:700;
            color:#1392d3;
            letter-spacing:1px;
            text-transform:uppercase;
          ">
            Healthcare Professional Replacement
          </div>

        </div>


        <!-- ================================================= -->
        <!-- INTRODUCTION -->
        <!-- ================================================= -->

        <div style="
          padding:32px 30px 20px;
        ">

          <p style="
            margin:0 0 8px;
            font-size:15px;
            color:#6b7280;
          ">
            Dear <strong>${testClientName}</strong>,
          </p>


          <h1 style="
            margin:0 0 18px;
            font-size:27px;
            line-height:36px;
            color:#111827;
            font-weight:700;
          ">
            Introducing Your New Healthcare Professional
          </h1>


          <p style="
            margin:0;
            font-size:15px;
            line-height:26px;
            color:#4b5563;
          ">
            We are pleased to inform you that
            <strong>Curate Health Services</strong> has arranged a
            replacement healthcare professional for
            <strong>${testPatientName}</strong>.
          </p>

        </div>


        <!-- ================================================= -->
        <!-- NEW PROFESSIONAL HIGHLIGHT -->
        <!-- ================================================= -->

        <div style="
          margin:0 30px 22px;
          padding:22px;
          background:#f0f9ff;
          border:1px solid #bae6fd;
          border-radius:15px;
        ">

          <div style="
            font-size:12px;
            font-weight:700;
            color:#0284c7;
            text-transform:uppercase;
            letter-spacing:.8px;
            margin-bottom:10px;
          ">
            Newly Assigned Professional
          </div>


          <div style="
            font-size:23px;
            font-weight:700;
            color:#111827;
            margin-bottom:5px;
          ">
            ${testNewHCPName}
          </div>


          <div style="
            font-size:14px;
            color:#64748b;
          ">
            ${testProfessionalType}
          </div>

        </div>


        <!-- ================================================= -->
        <!-- REPLACEMENT DETAILS -->
        <!-- ================================================= -->

        <div style="
          padding:0 30px 10px;
        ">

          <div style="
            background:#f8fafc;
            border:1px solid #e5e7eb;
            border-radius:15px;
            padding:22px;
          ">

            <div style="
              font-size:13px;
              font-weight:700;
              color:#1392d3;
              text-transform:uppercase;
              letter-spacing:.7px;
              margin-bottom:17px;
            ">
              Replacement Details
            </div>


            <table style="
              width:100%;
              border-collapse:collapse;
              font-size:14px;
            ">


              <tr>

                <td style="
                  padding:9px 0;
                  color:#6b7280;
                  width:45%;
                ">
                  Patient
                </td>

                <td style="
                  padding:9px 0;
                  color:#111827;
                  font-weight:600;
                ">
                  ${testPatientName}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:9px 0;
                  color:#6b7280;
                ">
                  Existing Healthcare Professional
                </td>

                <td style="
                  padding:9px 0;
                  color:#64748b;
                  font-weight:600;
                ">
                  ${testExistingHCPName}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:9px 0;
                  color:#6b7280;
                ">
                  New Healthcare Professional
                </td>

                <td style="
                  padding:9px 0;
                  color:#111827;
                  font-weight:700;
                ">
                  ${testNewHCPName}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:9px 0;
                  color:#6b7280;
                ">
                  Professional Type
                </td>

                <td style="
                  padding:9px 0;
                  color:#111827;
                  font-weight:600;
                ">
                  ${testProfessionalType}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:9px 0;
                  color:#6b7280;
                ">
                  Replacement Date
                </td>

                <td style="
                  padding:9px 0;
                  color:#111827;
                  font-weight:600;
                ">
                  ${testReplacementDate}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:9px 0;
                  color:#6b7280;
                ">
                  Replacement Time
                </td>

                <td style="
                  padding:9px 0;
                  color:#111827;
                  font-weight:600;
                ">
                  ${testReplacementTime}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:9px 0;
                  color:#6b7280;
                ">
                  Service Location
                </td>

                <td style="
                  padding:9px 0;
                  color:#111827;
                  font-weight:600;
                ">
                  ${testServiceLocation}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:9px 0;
                  color:#6b7280;
                ">
                  Replacement Reason
                </td>

                <td style="
                  padding:9px 0;
                  color:#111827;
                  font-weight:600;
                ">
                  ${testReplacementReason}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:9px 0;
                  color:#6b7280;
                ">
                  Service Start Date
                </td>

                <td style="
                  padding:9px 0;
                  color:#111827;
                  font-weight:600;
                ">
                  ${testServiceStartDate}
                </td>

              </tr>

            </table>

          </div>

        </div>


        <!-- ================================================= -->
        <!-- SERVICE MESSAGE -->
        <!-- ================================================= -->

        <div style="
          padding:22px 30px 5px;
        ">

          <p style="
            margin:0 0 14px;
            font-size:15px;
            line-height:26px;
            color:#4b5563;
          ">

            Our placement team has completed the necessary
            coordination for this replacement. The newly assigned
            healthcare professional will take over the required
            responsibilities from the scheduled replacement date.

          </p>


          <p style="
            margin:0;
            font-size:15px;
            line-height:26px;
            color:#4b5563;
          ">

            Our dedicated team will continue to coordinate the service,
            monitor the care experience, and remain available for
            operational support whenever required.

          </p>

        </div>


        <!-- ================================================= -->
        <!-- ENROLLMENT PDF -->
        <!-- ================================================= -->

        <div style="
          margin:24px 30px;
          padding:19px 20px;
          background:#f8fafc;
          border:1px solid #e2e8f0;
          border-radius:13px;
        ">

          <div style="
            font-size:14px;
            font-weight:700;
            color:#111827;
            margin-bottom:6px;
          ">
            📎 Enrollment & Company Information
          </div>


          <div style="
            font-size:13px;
            line-height:21px;
            color:#64748b;
          ">

            Please find the Curate Health Services Enrollment &
            Company Information PDF attached with this email.

            The document provides information about our services,
            healthcare professionals, service workflow, values,
            care packages, and company contact details.

          </div>

        </div>


        <!-- ================================================= -->
        <!-- SUPPORT -->
        <!-- ================================================= -->

        <div style="
          padding:5px 30px 30px;
        ">

          <p style="
            margin:0 0 16px;
            font-size:14px;
            line-height:23px;
            color:#4b5563;
          ">

            If you have any questions about the replacement or
            require assistance during the transition, please contact
            our Curate Health Services team.

          </p>


          <p style="
            margin:0;
            font-size:14px;
            line-height:24px;
            color:#374151;
          ">

            Warm regards,<br />

            <strong style="color:#111827;">
              Curate Health Services LLP
            </strong>

            <br />

            <span style="color:#6b7280;">
              Experience truly personal, at-home healthcare
            </span>

          </p>

        </div>


        <!-- ================================================= -->
        <!-- FOOTER -->
        <!-- ================================================= -->

        <div style="
          background:#f7f5ef;
          border-top:1px solid #e5e7eb;
          padding:22px 25px;
          text-align:center;
        ">

          <div style="
            font-size:13px;
            line-height:22px;
            color:#4b5563;
          ">

            <strong style="color:#111827;">
              Curate Health Services LLP
            </strong>

            <br />

            📧 info@curatehealth.in
            &nbsp; | &nbsp;
            📞 +91 73860 45569

          </div>


          <div style="
            margin-top:10px;
            font-size:12px;
            line-height:19px;
            color:#6b7280;
          ">

            H. No. 2-117/7-53, Anagha Datta Nilayam,<br />

            2-117/3, Manikonda Road,
            Behind Preetham Hospital,<br />

            OU Colony, Shaikpet,
            Hyderabad, Telangana – 500104

          </div>


          <div style="
            margin-top:13px;
            font-size:11px;
            color:#9ca3af;
          ">

            © 2026 Curate Health Services • All rights reserved.

          </div>

        </div>

      </div>
      `,
    });

    console.log(
      "Replacement Test Email Response:",
      mailResponse.data
    );

    setStatusMessage(
      "Replacement Test Email Sent Successfully ✅"
    );

  } catch (error: any) {

    console.error(
      "Replacement Test Email Error:",
      error?.response?.data || error
    );

    setStatusMessage(
      error?.response?.data?.message ||
      "Failed to Send Replacement Test Email ❌"
    );
  }
};



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
              <button onClick={SentTestEmail} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Send Test Email
              </button>
              <p className="text-xs text-gray-500">
                {employeeName} • {employeeId}
              </p>
            </div>
          </div>
<div className="flex items-center gap-2">
{StatusMessage&&<p
  className={`text-sm px-3 py-2 rounded-md font-medium ${
    StatusMessage.includes("Successfully")
      ? "bg-[#dcfce7] text-[#15803d]"
      : "bg-[#fee2e2] text-[#b91c1c]"
  }`}
>
  {StatusMessage}
</p>}
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-[#dc2626]" />
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
