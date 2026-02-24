import React, { useState, useEffect } from "react";

type SalaryPopupProps = {
  open: boolean;
  title?: any;
  defaultSalary?: any;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (salary: number) => void;
  StatusMsg:any
};

const SalaryPopup: React.FC<SalaryPopupProps> = ({
  open,
  title ,
  defaultSalary = 0,
  loading = false,
  onClose,
  onSubmit,
  StatusMsg,
}) => {
  const [salary, setSalary] = useState<number>(defaultSalary);

 

  if (!open) return null;

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
  <div className="w-[400px] max-w-[92%] rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden relative">

 
    <div className="bg-gradient-to-br from-[#00A9A5] to-[#005f61] p-4 text-white">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur">
          💰
        </div>
        <div>
          <p className="text-xs opacity-80">Salary Required</p>
          <h2 className="text-lg font-semibold">
            Update Salary for {title}
          </h2>
        </div>
      </div>
    </div>

  
    <div className="p-6 space-y-5">

      <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-500">
        Missing monthly salary detected. Please update to continue.
      </div>
<p className="text-[10px] text-gray-600">
    Enter Amount For Month
</p>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          ₹
        </span>
        <input
          type="text"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          placeholder="Enter Monthly Salary"
          className="w-full rounded-2xl border border-gray-200 pl-9 pr-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
      </div>
<p className="text-xs text-gray-600">
      Per day amount:{" "}
      <span className="font-semibold text-green-600">
        ₹{Math.round(Number(salary) / 30)}
      </span>
    </p>
     <p className="text-center text-xs">{StatusMsg}</p>
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          onClick={() => onSubmit(salary)}
          className="px-6 py-2.5 rounded-xl text-white bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:opacity-90 transition disabled:opacity-60 shadow-md"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>

    </div>

  </div>
</div>
  );
};

export default SalaryPopup;