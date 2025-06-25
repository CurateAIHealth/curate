'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSelector } from 'react-redux';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {

      if (email === 'admin@curate.com' && password === 'password') {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 p-4">
      <section className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 text-center space-y-6 animate-fade-in">


        <div className="flex items-center justify-center ">
          <Image
            src="/Icons/Curate-logo.png"
            alt="Curate AI Health Logo"
            width={85}
            height={85}
            priority
            className="rounded-full pl-2 shadow-md transition-transform duration-300 hover:scale-110 "
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-800">
          Sign in to <span className="text-teal-600">Curate Digital AI Health</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-center p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 text-center rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-full shadow-lg transition duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="text-sm text-gray-700 mt-4">
          Don't have an account?{' '}
          <button
            onClick={handleRegisterRedirect}
            className="text-teal-600 font-semibold hover:underline"
          >
            Register here
          </button>
        </div>

      </section>
    </main>
  );
}