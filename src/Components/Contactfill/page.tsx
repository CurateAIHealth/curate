'use client';

import { useState } from 'react';

type Props = {
  onClose?: () => void;
};

export default function FreeConsultationForm({ onClose }: Props) {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    agree: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isVisible, setIsVisible] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Please input a phone number.';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter a valid 10-digit number.';
    }
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    if (!formData.agree) newErrors.agree = 'You must agree to the terms.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form Data:', formData);
      alert('Form submitted successfully!');
    }
  };

 

  if (!isVisible) return null;

  return (
    <div className="relative w-[85%] md:max-w-md mx-auto p-6 bg-white rounded shadow">
     
     

      <h2 className="text-2xl font-semibold mb-6 text-center">Book A Free Consultation</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="fullName"
            placeholder="Enter Your Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="mobileNumber"
            placeholder="Enter Your Mobile Number"
            maxLength={10}
            value={formData.mobileNumber}
            onChange={handleChange}
            className={`w-full border rounded px-4 py-2 ${
              errors.mobileNumber ? 'border-red-500' : ''
            }`}
          />
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4 flex items-start space-x-2">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
          />
          <label className="text-sm">
            By continuing, you agree to our Terms and Conditions and Privacy Policy.
          </label>
        </div>
        {errors.agree && (
          <p className="text-red-500 text-sm mb-2">{errors.agree}</p>
        )}

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}