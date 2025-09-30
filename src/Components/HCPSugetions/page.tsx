'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import { UpdateClient, UpdateUserInformation } from '@/Redux/action';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import * as htmlToImage from 'html-to-image';
import { GetInformedUsers, PostConfirmationInfo } from '@/Lib/user.action';
import axios from 'axios';

type ClientType = {
  Email: any;
  FirstName: string;
  patientName: string;
  patientHomeAssistance: string[];
};

type HcpType = {
  HCPEmail: any;
 
  UserId: any;
  HCPFirstName: string;
  HCPSurName: string;
  ProfessionalSkills: string[];
  ProfilePic?: string;
};

type Props = {
  clients: ClientType[];
  hcps: HcpType[];
};

const SuitableHcpList: React.FC<Props> = ({ clients, hcps }) => {
  const [selectedClientIndex, setSelectedClientIndex] = useState<number>(0);
  const [ExsitingInformedUsers, setExsitingInformedUsers] = useState<any[]>([]);
  const [StatusMessage, setStatusMessage] = useState('');
  const [CurrentUserId, setCurrentUserId] = useState<any>('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  // Store a ref for each HCP card
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredClients = clients.filter((client) =>
    `${client.FirstName} ${client.patientName}`.toLowerCase().includes('')
  );

  const selectedClient = clients[selectedClientIndex];

  const suitableHcps = hcps.filter((hcp) =>
    hcp.ProfessionalSkills?.some((skill) =>
      selectedClient.patientHomeAssistance.includes(skill)
    )
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const informedUsers: any = await GetInformedUsers();
      setExsitingInformedUsers(informedUsers);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const ShowDompleteInformation = (userId: any, ClientName: any) => {
    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      router.push('/UserInformation');
    }
  };

  const Revert = () => {
    router.push('/AdminPage');
  };

  const UpdateConfirmation = async (hcp: HcpType) => {
    setCurrentUserId(hcp.UserId);

    // await PostConfirmationInfo(hcp.UserId);
    setStatusMessage('Confirmation Send');
  };


  const generateImageBlob = async (hcp: HcpType): Promise<Blob | null> => {
    const cardNode = cardRefs.current[hcp.UserId];
    if (!cardNode) return null;

    try {
      const dataUrl = await htmlToImage.toPng(cardNode, { cacheBust: true });
      const res = await fetch(dataUrl);
      return await res.blob();
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };
// const handleShare = async (hcp: HcpType) => {
       
//   try {
//      setStatusMessage('Please Wait...');
//     const blob = await generateImageBlob(hcp);
//     if (!blob) {
//       alert('Could not generate image');
//       return;
//     }

  
//     if (blob.size > 10 * 1024 * 1024) {
//       alert('File too large. Max allowed is 10MB.');
//       return;
//     }

//     const allowedTypes = [
//       'image/jpeg',
//       'image/png',
//       'image/webp',
//       'image/gif',
//       'video/mp4',
//       'video/webm',
//       'video/ogg',
//     ];
//     if (!allowedTypes.includes(blob.type)) {
//       alert('Only image or video files are allowed.');
//       return;
//     }

   
//     const formData = new FormData();
//     formData.append('file', blob);

//     const res = await axios.post('/api/Upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });

//     const uploadedUrl = res.data.url;
// console.log("Test Image URl----",uploadedUrl)
//     const phoneNumber = '+919347877159';


//     const message = `Here is the HCP Card for ${hcp.HCPFirstName} ${hcp.HCPSurName}: ${uploadedUrl}`;
//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

//     window.open(whatsappUrl, '_blank');

 
//     UpdateConfirmation(hcp);

//   } catch (error) {
//     console.error('Error while sharing:', error);
//     alert('Something went wrong while sharing. Please try again.');
//   }
// };


const handleShare = async (hcp: HcpType) => {
  const blob = await generateImageBlob(hcp);
  if (!blob) return;

  const file = new File([blob], `${hcp.HCPFirstName}_Card.png`, { type: blob.type });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: `HCP Card`,
      text: `Here is the HCP Card for ${hcp.HCPFirstName} ${hcp.HCPSurName}`,
      files: [file],
    });
    UpdateConfirmation(hcp);
  } else {
    alert("Sharing files is not supported on this browser.");
  }
};


  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-12 w-12 rounded-full bg-gray-300 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl text-[#ff1493]">Client & HCP Matching</h1>
        <button
          onClick={Revert}
          className="mt-4 sm:mt-0 px-6 py-3 rounded-xl bg-[#1392d3] hover:rounded-full hover:bg-[#50c896] hover:shadow-lg cursor-pointer text-white font-semibold hover:scale-105 transition-transform"
        >
          Back to Admin
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 flex flex-col">
          <div className="overflow-y-auto max-h-[600px] space-y-4">
            {filteredClients.map((client, index) => (
              <div
                key={index}
                onClick={() => setSelectedClientIndex(clients.indexOf(client))}
                className={`p-4 rounded-xl cursor-pointer transition transform ${
                  selectedClientIndex === clients.indexOf(client)
                    ? 'bg-indigo-100 border-2 border-[#50c896]'
                    : 'bg-white'
                }`}
              >
                <h2 className="font-bold text-lg text-[#50c896]">
                  Client: {client.FirstName}
                </h2>
                <p className="text-gray-700">Email: {client.Email}</p>
                <p className="mt-2 text-sm text-[#1392d3]">
                  Assistance: {client.patientHomeAssistance.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-2/3 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-[#50c896]">
            Suitable HCPs
          </h2>
          {suitableHcps.length === 0 ? (
            <p className="text-gray-500">
              No suitable HCPs found for this client.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suitableHcps.map((hcp, index) => (
                <div
                  key={index}
                  ref={(el:any) => (cardRefs.current[hcp.UserId] = el)}
                  className="relative bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-transform"
                >
                  <div className="absolute top-3 right-3 text-gray-400 hover:text-indigo-500 cursor-pointer">
                    <Eye
                      size={20}
                      onClick={() =>
                        ShowDompleteInformation(hcp.UserId, hcp.HCPFirstName)
                      }
                    />
                  </div>

                  <img
                    src={hcp.ProfilePic || '/Icons/DefaultProfileIcon.png'}
                    alt={hcp.HCPFirstName}
                    className="w-28 h-28 rounded-full object-cover mb-3 border-2 border-[#50c896] shadow-sm"
                  />

                  <h3 className="font-bold text-lg mb-1 text-[#1392d3]">
                    {hcp.HCPFirstName} {hcp.HCPSurName}
                  </h3>
      <h3 className=" mb-1 text-gray-700">
                   {hcp.HCPEmail}
                  </h3>
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

                  <div className="flex flex-col items-center mt-2">
                    <button
                      onClick={() => handleShare(hcp)}
                      className={`px-2 py-2 ${
                        ExsitingInformedUsers.filter(
                          (each) => each.InformedHCPID === hcp.UserId
                        ).length > 0
                          ? 'bg-red-500 cursor-none'
                          : 'bg-teal-500 cursor-pointer'
                      } text-white rounded-lg text-[10px] m-2 hover:rounded-full hover:shadow-lg transition-colors`}
                      disabled={
                        ExsitingInformedUsers.filter(
                          (each) => each.InformedHCPID === hcp.UserId
                        ).length > 0
                      }
                    >
                      {ExsitingInformedUsers.filter(
                        (each) => each.InformedHCPID === hcp.UserId
                      ).length > 0
                        ? 'Already Informed'
                        : 'Send Confirmation'}
                    </button>

                    {CurrentUserId === hcp.UserId && (
                      <p
                        className={`${
                          StatusMessage === 'Confirmation Send'
                            ? 'text-green-600'
                            : 'text-gray-400'
                        } text-center`}
                      >
                        {StatusMessage}
                      </p>
                    )}
                  </div>
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
