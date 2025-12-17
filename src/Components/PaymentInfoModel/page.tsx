'use client'

import React, { useMemo } from "react";

type DayStatus = "P" | "NA" | "HP" | "A";

interface BillingResult {
  daysCount: { P: number; HP: number; A: number; NA: number; totalDaysRecorded: number };
  client: {
    dailyRate: number;             
    amountFromP: number;
    amountFromHP: number;
    totalClientCharge: number;
  };
  hcp: {
    dailyRate: number;              
    amountFromP: number;
    amountFromHP: number;
    totalHcpPay: number;           
    overrideHcpTotal?: number;      
  };
  adjustments: {
    hostelDeduction: number;
    referralBonus: number;
    vendorShare: number;
    adminEdits: number;
  };
  taxes: {
    taxRate: number;
    taxAmount: number;
  };
  final: {
    payableToHcp: number;
    receivableFromClient: number;
    margin: number;
  };
  notes: string[];
}


function normalizeDaysStatus(days: any[]): DayStatus[] {
  if (!Array.isArray(days)) return [];

  return days.map((d: any) => {
    if (!d && d !== 0) return "NA";


    if (typeof d === "string") {
      if (d === "-" || d === "NA") return "NA";
      if (d === "P" || d === "HP" || d === "A") return d as DayStatus;
      return "NA";
    }


    if (typeof d === "object") {
      const hcp = Boolean(d.HCPAttendence === true);
      const admin = Boolean(d.AdminAttendece === true);

      if (hcp && admin) return "P";
      if (hcp || admin) return "HP";
      return "A";
    }

    return "NA";
  });
}


function calculateBilling(record: any, opts?: {
  taxRate?: number;         
  referralPercent?: number; 
  adminEdit?: number;
}): BillingResult {
 
  const daysStatus = normalizeDaysStatus(record.days || []);

  const counts = daysStatus.reduce((acc: any, s: DayStatus) => {
    if (s === "P") acc.P++;
    else if (s === "HP") acc.HP++;
    else if (s === "A") acc.A++;
    else if (s === "NA") acc.NA++;
    return acc;
  }, { P: 0, HP: 0, A: 0, NA: 0 });

  const pdCount = typeof record.pd === "number" ? record.pd : counts.P;
  const hpCount = typeof record.hp === "number" ? record.hp : counts.HP;


  const clientDaily = Number(record.hcpPay || 0); 
  const hcpDaily = Number(record.cPay || 0);     

  const fullMultiplier = 1;
  const halfMultiplier = 0.5;


  const clientFromP = pdCount * clientDaily * fullMultiplier;
  const clientFromHP = hpCount * clientDaily * halfMultiplier;
  const clientTotalRaw = clientFromP + clientFromHP;


  const hcpFromP = pdCount * hcpDaily * fullMultiplier;
  const hcpFromHP = hpCount * hcpDaily * halfMultiplier;
  const hcpTotalCalc = hcpFromP + hcpFromHP;


  let hostelDeduction = 0;
 


  const referralPercent = opts?.referralPercent ?? 0;
  const referralBonus = (clientTotalRaw - hcpTotalCalc) * referralPercent;


  let vendorShare = 0;
  if (record.VendorName && String(record.VendorName).toLowerCase() !== "curate") {
   
    vendorShare = 0;
  }

  const adminEdits = opts?.adminEdit ?? 0;


  const taxRate = opts?.taxRate ?? 0;
  const taxAmount = (clientTotalRaw - vendorShare) * taxRate;

  const hcpTotalOverride = typeof record.hcpTotal === "number" && !isNaN(record.hcpTotal)
    ? record.hcpTotal
    : undefined;

  const payableToHcp = (hcpTotalOverride ?? hcpTotalCalc) - hostelDeduction + adminEdits;
  const receivableFromClient = clientTotalRaw + taxAmount - vendorShare + adminEdits;
  const margin = receivableFromClient - payableToHcp - referralBonus;


  const notes: string[] = [];
  if (typeof hcpTotalOverride === "number") notes.push("HCP total overridden by record.hcpTotal");


  const typeValue = Array.isArray(record?.Type)
    ? record.Type.join(",").toLowerCase()
    : String(record?.Type || "").toLowerCase();
  if (typeValue.includes("oncall")) {
    notes.push("Oncall type: verify per-service frequencies (injections / alternate days) as needed.");
  }

  return {
    daysCount: { ...counts, totalDaysRecorded: daysStatus.length },
    client: {
      dailyRate: clientDaily,
      amountFromP: clientFromP,
      amountFromHP: clientFromHP,
      totalClientCharge: clientTotalRaw,
    },
    hcp: {
      dailyRate: hcpDaily,
      amountFromP: hcpFromP,
      amountFromHP: hcpFromHP,
      totalHcpPay: hcpTotalCalc,
      overrideHcpTotal: hcpTotalOverride,
    },
    adjustments: {
      hostelDeduction,
      referralBonus,
      vendorShare,
      adminEdits,
    },
    taxes: {
      taxRate,
      taxAmount,
    },
    final: {
      payableToHcp,
      receivableFromClient,
      margin,
    },
    notes,
  };
}

export function PaymentInfoModal({
  record,
  onClose,
  onConfirm,
}: {
  record: any;
  onClose: () => void;
  onConfirm?: (result: BillingResult) => void;
}) {
  const result = useMemo(() => calculateBilling(record, {
    taxRate: 0.01,         
    referralPercent: 0.00, 
  }), [record]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-2">
  
      <div className="bg-white w-full max-w-[90%] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
          <h3 className="text-xl font-bold">Payment Info — {record?.hcpName || record?.clientName}</h3>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1 bg-gray-100 rounded cursor-pointer">Close</button>
            <button
              onClick={() => {
                alert("Export PDF stub — implement html2canvas/jsPDF here");
              }}
              className="px-3 py-1 bg-teal-800 cursor-pointer text-white rounded"
            >
              Export PDF
            </button>
            
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold">Days Summary</h4>
            <div>Full (P): {result.daysCount.P}</div>
            <div>Half (HP): {result.daysCount.HP}</div>
            <div>Absent (A): {result.daysCount.A}</div>
            <div>NA: {result.daysCount.NA}</div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Rates</h4>
            <div>We pay (HCP daily): ₹{result.hcp.dailyRate}</div>
            <div>We charge (Client daily): ₹{result.client.dailyRate}</div>
          </div>

          <div className="col-span-1 md:col-span-2 mt-2">
            <h4 className="font-semibold">Client Charges (Incoming)</h4>
            <div>From P: ₹{result.client.amountFromP}</div>
            <div>From HP: ₹{result.client.amountFromHP}</div>
            <div className="font-bold">Client total (raw): ₹{result.client.totalClientCharge}</div>
          </div>

          <div className="col-span-1 md:col-span-2 mt-2">
            <h4 className="font-semibold">HCP Payment (Outgoing)</h4>
            <div>From P: ₹{result.hcp.amountFromP}</div>
            <div>From HP: ₹{result.hcp.amountFromHP}</div>
            <div>Calculated HCP total: ₹{result.hcp.totalHcpPay}</div>
            {result.hcp.overrideHcpTotal !== undefined && (
              <div className="text-sm text-gray-600">Override present: ₹{result.hcp.overrideHcpTotal}</div>
            )}
          </div>

          <div className="col-span-1 md:col-span-2 mt-2 space-y-1">
            <h4 className="font-semibold">Adjustments & Taxes</h4>
            <div>Hostel deduction: ₹{result.adjustments.hostelDeduction}</div>
            <div>Vendor share: ₹{result.adjustments.vendorShare}</div>
            <div>Referral bonus: ₹{Math.round(result.adjustments.referralBonus)}</div>
            <div>Admin edits: ₹{result.adjustments.adminEdits}</div>
            <div>Tax ({result.taxes.taxRate * 100}%): ₹{Math.round(result.taxes.taxAmount)}</div>
          </div>

          <div className="col-span-1 md:col-span-2 mt-4 border-t pt-3 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="text-sm text-gray-600">Payable to HCP</div>
              <div className="text-lg font-bold">₹{Math.round(result.final.payableToHcp)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Receivable from Client</div>
              <div className="text-lg font-bold">₹{Math.round(result.final.receivableFromClient)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Margin</div>
              <div className="text-lg font-bold">₹{Math.round(result.final.margin)}</div>
            </div>
          </div>

          {result.notes.length > 0 && (
            <div className="col-span-1 md:col-span-2 mt-2 text-sm text-gray-600">
              <strong>Notes:</strong>
              <ul className="list-disc ml-5">
                {result.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
