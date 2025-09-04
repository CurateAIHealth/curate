"use client";
import React, { useState } from "react";
import { Stethoscope, Shirt, CircleX } from "lucide-react";

interface TerminationData {
  id: string;
  clientName: string;
  contact: string;
  location: string;
  hcaName: string;
  status: "Active" | "Inactive" | "Terminated";
}

const TerminationTable: React.FC = () => {
  const [placements, setPlacements] = useState<TerminationData[]>([
    {
      id: "1",
      clientName: "Iqbalunnisa",
      contact: "9989190986",
      location: "165, CSK Villas, Rallaguda",
      hcaName: "Siddu",
      status: "Terminated",
    },
    {
      id: "2",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },
    // repeating rows for scroll test
    {
      id: "3",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },
    {
      id: "4",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },{
      id: "4",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },{
      id: "4",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },{
      id: "4",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },{
      id: "4",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },{
      id: "4",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },{
      id: "4",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },{
      id: "4",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },{
      id: "4",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },{
      id: "4",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },{
      id: "4",
      clientName: "Jayaprada",
      contact: "8297838522",
      location: "2-37/4, STREET 3, Habsiguda",
      hcaName: "Gouri",
      status: "Terminated",
    },
  ]);

  const handleDelete = (id: string) => {
    setPlacements((prev) => prev.filter((placement) => placement.id !== id));
  };

  return (
    <div className="p-2 bg-gray-50">
      <div className="flex items-center justify-end mb-2">
        <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-medium shadow-sm">
          {placements.length} Records
        </span>
      </div>

     
      <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-white h-[65vh] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gradient-to-r sticky top-0 z-10 from-emerald-600 to-emerald-500 text-white text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-8 py-3">HCA</th>
                <th className="px-8 py-3">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((placement, idx) => (
                <tr
                  key={placement.id}
                  className={`transition ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-emerald-50`}
                >
                  <td className="px-6 py-3 font-semibold text-gray-900">
                    {placement.clientName}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {placement.contact}
                  </td>
                  <td className="px-6 py-3 text-gray-600 max-w-xs truncate">
                    {placement.location}
                  </td>
                  <td className="px-6 py-3">
                    <span className="flex items-center w-[110px] gap-2 bg-indigo-100 px-3 py-1 rounded-full text-sm font-medium text-indigo-700 shadow-sm">
                      <Stethoscope size={16} />
                      {placement.hcaName}
                      <Shirt size={16} className="text-pink-500" />
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow">
                      <CircleX size={16} />
                      {placement.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-1 rounded-lg shadow-md transition font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {placements.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-6 text-center text-gray-500 text-lg italic"
                  >
                    No termination records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TerminationTable;
