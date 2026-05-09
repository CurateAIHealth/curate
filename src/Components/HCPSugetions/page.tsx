'use client';

import React, { useEffect, useRef, useState } from 'react';
import jsPDF from "jspdf";
import { Eye, Search } from 'lucide-react';
import { Update_Main_Filter_Status, UpdateClient, UpdateClientSuggetion, UpdateRefresh, UpdateUserInformation } from '@/Redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import * as htmlToImage from 'html-to-image';
import { ClearClientTimeSheetInfo, GetInformedUsers,  GetTimeSheetInfo, IntrestedHCP, PostConfirmationInfo, TestInsertTimeSheet, UpdateHCAnstatus, UpdateHCAnstatusInFullInformation, UpdateUserContactVerificationstatus, UpdateUserCurrentstatusInHCPView } from '@/Lib/user.action';
import axios from 'axios';
import { calculateAgeIndianFormat } from '@/Lib/Actions';
import { HyderabadAreas, PROFESSIONAL_SKILL_OPTIONS, TestData } from '@/Lib/Content';
import PhysioList from '../Physio/page';
import { pre } from 'framer-motion/client';
const allProfessionalSkills = ["Diaper", "Bathing", "Bedding", "Brushing"];

type ClientType = {
  patientWeight: any;
  patientAge: any;
  patientHeight: any;
  hcpType: any;
  Source: any;
  patientPhone: any;
  serviceLocation: any;
  PhysioScore: number;
  patientType: any;
  Location: any;
  ContactNumber: any;
  userId: any;
  SuitableHCP: any;
  ServiceType:any;
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
  usersInfo:any[]
};

const SuitableHcpList: React.FC<Props> = ({ clients, hcps ,usersInfo}) => {
console.log("Check Client Information------",clients)
  const [selectedClientIndex, setSelectedClientIndex] = useState<number>(0);
  const [ExsitingInformedUsers, setExsitingInformedUsers] = useState<any[]>([]);
  const [StatusMessage, setStatusMessage] = useState<any>();
  const [CurrentUserId, setCurrentUserId] = useState<any>('');
  const [SearchFilter,setSearchFilter]=useState("")
  const [SearchReasult,setSearchReasult]=useState("")
  const [SearchOptions,setSearchOptions]=useState(true)
  const [loading, setLoading] = useState(true);
  const [showAssignedOnly, setShowAssignedOnly] = useState(true);
  const [showAssignConfirm,setShowAssignConfirm]=useState(false)
  const [TimeSheetData,setTimeSheetData]=useState<any>([])

  const dispatch = useDispatch();
  const router = useRouter();
const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    hcpType:"" as any,
    Gender: "" as any,
  });

  


  const cardRefs = useRef<{ [key: string]: HTMLElement | null }>({});
const updatedRefresh=useSelector((afterEach:any)=>afterEach.updatedCount)
const TimeStamp=useSelector((state:any)=>state.TimeStampInfo)


 useEffect(() => {
  let mounted = true;

  const fetchUsers = async () => {
    const informedUsers:any = await GetInformedUsers();
    const TimeSheetDataa:any =await GetTimeSheetInfo()

    
    if (!mounted) return;
    setExsitingInformedUsers(informedUsers);
    setTimeSheetData(TimeSheetDataa)
    setLoading(false);
  };

  fetchUsers();
  return () => { mounted = false };
}, [updatedRefresh]);

const activeClient = clients?.[selectedClientIndex];
useEffect(() => {
  if (!activeClient) return;

  const availability = TimeSheetData.filter(
    (each: any) => each.ClientId === activeClient.userId
  );

  setShowAssignConfirm(availability.length > 0);
}, [TimeSheetData, activeClient]);

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

 const UpdateAssignHca = async (
  UserIDClient: any, UserIdHCA: any, ClientName: any, ClientEmail: any, 
  ClientContact: any, Adress: any, HCAName: any, HCAContact: any,
  patientName: any, patientPhone: any, Source: any, Type: any
) => {
const PlacementInformation: any = await GetTimeSheetInfo();

 const availability = TimeSheetData.filter(
    (each: any) => each.ClientId === UserIDClient
  );

if(availability.length > 0){
  setStatusMessage("Please Wait Clearing Previous PDR Information...");
  
  const UpdateInfo= await ClearClientTimeSheetInfo(availability[0].ClientId,availability[0]. HCAId)
  const res = await UpdateUserCurrentstatusInHCPView(availability[0]. HCAId, "Bench");
  if(UpdateInfo?.success){
setStatusMessage("Client Prviouse Information deleted Successfully, Assigneing New HCP.....")
  }

}


   setCurrentUserId(UserIdHCA);

   const CurrentMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
  const DateofToday = new Date().toLocaleDateString('en-IN');
   const TimeStamp = new Date().toISOString();

  setStatusMessage("Please Wait Assigning HCA...");

 try {

    const today = new Date();
    const attendanceRecord = {
      date: today.toLocaleDateString('en-IN'),
      checkIn: today.toLocaleTimeString(),
      status: "Present",
    };

    const TimeSheetData: any[] = [attendanceRecord];

    await UpdateUserContactVerificationstatus(UserIDClient, "Waiting List");
    await UpdateHCAnstatus(UserIdHCA, "Active");
    await UpdateHCAnstatusInFullInformation(UserIdHCA);

    

    const DateOfCurrentDay = new Date();
    const LastDateOfMonth = new Date(
      DateOfCurrentDay.getFullYear(),
      DateOfCurrentDay.getMonth() + 1,
      0
    ).toLocaleDateString('en-IN');

    const Invoise = `BSV${new Date().getFullYear()}_${PlacementInformation.length + 1}`;

    const PostTimeSheet: any = await TestInsertTimeSheet(
      DateofToday, LastDateOfMonth, "Active", Adress, ClientContact, ClientName,
      patientName, patientPhone, Source, UserIdHCA, UserIDClient, HCAName,
      HCAContact, "Google", "Not Provided", 'PP', "21000", "700", "1800",
      "900", CurrentMonth, ["P"], TimeStamp, Invoise, Type
    );

 

    if (PostTimeSheet.success === true) {

      setStatusMessage(PostTimeSheet.message);
const res = await UpdateUserCurrentstatusInHCPView(UserIdHCA, "Active");
      setTimeout(() => {
        dispatch(UpdateRefresh(1));
        router.push("/PDRView");
        dispatch(Update_Main_Filter_Status("Deployment"));
      }, 3000);
    }else{
      setStatusMessage(PostTimeSheet.message);
    }

  } catch (err: any) {
    setStatusMessage(err);
  }
};


const SendBVR=(A:any)=>{
 const BVR_Link="https://res.cloudinary.com/db3dr9lf5/image/upload/v1761886244/uploads/xaxdclpd83ctaalexmzb.pdf"
    const phoneNumber = "919347877159";
    const message = `
Dear Sir/Madam,

Please find below the details of the Healthcare Professional:

👤 *Name:* ${A.HCPFirstName} ${A.HCPSurName}

📄 *BVR PDF:*  
${BVR_Link}

Kind regards,  
Curate Health Care Service
    `;

    // ✅ Open WhatsApp link
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");

}
  const UpdateHCPIntrest = async (Clientid: any, hcpid: any) => {
    setCurrentUserId(hcpid);
    setStatusMessage("Pleas Wait")
    const PostIntrest: any = await IntrestedHCP(Clientid, hcpid)
    if (PostIntrest.success===true) {
      dispatch(UpdateRefresh(1))
      dispatch(UpdateClientSuggetion(Clientid))
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


const query = SearchReasult.trim().toLowerCase();

const filteredHcps = hcps.filter((each: any) => {
  const matchesSearch =
    each?.HCPFirstName?.toLowerCase().includes(query.toLowerCase()) ||
    each?.HCPSurName?.toLowerCase().includes(query.toLowerCase());

  // Find matching user
  const matchedUser = usersInfo.find(
    (user: any) => user.userId === each.UserId
  );

  const userType = matchedUser?.PreviewUserType;
  const CurrentStatus = matchedUser?.CurrentStatus === "Bench";

  console.log("User Type for HCP", userType);

  // HCP Type filter
  const HCPTYPE = form.hcpType
    ? userType === form.hcpType
    : true;

  // Gender filter
  const GenderMatch = form.Gender
    ? each?.Gender === form.Gender
    : true;

  const isAssigned = each?.Status?.includes("Assigned");

  return showAssignedOnly
    ? matchesSearch &&
        HCPTYPE &&
        GenderMatch &&
        !isAssigned &&
        CurrentStatus
    : matchesSearch &&
        HCPTYPE &&
        GenderMatch;
});





const handleShare = async (hcp: any, clientUserId: any) => {
  try {
   
    setStatusMessage("Please Wait...");
    setCurrentUserId(hcp.UserId);

   
    const doc = new jsPDF();

    
    const logoUrl = "https://res.cloudinary.com/db3dr9lf5/image/upload/v1762838332/uploads/vke5pty7zgt24ganyc6w.jpg";
    //  const logoUrl = "https://res.cloudinary.com/db3dr9lf5/image/upload/v1762838949/uploads/q9olzkha1cl0bowvguaq.png"
    const logo = await fetch(logoUrl).then(res => res.blob());
    const logoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logo);
    });

    doc.addImage(logoBase64, "PNG", 10, 8, 30, 15);
    doc.setFontSize(16);
    doc.text("Healthcare Professional Information", 50, 18);
    doc.setFontSize(12);

    let y = 30; 

 
    const addText = (text: string) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(text, 10, y);
      y += 8;
    };

    // ✅ Personal Details
    addText(`Name: ${hcp.HCPFirstName || ""} ${hcp.HCPSurName || ""}`);
    addText(`Gender: ${hcp.Gender || ""}`);
    addText(`Date of Birth: ${hcp["Date of Birth"] || ""}`);
    addText(`Marital Status: ${hcp["Marital Status"] || ""}`);
    addText(`Contact Number: ${hcp.HCPContactNumber || ""}`);
    addText(`Email: ${hcp.HCPEmail || ""}`);
    addText(`Aadhar Number: ${hcp.HCPAdharNumber || ""}`);

    // ✅ Address
    addText("Address Information:");
    addText(`Current Address: ${hcp["Current Address"] || ""}`);
    addText(`Permanent Address: ${hcp["Permanent Address"] || ""}`);
    addText(`City: ${hcp["Branch City"] || ""}, State: ${hcp["Branch State"] || ""}`);
    addText(`Pincode: ${hcp["Branch Pincode"] || ""}`);

    // ✅ Education
    addText("Education:");
    addText(
      `Higher Education: ${hcp["Higher Education"] || ""} (${hcp["Higher Education Year Start"] || ""} - ${hcp["Higher Education Year End"] || ""})`
    );
    addText(
      `Professional Education: ${hcp["Professional Education"] || ""} (${hcp["Professional Education Year Start"] || ""} - ${hcp["Professional Education Year End"] || ""})`
    );

    // ✅ Work Experience
    addText("Work Experience:");
    addText(`Experience: ${hcp.Experience || ""}`);
    addText(`Professional Work 1: ${hcp["Professional Work 1"] || ""}`);
    addText(`Professional Work 2: ${hcp["Professional Work 2"] || ""}`);

    // ✅ Skills
    addText("Skills:");
    addText(`Handled Skills: ${(hcp.HandledSkills || []).join(", ")}`);
    addText(`Professional Skills: ${(hcp.ProfessionalSkills || []).join(", ")}`);
    addText(`Home Assistance: ${(hcp.HomeAssistance || []).join(", ")}`);
    addText(`Specialties: ${hcp.Specialties || ""}`);

    // ✅ Physical Details
    addText("Physical Details:");
    addText(`Height: ${hcp.Height || ""} ft`);
    addText(`Weight: ${hcp.Weight || ""} kg`);
    addText(`Complexion: ${hcp.Complexion || ""}`);
    addText(`Eye Colour: ${hcp["Eye Colour"] || ""}`);
    addText(`Hair Colour: ${hcp["Hair Colour"] || ""}`);
    addText(`Body Marks: ${(hcp["Mole/Body Mark 1"] || "")}, ${(hcp["Mole/Body Mark 2"] || "")}`);

    // ✅ Health
    addText("Health Information:");
    addText(`Any Deformity: ${hcp["Any Deformity"] || ""}`);
    addText(`Previous Health Issues: ${hcp["Report Previous Health Problems"] || ""}`);
    addText(`Current Health Issues: ${hcp["Report Current Health Problems"] || ""}`);

    // ✅ References
    addText("References:");
    addText(`Reference 1: ${hcp["Reference 1 Name"] || ""} (${hcp["Reference 1 Relationship"] || ""}), ${hcp["Reference 1 Address"] || ""}`);
    addText(`Reference 2: ${hcp["Reference 2 Name"] || ""}, ${hcp["Reference 2 Address"] || ""}`);

    // ✅ Certification
    addText("Certification:");
    addText(`Certified By: ${hcp["Certified By"] || ""}`);
    addText(`Registration Council: ${hcp["Registration Council"] || ""}`);
    addText(`Registration No: ${hcp["Registration No"] || ""}`);

    // ✅ Referral
    addText("Referral Details:");
    addText(`Source of Referral: ${hcp["Source of Referral"] || ""}`);
    addText(`Date of Referral: ${hcp["Date of Referral"] || ""}`);

    // ✅ Service
    addText("Service Information:");
    addText(`Preferred Service: ${hcp["Preferred Service"] || ""}`);
    addText(`Payment Service: ${hcp["Payment Service"] || ""}`);
    addText(`Service Hours: ${hcp["Service Hours 24hrs"] ? "24 Hours" : "12 Hours"}`);
    addText(`BVR (Background Verification Report): Complited`);

    y += 10;
  

    // ✅ Convert to Blob and create File
    const resumeBlob = doc.output("blob");
    const resumeFile = new File([resumeBlob], `${hcp.HCPFirstName}_Information.pdf`, {
      type: "application/pdf",
    });

    // ✅ Upload to API
    const formData = new FormData();
    formData.append("file", resumeFile);

    const res = await axios.post("/api/Upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const Profile_View = res.data.url;

    // ✅ WhatsApp message
    const phoneNumber = "919347877159";
const message = `
Dear Sir/Madam,

Please find below the details of the Healthcare Professional:

👤 *Name:* ${hcp.HCPFirstName} ${hcp.HCPSurName}

📄 *Profile PDF:*  
\u200B${Profile_View}

Kind regards,  
Curate Health Care Service
`;

window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");


    // ✅ Confirmation update
    await UpdateConfirmation(hcp, clientUserId);

    setStatusMessage("Profile Sent.");
  } catch (error) {
    console.error("Error generating or sharing PDF:", error);
    setStatusMessage("Something went wrong while sharing profile.");
  }
};




// 		const handleShare = async (hcp:any, clientUserId:any) => {

//   const doc = new jsPDF();


//   doc.setFontSize(16);
//   doc.text("Healthcare Professional Information", 10, 10);
//   doc.setFontSize(12);

//   let y = 20; 

//   doc.text(`Name: ${hcp.HCPFirstName} ${hcp.HCPSurName}`, 10, y); y += 8;
//   doc.text(`Gender: ${hcp.Gender}`, 10, y); y += 8;
//   doc.text(`Date of Birth: ${hcp["Date of Birth"]}`, 10, y); y += 8;
//   doc.text(`Marital Status: ${hcp["Marital Status"]}`, 10, y); y += 8;
//   doc.text(`Contact Number: ${hcp.HCPContactNumber}`, 10, y); y += 8;
//   doc.text(`Email: ${hcp.HCPEmail}`, 10, y); y += 8;
//   doc.text(`Aadhar Number: ${hcp.HCPAdharNumber}`, 10, y); y += 8;


//   doc.text("Address Information:", 10, y); y += 6;
//   doc.text(`Current Address: ${hcp["Current Address"]}`, 10, y); y += 8;
//   doc.text(`Permanent Address: ${hcp["Permanent Address"]}`, 10, y); y += 8;
//   doc.text(`City: ${hcp["Branch City"]}, State: ${hcp["Branch State"]}`, 10, y); y += 8;
//   doc.text(`Pincode: ${hcp["Branch Pincode"]}`, 10, y); y += 8;


//   doc.text("Education:", 10, y); y += 6;
//   doc.text(`Higher Education: ${hcp["Higher Education"]} (${hcp["Higher Education Year Start"]} - ${hcp["Higher Education Year End"]})`, 10, y); y += 8;
//   doc.text(`Professional Education: ${hcp["Professional Education"]} (${hcp["Professional Education Year Start"]} - ${hcp["Professional Education Year End"]})`, 10, y); y += 8;


//   doc.text("Work Experience:", 10, y); y += 6;
//   doc.text(`Experience: ${hcp.Experience}`, 10, y); y += 8;
//   doc.text(`Professional Work 1: ${hcp["Professional Work 1"]}`, 10, y); y += 8;
//   doc.text(`Professional Work 2: ${hcp["Professional Work 2"]}`, 10, y); y += 8;


//   doc.text("Skills:", 10, y); y += 6;
//   doc.text(`Handled Skills: ${hcp.HandledSkills.join(", ")}`, 10, y); y += 8;
//   doc.text(`Professional Skills: ${hcp.ProfessionalSkills.join("")}`, 10, y); y += 8;
//   doc.text(`Home Assistance: ${hcp.HomeAssistance.join(", ")}`, 10, y); y += 8;
//   doc.text(`Specialties: ${hcp.Specialties}`, 10, y); y += 8;

//   // // Bank Details
//   // doc.text("Bank Details:", 10, y); y += 6;
//   // doc.text(`Bank Name: ${hcp["Payment Bank Name"].content || ""}`, 10, y); y += 8;
//   // doc.text(`Branch Name: ${hcp["Bank Branch Name"]}`, 10, y); y += 8;
//   // doc.text(`Branch Address: ${hcp["Bank Branch Address"]}`, 10, y); y += 8;
//   // doc.text(`IFSC Code: ${hcp["IFSC Code"].content || ""}`, 10, y); y += 8;


//   doc.text("Physical Details:", 10, y); y += 6;
//   doc.text(`Height: ${hcp.Height} ft`, 10, y); y += 8;
//   doc.text(`Weight: ${hcp.Weight} kg`, 10, y); y += 8;
//   doc.text(`Complexion: ${hcp.Complexion}`, 10, y); y += 8;
//   doc.text(`Eye Colour: ${hcp["Eye Colour"]}`, 10, y); y += 8;
//   doc.text(`Hair Colour: ${hcp["Hair Colour"]}`, 10, y); y += 8;
//   doc.text(`Body Marks: ${hcp["Mole/Body Mark 1"]}, ${hcp["Mole/Body Mark 2"]}`, 10, y); y += 8;

  
//   doc.text("Health Information:", 10, y); y += 6;
//   doc.text(`Any Deformity: ${hcp["Any Deformity"]}`, 10, y); y += 8;
//   doc.text(`Previous Health Issues: ${hcp["Report Previous Health Problems"]}`, 10, y); y += 8;
//   doc.text(`Current Health Issues: ${hcp["Report Current Health Problems"]}`, 10, y); y += 8;

 
//   doc.text("References:", 10, y); y += 6;
//   doc.text(`Reference 1: ${hcp["Reference 1 Name"]} (${hcp["Reference 1 Relationship"]}), ${hcp["Reference 1 Address"]}`, 10, y); y += 8;
//   doc.text(`Reference 2: ${hcp["Reference 2 Name"]}, ${hcp["Reference 2 Address"]}`, 10, y); y += 8;

//   doc.text("Certification:", 10, y); y += 6;
//   doc.text(`Certified By: ${hcp["Certified By"]}`, 10, y); y += 8;
//   doc.text(`Registration Council: ${hcp["Registration Council"]}`, 10, y); y += 8;
//   doc.text(`Registration No: ${hcp["Registration No"]}`, 10, y); y += 8;


//   doc.text("Referral Details:", 10, y); y += 6;
//   doc.text(`Source of Referral: ${hcp["Source of Referral"]}`, 10, y); y += 8;
//   doc.text(`Date of Referral: ${hcp["Date of Referral"]}`, 10, y); y += 8;


//   doc.text("Service Information:", 10, y); y += 6;
//   doc.text(`Preferred Service: ${hcp["Preferred Service"]}`, 10, y); y += 8;
//   doc.text(`Payment Service: ${hcp["Payment Service"]}`, 10, y); y += 8;
//   doc.text(`Service Hours: ${hcp["Service Hours 24hrs"] ? "24 Hours" : "12 Hours"}`, 10, y); y += 8;
//   doc.text(`BVR (Backgroud Verification Report): Done`, 10, y); y += 8;

 
//   y += 10;
//   doc.text("Generated by Healthcare Portal", 10, y);
//   const resumeBlob = doc.output("blob");

//   const resumeFile = new File([resumeBlob], `${hcp.HCPFirstName}_Information.pdf`, { type: 'application/pdf' });

//  const response = await axios.get('https://res.cloudinary.com/db3dr9lf5/image/upload/v1761886244/uploads/xaxdclpd83ctaalexmzb.pdf', {
//   responseType: 'blob',
// });
// const cloudinaryBlob = response.data;

// const fileType = cloudinaryBlob.type; 

// let fileExtension = "bin"; 
// if (fileType === "application/pdf") fileExtension = "pdf";
// else if (fileType === "image/png") fileExtension = "png";
// else if (fileType === "image/jpeg") fileExtension = "jpg";
// else if (fileType === "image/webp") fileExtension = "webp";
// else if (fileType === "image/gif") fileExtension = "gif";


// const cloudinaryFile = new File([cloudinaryBlob], `${hcp.HCPFirstName} ${hcp.HCPSurName} BVR.${fileExtension}`, {
//   type: fileType,
// });


//   const filesToShare = [resumeFile, cloudinaryFile];
//   if (navigator.canShare && navigator.canShare({ files: filesToShare })) {
//     await navigator.share({
//       title: "HCP Resume and BVR Certificate",
//       text: "Attached are the resume and additional document.",
//       files: filesToShare,
//     });
//     setStatusMessage('Shared successfully!');
//   } else {

//     filesToShare.forEach(file => {
//       const url = URL.createObjectURL(file);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = file.name;
//       a.click();
//       URL.revokeObjectURL(url);
//     });
//     setStatusMessage('Files downloaded. Sharing not supported in this browser.');
//   }

//   await UpdateConfirmation(hcp, clientUserId);
// };




  const UpdateNewSearchItem=(A:any)=>{
    setSearchFilter(A)
  }

const suitableHcps = hcps.filter((hcp: any) => {
  const client = clients[selectedClientIndex];
  if (!client || loading) return false;

  const hasDiaperSkill =
    Array.isArray(hcp?.HomeAssistance) &&
    hcp.HomeAssistance.includes("Diaper");

  const available =
    !Array.isArray(hcp?.Status) ||
    !hcp.Status.includes("Assigned");

  const matchesClientAssistance =
    Array.isArray(hcp?.HandledSkills) &&
    Array.isArray(client?.patientType) &&
    hcp.HandledSkills.some((skill: any) =>
      client.patientType.includes(skill)
    );

  return hasDiaperSkill && matchesClientAssistance && available;
});


// const First = hcps.filter((each: any) => each.userType === "healthcare-assistant");


const isAvailable = (hcp: any) =>
  !hcp.Status?.some((value: string) => value === "Assigned");


// const ShowAdditionHCPs = hcps.filter((each: HcpType) => {
//   if (!isAvailable(each)) return false;

//   const hcpTypeMatch =
//     form.hcpType.length === 0 ||
//     form.hcpType.includes(each.Type);

//   const qualificationMatch =
//     form.qualification.length === 0 ||
//     form.qualification.includes(each["Professional Education"]);

//   const experienceMatch =
//     !form.experience ||
//     Number(each.Experience) >= Number(form.experience);

//   const healthMatch =
//     form.healthConditions.length === 0 ||
//     form.healthConditions.some(condition =>
//       each?.HandledSkills?.some((skill: string) =>
//         skill.toLowerCase().includes(condition.toLowerCase())
//       )
//     );

//   const locationMatch =
//     !form.location ||
//     each?.["Current Address"]
//       ?.toLowerCase()
//       .includes(form.location.toLowerCase());

//   return (
//     hcpTypeMatch &&
//     qualificationMatch &&
//     experienceMatch &&
//     healthMatch &&
//     locationMatch
//   );
// });


   const AssignedHcps = hcps.filter((hcp: any) => !Array.isArray(hcp?.Status) || !hcp.Status.includes("Assigned") );






if(showAssignConfirm){

  return(
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
  <div className="w-[92%] max-w-sm bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex">

    <div className="w-1.5 " />

    <div className="flex-1 p-5 text-center">
      <div className="text-xl mb-2">⚠️</div>

      <h2 className="text-sm font-semibold text-gray-800">
        Assignment Confirmation
      </h2>

      <p className="text-sm text-gray-600 mt-2">
        An HCP is already assigned. Do you want to assign another one?
      </p>

      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={() => {router.push("/AdminPage")}}
          className="px-4 py-1 rounded-md border text-xs sm:text-sm hover:bg-gray-100"
        >
          No
        </button>

        <button className="px-4 py-1 rounded-md bg-gray-900 text-white text-xs sm:text-sm" onClick={() => setShowAssignConfirm(false)}>
          Yes
        </button>
      </div>
    </div>

  </div>
</div>
  )

}

if (!activeClient) {
  return (
    <div className="text-center text-gray-500 py-10">
      No client selected
    </div>
  );
}

 
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
  
  


  <div className="h-[100vh] overflow-y-auto max-w-[420px] mx-auto px-2 py-3 space-y-3 scrollbar-thin scrollbar-thumb-[#cbd5e1] scrollbar-track-transparent">
  {clients.map((client, index) => (
    <div
      key={index}
      onClick={() => setSelectedClientIndex(index)}
      className={`rounded-[22px] border overflow-hidden transition-all duration-300
      ${
        selectedClientIndex === index
          ? "border-[#38bdf8] bg-[#f8fcff] shadow-sm"
          : "border-[#e2e8f0] bg-white"
      }`}
    >
      <div className="p-3">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          
          <div className="flex items-center gap-2.5">
            
            <div className="h-10 w-10 rounded-xl bg-[#e0f2fe] flex items-center justify-center text-[#0284c7] font-bold text-sm">
              {client.FirstName?.charAt(0)}
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#0f172a] leading-none">
                {client.FirstName}
              </h2>

              <p className="text-[11px] text-[#64748b] mt-1">
                {client.Email}
              </p>
            </div>
          </div>

          <span
            className={`px-2 py-1 rounded-full text-[9px] font-medium
            ${
              selectedClientIndex === index
                ? "bg-[#0ea5e9] text-white"
                : "bg-[#f1f5f9] text-[#475569]"
            }`}
          >
            Selected
          </span>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          
          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-2">
            <p className="text-[9px] uppercase text-[#64748b]">
              Patient
            </p>

            <p className="text-xs font-semibold text-[#0f172a] mt-1">
              {client.patientName}
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-2">
            <p className="text-[9px] uppercase text-[#64748b]">
              Age
            </p>

            <p className="text-xs font-semibold text-[#0f172a] mt-1">
              {client.patientAge}
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-2">
            <p className="text-[9px] uppercase text-[#64748b]">
              Height
            </p>

            <p className="text-xs font-semibold text-[#0f172a] mt-1">
              {client.patientHeight||"Not Provided"}
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-2">
            <p className="text-[9px] uppercase text-[#64748b]">
              Weight
            </p>

            <p className="text-xs font-semibold text-[#0f172a] mt-1">
              {client.patientWeight}
            </p>
          </div>
        </div>

        {/* Assistance */}
        <div className="mt-3 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-2.5">
          
          <p className="text-[9px] uppercase font-semibold text-[#15803d] mb-1">
            Home Assistance
          </p>

          <p className="text-[11px] text-[#166534] leading-relaxed">
            {client.patientHomeAssistance.join(", ")}
          </p>
        </div>

    

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          
  

          <button
         
            className={`flex items-center justify-center gap-1 rounded-xl border px-3 py-2 text-[11px] font-semibold
            ${
              SearchOptions
                ? "bg-[#0ea5e9] border-[#0ea5e9] text-white"
                : "bg-white border-[#cbd5e1] text-[#334155]"
            }`}
          >
            <Search className="w-3 h-3" />
            Filters
          </button>
        </div>

        {/* Compact Filters */}
        {SearchOptions && (
          <div className="mt-4 border-t border-[#e2e8f0] pt-3 space-y-3">
            
            {/* HCP */}
            <div>
              <p className="text-[10px] font-semibold text-[#334155] mb-2">
                HCP Type
              </p>

              <div className="flex flex-wrap gap-1.5">
  {["HCA", "HCN", "HCPT"].map((type) => (
    <button
      key={type}
      type="button"
      onClick={() =>
        setForm((prev) => ({
          ...prev,
          hcpType: type,
        }))
      }
      className={`px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all
      ${
        form.hcpType === type
          ? "bg-[#0ea5e9] border-[#0ea5e9] text-white"
          : "bg-[#f8fafc] border-[#cbd5e1] text-[#334155]"
      }`}
    >
      {type}
    </button>
  ))}
</div>
            </div>

            {/* Gender */}
            <div>
              <p className="text-[10px] font-semibold text-[#334155] mb-2">
                Prefer {client.ServiceType||"HCP"} Gender
              </p>

              <div className="flex gap-1.5">
                {["Male", "Female"].map((gender) => (
                  <button
                    key={gender}
                       onClick={() =>
        setForm((prev) => ({
          ...prev,
          Gender: gender,
        }))
      }
                className={`px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all
      ${
        form.Gender === gender
          ? "bg-[#0ea5e9] border-[#0ea5e9] text-white"
          : "bg-[#f8fafc] border-[#cbd5e1] text-[#334155]"
      }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

        
          </div>
        )}
      </div>
    </div>
  ))}
</div>
</div>


        <div className="w-full lg:w-4/5 mx-auto py-0">
         {SearchOptions===true&& 
            <div>
              <div className="mb-2 flex flex-col sm:flex-row items-center justify-between">
                <h1 className="text-[26px]  font-extrabold text-teal-700 dark:text-teal-400 tracking-tight drop-shadow-sm">
                  Friendly Care Matches
                </h1>

{StatusMessage && (
  <p className="mt-3 px-4 py-2 rounded-lg text-sm text-red-700 bg-yellow-100 border border-gray-200">
    {StatusMessage}
  </p>
)}

  
 

   {/* <button
  onClick={() => setShowAssignedOnly(prev => !prev)}
  className={`flex items-center justify-center gap-2 px-2 py-1.5 text-xs hover:shadow-lg w-fit font-semibold 
              rounded-full transition-all duration-200 cursor-pointer 
              ${
                showAssignedOnly
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}
>

        
  {showAssignedOnly ? "🟢 Show Full List" : "🟡 Show Available List"}
</button> */}

               <div className="flex flex-wrap items-center gap-2">
                               <input
  type="search"
  placeholder="Search..."
  onChange={(e:any)=>setSearchReasult(e.target.value)}
  className="max-w-sm rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/30"
/>
                 <div className="flex items-center gap-2 rounded-full bg-blue-100 px-2 py-2 text-sm text-blue-700 hover:bg-blue-200 transition">
    🟢 Available{" "}
    <span className="font-semibold">
      {filteredHcps.length}
    </span>
  </div>
  {/* <div className="flex items-center gap-2 rounded-full bg-gray-100 px-2 py-2 text-sm text-gray-700 hover:bg-gray-200 transition">
    📋 Total <span className="font-semibold">{hcps.length}</span>
  </div> */}

  {/* <div className="flex items-center gap-2 rounded-full bg-green-100 px-2 py-2 text-sm text-green-700 hover:bg-green-200 transition">
    ✓ Assigned <span className="font-semibold">{AssignedHcps.length}</span>
  </div> */}

 


</div>

              </div>

              <div className="flex flex-col md:flex-row w-full justify-between items-center md:items-start gap-4 md:gap-6 px-2 sm:px-4">
                {filteredHcps.length === 0 ? (
                  <div className="w-full flex items-center justify-center py-16 px-4">
  <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white px-10 py-14 shadow-xl">

   
    <div className="absolute top-6 left-6 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700">
      HCP Search
    </div>

    <div className="absolute top-6 right-6 rounded-full bg-amber-100 px-4 py-1 text-xs font-semibold text-amber-700">
      No Match
    </div>

    <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-50 blur-2xl" />
    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-slate-100 blur-2xl" />


    <div className="relative z-10 flex flex-col items-center text-center">

  
      <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-slate-100 shadow-inner">
     <img src="Icons/NoInformation.gif" alt="No Information" className='h-00'/>
      </div>


      <h2 className="mt-7 text-3xl font-bold tracking-tight text-slate-900">
        No Suitable HCPs Found
      </h2>

      <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500">
        We were unable to find healthcare professionals matching the current
        client requirements. You can refine your filters, broaden the search
        criteria, or try again later.
      </p>

     

    
    </div>
  </div>
</div>
                ) : (
                  <div className="md:h-[550px] overflow-y-auto flex flex-wrap justify-center md:justify-start gap-3 md:gap-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 p-2">
                    {filteredHcps.map((hcp: any, idx: number) => {
                      console.log("HCP Status:", hcp);
                      const alreadyInformed = ExsitingInformedUsers.some(
                        (each) =>
                          each.InformedHCPID === hcp.UserId &&
                          each.InformedClientID === activeClient?.userId
                      );
                      const isCurrent = CurrentUserId === hcp.UserId;
const isAssigned =
  Array.isArray(hcp?.Status) && hcp.Status.includes("Assigned");

                      return (
                        <article
                          key={idx}
                          ref={(el) => {
                            cardRefs.current[hcp.UserId] = el;
                          }}
                          className="relative flex flex-col items-center bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-[140px] sm:w-[140px] md:w-[140px] lg:w-[180px] min-h-[220px]"
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
                           {hcp.HCPSurName} {hcp.HCPFirstName}  {hcp.HCPLastName}
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
                                Exp: {hcp?.Experience || 0} yrs
                              </span>
                            </div>

 {hcp.Languages?
 <div>
                            
    <p className="flex flex-wrap items-center justify-center gap-1  mt-1 text-[10px] font-medium border border-yellow-300 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-2 py-1 rounded-md">
  <span className="text-[8px] whitespace-nowrap">Languages:</span>
  <span className="break-words text-center">
    {hcp?.Languages || "Not specified"}
  </span>
</p>


</div>:
<p className="inline-flex items-center gap-2 px-2 py-1 text-[10px] 
              rounded-full bg-red-100 text-red-600 border border-red-600">
  Languages Not Updated
</p>

}

                            {/* <div className="flex flex-wrap justify-center gap-[1px] mt-1">
                              {PROFESSIONAL_SKILL_OPTIONS.map((skill: string, sidx: number) => {
                                const hasSkill =
                                  Array.isArray(hcp?.ProfessionalSkills) &&
                                  hcp?.ProfessionalSkills.includes(skill);

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
                            </div> */}

                        {isAssigned?
                        <div className='flex gap-2 items-end justify-center'>
                        <p className="group mt-1 inline-flex cursor-not-allowed items-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-md transition">
  Assigned

 
  <span className="ml-1 hidden items-center text-[11px] opacity-80 group-hover:inline-flex">
    🚫
  </span>
</p>
<button   className="bg-blue-600 group mt-1 inline-flex  items-center gap-1.5 rounded-full cursor-pointer px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-md transition"
onClick={async()=>{
  
const UpdateResults=await UpdateHCAnstatus(hcp.UserId,"Available for Work")

  alert(UpdateResults.message)



}}
>Update</button>
</div>
:
 <button
                                  className="bg-green-600 text-white cursor-pointer px-3 py-1 rounded-full text-[10px] font-medium shadow-sm hover:bg-green-700 transition-colors"
                                  onClick={() =>
                                    UpdateAssignHca(
                                      activeClient.userId,
                                      hcp?.UserId,
                                     activeClient.FirstName,
                                      activeClient.Email,
                                      activeClient.ContactNumber,
                                      activeClient.serviceLocation,
                                      hcp.HCPFirstName,
                                      hcp.HCPContactNumber,
                                      activeClient.patientName,
                                     activeClient.patientPhone,
                                      activeClient.Source,
                                      activeClient.hcpType


                                    )
                                  }
                                >
                                  Assign
                                </button>

                            // <div className="mt-2 flex justify-center gap-2 flex-wrap">
                            //   {activeClient?.SuitableHCP === hcp?.UserId ? (
                            //     <button
                            //       className="bg-green-600 text-white cursor-pointer px-3 py-1 rounded-full text-[10px] font-medium shadow-sm hover:bg-green-700 transition-colors"
                            //       onClick={() =>
                            //         UpdateAssignHca(
                            //           activeClient.userId,
                            //           hcp?.UserId,
                            //          activeClient.FirstName,
                            //           activeClient.Email,
                            //           activeClient.ContactNumber,
                            //           activeClient.serviceLocation,
                            //           hcp.HCPFirstName,
                            //           hcp.HCPContactNumber,
                            //           activeClient.patientName,
                            //          activeClient.patientPhone,
                            //           activeClient.Source,
                            //           activeClient.hcpType


                            //         )
                            //       }
                            //     >
                            //       Assign
                            //     </button>
                            //   ) : (
                            //     <div className="flex justify-between gap-3 sm:gap-6">
                            //       <button
                            //         onClick={() => handleShare(hcp, activeClient.userId)}
                            //         disabled={alreadyInformed}
                            //         className={`px-3 py-1 text-[9px] cursor-pointer font-medium rounded-full transition-all duration-200 ${alreadyInformed
                            //             ? "bg-red-500/90 text-white cursor-not-allowed"
                            //             : "bg-teal-600 text-white hover:bg-teal-700"
                            //           }`}
                            //       >
                            //         {alreadyInformed ? "Informed✓" : "Confirm"}
                            //       </button>

                            //       {alreadyInformed &&
                            //         clients.some(
                            //           (client) => client.SuitableHCP !== hcp.UserId
                            //         ) && (
                            //           <p
                            //             className="px-3 py-1 text-[9px] font-medium rounded-full bg-[#40c9a2] text-white hover:bg-teal-700 cursor-pointer"
                            //             onClick={() =>
                            //               UpdateHCPIntrest(activeClient.userId, hcp.UserId)
                            //             }
                            //           >
                            //             Interested
                            //           </p>
                            //         )}
                            //     </div>
                            //   )}
                            // </div>
                            
                            }
                            {/* {alreadyInformed && <p className="px-3 py-1 text-[9px] mt-2 font-medium rounded-full bg-pink-500 text-white hover:bg-teal-700 cursor-pointer" onClick={() => SendBVR(hcp)}>
                              Send BVR
                            </p>} */}

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
                                className={`text-[9px] text-center mt-1 font-semibold ${StatusMessage === "Confirmation Send" ||
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

                {activeClient.PhysioScore > 0 && (
                  <div className="w-full md:w-auto mt-4 md:mt-0">
                    <PhysioList />
                  </div>
                )}
              </div>
            </div>
}

        </div>
       
      </div>
    </div>
  );
};

export default SuitableHcpList;