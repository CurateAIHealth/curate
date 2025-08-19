'use client';

import Logo from '@/Components/Logo/page';
import { useState } from 'react';

export default function StaticInfoPage() {



  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('UserId');
      window.location.href = '/'; 
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2 font-inter antialiased">
      <div className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl overflow-hidden bg-white p-2 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12">
          
          
          <div className="w-full hidden md:flex md:w-1/2 flex items-center justify-center">
       
          <img src='Icons/HomePageImage.png' className='rounded-full'/>
          </div>

     
          <div className="w-full md:w-1/2 text-left space-y-6">
            <div className="flex items-center space-x-4 mb-4">
              <Logo />
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                <span className="text-[#ff1493]">Curate</span> <span className="text-[#50c896]">Digital AI Health</span>
              </h1>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
Thank you for registering with <a className="text-[#ff1493]">Curate.</a> We truly appreciate your interest in our services. Our team is reviewing your details and will be reaching out to you shortly to assist you with the next steps. We look forward to connecting with you soon.
            </p>

            <div className="text-[#1392d3] font-bold text-xl leading-snug">
              #connecting rehab love ❤
            </div>

            <p className="text-gray-600 text-base leading-relaxed">
              Our mission is to provide comprehensive, personalized therapy treatments across various settings, from classroom and outpatient care to home-based and online solutions. We are excited to partner with you on your journey to better health.
            </p>

            <button
              className="mt-6 w-full md:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300 transform hover:-translate-y-1"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    
    </div>
  );
}
