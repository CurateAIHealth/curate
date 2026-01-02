'use client';

import HCAMobileView from '@/Components/HCAMobileView/page';
import { IndianLanguages, PROFESSIONAL_SKILL_OPTIONS, Relations } from '@/Lib/Content';
import { v4 as uuidv4 } from 'uuid';
import { GetUserInformation, HCARegistration, PostHCAFullRegistration, UpdateFinelVerification } from '@/Lib/user.action';
import { UpdateDocmentSkipReason, UpdateRefresh } from '@/Redux/action';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { stringify } from 'querystring';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingData } from '@/Components/Loading/page';
import { EyeOff, Eye, CheckCircle, XCircle } from 'lucide-react';


const DEFAULT_PROFILE_PIC = '/Icons/DefaultProfileIcon.png';
const DEFAULT_DOCUMENT_ICON = '/Icons/DefaultDocumentIcon.png';

export default function DoctorProfileForm() {
  const [ProfileName, SetProfileName] = useState('');
  const [PictureUploading, setPictureUploading] = useState(false);
  const [UpdateingStatus, SetUpdateingStatus] = useState(true);
  const [UpdatedStatusMessage, setUpdatedStatusMessage] = useState('');
    const [addedheight, setaddedheight] = useState<any>();
      const [addingWeight, setaddingWeight] = useState("");
  const [isChecking, setIsChecking] = useState(true);
    const [siblings, setSiblings] = useState([
    { relation: "Elder Brother", count: 0 },
    { relation: "Younger Brother", count: 0 },
    { relation: "Elder Sister", count: 0 },
    { relation: "Younger Sister", count: 0 },
    { relation: "Twin Sibling", count: 0 },
  ]);


    const userId = useSelector((state: any) => state?.UserDetails);
  const CurrentUserType=useSelector((state:any)=>state.RegisteredUserType)
  
interface FormState {
  HomeAssistance: any;
  // title: any;
  firstName: any;
  surname: string;
  fatherName: string;
  motherName: string;
  // husbandName?: string; // commented out fields optional
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  emailId: string;
  mobileNumber: string;
earningSource:string,
  aadharCardNo: string;
  OngoingStudy:string,
  panNumber: string;
  // voterIdNo?: string;
  // rationCardNo?: string;
  permanentAddress: string;
  currentAddress: string;
  cityPostcodePermanent: string;
  cityPostcodeCurrent: string;
SiblingsInfo:any,
  higherEducation: string;
  higherEducationYearStart: string;
  higherEducationYearEnd: string;
  professionalEducation: string;
  professionalEducationYearStart: string;
  professionalEducationYearEnd: string;
  registrationCouncil: string;
  registrationNo: string;
  professionalSkill: any;
  certifiedBy: string;
  professionalWork1: string;
  professionalWork2: string;
  experience: string;

  height: string;
  weight: string;
  hairColour: string;
  eyeColour: string;
  complexion: string;
  anyDeformity: string;
  moleBodyMark1: string;
  moleBodyMark2: string;
HandledSkills:any,
  reportPreviousHealthProblems: string;
  reportCurrentHealthProblems: string;

  sourceOfReferral: string;
  dateOfReferral: string;
  reference1Name: string;
  reference1Aadhar: string;
  reference1Mobile: string;
  reference1Address: string;
  reference1Relationship: string;
  reference2Name: string;
  reference2Aadhar: string;
  reference2Mobile: string;
  reference2Address: string;

  serviceHours12hrs: boolean;
  serviceHours24hrs: boolean;
  preferredService: string;
  paymentService: string;
  paymentBankName: string;
  paymentBankAccountNumber: string;
  ifscCode: string;
  bankBranchAddress: string;

  Bankbranchname: string;
  Branchcity: string;
  Branchstate: string;
  Branchpincode: string;

  languages: string;
  type: string;
  specialties: string;
  Password:any;
  ConfirmPassword:any;
  // website?: string; // optional if commented
}

  const router=useRouter()
  const ReasonValue=useSelector((state:any)=>state.DocumentReson)
  const [heightInCm, setHeightInCm] = useState("");

   const distpatch=useDispatch()
  const [Docs, setDocs] = useState({
    ProfilePic: DEFAULT_PROFILE_PIC,
    PanCard: '',
    AdharCard: '',
    AccountPassBook: '',
    CertificatOne: '',
    CertificatTwo: '',
    VideoFile: '',
    BVR:''
  });
const [form, setForm] = useState<FormState>({
  firstName: '',
  surname: '',
  fatherName: '',
  motherName: '',
  gender: '',
  dateOfBirth: '',
  maritalStatus: '',
  emailId: '',
  mobileNumber: '',
  HomeAssistance: '',
  earningSource: '',
  aadharCardNo: '',
  panNumber: '',
  permanentAddress: '',
  currentAddress: '',
  cityPostcodePermanent: '',
  cityPostcodeCurrent: '',

  higherEducation: '',
  higherEducationYearStart: '',
  higherEducationYearEnd: '',
  professionalEducation: '',
  professionalEducationYearStart: '',
  professionalEducationYearEnd: '',
  registrationCouncil: '',
  registrationNo: '',
  professionalSkill: '',
  HandledSkills: '',
  certifiedBy: '',
  professionalWork1: '',
  professionalWork2: '',
  experience: '',

  height: ' ',
  weight: ' ',
  hairColour: '',
  eyeColour: '',
  complexion: '',
  anyDeformity: '',
  moleBodyMark1: '',
  moleBodyMark2: '',
  SiblingsInfo: siblings,
  OngoingStudy: '',
  reportPreviousHealthProblems: '',
  reportCurrentHealthProblems: '',

  sourceOfReferral: '',
  dateOfReferral: '',
  reference1Name: '',
  reference1Aadhar: '',
  reference1Mobile: '',
  reference1Address: '',
  reference1Relationship: '',
  reference2Name: '',
  reference2Aadhar: '',
  reference2Mobile: '',
  reference2Address: '',

  serviceHours12hrs: true,
  serviceHours24hrs: false,
  preferredService: '',
  paymentService: '',
  paymentBankName: '',
  paymentBankAccountNumber: '',
  ifscCode: '',
  bankBranchAddress: '',

  Bankbranchname: '',
  Branchcity: '',
  Branchstate: '',
  Branchpincode: '',

  languages: '',
  type: '',
  specialties: '',
  Password:'',
  ConfirmPassword:''
});
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);


console.log("Check working Hours----",form)
  const { serviceHours12hrs, serviceHours24hrs, ...restForm } = form;

  const flatFields = Object.values(restForm).flat();
  let filled = flatFields.filter((f) => {
    if (typeof f === 'string') return f && f.trim() !== '';
    return typeof f === 'boolean' ? f : false;
  }).length;

  if (serviceHours12hrs || serviceHours24hrs) {
    filled += 1;
  }

  const totalFields = flatFields.length + 1;

  const completion = Math.round((filled / totalFields) * 100);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      if (type === 'checkbox') {
        if (name === 'serviceHours12hrs' && (e.target as HTMLInputElement).checked) {
          setForm((prev) => ({ ...prev, serviceHours12hrs: true, serviceHours24hrs: false }));
        } else if (name === 'serviceHours24hrs' && (e.target as HTMLInputElement).checked) {
          setForm((prev) => ({ ...prev, serviceHours24hrs: true, serviceHours12hrs: false }));
        } else {
          setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        }
      } else {
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === 'dateOfBirth') {
          setForm((prev) => ({ ...prev, [name]: value }));
          const dob = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
          if (age < 18) {
            alert('⚠️ Warning: Age must be at least 18 years.');
          }
        }
      }
    },
    []
  );
  const handleUpdteSiblings = (index:any, value:any) => {
    const updated = [...siblings];
    updated[index].count = Number(value);
    setSiblings(updated);
  };
  useEffect(() => {
    const Fetch = async () => {
      try {
       
        const localValue = userId?userId:localStorage.getItem('UserId');
          
        if (!localValue) {
          console.warn('No UserId found in localStorage.');
          return;
        }

        const ProfileInformation = await GetUserInformation(localValue);
   console.log("Get Values----",localValue)
      if ((!ProfileInformation&&CurrentUserType)||(ProfileInformation&&CurrentUserType)) {
        console.warn("No user profile found for ID:", localValue);
        setIsChecking(false);
        return;
      }


        if (!ProfileInformation) {
        console.warn("No user profile found for ID:", localValue);
        setIsChecking(false);
        return;
      }
        SetProfileName(ProfileInformation.FirstName||'');
        setIsChecking(false)

        setDocs((prev) => ({
          ...prev,
          ProfilePic: ProfileInformation.ProfilePic || DEFAULT_PROFILE_PIC,
          PanCard: ProfileInformation.PanCard || '',
          AdharCard: ProfileInformation.AadharCard || '',
          AccountPassBook: ProfileInformation.AccountPassBook || '',
          CertificatOne: ProfileInformation.CertificatOne || '',
          CertificatTwo: ProfileInformation.CertificatTwo || '',
        }));

        setForm((prev) => ({
          ...prev,
          // title: ProfileInformation.Title || '',
          firstName: ProfileInformation.FirstName|| '',
          surname: ProfileInformation.LastName|| '',
          fatherName: ProfileInformation.FatherName || '',
          motherName: ProfileInformation.MotherName || '',
          // husbandName: ProfileInformation.HusbandName || '',
          gender: ProfileInformation.Gender,
          dateOfBirth: ProfileInformation.DateOfBirth,
          maritalStatus: ProfileInformation.MaritalStatus || '',
          emailId: ProfileInformation.Email,
          mobileNumber: ProfileInformation.ContactNumber,
          aadharCardNo: ProfileInformation.AadharNumber,
          panNumber: ProfileInformation.PanNumber || '',
          // voterIdNo: ProfileInformation.VoterIdNo || '',
          // rationCardNo: ProfileInformation.RationCardNo || '',
          permanentAddress: ProfileInformation.PermanentAddress || '',
          currentAddress: ProfileInformation.CurrentAddress || '',
          cityPostcodePermanent: ProfileInformation.CityPostcodePermanent || '',
          cityPostcodeCurrent: ProfileInformation.CityPostcodeCurrent || '',
          higherEducation: ProfileInformation.HigherEducation || '',
          higherEducationYearStart: ProfileInformation.HigherEducationYearStart || '',
          higherEducationYearEnd: ProfileInformation.HigherEducationYearEnd || '',
          professionalEducation: ProfileInformation.ProfessionalEducation || '',
          professionalEducationYearStart: ProfileInformation.ProfessionalEducationYearStart || '',
          professionalEducationYearEnd: ProfileInformation.ProfessionalEducationYearEnd || '',
          registrationCouncil: ProfileInformation.RegistrationCouncil || '',
          registrationNo: ProfileInformation.RegistrationNo || '',
          professionalSkill: ProfileInformation.ProfessionalSkill || [],
          certifiedBy: ProfileInformation.CertifiedBy || '',
          professionalWork1: ProfileInformation.ProfessionalWork1 || '',
          professionalWork2: ProfileInformation.ProfessionalWork2 || '',
          experience: ProfileInformation.Experience || '',
          height: ProfileInformation.Height || '',
          weight: ProfileInformation.Weight || '',
          hairColour: ProfileInformation.HairColour || '',
          eyeColour: ProfileInformation.EyeColour || '',
          complexion: ProfileInformation.Complexion || '',
          anyDeformity: ProfileInformation.AnyDeformity || '',
          moleBodyMark1: ProfileInformation.MoleBodyMark1 || '',
          moleBodyMark2: ProfileInformation.MoleBodyMark2 || '',
          reportPreviousHealthProblems: ProfileInformation.ReportPreviousHealthProblems || '',
          reportCurrentHealthProblems: ProfileInformation.ReportCurrentHealthProblems || '',
          sourceOfReferral: ProfileInformation.SourceOfReferral || '',
          dateOfReferral: ProfileInformation.DateOfReferral || '',
          reference1Name: ProfileInformation.Reference1Name || '',
          reference1Aadhar: ProfileInformation.Reference1Aadhar || '',
          reference1Mobile: ProfileInformation.Reference1Mobile || '',
          reference1Address: ProfileInformation.Reference1Address || '',
          reference1Relationship: ProfileInformation.Reference1Relationship || '',
          reference2Name: ProfileInformation.Reference2Name || '',
          reference2Aadhar: ProfileInformation.Reference2Aadhar || '',
          reference2Mobile: ProfileInformation.Reference2Mobile || '',
          reference2Address: ProfileInformation.Reference2Address || '',
          serviceHours12hrs: ProfileInformation.ServiceHours12hrs || false,
          serviceHours24hrs: ProfileInformation.ServiceHours24hrs || false,
          preferredService: ProfileInformation.PreferredService || '',
          paymentService: ProfileInformation.PaymentService || '',
          paymentBankName: ProfileInformation.PaymentBankName || '',
          paymentBankAccountNumber: ProfileInformation.PaymentBankAccountNumber || '',
          ifscCode: ProfileInformation.IfscCode || '',
          bankBranchAddress: ProfileInformation.BankBranchAddress || '',
          Bankbranchname: ProfileInformation.Bankbranchname || '',
          Branchcity: ProfileInformation.Branchcity || '',
          Branchstate: ProfileInformation.Branchstate || '',
          Branchpincode: ProfileInformation.Branchpincode || '',
          languages: ProfileInformation.Languages || '',
          type: ProfileInformation.Type || '',
          specialties: ProfileInformation.Specialties || '',
          // website: ProfileInformation.Website || '',
        }));
      } catch (err: any) {
        setIsChecking(false)
        console.error('Error fetching user information:', err);
      }
    };
    Fetch();
  }, []);

useEffect(() => {
  if (mounted && CurrentUserType === null) {
    router.replace("/UserTypeRegistration");
  }
}, [mounted, CurrentUserType, router]);

   const handleHeightChange = (field: string, value: string) => {
   
    setForm((prev: any) => {
      const updated = { ...prev, [field]: value };
      
      return updated;
    });
  }
  const handleSkillChange = (skill:any) => {
    setForm((prev:any) => {
      const skills:any = prev.HomeAssistance || [];
      return skills.includes(skill)
        ? { ...prev, HomeAssistance: skills.filter((s:any) => s !== skill) }
        : { ...prev, HomeAssistance: [...skills, skill] };
    });
  };

 
 const UpdateHandledSkills= (skill:any) => {
    setForm((prev:any) => {
      const skills:any = prev.HandledSkills || [];
      return skills.includes(skill)
        ? { ...prev, HandledSkills: skills.filter((s:any) => s !== skill) }
        : { ...prev, HandledSkills: [...skills, skill] };
    });
  };
  const handleprofessionalSkillChange = (skill:any) => {
    setForm((prev:any) => {
      const skills:any = prev.professionalSkill || [];
      return skills.includes(skill)
        ? { ...prev, professionalSkill: skills.filter((s:any) => s !== skill) }
        : { ...prev, professionalSkill: [...skills, skill] };
    });
  };
 
  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setUpdatedStatusMessage('');
      const file = e.target.files?.[0];
      const inputName = e.target.name;
      if (!file) return;


      if (file.size > 10 * 1024 * 1024) {
        alert('File too large. Max allowed is 10MB.');
        return;
      }


      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg','application/pdf',];
      if (!allowedTypes.includes(file.type)) {
        alert('Only image or video files are allowed.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {

        setUpdatedStatusMessage(`Please Wait ${inputName} uploading....`)
        setPictureUploading(true);

        const res = await axios.post('/api/Upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setDocs((prev) => ({ ...prev, [inputName]: res.data.url }));
        setUpdatedStatusMessage(`${inputName} uploaded successfully!`);
      } catch (error: any) {
        console.error('Upload failed:', error.message);
        setUpdatedStatusMessage('Document upload failed!');
      } finally {
        setPictureUploading(false);
      }
    },
    []
  );
 const AgeValue = () => {
  if (!form.dateOfBirth) return ""; 

  const dob = new Date(form.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};


   const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(CurrentUserType===null){
        alert("UserType Not Selected")
      }
      setTimeout(async() => {
        const dob = new Date(form.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        if (age < 18) {
          alert('❌ Cannot submit. Age must be at least 18 years.');
          SetUpdateingStatus(true);
          return;
        }
        // if (completion !== 100) {
        //   alert('Please complete all required fields to update your profile!');
        //   SetUpdateingStatus(true);
        //   return;
        // }
        const requiredFields: (keyof typeof Docs)[] = [
          'ProfilePic',
          'PanCard',
          'AdharCard',
          'AccountPassBook',
          'CertificatOne',
          'CertificatTwo',
        ];
        const isAnyFieldEmpty = requiredFields.some((key) => Docs[key]?.trim?.() === '');
        const isReasonEmpty = ReasonValue.trim() === '';
        const isMissingRequired = isAnyFieldEmpty && isReasonEmpty;
        if (isMissingRequired) {
          alert("Upload all the required documents. Or else provide a reason for not uploading them.");
          SetUpdateingStatus(true);
          return;
        }
        setUpdatedStatusMessage("Please Wait Updating.....")
        const generatedUserId = uuidv4();
        const localValue = userId?userId:localStorage.getItem('UserId');
    
   const UpdateUserType=CurrentUserType==="HCA"?"healthcare-assistant":CurrentUserType

 
  const payload: any = {
    userType: UpdateUserType,
    FirstName: form.firstName || "",
    LastName: form.surname || "",
    Gender: form.gender || "",
    DateOfBirth: form.dateOfBirth || "",
    MaritalStatus: form.maritalStatus || "",
    Nationality: "Indian",
    AadharNumber: form.aadharCardNo ? form.aadharCardNo.replace(/\s/g, "") : "",
    Age: AgeValue() || "",
    ContactNumber: form.mobileNumber || "",
    Email: form.emailId || "",
    Location: form.currentAddress || "",
    userId: generatedUserId,
    VerificationStatus: "Pending",
    TermsAndConditions: true,
    FinelVerification: true,
    EmailVerification: true,
    Password:form.Password||''
  };
const result: any = await HCARegistration(payload);

        if (result.success===true) {
          const FinelForm = { ...form, Documents: Docs, UserId: generatedUserId, DocumentSkipReason: ReasonValue, userType: CurrentUserType === "HCA" ? "healthcare-assistant" : CurrentUserType };

          const PostResult = await PostHCAFullRegistration(FinelForm)
          const Result = await UpdateFinelVerification(localValue)
          await axios.post("/api/MailSend", {
            to: form.emailId || "tsiddu805@gmail.com",
            subject:
              "Welcome to Curate Health Care – Your Login Credentials",
            html: `<div style="
  width:100%;
  max-width:680px;
  margin:auto;
  background:#ffffff;
  border-radius:16px;
  border:1px solid #e6e6e6;
  font-family:'Segoe UI', Arial, sans-serif;
  overflow:hidden;
">

  <!-- TOP ACCENT -->
  <div style="height:8px; background:#50c896;"></div>

  <!-- HEADER -->
  <div style="padding:26px 24px; text-align:center;">
    <img
      src="https://curate-pearl.vercel.app/Icons/UpdateCurateLogo.png"
      alt="Curate Health Care"
      style="height:80px; width:auto;"
    />
    <h2 style="margin:14px 0 4px; font-size:20px; color:#222;">
      Welcome to Curate Health Care
    </h2>
    <p style="margin:0; font-size:14px; color:#1392d3;">
      Healthcare Assistant Account Created
    </p>
  </div>

  <div style="border-top:1px solid #eeeeee;"></div>

  <!-- CONTENT -->
  <div style="padding:28px 26px;">

    <p style="font-size:15px; color:#333; line-height:26px; margin-top:0;">
      Hello <strong>Healthcare Assistant</strong>,
    </p>

    <p style="font-size:15px; color:#555; line-height:26px;">
      Thank you for registering with <strong>Curate Health Care</strong>.
      Your account has been successfully set up.  
      You can now log in using the credentials provided below.
    </p>

    <!-- CREDENTIAL BOX -->
    <div style="
      margin:24px 0;
      border-left:5px solid #50c896;
      background:#f9fafb;
      padding:18px 20px;
      border-radius:10px;
    ">
      <p style="margin:0 0 10px; font-size:14px; color:#666;">
        <strong>Login Credentials</strong>
      </p>

      <table style="width:100%; font-size:15px; color:#333;">
        <tr>
          <td style="padding:6px 0; width:120px;"><strong>Username</strong></td>
          <td style="padding:6px 0;">${form.emailId}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Password</strong></td>
          <td style="padding:6px 0;">${form.Password}</td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align:center; margin:30px 0;">
      <a
        href="https://curate-pearl.vercel.app/sign-in"
        style="
          background:#1392d3;
          color:#ffffff;
          padding:14px 34px;
          font-size:16px;
          font-weight:600;
          text-decoration:none;
          border-radius:8px;
          display:inline-block;
        "
      >
        Access Your Account
      </a>
    </div>

    <!-- NOTE -->
    <div style="
      background:#fff7e6;
      border:1px solid #ffe1a6;
      border-radius:8px;
      padding:14px;
      font-size:14px;
      color:#6b4e00;
      line-height:22px;
    ">
      🔒 For security purposes, please change your password after your first login.
    </div>

    <!-- FOOTER -->
    <p style="font-size:14px; color:#555; line-height:24px; margin-top:26px;">
      If you require any assistance, our support team is always here to help.
      <br><br>
      Regards,<br>
      <strong>Curate Health Care Team</strong>
    </p>

  </div>
</div>
`,


          });

          distpatch(UpdateRefresh(1))
          setUpdatedStatusMessage('Successfully Updated Your Information.');
          SetUpdateingStatus(true);

          const Timer = setInterval(() => {
            router.push("/AdminPage")
          }, 1000)
          return () => clearInterval(Timer)

        }else{
           setUpdatedStatusMessage('Try Again');
        }



          
       
      }, 0);
    
    },
    [form, completion, Docs, ReasonValue, router]
  );


    const handleLogout = async () => {
    localStorage.removeItem("UserId");
    await router.prefetch("/");
    router.push("/");
  };
const handleHeightFromCm = (cmValue: string) => {
  setHeightInCm(cmValue);

  const cm = parseFloat(cmValue);
  if (!cm || cm <= 0) return;

  const ft = (cm / 30.48).toFixed(1);
  handleHeightChange("height", ft);
  setaddedheight(0); // reset added height
};

const passwordRules = {
  length: (v: string) => v.length >= 8,
  capital: (v: string) => /[A-Z]/.test(v),
  number: (v: string) => /[0-9]/.test(v),
  special: (v: string) => /[^A-Za-z0-9]/.test(v),
};

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const password = form.Password || "";

  const RuleItem = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-xs ${ok ? "text-green-600" : "text-gray-500"}`}>
      {ok ? <CheckCircle size={14} /> : <XCircle size={14} />}
      {label}
    </div>
  );
  if (!mounted || isChecking || CurrentUserType === null) {
  return <LoadingData />;
}

  return (
 
      <div className=" md:flex md:min-h-[100vh] md:h-[86.5vh] bg-white flex-col items-center justify-center overflow-hidden">
  <header className="w-full    px-2">
  <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
    
   
    <div className="flex md:h-[170px] flex-col md:flex-row items-center md:items-stretch">


      <div className="bg-teal-50 w-full md:w-1/3 flex flex-col justify-center items-center py-10 relative">
        <div className="relative group">
          <img
            src={Docs.ProfilePic || DEFAULT_PROFILE_PIC}
            alt="Profile Picture"
            className="w-28 h-28 sm:w-20 sm:h-20 rounded-full border-4 border-teal-500 shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <label
            htmlFor="profilePicUpload"
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mb-1 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v4h16v-4M12 12V4m0 0l-4 4m4-4l4 4"
              />
            </svg>
            <span className="text-xs text-white font-semibold">Change</span>
            <input
              id="profilePicUpload"
              name="ProfilePic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              required
            />
          </label>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold text-gray-800">Profile Overview</h2>
          <p className="text-[9px] text-gray-600 mt-1 max-w-[180px]">
            Upload your photo for identity verification
          </p>
        </div>

        
      </div>

      <div className="flex-1 p-4  text-center md:text-left flex flex-col justify-center">
        <h1 className="text-xl sm:text-4xl font-bold text-gray-800 mb-3 leading-snug">
          Healthcare Professional Registration
        </h1>
        <p className="text-gray-600 text-base text-[14px] leading-relaxed max-w-2xl">
          Kindly fill out the complete information below to register your profile. 
          Ensure that all details are accurate to facilitate faster verification and onboarding.
        </p>

         {/* <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-lg sm:rounded-xl font-semibold shadow-lg transition-all duration-150 text-sm sm:text-base"
            >
              <LogOut size={18} className="flex-shrink-0" />
              <span className="hidden xs:inline">Logout</span>
            </button> */}

        {UpdatedStatusMessage && (
          <div
            className={`mt-8 w-full max-w-md p-4 rounded-xl font-medium text-sm shadow-inner transition-all duration-300 ${
              UpdatedStatusMessage === "Successfully Updated Your Information."
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {UpdatedStatusMessage}
          </div>
        )}
      </div>
    </div>
  </div>
</header>



        <form
          onSubmit={handleSubmit}
          className="md:w-full p-8 space-y-8 overflow-y-auto custom-scrollbar h-full"
        >

          <div className='md:flex  justify-center gap-2'>
            <section className="md:w-1/2  pl-4 mt-2 p-2 rounded-xl shadow-xl border border-gray-400">

              <h3 className="text-md font-semibold text-[#ff1493] mb-3 pb-3 border-b border-blue-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#6366f1]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2v-5m-7-5a2 2 0 11-4 0 2 2 0 014 0zm7-2a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title (e.g., Dr., Mr.)"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                /> */}
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName||''}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="surname"
                  value={form.surname||''}
                  onChange={handleChange}
                  placeholder="Surname"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="fatherName"
                  value={form.fatherName||''}
                  onChange={handleChange}
                  placeholder="Father's Name"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="motherName"
                  value={form.motherName||''}
                  onChange={handleChange}
                  placeholder="Mother's Name"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                {/* <input
                  type="text"
                  name="husbandName"
                  value={form.husbandName}
                  onChange={handleChange}
                  placeholder="Husband's Name"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                /> */}
                <select
                  name="gender"
                  value={form.gender||''}
                  onChange={handleChange}
                  className="input-field border h-8 border-gray-300 pl-2 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all appearance-none bg-white pr-8"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth||''}
                    onChange={handleChange}
                    className="input-field border p-3 h-8 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    required
                  />
                  {form.dateOfBirth && (
                    <p className="absolute  left-0 text-xs text-gray-500">
                      Age:{' '}
                      {(() => {
                        const dob = new Date(form.dateOfBirth);
                        const today = new Date();
                        let a = today.getFullYear() - dob.getFullYear();
                        const m = today.getMonth() - dob.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) a--;
                        return a;
                      })()}{' '}
                      years
                    </p>
                  )}
                </div>
                <select
                  name="maritalStatus"
                  value={form.maritalStatus||''}
                  onChange={handleChange}
                  className="input-field border border-gray-300 h-8 pl-2 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all appearance-none bg-white pr-8"
                  required
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                <input
                  type="email"
                  name="emailId"
                  value={form.emailId||''}
                  onChange={handleChange}
                  placeholder="Email ID"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="tel"
                  name="mobileNumber"
                  value={form.mobileNumber||''}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              </div>
       {((CurrentUserType === "HCA") || (CurrentUserType === "HCN")) && (
  <div>
    {/* Family Background */}
    <h3 className="text-md font-semibold text-[#ff1493] mt-3 pb-3 border-b border-blue-200 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2 text-[#6366f1]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-3.31 0-6 2.02-6 4.5V21h12v-2.5c0-2.48-2.69-4.5-6-4.5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21v-2a3 3 0 00-3-3h-.5M5 21v-2a3 3 0 013-3h.5"
        />
      </svg>
      Family Background
    </h3>

    {/* Earning Source Section */}
    <div className="rounded-2xl border border-gray-100">
      <h3 className="flex justify-start text-grey-400 mb-2 text-center">
        Earning Source
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Relations.map((each) => (
          <div
            key={each}
            className="flex items-center space-x-2 bg-white border hover:bg-indigo-100 p-2 rounded-lg transition-all duration-200"
          >
            <input
              type="radio"
              name="earningSource"
              id={each}
              value={each}
              className="w-5 h-5 accent-indigo-600 cursor-pointer"
              onChange={handleChange}
            />
            <label
              htmlFor={each}
              className="text-gray-700 font-medium text-[13px] cursor-pointer"
            >
              {each}
            </label>
          </div>
        ))}
      </div>
    </div>

    {/* Siblings Section */}
    <div className="mt-2 rounded-2xl border border-gray-100">
      <h3 className="flex justify-start text-grey-400 mb-2 text-center">
        Siblings
      </h3>

      <div className="space-y-3">
        {siblings.map((each, index) => (
          <div
            key={index}
            className="flex justify-between items-center border bg-gray-50 hover:bg-indigo-50 transition rounded-xl p-2"
          >
            <p className="text-gray-700 font-medium">{each.relation}</p>
            <input
              type="number"
              placeholder="Count"
              value={each.count}
              onChange={(e) => handleUpdteSiblings(index, e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
)}


            </section>

   <section className="md:w-1/2  pl-4 mt-2 p-2 rounded-xl shadow-xl border border-gray-400">
              <h3 className="text-md font-semibold text-[#ff1493] mb-3 pb-3 border-b border-blue-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#6366f1]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Identity & Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <input
                  type="text"
                  name="aadharCardNo"
                  value={form.aadharCardNo||''}
                  onChange={handleChange}
                  placeholder="Aadhar Card No."
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="panNumber"
                  value={form.panNumber.toUpperCase()||''}
                  onChange={handleChange}
                  placeholder="PAN Number"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                {/* <input
                  type="text"
                  name="voterIdNo"
                  value={form.voterIdNo}
                  onChange={handleChange}
                  placeholder="Voter ID No."
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                /> */}
                {/* <input
                  type="text"
                  name="rationCardNo"
                  value={form.rationCardNo}
                  onChange={handleChange}
                  placeholder="Ration Card No."
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                /> */}
              </div>
              <textarea
                name="permanentAddress"
                value={form.permanentAddress||''}
                onChange={handleChange}
                placeholder="Permanent Address (Per GOVT ID)"
                className="input-field resize-y h-18 border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all mb-5"
                required
              />
              <input
                type="text"
                name="cityPostcodePermanent"
                value={form.cityPostcodePermanent||''}
                onChange={handleChange}
                placeholder="City & Postcode (Permanent)"
                className="input-field border border-gray-300 p-3 h-8 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all mb-5"
                required
              />
              <textarea
                name="currentAddress"
                value={form.currentAddress||''}
                onChange={handleChange}
                placeholder="Current Address"
                className="input-field resize-y h-18 border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all mb-5"
                required
              />
              <input
                type="text"
                name="cityPostcodeCurrent"
                value={form.cityPostcodeCurrent||''}
                onChange={handleChange}
                placeholder="City & Postcode (Current)"
                className="input-field border border-gray-300 p-3 h-8 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                required
              />
            </section>

          </div>
          <div className='md:flex  justify-center gap-2'>
         <section className="md:w-1/2  pl-4 mt-2 p-2 rounded-xl shadow-xl border border-gray-400">
              <h3 className="text-md font-semibold text-[#ff1493] mb-3 pb-3 border-b border-blue-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#6366f1]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Education & Professional Experience
              </h3>
           
              {CurrentUserType==="HCA"?<div className="space-y-5">
              
             
                <input
                  type="text"
                  name="higherEducation"
                value={form.higherEducation||''}
                  onChange={handleChange}
                  placeholder="Higher Education ex:Tenth,inter"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="professionalEducation"
                   value={form.professionalEducation||''}
                  onChange={handleChange}
                  placeholder="Profetional Qualification ex:GDA, ANM Etc....."
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              
                <input
                  type="text"
                  name="OngoingStudy"
                  value={form.OngoingStudy||''}
                  onChange={handleChange}
                  placeholder="Ongoing Study Ex:ANM, GNM, BSC(Nurseig)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
            
               
              
              </div>:
              <div className="space-y-5">
                <div>
                  <input
                    type="text"
                    name="higherEducation"
                    value={form.higherEducation||''}
                    onChange={handleChange}
                    placeholder="Higher Education (e.g., MBBS, MD)"
                    className="input-field w-full mb-3 h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="number"
                      name="higherEducationYearStart"
                      value={form.higherEducationYearStart||''}
                      onChange={handleChange}
                      placeholder="Higher Ed. Year Start"
                      className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                      required
                    />
                    <input
                      type="number"
                      name="higherEducationYearEnd"
                      value={form.higherEducationYearEnd||''}
                      onChange={handleChange}
                      placeholder="Higher Ed. Year End"
                      className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name="professionalEducation"
                    value={form.professionalEducation||''}
                    onChange={handleChange}
                    placeholder="Professional Education (e.g., Fellowship)"
                    className="input-field w-full mb-3 border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="number"
                      name="professionalEducationYearStart"
                      value={form.professionalEducationYearStart||''}
                      onChange={handleChange}
                      placeholder="Professional Ed. Year Start"
                      className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                      required
                    />
                    <input
                      type="number"
                      name="professionalEducationYearEnd"
                      value={form.professionalEducationYearEnd||''}
                      onChange={handleChange}
                      placeholder="Professional Ed. Year End"
                      className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                <input
                  type="text"
                  name="registrationCouncil"
                  value={form.registrationCouncil||''}
                  onChange={handleChange}
                  placeholder="Registration Council"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="registrationNo"
                  value={form.registrationNo||''}
                  onChange={handleChange}
                  placeholder="Registration No."
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              
                <input
                  type="text"
                  name="certifiedBy"
                  value={form.certifiedBy||''}
                  onChange={handleChange}
                  placeholder="Certified By (e.g., Medical Council of India)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="professionalWork1"
                  value={form.professionalWork1||''}
                  onChange={handleChange}
                  placeholder="Professional Work 1 (e.g., Sr. Consultant, AIIMS)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="professionalWork2"
                  value={form.professionalWork2||''}
                  onChange={handleChange}
                  placeholder="Professional Work 2 (Optional)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                />
                <input
                  type="number"
                  name="experience"
                  value={form.experience||''}
                  onChange={handleChange}
                  placeholder="Experience in Years"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              </div>}
            </section>

  <section className="w-full md:w-1/2 pl-2 md:pl-4 mt-2 p-2 rounded-xl shadow-xl border border-gray-400">

  <h3 className="text-md font-semibold text-[#ff1493] mb-3 pb-3 border-b border-blue-200 flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mr-2 text-[#6366f1]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19V6l3-3m0 0l3 3m-3-3v14m-1.5 0H9.75"
      />
    </svg>
    Physical Attributes
  </h3>


  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    

    <div id="Patient Details" className="bg-white rounded-lg shadow p-4 space-y-3 md:col-span-3">
      <h2 className="text-lg font-semibold text-teal-600">Height</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {["4.0", "5.0", "6.0"].map((h) => (
          <label key={h} className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded">
            <input
              type="radio"
              name="patientHeight"
              value={h}
              checked={
                Number(form.height) === Number(h) ||
                Number(form.height) === Number(h) + Number(addedheight)
              }
              onChange={() => handleHeightChange("height", h)}
              className="mr-2 accent-purple-600"
            />
            {h} ft
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-center">
        {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((each:any) => (
          <button
            type="button"
            key={each}
            onClick={() => {
              setaddedheight(each);
              const current = parseFloat(form.height || "0") || 0;
              handleHeightChange("height", (current + each).toFixed(1));
            }}
            className="mt-3 px-2 py-1 bg-gray-500 text-white rounded-md text-[10px] sm:text-xs"
          >
            +{each} ft
          </button>
        ))}
        {form.height && (
          <p className="mt-3 bg-pink-400 p-2 text-white rounded-md text-xs sm:text-sm text-center">
            {form.height}ft {CurrentUserType} Height
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
  <label className="text-sm font-medium text-gray-600">
    Enter Height (cm)
  </label>

  <input
    type="number"
    placeholder="Eg: 170"
    value={heightInCm}
    onChange={(e) => handleHeightFromCm(e.target.value)}
    className="w-32 px-3 py-2 border border-gray-300 rounded-md
               focus:ring-2 focus:ring-teal-400 focus:outline-none text-sm"
  />

  {heightInCm && form.height && (
    <span className="text-xs text-gray-500">
      ≈ {form.height} ft
    </span>
  )}
</div>
    </div>

 


    <div id="Patient Details" className="bg-white rounded-lg shadow p-4 space-y-3 md:col-span-3">
      <h2 className="text-lg font-semibold text-teal-600">Weight</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {["<40", "40", "50", "60", "70", "80", "90", "100", "110", "120", "120+"].map((w) => (
          <label key={w} className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded">
            <input
              type="radio"
              name="patientWeight"
              value={w}
              checked={
                Number(form.weight) === Number(w) ||
                Number(form.weight) === Number(w) + Number(addingWeight) ||
                form.weight === w
              }
              onChange={() => handleHeightChange("weight", w)}
              className="mr-2 accent-purple-600"
            />
            {w} kg
          </label>
        ))}
      </div>

      {form.weight !== "<40" && form.weight !== "120+" && (
        <div className="flex flex-wrap gap-2 items-center justify-center">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((each:any) => (
            <button
              type="button"
              key={each}
              onClick={() => {
                setaddingWeight(each);
                const current = parseInt(form.weight || "0", 10) || 0;
                handleHeightChange("weight", String(current + each));
              }}
              className="mt-3 px-2 py-1 bg-gray-400 text-white rounded-md text-[10px] sm:text-xs"
            >
              + {each} kg
            </button>
          ))}
        </div>
      )}

      {form.weight && (
        <div className="flex justify-center">
          <p className="mt-3 w-[200px] text-center bg-pink-400 p-2 text-white rounded-md text-xs sm:text-sm">
            {form.weight}kg {CurrentUserType} Weight
          </p>
        </div>
      )}
    </div>

  
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:col-span-3">
      <input
        type="text"
        name="hairColour"
        value={form.hairColour || ""}
        onChange={handleChange}
        placeholder="Hair Colour"
        className="border border-gray-300 p-3 h-10 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
        required
      />
      <input
        type="text"
        name="eyeColour"
        value={form.eyeColour || ""}
        onChange={handleChange}
        placeholder="Eye Colour"
        className="border border-gray-300 p-3 h-10 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
        required
      />
      <input
        type="text"
        name="complexion"
        value={form.complexion || ""}
        onChange={handleChange}
        placeholder="Complexion"
        className="border border-gray-300 p-3 h-10 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
        required
      />
      <input
        type="text"
        name="anyDeformity"
        value={form.anyDeformity || ""}
        onChange={handleChange}
        placeholder="Any Deformity (if any)"
        className="border border-gray-300 p-3 h-10 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
      />
      <input
        type="text"
        name="moleBodyMark1"
        value={form.moleBodyMark1 || ""}
        onChange={handleChange}
        placeholder="Mole/Body Mark 1"
        className="border border-gray-300 p-3 h-10 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
      />
      <input
        type="text"
        name="moleBodyMark2"
        value={form.moleBodyMark2 || ""}
        onChange={handleChange}
        placeholder="Mole/Body Mark 2 (Optional)"
        className="border border-gray-300 p-3 h-10 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
      />
    </div>
  </div>


  <h3 className="text-md font-semibold text-[#ff1493] mb-5 mt-4 pb-3 border-b border-blue-200 flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mr-2 text-[#6366f1]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
    Health Information
  </h3>

  <div className="space-y-5">
    <textarea
      name="reportPreviousHealthProblems"
      value={form.reportPreviousHealthProblems || ""}
      onChange={handleChange}
      placeholder="Report Previous Health Problems"
      className="resize-y h-20 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
      required
    />
    <textarea
      name="reportCurrentHealthProblems"
      value={form.reportCurrentHealthProblems || ""}
      onChange={handleChange}
      placeholder="Report Current Health Problems"
      className="resize-y h-20 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
      required
    />
  </div>


  <section className="flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 gap-6 md:gap-2">
 
    <div className="flex flex-col items-center justify-center text-center">
      <h3 className="text-md font-semibold mb-3">Professional Skills</h3>
      <div className="space-y-2">
        {PROFESSIONAL_SKILL_OPTIONS.map((skill) => (
          <label key={skill} className="flex items-center text-sm">
            <input
              type="checkbox"
              className="mr-2 accent-purple-600"
              checked={form.professionalSkill.includes(skill) || false}
              onChange={() => handleprofessionalSkillChange(skill)}
            />
            {skill}
          </label>
        ))}
      </div>
    </div>

 
    <div className="flex flex-col items-center justify-center text-center">
      <h3 className="text-md font-semibold mb-3">Home Assistance</h3>
      <div className="space-y-2">
        {["Diaper", "Bathing", "Bedding", "Brushing"].map((skill) => (
          <label key={skill} className="flex items-center text-sm">
            <input
              type="checkbox"
              className="mr-2 accent-purple-600"
              checked={form.HomeAssistance.includes(skill) || false}
              onChange={() => handleSkillChange(skill)}
            />
            {skill}
          </label>
        ))}
      </div>
    </div>

   
    <div className="flex flex-col items-center justify-center text-center">
      <h3 className="text-md font-semibold mb-3">Patient Types You Handled</h3>
      <div className="space-y-2">
        {["Bed Ridden", "Semi Bed Ridden", "Wheel Chair", "Full Mobile", "Post Operative"].map(
          (skill) => (
            <label key={skill} className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2 accent-purple-600"
                checked={form.HandledSkills.includes(skill) || false}
                onChange={() => UpdateHandledSkills(skill)}
              />
              {skill}
            </label>
          )
        )}
      </div>
    </div>
  </section>
</section>

        

          </div>
          {/* <section className="bg-blue-50 p-3 rounded-xl shadow-md">
            <h3 className="text-md font-semibold text-[#ff1493] mb-5 pb-3 border-b border-blue-200 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-[#6366f1]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Health Information
            </h3>
            <div className="space-y-5">
              <textarea
                name="reportPreviousHealthProblems"
                value={form.reportPreviousHealthProblems}
                onChange={handleChange}
                placeholder="Report Previous Health Problems"
                className="input-field resize-y h-18 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                required
              />
              <textarea
                name="reportCurrentHealthProblems"
                value={form.reportCurrentHealthProblems}
                onChange={handleChange}
                placeholder="Report Current Health Problems"
                className="input-field resize-y h-18 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                required
              />
            </div>
          </section> */}
          <div className='md:flex  justify-center gap-4'>

            <section className="md:w-1/2  pl-4 mt-2 p-2 rounded-xl shadow-xl border border-gray-400">
              <h3 className="text-md font-semibold text-[#ff1493] mb-3 pb-3 border-b border-blue-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#6366f1]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2h2m0 0h8m-4 0v-2m-3-5V9m3 3v-3m0 3h3"
                  />
                </svg>
                Referral Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="sourceOfReferral"
                  value={form.sourceOfReferral||''}
                  onChange={handleChange}
                  placeholder="Source of Referral"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="date"
                  name="dateOfReferral"
                  value={form.dateOfReferral||''}
                  onChange={handleChange}
                  placeholder="Date of Referral"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="space-y-5 mt-5">
                <h4 className="text-md font-semibold text-gray-700">Reference 1:</h4>
                <input
                  type="text"
                  name="reference1Name"
                  value={form.reference1Name||''}
                  onChange={handleChange}
                  placeholder="Reference 1 Name"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="reference1Aadhar"
                  value={form.reference1Aadhar||''}
                  onChange={handleChange}
                  placeholder="Reference 1 Aadhar No."
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="tel"
                  name="reference1Mobile"
                  value={form.reference1Mobile||''}
                  onChange={handleChange}
                  placeholder="Reference 1 Mobile"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <textarea
                  name="reference1Address"
                  value={form.reference1Address||''}
                  onChange={handleChange}
                  placeholder="Reference 1 Address"
                  className="input-field resize-y h-18 w-full border border-gray-300 p-3  rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="reference1Relationship"
                  value={form.reference1Relationship||''}
                  onChange={handleChange}
                  placeholder="Reference 1 Relationship"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="space-y-5 mt-5">
                <h4 className="text-md font-semibold text-gray-700">Reference 2 (Optional):</h4>
                <input
                  type="text"
                  name="reference2Name"
                  value={form.reference2Name||''}
                  onChange={handleChange}
                  placeholder="Reference 2 Name"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="reference2Aadhar"
                  value={form.reference2Aadhar||''}
                  onChange={handleChange}
                  placeholder="Reference 2 Aadhar No."
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="tel"
                  name="reference2Mobile"
                  value={form.reference2Mobile||''}
                  onChange={handleChange}
                  placeholder="Reference 2 Mobile"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <textarea
                  name="reference2Address"
                  value={form.reference2Address||''}
                  onChange={handleChange}
                  placeholder="Reference 2 Address"
                  className="input-field resize-y h-18 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              </div>
            </section>


          <section className="md:w-1/2  pl-4 mt-2 p-2 rounded-xl shadow-xl border border-gray-400">
              <h3 className="text-2md font-semibold text-[#ff1493] mb-3 pb-3 border-b border-blue-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#6366f1]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Service & Payment Details
              </h3>
              <div className="space-y-5">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="serviceHours12hrs"
                      checked={form.serviceHours12hrs||false}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-gray-700">12 Hours Service</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="serviceHours24hrs"
                      checked={form.serviceHours24hrs||false}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-gray-700">24 Hours Service</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="preferredService"
                  value={form.preferredService||''}
                  onChange={handleChange}
                  placeholder="Preferred Service (e.g., OPD, Home Visit)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="paymentService"
                  value={form.paymentService||''}
                  onChange={handleChange}
                  placeholder="Payment Service (e.g., Online, Cash)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="paymentBankName"
                  value={form.paymentBankName||''}
                  onChange={handleChange}
                  placeholder="Bank Name for Payments"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="paymentBankAccountNumber"
                  value={form.paymentBankAccountNumber||''}
                  onChange={handleChange}
                  placeholder="Bank Account Number"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="ifscCode"
                  value={form.ifscCode.toUpperCase()||''}
                  onChange={handleChange}
                  placeholder="IFSC Code"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <textarea
                  name="bankBranchAddress"
                  value={form.bankBranchAddress||''}
                  onChange={handleChange}
                  placeholder="Bank Branch Address"
                  className="input-field resize-y h-18 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="Bankbranchname"
                  value={form.Bankbranchname||''}
                  onChange={handleChange}
                  placeholder="Bank Branch Name"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="Branchcity"
                  value={form.Branchcity||''}
                  onChange={handleChange}
                  placeholder="Branch City"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="Branchstate"
                  value={form.Branchstate||''}
                  onChange={handleChange}
                  placeholder="Branch State"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="Branchpincode"
                  value={form.Branchpincode||''}
                  onChange={handleChange}
                  placeholder="Branch Pincode"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              </div>
            </section>

          </div>
         <section className="flex flex-col md:flex-row justify-center gap-4 p-4 border border-gray-400 rounded-xl shadow-xl bg-white">
 
  <div className="w-full md:w-1/2 p-2">
    <h3 className="text-lg md:text-xl font-semibold text-[#ff1493] pb-3 mb-3 border-b border-blue-200 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2 text-[#6366f1]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Additional Information
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
   
<select  name="languages"
        value={form.languages || ''}
        onChange={handleChange}
         className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
        >
       <option value="">Select Language</option>
      
                      {IndianLanguages.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
      
                    </select>

      <input
        type="text"
        name="type"
        value={form.type || ''}
        onChange={handleChange}
        placeholder="Type (e.g., General Physician, Specialist)"
        className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
        required
      />

      <input
        type="text"
        name="specialties"
        value={form.specialties || ''}
        onChange={handleChange}
        placeholder="Specialties (comma-separated)"
        className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
        required
      />
       
    </div>
    <div className="space-y-4 mt-2">
   
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="Password"
          value={password}
          onChange={handleChange}
          placeholder="Enter Password"
          className="w-full border border-gray-300 p-3 pr-10 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

     
      <div className="relative ">
        <input
          type={showConfirm ? "text" : "password"}
          name="ConfirmPassword"
          value={form.ConfirmPassword || ""}
          onChange={handleChange}
          placeholder="Confirm Password"
          className={`w-full border p-3 pr-10 rounded-lg text-sm focus:ring-2 transition
            ${
              form.ConfirmPassword &&
              form.ConfirmPassword !== password
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border">
        <RuleItem ok={passwordRules.length(password)} label="Min 8 characters" />
        <RuleItem ok={passwordRules.capital(password)} label="1 Capital letter" />
        <RuleItem ok={passwordRules.number(password)} label="1 Number" />
        <RuleItem ok={passwordRules.special(password)} label="1 Special character" />
      </div>

      {form.ConfirmPassword && (
        <p
          className={`text-xs font-medium ${
            form.ConfirmPassword === password ? "text-green-600" : "text-red-500"
          }`}
        >
          {form.ConfirmPassword === password
            ? "Passwords match"
            : "Passwords do not match"}
        </p>
      )}
    </div>
  </div>

  <div className="w-full md:w-1/2 p-2">
    <h3 className="text-lg md:text-xl font-semibold text-[#ff1493] mb-4 border-b border-blue-300 pb-2">
      Your Documents
    </h3>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-items-center">
      {['AdharCard', 'PanCard', 'CertificatOne', 'CertificatTwo', 'AccountPassBook', 'BVR'].map((docKey) => (
        <div
          key={docKey}
          className="flex flex-col items-center justify-between p-2 border border-blue-300 rounded-lg bg-gray-50 shadow-sm w-36 sm:w-40 h-40"
        >
     
          {Docs[docKey as keyof typeof Docs] ? (
            docKey === 'BVR' ? (
              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-md shadow-sm mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-12 h-12 text-red-500"
                >
                  <path d="M12 0C8.686 0 6 2.686 6 6v12c0 3.314 2.686 6 6 6s6-2.686 6-6V6c0-3.314-2.686-6-6-6zm3 18h-6v-2h6v2zm0-4h-6v-2h6v2zm0-4h-6V8h6v2z" />
                </svg>
              </div>
            ) : (
              <img
                src={Docs[docKey as keyof typeof Docs]}
                alt={docKey}
                className="w-24 h-24 object-cover rounded-md shadow-sm mb-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_DOCUMENT_ICON;
                }}
              />
            )
          ) : (
            <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
          )}

  
          <label
            htmlFor={docKey}
            className="cursor-pointer text-center text-[10px] sm:text-[11px] text-white bg-teal-600 hover:bg-teal-500 px-3 py-1 rounded-full transition-colors duration-300"
          >
            {Docs[docKey as keyof typeof Docs] ? 'Update' : 'Upload'}{' '}
            {docKey.replace(/([A-Z])/g, ' $1').replace('Card', ' Card').replace('Book', ' Book').trim()}
          </label>

          <input
            id={docKey}
            name={docKey}
            type="file"
            accept={docKey === 'BVR' ? 'application/pdf' : 'image/*'}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      ))}

      
      <div className="flex flex-col justify-between border border-gray-300 rounded-lg p-2 w-36 sm:w-40 h-40">
        <textarea
          placeholder="Don’t have documents? Please explain."
          name="field_message"
          value={ReasonValue || ''}
          onChange={(e: any) => distpatch(UpdateDocmentSkipReason(e.target.value))}
          rows={4}
          className="w-full text-xs p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
        />
        <button className="text-center text-[10px] sm:text-[11px] text-white bg-teal-600 hover:bg-teal-500 px-2 py-1 rounded-full transition-colors duration-300">
          Submit Explanation
        </button>
      </div>
    </div>
  </div>
</section>


          {/* <div className="md:flex justify-center gap-2">
                            <section className="md:w-1/2 bg-blue-50 mt-2 p-2 rounded-xl shadow-md">
                                <h3 className="text-md font-semibold text-[#ff1493] mb-3 pb-3 border-b border-blue-200 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 mr-2 text-[#6366f1]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-5 3v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h3a2 2 0 012 2z" />
                                    </svg>
                                    Video Upload & Terms
                                </h3>
                                <div className="grid grid-cols-1 gap-5 mb-5">
                                    <div className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg bg-white">
                                        <label htmlFor="VideoFile" className="relative group w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                                            {Docs.VideoFile ? (
                                                <video src={Docs.VideoFile} controls className="w-full h-full object-contain rounded-lg" />
                                            ) : (
                                                <div className="text-gray-500 text-center">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="mt-1 text-sm text-gray-600">Drag and drop or <span className="font-semibold text-blue-600">browse for a video</span></p>
                                                    <p className="text-xs text-gray-500">(Max 50MB)</p>
                                                </div>
                                            )}
                                            <input
                                                id="VideoFile"
                                                name="VideoFile"
                                                type="file"
                                                accept="video/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                
                                            />
                                        </label>
                                        {Docs.VideoFile && (
                                            <p className="text-sm text-gray-600 mt-2">Video uploaded: <a href={Docs.VideoFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Video</a></p>
                                        )}
                                    </div>
                                      <p className='text-center text-[10px] text-gray-500'>Read the Following Content While Reacording Video</p>
                                    <div className="flex items-center mt-4">
                                      
                                        <p className="text-sm text-gray-700 font-semibold text-center w-full">
                                            I hereby acknowledge that I have read, understood, and fully accept all the terms and conditions set forth by HCA. I agree to comply with these terms in their entirety.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                     */}

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={!UpdateingStatus}
              className={`px-10 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300
                ${UpdateingStatus ? 'bg-[#50c896] hover:bg-teal-700 focus:ring-4 focus:ring-indigo-300' : 'bg-gray-400 cursor-not-allowed'}
              `}
            >
              {UpdateingStatus ? 'Update Profile' : 'Updating...'}
            </button>
          </div>

        </form>

      </div>
  
  );
}