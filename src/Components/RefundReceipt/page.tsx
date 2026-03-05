import React from "react";

type BankDetails = {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  city: string;
  state: string;
};

type CompanyInfo = {
  name: string;
  address: string;
  city: string;
  state: string;
  logo: string;
  website?: string;
};

type Props = {
  receiptId: string;
  invoiceId: string;
  clientName: string;

  serviceStartDate: string;
  serviceEndDate: string;

  perDayCharge: number;
  clientPaymentDays: number;

  refundRequestDate: string;
  reason: string;

  company: CompanyInfo;
  bankDetails: BankDetails;
};

const RefundReceipt: React.FC<Props> = ({
  receiptId,
  invoiceId,
  clientName,
  serviceStartDate,
  serviceEndDate,
  perDayCharge,
  clientPaymentDays,
  refundRequestDate,
  reason,
  company,
  bankDetails
}) => {

  const start = new Date(serviceStartDate);
  const end = new Date(serviceEndDate);

  const serviceDays =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const refundDays = Math.max(serviceDays - clientPaymentDays, 0);
  const refundAmount = refundDays * perDayCharge;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg border rounded-lg p-8 text-sm text-gray-700">

      {/* HEADER */}
      <div className="flex justify-between items-start border-b pb-6">

        <div>
          <h1 className="text-3xl font-bold text-teal-600">
            Refund Receipt
          </h1>

          <p className="mt-2">
            <span className="font-medium">Receipt ID:</span> {receiptId}
          </p>

          <p>
            <span className="font-medium">Client Invoice ID:</span> {invoiceId}
          </p>

          <p>
            <span className="font-medium">Refund Request Date:</span> {refundRequestDate}
          </p>

        </div>

        <div className="text-right">

          <img
            src={company.logo}
            className="h-14 mb-2 ml-auto"
          />

          <p className="font-semibold text-lg text-pink-600">
            {company.name}
          </p>

          <p>{company.address}</p>
          <p>{company.city}</p>
          <p>{company.state}</p>

        </div>

      </div>

      {/* CLIENT SECTION */}
      <div className="grid grid-cols-2 gap-6 mt-6">

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Client Information
          </h3>

          <p>
            <span className="font-medium">Client Name:</span> {clientName}
          </p>

          <p>
            <span className="font-medium">Service Start Date:</span>{" "}
            {serviceStartDate}
          </p>

          <p>
            <span className="font-medium">Service End Date:</span>{" "}
            {serviceEndDate}
          </p>

        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Service Summary
          </h3>

          <p>
            <span className="font-medium">Service Days:</span> {serviceDays}
          </p>

          <p>
            <span className="font-medium">Payment Made For:</span>{" "}
            {clientPaymentDays} Days
          </p>

          <p>
            <span className="font-medium">Refund Days:</span>{" "}
            {refundDays}
          </p>

        </div>

      </div>

      {/* SERVICE TABLE */}
      <div className="mt-8">

        <div className="bg-teal-500 text-white grid grid-cols-6 p-3 font-semibold rounded-t">

          <div>#</div>
          <div className="col-span-2">Service Description</div>
          <div>Refund Days</div>
          <div>Rate</div>
          <div>Amount</div>

        </div>

        <div className="grid grid-cols-6 border p-3">

          <div>1</div>

          <div className="col-span-2">
            Healthcare Assistant Service
          </div>

          <div>{refundDays}</div>

          <div>₹{perDayCharge}</div>

          <div className="font-medium">
            ₹{refundAmount}
          </div>

        </div>

      </div>

      {/* REFUND REASON */}
      <div className="mt-8">

        <h3 className="font-semibold text-gray-800 mb-2">
          Reason For Refund
        </h3>

        <div className="border rounded p-4 bg-gray-50">
          {reason}
        </div>

      </div>

      {/* BANK DETAILS */}
      {/* <div className="mt-8">

        <h3 className="font-semibold text-gray-800 mb-3">
          Refund Credit Bank Details
        </h3>

        <div className="grid grid-cols-2 gap-3">

          <p><b>Bank Name:</b> {bankDetails.bankName}</p>
          <p><b>Account Holder:</b> {bankDetails.accountHolder}</p>

          <p><b>Account Number:</b> {bankDetails.accountNumber}</p>
          <p><b>IFSC Code:</b> {bankDetails.ifsc}</p>

          <p><b>Branch:</b> {bankDetails.branch}</p>
          <p><b>City:</b> {bankDetails.city}</p>

          <p><b>State:</b> {bankDetails.state}</p>

        </div>

      </div> */}

      {/* SUMMARY CARD */}
      <div className="flex justify-end mt-10">

        <div className="w-72 border rounded bg-gray-50 p-4">

          <div className="flex justify-between mb-2">
            <span>Service Days</span>
            <span>{serviceDays}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Paid Days</span>
            <span>{clientPaymentDays}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Refund Days</span>
            <span>{refundDays}</span>
          </div>

          <div className="border-t pt-2 flex justify-between font-semibold text-red-600 text-lg">
            <span>Refund Amount</span>
            <span>₹{refundAmount}</span>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center text-pink-600 mt-12 text-sm">

        A Complete Home Healthcare Professionals.  
        We care for your beloved.

        {company.website && (
          <p className="text-gray-500 mt-1">
            {company.website}
          </p>
        )}

      </div>

    </div>
  );
};

export default RefundReceipt;