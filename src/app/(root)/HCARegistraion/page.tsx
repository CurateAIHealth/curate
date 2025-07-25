'use client';

import HCAMobileView from '@/Components/HCAMobileView/page';
import { GetUserInformation, PostFullRegistration } from '@/Lib/user.action';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';


const DEFAULT_PROFILE_PIC = '/Icons/DefaultProfileIcon.png';
const DEFAULT_DOCUMENT_ICON = '/Icons/DefaultDocumentIcon.png';

export default function DoctorProfileForm() {
  const [ProfileName, SetProfileName] = useState('');
  const [PictureUploading, setPictureUploading] = useState(false);
  const [UpdateingStatus, SetUpdateingStatus] = useState(true);
  const [UpdatedStatusMessage, setUpdatedStatusMessage] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [Docs, setDocs] = useState({
    ProfilePic: DEFAULT_PROFILE_PIC,
    PanCard: '',
    AdharCard: '',
    AccountPassBook: '',
    CertificatOne: '',
    CertificatTwo: '',
    VideoFile:''
  });
  const [form, setForm] = useState({
    title: '',
    firstName: '',
    surname: '',
    fatherName: '',
    motherName: '',
    husbandName: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    emailId: '',
    mobileNumber: '',

    aadharCardNo: '',
    panNumber: '',
    voterIdNo: '',
    rationCardNo: '',
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
    certifiedBy: '',
    professionalWork1: '',
    professionalWork2: '',
    experience: '',

    height: '',
    weight: '',
    hairColour: '',
    eyeColour: '',
    complexion: '',
    anyDeformity: '',
    moleBodyMark1: '',
    moleBodyMark2: '',

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

    serviceHours12hrs: false,
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
    website: '',
  });

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

  useEffect(() => {
    const Fetch = async () => {
      try {
        const localValue = localStorage.getItem('UserId');
        if (!localValue) {
          console.warn('No UserId found in localStorage.');
          return;
        }

        const ProfileInformation = await GetUserInformation(localValue);

        SetProfileName(ProfileInformation.FirstName);
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
          title: ProfileInformation.Title || '',
          firstName: ProfileInformation.FirstName,
          surname: ProfileInformation.LastName,
          fatherName: ProfileInformation.FatherName || '',
          motherName: ProfileInformation.MotherName || '',
          husbandName: ProfileInformation.HusbandName || '',
          gender: ProfileInformation.Gender,
          dateOfBirth: ProfileInformation.DateOfBirth,
          maritalStatus: ProfileInformation.MaritalStatus || '',
          emailId: ProfileInformation.Email,
          mobileNumber: ProfileInformation.ContactNumber,
          aadharCardNo: ProfileInformation.AadharNumber,
          panNumber: ProfileInformation.PanNumber || '',
          voterIdNo: ProfileInformation.VoterIdNo || '',
          rationCardNo: ProfileInformation.RationCardNo || '',
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
          professionalSkill: ProfileInformation.ProfessionalSkill || '',
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
          website: ProfileInformation.Website || '',
        }));
      } catch (err: any) {
        setIsChecking(false)
        console.error('Error fetching user information:', err);
      }
    };
    Fetch();
  }, []);

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

        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      SetUpdateingStatus(false);

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


      if (completion !== 100) {
        alert('Please complete all required fields to update your profile!');
        SetUpdateingStatus(true);
        return;
      }

      if (Object.values(Docs).some((each) => each === '')) {
        alert("Upload all the Required Documents along with Video!")
        SetUpdateingStatus(true);
        return
      }
      const localValue = localStorage.getItem('UserId');
      const FinelForm = { ...form, Documents: Docs,UserId:localValue };

      setUpdatedStatusMessage('Successfully Updated Your Information.');
      SetUpdateingStatus(true);
      const PostResult = await PostFullRegistration(FinelForm)
      console.log("Result---", PostResult)
    },
    [form, completion, Docs]
  );
 if (isChecking) {
    return (
      <div className='h-screen flex items-center justify-center font-bold'>
      Please wait while we load your profile...
      </div>
    );
  }

  return (
    <div>
      <div className="hidden md:flex md:min-h-[86.5vh] md:h-[86.5vh] bg-white flex-col items-center justify-center overflow-hidden">
        <div className="md:w-full bg-[#50c896] text-white flex gap-6 justify-between items-center p-2">


          <div className='flex flex-col  items-center justify-center text-center'>
            <img
              src={Docs.ProfilePic}
              alt="Profile"
              className="w-20 h-20 hover:w-40 hover:h-40 object-cover rounded-full border-4 border-white shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_PROFILE_PIC;
              }}
            />
            <label
              htmlFor="ProfilePic"
              className="cursor-pointer mt-1 inline-block text-[10px] font-medium text-white bg-[#50c896] hover:bg-[#43a07c] px-5 py-2 rounded-full transition-colors duration-300 shadow"
            >
              {Docs.ProfilePic && Docs.ProfilePic !== DEFAULT_PROFILE_PIC
                ? 'Update Profile Picture'
                : 'Upload Profile Picture'}
            </label>
            <input
              id="ProfilePic"
              name="ProfilePic"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              required
            />
          </div>

          <div>
            <h2 className="text-4xl font-extrabold text-white bg-[#50c896]  mb-6 text-center">{ProfileName}'s Profile</h2>

            <p className="text-gray-600 text-center mb-8">
              Fill in the details below to keep your profile accurate and up-to-date.
            </p>
             <p className={`text-sm text-center font-semibold ${UpdatedStatusMessage!=="Successfully Updated Your Information."?"text-green-800":"text-red-500"} mt-2`}>{UpdatedStatusMessage}</p>
          </div>
          <div className="flex flex-col  items-center justify-center text-center  ">
            <svg className="w-18 h-18 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="gray"
                strokeWidth="8"
                fill="transparent"
                className="opacity-30"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#fde047"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="282.78"
                strokeDashoffset={`${282.78 - (282.78 * completion) / 100}`}
                className="transition-all duration-700 ease-out"
                strokeLinecap="round"
              />
              <text
                x="50"
                y="55"
                textAnchor="middle"
                fill="white"
                fontSize="20px"
                fontWeight="bold"
                dominantBaseline="middle"
                transform="rotate(90, 50, 55)"
              >
                {completion}%
              </text>
            </svg>
            <p className="text-sm text-gray-700 mt-2">Profile Completion</p>
          </div>


        </div>


        <form
          onSubmit={handleSubmit}
          className="md:w-full p-8 space-y-8 overflow-y-auto custom-scrollbar h-full"
        >

          <div className='md:flex  justify-center gap-2'>
            <section className="md:w-1/2 bg-blue-50 pl-4 mt-2 p-2 rounded-xl shadow-md">

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
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title (e.g., Dr., Mr.)"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="surname"
                  value={form.surname}
                  onChange={handleChange}
                  placeholder="Surname"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="fatherName"
                  value={form.fatherName}
                  onChange={handleChange}
                  placeholder="Father's Name"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="motherName"
                  value={form.motherName}
                  onChange={handleChange}
                  placeholder="Mother's Name"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="husbandName"
                  value={form.husbandName}
                  onChange={handleChange}
                  placeholder="Husband's Name"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                />
                <select
                  name="gender"
                  value={form.gender}
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
                    value={form.dateOfBirth}
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
                  value={form.maritalStatus}
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
                  value={form.emailId}
                  onChange={handleChange}
                  placeholder="Email ID"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="tel"
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              </div>
            </section>


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
                  value={form.aadharCardNo}
                  onChange={handleChange}
                  placeholder="Aadhar Card No."
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="panNumber"
                  value={form.panNumber}
                  onChange={handleChange}
                  placeholder="PAN Number"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="voterIdNo"
                  value={form.voterIdNo}
                  onChange={handleChange}
                  placeholder="Voter ID No."
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="rationCardNo"
                  value={form.rationCardNo}
                  onChange={handleChange}
                  placeholder="Ration Card No."
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              </div>
              <textarea
                name="permanentAddress"
                value={form.permanentAddress}
                onChange={handleChange}
                placeholder="Permanent Address (Per GOVT ID)"
                className="input-field resize-y h-18 border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all mb-5"
                required
              />
              <input
                type="text"
                name="cityPostcodePermanent"
                value={form.cityPostcodePermanent}
                onChange={handleChange}
                placeholder="City & Postcode (Permanent)"
                className="input-field border border-gray-300 p-3 h-8 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all mb-5"
                required
              />
              <textarea
                name="currentAddress"
                value={form.currentAddress}
                onChange={handleChange}
                placeholder="Current Address"
                className="input-field resize-y h-18 border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all mb-5"
                required
              />
              <input
                type="text"
                name="cityPostcodeCurrent"
                value={form.cityPostcodeCurrent}
                onChange={handleChange}
                placeholder="City & Postcode (Current)"
                className="input-field border border-gray-300 p-3 h-8 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                required
              />
            </section>

          </div>
          <div className='md:flex  justify-center gap-2'>
            <section className="md:w-1/2 bg-blue-50 p-2 rounded-xl shadow-md">
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
              <div className="space-y-5">
                <div>
                  <input
                    type="text"
                    name="higherEducation"
                    value={form.higherEducation}
                    onChange={handleChange}
                    placeholder="Higher Education (e.g., MBBS, MD)"
                    className="input-field w-full mb-3 h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="number"
                      name="higherEducationYearStart"
                      value={form.higherEducationYearStart}
                      onChange={handleChange}
                      placeholder="Higher Ed. Year Start"
                      className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                      required
                    />
                    <input
                      type="number"
                      name="higherEducationYearEnd"
                      value={form.higherEducationYearEnd}
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
                    value={form.professionalEducation}
                    onChange={handleChange}
                    placeholder="Professional Education (e.g., Fellowship)"
                    className="input-field w-full mb-3 border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="number"
                      name="professionalEducationYearStart"
                      value={form.professionalEducationYearStart}
                      onChange={handleChange}
                      placeholder="Professional Ed. Year Start"
                      className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                      required
                    />
                    <input
                      type="number"
                      name="professionalEducationYearEnd"
                      value={form.professionalEducationYearEnd}
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
                  value={form.registrationCouncil}
                  onChange={handleChange}
                  placeholder="Registration Council"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="registrationNo"
                  value={form.registrationNo}
                  onChange={handleChange}
                  placeholder="Registration No."
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <textarea
                  name="professionalSkill"
                  value={form.professionalSkill}
                  onChange={handleChange}
                  placeholder="Professional Skill (e.g., Surgery, Diagnosis)"
                  className="input-field resize-y h-18 w-full border border-gray-300 p-3  rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="certifiedBy"
                  value={form.certifiedBy}
                  onChange={handleChange}
                  placeholder="Certified By (e.g., Medical Council of India)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="professionalWork1"
                  value={form.professionalWork1}
                  onChange={handleChange}
                  placeholder="Professional Work 1 (e.g., Sr. Consultant, AIIMS)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="professionalWork2"
                  value={form.professionalWork2}
                  onChange={handleChange}
                  placeholder="Professional Work 2 (Optional)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                />
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Experience in Years"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              </div>
            </section>


            <section className="md:w-1/2 bg-blue-50 p-2 rounded-xl shadow-md">
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
                <input
                  type="text"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  placeholder="Height (e.g., 5'8&quot; or 173cm)"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="Weight (e.g., 70kg)"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="hairColour"
                  value={form.hairColour}
                  onChange={handleChange}
                  placeholder="Hair Colour"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="eyeColour"
                  value={form.eyeColour}
                  onChange={handleChange}
                  placeholder="Eye Colour"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="complexion"
                  value={form.complexion}
                  onChange={handleChange}
                  placeholder="Complexion"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="anyDeformity"
                  value={form.anyDeformity}
                  onChange={handleChange}
                  placeholder="Any Deformity (if any)"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  name="moleBodyMark1"
                  value={form.moleBodyMark1}
                  onChange={handleChange}
                  placeholder="Mole/Body Mark 1"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  name="moleBodyMark2"
                  value={form.moleBodyMark2}
                  onChange={handleChange}
                  placeholder="Mole/Body Mark 2 (Optional)"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                />

              </div>
              <h3 className="text-md font-semibold text-[#ff1493] mb-5 mt-2  pb-3 border-b border-blue-200 flex items-center">
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

            <section className=" md:w-1/2 bg-blue-50 p-3 rounded-xl shadow-md">
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
                  value={form.sourceOfReferral}
                  onChange={handleChange}
                  placeholder="Source of Referral"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="date"
                  name="dateOfReferral"
                  value={form.dateOfReferral}
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
                  value={form.reference1Name}
                  onChange={handleChange}
                  placeholder="Reference 1 Name"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="reference1Aadhar"
                  value={form.reference1Aadhar}
                  onChange={handleChange}
                  placeholder="Reference 1 Aadhar No."
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="tel"
                  name="reference1Mobile"
                  value={form.reference1Mobile}
                  onChange={handleChange}
                  placeholder="Reference 1 Mobile"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <textarea
                  name="reference1Address"
                  value={form.reference1Address}
                  onChange={handleChange}
                  placeholder="Reference 1 Address"
                  className="input-field resize-y h-18 w-full border border-gray-300 p-3  rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="reference1Relationship"
                  value={form.reference1Relationship}
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
                  value={form.reference2Name}
                  onChange={handleChange}
                  placeholder="Reference 2 Name"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="reference2Aadhar"
                  value={form.reference2Aadhar}
                  onChange={handleChange}
                  placeholder="Reference 2 Aadhar No."
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="tel"
                  name="reference2Mobile"
                  value={form.reference2Mobile}
                  onChange={handleChange}
                  placeholder="Reference 2 Mobile"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <textarea
                  name="reference2Address"
                  value={form.reference2Address}
                  onChange={handleChange}
                  placeholder="Reference 2 Address"
                  className="input-field resize-y h-18 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              </div>
            </section>


            <section className="md:w-1/2 bg-blue-50 p-3 rounded-xl shadow-md">
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
                      checked={form.serviceHours12hrs}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-gray-700">12 Hours Service</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="serviceHours24hrs"
                      checked={form.serviceHours24hrs}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-gray-700">24 Hours Service</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="preferredService"
                  value={form.preferredService}
                  onChange={handleChange}
                  placeholder="Preferred Service (e.g., OPD, Home Visit)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="paymentService"
                  value={form.paymentService}
                  onChange={handleChange}
                  placeholder="Payment Service (e.g., Online, Cash)"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="paymentBankName"
                  value={form.paymentBankName}
                  onChange={handleChange}
                  placeholder="Bank Name for Payments"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="paymentBankAccountNumber"
                  value={form.paymentBankAccountNumber}
                  onChange={handleChange}
                  placeholder="Bank Account Number"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="ifscCode"
                  value={form.ifscCode}
                  onChange={handleChange}
                  placeholder="IFSC Code"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <textarea
                  name="bankBranchAddress"
                  value={form.bankBranchAddress}
                  onChange={handleChange}
                  placeholder="Bank Branch Address"
                  className="input-field resize-y h-18 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="Bankbranchname"
                  value={form.Bankbranchname}
                  onChange={handleChange}
                  placeholder="Bank Branch Name"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="Branchcity"
                  value={form.Branchcity}
                  onChange={handleChange}
                  placeholder="Branch City"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="Branchstate"
                  value={form.Branchstate}
                  onChange={handleChange}
                  placeholder="Branch State"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="Branchpincode"
                  value={form.Branchpincode}
                  onChange={handleChange}
                  placeholder="Branch Pincode"
                  className="input-field w-full border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
              </div>
            </section>

          </div>
          <section className="md:flex  justify-center gap-2 bg-blue-50 p-3 rounded-xl shadow-md">
            <div className='w-1/2'>
              <h3 className="text-md font-semibold text-[#ff1493]  pb-3 border-b border-blue-200 flex items-center">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="languages"
                  value={form.languages}
                  onChange={handleChange}
                  placeholder="Languages Spoken (comma-separated)"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="Type (e.g., General Physician, Specialist)"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="specialties"
                  value={form.specialties}
                  onChange={handleChange}
                  placeholder="Specialties (comma-separated)"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="Personal Website/Portfolio URL (Optional)"
                  className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className=" w-1/2 ">
              <h3 className="text-xl font-semibold text-[#ff1493] mb-4 border-b border-blue-300 pb-2" >Your Documents </h3>

              <div className="flex flex-wrap sm:grid-cols-2 gap-2">
                {['AdharCard', 'PanCard', 'CertificatOne', 'CertificatTwo', 'AccountPassBook'].map((docKey) => (
                  <div
                    key={docKey}
                    className="flex flex-col items-center justify-between p-2 border border-blue-300 rounded-md bg-white bg-opacity-10 w-40 h-40"
                  >
                    {Docs[docKey as keyof typeof Docs] ? (
                      <img
                        src={Docs[docKey as keyof typeof Docs]}
                        alt={docKey}
                        className="w-24 h-24 object-cover rounded-md shadow-sm mb-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_DOCUMENT_ICON;
                        }}
                      />
                    ) : (
                      <div className="w-24 h-24 bg-white bg-opacity-20 rounded-md flex items-center justify-center text-white text-opacity-70 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12"
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
                      className="cursor-pointer text-center flex-shrink-0 text-[9px] text-white bg-teal-600 hover:bg-teal-400 px-3 py-1 rounded-full transition-colors duration-300"
                    >
                      {Docs[docKey as keyof typeof Docs] ? 'Update' : 'Upload'}{' '}
                      {docKey.replace(/([A-Z])/g, ' $1').replace('Card', ' Card').replace('Book', ' Book').trim()}
                    </label>
                    <input
                      id={docKey}
                      name={docKey}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"

                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

                        <div className="md:flex justify-center gap-2">
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
      <HCAMobileView />
    </div>
  );
}