import { Minimize2 } from "lucide-react";

type StaffNotificationModalProps = {
  open: boolean;
  message?: string;
  subMessage?: string;
  onClose: () => void;
  onSend: () => void;
  buttonText?: string;

};

const StaffNotificationModal = ({
  open,
  message = "Client Call Enquiry registered successfully",
  subMessage ,
  onClose,
  onSend,

  buttonText = "Send Notification to All Staff",
}: StaffNotificationModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="max-w-sm w-full bg-teal-800 text-white px-5 py-4 rounded-xl shadow-xl text-sm animate-scale-in">

       
        <div className="flex items-center justify-end mb-3">
          <Minimize2
            size={25}
            className="cursor-pointer hover:bg-gray-600 p-1 rounded-full"
            onClick={onClose}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <div>🔔</div>

          <p className="text-sm opacity-90 text-center">
            {message}
          </p>

          {subMessage && <p className="text-xs opacity-80">{subMessage}</p>}

          <button
            onClick={onSend}
            className="mt-3 w-full bg-white text-green-700 text-xs font-semibold py-2.5 rounded-lg hover:bg-green-100 transition"
          >
            {buttonText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StaffNotificationModal;
