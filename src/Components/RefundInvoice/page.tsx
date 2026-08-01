import React from "react";
 interface RefundInvoiceProps {
  company: {
    logo: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
  };

  refund: {
    refundId: string;
    invoiceRef?: string;
    refundDate: string;
  };

  client: {
    clientName: string;
    patientName: string;
  };

  service: {
    startDate: string;
    endDate: string;
    serviceDays: number;
    usedDays: number;
    refundDays: number;
    perDayCharge: number;
  };

  amount: number;

  reason: string;
}
const RefundInvoice = ({
  company,
  refund,
  client,
  service,
  amount,
  reason,
}: RefundInvoiceProps) => {
    const Info = ({ label, value }: any) => (
  <div className="flex justify-between border-b py-2">
    <span className="text-[#64748b]">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const Card = ({ title, value }: any) => (
  <div className="rounded-xl border bg-[#f8fafc] p-5 text-center">
    <p className="text-xs uppercase" style={{ color: '#94a3b8' }}>
      {title}
    </p>

    <p className="mt-2 text-2xl font-bold text-[#0f172a]">
      {value}
    </p>
  </div>
);
  return (
    <div className="mx-auto w-full max-w-4xl bg-[#FFFFFF] rounded-2xl border border-[#e5e7eb] overflow-hidden">

   
      <div className="border-b-4 border-[#00A9A5] p-8 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <img
            src={company.logo}
            className="w-16 h-16 object-contain"
          />

          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">
              {company.name}
            </h1>

            {/* <p className="text-sm text-[#64748b]">
              {company.address}
            </p> */}
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-3xl font-bold text-[#00A9A5]">
            REFUND
          </h2>

          <p className="text-sm text-[#64748b]">
            Refund ID
          </p>

          <p className="font-semibold">
            {refund.refundId}
          </p>
        </div>
      </div>

      <div className="p-8">

      
        <div className="grid grid-cols-2 gap-8">

          <div>
            <h3 className="text-[#00A9A5] font-semibold mb-3">
              Refund To
            </h3>

            <Info label="Client Name" value={client.clientName} />
            <Info label="Patient Name" value={client.patientName} />
          </div>

          <div>
            <h3 className="text-[#00A9A5] font-semibold mb-3">
              Refund Details
            </h3>

            <Info label="Refund Date" value={refund.refundDate} />

            <Info label="Invoice Ref" value={refund.invoiceRef} />
          </div>

        </div>

 

        <div className="mt-10 grid grid-cols-4 gap-4">

          <Card
            title="Total Service Days"
            value={service.serviceDays}
          />

          <Card
            title="Service Days"
            value={service.usedDays}
          />

          <Card
            title="Refund Days"
            value={service.refundDays}
          />

          <Card title="Per Day" value={`₹${service.perDayCharge}`} />

        </div>

       

        <div className="my-4 rounded-2xl border-2 border-[#00A9A5] bg-[#f0fdfa] p-6 text-center">

          <p className="uppercase tracking-wider" style={{ color: '#94a3b8' }}>
            Refund Amount
          </p>

          <h1 className="mt-2 text-5xl font-bold text-[#00A9A5]">
            ₹{amount.toLocaleString()}
          </h1>

        </div>

      

        {/* <div>

          <h3 className="font-semibold text-[#00A9A5] mb-3">
            Reason for Refund
          </h3>

          <div className="rounded-xl border bg-slate-50 p-5">
            {reason}
          </div>

        </div> */}

      </div>

   

      <div className="border-t bg-[#f8fafc] px-2 py-6 text-center text-sm text-[#64748b]">

        <p>
          This is a computer generated refund confirmation.
        </p>

        <p>No signature required.</p>

        <p className=" font-medium text-[#00A9A5]">
          {company.website}
        </p>

      </div>

    </div>
  );
};

export default RefundInvoice;