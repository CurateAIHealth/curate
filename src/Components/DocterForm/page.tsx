'use client';

import { HYDERABAD_LOCATIONS, medicalSpecialties } from '@/Lib/Content';
import { UpdateInformation } from '@/Lib/user.action';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ReactDOMServer from 'react-dom/server';
import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Eye, EyeOff } from 'lucide-react';

export default function DoctorForm() {
  
  const [formData, setFormData] = useState({
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
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [DoctorSearchInput, setDoctorSearchInput] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [statusMesssage, setStatusMesssage] = useState('');
  const [SubmissionRequest, setSubmissionRequest] = useState(true);
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

 
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const isValidAadhar = (a: string) => /^\d{12}$/.test(a.replace(/\s/g, '')); // NEW
  const passwordStrength = getPasswordStrength(formData.Password);
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = [
    'text-red-500',
    'text-yellow-500',
    'text-blue-500',
    'text-green-600',
  ];


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMesssage('');
    const { name, value } = e.target;


    if (name === 'AadharNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 12);        
      const formatted = digitsOnly.replace(/(.{4})/g, '$1 ').trim();  
      setFormData(prev => ({ ...prev, AadharNumber: formatted }));
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
      const finalData = {
        ...formData,
        AadharNumber: formData.AadharNumber.replace(/\s/g, ''), 
        userId: uuidv4(),
        OfferableService: selectedServices,
        PreferredLocationsforHomeVisits: selectedLocations,
      };

      const Result = await UpdateInformation(finalData);
      if (!Result.success) {
        setStatusMesssage(Result.message);
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
            Thank you for registering with{' '}
            <strong>Curate Digital AI Health</strong>.
          </p>
          <p>
            We have received your details. Our team will review the information
            and contact you if anything else is required.
          </p>
          <p>
            For help, email{' '}
            <a href="mailto:support@curatedigital.ai">
              support@curatedigital.ai
            </a>
            .
          </p>
          <p>
            Best regards,
            <br />
            Curate Digital AI Health Team
          </p>
        </div>
      );

      const htmlComponent = ReactDOMServer.renderToString(<EmailComponent />);

      try {
        await axios.post('/api/MailSend', {
          to: formData.Email,
          subject: 'Curate Digital AI Health Registration',
          html: htmlComponent,
        });

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
          Email: '',
          Password: '',
          ConfirmPassword: '',
        });
        setSelectedServices([]);
        setSelectedLocations([]);
        setSubmissionRequest(true);
        router.push('/SuccessfulRegistration');
      } catch {
        setStatusMesssage(
          'Registration successful, but failed to send confirmation email.',
        );
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
      });
      setSelectedServices([]);
      setSelectedLocations([]);
    }
  };

  const digitCount = formData.AadharNumber.replace(/\s/g, '').length;

  return (
    <form
      onSubmit={handleFormSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-0"
    >

      {DoctorSearchInput && filteredServices.length > 0 && (
        <div className="absolute z-50 top-[280px] left-1/2 -translate-x-1/2 w-full max-w-md bg-white border rounded shadow-lg max-h-60 overflow-auto pointer-events-auto">
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

     
      {searchInput && filteredLocations.length > 0 && (
        <div className="absolute z-50 top-[440px] left-1/2 -translate-x-1/2 w-full max-w-md bg-white border rounded shadow-lg max-h-60 overflow-auto pointer-events-auto">
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
        <label className="text-xs font-semibold uppercase">Qualification</label>
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

 
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase">
          Registration Number
        </label>
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
          <p className="text-sm text-red-500">
            Aadhaar number must be 12 digits
          </p>
        )}
      </div>

     
      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-semibold uppercase">College</label>
        <input
          type="text"
          name="College"
          value={formData.College}
          onChange={handleChange}
          className="input-style"
          required
        />
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

   
      <div className="md:col-span-2">
        <label className="text-xs font-semibold uppercase">Offerable Service</label>
        <input
          type="text"
          value={DoctorSearchInput}
          onChange={e => setDoctorSearchInput(e.target.value)}
          placeholder={
            selectedServices.length >= 1
              ? 'Thank You for Choosing'
              : 'Search Services'
          }
          disabled={selectedServices.length >= 1}
          className="input-style"
        />
        <div className="flex flex-wrap gap-2 mt-2">
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
      </div>


      <div className="md:col-span-2">
        <label className="text-xs font-semibold uppercase">
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
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedLocations.map(loc => (
            <span key={loc} className="badge-style">
              {loc}
              <button
                type="button"
                onClick={() =>
                  setSelectedLocations(prev => prev.filter(l => l !== loc))
                }
                className="ml-2 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
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
      </div>

  
      <div className="flex flex-col gap-1 md:col-span-2 relative">
        <label className="text-xs font-semibold uppercase">
          Confirm Password
        </label>
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

   
      <div className="md:col-span-2 flex justify-center">
        <p
          className={`text-center font-bold w-full ${
            statusMesssage ===
            'You registered successfully with Curate Digital AI'
              ? 'text-green-700'
              : 'text-[#FF0000]'
          }`}
        >
          {statusMesssage}
        </p>
      </div>

     
      <button type="submit" className="primary-button md:col-span-2">
        {SubmissionRequest
          ? 'Submit as Doctor'
          : 'Please Wait, Registering as Doctor....'}
      </button>

    
      <div className="md:col-span-2 flex justify-center">
        <p className="text-sm text-gray-700 text-center">
          Already registered?{' '}
          <a
            href="/sign-in"
            className="text-teal-600 font-semibold hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
}
