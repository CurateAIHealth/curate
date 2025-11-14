"use client";

import React, { useState } from "react";
import { columns, Infodata } from "@/Lib/Content";
import { Search, Eye, X } from "lucide-react";

export default function VendorTable() {
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

  return (
    <div className="relative w-full space-y-8 p-6 bg-gradient-to-b from-blue-50 to-purple-50 min-h-screen">
  
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white/95 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/70">

        <div className="flex items-center gap-4">
          <img
            src="Icons/Curate-logoq.png"
            className="h-16 w-16 object-contain drop-shadow-md"
            alt="Logo"
          />

          <h1 className="text-4xl font-bold text-gray-800 tracking-wide drop-shadow-sm">
            Vendors Panel
          </h1>
        </div>

   
        <div className="flex items-center gap-3 w-full md:w-1/3 bg-gray-100 rounded-2xl px-4 py-2 shadow-inner hover:shadow-lg transition">
          <Search size={18} className="text-gray-700" />
          <input
            type="text"
            placeholder="Search vendors..."
            className="bg-transparent outline-none text-sm w-full text-gray-800"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl shadow-2xl border border-white/60 backdrop-blur-xl">
        <table className="w-full border-collapse text-sm">
          
          <thead className="bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800 text-xs uppercase tracking-wider shadow-md">
            <tr>
              <th className="px-6 py-4">Preview</th>
              {columns.map((col) => (
                <th key={col} className="px-6 py-4 text-left font-semibold border-r border-white/40 last:border-r-0">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Infodata.map((row: any, index) => (
              <tr
                key={index}
                className="bg-white/80 backdrop-blur-xl border-b border-gray-200 hover:bg-white hover:shadow-xl transition cursor-pointer"
                style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}
              >
                <td
                  className="px-6 py-4 text-gray-800 border-r border-gray-100 last:border-r-0"
                  onClick={() => setSelectedVendor(row)}
                >
                  <Eye className="cursor-pointer hover:text-purple-600 transition" />
                </td>

                {columns.map((col) => (
                  <td key={col} className="px-6 py-4 text-gray-800 border-r border-gray-100 last:border-r-0">
                    {row[col] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center p-6 z-50">
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative border border-gray-200 animate-[fadeIn_0.3s_ease]">
        
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
              onClick={() => setSelectedVendor(null)}
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center tracking-wide">
              Vendor Details
            </h2>

     
            <div className="space-y-4">
              {columns.map((col) => (
                <div key={col} className="flex justify-between border-b py-2">
                  <span className="font-semibold text-gray-600">{col}</span>
                  <span className="text-gray-800 font-medium">
                    {selectedVendor[col] ?? "—"}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
