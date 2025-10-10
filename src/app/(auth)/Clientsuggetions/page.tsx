'use client'

import SuitableHcpList from "@/Components/HCPSugetions/page";
import { GetRegidterdUsers, GetUsersFullInfo } from "@/Lib/user.action";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ClientSuggetions = () => {
  const [clientList, setClients] = useState([]);
  const [HCP, setHCP] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentClientUserId = useSelector((state: any) => state.Suggested_HCP);
  const updatedRefresh = useSelector((state: any) => state.updatedCount);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentClientUserId) {
        router.push("/AdminPage");
        return;
      }

      setLoading(true);

     
      let cachedRegisteredUsers = null;
      let cachedFullInfo = null;

      if (typeof window !== "undefined") {
        cachedRegisteredUsers = sessionStorage.getItem("registeredUsers");
        cachedFullInfo = sessionStorage.getItem("fullInfo");
      }

      const [registeredUsers, fullInfo] = await Promise.all([
        cachedRegisteredUsers
          ? Promise.resolve(JSON.parse(cachedRegisteredUsers))
          : GetRegidterdUsers(),
        cachedFullInfo
          ? Promise.resolve(JSON.parse(cachedFullInfo))
          : GetUsersFullInfo(),
      ]);

     
      if (typeof window !== "undefined") {
        if (!cachedRegisteredUsers)
          sessionStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
        if (!cachedFullInfo)
          sessionStorage.setItem("fullInfo", JSON.stringify(fullInfo));
      }

     
      const filterData = registeredUsers.filter(
        (each: any) =>
          each.userType === "patient" &&
          each.patientHomeAssistance &&
          each.userId === currentClientUserId
      );
      setClients(filterData);

      const filterProfilePic = fullInfo.map((each: any) => each?.HCAComplitInformation);
      const filterHCP = filterProfilePic.filter(
        (each: any) => each.userType === "HCA" && each.ProfessionalSkills
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
