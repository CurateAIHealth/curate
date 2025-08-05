'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Phone, User, MapPin, Landmark, Mail, Fingerprint, CalendarDays
} from "lucide-react";
import {
  PostFullRegistration,
  GetUserInformation,
  UpdateFinelVerification
} from "@/Lib/user.action";

const familyRelations: any[] = [
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Husband",
  "Wife",
  "Grandfather (Paternal)",
  "Grandmother (Paternal)",
  "Grandfather (Maternal)",
  "Grandmother (Maternal)",
  "Uncle (Paternal)",
  "Aunt (Paternal)",
  "Uncle (Maternal)",
  "Aunt (Maternal)",
  "Cousin (Male)",
  "Cousin (Female)",
  "Nephew",
  "Niece",
  "Father-in-law",
  "Mother-in-law",
  "Brother-in-law",
  "Sister-in-law",
  "Son-in-law",
  "Daughter-in-law",
  "Stepfather",
  "Stepmother",
  "Stepson",
  "Stepdaughter",
  "Godfather",
  "Godmother",
  "Legal Guardian",
  "Other",
];

function calculateAge(dobStr: string) {
  if (!dobStr) return "";
  const today = new Date();
  const dob = new Date(dobStr);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 ? age.toString() : "";
}

export default function PatientForm() {
  const router = useRouter();
  const [statusMessage, setstatusMessage] = useState("");
  const [form, setForm] = useState({
    phoneNo1: "",
    patientFullName: "",
    dateOfBirth: "",
    age: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
    emailId: "",
    clientAadharNo: "",
    clientRelationToPatient: "",
    alternativeClientContact: "",
    modeOfPay: "",
    registrationRs: "",
    advancePaidRs: "",
    serviceType: "",
    perDayChargeRs: "",
    invoiceCycle: "",
    patientAadharNumber: "",
    stayIn: false,
    longDay: false,
    longNight: false,
    serviceStartDate: "",
    serviceEndDate: "",
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [ageWarning, setAgeWarning] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      const userId = localStorage.getItem("UserId");
      if (!userId) return;
      try {
        const data = await GetUserInformation(userId);
        setForm((prev) => ({
          ...prev,
          patientFullName: data.FirstName || "",
          dateOfBirth: data.dateofBirth || "",
          phoneNo1: data.ContactNumber || "",
          emailId: data.Email || "",
          clientAadharNo: data.AadharNumber || "",
          city: data.Location || "",
        }));
      } catch (e) {}
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    if (form.dateOfBirth) {
      const calculatedAge = calculateAge(form.dateOfBirth);
      setForm((prev) => ({ ...prev, age: calculatedAge }));
      if (calculatedAge !== "" && Number(calculatedAge) < 18) {
        setAgeWarning("Warning: Patient is under 18 years old.");
      } else {
        setAgeWarning("");
      }
    } else {
      setForm((prev) => ({ ...prev, age: "" }));
      setAgeWarning("");
    }
  }, [form.dateOfBirth]);

const handleChange = useCallback((e: any) => {
  const { name, value, type, checked } = e.target;

  let updatedValue: any = value;
  if (type === "checkbox") {
    updatedValue = checked;
  }


  if (["stayIn", "longDay", "longNight"].includes(name)) {
    setForm((prev) => ({
      ...prev,
      stayIn: false,
      longDay: false,
      longNight: false,
      [name]: checked,
    }));
  } else {
    setForm((prev) => ({ ...prev, [name]: updatedValue }));
  }


  setErrors((prevErrors) => {
    const newErrors = { ...prevErrors };
    switch (name) {
      case "phoneNo1":
        if (/^\d{10}$/.test(updatedValue)) delete newErrors.phoneNo1;
        break;
      case "patientFullName":
        if (updatedValue.trim()) delete newErrors.patientFullName;
        break;
      case "city":
        if (updatedValue.trim()) delete newErrors.city;
        break;
      case "pinCode":
        if (/^\d{6}$/.test(updatedValue)) delete newErrors.pinCode;
        break;
      case "serviceType":
        if (updatedValue) delete newErrors.serviceType;
        break;
      case "modeOfPay":
        if (updatedValue) delete newErrors.modeOfPay;
        break;
      case "registrationRs":
        if (updatedValue) delete newErrors.registrationRs;
        break;
      case "advancePaidRs":
        if (updatedValue) delete newErrors.advancePaidRs;
        break;
         case "perDayChargeRs":
        if (updatedValue) delete newErrors.invoiceCycle;
        break;
      case "invoiceCycle":
        if (updatedValue) delete newErrors.invoiceCycle;
        break;
      case "patientAadharNumber":
        if (/^\d{12}$/.test(updatedValue)) delete newErrors.patientAadharNumber;
        break;
      case "clientAadharNo":
        if (/^\d{12}$/.test(updatedValue)) delete newErrors.clientAadharNo;
        break;
      case "serviceStartDate":
        if (updatedValue) delete newErrors.serviceStartDate;
        break;
      default:
        break;
    }

   
    if (["stayIn", "longDay", "longNight"].includes(name)) {
      if (name === "stayIn" && checked || name === "longDay" && checked || name === "longNight" && checked) {
        delete newErrors.stayDuration;
      }
    }

    return newErrors;
  });

 
  setstatusMessage("");
}, []);


  const validateForm = () => {
    const newErr: { [k: string]: string } = {};
    if (!form.phoneNo1.match(/^\d{10}$/)) newErr.phoneNo1 = "Enter 10 digit phone number";
    if (!form.patientFullName) newErr.patientFullName = "Enter name";
    if (!form.city) newErr.city = "Required";
    if (!form.pinCode.match(/^\d{6}$/)) newErr.pinCode = "6 digits";
    if (!form.serviceType) newErr.serviceType = "Select service type";
    if (!(form.stayIn || form.longDay || form.longNight)) newErr.stayDuration = "Select stay option";
    if (!form.modeOfPay) newErr.modeOfPay = "Select mode of payment";
    if (!form.registrationRs) newErr.registrationRs = "Enter registration fee";
    if (!form.advancePaidRs) newErr.advancePaidRs = "Enter advance paid";
    if (!form.invoiceCycle) newErr.invoiceCycle = "Select invoice cycle";
    if (!form.patientAadharNumber.match(/^\d{12}$/)) newErr.patientAadharNumber = "Enter valid 12-digit Aadhar";
    if (!form.clientAadharNo.match(/^\d{12}$/)) newErr.clientAadharNo = "Enter valid 12-digit Aadhar";
    if (!form.serviceStartDate) newErr.serviceStartDate = "Start date required";
    if (!form.perDayChargeRs) newErr.perDayChargeRs = "perDayChargeRs required";
   

    setErrors(newErr);
    if (Object.keys(newErr).length > 0) {
      setstatusMessage("Some Fields Missing or Invalid");
      return false;
    }
    setstatusMessage("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userId = localStorage.getItem("UserId");
    await PostFullRegistration(form);
    await UpdateFinelVerification(userId);
    setstatusMessage("Patient Details Updated Successfully");
     const Timer=setInterval(()=>{
        router.push("/HomePage")
      },1200)
      return ()=>clearInterval(Timer)
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-7xl mx-auto bg-[#f6faff] rounded-[24px] shadow-lg px-6 md:px-12 pt-8 pb-12"
      style={{ fontFamily: "inherit" }}
      noValidate
    >
      <h2 className="text-4xl md:text-5xl font-extrabold text-center flex items-center justify-center gap-2 text-[#ff1493] mb-8">
        <span role="img" aria-label="note">🧾</span>
        Patient Registration
      </h2>

      <SectionTitle>Contact Information</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <FormBox icon={<Phone />} placeholder="Phone No 1 *" name="phoneNo1" value={form.phoneNo1}
          onChange={handleChange} error={errors.phoneNo1} required />
        <FormBox icon={<User />} placeholder="Patient Full Name *" name="patientFullName" value={form.patientFullName}
          onChange={handleChange} error={errors.patientFullName} required />
        <FormBox icon={<CalendarDays />} placeholder="Date of Birth" name="dateOfBirth" value={form.dateOfBirth}
          onChange={handleChange} error={errors.dateOfBirth} type="date" label="Date of Birth" />
        <div>
          <input
            className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-300 font-medium text-gray-600 focus:outline-none placeholder-gray-400"
            type="number"
            name="age"
            value={form.age}
            disabled
            placeholder="Age *"
            aria-describedby="ageWarning"
          />
          {ageWarning && <p id="ageWarning" className="text-xs mt-1 text-yellow-600 font-semibold">{ageWarning}</p>}
          {errors.age && <span className="text-xs text-red-500">{errors.age}</span>}
        </div>
        <FormBox icon={<MapPin />} placeholder="Address *" name="address" value={form.address}
          onChange={handleChange} error={errors.address} required />
      </div>

      <SectionTitle>Personal Details</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div>
          <FormBox icon={<Landmark />} placeholder="Landmark" name="landmark" value={form.landmark}
            onChange={handleChange} error={errors.landmark} />
        </div>
       
        <FormBox placeholder="City *" name="city" value={form.city}
          onChange={handleChange} error={errors.city} required />
        <FormBox placeholder="Pin Code" name="pinCode" value={form.pinCode}
          onChange={handleChange} error={errors.pinCode} />
        <FormBox icon={<Mail />} placeholder="Email Id" name="emailId" value={form.emailId}
          onChange={handleChange} error={errors.emailId} />
        <FormBox icon={<Fingerprint />} placeholder="Client Aadhar No" name="clientAadharNo" value={form.clientAadharNo}
          onChange={handleChange} error={errors.clientAadharNo} />

        <div>
          <select
            className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-300 font-medium text-gray-600 focus:outline-none"
            name="clientRelationToPatient"
            value={form.clientRelationToPatient}
            onChange={handleChange}
          >
            <option value="">Select Client relation to patient</option>
            {familyRelations.map(r => <option key={r}>{r}</option>)}
          </select>
          {errors.clientRelationToPatient && <span className="text-xs text-red-500">{errors.clientRelationToPatient}</span>}
        </div>
        <FormBox icon={<Phone />} placeholder="Alternative Client Contact" name="alternativeClientContact" value={form.alternativeClientContact}
          onChange={handleChange} error={errors.alternativeClientContact} />
      </div>

      <SectionTitle>Service Information</SectionTitle>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
    
          <select
            className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-300 font-medium text-gray-600 focus:outline-none"
            name="serviceType"
            value={form.serviceType}
            onChange={handleChange}
            required
          >
            <option value="">Select Service Type</option>
            <option value="Health care assistant">HCA</option>
            <option value="Nurse">Nurse</option>
            <option value='Physiotherapy'>Physiotherapy</option>
          </select>
          {errors.serviceType && <span className="text-xs text-red-500">{errors.serviceType}</span>}
        </div>
        <div >
          <FormBox icon={<Fingerprint />} placeholder="Patient Aadhar Number" name="patientAadharNumber" value={form.patientAadharNumber}
            onChange={handleChange} error={errors.patientAadharNumber} />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">Stay Duration (Select One) *</label>
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="stayIn"
                checked={form.stayIn}
                onChange={handleChange}
              />
              <span>24HRS (Stay In)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="longDay"
                checked={form.longDay}
                onChange={handleChange}
              />
              <span>12hrs (Long Day)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="longNight"
                checked={form.longNight}
                onChange={handleChange}
              />
              <span>12hrs (Long Night)</span>
            </label>
          </div>
          {errors.stayDuration && <span className="text-xs text-red-500">{errors.stayDuration}</span>}
        </div>
      </div>
<SectionTitle>Service Information</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <FormBox
          icon={<CalendarDays />}
          placeholder="Service Start Date *"
          name="serviceStartDate"
          value={form.serviceStartDate}
          onChange={handleChange}
          error={errors.serviceStartDate}
          type="date"
        />
        <FormBox
          icon={<CalendarDays />}
          placeholder="Service End Date *"
          name="serviceEndDate"
          value={form.serviceEndDate}
          onChange={handleChange}
          error={errors.serviceEndDate}
          type="date"
        />
      </div>
      <SectionTitle>Payment Information</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div>
      
          <select
            className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-300 font-medium text-gray-600 focus:outline-none"
            name="modeOfPay"
            value={form.modeOfPay}
            onChange={handleChange}
          >
            <option value="">Select Payment Mode</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
          {errors.modeOfPay && <span className="text-xs text-red-500">{errors.modeOfPay}</span>}
        </div>

        <FormBox
          placeholder="Registration Fee (Rs)"
          name="registrationRs"
          value={form.registrationRs}
          onChange={handleChange}
          error={errors.registrationRs}
          type="number"
        />

           <FormBox
          placeholder="Per Day Charges"
          name="perDayChargeRs"
          value={form.perDayChargeRs}
          onChange={handleChange}
          error={errors.perDayChargeRs}
          type="number"
        />

        <FormBox
          placeholder="Advance Paid (Rs)"
          name="advancePaidRs"
          value={form.advancePaidRs}
          onChange={handleChange}
          error={errors.advancePaidRs}
          type="number"
        />

        <div>
 
          <select
            className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-300 font-medium text-gray-600 focus:outline-none"
            name="invoiceCycle"
            value={form.invoiceCycle}
            onChange={handleChange}
          >
            <option value="">Select Invoice Cycle</option>
            <option value="One Week">One Week</option>
            <option value="15 Days">15 Days</option>
            <option value="One Month">One Month</option>
          </select>
          {errors.invoiceCycle && <span className="text-xs text-red-500">{errors.invoiceCycle}</span>}
        </div>
      </div>

      <p className={`${statusMessage==="Patient Details Updated Successfully"?"text-green-800":"text-red-500"} text-center font-bold`}>{statusMessage}</p>
      <div className="text-center mt-6">
        <button type="submit" className="bg-[#ff1493] py-3 px-10 text-white font-bold rounded-xl shadow-lg hover:bg-pink-400">
          Submit Registration
        </button>
      </div>
    </form>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-bold text-[#08a5ec] my-4 mb-3 pb-1">
      {children}
    </h3>
  );
}

function FormBox({ icon, placeholder, name, value, onChange, error, type = "text", required = false, label }: {
  icon?: React.ReactNode;
  placeholder?: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  type?: string;
  required?: boolean;
  label?: string;
}) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input
        className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-300 font-medium text-gray-600 focus:outline-none placeholder-gray-400"
        style={{ paddingLeft: icon ? "2.3rem" : undefined }}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
                














































