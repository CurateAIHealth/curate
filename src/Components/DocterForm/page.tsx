'use client';

import {
  HYDERABAD_LOCATIONS,
  medicalSpecialties,
  All_Medical_Colleges_Names,
} from '@/Lib/Content';
import { UpdateDocterInformation } from '@/Lib/user.action';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ReactDOMServer from 'react-dom/server';
import { useState, useMemo, memo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Eye, EyeOff } from 'lucide-react';
import { getPasswordStrength, isValidAadhar } from '@/Lib/Actions';


export default function DoctorForm() {
  const [formData, setFormData] = useState({
    userType: 'doctor',
    FirstName: '',
    LastName: '',
    Qualification: '',
    Location: '',
    RegistrationNumber: '',
    College: '',
    DateOfBirth:'',
    Gender:'',
    AadharNumber: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    ContactNumber: '',
    Type: '',
    VerificationStatus: "Pending",
    Age: '',
    TermsAndConditions: "Accepted",
    EmailVerification: false,
     FinelVerification:false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [DoctorSearchInput, setDoctorSearchInput] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [statusMesssage, setStatusMesssage] = useState('');
  const [SubmissionRequest, setSubmissionRequest] = useState(true);
  const [collegeInput, setCollegeInput] = useState('');
  const [CheckBoxStatus, setCheckBoxStatus] = useState(false)

  const router = useRouter();

  const filteredServices = useMemo(
    () =>
      medicalSpecialties
        .filter(s => s.toLowerCase().includes(DoctorSearchInput.toLowerCase()))
        .slice(0, 5),
    [DoctorSearchInput],
  );

  const filteredLocations = useMemo(
    () =>
      HYDERABAD_LOCATIONS.filter(
        loc =>
          loc.toLowerCase().includes(searchInput.toLowerCase()) &&
          !selectedLocations.includes(loc),
      ).slice(0, 5),
    [searchInput, selectedLocations],
  );

  const filteredColleges = useMemo(
    () =>
      All_Medical_Colleges_Names.filter(c =>
        c.toLowerCase().includes(collegeInput.toLowerCase()),
      ).slice(0, 8),
    [collegeInput],
  );

  const passwordStrength = getPasswordStrength(formData.Password);
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = [
    'text-red-500',
    'text-yellow-500',
    'text-blue-500',
    'text-green-600',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setStatusMesssage('');
    const { name, value } = e.target;

    if (name === 'AadharNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 12);
      const formatted = digitsOnly.replace(/(.{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, AadharNumber: formatted }));
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
      dateofBirth: value,
      Age: age.toString(),
    }));
    return;
  }
    if (name === 'ContactNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, ContactNumber: digitsOnly }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceAdd = (service: string) => {
    setSelectedServices([service]);
    setDoctorSearchInput('');
  };

  const handleLocationAdd = (loc: string) => {
    if (selectedLocations.length < 4) {
      setSelectedLocations(prev => [...prev, loc]);
      setSearchInput('');
    }
  };

  const handleCollegeSelect = (college: string) => {
    setFormData(prev => ({ ...prev, College: college }));
    setCollegeInput('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionRequest(false);

    if (!isValidAadhar(formData.AadharNumber)) {
      setStatusMesssage('Please enter a valid 12‑digit Aadhaar number.');
      return;
    }

    const passwordValid =
      formData.Password.length >= 8 &&
      /[A-Z]/.test(formData.Password) &&
      /[0-9]/.test(formData.Password) &&
      /[^A-Za-z0-9]/.test(formData.Password);

    if (!passwordValid) {
      setStatusMesssage(
        'Password must contain at least 8 characters, one uppercase letter, one number, and one special character.',
      );
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setStatusMesssage('Passwords do not match.');
      return;
    }

    try {
      const generatedUserId = uuidv4();
      const finalData = {
        ...formData,
        AadharNumber: formData.AadharNumber.replace(/\s/g, ''),
        userId:generatedUserId,
        OfferableService: selectedServices,
        PreferredLocationsforHomeVisits: selectedLocations,
      };

      const Result = await UpdateDocterInformation(finalData);
      if (!Result.success) {
            setSubmissionRequest(true);
        setStatusMesssage(Result.message);
        
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

      try {
        // await axios.post('/api/MailSend', {
        //   to: formData.Email,
        //   subject: 'Curate AI Digital Health Email Verification',
        //   html: htmlComponent,
        // });
        setStatusMesssage(Result.message);

        setFormData({
          userType: 'doctor',
          FirstName: '',
          LastName: '',
          Qualification: '',
          Location: '',
          RegistrationNumber: '',
          College: '',
          AadharNumber: '',
          Gender:'',
          Email: '',
          Password: '',
          ConfirmPassword: '',
          ContactNumber: '',
          Type: '',
          VerificationStatus: 'Pending',
          DateOfBirth:'',
          Age: '',
          TermsAndConditions: "Accepted",
          EmailVerification: false,
           FinelVerification:false,

        });
        setSelectedServices([]);
        setSelectedLocations([]);
        setSubmissionRequest(true);
        router.push('/SuccessfulRegistration');
      } catch {
        setStatusMesssage('Registration successful, but failed to send confirmation email.');
      }
    } catch {
      setStatusMesssage('Unexpected Error');
      setFormData({
        userType: 'doctor',
        FirstName: '',
        LastName: '',
        Qualification: '',
        Location: '',
        RegistrationNumber: '',
        College: '',
        AadharNumber: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        ContactNumber: '',
        Gender:'',
        Type: '',
        VerificationStatus: 'Pending',
        Age: '',
        DateOfBirth:"",
        TermsAndConditions: "Accepted",
        EmailVerification: false,
         FinelVerification:false,
      });
      setSelectedServices([]);
      setSelectedLocations([]);
    }
  };

  const digitCount = formData.AadharNumber.replace(/\s/g, '').length;
  const phoneDigits = formData.ContactNumber.length;

  return (
    <form
      onSubmit={handleFormSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
        <label className="text-xs  ">Last Name</label>
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
        <label className="text-xs ">Qualification</label>
        <input
          type="text"
          name="Qualification"
          value={formData.Qualification}
          onChange={handleChange}
          className="input-style"
          required
        />
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
      <div className="flex flex-col gap-1">
        <label className="text-xs  ">Date Of Birth</label>
        <input type="date" className="input-style" name="DateOfBirth" onChange={handleChange} required />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs  ">Select Gender</label>
        <select name="Gender" className="input-style" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs ">Type</label>
        <select name="Type" className="input-style" onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="doctor">doctor</option>
          <option value="Student">Student</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs ">Age</label>
        <input
          type="number"
          name="Age"
          value={formData.Age}
          onChange={handleChange}
          className="input-style"
          min={18}
          required
        />
      </div>
      {formData.Type === 'doctor' && (
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
      )}

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs ">Aadhaar Number</label>
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

      <div className="flex flex-col gap-1 md:col-span-2 relative">
        <label className="text-xs ">College</label>
        <input
          type="text"
          name="College"
          value={collegeInput || formData.College}
          onChange={e => {
            setCollegeInput(e.target.value);
            setFormData(prev => ({ ...prev, College: e.target.value }));
          }}
          className="input-style"
          required
          autoComplete="off"
        />
        {collegeInput && filteredColleges.length > 0 && (
          <ul className="absolute inset-x-0 top-full mt-1 max-h-60 overflow-auto rounded border bg-white shadow-lg z-50">
            {filteredColleges.map((c, i) => (
              <li
                key={i}
                onClick={() => handleCollegeSelect(c)}
                className="cursor-pointer px-3 py-2 hover:bg-teal-100"
              >
                {c}
              </li>
            ))}
          </ul>
        )}
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
            placeholder="Enter 10‑digit mobile Number"
          />
        </div>
        {phoneDigits > 0 && phoneDigits < 10 && (
          <p className="text-sm text-red-500">Contact number must be 10 digits</p>
        )}
      </div>

      <div className="md:col-span-2 relative">
        <label className="text-xs">Offerable Service</label>
        <input
          type="text"
          value={DoctorSearchInput}
          onChange={e => setDoctorSearchInput(e.target.value)}
          placeholder={
            selectedServices.length >= 1 ? 'Thank You for Choosing' : 'Search Services'
          }
          disabled={selectedServices.length >= 1}
          className="input-style"
        />
        <div className="flex flex-wrap gap-2 mt-2 md:col-span-2">
          {selectedServices.map(service => (
            <span key={service} className="badge-style">
              {service}
              <button
                type="button"
                onClick={() => setSelectedServices([])}
                className="ml-2 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {DoctorSearchInput && filteredServices.length > 0 && (
          <div className="absolute inset-x-0 top-full mt-1 max-h-60 overflow-auto bg-white border rounded shadow-lg z-50">
            {filteredServices.map((s, idx) => (
              <div
                key={idx}
                onClick={() => handleServiceAdd(s)}
                className="hover:bg-teal-100 p-2 cursor-pointer"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-2 relative">
        <label className="text-xs">
          Preferred Locations for Home Visits
        </label>
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={
            selectedLocations.length >= 4
              ? 'You’re done with 4 preferred locations'
              : 'Choose up to 4 locations'
          }
          disabled={selectedLocations.length >= 4}
          className="input-style"
        />
        <div className="flex flex-wrap gap-2 mt-2 md:col-span-2">
          {selectedLocations.map(loc => (
            <span key={loc} className="badge-style">
              {loc}
              <button
                type="button"
                onClick={() => setSelectedLocations(prev => prev.filter(l => l !== loc))}
                className="ml-2 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {searchInput && filteredLocations.length > 0 && (
          <div className="absolute inset-x-0 top-full mt-1 max-h-60 overflow-auto bg-white border rounded shadow-lg z-50">
            {filteredLocations.map((loc, idx) => (
              <div
                key={idx}
                onClick={() => handleLocationAdd(loc)}
                className="hover:bg-teal-100 p-2 cursor-pointer"
              >
                {loc}
              </div>
            ))}
          </div>
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
      <div className='flex gap-2'>
        <input
          type="checkbox"
          className="cursor-pointer"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCheckBoxStatus(e.target.checked)
          }
        />
        <p>Accept <a className='text-blue-600 cursor-pointer' href='/TermsAndConditions'>Terms&Condtions</a></p>
      </div>

      <div className="md:col-span-2 flex justify-center">
        <p
          className={`text-center font-bold w-full ${statusMesssage === 'You registered successfully with Curate Digital AI'
            ? 'text-green-700'
            : 'text-[#FF0000]'
            }`}
        >
          {statusMesssage}
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
          <a href="/sign-in" className="text-[#50c896] font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
}
