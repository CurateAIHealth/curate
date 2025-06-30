'use client';

interface UserTypeSelectorProps {
  userType: string;
  setUserType: (value: string) => void;
}

export default function UserTypeSelector({ userType, setUserType }: UserTypeSelectorProps) {
  const options = [
    { value: 'patient', label: 'Patient' },
    { value: 'patientFamily', label: 'Patient Family' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base font-medium text-gray-700 mb-4">
      {options.map(({ value, label }) => (
        <label key={value} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="userType"
            value={value}
            checked={userType === value}
            onChange={() => setUserType(value)}
            className="accent-teal-600"
          />
          <span>{label}</span>
        </label>
      ))}
    
    </div>
  );
}
