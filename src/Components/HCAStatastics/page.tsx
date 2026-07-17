"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
  Landmark,
  CreditCard,
} from "lucide-react";

interface Transaction {
  title: string;
  amount: number;
  type: "credit" | "debit";
  description?: string;
}

interface PaymentSummary {
  month: string;
  total: number;
  finalAmount: number;
  paid: boolean;
  bank?: string;
  transactionNumber?: string;
  paymentMode?: string;
  paymentDate?: string;
}

interface PaymentPassbookProps {
  summary: PaymentSummary;
  transactions: Transaction[];
}

export default function PaymentPassbook({
  summary,
  transactions,
}: PaymentPassbookProps) {
  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const parseMonthYear = (monthString: string) => {
    const parsed = new Date(monthString);
    if (!Number.isNaN(parsed.getTime())) {
      return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    }

    const [name, year] = monthString.split(" ");
    const month = monthNames.indexOf(name);
    if (month >= 0 && year && !Number.isNaN(Number(year))) {
      return new Date(Number(year), month, 1);
    }

    return new Date();
  };

  const [monthDate, setMonthDate] = useState<Date>(() =>
    summary.month ? parseMonthYear(summary.month) : new Date()
  );

  useEffect(() => {
    if (summary.month) {
      setMonthDate(parseMonthYear(summary.month));
    }
  }, [summary.month]);

  const handlePrevMonth = () =>
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const handleNextMonth = () =>
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const formatMonthYear = (date: Date) =>
    date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const periodLabel = summary.month ? formatMonthYear(monthDate) : "All-time";

  const formatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  function downloadCSV(transactions: Transaction[], summary: PaymentSummary): void {
    try {
      const headers = ["Title", "Description", "Type", "Amount"];
      const rows = transactions.map((t) => [t.title, t.description ?? "", t.type, t.amount.toString()]);
      const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = `passbook_${summary.month ? summary.month.replace(/\s+/g, "_") : "all"}.csv`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      // silent fail
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  function handleShare(transactions: Transaction[], summary: PaymentSummary): void {
    try {
      const textLines = transactions.map((t) => `${t.title} - ${t.type.toUpperCase()} - ₹${formatter.format(t.amount)}${t.description ? ` - ${t.description}` : ""}`);
      const body = [`HCP Payment Passbook - ${summary.month ?? "All time"}`, `Total: ₹${formatter.format(summary.total)}`, "", ...textLines].join("\n");

      if ((navigator as any).share) {
        (navigator as any).share({
          title: `Passbook - ${summary.month ?? "All time"}`,
          text: body,
        }).catch(() => {});
        return;
      }

      // Fallback: copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(body).catch(() => {});
        return;
      }

      // Last resort: open mailto
      const mailto = `mailto:?subject=${encodeURIComponent(`Passbook - ${summary.month ?? "All time"}`)}&body=${encodeURIComponent(body)}`;
      window.open(mailto, "_blank");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 py-8">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
        {/* Modern Header */}
        <div className="px-6 py-6 text-white" style={{ backgroundColor: '#1392d3' }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
              <div className="rounded-xl bg-white/80 p-3 flex items-center justify-center w-20 h-20">
                    <img
            src="/Icons/Curate-logoq.png"
            alt="Company Logo"
            className="h-12 w-12 object-contain"
          />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-100/90">Career Passbook</p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">HCP Career Payment Passbook</h1>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-100">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={handlePrevMonth}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/90 transition hover:bg-white/20"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <span className="font-medium">{periodLabel}</span>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={handleNextMonth}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/90 transition hover:bg-white/20"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/8 px-4 py-2 text-sm font-medium text-white">
                {summary.bank ?? "Bank Unavailable"}
              </div>
              <div className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold ${summary.paid ? "bg-emerald-500/20 text-emerald-50" : "bg-amber-400/20 text-amber-50"}`}>
                {summary.paid ? <CheckCircle2 size={18} className="text-emerald-50" /> : <Clock3 size={18} className="text-amber-50" />}
                {summary.paid ? "Paid" : "Pending"}
              </div>
        <div className="flex overflow-hidden rounded-2xl bg-white shadow-lg">

  <button
    type="button"
    onClick={() => downloadCSV(transactions, summary)}
    className="flex items-center gap-2 border-r border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-50 transition"
  >
    <ArrowDownCircle size={18} />
    <span className="text-sm font-semibold">Download</span>
  </button>

  <button
    type="button"
    onClick={() => handleShare(transactions, summary)}
    className="flex items-center gap-2 px-5 py-3 text-slate-700 hover:bg-slate-50 transition"
  >
    <ArrowUpCircle size={18} />
    <span className="text-sm font-semibold">Share</span>
  </button>

</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-b border-slate-200 px-6 py-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Gross Amount" value={summary.total} color="text-slate-900" formatter={formatter} />
          <Card title="Total Credit" value={totalCredit} color="text-emerald-700" formatter={formatter} />
          <Card title="Total Debit" value={totalDebit} color="text-rose-600" formatter={formatter} />
          <Card title="Closing Balance" value={summary.finalAmount} color="text-slate-900" formatter={formatter} />
        </div>

        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-900">Transaction History</h2>
          <p className="mt-1 text-sm text-slate-500">Complete career transaction history for the HCP.</p>
        </div>

        <div className="px-4 py-4">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-3 text-sm uppercase tracking-[0.12em] text-slate-500">
            <span>Description</span>
            <span className="text-right">Type</span>
            <span className="text-right">Amount</span>
          </div>

          {transactions.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-500">No transactions found for this period.</div>
          ) : (
            <div className="space-y-2">
              {transactions.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col gap-2 rounded-xl border p-4 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"} md:grid md:grid-cols-[2fr_1fr_1fr] md:items-center`}
                >
                  <div>
                    <span className="font-medium text-slate-900">{item.title}</span>
                    {item.description ? <div className="mt-1 text-sm text-slate-500">{item.description}</div> : null}
                  </div>
                  <div className={`md:text-right font-semibold ${item.type === "credit" ? "text-emerald-600" : "text-rose-600"}`}>{item.type === "credit" ? "Credit" : "Debit"}</div>
                  <div className={`md:text-right font-semibold ${item.type === "credit" ? "text-emerald-600" : "text-rose-600"}`}>{item.type === "credit" ? "+" : "-"}₹{formatter.format(item.amount)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 bg-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Net balance after transactions</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">₹{formatter.format(summary.finalAmount)}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Statement generated</p>
            <p className="mt-1 text-sm text-slate-700">{periodLabel}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-900">Payment Information</h2>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <Info icon={<CreditCard size={18} />} label="Payment Mode" value={summary.paymentMode ?? "N/A"} />
          <Info icon={<Landmark size={18} />} label="Bank" value={summary.bank ?? "N/A"} />
          <Info icon={<CreditCard size={18} />} label="Transaction No" value={summary.transactionNumber ?? "N/A"} />
          <Info icon={summary.paid ? <CheckCircle2 size={18} className="text-emerald-600" /> : <XCircle size={18} className="text-rose-500" />} label="Status" value={summary.paid ? "Paid" : "Pending"} />
          {summary.paymentDate ? <Info icon={<Clock3 size={18} />} label="Payment Date" value={summary.paymentDate} /> : null}
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Helper Components ---------------------- */

function Card({
  title,
  value,
  color,
  formatter,
}: {
  title: string;
  value: number;
  color: string;
  formatter: Intl.NumberFormat;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-5 text-center border">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className={`mt-2 text-2xl font-bold ${color}`}>
        ₹
        {formatter.format(value)}
      </h3>

    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b pb-3">

      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span>{label}</span>
      </div>

      <span className="font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
}