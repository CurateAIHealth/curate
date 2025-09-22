"use client";

import { useState, useEffect } from "react";
import {
  ListFilter,
  Users,
  Heart,
  Stethoscope,
  CalendarCheck,
  Minimize,
  Pencil,
  X,
} from "lucide-react";

const Headings = [
  "Client Card – ID",
  "Patient Card – ID",
  "Patient Details",
  "Additional Comments",
];

const mockUser = {
  userId: "1",
  clientName: "Curate",
  clientPhone: "1234567890",
  clientEmail: "Curate@example.com",
  patientName: "Jane Doe",
  patientPhone: "987654321",
  patientAge: "35",
  patientGender: ["Male"],
  MainpointforPatientInfo: "Regular Checkup",
  Source: "Referral",
  patientType: ["Bed Ridden"],
  patientCurrentLocation: ["Home"],
  serviceLocation: "Hyderabad",
  patientHomeAssistance: ["Diaper", "Bathing"],
  patientHomeNeeds: ["BP Monitor", "Water Bed"],
  patientDrNeeds: ["Medical Dr.", "Physio"],
  patientHealthCard: ["Diabetic"],
  hcpType: ["HCA", "HCN"],
  serviceCharges: "₹1200",
  AdditionalComments: "Patient requires daily monitoring",
  ClientStatus: "Processing",
};

export default function ProUserDashboard() {
  const [userData, setUserData] = useState<typeof mockUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
const [visible, setVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => setUserData(mockUser), 500);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setOptionsOpen(false);
  };

  if (!userData)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Loading user data...
      </p>
    );

  const handleChange = (field: string, value: any) => {
    setUserData((prev) => prev && { ...prev, [field]: value });
  };

  const toggleEdit = (section: string) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleUpdate = (section: string) => {
    console.log(`Updated ${section}:`, userData);
    toggleEdit(section);
  };

  return (
    <div className="flex w-full min-h-screen font-sans bg-gray-100">
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 w-72 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-72"
        }`}
      >
        <div className="flex flex-col p-6 gap-6 h-full">
          <button
            className="flex items-center justify-end gap-3 p-3 rounded-lg hover:bg-purple-50 transition text-gray-700 font-medium"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Minimize className="cursor-pointer" />
          </button>
          <div className="flex-1 flex flex-col gap-3">
            {Headings.map((item) => (
              <button
                key={item}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition text-gray-700 font-medium"
                onClick={() => scrollToSection(item)}
              >
                <Users className="w-5 h-5 text-purple-500" />
                {item}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col transition-all ${
          sidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
       
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-md px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 bg-white shadow-lg rounded-lg hover:bg-purple-200 transition"
            >
              <ListFilter className="w-6 h-6 text-[#1392d3] cursor-pointer" />
            </button>
            <h1 className="text-base sm:text-lg md:text-xl font-medium  text-center text-[#ff1493] tracking-wide leading-snug flex items-center justify-center gap-2">
              Patient Registration
              <img
                src="/Icons/Curate-logo.png"
                alt="Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl mr-2 bg-white text-rose-500 rounded-full p-2 shadow-sm"
              />
            </h1>
          </div>
          <p className="text-[10px] flex items-end">*Use Aadhaar card details for accuracy</p>
        </header>

        <main className="p-6 md:p-10 flex flex-col gap-10">
          <section
            id="Client Card – ID"
            className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                <Users /> Client Card – ID
              </h2>
              <button
                onClick={() => toggleEdit("Client Card – ID")}
                className="px-1 cursor-pointer py-1 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-600 transition"
              >
                {editMode["Client Card – ID"] ? "Cancel" : <Pencil className="w-4 h-4"/>}
              </button>
            </div>
            <div className="mt-4 space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {editMode["Client Card – ID"] ? (
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={userData.clientName}
                    onChange={(e) => handleChange("clientName", e.target.value)}
                  />
                ) : (
                  userData.clientName
                )}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {editMode["Client Card – ID"] ? (
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={userData.clientPhone}
                    onChange={(e) =>
                      handleChange("clientPhone", e.target.value)
                    }
                  />
                ) : (
                  userData.clientPhone
                )}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {editMode["Client Card – ID"] ? (
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={userData.clientEmail}
                    onChange={(e) =>
                      handleChange("clientEmail", e.target.value)
                    }
                  />
                ) : (
                  userData.clientEmail
                )}
              </p>
              <p>
                <span className="font-semibold">Lead Source:</span>{" "}
                {editMode["Client Card – ID"] ? (
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={userData.Source}
                    onChange={(e) => handleChange("Source", e.target.value)}
                  />
                ) : (
                  userData.Source
                )}
              </p>
            </div>
            {editMode["Client Card – ID"] && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleUpdate("Client Card – ID")}
                  className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-105 transition"
                >
                  Save
                </button>
              </div>
            )}
          </section>
 {visible&&
<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
  <div className="flex flex-col h-auto w-[90%] max-w-md bg-gray-200 rounded-xl shadow-lg p-4">

      <button
       onClick={() => setVisible(false)}
        aria-label="Close"
        className="absolute top-2 right-2 cursor-pointer rounded-md p-1 bg-slate-100 mr-10 mt-10"
      >
        <X className="h-4 w-4 text-slate-600" />
      </button>
<img src="Icons/Adhar_Example.png"/>
      <h1 className=" flex items-center justify-center text-sm text-[20px] text-teal-800">
        Use Aadhaar card details for accuracy
      </h1>

      <p className="text-center text-[14px]">For reliable identification, kindly provide details exactly as on your Aadhaar card.</p>
    </div>
    </div>}
          <section
            id="Patient Card – ID"
            className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-teal-700 flex items-center gap-2">
                <Heart /> Patient Card – ID
              </h2>
              <button
                onClick={() => toggleEdit("Patient Card – ID")}
                className="px-1 py-1 cursor-pointer rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-600 transition"
              >
                {editMode["Patient Card – ID"] ? "Cancel" : <Pencil className="w-4 h-4"/>}
              </button>
            </div>
            <div className="mt-4 space-y-2 text-gray-700">
              {[
                { label: "Name", field: "patientName" },
                { label: "Phone", field: "patientPhone" },
                { label: "Age", field: "patientAge" },
                { label: "Main Point Info", field: "MainpointforPatientInfo" },
                { label: "Service Location", field: "serviceLocation" },
              ].map((item) => (
                <p key={item.field}>
                  <span className="font-semibold">{item.label}:</span>{" "}
                  {editMode["Patient Card – ID"] ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={userData[item.field as keyof typeof userData] as string}
                      onChange={(e) => handleChange(item.field, e.target.value)}
                    />
                  ) : (
                    userData[item.field as keyof typeof userData]
                  )}
                </p>
              ))}
              <p>
                <span className="font-semibold">Gender:</span>{" "}
                {editMode["Patient Card – ID"] ? (
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={userData.patientGender.join(", ")}
                    onChange={(e) =>
                      handleChange(
                        "patientGender",
                        e.target.value.split(",").map((v) => v.trim())
                      )
                    }
                  />
                ) : (
                  userData.patientGender.join(", ")
                )}
              </p>
              <p>
                <span className="font-semibold">Patient Type:</span>{" "}
                {editMode["Patient Card – ID"] ? (
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={userData.patientType.join(", ")}
                    onChange={(e) =>
                      handleChange(
                        "patientType",
                        e.target.value.split(",").map((v) => v.trim())
                      )
                    }
                  />
                ) : (
                  userData.patientType.join(", ")
                )}
              </p>
              <p>
                <span className="font-semibold">Current Location:</span>{" "}
                {editMode["Patient Card – ID"] ? (
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={userData.patientCurrentLocation.join(", ")}
                    onChange={(e) =>
                      handleChange(
                        "patientCurrentLocation",
                        e.target.value.split(",").map((v) => v.trim())
                      )
                    }
                  />
                ) : (
                  userData.patientCurrentLocation.join(", ")
                )}
              </p>
            </div>
            {editMode["Patient Card – ID"] && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleUpdate("Patient Card – ID")}
                  className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-105 transition"
                >
                  Save
                </button>
              </div>
            )}
          </section>

          <section
            id="Patient Details"
            className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-pink-700 flex items-center gap-2">
                <Stethoscope /> Patient Details
              </h2>
              <button
                onClick={() => toggleEdit("Patient Details")}
                className="px-1 py-1 cursor-pointer rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-600 transition"
              >
                {editMode["Patient Details"] ? "Cancel" : <Pencil className="w-4 h-4"/>}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {[
                { label: "Home Assistance", field: "patientHomeAssistance" },
                { label: "Home Needs", field: "patientHomeNeeds" },
                { label: "Doctor Needs", field: "patientDrNeeds" },
                { label: "Health Card", field: "patientHealthCard" },
                { label: "HCP Type", field: "hcpType" },
              ].map((section) => (
                <div
                  key={section.label}
                  className="bg-purple-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <p className="font-semibold mb-2">{section.label}:</p>
                  {editMode["Patient Details"] ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={(userData[section.field as keyof typeof userData] as string[]).join(
                        ", "
                      )}
                      onChange={(e) =>
                        handleChange(
                          section.field,
                          e.target.value.split(",").map((v) => v.trim())
                        )
                      }
                    />
                  ) : (
                    <ul className="list-disc list-inside text-gray-700">
                      {(userData[section.field as keyof typeof userData] as string[]).map(
                        (item, idx) => (
                          <li key={idx}>{item}</li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            {editMode["Patient Details"] && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleUpdate("Patient Details")}
                  className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-105 transition"
                >
                  Save
                </button>
              </div>
            )}
          </section>

          <section
            id="Additional Comments"
            className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-700 flex items-center gap-2">
                <CalendarCheck /> Charges & Comments
              </h2>
              <button
                onClick={() => toggleEdit("Additional Comments")}
                className="px-1 cursor-pointer py-1 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-600 transition"
              >
                {editMode["Additional Comments"] ? "Cancel" : <Pencil className="w-4 h-4"/>}
              </button>
            </div>
            <div className="mt-4 space-y-2 text-gray-700">
              {[
                { label: "Service Charges", field: "serviceCharges" },
                { label: "Additional Comments", field: "AdditionalComments" },
                { label: "Client Status", field: "ClientStatus" },
              ].map((item) => (
                <p key={item.field}>
                  <span className="font-semibold">{item.label}:</span>{" "}
                  {editMode["Additional Comments"] ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={userData[item.field as keyof typeof userData] as string}
                      onChange={(e) => handleChange(item.field, e.target.value)}
                    />
                  ) : (
                    userData[item.field as keyof typeof userData]
                  )}
                </p>
              ))}
            </div>
            {editMode["Additional Comments"] && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleUpdate("Additional Comments")}
                  className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-105 transition"
                >
                  Save
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
