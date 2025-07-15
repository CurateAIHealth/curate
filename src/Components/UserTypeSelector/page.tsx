'use client';

interface UserTypeSelectorProps {
  userType: string;
  setUserType: (value: string) => void;
}

export default function UserTypeSelector({
  userType,
  setUserType,
}: UserTypeSelectorProps) {
  const options = [
    { value: 'patient', label: 'Patient' },
    { value: 'Organisation', label: 'Organisation' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'Healthcare Assistant', label: 'Healthcare Assistant' },
  ];

  return (
    <div
      className="
        flex flex-wrap sm:flex-nowrap               
        justify-center items-center
        gap-x-3 gap-y-2
        text-sm sm:text-base font-medium text-gray-700
        mb-4
      "
    >
      {options.map(({ value, label }) => (
        <label
          key={value}
          className="
            flex items-center space-x-1 cursor-pointer
            whitespace-nowrap                      /* prevent label line‑breaks */
          "
        >
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
