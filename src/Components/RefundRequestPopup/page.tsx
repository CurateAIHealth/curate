
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  GetHCPFullName,
  rupeeToNumber,
} from "@/Lib/Actions";

interface RefundPopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  CompliteInfo: any;
  onSubmit: (refundData: any) => void;
  showClientAttendance: (view: any) => void;
}

// Parse dates safely: DD/MM/YYYY, D/M/YYYY or YYYY-MM-DD
const parseDateOnly = (value: any): Date | null => {
  if (!value) return null;

  if (value instanceof Date) {
    if (isNaN(value.getTime())) return null;

    return new Date(
      Date.UTC(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate()
      )
    );
  }

  const str = String(value).trim();

  let year: number;
  let month: number;
  let day: number;

  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    [year, month, day] = str
      .slice(0, 10)
      .split("-")
      .map(Number);
  } else {
    [day, month, year] = str
      .split(/[/-]/)
      .map(Number);
  }

  if (!year || !month || !day) return null;

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

// Format date as YYYY-MM-DD
const getDateKey = (value: any): string => {
  const date = parseDateOnly(value);

  return date
    ? date.toISOString().split("T")[0]
    : "";
};

// Calculate inclusive total days
const getInclusiveDays = (
  start: any,
  end: any
): number => {
  const startDate = parseDateOnly(start);
  const endDate = parseDateOnly(end);

  if (
    !startDate ||
    !endDate ||
    endDate < startDate
  ) {
    return 0;
  }

  return (
    Math.floor(
      (endDate.getTime() - startDate.getTime()) /
        86400000
    ) + 1
  );
};

export default function RefundPopup({
  isOpen,
  onClose,
  data,
  CompliteInfo,
  onSubmit,
  showClientAttendance,
}: RefundPopupProps) {
  const [refundType, setRefundType] = useState("full");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showBankPopup, setShowBankPopup] = useState(false);
  const [RefundData, setRefundData] = useState("");

  const UserFullInfo = useSelector(
    (state: any) => state.AdminFullInfo
  );

  const RegisterdUsers = useSelector(
    (state: any) => state.AdminUsers
  );

  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifsc: "",
    bankName: "",
    accountHolder: "",
    passBook: "",
    branch: "",
  });

  // Set refund processing date when popup opens
  useEffect(() => {
    if (isOpen && data?.EndDate) {
      setRefundData(getDateKey(data.EndDate));
    }
  }, [isOpen, data?.EndDate]);

  // Patient name
  const GetPatientName = (id: any) => {
    const filtered = RegisterdUsers?.find(
      (each: any) => each.userId === id
    );

    return filtered?.patientName || "Not Available";
  };

  // Format date for date input
  const formatDateForInput = (date: any) => {
    return getDateKey(date);
  };

  // Get HCP salary
  const GetHCPPayment = (id: any) => {
    if (!CompliteInfo?.length || !id) return 0;

    const address = CompliteInfo
      ?.map(
        (each: any) => each?.HCAComplitInformation
      )
      ?.find(
        (info: any) => info?.UserId === id
      )
      ?.PaymentforStaff || 0;

    return Number(address) || 0;
  };

  // =====================================
  // ATTENDANCE-BASED REFUND CALCULATION
  // =====================================

  // Total service days
  const totalServiceDays = getInclusiveDays(
    data?.StartDate,
    data?.EndDate
  );

  // Service period dates
  const startKey = getDateKey(data?.StartDate);
  const endKey = getDateKey(data?.EndDate);

  // Get ClientAttendance records
const clientAttendance = Array.isArray(data?.ClientAttendance)
  ? data.ClientAttendance
  : [];

console.log(
  "FULL CLIENT ATTENDANCE:",
  JSON.stringify(clientAttendance, null, 2)
);

  // Get unique attendance dates
  const presentDateKeys = new Set<string>();

  clientAttendance.forEach((item: any) => {
    const dateKey = getDateKey(
      item?.dateKey || item?.AttendanceDate
    );
console.log("dateKey:", dateKey, "startKey:", startKey, "endKey:", endKey);
    if (
      dateKey &&
      dateKey >= startKey &&
      dateKey <= endKey&&
      item.Status === "Present"
    ) {
      presentDateKeys.add(dateKey);
    }
  });

  // Actual present / working days
  const presentDays = presentDateKeys.size;

  // Absent + Not Marked Days
  const RefundDays = Math.max(
    0,
    totalServiceDays - presentDays
  );

  // Per-day client charge
  const perDayCharge = Number(
    rupeeToNumber(data?.ServiceCharge || 0).toFixed(2)
  );

  // Total service bill based on present days
  const ServiceBill = Number(
    (presentDays * perDayCharge).toFixed(2)
  );

  // Total client refund amount
  const ClientRefundAmount = Number(
    (RefundDays * perDayCharge).toFixed(2)
  );

  // HCP daily salary
  const perDayHCP = Math.round(
    GetHCPPayment(data?.HCA_Id) / 30
  );

  // Profit calculation based on actual working days
  const perDayProfit =
    perDayCharge - perDayHCP;

  const resultAmount =
    perDayProfit * presentDays;

  const isProfit = resultAmount >= 0;

  // =====================================
  // BANK INFORMATION
  // =====================================

  const handleAddBankInfo = () => {
    setShowBankPopup(true);
  };

  const handleBankChange = async (e: any) => {
    const { name, value } = e.target;

    // Upload passbook
    if (name === "passBook") {
      const file = e.target.files?.[0];

      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        alert("File too large. Max allowed is 10MB.");
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "video/webm",
        "video/ogg",
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Only image, video or PDF files are allowed.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(
          "/api/Upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setBankDetails((prev) => ({
          ...prev,
          passBook: res.data.url,
        }));
      } catch (error) {
        console.error("Passbook upload failed:", error);
        alert("Passbook upload failed.");
      }

      return;
    }

    // IFSC lookup
    if (name === "ifsc") {
      setBankDetails((prev) => ({
        ...prev,
        ifsc: value,
      }));

      if (value.length === 11) {
        try {
          const res = await fetch(
            `https://ifsc.razorpay.com/${value}`
          );

          if (!res.ok) {
            throw new Error("Invalid IFSC");
          }

          const bankData = await res.json();

          setBankDetails((prev) => ({
            ...prev,
            bankName: bankData.BANK || "",
            branch: bankData.BRANCH || "",
          }));
        } catch (error) {
          console.error("Invalid IFSC:", error);

          setBankDetails((prev) => ({
            ...prev,
            bankName: "",
            branch: "",
          }));
        }
      }

      return;
    }

    setBankDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // SUBMIT REFUND
  // =====================================

  const handleSubmit = () => {
    if (!reason) {
      alert("Please Select Reason");
      return;
    }

    if (
      refundType === "partial" &&
      (!amount || Number(amount) <= 0)
    ) {
      alert("Please enter a valid refund amount");
      return;
    }

    onSubmit({
      ...data,

      refundType,
      reason,
      notes,
      bankDetails,

      // Attendance-based calculation
      TotalServiceDays: totalServiceDays,
      WorkingDays: presentDays,
      RefundDays,

      // Refund processing date
      RefundData,

      // Financial calculation
      ServiceBill,
      ClientRefundAmount,

      isProfit,
      resultAmount,

      // Additional attendance information
      PresentDays: presentDays,
      AbsentAndNotMarkedDays: RefundDays,
    });

    setRefundData("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto p-3">

      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg my-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <img
            src="/Icons/Curate-logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-xl"
          />

          <div className="flex items-center gap-4 justify-between">

            <h2 className="text-lg font-semibold">
              Request Refund
            </h2>

            <button
              onClick={onClose}
              className="text-xl text-gray-500 cursor-pointer hover:bg-gray-200 rounded-full"
            >
              ×
            </button>

          </div>
        </div>

        {/* CLIENT INFORMATION */}
        <div className="mb-4 mt-3 rounded-xl bg-gray-50 p-3 text-sm space-y-2">

          <p>
            <span className="font-medium">Client:</span>{" "}
            {data?.clientName}
          </p>

          <p>
            <span className="font-medium">Patient:</span>{" "}
            {GetPatientName(data?.ClientId)}
          </p>

          <p>
            <span className="font-medium">Duration:</span>{" "}
            {data?.StartDate} → {data?.EndDate}
          </p>

          <p>
            <span className="font-medium">
              Refund Processing Date:
            </span>{" "}

            <input
              type="date"
              value={formatDateForInput(RefundData)}
              onChange={(e) =>
                setRefundData(e.target.value)
              }
              className="border rounded px-2 py-1"
            />
          </p>

          <hr />

          {/* ATTENDANCE SUMMARY */}
          <div className="space-y-1">

            <p className="font-semibold text-gray-800">
              Attendance Summary
            </p>

            <p>
              <span className="font-medium">
                Total Service Days:
              </span>{" "}
              {totalServiceDays} Days
            </p>

            <p>
              <span className="font-medium">
                Present / Working Days:
              </span>{" "}

              <span className="text-green-600 font-semibold">
                {presentDays} Days
              </span>
            </p>

            <p>
              <span className="font-medium">
                Absent + Not Marked Days:
              </span>{" "}
              {RefundDays} Days
            </p>

            <p>
              <span className="font-medium">
                Refund Days:
              </span>{" "}

              <span className="text-red-600 font-semibold">
                {RefundDays} Days
              </span>
            </p>

          </div>

          <hr />

          {/* CHARGES */}
          <p>
            <span className="font-medium">
              Charges:
            </span>{" "}

            ₹{(
              totalServiceDays * perDayCharge
            ).toFixed(2)}{" "}
            <span className="text-gray-500">
              / Total
            </span>

            {" | "}

            ₹{perDayCharge.toFixed(2)}{" "}
            <span className="text-gray-500">
              / Day
            </span>
          </p>

          <p>
            <span className="font-medium">
              HCP Salary:
            </span>{" "}

            {CompliteInfo?.length
              ? `₹${perDayHCP}/Day`
              : "Loading..."}
          </p>

          <p>
            <span className="font-medium">
              Location:
            </span>{" "}
            {data?.location}
          </p>

          <p>
            <span className="font-medium">
              HCP:
            </span>{" "}
            {GetHCPFullName(
              UserFullInfo,
              data?.HCA_Id
            )}
          </p>

          <p>
            <span className="font-medium">
              Contact:
            </span>{" "}
            {data?.contact}
          </p>

          <button
            type="button"
            onClick={() => showClientAttendance(true)}
            className="min-w-[180px] rounded-2xl cursor-pointer border border-blue-200 bg-blue-100 p-2 text-sm font-medium text-blue-800 shadow-md hover:bg-blue-200"
          >
            Client Attendance
          </button>

        </div>

        {/* SERVICE BILL AND REFUND AMOUNT */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3">

          <div className="flex flex-col items-center justify-center min-w-[180px] bg-green-200 rounded-2xl shadow-md p-3 border border-gray-100">

            <p className="text-sm text-green-800 mb-1">
              Service Bill
            </p>

            <p className="text-lg font-semibold text-gray-900">
              ₹ {ServiceBill.toFixed(2)}
            </p>

            <p className="text-xs text-gray-600">
              {presentDays} Present Days
            </p>

          </div>

          <div className="flex flex-col items-center justify-center min-w-[180px] bg-red-200 rounded-2xl shadow-md p-3 border border-gray-100">

            <p className="text-sm text-red-600 mb-1">
              Refund Amount
            </p>

            <p className="text-lg font-semibold text-gray-900">
              ₹ {ClientRefundAmount.toFixed(2)}
            </p>

            <p className="text-xs text-gray-600">
              {RefundDays} Refund Days
            </p>

          </div>

        </div>

        {/* PROFIT / LOSS */}
        <div
          className={`mt-4 flex items-center justify-between px-3 py-3 rounded-2xl shadow-md ${
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

        {/* REASON */}
        <div className="mb-4 mt-4">

          <div className="mb-1 text-sm font-medium">
            Reason
          </div>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border p-2"
          >
            <option value="">
              Select reason
            </option>

            <option>
              Service not satisfactory
            </option>

            <option>
              HCP issue
            </option>

            <option>
              Overcharged
            </option>

            <option>
              Cancelled early
            </option>

          </select>

        </div>

        {/* BANK INFORMATION POPUP */}
        {showBankPopup && (

          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3">

            <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-lg">

              <h2 className="text-lg font-semibold mb-4">
                Bank Information
              </h2>

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

              <div className="border-l-4 border-indigo-500 pl-4 py-2 shadow-lg rounded-md mb-3">

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
                  accept="image/*,video/*,application/pdf"
                  onChange={handleBankChange}
                  className="w-full text-sm text-gray-600
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer border border-gray-300 rounded-lg p-2"
                />

                {bankDetails.passBook && (
                  <p className="text-xs text-green-600 mt-2">
                    Passbook uploaded successfully.
                  </p>
                )}

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

        {/* ADDITIONAL NOTES */}
        <div className="mb-2">

          <div className="mb-1 text-sm font-medium">
            Additional Notes
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border p-2"
          />

          <button
            className="text-blue-600 text-xs cursor-pointer hover:underline"
            onClick={handleAddBankInfo}
          >
            Add Bank Information
          </button>

        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 mt-4">

          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Submit
          </button>

        </div>

      </div>
    </div>
  );
}
