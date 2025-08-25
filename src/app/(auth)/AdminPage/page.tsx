'use client';

import {
  GetRegidterdUsers,
  GetUserCompliteInformation,
  GetUserInformation,
  GetUsersFullInfo,
  UpdateUserContactVerificationstatus,
  UpdateUserEmailVerificationstatus,
  UpdateUserVerificationstatus
} from '@/Lib/user.action';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { UpdateClient, UpdateUserInformation } from '@/Redux/action';
import { useDispatch } from 'react-redux';
import { filterColors, Filters } from '@/Lib/Content';

export default function UserTableList() {
  const [updatedStatusMsg, setUpdatedStatusMsg] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [UserFirstName, setUserFirstName] = useState("");
  const [UpdateduserType, setuserType] = useState("patient");
  const [search, setSearch] = useState('');
  const [LoginEmail, setLoginEmail] = useState("");


  const Status = ['Client Enquiry', 'Processing', 'Converted', 'Waiting List', 'Lost'];
  const EmailVerificationStatus = ['Verified', 'Pending'];
  const [UserFullInfo, setFullInfo] = useState([])
  const router = useRouter();
  const dispatch = useDispatch();

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
    Location: each.Location,
    Email: each.Email,
    Contact: each.ContactNumber,
    userId: each.userId,
    VerificationStatus: each.VerificationStatus,
    DetailedVerification: each.FinelVerification,
    EmailVerification: each.EmailVerification,
    ClientStatus: each.ClientStatus

  }));

  useEffect(() => {
    const Fetch = async () => {
      try {
        const localValue = localStorage.getItem("UserId");
        const ProfileInformation = await GetUserInformation(localValue);
        setUserFirstName(ProfileInformation.FirstName);
        setLoginEmail(ProfileInformation.Email);

        if (ProfileInformation?.Email?.toLowerCase() === "info@curatehealth.in") {
          setuserType("patient");
        }
        if (ProfileInformation?.Email?.toLowerCase() === "gouricurate@gmail.com") {
          setuserType("healthcare-assistant");
        }

        if (
          ProfileInformation?.Email?.toLowerCase() !== "admin@curatehealth.in" &&
          ProfileInformation?.Email?.toLowerCase() !== "info@curatehealth.in" &&
          ProfileInformation?.Email?.toLowerCase() !== "gouricurate@gmail.com"
        ) {
          router.push("/");
        }

        const RegisterdUsersResult = await GetRegidterdUsers();
        const FullInfo = await GetUsersFullInfo()
        setFullInfo(FullInfo)

        setUsers(RegisterdUsersResult || []);
        setIsChecking(false);
      } catch (err: any) {
        console.error(err);
      }
    };
    Fetch();
  }, [updatedStatusMsg]);

  const FilterUserType = (e: any) => {
    setuserType(e.target.value);
  };
const UpdateFilterValue=(UpdatedValue:any)=>{
setSearch(UpdatedValue)
}
  const ShowDompleteInformation = (userId: any, ClientName: any) => {
    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      router.push("/UserInformation");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('UserId');
    router.push('/');
  };

  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center font-bold text-gray-700 bg-gradient-to-tr from-[#ECF2FF] to-[#FBFAF5]">
        User Information Loading....
      </div>
    );
  }

  const UpdatedFilterUserType = Finel.filter((each) => {
    const matchesType = !UpdateduserType || each.userType === UpdateduserType;
    const matchesSearch =!search ||each.ClientStatus===search
    return matchesType && matchesSearch;
  });
  const FilterProfilePic: any = UserFullInfo.map((each: any) => { return each?.HCAComplitInformation })


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafc] via-[#e3f6f5] to-[#f9f9ff] text-gray-900 p-2">


      <div className="sticky top-0 z-50 bg-opacity-90 backdrop-blur-lg  mb-2">
        <div className="flex justify-between items-center mb-0 bg-white/90 rounded-xl p-2 shadow-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <img src="/Icons/Curate-logo.png" alt="Logo" className="w-12 h-12 rounded-xl" />
            <h1 className="text-2xl font-extrabold text-[#007B7F] tracking-tight leading-tight">
              Hi, <span className="text-[#ff1493]">{UserFirstName}</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
          >
            <LogOut size={22} /> Logout
          </button>
        </div>

       <div className="flex flex-col md:flex-row gap-4 justify-between mt-2">
  {UpdateduserType === "patient" && (
    <div className="flex gap-3 flex-wrap">
      {Filters.map((each, index) => (
        <button
          key={index}
          onClick={() => UpdateFilterValue(each)}
          className={`px-4 py-2 w-[200px] ${search===each&&"border-3"} rounded-xl  shadow-md font-medium transition-all duration-200 ${filterColors[each]}`}
        >
          {each}
        </button>
      ))}
    </div>
  )}


    <select
      value={UpdateduserType}
      onChange={FilterUserType}
      className="p-2 w-[120px] text-center rounded-xl bg-white shadow border border-gray-800 text-base font-medium focus:border-[#62e0d9] focus:ring-2 focus:ring-[#caf0f8] ml-auto"
    >
      <option value="patient">Patient</option>
      <option value="healthcare-assistant">HCA</option>
      <option value="doctor">Doctor</option>
    </select>
  
</div>

      </div>


      {UpdatedFilterUserType.length > 0 ? (
        <div className=" bg-white/90 rounded-2xl shadow-2xl border border-gray-100">
          <div className="max-h-[540px] overflow-y-auto overflow-x-hidden scrollbar-hide">

            <table className="min-w-full   text-[13px] text-left text-gray-700">
              <thead className="bg-[#f5faff] p-0 sticky top-0 z-10 ">
                <tr>

                  <th className="px-14 py-3 font-semibold tracking-wide text-xs text-gray-500 uppercase border-b border-gray-200">Name</th>
                  <th className="px-14 py-3 font-semibold tracking-wide text-xs text-gray-500 uppercase border-b border-gray-200">Email</th>
                  <th className="px-2 py-3 font-semibold tracking-wide text-xs text-gray-500 uppercase border-b border-gray-200">Contact</th>
                  <th className="px-2 py-3 font-semibold tracking-wide text-xs text-gray-500 uppercase border-b border-gray-200">Role</th>
                  <th className="px-2 py-3 font-semibold tracking-wide text-xs text-gray-500 uppercase border-b border-gray-200">Aadhar</th>
                  <th className="px-2 py-3 font-semibold tracking-wide text-xs text-gray-500 uppercase border-b border-gray-200">Location</th>
                  <th className="px-5 py-3 font-semibold tracking-wide text-xs text-gray-500 uppercase border-b border-gray-200">Email Verification</th>
                  { UpdateduserType!=="healthcare-assistant" && (
                    <th className="px-8 py-3 font-semibold tracking-wide text-xs text-gray-500 uppercase border-b border-gray-200">
                      Client Status
                    </th>
                  )}
                  <th className="px-8 py-3 font-semibold tracking-wide text-xs text-gray-500 uppercase border-b border-gray-200">
                    Action
                  </th>

                </tr>
              </thead>


              <tbody >
                {UpdatedFilterUserType.map((user, index) => (

                  <tr key={index} className="border-b  border-gray-100 even:bg-[#f8fafd] hover:bg-[#e7fbfc] transition-colors">
                    <td className="px-2 py-3 font-semibold text-[#007B7F] flex items-center gap-2">

                      <img src={FilterProfilePic.filter((each: any) => each.UserId === user.id)[0]?.Documents?.ProfilePic || FilterProfilePic.filter((each: any) => each.UserId === user.id)[0]?.ProfilePic || "Icons/DefaultProfileIcon.png"} className='rounded-full h-10 w-10' />
                      {user.FirstName}
                    </td>
                    <td className="px-2 py-3">{user.Email}</td>
                    <td className="px-2 py-3">{user.Contact}</td>
                    <td className="px-2 py-3"><span className="inline-block px-3 py-1 rounded-full bg-[#ecfefd] text-[#009688] font-semibold uppercase text-xs shadow-sm">{user.userType === "healthcare-assistant" ? "HCA" : user.userType}</span></td>
                    <td className="px-2 py-3">{user.AadharNumber}</td>
                    <td className="px-2 py-3">{user.Location}</td>
                    <td className="px-2 py-3">
                      <select
                        className="w-[150px] cursor-pointer text-center px-3 py-2 rounded-lg bg-[#f9fdfa] border border-gray-200 outline-none focus:border-[#00A9A5] focus:ring-1 focus:ring-[#62e0d9]"
                        defaultValue={user.EmailVerification ? 'Verified' : 'Pending'}
                        onChange={(e) =>
                          UpdateEmailVerificationStatus(user.FirstName, e.target.value, user.userId)
                        }
                      >
                        {EmailVerificationStatus.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>

                    { user.userType === "patient" &&
                      <td className="px-2 py-3">
                       
                          <select
      className={`px-4 py-2 w-[200px] border-2px rounded-xl text-center shadow-md font-medium transition-all duration-200 ${filterColors[user.ClientStatus]}`}
                            value={user.ClientStatus}
                            onChange={(e) =>
                              UpdateStatus(user.FirstName, e.target.value, user.userId)
                            }
                          >
                            {Status.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select> 

                      </td>}
                    <td className="px-2 py-3">
                      <button
                        className="group w-[100px] text-white bg-gradient-to-br cursor-pointer from-[#00A9A5] to-[#007B7F] hover:from-[#01cfc7] hover:to-[#00403e] rounded-lg px-2 py-2 transition-all duration-150 flex items-center justify-center"
                        title="View Details"
                        onClick={() => ShowDompleteInformation(user.userId, user.FirstName)}
                      >
                        {user.DetailedVerification ? "View" : "Fill"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      ) : (
        <p className="text-center py-10 text-gray-400 text-lg">No users found.</p>
      )}

      {updatedStatusMsg && (
        <div className="fixed bottom-6 left-126 bg-gradient-to-br from-[#00A9A5] to-[#005f61] border border-gray-200 text-white px-6 py-4 rounded-xl shadow-2xl font-semibold">
          {updatedStatusMsg}
        </div>
      )}
    </div>
  );
}
