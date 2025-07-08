'use client';

import Logo from '@/Components/Logo/page';
import { GetUserInformation } from '@/Lib/user.action';
import { UpdateUserId } from '@/Redux/action';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function StaticInfoPage() {
  const [isChecking, setIsChecking] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const storedUserId = useSelector((state: any) => state.StoredUserId);

  useEffect(() => {
    const Fetch = async () => {
      const localValue = localStorage.getItem("UserId");
 dispatch(UpdateUserId(localValue));
      if (!localValue) {
        router.push("/sign-in");
        return;
      }

      try {
        const ProfileInformation = await GetUserInformation(localValue)

        console.log("Information---",ProfileInformation)
        if (ProfileInformation?.VerificationStatus === "Success") {
          router.push("/HomePage")

        }if(ProfileInformation?.Email==="tsiddu805@gmail.com"){
          router.push("/AdminPage")
        }
        
        else {
          setIsChecking(false);
        }
      } catch (err: any) {
        console.error("Fetch Error", err);
        router.push("/sign-in");
      }
    }
    Fetch()
  }, [dispatch, router]);

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
          <span className="text-black">Account </span>
          <span className="text-pink-500">Verification </span>
          <span className="text-teal-600">In Progress</span>
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Thank you for registering with <span className="font-semibold text-teal-600">Curate Digital AI Health</span>.
          Your account is currently under verification. This process helps us maintain a secure and trusted network for all users.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          We’ll notify you as soon as the verification is successfully completed. In the meantime, feel free to explore our platform and stay connected.
        </p>
<button onClick={()=>localStorage.removeItem("UserId")}>Logout</button>
        <p className="text-teal-600 font-semibold text-xl">
          We appreciate your patience and look forward to welcoming you soon!
        </p>
      </div>
    </div>
  );
}
