'use client';

import { useCallback, useEffect, useState, } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { GetHCACompliteInformation, GetUserCompliteInformation, GetUserInformation, UpdateClientComplitInformation, UpdateHCAComplitInformation } from '@/Lib/user.action';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Pencil, X } from 'lucide-react';
import { PROFESSIONAL_SKILL_OPTIONS } from '@/Lib/Content';
import { LoadingData } from '../Loading/page';
import { Update_Main_Filter_Status, UpdateUserType } from '@/Redux/action';


const TABS = ['Personal Info', 'Bank Details', 'Documents', 'Work Experience', 'Identifiers'];

type DocumentKeys = 'ProfilePic' | 'AdharCard' | 'PanCard' | 'AccountPassBook' | 'CertificatOne' | 'CertificatTwo';

type UserData = {
  firstName: string;
  surname: string;
  title: string;
  gender: string;
  dateOfBirth: string;
  emailId: string;
  mobileNumber: string;
  currentAddress: string;
  permanentAddress: string;
  maritalStatus: string;

  height: string;
  weight: string;
  complexion: string;
  eyeColour: string;
  hairColour: string;
  languages: string;
  moleBodyMark1: string;
  moleBodyMark2: string;
  Bankbranchname: string;
  Branchcity: string;
  Branchpincode: string;
  Branchstate: string;
  paymentBankName: string;
  paymentBankAccountNumber: string;
  ifscCode: string;
  Documents: Record<DocumentKeys, string>;
  experience: string;
  professionalWork1: string;
  professionalWork2: string;
  professionalEducation: string;
  aadharCardNo: string;
  panNumber: string;
  rationCardNo: string;
  DocumentSkipReason:string;
  paymentService:string
preferredService:string,
ProfetionSkill:any
};

const UserDetail = () => {
  const [activeTab, setActiveTab] = useState<string>('Personal Info');
const [loadingDocs, setLoadingDocs] = useState<Record<string, boolean>>({});
const [SubmitstatusMessage,setSubmitstatusMessage]=useState("")
  const [isChecking, setIsChecking] = useState(true);
  const [ProfetionlSkillsEdit,setProfetionlSkillsEdit]=useState(false)
  const [ShowPassword,setShowPassword]=useState<any>("")
const Router=useRouter()
const dispatch=useDispatch()
const ImportedUserId=useSelector((state:any)=>state.UserDetails)
const NameoftheClient=useSelector((state:any)=>state.ClientName)
  const [user, setUser] = useState<UserData>({
    firstName: "Sunil",
    surname: "Nayak",
    title: "Mr.",
    gender: "Male",
    dateOfBirth: "1996-11-19",
    emailId: "Sn2551720@gmail.com",
    mobileNumber: "7846989381",
    currentAddress: "OU Colony ,shaikpet,Manikanda",
    permanentAddress: "KARCHHABADI,Karchabadi,Karchabadi",
    maritalStatus: "Single",
    height: "5.2",
    weight: "70 kg",
    complexion: "Black",
    eyeColour: "Black",
    hairColour: "Black",
    languages: "Odia ,Hindi & English",
    moleBodyMark1: "Right hand Skin Swelling ",
    moleBodyMark2: "NA",
    Bankbranchname: "Bapuji Nagar,Bhubanswar",
    Branchcity: "Bhubaneswar",
    Branchpincode: "751009",
    Branchstate: "Odisha",
    paymentBankName: "Union Bank",
    paymentBankAccountNumber: "004810100064801",
    ifscCode: "UBIN0800481",
    paymentService:"",
preferredService:"",
    Documents: {
      ProfilePic: "/Icons/DefaultProfileIcon.png",
      AdharCard: "https://res.cloudinary.com/dxhf9ysx4/image/upload/v1754297394/uploads/rn0qso7w5mjf47jmijwz.jpg",
      PanCard: "https://res.cloudinary.com/dxhf9ysx4/image/upload/v1754297398/uploads/eyaxfscwthv3u4fwbk3d.jpg",
      AccountPassBook: "https://res.cloudinary.com/dxhf9ysx4/image/upload/v1754297505/uploads/tqqhys7yomtvpv1ad168.jpg",
      CertificatOne: "https://res.cloudinary.com/dxhf9ysx4/image/upload/v1754297478/uploads/vq7q55n84va0zxrcnziz.jpg",
      CertificatTwo: "https://res.cloudinary.com/dxhf9ysx4/image/upload/v1754297494/uploads/xjjh4r1xqnugpjbtxj7v.jpg"
    },
    experience: "3",
    professionalWork1: "Lab Technician ( Tata Steel company) Odisha",
    professionalWork2: "Covid-19 test as a Lab technician (Bhubaneswar)",
    professionalEducation: "DMLT(Lab Technician",
    aadharCardNo: "378278869737",
    panNumber: "CYGPN6926A",
    rationCardNo: "10042011284",
ProfetionSkill:[],
    DocumentSkipReason:""
  });

useEffect(()=>{
    const Fetch = async () => {
    try {
      const Result:any = await GetHCACompliteInformation(ImportedUserId);
      const BasicInfo:any=await GetUserInformation(ImportedUserId)
    setShowPassword(BasicInfo.PreviewPassword)
      const FilterValue=Result.HCAComplitInformation
      console.log("Test Complite HCA Information---",FilterValue)
      setUser(prev=>({...prev,
    firstName: FilterValue["First Name"] || "",
  surname: FilterValue["Surname"] || "",
  gender: FilterValue["Gender"] || "",
  dateOfBirth: FilterValue["Date of Birth"] || "",
  emailId: FilterValue["EmailId"] || "",
  mobileNumber: FilterValue["Mobile Number"] || "",
  currentAddress: FilterValue["Current Address"] || "",
  permanentAddress: FilterValue["Permanent Address"] || "",
  maritalStatus: FilterValue["Marital Status"] || "",
  height: FilterValue["Height"] || "",
  weight: FilterValue["Weight"] || "",
  complexion: FilterValue["Complexion"] || "",
  eyeColour: FilterValue["Eye Colour"] || "",
  hairColour: FilterValue["Hair Colour"] || "",
  languages: FilterValue["Languages"] || "",
  moleBodyMark1: FilterValue["Mole/Body Mark 1"] || "",
  moleBodyMark2: FilterValue["Mole/Body Mark 2"] || "",
  Bankbranchname: FilterValue["Bank Branch Name"] || "",
  Branchcity: FilterValue["Branch City"] || "",
  Branchpincode: FilterValue["Branch Pincode"] || "",
  Branchstate: FilterValue["Branch State"] || "",
  paymentBankName: FilterValue["Payment Bank Name"] || "",
  paymentBankAccountNumber: FilterValue["Payment Bank Account Number"] || "",
  ifscCode: FilterValue["IFSC Code"] || "",
  experience: FilterValue["Experience"] || "",
  professionalWork1: FilterValue["Professional Work 1"] || "",
  professionalWork2: FilterValue["Professional Work 2"] || "",
  professionalEducation: FilterValue["Professional Education"] || "",
  aadharCardNo: FilterValue["Aadhar Card No"] || "",
  panNumber: FilterValue["PAN Number"] || "",
  rationCardNo: FilterValue["Ration Card No"] || "",
  paymentService: FilterValue["Payment Service"] || "",
  preferredService: FilterValue["Preferred Service"] || "",
  DocumentSkipReason: FilterValue["DocumentSkipReason"] || "",
  ProfetionSkill:FilterValue['Professional Skill']||FilterValue.ProfessionalSkills||'',

    Documents: {
          ...prev.Documents,
      ProfilePic: FilterValue.Documents.ProfilePic||'/Icons/PatientDefault.png',
      AdharCard:FilterValue.Documents.AdharCard||'/Icons/PatientDefault.png',
      PanCard: FilterValue.Documents.PanCard||'/Icons/PatientDefault.png',
      AccountPassBook:FilterValue.Documents. AccountPassBook||'/Icons/PatientDefault.png',
      CertificatOne:FilterValue.Documents.CertificatOne||'/Icons/PatientDefault.png',
      CertificatTwo: FilterValue.Documents.CertificatTwo||'/Icons/PatientDefault.png',
      BVR:FilterValue.BVR||'/Icons/PatientDefault.png',
      HCPform:FilterValue.HCPform||'/Icons/PatientDefault.png'





        },

      }))
      setIsChecking(false)
    } catch (err: any) {
      console.log("Error", err);
    }
  };
    Fetch()
},[])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const ShowFullImage = (url: string) => {
    window.open(url, '_blank');
  };

 const handleImageChange = useCallback(
  async (e: React.ChangeEvent<HTMLInputElement>, key: DocumentKeys) => {
  
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Max allowed is 10MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg','application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only image or video files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoadingDocs(prev => ({ ...prev, [key]: true }));

    try {
      const res = await axios.post('/api/Upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  console.log("NeW iMAGE----", res.data.url)
      setUser(prevUser => ({
        ...prevUser,
        Documents: {
          ...prevUser.Documents,
          [key]: res.data.url,
        },
      }));
    } catch (error: any) {
      console.error('Upload failed:', error.message);
      alert("Document upload failed!");
    } finally {
      setLoadingDocs(prev => ({ ...prev, [key]: false }));
    }
  },
  []
);

  const Revert = () => {
     dispatch(Update_Main_Filter_Status("HCP List")); 
        dispatch(UpdateUserType("healthcare-assistant"));
        Router.push("/AdminPage")
    }
const UpdatewithNewData=async()=>{
    setSubmitstatusMessage("Please Wait Updating Profile....")
try{
    const FinelData={...user,UserId:ImportedUserId,userType:"HCA"}
const UpdatedResult= await UpdateHCAComplitInformation(ImportedUserId,FinelData)
console.log("Result---",UpdatedResult)
setSubmitstatusMessage("Profile Updated Succesfully")
}catch(err:any){

}
}
  if (isChecking) {
    return (
        <LoadingData/>
    );
  }
  const handleprofessionalSkillChange = (skill:any) => {
    setUser((prev:any) => {
      const skills:any = prev.ProfetionSkill || [];
      return skills.includes(skill)
        ? { ...prev, ProfetionSkill: skills.filter((s:any) => s !== skill) }
        : { ...prev, ProfetionSkill: [...skills, skill] };
    });
  };
console.log("Checkkkkk------", user.Documents)
  const renderTabContent = () => {
  switch (activeTab) {
    case 'Personal Info':
      return (
        <div>
         
            <div className="p-4 mb-2 bg-white rounded-2xl shadow-md border border-gray-200">
              <div className='flex justify-between'>
  <label className="block text-gray-700 font-semibold mb-2 text-lg">
              Profession Skills:
            </label>

            {ProfetionlSkillsEdit?<p onClick={()=>setProfetionlSkillsEdit(!ProfetionlSkillsEdit)} className='border p-1 text-green-800 cursor-pointer h-8 shadow-lg rounded-md'>Save</p>: <Pencil className='cursor-pointer h-5 w-5' onClick={()=>setProfetionlSkillsEdit(!ProfetionlSkillsEdit)}/>}
          
              </div>
          
          {ProfetionlSkillsEdit?<div className="flex flex-wrap gap-2">
               {PROFESSIONAL_SKILL_OPTIONS.map((skill) => (
                 <label key={skill} className="flex items-center text-sm">
                   <input
                     type="checkbox"
                     className="mr-2 accent-purple-600"
                     checked={user.ProfetionSkill.includes(skill)||false}
                     onChange={() => handleprofessionalSkillChange(skill)}
                   />
                   {skill}
                 </label>
               ))}
             
            </div>:
       <div className="flex flex-wrap gap-2">
  {Array.isArray(user.ProfetionSkill) &&
    user.ProfetionSkill.map((each: any, index: number) => (
      <span
        key={index}
        className="px-3 py-1 bg-blue-100 h-7 text-blue-700 text-sm font-medium rounded-full shadow-sm hover:bg-blue-200 transition"
      >
        {each}
      </span>
    ))}
</div>
}
          </div>
       
        <div className="grid md:grid-cols-2 gap-4">
        
          <TextInput label="First Name" name="firstName" value={user.firstName} onChange={handleChange} />
                    <TextInput label="SurName" name="surname" value={user.surname} onChange={handleChange} />
          <TextInput label="Gender" name="gender" value={user.gender} onChange={handleChange} />
          
          <TextInput label="Date of Birth" name="dateOfBirth" type="date" value={user.dateOfBirth} onChange={handleChange} />
          <TextInput label="Email" name="emailId" type="email" value={user.emailId} onChange={handleChange} />
          <TextInput label="Mobile Number" name="mobileNumber" type="tel" value={user.mobileNumber} onChange={handleChange} />
          <TextInput label="Current Address" name="currentAddress" value={user.currentAddress} onChange={handleChange} />
          <TextInput label="Permanent Address" name="permanentAddress" value={user.permanentAddress} onChange={handleChange} />
          <TextInput label="Marital Status" name="maritalStatus" value={user.maritalStatus} onChange={handleChange} />
          <TextInput label="Height" name="height" value={user.height} onChange={handleChange} />
          <TextInput label="Weight" name="weight" value={user.weight} onChange={handleChange} />
          <TextInput label="Eye Colour" name="eyeColour" value={user.eyeColour} onChange={handleChange} />
          <TextInput label="Hair Colour" name="hairColour" value={user.hairColour} onChange={handleChange} />
          <TextInput label="Complexion" name="complexion" value={user.complexion} onChange={handleChange} />
          <TextInput label="Languages" name="languages" value={user.languages} onChange={handleChange} />
          <TextInput label="Mole/Body Mark 1" name="moleBodyMark1" value={user.moleBodyMark1} onChange={handleChange} />
          <TextInput label="Mole/Body Mark 2" name="moleBodyMark2" value={user.moleBodyMark2} onChange={handleChange} />
          <TextInput label="PreferredService" name="preferredService" value={user.preferredService} onChange={handleChange} />
     

        </div>
         </div>
      );
    case 'Bank Details':
      return (
        <div className="grid md:grid-cols-2 gap-4">
          <TextInput label="Bank Name" name="paymentBankName" value={user.paymentBankName} onChange={handleChange} />
          <TextInput label="Account Number" name="paymentBankAccountNumber" value={user.paymentBankAccountNumber} onChange={handleChange} />
          <TextInput label="IFSC Code" name="ifscCode" value={user.ifscCode} onChange={handleChange} />
          <TextInput label="Branch Name" name="Bankbranchname" value={user.Bankbranchname} onChange={handleChange} />
          <TextInput label="Branch City" name="Branchcity" value={user.Branchcity} onChange={handleChange} />
          <TextInput label="Branch State" name="Branchstate" value={user.Branchstate} onChange={handleChange} />
          <TextInput label="Branch Pincode" name="Branchpincode" value={user.Branchpincode} onChange={handleChange} />
          <TextInput label="paymentService" name="paymentService" value={user.paymentService} onChange={handleChange} />
          
        </div>
      );
    case 'Documents':
      return (
        <div>       
             <div className='flex flex-col justify-center items-center gap-2 mb-4'>
          <h1 className='text-[#ff1493] font-bold'>Missing Documents Explanation</h1>
          <input placeholder="ReasonDocumentSkip" name="DocumentSkipReason" className='border bg-gray-200 p-2 rounded-md text-center h-[40px] w-[600px]' value={user.DocumentSkipReason} onChange={handleChange} />
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          
          {Object.entries(user.Documents).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-2 items-center justify-center">
              <div className="w-full h-40 flex items-center justify-center rounded">
                {loadingDocs[key] ? (
                  <p className="text-sm text-blue-500 animate-pulse">Updating {key}...</p>
                ) : (
                  <div onClick={() => ShowFullImage(value)} className="cursor-pointer">
                       <img src={value} alt={key} className="w-full h-40 object-cover rounded border" />
                  </div>
                )}
              </div>
              <label
                htmlFor={key}
                className="flex items-center justify-center bg-blue-500 mt-4 h-10 text-[12px] w-38 text-white text-center p-2 rounded-md cursor-pointer"
              >
                Update {key}
              </label>
              <input
                id={key}
                type="file"
                name={key}
               accept={key === 'BVR' ? 'application/pdf' : 'image/*'}
                className="hidden"
                onChange={(e) => handleImageChange(e, key as DocumentKeys)}
              />
            </div>
          ))}
        
        </div>
        </div>

      );
    case 'Work Experience':
      return (
        <div className="grid md:grid-cols-2 gap-4">
          <TextInput label="Experience (Years)" name="experience" value={user.experience} onChange={handleChange} />
          <TextInput label="Recent Job" name="professionalWork1" value={user.professionalWork1} onChange={handleChange} />
          <TextInput label="Previous Job" name="professionalWork2" value={user.professionalWork2} onChange={handleChange} />
          <TextInput label="Education" name="professionalEducation" value={user.professionalEducation} onChange={handleChange} />
        </div>
      );
    case 'Identifiers':
      return (
        <div className="grid md:grid-cols-2 gap-4">
          <TextInput label="Aadhar No" name="aadharCardNo" value={user.aadharCardNo} onChange={handleChange} />
          <TextInput label="PAN No" name="panNumber" value={user.panNumber} onChange={handleChange} />

        </div>
      );
    default:
      return null;
  }
};

console.log("Data of Birth---",user.dateOfBirth)
  return (
    <div className="min-h-screen p-4 md:p-4 bg-gray-100">
         <div className='flex justify-end items-end  cursor-pointer   rounded-full  ' >
                   <p onClick={Revert} className='bg-blue-400 text-white p-1 text-[12px] rounded-md mb-1'> Back to Admin Page </p>
                </div>
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        
        <div className="flex items-center justify-between gap-6 p-6 border-b">
 
  <div className="flex items-center gap-6">
    <img
      src={user.Documents.ProfilePic}
      alt="Profile"
      width={80}
      height={80}
      className="rounded-full border object-cover"
    />
    <div>
      <h2 className="text-xl font-bold text-[#ff1493]">
       {user.firstName} {user.surname}
      </h2>
      <p className="text-gray-500 text-sm">{user.emailId}</p>
    {/* <button className="relative inline-flex items-center px-2 m-2 py-2 bg-[#ff1493] text-white text-[10px] font-semi-bold 
               border cursor-pointer rounded-lg shadow-sm 
               hover:bg-[#50c896] hover:text-white 
               transition-colors duration-300 ease-in-out 
               focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
  Assign Placement
</button> */}

    </div>
    <p className={ `${SubmitstatusMessage==="Profile Updated Succesfully"?"text-green-800":"text-black"} text-center font-semibold ml-15 mt-10`}>{SubmitstatusMessage}</p>
  </div>

 
  <button className="bg-teal-600 p-2 text-white rounded-md cursor-pointer" onClick={UpdatewithNewData}>
    Update Profile
  </button>
      
</div>


        <div className="px-6 pt-4">
          <div className="flex gap-3 flex-wrap border-b pb-2">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 rounded-t-lg text-sm font-medium transition-all duration-200 ${activeTab === tab
                  ? 'bg-white border border-b-0 text-blue-600 shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
              >
                {tab}
              </button>
            ))}
               {ShowPassword&& <div className="w-[150px] ml-auto border-gray-400 shadow-lg flex items-center gap-3 p-2 rounded-2xl 
                bg-white shadow-md border border-gray-100">
            <div className="w-9 h-9 flex items-center justify-center 
                  rounded-full bg-blue-100 text-blue-600">
              🔐
            </div>
            <p className="text-sm">
              <span className="block text-xs text-gray-500">Password</span>
              <span className="font-mono tracking-widest text-gray-900">
                {ShowPassword}
              </span>
            </p>
          </div>}
          </div>

          <div className="py-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};


const TextInput = ({
  label,
  name,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="bg-gray-50 border rounded p-3 space-y-2">
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="input-field border border-gray-300 p-3 h-8 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
    />
  </div>
);


const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 border rounded p-3 space-y-2">
    <p className="text-xs font-semibold text-gray-600">{label}</p>
    <p className="text-sm text-gray-800">{value}</p>
  </div>
);


const Doc = ({ label, src }: { label: string; src: string }) => (
  <div>
    <p className="text-sm text-gray-700 font-medium mb-1">{label}</p>
    <img src={src} alt={label} className="w-full h-40 object-cover rounded border" />
  </div>
);

export default UserDetail;
function UseEffect(arg0: () => void, p0: UserData[]) {
    throw new Error('Function not implemented.');
}




