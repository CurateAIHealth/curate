import { getDaysBetween, rupeeToNumber } from "@/Lib/Actions";
import { get } from "http";
import { useState } from "react";

interface RefundPopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onSubmit: (refundData: any) => void;
}

export default function RefundPopup({ isOpen, onClose, data, onSubmit }: RefundPopupProps) {
  const [refundType, setRefundType] = useState("full");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

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
    WorkingDays,

  RefundDays
    });

    onClose();
  };

  console.log("Refund Popup Data:", data);
const RefundDays=getDaysBetween(new Date().toISOString().split("T")[0], data.EndDate)
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
        <div className="mb-4 rounded-xl bg-gray-50 p-4 text-sm">
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
          <p><span className="font-medium">Location:</span> {data.location}</p>
          <p><span className="font-medium">HCP:</span> {data.HCA_Name}</p>
          <p><span className="font-medium">Contact:</span> {data.contact}</p>
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

        <div className="mb-4">
          <div className="mb-1 text-sm font-medium">Additional Notes</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border p-2"
          />
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