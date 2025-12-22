import React, { JSX, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDaysBetween, numberToWords } from "@/Lib/Actions";
import { company, payment, serviceOptions, terms } from "@/Lib/Content";
import { Plus } from "lucide-react";
import { UpdateInvoiceData } from "@/Lib/user.action";
import axios from "axios";
import { UpdateInvoiceIntialStatus, UpdateInvoiceStatus } from "@/Redux/action";
import { useRouter } from "next/navigation";

interface InvoiceInfo { number?: string; date?: string; dueDate?: string; terms?: string; serviceFrom?: string; serviceTo?: string; }
interface BillToInfo { name?: string; addressLines?: string; patientName?: string; otherDetails?: string; }
interface ItemRow { description: string; days: number | string; rate: number | string; amount: number | string; }
interface Totals {
  Discount?: any;
  AdvancePaid?: any;
  Tax?: any;
  OtherExpenses?: any;
  RegistraionFee?: any;
  total?: any;
  balanceDue?: any;
  CheckPaymentStatus?:any
}

interface ColorConfig { primary?: string; accent?: string; pink?: string; }
interface Props { invoice?: InvoiceInfo; billTo?: BillToInfo; items?: ItemRow[]; totals?: Totals; colors?: ColorConfig; }

export default function ReusableInvoice({
  invoice = {}, billTo = {}, items = [], totals = {},
  colors = { primary: "#50c896", accent: "#1392d3", pink: "#ff1493" }
}: Props): JSX.Element {


  const InvoiceStatus: boolean = useSelector((s: any) => s.InvoiceEditStatus);


  const [editInvoice, setEditInvoice] = useState<any>(invoice);
  const [editBillTo, setEditBillTo] = useState(billTo);
  const [ShowServices, setShowServices] = useState(false)
  const [selectedService, setSelectedService] = useState("");
  const [isSending, setIsSending] = useState(false);
    const [isSuccess, setisSuccess] = useState(false);
  
  const [editItems, setEditItems] = useState<ItemRow[]>(items);
  const [editTotals, setEditTotals] = useState<Totals>({
    Discount: totals.Discount || 0,
    AdvancePaid: totals.AdvancePaid || 0,
    Tax: totals.Tax || 0,
    OtherExpenses: totals.OtherExpenses || 0,
    RegistraionFee: totals.RegistraionFee || 0,
    total: totals.total || 0,
    balanceDue: totals.balanceDue || 0,
  });
const [initialBalanceDue, setInitialBalanceDue] = useState<number | null>(null);

useEffect(() => {
  if (initialBalanceDue === null && display?.balanceDue !== undefined) {
    setInitialBalanceDue(display.balanceDue);
  }
}, [ initialBalanceDue]);

const dispatch=useDispatch()
const Router=useRouter()
  const updateItem = (i: number, f: keyof ItemRow, value: any) => {
    const arr = [...editItems];
    arr[i][f] = value;

    if (f === "days" || f === "rate") {
      const d = Number(arr[i].days) || 0;
      const r = Number(arr[i].rate) || 0;
      arr[i].amount = (d * r).toFixed(2);
    }
    setEditItems(arr);
    recalcTotals();
  };


  const updateTotals = (f: keyof Totals, value: any) => {
    if (!InvoiceStatus) return;
    const u = { ...editTotals, [f]: +value };

    u.total = (u.RegistraionFee || 0) + (u.OtherExpenses || 0) + (u.Tax || 0) - (u.Discount || 0) - (u.AdvancePaid || 0);
    u.balanceDue = u.total;

    setEditTotals(u);
  }

const recalcTotals = () => {
  
  const itemsTotal = editItems.reduce((sum, item) => {
    return sum + Number(item.amount || 0);
  }, 0);

  const u:any = {
    ...editTotals,
    RegistraionFee: Number(editTotals.RegistraionFee || 0),
    OtherExpenses: Number(editTotals.OtherExpenses || 0),
    Tax: Number(editTotals.Tax || 0),
    Discount: Number(editTotals.Discount || 0),
    AdvancePaid: Number(editTotals.AdvancePaid || 0),
  };

  u.total =
    itemsTotal +
    u.RegistraionFee +
    u.OtherExpenses +
    u.Tax -
    u.Discount -
    u.AdvancePaid;


  u.balanceDue = u.total;

  const oldBalance = Number(totals.balanceDue || 0); 
  const newTotal = Number(u.total);

  const diff = newTotal - oldBalance;

  u.marginStatus =
    diff < 0
      ? { type: "Refund", amount: Math.abs(diff) }
      : diff > 0
      ? { type: "Extra Amount", amount: diff }
      : { type: "Settled", amount: 0 };

  setEditTotals(u);
};



  const display:any = InvoiceStatus ? editTotals : totals;
  const renderItems = InvoiceStatus ? editItems : items;


  const handleSendEmail = async() => {
  setIsSending(!isSending)  
    const InvoiceInformation={...editInvoice,terms:getDaysBetween(editInvoice.date,editInvoice.dueDate)||0}
    console.log("Updated Invoice Info:",InvoiceInformation );
    console.log("Updated Bill To Info:", editBillTo);
    console.log("Updated Items:", editItems);
    console.log("Updated Totals:", editTotals);
    const PostData= {
    invoice:InvoiceInformation ,
    billTo:editBillTo ,
    items: editItems,
    totals:editTotals 
  }
    const UpdateInvoice=await UpdateInvoiceData(invoice.number,PostData)

    if(UpdateInvoice.success===true){
      dispatch(UpdateInvoiceStatus(false))
     setTimeout(async () => {
         const element:any = document?.getElementById("Updated-pdf-area");
     
   if (!element) {
     
    
      setIsSending(false);
      return; 
    }
     
      
         const html = element.outerHTML;
         const pdfResponse = await axios.post("/api/generate-pdf", { html });
         const pdfBase64 = pdfResponse.data.pdf;
     
         await axios.post("/api/MailSend", {
           to: "tsiddu805@gmail.com",
           subject:
             "Here’s Your Updated Invoice 😊 from Curate Health Services",
        html: `<div style="
  max-width:700px;
  margin:auto;
  background:#ffffff;
  border:1px solid #dce3ea;
  border-radius:12px;
  font-family:'Segoe UI', Arial, sans-serif;
  color:#1a1a1a;
">

  <!-- HEADER -->
  <div style="
    background:#f4f7fb;
    border-bottom:1px solid #dce3ea;
    padding:28px 30px;
    text-align:left;
    display:flex;
    align-items:center;
    gap:20px;
  ">
    <img src="https://curate-pearl.vercel.app/Icons/UpdateCurateLogo.png"
         alt="Curate Logo"
         style="height:70px;" />

    <div>
      <h2 style="margin:0; font-size:22px; color:#0d3b66;">
        Updated Invoice – ${invoice.number}
      </h2>
      <p style="margin:4px 0 0; font-size:14px; color:#4b5563;">
        Revised billing details enclosed
      </p>
    </div>
  </div>

  <!-- BODY -->
  <div style="padding:32px 30px;">
    
    <!-- Introduction -->
    <p style="font-size:16px; line-height:26px; margin-top:0;">
      Dear Customer,<br>
      Your invoice has been successfully <strong>updated</strong>.  
      Please review the revised amount and details below.
    </p>

    <!-- INFO CARD -->
    <div style="
      margin-top:25px;
      border:1px solid #e5e7eb;
      border-radius:12px;
      background:#f9fafb;
      padding:25px 20px;
    ">
      <div style="margin-bottom:15px;">
        <p style="margin:0; font-size:14px; color:#6b7280;">Amount Due</p>
        <h1 style="margin:6px 0; font-size:44px; color:#111827; font-weight:700;">
          ₹${Number(totals.balanceDue)}
        </h1>
      </div>

      <table style="width:100%; font-size:15px; color:#374151; line-height:24px;">
        <tr>
          <td style="padding:4px 0; width:160px;"><strong>Invoice No:</strong></td>
          <td>${invoice.number}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;"><strong>Updated On:</strong></td>
          <td>${invoice.date}</td>
        </tr>
      </table>
    </div>

    <!-- BUTTON -->
    <div style="text-align:center; margin-top:35px;">
      <a href="https://curate-pearl.vercel.app/upi-pay?amount=${Number(totals.balanceDue)}"
         style="
           background:#0e9f6e;
           padding:16px 45px;
           color:white;
           text-decoration:none;
           font-size:18px;
           font-weight:600;
           border-radius:50px;
           display:inline-block;
           box-shadow:0 3px 10px rgba(0,0,0,0.12);
         ">
        Pay Now
      </a>
    </div>

    <!-- FOOTER -->
    <p style="margin-top:35px; font-size:15px; color:#4b5563; line-height:22px;">
      Regards,<br>
      <strong>Curate Health Services</strong>
    </p>

  </div>
</div>
`,
     
           pdfBase64,
         });
     
    
    
         
       }, 4000);
       
       setisSuccess(true)
    }
  };


  return (
    <div style={{ padding: "4px", width: "100%", background: "#fff", borderRadius: "10px", boxShadow: "0 0 10px #0001" }} id="Updated-pdf-area">
<>

  {isSending && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white shadow-xl rounded-2xl px-8 py-6 text-center w-[90%] max-w-sm">
        <div className="animate-spin h-10 w-10 border-4 border-slate-300 border-t-slate-900 rounded-full mx-auto mb-4"></div>

        <h2 className="text-lg font-semibold text-slate-800">
          Please Wait…
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sending Updated Invoice
        </p>
      </div>

    </div>
  )}

  
  {isSuccess && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white shadow-xl rounded-2xl px-8 py-6 text-center w-[90%] max-w-sm animate-fadeIn">

        <div className="bg-green-500 text-white w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4 shadow-lg">
          ✓
        </div>

        <h2 className="text-lg font-semibold text-green-700">
          Invoice Sent Successfully!
        </h2>

        <p className="text-sm text-slate-600 mt-1">
          The updated invoice has been delivered to the customer.
        </p>
      <button className="bg-green-800 mt-4 p-2 text-white rounded-md cursor-pointer" onClick={()=>dispatch(UpdateInvoiceIntialStatus(true))}>Go To Invoices</button>
      </div>

    </div>
  )}
</>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
        <div style={{ width: "8px", height: "100px", background: colors.primary, borderRadius: "0 8px 8px 0" }} />
        <div style={{ flex: 1, display: "flex", justifyContent: "space-between", marginLeft: "16px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", letterSpacing: "2px", margin: 0, color: colors.primary }}>INVOICE</h1>
            <p style={{ marginTop: "6px", color: "#475569", fontSize: "16px" }}>Invoice ID: #{invoice.number}</p>
          </div>
          <img src="https://curate-pearl.vercel.app/Icons/Curate-logoq.png" style={{ height: 70 }} />
        </div>
      </div>


      <div style={{ display: "flex", justifyContent: "space-between" }}>


        <div style={{ width: "50%" }}>
          <h4 style={{ fontSize: 18, fontWeight: 600 }}>Bill To</h4>





          <div style={{ marginTop: 18, fontSize: 14 }}>
            <strong>Invoice Date:</strong>{" "}
            {InvoiceStatus ? <input className="border ml-1" value={editInvoice.date || ""} onChange={e => setEditInvoice({ ...editInvoice, date: e.target.value,serviceFrom:e.target.value })} /> : invoice.date}

            <br /><strong>Due Date:</strong>{" "}
            {InvoiceStatus ? <input className="border ml-1" value={editInvoice.dueDate || ""} onChange={e => setEditInvoice({ ...editInvoice, dueDate: e.target.value,serviceTo:e.target.value })} /> : invoice.dueDate}

            <br /><strong>Terms:</strong>{" "}
           {getDaysBetween(editInvoice.date,editInvoice.dueDate)||0} Days
          </div>
        </div>

        <div style={{ width: "50%", textAlign: "right" }}>
          <h3 style={{ fontWeight: "bold", fontSize: 20, color: colors.pink }}>{company.name}</h3>
          {company.addressLines?.map((x, i) => <div key={i}>{x}</div>)}
          <p><b>Patient Name:</b> {billTo.patientName || "-"}</p>

          <p><b>Service Dates:</b><br />
            {InvoiceStatus ? <>
              <input className="border mr-1 w-24" value={editInvoice.serviceFrom || ""}
                onChange={e => setEditInvoice({ ...editInvoice, serviceFrom: e.target.value })} />
              to
              <input className="border ml-1 w-24" value={editInvoice.serviceTo || ""}
                onChange={e => setEditInvoice({ ...editInvoice, serviceTo: e.target.value })} />
            </> :
              `${invoice.serviceFrom} to ${invoice.serviceTo}`}
          </p>
        </div></div>




      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
        <thead>
          <tr style={{ background: colors.primary, color: "white" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>#</th>
            <th style={{ padding: "8px", textAlign: "left" }}>
              Service &amp; Description
            </th>
            <th style={{ padding: "8px", textAlign: "right" }}>Days</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Rate</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {renderItems.map((it, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{InvoiceStatus ? <input className="border p-1 w-full" value={it.description} onChange={e => updateItem(i, "description", e.target.value)} /> : it.description}</td>
              <td align="right">{InvoiceStatus ? <input className="border p-1 w-14 text-right" value={it.days} onChange={e => updateItem(i, "days", e.target.value)} /> : it.days}</td>
              <td align="right">{InvoiceStatus ? <input className="border p-1 w-20 text-right" value={it.rate} onChange={e => updateItem(i, "rate", e.target.value)} /> : `₹${it.rate}`}</td>
              <td align="right">₹{it.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {InvoiceStatus && <Plus className="bg-teal-800 p-2 ml-2 mb-2 rounded-md text-white cursor-pointer h-8 w-8" onClick={() => setShowServices(!ShowServices)} />}

      {ShowServices && (
        <tbody>
          <tr className="border-t border-slate-100 hover:bg-slate-50/60">
            <td colSpan={5} className="px-4 py-2">
              <select
                className="border border-slate-200 text-sm px-2 py-1 rounded-lg bg-white"
                value={selectedService}
                onChange={(e) => {
                  const code = e.target.value;
                  setSelectedService(code);

                  if (!code) return;

                  const service: any = serviceOptions.find((s: any) => s.code === code);

                 if (service) {
  const newItem = {
    description: service.name,
    days: 1,
    rate: service.rate || 0,
    amount: (1 * (service.rate || 0)).toFixed(2),
  };

  const updated = [...editItems, newItem];
  setEditItems(updated);

  recalcTotals(); 
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
            </td>
          </tr>
        </tbody>
      )}


      <div style={{ display: "flex", marginTop: 30, gap: 25 }}>


        <div style={{ width: "50%" }}>
          <h4>Payment Method</h4>
          <img src="https://curate-pearl.vercel.app/Icons/PaymentScanner.png" style={{ height: 120 }} />
          <p><b>Account Name:</b> Curate Health Services</p>
          <p><b>Bank Name:</b> UCO Bank</p>
          <p><b>Account Number:</b> 01140210002278</p>
          <p><b>IFSC:</b> UCBA0000114</p>
          <p><b>UPI:</b> curateservices@ucobank</p>
        </div>

        <div style={{ width: "50%", background: "#f1f5f9", padding: "12px", borderRadius: 10, maxWidth: 300, marginLeft: "auto" }}>
          {renderRow("Discount", display.Discount, updateTotals, InvoiceStatus, "green")}
          {renderRow("AdvancePaid", display.AdvancePaid, updateTotals, InvoiceStatus, "green")}
          {renderRow("Tax", display.Tax, updateTotals, InvoiceStatus, "red")}
          {renderRow("RegistraionFee", display.RegistraionFee, updateTotals, InvoiceStatus)}
          {renderRow("OtherExpenses", display.OtherExpenses, updateTotals, InvoiceStatus)}
{/* 
          <Row label="Total" value={display.total} /> */}
            {totals.CheckPaymentStatus&&<Row label="Payment Received" value={initialBalanceDue} bold  />}
        {totals.CheckPaymentStatus!==true&&  <Row label="Balance Due" value={display.balanceDue} bold red />}
          {(totals.CheckPaymentStatus&&display?.marginStatus?.type !== "Extra Amount")&&<Row label="Balance Due" value={0} bold red />}
          { (totals.CheckPaymentStatus&&display?.marginStatus?.type === "Extra Amount")&&<Row label="Balance Due" value={display.marginStatus.amount.toFixed(2)} bold red />}

          {/* <p style={{ marginTop: 6 }}>In Words:
            <b style={{ textDecoration: "underline" }}>
              {numberToWords(display.balanceDue || 0)} ONLY
            </b>
          </p> */}
          {display.marginStatus && (
  <p style={{
    marginTop: "10px",
    fontWeight: "bold",
    color:
      display.marginStatus.type === "Refund"
        ? "green"
        : display.marginStatus.type === "Extra Amount"
        ? "red"
        : "blue"
  }}>
    {display.marginStatus.type}: ₹{display.marginStatus.amount.toFixed(2)}
  </p>
)}

        </div></div>


      <div style={{ marginTop: "25px" }}>
        <h5 style={{ fontWeight: 600, marginBottom: "6px" }}>Terms & Conditions</h5>

        <ol
          style={{
            fontSize: "11px",
            color: "#334155",
            lineHeight: "14px",
            paddingLeft: "18px"
          }}
        >
          {terms.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
      </div>

      <h3 style={{ textAlign: "center", color: colors.pink, marginTop: 25 }}>
        A Complete Home Healthcare Professionals. We care for your beloved.
      </h3>
      <p style={{ textAlign: "center", marginTop: 6 }}>www.curatehealthservices.com</p>



      {InvoiceStatus && <button className="w-full bg-slate-900 text-white py-3 mt-5 rounded cursor-pointer" onClick={handleSendEmail}>Update & Send E-Mail</button>}

    </div>)
}


function renderRow(label: string, value: any, update: any, active: boolean, color?: string) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
      <span>{label}</span>
      {active ?
        <input className="border text-right w-20" style={{ color }} value={value}
          onChange={e => update(label as any, e.target.value)} />
        : <span style={{ fontWeight: 600, color }}>₹{value}</span>}
    </div>)
}

function Row({ label, value, red, bold }: { label: string; value: any; red?: boolean; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
      <span>{label}</span>
      <span style={{ color: red ? "red" : "#000", fontWeight: bold ? 700 : 600 }}>₹{value}</span>
    </div>
  )
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-2.5 text-sm text-slate-800 ${className}`}>
      {children}
    </td>
  );
}