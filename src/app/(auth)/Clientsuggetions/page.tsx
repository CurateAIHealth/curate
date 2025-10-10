'use client'; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import SuitableHcpList from '@/Components/HCPSugetions/page';
import { GetRegidterdUsers, GetUsersFullInfo } from '@/Lib/user.action';

let cachedRegisteredUsers: any = null;
let cachedFullInfo: any = null;

const ClientSuggetions = () => {
  const [clientList, setClients] = useState([]);
  const [HCP, setHCP] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentClientUserId = useSelector((state: any) => state.Suggested_HCP);
  const updatedRefresh = useSelector((state: any) => state.updatedCount);
  const router = useRouter();

  useEffect(() => {
    if (!currentClientUserId) {
      router.push("/AdminPage");
      return;
    }

    const fetchData = async () => {
      setLoading(true);

  

      const [registeredUsers, fullInfo] = await Promise.all([
        cachedRegisteredUsers
          ? Promise.resolve(cachedRegisteredUsers)
          : GetRegidterdUsers(),
        cachedFullInfo
          ? Promise.resolve(cachedFullInfo)
          : GetUsersFullInfo(),
      ]);

     console.log("Test Trick----",cachedRegisteredUsers)
        
      if (!cachedRegisteredUsers) cachedRegisteredUsers=registeredUsers
        
      if (!cachedFullInfo) cachedFullInfo=fullInfo
       

  

const Filter_Data: any = (cachedRegisteredUsers || []).filter(
  (each: any) =>
    each && 
    each.userType === "patient" &&
   ( each.patientHomeAssistance||'') &&
    each.userId === currentClientUserId
);

setClients(Filter_Data)
    
  const filterProfilePic = (cachedFullInfo || []).map(
  (each: any) => each?.HCAComplitInformation ?? {}
);

const filterHCP = filterProfilePic.filter(
  (each: any) => each && each.userType === "HCA" && each.ProfessionalSkills
);


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







           