"use client";

import { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Building2,
  ShieldCheck,
  X,
} from "lucide-react";

const initialEmployees = [
  {
    id: 1,
    name: "Meena R",
    email: "meena@curate.com",
    phone: "9955447788",
    department: "Operations",
    joiningDate: "2024-06-15",
    location: "Madhapur, Hyderabad",
    status: "Active",
  },
  {
    id: 2,
    name: "Suresh K",
    email: "suresh@curate.com",
    phone: "8899776655",
    department: "HR",
    joiningDate: "2023-11-02",
    location: "Kondapur, Hyderabad",
    status: "Active",
  },
  {
    id: 3,
    name: "Anitha P",
    email: "anitha@curate.com",
    phone: "9012345678",
    department: "Finance",
    joiningDate: "2024-01-10",
    location: "Kukatpally, Hyderabad",
    status: "Active",
  },
  {
    id: 4,
    name: "Ramesh V",
    email: "ramesh@curate.com",
    phone: "9876543210",
    department: "IT Support",
    joiningDate: "2022-09-28",
    location: "Gachibowli, Hyderabad",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Divya S",
    email: "divya@curate.com",
    phone: "9123456789",
    department: "Recruitment",
    joiningDate: "2023-05-18",
    location: "Hitech City, Hyderabad",
    status: "Active",
  },
  {
    id: 6,
    name: "Naveen Kumar",
    email: "naveen@curate.com",
    phone: "9988776655",
    department: "Compliance",
    joiningDate: "2021-12-08",
    location: "Ameerpet, Hyderabad",
    status: "Active",
  },
  {
    id: 7,
    name: "Lakshmi Devi",
    email: "lakshmi@curate.com",
    phone: "9345678123",
    department: "Payroll",
    joiningDate: "2022-07-21",
    location: "Begumpet, Hyderabad",
    status: "Active",
  },
  {
    id: 8,
    name: "Rahul Verma",
    email: "rahul@curate.com",
    phone: "9090909090",
    department: "Business Development",
    joiningDate: "2023-09-12",
    location: "Jubilee Hills, Hyderabad",
    status: "Active",
  },
  {
    id: 9,
    name: "Pooja Sharma",
    email: "pooja@curate.com",
    phone: "9876512345",
    department: "Client Relations",
    joiningDate: "2024-02-05",
    location: "Banjara Hills, Hyderabad",
    status: "Active",
  },
  {
    id: 10,
    name: "Arjun Reddy",
    email: "arjun@curate.com",
    phone: "9000012345",
    department: "Operations",
    joiningDate: "2020-11-19",
    location: "LB Nagar, Hyderabad",
    status: "Inactive",
  },
];


export default function ManagementEmployees() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<any>(null);

  const openModal = (emp: any) => {
    setCurrent({ ...emp });
    setOpen(true);
  };

  const saveChanges = () => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === current.id ? current : e))
    );
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col">

      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="px-6 py-3">
            <h2 className="text-2xl font-bold text-[#ff1493] flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" />
              Registered Employees
            </h2>
            <p className="text-sm text-[#1392d3] mt-1">
              Curate Internal employee directory
            </p>
          </div>
          <img src="Icons/Curate-logoq.png" className="h-14 w-14" />
        </div>
      </div>

      <div className="hidden md:grid grid-cols-12 px-6 py-3 text-xs font-semibold text-gray-500 bg-slate-50">
         <div className="col-span-3">Employee</div> 
         <div className="col-span-2">Department</div>
          <div className="col-span-2">Contact</div> 
          <div className="col-span-2">Location</div> 
          <div className="col-span-1">Joined</div>
           <div className="col-span-2 text-right">Status / Action</div>
            </div>
      <div className="divide-y">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 px-6 py-4 hover:bg-slate-50"
          >
            <div className="md:col-span-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ff1493]/10 text-[#ff1493] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">{emp.name}</p>
                <p className="text-xs text-gray-500">{emp.email}</p>
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-1 text-sm">
              <Building2 className="w-4 h-4 text-[#1392d3]" />
              {emp.department}
            </div>

            <div className="md:col-span-2 flex items-center gap-1 text-sm">
              <Phone className="w-4 h-4 text-[#1392d3]" />
              {emp.phone}
            </div>

            <div className="md:col-span-2 flex items-center gap-1 text-sm">
              <MapPin className="w-4 h-4 text-[#ff1493]" />
              {emp.location}
            </div>

            <div className="md:col-span-1 text-sm text-gray-600 md:mt-2">
              {emp.joiningDate}
            </div>

            <div className=" flex items-center md:col-span-2 flex justify-end">
                <div className="md:col-span-1 mr-4 flex items-center">
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full
                text-xs font-semibold
                ${
                  emp.status === "Active"
                    ? "bg-[#50c896]/15 text-[#50c896]"
                    : "bg-[#ff1493]/15 text-[#ff1493]"
                }`}
  >
    <span
      className={`w-2 h-2 rounded-full
                  ${
                    emp.status === "Active"
                      ? "bg-[#50c896]"
                      : "bg-[#ff1493]"
                  }`}
    />
    {emp.status}
  </span>
</div>

              <button
                onClick={() => openModal(emp)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold
                           bg-[#1392d3] text-white hover:bg-[#ff1493]"
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
     
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#ff1493]">
          Edit Employee Details
        </h3>
        <X
          className="cursor-pointer text-gray-500"
          onClick={() => setOpen(false)}
        />
      </div>

     
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Employee Name
          </label>
          <input
            value={current.name}
            onChange={(e) =>
              setCurrent({ ...current, name: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 text-sm
                       focus:ring-2 focus:ring-[#1392d3]/30 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Phone Number
          </label>
          <input
            value={current.phone}
            onChange={(e) =>
              setCurrent({ ...current, phone: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 text-sm
                       focus:ring-2 focus:ring-[#1392d3]/30 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Department
          </label>
          <input
            value={current.department}
            onChange={(e) =>
              setCurrent({ ...current, department: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 text-sm
                       focus:ring-2 focus:ring-[#1392d3]/30 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Location
          </label>
          <input
            value={current.location}
            onChange={(e) =>
              setCurrent({ ...current, location: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 text-sm
                       focus:ring-2 focus:ring-[#1392d3]/30 outline-none"
          />
        </div>
      </div>


      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-lg text-sm border"
        >
          Cancel
        </button>
        <button
          onClick={saveChanges}
          className="px-5 py-2 rounded-lg text-sm font-semibold
                     bg-[#50c896] text-white hover:opacity-90"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
