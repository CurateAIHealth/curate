

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [userType, setUserType] = useState<'patient' | 'patientFamily' | 'doctor' | 'nurse' | null>(null);

 const hyderabadLocations = [
  "Banjara Hills", "Jubilee Hills", "Gachibowli", "Hitech City", "Madhapur", "Manikonda",
  "Begumpet", "Ameerpet", "Kukatpally", "Secunderabad", "Kondapur", "Miyapur",
  "Mehdipatnam", "Somajiguda", "Dilsukhnagar", "LB Nagar", "Tolichowki", "Kompally",
  "Uppal", "Nallagandla", "Attapur", "Khairatabad", "Panjagutta", "Yousufguda",
  "Erragadda", "SR Nagar", "Moosapet", "RTC X Roads", "Basheerbagh", "Koti",
  "Abids", "Himayatnagar", "Chikkadpally", "Musheerabad", "Amberpet", "Nagole",
  "Charminar", "Malakpet", "Bahadurpura", "Shamshabad", "Rajendra Nagar", "Alwal",
  "ECIL", "Malkajgiri", "Nacharam", "Peerzadiguda", "LB Nagar", "Hayathnagar",
  "Gandipet", "Patancheru", "Isnapur", "Tellapur", "Tarnaka", "Habsiguda", "Moosarambagh",
  "Sainikpuri", "Bowenpally", "Nizampet", "Bachupally", "Chandanagar", "Beeramguda"
]

  const [searchInput, setSearchInput] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 0) {
      const filtered = hyderabadLocations
        .filter(loc =>
          loc.toLowerCase().includes(value.toLowerCase()) &&
          !selectedLocations.includes(loc)
        )
        .slice(0, 5);

      setFilteredLocations(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredLocations([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectLocation = (location: string) => {
    if (selectedLocations.length < 4) {
      setSelectedLocations(prev => [...prev, location]);
      setSearchInput('');
      setFilteredLocations([]);
      setShowSuggestions(false);
    }
  };

  const handleRemoveLocation = (location: string) => {
    setSelectedLocations(prev => prev.filter(loc => loc !== location));
  };

  const handleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(e.target.value as any);
  }, []);

  const handleRegister = useCallback(() => {
    router.push(`/register`);
  }, [router]);

  const handleSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  return (
    <main className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 p-4">
      <section className="w-full max-w-md md:max-w-lg bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-fade-in m-2">
        <div className="flex items-center justify-center">
          <Image
            src="/Icons/Curate-logo.png"
            alt="Curate AI Health Logo"
            width={85}
            height={85}
            priority
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-snug">
          Register with <span className="text-teal-600"><span className='text-pink-400'>Curate</span> Digital AI</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-4 text-gray-700 font-medium text-sm sm:text-base">
          {['patient', 'patientFamily', 'doctor', 'nurse'].map((type) => (
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
            Already registered?{' '}
            <button onClick={handleSignIn} className="text-teal-600 font-semibold hover:underline">
              Sign In
            </button>
          </div>
        )}

        {userType && (
          <>
            <div className="md:h-[220px] h-[180px] flex flex-col gap-2 overflow-auto p-2">
              {userType === 'doctor' && (
                <>
                  <input type="text" placeholder="First Name" className="input-style" />
                  <input type="text" placeholder="Last Name" className="input-style" />
                  <input type="text" placeholder="Qualification" className="input-style" />
                  <select className="input-style" defaultValue="">
                    <option value="" disabled>Select Speciality</option>
            
                    {["General Physician", "Cardiologist", "Dermatologist", "Pediatrician", "Gynecologist", "Orthopedic Surgeon", "Psychiatrist", "ENT Specialist", "Neurologist", "Ophthalmologist", "Dentist", "Oncologist", "Urologist", "Gastroenterologist", "Nephrologist"]
                      .map((spec, i) => <option key={i} value={spec}>{spec}</option>)}
                  </select>
                  <input type="text" placeholder="Location" className="input-style" />
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={selectedLocations.length >= 4 ? 'Maximum 4 locations added' : 'Preferred locations for home visits'}
                      value={searchInput}
                      onChange={handleLocationChange}
                      disabled={selectedLocations.length >= 4}
                      className="input-style"
                    />
                    {showSuggestions && filteredLocations.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded shadow-md max-h-40 overflow-auto">
                        {filteredLocations.map((location, index) => (
                          <li
                            key={index}
                            onClick={() => handleSelectLocation(location)}
                            className="px-3 py-2 hover:bg-teal-100 cursor-pointer"
                          >
                            {location}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocations.map((loc, i) => (
                      <span
                        key={i}
                        className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {loc}
                        <button
                          onClick={() => handleRemoveLocation(loc)}
                          className="ml-2 text-teal-600 hover:text-red-500 font-bold"
                        >
                          ×
                        </button>
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

            <button
              onClick={handleRegister}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-full shadow-lg transition duration-300 mt-4"
            >
              Register as {userType === 'patientFamily' ? 'Patient Family' : userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>

            <div className="text-sm text-gray-700 mt-2">
              Already registered?{' '}
              <button onClick={handleSignIn} className="text-teal-600 font-semibold hover:underline">
                Sign In
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
