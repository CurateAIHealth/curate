'use client';

import { memo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Eye, EyeOff } from 'lucide-react';
import { getPasswordStrength, isValidAadhar } from '@/Lib/Actions';
import { useRouter } from 'next/navigation';
import { HCARegistration, UpdatePatientInformation } from '@/Lib/user.action';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
const StaffType=["HCA", "HCP", "HCN","HCP Vendor","Business Vendor","Institute","Individual Vendor","Other"]
export default function HealthcareAssistantForm() {
  const [formData, setFormData] = useState({
    userType: 'healthcare-assistant',
    FirstName: '',
    LastName: '',
    Gender: '',
    DateOfBirth: '',
    AadharNumber: '',
    Age: '',
    ContactNumber: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    Location: '',
    VerificationStatus: 'Success',
    TermsAndConditions: 'Accepted',
    FinelVerification:false,
    EmailVerification:false,
    CurrentStatus:"Active",
    StaffType:""
  });

  const [CheckBoxStatus, setCheckBoxStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [SubmissionRequest, setSubmissionRequest] = useState(true);
  const router = useRouter();

  const handleChange = (e:any) => {
   
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
 if (name === 'DateOfBirth') {
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      alert("You must be at least 18 years old to register.");
    }

    setFormData(prev => ({
      ...prev,
      DateOfBirth: value,
      Age: age.toString(),
    }));
    return;
  }
    if (name === 'Age') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 3);
      setFormData(prev => ({ ...prev, Age: digitsOnly }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsSubmitting(true);
 setSubmissionRequest(false)
    if (!isValidAadhar(formData.AadharNumber)) {
      setStatusMessage('Please enter a valid 12-digit Aadhaar number.');
      setIsSubmitting(false);
      return;
    }

    const pwOk =
      formData.Password.length >= 8 &&
      /[A-Z]/.test(formData.Password) &&
      /[0-9]/.test(formData.Password) &&
      /[^A-Za-z0-9]/.test(formData.Password);

    if (!pwOk) {
      setStatusMessage('Password must be ≥ 8 chars, include an uppercase letter, a number, and a special character.');
      setIsSubmitting(false);
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setStatusMessage('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
         const generatedUserId = uuidv4();
      const payload:any = {
        ...formData,
        AadharNumber: formData.AadharNumber.replace(/\s/g, ''),
        userId: generatedUserId,
      };

      const result:any = await HCARegistration(payload);
      if (!result.success) {
          setSubmissionRequest(true);
        setStatusMessage(result.message);
     
        return;
      }

  const EmailComponent = memo(({ UpdatedFilterUserId }: { UpdatedFilterUserId: string }) => (
    <div
      style={{
        maxWidth: '400px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        padding: '32px',
        boxSizing: 'border-box',
        textAlign: 'center',
        margin: '0 auto', 
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/Icons/Curate-logo.png`}
          alt="Curate Digital AI Health"
          width="150"
          style={{ display: 'block', margin: '0 auto' }}
        />
        <h2
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#1f2937',
            margin: '20px 0 10px',
          }}
        >
          Verify With {' '}
          <span style={{ color: '#ec4899' }}>Curate</span>{' '}
          <span style={{ color: '#0d9488' }}>Digital AI</span> 
        </h2>
      </div>
  
      <a
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/VerifyEmail?token=${generatedUserId}`}
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#0d9488',
          color: '#ffffff',
          fontWeight: 600,
          borderRadius: '8px',
          fontSize: '16px',
          textDecoration: 'none', 
          marginTop: '10px',
        }}
      >
      Verify Your Email
      </a>
    </div>
  ));
        const htmlComponent = ReactDOMServer.renderToString(<EmailComponent UpdatedFilterUserId={uuidv4()} />);
      // await axios.post('/api/MailSend', {
      //   to: formData.Email,
      //   subject: 'Curate Digital AI Health Email Verification',
      //   html: htmlComponent,
      // });
 setSubmissionRequest(true)
      setStatusMessage(result.message);
      setFormData({
        userType: 'healthcare-assistant',
        FirstName: '',
        LastName: '',
        Gender: '',
        DateOfBirth: '',
        AadharNumber: '',
        Age: '',
        ContactNumber: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        Location: '',
        VerificationStatus: 'Pending',
        TermsAndConditions: 'Accepted',
        FinelVerification:false,
        EmailVerification:false,
        CurrentStatus:"Active",
        StaffType:""
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
  const strengthColor = ['text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-600'];

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input name="FirstName" value={formData.FirstName||""} onChange={handleChange} placeholder="First Name" className="input-style" required />
      <input name="LastName" value={formData.LastName||""} onChange={handleChange} placeholder="Last Name" className="input-style" required />
      <select name="Gender" className="input-style" value={formData.Gender||""} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input type="date" className="input-style" name="DateOfBirth" value={formData.DateOfBirth||""} onChange={handleChange} required />

      <input name="AadharNumber" className="input-style" value={formData.AadharNumber||""} onChange={handleChange} maxLength={14} required placeholder="Aadhaar Number" />
      {digitCount > 0 && digitCount < 12 && <p className="text-red-500 text-sm">Aadhaar number must be 12 digits</p>}
      <input name="Age" className="input-style" value={formData.Age||""} onChange={handleChange} type="number" placeholder="Age" required />
      <input name="ContactNumber" className="input-style" value={formData.ContactNumber||""} onChange={handleChange} maxLength={10} placeholder="Contact Number" required />
      {phoneDigits > 0 && phoneDigits < 10 && <p className="text-red-500 text-sm">Contact number must be 10 digits</p>}
      <input name="Email" className="input-style" value={formData.Email||""} onChange={handleChange} type="email" placeholder="Email" required />
      <input name="Location" className="input-style" value={formData.Location||""} onChange={handleChange} placeholder="Location" required />
     <select
     onChange={handleChange}
     name='StaffType'
     value={formData.StaffType||""}
  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out cursor-pointer"
>
  {StaffType.map((each, index) => (
    <option key={index} className="text-gray-700">
      {each}
    </option>
  ))}
</select>

      <div className="relative">
        <input name="Password" className="input-style" type={showPassword ? 'text' : 'password'} value={formData.Password||""} onChange={handleChange} placeholder="Password" required />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
        <p className={`text-sm ${strengthColor[passwordStrength - 1]}`}>Strength: {strengthLabel[passwordStrength - 1] || 'Too Short'}</p>
      </div>
      <div className="relative">
        <input name="ConfirmPassword" className="input-style" type={showConfirmPassword ? 'text' : 'password'} value={formData.ConfirmPassword||""} onChange={handleChange} placeholder="Confirm Password" required />
        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-2">{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
        {formData.ConfirmPassword && formData.Password !== formData.ConfirmPassword && <p className="text-red-500 text-sm">Passwords do not match</p>}
      </div>
      <div className="flex items-center gap-2 md:col-span-2">
        <input type="checkbox" onChange={(e) => setCheckBoxStatus(e.target.checked)} />
        <label>Accept <a href="/TermsAndConditions" className="text-blue-600 underline">Terms & Conditions</a></label>
      </div>
      <p className={`md:col-span-2 text-center font-bold ${statusMessage.includes('successfully') ? 'text-green-700' : 'text-red-500'}`}>{statusMessage}</p>
      <button type="submit" disabled={!CheckBoxStatus} className={`primary-button md:col-span-2 ${!CheckBoxStatus ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {SubmissionRequest ? 'Submit as Healthcare Assistant' : 'Registering as Healthcare Assistant...'}
      </button>
      <p className="md:col-span-2 text-sm text-center">Already registered? <a href="/sign-in" className="text-[#50c896] font-semibold hover:underline">Sign In</a></p>
    </form>
  );
}
