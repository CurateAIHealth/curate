"use client";

import ReusableInvoice from "@/Components/InvioseTemplate/page";
import { indianStates } from "@/Lib/Content";
import { Copy } from "lucide-react";
import { useState } from "react";

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

export default function InvoiceForm() {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    patientName: "",
    address: "",
    city: "",
    State: '',
    invoiceNumber: "INV-2025-001",
    serviceNumber: "SRV-1001",
    invoiceDate: "",
    dueDate: "",
    endDate: "",
    description: "",
    subtotal: "",
    discount: "",
    tds: "",
    gst: "",
    extraExpenses: "",
  });

  const update = (key: string, val: string) =>
    setForm({ ...form, [key]: val });


  const [services, setServices] = useState([{ name: "", code: "" }]);

  const [copied, setCopied] = useState(false);
  const bankDetailsText = `
Account Holder: Curate Health Services
Bank Name: UCO Bank
Account Number: 01140210002278
IFSC: UCBA0000114
UPI: curateservices@ucobank
`;
  const copyBankDetails = async () => {
    await navigator.clipboard.writeText(bankDetailsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const invoice = {
    number: "INV#25079",
    date: "01/05/2025",
    dueDate: "05/05/2025",
    terms: "7 Days",
    serviceFrom: "01/05/2025",
    serviceTo: "31/05/2025",
  };

;

  const billTo = {
  name: "HCAH",
  addressLines: 
    "Plot No. 45, 2nd Floor, Madhapur Hitech City Main Road Hyderabad, Telangana - 500081",
  patientName: "Savita",
};


  const items = [
    {
      description: "Healthcare Assistant Service Charges of Savita",
      days: 17,
      rate: "800",
      amount: "13,600",
    },
  ];



  const totals = {
    subTotal: "50,800",
    total: "₹50,800",
    balanceDue: "₹50,800",
    totalInWords: "Indian Rupee Fifty Thousand Eight Hundred Only",
  };


  const updateService = (i: number, key: string, val: string) => {
    const updated: any = [...services];
    updated[i][key] = val;
    setServices(updated);
  };

  const addService = () => setServices([...services, { name: "", code: "" }]);

  const removeService = (i: number) =>
    setServices(services.filter((_, idx) => idx !== i));

  return (
    <div>
{/* <div className="w-full  bg-white shadow-xl rounded-2xl overflow-hidden">
<div className="p-6 m-4 bg-gray-50 border rounded-2xl shadow-md flex justify-between items-center">
        <h1 className="text-5xl font-semibold text-[#ff1493] tracking-tight">
          Curate
        </h1>

        <img
          src="Icons/Curate-logoq.png"
          alt="Company Logo"
          className="h-20 w-20"
        />
      </div>
      <div className="p-8 space-y-10">
        <SectionTitle title="Customer & Patient Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Customer Name" value={form.customerName} onChange={(v: any) => update("customerName", v)} />
          <Field label="Patient Name" value={form.patientName} onChange={(v: any) => update("patientName", v)} />
          <Field label="Phone Number" value={form.phone} onChange={(v: any) => update("phone", v)} />
          <Field label="Email ID" value={form.email} onChange={(v: any) => update("email", v)} />
                
          <Field label="Address" value={form.address} onChange={(v: any) => update("address", v)} />
             <Field label="Land Mark" value={form.address} onChange={(v: any) => update("address", v)} />
          <Field label="City" value={form.city} onChange={(v: any) => update("city", v)} />
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700">State</label>

            <select
              className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-white shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              defaultValue={form.State || ""}
              onChange={(e) => update("State", e.target.value)}
            >
              <option value="" disabled>
                Select State
              </option>

              {indianStates.map((each) => (
                <option key={each} value={each}>
                  {each}
                </option>
              ))}
            </select>
          </div>
        </div>
        <SectionTitle title="Invoice Details" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Invoice Number" value={form.invoiceNumber} onChange={(v: any) => update("invoiceNumber", v)} />
          <Field label="Service Number" value={form.serviceNumber} onChange={(v: any) => update("serviceNumber", v)} />
          <Field label="Invoice Date" type="date" value={form.invoiceDate} onChange={(v: any) => update("invoiceDate", v)} />
          <Field label="Due Date" type="date" value={form.dueDate} onChange={(v: any) => update("dueDate", v)} />
          <Field label="End Date" type="date" value={form.endDate} onChange={(v: any) => update("endDate", v)} />
        </div>
        <SectionTitle title="Service Name & Codes" />
        <div className="space-y-5">
          {services.map((srv, i) => (
            <div key={i} className="rounded-xl border p-4 bg-gray-50 shadow-sm">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <label className="text-sm font-medium">Select Service</label>
                  <select
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                    onChange={(e) => {
                      const selected = serviceOptions.find(opt => opt.code === e.target.value);
                      if (selected) {
                        updateService(i, "name", selected.name);
                        updateService(i, "code", selected.code);
                      }
                    }}
                  >
                    <option value="">-- Select Service --</option>
                    {serviceOptions.map((opt, idx) => (
                      <option key={idx} value={opt.code}>
                        {opt.name} ({opt.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-4">
                  <Field label="Service Name" value={srv.name} onChange={(v: any) => updateService(i, "name", v)} />
                </div>
                <div className="col-span-3">
                  <Field label="Service Code" value={srv.code} onChange={(v: any) => updateService(i, "code", v)} />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => removeService(i)}
                    className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addService}
            className="px-5 py-2 bg-[#1392d3] text-white rounded-xl hover:bg-blue-700"
          >
            + Add Service
          </button>
        </div>
        <SectionTitle title="Service Description" />
        <Field
          label="Description of Service"
          value={form.description}
          onChange={(v: any) => update("description", v)}
        />
        <SectionTitle title="Payment Summary" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Sub Total" value={form.subtotal} onChange={(v: any) => update("subtotal", v)} />
          <Field label="Discount" value={form.discount} onChange={(v: any) => update("discount", v)} />
          <Field label="TDS" value={form.tds} onChange={(v: any) => update("tds", v)} />
          <Field label="GST (18%)" value={form.gst} onChange={(v: any) => update("gst", v)} />
          <Field label="Extra Expenses" value={form.extraExpenses} onChange={(v: any) => update("extraExpenses", v)} />
        </div>
        <SectionTitle title="Payment Options" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-5 rounded-xl border shadow bg-gray-50">
            <h3 className="font-semibold mb-3">Scan & Pay (UPI)</h3>
            <img
              src="Icons/PaymentScanner.png"
              alt="QR"
              className="w-48 h-48 mx-auto rounded-lg shadow"
            />
            <p className="text-center mt-3 text-gray-600">UPI ID: <strong>curateservices@ucobank</strong></p>
          </div>
          <div className="p-5 rounded-xl border shadow bg-gray-50 relative">
            <h3 className="font-semibold mb-3">Bank Transfer Details</h3>
            <p className="text-gray-700">
              <strong>Account Holder:</strong> Curate Health Services
            </p>
            <p className="text-gray-700">
              <strong>Bank Name:</strong> UCO Bank
            </p>
            <p className="text-gray-700">
              <strong>Account Number:</strong> 01140210002278
            </p>
            <p className="text-gray-700">
              <strong>IFSC:</strong> UCBA0000114
            </p>
            <p className="text-gray-700">
              <strong>UPI:</strong> curateservices@ucobank
            </p>


            <button
              onClick={copyBankDetails}
              className="absolute right-4 bottom-4 px-3 cursor-pointer py-2 bg-blue-600 text-white text-sm rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow"
            >
              <Copy size={16} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>


        </div>

      </div>
    </div> */}
<ReusableInvoice
  invoice={invoice}
  billTo={billTo}
  items={items}
  totals={totals}
/>
</div>
  );
}


interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
}

function Field({ label, value, onChange, type = "text" }: FieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className="mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

interface SectionTitleProps {
  title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h2 className="text-xl font-bold text-[#50c896] border-l-4 border-[#1392d3] pl-3">
      {title}
    </h2>
  );
}
