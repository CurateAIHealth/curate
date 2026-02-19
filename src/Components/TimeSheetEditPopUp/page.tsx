type EditDeploymentPopupProps<T = any> = {
  open: boolean
  data: T | null
  onClose: () => void
  onChange: (field: string, value: any) => void
  onSave: (data: T | null) => void
  StatusMessage:any
}

export function EditDeploymentPopup<T>({
  open,
  data,
  StatusMessage,
  onClose,
  onChange,
  onSave,
}: EditDeploymentPopupProps<T>) {
  if (!open || !data) return null


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[50%] max-w-3xl rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/60 overflow-hidden">
        <div className="px-2 py-4 flex items-center justify-between bg-gradient-to-br from-[#00A9A5] to-[#005f61] text-white">
          <div>
            <h3 className="text-lg font-semibold tracking-wide">
              Edit Deployment Details
            </h3>
            <p className="text-xs opacity-80">
              Update client, HCP and billing information
            </p>
          </div>

          <button
            onClick={onClose}
            className="hover:scale-110 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-2 grid grid-cols-2 gap-5 text-sm">
          <p className="col-span-2 text-xs font-semibold text-gray-400 tracking-widest">
            DEPLOYMENT INFO
          </p>

          <Field label="Invoice">
            <input
              value={(data as any).invoice || ""}
              onChange={(e) => onChange("invoice", e.target.value)}
              className="Input"
            />
          </Field>
         

          <Field label="Start Date">
            <div>
            <input
              value={(data as any).startDate || ""}
              onChange={(e) => onChange("startDate", e.target.value)}
              className="Input"
            />
         
           </div>
          </Field>

          <Field label="End Date">
            <input
              value={(data as any).endDate || ""}
              onChange={(e) => onChange("endDate", e.target.value)}
              className="Input"
            />
          </Field>

          <Field label="Client Name">
            <input
              value={(data as any).clientName || ""}
              onChange={(e) => onChange("clientName", e.target.value)}
              className="Input"
            />
          </Field>

          <Field label="Patient Name">
            <input
              value={(data as any).patientName || ""}
              onChange={(e) => onChange("patientName", e.target.value)}
              className="Input"
            />
          </Field>

          <Field label="Lead Name">
            <input
              value={(data as any).referralName || ""}
              onChange={(e) => onChange("referralName", e.target.value)}
              className="Input"
            />
          </Field>

          <p className="col-span-2 text-xs font-semibold text-gray-400 tracking-widest pt-2">
            HCP DETAILS
          </p>

          <Field label="HCP">
            <input
              value={(data as any).hcpName || ""}
              onChange={(e) => onChange("hcpName", e.target.value)}
              className="Input"
            />
          </Field>

          <Field label="HCP Source">
            <input
              value={(data as any).hcpSource || ""}
              onChange={(e) => onChange("hcpSource", e.target.value)}
              className="Input"
            />
          </Field>

          <p className="col-span-2 text-xs font-semibold text-gray-400 tracking-widest pt-2">
            BILLING
          </p>

          <Field label="Vendor">
            <input
              value={(data as any).VendorName || ""}
              onChange={(e) => onChange("VendorName", e.target.value)}
              className="Input"
            />
          </Field>

          <Field label="Charge">
            <input
              value={(data as any).CareTakerPrice || ""}
              onChange={(e) => onChange("CareTakerPrice", e.target.value)}
              className="Input"
            />
          </Field>
        </div>

        <div className="flex items-center justify-between gap-3 px-2 py-4 border-t bg-white/70 backdrop-blur">
    
  <p
    className={`
      mt-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium
      border shadow-sm
      ${
        StatusMessage.toLowerCase().includes("success")
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : StatusMessage.toLowerCase().includes("error") ||
            StatusMessage.toLowerCase().includes("failed")
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-blue-50 text-blue-700 border-blue-200"
      }
    `}
  >
    {StatusMessage}
  </p>


        <div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Cancel
          </button>

          <button
            className="px-6 py-2 rounded-xl text-white text-sm bg-gradient-to-br from-[#00A9A5] to-[#005f61] cursor-pointer hover:opacity-90 shadow-md"
            onClick={() => onSave(data)}
          >
            Save Changes
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}





const inputStyle =
"rounded-xl border border-gray-200 bg-white/70 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:w-full transition shadow-sm";

function Field({ label, children }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold">{label}</label>

   
      <div className={inputStyle}>
        {children}
      </div>

      {(label === "Start Date" || label === "End Date") && (
        <p className="text-gray-500 text-[9px]">
          Enter in India Date Formate DD/MM/YYYY
        </p>
      )}
    </div>
  );
}
