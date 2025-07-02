'use client';

import { useState } from 'react';

export default function PatientForm() {
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    Age: '',
  });

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-4">
      {['FullName', 'Email', 'Age'].map(field => (
        <div className="flex flex-col gap-1" key={field}>
          <label className="text-xs font-semibold uppercase">{field}</label>
          <input
            type={field === 'Age' ? 'number' : 'text'}
            name={field}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            className="input-style"
          />
        </div>
      ))}

      <button
        type="button"
       
        className="primary-button"
      >
        Submit as Patient
      </button>
       <div className="text-sm text-gray-700 text-center">
        Already registered?{' '}
        <a href="/sign-in" className="text-teal-600 font-semibold hover:underline">
          Sign In
        </a>
      </div>
    </div>
  );
}
