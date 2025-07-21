'use client';

import { GetUserInformation, PostFullRegistration } from '@/Lib/user.action';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

const DEFAULT_PROFILE_PIC = '/Icons/DefaultProfileIcon.png';
const DEFAULT_DOCUMENT_ICON = '/Icons/DefaultDocumentIcon.png';

export default function HCAMobileView() {
    const [ProfileName, SetProfileName] = useState('');
    const [PictureUploading, setPictureUploading] = useState(false);
    const [UpdatingStatus, SetUpdatingStatus] = useState(true);
    const [DocName, setDocName] = useState('');
    const [UpdatedStatusMessage, setUpdatedStatusMessage] = useState('');
    const [currentStep, setCurrentStep] = useState(0);

    const formSections = [
        'Personal Information',
        'Identity & Address',
        'Education & Professional Experience',
        'Physical Attributes',
        'Health Information',
        'Referral Information',
        'Service & Payment Details',
        'Other Details',
        'Document Uploads',
    ];

    const [Docs, setDocs] = useState({
        ProfilePic: DEFAULT_PROFILE_PIC,
        PanCard: '',
        AdharCard: '',
        AccountPassBook: '',
        CertificatOne: '',
        CertificatTwo: '',
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
                console.error('Error fetching user information:', err);
            }
        };
        Fetch();
    }, []);

    const handleImageChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            setUpdatedStatusMessage('');
            const file = e.target.files?.[0];
            const InputName = e.target.name;
            if (!file) return;

            if (file.size > 10 * 1024 * 1024) {
                alert('File too large. Max allowed is 10MB.');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                setDocName(InputName);
                setPictureUploading(true);
                const res = await axios.post('/api/Upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setDocs((prev) => ({ ...prev, [InputName]: res.data.url }));
                setUpdatedStatusMessage(`${InputName} uploaded successfully!`);
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
            SetUpdatingStatus(false);

            const dob = new Date(form.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

            if (age < 18) {
                alert('❌ Cannot submit. Age must be at least 18 years.');
                SetUpdatingStatus(true);
                return;
            }

            if (Docs.ProfilePic === DEFAULT_PROFILE_PIC) {
                setUpdatedStatusMessage('Please Update Your Profile Picture!');
                SetUpdatingStatus(true);
                return;
            }


            if (completion !== 100) {
                alert('Please complete all required fields to update your profile!');
                SetUpdatingStatus(true);
                return;
            }

            const FinelForm = { ...form, Documents: Docs };

            setUpdatedStatusMessage('Successfully Updated Your Information.');
            SetUpdatingStatus(true);
            const PostResult = await PostFullRegistration(FinelForm);
            console.log('Result---', PostResult);
        },
        [form, completion, Docs]
    );

    const handleNext = () => {
        const ScrollResult = document.getElementById("RegisrationForm")
    
        ScrollResult?.scrollIntoView({ behavior: "smooth" })
        if (currentStep < formSections.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        const ScrollResult = document.getElementById("RegisrationForm")
        ScrollResult?.scrollIntoView({ behavior: "smooth" })
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };


    return (
        <div className="md:hidden min-h-[86.5vh] h-[86.5vh] bg-white flex flex-col items-center justify-center overflow-hidden">
          <div className="max-w-2xl w-full mx-auto bg-white shadow-md border border-gray-200 rounded-xl p-4 flex items-center gap-4 animate-fade-in-short">


  <div className="flex flex-col items-center">
  <label htmlFor="Profile" className="relative group w-20 h-20 min-w-[5rem] rounded-full overflow-hidden border-4 border-[#50c896] shadow-md cursor-pointer hover:scale-105 transition-all duration-300">
    <img
      src={Docs.ProfilePic}
      alt="Profile"
      className="w-full h-full object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = DEFAULT_PROFILE_PIC;
      }}
    />
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h1.2a2 2 0 001.6-.8l.8-1.2a2 2 0 011.6-.8h4.8a2 2 0 011.6.8l.8 1.2a2 2 0 001.6.8H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      </svg>
    </div>
    <input id="Profile" name="ProfilePic" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
  </label>
  {Docs.ProfilePic===DEFAULT_PROFILE_PIC&& <p className="text-[11px] text-gray-500 mt-1">Tap to upload</p>}
 
</div>

 

  <div className="flex-1 flex flex-col justify-between h-full py-1">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-base font-bold text-gray-800">{ProfileName}</h2>
        <p className="text-xs text-gray-500">Profile Dashboard</p>
      </div>
      <span className="text-xs bg-[#50c896]/20 text-[#1392d3] px-2 py-0.5 rounded-full font-medium">
        {completion}% complete
      </span>
    </div>


    <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 bg-gradient-to-r from-[#50c896] to-[#1392d3] transition-all duration-700 rounded-full"
        style={{ width: `${completion}%` }}
      />
    </div>

    
    <div className="mt-2 text-xs text-gray-600">
      {PictureUploading ? (
        <span className="text-yellow-600 animate-pulse">Uploading <strong>{DocName}</strong>...</span>
      ) : (
        <span className="text-green-600 font-medium">{UpdatedStatusMessage}</span>
      )}
    </div>
  </div>
</div>


            <form
              
                onSubmit={handleSubmit}
         className="w-full p-2 flex flex-col justify-between overflow-y-auto h-full hide-scrollbar"

            >
                <div   id='RegisrationForm'>
                    {currentStep === 0 && (
                        <div className="md:flex w-full justify-center gap-2">
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
                                            <p className="absolute left-0 text-xs text-gray-500">
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
                        </div>
                    )}


                    {currentStep === 1 && (
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
                    )}


                    {currentStep === 2 && (
                        <div className="md:flex justify-center gap-2">
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
                                        className="input-field resize-y h-18 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </section>
                        </div>
                    )}


                    {currentStep === 3 && (
                        <div className="md:flex justify-center gap-2">
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
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.944 12c.048 2.071.385 4.113 1 6.056l-.168.043a2 2 0 00-.704 2.822 2 2 0 01-.762 2.824M12 21.056c2.071-.048 4.113-.385 6.056-1a12.001 12.001 0 00-.043-.168a2 2 0 002.822-.704 2 2 0 012.824-.762"
                                        />
                                    </svg>
                                    Physical Attributes
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <input
                                        type="text"
                                        name="height"
                                        value={form.height}
                                        onChange={handleChange}
                                        placeholder="Height (e.g., 5'10&quot; or 178cm)"
                                        className="input-field border border-gray-300 p-3 h-8 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="weight"
                                        value={form.weight}
                                        onChange={handleChange}
                                        placeholder="Weight (e.g., 70kg or 154lbs)"
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
                                    <textarea
                                        name="moleBodyMark1"
                                        value={form.moleBodyMark1}
                                        onChange={handleChange}
                                        placeholder="Mole/Body Mark 1"
                                        className="input-field resize-y h-18 border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <textarea
                                        name="moleBodyMark2"
                                        value={form.moleBodyMark2}
                                        onChange={handleChange}
                                        placeholder="Mole/Body Mark 2"
                                        className="input-field resize-y h-18 border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                </div>
                            </section>
                        </div>
                    )}


                    {currentStep === 4 && (
                        <div className="md:flex justify-center gap-2">
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
                                        className="input-field resize-y h-18 border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                    <textarea
                                        name="reportCurrentHealthProblems"
                                        value={form.reportCurrentHealthProblems}
                                        onChange={handleChange}
                                        placeholder="Report Current Health Problems"
                                        className="input-field resize-y h-18 border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </section>
                        </div>
                    )}


                    {currentStep === 5 && (
                        <div className="md:flex justify-center gap-2">
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
                                            d="M13 7l2 2 4-4M18 14V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8m-2-6h.01M16 21v-4m-4-2H8l-3-3m5 3v4"
                                        />
                                    </svg>
                                    Referral Information
                                </h3>
                                <div className="space-y-5">
                                    <input
                                        type="text"
                                        name="sourceOfReferral"
                                        value={form.sourceOfReferral}
                                        onChange={handleChange}
                                        placeholder="Source of Referral"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <input
                                        type="date"
                                        name="dateOfReferral"
                                        value={form.dateOfReferral}
                                        onChange={handleChange}
                                        placeholder="Date of Referral"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <h4>Reference 1:</h4>
                                    <input
                                        type="text"
                                        name="reference1Name"
                                        value={form.reference1Name}
                                        onChange={handleChange}
                                        placeholder="Name"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <input
                                        type="text"
                                        name="reference1Aadhar"
                                        value={form.reference1Aadhar}
                                        onChange={handleChange}
                                        placeholder="Aadhar"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <input
                                        type="tel"
                                        name="reference1Mobile"
                                        value={form.reference1Mobile}
                                        onChange={handleChange}
                                        placeholder="Mobile"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <textarea
                                        name="reference1Address"
                                        value={form.reference1Address}
                                        onChange={handleChange}
                                        placeholder="Address"
                                        className="input-field resize-y h-18 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <input
                                        type="text"
                                        name="reference1Relationship"
                                        value={form.reference1Relationship}
                                        onChange={handleChange}
                                        placeholder="Relationship"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <h4>Reference 2:</h4>
                                    <input
                                        type="text"
                                        name="reference2Name"
                                        value={form.reference2Name}
                                        onChange={handleChange}
                                        placeholder="Name"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <input
                                        type="text"
                                        name="reference2Aadhar"
                                        value={form.reference2Aadhar}
                                        onChange={handleChange}
                                        placeholder="Aadhar"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <input
                                        type="tel"
                                        name="reference2Mobile"
                                        value={form.reference2Mobile}
                                        onChange={handleChange}
                                        placeholder="Mobile"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <textarea
                                        name="reference2Address"
                                        value={form.reference2Address}
                                        onChange={handleChange}
                                        placeholder="Address"
                                        className="input-field resize-y h-18 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                </div>
                            </section>
                        </div>
                    )}


                    {currentStep === 6 && (
                        <div className="md:flex justify-center gap-2">
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
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    Service & Payment Details
                                </h3>
                                <div className="space-y-5">
                                    <div className="flex items-center space-x-4">
                                        <label htmlFor="serviceHours12hrs" className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                id="serviceHours12hrs"
                                                name="serviceHours12hrs"
                                                checked={form.serviceHours12hrs}
                                                onChange={handleChange}
                                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                            />
                                            <span className="ml-2 text-gray-700">12 Hours Service</span>
                                        </label>
                                        <label htmlFor="serviceHours24hrs" className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                id="serviceHours24hrs"
                                                name="serviceHours24hrs"
                                                checked={form.serviceHours24hrs}
                                                onChange={handleChange}
                                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                            />
                                            <span className="ml-2 text-gray-700">24 Hours Service</span>
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        name="preferredService"
                                        value={form.preferredService}
                                        onChange={handleChange}
                                        placeholder="Preferred Service"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="paymentService"
                                        value={form.paymentService}
                                        onChange={handleChange}
                                        placeholder="Payment Service (e.g., Bank Transfer, UPI)"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="paymentBankName"
                                        value={form.paymentBankName}
                                        onChange={handleChange}
                                        placeholder="Bank Name"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="paymentBankAccountNumber"
                                        value={form.paymentBankAccountNumber}
                                        onChange={handleChange}
                                        placeholder="Bank Account Number"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="ifscCode"
                                        value={form.ifscCode}
                                        onChange={handleChange}
                                        placeholder="IFSC Code"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
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
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="Branchcity"
                                        value={form.Branchcity}
                                        onChange={handleChange}
                                        placeholder="Branch City"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="Branchstate"
                                        value={form.Branchstate}
                                        onChange={handleChange}
                                        placeholder="Branch State"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="Branchpincode"
                                        value={form.Branchpincode}
                                        onChange={handleChange}
                                        placeholder="Branch Pincode"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </section>
                        </div>
                    )}


                    {currentStep === 7 && (
                        <div className="md:flex  justify-center gap-2">
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
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Other Details
                                </h3>
                                <div className="space-y-5">
                                    <input
                                        type="text"
                                        name="languages"
                                        value={form.languages}
                                        onChange={handleChange}
                                        placeholder="Languages Known (comma-separated)"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <input
                                        type="text"
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                        placeholder="Type (e.g., General Physician, Specialist)"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <input
                                        type="text"
                                        name="specialties"
                                        value={form.specialties}
                                        onChange={handleChange}
                                        placeholder="Specialties (e.g., Cardiology, Pediatrics)"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                    <input
                                        type="url"
                                        name="website"
                                        value={form.website}
                                        onChange={handleChange}
                                        placeholder="Website/Portfolio URL"
                                        className="input-field w-full h-8 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                    />
                                </div>
                            </section>
                        </div>
                    )}


                    {currentStep === 8 && (
                        <div className="md:flex justify-center gap-2">
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
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                        />
                                    </svg>
                                    Document Uploads
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    <div className="flex flex-col items-center">
                                        <img
                                            src={Docs.PanCard || DEFAULT_DOCUMENT_ICON}
                                            alt="PAN Card"
                                            className="w-24 h-24 object-contain"
                                        />
                                        <label
                                            htmlFor="Pan"
                                            className="cursor-pointer mt-2 inline-block text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full transition-colors duration-300 shadow-sm"
                                        >
                                            {Docs.PanCard ? 'Update PAN Card' : 'Upload PAN Card'}
                                        </label>
                                        <input
                                            id="Pan"
                                            name="PanCard"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            required
                                        />
                                    </div>


                                    <div className="flex flex-col items-center">
                                        <img
                                            src={Docs.AdharCard || DEFAULT_DOCUMENT_ICON}
                                            alt="Aadhar Card"
                                            className="w-24 h-24 object-contain"
                                        />
                                        <label
                                            htmlFor="Adhar"
                                            className="cursor-pointer mt-2 inline-block text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full transition-colors duration-300 shadow-sm"
                                        >
                                            {Docs.AdharCard ? 'Update Aadhaar Card' : 'Upload Aadhaar Card'}
                                        </label>
                                        <input
                                            id="Adhar"
                                            name="AdharCard"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            required
                                        />
                                    </div>


                                    <div className="flex flex-col items-center">
                                        <img
                                            src={Docs.AccountPassBook || DEFAULT_DOCUMENT_ICON}
                                            alt="Account Passbook"
                                            className="w-24 h-24 object-contain"
                                        />
                                        <label
                                            htmlFor="PassBook"
                                            className="cursor-pointer mt-2 inline-block text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full transition-colors duration-300 shadow-sm"
                                        >
                                            {Docs.AccountPassBook ? 'Update Account Passbook' : 'Upload Account Passbook'}
                                        </label>
                                        <input
                                            id="PassBook"
                                            name="AccountPassBook"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            required
                                        />
                                    </div>


                                    <div className="flex flex-col items-center">
                                        <img
                                            src={Docs.CertificatOne || DEFAULT_DOCUMENT_ICON}
                                            alt="Certificate One"
                                            className="w-24 h-24 object-contain"
                                        />
                                        <label
                                            htmlFor="Certificat1"
                                            className="cursor-pointer mt-2 inline-block text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full transition-colors duration-300 shadow-sm"
                                        >
                                            {Docs.CertificatOne ? 'Update Certificate 1' : 'Upload Certificate 1'}
                                        </label>
                                        <input
                                            id="Certificat1"
                                            name="CertificatOne"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            required
                                        />
                                    </div>


                                    <div className="flex flex-col items-center">
                                        <img
                                            src={Docs.CertificatTwo || DEFAULT_DOCUMENT_ICON}
                                            alt="Certificate Two"
                                            className="w-24 h-24 object-contain"
                                        />
                                        <label
                                            htmlFor="Certificat2"
                                            className="cursor-pointer mt-2 inline-block text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full transition-colors duration-300 shadow-sm"
                                        >
                                            {Docs.CertificatTwo ? 'Update Certificate 2' : 'Upload Certificate 2'}
                                        </label>
                                        <input
                                            id="Certificat2"
                                            name="CertificatTwo"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            required
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}


                </div>
                <div className="flex justify-between items-end mt-8">
                    {currentStep > 0 && (
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                        >
                            Previous
                        </button>
                    )}

                    {currentStep < formSections.length - 1 && (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 ml-auto"
                        >
                            Next
                        </button>
                    )}

                    {currentStep === formSections.length - 1 && (
                        <button
                            type="submit"
                            disabled={!UpdatingStatus || PictureUploading}
                            className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                        >
                            {UpdatingStatus ? 'Update Profile' : 'Updating...'}
                        </button>
                    )}
                </div>


            </form>
        </div>
    );
}