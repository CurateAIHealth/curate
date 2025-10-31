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
import { indianFamilyRelations, LeadSources, medicalSpecializations, physioSpecializations, ClientEnquiry_Filters, PDRspecialityOptions, treatmentOptions, mobilityAids, breathingEquipments, nutritionFeeds, Allergiesoptions, mealTimings, DiabeticSpecifications, FootItems, HygineOptions, floorTypes, washroomAccessories, Vitals_Options, Mobility_excercise_Options, sampleData } from '@/Lib/Content'
import MobileMedicationSchedule from '@/Components/MedicationMobileView/page'
import MedicationSchedule from '@/Components/Medications/page'
type EditingKeys = 'PatientCardEditing' | 'ClientCardEditing'|'PatientDetails'|'AdditionalInformation'|'OtherInformation'|'EquipmentDetails'|'Hygiene'|'Medication';






type StringMap = Record<string, string>;
export default function DataCollectionForm() {

  const [showRemark, setShowRemark] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<StringMap>({});
  const [otherInputs, setOtherInputs] = useState<StringMap>({});
  const [isEditing, setIsEditing] = useState({PatientCardEditing:false,ClientCardEditing:false,PatientDetails:false,AdditionalInformation:false,OtherInformation:false,EquipmentDetails:false,Hygiene:false,Medication:false});
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


 
 const handleSave = async (Item:EditingKeys) => {
    console.log("Saving Updated Data:", formData);

    setIsEditing((prev)=>({...prev, [Item]:!prev[Item]}));
  };
  const toggleRemark = (section: any) => {
    setShowRemark((prev: any) => ({ ...prev, [section]: !prev[section] }))
  }

//   const handleSubmit = (e: any) => {
//     e.preventDefault()

//     const PreviewData: any = { ...form, Inputs: { ...otherInputs }, Medications: medications }
//     setFinelPrewData(PreviewData)
//     console.log("Submitted Data----", PreviewData.administerBy)
//    dispatch(UpdatePreviewStatus(false))
//   }
//   const addMedication = () => {
//     setMedications(prev => [...prev, { medicationName: '', dose: '', quantity: '', route: '', administerBy: '', medTime: '', reviewDate: '' }]);
//   };
//   const RemoveMedication = () => {
//     setMedications(prev => prev.slice(0, prev.length - 1))
//   }
//   const renderAddRemark = (section: any) => (
//     <div className="flex justify-end gap-2 mt-4">



//       {showRemark[section] && (

//         <textarea
//           name={`${section}Remark`}
//           placeholder="Enter your remark...."
//           className="p-2 shadow-lg border-1 text-center rounded-md  w-full text-gray-800"
//           onChange={(e) => handleOtherChange(`${section}Remark`, e.target.value)}
//         />

//       )}

//       <button type="button" onClick={() => toggleRemark(section)} className="px-2 cursor-pointer  h-8 text-center py-1 bg-green-600 text-white rounded">
//         Add Remark
//       </button>
//     </div>
//   )

// const handleNewChange = (key: string, value: any) => {
//     setFormData((prev:any) => ({ ...prev, [key]: value }));
//   };

//   const handleMedicationChange = (index: number, e: any) => {
//     const { name, value } = e.target;
//     const newMeds: any = [...medications];
//     newMeds[index][name] = value;
//     setMedications(newMeds);
//   };

  
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
                 label="Current/Previous Occupation"
                 value={formData.Current_Previous_Occupation}
                 editable={isEditing.ClientCardEditing}
                 onChange={(val) => handleChange("Current_Previous_Occupation", val)}
                
               />
               <FieldItem
                 label="Hobbies"
                 value={formData.Hobbies}
                 editable={isEditing.ClientCardEditing}
                 onChange={(val) => handleChange("Hobbies", val)}
                
               />
       
           
      
       
                 <CheckboxGroup
                 label="Relation to Patient"
                 options={indianFamilyRelations}
                 selected={formData.RelationtoPatient}
                 editable={isEditing.ClientCardEditing}
                 onChange={(val) => handleChange("RelationtoPatient", val)}
                 
               />
               
       
                 <FieldItem
                 label="Remarks"
                 value={formData.ClientCardRemarks}
                 editable={isEditing.ClientCardEditing}
                 onChange={(val) => handleChange("ClientCardRemarks", val)}
              
               />
       
              
             </div>
           </div>
       
           <div className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
              <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/health-checkup.gif' className="w-10 h-10 " />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Present Health</h2>
            </div>
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
                 label="PresentIllness"
                 value={formData.Present_Illness}
                 editable={isEditing.PatientCardEditing}
                 onChange={(val) => handleChange("Present_Illness", val)}
                
               />
             
       
               <CheckboxGroup
                 label="Speciality Areas"
                 options={PDRspecialityOptions}
                 selected={formData.Speciality_Areas}
                 editable={isEditing.PatientCardEditing}
                 onChange={(val) => handleChange("Speciality_Areas", val)}
                 
               />
        <CheckboxGroup
                 label="OnGoing Treatment"
                 options={treatmentOptions}
                 selected={formData.OnGoing_Treatment}
                 editable={isEditing.PatientCardEditing}
                 onChange={(val) => handleChange("OnGoing_Treatment", val)}
                 
               />
                <FieldItem
                 label="PresentHealthRemarks"
                 value={formData.PresentHealthRemarks}
                 editable={isEditing.PatientCardEditing}
                 onChange={(val) => handleChange("PresentHealthRemarks", val)}
              
               />
        
              
             </div>
           </div>
             {/* <div className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 md:w-[49%]">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
              <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/medical-care.gif' className="w-10 h-10 " />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Treatment</h2>
            </div>

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
                 label="OnGoing Treatment"
                 options={treatmentOptions}
                 selected={formData.OnGoing_Treatment}
                 editable={isEditing.PatientDetails}
                 onChange={(val) => handleChange("OnGoing_Treatment", val)}
                 
               />
       
    
       
               <FieldItem
                 label="Treatment Remarks"
                 value={formData.TreatmentRemarks}
                 editable={isEditing.PatientDetails}
                 onChange={(val) => handleChange("TreatmentRemarks", val)}
              
               />
       
               
              
             </div>
           </div> */}
             <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 w-full">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
               <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/wheelchair.gif' className="w-10 h-10" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Functional Assessments</h2>
            </div>
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
                 label="patientHeight (Feet's)"
                 value={formData.patientHeight}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("patientHeight", val)}
              
               />
       
       
       
                 <CheckboxGroup
                 label="Balance"
                 options={["Yes", "No","Stable"]}
                 selected={formData.Balance}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("Balance", val)}
                 
               />
                  <CheckboxGroup
                 label="History Of Fall"
                 options={["Yes", "No",]}
                 selected={formData.History_of_Fall}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("History_of_Fall", val)}
                 
               />
                  <CheckboxGroup
                 label="Hearing Loss"
                 options={["Yes", "No",]}
                 selected={formData.Hearing_Loss}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("Hearing_Loss", val)}
                 
               />
                  <CheckboxGroup
                 label="Visual Impairment"
                 options={["Yes", "No",]}
                 selected={formData.Visual_Impairment}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("Visual_Impairment", val)}
                 
               />
                <CheckboxGroup
                 label="Depression"
                 options={["Yes", "No",]}
                 selected={formData.Depression}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("Depression", val)}
                 
               />

               <CheckboxGroup
                 label="Confusion"
                 options={["Yes", "No",]}
                 selected={formData.Confusion}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("Confusion", val)}
                 
               />
                <CheckboxGroup
                 label="Frequent_Urination"
                 options={["Yes", "No",]}
                 selected={formData.Frequent_Urination}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("Frequent_Urination", val)}
                 
               />
                 <CheckboxGroup
                 label="Sleep_Issues"
                 options={["Yes", "No",]}
                 selected={formData.Sleep_Issues}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("Sleep_Issues", val)}
                 
               />
       
         <CheckboxGroup
                 label="Anxiety"
                 options={["Yes", "No",]}
                 selected={formData.Anxiety}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("Anxiety", val)}
                 
               />
       
         <CheckboxGroup
                 label="Mobility Aids"
                 options={mobilityAids}
                 selected={formData.Mobility_Aids}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("Mobility_Aids", val)}
                 
               />
       
    
       
       
               
       
                   <CheckboxGroup
                 label="Floor Type"
                 options={floorTypes}
                 selected={formData.Floor_Type}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("Floor_Type", val)}
                 
               />
               <CheckboxGroup
                 label="Washroom_Accessories"
                 options={washroomAccessories}
                 selected={formData.Washroom_Accessories}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("Washroom_Accessories", val)}
                 
               />
                 <FieldItem
                 label="FunctionalAssessmentsRemarks"
                 value={formData.FunctionalAssessmentsRemarks}
                 editable={isEditing.AdditionalInformation}
                 onChange={(val) => handleChange("FunctionalAssessmentsRemarks", val)}
              
               />
             </div>
           </div>
           <div className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 ">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
              <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/surgery-room.gif' className="w-10 h-10" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Equipment Use</h2>
            </div>

               <button
                 onClick={() => (isEditing.EquipmentDetails? handleSave('EquipmentDetails') : setIsEditing((prev)=>({...prev,EquipmentDetails:!prev.EquipmentDetails})))}
                 className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                             ${isEditing.EquipmentDetails? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
               >
                 {isEditing.EquipmentDetails ? <Save size={18} /> : <Pencil size={18} />}
                 {isEditing.EquipmentDetails ? "Save" : "Edit"}
               </button>
             </div>
       
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <CheckboxGroup
                 label="Breathing Equipment"
                 options={breathingEquipments}
                 selected={formData.Breathing_Equipment}
                 editable={isEditing.EquipmentDetails}
                
                 onChange={(val) => handleChange("Breathing_Equipment", val)}
                 
               />
       
              <FieldItem
                 label="Equipment Remark"
                 value={formData.EquipmentRemark}
                 editable={isEditing.EquipmentDetails}
                 onChange={(val) => handleChange("EquipmentRemark", val)}
              
               />
       
       
      
       
            
              
             </div>
           </div>
           <div className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 ">
            <div className="flex  flex-row justify-between items-start items-center mb-6 ">
             <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/hand-washing.gif' className="w-10 h-10" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Hygiene & Elimination</h2>
            </div>

              <button
                onClick={() => (isEditing.Hygiene  ? handleSave('Hygiene') : setIsEditing((prev) => ({ ...prev, Hygiene : !prev.Hygiene  })))}
                className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                             ${isEditing.Hygiene  ? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
              >
                {isEditing.Hygiene  ? <Save size={18} /> : <Pencil size={18} />}
                {isEditing.Hygiene  ? "Save" : "Edit"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <CheckboxGroup
                label="Oral Care (Brushing & Face Fash)"
                options={['Yes','No']}
                selected={formData.Brushing_FaceFash}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("Brushing_FaceFash", val)}

              />

             <CheckboxGroup
                label="Patient Room (Cleaning)"
                options={['Yes','No']}
                selected={formData.PatientRoomCleaning}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("PatientRoomCleaning", val)}

              />
                <CheckboxGroup
                label=" Patient BathRoom (Cleaning)"
                options={['Yes','No']}
                selected={formData.PatientBathRoomCleaning}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("PatientBathRoomCleaning", val)}

              />
                 <CheckboxGroup
                label="Dressing & Grooming"
                options={['Yes','No']}
                selected={formData.Dressing_Grooming}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("Dressing_Grooming", val)}

              />
                   <CheckboxGroup
                label="Nail Care"
                options={['Yes','No']}
                selected={formData.NailCare}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("NailCare", val)}

              />     <CheckboxGroup
                label="Assisting in suctioning ?"
                options={['Yes','No']}
                selected={formData.Assisting_in_suctioning}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("Assisting_in_suctioning", val)}

              />     <CheckboxGroup
                label="Is Gloves Available ?"
                options={['Yes','No']}
                selected={formData.Gloves_Availability}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("Gloves_Availability", val)}

              />
              
              <CheckboxGroup
                label="Bed Making (Machine Wash)"
                options={HygineOptions}
                selected={formData.BedMaking}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("BedMaking", val)}

              /><CheckboxGroup
                label="Patient Clothes (Machine Wash)"
                options={HygineOptions}
                selected={formData.PatientClothes}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("PatientClothes", val)}

              />
       <CheckboxGroup
                label="Patient Bathing"
                options={["Bed Bath", "Sponge Bath", "Water Bathing"]}
                selected={formData.PatientBathing}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("PatientBathing", val)}

              />
              <CheckboxGroup
                label="Hair Wash"
                options={["Weekly Once", "Weekly Twice", "Alternate Day", "Daily"]}
                selected={formData.HairWash}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("HairWash", val)}

              />
              <CheckboxGroup
                label="is Patient Indipendent of Elimination"
                options={["Yes",'No']}
                selected={formData.Patient_Indipendent_Elimination}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("Patient_Indipendent_Elimination", val)}

              />
               <CheckboxGroup
                label="Comode"
                options={["Indian", "Western"]}
                selected={formData.Comode}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("Comode", val)}

              />
              
              {formData.Patient_Indipendent_Elimination==='No'&& <CheckboxGroup
                label="Diaper"
                options={["Yes", "No"]}
                selected={formData.Diaper}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("Diaper", val)}

              />}
               {formData.Patient_Indipendent_Elimination==='No'&& <CheckboxGroup
                label="Urine"
                options={["Bottle Collection", "Catheter", "Diaper"]}
                selected={formData.Urine}
                editable={isEditing.Hygiene}
                onChange={(val) => handleChange("Urine", val)}

              />}
              <FieldItem
                 label="Hygiene & Elimination"
                 value={formData.Eliminationremarks}
                 editable={isEditing.Hygiene}
                 onChange={(val) => handleChange("Eliminationremarks", val)}
              
               />
            </div>
          </div>
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 ">
            <div className="flex  flex-row justify-between items-start items-center mb-6 ">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <img src='Icons/nutrition-plan.gif' className="w-10 h-10 text-rose-700" />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Nutrition & Hydration</h2>
              </div>
              <button
                onClick={() => (isEditing.PatientDetails ? handleSave('PatientDetails') : setIsEditing((prev) => ({ ...prev, PatientDetails: !prev.PatientDetails })))}
                className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                             ${isEditing.PatientDetails ? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
              >
                {isEditing.PatientDetails ? <Save size={18} /> : <Pencil size={18} />}
                {isEditing.PatientDetails ? "Save" : "Edit"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <CheckboxGroup
                label="Feeding Methode"
                options={nutritionFeeds}
                selected={formData.Feeding_Method}
                editable={isEditing.PatientDetails}

                onChange={(val) => handleChange("Feeding_Method", val)}

              />

              <CheckboxGroup
                label="Hydration"
                options={["1Ltr", "2Ltr", "3Ltr", "4Ltr", "Other"]}
                selected={formData.HydrationWaterLevel}
                editable={isEditing.PatientDetails}

                onChange={(val) => handleChange("HydrationWaterLevel", val)}

              />
              {formData.HydrationWaterLevel === "Other" &&
                <FieldItem
                  label="DocterAdvisedHydrationWaterLevel"
                  value={formData.DocterAdvisedHydrationWaterLevel}
                  editable={isEditing.PatientDetails}
                  onChange={(val) => handleChange("DocterAdvisedHydrationWaterLevel", val)}

                />
              }
              <CheckboxGroup
                label="Juice"
                options={["Morning", "Afternoon", "Evening", 'Night']}
                selected={formData.Juice}
                editable={isEditing.PatientDetails}

                onChange={(val) => handleChange("Juice", val)}

              />
              <CheckboxGroup
                label="Allergies"
                options={['Yes', 'No']}
                selected={formData.Allergies}
                editable={isEditing.PatientDetails}

                onChange={(val) => handleChange("Allergies", val)}

              />

              {formData.Allergies === 'Yes' && <CheckboxGroup
                label="AllergyOption"
                options={Allergiesoptions}
                selected={formData.AllergyOption}
                editable={isEditing.PatientDetails}

                onChange={(val) => handleChange("AllergyOption", val)}

              />}

              <CheckboxGroup
                label="Diabetic"
                options={['Yes', 'No']}
                selected={formData.Doabatic}
                editable={isEditing.PatientDetails}

                onChange={(val) => handleChange("Doabatic", val)}

              />

              {formData.Doabatic === "Yes" &&
                <CheckboxGroup
                  label="DoabaticPlan"
                  options={mealTimings}
                  selected={formData.DoabaticPlan}
                  editable={isEditing.PatientDetails}

                  onChange={(val) => handleChange("DoabaticPlan", val)}

                />}

              {formData.Doabatic === "Yes" &&
                <CheckboxGroup
                  label="DiabeticSpecification"
                  options={DiabeticSpecifications}
                  selected={formData.DiabeticSpecification}
                  editable={isEditing.PatientDetails}

                  onChange={(val) => handleChange("DiabeticSpecification", val)}

                />}
              <CheckboxGroup
                label="FoodPreparation"
                options={FootItems}
                selected={formData.FoodPreparation}
                editable={isEditing.PatientDetails}

                onChange={(val) => handleChange("FoodPreparation", val)}

              />
              {formData.FoodPreparation === "OtherItem" &&
                <FieldItem
                  label="FoodPreparationInputs"
                  value={formData.FoodPreparationInputs}
                  editable={isEditing.PatientDetails}
                  onChange={(val) => handleChange("FoodPreparationInputs", val)}

                />}
              <FieldItem
                label="Nutritionremarks"
                value={formData.Nutritionremarks}
                editable={isEditing.PatientDetails}
                onChange={(val) => handleChange("Nutritionremarks", val)}

              />

            </div>
          </div>

           <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 w-full">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
             
                  <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/vital-Monitaring.png' className="w-10 h-10" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Vitals Monitoring & Mobility</h2>
            </div>
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
                
               
       
               
                   <CheckboxGroup
                     label="Temperature"
                     options={Vitals_Options}
                     selected={formData.Temperature}
                     editable={isEditing.OtherInformation}
                     onChange={(val) => handleChange("Temperature", val)}
       
                   />
                      {formData.Temperature==='Specify Time'&& <input
            type="time"
          
            placeholder="Specify time"
            className="w-[120px] h-[50px] border rounded-lg p-2 mt-2"
            value={formData.Temperature||''}
            onChange={(e) => handleChange("Temperature", e.target.value)}
          /> }
                    <CheckboxGroup
                     label="Pulse"
                     options={Vitals_Options}
                     selected={formData.Pulse}
                     editable={isEditing.OtherInformation}
                     onChange={(val) => handleChange("Pulse", val)}
       
                   />
                   {formData.Pulse==='Specify Time'&& <input
            type="time"
            placeholder="Specify time"
           className="w-[120px] h-[50px] border rounded-lg p-2 mt-2"
            value={formData.Pulse||''}
            onChange={(e) => handleChange("Pulse", e.target.value)}
          /> }
                    <CheckboxGroup
                     label="OxygenSaturation"
                     options={Vitals_Options}
                     selected={formData.OxygenSaturation}
                     editable={isEditing.OtherInformation}
                     onChange={(val) => handleChange("OxygenSaturation", val)}
       
                   />
                   {formData.OxygenSaturation==='Specify Time'&& <input
            type="time"
            placeholder="Specify time"
             className="w-[120px] h-[50px] border rounded-lg p-2 mt-2"
            value={formData.OxygenSaturation||''}
            onChange={(e) => handleChange("OxygenSaturation", e.target.value)}
          /> }
                    <CheckboxGroup
                     label="BloodPressure"
                     options={Vitals_Options}
                     selected={formData.BloodPressure}
                     editable={isEditing.OtherInformation}
                     onChange={(val) => handleChange("BloodPressure", val)}
       
                   />
          {formData.BloodPressure==='Specify Time'&& <input
            type="time"
            placeholder="Specify time"
            className="w-[120px] h-[50px] border rounded-lg p-2 mt-2"
            value={formData.BloodPressure||''}
            onChange={(e) => handleChange("BloodPressure", e.target.value)}
          /> }
           
           
              <CheckboxGroup
                     label="Passive Exercises"
                     options={Mobility_excercise_Options}
                     selected={formData.PassiveExercises}
                     editable={isEditing.OtherInformation}
                     onChange={(val) => handleChange("PassiveExercises", val)}
       
                   />
                    <CheckboxGroup
                     label="Active Exercises"
                     options={Mobility_excercise_Options}
                     selected={formData.ActiveExercises}
                     editable={isEditing.OtherInformation}
                     onChange={(val) => handleChange("ActiveExercises", val)}
       
                   />
                    <CheckboxGroup
                     label="Resisted Exercises"
                     options={Mobility_excercise_Options}
                     selected={formData.ResistedExercises}
                     editable={isEditing.OtherInformation}
                     onChange={(val) => handleChange("ResistedExercises", val)}
       
                   />
                     <CheckboxGroup
                     label="Walking"
                     options={['Yes','No']}
                     selected={formData.Walking}
                     editable={isEditing.OtherInformation}
                     onChange={(val) => handleChange("Walking", val)}
       
                   />
                     <CheckboxGroup
                     label="Assistant Requirment"
                     options={["One Assistant Required", "Two Assistants Required", "Independent"]}
                     selected={formData.AssistanceRequire}
                     editable={isEditing.OtherInformation}
                     onChange={(val) => handleChange("AssistanceRequire", val)}
       
                   />
                     <CheckboxGroup
                     label="HIV Status"
                     options={['Positive','Negative','Prefer not to disclose']}
                     selected={formData.HIV}
                     editable={isEditing.OtherInformation}
                     onChange={(val) => handleChange("HIV", val)}
       
                   />
                
                
          <FieldItem
                  label="Mobility Remarks"
                  value={formData.Mobilityremarks}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("Mobilityremarks", val)}

                />
             
             
             
              
  
               
       
              
       
                 
              
             </div>
           </div>
     <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 w-full">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
             
                <div className="flex flex-wrap items-center gap-3 mb-2">
              <img src='Icons/tablet.gif' className="w-10 h-10" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Medication List</h2>
            </div>
               <button
                 onClick={() => (isEditing.Medication? handleSave('Medication') : setIsEditing((prev)=>({...prev,Medication:!prev.Medication})))}
                 className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                             ${isEditing.Medication? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
               >
                 {isEditing.Medication ? <Save size={18} /> : <Pencil size={18} />}
                 {isEditing.Medication ? "Save" : "Edit"}
               </button>
             </div>
             {isEditing.Medication &&
            <div>< MedicationSchedule/> <MobileMedicationSchedule/></div>}
           </div>
<div className='flex flex-col gap-4 w-full'>
{formData.PhysioScore === 0 && (
  <p className="animate-blink bg-red-600 text-white text-center font-bold py-2 px-6 rounded-lg shadow-lg">
  Physio Required
</p>

)}




      
<button
  type="button"
  onClick={()=>    dispatch(UpdatePreviewStatus(false))}
  className="w-[200-px] cursor-pointer  text-center md:w-auto flex items-center justify-center gap-2 px-4 py-3 md:px-5 md:py-2 text-sm md:text-base font-medium rounded-xl shadow-sm transition-shadow duration-150
         bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg active:shadow-md
         focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 disabled:opacity-60 disabled:cursor-not-allowed"
>
  
  

  <span>Preview &amp; Submit</span>
</button>
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
            : selected || "Unfilled"}
        </p>
      )}
    </div>
  );
}