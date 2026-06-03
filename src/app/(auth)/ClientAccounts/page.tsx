'use client'

import { years } from "@/Lib/Content";
import { UpdateMonthFilter, UpdateYearFilter } from "@/Redux/action";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ClientAccountingInfo(){
     const [search, setSearch] = useState("");
     const [editRow, setEditRow] = useState(null);
const [editPayment, setEditPayment] = useState("");
const [editRefund, setEditRefund] = useState("");
       const SearchMonth = useSelector((state: any) => state.FilterMonth);
  const SearchYear = useSelector((state: any) => state.FilterYear);
  const dispatch=useDispatch()
    const data = [
  {
    Clientid: "CL001",
    name: "Sunrise Health Services",
    refund: 2500,
    payment: 85000,
    CompliteAttendeceSummery: {
      present: 24,
      halfDay: 2,
    },
    transactions: [
      {
        id: 1,
        field: "refund",
        action: "added",
        previousAmount: 1000,
        changedAmount: 1500,
        newAmount: 2500,
        description: "Duplicate payment adjustment",
        createdAt: "2026-05-01",
        UpdatedBy: "Accounts Team",
      },
    ],
  },
  {
    Clientid: "CL002",
    name: "Care First Medical",
    refund: 1800,
    payment: 72000,
    CompliteAttendeceSummery: {
      present: 22,
      halfDay: 3,
    },
    transactions: [
      {
        id: 2,
        field: "refund",
        action: "added",
        previousAmount: 800,
        changedAmount: 1000,
        newAmount: 1800,
        description: "Invoice correction",
        createdAt: "2026-05-03",
        UpdatedBy: "Finance Team",
      },
    ],
  },
  {
    Clientid: "CL003",
    name: "Wellness Home Care",
    refund: 3200,
    payment: 94000,
    CompliteAttendeceSummery: {
      present: 26,
      halfDay: 1,
    },
    transactions: [
      {
        id: 3,
        field: "refund",
        action: "added",
        previousAmount: 1200,
        changedAmount: 2000,
        newAmount: 3200,
        description: "Overpayment settlement",
        createdAt: "2026-05-05",
        UpdatedBy: "Admin",
      },
    ],
  },
  {
    Clientid: "CL004",
    name: "Golden Life Health",
    refund: 1500,
    payment: 67000,
    CompliteAttendeceSummery: {
      present: 21,
      halfDay: 4,
    },
    transactions: [
      {
        id: 4,
        field: "refund",
        action: "added",
        previousAmount: 500,
        changedAmount: 1000,
        newAmount: 1500,
        description: "Service cancellation adjustment",
        createdAt: "2026-05-08",
        UpdatedBy: "Accounts Manager",
      },
    ],
  },
  {
    Clientid: "CL005",
    name: "Harmony Care Solutions",
    refund: 2800,
    payment: 81000,
    CompliteAttendeceSummery: {
      present: 23,
      halfDay: 2,
    },
    transactions: [
      {
        id: 5,
        field: "refund",
        action: "added",
        previousAmount: 800,
        changedAmount: 2000,
        newAmount: 2800,
        description: "Client reimbursement",
        createdAt: "2026-05-10",
        UpdatedBy: "Finance Team",
      },
    ],
  },
  {
    Clientid: "CL006",
    name: "Prime Healthcare Partners",
    refund: 3500,
    payment: 105000,
    CompliteAttendeceSummery: {
      present: 27,
      halfDay: 1,
    },
    transactions: [
      {
        id: 6,
        field: "refund",
        action: "added",
        previousAmount: 1500,
        changedAmount: 2000,
        newAmount: 3500,
        description: "Duplicate billing refund",
        createdAt: "2026-05-12",
        UpdatedBy: "Accounts Team",
      },
    ],
  },
  {
    Clientid: "CL007",
    name: "Elite Home Nursing",
    refund: 1200,
    payment: 59000,
    CompliteAttendeceSummery: {
      present: 20,
      halfDay: 3,
    },
    transactions: [
      {
        id: 7,
        field: "refund",
        action: "added",
        previousAmount: 200,
        changedAmount: 1000,
        newAmount: 1200,
        description: "Invoice revision",
        createdAt: "2026-05-15",
        UpdatedBy: "Admin",
      },
    ],
  },
  {
    Clientid: "CL008",
    name: "Silverline Medical Care",
    refund: 4000,
    payment: 112000,
    CompliteAttendeceSummery: {
      present: 28,
      halfDay: 0,
    },
    transactions: [
      {
        id: 8,
        field: "refund",
        action: "added",
        previousAmount: 2000,
        changedAmount: 2000,
        newAmount: 4000,
        description: "Annual contract adjustment",
        createdAt: "2026-05-18",
        UpdatedBy: "Finance Head",
      },
    ],
  },
];
const handleSave = async (
  clientId:any,
  payment:any,
  refund:any
) => {
  // Update DB here

  setEditRow(null);
};
    return (
<div className="w-full h-screen bg-[#f4f7fb] p-4 md:p-2 overflow-hidden">
  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-6">
    <div className="flex flex-col lg:flex-row justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-[#00A9A5]/10 flex items-center justify-center">
          <img
            src="/Icons/Curate-logoq.png"
            alt="Curate"
            className="h-10 w-10 object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">
            Client Payment Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Manage client payments, refunds and transaction history
          </p>
        </div>
      </div>

      <div className="flex  flex-wrap gap-3">
        <div className="relative  ">
       <Search
  size={18}
  className="absolute mt-1 left-4 top-1/3 -translate-y-1/2 text-slate-400"
/>

          <input
            type="text"
            placeholder="Search Clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[280px] h-12 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 outline-none focus:border-[#00A9A5]"
          />
        </div>

        <select
          value={SearchMonth}
          onChange={(e) => dispatch(UpdateMonthFilter(e.target.value))}
          className="h-12 px-4 rounded-2xl border border-slate-200 bg-white"
        >
          <option value="">All Months</option>

          {[...Array(12)].map((_, i) => (
            <option key={i} value={`${i + 1}`}>
              {new Date(0, i).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        <select
          value={SearchYear}
          onChange={(e) => dispatch(UpdateYearFilter(e.target.value))}
          className="h-12 px-4 rounded-2xl border border-slate-200 bg-white"
        >
          <option value="">All Years</option>

          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>

 

<div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
  <div className="max-h-[650px] overflow-auto">
    <table className="w-full table-fixed">
      <thead className="sticky top-0 z-20">
        <tr className="bg-[#0f172a] text-white">
          <th className="w-[5%] px-4 py-4 text-left">#</th>
          <th className="w-[25%] px-4 py-4 text-left">Client Name</th>
          <th className="w-[12%] px-4 py-4 text-center">Timesheet</th>
          <th className="w-[12%] px-4 py-4 text-center">Payment</th>
          <th className="w-[12%] px-4 py-4 text-center">Refund</th>
          <th className="w-[14%] px-4 py-4 text-center">Net Amount</th>
          <th className="w-[20%] px-4 py-4 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row:any, index) => {
          const isEditing = editRow === row.Clientid;

          return (
            <tr
              key={row.Clientid}
              className="border-b border-slate-100 hover:bg-slate-50 transition"
            >
              <td className="px-4 py-5 font-semibold">
                {index + 1}
              </td>

              <td className="px-4 py-5">
                <div>
                  <h4 className="font-semibold text-slate-800">
                    {row.name}
                  </h4>

                  <p className="text-xs text-slate-500">
                    {row.Clientid}
                  </p>
                </div>
              </td>

              <td className="px-4 py-5 text-center">
                <button
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                >
                  View
                </button>
              </td>

              <td className="px-4 py-5 text-center">
                {isEditing ? (
                  <input
                    type="number"
                    value={editPayment}
                    onChange={(e) =>
                      setEditPayment(e.target.value)
                    }
                    className="w-28 text-center border rounded-xl p-2"
                  />
                ) : (
                  <span className="inline-flex px-4 py-2 rounded-xl bg-green-50 text-green-700 font-semibold">
                    {Number(row.payment).toLocaleString()}
                  </span>
                )}
              </td>

              <td className="px-4 py-5 text-center">
                {isEditing ? (
                  <input
                    type="number"
                    value={editRefund}
                    onChange={(e) =>
                      setEditRefund(e.target.value)
                    }
                    className="w-28 text-center border rounded-xl p-2"
                  />
                ) : (
                  <span className="inline-flex px-4 py-2 rounded-xl bg-orange-50 text-orange-600 font-semibold">
                    {Number(row.refund).toLocaleString()}
                  </span>
                )}
              </td>

              <td className="px-4 py-5 text-center">
                <span className="inline-flex px-4 py-2 rounded-xl bg-[#00A9A5]/10 text-[#00A9A5] font-bold">
                  
                  {(
                    Number(
                      isEditing
                        ? editPayment
                        : row.payment
                    ) -
                    Number(
                      isEditing
                        ? editRefund
                        : row.refund
                    )
                  ).toLocaleString()}
                </span>
              </td>

              <td className="px-4 py-5">
                <div className="flex justify-center gap-2 flex-wrap">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() =>
                          handleSave(
                            row.Clientid,
                            editPayment,
                            editRefund
                          )
                        }
                        className="h-10 px-4 rounded-xl bg-green-600 text-white"
                      >
                        Save
                      </button>

                      <button
                        onClick={() =>
                          setEditRow(null)
                        }
                        className="h-10 px-4 rounded-xl bg-red-500 text-white"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditRow(row.Clientid);
                          setEditPayment(
                            row.payment
                          );
                          setEditRefund(
                            row.refund
                          );
                        }}
                        className="h-10 px-4 rounded-xl bg-[#00A9A5] text-white"
                      >
                        Edit
                      </button>

                      <button
                        className="h-10 px-4 rounded-xl bg-indigo-600 text-white"
                      >
                        History
                      </button>

                      <button
                        className="h-10 px-4 rounded-xl bg-green-600 text-white"
                      >
                        Send 
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>
</div>
    )
}