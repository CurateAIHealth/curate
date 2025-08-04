'use client';

import { memo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getPasswordStrength } from '@/Lib/Actions';
import { UpdateOrganisation, UpdatePatientInformation } from '@/Lib/user.action'; // Rename if needed
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';

export default function OrganizationForm() {
  const [formData, setFormData] = useState({
    userType: 'organization',
    OrganizationName: '',
    RegistrationNumber: '',
    OrganizationType: '',
    HeadName: '',
    HeadContact: '',
    Location: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    NumberOfPeople: '',
    VerificationStatus: 'Pending',
    TermsAndConditions: 'Accepted',
    EmailVerification:false,
 FinelVerification:false,
  });

  const [CheckBoxStatus, setCheckBoxStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [SubmissionRequest, setSubmissionRequest] = useState(true);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setStatusMessage('');
    const { name, value } = e.target;

    if (name === 'HeadContact') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, HeadContact: digitsOnly }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
setSubmissionRequest(false)
    const pwOk =
      formData.Password.length >= 8 &&
      /[A-Z]/.test(formData.Password) &&
      /[0-9]/.test(formData.Password) &&
      /[^A-Za-z0-9]/.test(formData.Password);

    if (!pwOk) {
      setStatusMessage(
        'Password must be ≥ 8 chars, include an uppercase letter, a number, and a special character.'
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
       const generatedUserId = uuidv4();
      const payload:any = {
        ...formData,
        userId: generatedUserId,
      };

      const result:any = await UpdateOrganisation(payload);
      if (!result.success) {
        
        setStatusMessage(result.message);
         setSubmissionRequest(true);
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

      setStatusMessage(result.message);
      setFormData({
        userType: 'organization',
        OrganizationName: '',
        RegistrationNumber: '',
        OrganizationType: '',
        HeadName: '',
        HeadContact: '',
        Location: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
         NumberOfPeople: '',
        VerificationStatus: 'Pending',
        TermsAndConditions: 'Accepted',
            EmailVerification:false,
             FinelVerification:false,
      });
setSubmissionRequest(true)
      router.push('/SuccessfulRegistration');
    } catch (error) {
      console.error(error);
      setStatusMessage('Unexpected error. Please try again.');
        setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <label className="text-xs ">Organization Name</label>
        <input
          type="text"
          name="OrganizationName"
          value={formData.OrganizationName}
          onChange={handleChange}
          className="input-style"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs ">Organization Type</label>
        <select
          name="OrganizationType"
          value={formData.OrganizationType}
          onChange={handleChange}
          className="input-style"
          required
        >
          <option value="">Select Type</option>
          <option value="Hospital">Hospital</option>
          <option value="Clinic">Clinic</option>
          <option value="Diagnostic Center">Diagnostic Center</option>
          <option value="NGO">NGO</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
  <label className="text-xs ">Number of People in Organization</label>
  <input
    type="number"
    name="NumberOfPeople"
    value={formData.NumberOfPeople}
    onChange={handleChange}
    className="input-style"
    min={1}
    required
  />
</div>


      <div className="flex flex-col gap-1">
        <label className="text-xs ">Registration Number</label>
        <input
          type="text"
          name="RegistrationNumber"
          value={formData.RegistrationNumber}
          onChange={handleChange}
          className="input-style"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs ">Head of Organization Name</label>
        <input
          type="text"
          name="HeadName"
          value={formData.HeadName}
          onChange={handleChange}
          className="input-style"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs ">Head Contact Number</label>
        <input
          type="text"
          name="HeadContact"
          value={formData.HeadContact}
          onChange={handleChange}
          className="input-style"
          maxLength={10}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs ">Location / Address</label>
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
        <label className="text-xs ">Email</label>
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
        <label className="text-xs ">Password</label>
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
        <label className="text-xs ">Confirm Password</label>
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
        {formData.ConfirmPassword &&
          formData.Password !== formData.ConfirmPassword && (
            <p className="text-sm text-red-500">Passwords do not match</p>
          )}
      </div>

      <div className="flex gap-2 md:col-span-2">
        <input
          type="checkbox"
          className="cursor-pointer"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCheckBoxStatus(e.target.checked)
          }
        />
        <p>
          Accept{' '}
          <a
            className="text-blue-600 cursor-pointer"
            href="/TermsAndConditions"
          >
            Terms & Conditions
          </a>
        </p>
      </div>

      <div className="md:col-span-2 flex justify-center">
        <p
          className={`text-center font-bold w-full ${
            statusMessage ===
            'You registered successfully with Curate Digital AI'
              ? 'text-green-700'
              : 'text-[#FF0000]'
          }`}
        >
          {statusMessage}
        </p>
      </div>

      <button
        type="submit"
        disabled={!CheckBoxStatus}
        className={`primary-button md:col-span-2 ${
          !CheckBoxStatus ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {SubmissionRequest
          ? 'Submit as Organization'
          : 'Please Wait, Registering...'}
      </button>

      <div className="md:col-span-2 flex justify-center">
        <p className="text-sm text-gray-700 text-center">
          Already registered?{' '}
          <a
            href="/sign-in"
            className="text-[#50c896] font-semibold hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
}
