type DeletePopupProps<T = any> = {
  open: boolean
  data: T | null
  title?: string
  message?: string | ((data: T | null) => string)
  onClose: () => void
  onConfirm: (data: T | null) => void
  loading?: boolean,
  StatusMessage:any
}

export default function DeletePopup<T>({
  open,
  data,
  title = "Delete Item",
  message = "Are you sure you want to delete this record?",
  onClose,
  onConfirm,
  StatusMessage,
  loading = false,
}: DeletePopupProps<T>) {
  if (!open) return null

  const finalMessage =
    typeof message === "function" ? message(data) : message

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm md:text-base font-semibold text-gray-800">
            {title}
          </h2>
        </div>

        <div className="px-5 py-6">
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
            {finalMessage}
          </p>
        </div>
 
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-gray-200">
             <p
    className={`
       px-3 py-2 rounded-lg text-xs md:text-xs font-medium
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

  <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs md:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(data)}
            disabled={loading}
            className="px-4 py-1.5 rounded-md text-xs md:text-sm bg-red-600 hover:bg-red-500 text-white disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          </div>

        </div>
      </div>
    </div>
  )
}
