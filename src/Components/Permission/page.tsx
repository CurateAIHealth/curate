'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export default function PermissionDeniedPopup({
  open,
  onClose,
  message = "You don’t have permission to access this section. Please contact your administrator.",
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
   
          <motion.div
            className="fixed inset-0 z-50 bg-[#0b1220]/40 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <div
              className="
                w-full max-w-md
                rounded-[20px]
                bg-white
                border border-slate-200/60
                shadow-[0_40px_90px_rgba(15,23,42,0.38)]
                overflow-hidden
              "
            >
          
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-b from-slate-50 to-white">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex h-11 w-11 items-center justify-center
                      rounded-xl
                      bg-white
                      border border-slate-200
                      shadow-sm
                    "
                  >
                    <Lock size={17} className="text-slate-700" />
                  </div>

                  <div>
                    <h2 className="text-[15.5px] font-semibold text-slate-900 tracking-tight">
                      Access Restricted
                    </h2>
                    <p className="text-[12.5px] text-slate-500 mt-0.5">
                      Protected system area
                    </p>
                  </div>
                </div>

                <img
                  src="Icons/Curate-logoq.png"
                  className="h-8 opacity-90"
                  alt="Company Logo"
                />
              </div>

            
              <div className="h-px bg-slate-200/60" />

             
              <div className="px-6 py-6">
                <p className="text-[13.8px] leading-relaxed text-slate-600">
                  {message}
                </p>
              </div>

          
              <div className="flex justify-end px-6 py-4 bg-slate-50 border-t border-slate-200/60">
                <button
                  onClick={onClose}
                  className="
                    rounded-xl
                    px-5 py-2.5
                    text-[13.5px] font-medium
                    text-slate-700
                    bg-white
                    border border-slate-300
                    hover:bg-slate-100
                    active:scale-[0.98]
                    transition cursor-pointer
                  "
                >
                  Understood
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
