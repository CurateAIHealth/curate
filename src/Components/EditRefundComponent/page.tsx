import { getDaysBetween, getDaysInMonth } from "@/Lib/Actions";
import { months } from "@/Lib/Content";
import { FileSearch, Info, Minimize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import RefundInvoice from "../RefundInvoice/page";
import axios from "axios";
import { UpdateRefundAmountfromInoice } from "@/Lib/user.action";


type EditRefundProps = {
  initialData?: any;
  onSave?: (data: any) => void;
};
type DayStatus = "P" | "NA" | "HP" | "A";
const EditRefund: React.FC<EditRefundProps> = ({ initialData, onSave }) => {
 const [form, setForm] = useState({
  receiptId: initialData?.receiptId ?? "",
  invoiceId: initialData?.invoiceId ?? "",
  clientName: initialData?.clientName ?? "",
  patientName: initialData?.patientName ?? "",
  clientId: initialData?.ClientId ?? "",
  serviceStartDate: initialData?.serviceStartDate ?? "",
  serviceEndDate: initialData?.serviceEndDate ?? "",
  perDayCharge: Number(initialData?.perDayCharge ?? 0),
  clientPaymentDays: Number(initialData?.clientPaymentDays ?? 0),
  refundRequestDate: initialData?.refundRequestDate ?? "",
  reason: initialData?.reason ?? "",
  refundAmount: Number(initialData?.RefundAmount ?? 0),
  HCAAttendece: initialData?.HCAAttendece ?? [],
  HCAId: initialData?.HCAId ?? "",
});
const Router=useRouter()
 const now = new Date();
const currentYear = now.getFullYear().toString();
const [IsSending,setIsSending]=useState("")
const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
const [showFullMonth,setShowFullMonth]=useState(false)
const [PreviweRefund,setPreviweRefund]=useState(false)
const [attendanceInfo,setAttendenceInfo]=useState<any>()
const [selectedYear, setSelectedYear] = useState(currentYear);
const [selectedMonth, setSelectedMonth] = useState<any>(currentMonth);
const [ShowUpdateAttendece,SetShowUpdateAttendece]=useState(false)
  const [StatusMessage,SetStatusMessage]=useState<any>("")
     const [status, setStatus] =useState<any>('')
  const [ParticularDate,SetParticularDate]=useState<any>()
  const [AttenseceInformation,setAttenseceInformation]=useState<any>()
function DayBadge({ status }: { status: DayStatus }) {
  const Wrapper = ({ children }: any) => (
    <div className="flex items-center justify-center w-full">
      {children}
    </div>
  );

  if (status === "P") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 text-emerald-600 bg-white shadow-sm">
          {status}
        </span>
      </Wrapper>
    );
  }

  if (status === "HP") {
    return (
      <Wrapper>
        <div className="relative w-8 h-8 rounded-full border-2 border-emerald-500 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-semibold text-emerald-600">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-emerald-500" />
          <span className="relative z-10">HP</span>
        </div>
      </Wrapper>
    );
  }

  if (status === "A") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 border-rose-600 text-rose-600 bg-white shadow-sm">
          {status}
        </span>
      </Wrapper>
    );
  }

  if (status === "NA") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 border-gray-500 text-gray-600 bg-white shadow-sm">
          {status}
        </span>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border border-gray-400 text-gray-500 bg-white shadow-sm">
        {status}
      </span>
    </Wrapper>
  );
}
const NumberOfDaysInMonth = getDaysInMonth(
  Number(selectedMonth),
  Number(selectedYear)
);
const processedData = useMemo(() => {
  const days = Array(31).fill(null);

  let pd = 0;
  let ad = 0;
  let hp = 0;

  for (const att of form.HCAAttendece ?? []) {
    if (!att?.AttendenceDate) continue;

    const day = new Date(att.AttendenceDate).getDate() - 1;

    if (day < 0 || day > 30) continue;

    const hcp = att.HCPAttendence === true;
    const admin = att.AdminAttendece === true;

    let status = "A";

    if (hcp && admin) {
      status = "P";
      pd++;
    } else if (hcp || admin) {
      status = "HP";
      hp++;
    } else {
      ad++;
    }

    days[day] = {
      status,
      clientName: att.Client_Name ?? "-",
      hcaName: att.HCA_Name ?? "-",
      UpdatedBy: att.UpdatedBy ?? "-",
      Reason: att.Reason ?? "",
    };
  }

  return {
    days,
    pd,
    ad,
    hp,
  };
}, [form.HCAAttendece]);

console.log ("Check Task Attendece-----",processedData)
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
const formatDateForInput = (date?: string) => {
  if (!date) return "";

  const [day, month, year] = date.split("/");

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};
  const { serviceDays, refundDays, refundAmount } = useMemo(() => {
    if (!form.serviceStartDate || !form.serviceEndDate) {
      return { serviceDays: 0, refundDays: 0, refundAmount: 0 };
    }

    const start = new Date(form.serviceStartDate);
    const end = new Date(form.serviceEndDate);

    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const refundDays = Math.max(days - Number(form.clientPaymentDays), 0);
    const amount = refundDays * Number(form.perDayCharge);

    return { serviceDays: days, refundDays, refundAmount: amount };
  }, [form]);

  const handleSave = () => {
    if (onSave) onSave({ ...form, serviceDays, refundDays, refundAmount });
  };


  const SendInvoice = async () => {
    setIsSending("Please Wait......");
   

    const Client_Id = form.clientId
    const StartDate = form.serviceStartDate
    const ClientRefundAmount = (
          (getDaysBetween(
            form.refundRequestDate,
            form.serviceEndDate
          ) - 1) * form.perDayCharge
        ).toLocaleString("en-IN")
    const RefundData = form.refundRequestDate
    const RefundDays = getDaysBetween(form.refundRequestDate, form.serviceEndDate)-1
    const HCAId = form.HCAId
   
  const result = await UpdateRefundAmountfromInoice(
      Client_Id,
      StartDate,
      Number(ClientRefundAmount.replace(/,/g, "")),
      RefundData,
      RefundDays,
      
      
HCAId

    );
    console.log("Check Update Results------",result)
    if (result.success === false) {
     setIsSending("Failed to update refund information.");
      return
    }
   setIsSending('Updated Information in Db,Sending Invoice to Client.....')
  
    try {
      const element = document.getElementById("RefundInvoice");
  
      if (!element) {
        throw new Error("Invoice HTML not found");
      }
  
  
  
   
  

  
      // ✅ Dynamic import
      const { default: html2pdf } = await import("html2pdf.js");
  
      // ✅ Generate PDF Blob
      const pdfBlob: Blob = await html2pdf()
        .from(element)
        .set({
          margin: 10,
          filename: `Refund-${form.clientName || "document"}.pdf`,
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            logging: false,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .outputPdf("blob");
  
    
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
  
        reader.readAsDataURL(pdfBlob);
  
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result as string);
          } else {
            reject(new Error("Failed to convert PDF to Base64"));
          }
        };
  
        reader.onerror = () => {
          reject(new Error("FileReader error"));
        };
      });
  
    
 const refundAmount = form.clientPaymentDays * form.perDayCharge;

const mailResponse = await axios.post("/api/MailSend", {
  to: "srinivasnew0803@gmail.com",

  subject: `Refund Confirmation from  Curate Health Services`,

    html:`
<div style="
    max-width:720px;
    margin:30px auto;
    background:#ffffff;
    border:1px solid #dbeafe;
    border-radius:20px;
    overflow:hidden;
    font-family:'Segoe UI',Arial,sans-serif;
    box-shadow:0 15px 40px rgba(15,23,42,.08);
">

    <!-- Header -->

    <div style="
        background:linear-gradient(135deg,#1392D3 0%,#50C896 100%);
        padding:38px;
        position:relative;
    ">

    <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        background:#FFFFFF;
        border:1px solid #E5E7EB;
        border-radius:16px;
        border-collapse:separate;
    "
>
    <tr>

        <!-- Logo & Company -->

        <td
            valign="middle"
            style="
                padding:30px;
            "
        >

            <img
                src="https://www.curatehealthservices.com/Icons/UpdateCurateLogo.png"
                alt="Curate Health Services"
                style="
                    height:68px;
                    display:block;
                "
            >

            <div
                style="
                    margin-top:18px;
                    font-size:28px;
                    font-weight:700;
                    color:#1F2937;
                "
            >
                Curate Health Services
            </div>

            <div
                style="
                    margin-top:6px;
                    font-size:14px;
                    color:#6B7280;
                "
            >
                Professional Home Healthcare Services
            </div>

            <div
                style="
                    margin-top:18px;
                    font-size:13px;
                    line-height:22px;
                    color:#6B7280;
                "
            >
                info@curatehealth.in<br>
                www.curatehealthservices.com
            </div>

        </td>

        <!-- Right Side -->

        <td
            width="220"
            align="right"
            valign="top"
            style="
                padding:30px;
            "
        >

            <div
                style="
                    display:inline-block;
                    background:#F8FAFC;
                    border:1px solid #D1D5DB;
                    color:#1392D3;
                    padding:10px 20px;
                    border-radius:30px;
                    font-size:13px;
                    font-weight:700;
                    letter-spacing:2px;
                "
            >
                REFUND RECEIPT
            </div>

            <div
                style="
                    margin-top:24px;
                    width:70px;
                    height:4px;
                    background:#1392D3;
                    margin-left:auto;
                    border-radius:10px;
                "
            ></div>

            <div
                style="
                    margin-top:18px;
                    font-size:13px;
                    color:#6B7280;
                    line-height:22px;
                "
            >
                Official Refund Document
            </div>

        </td>

    </tr>
</table>

    </div>

    <!-- Greeting -->

    <div style="padding:40px;">

        <div style="
            font-size:26px;
            font-weight:700;
            color:#0f172a;
            margin-bottom:10px;
        ">
            Hello ${form.clientName},
        </div>

        <p style="
            margin:0;
            color:#475569;
            font-size:16px;
            line-height:30px;
        ">
Your refund request has been successfully processed. Please find the attached refund invoice for your records. We appreciate your patience and thank you for choosing Curate Health Services.
        </p>

        <!-- Amount Card -->

        <div style="
            margin:35px 0;
            background:linear-gradient(135deg,#ecfeff,#f0fdfa);
            border:2px solid #50C896;
            border-radius:18px;
            text-align:center;
            padding:35px;
        ">

            <div style="
                color:#64748b;
                font-size:13px;
                text-transform:uppercase;
                letter-spacing:3px;
            ">
                Total Refund
            </div>

            <div style="
                font-size:52px;
                color:#0f766e;
                font-weight:700;
                margin-top:14px;
            ">
                ₹${refundAmount.toLocaleString()}
            </div>

            <div style="
                margin-top:10px;
                color:#475569;
                font-size:15px;
            ">
                Amount will be processed to your registered payment method.
            </div>

        </div>

        <!-- Information Card -->

        <div style="
            border:1px solid #e2e8f0;
            border-radius:16px;
            overflow:hidden;
            margin-bottom:30px;
        ">

            <div style="
                background:#1392D3;
                color:white;
                padding:15px 20px;
                font-size:17px;
                font-weight:600;
            ">
                Refund Details
            </div>

            <table
                width="100%"
                cellpadding="16"
                cellspacing="0"
                style="
                    border-collapse:collapse;
                    font-size:15px;
                "
            >

                <tr style="background:#ffffff;">
                    <td width="45%" style="color:#64748b;">Invoice Reference</td>
                    <td><strong>INV-2026-017</strong></td>
                </tr>

                <tr style="background:#f8fafc;">
                    <td style="color:#64748b;">Refund Date</td>
                    <td>${form.refundRequestDate}</td>
                </tr>

                <tr>
                    <td style="color:#64748b;">Client Name</td>
                    <td>${form.clientName}</td>
                </tr>

                <tr style="background:#f8fafc;">
                    <td style="color:#64748b;">Service Start Date</td>
                    <td>${form.serviceStartDate}</td>
                </tr>

                <tr>
                    <td style="color:#64748b;">Service End Date</td>
                    <td>${form.serviceEndDate}</td>
                </tr>

               

             

              

               

            </table>

        </div>

        <!-- Reason -->


        <!-- Thank You -->

        <div style="
            background:#f8fafc;
            border-radius:14px;
            padding:24px;
        ">

            <div style="
                color:#0f172a;
                font-size:18px;
                font-weight:600;
                margin-bottom:10px;
            ">
                Thank You ❤️
            </div>

            <div style="
                color:#475569;
                line-height:28px;
                font-size:15px;
            ">
                Thank you for choosing Curate Health Services. If you have any questions regarding this refund, our support team will be happy to assist you.
            </div>

        </div>

        <!-- Signature -->

        <div style="
            margin-top:40px;
            border-top:1px solid #e2e8f0;
            padding-top:30px;
        ">

            <div style="
                color:#64748b;
                font-size:14px;
            ">
                Best Regards,
            </div>

            <div style="
                color:#1392D3;
                font-size:20px;
                font-weight:700;
                margin-top:8px;
            ">
                Curate Health Services
            </div>

        </div>

    </div>

    <!-- Footer -->

    <div style="
        background:#0f172a;
        color:#cbd5e1;
        text-align:center;
        padding:26px;
        font-size:13px;
        line-height:24px;
    ">

        <div style="
            color:#ffffff;
            font-weight:600;
            margin-bottom:8px;
        ">
            Curate Health Services
        </div>

        This is a computer-generated refund confirmation.<br>
        No signature is required.

    </div>

</div>
`,

  pdfBase64: base64.split(",")[1],
});
  
  
    
    setIsSending("Sent Succesfully");
  
    
    } catch (error: any) {
      console.error("SendInvoice Error:", error);
  
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while sending invoice.";
  
      alert(errorMessage);
    } 
  
};

  return (
    <div>
   {form.refundAmount===0?
   
   <div className="flex min-h-[60vh] items-center justify-center px-6">
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 px-8 text-center shadow-sm">
    <div className="rounded-full bg-red-50 p-4">
      <FileSearch className="h-8 w-8 text-red-500" />
    </div>

    <h3 className="mt-5 text-xl font-semibold text-slate-800">
      No Refund Data Found
    </h3>

    <p className="mt-2 max-w-sm text-sm text-slate-500">
      There are currently no refund records available to display.
    </p>
      <button 
        className="w-full cursor-pointer sm:w-auto bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white px-3 py-1 rounded"
        onClick={() => Router.push("/Invoices")}
      >
        Invoice
      </button>
  </div>
  
</div>:
 <div>
 {PreviweRefund?
 <div>
 <div id='RefundInvoice'>
 <RefundInvoice
  company={{
    logo: "/Icons/Curate-logoq.png",
    name: "Curate Health Services",
    address:
      "H.No 2-1177/5, Arsha Datta Nilayam, Hyderabad",
    phone: "+91 9876543210",
    email: "info@curatehealth.in",
    website: "www.curatehealthservices.com",
  }}
  refund={{
    refundId: "RF-2026-001",
    invoiceRef: "INV-2026-017",
    refundDate: form.refundRequestDate,
  }}
  client={{
    clientName:form.clientName,
    patientName:form.patientName,
  }}
  service={{
    startDate: form.serviceStartDate,
    endDate: form.serviceEndDate,
    serviceDays: getDaysBetween(form.serviceStartDate, form.serviceEndDate),
    usedDays: getDaysBetween(form.serviceStartDate, form.refundRequestDate),
    refundDays: getDaysBetween(form.refundRequestDate, form.serviceEndDate) - 1,
    perDayCharge: form.perDayCharge,
  }}
  amount={(
          (getDaysBetween(
            form.refundRequestDate,
            form.serviceEndDate
          ) - 1) * form.perDayCharge
        ).toLocaleString("en-IN")}
  reason="Service stopped before completion."
/>
</div>
<button
  onClick={SendInvoice}
 
  className="w-full h-11 rounded-xl bg-[#00A9A5] hover:bg-[#008B88] text-[#FFFFFF] font-semibold flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] disabled:bg-[#94A3B8] disabled:cursor-not-allowed"
>
  {IsSending !== "" ? IsSending : "Send as E-Mail"}
</button>
</div>
:
    <div className="bg-slate-50 mx-auto  p-8 rounded shadow">
     <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
  
  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
    <img
      src="Icons/Curate-logoq.png"
      onClick={() => Router.push("/DashBoard")}
      className="h-16 w-auto cursor-pointer sm:h-20"
      alt="Curate Health"
    />

    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
        Curate Health Services • Refund
      </p>

      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Edit Refund Details
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
        Review customer, services and payment summary before generating the
        invoice.
      </p>
    </div>
  </div>


  <button
    onClick={() => Router.push("/Invoices")}
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#00A9A5] to-[#005f61] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-[#01cfc7] hover:to-[#00403e] active:scale-[0.98] sm:w-auto sm:min-w-[160px]"
  >
    Invoice
  </button>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* <div className="flex flex-col gap-2">
    <label htmlFor="receiptId" className="text-sm font-semibold text-slate-700">
      Receipt ID
    </label>
    <input
      id="receiptId"
      name="receiptId"
      placeholder="Enter receipt ID"
      value={form.receiptId}
      onChange={handleChange}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/20"
    />
  </div>

  <div className="flex flex-col gap-2">
    <label htmlFor="invoiceId" className="text-sm font-semibold text-slate-700">
      Invoice ID
    </label>
    <input
      id="invoiceId"
      name="invoiceId"
      placeholder="Enter invoice ID"
      value={form.invoiceId}
      onChange={handleChange}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/20"
    />
  </div> */}
{showFullMonth && (
<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 md:p-4">
  <div className="bg-white w-full sm:w-[90vw] md:w-[80vw] lg:w-[60vw] h-[85vh] sm:h-[82vh] md:h-[80vh] lg:h-[76vh] max-w-4xl rounded-xl shadow-xl overflow-hidden flex flex-col">
    <div className="flex items-center justify-between px-4 py-3  shrink-0">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow">
          <img
            src="/Icons/Curate-logoq.png"
            alt="Company Logo"
            className="h-6 w-6 object-contain"
          />
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#ff1493] font-semibold">
           {attendanceInfo.hcpName}
          </p>
          <h2 className="text-lg md:text-xl font-bold text-slate-800">
            Attendance Dashboard 
          </h2>
       
        </div>
      </div>

      <button
        onClick={() => setShowFullMonth(false)}
        className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
      >
        <Minimize2 size={16} />
      </button>
    </div>

    <div className="flex-1 p-2 md:p-3">
      <div className="grid grid-cols-7 gap-2 h-full">
        {Array.from({ length: NumberOfDaysInMonth }, (_, i) => {
          const today = new Date().getDate();
          const dayInfo = attendanceInfo.days?.[i];
          
          const clientName = dayInfo?.clientName ?? "";
          const UpdatedBy = dayInfo?.UpdatedBy ?? "-";
          const AbsentReason=dayInfo?.Reason?? "-";
          console.log("Check For ReplaesMent Date------",attendanceInfo)
          const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

const cellDate = new Date(
  Number(selectedYear),
  Number(selectedMonth) - 1,
  i + 1
);
cellDate.setHours(0, 0, 0, 0);

const isFutureDate = cellDate > currentDate;

const startDate = attendanceInfo?.startDate
  ? (() => {
      const [day, month, year] = attendanceInfo.startDate
        .split("/")
        .map(Number);

      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      return date;
    })()
  : null;

const isBeforeStartDate =
  startDate && cellDate < startDate;
const dayStatus = isBeforeStartDate
  ? "-"
  : dayInfo?.status ?? "-";
const replacementDate = attendanceInfo?.ReplacementDate
  ? new Date(attendanceInfo.ReplacementDate)
  : null;

replacementDate?.setHours(0, 0, 0, 0);

const isBeforeReplacementDate =
  replacementDate && cellDate <= replacementDate;


const isDisabled:any = isFutureDate || isBeforeReplacementDate||isBeforeStartDate;

          return (
            <div
              key={i}
              className=" rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col items-center justify-center p-1 "
            >
              <span className="text-[10px] font-semibold text-gray-500 uppercase">
                Day {i + 1} 
              </span>

              {dayStatus === "-" ? (
                <>
                  <div className=" rounded-full bg-gray-100 flex items-center justify-center mt-1">
                     <span
                className={`text-[8px] w-fit font-medium font-semibold px-2 py-1 rounded bg-gray-300 text-gray-500 border-gray-300`}
              >
             Not Marked 
              </span>
                  </div>

                  <span className="text-[8px] text-gray-400 truncate max-w-[70px]">
                    {clientName}
                  </span>

                  <button
                    disabled={isDisabled}
                    onClick={() => {
                      if (isDisabled) return;
                      SetShowUpdateAttendece(!ShowUpdateAttendece);
                      setAttenseceInformation(attendanceInfo);
                      SetParticularDate(i + 1);
                      setStatus("Choose");
                      SetStatusMessage("");
                    }}
                    className={`text-[8px] px-2 py-[2px] rounded-full mt-1 ${
                      isDisabled
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-slate-700 text-white hover:bg-slate-800"
                    }`}
                  >
                    Update 
                  </button>
                </>
              ) : (
                <>
                  <DayBadge status={dayStatus} />

                  {clientName && (
                    <span className="text-[8px] text-center leading-tight px-1 line-clamp-2">
                      {clientName}
                    </span>
                  )}

                {UpdatedBy && UpdatedBy !== "-" && (
  <div className="relative group mt-1">
    <div className="p-[2px] rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
      <Info className="w-3 h-3 text-gray-500" />
    </div>

    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-2 rounded whitespace-nowrap z-50">
      <div>Marked by: {UpdatedBy}</div>

      {AbsentReason && dayStatus!=="P" && (
        <div className="mt-1 border-t border-gray-700 pt-1">
          Reason: {AbsentReason}
        </div>
      )}
    </div>
  </div>
)}

                  <button
                    disabled={isDisabled}
                    onClick={() => {
                      if (isDisabled) return;
                      SetShowUpdateAttendece(!ShowUpdateAttendece);
                      setAttenseceInformation(attendanceInfo);
                      SetParticularDate(i + 1);
                      setStatus("Choose");
                      SetStatusMessage("");
                    }}
                    className={`text-[8px] px-2 py-[2px] rounded-full mt-1 ${
                      isDisabled
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-slate-700 text-white hover:bg-slate-800"
                    }`}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>
)}
 <div className="flex flex-col gap-2">
  <label htmlFor="clientName" className="text-sm font-semibold text-slate-700">
    Client Name
  </label>
  <input
    id="clientName"
    name="clientName"
    placeholder="Enter client name"
    value={form.clientName}
    onChange={handleChange}
    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/20"
  />
</div>

<div className="flex flex-col gap-2">
  <label htmlFor="patientName" className="text-sm font-semibold text-slate-700">
    Patient Name {form.patientName}
  </label>
  <input
    id="patientName"
    name="patientName"
    placeholder="Enter patient name"
    value={form.patientName}
    onChange={handleChange}
    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/20"
  />
</div>
</div>


<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

  <div className="flex flex-col gap-2">
    <label htmlFor="serviceStartDate" className="text-sm font-semibold text-slate-700">
      Service Start Date 
    </label>
    <input
      id="serviceStartDate"
      type="date"
      name="serviceStartDate"
      value={formatDateForInput(form.serviceStartDate)}
      onChange={handleChange}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/20"
    />
  </div>

  <div className="flex flex-col gap-2">
    <label htmlFor="serviceEndDate" className="text-sm font-semibold text-slate-700">
      Service End Date
    </label>
    <input
      id="serviceEndDate"
      type="date"
      name="serviceEndDate"
      value={formatDateForInput(form.serviceEndDate)}
      onChange={handleChange}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/20"
    />
  </div>

</div>


<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">

  <div className="flex flex-col gap-2">
    <label htmlFor="perDayCharge" className="text-sm font-semibold text-slate-700">
      Service Charge <span className="text-slate-500">(Per Day)</span>
    </label>
    <input
      id="perDayCharge"
      type="number"
      name="perDayCharge"
      placeholder="Enter per day charge"
      value={form.perDayCharge}
      onChange={handleChange}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/20"
    />
  </div>

  <div className="flex flex-col gap-2">
    <label htmlFor="clientPaymentDays" className="text-sm font-semibold text-slate-700">
      Refund Days
    </label>
    <input
      id="clientPaymentDays"
      type="number"
      name="clientPaymentDays"
      placeholder="Enter refund days"
      value={getDaysBetween(form.refundRequestDate,form.serviceEndDate)-1}
      onChange={handleChange}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/20"
    />
  </div>

  <div className="flex flex-col gap-2">
    <label htmlFor="refundRequestDate" className="text-sm font-semibold text-slate-700">
      Refund Date
    </label>
    <input
      id="refundRequestDate"
      type="date"
      name="refundRequestDate"
      value={form.refundRequestDate}
      onChange={handleChange}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/20"
    />
  </div>

</div>


<div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">


<div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-6 shadow-sm">
  <div className="mb-5 flex items-center justify-between">
    <h3 className="text-lg sm:text-xl font-semibold text-[#0F172A]">
      Refund Summary
    </h3>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

    {/* Service Days */}
    <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-sm transition-all hover:shadow-md">
      <p className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
        Service Days
      </p>

      <p className="mt-3 text-2xl sm:text-3xl font-bold text-[#0F172A] break-words">
        {getDaysBetween(form.serviceStartDate, form.refundRequestDate)}
      </p>
    </div>

    {/* Service Bill */}
    <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-sm transition-all hover:shadow-md">
      <p className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
        Service Bill
      </p>

      <p className="mt-3 text-2xl sm:text-3xl font-bold text-[#0F172A] break-words">
        ₹
        {(
          getDaysBetween(
            form.serviceStartDate,
            form.refundRequestDate
          ) * form.perDayCharge
        ).toLocaleString("en-IN")}
      </p>
    </div>

    {/* Refund Days */}
    <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 shadow-sm transition-all hover:shadow-md">
      <p className="text-xs font-medium uppercase tracking-wider text-[#B45309]">
        Refund Days
      </p>

      <p className="mt-3 text-2xl sm:text-3xl font-bold text-[#D97706] break-words">
        {getDaysBetween(form.refundRequestDate, form.serviceEndDate) - 1}
      </p>
    </div>

    {/* Refund Amount */}
    <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 shadow-sm transition-all hover:shadow-md sm:col-span-2 xl:col-span-1">
      <p className="text-xs font-medium uppercase tracking-wider text-[#DC2626]">
        Refund Amount
      </p>

      <p className="mt-3 text-2xl sm:text-3xl font-bold text-[#DC2626] break-words">
        ₹
        {(
          (getDaysBetween(
            form.refundRequestDate,
            form.serviceEndDate
          ) - 1) * form.perDayCharge
        ).toLocaleString("en-IN")}
      </p>
    </div>

  </div>
</div>


  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">

    <div>
      <h3 className="text-lg font-semibold text-slate-800">
        HCA Attendance
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Review and adjust the HCA attendance before generating the refund.
        Any attendance changes will automatically update the refund calculation.
      </p>
    </div>

    <button
      onClick={() => {  
     setShowFullMonth(true)
     setAttendenceInfo(processedData)
      }}
      className="mt-6 w-full rounded-xl bg-teal-600 px-5 py-3.5 font-semibold text-white cursor-pointer shadow-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]"
    >
      Adjust HCA Attendance
    </button>

  </div>

</div>


<div className="mt-6">
  <label
    htmlFor="reason"
    className="mb-2 block text-sm font-semibold text-slate-700"
  >
    Reason for Refund
  </label>

  <textarea
    id="reason"
    name="reason"
    rows={5}
    value={form.reason}
    onChange={handleChange}
    placeholder="Enter the reason for refund..."
    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition resize-none focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/20"
  />
</div>


<div className="mt-8">
  <button
    className="w-full rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
    onClick={()=>setPreviweRefund(true)}
  >
    Preview
  </button>
</div>
      </div>}</div>}
       
       
       </div>
  );
};

export default EditRefund;