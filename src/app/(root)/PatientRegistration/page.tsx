"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  CalendarDays,
  Phone,
  User,
  MapPin,
  Landmark,
  IndianRupee,
  Mail,
  Fingerprint,
  CreditCard,
} from "lucide-react";
import axios from 'axios';

const familyRelations = [
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

const formatAadhar = (a: string) =>
  a.replace(/\s/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").trim();

const isValidAadhar = (a: string) => /^\d{12}$/.test(a.replace(/\s/g, ""));

const fields = [
  { label: "Phone No 1", icon: <Phone />, type: "tel", required: true },
  { label: "Phone No 2", icon: <Phone />, type: "tel", required: false },
  { label: "Patient Full Name", icon: <User />, type: "text", required: true },
  { label: "Date of Birth", type: "date", required: true },
  { label: "Age", type: "number", required: true },
  { label: "Address", icon: <MapPin />, type: "text", required: true },
  { label: "Landmark", icon: <Landmark />, type: "text", required: false },
  { label: "City", type: "text", required: true },
  { label: "State", type: "text", required: true },
  { label: "Pin Code", type: "text", required: true },
  { label: "Email Id", icon: <Mail />, type: "email", required: false },
  {
    label: "Client Aadhar No",
    icon: <Fingerprint />,
    validateAadhar: true,
    type: "text",
    required: false,
  },
  { label: "Client relation to patient", type: "dropdown", required: false },
  { label: "Alternative Client Contact", type: "tel", icon: <Phone />, required: false },
  {
    label: "Patient Aadhar Number",
    type: "text",
    icon: <Fingerprint />,
    validateAadhar: true,
    required: false,
  },
  { label: "Mode of Pay", icon: <CreditCard />, type: "text", required: true },
  { label: "Registration Rs.", type: "number", icon: <IndianRupee />, required: true },
  { label: "Advance paid Rs.", type: "number", icon: <IndianRupee />, required: false },
  { label: "Service Type", type: "text", required: true },
  { label: "Per day charge Rs", type: "number", icon: <IndianRupee />, required: true },
  { label: "Invoice Cycle", type: "text", required: true },
  { label: "Stay In", type: "text", required: true },
  { label: "Long day", type: "text", required: true },
  { label: "Long Night", type: "text", required: true },
];

export default function PatientForm() {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [updatedStatusMessage, setUpdatedStatusMessage] = useState('');
  const [pictureUploading, setPictureUploading] = useState(false);
  const [docs, setDocs] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateField = (label: string, value: string): string => {
    const fieldConfig = fields.find((f) => f.label === label);
    let error = "";

    if (fieldConfig?.required && !value.trim()) {
      return `${label} is required.`;
    }

    switch (label) {
      case "Phone No 1":
      case "Phone No 2":
      case "Alternative Client Contact":
        if (value.trim() && !/^\d{10}$/.test(value)) {
          error = "Phone number must be 10 digits.";
        }
        break;
      case "Patient Full Name":
        if (value.trim() && !/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name can only contain letters and spaces.";
        }
        break;
      case "Age":
        if (value.trim() && (!/^\d+$/.test(value) || parseInt(value) <= 0)) {
          error = "Age must be a positive number.";
        }
        break;
      case "Date of Birth":
        if (value.trim()) {
          const dobDate = new Date(value);
          if (isNaN(dobDate.getTime())) {
            error = "Invalid date format.";
          } else if (dobDate > new Date()) {
            error = "Date of Birth cannot be in the future.";
          }
        } else if (fieldConfig?.required) {
          error = `${label} is required.`;
        }
        break;
      case "Pin Code":
        if (value.trim() && !/^\d{6}$/.test(value)) {
          error = "Pin Code must be 6 digits.";
        }
        break;
      case "Email Id":
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format.";
        }
        break;
      case "Client Aadhar No":
      case "Patient Aadhar Number":
        if (value.trim() && !isValidAadhar(value)) {
          error = `${label} must be a 12-digit number.`;
        }
        break;
      case "Registration Rs.":
      case "Advance paid Rs.":
      case "Per day charge Rs":
        if (value.trim() && (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) < 0)) {
          error = `${label} must be a non-negative number.`;
        }
        break;
      case "Service start D/M/Y":
      case "Service end D/M/Y":
        if (value.trim() && isNaN(new Date(value).getTime())) {
          error = "Invalid date format.";
        }
        break;
      case "Client relation to patient":
        if (fieldConfig?.required && !value.trim()) {
          error = `${label} is required.`;
        }
        break;
      default:
        if (fieldConfig?.required && !value.trim()) {
          error = `${label} is required.`;
        }
        break;
    }
    return error;
  };

  const handleChange = (label: string, value: string) => {
    if (label === "Client Aadhar No" || label === "Patient Aadhar Number") {
      const formatted = formatAadhar(value);
      setFormData((prev) => ({ ...prev, [label]: formatted }));
      const error = validateField(label, formatted);
      setFormErrors((prev) => ({ ...prev, [label]: error }));
    } else if (label === "Date of Birth") {
      setFormData((prev) => ({ ...prev, [label]: value }));
      if (value) {
        const dob = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        setFormData((prev) => ({ ...prev, Age: age.toString() }));
        if (age < 18) {
          setFormErrors((prev) => ({ ...prev, DateOfBirthWarning: "Warning: Patient is under 18 years old." }));
        } else {
          setFormErrors((prev) => {
            const copy = { ...prev };
            delete copy.DateOfBirthWarning;
            return copy;
          });
        }
        const error = validateField(label, value);
        setFormErrors((prev) => ({ ...prev, [label]: error }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [label]: value }));
      const error = validateField(label, value);
      setFormErrors((prev) => ({ ...prev, [label]: error }));
    }
  };

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setUpdatedStatusMessage('');
      const file = e.target.files?.[0];
      const inputName = e.target.name;

      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        setUpdatedStatusMessage('File too large. Max allowed is 10MB.');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        setUpdatedStatusMessage('Only image or video files are allowed.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        setUpdatedStatusMessage(`Please wait, ${inputName} uploading....`);
        setPictureUploading(true);

        const res = await axios.post('/api/Upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setDocs((prev) => ({ ...prev, [inputName]: res.data.url }));
        setUpdatedStatusMessage(`${inputName} uploaded successfully!`);
      } catch (error: any) {
        console.error('Upload failed:', error.message);
        setUpdatedStatusMessage('Document upload failed!');
      } finally {
        setPictureUploading(false);
      }
    },
    []
  );

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    let isValid = true;
    fields.forEach((field) => {
      const value = formData[field.label] || "";
      const error = validateField(field.label, value);
      if (error) {
        newErrors[field.label] = error;
        isValid = false;
      }
    });
    const startDate = formData["Service start D/M/Y"] || "";
    const endDate = formData["Service end D/M/Y"] || "";

    if (!startDate) {
      newErrors["Service start D/M/Y"] = "Service start date is required.";
      isValid = false;
    } else if (isNaN(new Date(startDate).getTime())) {
      newErrors["Service start D/M/Y"] = "Invalid service start date.";
      isValid = false;
    }

    if (!endDate) {
      newErrors["Service end D/M/Y"] = "Service end date is required.";
      isValid = false;
    } else if (isNaN(new Date(endDate).getTime())) {
      newErrors["Service end D/M/Y"] = "Invalid service end date.";
      isValid = false;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors["Service end D/M/Y"] = "End date cannot be before start date.";
      isValid = false;
    }
    if (!docs.videoUpload) {
      setUpdatedStatusMessage("Please upload the required video file.");
      isValid = false;
    } else {
      setUpdatedStatusMessage("");
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted:", { ...formData, uploadedDocs: docs });
      alert("Form submitted successfully!");
    } else {
      console.log("Form errors:", formErrors);
    }
  };
  const steps = [
    {
      title: "Contact Information",
      content: (
        <FormGrid>
          {fields.slice(0, 6).map((field, index) => (
            <FloatingInput
              key={index}
              {...field}
              value={formData[field.label] || ""}
              onChange={handleChange}
              error={formErrors[field.label]}
              required={field.required}
            />
          ))}
          {formErrors.DateOfBirthWarning && (
            <p className="text-red-500 text-xs mt-1 ml-2">{formErrors.DateOfBirthWarning}</p>
          )}
        </FormGrid>
      ),
    },
    {
      title: "Personal Details",
      content: (
        <FormGrid>
          {fields.slice(6, 14).map((field, index) => {
            if (field.label === "Client relation to patient") {
              return (
                <DropdownInput
                  key={index}
                  label={field.label}
                  options={familyRelations}
                  value={formData[field.label] || ""}
                  onChange={handleChange}
                  error={formErrors[field.label]}
                  required={field.required}
                />
              );
            } else if (field.validateAadhar) {
              return (
                <AadharInput
                  key={index}
                  label={field.label}
                  icon={field.icon}
                  value={formData[field.label] || ""}
                  onChange={handleChange}
                  error={formErrors[field.label]}
                  required={field.required}
                />
              );
            }
            return (
              <FloatingInput
                key={index}
                {...field}
                value={formData[field.label] || ""}
                onChange={handleChange}
                error={formErrors[field.label]}
                required={field.required}
              />
            );
          })}
        </FormGrid>
      ),
    },
    {
      title: "Service Information",
      content: (
        <FormGrid>
          <DateInput
            label="Service start D/M/Y"
            value={formData["Service start D/M/Y"] || ""}
            onChange={handleChange}
            error={formErrors["Service start D/M/Y"]}
            required={true}
          />
          <DateInput
            label="Service end D/M/Y"
            value={formData["Service end D/M/Y"] || ""}
            onChange={handleChange}
            error={formErrors["Service end D/M/Y"]}
            required={true}
          />
        </FormGrid>
      ),
    },
    {
      title: "Payment Details",
      content: (
        <FormGrid>
          {fields.slice(14).map((field, index) => (
            <FloatingInput
              key={index}
              {...field}
              value={formData[field.label] || ""}
              onChange={handleChange}
              error={formErrors[field.label]}
              required={field.required}
            />
          ))}
        </FormGrid>
      ),
    },
  ];

  return (
    <div className="min-h-[86.5vh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-gradient-to-br from-[#f5faff] to-[#e3effb] dark:from-[#1c1c1e] dark:to-[#2c2c2e] rounded-3xl shadow-2xl px-2 sm:px-10 py-4 overflow-x-hidden hide-scrollbar"
        noValidate
      >
        <h2 className="md:text-3xl text-xl md:text-4xl font-bold text-center text-[#ff1493] dark:text-white mb-2">
          🧾 Patient Registration
        </h2>
        <p className="text-center">{updatedStatusMessage}</p>

        <div className="block md:hidden">
          <SectionTitle title={steps[currentStep].title} />
          {steps[currentStep].content}
          {Object.entries(formErrors).map(([key, errorMsg]) => {
            if (!errorMsg) return null;
            const currentStepChildren = React.Children.toArray(
              steps[currentStep].content.props.children
            );
            const isFieldInCurrentStep = currentStepChildren.some(
              (child: any) => child?.props?.label === key
            );

            if (isFieldInCurrentStep) {
              return (
                <p key={key} className="text-red-600 text-sm mt-2 ml-2">
                  {errorMsg}
                </p>
              );
            }
            return null;
          })}

          {currentStep === steps.length - 1 && (
            <div className="mx-auto max-w-lg rounded-xl bg-white shadow p-6 my-8">
              <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition p-8 cursor-pointer ${
                  dragActive ? "bg-blue-50 border-blue-500" : "border-gray-300"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const pseudoEvent = {
                      target: { files: e.dataTransfer.files, name: 'videoUpload' } as HTMLInputElement
                    } as React.ChangeEvent<HTMLInputElement>;
                    handleImageChange(pseudoEvent);
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                  name="videoUpload"
                />
              {docs.videoUpload ? <video src={docs.videoUpload} controls className="w-full h-full object-contain rounded-lg" /> :
                <div className="mb-2 text-gray-500 flex flex-col items-center">
                  <div className="mb-2 text-4xl">🎬</div>
                  <div>
                    Drag and drop or{" "}
                    <span
                      className="text-blue-600 font-semibold underline cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      browse for a video
                    </span>
                  </div>
            
                </div>}
                {docs.videoUpload && (
                  <div className="mt-2 text-green-700 text-sm font-medium">
                    Selected: {docs.videoUpload.split('/').pop()}
                  </div>
                )}
                {pictureUploading && <p className="text-blue-500">Uploading...</p>}
              </div>

              <div className="mt-6 text-xs text-gray-600 text-center">
                Read the Following Content While Recording Video
              </div>
              <div className="mt-4 bg-gray-100 rounded p-3 text-center text-sm font-medium">
                I hereby acknowledge that I have read, understood, and fully accept
                all the terms and conditions set forth by HCA. I agree to comply with
                these terms in their entirety.
              </div>

              {updatedStatusMessage && (
                <div className={`mt-2 text-xs ${updatedStatusMessage.includes('failed') || updatedStatusMessage.includes('too large') || updatedStatusMessage.includes('Only image or video files are allowed') ? 'text-red-600' : 'text-blue-600'}`}>
                  {updatedStatusMessage}
                </div>
              )}
            </div>
          )}
          <div className="mt-8 flex justify-between">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="text-white bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-lg"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-[#50c896] hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#50c896] hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Submit
              </button>
            )}
          </div>
        </div>

        <div className="hidden md:block">
          {steps.map((step, idx) => (
            <div key={idx}>
              <SectionTitle title={step.title} />
              {step.content}
            </div>
          ))}

          {Object.entries(formErrors).map(
            ([key, errorMsg]) =>
              errorMsg && (
                <p key={key} className="text-red-600 text-sm mt-2 ml-2">
                  {errorMsg}
                </p>
              )
          )}

          <div className="mx-auto max-w-lg rounded-xl bg-white shadow p-6 my-8">
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition p-8 cursor-pointer ${
                dragActive ? "bg-blue-50 border-blue-500" : "border-gray-300"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const pseudoEvent = {
                    target: { files: e.dataTransfer.files, name: 'videoUpload' } as HTMLInputElement
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleImageChange(pseudoEvent);
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
                name="videoUpload"
              />
              {docs.videoUpload ? <video src={docs.videoUpload} controls className="w-full h-full object-contain rounded-lg" /> :
                <div className="mb-2 text-gray-500 flex flex-col items-center">
                  <div className="mb-2 text-4xl">🎬</div>
                  <div>
                    Drag and drop or{" "}
                    <span
                      className="text-blue-600 font-semibold underline cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      browse for a video
                    </span>
                  </div>
            
                </div>}
              {docs.videoUpload && (
                <div className="mt-2 text-green-700 text-sm font-medium">
                  Selected: {docs.videoUpload.split('/').pop()}
                </div>
              )}
              {pictureUploading && <p className="text-blue-500">Uploading...</p>}
            </div>

            <div className="mt-6 text-xs text-gray-600 text-center">
              Read the Following Content While Recording Video
            </div>
            <div className="mt-4 bg-gray-100 rounded p-3 text-center text-sm font-medium">
              I hereby acknowledge that I have read, understood, and fully accept
              all the terms and conditions set forth by HCA. I agree to comply with
              these terms in their entirety.
            </div>

            {updatedStatusMessage && (
              <div className={`mt-2 text-xs ${updatedStatusMessage.includes('failed') || updatedStatusMessage.includes('too large') || updatedStatusMessage.includes('Only image or video files are allowed') ? 'text-red-600' : 'text-blue-600'}`}>
                {updatedStatusMessage}
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                className="bg-[#50c896] hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg font-medium transition-all duration-300"
              >
                Submit Registration
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-lg font-semibold text-[#1392d3] dark:text-gray-200 mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-1">
      {title}
    </h3>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">{children}</div>
  );
}

function FloatingInput({
  label,
  type = "text",
  icon,
  onChange,
  value,
  error,
  required = false,
}: {
  label: string;
  type?: string;
  icon?: React.ReactNode;
  onChange: (label: string, value: string) => void;
  value: string;
  error?: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500">{icon}</span>
      )}
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        className={`peer w-full px-3 ${
          icon ? "pl-10" : "pl-3"
        } pt-5 pb-2 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } dark:border-gray-600 bg-white dark:bg-[#2c2c2e] text-sm text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onChange={(e) => onChange(label, e.target.value)}
        required={required}
      />
      <label
        htmlFor={id}
        className={`absolute ${icon ? "left-10" : "left-3"} top-2 text-xs text-gray-500 dark:text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400 transition-all`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && <p className="text-red-600 text-xs mt-1 ml-2">{error}</p>}
    </div>
  );
}

function DropdownInput({
  label,
  options,
  onChange,
  value,
  error,
  required = false,
}: {
  label: string;
  options: string[];
  onChange: (label: string, value: string) => void;
  value: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <select
        className={`w-full px-3 pt-5 pb-2 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } dark:border-gray-600 bg-white dark:bg-[#2c2c2e] text-sm text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onChange={(e) => onChange(label, e.target.value)}
        value={value}
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <label className="absolute left-3 top-2 text-xs text-gray-500 dark:text-gray-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && <p className="text-red-600 text-xs mt-1 ml-2">{error}</p>}
    </div>
  );
}

function DateInput({
  label,
  onChange,
  value,
  error,
  required = false,
}: {
  label: string;
  onChange: (label: string, value: string) => void;
  value: string;
  error?: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="relative">
      <CalendarDays className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
      <input
        id={id}
        type="date"
        value={value}
        className={`peer w-full pl-10 pt-5 pb-2 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } dark:border-gray-600 bg-white dark:bg-[#2c2c2e] text-sm text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onChange={(e) => onChange(label, e.target.value)}
        required={required}
      />
      <label htmlFor={id} className="absolute left-10 top-2 text-xs text-gray-500 dark:text-gray-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && <p className="text-red-600 text-xs mt-1 ml-2">{error}</p>}
    </div>
  );
}

function AadharInput({
  label,
  icon,
  value,
  onChange,
  error,
  required = false,
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (label: string, value: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <FloatingInput
      label={label}
      type="text"
      icon={icon}
      value={value}
      onChange={(l, val) => onChange(l, val)}
      error={error}
      required={required}
    />
  );
}
