"use client";

import React, { useMemo, useState } from "react";
import { CircleX, Search, Users } from "lucide-react";
import { years } from "@/Lib/Content";
import { UpdateMonthFilter, UpdateYearFilter } from "@/Redux/action";
import { useDispatch, useSelector } from "react-redux";

type Transaction = {
  id: string;
  field: "advance" | "hostel" | "other" | "incentives" | "others";
  previousAmount: number;
  changedAmount: number;
  newAmount: number;
  description: string;
  createdAt: string;
  action: "added" | "reduced";
};

type PayrollRow = {
  id: number;
  name: string;
  payment: number;
  advance: number;
  hostel: number;
  other: number;
  incentives: number;
  others: number;
  advanceDescription: string;
  hostelDescription: string;
  otherDescription: string;
  incentivesDescription: string;
  othersDescription: string;
  transactions: Transaction[];
};

export default function HCAPayrollTable() {
  const [search, setSearch] = useState("");
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<PayrollRow | null>(null);
  const [originalValues, setOriginalValues] = useState<Record<number, PayrollRow>>({});
  const [active, setActive] = useState("hca");
  const SearchMonth=useSelector((state:any)=>state.FilterMonth) 
  const SearchYear=useSelector((state:any)=>state.FilterYear) 
  const dispatch=useDispatch()

  const [data, setData] = useState<PayrollRow[]>([
    {
      id: 1,
      name: "Srinivas",
      payment: 10000,
      advance: 2000,
      hostel: 1000,
      other: 500,
      incentives: 1000,
      others: 300,
      advanceDescription: "",
      hostelDescription: "",
      otherDescription: "",
      incentivesDescription: "",
      othersDescription: "",
      transactions: []
    },
    {
      id: 2,
      name: "Ramesh Kumar",
      payment: 14500,
      advance: 1500,
      hostel: 900,
      other: 400,
      incentives: 1200,
      others: 600,
      advanceDescription: "",
      hostelDescription: "",
      otherDescription: "",
      incentivesDescription: "",
      othersDescription: "",
      transactions: []
    },
    {
      id: 3,
      name: "Anitha Devi",
      payment: 12000,
      advance: 1000,
      hostel: 700,
      other: 300,
      incentives: 900,
      others: 400,
      advanceDescription: "",
      hostelDescription: "",
      otherDescription: "",
      incentivesDescription: "",
      othersDescription: "",
      transactions: []
    },
    {
      id: 4,
      name: "Kiran Reddy",
      payment: 18000,
      advance: 2500,
      hostel: 1500,
      other: 1000,
      incentives: 2000,
      others: 900,
      advanceDescription: "",
      hostelDescription: "",
      otherDescription: "",
      incentivesDescription: "",
      othersDescription: "",
      transactions: []
    },
    {
      id: 5,
      name: "Mahesh",
      payment: 16000,
      advance: 1800,
      hostel: 1200,
      other: 700,
      incentives: 1700,
      others: 500,
      advanceDescription: "",
      hostelDescription: "",
      otherDescription: "",
      incentivesDescription: "",
      othersDescription: "",
      transactions: []
    },
  ]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const getTotal = (row: PayrollRow) =>
    row.payment -
    row.advance -
    row.hostel -
    row.other +
    row.incentives +
    row.others;

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
const handleSave = (row: PayrollRow) => {
  const originalRow = originalValues[row.id];
  if (!originalRow) return;

  const editableFields = [
    ["advance", "advanceDescription"],
    ["hostel", "hostelDescription"],
    ["other", "otherDescription"],
    ["incentives", "incentivesDescription"],
    ["others", "othersDescription"],
  ];

  const newTransactions: Transaction[] = [];

  editableFields.forEach(([amountField, descField]) => {
    const oldValue = originalRow[amountField as keyof PayrollRow] as number;
    const newValue = row[amountField as keyof PayrollRow] as number;
    const description = row[descField as keyof PayrollRow] as string;

    if (oldValue !== newValue) {
      newTransactions.push({
        id: crypto.randomUUID(),
        field: amountField as Transaction["field"],
        previousAmount: oldValue,
        changedAmount: Math.abs(newValue - oldValue),
        newAmount: newValue,
        description,
        createdAt: new Date().toLocaleString(),
        action: newValue > oldValue ? "added" : "reduced",
      });
    }
  });

  setData((prev) =>
    prev.map((item) =>
      item.id === row.id
        ? {
            ...row,
            transactions: [...item.transactions, ...newTransactions],
          }
        : item
    )
  );

  if (selectedTransactions?.id === row.id) {
    setSelectedTransactions({
      ...row,
      transactions: [...row.transactions, ...newTransactions],
    });
  }

  setOriginalValues((prev) => {
    const updated = { ...prev };
    delete updated[row.id];
    return updated;
  });

  setEditingRowId(null);
};
  const handleChange = (
    id: number,
    field: keyof PayrollRow,
    value: string | number
  ) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]:
                typeof row[field] === "number" ? Number(value) || 0 : value,
            }
          : row
      )
    );
  };

  const fields = [
    ["advance", "advanceDescription", "Advance"],
    ["hostel", "hostelDescription", "Hostel"],
    ["other", "otherDescription", "Other"],
    ["incentives", "incentivesDescription", "Incentives"],
    ["others", "othersDescription", "Others"],
  ];

  return (
    <div className="w-full min-h-screen bg-[#f4f7fb] p-3 md:p-6 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <img
            src="/Icons/Curate-logoq.png"
            alt="Company Logo"
            className="h-12 w-12 object-contain"
          />

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
              ACCOUNTS
            </h1>
            <p className="text-sm text-[#64748b]">Payroll Management Dashboard</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full lg:justify-end">
           <button
        onClick={() => setActive("clients")}
        className={`h-11 px-5 rounded-2xl text-white cursor-pointer font-semibold flex items-center justify-center gap-2 ${
          active === "clients"
            ? "bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e]"
            : "bg-[#0f172a] hover:bg-[#1e293b]"
        }`}
      >
        <Users size={16} />
        Clients
      </button>

      <button
        onClick={() => setActive("hca")}
        className={`h-11 px-5 rounded-2xl text-white font-semibold cursor-pointer flex items-center justify-center gap-2 ${
          active === "hca"
            ? "bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e]"
            : "bg-[#0f172a] hover:bg-[#1e293b]"
        }`}
      >
        <Users size={16} />
        HCA
      </button>


          <div className="relative w-full md:max-w-[350px]">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-2xl border border-[#d9e2ec] bg-white pl-12 pr-4 text-black"
            />
          </div>
             <div className="flex gap-3">
                       <select
                value={SearchMonth}
                onChange={(e) => dispatch(UpdateMonthFilter(e.target.value))}
                className="
                  w-full sm:w-[140px] h-[40px]
                  rounded-xl border border-gray-300
                  px-3 text-sm bg-white text-gray-800
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
              >
                
                <option value="">All Months</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={`${i + 1}`}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
          
              {/* Year */}
              <select
                value={SearchYear}
                onChange={(e) => dispatch(UpdateYearFilter(e.target.value))}
                className="
                  w-full sm:w-[120px] h-[40px]
                  rounded-xl border border-gray-300
                  px-3 text-sm bg-white text-gray-800
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
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

      <div className="hidden xl:block bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-white text-sm">
              <th className="bg-teal-600 p-4 text-left">HCA Name</th>
              <th className="bg-teal-600 p-4 text-left">Payment</th>
              <th className="bg-red-600 p-4 text-left">Advance</th>
              <th className="bg-red-600 p-4 text-left">Hostel</th>
              <th className="bg-red-600 p-4 text-left">Other</th>
              <th className="bg-blue-500 p-4 text-left">Incentives</th>
              <th className="bg-blue-500 p-4 text-left">Others</th>
              <th className="bg-[#0f172a] w-[250px] p-4 text-center">Action</th>
              <th className="bg-[#0f172a] p-4 text-left">Total</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row) => {
              const isEditing = editingRowId === row.id;

              return (
                <tr key={row.id} className="border-b">
                  <td className="p-4 font-semibold">{row.name}</td>
                  <td className="p-4">{formatCurrency(row.payment)}</td>

                  {fields.map(([amountField, descField]) => (
                    <td key={amountField} className="p-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="number"
                            value={row[amountField as keyof PayrollRow] as number}
                            onChange={(e) =>
                              handleChange(
                                row.id,
                                amountField as keyof PayrollRow,
                                e.target.value
                              )
                            }
                            className="w-full h-10 px-3 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={row[descField as keyof PayrollRow] as string}
                            onChange={(e) =>
                              handleChange(
                                row.id,
                                descField as keyof PayrollRow,
                                e.target.value
                              )
                            }
                            className="w-full h-10 px-3 border rounded-lg"
                          />
                        </div>
                      ) : (
                        <div>
                          <div>{formatCurrency(row[amountField as keyof PayrollRow] as number)}</div>
                          <div className="text-xs text-gray-500">
                            {row[descField as keyof PayrollRow] as string}
                          </div>
                        </div>
                      )}
                    </td>
                  ))}

                 <td className="w-[260px] px-4 py-3">
  <div className="flex items-center justify-center gap-2">
    <button
      onClick={() => {
        if (isEditing) {
          handleSave(row);
        } else {
          setOriginalValues((prev) => ({
            ...prev,
            [row.id]: { ...row },
          }));
          setEditingRowId(row.id);
        }
      }}
      className={`h-10 px-3 cursor-pointer flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all duration-200 shadow-sm whitespace-nowrap
        ${
          isEditing
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-white text-slate-900 border-slate-300 hover:border-slate-400"
        }`}
    >
      {isEditing ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Edit
        </>
      )}
    </button>

    <button
      onClick={() => setSelectedTransactions(row)}
      className="h-10 px-3 flex items-center cursor-pointer justify-center gap-2 rounded-xl bg-slate-900 text-white text-sm font-medium border border-slate-900 hover:bg-black transition-all duration-200 whitespace-nowrap"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-6m4 6V7m4 10V4"
        />
      </svg>
      Financial history
    </button>
  </div>
</td>

                  <td className="p-4 font-bold">
                    {formatCurrency(getTotal(row))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="xl:hidden space-y-4">
        {filteredData.map((row) => {
          const isEditing = editingRowId === row.id;

          return (
            <div key={row.id} className="bg-white rounded-2xl shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-lg">{row.name}</h3>
                  <p className="text-sm text-gray-500">
                    Payment: {formatCurrency(row.payment)}
                  </p>
                </div>
                <div className="font-bold text-lg">
                  {formatCurrency(getTotal(row))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(([amountField, descField, label]) => (
                  <div key={amountField}>
                    <p className="font-semibold mb-2">{label}</p>

                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={row[amountField as keyof PayrollRow] as number}
                          onChange={(e) =>
                            handleChange(
                              row.id,
                              amountField as keyof PayrollRow,
                              e.target.value
                            )
                          }
                          className="w-full h-10 px-3 border rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={row[descField as keyof PayrollRow] as string}
                          onChange={(e) =>
                            handleChange(
                              row.id,
                              descField as keyof PayrollRow,
                              e.target.value
                            )
                          }
                          className="w-full h-10 px-3 border rounded-lg"
                        />
                      </div>
                    ) : (
                      <>
                        <div>{formatCurrency(row[amountField as keyof PayrollRow] as number)}</div>
                        <div className="text-xs text-gray-500">
                          {row[descField as keyof PayrollRow] as string}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() =>
                  setEditingRowId(isEditing ? null : row.id)
                }
                className="w-full mt-5 h-11 rounded-xl bg-[#0ea5a4] text-white font-semibold"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
          );
        })}
      </div>
      {selectedTransactions && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-2xl rounded-2xl max-h-[85vh] overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <img
            src="/Icons/Curate-logoq.png"
            className="h-12"
            alt="Company Logo"
          />
        <h2 className="text-2xl font-bold text-[#0f172a]">
          {selectedTransactions.name} Earnings and expenditures
        </h2>
          </div>

        <button
          onClick={() => setSelectedTransactions(null)}
          className="px-4 py-2  text-gray-700 rounded-xl cursor-pointer"
        >
           <CircleX />
        </button>
      </div>

      {selectedTransactions.transactions.length === 0 ? (
        <p className="text-gray-500">No Expenses found</p>
      ) : (
        <div className="space-y-4">
          {selectedTransactions.transactions
            .slice()
            .reverse()
            .map((transaction) => (
              <div
                key={transaction.id}
                className="border rounded-2xl p-4 bg-[#f8fafc]"
              >
<div
  className={`flex justify-between items-center ${
    (transaction.field === "incentives" || transaction.field === "others")
      ? "text-green-800"
      : "text-red-600"
  } mb-2`}
>
                  <h3 className="font-bold capitalize text-lg">
                    {transaction.field}
                  </h3>

                  <span
                    className={`text-sm font-semibold ${
                      transaction.action === "added"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.action.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-[#334155]">
                  <p>
                    Previous Amount: ₹
                    {transaction.previousAmount.toLocaleString()}
                  </p>

                  <p>
                    {transaction.action === "added"
                      ? "Added Amount"
                      : "Reduced Amount"}
                    : ₹{transaction.changedAmount.toLocaleString()}
                  </p>

                  <p>
                    New Total: ₹{transaction.newAmount.toLocaleString()}
                  </p>

                  <p>Description: {transaction.description || "No description"}</p>

                  <p>Date: {transaction.createdAt}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}