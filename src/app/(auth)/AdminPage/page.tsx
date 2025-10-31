'use client';

import {
  GetRegidterdUsers,
  GetUserInformation,
  GetUsersFullInfo,
  InserTimeSheet,
  UpdateHCAnstatus,
  UpdateUserContactVerificationstatus,
  UpdateUserEmailVerificationstatus
} from '@/Lib/user.action';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircleCheckBig, LogOut } from 'lucide-react';
import {  Update_Main_Filter_Status, UpdateClient, UpdateClientSuggetion, UpdateSubHeading, UpdateUserInformation } from '@/Redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { ClientEnquiry_Filters, filterColors, Main_Filters, Payments_Filters, Placements_Filters, ReferralPay_Filters, Timesheet_Filters } from '@/Lib/Content';

import { select, tr } from 'framer-motion/client';
import ClientTable from '@/Components/Placements/page';
import { HCAList } from '@/Redux/reducer';
import WorkingOn from '@/Components/CurrentlyWoring/page';
import axios from 'axios';
import { setTimeout } from 'timers/promises';
import { decrypt, encrypt } from '@/Lib/Actions';
let cachedUserInfo: any = null;
let cachedRegisteredUsers: any[] | null = null;
let cachedFullInfo: any[] | null = null;
export default function UserTableList() {
  const [updatedStatusMsg, setUpdatedStatusMsg] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [UserFirstName, setUserFirstName] = useState("");
  const [UpdateduserType, setuserType] = useState("patient");
  const [search, setSearch] = useState('');
  const [AsignStatus,setAsignStatus]=useState("")
  const [LoginEmail, setLoginEmail] = useState("");

  const Status = ['Placced','Client Enquiry', 'Processing', 'Converted', 'Waiting List', 'Lost'];
  const EmailVerificationStatus = ['Verified', 'Pending'];
  const [UserFullInfo, setFullInfo] = useState([])
  const router = useRouter();
  const dispatch = useDispatch();
const UpdateMainFilter=useSelector((state:any)=>state.Main_Filter)
const CurrentClientStatus=useSelector((state:any)=>state.Submitted_Current_Status)
const UserTypeFromGlobelState=useSelector((state:any)=>state.ViewHCPList)
const CurrentCount=useSelector((state:any)=>state.updatedCount)
  const UpdateStatus = async (first: string, e: string, UserId: any) => {
    setUpdatedStatusMsg(`Updating ${first} Contact Status....`);
    try {
      const res = await UpdateUserContactVerificationstatus(UserId, e);
      if (res?.success === true) {
        setUpdatedStatusMsg(`${first} Verification Status Updated Successfully`);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const UpdateEmailVerificationStatus = async (first: string, e: string, UserId: any) => {
    setUpdatedStatusMsg(`Updating ${first} Email Verification Status....`);
    try {
      const res = await UpdateUserEmailVerificationstatus(UserId, e);
      if (res?.success === true) {
        setUpdatedStatusMsg(`${first} Email Verification Status Updated Successfully`);
      }
      
    } catch (err: any) {
      console.error(err);
    }
  };

  const Finel = users.map((each: any) => ({
    id: each.userId,
    FirstName: each.FirstName,
    AadharNumber: each.AadharNumber,
    Age: each.Age,
    userType: each.userType,
    Location: each.Location||each.serviceLocation,
    Email: each.Email,
    Contact: each.ContactNumber,
    userId: each.userId,
    VerificationStatus: each.VerificationStatus,
    DetailedVerification: each.FinelVerification,
    EmailVerification: each.EmailVerification,
    ClientStatus: each.ClientStatus,
    Status:each.Status
  }));
console.log("Current Test Data-----",Finel)
 useEffect(() => {
     const Fetch = async () => {
       try {
         const localValue = localStorage.getItem('UserId');
 
         const [profile, registeredUsers, fullInfo] = await Promise.all([
           cachedUserInfo ? Promise.resolve(cachedUserInfo) : GetUserInformation(localValue),
           cachedRegisteredUsers ? Promise.resolve(cachedRegisteredUsers) : GetRegidterdUsers(),
           cachedFullInfo ? Promise.resolve(cachedFullInfo) : GetUsersFullInfo()
         ]);
 
         if (!cachedUserInfo) cachedUserInfo = profile;
         if (!cachedRegisteredUsers) cachedRegisteredUsers = registeredUsers;
         if (!cachedFullInfo) cachedFullInfo = fullInfo;
 
         setUserFirstName(profile.FirstName);
         setLoginEmail(profile.Email);
 
         if (profile?.Email?.toLowerCase() === 'info@curatehealth.in') setuserType('patient');
         if (profile?.Email?.toLowerCase() === 'gouricurate@gmail.com') setuserType('healthcare-assistant');
 
         if (
           profile?.Email?.toLowerCase() !== 'admin@curatehealth.in' &&
           profile?.Email?.toLowerCase() !== 'info@curatehealth.in' &&
           profile?.Email?.toLowerCase() !== 'gouricurate@gmail.com'
         ) {
           router.push('/');
         }
 
         setuserType(UserTypeFromGlobelState);
         setFullInfo(fullInfo);
         setSearch(CurrentClientStatus);
         setUsers((registeredUsers || []).reverse());
         setIsChecking(false);
       } catch (err: any) {
         console.error(err);
       }
     };
     Fetch();
   }, [updatedStatusMsg, UserTypeFromGlobelState, CurrentClientStatus]);

  const FilterUserType = (e: any) => {
    if(e.target.value!=="patient"){
       setuserType(e.target.value);
       setSearch("")
    }
   
    setuserType(e.target.value);
  };

  const UpdateFilterValue = (UpdatedValue: any) => {
    setSearch(UpdatedValue)
    dispatch(UpdateSubHeading(UpdatedValue))
  };

  const UpdateMainFilterValue=(Z:any)=>{

    // SetUpdateMainFilter(Z)
    dispatch(Update_Main_Filter_Status(Z))
  }
useEffect(() => {UpdateAssignHca
  if (UpdateMainFilter === "Client Enquiry") {
    setSearch(""); 
  }
}, [UpdateMainFilter,CurrentCount]);

  const UpdateMainFilterValues = () => {
    switch (UpdateMainFilter) {
      case "Client Enquiry":
              
        return ClientEnquiry_Filters;
      case "Deployment":
        return Placements_Filters;
      case "Timesheet":
        return Timesheet_Filters
      case "Referral Pay":
        return ReferralPay_Filters;
      case "Payments":
        return Payments_Filters;
      default:
        return []

    }
  }


  const UpdateFilterHCA=(e:any)=>{
setAsignStatus(e.target.value)
  }
  
  const ContetUserInterface=()=>{
      switch (UpdateMainFilter) {
      case "Client Enquiry":
        return ClientEnquiryUserInterFace()
      case "Deployment":
        return <ClientTable/>
      case "Timesheet":
        return <WorkingOn ServiceName="Timesheet"/>
      case "Referral Pay":
        return <WorkingOn ServiceName="Referral Pay"/>
      case "Payments":
        return <WorkingOn ServiceName="Payments"/>
      default:
        return null

    }
  }
const sendWhatsApp = async (clientNumber: string, hcaNumber: string) => {
  const res = await axios.post("/api/send-whatsapp", {
    clientNumber,
    hcaNumber,
  });


};



  const UpdateAssignHca = async (UserIDClient: any, UserIdHCA: any, ClientName: any, ClientEmail: any, ClientContact: any,Adress:any, HCAName: any, HCAContact: any) => {
    setUpdatedStatusMsg("Please Wait Assigning HCA...")
    try {
      const today = new Date();
      const attendanceRecord = {
        date: today.toLocaleDateString('EN-In'),
        checkIn: today.toLocaleTimeString(),
        status: "Present",
      };

    
      const TimeSheetData: any[] = [];
      TimeSheetData.push(attendanceRecord)
      const UpdateStatus=await UpdateUserContactVerificationstatus(UserIDClient,"Placced")
      const UpdateHcaStatus= await UpdateHCAnstatus(UserIdHCA,"Assigned")
      const PostTimeSheet:any = await InserTimeSheet(UserIDClient, UserIdHCA, ClientName, ClientEmail, ClientContact,Adress, HCAName, HCAContact, TimeSheetData)
      if(PostTimeSheet.success=== true){
setUpdatedStatusMsg("HCA Assigned Successfully, For More Information Check in Placemets")

sendWhatsApp("+919347877159","+919347877159"); 




      }
      
    } catch (err: any) {
setUpdatedStatusMsg(err)
    }
  }

const ClientEnquiryUserInterFace = () => {
  return (
    <div className="w-full">
      {UpdatedFilterUserType.length > 0 ? (
        <div className="bg-white/90 rounded-2xl shadow-2xl border border-gray-100">
          <div className="max-h-[540px] overflow-y-auto">
            {/* ✅ Scrollable container only for mobile */}
            <div className="w-full overflow-x-auto sm:overflow-x-hidden">
              <table className="table-fixed w-full min-w-[800px] text-[11px] sm:text-[13px] text-left text-gray-700 border-collapse">
                <thead className="bg-[#f5faff] sticky top-0 z-10">
                  <tr>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 w-[14%]">Name</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 w-[18%]">Email</th>
                    <th className="px-2 py-2 w-[12%]">Contact</th>
                    {/* <th className="px-2 py-2 w-[10%]">Role</th>
                    <th className="px-2 py-2 w-[12%]">Aadhar</th> */}
                    <th className="px-2 py-2 w-[12%]">Location</th>
                    <th className="px-2 py-2 w-[14%]">Email Verification</th>
                    {UpdateduserType !== "healthcare-assistant" && (
                      <th className="px-4 py-2 w-[14%]">Client Status</th>
                    )}
                    {UpdateMainFilter === "Client Enquiry" && search === "Converted" && (
                      <th className="px-2 py-2 w-[14%]">Designate</th>
                    )}
                    <th className="px-4 py-2 w-[10%]">Action</th>
                    {UpdateduserType==='patient'&&<th className="px-2 py-2 w-[10%]">Suitable HCP</th>}
                       
                  </tr>
                </thead>
                <tbody>
                  {UpdatedFilterUserType.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 even:bg-[#f8fafd] hover:bg-[#e7fbfc] transition-colors"
                    >
                      <td className="px-2 py-2 truncate">
                        <div className="flex items-center gap-2">
                          {/* <img
                            src={
                              FilterProfilePic.filter((each:any) => each.UserId === user.id)[0]?.Documents?.ProfilePic ||
                              FilterProfilePic.filter((each:any) => each.UserId === user.id)[0]?.ProfilePic ||
                              "Icons/DefaultProfileIcon.png"
                            }
                            className="rounded-full h-7 w-7 sm:h-10 sm:w-10 object-cover"
                          /> */}
                          <span className="font-semibold text-[#007B7F] truncate">
                            {user.FirstName}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-2 break-words">{user.Email}</td>
                      <td className="px-2 py-2">+91{user.Contact}</td>
                      {/* <td className="px-2 py-2">
                        <span className="px-2 sm:px-3 py-1 rounded-full bg-[#ecfefd] text-[#009688] font-semibold uppercase text-[9px] sm:text-xs">
                          {user.userType === "healthcare-assistant" ? "HCA" : user.userType}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        {user.AadharNumber ? user.AadharNumber : "Aadhaar Pending"}
                      </td> */}
                      <td className="px-2 py-2 break-words">{user.Location}</td>
                      <td className="px-2 py-2">
                        <select
                          className="w-full text-center px-2 py-1 rounded-lg bg-[#f9fdfa] border border-gray-200 cursor-pointer text-xs sm:text-sm"
                          defaultValue={user.EmailVerification ? "Verified" : "Pending"}
                          onChange={(e) =>
                            UpdateEmailVerificationStatus(user.FirstName, e.target.value, user.userId)
                          }
                        >
                          {EmailVerificationStatus.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      {user.userType === "patient" && (
                        <td className="px-2 py-2">
                          <select
                            className={`w-full px-2 py-2 rounded-xl text-center font-medium transition-all duration-200 cursor-pointer ${
                              user.ClientStatus === "Placced"
                                ? "text-[13px] font-bold shadow-lg"
                                : "shadow-md"
                            } ${filterColors[user.ClientStatus]}`}
                            value={user.ClientStatus}
                            onChange={(e) => UpdateStatus(user.FirstName, e.target.value, user.userId)}
                          >
                            {Status.map((status) => (
                              <option key={status} value={status}>
                                {status === "Placced" ? "Placced ✅" : status}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}
                      {UpdateMainFilter === "Client Enquiry" && search === "Converted" && (
                        <td className="px-2 py-2">
                          <select
                            onChange={(e) => {
                              const selectedHCA = Filter_HCA.find(
                                (each) => each.FirstName === e.target.value
                              );
                              UpdateAssignHca(
                                user.id,
                                selectedHCA?.id,
                                user.FirstName,
                                user.Email,
                                user.Contact,
                                user.Location,
                                selectedHCA?.FirstName,
                                selectedHCA?.Contact
                              );
                            }}
                            className="w-full text-center px-2 py-1 rounded-lg bg-[#f9fdfa] border border-gray-200 cursor-pointer text-xs sm:text-sm"
                          >
                            <option>Assign HCA</option>
                            {Filter_HCA.map((each) => (
                              <option key={each.FirstName}>{each.FirstName}</option>
                            ))}
                          </select>
                        </td>
                      )}
                      <td className="px-2 py-2">
                        <button
                          className="w-full text-white bg-gradient-to-br from-[#00A9A5] to-[#007B7F] hover:from-[#01cfc7] hover:to-[#00403e] rounded-lg px-2 py-2 transition cursor-pointer text-xs sm:text-sm"
                          onClick={() => ShowDompleteInformation(user.userId, user.FirstName)}
                        >
                          {user.DetailedVerification ? "View" : "Preview"}
                        </button>
                      </td>
                         {UpdateduserType==='patient'&&
                      <td className="md:px-8 md:py-2">
                     
                         <button
onClick={()=>UpdateNavigattosuggetions(user.userId)}
            className="flex   cursor-pointer items-center gap-2 w-full sm:w-auto justify-center  py-2
 text-white   shadow-lg rounded-full h-10 text-[9px] transition-all duration-150"
          >
            <img src="Icons/HCP.png" className='h-10 w-10 rounded-full'/>
          </button>
                      </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center py-10 text-gray-400 text-base sm:text-lg">No users found.</p>
      )}

      {updatedStatusMsg && (
        <div className="fixed bottom-4 sm:bottom-6 left-3 sm:left-10 bg-gradient-to-br from-[#00A9A5] to-[#005f61] text-white px-3 sm:px-6 py-2 sm:py-4 rounded-xl shadow-2xl font-semibold text-xs sm:text-base z-50 max-w-[90vw] sm:max-w-xs">
          {updatedStatusMsg}
        </div>
      )}
    </div>
  );
};



  const ShowDompleteInformation = (userId: any, ClientName: any) => {
    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      router.push("/UserInformation");
    }
  };

  

const handleLogout = () => {
  router.push('/DashBoard'); 
       
};


  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center font-bold text-gray-700 bg-gradient-to-tr from-[#ECF2FF] to-[#FBFAF5]">
         {UpdateMainFilter} Information Loading....
      </div>
    );
  }

  const UpdatedFilterUserType = Finel.filter((each) => {
    const matchesType = !UpdateduserType || each.userType === UpdateduserType;
    const matchesSearch = !search || each.ClientStatus === search;
    return matchesType && matchesSearch;
  });

const Filter_HCA = Finel.filter((each:any) => {
  const isHCA = each.userType === "healthcare-assistant"; 
  const isAvailable = each.Status !== "Assigned";         
  const matchesName =
    !AsignStatus || each.FirstName.toLowerCase().includes(AsignStatus.toLowerCase()); 

  return isHCA && isAvailable && matchesName;
});


const UpdateNavigattosuggetions=(D:any)=>{
  router.push("/Clientsuggetions")
  dispatch(UpdateClientSuggetion(D))
}



  const FilterProfilePic: any = UserFullInfo.map((each: any) => { return each?.HCAComplitInformation });
console.log('Test Registerd Userss---',users)


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafc] via-[#e3f6f5] to-[#f9f9ff] text-gray-900 p-2 ">

    
      <div className="sticky top-0 z-50 bg-opacity-90 backdrop-blur-lg mb-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/90 rounded-xl p-3 shadow-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <img src="/Icons/Curate-logo.png" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl" />
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#007B7F] tracking-tight leading-tight">
              Hi, <span className="text-[#ff1493]">{UserFirstName}</span>
            </h1>
          </div>
         
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
          >
            <LogOut size={20} /> DashBoard
          </button>
        </div>

       
       <div className="flex flex-col md:flex-row gap-4 justify-between mt-2">
          {/* {UpdateduserType === "patient" && (
            <div className="flex gap-2 flex-wrap w-full sm:w-auto">
              {Filters.map((each, index) => (
                <button
                  key={index}
                  onClick={() => UpdateFilterValue(each)}
                  className={` cursor-pointer px-3 py-2 text-sm sm:text-base flex-1 sm:flex-none sm:min-w-[160px] ${search === each && "border-3"} rounded-xl shadow-md font-medium transition-all duration-200 ${filterColors[each]}`}
                >
                  {each}
                </button>
              ))}
            </div>
          )} */}
          {UpdateduserType==="patient"&&
<div className="flex  flex-col gap-2 flex-wrap w-full ">
 {/* <div className="flex gap-3 flex-wrap w-full sm:w-auto">
  {Main_Filters.map((each, index) => {


    return (
      <button
        key={index}
        onClick={() => UpdateMainFilterValue(each)}
        className={`px-4 py-2 rounded-xl shadow-md font-medium text-sm sm:text-base 
          transition-all duration-200 flex-1 sm:flex-none sm:min-w-[160px]
          ${
            each===UpdateMainFilter
 ? "bg-[#50c896] text-white border border-white-700 scale-105"
 
    : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 hover:scale-105"
          }
        `}
      >
        {each === "Client Enquiry"
          ? `${each} (${Finel.filter((item) => item.userType === "patient").length})`
          : each}
      </button>
    );
  })}
</div> */}

           <div className="flex gap-2 flex-wrap w-full items-center">

  <div className="flex gap-2 flex-wrap">

    {UpdateMainFilterValues().map((each: any, index: any) => (
      <button
        key={index}
        onClick={() => UpdateFilterValue(each)}
        className={`cursor-pointer px-1 py-1 text-xs flex-1 sm:flex-none sm:min-w-[100px] ${
          search === each && "border-3"
        } rounded-xl shadow-md font-medium transition-all duration-200 ${
          filterColors[each]
        }`}
      >
        {UpdateMainFilter === "Client Enquiry"
          ? `${each} (${
              UpdatedFilterUserType.filter(
                (Try) => Try.ClientStatus === each
              ).length
            })`
          : each}
      </button>
    ))}
  </div>

  
  {UpdateMainFilter === "Client Enquiry" && search === "Converted" && (
    <input
      placeholder="Search HCA..."
      className="text-center border-2 rounded-md w-[150px] ml-auto"
      onChange={UpdateFilterHCA}
    />
  )}
</div>

             
            </div>}
          {/* <button
onClick={()=>UpdateNavigattosuggetions()}
            className="flex mt-7 cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-2 py-2 bg-gradient-to-br from-[#10b981] to-[#065f46] hover:from-[#34d399] hover:to-[#064e3b]
 text-white rounded-xl  hover:shadow-lg hover:rounded-full h-8 text-[9px] transition-all duration-150"
          >
            Show Placement Suggetions
          </button> */}
          <select
            value={UpdateduserType}
            onChange={FilterUserType}
      className={`p-2 h-10 w-[120px] ${UpdateduserType==="patient"?"mt-6":"mt-0"} cursor-pointer text-center rounded-xl bg-white shadow border border-gray-800 text-base font-medium focus:border-[#62e0d9] focus:ring-2 focus:ring-[#caf0f8] ml-auto`}
          >
            <option value="patient">Patient</option>
            <option value="healthcare-assistant">HCA</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
      </div>



{ContetUserInterface()}




    </div>
  );
}
function each(value: { id: any; FirstName: any; AadharNumber: any; Age: any; userType: any; Location: any; Email: any; Contact: any; userId: any; VerificationStatus: any; DetailedVerification: any; EmailVerification: any; ClientStatus: any; }, index: number, array: { id: any; FirstName: any; AadharNumber: any; Age: any; userType: any; Location: any; Email: any; Contact: any; userId: any; VerificationStatus: any; DetailedVerification: any; EmailVerification: any; ClientStatus: any; }[]): value is { id: any; FirstName: any; AadharNumber: any; Age: any; userType: any; Location: any; Email: any; Contact: any; userId: any; VerificationStatus: any; DetailedVerification: any; EmailVerification: any; ClientStatus: any; } {
  throw new Error('Function not implemented.');
}



