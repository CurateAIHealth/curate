import { Minimize2 } from "lucide-react";
import { useState } from "react";

type StaffNotificationModalProps = {
  open: boolean;
  message?: string;
  subMessage?: string;
  onClose: () => void;
    onSend: (emails: string[]) => void;
  buttonText?: string;

};

const employEmails = [
  // { Name: "Office Email", Email: "info@curatehealth.in" },
  { Name: "Srinivas", Email: "srinivasnew0803@gmail.com" },
  { Name: "Srivani", Email: "srivanikasham@curatehealth.in" },
  { Name: "Sravanthi", Email: "sravanthicurate@gmail.com" },
  { Name: "Gouri", Email: "gouricurate@gmail.com" },
  { Name: "Kiran", Email: "kirancuratehealth@gmail.com" },
  { Name: "Pandu", Email: "panducurate@gmail.com" },
];


const StaffNotificationModal = ({
  open,
  
  subMessage ,
  onClose,
  onSend,

  buttonText = "Send Notification",
}: StaffNotificationModalProps) => {
  if (!open) return null;
const [selectedEmployEmails, setSelectedEmployEmails] = useState<string[]>([]);


const handleSelectEmploy = (email: string) => {
  if (selectedEmployEmails.includes(email)) {
    setSelectedEmployEmails(prev => prev.filter(e => e !== email));
  } else {

    setSelectedEmployEmails(prev => [...prev, email]);
  }
};

const allEmails = employEmails.map(emp => emp.Email);

const handleSelectAll = () => {
  if (selectedEmployEmails.length === allEmails.length) {

    setSelectedEmployEmails([]);
  } else {
   
    setSelectedEmployEmails(allEmails);
  }
};

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
     <div className="flex flex-col items-center justify-center mb-4">

  <div className="flex items-center justify-center w-14 h-14 rounded-full 
  bg-yellow-400/20 border border-yellow-300/40 shadow-md mb-2">
    <span className="text-xl animate-pulse">🔔</span>
  </div>

  <div className="text-center space-y-1">
    <p className="text-[20px] font-bold text-yellow-400 tracking-wide">
      Notify Your Team
    </p>

    <p className="text-[11px] text-white/80 leading-tight">
      Select one or more staff members to send the alert instantly
    </p>
  </div>

</div>


     <div className="flex flex-wrap space-y-2 max-h-52 overflow-y-auto">
     <label className="relative w-full flex items-center gap-3 px-4 py-3 mb-3 rounded-lg cursor-pointer
bg-teal-700/30 hover:bg-teal-700/50 border border-teal-400/20 transition-all">

  <span className="absolute left-0 top-0 h-full w-1 bg-emerald-400 rounded-l-lg"></span>

  <input
    type="checkbox"
    checked={selectedEmployEmails.length === employEmails.length}
    onChange={handleSelectAll}
    className="ml-2 w-4 h-4 accent-emerald-400"
  />

  <span className="text-sm font-semibold text-emerald-200">
    Select Entire Team
  </span>
</label>


  {employEmails.map((emp, index) => (
    <label
      key={index}
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer "
    >
      <input
        type="checkbox"
        checked={selectedEmployEmails.includes(emp.Email)}
        onChange={() => handleSelectEmploy(emp.Email)}
        className="w-4 h-4 accent-indigo-600"
      />
      <span className="text-sm">{emp.Name}</span>
    </label>
  ))}
</div>
          {subMessage && <p className="text-xs opacity-80">{subMessage}</p>}

          <button
              onClick={() => onSend(selectedEmployEmails)}
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
