'use client'

import React, { useEffect, useState } from 'react'
import {
  Heart, User, Stethoscope, Pill, CalendarDays, Droplet, BedDouble, BadgeCheck, ShowerHead,
  Users,
  Pencil,
  Save,
  BadgeInfo,
  BookOpenText,
  CircleEllipsis,
  MessageSquare,
} from 'lucide-react'
import Preview from '@/Components/Preview/page'
import PreviewComponent from '@/Components/Preview/page'
import name from '@/pages/api/Upload'
import { useDispatch, useSelector } from 'react-redux'
import { UpdatePreviewStatus } from '@/Redux/action'
import { indianFamilyRelations, LeadSources, medicalSpecializations, physioSpecializations, ClientEnquiry_Filters } from '@/Lib/Content'
type EditingKeys = 'PatientCardEditing' | 'ClientCardEditing'|'PatientDetails'|'AdditionalInformation'|'OtherInformation';




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

const sampleData :any= {
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
  const [isEditing, setIsEditing] = useState({PatientCardEditing:false,ClientCardEditing:false,PatientDetails:false,AdditionalInformation:false,OtherInformation:false});
  const [FinelPrewData, setFinelPrewData] = useState(sampleData)
  
  const [medications, setMedications] = useState([
    { medicationName: '', dose: '', quantity: '', route: '', administerBy: '', medTime: '', reviewDate: '' }
  ]);
const dispatch=useDispatch()
  const ShowPreviewData=useSelector((state:any)=>state.CurrentPreview)
  const [formData, setFormData] = useState(useSelector((state:any)=>state.RegisterdUsersFullInformation));
  
const handleChange = (key: string, value: any) => {
    setFormData((prev:any) => ({ ...prev, [key]: value }));
  };


  const handleOtherChange = (name: any, value: any) => {
    setOtherInputs((prev) => ({ ...prev, [name]: value }))
  }
 const handleSave = async (Item:EditingKeys) => {
    console.log("Saving Updated Data:", formData);

    setIsEditing((prev)=>({...prev, [Item]:!prev[Item]}));
  };
  const toggleRemark = (section: any) => {
    setShowRemark((prev: any) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const PreviewData: any = { ...form, Inputs: { ...otherInputs }, Medications: medications }
    setFinelPrewData(PreviewData)
    console.log("Submitted Data----", PreviewData.administerBy)
   dispatch(UpdatePreviewStatus(false))
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

      <button type="button" onClick={() => toggleRemark(section)} className="px-2 cursor-pointer  h-8 text-center py-1 bg-green-600 text-white rounded">
        Add Remark
      </button>
    </div>
  )

const handleNewChange = (key: string, value: any) => {
    setFormData((prev:any) => ({ ...prev, [key]: value }));
  };

  const handleMedicationChange = (index: number, e: any) => {
    const { name, value } = e.target;
    const newMeds: any = [...medications];
    newMeds[index][name] = value;
    setMedications(newMeds);
  };

  
  console.log("Test Form Data----", otherInputs)
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

       <main className="w-full flex flex-wrap  p-2 ">
           <div className=" w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
             <div className="flex  flex-row justify-between items-start items-center mb-6 ">
              <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/telecommuting.gif' className="w-10 h-10 " />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Personal & Family Details</h2>
            </div>

               <button
                 onClick={() => (isEditing.ClientCardEditing ? handleSave('ClientCardEditing') : setIsEditing((prev)=>({...prev,ClientCardEditing:!prev.ClientCardEditing})))}
                 className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                             ${isEditing.ClientCardEditing ? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
               >
                 {isEditing.ClientCardEditing ? <Save size={18} /> : <Pencil size={18} />}
                 {isEditing.ClientCardEditing ? "Save" : "Edit"}
               </button>
             </div>
       
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FieldItem
                 label="Client Full Name"
                 value={formData.FirstName}
                 editable={isEditing.ClientCardEditing}
                 onChange={(val) => handleChange("FirstName", val)}
                
               />
               <FieldItem
                 label="Client ContactNumber"
                 value={formData.ContactNumber}
                 editable={isEditing.ClientCardEditing}
                 onChange={(val) => handleChange("ContactNumber", val)}
                
               />
       
               <FieldItem
                 label="Client Email"
                 value={formData.Email}
                 editable={isEditing.ClientCardEditing}
                 onChange={(val) => handleChange("Email", val)}
              
               />
       
               <CheckboxGroup
                 label="Main point for Patient"
                 options={["Yes","No"]}
                 selected={formData.MainpointforPatient}
                 editable={isEditing.ClientCardEditing}
                 onChange={(val) => handleChange("MainpointforPatient", val)}
                 
               />
       
                 <CheckboxGroup
                 label="Relation to Patient"
                 options={indianFamilyRelations}
                 selected={formData.RelationtoPatient}
                 editable={isEditing.ClientCardEditing}
                 onChange={(val) => handleChange("RelationtoPatient", val)}
                 
               />
                <CheckboxGroup
                 label="Lead Source"
                 options={LeadSources}
                 selected={formData.Source}
                 editable={isEditing.ClientCardEditing}
                 onChange={(val) => handleChange("Source", val)}
                 
               />
       
                 <FieldItem
                 label="ClientCardRemarks"
                 value={formData.ClientCardRemarks}
                 editable={isEditing.ClientCardEditing}
                 onChange={(val) => handleChange("ClientCardRemarks", val)}
              
               />
       
              
             </div>
           </div>
       
           <div className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
               <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
                  <Heart /> Patient Card
                 </h2>
               <button
                 onClick={() => (isEditing.PatientCardEditing? handleSave('PatientCardEditing') : setIsEditing((prev)=>({...prev,PatientCardEditing:!prev.PatientCardEditing})))}
                 className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                             ${isEditing.PatientCardEditing? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
               >
                 {isEditing.PatientCardEditing ? <Save size={18} /> : <Pencil size={18} />}
                 {isEditing.PatientCardEditing ? "Save" : "Edit"}
               </button>
             </div>
       
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FieldItem
                 label="Patient Full Name"
                 value={formData.patientName}
                 editable={isEditing.PatientCardEditing}
                 onChange={(val) => handleChange("patientName", val)}
                
               />
               <FieldItem
                 label="Patient ContactNumber"
                 value={formData.patientPhone}
                 editable={isEditing.PatientCardEditing}
                 onChange={(val) => handleChange("patientPhone", val)}
                
               />
       
               <FieldItem
                 label="Patient Age"
                 value={formData.patientAge}
                 editable={isEditing.PatientCardEditing}
                 onChange={(val) => handleChange("patientAge", val)}
              
               />
       
               <CheckboxGroup
                 label="Patient Gender"
                 options={["Male", "Female", "Other"]}
                 selected={formData.patientGender}
                 editable={isEditing.PatientCardEditing}
                 onChange={(val) => handleChange("patientGender", val)}
                 
               />
       
                <FieldItem
                 label="Patient Abha Id"
                 value={formData.AbhaId}
                 editable={isEditing.PatientCardEditing}
                 onChange={(val) => handleChange("AbhaId", val)}
              
               />
          <FieldItem
                 label="Patient CardRemarks"
                 value={formData.PatientCardCardRemarks}
                 editable={isEditing.PatientCardEditing}
                 onChange={(val) => handleChange("PatientCardCardRemarks", val)}
                
               />
              
             </div>
           </div>
             <div className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 md:w-[49%]">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
               <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
                  <MessageSquare /> Patient Details
                 </h2>
               <button
                 onClick={() => (isEditing.PatientDetails? handleSave('PatientDetails') : setIsEditing((prev)=>({...prev,PatientDetails:!prev.PatientDetails})))}
                 className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                             ${isEditing.PatientDetails? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
               >
                 {isEditing.PatientDetails ? <Save size={18} /> : <Pencil size={18} />}
                 {isEditing.PatientDetails ? "Save" : "Edit"}
               </button>
             </div>
       
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <CheckboxGroup
                 label="Patient Type"
                 options={["Bed Ridden", "Semi Bed Ridden", "Wheel Chair", "Full Mobile", "Post Operative"]}
                 selected={formData.patientType}
                 editable={isEditing.PatientDetails}
                 onChange={(val) => handleChange("patientType", val)}
                 
               />
       
                 <CheckboxGroup
                 label="Current Location"
                 options={["Hospital", "Rehab", "Home"]}
                 selected={formData.patientCurrentLocation}
                 editable={isEditing.PatientDetails}
                 onChange={(val) => handleChange("patientCurrentLocation", val)}
                 
               />
       
               <FieldItem
                 label="Patient serviceLocation"
                 value={formData.serviceLocation}
                 editable={isEditing.PatientDetails}
                 onChange={(val) => handleChange("serviceLocation", val)}
              
               />
       
                 <FieldItem
                 label="PatientDetailsCard Remarks"
                 value={formData.PatientDetailsCardRemarks}
                 editable={isEditing.PatientDetails}
                 onChange={(val) => handleChange("PatientDetailsCardRemarks", val)}
              
               />
              
             </div>
           </div>
             <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 md:ml-2 md:w-[50%]">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
               <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
                  <BadgeInfo  /> Additional Information
                 </h2>
               <button
                 onClick={() => (isEditing.AdditionalInformation? handleSave('AdditionalInformation') : setIsEditing((prev)=>({...prev,AdditionalInformation:!prev.AdditionalInformation})))}
                 className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                             ${isEditing.AdditionalInformation? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
               >
                 {isEditing.AdditionalInformation ? <Save size={18} /> : <Pencil size={18} />}
                 {isEditing.AdditionalInformation ? "Save" : "Edit"}
               </button>
             </div>
       
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                 <FieldItem
                 label="PatientWeight (KG's)"
                 value={formData.patientWeight}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("patientWeight", val)}
              
               />
       
                <FieldItem
                 label="patientHeight (Feet's)"
                 value={formData.patientHeight}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("patientHeight", val)}
              
               />
       
       
       
                 <CheckboxGroup
                 label="Comfortable Languages"
                 options={["Telugu", "Hindi", "English", "Other"]}
                 selected={formData.comfortableLanguages}
                 editable={isEditing.AdditionalInformation}
                 multiple={true}
                 onChange={(val) => handleChange("comfortableLanguages", val)}
                 
               />
       
              
       
                 
              
             </div>
           </div>
              <div className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 ">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
               <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
                  <BookOpenText  />Medical Information
                 </h2>
               <button
                 onClick={() => (isEditing.PatientDetails? handleSave('PatientDetails') : setIsEditing((prev)=>({...prev,PatientDetails:!prev.PatientDetails})))}
                 className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                             ${isEditing.PatientDetails? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
               >
                 {isEditing.PatientDetails ? <Save size={18} /> : <Pencil size={18} />}
                 {isEditing.PatientDetails ? "Save" : "Edit"}
               </button>
             </div>
       
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <CheckboxGroup
                 label="Home Assistance"
                 options={ ["Diaper", "Bathing", "Bedding", "Brushing"]}
                 selected={formData.patientHomeAssistance}
                 editable={isEditing.PatientDetails}
                 multiple={true}
                 onChange={(val) => handleChange("patientHomeAssistance", val)}
                 
               />
       
               <CheckboxGroup
                 label="Patient HomeNeeds"
                 options={ ["Diaper", "BP Monitor", "Sugar Monitor", "Water Bed"]}
                 selected={formData.patientHomeNeeds}
                 editable={isEditing.PatientDetails}
                 multiple={true}
                 onChange={(val) => handleChange("patientHomeNeeds", val)}
                 
               />
       
                 <CheckboxGroup
                 label="Patient HomeNeeds"
                 options={ ["Medical Dr.", "Physio", "SLT", "BT", "OT"]}
                 selected={formData.patientDrNeeds}
                 editable={isEditing.PatientDetails}
                 multiple={true}
                 onChange={(val) => handleChange("patientDrNeeds", val)}
                 
               />
       {formData?.patientDrNeeds.includes("Medical Dr.")&&<CheckboxGroup
                 label=" Medical Dr specialization"
                 options={medicalSpecializations}
                 selected={formData.MedicalDrSpecialisation}
                 editable={isEditing.PatientDetails}
              
                 onChange={(val) => handleChange("MedicalDrSpecialisation", val)}
                 
               />}
          {formData.patientDrNeeds.includes("Physio")&&<CheckboxGroup
                 label="PhysiotherapySpecialisation"
                 options={physioSpecializations}
                 selected={formData.PhysiotherapySpecialisation}
                 editable={isEditing.PatientDetails}
             
                 onChange={(val) => handleChange("PhysiotherapySpecialisation", val)}
                 
               />}
       
              <CheckboxGroup
                 label="Health Card"
                 options={ [
                     "Diabetic",
                     "Blood Pressure",
                     "Surgery – Hip, Knee, Shoulder etc",
                     "Dementia",
                     "Paralysis",
                   ]}
                 selected={formData.patientHealthCard}
                 editable={isEditing.PatientDetails}
               multiple={true}
                 onChange={(val) => handleChange("patientHealthCard", val)}
                 
               />
                 <CheckboxGroup
                 label="HCP Type"
                 options={ ["HCA", "HCN", "Physio", "SLT", "BT", "OT", "Medical Equipment"]}
                 selected={formData.hcpType}
                 editable={isEditing.PatientDetails}
               multiple={true}
                 onChange={(val) => handleChange("hcpType", val)}
                 
               />
                 
              
             </div>
           </div>
           <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 md:ml-2 md:w-[50%]">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
               <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
                  <CircleEllipsis   /> Other Information
                 </h2>
               <button
                 onClick={() => (isEditing.OtherInformation? handleSave('OtherInformation') : setIsEditing((prev)=>({...prev,OtherInformation:!prev.OtherInformation})))}
                 className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                             ${isEditing.OtherInformation? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
               >
                 {isEditing.OtherInformation ? <Save size={18} /> : <Pencil size={18} />}
                 {isEditing.OtherInformation ? "Save" : "Edit"}
               </button>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                 <FieldItem
                 label="ServiceCharges"
                 value={formData.serviceCharges}
                 editable={isEditing.OtherInformation}
                 onChange={(val) => handleChange("serviceCharges", val)}
              
               />
       
               
                   <CheckboxGroup
                     label="Client Status"
                     options={ClientEnquiry_Filters}
                     selected={formData.ClientStatus}
                     editable={isEditing.OtherInformation}
                
                     onChange={(val) => handleChange("ClientStatus", val)}
       
                   />
          
           
           
             
                <FieldItem
                 label="PatientHealthCard Remarks"
                 value={formData.patientHealthCardRemarks}
                 editable={isEditing.OtherInformation}
                 
                 onChange={(val) => handleChange("patientHealthCardRemarks", val)}
              
               />
               <FieldItem
                 label="PatientDrNeeds Remarks"
                 value={formData.patientDrNeedsRemarks}
                 editable={isEditing.OtherInformation}
                 
                 onChange={(val) => handleChange("patientDrNeedsRemarks", val)}
              
               />
                  <FieldItem
                 label="hcpTypeRemarks Remarks"
                 value={formData.hcpTypeRemarks}
                 editable={isEditing.OtherInformation}
                 
                 onChange={(val) => handleChange("hcpTypeRemarks", val)}
              
               />
          
             
             
             
              <FieldItem
                 label="WeightRemarks"
                 value={formData.WeightRemarks}
                 editable={isEditing.OtherInformation}
                 
                 onChange={(val) => handleChange("WeightRemarks", val)}
              
               />
                <FieldItem
                 label="HeightRemarks"
                 value={formData.HeightRemarks}
                 editable={isEditing.OtherInformation}
                 
                 onChange={(val) => handleChange("HeightRemarks", val)}
              
               />
                <FieldItem
                 label="PatientHomeAssistanceRemarks"
                 value={formData.AdditionalComments}
                 editable={isEditing.OtherInformation}
                 
                 onChange={(val) => handleChange("patientHomeAssistanceRemarks", val)}
              
               />
                <FieldItem
                 label="patientHomeNeedsRemarks"
                 value={formData.patientHomeNeedsRemarks}
                 editable={isEditing.OtherInformation}
                 
                 onChange={(val) => handleChange("patientHomeNeedsRemarks", val)}
              
               />
          <FieldItem
                 label="AdditionalComments"
                 value={formData.AdditionalComments}
                 editable={isEditing.OtherInformation}
                 
                 onChange={(val) => handleChange("AdditionalComments", val)}
              
               />
       
               
       
              
       
                 
              
             </div>
           </div>
     
         </main>
      </div> : <PreviewComponent data={FinelPrewData} />
    }</div>
  )
}

function FieldItem({
  label,
  value,
  editable,
  onChange,
}: {
  label: string;
  value?: string;
  editable: boolean;
  onChange: (val: string) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-gray-800  font-bold text-md mb-1">{label}</label>
      {editable ? (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label}`}
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
      ) : (
        <p className="text-gray-800 min-h-[24px]">{value || "Unfilled"}</p>
      )}
    </div>
  );
}



export function CheckboxGroup({
  label,
  options,
  selected,
  editable,
  onChange,
  multiple = false,
}: {
  label: string;
  options: string[];
  selected: any;
  editable: boolean;
  onChange: (val: any) => void;
  multiple?: boolean;
}) {
  const [otherValue, setOtherValue] = useState("");

  // Initialize otherValue if selected contains a custom value
  useEffect(() => {
    if (multiple) {
      const otherItem = Array.isArray(selected)
        ? selected.find((s) => !options.includes(s))
        : null;
      setOtherValue(otherItem || "");
    } else {
      if (selected && !options.includes(selected)) {
        setOtherValue(selected);
      }
    }
  }, [selected, options, multiple]);

  const handleSelect = (option: string) => {
    if (multiple) {
      const current = Array.isArray(selected) ? selected.filter((x) => x !== "Other" && !otherValue.includes(x)) : [];
      if ((selected || []).includes(option)) {
        onChange(current.filter((x) => x !== option));
        if (option === "Other") setOtherValue("");
      } else {
        onChange([...current, option]);
      }
    } else {
      onChange(option);
      if (option !== "Other") setOtherValue("");
    }
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherValue(value);

    if (multiple) {
      // Replace 'Other' with typed value
      const current = (selected || []).filter((x:any) => x !== "Other" && x !== otherValue);
      onChange(value ? [...current, value] : current);
    } else {
      onChange(value);
    }
  };

  const isOtherSelected = multiple
    ? Array.isArray(selected) && (selected.includes("Other") || selected.some((v) => v === otherValue))
    : selected === "Other" || (selected && !options.includes(selected));

  return (
    <div className="mb-3">
      <label className="block text-gray-800  font-bold text-md mb-1">{label}</label>
      {editable ? (
        <div className="flex gap-4 flex-wrap">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-1 text-gray-700">
              <input
                type="checkbox"
                checked={
                  multiple
                    ? Array.isArray(selected) && selected.includes(opt)
                    : selected === opt
                }
                onChange={() => handleSelect(opt)}
              />
              {opt}
            </label>
          ))}

        
          {isOtherSelected && (
            <input
              type="text"
              className="border rounded px-2 py-1"
              placeholder="Please specify..."
              value={otherValue}
              onChange={handleOtherChange}
            />
          )}
        </div>
      ) : (
        <p className="text-gray-800 min-h-[24px]">
          {multiple
            ? Array.isArray(selected) && selected.length > 0
              ? selected.join(", ")
              : "—"
            : selected || "—"}
        </p>
      )}
    </div>
  );
}