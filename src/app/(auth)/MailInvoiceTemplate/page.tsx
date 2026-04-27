"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {  getBase64Image, getDaysBetween } from "@/Lib/Actions";
import ReusableInvoice from "@/Components/InvioseTemplate/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SaveInvoiceData, UpdateInvoice, UpdateInvoiceData, UpdateInvoisefromDb } from "@/Lib/user.action";
import { Plus,CircleX } from "lucide-react";
import { paymentData, serviceOptions } from "@/Lib/Content";
import RefundReceipt from "@/Components/RefundReceipt/page";
import EditRefund from "@/Components/EditRefundComponent/page";
import { addDays, formatToDDMMYYYY, getMonthYear, toInputDateFormat } from "@/Redux/action";
import DatePopup from "@/Components/MissingDateRange/page";

{/* <RefundReceipt
        receiptId="REF#2026_1"
        invoiceId="INV#2026_2"
        patientName="B. Satya Narayana"

        serviceStartDate="2026-01-01"
        serviceEndDate="2026-01-31"

        perDayCharge={833.3}
        clientPaymentDays={20}

        refundRequestDate="05/02/2026"
        reason="Client discontinued service"

        company={{
          name: "Curate Health Services LLP",
          address: "15/10030, Brindavanam Colony",
          city: "Beeramguda",
          state: "Telangana 502032",
          logo:      "https://curate-pearl.vercel.app/Icons/UpdateCurateLogo.png"
        }}

        bankDetails={{
          bankName: "UCO Bank",
          accountHolder: "B. Satya Narayana",
          accountNumber: "01140210002278",
          ifsc: "UCBA0000114",
          branch: "Beeramguda",
          city: "Hyderabad",
          state: "Telangana"
        }} clientName={""}/> */}

type RoundType = "none" | "nearest" | "up" | "down";

export default function InvoiceForm() {
  const InvoiceData = useSelector((state: any) => state.InvoiceInfo);
  const [isEditing, setIsEditing] = useState(false);


  const [ShowServices,setShowServices]=useState(false)
  const [otherExpenses, setOtherExpenses] = useState<any>();
  const [discountType, setDiscountType] = useState<"flat" | "percent">("flat");
  const [discountValue, setDiscountValue] = useState<any>();
  const [roundType, setRoundType] = useState<RoundType>("none");
  const [Mailstatus,setMailstatus]=useState(true)
  const [ShowRefundReceipt,setShowRefundReceipt]=useState(false)
  const [selectedService, setSelectedService] = useState<any>(null);
   const [ShowDateRangePopUp,setShowDateRangePopUp]=useState(false)
  const [StatusMessage,setStatusMessage]=useState<any>("")
const [otherService, setOtherService] = useState({
  name: "",
  code:"Other",
  amount: "",
});

  const Router=useRouter()
    const refundData = {
    receiptId: "RR-001",
    invoiceId: "INV-100",
    clientName: "Ravi Kumar",
    serviceStartDate: "2026-03-01",
    serviceEndDate: "2026-03-10",
    perDayCharge: 1200,
    clientPaymentDays: 7,
    refundRequestDate: "2026-03-12",
    reason: "Service stopped early"
  };
  const [ShowMailTemplate, setShowMailTemplate] = useState(true);
const [isSending, setIsSending] = useState(false);
const [selected, setSelected] = useState<any>({
  typeOfPayment: "",
  taxType: "",
  section: "",
  tdsRate: ""
});
const { month, year } = getMonthYear(InvoiceData?.StartDate);
  const invoice = {
    number:`INV_${month}_${year}`,
    ServiceCharge:InvoiceData.CareTakeCharge,
    date: InvoiceData?.StartDate,
    dueDate: addDays(InvoiceData?.StartDate, 7),
    serviceFrom: InvoiceData?.StartDate,
    serviceTo: InvoiceData?.ServiceEndDate,
    status: InvoiceData?.status,
  };

  const billTo = {
    title: InvoiceData?.title,
    Patienttitle: InvoiceData?.Patienttitle,
    name: InvoiceData?.ClientName,
    patientName: InvoiceData?.name,
    contact: InvoiceData?.contact,
    email: InvoiceData?.Email,
    addressLines: InvoiceData?.Adress,
  };

  const start = InvoiceData?.StartDate;
  const end = InvoiceData?.ServiceEndDate;

  const days = getDaysBetween(start, end);
const [formData, setFormData] = useState<any>({
      billTo: billTo || {},
    invoice: invoice || {},
    days: getDaysBetween(start, end) || "",
});


  const handleSelect = (e:any) => {
    const item:any = paymentData.find(
      (p) => p.typeOfPayment === e.target.value
    );
    setSelected(item);
  };

 
  
  const perDay = Number(InvoiceData?.CareTakeCharge?.replace("₹", "") || 0);

  const regFee = Number(InvoiceData?.RegistrationFee || 0);
  const advance = Number(InvoiceData?.AdvanceReceived || 0);


  const baseTotal = Number(days) * Number(perDay) + Number(regFee);

  const discountAmount =
    discountType === "percent"
      ? (baseTotal * Number(discountValue || 0)) / 100
      : Number(discountValue || 0);

  const rawTotal = baseTotal + Number(otherExpenses || 0) - discountAmount;

  let finalTotal = rawTotal;

  // if (roundType === "up") finalTotal = Math.ceil(rawTotal);
  // if (roundType === "down") finalTotal = Math.floor(rawTotal);
  // if (roundType === "nearest") finalTotal = Math.round(rawTotal);
const [services, setServices] = useState([
    { name: "Healthcare Assistant Service", code: "HCAS",amount:Number(days) * Number(perDay)},
  ]);
  const roundingDifference = finalTotal - rawTotal;
  const balanceDue:any = finalTotal - advance;



  const items = [
    {
      description: "Care Taker Service",
      days,
      rate: perDay,
      amount: perDay,
    },
  ];
const TaxAmount:any=balanceDue.toFixed(2)*Number(selected?.tdsRate?.replace("%", ""))/100
  const totals = {
    BaseAmount: 20000,
    OtherExpenses: otherExpenses,
    Discount: discountAmount,
    total: rawTotal,
    RoundedTotal: finalTotal,
    RoundingDifference: roundingDifference,
    AdvancePaid: advance,
    Tax:TaxAmount,
    balanceDue: balanceDue+Number(TaxAmount),
    RegistraionFee:regFee
  };

 
  const updateService = (index: number, selectedCode: string) => {
  const selected: any = serviceOptions.find((opt) => opt.code === selectedCode);
  if (!selected) return;

  setServices((prev: any) => {
    const updated = [...prev];
    updated[index] = {
      ...updated[index],
      name: selected.name,
      code: selected.code,
      amount: selected.amount, 
    };
    return updated;
  });
};


  const invoiceProps = {
    invoice: {
      number: InvoiceData?.id,
      date: InvoiceData?.StartDate,
      dueDate: InvoiceData?.ServiceEndDate,
      serviceFrom: InvoiceData?.StartDate,
      serviceTo: InvoiceData?.ServiceEndDate,
      terms: "7 Days",
    },

    billTo: billTo,

   items: services.map((srv, index) => {
  if (index === 0) {
    
    return {
      description: `${srv.name} for ${InvoiceData?.name}`,
      days,
      rate: perDay,
      amount: perDay * days,
    };
  } else {
   
    return {
      description: `${srv.name} Package`,
      days: "-",
      rate: srv.amount,
      amount: srv.amount,
    };
  }
}),


    totals,
  };

const serviceAmount = services.reduce(
  (total: number, service: any) => total + Number(service.amount || 0),
  0
);

const handleSubmit = async () => {

  if(!formData.billTo?.email){
setShowDateRangePopUp(true)
return

  }
  setIsSending(true);   
  setShowMailTemplate(false);

  setTimeout(async () => {
    const element = document.getElementById("invoice-pdf-area");

    if (!element) {
      alert("Invoice HTML not found!");
      setIsSending(false); 
      return;
    }
const save = await UpdateInvoiceData(
invoice.number,
  {
    invoice: invoiceProps.invoice,
    billTo: invoiceProps.billTo,
    items: invoiceProps.items,
    totals: invoiceProps.totals,
  });


 
  const { default: html2pdf } = await import("html2pdf.js");

const pdfBlob = await html2pdf()
  .from(element)
  .set({
    margin: 10,
    filename: "invoice.pdf",
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  })
  .outputPdf("blob");

    // ✅ Convert blob → base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
    });


  


    // const pdfResponse = await axios.post("/api/generate-pdf", { html });


// const Imagb64:any= await getBase64Image("https://www.curatehealthservices.com/Icons/UpdateCurateLogo.png")
//     const pdfBase64 = pdfResponse.data.pdf;

    await axios.post("/api/MailSend", {
      to:"tsiddu805@gmail.com",
      subject:
        "Request for Payment – Attached Invoice from Curate Health Services",
   html: `<div style="
  width: 100%;
  max-width: 680px;
  margin: auto;
  background: #f7f5ef;
  border-radius: 14px;
  border: 2px solid #c6c2b8;
  font-family: 'Segoe UI', sans-serif;
  overflow: hidden;
">


  <div style="text-align:center; padding: 25px 20px;">
    <img
          src="https://www.curatehealthservices.com/Icons/UpdateCurateLogo.png""
          alt="Curate Health Services Logo"
          style="height: 90px; width: auto;"

        />
    <p style="margin:6px 0 0 0; font-size:14px; color:#1392d3;">
    Invoice Receipt
    </p>
  </div>

  <div style="border-top: 2px solid #c6c2b8;"></div>


  <div style="padding: 30px 25px;">

   
    <div style="
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      align-items: start;
    ">

      
      <div>
        <p style="margin:0; font-size:14px; color:#444;">AMOUNT DUE</p>
        <h1 style="margin-top:8px; font-size:42px; font-weight:700; color:#000;">
   ₹${(Number(balanceDue) + Number(TaxAmount)).toFixed(2)}

        </h1>
      </div>

     
      <div style="font-size:15px; color:#444; line-height:24px;">
        <strong>Invoice No:</strong> ${invoice.number} <br>
        <strong>Issued:</strong> ${invoice.date} <br>
   

        <strong style="color:#000;">Dear Customer,</strong><br>
        Please find your invoice attached.<br>
        Kindly complete the payment at the earliest.
      </div>

     
      <div style="text-align:center;">
        <div style="margin-bottom:20px;">
          <a href="https://curate-pearl.vercel.app/upi-pay?amount=${(Number(balanceDue) + Number(TaxAmount)).toFixed(2)}"
            style="
              background:#50c896;
              color:white;
              padding:18px 30px;
              text-decoration:none;
              border-radius:50px;
              font-size:18px;
              font-weight:700;
              display:inline-block;
              width:150px;
            ">
            PAY NOW
          </a>
        </div>

        <p style="font-size:15px; color:#333; margin-top:20px;">
          Regards,<br>
          <strong>Curate Health Services</strong>
        </p>
      </div>

    </div> 

  </div>
</div>
`,

     pdfBase64: base64.split(",")[1],
    });

const UpdateInvoiceStatus=await UpdateInvoice(invoice.number)
if(UpdateInvoiceStatus?.success===true){
  setMailstatus(false)
}
    
  }, 100);
};

// const handleSubmit = async () => {
//   try {
//     setIsSending(true);
//     setShowMailTemplate(false);

//     const element = document.getElementById("invoice-pdf-area");

//     if (!element) {
//       alert("Invoice HTML not found!");
//       return;
//     }

//     const save = await UpdateInvoiceData(invoice.number, {
//       invoice: invoiceProps.invoice,
//       billTo: invoiceProps.billTo,
//       items: invoiceProps.items,
//       totals: invoiceProps.totals,
//     });


//     const html = element.outerHTML;

//     // 👉 ADD DEBUG HERE
//     

//     const pdfResponse = await axios.post("/api/generate-pdf", { html });



//     const pdfBase64 = pdfResponse.data.pdf;

//     await axios.post("/api/MailSend", {
//       to: "tsiddu805@gmail.com",
//       subject:
//         "Request for Payment – Attached Invoice from Curate Health Services",
//       html: `...your template...`,
//       pdfBase64,
//     });

//     const UpdateInvoiceStatus = await UpdateInvoice(invoice.number);

//     if (UpdateInvoiceStatus?.success === true) {
//       setMailstatus(false);
//     }

//   } catch (error:any) {
//     console.error("FULL FRONTEND ERROR:", error);
//     console.error("SERVER ERROR:", error?.response?.data);

//     alert("Failed to send invoice");
//   } finally {
//     setIsSending(false);
//   }
// };
const NavigatetoInvoices=()=>{
  Router.push("/Invoices")
}
const removeService = (code: string) => {
  setServices((prev: any[]) =>
    prev.filter(service => service.code !== code)
  );
};
const addOtherService = () => {
  if (!otherService.name || !otherService.amount) return;

  setServices((prev: any[]) => [
    ...prev,
    {
      name: otherService.name,
      code: "Other",
      amount: Number(otherService.amount),
    },
  ]);

  
  setOtherService({ name: "",   code:"Other",amount: "" });
  setSelectedService(null);
};

  const handleChange = (key: any, value: any) => {
    setFormData((prev:any) => ({
      ...prev,
      [key]: value,
    }));
  };

 const updateInvoice = async () => {
  try {
    setStatusMessage("Updating invoice...");
  
    
    const payload = {
      invoiceNumber: formData.invoice?.number || "",
      clientId: InvoiceData?.ClienId || "",
      deployDate: InvoiceData?.DeployDate || "",
      startDate: InvoiceData?.StartDate || "",
      endDate: InvoiceData?.ServiceEndDate || "",

      clientName: formData.billTo?.name || "",
      patientName: formData.billTo?.patientName || "",
      contact: formData.billTo?.contact || "",
      email: formData.billTo?.email || "",
      address: formData.billTo?.addressLines || "",

     invoiceDate: formatToDDMMYYYY(invoice?.date),
  serviceStartDate: formatToDDMMYYYY(formData.invoice?.serviceFrom),
  serviceEndDate: formatToDDMMYYYY(formData.invoice?.serviceTo),
    };


    const res = await UpdateInvoisefromDb(payload);

    if (!res.success) {
      throw new Error(res.message);
    }

    setStatusMessage("Invoice updated successfully");
    setTimeout(()=>{
      Router.push("/Invoices")
    },2500)
    setIsEditing(false);
  } catch (err: any) {
    console.error(err);
    setStatusMessage(err.message || "Something went wrong");
  }
};

  const getStatusStyles = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-700 border-gray-200";
    if (status.toLowerCase() === "draft")
      return "bg-yellow-50 text-yellow-800 border-yellow-200";
    if (status.toLowerCase() === "overdue")
      return "bg-red-50 text-red-700 border-red-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  return (
    <div>
{ShowRefundReceipt?<EditRefund initialData={refundData} />:







   
   <>{isSending && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    {Mailstatus?
    <div className="bg-white shadow-xl rounded-2xl px-8 py-6 text-center w-[90%] max-w-sm">
      <div className="animate-spin h-10 w-10 border-4 border-slate-300 border-t-slate-900 rounded-full mx-auto mb-4"></div>

      <h2 className="text-lg font-semibold text-slate-800">
        Please Wait…
      </h2>
      <p className="text-sm text-slate-500 mt-1">
        Sending Invoice Email
      </p>
    </div>:<div className="bg-white shadow-xl rounded-2xl px-4 py-6 text-center w-[90%] ">


  <div className="flex items-center justify-center mb-4">
    <svg
      className="h-14 w-14 text-green-600 animate-[tick_0.5s_ease-out_forwards]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  </div>

  <h2 className="text-lg font-semibold text-slate-800">
    Invoice Sent Successfully
  </h2>

  <p className="text-sm text-slate-500 mt-1">
    The invoice email has been delivered.
  </p>

<button className="px-6 py-3 border cursor-pointer border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-blue-50 transition" onClick={NavigatetoInvoices}>
  Go to Invoices
</button>

</div>}
  </div>
  
)}
{ShowMailTemplate?    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

    <div className="w-full border rounded-md bg-white shadow-sm px-3 py-2">
  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">

    <button 
      className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition"
      onClick={() => {setIsEditing(true),setStatusMessage("")}}
    >
      ✏️ <span>Edit</span>
    </button>

    <button className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition">
      📧 <span>Send Email</span>
    </button>

    <button className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition">
      🔗 <span>Share</span>
    </button>

    <button className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition">
      🖨️ <span>PDF/Print</span>
    </button>

    <button 
      className="flex items-center gap-1 hover:text-red-600 cursor-pointer transition"
      onClick={() => setShowRefundReceipt(!ShowRefundReceipt)}
    >
      💸 <span>Refund</span>
    </button>

    <div className="w-full sm:w-auto sm:ml-auto">
      <button 
        className="w-full cursor-pointer sm:w-auto bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white px-3 py-1 rounded"
        onClick={() => Router.push("/Invoices")}
      >
        Invoice
      </button>
    </div>

  </div>
</div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                 <DatePopup
                  isOpen={ShowDateRangePopUp}
                title="Client Email Required"
message="Please provide the client’s email address to send the invoice."
                  onClose={() => setShowDateRangePopUp(false)}
                />
          <div className="flex items-center gap-2 ">
         <img src="Icons/Curate-logoq.png" onClick={()=>Router.push("/DashBoard")}  className="h-20 w-auto"/>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Curate Health Services • Invoice
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900 tracking-tight">
              Invoice Preview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review customer, services and payment summary before generating the invoice.
            </p>
          </div>
</div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase text-slate-500">Invoice ID</span>
              {isEditing? <input
              className="w-fit text-center  text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={formData.invoice.number  || ""}
             onChange={(e) =>
          setFormData((prev:any) => ({
            ...prev,
            invoice: { ...prev.invoice, number: e.target.value },
          }))
        }
              placeholder="invoice number"
            />:<span className="px-3 py-1 rounded-full bg-slate-900 text-white text-sm font-mono">
                {invoice.number || "--"}
              </span>}
              
            </div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusStyles(
                invoice.status
              )}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  invoice.status?.toLowerCase() === "overdue"
                    ? "bg-red-500"
                    : invoice.status?.toLowerCase() === "draft"
                    ? "bg-yellow-400"
                    : "bg-emerald-500"
                }`}
              />
              {invoice.status || "Status: NA"}
            </div>
          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.4fr] gap-6 items-start">

      
          <div className="space-y-6">

            {/* <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">
                  Customer & Patient Information
                  
                </h2>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Profile
                </span>
              </div>

              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoField label="Customer Name" value={billTo.name} />
                <InfoField label="Patient Name" value={billTo.patientName} />
                <InfoField label="Phone Number" value={billTo.contact} />
                <InfoField label="Email" value={billTo.email} />
                <InfoField label="Address" value={billTo.addressLines} />
              </div>

              <div className="border-t border-slate-100 px-6 py-3 grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-50/70">
                <StatItem label="Invoice Date" value={invoice.date || "--"} />
                <StatItem label="Due Date" value={invoice.dueDate || "--"} />
                <StatItem label="Service From" value={invoice.serviceFrom || "--"} />
                <StatItem label="Service To" value={invoice.serviceTo || "--"} />
                 <StatItem label="Days" value={days|| "--"} />
              </div>
            </div> */}

   {StatusMessage && (
  <div
    className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-sm shadow-sm
    ${
      StatusMessage.toLowerCase().includes("successful")
        ? "border border-green-200 bg-green-50 text-green-700"
        : "border border-indigo-200 bg-indigo-50 text-indigo-700"
    }`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-4 h-4 mt-0.5 
        ${
          StatusMessage.toLowerCase().includes("successful")
            ? "text-green-600"
            : "text-indigo-600"
        }`}
    >
      {StatusMessage.toLowerCase().includes("successful") ? (
        // ✅ Success Icon
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 
             9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 
             2.25 12zm13.28-2.03a.75.75 0 10-1.06-1.06l-3.97 
             3.97-1.47-1.47a.75.75 0 00-1.06 1.06l2 
             2a.75.75 0 001.06 0l4.5-4.5z"
          clipRule="evenodd"
        />
      ) : (
        // ℹ️ Default Info Icon
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 
             4.365 9.75 9.75-4.365 9.75-9.75 
             9.75S2.25 17.385 2.25 12zm9.75-4.5a.75.75 
             0 00-.75.75v3.75a.75.75 0 001.5 
             0V8.25a.75.75 0 00-.75-.75zm0 
             9a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clipRule="evenodd"
        />
      )}
    </svg>

    <span>{StatusMessage}</span>
  </div>
)}
 <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">
          Customer & Patient Information
        </h2>

        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <button
                onClick={() => {
                  setFormData({
  billTo,
  invoice,
  days,
});

                  setIsEditing(false);
                }}
                className="text-xs px-3 py-1 rounded-lg bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={updateInvoice}
                className="text-xs px-3 py-1 rounded-lg bg-indigo-600 text-white cursor-pointer"
              >
                Save
              </button>
            </>
          ) }
        </div>
      </div>

     <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-5">
  {isEditing ? (
    <>
      <input
        className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        value={formData.billTo?.name || ""}
        onChange={(e) =>
          setFormData((prev:any) => ({
            ...prev,
            billTo: { ...prev.billTo, name: e.target.value },
          }))
        }
        placeholder="Client Name"
      />

      <input
        className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        value={formData.billTo?.patientName || ""}
        onChange={(e) =>
          setFormData((prev:any) => ({
            ...prev,
            billTo: { ...prev.billTo, patientName: e.target.value },
          }))
        }
        placeholder="Patient Name"
      />

      <input
        className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        value={formData.billTo?.contact || ""}
        onChange={(e) =>
          setFormData((prev:any) => ({
            ...prev,
            billTo: { ...prev.billTo, contact: e.target.value },
          }))
        }
        placeholder="Phone Number"
      />

      <input
        className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        value={formData.billTo?.email || ""}
        onChange={(e) =>
          setFormData((prev:any) => ({
            ...prev,
            billTo: { ...prev.billTo, email: e.target.value },
          }))
        }
        placeholder="Email"
      />

      <input
        className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        value={formData.billTo?.addressLines || ""}
        onChange={(e) =>
          setFormData((prev:any) => ({
            ...prev,
            billTo: { ...prev.billTo, addressLines: e.target.value },
          }))
        }
        placeholder="Address"
      />
    </>
  ) : (
    <>
      <InfoField label="Client Name" value={`${formData.billTo?.title} ${formData.billTo?.name}`} />
      <InfoField label="Patient Name" value={`${formData.billTo?.Patienttitle} ${formData.billTo?.patientName}`} />
      <InfoField label="Phone Number" value={formData.billTo?.contact} />
      <InfoField label="Email" value={formData.billTo?.email} />
      <InfoField label="Address" value={formData.billTo?.addressLines} />
      <InfoField label="Client Charges" value={formData.invoice?.ServiceCharge} />
    </>
  )}
</div>


     <div className="border-t border-slate-100 px-6 py-3 grid grid-cols-2 md:flex items-center justify-between w-full gap-3 bg-slate-50/70">
  {isEditing ? (
    <>
         {/* <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Invoice Date</p>
      <input
        type="date"
        className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        placeholder="Invoice Date"
        value={toInputDateFormat(formData.invoice?.date )|| ""}
        onChange={(e) =>
       {
           alert(e.target.value)
          setFormData((prev:any) => ({
            ...prev,
            invoice: { ...prev.invoice, date: e.target.value },
          }))
       }
        }
      />
      </div> */}
{/* 
      <input
        type="text"
        className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        placeholder="Due Date"
        value={formData.invoice?.dueDate || ""}
        onChange={(e) =>
          setFormData((prev:any) => ({
            ...prev,
            invoice: { ...prev.invoice, dueDate: e.target.value },
          }))
        }
      /> */}
   <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Service From</p>
      <input
        type="date"
        className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        placeholder="Service From"
        value={toInputDateFormat(formData.invoice?.serviceFrom) || ""}
        onChange={(e) =>
          setFormData((prev:any) => ({
            ...prev,
            invoice: { ...prev.invoice, serviceFrom: e.target.value },
          }))
        }
      />
      </div>
   <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Service To</p>
      <input
        type="date"
        className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        placeholder="Service To"
         value={toInputDateFormat(formData.invoice?.serviceTo)}
        onChange={(e) =>
          setFormData((prev:any) => ({
            ...prev,
            invoice: { ...prev.invoice, serviceTo: e.target.value },
          }))
        }
      />
</div>
   <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Days</p>
    <p>{getDaysBetween(formData.invoice?.serviceFrom,formData.invoice?.serviceTo) || ""}</p>
      </div>
   {/* <p className="text-red-600 text-[9px] text-center">
         ⚠️ Enter All Dates  in India Date Formate DD/MM/YYYY
        </p>  */}
        
        </>
  ) : (
    <>
      {/* <StatItem label="Invoice Date" value={formData.invoice?.date || "--"} /> */}
      <StatItem label="Due Date" value={formData.invoice.dueDate || "--"} />
      <StatItem label="Service From" value={formData.invoice.serviceFrom || "--"} />
      <StatItem label="Service To" value={formData.invoice.serviceTo || "--"} />
      <StatItem label="Days" value={getDaysBetween(formData.invoice?.serviceFrom,formData.invoice?.serviceTo)  || "--"} />
    </>
  )}
</div>

    </div>
          
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">Services</h2>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Line Items
                </span>
              </div>

              <div className="px-6 py-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50/80 text-slate-600">
                    <tr>
                      <Th>#</Th>
                      <Th>Service Name</Th>
                      <Th>Service Code</Th>
                      <Th>Change Service</Th>
                      <Th>Amount</Th>
                      <Th>Remove</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((srv, i) => (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/60">
                        <Td>{i + 1}</Td>
                        <Td className="font-medium text-slate-800">{srv.name}</Td>
                        <Td className="font-mono text-xs text-slate-600">{srv.code}</Td>
                        <Td>
                          <select
                            className="border border-slate-200 text-sm px-2 py-1 rounded-lg bg-white"
                            value={srv.code}
                            onChange={(e) => updateService(i, e.target.value)}
                          >
                            {serviceOptions.map((opt, idx) => (
                              <option key={idx} value={opt.code}>
                                {opt.name}
                              </option>
                            ))}
                          </select>
                        </Td>
                        <Td className="font-mono text-xs text-slate-600">{srv.name==="Healthcare Assistant Service"?Number(days) * Number(perDay):srv.amount}</Td>
<Td className="font-mono text-xs text-slate-600 cursor-pointer">
  <CircleX
    className="text-red-600 hover:bg-gray-300 rounded-full p-0.5"
    onClick={() => removeService(srv.code)}
  />
</Td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
             <div className="flex items-center justify-between w-[90%]">
              <div> 
                           <Plus  className="bg-teal-800 p-2 ml-2 mb-2 rounded-md text-white cursor-pointer h-8 w-8" onClick={()=>setShowServices(!ShowServices)}/>
             {ShowServices&&
                
                      <tr className="border-t border-slate-100 hover:bg-slate-50/60">
                        
       <Td>
<select
  className="border border-slate-200 text-sm px-2 py-1 rounded-lg bg-white"
  onChange={(e) => {
    const selected: any = serviceOptions.find(
      (s: any) => s.code === e.target.value
    );
    if (!selected) return;

    setSelectedService(selected);

    if (selected.name !== "Other") {
      setServices((prev: any[]) => [
        ...prev,
        {
          name: selected.name,
          code: selected.code,
          amount: selected.amount,
        },
      ]);
    }
  }}
>
  <option value="">Select Service</option>
  {serviceOptions.map((opt: any, idx) => (
    <option key={idx} value={opt.code}>
      {opt.name}
    </option>
  ))}
</select>
{selectedService?.name === "Other" && (
  <div className="mt-3 grid grid-cols-3 gap-3">
    <input
      type="text"
      placeholder="Service Name"
      className="border border-slate-200 text-sm px-2 py-1 rounded-lg"
      value={otherService.name}
      onChange={(e) =>
        setOtherService(prev => ({ ...prev, name: e.target.value }))
      }
    />

    <input
      type="number"
      placeholder="Amount"
      className="border border-slate-200 text-sm px-2 py-1 rounded-lg"
      value={otherService.amount}
      onChange={(e) =>
        setOtherService(prev => ({ ...prev, amount: e.target.value }))
      }
    />
  <button
  onClick={addOtherService}
  disabled={!otherService.name || !otherService.amount}
  className={`mt-3 w-full text-sm cursor-pointer font-semibold py-2.5 rounded-lg transition
    ${
      !otherService.name || !otherService.amount
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-teal-600 text-white hover:bg-teal-700"
    }`}
>
  Add Service
</button>

  </div>
)}

</Td>


                      </tr>
                    }

                    </div>
                  <p className="mt-4 text-right text-sm text-slate-600">
  Total:
  <span className="ml-2 font-semibold text-teal-700">
    ₹ {serviceAmount}
  </span>
</p>

            </div>

            </div>
          </div>

          
          <div className="space-y-4">
          
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Payment Summary
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900 mt-1">
                    Invoice Amount
         
                  </h2>
                </div>
     
                <div className="text-right">
                  <p className="text-[11px] text-slate-500">Total</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ₹{baseTotal}/-
                  </p>
                  {roundingDifference !== 0 && (
                    <p className="text-[11px] text-slate-500">
                      Adj: {roundingDifference > 0 ? "+" : "-"}₹
                      {Math.abs(roundingDifference).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
           <div className="space-y-4">
      
      <select
        className="border p-1 m-1 rounded w-[99%] bg-gray-100"
        onChange={handleSelect}
      >
        <option>Add Tax</option>
        {paymentData.map((item, index) => (
          <option key={index} value={item.typeOfPayment}>
            {item.typeOfPayment}
          </option>
        ))}
      </select>

 {(selected?.typeOfPayment ||
  selected?.taxType ||
  selected?.section ||
  selected?.tdsRate) && (
  <div className="p-1 m-1 rounded w-[99%] border bg-gray-50">
    {selected?.typeOfPayment && (
      <p><strong>Type of Payment:</strong> {selected.typeOfPayment}</p>
    )}
    {selected?.taxType && (
      <p><strong>Tax Type:</strong> {selected.taxType}</p>
    )}
    {selected?.section && (
      <p><strong>Section:</strong> {selected.section}</p>
    )}
    {selected?.tdsRate && (
      <p><strong>TDS Rate:</strong> {selected.tdsRate}</p>
    )}
  </div>
)}


    </div>
              <div className="px-6 py-4 space-y-3 text-sm">
                <KeyRow label="Base Amount">
                  ₹{baseTotal.toFixed(2)}/-
                </KeyRow>

                <KeyRow label="Other Expenses (₹)">
                  <input
                    type="text"
                    className="border border-slate-200 rounded-lg px-2 py-1 w-28 text-right text-sm"
                    value={otherExpenses||''}
                    onChange={(e) => setOtherExpenses(Number(e.target.value || 0))}
                  />
                </KeyRow>

                <div className="pt-2 border-t border-dashed border-slate-200 space-y-1">
                  <p className="text-xs font-medium text-slate-600">Discount</p>
                  <div className="flex items-center gap-3">
                    <select
                      className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
                      value={discountType}
                      onChange={(e) =>
                        setDiscountType(e.target.value as "flat" | "percent")
                      }
                    >
                      <option value="flat">₹ Flat</option>
                      <option value="percent">% Percent</option>
                    </select>
                    <input
                      type="text"
                      className="border border-slate-200 rounded-lg px-2 py-1 w-24 text-right text-sm"
                      value={discountValue||''}
                      onChange={(e) => setDiscountValue(Number(e.target.value || 0))}
                    />
                    <span className="text-xs text-emerald-700 font-medium">
                      -₹{discountAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <KeyRow label="Raw Total">
                  ₹{Number(rawTotal)}/-
                </KeyRow>

               <KeyRow label="Registration Fee">
                  ₹{regFee}/-
                </KeyRow>

                <KeyRow label="Advance Received">
                  ₹{advance}/-
                </KeyRow>

                  <KeyRow label="Tax">
                  ₹{baseTotal*Number(selected.tdsRate.replace("%", ""))/100}/-
                  
                </KeyRow>

                <KeyRow label="Balance Due" highlight>
                  ₹{Number(balanceDue)+Number(TaxAmount)}/-
                </KeyRow>
              </div>
            </div>

        
            <button
              onClick={handleSubmit}
              className="w-full bg-slate-900 hover:bg-slate-800 cursor-pointer text-white text-sm font-semibold py-3 rounded-xl shadow-sm transition"
            >
              Send E-Mail
            </button>
          </div>
        </div>
      </div>
    </div>:
   <div id="invoice-pdf-area">
      <ReusableInvoice
        invoice={invoiceProps.invoice}
        billTo={invoiceProps.billTo}
        items={invoiceProps.items}
        totals={invoiceProps.totals}
        
      />
    </div>
}
    </>}
     </div>
  );
}



function InfoField({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <div className="text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
        {value || "--"}
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800 mt-0.5">{value || "--"}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left text-xs font-semibold border-b border-slate-200">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-2.5 text-sm text-slate-800 ${className}`}>
      {children}
    </td>
  );
}

function KeyRow({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span
        className={`font-semibold ${
          highlight ? "text-rose-600" : "text-slate-900"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

function RoundPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs border ${
        active
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}


