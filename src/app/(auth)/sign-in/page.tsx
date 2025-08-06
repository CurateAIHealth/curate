'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/Components/Logo/page';
import { SignInRessult } from '@/Lib/user.action';
import { Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const [signinStatus, setsigninStatus] = useState(true);
  const [showPassword,setShowPassword]=useState(false)
  const [error, setError] = useState('');
  const [loginInfo, setLoginInfo] = useState({
    field_user: '',
    field_pass: ''
  });

 
  useEffect(() => {
    setLoginInfo({ field_user: '', field_pass: '' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setsigninStatus(false);
    try {
      const Result: any = await SignInRessult({
        Name: loginInfo.field_user,
        Password: loginInfo.field_pass,
      });

      console.log("Test result---", Result);

      if (Result.success === false) {
        setsigninStatus(true);
        setError(Result.message);
        return;
      }

      if (Result !== null) {
        localStorage.setItem("UserId", Result);
        setsigninStatus(true);
        router.push("/");
      } else {
        setsigninStatus(true);
        setError("Wrong Credentials..");
      }
    } catch (err) {
      setsigninStatus(true);
      setError('Invalid UserName or Password');
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  const RestPassword = () => {
    router.push("/SendUpdatePasswordMail");
  };

  const UpdateLoginInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 p-4">
      <section className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 text-center space-y-6 animate-fade-in">
        <Logo />

        <h1 className="text-3xl font-bold text-gray-800">
          Sign in to
          <div>
            <span style={{ color: '#50c896' }}>AI Digital</span>{' '}
            <span style={{ color: '#50c896' }}>Health</span>
          </div>
        </h1>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4 text-left">
   
          <input type="text" name="fakeusernameremembered" autoComplete="username" className="hidden" />
          <input type="password" name="fakepasswordremembered" autoComplete="new-password" className="hidden" />

          <input
            type="text"
            placeholder="Email"
            name="field_user"
            value={loginInfo.field_user}
            onChange={UpdateLoginInfo}
            autoComplete="off"
            required
            className="w-full text-center p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
         <div className="relative w-full">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    name="field_pass"
    value={loginInfo.field_pass}
    onChange={UpdateLoginInfo}
    autoComplete="new-password"
    required
    className="w-full p-2 pr-10 text-center rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
  />
  <div
    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
    onClick={() => setShowPassword(prev => !prev)}
  >
    {showPassword?<Eye />:<EyeOff />}
  </div>
</div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-full shadow-lg transition duration-300"
          >
            {signinStatus ? "Sign In" : "Verifying your details. Please wait..."}
          </button>
        </form>

        <div className="flex gap-4">
          <div className="text-sm text-center text-gray-700 mt-4">
            Forgot Your Password?{' '}
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
