'use client';

import { UpdatePreviewStatus } from '@/Redux/action';
import { SquarePen } from 'lucide-react';
import React from 'react';
import { useDispatch } from 'react-redux';

interface Medication {
  medicationName: string;
  dose: string;
  quantity: string;
  route: string;
  administerBy: string;
}

interface PreviewData {
  Balance: string;
  Bathing: string;
  Bedding: string;
  Depression: string;
  'Frequent Urination': string;
  Grooming: string;
  'Hand Wash': string;
  'Hearing Loss': string;
  'History of Fall': string;
  'Mouth Care': string;
  'Nail Care': string;
  'Room Hygiene': string;
  'Sleep Issues': string;
  Toileting: string;
  'Visual Impairment': string;
  administerBy: string;
  bedAssistance: string;
  bedType: string;
  breathingEquipment: string;
  catheterDueDate: string;
  constipated: string;
  dietType: string;
  eliminationSupport: string;
  feedingMethod: string;
  floorFallRisk: string;
  floorType: string;
  foodAllergy: string;
  hobbies: string;
  hospitalVisits: string;
  FallTimes:String,
  hydrationDisease: string;
  hydrationStatus: string;
  mobility: string;
  mobilityAid: string;
  occupation: string;
  presentIllness: string;
  relation: string;
  remarks: string;
  speciality: string;
  treatment: string;
  washroomAccessory: string;
  Medications: Medication[];
  Inputs: {
    personalFamilyRemark: string;
  };
}

interface PreviewProps {
  data: PreviewData;
}

const InfoItem = ({ label, value }: { label: any; value: any }) => (
  <div className="flex justify-between py-1 text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
    <h2 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wide">{title}</h2>
    {children}
  </div>
);

const PreviewComponent: React.FC<PreviewProps> = ({ data }) => {
    const dispatch=useDispatch()
    const UpdateEdit=()=>{
    dispatch(UpdatePreviewStatus(true))
}
  return (
    <div className="p-6 max-w-3xl mx-auto bg-gradient-to-b from-gray-50 to-white shadow-xl rounded-xl border border-gray-200 font-sans">
      <div className="text-center border-b border-dashed border-gray-400 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-widest"> Patient Daily Routine (PDR) Preview </h1>
        
      </div>

      <Section title="Patient Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Occupation" value={data.occupation} />
          <InfoItem label="Relation" value={data.relation} />
        </div>
      </Section>

      <Section title="Basic Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Balance" value={data.Balance} />
          <InfoItem label="Bathing" value={data.Bathing} />
          <InfoItem label="Bedding" value={data.Bedding} />
          <InfoItem label="Depression" value={data.Depression} />
          <InfoItem label="Frequent Urination" value={data['Frequent Urination']} />
          <InfoItem label="Grooming" value={data.Grooming} />
          <InfoItem label="Hand Wash" value={data['Hand Wash']} />
          <InfoItem label="Hearing Loss" value={data['Hearing Loss']} />
          <InfoItem label="History of Fall" value={data['History of Fall']} />
          <InfoItem label="Fall Times" value={data["FallTimes"]}/>
          <InfoItem label="Mouth Care" value={data['Mouth Care']} />
          <InfoItem label="Nail Care" value={data['Nail Care']} />
          <InfoItem label="Room Hygiene" value={data['Room Hygiene']} />
          <InfoItem label="Sleep Issues" value={data['Sleep Issues']} />
          <InfoItem label="Toileting" value={data.Toileting} />
          <InfoItem label="Visual Impairment" value={data['Visual Impairment']} />
        </div>
      </Section>

      <Section title="Medical & Treatment">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Present Illness" value={data.presentIllness} />
          <InfoItem label="Speciality" value={data.speciality} />
          <InfoItem label="Treatment" value={data.treatment} />
          <InfoItem label="Administered By" value={data.administerBy} />
          <InfoItem label="Bed Assistance" value={data.bedAssistance} />
          <InfoItem label="Bed Type" value={data.bedType} />
          <InfoItem label="Breathing Equipment" value={data.breathingEquipment} />
          <InfoItem label="Catheter Due Date" value={data.catheterDueDate} />
          <InfoItem label="Constipated" value={data.constipated} />
          <InfoItem label="Diet Type" value={data.dietType} />
          <InfoItem label="Elimination Support" value={data.eliminationSupport} />
          <InfoItem label="Feeding Method" value={data.feedingMethod} />
          <InfoItem label="Floor Fall Risk" value={data.floorFallRisk} />
          <InfoItem label="Floor Type" value={data.floorType} />
          <InfoItem label="Food Allergy" value={data.foodAllergy} />
          <InfoItem label="Hobbies" value={data.hobbies} />
          <InfoItem label="Hospital Visits" value={data.hospitalVisits} />
          <InfoItem label="Hydration Disease" value={data.hydrationDisease} />
          <InfoItem label="Hydration Status" value={data.hydrationStatus} />
          <InfoItem label="Mobility" value={data.mobility} />
          <InfoItem label="Mobility Aid" value={data.mobilityAid} />
          <InfoItem label="Washroom Accessory" value={data.washroomAccessory} />
        </div>
      </Section>

      <Section title="Medications">
        <div className="space-y-4">
          {data.Medications.map((med, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 bg-white shadow-sm flex flex-col gap-2"
            >
              <InfoItem label="Medication Name" value={med.medicationName} />
              <InfoItem label="Dose" value={med.dose} />
              <InfoItem label="Quantity" value={med.quantity} />
              <InfoItem label="Route" value={med.route} />
            </div>
          ))}
          <InfoItem label="Administered By" value={data.administerBy} />
        </div>
      </Section>

      <Section title="Remarks">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Personal/Family Remark" value={data.Inputs.personalFamilyRemark} />
          <InfoItem label="Additional Remarks" value={data.remarks} />
        </div>
      </Section>
     <div className='flex justify-between'>
<button 
  type="button"
  onClick={UpdateEdit}
  className="flex items-center gap-2 p-2 bg-pink-600 rounded-md text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
>
  <SquarePen className="w-4 h-4" />
  <span>Edit</span>
</button>

<button className='p-1 bg-teal-600 rounded-md text-white cursor-pointer'>Submit</button>
</div>
    </div>
  );
};

export default PreviewComponent;
