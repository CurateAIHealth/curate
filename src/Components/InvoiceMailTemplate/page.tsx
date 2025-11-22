"use client";

import ReusableInvoice from "@/Components/InvioseTemplate/page";
import { indianStates } from "@/Lib/Content";
import { Copy } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

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
const Invoice=useSelector((state:any)=>state.InvoiceInfo)
  const update = (key: string, val: string) =>
    setForm({ ...form, [key]: val });


  const [services, setServices] = useState([{ name: "", code: "" }]);

  const bankDetailsText = `
Account Holder: Curate Health Services
Bank Name: UCO Bank
Account Number: 01140210002278
IFSC: UCBA0000114
UPI: curateservices@ucobank
`;
 
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
