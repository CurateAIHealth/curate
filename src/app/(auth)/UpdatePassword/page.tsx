'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '@/Components/Logo/page';
import { useSearchParams } from 'next/navigation';

const validateStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const getStrengthColor = (score: number) => {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500 w-1/4';
    case 2:
      return 'bg-yellow-400 w-1/2';
    case 3:
      return 'bg-blue-500 w-3/4';
    case 4:
      return 'bg-green-500 w-full';
    default:
      return 'bg-gray-200 w-0';
  }
};

export default function PasswordResetForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
const PathURLUserId=useSearchParams()
  const strength = validateStrength(password);
const PathURLUserIdValue=PathURLUserId?.get("token")
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">\
        <Logo/>
        <h2 className="text-2xl font-semibold mb-6">
          Update <span className="text-pink-500">Your</span>{' '}
          <span className="text-teal-600">Password</span>
        </h2>

        <div className="relative mb-4">
          <input
            type={showPass ? 'text' : 'password'}
            className="w-full px-4 py-2 border border-teal-500 rounded-md focus:outline-none"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500 hover:text-teal-600"
            onClick={() => setShowPass((prev) => !prev)}
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <div className="mt-2 h-1 bg-gray-200 rounded overflow-hidden">
            <div className={`h-1 ${getStrengthColor(strength)} transition-all duration-300`} />
          </div>
        </div>

        <div className="relative mb-6">
          <input
            type={showConfirm ? 'text' : 'password'}
            className="w-full px-4 py-2 border border-teal-500 rounded-md focus:outline-none"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500 hover:text-teal-600"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
<p>{PathURLUserIdValue}</p>
        {confirmPassword && confirmPassword !== password && (
          <p className="text-red-500 text-sm mb-2">Passwords do not match.</p>
        )}

        <button
          className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all"
          disabled={password !== confirmPassword || strength < 3}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
