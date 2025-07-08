'use client';

import Logo from '@/Components/Logo/page';
import { GetUserInformation } from '@/Lib/user.action';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function AdminVerificationNotice() {
  const [isChecking, setIsChecking] = useState(false);
  const storedUserId = useSelector((state: any) => state.StoredUserId);
  const Router = useRouter()
  useEffect(() => {
    const Fetch = async () => {
      try {
        const ProfileInformation = await GetUserInformation(storedUserId)
       
        if (ProfileInformation?.Email !== "tsiddu805@gmail.com") {
          Router.push("/")
        }
      } catch (err: any) { }
    }
    Fetch()
  }, [])

  if (isChecking) {
    return (
      <div className='h-screen flex items-center justify-center font-bold'>
        Loading....
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D4FCF4] to-[#F0FFF4] px-6 py-12">
      <div className="max-w-3xl bg-white rounded-3xl shadow-xl p-10 text-center">
        <Logo />

        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          <span className="text-black">Admin Access </span>
          <span className="text-pink-500">Under </span>
          <span className="text-teal-600">Verification</span>
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Your administrative account is currently undergoing verification. This is part of our standard procedure to ensure that only authorized personnel are granted access to sensitive controls and data.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Our team is reviewing the provided credentials and will notify you once your access has been approved. This process typically takes a short time.
        </p>

        <p className="text-teal-600 font-semibold text-xl">
          Thank you for your cooperation. You will be informed as soon as the verification is complete.
        </p>
      </div>
    </div>
  );
}
