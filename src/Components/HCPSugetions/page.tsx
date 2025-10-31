'use client';

import React, { useEffect, useRef, useState } from 'react';
import jsPDF from "jspdf";
import { Eye, Search } from 'lucide-react';
import { Update_Main_Filter_Status, UpdateClient, UpdateRefresh, UpdateUserInformation } from '@/Redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import * as htmlToImage from 'html-to-image';
import { GetInformedUsers, InserTimeSheet, IntrestedHCP, PostConfirmationInfo, UpdateHCAnstatus, UpdateHCAnstatusInFullInformation, UpdateUserContactVerificationstatus } from '@/Lib/user.action';
import axios from 'axios';
import { calculateAgeIndianFormat } from '@/Lib/Actions';
import { HyderabadAreas, PROFESSIONAL_SKILL_OPTIONS, TestData } from '@/Lib/Content';
import PhysioList from '../Physio/page';
const allProfessionalSkills = ["Diaper", "Bathing", "Bedding", "Brushing"];

type ClientType = {
  PhysioScore: number;
  patientType: any;
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
  Experience: string;
  Type: any;
  userType: any;
  Status: string;
  HCPEmail: any;
  UserId: any;
  HCPFirstName: string;
  HCPSurName: string;
  ProfessionalSkills: string[];
  ProfilePic?: string;
   [key: string]: any;
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
  const [SearchFilter,setSearchFilter]=useState("")
  const [SearchOptions,setSearchOptions]=useState(false)
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    hcpType: [] as string[],
    qualification: [] as string[],
    experience: "",
    location: "",
    healthConditions: [] as string[],
  });
console.log("Current Work----",form)
  const handleCheckboxChange = (type: string, value: string) => {
    setForm((prev) => {
      const list = prev[type as keyof typeof form] as string[];
      return {
        ...prev,
        [type]: list.includes(value)
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
    });
  };


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





const handleShare = async (hcp:any, clientUserId:any) => {

  const doc = new jsPDF();


  doc.setFontSize(16);
  doc.text("Healthcare Professional Information", 10, 10);
  doc.setFontSize(12);

  let y = 20; 

  doc.text(`Name: ${hcp.HCPFirstName} ${hcp.HCPSurName}`, 10, y); y += 8;
  doc.text(`Gender: ${hcp.Gender}`, 10, y); y += 8;
  doc.text(`Date of Birth: ${hcp["Date of Birth"]}`, 10, y); y += 8;
  doc.text(`Marital Status: ${hcp["Marital Status"]}`, 10, y); y += 8;
  doc.text(`Contact Number: ${hcp.HCPContactNumber}`, 10, y); y += 8;
  doc.text(`Email: ${hcp.HCPEmail}`, 10, y); y += 8;
  doc.text(`Aadhar Number: ${hcp.HCPAdharNumber}`, 10, y); y += 8;


  doc.text("Address Information:", 10, y); y += 6;
  doc.text(`Current Address: ${hcp["Current Address"]}`, 10, y); y += 8;
  doc.text(`Permanent Address: ${hcp["Permanent Address"]}`, 10, y); y += 8;
  doc.text(`City: ${hcp["Branch City"]}, State: ${hcp["Branch State"]}`, 10, y); y += 8;
  doc.text(`Pincode: ${hcp["Branch Pincode"]}`, 10, y); y += 8;


  doc.text("Education:", 10, y); y += 6;
  doc.text(`Higher Education: ${hcp["Higher Education"]} (${hcp["Higher Education Year Start"]} - ${hcp["Higher Education Year End"]})`, 10, y); y += 8;
  doc.text(`Professional Education: ${hcp["Professional Education"]} (${hcp["Professional Education Year Start"]} - ${hcp["Professional Education Year End"]})`, 10, y); y += 8;


  doc.text("Work Experience:", 10, y); y += 6;
  doc.text(`Experience: ${hcp.Experience}`, 10, y); y += 8;
  doc.text(`Professional Work 1: ${hcp["Professional Work 1"]}`, 10, y); y += 8;
  doc.text(`Professional Work 2: ${hcp["Professional Work 2"]}`, 10, y); y += 8;


  doc.text("Skills:", 10, y); y += 6;
  doc.text(`Handled Skills: ${hcp.HandledSkills.join(", ")}`, 10, y); y += 8;
  doc.text(`Professional Skills: ${hcp.ProfessionalSkills.join("")}`, 10, y); y += 8;
  doc.text(`Home Assistance: ${hcp.HomeAssistance.join(", ")}`, 10, y); y += 8;
  doc.text(`Specialties: ${hcp.Specialties}`, 10, y); y += 8;

  // // Bank Details
  // doc.text("Bank Details:", 10, y); y += 6;
  // doc.text(`Bank Name: ${hcp["Payment Bank Name"].content || ""}`, 10, y); y += 8;
  // doc.text(`Branch Name: ${hcp["Bank Branch Name"]}`, 10, y); y += 8;
  // doc.text(`Branch Address: ${hcp["Bank Branch Address"]}`, 10, y); y += 8;
  // doc.text(`IFSC Code: ${hcp["IFSC Code"].content || ""}`, 10, y); y += 8;


  doc.text("Physical Details:", 10, y); y += 6;
  doc.text(`Height: ${hcp.Height} ft`, 10, y); y += 8;
  doc.text(`Weight: ${hcp.Weight} kg`, 10, y); y += 8;
  doc.text(`Complexion: ${hcp.Complexion}`, 10, y); y += 8;
  doc.text(`Eye Colour: ${hcp["Eye Colour"]}`, 10, y); y += 8;
  doc.text(`Hair Colour: ${hcp["Hair Colour"]}`, 10, y); y += 8;
  doc.text(`Body Marks: ${hcp["Mole/Body Mark 1"]}, ${hcp["Mole/Body Mark 2"]}`, 10, y); y += 8;

  
  doc.text("Health Information:", 10, y); y += 6;
  doc.text(`Any Deformity: ${hcp["Any Deformity"]}`, 10, y); y += 8;
  doc.text(`Previous Health Issues: ${hcp["Report Previous Health Problems"]}`, 10, y); y += 8;
  doc.text(`Current Health Issues: ${hcp["Report Current Health Problems"]}`, 10, y); y += 8;

 
  doc.text("References:", 10, y); y += 6;
  doc.text(`Reference 1: ${hcp["Reference 1 Name"]} (${hcp["Reference 1 Relationship"]}), ${hcp["Reference 1 Address"]}`, 10, y); y += 8;
  doc.text(`Reference 2: ${hcp["Reference 2 Name"]}, ${hcp["Reference 2 Address"]}`, 10, y); y += 8;

  doc.text("Certification:", 10, y); y += 6;
  doc.text(`Certified By: ${hcp["Certified By"]}`, 10, y); y += 8;
  doc.text(`Registration Council: ${hcp["Registration Council"]}`, 10, y); y += 8;
  doc.text(`Registration No: ${hcp["Registration No"]}`, 10, y); y += 8;


  doc.text("Referral Details:", 10, y); y += 6;
  doc.text(`Source of Referral: ${hcp["Source of Referral"]}`, 10, y); y += 8;
  doc.text(`Date of Referral: ${hcp["Date of Referral"]}`, 10, y); y += 8;


  doc.text("Service Information:", 10, y); y += 6;
  doc.text(`Preferred Service: ${hcp["Preferred Service"]}`, 10, y); y += 8;
  doc.text(`Payment Service: ${hcp["Payment Service"]}`, 10, y); y += 8;
  doc.text(`Service Hours: ${hcp["Service Hours 24hrs"] ? "24 Hours" : "12 Hours"}`, 10, y); y += 8;

 
  y += 10;
  doc.text("Generated by Healthcare Portal", 10, y);
  const resumeBlob = doc.output("blob");

  const resumeFile = new File([resumeBlob], `${hcp.HCPFirstName}_Information.pdf`, { type: 'application/pdf' });

 const response = await axios.get('https://res.cloudinary.com/db3dr9lf5/image/upload/v1761886244/uploads/xaxdclpd83ctaalexmzb.pdf', {
  responseType: 'blob',
});
const cloudinaryBlob = response.data;

const fileType = cloudinaryBlob.type; 

let fileExtension = "bin"; 
if (fileType === "application/pdf") fileExtension = "pdf";
else if (fileType === "image/png") fileExtension = "png";
else if (fileType === "image/jpeg") fileExtension = "jpg";
else if (fileType === "image/webp") fileExtension = "webp";
else if (fileType === "image/gif") fileExtension = "gif";


const cloudinaryFile = new File([cloudinaryBlob], `${hcp.HCPFirstName} ${hcp.HCPSurName} BVR.${fileExtension}`, {
  type: fileType,
});


  const filesToShare = [resumeFile, cloudinaryFile];
  if (navigator.canShare && navigator.canShare({ files: filesToShare })) {
    await navigator.share({
      title: "HCP Resume and BVR Certificate",
      text: "Attached are the resume and additional document.",
      files: filesToShare,
    });
    setStatusMessage('Shared successfully!');
  } else {

    filesToShare.forEach(file => {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });
    setStatusMessage('Files downloaded. Sharing not supported in this browser.');
  }

  await UpdateConfirmation(hcp, clientUserId);
};


  const UpdateNewSearchItem=(A:any)=>{
    setSearchFilter(A)
  }

const suitableHcps = hcps.filter((hcp: any) => {
  const client = clients[selectedClientIndex];
    if (!client || loading) return [];

  const hasDiaperSkill = hcp.HomeAssistance?.some((each: string) => each === "Diaper")
  const available = !hcp.Status?.some((each: string) => each === "Assigned");

const matchesClientAssistance = hcp.HandledSkills?.some((skill: string) => client.patientType?.includes(skill) );
  return hasDiaperSkill && matchesClientAssistance && available;
});

const First=hcps.filter((each:any)=>each.userType==="healthcare-assistant")

  const ShowAdditionHCPs = First?.filter((each: HcpType) =>
  form?.hcpType?.some((type: any) => type === each?.Type) ||

  form?.qualification?.some((qual: any) => qual === each?.['Professional Education']) ||

  (form?.experience && each?.Experience?.toLowerCase()?.includes(form?.experience?.toLowerCase())) ||

  form?.healthConditions?.some((condition: string) =>
    each?.HandledSkills?.some((skill: string) =>
      skill?.toLowerCase()?.includes(condition?.toLowerCase())
    )
  ) ||

  (form?.location && each?.["Current Address"]?.toLowerCase()?.includes(form?.location?.toLowerCase()))
);


console.log("Test Client id----",suitableHcps)
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
    to Admin
  </button>
</div>



      <div className="flex flex-col lg:flex-row gap-8 mt-2 md:mt-0">
   <div className="flex flex-col bg-gradient-to-b from-[#f8fbff] to-[#e8f6f3] rounded-2xl p-0 shadow-inner">
  <h2 className="text-2xl font-semibold text-[#008080] mb-4 text-center tracking-wide">
    Client Directory
  </h2>
  

  <div className="overflow-y-auto  space-y-3 pr-1 scrollbar-thin scrollbar-thumb-[#b7e4c7] scrollbar-track-transparent">
    {clients.map((client, index) => (
      <div
        key={index}
        onClick={() => setSelectedClientIndex(clients.indexOf(client))}
        className={`transition-all duration-300 ease-in-out p-2 rounded-2xl shadow-sm border border-transparent cursor-pointer hover:shadow-md ] ${
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
         <p className="mt-2 text-sm leading-relaxed text-[#00695c] bg-[#f1faf8] px-3 py-2 rounded-xl">
           Patient Type:{" "}
          <span className="font-medium">
            {client.patientType}
          </span>
        </p>
       <p className="text-sm font-medium mt-2 text-grey-600 border border-grey-600 px-3 py-1 rounded-lg inline-block cursor-pointer hover:bg-green-900 hover:text-white transition-all duration-200">
  Assign HCP&Nurse
</p>
<button className={`flex items-center gap-2 px-2 ${SearchOptions&&"bg-green-800 text-white"} py-2 mt-2 border border-grey-600 text-pink font-semibold rounded-xl shadow-md hover:cursor-pointer active:scale-95 transition-all duration-200`} onClick={()=>{setSearchOptions(!SearchOptions);setSearchFilter("")}}>
  <Search className="w-4 h-4" />
Search For HCP Criteria
</button>
{SearchOptions&&
 <div className="w-[235px] mx-auto mt-2 text-[10px] p-2 bg-white rounded-2xl shadow-lg space-y-4 border border-gray-100">
 

    
      <div>
        <label className="font-semibold text-gray-700 block mb-2">HCP Type</label>
        <div className="flex flex-wrap gap-3">
          {["HCA", "HCN", "HCPT"].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.hcpType.includes(type)}
                onChange={() => handleCheckboxChange("hcpType", type)}
                className="accent-indigo-600"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>


      <div>
        <label className="font-semibold text-gray-700 block mb-2">Qualification</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            "GDA",
            "ANM pursuing",
            "ANM",
            "BSc",
            "GNM",
            "Neuro PT",
            "Musculoskeletal PT",
            "Respiratory PT",
          ].map((qual) => (
            <label key={qual} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.qualification.includes(qual)}
                onChange={() => handleCheckboxChange("qualification", qual)}
                className="accent-indigo-600"
              />
              <span>{qual}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-2">Experience (Years)</label>
        <input
          type="number"
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Enter experience in years"
          min="0"
        />
      </div>

   
      <div>
        <label className="font-semibold text-gray-700 block mb-2">Location</label>
        <select
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
        >
          <option value="">Select Hyderabad Area</option>
          {HyderabadAreas.map((area:any) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>


      <div>
        <label className="font-semibold text-gray-700 block mb-2">Health Condition</label>
        <div className="flex flex-wrap gap-3">
          {[
            "Dementia",
            "Parkinson’s",
            "Wheelchair",
            "Spinal Surgery",
            "Lung Transplant",
            "Heart Transplant",
          ].map((condition) => (
            <label key={condition} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.healthConditions.includes(condition)}
                onChange={() => handleCheckboxChange("healthConditions", condition)}
                className="accent-indigo-600"
              />
              <span>{condition}</span>
            </label>
          ))}
        </div>
      </div>
    </div>}

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
          
<div className="flex flex-col md:flex-row w-full justify-between items-center md:items-start gap-4 md:gap-6 px-2 sm:px-4">
  {suitableHcps.length === 0 ? (
    <p className="text-gray-400 text-center py-12 w-full">
      No suitable HCPs found for this client.
    </p>
  ) : (
    <div className="max-h-[394px] w-full md:w-[800px] overflow-y-auto flex flex-wrap justify-center md:justify-start gap-3 md:gap-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 p-2">
      {suitableHcps.map((hcp: any, idx: number) => {
        const alreadyInformed = ExsitingInformedUsers.some(
          (each) =>
            each.InformedHCPID === hcp.UserId &&
            each.InformedClientID === clients[0].userId
        );
        const isCurrent = CurrentUserId === hcp.UserId;

        return (
          <article
            key={idx}
            ref={(el) => {
              cardRefs.current[hcp.UserId] = el;
            }}
            className="relative flex flex-col items-center bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[190px] min-h-[220px]"
          >

            <div className="bg-teal-600 w-full h-[50px] flex items-center justify-center relative rounded-t-2xl">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 border-white overflow-hidden shadow-md absolute bottom-[-20px]">
                <img
                  src={hcp.ProfilePic || "/Icons/DefaultProfileIcon.png"}
                  alt={hcp.HCPFirstName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

    
            <div className="pt-6 pb-3 px-2 sm:px-3 text-center w-full">
              <h3 className="text-[12px] sm:text-[13px] font-semibold text-gray-800 truncate">
                {hcp.HCPFirstName} {hcp.HCPSurName}
              </h3>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">
                +91{hcp.HCPContactNumber}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {hcp["Current Address"] || "-"}
              </p>

      
              <div className="flex justify-center gap-1 mt-1 flex-wrap">
                <span className="text-[9px] px-2 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full">
                  Age:{" "}
                  {hcp["Date of Birth"]
                    ? calculateAgeIndianFormat(
                        new Date(hcp["Date of Birth"]).toLocaleDateString(
                          "en-IN"
                        )
                      )
                    : "-"}
                </span>
                <span className="text-[9px] px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full">
                  Exp: {hcp.Experience || 0} yrs
                </span>
              </div>

            
              <h4 className="text-[9px] font-semibold text-gray-700 uppercase mt-1">
                Skills
              </h4>
              <div className="flex flex-wrap justify-center gap-[2px] mt-1">
                {PROFESSIONAL_SKILL_OPTIONS.map(
                  (skill: string, sidx: number) => {
                    const hasSkill = hcp.ProfessionalSkills.includes(skill);
                    return (
                      <span
                        key={sidx}
                        className={`text-[8px] px-1 py-1 rounded-full border ${
                          hasSkill
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-red-50 border-red-200 text-red-600"
                        }`}
                      >
                        {skill} {hasSkill ? "✓" : "✖"}
                      </span>
                    );
                  }
                )}
              </div>

        
              <div className="mt-2 flex justify-center gap-2 flex-wrap">
                {clients[0]?.SuitableHCP === hcp.UserId ? (
                  <button
                    className="bg-green-600 text-white cursor-pointer px-3 py-1 rounded-full text-[10px] font-medium shadow-sm hover:bg-green-700 transition-colors"
                    onClick={() =>
                      UpdateAssignHca(
                        clients[0].userId,
                        hcp.UserId,
                        clients[0].FirstName,
                        clients[0].Email,
                        clients[0].ContactNumber,
                        clients[0].Location,
                        hcp.HCPFirstName,
                        hcp.HCPContactNumber
                      )
                    }
                  >
                    Assign
                  </button>
                ) : (
                  <div className="flex justify-between gap-3 sm:gap-6">
                    <button
                      onClick={() => handleShare(hcp, clients[0].userId)}
                      disabled={alreadyInformed}
                      className={`px-3 py-1 text-[8px] cursor-pointer font-medium rounded-full transition-all duration-200 ${
                        alreadyInformed
                          ? "bg-red-500/90 text-white cursor-not-allowed"
                          : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                    >
                      {alreadyInformed ? "Informed ✓" : "Confirm"}
                    </button>

                    {alreadyInformed &&
                      clients.some(
                        (client) => client.SuitableHCP !== hcp.UserId
                      ) && (
                        <p
                          className="px-3 py-1 text-[10px] font-medium rounded-full bg-[#40c9a2] text-white hover:bg-teal-700 cursor-pointer"
                          onClick={() =>
                            UpdateHCPIntrest(clients[0].userId, hcp.UserId)
                          }
                        >
                          Interested
                        </p>
                      )}
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
                  className={`text-[9px] text-center mt-1 font-semibold ${
                    StatusMessage === "Confirmation Send" ||
                    StatusMessage === "Now You Can Assign" ||
                    StatusMessage ===
                      "HCA Assigned Successfully, For More Information Check in Deployments"
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

  {clients[0].PhysioScore > 0 && (
    <div className="w-full md:w-auto mt-4 md:mt-0">
      <PhysioList />
    </div>
  )}
</div>

          {ShowAdditionHCPs.length!==0&& <h1 className="text-2xl sm:text-3xl mt-1 font-extrabold text-teal-700 dark:text-teal-400 tracking-tight drop-shadow-sm">
              Search Results
            </h1>}

          {(SearchOptions===true&&ShowAdditionHCPs.length===0)&&<div className="flex  flex-col items-center justify-center py-10 text-center text-gray-600">
    <div className="bg-gray-100 px-6 py-4 rounded-2xl shadow-sm border border-gray-200">
      <p className="text-lg font-medium text-gray-800">
        No Search Results Found
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Please adjust your HCP criteria and try again.
      </p>
    </div>
  </div>}
          <div className="max-h-[394px] overflow-y-auto  mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
              {ShowAdditionHCPs.map((hcp: any, idx: number) => {
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
       

                        <div className="flex flex-wrap justify-center gap-[1px] mt-1">
                        {PROFESSIONAL_SKILL_OPTIONS.map((skill: string, sidx: number) => {
                          const hasSkill = hcp.ProfessionalSkills.includes(skill);
                          return (
                            <span
                              key={sidx}
                              className={`text-[8px] px-1 py-1 rounded-full border ${hasSkill
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
        </div>
       
      </div>
    </div>
  );
};

export default SuitableHcpList;
