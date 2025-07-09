'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '@/Components/Logo/page';
import { UpdatePassword } from '@/Lib/user.action';
import { useRouter } from 'next/navigation';


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
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
const router=useRouter()
  

    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token') || '');
  }, []);

  const validateStrength = useCallback((password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, []);

  const strength = useMemo(() => validateStrength(password), [password, validateStrength]);

  const handleUpdatePassword = useCallback(async () => {
    setError('');
    if (!token) return setError('Invalid or missing token.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (strength < 3) return setError('Password is too weak.');

    try {
      const payload:any = {
        UpdatedUserid: token,
        NewUpdatedPassword: password,
        NewConfirmUpdatedPassword: confirmPassword,
      };

      const result:any = await UpdatePassword(payload);

      if (result.success) {
        setSuccess('Password updated successfully. Redirecting to Sign-in page....');
        setTimeout(() => {
         router.push( '/sign-in')
        }, 2500);
      } else {
        setError(result?.message || 'Update failed.');
      }
    } catch (err) {
  
      setError('Something went wrong.');
    }
  }, [token, password, confirmPassword, strength]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <Logo />
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
            <div
              className={`h-1 ${getStrengthColor(strength)} transition-all duration-300`}
            />
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

      
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

      
        <button
          onClick={handleUpdatePassword}
          className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all disabled:opacity-60"
          disabled={!password || password !== confirmPassword || strength < 3}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
