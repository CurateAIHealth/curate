'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import { Update_Main_Filter_Status, UpdateClient, UpdateRefresh, UpdateUserInformation } from '@/Redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import * as htmlToImage from 'html-to-image';
import { GetInformedUsers, InserTimeSheet, IntrestedHCP, PostConfirmationInfo, UpdateHCAnstatus, UpdateHCAnstatusInFullInformation, UpdateUserContactVerificationstatus } from '@/Lib/user.action';
import axios from 'axios';
import { calculateAgeIndianFormat } from '@/Lib/Actions';
import { TestData } from '@/Lib/Content';
const allProfessionalSkills = ["Diaper", "Bathing", "Bedding", "Brushing"];

type ClientType = {
  Location: any;
  ContactNumber: any;
  userId: any;
  SuitableHCP: any;
  Email: any;
  FirstName: string;
  patientName: string;
  patientHomeAssistance: string[];
};

type HcpType = {
  Status: string;
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
  const [StatusMessage, setStatusMessage] = useState('Test StatusMessage');
  const [CurrentUserId, setCurrentUserId] = useState<any>('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const cardRefs = useRef<{ [key: string]: HTMLElement | null }>({});
const updatedRefresh=useSelector((afterEach:any)=>afterEach.updatedCount)


  useEffect(() => {
    const fetchUsers = async () => {
      const informedUsers: any = await GetInformedUsers();
      setExsitingInformedUsers(informedUsers);
      setLoading(false);
    };
    fetchUsers();
  }, [updatedRefresh]);

  const ShowDompleteInformation = (userId: any, ClientName: any) => {
    if (userId) {
      dispatch(UpdateClient(ClientName));
      dispatch(UpdateUserInformation(userId));
      router.push('/UserInformation');
    }
  };
const sendWhatsApp = async (clientNumber: string, hcaNumber: string) => {
  const res = await axios.post("/api/send-whatsapp", {
    clientNumber,
    hcaNumber,
  });


};
  const Revert = () => {
    router.push('/AdminPage');
  };
 const UpdateAssignHca = async (UserIDClient: any, UserIdHCA: any, ClientName: any, ClientEmail: any, ClientContact: any, Adress: any, HCAName: any, HCAContact: any) => {
    setCurrentUserId(UserIdHCA);
    console.log("Current Statats----", UserIdHCA)
    setStatusMessage("Please Wait Assigning HCA...")
    try {
      const today = new Date();
      const attendanceRecord = {
        date: today.toLocaleDateString('EN-In'),
        checkIn: today.toLocaleTimeString(),
        status: "Present",
      };


      const TimeSheetData: any[] = [];
      TimeSheetData.push(attendanceRecord)
      const UpdateStatus = await UpdateUserContactVerificationstatus(UserIDClient, "Placced")
      const UpdateHcaStatus = await UpdateHCAnstatus(UserIdHCA, "Assigned")
      const UpdatedHCPStatusInCompliteInformation = await UpdateHCAnstatusInFullInformation(UserIdHCA)
      console.log("Test Updated Result----", UpdatedHCPStatusInCompliteInformation)
      const PostTimeSheet: any = await InserTimeSheet(UserIDClient, UserIdHCA, ClientName, ClientEmail, ClientContact, Adress, HCAName, HCAContact, TimeSheetData)
      if (PostTimeSheet.success === true) {
        dispatch(UpdateRefresh(1))
        setStatusMessage("HCA Assigned Successfully, For More Information Check in Deployments")

        sendWhatsApp("+919347877159", "+919347877159");

        const Timer = setInterval(() => {
          dispatch(UpdateRefresh(1))
 router.push("/AdminPage");
    dispatch(Update_Main_Filter_Status("Deployment"));

        }, 3000)

        return () => clearInterval(Timer)
      }

    } catch (err: any) {
      setStatusMessage(err)
    }
  }


  const UpdateHCPIntrest=async(Clientid:any,hcpid:any)=>{
    setCurrentUserId(hcpid);
    setStatusMessage("Pleas Wait")
const PostIntrest:any=await IntrestedHCP(Clientid,hcpid)
if(PostIntrest.success){
    dispatch(UpdateRefresh(1))
setStatusMessage("Now You Can Assign")
}
  }
  const UpdateConfirmation = async (hcp: HcpType,ClientId:any) => {
    setCurrentUserId(hcp.UserId);
    await PostConfirmationInfo(hcp.UserId,ClientId);
        dispatch(UpdateRefresh(1))
    setStatusMessage('Confirmation Send');
    
  };

  const generateImageBlob = async (hcp: HcpType): Promise<Blob | null> => {
  const cardNode = cardRefs.current[hcp.UserId];
  if (!cardNode) {
    console.warn('Card node ref is null!');
    return null;
  }
  try {
    
    const dataUrl = await htmlToImage.toPng(cardNode, {
      cacheBust: true,
      pixelRatio: 6, 
      backgroundColor: "#ffffff" 
    });
    const res = await fetch(dataUrl);
    return await res.blob();
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
};


  const handleShare = async (hcp: HcpType,ClientUserId:any) => {
    try {
    
      const blob = await generateImageBlob(hcp);
      if (!blob) {
        console.warn('Failed to generate HCP card image.');
        setStatusMessage('Image generation failed');
        return;
      }

  
      const file = new File([blob], `${hcp.HCPFirstName}_Card.png`, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `HCP Card`,
          text: `Here is the HCP Card for ${hcp.HCPFirstName} ${hcp.HCPSurName}`,
          files: [file],
        });
        setStatusMessage('Card shared successfully');
      } else {
     
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
        setStatusMessage('File downloaded instead. Browser does not support file share');
      }

   
      await UpdateConfirmation(hcp,ClientUserId);
    } catch (error) {
      console.error('Error in handleShare:', error);
      setStatusMessage('Share failed');
    }
  };

const suitableHcps = hcps.filter((hcp: any) => {
  const client = clients[selectedClientIndex];
    if (!client || loading) return [];

  const hasDiaperSkill = hcp.ProfessionalSkills?.some((each: string) => each === "Diaper");
  const available = !hcp.Status?.some((each: string) => each === "Assigned");
  const matchesClientAssistance = hcp.ProfessionalSkills?.some((skill: string) =>
    client.patientHomeAssistance?.includes(skill)
  );

  return hasDiaperSkill && matchesClientAssistance && available;
});

console.log("Test Client id----",clients)
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
    <div className="md:p-0 p-4  h-[90%]   flex flex-col">
   <div className="flex md:m-2 flex-col sm:flex-row justify-between items-start sm:items-center bg-white border-l-4 border-[#1392d3] rounded-lg shadow-md p-2 mb-2 space-y-2 sm:space-y-0">

  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
    <div className="w-12 h-12 flex items-center justify-center bg-[#e6f2ff] text-[#1392d3] rounded-full text-lg font-semibold shadow-sm">
      🏥
    </div>
    <h1 className="text-lg sm:text-3xl font-semibold text-[#ff1493]  tracking-wide break-words">
      Perfect Care Connect
    </h1>
  </div>


  <button
    onClick={Revert}
    className="w-full sm:w-auto px-3 py-2 bg-[#1392d3] cursor-pointer text-white font-medium rounded-lg shadow hover:bg-[#107fb8] hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#1392d3]/30"
  >
    <span className="text-md">🔙</span>
    to Admin,.,
  </button>
</div>



      <div className="flex flex-col lg:flex-row gap-8 mt-2 md:mt-0">
   <div className="flex flex-col bg-gradient-to-b from-[#f8fbff] to-[#e8f6f3] rounded-2xl p-2 shadow-inner">
  <h2 className="text-2xl font-semibold text-[#008080] mb-4 text-center tracking-wide">
    Client Directory
  </h2>
  

  <div className="overflow-y-auto max-h-[260px] space-y-3 pr-1 scrollbar-thin scrollbar-thumb-[#b7e4c7] scrollbar-track-transparent">
    {clients.map((client, index) => (
      <div
        key={index}
        onClick={() => setSelectedClientIndex(clients.indexOf(client))}
        className={`transition-all duration-300 ease-in-out p-4 rounded-2xl shadow-sm border border-transparent cursor-pointer hover:shadow-md ] ${
          selectedClientIndex === clients.indexOf(client)
            ? 'bg-[#d9f9f3] border-[#40c9a2]'
            : 'bg-white'
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg text-[#00796b]">
            👤 {client.FirstName}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              selectedClientIndex === clients.indexOf(client)
                ? 'bg-[#40c9a2] text-white'
                : 'bg-[#e0f2f1] text-[#00796b]'
            }`}
          >
            Selected
          </span>
        </div>

        <p className="text-sm text-gray-600">
          📧 <span className="font-medium">{client.Email}</span>
        </p>

        <p className="mt-2 text-sm leading-relaxed text-[#00695c] bg-[#f1faf8] px-3 py-2 rounded-xl">
          🏥 Assistance:{" "}
          <span className="font-medium">
            {client.patientHomeAssistance.join(", ")}
          </span>
        </p>
       <p className="text-sm font-medium mt-2 text-grey-600 border border-grey-600 px-3 py-1 rounded-lg inline-block cursor-pointer hover:bg-green-900 hover:text-white transition-all duration-200">
  Assign HCP&Nurse
</p>

      </div>
    ))}
  </div>
</div>


        <div className="w-full lg:w-4/5 mx-auto py-0">
          <div className="mb-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-700 dark:text-teal-400 tracking-tight drop-shadow-sm">
              Friendly Care Matches
            </h1>
<div className=" flex flex-wrap gap-3 items-center">
            <div className="px-3 py-1.5 bg-green-100 border border-green-200 rounded-full shadow-sm text-sm text-gray-800 flex items-center gap-1">
              Total: <span className="font-semibold">{suitableHcps.length}</span>
            </div>
            <div className="px-3 py-1.5 bg-blue-100 border border-blue-200 rounded-full shadow-sm text-sm text-gray-800 flex items-center gap-1">
              Informed: <span className="font-semibold">{ExsitingInformedUsers.length}</span>
            </div>
          </div>
          </div>
          

          {suitableHcps.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No suitable HCPs found for this client.</p>
          ) : (
            <div className="max-h-[394px] overflow-y-auto   grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
              {suitableHcps.map((hcp: any, idx: number) => {
                const alreadyInformed = ExsitingInformedUsers.some(
                  (each) => each.InformedHCPID === hcp.UserId&&each.InformedClientID===clients[0].userId
                );
                const isCurrent = CurrentUserId === hcp.UserId;

                return (
                  <article
                    key={idx}
                 
                    ref={el => { cardRefs.current[hcp.UserId] = el; }}
                    className="relative flex flex-col md:w-[190px] items-center bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-[170px] min-h-[220px]"
                  >

                    <div className="bg-teal-600  w-full h-[50px] flex items-center justify-center relative rounded-t-2xl">
                      <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-md absolute bottom-[-20px]">
                        <img
                          src={hcp.ProfilePic || "/Icons/DefaultProfileIcon.png"}
                          alt={hcp.HCPFirstName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="pt-6 bg-gray-000 pb-3 px-3 text-center w-full">
                      <h3 className="text-[12px] font-semibold text-gray-800 truncate">
                        {hcp.HCPFirstName} {hcp.HCPSurName}
                      </h3>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">+91{hcp.HCPContactNumber}</p>
                      <p className="text-[10px] text-gray-500 truncate">{hcp['Current Address'] || '-'}</p>

                      <div className="flex justify-center gap-1 mt-1 flex-wrap">
                        <span className="text-[9px] px-2 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full">
                          Age: {hcp["Date of Birth"] ? calculateAgeIndianFormat(new Date(hcp["Date of Birth"]).toLocaleDateString("en-IN")) : "-"}
                        </span>
                        <span className="text-[9px] px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full">
                          Exp: {hcp.Experience || 0} yrs
                        </span>
                      </div>

                      <h4 className="text-[9px] font-semibold text-gray-700 uppercase mt-1">Skills</h4>
                      <div className="flex flex-wrap justify-center gap-[2px] mt-1">
                        {allProfessionalSkills.map((skill: string, sidx: number) => {
                          const hasSkill = hcp.ProfessionalSkills.includes(skill);
                          return (
                            <span
                              key={sidx}
                              className={`text-[8px] px-2 py-1 rounded-full border ${hasSkill
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-red-50 border-red-200 text-red-600"
                                }`}
                            >
                              {skill} {hasSkill ? "✓" : "✖"}
                            </span>
                          );
                        })}
                      </div>
                      <div className="mt-2 flex justify-center gap-2 flex-wrap">
                        {clients[0]?.SuitableHCP === hcp.UserId ? (
                          <button className="bg-green-600 text-white cursor-pointer px-3 py-1 rounded-full text-[10px] font-medium shadow-sm hover:bg-green-700 transition-colors" onClick={() => UpdateAssignHca(
                            clients[0].userId,
                            hcp.UserId,
                            clients[0].FirstName,
                            clients[0].Email,
                            clients[0].ContactNumber,
                            clients[0].Location,
                            hcp.HCPFirstName,
                            hcp.HCPContactNumber
                          )}>
                            Assign
                          </button>
                        ) : (

                      <div className="flex justify-between gap-6">
                          <button
                            onClick={() => handleShare(hcp,clients[0].userId)}
                            disabled={alreadyInformed}
                            className={`px-3 py-1 text-[8px] cursor-pointer font-medium rounded-full cursor Pointer transition-all duration-200 ${alreadyInformed
                              ? "bg-red-500/90 text-white cursor-not-allowed"
                              : "bg-teal-600 text-white hover:bg-teal-700"
                              }`}
                          >
                            {alreadyInformed ? "Informed ✓" : "Confirm"}
                          </button>
                          
                          {alreadyInformed && clients.some(client => client.SuitableHCP !== hcp.UserId) && <p  className={`px-3 py-1 text-[10px] cursor-pointer font-medium rounded-full cursor Pointer transition-all duration-200  bg-[#40c9a2]  text-white hover:bg-teal-700`} onClick={()=>UpdateHCPIntrest(clients[0].userId,hcp.UserId)}> Intrested</p>}

                            </div>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() =>
                            ShowDompleteInformation(hcp.UserId, hcp.HCPFirstName)
                          }
                          className="p-1 bg-white rounded-full shadow border hover:scale-105 transition-transform"
                        >
                          <Eye size={12} className="text-teal-600" />
                        </button>
                      </div>

                      {isCurrent && (
                        <p
                          className={`text-[9px] text-center mt-1 font-semibold ${StatusMessage === "Confirmation Send" || StatusMessage==="Now You Can Assign" || StatusMessage === "HCA Assigned Successfully, For More Information Check in Deployments"
                            ? "text-green-700"
                            : "text-gray-500"
                            }`}
                        >
                          {StatusMessage}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuitableHcpList;
