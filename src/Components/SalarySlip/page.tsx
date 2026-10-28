
"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";

type SalaryRecord = {
  id: number;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  month: string;
  year: number;
  basic: number;
  hra: number;
  allowances: number;
  bonus: number;
  pf: number;
  tax: number;
  otherDeductions: number;
};

const salaryData: SalaryRecord[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "Siddhu",
    designation: "Software Developer",
    department: "IT",
    month: "October",
    year: 2026,
    basic: 25000,
    hra: 5000,
    allowances: 3000,
    bonus: 2000,
    pf: 1800,
    tax: 0,
    otherDeductions: 500,
  },
  {
    id: 2,
    employeeId: "EMP001",
    employeeName: "Siddhu",
    designation: "Software Developer",
    department: "IT",
    month: "September",
    year: 2026,
    basic: 25000,
    hra: 5000,
    allowances: 3000,
    bonus: 0,
    pf: 1800,
    tax: 0,
    otherDeductions: 500,
  },
  {
    id: 3,
    employeeId: "EMP002",
    employeeName: "Rahul",
    designation: "Frontend Developer",
    department: "IT",
    month: "October",
    year: 2026,
    basic: 30000,
    hra: 6000,
    allowances: 4000,
    bonus: 3000,
    pf: 2160,
    tax: 500,
    otherDeductions: 0,
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

interface HideProp{
Hide:(close:any)=>void

}



export default function SalarySlip(Hide:HideProp) {
  const [records] = useState(salaryData);
  const [employeeFilter, setEmployeeFilter] = useState("EMP001");
  const [month, setMonth] = useState("October");
  const [year, setYear] = useState(2026);

  const employees = useMemo(
    () => Array.from(
      new Map(records.map((r) => [r.employeeId, r])).values()
    ),
    [records]
  );

  const selected = records.find(
    (r) =>
      r.employeeId === employeeFilter &&
      r.month === month &&
      r.year === year
  );

  const gross = selected
    ? selected.basic + selected.hra + selected.allowances + selected.bonus
    : 0;

  const deductions = selected
    ? selected.pf + selected.tax + selected.otherDeductions
    : 0;

  const net = gross - deductions;

  const printSlip = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Salary Slips
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View and print monthly employee payslips.
            </p>
          </div>
<div className="flex items-center gap-2">
          <button
            onClick={printSlip}
            disabled={!selected}
            className="rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-40 print:hidden"
          >
            Print / Save as PDF
          </button>
          


<button
  type="button"
  onClick={() => Hide?.Hide(false)}
  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 print:hidden"
>
  <X
    size={18}
    className="transition-transform duration-200 group-hover:rotate-90"
  />
  Close
</button>

          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 print:hidden">
          <label className="text-sm font-medium">
            Employee
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="mt-2 w-full rounded-xl border bg-white p-3"
            >
              {employees.map((employee) => (
                <option
                  key={employee.employeeId}
                  value={employee.employeeId}
                >
                  {employee.employeeName} ({employee.employeeId})
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium">
            Month
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mt-2 w-full rounded-xl border bg-white p-3"
            >
              {months.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium">
            Year
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border bg-white p-3"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>

        {!selected ? (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <h2 className="font-semibold text-slate-800">
              Salary slip not found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              No demo salary record exists for this employee and month.
              Try October or September 2026 for Siddhu.
            </p>
          </div>
        ) : (
          <div
            id="salary-slip"
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 print:border-0 print:p-0 print:shadow-none"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
              <div>
                <p className="text-xl font-bold text-teal-700">
                  CURATE
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Employee Payroll Statement
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-slate-900">
                  SALARY SLIP
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {month} {year}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs uppercase text-slate-500">
                  Employee Details
                </p>
                <p className="font-semibold">{selected.employeeName}</p>
                <p className="text-sm text-slate-600">
                  Employee ID: {selected.employeeId}
                </p>
                <p className="text-sm text-slate-600">
                  Designation: {selected.designation}
                </p>
                <p className="text-sm text-slate-600">
                  Department: {selected.department}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Net Salary Payable</p>
                <p className="mt-2 text-3xl font-bold text-emerald-700">
                  {money(net)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  For {month} {year}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border">
                <h3 className="bg-emerald-50 p-4 font-semibold text-emerald-800">
                  Earnings
                </h3>
                {[
                  ["Basic Salary", selected.basic],
                  ["HRA", selected.hra],
                  ["Other Allowances", selected.allowances],
                  ["Bonus", selected.bonus],
                ].map(([label, amount]) => (
                  <div
                    key={String(label)}
                    className="flex justify-between gap-3 border-t p-4 text-sm"
                  >
                    <span>{label}</span>
                    <span className="font-medium">
                      {money(Number(amount))}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t bg-slate-50 p-4 font-bold">
                  <span>Gross Earnings</span>
                  <span>{money(gross)}</span>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border">
                <h3 className="bg-red-50 p-4 font-semibold text-red-800">
                  Deductions
                </h3>
                {[
                  ["Provident Fund", selected.pf],
                  ["Tax", selected.tax],
                  ["Other Deductions", selected.otherDeductions],
                ].map(([label, amount]) => (
                  <div
                    key={String(label)}
                    className="flex justify-between gap-3 border-t p-4 text-sm"
                  >
                    <span>{label}</span>
                    <span className="font-medium">
                      {money(Number(amount))}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t bg-slate-50 p-4 font-bold">
                  <span>Total Deductions</span>
                  <span>{money(deductions)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-teal-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-semibold text-teal-900">
                  Net Salary
                </span>
                <span className="text-2xl font-bold text-teal-800">
                  {money(net)}
                </span>
              </div>
              <p className="mt-2 text-sm text-teal-800">
                Gross earnings minus total deductions.
              </p>
            </div>

            <div className="border-t pt-5 text-center text-xs text-slate-500">
              This is a computer-generated demo payslip.
              Replace sample values with verified payroll records before
              issuing official salary slips.
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          body * {
            visibility: hidden;
          }
          #salary-slip,
          #salary-slip * {
            visibility: visible;
          }
          #salary-slip {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 12mm;
          }
        }
      `}</style>
    </div>
  );
}
