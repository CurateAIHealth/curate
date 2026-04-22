import React from "react";
type PopupProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
};
const DatePopup : React.FC<PopupProps> = ({
  isOpen,
  title = "Notice",
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
}) => {
  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
  <div className="bg-white w-[90%] max-w-md rounded-3xl shadow-2xl p-8 text-center animate-fadeIn">

   
    <div className="flex justify-center mb-4">
      <img
        src="/Icons/Curate-logoq.png"
        alt="Company Logo"
        className="h-12 object-contain"
      />
    </div>

 
    <h2 className="text-xl font-semibold text-gray-900 mb-2">
      {title}
    </h2>

    
    <p className="text-gray-600 text-sm leading-relaxed mb-6">
      {message}
    </p>

    
    <div className="h-px bg-gray-200 mb-6" />

    <div className="flex justify-center">
      <button
        onClick={onConfirm || onClose}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        {confirmText}
      </button>
    </div>

  </div>
</div>
  );
};

export default DatePopup;