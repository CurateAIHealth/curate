'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import SuitableHcpList from '@/Components/HCPSugetions/page';
import {
  GetRegidterdUsers,
  GetUserInformation,
  GetUsersFullInfo,
} from '@/Lib/user.action';
import { UpdateTimeStamp } from '@/Redux/action';

const ClientSuggetions = () => {
  const [clientList, setClients] = useState<any[]>([]);
  const [HCP, setHCP] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cacheRef = useRef<{ users: any[] | null; fullInfo: any[] | null }>({
    users: null,
    fullInfo: null,
  });

  const currentClientUserId = useSelector(
    (state: any) => state.Suggested_HCP
  );
  const updatedRefresh = useSelector((state: any) => state.updatedCount);

  const router = useRouter();
  const dispatch = useDispatch();


  // useEffect(() => {
  //   let mounted = true;

  //   const fetchUserInfo = async () => {
  //     try {
  //       const userId =
  //         typeof window !== 'undefined'
  //           ? localStorage.getItem('UserId')
  //           : null;

  //       if (!userId) return;

  //       const user = await GetUserInformation(userId);
  //       if (mounted) {
  //         dispatch(
  //           UpdateTimeStamp(
  //             `${user.FirstName} ${user.LastName}, Email: ${user.Email}`
  //           )
  //         );
  //       }
  //     } catch (err) {
  //       console.error('User info error', err);
  //     }
  //   };

  //   fetchUserInfo();
  //   return () => {
  //     mounted = false;
  //   };
  // }, [dispatch]);


  useEffect(() => {
    if (!currentClientUserId) {
      router.replace('/AdminPage');
      return;
    }

    let mounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        if (updatedRefresh > 0) {
          cacheRef.current.users = null;
          cacheRef.current.fullInfo = null;
        }

        const [users, fullInfo] = await Promise.all([
          cacheRef.current.users ?? GetRegidterdUsers(),
          cacheRef.current.fullInfo ?? GetUsersFullInfo(),
        ]);

        if (!cacheRef.current.users) cacheRef.current.users = users;
        if (!cacheRef.current.fullInfo) cacheRef.current.fullInfo = fullInfo;

        if (!mounted) return;

        const patient = users.filter(
          (u: any) =>
            u.userType === 'patient' &&
            u.userId === currentClientUserId &&
            u.patientHomeAssistance
        );

        const hcpList = fullInfo
          .map((f: any) => f?.HCAComplitInformation)
          .filter(
            (h: any) =>
              h &&
              (h.userType === 'HCA' ||
                h.userType === 'healthcare-assistant')
          );

        setClients(patient);
        setHCP(hcpList);
      } catch (err) {
        console.error('Fetch error', err);
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [currentClientUserId, updatedRefresh]);

  /* ---------- LOADING UI ---------- */
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-12 rounded-full bg-gray-300 mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto" />
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">
          Loading Suggestions...
        </p>
      </div>
    );
  }

  return <div>
    {Array.isArray(clientList) &&
 Array.isArray(HCP) &&
 clientList.length > 0 ? (
  <SuitableHcpList clients={clientList} hcps={HCP} />
) : (
  <div className="w-full py-10 text-center text-gray-500">
    No client data available
  </div>
)}
  </div>
};

export default ClientSuggetions;
