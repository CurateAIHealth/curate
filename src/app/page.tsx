'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCallback } from 'react';

export default function Home() {
  const router = useRouter();

  const handleRegister = useCallback(() => {
    router.push('/register');
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 px-4">
      <section className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center animate-fade-in space-y-6">
        
   
        <div className="flex justify-center">
          <Image
            src="/Icons/Curate-logo.png"
            alt="Curate AI Health Logo"
            width={80}
            height={80}
            priority 
            className="rounded-full shadow-md transition-transform duration-300 hover:scale-110"
          />
        </div>

        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          Register with <span className="text-teal-600">Curate Ai Health</span>
        </h1>

       
        <p className="text-gray-600 text-sm md:text-base">
          Start your journey with smarter health insights.
        </p>

     
        <button
          onClick={handleRegister}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-full transition duration-300 shadow-lg"
        >
          Register
        </button>
      </section>
    </main>
  );
}
