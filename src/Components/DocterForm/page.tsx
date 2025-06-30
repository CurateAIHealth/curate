'use client';

import { HYDERABAD_LOCATIONS, medicalSpecialties } from '@/Lib/Content';
import { UpdateInformation } from '@/Lib/user.action';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function DoctorForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    userType: 'doctor',
    FirstName: '',
    LastName: '',
    Qualification: '',
    Location: '',
    RegistrationNumber: '',
    College: '',
    Email: '',
  });

  const [DoctorSearchInput, setDoctorSearchInput] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [statusMesssage,setStatusMesssage]=useState("")
  const router=useRouter()

  const filteredServices = useMemo(() => {
    return medicalSpecialties
      .filter(s => s.toLowerCase().includes(DoctorSearchInput.toLowerCase()))
      .slice(0, 5);
  }, [DoctorSearchInput]);

  const filteredLocations = useMemo(() => {
    return HYDERABAD_LOCATIONS
      .filter(loc =>
        loc.toLowerCase().includes(searchInput.toLowerCase()) &&
        !selectedLocations.includes(loc)
      )
      .slice(0, 5);
  }, [searchInput, selectedLocations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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

  const removeService = () => setSelectedServices([]);
  const removeLocation = (loc: string) =>
    setSelectedLocations(prev => prev.filter(l => l !== loc));

  const handleFormSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      userId: uuidv4(),
      OfferableService: selectedServices,
      PreferredLocationsforHomeVisits: selectedLocations,
    };

const Result=await UpdateInformation(finalData)

if(Result.success){
setStatusMesssage(Result.message)
//   const SenMainl = await axios.post("/api/MailSend", {
//   to: formData.Email,
//   subject: 'Curate Digital AI Health Registration',
//   html: `
//     <p>Dear User,</p>
//     <p>Thank you for registering with <strong>Curate Digital AI Health</strong>.</p>
//     <p>We have successfully received your registration details. Our team will review the information and get back to you shortly if any further steps are required.</p>
//     <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:support@curatedigital.ai">support@curatedigital.ai</a>.</p>
//     <p>Best regards,<br/>Curate Digital AI Health Team</p>
//   `,
// });
    console.log("Finel input Data----",Result.message)
    router.push("/SuccefullRegistration")
    onSubmit(finalData);
    return
}else{
setStatusMesssage(Result.message)
setFormData(
  { userType: 'doctor',
    FirstName: '',
    LastName: '',
    Qualification: '',
    Location: '',
    RegistrationNumber: '',
    College: '',
    Email: '',}
)
setSelectedServices([])
setSelectedLocations([])
}





  };

  return (
    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-0">
 
      {(DoctorSearchInput && filteredServices.length > 0) && (
        <div
          className="absolute z-50 top-[280px] left-1/2 -translate-x-1/2 w-full max-w-md bg-white border rounded shadow-lg max-h-60 overflow-auto pointer-events-auto"
        >
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

      {(searchInput && filteredLocations.length > 0) && (
        <div
          className="absolute z-50 top-[440px] left-1/2 -translate-x-1/2 w-full max-w-md bg-white border rounded shadow-lg max-h-60 overflow-auto pointer-events-auto"
        >
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
        <label className="text-xs font-semibold uppercase">Registration Number</label>
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
          placeholder={selectedServices.length >= 1?"Thank You for Choosing":"Search Services"}
          disabled={selectedServices.length >= 1}
          className="input-style"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedServices.map(service => (
            <span key={service} className="badge-style">
              {service}
              <button type="button" onClick={removeService} className="ml-2 font-bold">×</button>
            </span>
          ))}
        </div>
      </div>

  
      <div className="md:col-span-2">
        <label className="text-xs font-semibold uppercase">Preferred Locations for Home Visits</label>
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={selectedLocations.length >= 4?"Your Done with 4 Preferred Locations":"Choose up to 4 locations"}
          disabled={selectedLocations.length >= 4}
          className="input-style"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedLocations.map(loc => (
            <span key={loc} className="badge-style">
              {loc}
              <button type="button" onClick={() => removeLocation(loc)} className="ml-2 font-bold">×</button>
            </span>
          ))}
        </div>
      </div>
        <div className="md:col-span-2 flex justify-center">
       <p
  className={`text-center font-bold w-full ${
    statusMesssage === "You registered successfully with Curate Digital AI"
      ? "text-[#00FF00]"
      : "text-[#FF0000]"
  }`}
>
  {statusMesssage}
</p>
      </div>



      <button type="submit" className="primary-button md:col-span-2">
        Submit as Doctor
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
