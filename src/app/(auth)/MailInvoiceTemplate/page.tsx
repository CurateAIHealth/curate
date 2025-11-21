"use client";

import { useSelector } from "react-redux";
import { useState } from "react";
import { getDaysBetween } from "@/Lib/Actions";
import ReusableInvoice from "@/Components/InvioseTemplate/page";

const serviceOptions = [
  { name: "Healthcare Assistant Service", code: "HCAS" },
  { name: "Healthcare Nursing Service", code: "HCNS" },
  { name: "Physiotherapy Service", code: "PTS" },
  { name: "Medical Equipment Service", code: "MES" },
  { name: "Lab Service", code: "LABS" },
  { name: "Digital Health Service", code: "DHS" },
  { name: "Speech & Language Therapy Service", code: "SPTS" },
  { name: "Occupational Therapy Service", code: "OTS" },
  { name: "Behaviour Health Service", code: "BHS" },
  { name: "Healthcare Consulting Service", code: "HCS" },
];

type RoundType = "none" | "nearest" | "up" | "down";

export default function InvoiceForm() {
  const InvoiceData = useSelector((state: any) => state.InvoiceInfo);

  
  const [otherExpenses, setOtherExpenses] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"flat" | "percent">("flat");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [roundType, setRoundType] = useState<RoundType>("none");
  const [services, setServices] = useState([
    { name: "Healthcare Assistant Service", code: "HCAS" },
  ]);
  const [ShowMailTemplate, setShowMailTemplate] = useState(true);

 
  const start = InvoiceData?.StartDate;
  const end = InvoiceData?.ServiceEndDate;

  const days = getDaysBetween(start, end);
  const perDay = Number(InvoiceData?.CareTakeCharge?.replace("₹", "") || 0);
  const regFee = Number(InvoiceData?.RegistrationFee || 0);
  const advance = Number(InvoiceData?.AdvanceReceived || 0);


  const baseTotal = days * perDay + regFee;

  const discountAmount =
    discountType === "percent"
      ? (baseTotal * Number(discountValue || 0)) / 100
      : Number(discountValue || 0);

  const rawTotal = baseTotal + Number(otherExpenses || 0) - discountAmount;

  let finalTotal = rawTotal;

  if (roundType === "up") finalTotal = Math.ceil(rawTotal);
  if (roundType === "down") finalTotal = Math.floor(rawTotal);
  if (roundType === "nearest") finalTotal = Math.round(rawTotal);

  const roundingDifference = finalTotal - rawTotal;
  const balanceDue = finalTotal - advance;

  const invoice = {
    number: InvoiceData?.id,
    date: InvoiceData?.StartDate,
    dueDate: InvoiceData?.ServiceEndDate,
    serviceFrom: InvoiceData?.StartDate,
    serviceTo: InvoiceData?.ServiceEndDate,
    status: InvoiceData?.status,
  };

  const billTo = {
    name: InvoiceData?.ClientName,
    patientName: InvoiceData?.name,
    contact: InvoiceData?.contact,
    email: InvoiceData?.Email,
    addressLines: InvoiceData?.Adress,
  };

  const items = [
    {
      description: "Care Taker Service",
      days,
      rate: perDay,
      amount: perDay,
    },
  ];

  const totals = {
    BaseAmount: 20000,
    OtherExpenses: otherExpenses,
    Discount: discountAmount,
    total: rawTotal,
    RoundedTotal: finalTotal,
    RoundingDifference: roundingDifference,
    AdvancePaid: advance,
    balanceDue: balanceDue,
  };

 
  const updateService = (index: number, selectedCode: string) => {
    const selected = serviceOptions.find((opt) => opt.code === selectedCode);
    if (!selected) return;

    const updated = [...services];
    updated[index] = { name: selected.name, code: selected.code };
    setServices(updated);
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

    items: [
      {
        description: `${services[0].name} for ${InvoiceData?.name}`,
        days,
        rate: perDay,
        amount: perDay*days,
      },
    ],

    totals,
  };


  const handleSubmit = () => {
    const finalInvoiceObject = {
      customer: billTo,
      invoiceDetails: invoice,
      services,
      items,
      totals,
    };

    setShowMailTemplate(!ShowMailTemplate);
    console.log("🔵 FINAL UPDATED INVOICE DATA:", finalInvoiceObject);
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
{ShowMailTemplate?    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

    
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 ">
         <img src="Icons/Curate-logoq.png" className="h-20 w-auto"/>
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
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-sm font-mono">
                {invoice.number || "--"}
              </span>
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

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
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

              <div className="border-t border-slate-100 px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/70">
                <StatItem label="Invoice Date" value={invoice.date || "--"} />
                <StatItem label="Due Date" value={invoice.dueDate || "--"} />
                <StatItem label="Service From" value={invoice.serviceFrom || "--"} />
                <StatItem label="Service To" value={invoice.serviceTo || "--"} />
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
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    ₹{finalTotal.toFixed(0)}/-
                  </p>
                  {roundingDifference !== 0 && (
                    <p className="text-[11px] text-slate-500">
                      Adj: {roundingDifference > 0 ? "+" : "-"}₹
                      {Math.abs(roundingDifference).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 space-y-3 text-sm">
                <KeyRow label="Base Amount">
                  ₹{baseTotal.toFixed(2)}/-
                </KeyRow>

                <KeyRow label="Other Expenses (₹)">
                  <input
                    type="number"
                    className="border border-slate-200 rounded-lg px-2 py-1 w-28 text-right text-sm"
                    value={otherExpenses}
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
                      type="number"
                      className="border border-slate-200 rounded-lg px-2 py-1 w-24 text-right text-sm"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value || 0))}
                    />
                    <span className="text-xs text-emerald-700 font-medium">
                      -₹{discountAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <KeyRow label="Raw Total">
                  ₹{rawTotal.toFixed(2)}/-
                </KeyRow>

              

                <KeyRow label="Advance Received">
                  ₹{advance.toFixed(2)}/-
                </KeyRow>

                <KeyRow label="Balance Due" highlight>
                  ₹{balanceDue.toFixed(2)}/-
                </KeyRow>
              </div>
            </div>

        
            <button
              onClick={handleSubmit}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-3 rounded-xl shadow-sm transition"
            >
              Send E-Mail
            </button>
          </div>
        </div>
      </div>
    </div>: <div className="p-6">
      <ReusableInvoice
        invoice={invoiceProps.invoice}
        billTo={invoiceProps.billTo}
        items={invoiceProps.items}
        totals={invoiceProps.totals}
      />
    </div>}
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
