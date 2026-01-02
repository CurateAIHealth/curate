"use client";

import { BadgeCheck, Phone, Users, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VendorProfileView() {
  const vendor = {
    vendorName: "Deepankar Mondal",
    organisation: "Well Cure Home Care Service",
    contact: "8001213847",
    startDate: "30/12/2025",
    endDate: null,
    pricePerDay: 1200,
    caretakers: [
      { name: "Suresh Kumar", role: "HCA" },
      { name: "Anitha P", role: "HCN" },
      { name: "Ravi Teja", role: "HCA" },
    ],
  };

  const Router=useRouter()

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <div className="w-full mx-auto bg-white rounded-2xl shadow-md border border-[#e6f4f1] p-8 space-y-8">


<div className="flex flex-col gap-6">


  <div className="flex items-center gap-4">
    <div className="w-14 h-14 rounded-full border border-[#e6f4f1] bg-white shadow-sm flex items-center justify-center">
      <img
        src="/Icons/Curate-logoq.png"
        onClick={()=>Router.push("/DashBoard")} 
        alt="Curate Health Care"
        className="h-8 w-auto"
      />
    </div>

    <div>
      <h1 className="text-2xl font-bold text-[#1f2937]">
        Vendor Profile
      </h1>
      <p className="text-sm text-[#6b7280]">
        Caretaker Supplier Details
      </p>
    </div>
  </div>


  <div className="flex flex-col md:flex-row md:justify-between gap-6">
    <div>
      <h2 className="text-xl font-semibold text-[#1f2937]">
        {vendor.vendorName}
      </h2>
      <p className="text-sm text-[#6b7280]">
        {vendor.organisation}
      </p>

      <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f4f1] text-[#50c896]">
        <BadgeCheck size={14} />
        Verified Caretaker Supplier
      </span>
    </div>

    <div className="text-sm text-[#1f2937] space-y-2">
      <p className="flex items-center gap-2">
        <Phone size={14} className="text-[#ff1493]" />
        {vendor.contact}
      </p>
      <p className="flex items-center gap-2">
        <Calendar size={14} className="text-[#50c896]" />
        {vendor.startDate} – {vendor.endDate ?? "Active"}
      </p>
    </div>
  </div>

</div>


      
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-[#e6f4f1] rounded-xl p-5">
            <p className="text-xs text-[#6b7280] uppercase font-semibold">
              Contract Duration
            </p>
            <p className="mt-1 text-lg font-semibold text-[#1f2937]">
              {vendor.startDate} – {vendor.endDate ?? "Ongoing"}
            </p>
          </div>

          <div className="border border-[#e6f4f1] rounded-xl p-5">
            <p className="text-xs text-[#6b7280] uppercase font-semibold">
              Price per Caretaker / Day
            </p>
            <p className="mt-1 text-lg font-bold text-[#ff1493]">
              ₹ {vendor.pricePerDay}
            </p>
          </div>
        </div>

  
        <div>
          <h2 className="text-lg font-semibold text-[#1f2937] mb-4 flex items-center gap-2">
            <Users size={18} className="text-[#50c896]" />
            Supplied Care Takers
          </h2>

          <div className="overflow-hidden rounded-xl border border-[#e6f4f1]">
            <table className="w-full text-sm">
              <thead className="bg-[#f0fdfa] text-[#1f2937]">
                <tr>
                  <th className="px-4 py-3 text-left">Caretaker Name</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-center">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {vendor.caretakers.map((c, i) => (
                  <tr key={i} className="border-t border-[#e6f4f1]">
                    <td className="px-4 py-3 font-medium">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">
                      {c.role}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[#50c896] font-semibold cursor-pointer hover:underline">
                        View
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
