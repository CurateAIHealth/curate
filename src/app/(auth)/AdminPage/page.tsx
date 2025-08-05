'use client';

import Logo from '@/Components/Logo/page';
import {
  GetRegidterdUsers,
  GetUserInformation,
  UpdateUserEmailVerificationstatus,
  UpdateUserVerificationstatus
} from '@/Lib/user.action';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { UpdateUserInformation } from '@/Redux/action';
import { useDispatch } from 'react-redux';

export default function UserTableList() {
  const [updatedStatusMsg, setUpdatedStatusMsg] = useState('');
  const [users, setUsers] = useState([]);
  const [isChecking, setIsChecking] = useState(true);
  const [UserFirstName,setUserFirstName]=useState("")
const [UpdateduserType,setuserType]=useState("")
  const Status = ['Pending', 'Success', 'Block'];
  const EmailVerificationStatus = ['Verified', 'Pending'];

  const router = useRouter();
  const dispatch = useDispatch();

  const UpdateStatus = async (first: string, e: string, UserId: any) => {
    setUpdatedStatusMsg(`Updating ${first} Verification Status....`);
    try {
      const res = await UpdateUserVerificationstatus(UserId, e);
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
    FirstName: each.FirstName,
    AadharNumber: each.AadharNumber,
    Age: each.Age,
    userType: each.userType,
    Location: each.Location,
    Email: each.Email,
    Contact: each.ContactNumber,
    userId: each.userId,
    VerificationStatus: each.VerificationStatus,
    EmailVerification: each.EmailVerification
  }));

  const tableHeaders = Finel.length > 0 ? Object.keys(Finel[0]).filter((each) => !['userId', 'VerificationStatus', 'EmailVerification'].includes(each)) : [];

  useEffect(() => {
    const Fetch = async () => {
      try {
        const localValue = localStorage.getItem("UserId");
        const ProfileInformation = await GetUserInformation(localValue);
        setUserFirstName(ProfileInformation.FirstName)


        if( ProfileInformation?.Email?.toLowerCase() === "info@curatehealth.in"){
          setuserType("patient")
        }

        if( ProfileInformation?.Email?.toLowerCase() === "gouricurate@gmail.com"){
          setuserType("healthcare-assistant")
        }
      
    if (
  ProfileInformation?.Email?.toLowerCase() !== "admin@curatehealth.in" &&
  ProfileInformation?.Email?.toLowerCase() !== "info@curatehealth.in" &&
    ProfileInformation?.Email?.toLowerCase() !== "gouricurate@gmail.com"
) {
  router.push("/");
}

        const RegisterdUsersResult = await GetRegidterdUsers();
        setUsers(RegisterdUsersResult || []);
        setIsChecking(false);
      } catch (err: any) {
        console.error(err);
      }
    };
    Fetch();
  }, [updatedStatusMsg]);

  const FilterUserType=(e:any)=>{
setuserType(e.target.value)
  }
  const ShowDompleteInformation = (userId: any) => {
    const userDetails = users.find((each: any) => each.userId === userId);
    if (userDetails) {
      dispatch(UpdateUserInformation(userDetails));
      router.push("/UserInformation");
    }
  };
 const handleLogout = () => {
    localStorage.removeItem('UserId');
    router.push('/');
  };



  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center font-bold">
        User Information Loading....
      </div>
    );
  }
const UpdatedFilterUserType = Finel.filter((each) => {
  return !UpdateduserType || each.userType === UpdateduserType;
});
 return (
  <div className="min-h-screen w-full bg-gray-100 px-2 py-2 flex flex-col items-center">
    <div className="bg-white rounded-full pl-1 shadow-md w-[70px] h-[70px] flex items-center justify-center">
      <img
        src="/Icons/Curate-logo.png"
        alt="Curate AI Health Logo"
        width={50}
        height={50}
        className="object-contain"
      />
    </div>

    <button
      className="absolute top-14 right-8 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
      onClick={handleLogout}
    >
      Logout
    </button>

    <div className="flex">
      <span className="text-[#ff1493] font-bold text-2xl mr-2">Curate</span>
      <span className="text-teal-600 font-bold text-2xl">Digital AI</span>
    </div>

    <h1 className="text-2xl font-bold text-gray-800 mb-2 mt-2">
      <span className="text-[#ff1493]">Hi, {UserFirstName}</span> Here's the complete list of registered users.
    </h1>

    <div className="w-full max-w-7xl bg-white shadow-lg rounded-xl overflow-x-auto">
      {UpdatedFilterUserType.length > 0 ? (
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm text-gray-700 table-fixed">
            <thead className="bg-gradient-to-r from-teal-500 to-green-400 text-white sticky top-0 z-10">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-center capitalize border-r border-white"
                  >
                    {header}
                  </th>
                ))}
                <th className="px-4 py-3 text-center capitalize border-r border-white">
                  Email Verification
                </th>
                <th className="px-4 py-3 text-center capitalize border-r border-white">
                  Document Verification
                </th>
                <th className="px-4 py-3 text-center capitalize border-r border-white">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {UpdatedFilterUserType.map((user, index) => (
                <tr key={index} className="bg-white hover:bg-gray-50">
                  {tableHeaders.map((field, idx) => (
                    <td
                      key={idx}
                      className="px-4 py-3 border-t border-gray-200 text-center break-words"
                    >
                      {user[field as keyof typeof user]}
                    </td>
                  ))}
                  <td className="px-4 py-3 border-t border-gray-200 text-center">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      defaultValue={user.EmailVerification ? 'Verified' : 'Pending'}
                      onChange={(e) =>
                        UpdateEmailVerificationStatus(
                          user.FirstName,
                          e.target.value,
                          user.userId
                        )
                      }
                    >
                      {EmailVerificationStatus.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 border-t border-gray-200 text-center">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      defaultValue={user.VerificationStatus}
                      onChange={(e) =>
                        UpdateStatus(user.FirstName, e.target.value, user.userId)
                      }
                    >
                      {Status.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-12 py-3 border-t border-gray-200 text-center cursor-pointer">
                    <Eye onClick={() => ShowDompleteInformation(user.userId)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-10 text-gray-500">No users found.</p>
      )}
      {updatedStatusMsg && (
        <p
          className={`${
            updatedStatusMsg.includes('Successfully')
              ? 'text-green-800'
              : 'text-gray-900'
          } font-semibold text-center mt-4`}
        >
          {updatedStatusMsg}
        </p>
      )}
    </div>
  </div>
);

}
