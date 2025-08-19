'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import UserDetail from '@/Components/HCAFULLProfileInformation/page';
import { GetUserCompliteInformation, GetUserInformation } from '@/Lib/user.action';
import PatientDashboard from '@/Components/PatientCompleteInformation/page';
import AdminDashboard from '@/Components/PatientCompleteInformation/page';

const UserDetailInfo = () => {
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(true);
  const NameoftheClient=useSelector((state:any)=>state.ClientName)
const Router=useRouter()
  const userId = useSelector((state: any) => state?.UserDetails);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const result = await GetUserCompliteInformation(userId);
       const IntialValues=await GetUserInformation(userId);
        const userInfo = result?.HCAComplitInformation;
        if(IntialValues.userType=== "patient"&&!IntialValues.FinelVerification){
          Router.push("/PatientRegistration")
          return
        }
         if(IntialValues.userType=== "healthcare-assistant"&&!IntialValues.FinelVerification){
          Router.push("/HCARegistraion")
          return
        }
        if (userInfo?.userType) {
          setUserType(userInfo.userType);
        } else {
        setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setUserType("");
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
      case "":
        return <p  className="h-screen flex items-center justify-center font-bold">Loading  {NameoftheClient} information...</p>;

    }
  };

  return <div>{renderUserComponent()}</div>;
};

export default UserDetailInfo;







