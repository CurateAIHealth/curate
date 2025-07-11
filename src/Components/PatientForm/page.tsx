'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Eye, EyeOff } from 'lucide-react';
import { getPasswordStrength, isValidAadhar } from '@/Lib/Actions';
import { useRouter } from 'next/navigation';
import { UpdatePatientInformation } from '@/Lib/user.action';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';

export default function PatientForm() {
  const [formData, setFormData] = useState({
    userType: 'patient',
    FirstName: '',
    LastName: '',
    AadharNumber: '',
    Age: '',
    ContactNumber: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    Location: '',
    VerificationStatus:'Pending',
    TermsAndConditions:"Accepted"
  });
 const [CheckBoxStatus,setCheckBoxStatus]=useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [SubmissionRequest, setSubmissionRequest] = useState(true);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setStatusMessage('');
    const { name, value } = e.target;

    if (name === 'AadharNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 12);
      const formatted = digitsOnly.replace(/(.{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, AadharNumber: formatted }));
      return;
    }

    if (name === 'ContactNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, ContactNumber: digitsOnly }));
      return;
    }

    if (name === 'Age') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 3);
      setFormData(prev => ({ ...prev, Age: digitsOnly }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!isValidAadhar(formData.AadharNumber)) {
      setStatusMessage('Please enter a valid 12‑digit Aadhaar number.');
      setIsSubmitting(false);
      return;
    }

    const pwOk =
      formData.Password.length >= 8 &&
      /[A-Z]/.test(formData.Password) &&
      /[0-9]/.test(formData.Password) &&
      /[^A-Za-z0-9]/.test(formData.Password);

    if (!pwOk) {
      setStatusMessage(
        'Password must be ≥ 8 chars, include an uppercase letter, a number, and a special character.',
      );
      setIsSubmitting(false);
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setStatusMessage('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        AadharNumber: formData.AadharNumber.replace(/\s/g, ''),
        userId: uuidv4(),
      };

      const result = await UpdatePatientInformation(payload);
      if (!result.success) {
        setStatusMessage(result.message);
        setIsSubmitting(false);
        return;
      }

      const EmailComponent = () => (
        <div>
          <div style={{ textAlign: 'center' }}>
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/Icons/Curate-logo.png`}
              alt="Curate Digital AI Health"
              width="150"
            />
          </div>
          <p>Dear User,</p>
          <p>
            Thank you for registering with <strong>Curate Digital AI Health</strong>.
          </p>
          <p>
            We have received your details. Our team will review the information
            and contact you if anything else is required.
          </p>
          <p>
            For help, email <a href="mailto:support@curatedigital.ai">support@curatedigital.ai</a>.
          </p>
          <p>
            Best regards,
            <br />
            Curate Digital AI Health Team
          </p>
        </div>
      );

      const htmlComponent = ReactDOMServer.renderToString(<EmailComponent />);
      await axios.post('/api/MailSend', {
        to: formData.Email,
        subject: 'Curate Digital AI Health Registration',
        html: htmlComponent,
      });
      setStatusMessage(result.message);
      setFormData({
        userType: 'patient',
        FirstName: '',
        LastName: '',
        AadharNumber: '',
        Age: '',
        ContactNumber: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        Location: '',
        VerificationStatus:'',
        TermsAndConditions:"Accepted"
      });
      router.push('/SuccessfulRegistration');
    } catch {
      setStatusMessage('Unexpected error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const digitCount = formData.AadharNumber.replace(/\s/g, '').length;
  const phoneDigits = formData.ContactNumber.length;
  const passwordStrength = getPasswordStrength(formData.Password);
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = [
    'text-red-500',
    'text-yellow-500',
    'text-blue-500',
    'text-green-600',
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-0"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase">First Name</label>
        <input
          type="text"
          name="FirstName"
          value={formData.FirstName}
          onChange={handleChange}
          className="input-style"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase">Last Name</label>
        <input
          type="text"
          name="LastName"
          value={formData.LastName}
          onChange={handleChange}
          className="input-style"
          required
        />
      </div>

  
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase">Age</label>
        <input
          type="number"
          name="Age"
          value={formData.Age}
          onChange={handleChange}
          className="input-style"
          min={0}
          required
        />
      </div>
 <div className="flex flex-col gap-1">
       <label className="text-xs font-semibold ">DateOfBirth</label>
<input type="date" className="input-style" name="DateOfBirth"  onChange={handleChange} required />
</div>
 <div className="flex flex-col gap-1">
       <label className="text-xs font-semibold ">Select Gender</label>
         <select name="Gender" className="input-style"  onChange={handleChange} required>
            <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase">Location</label>
        <input
          type="text"
          name="Location"
          value={formData.Location}
          onChange={handleChange}
          className="input-style"
          required
        />
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-semibold uppercase">Aadhaar Number</label>
        <input
          type="text"
          name="AadharNumber"
          value={formData.AadharNumber}
          onChange={handleChange}
          maxLength={14}
          className="input-style"
          required
        />
        {digitCount > 0 && digitCount < 12 && (
          <p className="text-sm text-red-500">Aadhaar number must be 12 digits</p>
        )}
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-semibold uppercase">Contact Number</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md bg-gray-100 border border-r-0 border-gray-300 text-sm select-none">
            +91
          </span>
          <input
            type="text"
            name="ContactNumber"
            value={formData.ContactNumber}
            onChange={handleChange}
          className="border border-gray-300 w-full rounded-r-md h-8 pl-2"
            maxLength={10}
            required
            placeholder="Enter 10‑digit mobile"
          />
        </div>
        {phoneDigits > 0 && phoneDigits < 10 && (
          <p className="text-sm text-red-500">Contact number must be 10 digits</p>
        )}
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-semibold uppercase">Email</label>
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          className="input-style"
          required
        />
      </div>

      <div className="flex flex-col gap-1 md:col-span-2 relative">
        <label className="text-xs font-semibold uppercase">Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          name="Password"
          value={formData.Password}
          onChange={handleChange}
          className="input-style"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-8"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <p className={`text-sm ${strengthColor[passwordStrength - 1]}`}>
          Strength: {strengthLabel[passwordStrength - 1] || 'Too Short'}
        </p>
        <p className="text-[10px]">
          Password must contain at least 8 characters, one uppercase letter, one number, and one special character.
        </p>
      </div>

      <div className="flex flex-col gap-1 md:col-span-2 relative">
        <label className="text-xs font-semibold uppercase">Confirm Password</label>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="ConfirmPassword"
          value={formData.ConfirmPassword}
          onChange={handleChange}
          className="input-style"
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-2 top-8"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {formData.ConfirmPassword && formData.Password !== formData.ConfirmPassword && (
          <p className="text-sm text-red-500">Passwords do not match</p>
        )}
      </div>
<div className='flex gap-2'>
<input
  type="checkbox"
  className="cursor-pointer"
  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    setCheckBoxStatus(e.target.checked)
  }
/>
<p>Accept <a className='text-blue-600 cursor-pointer'href='/TermsAndConditions'>Terms&Condtions</a></p>
      </div>
      <div className="md:col-span-2 flex justify-center">
        <p
          className={`text-center font-bold w-full ${statusMessage === 'You registered successfully with Curate Digital AI' ? 'text-green-700' : 'text-[#FF0000]'}`}
        >
          {statusMessage}
        </p>
      </div>

    
       <button
  type="submit"
  disabled={!CheckBoxStatus}
  className={`primary-button md:col-span-2 ${!CheckBoxStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  {SubmissionRequest ? 'Submit as Doctor' : 'Please Wait, Registering as Doctor....'}
</button>

      <div className="md:col-span-2 flex justify-center">
        <p className="text-sm text-gray-700 text-center">
          Already registered?{' '}
          <a href="/sign-in" className="text-teal-600 font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
}
