"use client";

import { useCallback, useState } from "react";
import { Upload, User, CalendarDays, Droplet, Building2, Contact } from "lucide-react";
import { useRouter } from "next/navigation";
import { Departments, IndianStates, JobTitles } from "@/Lib/Content";
import { PostEmployInfo } from "@/Lib/user.action";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
const initialEmployeeForm = {

  Name: "",
  Email: "",
  Contact: "",
  BloodGroup: "",
  JoiningDate: "",
  JobTitile:'',
  Department: "",

 
  FatherName: "",
  FatherContact: "",
  EmergencyName: "",
  EmergencyContact: "",

  Aadhar: "",
  PAN: "",
  BankName: "",
  AccountNumber: "",
  IFSC: "",
  BankAddress: "",


  Address: {
    house: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  },


  Password: "",
  ConfirmPassword: "",

  AadharDoc: null,
  PanDoc: null,
  BankDoc: null,
  AgreementDoc: null,
};


export default function EmployRegistration() {
 const [EmployeeForm, setEmployeeForm] = useState(initialEmployeeForm);

  const [StatusMessage, setStatusMessage] = useState<any>("")
  const [ShowDepartment,setShowDepartment]=useState<any>("")
  const [ShowJobTitile,setShowJobTitile]=useState<any>('')
  const Router = useRouter()
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

 const RegisterEmploy = async () => {
  if (!passwordRegex.test(EmployeeForm.Password)) {
    setStatusMessage("Password does not meet security requirements");
    return;
  }

  if (EmployeeForm.Password !== EmployeeForm.ConfirmPassword) {
    setStatusMessage("Passwords do not match");
    return;
  }

  try {
    setStatusMessage("Please wait, registering employee...");
    const UserId=uuidv4()
    const ComplitetInfo={...EmployeeForm,UserId}
    const PostInfo = await PostEmployInfo(ComplitetInfo);
    if(PostInfo.success=== true){
setStatusMessage("Employee registered successfully");
setEmployeeForm(initialEmployeeForm)
    }
    
  } catch (err: any) {
    setStatusMessage("Registration failed. Please try again.");
  }
};


  const handleChange = (e: any) => {
    try {
      const Key = e.target.name
      const value = e.target.value
      setEmployeeForm({ ...EmployeeForm, [Key]: value })
    } catch (err: any) {

    }
  }

  const handleAddressChange = (e: any) => {
    const { name, value } = e.target;

    setEmployeeForm((prev: any) => ({
      ...prev,
      Address: {
        ...prev.Address,
        [name]: value,
      },
    }));
  };

  const handleImageChange = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatusMessage('');
        const file = e.target.files?.[0];
        const inputName = e.target.name;
        if (!file) return;
  
  
        if (file.size > 10 * 1024 * 1024) {
          alert('File too large. Max allowed is 10MB.');
          return;
        }
  
  
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg', 'application/pdf',];
        if (!allowedTypes.includes(file.type)) {
          alert('Only image or video files are allowed.');
          return;
        }
  
        const formData = new FormData();
        formData.append('file', file);
  
        try {
  
          setStatusMessage(`Please Wait ${inputName} uploading....`)
      
  
          const res = await axios.post('/api/Upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  
          setEmployeeForm((prev) => ({ ...prev, [inputName]: res.data.url }));
          setStatusMessage(`${inputName} uploaded successfully!`);
        } catch (error: any) {
          console.error('Upload failed:', error.message);
          setStatusMessage('Document upload failed!');
        } 
      },
      []
    );
const isImage = (url: string) =>
  /\.(jpg|jpeg|png|webp|gif)$/i.test(url);

  return (
    <div className=" bg-white rounded-3xl shadow-xl p-4 border border-gray-100">

      <div className="text-center mb-4">
        <h2 className="text-3xl font-extrabold text-pink-500">
          Curate Employee Registration
        </h2>
        <p className="text-teal-500 mt-2">
          Register internal employees with basic organizational details
        </p>
      </div>

      <div className="flex justify-center ">
        <label className="cursor-pointer">
          <div
            className="
    w-20 h-20
    rounded-full
    border border-gray-300
    shadow-md
    flex items-center justify-center
    overflow-hidden
    bg-white
    transition-all duration-300
    hover:border-indigo-500
    hover:shadow-lg
  "
          >
            <img
              src="/Icons/Curate-logoq.png"
              onClick={() => Router.push("/DashBoard")}
              alt="Curate Company Logo"
              className="w-14 h-14 object-contain"
            />
          </div>


        </label>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="text-sm font-medium text-gray-600">
            Employee Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              name="Name"
              onChange={handleChange}
              type="text"
              placeholder="Enter employee name"
              className="pl-10 w-full mt-1 px-4 py-2.5 rounded-xl border 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
        </div>


        <div>
          <label className="text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            name="Email"
            type="email"
            onChange={handleChange}
            placeholder="employee@company.com"
            className="w-full mt-1 px-4 py-2.5 rounded-xl border 
                       focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>


        <div >
          <label className="text-sm font-medium text-gray-600">
            Phone Number
          </label>
          <input
            type="tel"
            name="Contact"
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
            pattern="[6-9][0-9]{9}"
            inputMode="numeric"
            onChange={(e) => {

              const value = e.target.value.replace(/\D/g, "");
              handleChange({
                target: { name: "Contact", value },
              } as any);
            }}
            className="
    w-full mt-1 px-4 py-2.5
    rounded-xl
    border 
    text-sm font-medium
    focus:ring-2 focus:ring-indigo-400
    focus:border-indigo-400
    outline-none
    transition-all
  "
            required
          />
          {EmployeeForm.Contact && !/^[6-9]\d{9}$/.test(EmployeeForm.Contact) && (
            <p className="mt-1 text-xs text-red-600">
              Enter a valid Indian mobile number
            </p>
          )}

        </div>


        <div>
          <label className="text-sm font-medium text-gray-600">
            Blood Group
          </label>
          <div className="relative">
            <Droplet className="absolute left-3 top-3 w-5 h-5 text-red-400" />
            <select
              name="BloodGroup"
              onChange={handleChange}
              className="pl-10 w-full mt-1 px-4 py-2.5 rounded-xl border 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="">Select blood group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
        </div>


        <div>
          <label className="text-sm font-medium text-gray-600">
            Joining Date
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="date"
              name="JoiningDate"
              onChange={handleChange}
              className="pl-10 w-full mt-1 px-4 py-2.5 rounded-xl border 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
        </div>

  <div>
          <label className="text-sm font-medium text-gray-600">
           Job Titile
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
    name="JobTitile"
    value={ShowJobTitile ? "Other" : EmployeeForm.JobTitile}
    onChange={(e: any) => {
      const value = e.target.value;
      setShowJobTitile(value === "Other");
      if (value !== "Other") {
        setEmployeeForm({ ...EmployeeForm, JobTitile: value });
      }
    }}
    className="
      pl-10 w-full mt-1 px-4 py-2.5 rounded-xl border
      bg-white text-gray-700
      focus:ring-2 focus:ring-indigo-400 outline-none
    "
  >
  <option value="" disabled>
    Select Job Title
  </option>

  {JobTitles.map((dept) => (
    <option key={dept} value={dept}>
      {dept}
    </option>
  ))}
</select>

{ShowJobTitile&&  <input
              type="text"
              name="JobTitile"
              onChange={handleChange}
              placeholder="Ender JobTitile"
              className="pl-10 w-full mt-1 px-4 py-2.5 mt-2 rounded-xl border 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            />}
         
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">
            Department
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
    name="Department"
    value={ShowDepartment ? "Other" : EmployeeForm.Department}
    onChange={(e: any) => {
      const value = e.target.value;
      setShowDepartment(value === "Other");
      if (value !== "Other") {
        setEmployeeForm({ ...EmployeeForm, Department: value });
      }
    }}
    className="
      pl-10 w-full mt-1 px-4 py-2.5 rounded-xl border
      bg-white text-gray-700
      focus:ring-2 focus:ring-indigo-400 outline-none
    "
  >
  <option value="" disabled>
    Select Department
  </option>

  {Departments.map((dept) => (
    <option key={dept} value={dept}>
      {dept}
    </option>
  ))}
</select>

{ShowDepartment&&  <input
              type="text"
              name="Department"
              onChange={handleChange}
              placeholder="Ender Department"
              className="pl-10 w-full mt-1 px-4 py-2.5 mt-2 rounded-xl border 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            />}
         
          </div>
        </div>
      </div>

<div className="mt-8">
  <h3 className="text-lg font-semibold text-gray-700 mb-4">
    Family & Emergency Details
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      type="text"
      name="FatherName"
      onChange={handleChange}
      placeholder="Father Name"
      className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
    />

    <input
      type="tel"
      name="FatherContact"
      maxLength={10}
      inputMode="numeric"
      onChange={handleChange}
      placeholder="Father Contact Number"
      className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
    />

    <input
      type="text"
      name="EmergencyName"
      onChange={handleChange}
      placeholder="Emergency Contact Name"
      className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
    />

    <input
      type="tel"
      name="EmergencyContact"
      maxLength={10}
      inputMode="numeric"
      onChange={handleChange}
      placeholder="Emergency Contact Number"
      className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
    />
  </div>
</div>

<div className="mt-10">
  <h3 className="text-lg font-semibold text-gray-700 mb-4">
    Government & Bank Details
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      type="text"
      name="Aadhar"
      maxLength={12}
      inputMode="numeric"
      onChange={handleChange}
      placeholder="Aadhaar Number"
      className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
    />

    <input
      type="text"
      name="PAN"
      onChange={handleChange}
      placeholder="PAN Number"
      className="uppercase w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
    />

    <input
      type="text"
      name="BankName"
      onChange={handleChange}
      placeholder="Bank Name"
      className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
    />

    <input
      type="text"
      name="AccountNumber"
      onChange={handleChange}
      placeholder="Account Number"
      className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
    />

    <input
      type="text"
      name="IFSC"
      onChange={handleChange}
      placeholder="IFSC Code"
      className="uppercase w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
    />

    <textarea
      name="BankAddress"
      onChange={handleChange}
      placeholder="Bank Full Address"
      className="md:col-span-2 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
      rows={3}
    />
  </div>
</div>


      <div className="mt-6">
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Address
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            name="house"
            onChange={handleAddressChange}
            placeholder="House No / Street Name"
            className="w-full px-4 py-2.5 rounded-xl border 
                 focus:ring-2 focus:ring-indigo-400 outline-none"
          />


          <input
            type="text"
            name="landmark"
            onChange={handleAddressChange}
            placeholder="Landmark (Near Hospital, School, etc.)"
            className="w-full px-4 py-2.5 rounded-xl border 
                 focus:ring-2 focus:ring-indigo-400 outline-none"
          />


          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleAddressChange}
            className="w-full px-4 py-2.5 rounded-xl border 
                 focus:ring-2 focus:ring-indigo-400 outline-none"
          />


          <select
            name="state"
            onChange={handleAddressChange}
            defaultValue=""
            className="
    w-full px-4 py-2.5
    rounded-xl
    border 
    bg-white
    text-sm font-medium
    text-slate-700
    focus:ring-2 focus:ring-indigo-400
    focus:border-indigo-400
    outline-none
    transition-all
  "
            required
          >
            <option value="" disabled>
              Select State
            </option>

            {IndianStates.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>



          <input
            type="text"
            name="pincode"
            placeholder="pincode"
            onChange={handleAddressChange}
            maxLength={6}
            className="md:col-span-2 md:w-[700px] px-4 py-2.5 rounded-xl border 
                 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>
      <div className="flex gap-4">
<div className="w-full">
  <label className="text-sm font-medium   text-gray-600">
    Password
  </label>
  <input
    type="password"
    name="Password"
    onChange={handleChange}
    placeholder="Enter strong password"
    className="w-full mt-1 px-4 py-2.5 rounded-xl border
               focus:ring-2 focus:ring-indigo-400 outline-none"
  />

  {EmployeeForm.Password &&
    !passwordRegex.test(EmployeeForm.Password) && (
      <p className="mt-1 text-xs text-red-600">
        Password must contain 1 capital letter, 1 number, 1 special character
        and be at least 8 characters
      </p>
    )}
</div>
<div className="w-full">
  <label className="text-sm font-medium text-gray-600">
    Confirm Password
  </label>
  <input
    type="password"
    name="ConfirmPassword"
    onChange={handleChange}
    placeholder="Re-enter password"
    className="w-full mt-1 px-4 py-2.5 rounded-xl border
               focus:ring-2 focus:ring-indigo-400 outline-none"
  />

  {EmployeeForm.ConfirmPassword &&
    EmployeeForm.Password !== EmployeeForm.ConfirmPassword && (
      <p className="mt-1 text-xs text-red-600">
        Passwords do not match
      </p>
    )}
</div>
</div>

<div className="mt-12">
  <h3 className="text-xl font-extrabold text-gray-800 mb-2">
    Document Attachments
  </h3>
  <p className="text-sm text-gray-500 mb-6">
    Upload scanned copies (PDF / JPG / PNG)
  </p>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {[
    { label: "Aadhaar Document", name: "AadharDoc" },
    { label: "PAN Document", name: "PanDoc" },
    { label: "Bank Passbook", name: "BankDoc" },
    { label: "Agreement Document", name: "AgreementDoc" },
  ].map((doc, index) => {
    const fileUrl = EmployeeForm[doc.name as keyof typeof EmployeeForm] as string | null;

    return (
      <div
        key={doc.name}
        className="
          bg-white
          rounded-3xl
          border border-gray-200
          p-6
          shadow-sm
          hover:shadow-xl
          transition-all duration-300
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">
              {doc.label}
            </h4>
            <p className="text-xs text-gray-500">
              PDF / JPG / PNG format
            </p>
          </div>

          <div className="h-11 w-11 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-600">
            📎
          </div>
        </div>

        {/* Preview or Upload */}
        {fileUrl ? (
          <div className="flex flex-col items-center gap-3">
            {isImage(fileUrl) ? (
              <img
                src={fileUrl}
                alt={doc.label}
                className="h-32 w-full object-cover rounded-xl border"
              />
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 text-sm font-semibold underline"
              >
                View Document
              </a>
            )}

            <label className="text-xs text-indigo-600 cursor-pointer font-semibold">
              Replace File
              <input
                type="file"
                name={doc.name}
                onChange={handleImageChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <label
            className="
              flex flex-col items-center justify-center
              w-full h-36
              border-2 border-dashed border-indigo-300
              rounded-2xl
              cursor-pointer
              bg-indigo-50/40
              hover:bg-indigo-50
              transition-all
            "
          >
            <input
              type="file"
              name={doc.name}
              onChange={handleImageChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />

            <div className="text-center px-4">
              <p className="text-sm font-medium text-gray-700">
                Click to upload
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Max size 5MB
              </p>
            </div>
          </label>
        )}
      </div>
    );
  })}
</div>

</div>
    

      {StatusMessage && (
        <div className="mt-6 flex justify-center">
          <div
            className={`
        flex items-center gap-2
        rounded-xl
        px-6 py-3
        text-sm font-semibold
        shadow-sm
        transition-all duration-300

        ${StatusMessage === "Employee registered successfully"
                ? "border border-green-300 bg-green-50 text-green-700"
                : "border border-indigo-200 bg-indigo-50 text-indigo-700"
              }
      `}
          >
            <span
              className={`
          h-2.5 w-2.5 rounded-full animate-pulse
          ${StatusMessage === "Employee registered successfully"
                  ? "bg-green-500"
                  : "bg-indigo-500"
                }
        `}
            />
            <p className="text-center">{StatusMessage}</p>
          </div>
        </div>
      )}


      <div className="flex justify-center mt-8">
        <button
          onClick={RegisterEmploy}
          className="px-12 py-3 rounded-full bg-[#1392d3] text-white 
                     font-semibold shadow-lg hover:bg-indigo-700 
                     hover:scale-105 transition-all"
        >
          Register Employee
        </button>
      </div>
    </div>
  );
}
