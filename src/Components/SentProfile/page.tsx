import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

type ClientsPopupProps = {
  open: boolean;
  onClose: () => void;
  clients: any[];
  title?: string;
};

export const ClientsPopup = ({
  open,
  onClose,
  clients = [],
  title = "Curate Clients List",
}: ClientsPopupProps) => {
  const [search, setSearch] = useState("");
 const router=useRouter()
  const filteredClients = useMemo(() => {
    if (!search) return clients;
    return clients.filter((c: any) =>
      `${c?.FirstName || ""}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, clients]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[94%] max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">

      
        <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center">       
           <img
    src="/Icons/Curate-logo.png"
    onClick={() => router.push("/DashBoard")}
    alt="Logo"
    className="w-8 h-8 sm:w-8 sm:h-8 rounded-xl"
  /> 
            <h2 className="text-sm sm:text-base font-semibold text-gray-800">
            {title}
          </h2>
          </div>


          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

      
        <div className="p-3 border-b">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Client..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

       
        <div className="max-h-[420px] overflow-y-auto p-3 space-y-2">
          {filteredClients?.length > 0 ? (
            filteredClients.map((c: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-2 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {c.FirstName}
                  </p>
                  {c.ContactNumber && (
                    <p className="text-xs text-gray-500">{c.ContactNumber}</p>
                  )}
                </div>

           
                <button
                  type="button"
                  className="
                    text-[11px] px-2 py-1
                    rounded-md
                    bg-gradient-to-r from-green-400 to-green-500 cursor-pointer
                    text-white font-medium
                    hover:from-emerald-400 transition
                  "
                >
                  SENT
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-center text-gray-500 py-6">
              No Clients Found
            </p>
          )}
        </div>

      
        <div className="px-4 py-3 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs sm:text-sm rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};