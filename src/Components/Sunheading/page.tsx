"use client"
import { X } from "lucide-react";

type SubheadingPopItem = {
  title: string;
};

type SubheadingPopProps = {
  items?: SubheadingPopItem[];
  show?: boolean;
  onClose?: () => void;
  logo?: string;
  companyName?: string;
  MainHeading:any,
  Description:any
};

const SubheadingPop = ({
  items = [],
  show = true,
  onClose,
  MainHeading,
  Description,
  logo,

}: SubheadingPopProps) => {
  if (!show) return null;

  return (
 <div className="fixed inset-0 z-50 flex items-center justify-center  px-1 backdrop-blur-sm">
  <div className="relative w-full max-w-2xl overflow-hidden rounded-[34px] border border-white/10 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.28)] animate-in zoom-in-95 fade-in duration-300">


    <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100" />
    <div className="absolute -top-20 right-0 h-52 w-52 rounded-full bg-blue-100/50 blur-3xl" />
    <div className="absolute -bottom-16 left-0 h-52 w-52 rounded-full bg-indigo-100/40 blur-3xl" />

  
    <button
      onClick={onClose}
      className="absolute cursor-pointer right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-lg transition-all hover:rotate-90 hover:bg-slate-900 hover:text-white"
    >
      <X size={18} />
    </button>

   
    <div className="relative z-10 px-1 pt-2 pb-6 text-center">
      {logo && (
        <div className="mx-auto mb-5 flex h-17 w-17 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-md">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 object-contain"
          />
        </div>
      )} 
        <div className="mb-4 text-center">
  <p className="mb-2 inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 shadow-sm">
 {MainHeading}
  </p>

  <p className="mt-3 text-sm font-medium text-slate-500 sm:text-base">
   {Description}
  </p>
</div>

      <h2 className="text-xl font-bold tracking-tight text-slate-900">
       Continue with Your Choice
      </h2>

    
    </div>


    <div className="relative z-10 space-y-4 px-8 pb-10">
      {items.map((item, index) => (
        <button
          key={index}
          className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-all duration-300 hover:border-slate-900 hover:shadow-lg hover:-translate-y-1"
        >
      
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500">
                Manage Now
              </p>
            </div>
          </div>

       
          <div className="flex h-10 w-10 items-center cursor-pointer justify-center rounded-full bg-slate-100 text-slate-500 transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:translate-x-1">
            →
          </div>
        </button>
      ))}
    </div>
  </div>
</div>
  );
};

export default SubheadingPop;