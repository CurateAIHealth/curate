'use client';

import Logo from '@/Components/Logo/page';
import { GetRegidterdUsers, GetUserInformation, UpdateUserVerificationstatus } from '@/Lib/user.action';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { UpdateUserInformation } from '@/Redux/action';
import { useDispatch } from 'react-redux';


export default function UserTableList() {
  const [updatedStatusMsg, setUpdatedStatusMsg] = useState('');
  const [users, setUsers] = useState([]);
    const [isChecking, setIsChecking] = useState(true);
   
  const Status = ['Pending', 'Success', 'Block'];
  const router = useRouter()
  const dispatch=useDispatch()
  const UpdateStatus =async (first: string,e:any,UserId:any) => {
    setUpdatedStatusMsg(`Updating ${first} Verification Status....`)
    try{
const VerificationStatusUpdation=await UpdateUserVerificationstatus(UserId,e)
if(VerificationStatusUpdation?.success===true){
setUpdatedStatusMsg(`${first} Verification Status Updated Successfully`);
}
    }catch(err:any){

    }
    
  };
  const FormateadharNumber = (AdharNumber: any) => {
    return `${AdharNumber.slice(0, 4)}-${AdharNumber.slice(4, 8)}-${AdharNumber.slice(8, 12)}`
  }
  const Finel = users.map((each: any) => ({
    FirstName: each.FirstName,
    LastName: each.LastName,
    AadharNumber: FormateadharNumber(each.AadharNumber),
    Age: each.Age,
    userType: each.userType,
    VerificationStatus: each.VerificationStatus,
    Location: each.Location,
    Email:each.Email,
    Contact:each.ContactNumber,
    userId:each.userId
  }));

  const tableHeaders = Finel.length > 0 ? Object.keys(Finel[0]).filter((each)=>each!=="userId"): [];

  useEffect(() => {
    const Fetch = async () => {
      try {
        const localValue = localStorage.getItem("UserId");
        const ProfileInformation = await GetUserInformation(localValue)
        if (ProfileInformation?.Email !== "tsiddu805@gmail.com") {
          router.push("/");
        }
        const RegisterdUsersResult = await GetRegidterdUsers();
        setUsers(RegisterdUsersResult || []);
        setIsChecking(false)
      } catch (err: any) {

      }
    };
    Fetch();
  }, [updatedStatusMsg]);
const ShowDompleteInformation=(A:any)=>{
const FullDetails=users.filter((each:any)=>each.userId===A)
dispatch(UpdateUserInformation(FullDetails[0]))
router.push("/UserInformation")
}

  if (isChecking) {
    return (
      <div className='h-screen flex items-center justify-center font-bold'>
        User Information Loading....
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 flex flex-col items-center">
      <Logo />
      <div>
        <span className="text-pink-500 font-bold text-2xl">Curate</span>{' '}
        <span className="text-teal-600 font-bold text-2xl">Digital AI</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-4">Registered Users</h1>

      <div className="w-full overflow-auto rounded-xl shadow-lg bg-white max-w-7xl">
        {Finel.length > 0 ? (
          <table className="w-full border border-gray-200 text-sm text-gray-700">
            <thead className="bg-gradient-to-r from-teal-500 to-green-400 text-white text-left">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 whitespace-nowrap text-center capitalize border-r border-white"
                  >
                    {header}
                  </th>
                ))}
                <th className="px-4 py-3 whitespace-nowrap text-center capitalize border-r border-white">
                  Update Status
                </th>
                 <th className="px-4 py-3 whitespace-nowrap text-center capitalize border-r border-white">
                Details
                </th>
              </tr>
            </thead>
            <tbody>
              {Finel.map((user, index) => (
                <tr key={index} className="bg-white hover:bg-gray-50">
                  {tableHeaders.map((field, idx) => (
                    <td
                      key={idx}
                      className="px-4 py-3 border-t border-gray-200 break-words text-center"
                    >
                      {user[field as keyof typeof user]}
                    </td>
                  ))}
                  <td className="px-4 py-3 border-t border-gray-200 text-center">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm cursor-pointer"
                      defaultValue={user.VerificationStatus}
                      onChange={(e) => UpdateStatus(user.FirstName,e.target.value,user.userId)}
                    >
                      {Status.map((status) => (
                        <option
                          key={status}
                          value={status}
                          disabled={status === user.VerificationStatus}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 border-t border-gray-200 text-center pl-8 cursor-pointer">
                    <Eye onClick={
                      ()=>ShowDompleteInformation(user.userId)
                    }/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-10 text-gray-500">No users found.</p>
        )}
        {updatedStatusMsg && (
          <p className={`${updatedStatusMsg.includes("Successfully")?"text-green-800":"text-gray-900"} font-semibold text-center mt-4`}>
            {updatedStatusMsg}
          </p>
        )}
      </div>
    </div>
  );
}
