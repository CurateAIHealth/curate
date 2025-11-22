import { numberToWords } from '@/Lib/Actions';
import { company, payment, terms } from '@/Lib/Content';
import React, { JSX } from 'react';

interface InvoiceInfo {
  number?: string;
  date?: string;
  dueDate?: string;
  terms?: string;
  serviceFrom?: string;
  serviceTo?: string;
}

interface BillToInfo {
  name?: string;
  addressLines?: string;
  patientName?: string;
  otherDetails?: string;
}

interface ItemRow {
  description: string;
  days: number | string;
  rate: number | string;
  amount: number | string;
}



interface ColorConfig {
  primary?: string;
  accent?: string;
  pink?: string;
}

interface Props {
  invoice?: InvoiceInfo;
  billTo?: BillToInfo;
  items?: ItemRow[];
  totals?: any;
  colors?: ColorConfig;
}

export default function ReusableInvoice({
  invoice = {},
  billTo = {},
  items = [],
  totals = {},
  colors = { primary: "#50c896", accent: "#1392d3", pink: "#ff1493" }
}: Props): JSX.Element {

  return (
    <div
      style={{
        padding: "4px",
        width: "100%",
      
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}
    >

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
        <div
          style={{
            width: "8px",
            height: "100px",
            borderRadius: "0 8px 8px 0",
            background: colors.primary
          }}
        ></div>

        <div style={{ flex: 1, display: "flex", justifyContent: "space-between", marginLeft: "16px" }}>
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                letterSpacing: "2px",
                margin: 0,
                color: colors.primary
              }}
            >
              INVOICE
            </h1>

            <p style={{ marginTop: "6px", color: "#475569", fontSize: "16px" }}>
              Invoice ID: #{invoice.number}
            </p>
          </div>

          <img
            src="https://curate-pearl.vercel.app/Icons/Curate-logoq.png"
            alt="logo"
            style={{ height: "70px", width: "auto", objectFit: "contain" }}
          />
        </div>
      </div>

      {/* BILL TO + COMPANY */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* BILL TO */}
        <div style={{ width: "50%" }}>
          <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Bill To</h4>

          <div style={{ fontSize: "14px", color: "#334155", lineHeight: "18px" }}>
            <div style={{ fontWeight: 600, fontSize: "16px" }}>{billTo.name}</div>
            <div>{billTo.addressLines}</div>

            {billTo.otherDetails && (
              <div style={{ marginTop: "4px" }}>{billTo.otherDetails}</div>
            )}
          </div>

          <div style={{ marginTop: "20px", fontSize: "14px", color: "#334155" }}>
            <div><strong>Invoice Date:</strong> {invoice.date}</div>
            <div><strong>Due Date:</strong> {invoice.dueDate}</div>
            <div><strong>Terms:</strong> {invoice.terms}</div>
          </div>
        </div>

        {/* COMPANY INFO */}
        <div style={{ width: "50%", textAlign: "right" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "bold", color: colors.pink, marginBottom: "4px" }}>
            {company.name}
          </h3>

          {company.addressLines?.map((l, i) => (
            <div key={i} style={{ fontSize: "14px", color: "#475569", lineHeight: "16px" }}>
              {l}
            </div>
          ))}

          <div style={{ marginTop: "8px", fontSize: "14px", color: "#334155" }}>
            <div><strong>Patient Name:</strong> {billTo.patientName || "-"}</div>
            <div style={{ marginTop: "4px" }}><strong>Service Dates:</strong></div>
            <div>{invoice.serviceFrom} to {invoice.serviceTo}</div>
          </div>
        </div>
      </div>

      {/* LINE BREAK */}
      <hr style={{ margin: "18px 0", borderColor: "#cbd5e1" }} />

      {/* ITEMS TABLE */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", fontSize: "14px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: colors.primary, color: "white" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>#</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Service & Description</th>
              <th style={{ padding: "8px", textAlign: "right" }}>Days</th>
              <th style={{ padding: "8px", textAlign: "right" }}>Rate</th>
              <th style={{ padding: "8px", textAlign: "right" }}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {items.map((it, idx) => (
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? "#ffffff" : "#f8fafc"
                }}
              >
                <td style={{ padding: "8px" }}>{idx + 1}</td>
                <td style={{ padding: "8px", fontWeight: 500 }}>{it.description}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>{it.days}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>₹{it.rate}/-</td>
                <td style={{ padding: "8px", textAlign: "right" }}>₹{it.amount}/-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAYMENT + TOTALS */}
      <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
        
        {/* PAYMENT */}
        <div style={{ width: "50%" }}>
          <h5 style={{ fontWeight: 600 }}>Payment Method</h5>

          <div style={{ marginTop: "8px", fontSize: "14px", color: "#334155", lineHeight: "18px" }}>
            <img
              src="https://curate-pearl.vercel.app/Icons/PaymentScanner.png"
              alt="QR"
              style={{ height: "110px", width: "110px", objectFit: "contain", marginBottom: "6px" }}
            />

            <div><strong>Account Name:</strong> {payment.accountName}</div>
            <div><strong>Bank Name:</strong> {payment.BankName}</div>
            <div><strong>Account Number:</strong> {payment.accountNumber}</div>
            <div><strong>IFSC:</strong> {payment.ifsc}</div>
            <div><strong>UPI:</strong> {payment.upiId}</div>
          </div>
        </div>

        {/* TOTALS */}
        <div style={{ width: "50%" }}>
          <div style={{ fontSize: "14px" }}>
            <div style={{ width: "100%", maxWidth: "300px", marginLeft: "auto", background: "#f1f5f9" }}>

              {totals.Discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>
                  <div>Discount</div>
                  <div style={{ color: "green", fontWeight: "bold" }}>₹{totals.Discount}/-</div>
                </div>
              )}

              {totals.OtherExpenses > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>
                  <div>Other Expenses</div>
                  <div>₹{totals.OtherExpenses}/-</div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>
                <div>Total</div>
                <div>₹{totals.total}/-</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>
                <div>Balance Due</div>
                <div style={{ fontWeight: "bold", color: "red" }}>₹{totals.balanceDue}/-</div>
              </div>

              <div style={{ padding: "8px", color: "#475569", marginTop: "5px" }}>
                In Words:{" "}
                <span style={{ fontWeight: "bold", textDecoration: "underline", fontSize: "13px", textTransform: "uppercase" }}>
                  {numberToWords(totals.total)} Only
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* TERMS */}
      <div style={{ marginTop: "25px" }}>
        <h5 style={{ fontWeight: 600, marginBottom: "6px" }}>Terms & Conditions</h5>

        <ol style={{ fontSize: "11px", color: "#334155", lineHeight: "14px", paddingLeft: "18px" }}>
          {terms.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
      </div>

      {/* NOTES */}
      <div style={{ marginTop: "20px", textAlign: "center", fontWeight: 600, color: colors.pink }}>
        {company.notes}
      </div>

      {/* WEBSITE */}
      <div style={{ marginTop: "12px", textAlign: "center", fontSize: "14px" }}>
        <a href={company.website} target="_blank" rel="noreferrer" style={{ color: "#000" }}>
          {company.website}
        </a>
      </div>

    </div>
  );
}
