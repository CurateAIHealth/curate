import { getDaysBetween } from "@/Lib/Actions";
import { FileSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";

type EditRefundProps = {
  initialData?: any;
  onSave?: (data: any) => void;
};

const EditRefund: React.FC<EditRefundProps> = ({ initialData, onSave }) => {
 const [form, setForm] = useState({
  receiptId: initialData?.receiptId ?? "",
  invoiceId: initialData?.invoiceId ?? "",
  clientName: initialData?.clientName ?? "",
  patientName:"",
  clientId: initialData?.ClientId ?? "",
  serviceStartDate: initialData?.serviceStartDate ?? "",
  serviceEndDate: initialData?.serviceEndDate ?? "",
  perDayCharge: Number(initialData?.perDayCharge ?? 0),
  clientPaymentDays: Number(initialData?.clientPaymentDays ?? 0),
  refundRequestDate: initialData?.refundRequestDate ?? "",
  reason: initialData?.reason ?? "",
  refundAmount: Number(initialData?.RefundAmount ?? 0),
  HCAAttendece: initialData?.HCAAttendece ?? [],
});
const Router=useRouter()


const processedData = useMemo(() => {
  return (form.HCAAttendece ?? []).map((record: any) => {
    const days = Array(31).fill(null);

    let pd = 0;
    let ad = 0;
    let hp = 0;

    for (const att of record.days ?? []) {
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
      ...record,
      days,
      pd,
      ad,
      hp,
    };
  });
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

  return (
    <div>
   {form.refundAmount===0?<div className="flex min-h-[60vh] items-center justify-center px-6">
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
 
    <div className="bg-slate-50 mx-auto  p-8 rounded shadow">
     <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
  {/* Left Section */}
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

  {/* Right Section */}
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
    Patient Name
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
      value={form.clientPaymentDays}
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


  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-800 mb-5">
      Refund Summary
    </h3>

    <div className="grid grid-cols-3 gap-4">

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Service Days
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {getDaysBetween(form.serviceStartDate,form.refundRequestDate)}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Refund Days
        </p>
        <p className="mt-2 text-2xl font-bold text-amber-600">
          {form.clientPaymentDays}
        </p>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-red-500">
          Refund Amount 
        </p>
        <p className="mt-2 text-2xl font-bold text-red-600">
          ₹{form.refundAmount}
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
        // Open Attendance Modal
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
  >
    Send E-Mail
  </button>
</div>
    </div>}
       </div>
  );
};

export default EditRefund;