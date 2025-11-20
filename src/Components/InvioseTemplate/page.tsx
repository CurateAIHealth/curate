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

interface TotalsInfo {
  subTotal?: string;
  total?: string;
  balanceDue?: string;
  totalInWords?: string;
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
  totals?: TotalsInfo;
  colors?: ColorConfig;
}

export default function ReusableInvoice({
  invoice = {},
  billTo = {},
  items = [],
  totals = {},
  colors = { primary: '#50c896', accent: '#1392d3', pink: '#ff1493' },
}: Props): JSX.Element {

  return (
    <div className="p-4 w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg print:shadow-none print:rounded-none">

    
      <div className="flex items-center mb-2">
  

  <div
    className="w-2 h-24 rounded-r-lg"
    style={{ background: colors.primary }}
  ></div>

  <div className="flex-1 flex justify-between items-center ml-4">
    <div>
      <h1 className="text-3xl font-bold tracking-wide" 
          style={{ color: colors.primary }}>
        INVOICE
      </h1>
      <p className="text-lg text-slate-600 mt-1">
        Invoice ID: #{invoice.number}
      </p>
    </div>

    <img
      src="Icons/UpdateCurateLogo.png"
      alt="logo"
      className="h-46 w-auto object-contain"
    />
  </div>
</div>




<div className="flex justify-between items-start ">

 
  <div className="w-1/2">
    <h4 className="font-semibold text-lg">Bill To</h4>
    <div className="text-sm text-slate-700 leading-tight mt-1">
      <div className="font-semibold text-base">{billTo.name}</div>
      <div>{billTo.addressLines}</div>
      {billTo.otherDetails && (
        <div className="mt-1">{billTo.otherDetails}</div>
      )}
    </div>
 <div className="mt-6 text-sm text-slate-700 leading-tight">
        <div><strong>Invoice Date:</strong> {invoice.date}</div>
        <div><strong>Due Date:</strong> {invoice.dueDate}</div>
        <div><strong>Terms:</strong> {invoice.terms}</div>
      </div>
   
  </div>


  <div className="text-right w-1/2">
    <h3 className="text-xl font-bold" style={{ color: colors.pink }}>
      {company.name}
    </h3>

    {company.addressLines?.map((l, i) => (
      <div key={i} className="text-sm text-slate-600 leading-tight">
        {l}
      </div>
    ))}
     <div className="mt-3 text-sm text-slate-700">
      <div><strong>Patient Name:</strong> {billTo.patientName || "-"}</div>
      <div className="mt-1"><strong>Service Dates:</strong></div>
      <div>{invoice.serviceFrom} to {invoice.serviceTo}</div>
    </div>
  </div>

</div>



     

      <hr className="my-4 border-slate-300" />


      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: colors.primary }} className="text-white">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Service & Description</th>
              <th className="p-2 text-right">Days</th>
              <th className="p-2 text-right">Rate</th>
              <th className="p-2 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="p-2">{idx + 1}</td>
                <td className="p-2 font-medium">{it.description}</td>
                <td className="p-2 text-right">{it.days}</td>
                <td className="p-2 text-right">{it.rate}</td>
                <td className="p-2 text-right">{it.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="mt-4 sm:flex sm:justify-between gap-4">

       
        <div className="sm:w-1/2">
          <h5 className="font-semibold">Payment Method</h5>
          <div className="mt-2 text-sm text-slate-700 leading-tight">
            <img
              src="Icons/PaymentScanner.png"
              alt="QR"
              className="h-28 w-28 object-contain mb-2"
            />
            <div><strong>Account Name:</strong> {payment.accountName}</div>
            <div><strong>Bank Name:</strong> {payment.BankName}</div>
            <div><strong>Account Number:</strong> {payment.accountNumber}</div>
            <div><strong>IFSC:</strong> {payment.ifsc}</div>
            <div><strong>UPI:</strong> {payment.upiId}</div>
          </div>
        </div>


        <div className="sm:w-1/2">
          <div className="text-sm">
            <div className="flex justify-end">
              <div className="w-full max-w-sm">
                <div className="flex justify-between p-2">
                  <div>Sub Total</div>
                  <div className="font-medium">{totals.subTotal}</div>
                </div>

                <div className="flex justify-between p-2 bg-slate-50">
                  <div>Total</div>
                  <div className="font-bold">{totals.total}</div>
                </div>

                <div className="flex justify-between p-2">
                  <div>Balance Due</div>
                  <div className="font-semibold">{totals.balanceDue}</div>
                </div>

                <div className="mt-2 p-2 text-xs text-slate-600">
                  In Words: {totals.totalInWords}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <div className="mt-6">
        <h5 className="font-semibold mb-2">Terms & Conditions</h5>

        <ol className="list-decimal ml-5 text-[10px] text-slate-700 leading-tight space-y-1">
          {terms.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>

    
      </div>

<div className="mt-6 text-center font-semibold text-pink-600">

  {company.notes}
</div>



  
      <div className="mt-4 text-center text-sm">
        <a
          href={company.website}
          target="_blank"
          rel="noreferrer"
          className='gray-800'
        >
          {company.website}
        </a>
      </div>
    </div>
  );
}
