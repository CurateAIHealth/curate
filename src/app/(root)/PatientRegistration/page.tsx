'use client';
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import {
  User, Phone, Mail, MapPin, Landmark, Fingerprint, CalendarDays,
  CreditCard, ClipboardPlus, ArrowRight, ArrowLeft
} from "lucide-react";
import axios from "axios";
import { GetUserInformation, PostFullRegistration, UpdateFinelVerification } from "@/Lib/user.action";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// --- Type Definitions ---

interface PatientFormState {
  phoneNo1: string;
  patientFullName: string;
  dateOfBirth: string;
  age: string;
  address: string;
  landmark: string;
  city: string;
  pinCode: string;
  emailId: string;
  clientAadharNo: string;
  clientRelationToPatient: string;
  alternativeClientContact: string;
  modeOfPay: string;
  registrationRs: string;
  advancePaidRs: string;
  serviceType: string;
  perDayChargeRs: string;
  invoiceCycle: string;
  patientAadharNumber: string;
  stayIn: boolean;
  longDay: boolean;
  longNight: boolean;
  serviceStartDate: string;
  stayDuration: any;
  serviceEndDate: string;
  ProfilePic: string;
}

interface CustomInputProps {
  icon?: React.ReactNode;
  label: string;
  name: keyof PatientFormState;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  type?: string;
  min?: number;
  max?: number;
  helper?: React.ReactNode;
}

interface CustomSelectProps {
  label: string;
  name: keyof PatientFormState;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  error?: string;
}

const familyRelations = [
  "Father", "Mother", "Son", "Daughter", "Brother", "Sister", "Husband", "Wife",
  "Grandfather (Paternal)", "Grandmother (Paternal)", "Grandfather (Maternal)", "Grandmother (Maternal)",
  "Uncle (Paternal)", "Aunt (Paternal)", "Uncle (Maternal)", "Aunt (Maternal)",
  "Cousin (Male)", "Cousin (Female)", "Nephew", "Niece", "Father-in-law", "Mother-in-law",
  "Brother-in-law", "Sister-in-law", "Son-in-law", "Daughter-in-law", "Stepfather", "Stepmother",
  "Stepson", "Stepdaughter", "Godfather", "Godmother", "Legal Guardian", "Other"
];

function calculateAge(dobStr: string): string {
  if (!dobStr) return "";
  const today = new Date();
  const dob = new Date(dobStr);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 0 ? age.toString() : "";
}



export default function PatientForm() {
  const DEFAULT_PROFILE_PIC = 'https://placehold.co/192x192/E2E8F0/1A202C?text=Profile';

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [form, setForm] = useState<PatientFormState>({
    phoneNo1: "",
    patientFullName: "",
    dateOfBirth: "",
    age: "",
    address: "",
    landmark: "",
    city: "",
    pinCode: "",
    emailId: "",
    clientAadharNo: "",
    clientRelationToPatient: "",
    alternativeClientContact: "",
    modeOfPay: "",
    registrationRs: "",
    advancePaidRs: "",
    serviceType: "",
    stayDuration: "",
    perDayChargeRs: "",
    invoiceCycle: "",
    patientAadharNumber: "",
    stayIn: false,
    longDay: false,
    longNight: false,
    serviceEndDate: "",
    serviceStartDate: "",
    ProfilePic: DEFAULT_PROFILE_PIC,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ageWarning, setAgeWarning] = useState<string>("");
  const [locationLoading, setLocationLoading] = useState(false);

  const Router = useRouter();
  const userId = useSelector((state: any) => state?.UserDetails);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        setUploadMessage('Please Wait Fetching  Data..');
        const data = await GetUserInformation(userId);
        setForm(prev => ({
          ...prev,
          patientFullName: data.FirstName || "",
          dateOfBirth: data.dateofBirth || "",
          phoneNo1: data.ContactNumber || "",
          emailId: data.Email || "",
          clientAadharNo: data.AadharNumber || "",
          city: data.Location || "",
        }));
        setUploadMessage('Successfully Fetched,Update with  required Information');
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (form.dateOfBirth) {
      const ageCalc = calculateAge(form.dateOfBirth);
      setForm(prev => ({ ...prev, age: ageCalc }));
      if (ageCalc !== "" && Number(ageCalc) < 18) setAgeWarning("Warning: Patient is under 18 years old.");
      else setAgeWarning("");
    } else {
      setForm(prev => ({ ...prev, age: "" }));
      setAgeWarning("");
    }
  }, [form.dateOfBirth]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    let val: string | boolean = type === "checkbox" ? checked : value;

    if (["stayIn", "longDay", "longNight"].includes(name)) {
      setForm(prev => ({
        ...prev,
        stayIn: false,
        longDay: false,
        longNight: false,
        [name]: checked,
      }));
    } else {
      setForm(prev => ({ ...prev, [name as keyof PatientFormState]: val }));
    }

    setErrors(prev => {
      const newErr = { ...prev };
      switch (name) {
        case "phoneNo1": if (/^\d{10}$/.test(value)) delete newErr.phoneNo1; break;
        case "patientFullName": if (value.trim()) delete newErr.patientFullName; break;
        case "city": if (value.trim()) delete newErr.city; break;
        case "pinCode": if (/^\d{6}$/.test(value)) delete newErr.pinCode; break;
        case "serviceType": if (value) delete newErr.serviceType; break;
        case "modeOfPay": if (value) delete newErr.modeOfPay; break;
        case "registrationRs": if (value) delete newErr.registrationRs; break;
        case "advancePaidRs": if (value) delete newErr.advancePaidRs; break;
        case "perDayChargeRs": if (value) delete newErr.perDayChargeRs; break;
        case "invoiceCycle": if (value) delete newErr.invoiceCycle; break;
        case "patientAadharNumber": if (/^\d{12}$/.test(value)) delete newErr.patientAadharNumber; break;
        case "clientAadharNo": if (/^\d{12}$/.test(value)) delete newErr.clientAadharNo; break;
        case "serviceStartDate": if (value) delete newErr.serviceStartDate; break;
      }
      if (["stayIn", "longDay", "longNight"].includes(name) && checked)
        delete newErr.stayDuration;
      return newErr;
    });
    setStatusMessage("");
  }, [form]);

 
  const handleLocationClick = async () => {
    setLocationLoading(true);
    setStatusMessage('');
    if (!window.navigator.geolocation) {
      setStatusMessage("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      return;
    }
    window.navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
          const response = await fetch(url, {
            headers: { "Accept": "application/json", "User-Agent": "yourcompany-medical-app/1.0" }
          });
          const data = await response.json();
          const address = data.display_name || "";
          if (address) {
            setForm((prev) => ({ ...prev, address }));
            setErrors((prev) => ({ ...prev, address: "" }));
          } else {
            setStatusMessage("Unable to fetch address from location.");
          }
        } catch (err) {
          setStatusMessage("Failed to obtain address.");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setStatusMessage("Could not get current location.");
        setLocationLoading(false);
      }
    );
  };

  

  const validateStep = (step: number): boolean => {
    const newErr: Record<string, string> = {};
    if (step === 0) {
      if (!form.patientFullName) newErr.patientFullName = "Enter name";
      if (!form.phoneNo1.match(/^\d{10}$/)) newErr.phoneNo1 = "Enter 10 digit phone number";
      if (!form.patientAadharNumber.match(/^\d{12}$/)) newErr.patientAadharNumber = "Enter valid 12-digit Aadhar";
    } else if (step === 1) {
      if (!form.clientAadharNo.match(/^\d{12}$/)) newErr.clientAadharNo = "Enter valid 12-digit Aadhar";
      if (!form.address) newErr.address = "Address is required";
      if (!form.city) newErr.city = "City is required";
      if (!form.pinCode.match(/^\d{6}$/)) newErr.pinCode = "6 digits";
    } else if (step === 2) {
      if (!form.serviceType) newErr.serviceType = "Select service type";
      if (!form.serviceStartDate) newErr.serviceStartDate = "Start date required";
      if (!(form.stayIn || form.longDay || form.longNight)) newErr.stayDuration = "Select stay option";
      if (!form.modeOfPay) newErr.modeOfPay = "Select mode of payment";
      if (!form.registrationRs) newErr.registrationRs = "Enter registration fee";
      if (!form.advancePaidRs) newErr.advancePaidRs = "Enter advance paid";
      if (!form.invoiceCycle) newErr.invoiceCycle = "Select invoice cycle";
      if (!form.perDayChargeRs) newErr.perDayChargeRs = "perDayChargeRs required";
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setStatusMessage("");
    } else setStatusMessage("Please fill out all required fields.");
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    setStatusMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      setStatusMessage("Please fill out all required fields.");
      return;
    }
    const finalForm = { ...form, UserId: userId, userType: "patient" };
    try {
      const PostResult = await PostFullRegistration(finalForm);
      const Result=await UpdateFinelVerification(userId);
      setStatusMessage("Patient Details Updated Successfully");
      setTimeout(() => { Router.push("/SuccessfullyRegisterd"); }, 1200);
    } catch (err) {
      setStatusMessage("Submission failed. Please try again.");
    }
  };

  const Revert = () => {
    Router.push("/AdminPage");
  };

  const handleImageChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    setUploadMessage('');
    setModalMessage('');
    const file = e.target.files?.[0];
    const inputName = e.target.name as keyof PatientFormState;
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setModalMessage('File too large. Max allowed is 10MB.');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      setModalMessage('Only image or video files are allowed.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploadMessage(`Uploading...`);
      const res = await axios.post('/api/Upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(prev => ({ ...prev, [inputName]: res.data.url }));
      setUploadMessage('Upload successful!');
    } catch {
      setUploadMessage('Upload failed!');
    }
  }, []);

  const steps = [
    { title: "Personal Details", icon: <User /> },
    { title: "Client & Address", icon: <MapPin /> },
    { title: "Service & Payment", icon: <CreditCard /> },
  ];
// const EmptyInput=form.patientAadharNumber===""||form .pinCode===''||form.city===""||form.phoneNo1===""||form.clientAadharNo===""||form.clientAadharNo==""||form.address===""||form.advancePaidRs===""||form.invoiceCycle===""||form.modeOfPay===""||form.perDayChargeRs===""||form.registrationRs===""||form.serviceStartDate===""||form.serviceType===""||(!form.longDay&&!form.longNight &&!form.stayIn)
  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] p-4 md:p-4 space-y-12">
      <div className="flex justify-between items-center mb-6 relative">
        <div className="absolute top-1/2 left-0 w-[65%] h-1 bg-gray-200 -translate-y-1/2 rounded-full">
          <div
            className="h-full bg-teal-500 transition-all duration-500 ease-in-out rounded-full"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`relative z-10 flex flex-col items-center cursor-pointer transition-all duration-300 ${
              index <= currentStep ? "text-teal-600" : "text-gray-400"
            }`}
            onClick={() => setCurrentStep(index)}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                index === currentStep ? "bg-teal-600 border-teal-600 text-white shadow-lg" : "bg-white border-gray-300"
              }`}
            >
              {step.icon}
            </div>
            <span className={`mt-2 text-center text-sm font-medium transition-colors duration-300 ${
              index <= currentStep ? "text-teal-600" : "text-gray-500"
            }`}>
              {step.title}
            </span>
          </div>
        ))}
        <div className='flex justify-end items-end cursor-pointer rounded-full'>
          <p onClick={Revert} className='bg-blue-400 text-white p-1 text-[12px] rounded-md mb-1'>Admin Dashboard →</p>
        </div>
      </div>

      <section className="space-y-8">
        {currentStep === 0 && (
          <div className="space-y-8">
            <div className="flex flex-col items-center">
              <div className="rounded-full overflow-hidden border-4 border-teal-400 ring-4 ring-teal-200 w-26 h-26 shadow-lg">
                <img
                  src={form.ProfilePic}
                  alt="Profile"
                  onError={(e) => (e.currentTarget.src = DEFAULT_PROFILE_PIC)}
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                id="profile-pic-upload"
                name="ProfilePic"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="profile-pic-upload"
                className="mt-4 cursor-pointer text-center text-[12px] bg-teal-600 text-white py-2 px-2 rounded-full font-semibold hover:bg-teal-700 transition transform hover:scale-105 shadow-md"
              >
                <span className="flex items-center gap-2 justify-center">
                  <ClipboardPlus size={20} />
                  {form.ProfilePic === DEFAULT_PROFILE_PIC ? 'Upload Profile Picture' : 'Change Profile Picture'}
                </span>
              </label>
              {uploadMessage && (
                <p className={`mt-2 text-sm font-semibold ${uploadMessage.includes('failed') ? 'text-red-500' : 'text-green-600'}`}>
                  {uploadMessage}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput label="Full Name *" icon={<User />} name="patientFullName" value={form.patientFullName} onChange={handleChange} error={errors.patientFullName} />
              <CustomInput label="Date of Birth" icon={<CalendarDays />} name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} />
              <CustomInput label="Age *" type="number" name="age" value={form.age} onChange={handleChange} error={errors.age || ageWarning} min={0} max={150} />
              <CustomInput label="Phone No 1 *" icon={<Phone />} type="tel" name="phoneNo1" value={form.phoneNo1} onChange={handleChange} error={errors.phoneNo1} />
              <CustomInput label="Email Id" icon={<Mail />} name="emailId" value={form.emailId} onChange={handleChange} error={errors.emailId} />
              <CustomInput label="Patient Aadhar Number" icon={<Fingerprint />} name="patientAadharNumber" value={form.patientAadharNumber} onChange={handleChange} error={errors.patientAadharNumber} />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Client & Address Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput label="Client Aadhar No *" icon={<Fingerprint />} name="clientAadharNo" value={form.clientAadharNo} onChange={handleChange} error={errors.clientAadharNo} />
              <CustomInput label="Alternative Client Contact" icon={<Phone />} name="alternativeClientContact" value={form.alternativeClientContact} onChange={handleChange} error={errors.alternativeClientContact} />
              <CustomSelect label="Client Relation to Patient" name="clientRelationToPatient" value={form.clientRelationToPatient} onChange={handleChange} options={familyRelations} error={errors.clientRelationToPatient} />
              <CustomInput
                label="Address *"
                icon={<MapPin />}
                name="address"
                value={form.address}
                onChange={handleChange}
                error={errors.address}
               
              />
                <span
                    onClick={handleLocationClick}
                    className="text-blue-500 underline cursor-pointer"
                    tabIndex={0}
                  >
                    {locationLoading ? "Locating..." : "Use Correct Location"}
                  </span>
              <CustomInput label="Landmark" icon={<Landmark />} name="landmark" value={form.landmark} onChange={handleChange} error={errors.landmark} />
              <CustomInput label="City *" name="city" value={form.city} onChange={handleChange} error={errors.city} />
              <CustomInput label="Pin Code *" name="pinCode" value={form.pinCode} onChange={handleChange} error={errors.pinCode} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Service & Payment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomSelect label="Service Type *" name="serviceType" value={form.serviceType} onChange={handleChange} options={["Health care assistant", "Nurse", "Physiotherapy"]} error={errors.serviceType} />
              <CustomInput label="Service Start Date *" icon={<CalendarDays />} type="date" name="serviceStartDate" value={form.serviceStartDate} onChange={handleChange} error={errors.serviceStartDate} />
              <CustomInput label="Service End Date" icon={<CalendarDays />} type="date" name="serviceEndDate" value={form.serviceEndDate} onChange={handleChange} error={errors.serviceEndDate} />
              <div className="space-y-2">
                <label className="inline-flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="stayIn"
                    checked={form.stayIn}
                    onChange={handleChange}
                    className="form-checkbox text-teal-600"
                  />
                  <span>24 Hours (Stay In)</span>
                </label>
                <label className="inline-flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="longDay"
                    checked={form.longDay}
                    onChange={handleChange}
                    className="form-checkbox text-teal-600"
                  />
                  <span>12 Hours (Long Day)</span>
                </label>
                <label className="inline-flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="longNight"
                    checked={form.longNight}
                    onChange={handleChange}
                    className="form-checkbox text-teal-600"
                  />
                  <span>12 Hours (Long Night)</span>
                </label>
                {errors.stayDuration && <p className="text-red-500 text-xs mt-1 font-medium">{errors.stayDuration}</p>}
              </div>
              <CustomInput label="Registration Fee (Rs)" type="number" name="registrationRs" value={form.registrationRs} onChange={handleChange} error={errors.registrationRs} />
              <CustomInput label="Advance Paid (Rs)" type="number" name="advancePaidRs" value={form.advancePaidRs} onChange={handleChange} error={errors.advancePaidRs} />
              <CustomInput label="Per Day Charges (Rs)" type="number" name="perDayChargeRs" value={form.perDayChargeRs} onChange={handleChange} error={errors.perDayChargeRs} />
              <CustomSelect label="Invoice Cycle" name="invoiceCycle" value={form.invoiceCycle} onChange={handleChange} options={["One Week", "15 Days", "One Month"]} error={errors.invoiceCycle} />
              <CustomSelect label="Mode of Payment" name="modeOfPay" value={form.modeOfPay} onChange={handleChange} options={["Cash", "UPI", "Card"]} error={errors.modeOfPay} />
            </div>
          </div>
        )}
      </section>
      <p className={`text-center font-semibold text-lg ${statusMessage.includes('Success') ? "text-green-700" : "text-red-600"}`}>{statusMessage}</p>

      <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
        {currentStep > 0 && (
          <button
            onClick={handlePrevStep}
            className="flex items-center gap-2 text-gray-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <ArrowLeft size={20} /> Back
          </button>
        )}
        <div className="flex-grow"></div>
        {currentStep < steps.length - 1 && (
          <button
            onClick={handleNextStep}
            className="flex items-center gap-2 bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-700 transition transform hover:scale-105 shadow-lg"
          >
            Next <ArrowRight size={20} />
          </button>
        )}
        {currentStep === steps.length - 1 && (
          <button
            onClick={handleSubmit}
           
            className={`w-[50%] ${statusMessage.includes("Please fill out all required fields.")?"bg-teal-200 hover:cursor-not-allowed":"bg-teal-600"} text-white py-4 rounded-xl font-bold text-lg  transition transform hover:scale-105 shadow-lg`}
          >
            Submit Registration
          </button>
        )}
      </div>

      {modalMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
            <p className="text-gray-800 font-semibold mb-4">{modalMessage}</p>
            <button
              onClick={() => setModalMessage("")}
              className="bg-teal-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Updated CustomInput supporting helper label ---
function CustomInput({
  icon,
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  min,
  max,
  helper
}: CustomInputProps) {
  return (
    <div className="relative group">
      <input
        id={name}
        name={name}
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        placeholder=" "
        className={`w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 peer ${
          icon ? 'pl-12' : ''
        }`}
      />
      <label
        htmlFor={name}
        className={`absolute left-4 -top-2.5 text-xs text-gray-600 bg-white px-1.5 transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-teal-600 peer-focus:text-xs ${
          icon ? 'peer-placeholder-shown:left-12' : ''
        }`}
      >
        {label}
      </label>
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-teal-600 transition-colors duration-300">{icon}</div>}
      {helper && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xs font-medium text-blue-500 hover:underline select-none" tabIndex={0}>
          {helper}
        </span>
      )}
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}


function CustomSelect({
  label,
  name,
  value,
  onChange,
  options,
  error
}: CustomSelectProps) {
  return (
    <div className="relative group">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 cursor-pointer"
      >
        <option value="" disabled hidden>{label}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l-.707.707L14.586 19H.414l5.5-5.5.707.707L10 16.586l4.293-4.293z" />
        </svg>
      </div>
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
