'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { HYDERABAD_LOCATIONS, medicalSpecialties } from '@/Lib/Content';



export default function Home() {
  const router = useRouter();
  const [userType, setUserType] = useState("");
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [DoctorSearchInput, setDoctorSearchInput] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filteredLocations = useMemo(() => {
    if (!searchInput) return [];
    return HYDERABAD_LOCATIONS.filter(loc =>
      loc.toLowerCase().includes(searchInput.toLowerCase()) &&
      !selectedLocations.includes(loc)
    ).slice(0, 5);
  }, [searchInput, selectedLocations]);

  const filteredServices = useMemo(() => {
    if (!DoctorSearchInput) return [];
    return medicalSpecialties.filter(service =>
      service.toLowerCase().includes(DoctorSearchInput.toLowerCase())
    ).slice(0, 5);
  }, [DoctorSearchInput]);

  const handleSelect = useCallback((e:any) => {
    setUserType(e.target.value);
  }, []);

  const handleRegister = useCallback(() => {
    router.push('/register');
  }, [router]);

  const handleSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  const handleSelectLocation = (location:any) => {
    if (selectedLocations.length < 4) {
      setSelectedLocations(prev => [...prev, location]);
      setSearchInput('');
    }
  };

  const handleRemoveLocation = (location:any) => {
    setSelectedLocations(prev => prev.filter(loc => loc !== location));
  };

  const updateSelectedService = useCallback((service:any) => {
    setSelected(prev => [...prev, service]);
    setDoctorSearchInput("");
  }, []);

  const removeSelectedService = useCallback((service:any) => {
    setSelected(prev => prev.filter(item => item !== service));
  }, []);

  return (
    <main className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 p-4">
      <section className="w-full max-w-md md:max-w-lg bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-fade-in m-2">
        <div className="flex items-center justify-center">
          <Image src="/Icons/Curate-logo.png" alt="Curate AI Health Logo" width={85} height={85} priority />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-snug">
          Register with <span className="text-teal-600"><span className='text-pink-400'>Curate</span> Digital AI</span>
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-gray-700 font-medium text-sm sm:text-base">
          {["patient", "patientFamily", "doctor", "nurse"].map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="userType"
                value={type}
                onChange={handleSelect}
                checked={userType === type}
                className="accent-teal-600"
              />
              <span>{type === 'patientFamily' ? 'Patient Family' : type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </label>
          ))}
        </div>
        {!userType && (
          <div className="text-sm text-gray-700 mt-2">
            Already registered? <button onClick={handleSignIn} className="text-teal-600 font-semibold hover:underline">Sign In</button>
          </div>
        )}
        {userType && (
          <>
            <div className="md:h-[220px] h-[280px] flex flex-col gap-2 overflow-auto p-2">
              {userType === 'doctor' && (
                <>
                  <input type="text" placeholder="First Name" className="input-style" />
                  <input type="text" placeholder="Last Name" className="input-style" />
                  <input type="text" placeholder="Qualification" className="input-style" />
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={selected.length >= 1 ? 'Service Choosen' : 'Offerdable Service'}
                      value={DoctorSearchInput}
                      onChange={e => setDoctorSearchInput(e.target.value)}
                      disabled={selected.length >= 1}
                      className="input-style"
                    />
                    <div className="flex flex-wrap gap-2">
                      {selected.map((service, i) => (
                        <span key={i} className="bg-teal-100 m-2 text-teal-800 p-2 rounded-full text-sm flex items-center">
                          {service}
                          <button onClick={() => removeSelectedService(service)} className="ml-1 text-teal-600 hover:text-red-500 font-bold">×</button>
                        </span>
                      ))}
                    </div>
                    {DoctorSearchInput && (
                      <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded shadow-md max-h-40 overflow-auto">
                        {filteredServices.map((service, index) => (
                          <li key={index} onClick={() => updateSelectedService(service)} className="px-3 py-2 hover:bg-teal-100 cursor-pointer">
                            {service}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <input type="text" placeholder="Location" className="input-style" />
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={selectedLocations.length >= 4 ? 'Max 4 locations' : 'Preferred locations for home visits'}
                      value={searchInput}
                      onChange={e => setSearchInput(e.target.value)}
                      disabled={selectedLocations.length >= 4}
                      className="input-style"
                    />
                    {filteredLocations.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded shadow-md max-h-40 overflow-auto">
                        {filteredLocations.map((location, index) => (
                          <li key={index} onClick={() => handleSelectLocation(location)} className="px-3 py-2 hover:bg-teal-100 cursor-pointer">
                            {location}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocations.map((loc, i) => (
                      <span key={i} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
                        {loc}
                        <button onClick={() => handleRemoveLocation(loc)} className="ml-2 text-teal-600 hover:text-red-500 font-bold">×</button>
                      </span>
                    ))}
                  </div>
                  <input type="text" placeholder="Registration Number" className="input-style" />
                  <input type="text" placeholder="College" className="input-style" />
                  <input type="email" placeholder="Email" className="input-style" />
                </>
              )}
              {(userType === 'patient' || userType === 'patientFamily' || userType === 'nurse') && (
                <>
                  <input type="text" placeholder="Full Name" className="input-style" />
                  <input type="email" placeholder="Email" className="input-style" />
                  <input type="number" placeholder="Age" className="input-style" />
                  {userType === 'nurse' && (
                    <>
                      <input type="text" placeholder="Qualification" className="input-style" />
                      <input type="text" placeholder="Registration Number" className="input-style" />
                    </>
                  )}
                </>
              )}
            </div>
            <button onClick={handleRegister} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-full shadow-lg transition duration-300 mt-4">
                   Register as {userType === 'patientFamily' ? 'Patient Family' : userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>
            <div className="text-sm text-gray-700 mt-2">
              Already registered? <button onClick={handleSignIn} className="text-teal-600 font-semibold hover:underline">Sign In</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
