'use client'

import React, { useState } from 'react'
import {
  Heart, User, Stethoscope, Pill, CalendarDays,  Droplet, BedDouble, BadgeCheck, ShowerHead,
 
} from 'lucide-react'

const specialityOptions = [
  'Neurological', 'Cardiological', 'Respiratory', 'Gastro', 'Surgery', 'Other'
]

const treatmentOptions = [
  'Medication', 'Hospital Visit', 'Physio','Nursing', 'Other'
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

export default function DataCollectionForm() {
  const [form, setForm] = useState({})

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <div>
    <h1 className="relative text-base sm:text-lg md:text-xl font-medium text-center text-[#ff1493] tracking-wide leading-snug flex items-center justify-center gap-2 m-2"> <img src="/Icons/Curate-logo.png" alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl mr-2 bg-white text-rose-500 rounded-full p-2 shadow-sm" /> Patient Daily Routine (PDR) Assessment <div className="relative group"> <img src="Icons/info.png" className="h-4 w-4 cursor-pointer" alt="Info" /> <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-96 p-3 text-[8px]  bg-white text-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50"> Curate Health Services personalised care plan encompasses various aspects of care, including medical treatments, medication management, physiotherapy services, wellbeing service, assistance with activities of daily living (ADLs), emotional support, and social engagement. It is created through a collaborative effort between the patient, their family or health care assistance (HCAs) and a team of healthcare professionals (HCPs), such as nurses, doctors, physiotherapists, and social workers. <br/><br/> The Advanced Personal Care Plan (APCP) considers the specific health conditions, functional abilities, and personal goals of the individual receiving care. It outlines the specific services to be provided, the frequency of visits, and the goals to be achieved. The plan is regularly reviewed and modified as needed. <br/><br/> By developing a personalised care plan for home health care, the aim is to provide a holistic and individualised approach to meet the patient's medical, physical, emotional, and social needs, while allowing them to maintain their independence and dignity at home. </div> </div> </h1>
    <form className="p-2 mx-auto space-y-12">
      <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-green-300 flex flex-col gap-6 p-8">
        <div className="flex items-center gap-3 mb-2">
       
          <img src='Icons/telecommuting.gif' className="w-10 h-10 "/>
          <h2 className="text-2xl font-bold tracking-tight">Personal & Family Details</h2>
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
      </section>

      {/* <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-blue-300 flex flex-col gap-6 p-8">
        <div className="flex items-center gap-3 mb-2">
       
          <img src="Icons/health-report.gif" className="w-10 h-10 text-blue-700"/>
          <h2 className="text-2xl font-bold tracking-tight">Medical History</h2>
        </div>
        <div className="relative">
          <input type="number" name="physioScore" required className="peer input-modern" placeholder=" " onChange={handleChange} />
          <label className="floating-label">Physio Assessment Score</label>
        </div>
        <div className="relative">
          <textarea name="pastMedicalHistory" className="peer input-modern" placeholder=" " onChange={handleChange} />
          <label className="floating-label">Past Medical History</label>
        </div>
        <div className="relative">
          <textarea name="familyMedicalHistory" className="peer input-modern" placeholder=" " onChange={handleChange} />
          <label className="floating-label">Family Medical History</label>
        </div>
        <div className="relative">
          <textarea name="medicalNote" className="peer input-modern" placeholder=" " onChange={handleChange} />
          <label className="floating-label">Medical Note</label>
        </div>
        <div>
          <label className="font-semibold">Any Surgery Performed</label>
          <div className="flex gap-6 mt-2">
            <label><input type="checkbox" name="surgeryYes" onChange={handleChange} /> Yes</label>
            <label><input type="checkbox" name="surgeryNo" onChange={handleChange} /> No</label>
          </div>
        </div>
      </section> */}

      <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-cyan-300 flex flex-col gap-6 p-8">
        <div className="flex items-center gap-3 mb-2">
       
          <img src='Icons/health-checkup.gif' className="w-10 h-10 "/>
          <h2 className="text-2xl font-bold tracking-tight">Present Health</h2>
        </div>
        <div className="relative">
          <textarea name="presentIllness" className="peer input-modern" placeholder=" " onChange={handleChange} />
          <label className="floating-label">Present Illness</label>
        </div>
        <div>
          <label className="font-semibold">Specialty Areas</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {specialityOptions.map(opt => (
              <label key={opt} className="flex items-center gap-1">
                <BadgeCheck className="w-4 h-4 text-green-600" />
                <input type="checkbox" name={opt} onChange={handleChange} /> {opt}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-pink-300 flex flex-col gap-6 p-8">
        <div className="flex items-center gap-3 mb-2">
        
          <img src='Icons/medical-care.gif' className="w-10 h-10 "/>
          <h2 className="text-2xl font-bold tracking-tight">Treatment</h2>
        </div>
        <div>
          <label className="font-semibold">On-going Treatment</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {treatmentOptions.map(opt => (
              <label key={opt} className="flex items-center gap-1">
                <BadgeCheck className="w-4 h-4 text-pink-700" />
                <input type="checkbox" name={opt} onChange={handleChange} /> {opt}
              </label>
            ))}
          </div>
        </div>
        <div className="relative">
          <textarea name="hospitalVisits" className="peer input-modern" placeholder=" " onChange={handleChange} />
          <label className="floating-label">Hospital Visits</label>
        </div>
      </section>

      <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-teal-300 flex flex-col gap-6 p-8">
        <div className="flex items-center gap-3 mb-2">
         <img src='Icons/wheelchair.gif' className="w-10 h-10"/>
          <h2 className="text-2xl font-bold tracking-tight">Functional Assessments</h2>
        </div>
        {['Balance', 'History of Fall', 'Hearing Loss', 'Visual Impairment', 'Depression', 'Confusion', 'Frequent Urination', 'Sleep Issues', 'Anxiety'].map(q => (
          <div key={q}>
            <label className="font-semibold">{q}</label>
            <div className="flex gap-6 mt-1">
              <label><input type="radio" name={q} value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name={q} value="No" onChange={handleChange} /> No</label>
            </div>
          </div>
        ))}
        <div>
          <label className="font-semibold">Mobility/Movement</label>
          <select name="mobility" onChange={handleChange} className="input-modern">
            <option value="">Select</option>
            <option value="Independent">Independent</option>
            <option value="Support Needed">Support Needed</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Mobility Aids</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {mobilityAids.map(opt => (
              <label key={opt} className="flex items-center gap-1">
              
                <input type="checkbox" name={opt} onChange={handleChange} /> {opt}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-yellow-300 flex flex-col gap-6 p-8">
        <div className="flex items-center gap-3 mb-2">
          <img src='Icons/surgery-room.gif' className="w-10 h-10" />
          <h2 className="text-2xl font-bold tracking-tight">Equipment Use</h2>
        </div>
        <div>
          <label className="font-semibold">Breathing Equipment</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {breathingEquipments.map(opt => (
              <label key={opt} className="flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4 text-green-600" />
                <input type="checkbox" name={opt} onChange={handleChange} /> {opt}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-rose-300 flex flex-col gap-6 p-8">
        <div className="flex items-center gap-3 mb-2">
       
          <img src='Icons/nutrition-plan.gif' className="w-10 h-10 text-rose-700"/>
          <h2 className="text-2xl font-bold tracking-tight">Nutrition & Hydration</h2>
        </div>
        <div className="relative">
          <input type="text" name="foodAllergy" className="peer input-modern" placeholder=" " onChange={handleChange} />
          <label className="floating-label">Food Allergy</label>
        </div>
        <div>
          <label className="font-semibold">Diet Type</label>
          <select name="dietType" className="input-modern" onChange={handleChange}>
            <option value="">Select</option>
            <option value="Normal">Normal</option>
            <option value="Special">Special</option>
            <option value="Low Salt">Low Salt</option>
            <option value="High Protein">High Protein</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Feeding Method</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {nutritionFeeds.map(opt => (
              <label key={opt} className="flex items-center gap-1">
                {/* <img src='Icons/restaurant.png' className="w-4 h-4 text-rose-700"/> */}
                <input type="checkbox" name={opt} onChange={handleChange} /> {opt}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-semibold">Hydration Status</label>
          <select name="hydrationStatus" className="input-modern" onChange={handleChange}>
            <option value="">Select</option>
            <option value="Prompt">Prompt</option>
            <option value="Independent">Independent</option>
            <option value="AO1">AO1</option>
            <option value="Limit">Limit</option>
          </select>
        </div>
        <div className="relative">
          <input type="text" name="hydrationDisease" className="peer input-modern" placeholder=" " onChange={handleChange} />
          <label className="floating-label">Hydration Related Disease</label>
        </div>
      </section>

      <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-green-300 flex flex-col gap-6 p-8">
        <div className="flex items-center gap-3 mb-2">
          
          <img src='Icons/hand-washing.gif' className="w-10 h-10"/>
          <h2 className="text-2xl font-bold tracking-tight">Hygiene & Elimination</h2>
        </div>
        {['Mouth Care', 'Bathing', 'Grooming', 'Bedding', 'Room Hygiene', 'Toileting', 'Hand Wash', 'Nail Care'].map(option => (
          <div key={option}>
            <label className="font-semibold">{option}</label>
            <select name={option.replace(/\s+/g, '').toLowerCase()} className="input-modern" onChange={handleChange}>
              {hygieneOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
        <div>
          <label className="font-semibold">Elimination Support Tools</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {['Stick/Frame', 'Bedpan', 'Urine bottle', 'Diaper', 'Stroma bag', 'Catheter'].map(opt => (
              <label key={opt} className="flex items-center gap-1">
                <BedDouble className="w-4 h-4 text-green-700" />
                <input type="checkbox" name={opt} onChange={handleChange} /> {opt}
              </label>
            ))}
          </div>
        </div>
        <div className="relative">
          <input type="date" name="catheterDueDate" className="peer input-modern" onChange={handleChange} />
          <label className="floating-label">Catheter Due Date</label>
        </div>
        <div>
          <label className="font-semibold">Constipated</label>
          <select name="constipated" className="input-modern" onChange={handleChange}>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="relative">
          <textarea name="remarks" className="peer input-modern" placeholder=" " onChange={handleChange} />
          <label className="floating-label">Remarks</label>
        </div>
      </section>

      <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-gray-300 flex flex-col gap-6 p-8">
        <div className="flex items-center gap-3 mb-2">
          <img src='Icons/hospitalization.gif' className="w-10 h-10" />
          <h2 className="text-2xl font-bold tracking-tight">Bed, Floor, Washroom Assessment</h2>
        </div>
        <div>
          <label className="font-semibold">Bed Type</label>
          <select name="bedType" className="input-modern" onChange={handleChange}>
            {bedTypes.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold">Bed Assistance</label>
          <div className="flex gap-6 mt-1">
            <label><input type="radio" name="bedAssistance" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="bedAssistance" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div>
          <label className="font-semibold">Floor Type</label>
          <select name="floorType" className="input-modern" onChange={handleChange}>
            {floorTypes.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold">Floor Fall Risk</label>
          <div className="flex gap-6 mt-1">
            <label><input type="radio" name="floorFallRisk" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="floorFallRisk" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div>
          <label className="font-semibold">Washroom Lighting</label>
          <select name="washroomLighting" className="input-modern" onChange={handleChange}>
            <option value="">Select</option>
            <option value="Automated">Automated</option>
            <option value="Switch">Switch</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Washroom Type</label>
          <div className="flex gap-6 mt-1">
            <label><input type="radio" name="washroomType" value="Indian" onChange={handleChange} /> Indian</label>
            <label><input type="radio" name="washroomType" value="Western" onChange={handleChange} /> Western</label>
          </div>
        </div>
        <div>
          <label className="font-semibold">Washroom Accessories</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {washroomAccessories.map(opt => (
              <label key={opt} className="flex items-center gap-1">
                <ShowerHead className="w-4 h-4 text-gray-700" />
                <input type="checkbox" name={opt} onChange={handleChange} /> {opt}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-semibold">Washroom Fall Risk</label>
          <div className="flex gap-6 mt-1">
            <label><input type="radio" name="washroomFallRisk" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="washroomFallRisk" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
      </section>

      <section className="bg-white/80 rounded-2xl shadow-lg ring-1 ring-indigo-300 flex flex-col gap-6 p-8">
        <div className="flex items-center gap-3 mb-2">
          <img src='Icons/tablet.gif' className="w-10 h-10" />
          <h2 className="text-2xl font-bold tracking-tight">Medication List</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="medicationName" className="input-modern" placeholder="Medication" onChange={handleChange} />
          <input type="text" name="dose" className="input-modern" placeholder="Dose" onChange={handleChange} />
          <input type="number" name="quantity" className="input-modern" placeholder="Quantity" onChange={handleChange} />
          <input type="text" name="route" className="input-modern" placeholder="Route" onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold">Administer By</label>
          <select name="administerBy" className="input-modern" onChange={handleChange}>
            <option value="">Select</option>
            <option value="Family">Family</option>
            <option value="HCP">HCP</option>
            <option value="Independent">Independent</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Time</label>
          <input type="time" name="medTime" className="input-modern" value={new Date().toTimeString().slice(0, 5)}  onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold">Review Date</label>
          <input type="text" name="reviewDate" className="input-modern" value={new Date().toLocaleDateString("en-IN")} onChange={handleChange} />
        </div>
      </section>
      <button className="bg-green-600 shadow-lg text-white px-8 py-3 rounded-xl hover:bg-green-700 transition font-semibold text-lg w-full mt-8">
        Submit
      </button>
    </form>
    </div>
  )
}
