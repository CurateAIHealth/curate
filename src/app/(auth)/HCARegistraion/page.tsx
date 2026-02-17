'use client';

import HCAMobileView from '@/Components/HCAMobileView/page';
import { EducationLevels, Home_Assistance_Needs, IndianCapitalCities, IndianLanguages, IndianStates, NURSE_SPECIALTIES, NURSE_TYPES, PatientTypes, popularBanksInIndia, PROFESSIONAL_SKILL_OPTIONS, REFERRAL_SOURCE_TYPES, Relations } from '@/Lib/Content';
import { v4 as uuidv4 } from 'uuid';
import { GetRegidterdUsers, GetUserInformation, HCARegistration, PostHCAFullRegistration, UpdateFinelVerification } from '@/Lib/user.action';
import { Update_Main_Filter_Status, UpdateDocmentSkipReason, UpdateRefresh, UpdateUserType } from '@/Redux/action';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { stringify } from 'querystring';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingData } from '@/Components/Loading/page';
import { EyeOff, Eye, CheckCircle, XCircle } from 'lucide-react';


const DEFAULT_PROFILE_PIC = '/Icons/DefaultProfileIcon.png';
const DEFAULT_DOCUMENT_ICON = '/Icons/DefaultDocumentIcon.png';

export default function DoctorProfileForm() {
  const [ProfileName, SetProfileName] = useState('');
  const [isOther, setIsOther] = useState(false);
  const [IsOtherReferal, setIsOtherReferal] = useState(false);
  const [isOtherProfetionalEducation, setIsOtherProfetionalEducation] = useState(false);
  const [isOtherhigherEducation,setisOtherhigherEducation]=useState(false)
  const [isOtherOngoingEducation, setIsOtherOngoingEducation] = useState(false);
  const [isOtherPreviousHealthProblems, setIsOtherPreviousHealthProblems] = useState(false);
  const [OtherDeformity,setOtherDeformity]=useState(false)
  const [OtherPermanentCity,setOtherPermanentCity]=useState(false)
   const [OtherBankName,setOtherBankName]=useState(false)
  const [OtherCurrentCity,setOtherCurrentCity]=useState(false)
  const [isOtherCurrentHealthProblems,setisOtherCurrentHealthProblems]=useState(false)
  const [isOtherReferralSourceType, setIsOtherReferralSourceType] = useState(false);
  const [isOtherProfessionalSkills,setisOtherProfessionalSkills]=useState(false)
    const [isOtherHairColour,setisOtherHairColour]=useState(false)
    const [isOtherEyeColour,setisOtherEyeColour]=useState(false)
      const [isOtherComplexion,setisOtherComplexion]=useState(false)
        const [isOtherMoleOnBody1,setisOtherMoleOnBody1]=useState(false)
          const [isOtherMoleOnBody2,setisOtherMoleOnBody2]=useState(false)
  const [sameAddress, setSameAddress] = useState(false);


  // const [isOther, setIsOther] = useState(false);
const [ImportedVendors, setImportedVendors] = useState<any>([])
  const [PictureUploading, setPictureUploading] = useState(false);
  const [UpdateingStatus, SetUpdateingStatus] = useState(true);
  const [UpdatedStatusMessage, setUpdatedStatusMessage] = useState('');
  const [addedheight, setaddedheight] = useState<any>(null);
  const [addingWeight, setaddingWeight] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [siblings, setSiblings] = useState([
    { relation: "Elder Brother", count: 0 },
    { relation: "Younger Brother", count: 0 },
    { relation: "Elder Sister", count: 0 },
    { relation: "Younger Sister", count: 0 },
    { relation: "Twin Sibling", count: 0 },
  ]);


  const userId = useSelector((state: any) => state?.UserDetails);
  const CurrentUserType = useSelector((state: any) => state.RegisteredUserType)

  interface FormState {
    HomeAssistance: any;
    // title: any;
    firstName: any;
    lastName:any;
    surname: string;
    fatherName: string;
    motherName: string;
    // husbandName?: string; // commented out fields optional
    gender: string;
    dateOfBirth: string;
    maritalStatus: string;
    emailId: string;
    mobileNumber: string;
    earningSource: string,
    aadharCardNo: string;
    OngoingStudy: string,
    panNumber: string;
    // voterIdNo?: string;
    // rationCardNo?: string;
    permanentAddress: any;
    currentAddress: any;
    CurrentState:any;
    cityPostcodePermanent: string;
    cityPostcodeCurrent: string;
    SiblingsInfo: any,
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
    HandledSkills: any,
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
    PaymentforStaff: string;
    BankAccountHolderName: string;
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
    Password: any;
    ConfirmPassword: any;
    PreviewUserType:any;
    fatherNameContact:any;
    motherContact:any;
    Husbend:any;
    HusbendContact:any;
    referralSourceType:any;
    PermanentHouseNo:any;
    PermanentCity:any;
    CurrentCity:any;
    CurrentHouseNo:any;
    Guardian:any;
    GuardianContact:any;
    PermanentState:any;
    NotedDtaeForHike:any;
    Remarks:any;
    BankName:any
   
    // website?: string; // optional if commented
  }

  const router = useRouter();





const isValidAadhaar = (value: string) => /^\d{12}$/.test(value);
const isValidIndianMobile = (value: string) => /^[6-9]\d{9}$/.test(value);



  const ReasonValue = useSelector((state: any) => state.DocumentReson)
  const RegisterfromAdmin=useSelector((state:any)=>state.AdminRegister)
  const [heightInCm, setHeightInCm] = useState("");

  const distpatch = useDispatch()
  const [Docs, setDocs] = useState({
    ProfilePic: DEFAULT_PROFILE_PIC,
    PanCard: '',
    AdharCard: '',
    AccountPassBook: '',
    CertificatOne: '',
    CertificatTwo: '',
    VideoFile: '',
    BVR: '',
    HCPform:""
  });
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName:'',
    surname: '',
    fatherName: '',
    fatherNameContact:'',
    motherContact:'',
    motherName: '',
    Husbend:'',
    HusbendContact:'',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    emailId: '',
    mobileNumber: '',
    HomeAssistance: '',
    earningSource: '',
    aadharCardNo: '',
    panNumber: '',
    PermanentHouseNo:'',
    PermanentCity:'',
    permanentAddress: '',
    currentAddress: '',
    CurrentCity:'',
    CurrentState:'',
    CurrentHouseNo:'',
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
    PaymentforStaff: '',
    BankAccountHolderName: '',
    BankName:'',
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
    Password: '',
    ConfirmPassword: '',
    PreviewUserType:CurrentUserType,
    referralSourceType:'',
    Guardian:'',
    GuardianContact:'',
    PermanentState:'',
    NotedDtaeForHike:'',
    Remarks:'',
    
  });

  const [isuserIdAvailable, setisuserIdAvailable] = useState<any>(null)

const hasRedirected = useRef(false);

useEffect(() => {
  if (
    !hasRedirected.current &&
    isChecking === false &&
    CurrentUserType === null
  ) {
    hasRedirected.current = true;
    router.replace("/UserTypeRegistration");
  }
}, [CurrentUserType, isChecking, router]);





 useEffect(()=>{
  const GetInfo=async()=>{
    try{

     const RegisterdUsers = await GetRegidterdUsers()
         setImportedVendors(RegisterdUsers.filter((each: any) => each.userType === "Vendor"))

    }catch(err:any){

    }
  }
  GetInfo()
 },[])

useEffect(() => {
 
  if (RegisterfromAdmin === undefined) return;


  if (RegisterfromAdmin === true) {
    setisuserIdAvailable(null);
    setForm((prev) => ({
      ...prev,
      emailId: "",
      mobileNumber: "",
      firstName: "",
      surname: "",
    }));
    setIsChecking(false);
    return;
  }

 
  const fetchProfile = async () => {
    const localValue = localStorage.getItem("UserId");
    if (!localValue) {
      setIsChecking(false);
      return;
    }

    setisuserIdAvailable(localValue);

     const profile = await GetUserInformation(localValue)
          
  
    if (!profile) {
      setIsChecking(false);
      return;
    }

    setForm((prev) => ({
      ...prev,
      firstName: profile.FirstName ?? "",
      surname: profile.LastName ?? "",
      emailId: profile.Email ?? "",
      mobileNumber: profile.ContactNumber ?? "",
    }));

    setIsChecking(false);
  };

  fetchProfile();
}, [RegisterfromAdmin]);









  const completion = useMemo(() => {
    const { serviceHours12hrs, serviceHours24hrs, ...restForm } = form;

    const flatFields = Object.values(restForm);

    let filled = flatFields.filter((f) => {
      if (typeof f === 'string') return f.trim() !== '';
      if (typeof f === 'boolean') return f;
      return false;
    }).length;

    if (serviceHours12hrs || serviceHours24hrs) {
      filled += 1;
    }

    const totalFields = flatFields.length + 1;
    return Math.round((filled / totalFields) * 100);
  }, [form]);
  ;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      if (type === "checkbox") {
  const checked = (e.target as HTMLInputElement).checked;

  setForm((prev) => ({
    ...prev,
    [name]: checked,
  }));
}
 else {
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
  const handleUpdteSiblings = (index: any, value: any) => {
    const updated = [...siblings];
    updated[index].count = Number(value);
    setSiblings(updated);
  };









  const handleHeightChange = (field: string, value: string) => {

    setForm((prev: any) => {
      const updated = { ...prev, [field]: value };

      return updated;
    });
  }
const handleHomeAssistanceChange = (skill: string) => {
  setForm((prev: any) => {
    const exists = prev.HomeAssistance.includes(skill);

    let updated = exists
      ? prev.HomeAssistance.filter((s: string) => s !== skill)
      : [...prev.HomeAssistance, skill];

    // If user UNCHECKS "Other" → remove custom value
    if (skill === "Other" && exists) {
      updated = updated.filter(
        (s: string) => !s.startsWith("Other:")
      );
    }

    return {
      ...prev,
      HomeAssistance: updated,
    };
  });
};




const UpdateHandledSkills = (skill: string) => {
  setForm((prev: any) => {
    const exists = prev.HandledSkills.includes(skill);

    let updated = exists
      ? prev.HandledSkills.filter((s: string) => s !== skill)
      : [...prev.HandledSkills, skill];

    // If user UNCHECKS "Other" → remove custom value
    if (skill === "Other" && exists) {
      updated = updated.filter(
        (s: string) => !s.startsWith("Other:")
      );
    }

    return {
      ...prev,
      HandledSkills: updated,
    };
  });
};

 const handleprofessionalSkillChange = (skill: string) => {
  setForm((prev: any) => {
    const exists = prev.professionalSkill.includes(skill);

    let updatedSkills = exists
      ? prev.professionalSkill.filter((s: string) => s !== skill)
      : [...prev.professionalSkill, skill];

    // If "Other" is unchecked → remove any custom other value
    if (skill === "Other" && exists) {
      updatedSkills = updatedSkills.filter(
        (s: string) => !s.startsWith("Other:")
      );
    }

    return {
      ...prev,
      professionalSkill: updatedSkills,
    };
  });
};

const isOtherSelected = form.professionalSkill.includes("Other");

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


      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg', 'application/pdf',];
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
const HEIGHT_OPTIONS = Array.from(
  { length: (6 * 30.48 - 4 * 30.48) / 2 + 1 },
  (_, i) => {
    const cm = Math.round(4 * 30.48 + i * 2); // step = 2 cm
    return cm;
  }
);


  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if(form.emailId==="admin@curatehealth.in"){
        alert("Your Useing AdminEmail.")
        return
      }

      if (CurrentUserType === null) {
        alert("UserType Not Selected");
        return;
      }

      setTimeout(async () => {
        try {

          const dob = new Date(form.dateOfBirth);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

          if (age < 18) {
            alert("❌ Cannot submit. Age must be at least 18 years.");
            SetUpdateingStatus(true);
            return;
          }

        
          const requiredFields: (keyof typeof Docs)[] = [
  "ProfilePic",
  "PanCard",
  "AdharCard",
  "AccountPassBook",
  "CertificatOne",
  "CertificatTwo",
  "BVR",
  "HCPform",
];

const isAnyFieldEmpty = requiredFields.some(
  (key) => Docs[key]?.trim?.() === ""
);

const isReasonEmpty = ReasonValue.trim() === "";

if (!isAnyFieldEmpty && !isReasonEmpty) {
  alert(
    "Upload all the required documents OR provide a reason for not uploading them."
  );
  SetUpdateingStatus(true);
  return;
}


          setUpdatedStatusMessage("Please Wait Updating.....");

        
          const isNewUser = isuserIdAvailable === null;
          const generatedUserId = isNewUser ? uuidv4() : isuserIdAvailable;

          const localValue =
            userId || localStorage.getItem("UserId");

          const UpdateCurrentUserType =
            CurrentUserType === "HCA"
              ? "healthcare-assistant"
              : CurrentUserType;

          const payload: any = {
            userType: "healthcare-assistan",
            FirstName: form.firstName || "",
            SurName: form.surname || "",
            LastName:form.lastName||'',
            Gender: form.gender || "",
            DateOfBirth: form.dateOfBirth || "",
            MaritalStatus: form.maritalStatus || "",
            Nationality: "Indian",
            AadharNumber: form.aadharCardNo
              ? form.aadharCardNo.replace(/\s/g, "")
              : "",
            Age: AgeValue() || "",
            ContactNumber: form.mobileNumber || "",
            Email: form.emailId || "",
            Location: form.currentAddress || "",
            userId: generatedUserId,
            VerificationStatus: "Pending",
            TermsAndConditions: true,
            FinelVerification: true,
            EmailVerification: true,
            Password: form.Password || "",
            PreviewUserType:form.PreviewUserType,
            fatherNameContact:form.fatherNameContact,
            motherContact:form.motherContact,
            Husbend:form.Husbend,
            HusbendContact:form.HusbendContact,
            referralSourceType:form.referralSourceType,
            PermanentHouseNo:form.PermanentHouseNo,
            PermanentCity:form.PermanentCity
          };


          let registrationResult:any = { success: true };

          if (isNewUser) {
            registrationResult = await HCARegistration(payload);
      
          }

          if (registrationResult.success !== true) {
            setUpdatedStatusMessage(registrationResult.message);
            return;
          }


          const FinelForm = {
            ...form,
            Documents: Docs,
            UserId: generatedUserId,
            DocumentSkipReason: ReasonValue,
            userType:"healthcare-assistant"
              
          };

          await PostHCAFullRegistration(FinelForm);

          await UpdateFinelVerification(localValue);


          await axios.post("/api/MailSend", {
  to: form.emailId || "tsiddu805@gmail.com",
  subject: "Welcome to Curate Health Care – Your Login Credentials",
  html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to Curate Health Care</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:30px 10px;">
            
            <!-- Main Card -->
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; box-shadow:0 4px 14px rgba(0,0,0,0.08); overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#1392d3; padding:20px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:24px;">
                    Curate Health Care
                  </h1>
                  <p style="margin:6px 0 0; color:#e3f2fd; font-size:14px;">
                    Caring Beyond Boundaries
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px;">
                  <h2 style="margin-top:0; color:#333333; font-size:20px;">
                    Welcome 👋
                  </h2>

                  <p style="color:#555555; font-size:14px; line-height:1.6;">
                    We are delighted to have you onboard with 
                    <strong>Curate Health Care Services</strong>.
                  </p>

                  <p style="color:#555555; font-size:14px; line-height:1.6;">
                    Below are your login credentials. Please keep them safe and
                    do not share them with anyone.
                  </p>

                  <!-- Credentials Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0; background:#f8fbff; border:1px solid #dbeafe; border-radius:8px;">
                    <tr>
                      <td style="padding:16px;">
                        <p style="margin:0 0 8px; font-size:14px; color:#333;">
                          <strong>Email:</strong> ${form?.emailId}
                        </p>
                        <p style="margin:0; font-size:14px; color:#333;">
                          <strong>Password:</strong> ${form?.Password}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA -->
                  <div style="text-align:center; margin-top:25px;">
                    <a
                      href="https://curatehealthservices.com"
                      style="
                        display:inline-block;
                        padding:12px 26px;
                        background:#1392d3;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:30px;
                        font-size:14px;
                        font-weight:bold;
                      "
                    >
                      Login to Dashboard
                    </a>
                  </div>

                  <p style="margin-top:25px; color:#777777; font-size:13px; line-height:1.5;">
                    If you face any issues while logging in, feel free to contact
                    our support team.
                  </p>

                  <p style="color:#555555; font-size:14px;">
                    Warm regards,<br />
                    <strong>Curate Health Care Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f1f5f9; padding:15px; text-align:center;">
                  <p style="margin:0; font-size:12px; color:#666666;">
                    © ${new Date().getFullYear()} Curate Health Care Services.
                    All rights reserved.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
  </html>
  `,
});


          distpatch(UpdateRefresh(1));
          distpatch(Update_Main_Filter_Status("HCP List"));
          distpatch(UpdateUserType("healthcare-assistant"));

          setUpdatedStatusMessage("Successfully Updated Your Information.");
          SetUpdateingStatus(true);

          setTimeout(() => {
            router.push("/");
          }, 1000);

        } catch (error) {
          console.error("Submission Error:", error);
          setUpdatedStatusMessage("Something went wrong. Please try again.");
        }
      }, 0);
    },
    [
      form,
      Docs,
      ReasonValue,
      CurrentUserType,
      isuserIdAvailable,
      router,
    ]
  );

  const FullForms = (UserType: any) => {
    switch (UserType) {
      case "HCA":
        return "Health Care Assistant";
      case "HCP":
        return "Health Care Professional";

      case "HCN":
        return "Health Care Nurse";
        default:
          return null

    }
  }

  const handleLogout = async () => {
    localStorage.removeItem("UserId");

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


if (isChecking || CurrentUserType === undefined) {
  return <LoadingData />;
}


if (CurrentUserType === null) {
  return null;
}



console.log("check Update----",form.BankName)

  const FilterdImportedVendorName = ImportedVendors.map((each: any) => each.VendorName)

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
              {FullForms(CurrentUserType)} Registration
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
                  className={`mt-8 w-full max-w-md p-4 rounded-xl font-medium text-sm shadow-inner transition-all duration-300 ${UpdatedStatusMessage === "Successfully Updated Your Information."
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

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1600px] mx-auto px-4">

         <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">


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
                name="surname"
                value={form.surname || ''}
                onChange={handleChange}
                placeholder="Surname"
              className="
    input-field md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "

              />

              <input
                type="text"
                name="firstName"
                value={form.firstName || ''}
                onChange={handleChange}
                placeholder="First Name"
 className="
    input-field  md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
                required
              />
              <input
                type="text"
                name="lastName"
                value={form.lastName || ''}
                onChange={handleChange}
                placeholder="Last Name"
className="
    input-field md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
                
              />

              <input
                type="text"
                name="fatherName"
                value={form.fatherName || ''}
                onChange={handleChange}
                placeholder="Father's Name"
className="
    input-field md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent
    transition-all m-1
  "
              />
              <input
                type="tel"
                name="fatherNameContact"
        className="
    input-field md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
                value={form.fatherNameContact || ""}
                onChange={(e) => {

                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setForm({ ...form, fatherNameContact: value });
                }}
                placeholder="Father's Contact"
           
                required
              />
              {form.fatherNameContact &&
  form.fatherNameContact !== "Not Available" &&
  !/^[6-9]\d{9}$/.test(form.fatherNameContact) && (
    <p className="text-xs text-red-500 mt-1">
      Enter a valid Indian mobile number
    </p>
)}


<button

   type="button"
   onClick={() =>
    setForm((prev: any) => ({
      ...prev,
      fatherNameContact:"Not Available", 
    }))
  }
  className="
    px-4 py-2 md:ml-[20px]
    rounded-xl
    bg-amber-50
    text-amber-700
    text-sm font-semibold
    border border-amber-200
    hover:bg-amber-100
    hover:border-amber-300
    transition
    shadow-sm
    cursor-pointer
  "
>
  Not Available
</button>

              <input
                type="text"
                name="motherName"
                value={form.motherName || ''}
                onChange={handleChange}
                placeholder="Mother's Name"
                       className="
    input-field md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
                required
              />
              <input
                type="tel"
                name="motherContact"
                value={form.motherContact || ""}
                onChange={(e) => {

                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setForm({ ...form, motherContact: value });
                }}
                placeholder="Mother's Contact"
        className="
    input-field md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
              />
              {form.motherContact &&
             form.motherContact!=="Not Available"&&
                !/^[6-9]\d{9}$/.test(form.motherContact) && (
                  <p className="text-xs text-red-500 mt-1">
                    Enter a valid Indian mobile number
                  </p>
                )}
<button

   type="button"
   onClick={() =>
    setForm((prev: any) => ({
      ...prev,
      motherContact:"Not Available", 
    }))
  }
  className="
    px-4 py-2 md:ml-[20px]
    rounded-xl
    bg-amber-50
    text-amber-700
    text-sm font-semibold
    border border-amber-200
    hover:bg-amber-100
    hover:border-amber-300
    transition
    shadow-sm
    cursor-pointer
  "
>
  Not Available
</button>
              <input
                type="text"
                name="Husbend"
                value={form.Husbend || ''}
                onChange={handleChange}
                placeholder="Husband Name"
        className="
    input-field md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "

              />
            <input
  type="tel"
  name="HusbendContact"
  value={form.HusbendContact || ""}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm({ ...form, HusbendContact: value });
  }}
  placeholder="Husband Contact (Optional)"
  className="
    input-field md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
/>
 

{form.HusbendContact &&
form.HusbendContact!=="Not Available"&&
  !/^[6-9]\d{9}$/.test(form.HusbendContact) &&  (
    <p className="text-xs text-red-500 mt-1">
      Enter a valid Indian mobile number
    </p>
)}

<button

   type="button"
   onClick={() =>
    setForm((prev: any) => ({
      ...prev,
      HusbendContact:"Not Available", 
    }))
  }
  className="
    px-4 py-2 md:ml-[20px]
    rounded-xl
    bg-amber-50
    text-amber-700
    text-sm font-semibold
    border border-amber-200
    hover:bg-amber-100
    hover:border-amber-300
    transition
    shadow-sm
    cursor-pointer
  "
>
  Not Available
</button>

              <input
                type="text"
                name="Guardian"
                value={form.Guardian}
                onChange={handleChange}
                placeholder="Guardian Name"
        className="
    input-field md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
              />
              <input
                type="tel"
                name="GuardianContact"
                value={form.GuardianContact || ""}
                onChange={(e) => {

                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setForm({ ...form, GuardianContact: value });
                }}
                placeholder="Guardian Contact "
        className="
    input-field md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
              />
              {form.GuardianContact &&
                !/^[6-9]\d{9}$/.test(form.GuardianContact) && (
                  <p className="text-xs text-red-500 mt-1">
                    Enter a valid Indian mobile number
                  </p>
                )}

              <select
                name="gender"
                value={form.gender || ''}
                onChange={handleChange}
        className="
    input-field md:w-[200px] w-full
    border border-gray-300
    p-1 h-10 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <select
                name="maritalStatus"
                value={form.maritalStatus || ''}
                onChange={handleChange}
        className="
    input-field w-full
    border border-gray-300
    p-1 h-8 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
                required
              >
                <option value="">Select Marital Status</option>
                <option value="Unmarried">Unmarried</option>
                <option value="Married">Married</option>
                <option value="Divorcee">Divorcee</option>
                <option value="Widower">Widower</option>
              </select>
              <div className="space-y-2 p-1 w-full">
                <input
                  type="email"
                  name="emailId"
                  value={form.emailId || ''}
                  onChange={handleChange}
                  placeholder="Email ID"
                  className="
      input-field 
      border border-gray-300
      p-3 h-8 w-full
      rounded-lg
      focus:ring-2 focus:ring-blue-300
      focus:border-transparent
      transition-all
    "
                  required
                />


                <div className="flex justify-end">
                  <a
                    href="https://accounts.google.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
        text-xs  
        text-blue-600
        hover:text-blue-700
        hover:underline
        transition
      "
                  >
                    Don’t have an email? Create a Gmail account
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-1 h-10">

                <input
                  type="tel"
                  name="mobileNumber"
                  value={form?.mobileNumber ?? ""}
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "");

               
                    if (digitsOnly.length > 10) return;

                    setForm((prev: any) => ({
                      ...prev,
                      mobileNumber: digitsOnly,
                    }));
                  }}
                  className={`
      input-field  p-1 h-11 rounded-lg transition-all  w-full
      focus:outline-none focus:border-transparent
      ${form.mobileNumber &&
                      !isValidIndianMobile(form.mobileNumber)
                      ? "border border-red-400 focus:ring-2 focus:ring-red-300"
                      : "border border-gray-300 focus:ring-2 focus:ring-blue-300"
                    }
    `}
                  required
                />

                {form.mobileNumber &&
                  !isValidIndianMobile(form.mobileNumber) && (
                    <p className="text-xs text-red-500 mt-1">
                      Enter a valid 10-digit Indian mobile number.
                    </p>
                  )}
              </div>


              <select name="languages"
                value={form.languages || ''}
                onChange={handleChange}
        className="
    input-field w-full mb-1
    border border-gray-300
    p-1 h-8
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
              >
                <option value="">Select Language</option>

                {IndianLanguages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}

              </select>
              <div className="relative w-full">

                <label
                  htmlFor="dateOfBirth"
                  className="absolute left-3 bg-white px-1 text-xs font-medium text-gray-600"
                >
                  Date of Birth
                </label>

                <input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth || ''}
                  onChange={handleChange}
               className="
    input-field w-full mt-4
    border border-gray-300
    p-1 h-8 
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent m-1
    transition-all
  "
                  required
                />


                {form.dateOfBirth && (
                  <p className="mt-1 text-xs text-gray-500">
                    Age:{' '}
                    {(() => {
                      const dob = new Date(form.dateOfBirth);
                      const today = new Date();
                      let age = today.getFullYear() - dob.getFullYear();
                      const m = today.getMonth() - dob.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
                      return age;
                    })()}{' '}
                    years
                  </p>
                )}
              </div>

         <div className="w-full">
  <label className="block text-xs font-semibold text-gray-600 mb-1">
    Add Remarks
  </label>

  <textarea
    rows={4}
    placeholder="Enter remarks or additional notes..."
    className="
      w-full
      rounded-xl
      border border-gray-300
      px-4 py-3
      text-sm text-gray-800
      placeholder-gray-400
      resize-none
      focus:outline-none
      focus:ring-2 focus:ring-indigo-500
      focus:border-transparent
      transition-all
    "
  />
</div>

            {((CurrentUserType === "HCA") || (CurrentUserType === "HCN")) && (
              <div>

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


                <div className="rounded-2xl border border-gray-100">
                  <h3 className="flex justify-start text-grey-400 mb-2 text-center">
                    Earning Source
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Relations.map((each) => (
                      <label
                        key={each}
                        className="flex items-center space-x-2 bg-white border hover:bg-indigo-100 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="earningSource"
                          value={each}
                          checked={form.earningSource === each}
                          className="w-5 h-5 accent-indigo-600"
                          onChange={(e) => {
                            const value = e.target.value;

                            setForm((prev: any) => ({
                              ...prev,
                              earningSource: value === "Other" ? "" : value,
                            }));

                            setIsOther(value === "Other");
                          }}
                        />
                        <span className="text-gray-700 font-medium text-[13px]">
                          {each}
                        </span>
                      </label>
                    ))}
                  </div>


                  {isOther && (
                    <div className="mt-3">
                      <input
                        type="text"
                        name="earningSource"
                        placeholder="Please specify..."
                        value={form.earningSource || ""}
                        className="
        w-full h-10 px-4 rounded-xl
        border border-slate-300 bg-white
        text-sm text-slate-700
        placeholder-slate-400
        shadow-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-gray-400
      "
                        onChange={handleChange}
                      />
                    </div>
                  )}

                </div>


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

          <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">

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
                value={form.aadharCardNo || ''}
                placeholder="Aadhaar Card No."
                maxLength={14}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  value = value.slice(0, 12);


                  const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');

                  setForm({
                    ...form,
                    aadharCardNo: formatted,
                  });
                }}
                className="
    input-field
    border border-gray-300
    p-3 h-10 w-full
    rounded-lg
    tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent
    transition-all
  "
                required
              />

              <input
                type="text"
                name="panNumber"
                value={form.panNumber || ''}
                placeholder="PAN Number"
                maxLength={10}
                onChange={(e) => {
                  let value = e.target.value.toUpperCase();


                  value = value.replace(/[^A-Z0-9]/g, '');


                  if (value.length <= 5) {
                    value = value.replace(/[^A-Z]/g, '');
                  } else if (value.length <= 9) {
                    value =
                      value.slice(0, 5) +
                      value.slice(5).replace(/[^0-9]/g, '');
                  } else {
                    value =
                      value.slice(0, 9) +
                      value.slice(9).replace(/[^A-Z]/g, '');
                  }

                  setForm({ ...form, panNumber: value });
                }}
                className="
    input-field
    border border-gray-300
    p-3 h-10 w-full
    rounded-lg
    uppercase tracking-widest
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent
    transition-all
  "
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
            <input
              type="text"
              name="PermanentHouseNo"
              value={form.PermanentHouseNo || ''}
              placeholder="House Number"
              maxLength={10}
              onChange={handleChange}
              className="
    input-field w-full mb-4
    border border-gray-300
    p-3 h-10 w-full
    rounded-lg
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent
    transition-all
  "
              required
            />
            <textarea
              name="permanentAddress"
              value={form.permanentAddress || ''}
              onChange={handleChange}
              placeholder="Permanent Address (Per GOVT ID)"
              className="input-field resize-y h-18 border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all mb-5"
              required
            />
            <select
              name="PermanentCity"
              value={OtherPermanentCity?"Other":form.PermanentCity || ""}

              onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, PermanentCity: value === "Other" ? '' : value });
                setOtherPermanentCity(value === 'Other')


              }}
              className="
    input-field
    border border-gray-300
    p-2 h-11
    rounded-lg
    w-full
    bg-white
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent
    transition-all
    mb-5
  "
              required
            >
              <option value="Select City " >
                Select City
              </option>

              {IndianCapitalCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {OtherPermanentCity && <input
              type="text"
              name="PermanentCity"
              placeholder="Please specify Other"
              className="w-full mb-2 border border-gray-300 p-2 h-11 rounded-lg
                 focus:ring-2 focus:ring-blue-300 focus:border-transparent
                 transition-all"
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  PermanentCity: e.target.value,
                }))

              }
            />}

            <select
              name="PermanentState"
              value={form.PermanentState || ""}
              onChange={handleChange}
              className="
    input-field
    border border-gray-300
    p-2 h-11
    rounded-lg
    w-full
    bg-white
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent
    transition-all
    mb-5
  "
              required
            >
              <option value="" disabled>
                Select State
              </option>

              {IndianStates.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>


            <input
              type="text"
              name="cityPostcodePermanent"
              value={form.cityPostcodePermanent}
              onChange={handleChange}
              placeholder="Post Code"
              className="input-field border border-gray-300 p-3 h-8 mb-1 w-full rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
              required
            />
            <label className="flex items-center gap-2 mb-4 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={sameAddress}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSameAddress(checked);

                  if (checked) {
                    setForm((prev: any) => ({
                      ...prev,
                      CurrentHouseNo: prev.PermanentHouseNo || '',
                      currentAddress: prev.permanentAddress || '',
                      CurrentCity: prev.PermanentCity || '',
                      cityPostcodeCurrent: prev.cityPostcodePermanent || '',
                      CurrentState: prev.PermanentState || '',
                    }));
                  }
                }}
                className="accent-blue-600"
              />
              Current address is same as permanent address
            </label>

            <input
              type="text"
              name="CurrentHouseNo"
              value={form.CurrentHouseNo || ''}
              placeholder="House Number"
              maxLength={10}
              onChange={handleChange}
              className="
    input-field
    border border-gray-300
    p-3 h-10 w-full
    rounded-lg mb-2
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent
    transition-all
  "
              required
            />
            <textarea
              name="currentAddress"
              value={form.currentAddress || ''}
              onChange={handleChange}
              placeholder="Current Address"
              className="input-field resize-y h-18 border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all mb-5"
              required
            />

            <select
              name="CurrentCity"
              value={OtherCurrentCity?"Other":form.CurrentCity || ""}
              onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, CurrentCity: value === "Other" ? '' : value });
                setOtherCurrentCity(value === 'Other')


              }}
              className="
    input-field
    border border-gray-300
    p-2 h-11
    rounded-lg
    w-full
    bg-white
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent
    transition-all
    mb-5
  "
              required
            >
              <option value="" disabled>
                Select City
              </option>

              {IndianCapitalCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {OtherCurrentCity && <input
              type="text"
              name="CurrentCity"
              value={form.CurrentCity || ''}
              onChange={handleChange}
              placeholder="City (Current)"
              className="input-field border border-gray-300 p-3 h-8 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"

            />}
            <select
              name="CurrentState"
              value={form.CurrentState || ""}
              onChange={handleChange}
              className="
    input-field
    border border-gray-300
    p-2 h-11
    rounded-lg
    w-full
    bg-white
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent
    transition-all
    mb-5
  "
              required
            >
              <option value="" disabled>
                Select State
              </option>

              {IndianStates.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="cityPostcodeCurrent"
              value={form.cityPostcodeCurrent}
              onChange={handleChange}
              placeholder="Post Code"
              className="input-field border border-gray-300 p-3 h-8 mb-1 w-full rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
              required
            />
          </section>
          <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">

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
              Professional Skills
            </h3>



            <div className="space-y-3">
              {PROFESSIONAL_SKILL_OPTIONS.map((skill) => (
                <label
                  key={skill}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-purple-600 shrink-0"
                    checked={form.professionalSkill.includes(skill)}
                    onChange={() => handleprofessionalSkillChange(skill)}
                  />
                  <span className="leading-snug">{skill}</span>
                </label>
              ))}
            </div>

            {isOtherSelected && (
              <input
                type="text"
                placeholder="Please specify other professional skill"
                className="w-full mt-3 border border-gray-300 p-3 h-10 rounded-lg
               focus:ring-2 focus:ring-blue-300 focus:border-transparent
               transition-all"
                value={
                  form.professionalSkill.find((s: any) => s.startsWith("Other:"))?.replace("Other:", "") || ""
                }
                onChange={(e) => {
                  const value = e.target.value;

                  setForm((prev: any) => {
                    const withoutOldOther = prev.professionalSkill.filter(
                      (s: string) => !s.startsWith("Other:")
                    );

                    return {
                      ...prev,
                      professionalSkill: value
                        ? [...withoutOldOther, `Other:${value}`]
                        : withoutOldOther,
                    };
                  });
                }}
              />
            )}








          </section>

        <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">

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
              Home Assistance
            </h3>



            <div className="space-y-3">
              {Home_Assistance_Needs.map((skill) => (
                <label
                  key={skill}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-purple-600 shrink-0"
                    checked={form.HomeAssistance.includes(skill)}
                    onChange={() => handleHomeAssistanceChange(skill)}
                  />
                  <span className="leading-snug">{skill}</span>
                </label>
              ))}
            </div>


            {form.HomeAssistance.includes("Other") && (
              <input
                type="text"
                placeholder="Please specify other home assistance"
                className="w-full mt-4 border border-gray-300 p-3 h-10 rounded-lg
               focus:ring-2 focus:ring-blue-300 transition-all"
                value={
                  form.HomeAssistance.find((s: any) => s.startsWith("Other:"))
                    ?.replace("Other:", "")
                    .trim() || ""
                }
                onChange={(e) => {
                  const value = e.target.value;

                  setForm((prev: any) => {
                    const withoutCustom = prev.HomeAssistance.filter(
                      (s: string) => !s.startsWith("Other:")
                    );

                    return {
                      ...prev,
                      HomeAssistance: value
                        ? [...withoutCustom, `Other: ${value}`]
                        : withoutCustom,
                    };
                  });
                }}
              />
            )}


          </section>

          <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">


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
              Patient Types You Handled
            </h3>

            <div className="space-y-3">
              {PatientTypes.map((skill: string) => (
                <label
                  key={skill}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-purple-600 shrink-0"
                    checked={form.HandledSkills.includes(skill)}
                    onChange={() => UpdateHandledSkills(skill)}
                  />
                  <span className="leading-snug">{skill}</span>
                </label>
              ))}
            </div>

            {form.HandledSkills.includes("Other") && (
              <input
                type="text"
                placeholder="Please specify other patient type"
                className="w-full mt-4 border border-gray-300 p-3 h-10 rounded-lg
                 focus:ring-2 focus:ring-blue-300 transition-all"
                value={
                  form.HandledSkills.find((s: any) => s.startsWith("Other:"))
                    ?.replace("Other:", "")
                    .trim() || ""
                }
                onChange={(e) => {
                  const value = e.target.value;

                  setForm((prev: any) => {
                    const withoutCustom = prev.HandledSkills.filter(
                      (s: string) => !s.startsWith("Other:")
                    );

                    return {
                      ...prev,
                      HandledSkills: value
                        ? [...withoutCustom, `Other: ${value}`]
                        : withoutCustom,
                    };
                  });
                }}
              />
            )}

          </section>


       
      
            <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">
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
              Education & Professional Qualification
            </h3>

            {CurrentUserType === "HCA" ? <div className="space-y-5">


            <select
  name="higherEducation"
  value={isOtherhigherEducation?'Other':form.higherEducation || ''}
  onChange={(e) => {
                            const value = e.target.value;
                            setForm({ ...form, higherEducation: (value==="Other"||value==="Diploma")?"Other":value });
                           setisOtherhigherEducation ((value==="Other"||value==="Diploma"))
                          }}
  className="
    input-field w-full
    border border-gray-300
    p-2 h-10
    rounded-lg
    bg-white
    text-sm text-gray-700
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent
    transition-all
  "
>
  <option value="" disabled>
    Select Higher Education
  </option>

  {EducationLevels.map((edu:any) => (
    <option key={edu} value={edu}>
      {edu}
    </option>
  ))}
</select>
{isOtherhigherEducation&&
  <input
    type="text"
    name="higherEducation"
    placeholder="Enter higherEducation Qualification"
    onChange={(e) =>
      handleChange({
        target: {
          name: 'higherEducation',
          value: e.target.value,
        },
      } as any)
    }
    className="
      input-field w-full mt-2
      border border-gray-300
      p-3 h-10
      rounded-lg
      focus:ring-2 focus:ring-blue-300
      focus:border-transparent
      transition-all
    "
  />}



            <select
  name="professionalEducation"
   value={isOtherProfetionalEducation? 'Other': form.professionalEducation || ''}
   

                onChange={(e) => {
                  const value = e.target.value;
                  setForm({ ...form, professionalEducation: value });
                  setIsOtherProfetionalEducation(value === 'Other')
                }}
  className="
    input-field w-full
    border border-gray-300
    p-2 h-10
    rounded-lg
    bg-white
    text-sm text-gray-700
    focus:ring-2 focus:ring-blue-300
    focus:border-transparent
    transition-all
  "
>
  <option value="" disabled>
    Select Professional Qualification
  </option>
  <option value="General Duty Assistant (GDA)">
    General Duty Assistant (GDA)
  </option>
  <option value="Other">Other</option>
</select>
{isOtherProfetionalEducation&&
  <input
    type="text"
    name="professionalEducation"
    placeholder="Enter Professional Qualification"
    onChange={(e) =>
      handleChange({
        target: {
          name: 'professionalEducation',
          value: e.target.value,
        },
      } as any)
    }
    className="
      input-field w-full mt-2
      border border-gray-300
      p-3 h-10
      rounded-lg
      focus:ring-2 focus:ring-blue-300
      focus:border-transparent
      transition-all
    "
  />}



             <div className="space-y-3">

 <select
    name="OngoingStudy"
    value={isOtherOngoingEducation?"Other":form.OngoingStudy||''}
    
    onChange={(e) => {
      const value = e.target.value;
       
      setForm({
        ...form,
        OngoingStudy: value === "Other" ? "" : value,
      });
       setIsOtherOngoingEducation(value === 'Other')
    }}
    className="
      input-field w-full
      border border-gray-300
      p-2 h-10
      rounded-lg
      bg-white
      text-sm text-gray-700
      focus:ring-2 focus:ring-blue-300
      focus:border-transparent
      transition-all
    "
  >
    <option value="" disabled>
      Select Ongoing Study
    </option>
    <option value="ANM">ANM</option>
    <option value="GNM">GNM</option>
    <option value="BSc (Nursing)">BSc (Nursing)</option>
    <option value="Other">Other</option>
  </select>
  {isOtherOngoingEducation&&
<input
      type="text"
      placeholder="Please specify ongoing study"
      value={form.OngoingStudy}
      onChange={(e) =>
        setForm({ ...form, OngoingStudy: e.target.value })
      }
      className="
        input-field w-full
        border border-gray-300
        p-3 h-10
        rounded-lg
        text-sm
        focus:ring-2 focus:ring-blue-300
        focus:border-transparent
        transition-all
      "
      autoFocus
    />}
 
</div>




            </div> :
              <div className="space-y-5">
                <div>
                  <input
                    type="text"
                    name="higherEducation"
                    value={form.higherEducation || ''}
                    onChange={handleChange}
                    placeholder="Higher Education (e.g., MBBS, MD)"
                    className="input-field w-full mb-3 h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="number"
                      name="higherEducationYearStart"
                      value={form.higherEducationYearStart || ''}
                      onChange={handleChange}
                      placeholder="Higher Ed. Year Start"
                      className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                      
                    />
                    <input
                      type="number"
                      name="higherEducationYearEnd"
                      value={form.higherEducationYearEnd || ''}
                      onChange={handleChange}
                      placeholder="Higher Ed. Year End"
                      className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                      
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name="professionalEducation"
                    value={form.professionalEducation || ''}
                    onChange={handleChange}
                    placeholder="Professional Education (e.g., Fellowship)"
                    className="input-field w-full mb-3 border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="number"
                      name="professionalEducationYearStart"
                      value={form.professionalEducationYearStart || ''}
                      onChange={handleChange}
                      placeholder="Professional Ed. Year Start"
                      className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                      
                    />
                    <input
                      type="number"
                      name="professionalEducationYearEnd"
                      value={form.professionalEducationYearEnd || ''}
                      onChange={handleChange}
                      placeholder="Professional Ed. Year End"
                      className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                      
                    />
                  </div>
                </div>
                <input
                  type="text"
                  name="registrationCouncil"
                  value={form.registrationCouncil || ''}
                  onChange={handleChange}
                  placeholder="Registration Council"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  
                />
                <input
                  type="text"
                  name="registrationNo"
                  value={form.registrationNo || ''}
                  onChange={handleChange}
                  placeholder="Registration No."
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  
                />

                <input
                  type="text"
                  name="certifiedBy"
                  value={form.certifiedBy || ''}
                  onChange={handleChange}
                  placeholder="Certified By (e.g., Medical Council of India)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  
                />
                <input
                  type="text"
                  name="professionalWork1"
                  value={form.professionalWork1 || ''}
                  onChange={handleChange}
                  placeholder="Professional Work 1 (e.g., Sr. Consultant, AIIMS)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  
                />
                <input
                  type="text"
                  name="professionalWork2"
                  value={form.professionalWork2 || ''}
                  onChange={handleChange}
                  placeholder="Professional Work 2 (Optional)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                />
                <input
                  type="number"
                  name="experience"
                  value={form.experience || ''}
                  onChange={handleChange}
                  placeholder="Experience in Years"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  
                />
              </div>}
          </section>

       <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">

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
                        onChange={() =>{setaddedheight(null); handleHeightChange("height", h)}}
                        className="mr-2 accent-purple-600"
                      />
                      {h} ft
                    </label>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 items-center justify-center">
                 {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((each, index) => {
  const isActive = addedheight === each;

  return (
    <button
      type="button"
      key={index}
      onClick={() => {
        setaddedheight(each);
        const current = parseFloat(form.height || "0") || 0;
        handleHeightChange("height", (current + each).toFixed(1));
      }}
      className={`
        mt-3 px-2 py-1 text-[10px] sm:text-xs rounded-md
        transition-all duration-200

        ${
          isActive
            ? "bg-white text-blue-600 border-2 border-blue-600 shadow-sm"
            : "bg-gray-500 text-white border border-transparent hover:bg-gray-600"
        }
      `}
    >
      +{each} ft
    </button>
  );
})}

                  {form.height && (
                    <p className="mt-3 bg-pink-400 p-2 text-white rounded-md text-xs sm:text-sm text-center">
                      {form.height}ft {CurrentUserType} Height
                    </p>
                  )}
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
  <label className="text-sm font-medium text-gray-600">
    Height
  </label>

  <select
    value={heightInCm || ""}
    onChange={(e) => handleHeightFromCm(e.target.value)}
    className="w-40 px-3 py-2 border border-gray-300 rounded-md
               focus:ring-2 focus:ring-teal-400 focus:outline-none text-sm"
  >
    <option value="">Select height (cm)</option>

    {HEIGHT_OPTIONS.map((cm:any) => (
      <option key={cm} value={cm}>
        {cm} cm ({(cm / 30.48).toFixed(1)} ft)
      </option>
    ))}
  </select>

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
                  {["30", "40", "50", "60", "70", "80", "90", "100", "110", "120", "120+"].map((w) => (
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
                        onChange={() =>{setaddingWeight(null); handleHeightChange("weight", w)}}
                        className="mr-2 accent-purple-600"
                      />
                      {w} kg
                    </label>
                  ))}
                </div>

                {form.weight !== "<40" && form.weight !== "120+" && (
                  <div className="flex flex-wrap gap-2 items-center justify-center">
  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((each: number) => {
    const isActiveWeight = addingWeight === each;

    return (
      <button
        type="button"
        key={each}
        onClick={() => {
          setaddingWeight(each);
          const current = parseInt(form.weight || "0", 10) || 0;
          handleHeightChange("weight", String(current + each));
        }}
        className={`
          mt-3 px-2 py-1 text-[10px] sm:text-xs rounded-md
          transition-all duration-200

          ${
            isActiveWeight
              ? "bg-white text-blue-600 border-2 border-blue-600 shadow-sm"
              : "bg-gray-500 text-white border border-transparent hover:bg-gray-600"
          }
        `}
      >
        + {each} kg
      </button>
    );
  })}
</div>

                )}

                {form.weight && (
                  <div className="flex justify-center">
                    <p className="mt-3 w-[200px] text-center bg-pink-400 p-2 text-white rounded-md text-xs sm:text-sm">
                      {form.weight} {CurrentUserType}  Weight (kg)
                    </p>
                  </div>
                )}
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:col-span-3">
               <select
  name="hairColour"
  value={form.hairColour || ""}
 onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, hairColour: value==="Other"?'':value });
                    setisOtherHairColour (value === 'Other')
                   
                      
                  }}
  className="border border-gray-300 p-2 h-10 rounded-lg
             focus:ring-2 focus:ring-blue-300
             focus:border-transparent transition-all bg-white"
>
  <option value="">Select Hair Colour</option>

  <option value="Black">Black</option>
  <option value="Dark Brown">Dark Brown</option>
  <option value="Brown">Brown</option>
  <option value="Light Brown">Light Brown</option>
  <option value="Grey">Grey</option>
  <option value="White">White</option>
  <option value="Salt & Pepper">Salt & Pepper</option>
  <option value="Dyed">Dyed (Henna / Colour)</option>
  <option value="Bald">Bald</option>
   <option value="Other">Other</option>
</select>

{isOtherHairColour&&<input
      type="text"
      name="anyDeformityOther"
      placeholder="Please specify Other"
      className="w-full border border-gray-300 p-2 h-11 rounded-lg
                 focus:ring-2 focus:ring-blue-300 focus:border-transparent
                 transition-all"
      onChange={(e) =>
        setForm((prev: any) => ({
          ...prev,
          hairColour: `Other: ${e.target.value}`,
        }))
      }
    />}

               <select
  name="eyeColour"
  value={form?.eyeColour ?? ""}
  onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, eyeColour: value==="Other"?'':value });
                    setisOtherEyeColour (value === 'Other')
                   
                      
                  }}
  className="border border-gray-300 p-2 h-10 rounded-lg
             focus:ring-2 focus:ring-blue-300 focus:border-transparent
             transition-all bg-white"
>
  <option value="">Select Eye Colour</option>

  {[
    "Black",
    "Dark Brown",
    "Brown",
    "Light Brown",
    "Hazel",
    "Amber",
    "Grey",
    "Green",
    "Other"
  ].map((colour) => (
    <option key={colour} value={colour}>
      {colour}
    </option>
  ))}
</select>

{isOtherEyeColour&&<input
      type="text"
      name="anyDeformityOther"
      placeholder="Please specify Other"
      className="w-full border border-gray-300 p-2 h-11 rounded-lg
                 focus:ring-2 focus:ring-blue-300 focus:border-transparent
                 transition-all"
      onChange={(e) =>
        setForm((prev: any) => ({
          ...prev,
          eyeColour: `Other: ${e.target.value}`,
        }))
      }
    />}

                <select
                  name="complexion"
                  value={form?.complexion ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, complexion: value === "Other" ? '' : value });
                    setisOtherComplexion(value === 'Other')


                  }}
                  className="border border-gray-300 p-2 h-10 rounded-lg
             focus:ring-2 focus:ring-blue-300 focus:border-transparent
             transition-all bg-white"
                >
                  <option value="">Select Complexion</option>

                  {[
                    "Very Fair",
                    "Fair",
                    "Wheatish",
                    "Medium",
                    "Dusky",
                    "Dark",
                    "Other"
                  ].map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>

                {isOtherComplexion && <input
                  type="text"
                  name="anyDeformityOther"
                  placeholder="Please specify Other"
                  className="w-full border border-gray-300 p-2 h-11 rounded-lg
                 focus:ring-2 focus:ring-blue-300 focus:border-transparent
                 transition-all"
                  onChange={(e) =>
                    setForm((prev: any) => ({
                      ...prev,
                      complexion: `Other: ${e.target.value}`,
                    }))
                  }
                />}

                <div className="space-y-3">


  <select
    name="anyDeformity"
    value={form.anyDeformity || "Select Deformity"}
  

       onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, anyDeformity: value==="Other"?'':value });
                    setOtherDeformity (value === 'Other')
                   
                      
                  }}
    className="border border-gray-300 p-2 h-10 w-full rounded-lg
             focus:ring-2 focus:ring-blue-300 focus:border-transparent
             transition-all bg-white"
  >
    <option value="Not Selected">Select Deformity</option>
    <option value="None">None</option>
    <option value="Other">Other</option>
  </select>
  {OtherDeformity&&<input
      type="text"
      name="anyDeformityOther"
      placeholder="Please specify Other"
      className="w-full border border-gray-300 p-2 h-11 rounded-lg
                 focus:ring-2 focus:ring-blue-300 focus:border-transparent
                 transition-all"
      onChange={(e) =>
        setForm((prev: any) => ({
          ...prev,
          anyDeformity: `Other: ${e.target.value}`,
        }))
      }
    />}


  
</div>

              
<select
  name="moleBodyMark1"
  value={form?.moleBodyMark1 ?? ""}
   onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, moleBodyMark1: value==="Other"?'':value });
                    setisOtherMoleOnBody1 (value === 'Other')
                   
                      
                  }}
  className="border border-gray-300 p-2 h-10 rounded-lg
             focus:ring-2 focus:ring-blue-300 focus:border-transparent
             transition-all bg-white"
>
  <option value="">Select Mole / Body Mark 1</option>

  {[
    "None",
    "Forehead",
    "Left Cheek",
    "Right Cheek",
    "Chin",
    "Nose",
    "Neck",
    "Left Hand",
    "Right Hand",
    "Left Arm",
    "Right Arm",
    "Left Leg",
    "Right Leg",
    "Back",
    "Chest",
    "Abdomen",
    "Other"
  ].map((mark) => (
    <option key={mark} value={mark}>
      {mark}
    </option>
  ))}
</select>
{isOtherMoleOnBody1&& (
    <input
      type="text"
      name="anyDeformityOther"
      placeholder="Please specify Other"
      className="w-full border border-gray-300 p-2 h-11 rounded-lg
                 focus:ring-2 focus:ring-blue-300 focus:border-transparent
                 transition-all"
      onChange={(e) =>
        setForm((prev: any) => ({
          ...prev,
          moleBodyMark1: `Other: ${e.target.value}`,
        }))
      }
    />
  )}


<select
  name="moleBodyMark2"
  value={form?.moleBodyMark2 ?? ""}

         onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, moleBodyMark2: value==="Other"?'':value });
                    setisOtherMoleOnBody2 (value === 'Other')
                   
                      
                  }}
  className="border border-gray-300 p-2 h-10 rounded-lg
             focus:ring-2 focus:ring-blue-300 focus:border-transparent
             transition-all bg-white"
>
  <option value="">Select Mole / Body Mark 2 (Optional)</option>

  {[
    "None",
    "Forehead",
    "Left Cheek",
    "Right Cheek",
    "Chin",
    "Nose",
    "Neck",
    "Left Hand",
    "Right Hand",
    "Left Arm",
    "Right Arm",
    "Left Leg",
    "Right Leg",
    "Back",
    "Chest",
    "Abdomen",
    "Other"
  ].map((mark) => (
    <option key={mark} value={mark}>
      {mark}
    </option>
  ))}
</select>

 {isOtherMoleOnBody2&& (
    <input
      type="text"
      name="anyDeformityOther"
      placeholder="Please specify Other"
      className="w-full border border-gray-300 p-2 h-11 rounded-lg
                 focus:ring-2 focus:ring-blue-300 focus:border-transparent
                 transition-all"
      onChange={(e) =>
        setForm((prev: any) => ({
          ...prev,
          moleBodyMark2: `Other: ${e.target.value}`,
        }))
      }
    />
  )}

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

           
                <select
                  name="reportPreviousHealthProblems"
                  value={form?.reportPreviousHealthProblems ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, reportPreviousHealthProblems: value==="Other"?'':value });
                    setIsOtherPreviousHealthProblems (value === 'Other')
                   
                      
                  }}
                  className="w-full border border-gray-300 p-2 h-10 rounded-lg
             focus:ring-2 focus:ring-blue-300 focus:border-transparent
             transition-all bg-white"
                >
                  <option value="">Select Previous Health Issues</option>

                  {[
                    "None",
                    "fever",
                    "fits",
                    "Diabetes",
                    "Hypertension",
                    "Asthma",
                    "Thyroid Disorder",
                    "Heart Disease",
                    "Stroke History",
                    "Arthritis",
                    "Epilepsy",
                    "Chronic Kidney Disease",
                    "Chronic Liver Disease",
                    "Tuberculosis (Past)",
                    "COVID-19 (Past)",
                    "Other",
                  ].map((issue) => (
                    <option key={issue} value={issue}>
                      {issue}
                    </option>
                  ))}
                </select> 

{isOtherPreviousHealthProblems&&
                <input
                  name="reportPreviousHealthProblems"
                  value={form.reportPreviousHealthProblems || ""}
                  onChange={handleChange}
                  placeholder="Report Previous Health Problems"
                  className="resize-y  w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"

                />}
              {/* <textarea
                name="reportCurrentHealthProblems"
                value={form.reportCurrentHealthProblems || ""}
                onChange={handleChange}
                placeholder="Report Current Health Problems"
                className="resize-y h-20 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"

              /> */}

              <select
                  name="reportCurrentHealthProblems"
                  value={form?.reportCurrentHealthProblems ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, reportCurrentHealthProblems: value==="Other"?'':value });
                    setisOtherCurrentHealthProblems (value === 'Other')
                   
                      
                  }}
                  className="w-full border border-gray-300 p-2 h-10 rounded-lg
             focus:ring-2 focus:ring-blue-300 focus:border-transparent
             transition-all bg-white"
                >
                  <option value="">Select Current HealthProblems</option>

                  {[
                    "None",
                    "fever",
                    "fits",
                    "Diabetes",
                    "Hypertension",
                    "Asthma",
                    "Thyroid Disorder",
                    "Heart Disease",
                    "Stroke History",
                    "Arthritis",
                    "Epilepsy",
                    "Chronic Kidney Disease",
                    "Chronic Liver Disease",
                    "Tuberculosis (Past)",
                    "COVID-19 (Past)",
                    "Other",
                  ].map((issue) => (
                    <option key={issue} value={issue}>
                      {issue}
                    </option>
                  ))}
                </select> 

{isOtherCurrentHealthProblems&&
                <input
                  name="reportCurrentHealthProblems"
                  value={form.reportCurrentHealthProblems || ""}
                  onChange={handleChange}
                  placeholder="Report Current Health Problems"
                  className="resize-y  w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"

                />}
            </div>



          </section>



       
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
   

            <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">
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
            <div className=" md:flex flex-col ">
            <div className="flex flex-col gap-1 p-1">
  <label className="text-sm font-medium text-gray-600">
    Source of Referral
  </label>

  <select
    name="sourceOfReferral"
    value={form?.sourceOfReferral ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, sourceOfReferral: value === "Other" ? '' : value });
                    setIsOtherReferal(value === 'Other')


                  }}
    className="border border-gray-300 p-2 h-10 rounded-lg
               focus:ring-2 focus:ring-blue-300 focus:border-transparent
               transition-all bg-white"
  >
    <option value="">Select Source of Referral</option>

    {[...FilterdImportedVendorName,"Other"].map((source:any) => (
      <option key={source} value={source}>
        {source}
      </option>
    ))}
  </select>

  {IsOtherReferal&&
    <input
    id="sourceOfReferral"
    type="Text"
    name="sourceOfReferral"
    value={form?.sourceOfReferral ?? ""}
    placeholder='Enter Other Source Name'
    onChange={handleChange}
    className="border border-gray-300 p-3 h-10 mt-1 rounded-lg
               focus:ring-2 focus:ring-blue-300 focus:border-transparent
               transition-all"
  />}
  


</div>
<div className="flex flex-col gap-1 p-1">
  <label className="text-sm font-medium text-gray-600">
    Referral Source Type
  </label>

  
    <select
      name="referralSourceType"
      value={form?.referralSourceType ?? ""}
      onChange={(e) => {
        const value = e.target.value;

        setForm((prev: any) => ({
          ...prev,
          referralSourceType: value==="Other"?'':value,
        }));

      setIsOtherReferralSourceType(value==="Other")
      }}
      className="w-full border border-gray-300 p-2 h-10 rounded-lg
                 focus:ring-2 focus:ring-blue-300 focus:border-transparent
                 transition-all bg-white"
    >
      <option value="">Select Referral Source Type</option>

      {REFERRAL_SOURCE_TYPES.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  {isOtherReferralSourceType&&
    <input
      type="text"
      name="referralSourceType"
      value={form?.referralSourceType ?? ""}
      onChange={handleChange}
      placeholder="Specify referral source type"
      className="w-full mt-2 border border-gray-300 p-3 h-10 rounded-lg
                 focus:ring-2 focus:ring-blue-300 focus:border-transparent
                 transition-all"
    />}
  

 
</div>

             <div className="flex flex-col gap-1">
  <label
    htmlFor="dateOfReferral"
    className="text-sm font-medium text-gray-600"
  >
    Referral Date
  </label>

  <input
    id="dateOfReferral"
    type="date"
    name="dateOfReferral"
    value={form?.dateOfReferral ?? ""}
    onChange={handleChange}
    className="border border-gray-300 p-3 h-10 rounded-lg
               focus:ring-2 focus:ring-blue-300 focus:border-transparent
               transition-all"
  />
</div>

            </div>
            
          </section>

             <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">
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
    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
  />
</svg>

              Reference Details
            </h3>
            <div className="space-y-5 mt-5">
              <h4 className="text-md font-semibold text-gray-700">Reference 1:</h4>
              <input
                type="text"
                name="reference1Name"
                value={form.reference1Name || ''}
                onChange={handleChange}
                placeholder="Reference 1 Name"
                className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
             <div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-600">
    Reference 1 Aadhaar Number
  </label>

  <input
    type="text"
    name="reference1Aadhar"
    value={form?.reference1Aadhar ?? ""}
    inputMode="numeric"
    maxLength={12}
    placeholder="Enter 12-digit Aadhaar number"
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, ""); 

      setForm((prev: any) => ({
        ...prev,
        reference1Aadhar: value,
      }));
    }}
    className={`w-full border p-3 h-10 rounded-lg text-sm
      focus:ring-2 focus:border-transparent transition-all
      ${
        form.reference1Aadhar &&
        !isValidAadhaar(form.reference1Aadhar)
          ? "border-red-400 focus:ring-red-300"
          : "border-gray-300 focus:ring-blue-300"
      }
    `}
  />

  {form.reference1Aadhar &&
    !isValidAadhaar(form.reference1Aadhar) && (
      <p className="text-xs text-red-500 mt-1">
        Aadhaar number must be exactly 12 digits.
      </p>
    )}
</div>

             <div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-600">
    Reference 1 Mobile Number
  </label>

  <input
    type="tel"
    name="reference1Mobile"
    value={form?.reference1Mobile ?? ""}
    inputMode="numeric"
    maxLength={10}
    placeholder="Enter 10-digit mobile number"
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "");

      setForm((prev: any) => ({
        ...prev,
        reference1Mobile: value,
      }));
    }}
    className={`w-full border p-3 h-10 rounded-lg text-sm
      focus:ring-2 focus:border-transparent transition-all
      ${
        form.reference1Mobile &&
        !isValidIndianMobile(form.reference1Mobile)
          ? "border-red-400 focus:ring-red-300"
          : "border-gray-300 focus:ring-blue-300"
      }
    `}
    required
  />

  {form.reference1Mobile &&
    !isValidIndianMobile(form.reference1Mobile) && (
      <p className="text-xs text-red-500 mt-1">
        Enter a valid 10-digit Indian mobile number.
      </p>
    )}
</div>

              <textarea
                name="reference1Address"
                value={form.reference1Address || ''}
                onChange={handleChange}
                placeholder="Reference 1 Address"
                className="input-field resize-y h-18 w-full border border-gray-300 p-3  rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
              <input
                type="text"
                name="reference1Relationship"
                value={form.reference1Relationship || ''}
                onChange={handleChange}
                placeholder="Reference 1 Relationship"
                className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
            </div>
            <div className="space-y-5 mt-5">
              <h4 className="text-md font-semibold text-gray-700">Reference 2 (Optional):</h4>
              <input
                type="text"
                name="reference2Name"
                value={form.reference2Name || ''}
                onChange={handleChange}
                placeholder="Reference 2 Name"
                className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
             <div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-600">
    Reference 2 Aadhaar Number

  </label>

  <input
    type="text"
    name="reference2Aadhar"
    value={form?.reference2Aadhar ?? ""}
    inputMode="numeric"
    maxLength={12}
    placeholder="Enter 12-digit Aadhaar number"
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "");

      setForm((prev: any) => ({
        ...prev,
        reference2Aadhar: value,
      }));
    }}
    className={`w-full border p-3 h-10 rounded-lg text-sm
      focus:ring-2 focus:border-transparent transition-all
      ${
        form.reference2Aadhar &&
        !isValidAadhaar(form.reference2Aadhar)
          ? "border-red-400 focus:ring-red-300"
          : "border-gray-300 focus:ring-blue-300"
      }
    `}
  />

  {/* {form.reference2Aadhar &&
    !isValidAadhaar(form.reference2Aadhar) && (
      <p className="text-xs text-red-500 mt-1">
        Aadhaar number must be exactly 12 digits.
      </p>
    )} */}
    
</div>

            <div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-600">
    Reference 2 Mobile Number
   
  </label>

  <input
    type="tel"
    name="reference2Mobile"
    value={form?.reference2Mobile ?? ""}
    inputMode="numeric"
    maxLength={10}
    placeholder="Enter 10-digit mobile number"
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "");

      setForm((prev: any) => ({
        ...prev,
        reference2Mobile: value,
      }));
    }}
    className={`w-full border p-3 h-10 rounded-lg text-sm
      focus:ring-2 focus:border-transparent transition-all
      ${
        form.reference2Mobile &&
        !isValidIndianMobile(form.reference2Mobile)
          ? "border-red-400 focus:ring-red-300"
          : "border-gray-300 focus:ring-blue-300"
      }
    `}
  />

  {/* {form.reference2Mobile &&
    !isValidIndianMobile(form.reference2Mobile) && (
      <p className="text-xs text-red-500 mt-1">
        Enter a valid 10-digit Indian mobile number.
      </p>
    )} */}
</div>

              <textarea
                name="reference2Address"
                value={form.reference2Address || ''}
                onChange={handleChange}
                placeholder="Reference 2 Address"
                className="input-field resize-y h-18 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
            </div>
          </section>

  <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">
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
              <div className="flex flex-col gap-3">

  <div className="flex flex-wrap items-center gap-4">
    
    <label className="flex items-center gap-3 px-4 py-2 rounded-lg border 
                      bg-white cursor-pointer hover:border-blue-400
                      transition-all">
      <input
        type="checkbox"
        name="serviceHours12hrs"
        checked={form.serviceHours12hrs || false}
        onChange={handleChange}
        className="h-5 w-5 accent-blue-600"
      />
      <span className="text-sm font-medium text-gray-700">
        12-Hour Service
      </span>
    </label>

  
    <label className="flex items-center gap-3 px-4 py-2 rounded-lg border 
                      bg-white cursor-pointer hover:border-blue-400
                      transition-all">
      <input
        type="checkbox"
        name="serviceHours24hrs"
        checked={form.serviceHours24hrs || false}
        onChange={handleChange}
        className="h-5 w-5 accent-blue-600"
      />
      <span className="text-sm font-medium text-gray-700">
        24-Hour Service
      </span>
    </label>
  </div>

 
  {form.serviceHours12hrs && form.serviceHours24hrs && (
    <div className="inline-flex items-center gap-2 text-xs font-medium
                    text-blue-700 bg-blue-50 border border-blue-200
                    px-3 py-1 rounded-full w-fit">
      Both services selected
    </div>
  )}
</div>

              <input
                type="text"
                name="preferredService"
                value={form.preferredService || ''}
                onChange={handleChange}
                placeholder="Preferred Service (e.g., OPD, Home Visit)"
                className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
             <div className="flex flex-col gap-1">

  <input
    type="number"
    name="PaymentforStaff"
    value={form.PaymentforStaff || ''}
    onChange={handleChange}
    placeholder="Payment for Staff – Monthly (₹)"
    className="input-field w-full border border-gray-300 p-3 h-10 rounded-lg
               focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
  />

  
  {form.PaymentforStaff && Number(form.PaymentforStaff) > 0 && (
    <p className="text-xs text-gray-600">
      Per day amount:{" "}
      <span className="font-semibold text-green-600">
        ₹{Math.round(Number(form.PaymentforStaff) / 30)}
      </span>
    </p>
  )}

</div>

<div className="relative w-full">
  <label
    htmlFor="NotedDtaeForHike"
    className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600"
  >
    Joining Date
  </label>

  <input
    id="NotedDtaeForHike"
    type="date"
    name="NotedDtaeForHike"
    value={form?.NotedDtaeForHike ?? ""}
    onChange={handleChange}
    className="input-field w-full border border-gray-300 p-3 h-10 rounded-lg
               focus:ring-2 focus:ring-blue-300 focus:border-transparent
               transition-all"
    required
  />
</div>

              <div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-600">
    Account Holder Name
  </label>

  <input
    type="text"
    name="BankAccountHolderName"
    value={form?.BankAccountHolderName ?? ""}
    onChange={handleChange}
    placeholder="Enter account holder name"
    className="input-field w-full border border-gray-300 p-3 h-10 rounded-lg
               focus:ring-2 focus:ring-blue-300 focus:border-transparent
               transition-all"
  />

  <p className="text-xs text-gray-500 leading-snug mt-1">
    <strong>Note:</strong> Name should be exactly as mentioned in the bank
    passbook. This will be used for payment processing.
  </p>
</div>

              <input
                type="text"
                name="paymentBankAccountNumber"
                value={form.paymentBankAccountNumber || ''}
                onChange={handleChange}
                placeholder="Bank Account Number"
                className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
             <select
  name="BankName"
   value={OtherBankName ? "Other" : form.BankName || ""}
   onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, BankName: value === "Other" ? '' : value });
                setOtherBankName(value === 'Other')


              }}


                 
  className="input-field w-full border border-gray-300 p-2 h-10 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
>
  <option value="" disabled>
    Select Bank 
  </option>

  {popularBanksInIndia.map((Bank) => (
    <option key={Bank} value={Bank}>
      {Bank}
    </option>
  ))}
</select>

{OtherBankName&&
 <input
                type="text"
                name="BankName"
                value={form.BankName ?? ''}
                onChange={handleChange}
                placeholder="Specify Your Bank"
                className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
}
              <input
                type="text"
                name="ifscCode"
                value={form.ifscCode.toUpperCase() || ''}
                onChange={handleChange}
                placeholder="IFSC Code"
                className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
              <textarea
                name="bankBranchAddress"
                value={form.bankBranchAddress || ''}
                onChange={handleChange}
                placeholder="Bank Branch Address"
                className="input-field resize-y h-18 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
              <input
                type="text"
                name="Bankbranchname"
                value={form.Bankbranchname || ''}
                onChange={handleChange}
                placeholder="Bank Branch Name"
                className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
              <input
                type="text"
                name="Branchcity"
                value={form.Branchcity || ''}
                onChange={handleChange}
                placeholder="Branch City"
                className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
             <select
  name="Branchstate"
  value={form.Branchstate || ""}
  onChange={handleChange}
  className="input-field w-full border border-gray-300 p-2 h-10 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
>
  <option value="" disabled>
    Select Branch State
  </option>

  {IndianStates.map((state) => (
    <option key={state} value={state}>
      {state}
    </option>
  ))}
</select>
              <input
                type="text"
                name="Branchpincode"
                value={form.Branchpincode || ''}
                onChange={handleChange}
                placeholder="Branch Pincode"
                className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                
              />
            </div>
          </section>

       
        <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">

         
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

           

{CurrentUserType==="HCN"&&
<div className="w-full">
<div className="w-[200px] flex  flex-col gap-1">
  <label className="text-sm font-medium text-gray-600">
    Nurse Type
  </label>

  <select
    name="type"
    value={form?.type ?? ""}
    onChange={handleChange}
    className="w-full border border-gray-300 p-3 rounded-lg text-sm
               focus:ring-2 focus:ring-blue-300 focus:border-transparent
               transition-all bg-white"
  >
    <option value="">Select Nurse Type</option>

    {NURSE_TYPES.map((nurseType) => (
      <option key={nurseType} value={nurseType}>
        {nurseType}
      </option>
    ))}
  </select>
</div>


           <div className="w-[200px] flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-600">
    Nurse Specialty
  </label>

  <select
    name="specialties"
    value={form?.specialties ?? ""}
    onChange={handleChange}
    className="w-full border border-gray-300 p-3 rounded-lg text-sm
               focus:ring-2 focus:ring-blue-300 focus:border-transparent
               transition-all bg-white"
  >
    <option value="">Select Nurse Specialty</option>

    {NURSE_SPECIALTIES.map((specialty) => (
      <option key={specialty} value={specialty}>
        {specialty}
      </option>
    ))}
  </select>
</div>

</div>}
             

           
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
            ${form.ConfirmPassword &&
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
                  className={`text-xs font-medium ${form.ConfirmPassword === password ? "text-green-600" : "text-red-500"
                    }`}
                >
                  {form.ConfirmPassword === password
                    ? "Passwords match"
                    : "Passwords do not match"}
                </p>
              )}
            </div>
          

         
            <div className="w-full">
  <label className="block text-xs font-semibold text-gray-600 mb-1">
    Add Remarks
  </label>

  <textarea
    rows={4}
    placeholder="Enter remarks or additional notes..."
    name='Remarks'
    onChange={handleChange}
    value={form.Remarks}
    className="
      w-full
      rounded-xl
      border border-gray-300
      px-4 py-3
      text-sm text-gray-800
      placeholder-gray-400
      resize-none
      focus:outline-none
      focus:ring-2 focus:ring-indigo-500
      focus:border-transparent
      transition-all
    "
  />
</div>

         
        </section>

       <section className="w-full p-4 mt-2 rounded-xl shadow-md border border-gray-300 bg-white">
          <h3 className="text-lg md:text-xl font-semibold text-[#ff1493] mb-4 border-b border-blue-300 pb-2">
              Your Documents
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-items-center">
              {['AadharCard', 'PanCard', 'Certificate One', 'Certificate Two', 'Account Pass Book', 'BVR','HCP form'].map((docKey) => (
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
                    {docKey.replace('Card', ' Card').replace('Book', ' Book').trim() }
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
 </div>
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