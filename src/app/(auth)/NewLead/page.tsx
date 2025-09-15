"use client";

import { useState } from "react";

export default function CallEnquiryForm() {
  const [formData, setFormData] = useState<any>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    patientName: "",
    patientPhone: "",
    patientAge: "",
    patientGender: [],
    patientWeight: "",
    patientHeight: "",
    comfortableLanguages: [],
    patientType: [],
    patientCurrentLocation: [],
    serviceLocation: "",
    patientHomeAssistance: [],
    patientHomeNeeds: [],
    patientDrNeeds: [],
    patientHealthCard: [],
    hcpType: [],
    serviceCharges: "",
  });
const [WarningMessage,setWarningMessage]=useState("")
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
      if (field === "serviceCharges" && value === "Below ₹800") {
    setWarningMessage("Price Not Offerable");
  }else{
    setWarningMessage("")
  }
  };

  const handleCheckboxChange = (section: string, value: string) => {
    setFormData((prev: any) => {
      const current = prev[section] || [];
      if (current.includes(value)) {
        return { ...prev, [section]: current.filter((item: string) => item !== value) };
      } else {
        return { ...prev, [section]: [...current, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 w-full h-screen overflow-hidden bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-xl flex flex-col gap-6"
    >
      <h1 className="text-3xl font-extrabold text-center text-purple-700">
        Call Enquiry & Firsthand Info
      </h1>

      <div className="grid grid-cols-3 gap-6 flex-1 overflow-y-auto pr-2">

        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <h2 className="text-lg font-semibold text-purple-600">Client Card – ID</h2>
          <input type="text" placeholder="Client Name" className="w-full border rounded-lg p-2" value={formData.clientName} onChange={(e) => handleChange("clientName", e.target.value)} />
          <input type="text" placeholder="Client Phone" className="w-full border rounded-lg p-2" value={formData.clientPhone} onChange={(e) => handleChange("clientPhone", e.target.value)} />
          <input type="email" placeholder="Client Email" className="w-full border rounded-lg p-2" value={formData.clientEmail} onChange={(e) => handleChange("clientEmail", e.target.value)} />
        </div>


        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <h2 className="text-lg font-semibold text-purple-600">Patient Card – ID</h2>
          <input type="text" placeholder="Patient Name" className="w-full border rounded-lg p-2" value={formData.patientName} onChange={(e) => handleChange("patientName", e.target.value)} />
          <input type="text" placeholder="Phone" className="w-full border rounded-lg p-2" value={formData.patientPhone} onChange={(e) => handleChange("patientPhone", e.target.value)} />
          <input type="number" placeholder="Age" className="w-full border rounded-lg p-2" value={formData.patientAge} onChange={(e) => handleChange("patientAge", e.target.value)} />

       <div>
  <h3 className="font-medium text-sm">Gender</h3>
  <div className="flex flex-wrap gap-2">
    {["Male", "Female", "Other"].map((g) => (
      <label key={g} className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded">
        <input
          type="checkbox"
          checked={formData.patientGender[0] === g}
          onChange={() => setFormData((prev: any) => ({ ...prev, patientGender: [g] }))}
          className="mr-2 accent-purple-600"
        />
        {g}
      </label>
    ))}
  </div>
</div>

        </div>


        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <h2 className="text-lg font-semibold text-purple-600">Patient Details</h2>
          <div>
            <h3 className="font-medium text-sm">Patient Type</h3>
            <div className="flex flex-col gap-1">
              {["Bed Ridden","Semi Bed Ridden","Wheel Chair","Full Mobile","Post Operative"].map((t) => (
                <label key={t} className="flex items-center text-sm">
                  <input type="checkbox" checked={formData.patientType.includes(t)} onChange={() => handleCheckboxChange("patientType", t)} className="mr-2 accent-purple-600" />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm">Current Location</h3>
            <div className="flex flex-col gap-1">
              {["Hospital","Rehab","Home"].map((loc) => (
                <label key={loc} className="flex items-center text-sm">
                  <input type="checkbox" checked={formData.patientCurrentLocation.includes(loc)} onChange={() => handleCheckboxChange("patientCurrentLocation", loc)} className="mr-2 accent-purple-600" />
                  {loc}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm">Service Location</h3>
            <input type="text" placeholder="Enter Service Location" className="w-full border rounded-lg p-2" value={formData.serviceLocation} onChange={(e) => handleChange("serviceLocation", e.target.value)} />
          </div>
        </div>

    
        <div className="bg-white rounded-lg shadow p-4 space-y-3 col-span-2">
          <h2 className="text-lg font-semibold text-purple-600">Weight</h2>
          <div className="grid grid-cols-6 gap-2">
            {["30","35","40","45","50","55","60","65","70","75","80","85","90","95","100","105","110","115","120","120+"].map((w) => (
              <label key={w} className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded">
                <input type="radio" name="patientWeight" value={w} checked={formData.patientWeight === w} onChange={() => handleChange("patientWeight", w)} className="mr-2 accent-purple-600" />
                {w} kg
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 space-y-3 col-span-2">
          <h2 className="text-lg font-semibold text-purple-600">Height</h2>
          <div className="grid grid-cols-6 gap-2">
            {["4.0","4.1","4.2","4.3","4.4","4.5","4.6","4.7","4.8","4.9","5.0","5.1","5.2","5.3","5.4","5.5","5.6","5.7","5.8","5.9","6.0","6.1","6.2","6.3"].map((h) => (
              <label key={h} className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded">
                <input type="radio" name="patientHeight" value={h} checked={formData.patientHeight === h} onChange={() => handleChange("patientHeight", h)} className="mr-2 accent-purple-600" />
                {h} ft
              </label>
            ))}
          </div>
        </div>


        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <h2 className="text-lg font-semibold text-purple-600">Comfortable Languages</h2>
          <div className="grid grid-cols-2 gap-2">
            {["English","Telugu","Hindi","Tamil","Kannada","Malayalam","Other"].map((lang) => (
              <label key={lang} className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded">
                <input type="checkbox" checked={formData.comfortableLanguages.includes(lang)} onChange={() => handleCheckboxChange("comfortableLanguages", lang)} className="mr-2 accent-purple-600" />
                {lang}
              </label>
            ))}
          </div>
        </div>

   
        {[
          { title: "Home Assistance", field: "patientHomeAssistance", options: ["Diaper","Bathing","Bedding","Brushing"] },
          { title: "Home Needs", field: "patientHomeNeeds", options: ["Diaper","BP Monitor","Sugar Monitor","Water Bed"] },
          { title: "Doctor Needs", field: "patientDrNeeds", options: ["Medical Dr.","Physio","SLT","BT","OT"] },
          { title: "Health Card", field: "patientHealthCard", options: ["Diabetic","Blood Pressure","Surgery – Hip, Knee, Shoulder etc","Dementia","Paralysis"] },
          { title: "HCP Type", field: "hcpType", options: ["HCA","HCN","Dr.Physio","SLT","BT","OT","Medical Equipment"] },
        ].map((section) => (
          <div key={section.field} className="bg-white rounded-lg shadow p-4 space-y-2">
            <h2 className="text-lg font-semibold text-purple-600">{section.title}</h2>
            {section.options.map((opt) => (
              <label key={opt} className="flex items-center text-sm">
                <input type="checkbox" checked={formData[section.field].includes(opt)} onChange={() => handleCheckboxChange(section.field, opt)} className="mr-2 accent-purple-600" />
                {opt}
              </label>
            ))}
          </div>
        ))}

     
        <div className="bg-white rounded-lg shadow p-4 space-y-2">
            <h2 className="text-lg font-semibold text-purple-600">Charges</h2>
          {["₹1200","₹1000","₹900","₹800","Below ₹800"].map((charge) => (
            <label key={charge} className="flex items-center text-sm">
              <input type="radio" name="serviceCharges" value={charge} checked={formData.serviceCharges === charge} onChange={() => handleChange("serviceCharges", charge)} className="mr-2 accent-purple-600" />
              {charge}
            </label>
          ))}
          <p className="text-red-500">{WarningMessage}</p>
        </div>
     
      </div>

      <div className="text-center">
        <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition">
          Submit Enquiry
        </button>
      </div>
    </form>
  );
}
