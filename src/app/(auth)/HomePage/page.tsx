'use client'; 

import Logo from '@/Components/Logo/page';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function StaticInfoPage() {
  const router = useRouter();
  const handleLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('UserId');
    window.location.href = '/'; 
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D4FCF4] to-[#F0FFF4] px-6 py-12">
      <div className="max-w-3xl bg-white rounded-3xl shadow-xl p-10 text-center">
       <Logo />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          <span className="text-black">Welcome to </span>
          <span className="text-pink-500">Curate </span>
          <span className="text-teal-600">Digital AI Health</span>
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          We are building a network to make a difference in healthcare and rehab communities to get a holistic approach for medical & rehab treatments.
          This includes Modern Medicine, Ayurveda, Physiotherapy, Speech & Language Therapy, Behavior Therapy, Occupational Therapy, Nutrition, Yoga & Meditation, Music Therapy, and Psychology.
        </p>

        <p className="text-teal-600 font-semibold text-xl mb-2">#connecting rehab love ❤</p>

        <p className="text-gray-700 text-lg leading-relaxed">
          Our aim is to create classroom, outpatient, inpatient, daycare, home-based, and online therapy treatments for individuals.
        </p>
          <button
    className="mt-8 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
    onClick={handleLogout}
  >
    Logout
  </button>
      </div>
    
    </div>
  );
}
