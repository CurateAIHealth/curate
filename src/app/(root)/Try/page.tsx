'use client';

import { GetUserInformation } from '@/Lib/user.action';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function DoctorProfileForm() {
  const [preview, setPreview] = useState<string | null>(null);
const [ProfileName,SetProfileName]=useState("")
const [PictureUploading,setPictureUploading]=useState(false)
const [UpdateingStatus,SetUpdateingStatus]=useState(true)
const [UpdatedStatusMessage,setUpdatedStatusMessage]=useState("")
  const [form, setForm] = useState({

    title: '',
    firstName: '',
    surname: '',
    fatherName: '',
    motherName: '',
    husbandName: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    emailId: '',
    mobileNumber: '',


    aadharCardNo: '',
    panNumber: '',
    voterIdNo: '',
    rationCardNo: '',
    permanentAddress: '',
    currentAddress: '',
    cityPostcodePermanent: '',
    cityPostcodeCurrent: '',

    
    higherEducation: '',
    higherEducationYearStart: '',
    higherEducationYearEnd: '',
    professionalEducation: '',
    professionalEducationYearStart: '',
    professionalEducationYearEnd: '',
    registrationCouncil: '',
    registrationNo: '',
    professionalSkill: '',
    certifiedBy: '',
    professionalWork1: '',
    professionalWork2: '',
    experience: '',


    height: '',
    weight: '',
    hairColour: '',
    eyeColour: '',
    complexion: '',
    anyDeformity: '',
    moleBodyMark1: '',
    moleBodyMark2: '',


    reportPreviousHealthProblems: '',
    reportCurrentHealthProblems: '',


    sourceOfReferral: '',
    dateOfReferral: '',
    reference1Name: '',
    reference1Aadhar: '',
    reference1Mobile: '',
    reference1Address: '',
    reference1Relationship: '',
    reference2Name: '',
    reference2Aadhar: '',
    reference2Mobile: '',
    reference2Address: '',

    serviceHours12hrs: false,
    serviceHours24hrs: false,
    preferredService: '',
    paymentService: '',
    paymentBankName: '',
    paymentBankAccountNumber: '',
    ifscCode: '',
    bankBranchAddress: '',


    languages: '',
    type: '',
    specialties: '',
    website: '',
  });


const { serviceHours12hrs, serviceHours24hrs, ...restForm } = form;

const flatFields = Object.values(restForm).flat();
let filled = flatFields.filter((f) => {
  if (typeof f === 'string') return f && f.trim() !== '';
  return typeof f === 'boolean' ? f : false;
}).length;


if (serviceHours12hrs || serviceHours24hrs) {
  filled += 1;
}

const totalFields = flatFields.length + 1;

const completion = Math.round((filled / totalFields) * 100);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      if (name === 'serviceHours12hrs' && (e.target as HTMLInputElement).checked) {
        setForm(prev => ({ ...prev, serviceHours12hrs: true, serviceHours24hrs: false }));
      } else if (name === 'serviceHours24hrs' && (e.target as HTMLInputElement).checked) {
        setForm(prev => ({ ...prev, serviceHours24hrs: true, serviceHours12hrs: false }));
      } else {
        setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));

      if (name === 'dateOfBirth') {
        setForm(prev => ({ ...prev, [name]: value }));
        const dob = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        if (age < 18) {
          alert('⚠️ Warning: Age must be at least 18 years.');
        }
      }
    }
  };
useEffect(()=>{
 const Fetch=async()=>{
try{
   const localValue = localStorage.getItem("UserId");
    
    const ProfileInformation = await GetUserInformation(localValue)
    SetProfileName(ProfileInformation.FirstName)
setForm(prev => ({
  ...prev,
  firstName: ProfileInformation.FirstName,
  aadharCardNo:ProfileInformation.AadharNumber,
  dateOfBirth:ProfileInformation.DateOfBirth,
  emailId:ProfileInformation.Email,
 mobileNumber :ProfileInformation.ContactNumber,
 gender:ProfileInformation.Gender,
 surname:ProfileInformation.LastName


}));

}catch(err:any){

}
 }
 Fetch()
},[])
 const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  setPictureUploading(true)
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    alert("File too large. Max allowed is 10MB.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("/api/Upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
setPictureUploading(false)
    setPreview( res.data.url)
  } catch (error: any) {
    console.error("Upload failed:", error.message);
  }
};




   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
SetUpdateingStatus(false)
    const dob = new Date(form.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

    if (age < 18) {
      alert('❌ Cannot submit. Age must be at least 18 years.');
      return;
    }
if(preview===null){
  setUpdatedStatusMessage('Please Update Your Profile Picture !');
      return;
}
    if (completion !== 100) {
      alert('Please complete all required fields to update your profile!');
      return;
    }

    const FinelForm = { ...form, ProfilePic: preview };
   
    setUpdatedStatusMessage("Successfully Updated Your Information.");
     SetUpdateingStatus(true)
    console.log('Form submitted:', FinelForm);
  };

  return (
    <div className="md:min-h-[86.5vh] md:h-[86.5vh] bg-gradient-to-br from-[#f6f9fc] to-[#eef2f7] flex items-center justify-center p-6 overflow-hidden">
      <div className="max-w-5xl w-full h-full bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        <div className="bg-blue-50 relative flex flex-col items-center justify-center text-center p-8 overflow-y-auto">
          <div className="absolute w-64 h-64 rounded-full bg-blue-100 top-10 left-1/2 transform -translate-x-1/2 -z-10" />

          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md z-10">
            {PictureUploading?<p className=' text-center mt-15 text-sm'>Please Wait Updating...</p>:
            <div >{preview ? (
              <img src={preview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <img
                src='Icons/DefaultIcone.png'
                alt="Default Profile"
                className="w-full h-full object-cover"
              />
            )}</div>
            }
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-4 text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />

          <div className="mt-8">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="white"
                strokeWidth="10"
                fill="transparent"
                className="opacity-30"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="gray"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="282.6"
                strokeDashoffset={`${282.6 - (282.6 * completion) / 100}`}
                className="transition-all duration-500"
                strokeLinecap="round"
              />
              <text
                x="50"
                y="55"
                textAnchor="middle"
                fill="rgb(31 41 55)"
                fontSize="18px"
                fontWeight="bold"
                dominantBaseline="middle"
                transform="rotate(90, 50, 55)"
              >
                {completion}%
              </text>
            </svg>
            <p className="text-sm text-gray-600 mt-1">Completed</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          <h2 className="text-[#50c896] font-semibold text-2xl mb-4">{ProfileName}'s Profile Details</h2>

    
          <div className="space-y-4">
            <h3 className="text-blue-600 font-semibold text-lg">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input-field border border-gray-300 p-2 rounded-md" required />
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="input-field border border-gray-300 p-2 rounded-md" required />
              <input type="text" name="surname" value={form.surname} onChange={handleChange} placeholder="Surname" className="input-field border border-gray-300 p-2 rounded-md" required />
              <input type="text" name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father's Name" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother's Name" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="husbandName" value={form.husbandName} onChange={handleChange} placeholder="Husband's Name" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <select name="gender"  value={form.gender} onChange={handleChange} className="input-field border border-gray-300 p-2 rounded-md" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
  <input
        type="date"
        name="dateOfBirth"
        value={form.dateOfBirth}
        onChange={handleChange}
        className="input-field border p-2 rounded"
        required
      />
      {form.dateOfBirth && (
        <p className="text-sm text-gray-600">
          Age: {
            (() => {
              const dob = new Date(form.dateOfBirth);
              const today = new Date();
              let a = today.getFullYear() - dob.getFullYear();
              const m = today.getMonth() - dob.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) a--;
              return a;
            })()
          } years
        </p>
      )}
              <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className="input-field border border-gray-300 p-2 rounded-md" required>
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="email" name="emailId" value={form.emailId} onChange={handleChange} placeholder="Email ID" className="input-field border border-gray-300 p-2 rounded-md" required />
              <input type="tel" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="Mobile Number" className="input-field border border-gray-300 p-2 rounded-md" required />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-blue-600 font-semibold text-lg">Identity & Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="aadharCardNo" value={form.aadharCardNo} onChange={handleChange} placeholder="Aadhar Card No." className="input-field border border-gray-300 p-2 rounded-md" required />
              <input type="text" name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="PAN Number" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="voterIdNo" value={form.voterIdNo} onChange={handleChange} placeholder="Voter ID No." className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="rationCardNo" value={form.rationCardNo} onChange={handleChange} placeholder="Ration Card No." className="input-field border border-gray-300 p-2 rounded-md" required />
            </div>
            <textarea name="permanentAddress" value={form.permanentAddress} onChange={handleChange} placeholder="Permanent Address (Per GOVT ID)" className="input-field resize-y h-20 border border-gray-300 p-2 rounded-md" required />
            <input type="text" name="cityPostcodePermanent" value={form.cityPostcodePermanent} onChange={handleChange} placeholder="City & Postcode (Permanent)" className="input-field border border-gray-300 p-2 rounded-md" required />
            <textarea name="currentAddress" value={form.currentAddress} onChange={handleChange} placeholder="Current Address" className="input-field resize-y h-20 border border-gray-300 p-2 rounded-md" required/>
            <input type="text" name="cityPostcodeCurrent" value={form.cityPostcodeCurrent} onChange={handleChange} placeholder="City & Postcode (Current)" className="input-field border border-gray-300 p-2 rounded-md" required/>
          </div>

     
          <div className="space-y-4">
            <h3 className="text-blue-600 font-semibold text-lg">Education & Professional Experience</h3>
            <div>
              <input type="text" name="higherEducation" value={form.higherEducation} onChange={handleChange} placeholder="Higher Education" className="input-field mb-2 border border-gray-300 p-2 rounded-md" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" name="higherEducationYearStart" value={form.higherEducationYearStart} onChange={handleChange} placeholder="Higher Ed. Year Start" className="input-field border border-gray-300 p-2 rounded-md"required />
                <input type="number" name="higherEducationYearEnd" value={form.higherEducationYearEnd} onChange={handleChange} placeholder="Higher Ed. Year End" className="input-field border border-gray-300 p-2 rounded-md" required/>
              </div>
            </div>
            <div>
              <input type="text" name="professionalEducation" value={form.professionalEducation} onChange={handleChange} placeholder="Professional Education" className="input-field mb-2 border border-gray-300 p-2 rounded-md" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" name="professionalEducationYearStart" value={form.professionalEducationYearStart} onChange={handleChange} placeholder="Prof. Ed. Year Start" className="input-field border border-gray-300 p-2 rounded-md" required/>
                <input type="number" name="professionalEducationYearEnd" value={form.professionalEducationYearEnd} onChange={handleChange} placeholder="Prof. Ed. Year End" className="input-field border border-gray-300 p-2 rounded-md" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="registrationCouncil" value={form.registrationCouncil} onChange={handleChange} placeholder="Registration Council" className="input-field border border-gray-300 p-2 rounded-md" required />
              <input type="text" name="registrationNo" value={form.registrationNo} onChange={handleChange} placeholder="Registration No." className="input-field border border-gray-300 p-2 rounded-md" required />
            </div>
            <input type="text" name="professionalSkill" value={form.professionalSkill} onChange={handleChange} placeholder="Professional Skill" className="input-field border border-gray-300 p-2 rounded-md" required/>
            <input type="text" name="certifiedBy" value={form.certifiedBy} onChange={handleChange} placeholder="Certified By" className="input-field border border-gray-300 p-2 rounded-md" required/>
            <input type="text" name="professionalWork1" value={form.professionalWork1} onChange={handleChange} placeholder="Professional Work #1" className="input-field border border-gray-300 p-2 rounded-md" required/>
            <input type="text" name="professionalWork2" value={form.professionalWork2} onChange={handleChange} placeholder="Professional Work #2" className="input-field border border-gray-300 p-2 rounded-md" required/>
            <input type="text" name="experience" value={form.experience} onChange={handleChange} placeholder="Overall Experience (e.g., 10+ years)" className="input-field border border-gray-300 p-2 rounded-md" required/>
          </div>


          <div className="space-y-4">
            <h3 className="text-blue-600 font-semibold text-lg">Physical Attributes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="number" name="height" value={form.height} onChange={handleChange} placeholder="Height (Centimetres)" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="Weight (Kg)" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="hairColour" value={form.hairColour} onChange={handleChange} placeholder="Hair Colour" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="eyeColour" value={form.eyeColour} onChange={handleChange} placeholder="Eye Colour" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="complexion" value={form.complexion} onChange={handleChange} placeholder="Complexion" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="anyDeformity" value={form.anyDeformity} onChange={handleChange} placeholder="Any Deformity" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="moleBodyMark1" value={form.moleBodyMark1} onChange={handleChange} placeholder="Mole Body Mark #1" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="moleBodyMark2" value={form.moleBodyMark2} onChange={handleChange} placeholder="Mole Body Mark #2" className="input-field border border-gray-300 p-2 rounded-md" required/>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-blue-600 font-semibold text-lg">Health History</h3>
            <textarea name="reportPreviousHealthProblems" value={form.reportPreviousHealthProblems} onChange={handleChange} placeholder="Report previous health problems" className="input-field resize-y h-20 border border-gray-300 p-2 rounded-md" required/>
            <textarea name="reportCurrentHealthProblems" value={form.reportCurrentHealthProblems} onChange={handleChange} placeholder="Report current health problems" className="input-field resize-y h-20 border border-gray-300 p-2 rounded-md" required/>
          </div>

          <div className="space-y-4">
            <h3 className="text-blue-600 font-semibold text-lg">Referral Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="sourceOfReferral" value={form.sourceOfReferral} onChange={handleChange} placeholder="Source of Referral" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="date" name="dateOfReferral" value={form.dateOfReferral} onChange={handleChange} placeholder="Date of Referral" className="input-field border border-gray-300 p-2 rounded-md" required/>
            </div>

            <p className="font-medium text-gray-700 mt-4">Reference Name - I</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="reference1Name" value={form.reference1Name} onChange={handleChange} placeholder="Name" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="reference1Aadhar" value={form.reference1Aadhar} onChange={handleChange} placeholder="Aadhar Number" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="tel" name="reference1Mobile" value={form.reference1Mobile} onChange={handleChange} placeholder="Mobile Number" className="input-field border border-gray-300 p-2 rounded-md"required />
              <input type="text" name="reference1Relationship" value={form.reference1Relationship} onChange={handleChange} placeholder="Relationship" className="input-field border border-gray-300 p-2 rounded-md" required/>
            </div>
            <textarea name="reference1Address" value={form.reference1Address} onChange={handleChange} placeholder="Address" className="input-field resize-y h-20 border border-gray-300 p-2 rounded-md" required/>

            <p className="font-medium text-gray-700 mt-4">Reference Name - II</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="reference2Name" value={form.reference2Name} onChange={handleChange} placeholder="Name" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="reference2Aadhar" value={form.reference2Aadhar} onChange={handleChange} placeholder="Aadhar Number" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="tel" name="reference2Mobile" value={form.reference2Mobile} onChange={handleChange} placeholder="Mobile Number" className="input-field border border-gray-300 p-2 rounded-md" required/>
            </div>
            <textarea name="reference2Address" value={form.reference2Address} onChange={handleChange} placeholder="Address" className="input-field resize-y h-20 border border-gray-300 p-2 rounded-md" required/>
          </div>

         
          <div className="space-y-4">
            <h3 className="text-blue-600 font-semibold text-lg">Service & Payment Details</h3>
            <div className="flex flex-wrap gap-4 items-center">
                <span className="font-medium text-gray-700">Service Hours:</span>
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="serviceHours12hrs" checked={form.serviceHours12hrs} onChange={handleChange} className="form-checkbox text-blue-600 border-gray-300 rounded-md" />
                    <span>12 hrs</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="serviceHours24hrs" checked={form.serviceHours24hrs} onChange={handleChange} className="form-checkbox text-blue-600 border-gray-300 rounded-md" />
                    <span>24 hrs</span>
                </label>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                <span className="font-medium text-gray-700">Preferred Service:</span>
                <label className="flex items-center gap-2">
                    <input type="radio" name="preferredService" value="24hours" checked={form.preferredService === '24hours'} onChange={handleChange} className="form-radio text-blue-600 border-gray-300 rounded-md" required/>
                    <span>24 hours</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="radio" name="preferredService" value="12hours" checked={form.preferredService === '12hours'} onChange={handleChange} className="form-radio text-blue-600 border-gray-300 rounded-md" required/>
                    <span>12 hours</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="radio" name="preferredService" value="Both" checked={form.preferredService === 'Both'} onChange={handleChange} className="form-radio text-blue-600 border-gray-300 rounded-md" required/>
                    <span>Both</span>
                </label>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                <span className="font-medium text-gray-700">Payment of Service:</span>
                <label className="flex items-center gap-2">
                    <input type="radio" name="paymentService" value="24hours" checked={form.paymentService === '24hours'} onChange={handleChange} className="form-radio text-blue-600 border-gray-300 rounded-md" required/>
                    <span>24 hours</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="radio" name="paymentService" value="12hours" checked={form.paymentService === '12hours'} onChange={handleChange} className="form-radio text-blue-600 border-gray-300 rounded-md" required />
                    <span>12 hours</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="radio" name="paymentService" value="Both" checked={form.paymentService === 'Both'} onChange={handleChange} className="form-radio text-blue-600 border-gray-300 rounded-md" required/>
                    <span>Both</span>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="paymentBankName" value={form.paymentBankName} onChange={handleChange} placeholder="Payment Bank Name" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="paymentBankAccountNumber" value={form.paymentBankAccountNumber} onChange={handleChange} placeholder="Payment Bank Account Number" className="input-field border border-gray-300 p-2 rounded-md" required/>
              <input type="text" name="ifscCode" value={form.ifscCode} onChange={handleChange} placeholder="IFSC Code" className="input-field border border-gray-300 p-2 rounded-md" required/>
            </div>
            <textarea name="bankBranchAddress" value={form.bankBranchAddress} onChange={handleChange} placeholder="Bank Branch & Address" className="input-field resize-y h-20 border border-gray-300 p-2 rounded-md" required/>
          </div>

          
           <div className="space-y-4">
            <h3 className="text-blue-600 font-semibold text-lg">Additional Professional Details</h3>
            <input name="languages" value={form.languages} onChange={handleChange} placeholder="Languages (e.g., English, Hindi)" className="input-field border border-gray-300 p-2 rounded-md" required/>
            <input name="type" value={form.type} onChange={handleChange} placeholder="Doctor Type (e.g., General Practitioner, Specialist)" className="input-field border border-gray-300 p-2 rounded-md" required/>
            <input name="specialties" value={form.specialties} onChange={handleChange} placeholder="Specialties (e.g., Cardiology, Pediatrics)" className="input-field border border-gray-300 p-2 rounded-md" required/>
            <input name="website" value={form.website} onChange={handleChange} placeholder="Website URL" type="url" className="input-field border border-gray-300 p-2 rounded-md" required/>
           </div>

<p className={`text-center  ${UpdatedStatusMessage==='Successfully Updated Your Information.'?'text-green-800':'text-[#FF0000]'}`}>{UpdatedStatusMessage}</p>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg shadow font-semibold transition-colors duration-200
            ${completion !== 100 ? 'bg-blue-400 ' : 'bg-blue-600 hover:bg-blue-700'} text-white cursor-pointer`}
       
          >
            {UpdateingStatus?"Update Profile":"Please Wait Upating Your Profile !"}
           
          </button>
        </form>
      </div>
    </div>
  );
}