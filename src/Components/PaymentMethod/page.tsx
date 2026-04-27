import axios from "axios";
import React, { ChangeEvent, FC, useEffect, useState } from "react";

type PaymentType = "full" | "split";

type PaymentMethod =
  | ""
  | "upi"
  | "phonepe"
  | "googlepay"
  | "paytm"
  | "cash"
  | "creditcard"
  | "debitcard"
  | "rupay"
  | "netbanking"
  | "banktransfer"
  | "imps"
  | "neft"
  | "rtgs"
  | "amazonpay"
  | "mobikwik"
  | "freecharge";

interface PaymentPopupProps {
  open: boolean;
  loading?: boolean;
  maxAmount?: number;
  ImportedAmount:any;
  onClose: () => void;
  onSubmit: (data: {
    paymentType: PaymentType;
    amount: number;
    paymentMethod: PaymentMethod;
    transactionId: string;
    receipt: File | null;
    PaymentDate:any
  }) => Promise<void> | void;
}

interface FormState {
  amount: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  receipt: File | null;
}

const initialState: FormState = {
  amount: "",
  paymentMethod: "",
  transactionId: "",
  receipt: null,
};

const PaymentPopup: FC<PaymentPopupProps> = ({
  open,
  loading = false,
  ImportedAmount,
  onClose,
  onSubmit,
}) => {
  const [paymentType, setPaymentType] = useState<PaymentType>("full");
  const [form, setForm] = useState<FormState>(initialState);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setUploadMessage("")
      setErrors({});
      setPaymentType("full");
    }
  }, [open]);

  if (!open) return null;

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const amount = Number(form.amount);

    if ((!form.amount || Number.isNaN(amount) || amount <= 0)&&paymentType !== "full") {
      newErrors.amount = "Enter valid amount";
    }

  

    if (!form.paymentMethod) {
      newErrors.paymentMethod = "Select payment method";
    }
    // if(!form.receipt){
    //    newErrors.receipt = "Upload Payment receipt "; 
    // }

    if (
      form.paymentMethod &&
      form.paymentMethod !== "cash" &&
      !form.transactionId.trim()
    ) {
      newErrors.transactionId = "Enter transaction ID";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
setUploadMessage("Please Wait.....")
    await onSubmit({
      paymentType,
      amount: paymentType === "full"?ImportedAmount:form.amount,
      paymentMethod: form.paymentMethod,
      transactionId: form.transactionId.trim(),
      receipt: form.receipt,
      PaymentDate:  `${new Date().toLocaleDateString('EN-In')} ${new Date().toLocaleTimeString()}`
    });
  };

  const handleFile =async (e: ChangeEvent<HTMLInputElement>) => {
    updateField("receipt", e.target.files?.[0] ?? null);

       const file = e.target.files?.[0];
        const inputName = e.target.name as keyof any;
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
          setUploadMessage('File too large. Max allowed is 10MB.');
          return;
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];
        if (!allowedTypes.includes(file.type)) {
          setUploadMessage('Only image or video files are allowed.');
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        try {
          setUploadMessage(`Uploading...`);
          const res = await axios.post('/api/Upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
          setForm(prev => ({ ...prev, receipt: res.data.url }));
          setUploadMessage('Payment Receipt Upload successfully');
        } catch {
          setUploadMessage('Upload failed!');
        }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
           <div className="flex items-center gap-1">
             <img src="/Icons/Curate-logoq.png" alt="Company Logo"  className="h-11"/>
          <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Payment Due
          </h2>
           </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 rounded-lg border p-3 text-sm text-gray-700">
              <input
                type="radio"
                checked={paymentType === "full"}
                onChange={() => setPaymentType("full")}
                className="h-4 w-4"
              />
              Full Due Amount
            </label>

            <label className="flex items-center gap-2 rounded-lg border p-3 text-sm text-gray-700">
              <input
                type="radio"
                checked={paymentType === "split"}
                onChange={() => setPaymentType("split")}
                className="h-4 w-4"
              />
            Partial Payment
            </label>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Amount
            </label>

            <input
              type="number"
              min="1"
              value={paymentType === "full"?ImportedAmount:form.amount}
              disabled={paymentType === "full"}
              onChange={(e) => updateField("amount", e.target.value)}
              placeholder="Enter amount"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Payment Method 
            </label>

            <select
              value={form.paymentMethod}
              onChange={(e) =>
                updateField(
                  "paymentMethod",
                  e.target.value as PaymentMethod
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select Payment Method</option>

              <optgroup label="Popular">
                <option value="upi">UPI</option>
                <option value="phonepe">PhonePe</option>
                <option value="googlepay">Google Pay</option>
                <option value="paytm">Paytm</option>
                <option value="cash">Cash</option>
              </optgroup>

              <optgroup label="Cards">
                <option value="creditcard">Credit Card</option>
                <option value="debitcard">Debit Card</option>
                <option value="rupay">RuPay Card</option>
              </optgroup>

              <optgroup label="Bank Transfer">
                <option value="netbanking">Net Banking</option>
                <option value="banktransfer">Bank Transfer</option>
                <option value="imps">IMPS</option>
                <option value="neft">NEFT</option>
                <option value="rtgs">RTGS</option>
              </optgroup>

              <optgroup label="Wallets">
                <option value="amazonpay">Amazon Pay</option>
                <option value="mobikwik">MobiKwik</option>
                <option value="freecharge">Freecharge</option>
              </optgroup>
            </select>

            {errors.paymentMethod && (
              <p className="mt-1 text-xs text-red-500">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Transaction ID/UTR
            </label>

            <input
              type="text"
              value={form.transactionId}
              onChange={(e) =>
                updateField("transactionId", e.target.value)
              }
              placeholder="Enter transaction ID"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            {errors.transactionId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.transactionId}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Upload Payment Receipt
            </label>

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFile}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1"
            />
         {errors.receipt && (
              <p className="mt-1 text-xs text-red-500">
                {errors.receipt}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center  w-full  border-t px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
   { uploadMessage&&    <p className={uploadMessage.includes("successfully")?"rounded-lg border border-green-200 bg-green-50 px-2 py-3 text-xs font-medium text-green-700 shadow-sm":"rounded-lg border border-yellow-200 bg-yellow-50 px-2 py-3 text-xs font-medium text-yellow-700 shadow-sm"}>
  {uploadMessage}
</p>}
            <div className="flex justify-end w-full gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;