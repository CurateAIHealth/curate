'use client'

import React, { ReactNode, useState } from 'react';
import { Eye } from 'lucide-react';
import { UpdateClient, UpdateUserInformation } from '@/Redux/action';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

type ClientType = {
    Email: any;
    FirstName: string;
    patientName: string;
    patientHomeAssistance: string[];
};

type HcpType = {
    UserId(UserId: any, HCPFirstName: string): void;
    HCPFirstName: string;
    HCPSurName: string;
    ProfessionalSkills: string[];
    ProfilePic?: string;
    PreferredService?: string;
};

type Props = {
    clients: ClientType[];
    hcps: HcpType[];
};

const SuitableHcpList: React.FC<Props> = ({ clients, hcps }) => {
    const [selectedClientIndex, setSelectedClientIndex] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const dispatch = useDispatch();
    const router = useRouter();

    const filteredClients = clients.filter((client) =>
        `${client.FirstName} ${client.patientName}`.toLowerCase().includes(search.toLowerCase())
    );

    const selectedClient = clients[selectedClientIndex];

    const suitableHcps = hcps.filter((hcp) =>
        hcp.ProfessionalSkills?.some((skill) =>
            selectedClient.patientHomeAssistance.includes(skill)
        )
    );

    const ShowDompleteInformation = (userId: any, ClientName: any) => {
        if (userId) {
            dispatch(UpdateClient(ClientName));
            dispatch(UpdateUserInformation(userId));
            router.push("/UserInformation");
        }
    };

    const Revert = () => {
        router.push("/AdminPage");
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto">
         
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-4xl text-[#ff1493]">
                    Client & HCP Matching
                </h1>
                <button
                    onClick={Revert}
                    className="mt-4 sm:mt-0 px-6 py-3 rounded-xl bg-[#1392d3] hover:rounded-full hover:bg-[#50c896] hover:shadow-lg cursor-pointer text-white font-semibold
                                hover:scale-105 transition-transform"
                >
                    Back to Admin
                </button>
            </div>

      
            <div className="flex flex-col lg:flex-row gap-8">
              
                <div className="lg:w-1/3 flex flex-col">
                    {/* <input
                        type="text"
                        placeholder="Search Client..."
                        className="w-full p-3 rounded-xl border border-gray-300 shadow-sm mb-4 focus:ring-2 focus:ring-indigo-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    /> */}
                    <div className="overflow-y-auto max-h-[600px] space-y-4">
                        {filteredClients.map((client, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedClientIndex(clients.indexOf(client))}
                                className={`p-4 rounded-xl cursor-pointer transition transform 
                                            ${selectedClientIndex === clients.indexOf(client)
                                                ? 'bg-indigo-100 border-2 border-[#50c896]'
                                                : 'bg-white'
                                            }`}
                            >
                                <h2 className="font-bold text-lg text-[#50c896]">Client: {client.FirstName}</h2>
                                <p className="text-gray-700">Email: {client.Email}</p>
                                <p className="mt-2 text-sm text-[#1392d3]">
                                    Assistance: {client.patientHomeAssistance.join(', ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

          
                <div className="lg:w-2/3 flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-[#50c896]">Suitable HCPs</h2>
                    {suitableHcps.length === 0 ? (
                        <p className="text-gray-500">No suitable HCPs found for this client.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suitableHcps.map((hcp, index) => (
                                <div
                                    key={index}
                                    className="relative bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center text-center
                                               hover:scale-105 hover:shadow-2xl transition-transform"
                                >
                                
                                    <div className="absolute top-3 right-3 text-gray-400 hover:text-indigo-500 cursor-pointer">
                                        <Eye size={20} onClick={() => ShowDompleteInformation(hcp.UserId, hcp.HCPFirstName)} />
                                    </div>

                                    
                                    <img
                                        src={hcp.ProfilePic || '/Icons/DefaultProfileIcon.png'}
                                        alt={hcp.HCPFirstName}
                                        className="w-28 h-28 rounded-full object-cover mb-3 border-2 border-[#50c896] shadow-sm"
                                    />

                                    <h3 className="font-bold text-lg mb-1 text-[#1392d3]">{hcp.HCPFirstName} {hcp.HCPSurName}</h3>

                                 
                                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                                        {hcp.ProfessionalSkills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-[#ff1493] text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <p className='bg-[#50c896] p-2 rounded-md text-[10px] cursor-pointer m-2'>Send Confirmation</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuitableHcpList;
