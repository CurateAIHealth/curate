"use client";
import { Eye } from "lucide-react";

const physios = [
  {
    name: "Karthik Reddy",
    phone: "9876543210",
    qualification: "MPT (Orthopedics)",
    specialization: "Musculoskeletal Rehab",
    experience: "8 Years",
  },
  {
    name: "Deepthi Raj",
    phone: "9811100223",
    qualification: "BPT",
    specialization: "Neurological Rehab",
    experience: "5 Years",
  },
  {
    name: "Rahul Sharma",
    phone: "9900887766",
    qualification: "MPT (Sports)",
    specialization: "Sports Injury Therapy",
    experience: "7 Years",
  }
];

export default function PhysioList() {
  return (
    <div className="md:w-[400px] mx-auto bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Physio List</h2>

      <div className="space-y-2">
        {physios.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <img
                  src="Icons/physio-avatar.png
                "
                  alt="avatar"
                  className="w-7 h-7 object-cover rounded-full"
                />
              </div>

              {/* Info */}
              <div>
                <p className="text-sm font-medium text-gray-800">{p.name}</p>
                <p className="text-xs text-gray-500">{p.phone}</p>
                <p className="text-xs text-gray-600">{p.qualification}</p>
                <p className="text-xs text-gray-600 truncate">{p.specialization}</p>
                <p className="text-[11px] text-gray-500">{p.experience}</p>
              </div>
            </div>

            {/* Eye Icon */}
            <button className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition">
              <Eye size={14} />
            </button>
          </div>
        ))}
      </div>

      
    </div>
  );
}
