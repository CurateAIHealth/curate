"use client";

import { useState } from "react";
import { X, Upload, AlertTriangle } from "lucide-react";

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

  const handleFile = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, receipt: file }));
    }
  };

  const handleSubmit = () => {
    onSubmit({
      employeeId,
      employeeName,
      ...form,
    });
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
              <p className="text-xs text-gray-500">
                {employeeName} • {employeeId}
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-red-600" />
          </button>
        </div>

        {/* BODY (NO SCROLL) */}
        <div className="px-6 py-4 grid grid-cols-12 gap-6 text-sm">

          {/* RECEIPT */}
          <div className="col-span-4">
            <label className="font-medium text-gray-700 mb-1 block">
              Receipt Upload
            </label>
            <label className="h-[170px] border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005f61]">
              <Upload className="text-gray-500" />
              <p className="mt-2 text-gray-600">
                {form.receipt ? form.receipt.name : "Upload bill / receipt"}
              </p>
              <input type="file" className="hidden" onChange={handleFile} />
            </label>
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
