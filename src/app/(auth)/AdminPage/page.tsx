'use client';

import Logo from '@/Components/Logo/page';
import { useState } from 'react';

const users = [
  {
    AadharNumber: '457896214786',
    Age: '21',
    ConfirmPassword: 'Sidd@2124',
    ContactNumber: '9553406991',
    Email: 'tsiddu805@gmail.com',
    FirstName: 'Sidd',
    LastName: 'Siddu',
    Location: 'Hyderbad',
    Password: 'Sidd@2124',
    VerificationStatus: 'Pending',
    createdAt: '2025-07-08T11:11:45.574Z',
    userId: '6fea875d-4c4a-49c1-b1c8-45b4f6278c55',
    userType: 'patient',
    _id: '686cfcf173a87cecf08bb7f6',
  },
  {
    AadharNumber: '123456789012',
    Age: '30',
    ConfirmPassword: 'John@1234',
    ContactNumber: '9123456780',
    Email: 'john.doe@example.com',
    FirstName: 'John',
    LastName: 'Doe',
    Location: 'Mumbai',
    Password: 'John@1234',
    VerificationStatus: 'Success',
    createdAt: '2025-06-01T09:00:00.000Z',
    userId: '8bfa1234-7a89-4b1d-b9a2-1212e457c9fe',
    userType: 'doctor',
    _id: '788cfcf173a87cecf08bb7a2',
  },
  {
    AadharNumber: '789456123789',
    Age: '27',
    ConfirmPassword: 'Ana@4567',
    ContactNumber: '9876543210',
    Email: 'ana.smith@example.com',
    FirstName: 'Ana',
    LastName: 'Smith',
    Location: 'Delhi',
    Password: 'Ana@4567',
    VerificationStatus: 'Pending',
    createdAt: '2025-07-01T14:22:10.123Z',
    userId: '3cbf567d-8f12-47bc-b68a-72abc456cdde',
    userType: 'patient',
    _id: '908cfcf173a87cecf08bb7f2',
  },
];


const Finel = users.map((each: any) => ({
  FirstName: each.FirstName,
  LastName: each.LastName,
  AadharNumber: each.AadharNumber,
  Age: each.Age,
  userType: each.userType,
  VerificationStatus: each.VerificationStatus,
  Location: each.Location,
}));

export default function UserTableList() {
  const tableHeaders = Object.keys(Finel[0]);
  const [updatedStatusMsg, setUpdatedStatusMsg] = useState("");
  const Status = ['Pending', 'Success', 'Block'];
const UpdateStatus=(First:any)=>{
setUpdatedStatusMsg(`${First} Verification Updated SuccessFully`)
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
                    onChange={()=>UpdateStatus(user.FirstName)}
                  >
                    {Status.map((status) => (
                      <option key={status} value={status} disabled={status === user.VerificationStatus}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className='text-green-800 font-semibold text-center'>{updatedStatusMsg}</p>
      </div>
    </div>
  );
}
