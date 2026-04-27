import { getDaysBetween, rupeeToNumber } from "@/Lib/Actions";
import { GetUsersFullInfo } from "@/Lib/user.action";
import axios from "axios";
import { get } from "http";
import { useState,useEffect } from "react";

interface RefundPopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  CompliteInfo:any
  onSubmit: (refundData: any) => void;
}

export default function RefundPopup({ isOpen, onClose, data,CompliteInfo, onSubmit }: RefundPopupProps) {
  const [refundType, setRefundType] = useState("full");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showBankPopup, setShowBankPopup] = useState(false);

const [bankDetails, setBankDetails] = useState({
  accountNumber: "",
  ifsc: "",
  bankName: "",
  accountHolder: "",
  passBook:"",
  branch:"",
});

const handleAddBankInfo = () => {
  setShowBankPopup(true);
};
const handleBankChange = async(e: any) => {
  const { name, value } = e.target;
  if (name === "passBook") {
 const file = e.target.files?.[0];
      const inputName = e.target.name;
      if (!file) return;


      if (file.size > 10 * 1024 * 1024) {
        alert('File too large. Max allowed is 10MB.');
        return;
      }


      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg', 'application/pdf',];
      if (!allowedTypes.includes(file.type)) {
        alert('Only image or video files are allowed.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('/api/Upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

            setBankDetails((prev) => ({
    ...prev,
    [name]: res.data.url 
  }));
   return
};
    if (name === "ifsc" && value.length === 11) {
    try {
        setBankDetails((prev) => ({
          ...prev,
          bankName: "",
          branch: "", 
        }));
      const res = await fetch(`https://ifsc.razorpay.com/${value}`);
      const data = await res.json();

      if (data) {
        setBankDetails((prev) => ({
          ...prev,
          bankName: data.BANK,
          branch: data.BRANCH, 
        }));
      }
      return
    } catch (err) {
      console.error("Invalid IFSC");
    }
  }
  setBankDetails((prev) => ({
    ...prev,
    [name]: value
  }));
};
  if (!isOpen) return null;
  







   const GetHCPPayment = (A: any) => {
    if (!CompliteInfo?.length || !A) return "Not Entered";

    const address =
      CompliteInfo
        ?.map((each: any) => each?.HCAComplitInformation)
        ?.find((info: any) => info?.UserId === A)
      ?.["PaymentforStaff"]||0;

    return Number(address) 
  };

  const handleSubmit = (a:any) => {
    if (!reason) return;

    if (refundType === "partial" && (!amount || Number(amount) <= 0)) return;
const WorkingDays=getDaysBetween(a.StartDate, new Date().toISOString().split("T")[0])
const RefundDays=getDaysBetween(new Date().toISOString().split("T")[0], a.EndDate)-1

    onSubmit({
      ...data,
      refundType,
      reason,
      notes,
      bankDetails,
    WorkingDays,
    RefundDays,
    isProfit,
    resultAmount
    });

    onClose();
  };

 
const RefundDays=getDaysBetween(new Date().toISOString().split("T")[0], data.EndDate)


const perDayCharge = Number(rupeeToNumber(data.ServiceCharge).toFixed(2));

const perDayHCP =
  Math.round(Number(GetHCPPayment(data.HCA_Id)) / 30);

// Days actually served
const workedDays = Number(
  getDaysBetween(data.StartDate, new Date().toISOString().split("T")[0])
);

// Profit per day
const perDayProfit = perDayCharge - perDayHCP;

// Total profit/loss
const resultAmount = perDayProfit * workedDays;

const isProfit = resultAmount >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className=" flex items-center justify-between">
          <img
    src="/Icons/Curate-logo.png"
  
    alt="Logo"
    className="w-10 h-10  rounded-xl"
  />
        <div className=" flex items-center gap-4 justify-between">
          <h2 className="text-lg font-semibold">Request Refund</h2>
          <button onClick={onClose} className="text-xl text-gray-500 cursor-pointer hover:bg-gray-200 rounded-full">
            ×
          </button>
        </div>
</div>
        <div className="mb-4 rounded-xl bg-gray-50 p-2 text-sm">
          <p><span className="font-medium">Client:</span> {data.name}</p>
          <p><span className="font-medium">Patient:</span> {data.PatientName}</p>
          <p><span className="font-medium">Duration:</span> {data.StartDate} → {data.EndDate } </p>
          <p><span className="font-medium">Service Days:</span> {getDaysBetween(data.StartDate,new Date().toISOString().split("T")[0])} Days</p>
                   <p><span className="font-medium">Refund Days:</span> {RefundDays-1} Days</p>
          <p><span className="font-medium">Charges:</span>   <span>
                  ₹{(
                    getDaysBetween(data.StartDate, data.EndDate) *
                    rupeeToNumber(data.ServiceCharge)
                  ).toFixed(2)}{" "}
                  <span className="text-gray-500">/M</span>
                </span>|      <span>
                        ₹{rupeeToNumber(data.ServiceCharge).toFixed(2)}{" "}
                        <span className="text-gray-500">/D</span>
                      </span></p>
                       <p><span className="font-medium">HCP Salary:</span> {CompliteInfo?.length ?  `${Math.round(Number(GetHCPPayment(data.HCA_Id)) / 30)}/Day` : "Loading...."} </p>
          <p><span className="font-medium">Location:</span> {data.location}</p>
          <p><span className="font-medium">HCP:</span> {data.HCA_Name}</p>
          <p><span className="font-medium">Contact:</span> {data.contact}</p>
        </div>

     {/* <div>
      <p>Service Bill:{Number(getDaysBetween(data.StartDate,new Date().toISOString().split("T")[0]))*Number(rupeeToNumber(data.ServiceCharge).toFixed(2))}</p>
            <p>Refund Amount :{Number(getDaysBetween(data.StartDate,new Date().toISOString().split("T")[0]))*Number(rupeeToNumber(data.ServiceCharge).toFixed(2))}</p>
     </div> */}


    
  <div className="flex  items-center justify-center gap-4 mt-2">
    
 
    <div className="flex flex-col items-center justify-center min-w-[180px] bg-green-200 rounded-2xl shadow-md p-1 border border-gray-100">
      <p className="text-sm text-green-800 mb-1">Service Bill</p>
      <p className="text-sm font-semibold text-gray-900">₹ {Number(getDaysBetween(data.StartDate,new Date().toISOString().split("T")[0]))*Number(rupeeToNumber(data.ServiceCharge).toFixed(2))}</p>
    </div>

   
    <div className="flex flex-col items-center justify-center min-w-[180px] bg-red-200 rounded-2xl shadow-md p-1 border border-gray-100">
      <p className="text-sm text-red-600 mb-1">Refund Amount</p>
      <p className="text-sm font-semibold text-gray-900">₹ {Number(RefundDays-1)*Number(rupeeToNumber(data.ServiceCharge).toFixed(2))}</p>
    </div>

  </div>

<div
  className={`mt-4 flex items-center justify-between px-2 py-3 rounded-2xl shadow-md ${
    isProfit
      ? "bg-green-200 border border-green-200 text-green-800"
      : "bg-red-200 border border-red-200 text-red-600"
  }`}
>
  <span className="font-medium">
    {isProfit ? "Net Profit" : "Net Loss"}
  </span>

  <span className="text-md font-bold">
    ₹ {Math.abs(resultAmount).toFixed(2)}
  </span>
</div>
        <div className="mb-4">
          <div className="mb-1 text-sm font-medium">Reason</div>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border p-2"
          >
            <option value="">Select reason</option>
            <option>Service not satisfactory</option>
            <option>HCP issue</option>
            <option>Overcharged</option>
            <option>Cancelled early</option>
      
          </select>
        </div>
{showBankPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Bank Information</h2>

      <input
        type="text"
        name="accountHolder"
        placeholder="Account Holder Name"
        value={bankDetails.accountHolder}
        onChange={handleBankChange}
        className="w-full mb-2 p-2 border rounded-lg"
      />

      <input
        type="text"
        name="accountNumber"
        placeholder="Account Number"
        value={bankDetails.accountNumber}
        onChange={handleBankChange}
        className="w-full mb-2 p-2 border rounded-lg"
      />

      <input
        type="text"
        name="ifsc"
        placeholder="IFSC Code"
        value={bankDetails.ifsc}
        onChange={handleBankChange}
        className="w-full mb-2 p-2 border rounded-lg"
      />
<div className="border-l-4 border-indigo-500 pl-4 py-2 shadow-lg rounded-md">
  <p className="text-sm font-semibold text-gray-900">
   🏦 {bankDetails.bankName}
  </p>
  <p className="text-xs text-gray-500">
    📍 {bankDetails.branch}
  </p>
</div>


 <div className="w-full mb-4">
  <label className="block mb-2 text-sm font-medium text-gray-700">
    Upload Passbook
  </label>

  <input
    type="file"
    name="passBook"
    onChange={handleBankChange}
    className="w-full text-sm text-gray-600
      file:mr-4 file:py-2 file:px-4
      file:rounded-lg file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-700
      hover:file:bg-blue-100
      cursor-pointer border border-gray-300 rounded-lg p-2"
  />
</div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowBankPopup(false)}
          className="px-3 py-1 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={() => setShowBankPopup(false)}
          className="px-3 py-1 bg-green-600 text-white rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
        <div className="mb-2">
          <div className="mb-1 text-sm font-medium">Additional Notes</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border p-2"
          />
          <button className="text-blue-600 text-xs cursor-pointer hover:underline" onClick={handleAddBankInfo}>
            Add Bank Information
          </button>
        </div>
        



        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={()=>handleSubmit(data)}
            className="rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}