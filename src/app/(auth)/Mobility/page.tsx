'use client'

import React, { useState } from 'react'
import {
  Heart, User, Stethoscope, Pill, CalendarDays, Droplet, BedDouble, BadgeCheck, ShowerHead,
} from 'lucide-react'
import Preview from '@/Components/Preview/page'
import PreviewComponent from '@/Components/Preview/page'
import name from '@/pages/api/Upload'

const specialityOptions = [
  'Neurological', 'Cardiological', 'Respiratory', 'Gastro', 'Surgery', 'Other'
]

const treatmentOptions = [
  'Medication', 'Hospital Visit', 'Physio', 'Nursing', 'Other'
]

const mobilityAids = [
  'Crutches', 'Wheelchair', 'Frame', 'Eye Glasses', 'Footwear', 'Hearing Aids', 'Call bell',
]

const breathingEquipments = [
  'CPAP', 'BIPAP', 'Home Oxygen', 'Nebuliser', 'Inhalers'
]

const nutritionFeeds = [
  'Independent', 'Prompt', 'PEG Feed', 'NG Feed', 'AO1', 'Swallowing Issue', 'Diabetic'
]

const hygieneOptions = [
  'Assistance Required', 'Independent', 'Supervised', 'Partially Dependent'
]

const bedTypes = [
  'Functional', 'Normal', 'Side rails', 'Air Mattress', 'Movable', 'Lifted', 'Any other special'
]

const floorTypes = [
  'Stone', 'Tiles', 'Wood', 'Carpet', 'Rubber', 'Polished/Slippery'
]

const washroomAccessories = [
  'Bell', 'Side Rails', 'Door Open Locking', 'Grab Bars', 'Anti-skid Mat', 'Shower Chair'
]

const administerBy = ["Family", "HCP", "Independent", "Other"]

const sampleData = {
  Balance: "No",
  Bathing: "Independent",
  Bedding: "Independent",
  Depression: "No",
  "Frequent Urination": "Yes",
  Grooming: "Independent",
  "Hand Wash": "Independent",
  "Hearing Loss": "Yes",
  "History of Fall": "No",
  "Mouth Care": "Assistance Required",
  "Nail Care": "Independent",
  "Room Hygiene": "Independent",
  "Sleep Issues": "Yes",
  Toileting: "Independent",
  "Visual Impairment": "No",
  administerBy: "Family",
  bedAssistance: "Yes",
  bedType: "Functional",
  breathingEquipment: "BIPAP",
  catheterDueDate: "2025-09-02",
  constipated: "No",
  dietType: "High Protein",
  eliminationSupport: "Bedpan",
  feedingMethod: "NG Feed",
  floorFallRisk: "Yes",
  floorType: "Stone",
  foodAllergy: "Test Food Allergy",
  hobbies: "Test Hobbies",
  hospitalVisits: "Test Hospital Visits",
  hydrationDisease: "Test Hydration",
  hydrationStatus: "Limit",
  mobility: "Independent",
  mobilityAid: "Crutches",
  occupation: "Test CurrentOccupation",
  presentIllness: "Test Illness",
  relation: "Test Relation",
  remarks: "ssdsd",
  speciality: "Cardiological",
  treatment: "Medication",
  washroomAccessory: "Bell",
  Medications: [
    {
      medicationName: "Test Medication",
      dose: "Test Dose",
      quantity: "5",
      route: "Test Route",
      administerBy: "",
    },
  ],
  Inputs: {
    personalFamilyRemark: "Test Remarks",
  },
};

type StringMap = Record<string, string>;
export default function DataCollectionForm() {

  const [showRemark, setShowRemark] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<StringMap>({});
  const [otherInputs, setOtherInputs] = useState<StringMap>({});
  const [ShowPreviewData, setShowPrevieData] = useState(true)
  const [FinelPrewData, setFinelPrewData] = useState(sampleData)
  const [formData, setformData] = useState()
  const [medications, setMedications] = useState([
    { medicationName: '', dose: '', quantity: '', route: '', administerBy: '', medTime: '', reviewDate: '' }
  ]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (value === 'Other') {
      setOtherInputs((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleOtherChange = (name: any, value: any) => {
    setOtherInputs((prev) => ({ ...prev, [name]: value }))
  }

  const toggleRemark = (section: any) => {
    setShowRemark((prev: any) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const PreviewData: any = { ...form, Inputs: { ...otherInputs }, Medications: medications }
    setFinelPrewData(PreviewData)
    console.log("Submitted Data----", PreviewData.administerBy)
    setShowPrevieData(false)
  }
  const addMedication = () => {
    setMedications(prev => [...prev, { medicationName: '', dose: '', quantity: '', route: '', administerBy: '', medTime: '', reviewDate: '' }]);
  };
  const RemoveMedication = () => {
    setMedications(prev => prev.slice(0, prev.length - 1))
  }
  const renderAddRemark = (section: any) => (
    <div className="flex justify-end gap-2 mt-4">



      {showRemark[section] && (

        <textarea
          name={`${section}Remark`}
          placeholder="Enter your remark...."
          className="p-2 shadow-lg border-1 text-center rounded-md  w-full text-gray-800"
          onChange={(e) => handleOtherChange(`${section}Remark`, e.target.value)}
        />

      )}

      <button type="button" onClick={() => toggleRemark(section)} className="px-2  h-8 text-center py-1 bg-green-600 text-white rounded">
        Add Remark
      </button>
    </div>
  )


  const handleMedicationChange = (index: number, e: any) => {
    const { name, value } = e.target;
    const newMeds: any = [...medications];
    newMeds[index][name] = value;
    setMedications(newMeds);
  };

  const renderRadioOptions = (name: any, options: any[]) => (
    <div className="flex flex-wrap gap-4 mt-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value={opt}
            className="text-green-600 focus:ring-green-500"
            onChange={handleChange}
          />
          {opt}
        </label>
      ))}
      {form[name] === 'Other' ? (
        <input
          type="text"
          placeholder={`Enter other ${name}`}
          className="p-2 border-1 w-full"
          value={otherInputs[name]}
          onChange={(e: any) => handleOtherChange(name, e.target.value)}
        />
      ) : null}
    </div>
  )
  console.log("Test Form Data----", form)
  return (
    <div>{ShowPreviewData ?
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="relative text-sm sm:text-base md:text-xl font-medium text-center text-[#ff1493] tracking-wide leading-snug flex flex-wrap items-center justify-center gap-2 m-2">
          <img src="/Icons/Curate-logo.png" alt="Logo" className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-white text-rose-500 rounded-full p-2 shadow-sm" />
          Patient Daily Routine (PDR) Assessment
          <div className="relative group hidden md:flex">
            <img src="Icons/info.png" className="h-4 w-4 cursor-pointer" alt="Info" />
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-60 sm:w-72 md:w-96 p-3 text-[8px] sm:text-[8px] bg-white text-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
              Curate Health Services personalised care plan encompasses various aspects of care, including medical treatments, medication management, physiotherapy services, wellbeing service, assistance with activities of daily living (ADLs), emotional support, and social engagement. It is created through a collaborative effort between the patient, their family or health care assistance (HCAs) and a team of healthcare professionals (HCPs), such as nurses, doctors, physiotherapists, and social workers.
              The Advanced Personal Care Plan (APCP) considers the specific health conditions, functional abilities, and personal goals of the individual receiving care. It outlines the specific services to be provided, the frequency of visits, and the goals to be achieved. The plan is regularly reviewed and modified as needed to ensure it remains responsive to the changing needs and progress of the patient.
              By developing a personalised care plan for home health care, the aim is to provide a holistic and individualised approach to meet the patient's medical, physical, emotional, and social needs, while allowing them to maintain their independence and dignity in the familiar surroundings of their own home.
            </div>
          </div>
        </h1>

        <form className="p-2 mx-auto space-y-12" onSubmit={handleSubmit}>

          <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-green-300 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/telecommuting.gif' className="w-10 h-10 " />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Personal & Family Details</h2>
            </div>
            <div className="relative">
              <input type="text" name="occupation" className="peer input-modern" placeholder=" " onChange={handleChange} />
              <label className="floating-label">Current/Previous Occupation</label>
            </div>
            <div className="relative">
              <input type="text" name="hobbies" className="peer input-modern" placeholder=" " onChange={handleChange} />
              <label className="floating-label">Hobbies and Interests</label>
            </div>
            <div className="relative">
              <input type="text" name="relation" className="peer input-modern" placeholder=" " onChange={handleChange} />
              <label className="floating-label">Relation to Patient</label>
            </div>
            {renderAddRemark("personalFamily")}
          </section>

          <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-cyan-300 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/health-checkup.gif' className="w-10 h-10 " />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Present Health</h2>
            </div>
            <div className="relative">
              <textarea name="presentIllness" className="peer input-modern" placeholder=" " onChange={handleChange} />
              <label className="floating-label">Present Illness</label>
            </div>
            <div>
              <label className="font-semibold">Specialty Areas</label>
              {renderRadioOptions("speciality", specialityOptions)}
            </div>
            {renderAddRemark("presentHealth")}
          </section>

          <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-pink-300 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/medical-care.gif' className="w-10 h-10 " />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Treatment</h2>
            </div>
            <div>
              <label className="font-semibold">On-going Treatment</label>
              {renderRadioOptions("treatment", treatmentOptions)}
            </div>
            <div className="relative">
              <textarea name="hospitalVisits" className="peer input-modern" placeholder=" " onChange={handleChange} />
              <label className="floating-label">Hospital Visits</label>
            </div>
            {renderAddRemark("treatment")}
          </section>

          <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-teal-300 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/wheelchair.gif' className="w-10 h-10" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Functional Assessments</h2>
            </div>

           {['Balance', 'History of Fall', 'Hearing Loss', 'Visual Impairment', 'Depression', 'Confusion', 'Frequent Urination', 'Sleep Issues', 'Anxiety'].map(q => (
  <div key={q} className="mb-4">
    <label className="font-semibold">{q}</label>
    <div className="flex flex-wrap gap-6 mt-1">
      <label>
        <input
          type="radio"
          name={q}
          value="Yes"
          className="text-green-600 focus:ring-green-500"
          onChange={handleChange}
        />{" "}
        Yes
      </label>
      <label>
        <input
          type="radio"
          name={q}
          value="No"
          className="text-green-600 focus:ring-green-500"
          onChange={handleChange}
        />{" "}
        No
      </label>
    </div>


    {q === 'History of Fall' && form['History of Fall'] === 'Yes' && (
      <select
        className="w-[150px] text-[12px] text-center px-2 h-10 rounded-lg border border-gray-300 text-gray-900 mt-2"
        defaultValue=""
        name='FallTimes'
        onChange={handleChange} 
      >
        <option value="" disabled>
          Choose Fall History
        </option>
        <option value="1">1 Fall</option>
        <option value="2">2 Fall</option>
        <option value="3">3 Fall</option>
        <option value="more than 3 Times">More Than 3 Fall</option>
      </select>
    )}
  </div>
))}

            
            <div>
              <label className="font-semibold">Mobility/Movement</label>
              {renderRadioOptions("mobility", ['Independent', 'Support Needed'])}
            </div>
            <div>
              <label className="font-semibold">Mobility Aids</label>
              {renderRadioOptions("mobilityAid", mobilityAids)}
            </div>
            {renderAddRemark("functionalAssessment")}
          </section>

          <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-yellow-300 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/surgery-room.gif' className="w-10 h-10" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Equipment Use</h2>
            </div>
            <div>
              <label className="font-semibold">Breathing Equipment</label>
              {renderRadioOptions("breathingEquipment", breathingEquipments)}
            </div>
            {renderAddRemark("equipmentUse")}
          </section>

          <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-rose-300 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/nutrition-plan.gif' className="w-10 h-10 text-rose-700" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Nutrition & Hydration</h2>
            </div>
            <div className="relative">
              <input type="text" name="foodAllergy" className="peer input-modern" placeholder=" " onChange={handleChange} />
              <label className="floating-label">Food Allergy</label>
            </div>
            <div>
              <label className="font-semibold">Diet Type</label>
              {renderRadioOptions("dietType", ['Normal', 'Special', 'Low Salt', 'High Protein'])}
            </div>
            <div>
              <label className="font-semibold">Feeding Method</label>
              {renderRadioOptions("feedingMethod", nutritionFeeds)}
            </div>
            <div>
              <label className="font-semibold">Hydration Status</label>
              {renderRadioOptions("hydrationStatus", ['Prompt', 'Independent', 'AO1', 'Limit'])}
            </div>
            <div className="relative">
              <input type="text" name="hydrationDisease" className="peer input-modern" placeholder=" " onChange={handleChange} />
              <label className="floating-label">Hydration Related Disease</label>
            </div>
            {renderAddRemark("nutritionHydration")}
          </section>

          <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-green-300 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/hand-washing.gif' className="w-10 h-10" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Hygiene & Elimination</h2>
            </div>
            {['Mouth Care', 'Bathing', 'Grooming', 'Bedding', 'Room Hygiene', 'Toileting', 'Hand Wash', 'Nail Care'].map(option => (
              <div key={option}>
                <label className="font-semibold">{option}</label>
                {renderRadioOptions(option, hygieneOptions)}
              </div>
            ))}
            <div>
              <label className="font-semibold">Elimination Support Tools</label>
              {renderRadioOptions("eliminationSupport", ['Stick/Frame', 'Bedpan', 'Urine bottle', 'Diaper', 'Stroma bag', 'Catheter'])}
            </div>
            <div className="relative">
              <input type="date" name="catheterDueDate" className="peer input-modern" onChange={handleChange} />
              <label className="floating-label">Catheter Due Date</label>
            </div>
            <div>
              <label className="font-semibold">Constipated</label>
              {renderRadioOptions("constipated", ['Yes', 'No'])}
            </div>
            <div className="relative">
              <textarea name="remarks" className="peer input-modern" placeholder=" " onChange={handleChange} />
              <label className="floating-label">Remarks</label>
            </div>
            {renderAddRemark("hygieneElimination")}
          </section>

          <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-gray-300 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/hospitalization.gif' className="w-10 h-10" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Bed, Floor, Washroom Assessment</h2>
            </div>
            <div>
              <label className="font-semibold">Bed Type</label>
              {renderRadioOptions("bedType", bedTypes)}
            </div>
            <div>
              <label className="font-semibold">Bed Assistance</label>
              {renderRadioOptions("bedAssistance", ['Yes', 'No'])}
            </div>
            <div>
              <label className="font-semibold">Floor Type</label>
              {renderRadioOptions("floorType", floorTypes)}
            </div>
            <div>
              <label className="font-semibold">Floor Fall Risk</label>
              {renderRadioOptions("floorFallRisk", ['Yes', 'No'])}
            </div>
            <div>
              <label className="font-semibold">Washroom Accessories</label>
              {renderRadioOptions("washroomAccessory", washroomAccessories)}
            </div>
            {renderAddRemark("bedFloorWashroom")}
          </section>

          <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-indigo-300 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/tablet.gif' className="w-10 h-10" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Medication List</h2>
            </div>
            {medications.map((med, index) => (
              <div key={index} className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="medicationName" className="input-modern" placeholder="Medication" value={med.medicationName} onChange={(e) => handleMedicationChange(index, e)} />
                  <input type="text" name="dose" className="input-modern" placeholder="Dose" value={med.dose} onChange={(e) => handleMedicationChange(index, e)} />
                  <input type="number" name="quantity" className="input-modern" placeholder="Quantity" value={med.quantity} onChange={(e) => handleMedicationChange(index, e)} />
                  <input type="text" name="route" className="input-modern" placeholder="Route" value={med.route} onChange={(e) => handleMedicationChange(index, e)} />
                </div>
                <div className="flex justify-end mt-2">
                  {medications.length >= 2 && index !== medications.length - 1 &&
                    <button type="button" onClick={RemoveMedication} className='bg-pink-400 p-1 border-1 text-white text-[10px] w-[60px] rounded-md cursor-pointer hover:shadow-lg hover:rounded-full'>
                      - Remove
                    </button>
                  }
                  {index === medications.length - 1 && (
                    <button type="button" onClick={addMedication} className='bg-pink-400 p-1 border-1 text-white text-[10px] w-[100px] rounded-md cursor-pointer hover:shadow-lg hover:rounded-full'>
                      + Add Medication
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div>
              <label className="font-semibold">Administer By</label>
              {renderRadioOptions("administerBy", administerBy)}
            </div>
            <div>
              <label className="font-semibold">Time</label>
              <input type="time" name="medTime" className="input-modern" value={new Date().toTimeString().slice(0, 5)} onChange={handleChange} />
            </div>
            <div>
              <label className="font-semibold">Review Date</label>
              <input type="text" name="reviewDate" className="input-modern" value={new Date().toLocaleDateString("en-IN")} onChange={handleChange} />
            </div>
            {renderAddRemark("medicationList")}
          </section>

          <div className="flex justify-center mt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">Preview & Submit</button>
          </div>
        </form>
      </div> : <PreviewComponent data={FinelPrewData} />
    }</div>
  )
}
