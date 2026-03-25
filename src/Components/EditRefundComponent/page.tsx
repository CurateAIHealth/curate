import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";

type EditRefundProps = {
  initialData?: any;
  onSave?: (data: any) => void;
};

const EditRefund: React.FC<EditRefundProps> = ({ initialData, onSave }) => {
  const [form, setForm] = useState({
    receiptId: initialData?.receiptId || "",
    invoiceId: initialData?.invoiceId || "",
    clientName: initialData?.clientName || "",
    serviceStartDate: initialData?.serviceStartDate || "",
    serviceEndDate: initialData?.serviceEndDate || "",
    perDayCharge: initialData?.perDayCharge || 0,
    clientPaymentDays: initialData?.clientPaymentDays || 0,
    refundRequestDate: initialData?.refundRequestDate || "",
    reason: initialData?.reason || ""
  });
const Router=useRouter()
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
    <div className="bg-slate-50 mx-auto  p-8 rounded shadow">
     <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-2 ">
         <img src="Icons/Curate-logoq.png" onClick={()=>Router.push("/DashBoard")}  className="h-20 w-auto"/>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Curate Health Services • Refund
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900 tracking-tight">
             Edit Refund Details
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review customer, services and payment summary before generating the invoice.
            </p>
          </div>
</div>
 <button
              onClick={()=>(Router.push("/Invoices"))}
              className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
            >
              Invoice
            </button>
</div>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="receiptId"
          placeholder="Receipt ID"
          value={form.receiptId}
          onChange={handleChange}
          className="input"
        />

        <input
          name="invoiceId"
          placeholder="Invoice ID"
          value={form.invoiceId}
          onChange={handleChange}
          className="input"
        />

        <input
          name="clientName"
          placeholder="Client Name"
          value={form.clientName}
          onChange={handleChange}
          className="input col-span-2"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <label>Service Start Date</label>
          <input
            type="date"
            name="serviceStartDate"
            value={form.serviceStartDate}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label>Service End Date</label>
          <input
            type="date"
            name="serviceEndDate"
            value={form.serviceEndDate}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <input
          type="number"
          name="perDayCharge"
          placeholder="Per Day Charge"
          value={form.perDayCharge}
          onChange={handleChange}
          className="input"
        />

        <input
          type="number"
          name="clientPaymentDays"
          placeholder="Paid Days"
          value={form.clientPaymentDays}
          onChange={handleChange}
          className="input"
        />

        <input
          type="date"
          name="refundRequestDate"
          value={form.refundRequestDate}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="mt-8 bg-gray-50 p-4 rounded border">
        <h3 className="font-semibold mb-3">Summary</h3>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>Service Days: <b>{serviceDays}</b></div>
          <div>Refund Days: <b>{refundDays}</b></div>
          <div className="text-red-600">
            Refund Amount: <b>₹{refundAmount}</b>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="block mb-2">Reason for Refund</label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          className="w-full border rounded p-3"
          rows={4}
        />
      </div>

        <button
             
              className="w-full bg-slate-900 hover:bg-slate-800 cursor-pointer text-white text-sm font-semibold py-3 rounded-xl shadow-sm transition"
            >
              Send E-Mail
            </button>
    </div>
  );
};

export default EditRefund;