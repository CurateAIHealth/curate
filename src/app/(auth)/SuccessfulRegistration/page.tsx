'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessfulRegistration() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/sign-in');
    }, 4500);
    return () => clearTimeout(timer);
  }, [router]);

 

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4">
      <div className="bg-white border border-blue-200 shadow-xl rounded-3xl px-8 py-10 max-w-lg w-full text-center animate-fade-in-up">
        <div className="text-4xl mb-4 text-green-600">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
        <p className="text-gray-600 text-sm mb-6">
          Thanks for registering with <span className="font-semibold text-pink-500">Curate</span>{' '}
          <span className="text-teal-600 font-semibold">Digital AI Health</span>!<br />
          We'll notify you as soon as your verification is complete.
        </p>

        <p className="text-sm text-gray-600">
          Redirecting to sign-in page...{' '}
          <a href="/sign-in" className="text-blue-600 underline font-medium">click here</a> if it doesn't happen automatically.
        </p>
      </div>
    </main>
  );
}
