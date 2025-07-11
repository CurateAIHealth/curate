'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { UpdateCurateFamilyInfo } from '@/Lib/user.action';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';

export default function PatientFamilyForm() {
  const [familyMembers, setFamilyMembers] = useState([
    {
      FullName: '',
      Email: '',
      Age: '',
      AadharNumber: '',
      ContactNumber: '',
      Password: '',
      ConfirmPassword: '',
    },
  ]);

  const [showPasswordIndex, setShowPasswordIndex] = useState<number | null>(null);
  const [showConfirmPasswordIndex, setShowConfirmPasswordIndex] = useState<number | null>(null);
  const [checkboxAccepted, setCheckboxAccepted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    const updatedMembers:any = [...familyMembers];

    if (name === 'AadharNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 12);
      updatedMembers[index][name] = digitsOnly.replace(/(.{4})/g, '$1 ').trim();
    } else if (name === 'ContactNumber' || name === 'Age') {
      updatedMembers[index][name] = value.replace(/\D/g, '');
    } else {
      updatedMembers[index][name] = value;
    }

    setFamilyMembers(updatedMembers);
  };

  const addMember = () => {
    setFamilyMembers([
      ...familyMembers,
      {
        FullName: '',
        Email: '',
        Age: '',
        AadharNumber: '',
        ContactNumber: '',
        Password: '',
        ConfirmPassword: '',
      },
    ]);
  };

  const removeMember = (index: number) => {
    const updated = [...familyMembers];
    updated.splice(index, 1);
    setFamilyMembers(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    for (const member of familyMembers) {
      if (member.AadharNumber.replace(/\s/g, '').length !== 12) {
        setStatusMessage('Aadhaar number must be 12 digits for all members');
        setIsSubmitting(false);
        return;
      }

      if (member.ContactNumber.length !== 10) {
        setStatusMessage('Contact number must be 10 digits for all members');
        setIsSubmitting(false);
        return;
      }

      const pw = member.Password;
      if (
        pw.length < 8 ||
        !/[A-Z]/.test(pw) ||
        !/[0-9]/.test(pw) ||
        !/[^A-Za-z0-9]/.test(pw)
      ) {
        setStatusMessage(
          'Each password must be ≥ 8 characters, include uppercase, number, and special character'
        );
        setIsSubmitting(false);
        return;
      }

      if (pw !== member.ConfirmPassword) {
        setStatusMessage('Passwords do not match for all members');
        setIsSubmitting(false);
        return;
      }
    }

    try {
  
   
      const Result=await UpdateCurateFamilyInfo(familyMembers)
         const EmailComponent = () => (
        <div>
          <div style={{ textAlign: 'center' }}>
            <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/Icons/Curate-logo.png`} alt="Curate Digital AI Health" width="150" />
          </div>
          <p>Dear User,</p>
          <p>Thank you for registering with <strong>Curate Digital AI Health</strong>.</p>
          <p>We have received your details. Our team will review the information and contact you if anything else is required.</p>
          <p>For help, email <a href="mailto:support@curatedigital.ai">support@curatedigital.ai</a>.</p>
          <p>Best regards,<br />Curate Digital AI Health Team</p>
        </div>
      );

      const htmlComponent = ReactDOMServer.renderToString(<EmailComponent />);
      await axios.post('/api/MailSend', {
        to: familyMembers[0].Email,
        subject: 'Curate Digital AI Health Registration',
        html: htmlComponent,
      });
         console.log('Submitting family members:', Result);
         if(Result.success)
          {  setStatusMessage('All members submitted successfully!')
           
          } if(Result.success==false)
          {  setStatusMessage('One or more family members already exist with these details')
           
          }
    
      setFamilyMembers([
        {
          FullName: '',
          Email: '',
          Age: '',
          AadharNumber: '',
          ContactNumber: '',
          Password: '',
          ConfirmPassword: '',
        },
      ]);
      setCheckboxAccepted(false)
    } catch (error) {
      setStatusMessage('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6">
      {familyMembers.map((member, index) => (
        <div key={index} className="border p-4 rounded-lg space-y-4 bg-gray-50 relative">
          {index===0&&<p className="text-s font-semibold uppercase text-center text-gray-500">Head of Household</p>}
          {familyMembers.length > 1 && (
            <button
              type="button"
              className="absolute top-2 right-2 text-sm text-red-600"
              onClick={() => removeMember(index)}
            >
              Remove
            </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase">Full Name</label>
              <input
                type="text"
                name="FullName"
                value={member.FullName}
                onChange={(e) => handleChange(index, e)}
                className="input-style"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase">Email</label>
              <input
                type="email"
                name="Email"
                value={member.Email}
                onChange={(e) => handleChange(index, e)}
                className="input-style"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase">Age</label>
              <input
                type="text"
                name="Age"
                value={member.Age}
                onChange={(e) => handleChange(index, e)}
                className="input-style"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase">Aadhaar Number</label>
              <input
                type="text"
                name="AadharNumber"
                value={member.AadharNumber}
                onChange={(e) => handleChange(index, e)}
                className="input-style"
                maxLength={14}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase">Contact Number</label>
              <input
                type="text"
                name="ContactNumber"
                value={member.ContactNumber}
                onChange={(e) => handleChange(index, e)}
                className="input-style"
                maxLength={10}
                required
              />
            </div>

            <div className="relative flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase">Password</label>
              <input
                type={showPasswordIndex === index ? 'text' : 'password'}
                name="Password"
                value={member.Password}
                onChange={(e) => handleChange(index, e)}
                className="input-style"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-8"
                onClick={() =>
                  setShowPasswordIndex(showPasswordIndex === index ? null : index)
                }
              >
                {showPasswordIndex === index ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase">Confirm Password</label>
              <input
                type={showConfirmPasswordIndex === index ? 'text' : 'password'}
                name="ConfirmPassword"
                value={member.ConfirmPassword}
                onChange={(e) => handleChange(index, e)}
                className="input-style"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-8"
                onClick={() =>
                  setShowConfirmPasswordIndex(
                    showConfirmPasswordIndex === index ? null : index
                  )
                }
              >
                {showConfirmPasswordIndex === index ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addMember}
        className="text-sm text-teal-600 underline"
      >
        + Add Another Family Member
      </button>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="cursor-pointer"
   checked={checkboxAccepted}
          onChange={(e) => setCheckboxAccepted(e.target.checked)}
        />
        <p className="text-sm">
          Accept <a className="text-blue-600 cursor-pointer" href='/TermsAndConditions'>Terms & Conditions</a>
        </p>
      </div>

      {statusMessage && (
        <p className={`text-sm font-bold ${statusMessage.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
          {statusMessage}
        </p>
      )}

      <button
        type="button"
        disabled={!checkboxAccepted || isSubmitting}
        onClick={handleSubmit}
        className={`primary-button w-full ${
          !checkboxAccepted || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit All Members'}
      </button>

      <div className="text-sm text-gray-700 text-center">
        Already registered?{' '}
        <a href="/sign-in" className="text-teal-600 font-semibold hover:underline">
          Sign In
        </a>
      </div>
    </form>
  );
}
