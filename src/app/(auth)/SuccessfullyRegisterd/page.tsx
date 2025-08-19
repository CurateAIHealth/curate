'use client';

import Logo from '@/Components/Logo/page';
import { motion } from 'framer-motion';

export default function StaticInfoPage() {
    const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('UserId');
      window.location.href = '/'; 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] font-inter relative overflow-hidden">
      
     
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#50c896] rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-[#ff1493] rounded-full blur-3xl opacity-25"></div>
      
   
      <header className="w-full flex items-center justify-between p-2 md:px-12 z-10">
        <Logo />
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white rounded-full font-medium shadow-md hover:bg-red-600 transition"
        >
          Log out
        </button>
      </header>

  
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 z-10">
        
    
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-extrabold text-gray-900"
        >
          🚀 Coming Soon
        </motion.h1>

    
        <motion.img
          src="Icons/HomePageImage.png"
          alt="Curate Illustration"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-64 md:w-50 h-50 mt-4 mb-8 drop-shadow-2xl rounded-2xl"
        />

    
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl text-md md:text-md text-gray-700 leading-relaxed"
        >
          We’re in the process of creating a fresh and engaging website experience for you. 
          Our team is working diligently on the design, and we’ll be going live very shortly. 
          Thank you for your patience and excitement — we can’t wait to share it with you!
        </motion.p>

        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 text-[#1392d3] font-bold text-xl"
        >
          #connecting rehab love ❤
        </motion.div>

    
      </main>

    
      <footer className="w-full py-4 text-center text-sm text-gray-500 border-t z-10 bg-white/50 backdrop-blur">
        © {new Date().getFullYear()} Curate Digital AI Health. All rights reserved.
      </footer>
    </div>
  );
}
