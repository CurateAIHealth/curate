'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import SuitableHcpList from '@/Components/HCPSugetions/page';
import { GetRegidterdUsers, GetUserInformation, GetUsersFullInfo } from '@/Lib/user.action';
import { UpdateTimeStamp } from '@/Redux/action';

let cachedRegisteredUsers: any = null;
let cachedFullInfo: any = null;

const ClientSuggetions = () => {
  const [clientList, setClients] = useState([]);
  const [HCP, setHCP] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentClientUserId = useSelector((state: any) => state.Suggested_HCP);
  console.log("Id")
  const updatedRefresh = useSelector((state: any) => state.updatedCount);
  const router = useRouter();
  const dispatch = useDispatch()
  useEffect(() => {
    const Fetch = async () => {
      const localValue = localStorage.getItem('UserId');

      const Sign_in_UserInfo = await GetUserInformation(localValue)

      dispatch(UpdateTimeStamp(`${Sign_in_UserInfo.FirstName} ${Sign_in_UserInfo.LastName}, Email: ${Sign_in_UserInfo.Email}`))
    }
    Fetch()
  }, [])

  useEffect(() => {
    if (!currentClientUserId) {
      router.push("/AdminPage");
      return;
    }

    const fetchData = async () => {
      setLoading(true);


      if (updatedRefresh > 0) {
        cachedRegisteredUsers = null;
        cachedFullInfo = null;
      }

      const [registeredUsers, fullInfo] = await Promise.all([
        cachedRegisteredUsers ?? GetRegidterdUsers(),
        cachedFullInfo ?? GetUsersFullInfo(),
      ]);


      if (!cachedRegisteredUsers) cachedRegisteredUsers = registeredUsers;
      if (!cachedFullInfo) cachedFullInfo = fullInfo;


      const Filter_Data: any = (registeredUsers || []).filter(
        (each: any) =>
          each?.userType === "patient" &&
          (each?.patientHomeAssistance || "") &&
          each?.userId === currentClientUserId
      );

      console.log("Filtered Patient Data:", Filter_Data);
      setClients(Filter_Data);


      const filterProfilePic = (fullInfo || []).map(
        (each: any) => each?.HCAComplitInformation ?? {}
      );

      const filterHCP = filterProfilePic.filter(
        (each: any) =>
          each &&
          (each.userType === "HCA" ||
            each.userType === "healthcare-assistant") &&
          (each.ProfessionalSkills || each["Professional Skill"])
      );

      console.log("Filtered HCP Data:", filterHCP);
      setHCP(filterHCP);

      setLoading(false);
    };

    fetchData();
  }, [currentClientUserId, updatedRefresh, router]);


  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-12 w-12 rounded-full bg-gray-300 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">
          Loading Suggestions...
        </p>
      </div>
    );
  }

  return (
    <div>
      <SuitableHcpList clients={clientList} hcps={HCP} />
    </div>
  );
};

export default ClientSuggetions;







