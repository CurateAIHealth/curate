'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import UserDetail from '@/Components/HCAFULLProfileInformation/page';
import { GetUserCompliteInformation, GetUserInformation } from '@/Lib/user.action';
import PatientDashboard from '@/Components/PatientCompleteInformation/page';
import AdminDashboard from '@/Components/PatientCompleteInformation/page';

const UserDetailInfo = () => {
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  // ✅ Memoized Redux selectors to prevent unnecessary re-renders
  const userId = useSelector((state: any) => state?.UserDetails);
  const clientName = useSelector((state: any) => state?.ClientName);

  useEffect(() => {
    if (!userId) {
      console.warn('User ID not available');
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const [initialValues, result] = await Promise.all([
          GetUserInformation(userId),
          GetUserCompliteInformation(userId),
        ]);

        // Handle user redirections efficiently
        const userType = initialValues?.userType;
        const isVerified = initialValues?.FinelVerification;

        if (userType === 'patient' && !isVerified) {
          router.replace('/PatientInformation');
          return;
        }

        if (userType === 'healthcare-assistant' && !isVerified) {
          router.replace('/HCARegistraion');
          return;
        }

        const userInfo = result?.HCAComplitInformation;
        if (userInfo?.userType) {
          setUserType(userInfo.userType);
        } else {
          setUserType('');
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        setUserType('');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId, router]);

  // ✅ Memoized render logic to prevent unnecessary recalculations
  const renderUserComponent = useMemo(() => {
    switch (userType) {
      case 'HCA':
      case 'healthcare-assistant':
        return <UserDetail />;
      case 'patient':
        return <AdminDashboard />;
      default:
        return (
          <p className="h-screen flex items-center justify-center font-bold">
            Loading {clientName} information...
          </p>
        );
    }
  }, [userType, clientName]);

  if (loading) {
    return (
      <p className="h-screen flex items-center justify-center font-bold">
        Loading {clientName} information...
      </p>
    );
  }

  return <div>{renderUserComponent}</div>;
};

export default UserDetailInfo;
