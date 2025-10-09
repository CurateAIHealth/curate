'use client'

import SuitableHcpList from "@/Components/HCPSugetions/page"
import { GetRegidterdUsers, GetUsersFullInfo } from "@/Lib/user.action"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const ClientSuggetions = () => {
    const [clientList, setclients] = useState([])
    const [HCP, setHCP] = useState([])
    const [loading, setLoading] = useState(true);
    const Curennt_Client_Userid=useSelector((state:any)=>state.Suggested_HCP)
    const Router=useRouter()
    console.log("Test Userid----",Curennt_Client_Userid)
    const updatedRefresh=useSelector((afterEach:any)=>afterEach.updatedCount)
    useEffect(() => {
        const Fetch = async () => {

          if(Curennt_Client_Userid===''){
            Router.push("/AdminPage")
          }
            const RegisterdUsersResult = await GetRegidterdUsers();

            const FullInfo: any = await GetUsersFullInfo();
            const Filter_Data: any = RegisterdUsersResult.filter((each) => each.userType === "patient" && each.patientHomeAssistance&&each.userId===Curennt_Client_Userid)
            console.log("Test Reg Users---", Filter_Data)
            setclients(Filter_Data)
            const FilterProfilePic: any = FullInfo.map((each: any) => { return each?.HCAComplitInformation });



            console.log('Test Registerd Userss---', FilterProfilePic.filter((each: any) => each.userType === "HCA" && each.ProfessionalSkills))
            const FilterHCP = FilterProfilePic.filter((each: any) => each.userType === "HCA" && each.ProfessionalSkills)
            setHCP(FilterHCP)
            setLoading(false)
        }

        Fetch()
    }, [updatedRefresh])
    if (loading) {
    return (
     <div className="w-full  max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
  <div className="animate-pulse flex flex-col space-y-4">
  
    <div className="h-12 w-12 rounded-full bg-gray-300 mx-auto"></div>

 
    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
    <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
  </div>
  <p className="text-center text-gray-500 text-sm mt-4">Loading Suggetions...</p>
</div>

    );
  }
    return (
        <div >
            <SuitableHcpList clients={clientList} hcps={HCP} />;
</div>
    )
}

export default ClientSuggetions