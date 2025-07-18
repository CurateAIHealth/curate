'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import Logo from '@/Components/Logo/page';
import { SignInRessult } from '@/Lib/user.action';

export default function SignIn() {
  const router = useRouter();
  const [signinStatus, setsigninStatus] = useState(true)
  const [error, setError] = useState('');
  const [loginInfo, setloginInfo] = useState({ Name: "Curate", Password: "Testing" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setsigninStatus(false)
    try {

      const Result:any = await SignInRessult(loginInfo)
      console.log("Test result---",Result)
      if(Result.success===false){
        setsigninStatus(true)
        setError(Result.message)
        return
      }

      if (Result !== null) {
        
        localStorage.setItem("UserId", Result)
        setsigninStatus(true)
        router.push("/")
      } else {
        setsigninStatus(true)
        setError("Wrong Credentials..")
      }

    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  const RestPassword = () => {
    router.push("/SendUpdatePasswordMail")
  }


  const UpdateLoginInfo = (e: any) => {
    setloginInfo({ ...loginInfo, [e.target.name]: e.target.value })
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 p-4">
      <section className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 text-center space-y-6 animate-fade-in">
        <Logo />

        <h1 className="text-3xl font-bold text-gray-800">
          Sign in to <div>
  <span style={{ color: '#50c896' }}>AI Digital</span>{' '}
  <span style={{ color: '#50c896' }}>Health</span>
</div>

        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="Email"
            name='Name'
            value={loginInfo.Name}
            onChange={UpdateLoginInfo}
            required
            className="w-full text-center p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="password"
            placeholder="Password"
            name='Password'
            value={loginInfo.Password}
            onChange={UpdateLoginInfo}
            required
            className="w-full p-2 text-center rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}


          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-full shadow-lg transition duration-300"
          >
            {signinStatus ? "Sign In" : "Verifying your details. Please wait..."}

          </button>
        </form>
        <div className='flex gap-4'>
          <div className="text-sm text-center text-gray-700 mt-4">
            Forgot Your Password ?{' '}
            <button
              onClick={RestPassword}
              className="text-[#50c896] font-semibold hover:underline hover:cursor-pointer"
            >
              Reset Password
            </button>
          </div>
          <div className="text-sm text-gray-700 mt-4">
            Don't have an account?{' '}
            <button
              onClick={handleRegisterRedirect}
className="text-[#50c896] font-semibold hover:underline hover:cursor-pointer"

            >
              Register here
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}