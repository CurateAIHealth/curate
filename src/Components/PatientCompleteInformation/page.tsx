'use client';

import { GetUserCompliteInformation, GetUserInformation, UpdateClientComplitInformation } from '@/Lib/user.action';
import axios from 'axios';
import { Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, useEffect, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Timesheet from '../TimeSheet/page';





interface FormInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const FormInput = memo(({ name, label, value, onChange, type = 'text' }: FormInputProps) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm text-gray-500 mb-1">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
));
FormInput.displayName = 'FormInput';

interface FormSelectProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}

const FormSelect = memo(({ name, label, value, onChange, options }: FormSelectProps) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm text-gray-500 mb-1">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {options.map((option: string) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
));
FormSelect.displayName = 'FormSelect';

interface StayDurationInputProps {
  stayIn: boolean;
  longDay: boolean;
  longNight: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const StayDurationInput = memo(({ stayIn, longDay, longNight, onChange }: StayDurationInputProps) => (
  <div className="flex flex-col gap-2 col-span-full">
    <div className="text-sm text-gray-700 font-semibold mb-2">
      Stay Duration (Select One) <span className="text-red-500">*</span>
    </div>
    <div className="flex items-center gap-4 flex-wrap">
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="radio"
          name="stayDuration"
          value="24HRS (Stay In)"
          checked={stayIn}
          onChange={onChange}
          className="form-radio text-blue-600"
        />
        24HRS (Stay In)
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="radio"
          name="stayDuration"
          value="12hrs (Long Day)"
          checked={longDay}
          onChange={onChange}
          className="form-radio text-blue-600"
        />
        12hrs (Long Day)
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="radio"
          name="stayDuration"
          value="12hrs (Long Night)"
          checked={longNight}
          onChange={onChange}
          className="form-radio text-blue-600"
        />
        12hrs (Long Night)
      </label>
    </div>
  </div>
));
StayDurationInput.displayName = 'StayDurationInput';


export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState<string>('Personal Information');
  const [statusMessage, setStatusMessage] = useState({ message:"", type: 'pending'} )
const NameoftheClient=useSelector((state:any)=>state.ClientName)
  const [isChecking, setIsChecking] = useState(true)
const Router=useRouter()


  const ImportedUserId = useSelector((state: any) => state.UserDetails);

  const initialFormData = {
    phoneNo1: '',
    phoneNo2: '',
    patientFullName: '',
    dateOfBirth: '',
    age: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
    emailId: '',
    clientAadharNo: '',
    clientRelationToPatient: '',
    alternativeClientContact: '',
    modeOfPay: '',
    registrationRs: '',
    advancePaidRs: '',
    serviceType: '',
    perDayChargeRs: '',
    invoiceCycle: '',
    patientAadharNumber: '',
    


    stayIn: false,
    longDay: false,
    longNight: false,
    serviceStartDate: '',
    serviceCloseDate: '',
    serviceEndDate: '',
    userType: 'patient',
    UserId: '',
    ProfilePic:'/Icons/PatientDefault.png'
  };

  const [formData, setFormData] = useState(initialFormData);
 const [LoginEmail, setLoginEmail] = useState("");
  useEffect(() => {
    const Fetch = async () => {
      try {
        const Result = await GetUserCompliteInformation(ImportedUserId);
        const FilterValue = Result?.HCAComplitInformation || {};
  const localValue = localStorage.getItem("UserId");
        const ProfileInformation = await GetUserInformation(localValue);
    console.log("Test Adhar----",FilterValue)
        setLoginEmail(ProfileInformation.Email);
        const formatDate = (dateString: string | undefined): string => {
          if (!dateString) return '';
          try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
          } catch {
            return '';
          }
        };

        setFormData(prev => ({
          ...prev,
          ProfilePic:FilterValue.ProfilePic ||FilterValue["ProfilePic"] ||'/Icons/PatientDefault.png',
          phoneNo1: FilterValue.phoneNo1 ||FilterValue["Phone No 1"] ||'',
          phoneNo2: FilterValue.phoneNo2 ||FilterValue["Phone No 2"]||'',
          dateOfBirth: formatDate(FilterValue.dateOfBirth)||formatDate(FilterValue["Date of Birth"])||'',
          patientFullName: FilterValue.patientFullName ||FilterValue["Patient Full Name"]||'',
          age: FilterValue.age || FilterValue["Age"]||'',
          emailId: FilterValue.emailId || FilterValue["Email Id"]||'',
          clientAadharNo: FilterValue.clientAadharNo || FilterValue["Client Aadhar No"]||'',
          patientAadharNumber:FilterValue["PatientAadharNumber"]||"",
          clientRelationToPatient: FilterValue.clientRelationToPatient || FilterValue["Client relation to patient"]||'',
          alternativeClientContact: FilterValue.alternativeClientContact ||FilterValue["Alternative Client Contact"]||'',
          address: FilterValue.address || FilterValue["Address"]||'',
          landmark: FilterValue.landmark || FilterValue["Landmark"]||'',
          city: FilterValue.city || FilterValue["City"]||'',
          state: FilterValue.state || FilterValue["State"]||'',
          pinCode: FilterValue.pinCode || FilterValue["Pin Code"]||'',
          serviceStartDate: formatDate(FilterValue.serviceStartDate)||formatDate(FilterValue["Service start D/M/Y"])||'',
          serviceCloseDate: formatDate(FilterValue.serviceCloseDate)||FilterValue[""]||'',
          modeOfPay: FilterValue.modeOfPay || FilterValue["Mode of Pay"]||'',
          registrationRs: FilterValue.registrationRs ||FilterValue["Registration Rs."]||'',
          advancePaidRs: FilterValue.advancePaidRs || FilterValue["Advance paid Rs."]||'',
          serviceType: FilterValue.serviceType || FilterValue["Service Type"]||'',
          perDayChargeRs: FilterValue.perDayChargeRs || FilterValue["Per day charge Rs"]||'',
          invoiceCycle: FilterValue.invoiceCycle || FilterValue["Invoice Cycle"]||'',
          stayIn: FilterValue.stayIn || FilterValue["Stay In"]||'',
          longDay: FilterValue.longDay || FilterValue["Long day"]||'',
          longNight: FilterValue.longNight || FilterValue["Long Night"]||'',
          userType: FilterValue.userType ||FilterValue["userType"]||'',
          UserId: FilterValue.UserId ||FilterValue["UserId"]||'',
          
        }));
        setIsChecking(false)
      } catch (err) {
        console.error("Failed to fetch user information", err);
      }
    };
    if (ImportedUserId) {
      Fetch();
    }
  }, [ImportedUserId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        stayIn: value === '24HRS (Stay In)',
        longDay: value === '12hrs (Long Day)',
        longNight: value === '12hrs (Long Night)',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {

    setStatusMessage((prev)=>({...prev,message:`Please Wait ${NameoftheClient} Updating Profile...`,type:""})); 
    try {

      if (LoginEmail.toLowerCase() !== "admin@curatehealth.in") {
        setStatusMessage((prev) => ({ ...prev, message: "Only Admin Can Update the Information", type: "" }))
        return
      }
      const FinelData = { ...formData, UserId: ImportedUserId, };
      const Result= await UpdateClientComplitInformation(ImportedUserId, FinelData);
      console.log('Updated Patient Data:', FinelData);
      setStatusMessage({ message: 'Changes submitted successfully!', type: 'success' });
    } catch (err: any) {
      setStatusMessage({ message: 'Error submitting changes. Please try again.', type: 'error' });
      console.error(err);
    }
  };

  const tabs: string[] = ['Personal Information', 'Address Details', 'Service & Billing','Time Sheet'];
  const blueColor = '#1392d3';
  const Revert = () => {
        Router.push("/AdminPage")
    }
     const handleImageChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
         
            setStatusMessage((prev)=>({...prev,message:""}));
          const file = e.target.files?.[0];
          const inputName = e.target.name;
          if (!file) return;
    
    
          if (file.size > 10 * 1024 * 1024) {
            alert('File too large. Max allowed is 10MB.');
            return;
          }
    
    
          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];
          if (!allowedTypes.includes(file.type)) {
            alert('Only image or video files are allowed.');
            return;
          }
    
          const formData = new FormData();
          formData.append('file', file);
    
          try {
    
         
            setStatusMessage((prev)=>({...prev,message:`Please Wait ${inputName} uploading....`}));
            
    
            const res = await axios.post('/api/Upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
    
            setFormData((prev) => ({ ...prev, [inputName]: res.data.url }));
            setStatusMessage((prev)=>({...prev,message:`${inputName} uploaded successfully!`}));
          } catch (error: any) {
            console.error('Upload failed:', error.message);
            setStatusMessage((prev)=>({...prev,message:"Profile Pic Uploded Failed"}));
          } finally {
          
          }
        },
        []
      );


    if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center font-bold">
      
      Here's the Full Scoop on {NameoftheClient}...
      
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-2 font-sans">
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-lg">
    <div className="flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div>
    <img
      src={formData.ProfilePic}
      alt="Profile"
      width={80}
      height={80}
      className="rounded-full border object-cover"
    />
      <label
                htmlFor="ProfilePic"
                className="flex items-center justify-center bg-blue-300 mt-1 h-6 text-[10px] w-23 text-white text-center  rounded-md cursor-pointer"
              >
                Update Profile 
                </label>
              <input
                id="ProfilePic"
                type="file"
                name='ProfilePic'
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
             
              />


    </div>
  </div>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-[#ff1493]" >
            {NameoftheClient} Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Edit and manage patient records</p>
        </header>
      <div className='flex justify-end items-end  cursor-pointer   rounded-full  ' >
                   <p onClick={Revert} className='bg-blue-400 text-white p-2 text-[12px] rounded-md mb-1'> Back to Admin Page </p>
                </div>
</div>
        
        <div className="flex border-b border-gray-200 mb-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-6 text-base font-medium ${activeTab === tab ? `border-b-2 border-blue-600` : 'text-gray-500'}`}
              style={{ color: activeTab === tab ? blueColor : undefined }}
            >
              {tab}
            </button>
          ))}
        </div>
        
      
        {statusMessage && (
          <div className={`p-4 mb-4 rounded-md text-sm ${statusMessage.type === 'success' && 'bg-green-100 text-green-700'}${statusMessage.message==="Only Admin Can Update the Information"&&'bg-red-600 font-semibold text-[16px] text-red-600 ' }`}>
            {statusMessage.message}
          </div>
        )}


        <div>
          {activeTab === 'Personal Information' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormInput name="patientFullName" label="Full Name" value={formData.patientFullName} onChange={handleChange} />
              <FormInput name="dateOfBirth" label="Date of Birth" value={formData.dateOfBirth} type="date" onChange={handleChange} />
              <FormInput name="age" label="Age" value={formData.age} onChange={handleChange} />
              <FormInput name="phoneNo1" label="Phone Number 1" value={formData.phoneNo1} onChange={handleChange} />

              <FormInput name="emailId" label="Email Address" value={formData.emailId} onChange={handleChange} />
              <FormInput name="clientAadharNo" label="Client Aadhar Number" value={formData.clientAadharNo} onChange={handleChange} />
              <FormInput name="patientAadharNumber" label="Patient Aadhar Number" value={formData.patientAadharNumber} onChange={handleChange} />
              <FormSelect
                name="clientRelationToPatient"
                label="Relation to Patient"
                value={formData.clientRelationToPatient}
                onChange={handleChange}
                options={['Husband', 'Wife', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister', 'Grandson', 'Granddaughter', 'Other']}
              />
              <FormInput name="alternativeClientContact" label="Alt. Client Contact" value={formData.alternativeClientContact} onChange={handleChange} />
            </div>
          )}

          {activeTab === 'Address Details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormInput name="address" label="Full Address" value={formData.address} onChange={handleChange} />
              <FormInput name="landmark" label="Landmark" value={formData.landmark} onChange={handleChange} />
              <FormInput name="city" label="City" value={formData.city} onChange={handleChange} />
           
              <FormInput name="pinCode" label="Pin Code" value={formData.pinCode} onChange={handleChange} />
            </div>
          )}

          {activeTab === 'Service & Billing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormInput name="serviceStartDate" label="Service Start Date" value={formData.serviceStartDate} onChange={handleChange} type="date" />
              <FormInput name="serviceCloseDate" label="Service Close Date" value={formData.serviceCloseDate} onChange={handleChange} type="date" />
              <FormSelect
                name="modeOfPay"
                label="Mode of Payment"
                value={formData.modeOfPay}
                onChange={handleChange}
                options={['Cash', 'UPI', 'Card']}
              />
              <FormInput name="registrationRs" label="Registration Amount" value={formData.registrationRs} onChange={handleChange} />
              <FormInput name="advancePaidRs" label="Advance Paid" value={formData.advancePaidRs} onChange={handleChange} />
              <FormSelect
                name="serviceType"
                label="Service Type"
                value={formData.serviceType}
                onChange={handleChange}
                options={['Health care assistant', 'Nurse', 'Physiotherapy']}
              />
              <FormInput name="perDayChargeRs" label="Per Day Charge" value={formData.perDayChargeRs} onChange={handleChange} />
              <FormSelect
                name="invoiceCycle"
                label="Invoice Cycle"
                value={formData.invoiceCycle}
                onChange={handleChange}
                options={['One Week', '15 Days', 'One Month']}
              />
              <StayDurationInput
                stayIn={formData.stayIn}
                longDay={formData.longDay}
                longNight={formData.longNight}
                onChange={handleChange}
              />
            </div>
          )}

          {activeTab==="Time Sheet"&&<Timesheet/>}
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={handleSubmit}
            className="px-8 py-2 cursor-pointer rounded-md font-medium text-white bg-[#50c896] shadow-md transition hover:bg-blue-700"
      
          >
            Save Changes
          </button>
      
        </div>
      </div>
    </div>
  );
}
