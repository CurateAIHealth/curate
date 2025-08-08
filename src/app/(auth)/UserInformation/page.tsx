'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import UserDetail from '@/Components/HCAFULLProfileInformation/page';
import { GetUserCompliteInformation } from '@/Lib/user.action';
import PatientDashboard from '@/Components/PatientCompleteInformation/page';
import AdminDashboard from '@/Components/PatientCompleteInformation/page';

const UserDetailInfo = () => {
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const NameoftheClient=useSelector((state:any)=>state.ClientName)

  const userId = useSelector((state: any) => state?.UserDetails);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const result = await GetUserCompliteInformation(userId);

        const userInfo = result?.HCAComplitInformation;
        console.log("Test Uset Type---",userInfo)
        if (userInfo?.userType) {
          setUserType(userInfo.userType);
        } else {
          setUserType(null);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserInfo();
    else {
      console.warn("User ID not available");
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <p  className="h-screen flex items-center justify-center font-bold">Loading  {NameoftheClient} information...</p>;
  }

  const renderUserComponent = () => {
    switch (userType) {
      case "HCA":
        return <UserDetail />;
      case "patient":
        return <AdminDashboard/>
      case null:
        return <p  className="h-screen flex items-center justify-center font-bold">No user found.</p>;
      default:
        return <p  className="h-screen flex items-center justify-center font-bold">Unsupported user type.</p>;
    }
  };

  return <div>{renderUserComponent()}</div>;
};

export default UserDetailInfo;







