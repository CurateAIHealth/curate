'use client';

import { memo, useState } from 'react';
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
    PANNumber: '',
    Age: '',
    dateofBirth: '',
    ContactNumber: '',
    Email: '',
    Gender: '',
    Password: '',
    ConfirmPassword: '',
    Location: '',
    VerificationStatus: 'Pending',
    TermsAndConditions: "Accepted",
    EmailVerification: false,
    FinelVerification: false,
    ClientStatus: "Client Enquiry"

  });
  const [CheckBoxStatus, setCheckBoxStatus] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [SubmissionRequest, setSubmissionRequest] = useState(true);
  const [DocumentAvailability, setDocumentAvailability] = useState(false)
  const [FirstDocumentAvailability, setFirstDocumentAvailability] = useState(true)
  const [familyMembers, setFamilyMembers] = useState<
    { FullName: any; Email: any; Age: any; AadharNumber: any; ContactNumber: any, dateofBirth: any, Gender: any }[]
  >([]);
  const router = useRouter();
  const UpdateNewFamilyMembar = () => {
    setFamilyMembers([
      ...familyMembers,
      {
        FullName: '',
        Email: '',
        Age: '',
        AadharNumber: '',
        ContactNumber: '',
        dateofBirth: '',
        Gender: ''
      },
    ])
  }

  const removeMember = (index: any) => {
    const updated = [...familyMembers];
    updated.splice(index, 1);
    setFamilyMembers(updated);
  }

  const UpdateDocumentValue = (e: any) => {
    if (e.target.checked) {
      setDocumentAvailability(!DocumentAvailability)
      setFirstDocumentAvailability(!FirstDocumentAvailability)
    }

  }

  const handleNewChange = (In: any, e: any) => {
    const { name, value } = e.target
    if (name === 'dateofBirth') {
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

      const updatedFamilyMembers = [...familyMembers];
      updatedFamilyMembers[In] = {
        ...updatedFamilyMembers[In],
        dateofBirth: value,
        Age: age.toString(),
      };
      setFamilyMembers(updatedFamilyMembers);
      return;
    }
    const NewResult: any = [...familyMembers]
    NewResult[In][name] = value;
    setFamilyMembers(NewResult)

  }
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
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    

    if (name === 'dateofBirth') {
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
        dateofBirth: value,
        Age: age.toString(),
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionRequest(false)

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
      const generatedUserId = uuidv4();
      const payload = {
        ...formData,
        AadharNumber: formData.AadharNumber.replace(/\s/g, ''),
        userId: generatedUserId,
        FamilyMembars: familyMembers
      };
      console.log("Form Data---", payload)
      const result = await UpdatePatientInformation(payload);
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
      setStatusMessage(result.message);
      setFormData({
        userType: 'patient',
        FirstName: '',
        LastName: '',
        AadharNumber: '',
        PANNumber: "",
        Age: '',
        dateofBirth: '',
        Gender: '',
        ContactNumber: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        Location: '',
        VerificationStatus: '',
        TermsAndConditions: "Accepted",
        EmailVerification: false,
        FinelVerification: false,
        ClientStatus: "Client Enquiry"
      });
      setSubmissionRequest(true)
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
  console.log("Test---", familyMembers)
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-0"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs ">First Name</label>
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
        <label className="text-xs ">Last Name</label>
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
        <label className="text-xs ">Age</label>
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
        <label className="text-xs ">Date Of Birth</label>
        <input type="date" className="input-style" name="dateofBirth" onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs ">Select Gender</label>
        <select name="Gender" className="input-style" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs ">Location</label>
        <input
          type="text"
          name="Location"
          value={formData.Location}
          onChange={handleChange}
          className="input-style"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <p>Identity Document Available?</p>
        <div className="flex  gap-2">
          <div className="flex items-center gap-2">
            <input
              id="DocumentAvailabilityYes"
              name="DocumentAvailability"
              type="radio"
              checked={DocumentAvailability}
              onChange={UpdateDocumentValue}
            />
            <label htmlFor="DocumentAvailabilityYes">Yes</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="DocumentAvailabilityNo"
              name="DocumentAvailability"
              type="radio"
              checked={FirstDocumentAvailability}
              onChange={UpdateDocumentValue}
            />
            <label htmlFor="DocumentAvailabilityNo">No</label>
          </div>
        </div>
        <div>
          {DocumentAvailability &&
            <div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs ">Aadhaar Number</label>
                <input
                  type="text"
                  name="AadharNumber"
                  value={formData.AadharNumber}
                  onChange={handleChange}
                  maxLength={14}
                  className="input-style"

                />
                {digitCount > 0 && digitCount < 12 && (
                  <p className="text-sm text-red-500">Aadhaar number must be 12 digits</p>
                )}
              </div>
              <p className='text-center mt-2 mb-2'>or</p>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs ">PAN Number</label>
                <input
                  type="text"
                  name="PANNumber"
                  value={formData.PANNumber.toUpperCase()}
                  onChange={handleChange}
                  maxLength={14}
                  className="input-style"

                />
              </div>
            </div>
          }
        </div>
      </div>



      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs ">Contact Number</label>
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
        {formData.ConfirmPassword && formData.Password !== formData.ConfirmPassword && (
          <p className="text-sm text-red-500">Passwords do not match</p>
        )}
      </div>
      <div className="md:col-span-2 w-full">
        <div className="w-full grid grid-cols-1 gap-4">
          {familyMembers.map((member: any, index: number) => (
            <div
              key={index}
              className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl relative"
            >
              <button
                type="button"
                className="absolute top-4 right-4 text-sm text-red-500 hover:text-red-700 transition cursor-pointer"
                onClick={() => removeMember(index)}
              >
                ✕ Remove
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm  text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="FullName"
                    value={member.FullName}
                    onChange={(e: any) => handleNewChange(index, e)}
                    className="input-style"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm  text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="Email"
                    value={member.Email}
                    onChange={(e: any) => handleNewChange(index, e)}
                    className="input-style"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm  text-gray-700 mb-1">Age</label>
                  <input
                    type="text"
                    name="Age"
                    value={member.Age}
                    onChange={(e: any) => handleNewChange(index, e)}
                    className="input-style"
                    placeholder="Enter age"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs ">Date Of Birth</label>
                  <input type="date" className="input-style" name="dateofBirth" onChange={(e: any) => handleNewChange(index, e)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs ">Select Gender</label>
                  <select name="Gender" className="input-style" onChange={(e: any) => handleNewChange(index, e)} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm  text-gray-700 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    name="AadharNumber"
                    value={member.AadharNumber}
                    onChange={(e: any) => handleNewChange(index, e)}
                    className="input-style"
                    maxLength={14}
                    placeholder="XXXX-XXXX-XXXX"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm  text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    name="ContactNumber"
                    value={member.ContactNumber}
                    onChange={(e: any) => handleNewChange(index, e)}
                    className="input-style"
                    maxLength={10}
                    placeholder="Enter contact number"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={UpdateNewFamilyMembar}
            className="text-sm text-teal-600 underline cursor-pointer"
          >
            + Add Another Family Member
          </button>
        </div>
      </div>


      <div className="md:col-span-2 flex justify-center">
        <p
          className={`text-center font-bold w-full ${statusMessage === 'You registered successfully with Curate Digital AI' ? 'text-green-700' : 'text-[#FF0000]'}`}
        >
          {statusMessage}
        </p>
      </div>
      <div className='flex gap-2'>
        <input
          type="checkbox"
          className="cursor-pointer"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCheckBoxStatus(e.target.checked)
          }
        />
        <p>Accept <a className='text-blue-600 cursor-pointer' href='/PatientTermsAndConditions'>Terms&Condtions</a></p>
      </div>

      <button
        type="submit"
        disabled={!CheckBoxStatus}
        className={`primary-button md:col-span-2 ${!CheckBoxStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {SubmissionRequest ? 'Submit as Patient' : 'Please Wait, Registering as Patient....'}
      </button>

      <div className="md:col-span-2 flex justify-center">
        <p className="text-sm text-gray-700 text-center">
          Already registered?{' '}
          <a href="/sign-in" className="text-[#50c896] font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
}
