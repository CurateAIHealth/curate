"use client";

import MobileMedicationSchedule from "@/Components/MedicationMobileView/page";
import MedicationSchedule from "@/Components/Medications/page";
import { ClientEnquiry_Filters, filterColors, Headings, indianFamilyRelations, LeadSources, Main_Filters, medicalSpecializations, physioSpecializations } from "@/Lib/Content";
import { GetUserInformation, UpdateNewLeadInformation } from "@/Lib/user.action";
import { Update_Current_Client_Status } from "@/Redux/action";
import { Info, ListFilter, LogOut, PhoneCall, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

type RemarkStatusType = {
  Hygiene: boolean;
  Nutrition: boolean;
  Vitals: boolean;
  Elimination: boolean;
  Mobility: boolean;
  ClientCard: boolean;
  PatientCard: boolean;
  PatientDetails: boolean;
  Weight: boolean;
  Height: boolean;
  patientHomeAssistance: boolean;
  patientHomeNeeds: boolean;
  patientDrNeeds: boolean;
  patientHealthCard: boolean;
  hcpType: boolean;
  
};

export default function CallEnquiryForm() {
  const [formData, setFormData] = useState<any>({





    userType: "patient",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    patientName: "",
    patientPhone: "",
    RelationtoPatient: "",
    MainpointforPatient: "",
    MainpointforPatientInfo: "",
    Source: "",
    NewLead: "",
    patientAge: "",
    patientGender: [],
    patientWeight: "",
    patientHeight: "",
    comfortableLanguages: [],
    patientType: "",
    patientCurrentLocation: [],
    serviceLocation: "",
    patientHomeAssistance: [],
    Gloves_Availability: "",
    patientHomeNeeds: [],
    patientDrNeeds: [],
    patientHealthCard: [],
    hcpType: [],
    AbhaId: "",
    PhysiotherapySpecialisation: "",
    MedicalDrSpecialisation: "",
    PatientBathRoomCleaning: "",
    HydrationWaterLevel: "",
    DocterAdvisedHydrationWaterLevel: "",
    Patient_Indipendent_Elimination: "",
    Comode: "",
    Diaper: "",
    Urine: "",
    Juice: "",
    Doabatic: "",
    DoabaticPlan: "",
    DiabeticSpecification: "",
    FoodPreparation: "",
    FoodPreparationInputs: "",
    Allergies: "",
    AllergyOption: "",
    FoodItem: "",
    SpecialFoodItem: "",
    PatientBathing: "",
    PatientClothes: "",
    HairWash: "",
    NailCare: "",
    Dressing_Grooming: "",
    Assisting_in_suctioning: "",
    PassiveExercises: "",
    ActiveExercises: "",
    ResistedExercises: "",
    Walking: "",
    AssistanceRequire: '',
    HIV: '',
    Temperature:'',
     Pulse:'',
     OxygenSaturation:'', 
    BloodPressure:'',
    serviceCharges: "",
    PatientRoomCleaning: "",
    Brushing_FaceFash: "",
    BedMaking: "",
    AdditionalComments: "",
    Hygiene: "",
    Nutrition: "",
    Vitals: "",
    Elimination: "",
    Mobility: "",
    Medication: "",
    RemainderTime: "",
    RemainderDate: "",
    ClientCardRemarks: "",
    PatientCardCardRemarks: "",
    PatientDetailsCardRemarks: "",
    Hygieneremarks: "",
    Nutritionremarks: "",
    Vitalsremarks: "",
    Eliminationremarks: "",
    Mobilityremarks: "",
    WeightRemarks: "",
    HeightRemarks: "",
    patientHomeAssistanceRemarks: "",
    patientHomeNeedsRemarks: "",
    patientDrNeedsRemarks: "",
    patientHealthCardRemarks: "",
    hcpTypeRemarks: "",
    Current_Previous_Occupation: "Software Engineer",
    Hobbies: ['Reading', 'Traveling', 'Photography'],
    Present_Illness: "Hypertension",
    Speciality_Areas: "Orthopedics",
    OnGoing_Treatment: "Physiotherapy",
    Balance: "Stable",
    History_of_Fall: "No recent falls reported",
    Hearing_Loss: "Mild hearing loss in left ear",
    Visual_Impairment: "Uses reading glasses",
    Depression: "None",
    Confusion: "Occasional forgetfulness",
    Frequent_Urination: "Yes, during nighttime",
    Sleep_Issues: "Difficulty falling asleep",
    Anxiety: "Mild anxiety under stress",
    Mobility_Aids: "Walking stick",
    Breathing_Equipment: "None",
    Feeding_Method: "Self-feeding",
    Floor_Type: "Tiled floor with rugs",
    Washroom_Accessories: "Grab bars and non-slip mats",
   PhysioScore:0,
   PresentHealthRemarks:'',
   TreatmentRemarks:"",
   FunctionalAssessmentsRemarks:"",
   EquipmentRemark:"",
    VerificationStatus: "Pending",
    TermsAndConditions: "Accepted",
    EmailVerification: true,
    FinelVerification: false,

    ClientStatus: "",
  });

const [visible, setVisible] = useState(true);
  const [WarningMessage, setWarningMessage] = useState("");
  const [DiscountPrice,setDiscountPrice]=useState(1500)
  const [PhysioScore,SetPhysioScore]=useState(0)
  const [addingWeight, setaddingWeight] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [addedheight, setaddedheight] = useState();
  const [TimeStameDetails,setTimeStameDetails]=useState("setTimeStameDetails")
    const [showTooltip, setShowTooltip] = useState(false);
  const [MinimiseOptions,setMinimizeOptions]=useState({Hygiene:false,Nutrition:false,Vitals:false,Elimination:false,Mobility:false,Medication:false})
  const [RemarkStatus,setRemarkStatus]=useState({Hygiene:false,Nutrition :false,Vitals:false,Elimination:false,Mobility:false,ClientCard:false,PatientCard:false,PatientDetails:false,Weight:false,Height:false,patientHomeAssistance:false,
  patientHomeNeeds:false,
  patientDrNeeds:false,
  patientHealthCard:false,
  hcpType:false,
Medication:false})
  const [Options,setOptions]=useState(false)
  const dispatch=useDispatch()
    const router=useRouter()
const MedicationData=useSelector((each:any)=>each.MedicationInfo)
    const FinelPostingData={...formData,serviceCharges:parseFloat(formData.serviceCharges.replace(/[^0-9.]/g, '')) + DiscountPrice,Medications:MedicationData}
console.log('Test Data----',FinelPostingData)
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => {
      const updated = { ...prev, [field]: value };
      if (field === "serviceCharges") {
        setDiscountPrice(1500)
        const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(numericValue) && numericValue < 800) {
          setWarningMessage("Price Not Offerable");
        } else {
          setWarningMessage("");
        }
      }
      return updated;
    });
  };
useEffect(()=>{
  const Fetch=async()=>{
const localValue = localStorage.getItem('UserId');
   
      const Sign_in_UserInfo=await GetUserInformation(localValue)

      setTimeStameDetails(`${Sign_in_UserInfo.FirstName} ${Sign_in_UserInfo.LastName}, Email: ${Sign_in_UserInfo.Email}`)
  }
  Fetch()
},[])
  const handleCheckboxChange = (section: string, value: string) => {
    setFormData((prev: any) => {
      const current = prev[section] || [];
      if (current.includes(value)) {
        return { ...prev, [section]: current.filter((item: string) => item !== value) };
      } else {
        return { ...prev, [section]: [...current, value] };
      }
    });
  };


const UpdatePreview = (A: string) => {
  setOptions(false);
  const Result = document.getElementById(A);
  if (Result) {
    const yOffset = -80; 
    const y = Result.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};
  const handleLogout = () => {
 
    router.push('/DashBoard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  if (!formData.ClientStatus || formData.ClientStatus.trim() === "") {
    setStatusMessage("Please Select Client Status");
    return;
  }
    setStatusMessage("Please Wait...");
    const generatedUserId = uuidv4();
    const FinelData = { ...formData, userId: generatedUserId,SuitableHCP:"" };
      const FinelPostingData={...formData,serviceCharges:parseFloat(formData.serviceCharges.replace(/[^0-9.]/g, '')) + DiscountPrice,Medications:MedicationData,userId: generatedUserId,SuitableHCP:"", TimeStamp:TimeStameDetails}
console.log('Finel Test Data----',FinelPostingData)
    const PostResult = await UpdateNewLeadInformation(FinelPostingData);
    if (PostResult.success) {
      setStatusMessage(`${PostResult.message},Riderecting to Admin Page...`);
      dispatch(Update_Current_Client_Status(formData.ClientStatus))
      const Timer=setInterval(()=>{
router.push("/AdminPage")
      },1200)

      return ()=> clearInterval(Timer)
    }
  };

  return (
    <div
     
      className="w-full   bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-xl flex flex-col gap-6"
    >
   <div className="sticky top-0 z-50 bg-gray-50 flex items-center w-full gap-2 sm:gap-4 p-2">

  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
    <ListFilter   type="button" className="cursor-pointer" onClick={() => setOptions(prev => !prev)} />

    <img
      src="/Icons/Curate-logo.png"
      alt="Logo"
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-rose-500 p-2 shadow-sm"
    />

    <h1 className="text-base sm:text-lg md:text-xl font-medium text-[#ff1493] tracking-wide leading-snug flex items-center justify-center gap-2">
      Call Enquiry & Firsthand Info
      <span className="bg-white text-teal-500 rounded-full p-2 shadow-sm text-lg flex items-center justify-center">
        <PhoneCall />
      </span>
    </h1>
  </div>

  
  <div className="flex-grow" />

{/* <p className="text-3xl font-semibold text-blue-600 tracking-wide">
  Physio <span className="text-gray-900">Score {PhysioScore}</span>
</p> */}

  <button
    type="button"
    onClick={handleLogout}
    className="hidden md:flex items-center cursor-pointer gap-2 px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
  >
    <LogOut size={20} /> DashBoard
  </button>
</div>

{Options && (
        <div className="fixed inset-0 bg-white w-[180px] z-40 flex justify-start items-start  overflow-auto">
          <div className=" shadow-lg rounded-lg pt-16 p-2  h-screen w-64 max-h-full overflow-y-auto">
            {Headings.map((each: any) => (
              <button
                key={each}
                  type="button"
                className="bg-gray-400 text-white w-[130px] shadow-lg p-1 cursor-pointer rounded-lg text-[10px] mb-2"
                onClick={()=>UpdatePreview(each)}
              >
                {each}
              </button>
            ))}
          </div>
        </div>
      )}
<button
type="button"
            onClick={handleLogout}
            className="flex items-center ml-25 justify-center text-center md:hidden cursor-pointer items-center gap-2 w-[170px]  px-1 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
          >
            <LogOut size={20} /> DashBoard
          </button>
<form
className="overflow-hidden h-[95%]"
      onSubmit={handleSubmit}>  
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-1 sm:pr-2">
        <div id="Client Card – ID" className="bg-white rounded-lg shadow p-4 space-y-3">
          <h2 className="text-lg font-semibold text-teal-600">Client Card – ID</h2>
          <input
            type="text"
            placeholder="Client Name"
            className="w-full border rounded-lg p-2"
            value={formData.clientName}
            onChange={(e) => handleChange("clientName", e.target.value)}
          />
          <input
            type="text"
            placeholder="Client Phone"
            className="w-full border rounded-lg p-2"
            value={formData.clientPhone}
            onChange={(e) => handleChange("clientPhone", e.target.value)}
          />
          <input
            type="email"
            placeholder="Client Email"
            className="w-full border rounded-lg p-2"
            value={formData.clientEmail}
            onChange={(e) => handleChange("clientEmail", e.target.value)}
          />   <div>
            <p>Main point for Patient:</p>
            <div className="flex flex-wrap gap-2">
              {["Yes", "No"].map((g) => (
                <label key={g} className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={formData.MainpointforPatient === g}
                    onChange={() =>
                      setFormData((prev: any) => ({ ...prev, MainpointforPatient: g }))
                    }
                    className="mr-2 accent-purple-600"
                  />
                  {g}
                </label>
              ))}
            </div>
        
            {String(formData.MainpointforPatient) === "No" && (
              <input
                type="text"
                className="w-full border rounded-md text-center mt-2"
                placeholder="Main point for Patient"
                onChange={(e) => handleChange("MainpointforPatientInfo", e.target.value)}
              />
            )}
          </div>
              <p>Relation to Patient</p>
         
          <select   className="w-full border rounded-lg p-2"  onChange={(e) => handleChange("RelationtoPatient", e.target.value)}>
            <option>Choose Relation</option>
            {indianFamilyRelations.map((each:any)=><option key={each}>{each}</option>)}
          </select>
          <div>
            <p>Lead Source :</p>
         
            <select className="w-full border rounded-md text-center"  onChange={(e) => handleChange("Source", e.target.value)}>
              <option className="bg-gray-400">Choose Lead</option>
              {LeadSources.map((each:any)=><option key={each}>{each}</option>)}
            </select>
            {formData.Source==="Other"&& <input
              type="text"
              placeholder="Enter New Lead Name"
              className="w-[300px] border rounded-lg p-2 m-2"
              value={formData.NewLead}
              onChange={(e) => handleChange("NewLead", e.target.value)}
            />}
          </div>
          <button type="button" className="bg-white/30 backdrop-blur-md border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={()=>setRemarkStatus((prev)=>({...prev,ClientCard :!RemarkStatus.ClientCard }))} > {RemarkStatus.ClientCard ?"SAVE Remark":"Add Remarks"} </button>
           {RemarkStatus.ClientCard &&<textarea
  rows={4}
  placeholder="Enter your remarks here..."
  className="w-[400px] p-3 border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
  value={formData.ClientCardRemarks || ""}
  onChange={(e) => handleChange("ClientCardRemarks", e.target.value)}
/>
}
        </div>

        <div id="Patient Card – ID" className="bg-white rounded-lg shadow p-4 flex flex-col space-y-3">
          <h2 className="text-lg font-semibold text-teal-600">Patient Card – ID</h2>
          <input
            type="text"
            placeholder="Patient Name"
            className="w-full border rounded-lg p-2"
            value={formData.patientName}
            onChange={(e) => handleChange("patientName", e.target.value)}
            
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full border rounded-lg p-2"
            value={formData.patientPhone}
            onChange={(e) => handleChange("patientPhone", e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            className="w-full border rounded-lg p-2"
            value={formData.patientAge}
            onChange={(e) => handleChange("patientAge", e.target.value)}
          />
          <div className="flex flex-col">
            <h3 className="font-medium text-sm">Gender</h3>
            <div className="flex flex-wrap gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <label key={g} className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={formData.patientGender === g}
                    onChange={() => setFormData((prev: any) => ({ ...prev, patientGender: g }))}
                    className="mr-2 accent-purple-600"
                  />
                  {g}
                </label>
              ))}
            </div>
           
          </div>
            <div className="relative w-full">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Abha Id"
          className="w-full border rounded-lg p-2"
          value={formData.AbhaId}
          onChange={(e) => handleChange("AbhaId", e.target.value)}
        />
      
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative cursor-pointer"
        >
          <Info className="text-gray-500 w-5 h-5" />
          
         
          {showTooltip && (
            <div className="absolute top-0 left-full ml-2 w-64 bg-white border shadow-lg rounded-md p-3 gap-2 z-10">
              <p className="text-sm text-gray-700 mb-2">
                ABHA (Ayushman Bharat Health Account) is a unique ID for accessing
                your health records digitally.
              </p>
              <a
                href="https://abha.abdm.gov.in/abha/v3/register/aadhaar"
                target="_blank"
                className="m-4 w-full bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition"
              >
                Register ABHA
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
          <div className="flex items-end md:mt-25">
 <button type="button" className="bg-white/30 backdrop-blur-md  border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={()=>setRemarkStatus((prev)=>({...prev,PatientCard :!RemarkStatus.PatientCard }))} > {RemarkStatus.PatientCard ?"SAVE Remark":"Add Remarks"} </button>
                {RemarkStatus.PatientCard &&<textarea
  rows={4}
  placeholder="Enter your remarks here..."
  className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
  value={formData.PatientCardCardRemarks || ""}
  onChange={(e) => handleChange("PatientCardCardRemarks", e.target.value)}
/>
}
           </div>
      
        </div>

        <div  className="bg-white rounded-lg shadow p-4 space-y-3">
          <h2 className="text-lg font-semibold text-teal-600">Patient Details</h2>
          <div>
            <h3 className="font-medium text-sm">Patient Type</h3>
            <div className="flex flex-col gap-1">
              {["Bed Ridden", "Semi Bed Ridden", "Wheel Chair", "Full Mobile", "Post Operative"].map(
                (t) => (
                  <label key={t} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.patientType===t}
                      
                    onChange={() => setFormData((prev: any) => ({ ...prev, patientType: t }))}
                      className="mr-2 accent-purple-600"
                    />
                    {t}
                  </label>
                )
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm">Current Location</h3>
            <div className="flex flex-col gap-1">
              {["Hospital", "Rehab", "Home"].map((loc) => (
                <label key={loc} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.patientCurrentLocation === loc}
                    onChange={() =>
                      setFormData((prev: any) => ({
                        ...prev,
                        patientCurrentLocation: loc,
                      }))
                    }
                    className="mr-2 accent-purple-600"
                  />
                  {loc}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm">Service Location</h3>
            <input
              type="text"
              placeholder="Enter Service Location"
              className="w-full border rounded-lg p-2"
              value={formData.serviceLocation}
              onChange={(e) => handleChange("serviceLocation", e.target.value)}
            />
          </div>
          <button type="button" className="bg-white/30 backdrop-blur-md mt-20 border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={()=>setRemarkStatus((prev)=>({...prev,PatientDetails :!RemarkStatus.PatientDetails }))} > {RemarkStatus.PatientDetails ?"SAVE Remark":"Add Remarks"} </button>
           {RemarkStatus.PatientDetails &&<textarea
  rows={4}
  placeholder="Enter your remarks here..."
  className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
  value={formData.PatientDetailsCardRemarks || ""}
  onChange={(e) => handleChange("PatientDetailsCardRemarks", e.target.value)}
/>
}
        </div>
  <div
  id="Patient Details"
  className={`bg-white flex flex-col rounded-lg shadow p-4 space-y-2 ${MinimiseOptions.Hygiene===false?"md:col-span-1":"md:col-span-2"} ${MinimiseOptions.Hygiene===false&&'h-[110px]'}`}
>
  <h2 className="text-lg font-semibold text-teal-600">Hygiene</h2>

 {MinimiseOptions.Hygiene&&
  <div className="flex flex-col md:flex-row md:justify-between space-y-4 w-full md:w-[70%]">
<div className="flex flex-col gap-5">

    <div className="flex flex-col">
      <h3 className="font-medium text-sm mb-2 text-left">
        Oral Care (Brushing & Face Fash)
      </h3>
      <div className="flex flex-row gap-3">
        {["Yes", "No"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded"
          >
            <input
              type="checkbox"
              checked={formData.Brushing_FaceFash === g}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, Brushing_FaceFash: g }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>
 <div className="flex flex-col">
      <h3 className="font-medium text-sm mb-2 text-left">
        Patient Room (Cleaning)
      </h3>
      <div className="flex flex-row gap-3">
        {["Yes", "No"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded"
          >
            <input
              type="checkbox"
              checked={formData.PatientRoomCleaning === g}
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  PatientRoomCleaning: g,
                }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>
     <div className="flex flex-col">
      <h3 className="font-medium text-sm mb-2 text-left">
        Patient BathRoom (Cleaning)
      </h3>
      <div className="flex flex-row gap-3">
        {["Yes", "No"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded"
          >
            <input
              type="checkbox"
              checked={formData.PatientBathRoomCleaning === g}
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  PatientBathRoomCleaning: g,
                }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>

    <div className="flex flex-col">
      <h3 className="font-medium text-sm mb-2 text-left">
        Dressing & Grooming
      </h3>
      <div className="flex flex-row gap-3">
        {["Yes", "No"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded"
          >
            <input
              type="checkbox"
              checked={formData.Dressing_Grooming === g}
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  Dressing_Grooming: g,
                }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>


    <div className="flex flex-col">
      <h3 className="font-medium text-sm mb-2 text-left">Nail Care</h3>
      <div className="flex flex-row gap-3">
        {["Yes", "No"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded"
          >
            <input
              type="checkbox"
              checked={formData.NailCare === g}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, NailCare: g }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>

   
    <div className="flex flex-col">
      <h3 className="font-medium text-sm mb-2 text-left">
        Assisting in suctioning ?
      </h3>
      <div className="flex flex-row gap-3">
        {["Yes", "No"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded"
          >
            <input
              type="checkbox"
              checked={formData.Assisting_in_suctioning === g}
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  Assisting_in_suctioning: g,
                }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>
    <div className="flex flex-col">
      <h3 className="font-medium text-sm mb-2 text-left">
      Is Gloves Available ?
      </h3>
      <div className="flex flex-row gap-3">
        {["Yes", "No"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded"
          >
            <input
              type="checkbox"
              checked={formData.Gloves_Availability === g}
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  Gloves_Availability: g,
                }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>
   
     
</div>
<div className="flex flex-col gap-4">
 
    <div className="flex flex-col">
      <h3 className="font-medium text-sm mb-2 text-left">
        Bed Making (Machine Wash)
      </h3>
      <div className="flex flex-col gap-2">
        {["Daily", "As Needed", "Alternate day"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded w-fit"
          >
            <input
              type="checkbox"
              checked={formData.BedMaking === g}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, BedMaking: g }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>
 
 
    <div className="flex flex-col">
      <h3 className="font-medium text-sm mb-2 text-left">
        Patient Clothes (Machine Wash)
      </h3>
      <div className="flex flex-col gap-2">
        {["Daily", "As Needed", "Alternate day"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded w-fit"
          >
            <input
              type="checkbox"
              checked={formData.PatientClothes === g}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, PatientClothes: g }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>

  
   


    <div className="flex flex-col">
      <h3 className="font-medium text-sm mb-2 text-left">Patient Bathing</h3>
      <div className="flex flex-col gap-2">
        {["Bed Bath", "Sponge Bath", "Water Bathing"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded w-fit"
          >
            <input
              type="checkbox"
              checked={formData.PatientBathing === g}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, PatientBathing: g }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>


    <div className="flex flex-col">
      <h3 className="font-medium text-sm mb-2 text-left">Hair Wash</h3>
      <div className="flex flex-col gap-2">
        {["Weekly Once", "Weekly Twice", "Alternate Day", "Daily"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded w-fit"
          >
            <input
              type="checkbox"
              checked={formData.HairWash === g}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, HairWash: g }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>

  


  </div>

  </div>}
<div className="md:flex gap-4 items-center justify-between w-full mt-4">
 
  {MinimiseOptions.Hygiene && (
    <div className="flex flex-col">
       <p className="text-sm text-gray-500 mb-4">
        * If there are any time specifications for the above-mentioned activities, add them to the remark section.
      </p>
       <p className="text-sm text-gray-600 mb-4 text-[12px] ">
     <span className="text-gray-900 text-bold underline"> Example</span>:  Patient Room Cleaning After 12PM and Dressing & Grooming as per Patient Comfortn.
      </p>
    <button
    type="button"
      className="bg-white/30 backdrop-blur-md border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200"
      onClick={()=>setRemarkStatus((prev)=>({...prev,Hygiene:!RemarkStatus.Hygiene}))}
    >
      {RemarkStatus.Hygiene?"SAVE Remark":"Add Remarks"}
    </button>
    </div>
  )}

  {RemarkStatus.Hygiene&&<textarea
  rows={4}
  placeholder="Enter your remarks here..."
  className="w-[400px] p-3 border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
  value={formData.Hygieneremarks || ""}
  onChange={(e) => handleChange("Hygieneremarks", e.target.value)}
/>
}

 
  <div className="flex justify-end md:ml-auto">
    <button
     type="button"
      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-3 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out md:w-auto"
      
      onClick={() =>
        setMinimizeOptions((prev: any) => ({ ...prev, Hygiene: !prev.Hygiene }))
      }
    >
      {MinimiseOptions.Hygiene ? "Hide" : "Show"}
    </button>
  </div>
</div>

</div>


<div className= {`bg-white rounded-lg shadow p-2 space-y-4" ${MinimiseOptions.Nutrition===false&&'h-[110px]'}`}>
  <h2 className="text-lg font-semibold text-teal-600 mb-4">
    Nutrition & Hydration
  </h2>

  {MinimiseOptions.Nutrition&&
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

   
    <div className="flex flex-col  p-4 rounded-lg ">
      <h3 className="font-medium text-sm mb-3 text-center text-gray-800">Hydration</h3>
      <div className="flex flex-col justify-center gap-2">
        {["1Ltr", "2Ltr", "3Ltr", "4Ltr", "Other"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded-lg shadow-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={formData.HydrationWaterLevel === g}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, HydrationWaterLevel: g }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
      {formData.HydrationWaterLevel === "Other" && (
        <input
          type="text"
          placeholder="As per Doctor advise"
          className="mt-3 border rounded-lg p-2 w-full text-sm"
          value={formData.DocterAdvisedHydrationWaterLevel || ""}
          onChange={(e) => handleChange("DocterAdvisedHydrationWaterLevel", e.target.value)}
        />
      )}
    </div>

    
    <div className="flex flex-col  p-4 rounded-lg ">
      <h3 className="font-medium text-sm mb-3 text-center text-gray-800">Juice</h3>
      <div className="flex flex-col justify-center gap-2">
        {["Morning", "Afternoon", "Evening",'Night'].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded-lg shadow-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={formData.Juice === g}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, Juice: g }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
    </div>

   
  
    <div className="flex flex-col  p-4 rounded-lg ">
      <h3 className="font-medium text-sm mb-3 text-center text-gray-800">Allergies</h3>
      <div className="flex flex-col justify-center gap-4">
        {["Yes", "No"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded-lg shadow-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={formData.Allergies === g}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, Allergies: g }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
      {formData.Allergies === "Yes" && (
        <select
          value={formData.AllergyOption || ""}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, AllergyOption: e.target.value }))
          }
          className="mt-3 border-2 rounded-lg p-2 w-full text-sm focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Allergy Type</option>
          <option value="Vegan">Vegan</option>
          <option value="Egg">Egg</option>
          <option value="Dairy">Dairy</option>
          <option value="Citrus">Citrus</option>
          <option value="Nuts">Nuts</option>
          <option value="Gluten">Gluten</option>
        </select>
      )}
    </div>

  
    {/* <div className="flex flex-col  p-2 rounded-lg ">
      <h3 className="font-medium text-sm mb-3 text-center text-gray-800">Food Preparation List</h3>
      <select
        value={formData.FoodItem || ""}
        onChange={(e) =>
          setFormData((prev: any) => ({ ...prev, FoodItem: e.target.value }))
        }
        className="mt-3 border-2 rounded-lg p-1 w-full text-[10px] focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Select Food</option>
        {["Tea", "Coffee", "Hot Water", "Boiled Egg (1)", "Boiled Egg (2)", "Sabudana", "Kichidi", "Maggie", "Chapathi", "Rice", "Curry", "Other"].map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
      {formData.FoodItem === "Other" && (
        <input
          type="text"
          placeholder="Enter your preferred food item"
          className="mt-3 border rounded-lg p-2 w-full text-sm"
          value={formData.SpecialFoodItem || ""}
          onChange={(e) => handleChange("SpecialFoodItem", e.target.value)}
        />
      )}
    </div> */}

    
    <div className="flex flex-col  p-2 rounded-lg ">
      <h3 className="font-medium text-sm mb-3 text-center text-gray-800">Diabetic</h3>
      <div className="flex flex-col justify-center gap-4">
        {["Yes", "No"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded-lg shadow-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={formData.Doabatic === g}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, Doabatic: g }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
      {formData.Doabatic === "Yes" && (
       <div>
        
       <select
          value={formData.DoabaticPlan || ""}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, DoabaticPlan: e.target.value }))
          }
          className="mt-3 border-2 rounded-lg p-1 w-full text-[10px] focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Choose Diet Plan</option>
          <option value="Before Food">Before Food</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Mid Morning">Mid Morning</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="After Food">After Food</option>
        </select>

         <select
          value={formData.DiabeticSpecification || ""}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, DiabeticSpecification: e.target.value }))
          }
          className="mt-3 border-2 rounded-lg p-1 w-full text-[10px] focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Choose Diabetic Specification</option>
     {[
  "Type 1 Diabetes",
  "Type 2 Diabetes",
  "Gestational Diabetes",
  "Prediabetes",
  "Monogenic Diabetes (MODY / Neonatal)",
  "Secondary Diabetes"
].map((each:any,index)=><option value={each} key={index}>{each}</option>)
}
        </select>
         </div>
      )}
    </div>
 <div >
      <h3 className="font-medium text-sm mb-3 text-center text-gray-800">Food Preparation</h3>
      <div className="flex flex-wrap text-left w-[250px]  gap-4">
        {["Tea", "Coffee", "Hot Water", "Boiled Egg", "Sabudana", "Kichidi", "Maggie", "Chapathi", "Rice", "Curry", "Other"].map((g) => (
          <label
            key={g}
            className="flex items-center text-sm bg-purple-50 px-3 py-1 rounded-lg shadow-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={formData.FoodPreparation === g}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, FoodPreparation: g }))
              }
              className="mr-2 accent-purple-600"
            />
            {g}
          </label>
        ))}
      </div>
      {formData.FoodPreparation === "Other" && (
        <textarea
          rows={4}
          placeholder="Brief Food Preparation"
          className="mt-3 border-2 rounded-lg p-2 w-full text-sm"
          value={formData.FoodPreparationInputs || ""}
          onChange={(e) => handleChange("FoodPreparationInputs", e.target.value)}
        />
      )}
    </div>

  </div>}
<div className={`flex items-center justify-between w-full ${MinimiseOptions.Nutrition===false?'mt-2':'mt-20'}`}>

    {MinimiseOptions.Nutrition  && (
    <button
      className="bg-white/30 backdrop-blur-md border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200"
        type="button"
      onClick={()=>setRemarkStatus((prev)=>({...prev,Nutrition :!RemarkStatus.Nutrition }))}
    >
      {RemarkStatus.Nutrition ?"SAVE Remark":"Add Remarks"}
    </button>
  )}

  {RemarkStatus.Nutrition &&<textarea
  rows={4}
  placeholder="Enter your remarks here..."
  className="w-[400px] p-3 border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
  value={formData.Nutritionremarks || ""}
  onChange={(e) => handleChange("Nutritionremarks", e.target.value)}
/>
}
 <div className="ml-auto">
 <button
  className="bg-teal-600 hover:bg-teal-700 text-white mt-4 font-semibold px-3 cursor-pointer py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out  md:w-auto"
    type="button"
  onClick={()=>setMinimizeOptions((prev:any)=>({...prev, Nutrition: !prev.Nutrition}))}
>
   {MinimiseOptions.Nutrition?"Hide":"Show"}
</button>
</div>
</div>
</div>



<div className={`bg-white rounded-lg shadow p-4 space-y-3  ${MinimiseOptions.Vitals===false?"md:col-span-1":"md:col-span-3"}`}>
  <h2 className="text-lg font-semibold text-teal-600">Vitals Monitoring</h2>
  {MinimiseOptions.Vitals&&
  <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between md:gap-0 gap-2 md:h-[170px] w-full">
    
    {["Temperature", "Pulse", "Oxygen Saturation", "Blood Pressure"].map((vital) => (
      <div key={vital} className="flex flex-col w-full md:w-[20%] md:h-[120px]">
        <h3 className="font-medium text-sm mb-2 md:text-center text-left">
          {vital}
        </h3>
        <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-2">
          {["As Required", "Morning", "Afternoon", "Evening", "Specify Time"].map((option) => (
            <label
              key={option}
              className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded md:justify-center"
            >
              <input
                  type="checkbox"
                name={vital} 
                checked={formData[vital] === option}
                onChange={() => {
                  setFormData((prev: any) => ({
                    ...prev,
                    [vital]: option,
                  }));
                }}
                className="mr-2 accent-purple-600"
              />
              {option}
            </label>
          ))}
        </div>
    
        {formData[vital] === "Specify Time" && (
          <input
            type="time"
            placeholder="Specify time"
            className="w-[150px] border rounded-lg p-2 mt-2"
            value={formData[`${vital}Time`] || ""}
            onChange={(e) => handleChange(`${vital}Time`, e.target.value)}
          />
        )}
      </div>
    ))}

  </div>
  }
 <div className={`flex items-center justify-between w-full  ${MinimiseOptions.Vitals===false?"mt-0":"mt-12"}`}>
     {MinimiseOptions.Vitals  && (
    <button
      className="bg-white/30 backdrop-blur-md border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200"
        type="button"
      onClick={()=>setRemarkStatus((prev)=>({...prev,Vitals :!RemarkStatus.Vitals }))}
    >
      {RemarkStatus.Vitals ?"SAVE Remark":"Add Remarks"}
    </button>
  )}

  {RemarkStatus.Vitals &&<textarea
  rows={4}
  placeholder="Enter your remarks here..."
  className="w-[400px] p-3 border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
  value={formData.Vitalsremarks || ""}
  onChange={(e) => handleChange("Vitalsremarks", e.target.value)}
/>
}
<div className="ml-auto">
 <button
  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-3 cursor-pointer py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out  md:w-auto"
    type="button"
  onClick={()=>setMinimizeOptions((prev:any)=>({...prev,Vitals:!MinimiseOptions.Vitals}))}
>
   {MinimiseOptions.Vitals?"Hide":"Show"}
</button>
</div>
</div>
</div>

<div   className={`bg-white flex flex-col rounded-lg shadow p-4 space-y-2 ${MinimiseOptions.Elimination===false?"md:col-span-1":"md:col-span-3"} ${MinimiseOptions.Elimination===false&&'h-[110px]'}`}>
  
  <h2 className="text-lg font-semibold text-teal-600">Elimination</h2>
  {MinimiseOptions.Elimination&&
  <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between md:gap-0 gap-2 md:h-[50px] w-full">
    
    <div className={`flex flex-col w-full ${formData.Patient_Indipendent_Elimination==='No'?"md:w-[20%]":'md:w-[50%]'} md:h-[120px]`}>
      <h3 className="font-medium text-sm mb-2 md:text-center text-left">is Patient Indipendent of Elimination</h3>
      <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-2">
        {["Yes", "No"].map((option) => (
          <label
            key={option}
            className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded md:justify-center"
          >
            <input
              type="checkbox"
              name="Comode"
              checked={formData.Patient_Indipendent_Elimination === option}
              onChange={() => setFormData((prev: any) => ({ ...prev, Patient_Indipendent_Elimination: option }))}
              className="mr-2 accent-purple-600"
            />
            {option}
          </label>
        ))}
      </div>
</div>

    <div className={`flex flex-col w-full ${formData.Patient_Indipendent_Elimination==='No'?"md:w-[20%]":'md:w-[50%]'} md:h-[120px]`}>
     
      <h3 className="font-medium text-sm mb-2 md:text-center text-left">Comode</h3>
      <div className="flex flex-col md:flex-row  md:justify-center gap-2">
        {["Indian", "Western"].map((option) => (
          <label
            key={option}
            className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded md:justify-center"
          >
            <input
              type="checkbox"
              name="Comode"
              checked={formData.Comode === option}
              onChange={() => setFormData((prev: any) => ({ ...prev, Comode: option }))}
              className="mr-2 accent-purple-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>


{formData.Patient_Indipendent_Elimination==='No'&&
<div className="flex flex-col md:flex-row items-center justify-center gap-15">
    <div className="flex flex-col w-full md:w-[30%] md:h-[120px]">
      <h3 className="font-medium text-sm mb-2 md:text-center text-left">Diaper</h3>
      <div className="flex flex-col md:flex-row  md:justify-center gap-2">
        {["Yes", "No"].map((option) => (
          <label
            key={option}
            className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded md:justify-center"
          >
            <input
             type="checkbox"
              name="Diaper"
              checked={formData.Diaper === option}
              onChange={() => setFormData((prev: any) => ({ ...prev, Diaper: option }))}
              className="mr-2 accent-purple-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>


    <div className="flex flex-col w-full  md:h-[120px]">
      <h3 className="font-medium text-sm mb-2 md:text-center text-left">Urine</h3>
      <div className="flex flex-row md:flex-wrap md:justify-center gap-2">
        {["Bottle Collection", "Catheter", "Diaper"].map((option) => (
          <label
            key={option}
            className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded md:justify-center"
          >
            <input
              type="checkbox"
              name="Urine"
              checked={formData.Urine === option}
              onChange={() => setFormData((prev: any) => ({ ...prev, Urine: option }))}
              className="mr-2 accent-purple-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
      </div>
  }
  </div>}
<div className="flex items-center justify-between w-full mt-4">
    {MinimiseOptions.Elimination  && (
    <button
      className="bg-white/30 backdrop-blur-md border mt-4  border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200"
      onClick={()=>setRemarkStatus((prev)=>({...prev,Elimination :!RemarkStatus.Elimination }))}
    >
      {RemarkStatus.Elimination ?"SAVE Remark":"Add Remarks"}
    </button>
  )}

  {RemarkStatus.Elimination &&<textarea
  rows={4}
  placeholder="Enter your remarks here..."
  className="w-[400px] p-3 border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
  value={formData.Eliminationremarks || ""}
  onChange={(e) => handleChange("Eliminationremarks", e.target.value)}
/>
}
<div className="ml-auto">
 <button
  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-3 cursor-pointer py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out  md:w-auto"
    type="button"
  onClick={()=>setMinimizeOptions((prev:any)=>({...prev,Elimination:!MinimiseOptions.Elimination}))}
>
   {MinimiseOptions.Elimination?"Hide":"Show"}
</button>
</div>
</div>
</div>

<div className={`bg-white flex flex-col rounded-lg shadow p-4 space-y-2 ${MinimiseOptions.Mobility===false?"md:col-span-1":"md:col-span-3"} ${MinimiseOptions.Mobility===false&&'h-[110px]'}`}>
  <h2 className="text-lg font-semibold text-teal-600">Mobility</h2>
  {MinimiseOptions.Mobility&&
  <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between md:gap-0 gap-2 md:h-[90px] w-full">


    <div className="flex flex-col w-full md:w-[20%] md:h-[120px]">
      <h3 className="font-medium text-sm mb-2 md:text-center text-left">Passive Exercises</h3>
      <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-2">
        {["Repeat", "Hold each time", "Sets"].map((option) => (
          <label
            key={option}
            className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded md:justify-center"
          >
            <input
                    type="checkbox"
              name="PassiveExercises"
              checked={formData.PassiveExercises === option}
              onChange={() => setFormData((prev: any) => ({ ...prev, PassiveExercises: option }))}
              className="mr-2 accent-purple-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>

  
    <div className="flex flex-col w-full md:w-[20%] md:h-[120px]">
      <h3 className="font-medium text-sm mb-2 md:text-center text-left">Active Exercises</h3>
      <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-2">
        {["Repeat", "Hold each time", "Sets"].map((option) => (
          <label
            key={option}
            className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded md:justify-center"
          >
            <input
                    type="checkbox"
              name="ActiveExercises"
              checked={formData.ActiveExercises === option}
              onChange={() => setFormData((prev: any) => ({ ...prev, ActiveExercises: option }))}
              className="mr-2 accent-purple-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>

   
    <div className="flex flex-col w-full md:w-[15%] md:h-[120px]">
      <h3 className="font-medium text-sm mb-2 md:text-center text-left">Resisted Exercises</h3>
      <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-2">
        {["Repeat", "Hold each time", "Sets"].map((option) => (
          <label
            key={option}
            className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded md:justify-center"
          >
            <input
                 type="checkbox"
              name="ResistedExercises"
              checked={formData.ResistedExercises === option}
              onChange={() => setFormData((prev: any) => ({ ...prev, ResistedExercises: option }))}
              className="mr-2 accent-purple-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>

  
    <div className="flex flex-col w-full md:w-[10%] md:h-[120px]">
      <h3 className="font-medium text-sm mb-2 md:text-center text-left">Walking</h3>
      <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-2">
        {["Yes", "No"].map((option) => (
          <label
            key={option}
            className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded md:justify-center"
          >
            <input
                  type="checkbox"
              name="Walking"
              checked={formData.Walking === option}
              onChange={() => setFormData((prev: any) => ({ ...prev, Walking: option }))}
              className="mr-2 accent-purple-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
    <div className="flex flex-col w-full md:w-[20%] md:h-[120px]">
      <h3 className="font-medium text-sm mb-2 md:text-center text-left">Assistant Requirment</h3>
      <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-2">
        {["One Assistant Required", "Two Assistants Required", "Independent"].map((option) => (
          <label
            key={option}
            className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded md:justify-center"
          >
            <input
                  type="checkbox"
              name="Walking"
              checked={formData.AssistanceRequire === option}
              onChange={() => setFormData((prev: any) => ({ ...prev, AssistanceRequire: option }))}
              className="mr-2 accent-purple-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
     <div className="flex flex-col w-full md:w-[15%] md:h-[120px]">
      <h3 className="font-medium text-sm mb-2 md:text-center text-left">HIV Status</h3>
      <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-2">
        {['Positive','Negative','Prefer not to disclose'].map((option) => (
          <label
            key={option}
            className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded md:justify-center"
          >
            <input
                  type="checkbox"
              name="Walking"
              checked={formData.HIV === option}
              onChange={() => setFormData((prev: any) => ({ ...prev, HIV: option }))}
              className="mr-2 accent-purple-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>

  </div>}
 <div className="flex items-center justify-between w-full mt-4">
     {MinimiseOptions.Mobility  && (
    <button
      className="bg-white/30 backdrop-blur-md border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200"
        type="button"
      onClick={()=>setRemarkStatus((prev)=>({...prev,Mobility :!RemarkStatus.Mobility }))}
    >
      {RemarkStatus.Mobility ?"SAVE Remark":"Add Remarks"}
    </button>
  )}

  {RemarkStatus.Mobility &&<textarea
  rows={4}
  placeholder="Enter your remarks here..."
  className="w-[400px] p-3 border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
  value={formData.Mobilityremarks || ""}
  onChange={(e) => handleChange("Mobilityremarks", e.target.value)}
/>
}

<div className="ml-auto">
 <button
  className="bg-teal-600 hover:bg-teal-700  text-white font-semibold px-3 cursor-pointer py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out  md:w-auto"
   type="button"
 onClick={()=>setMinimizeOptions((prev:any)=>({...prev,Mobility:!MinimiseOptions.Mobility}))}
>
   {MinimiseOptions.Mobility?"Hide":"Show"}
</button>
</div>
</div>
</div>

<div className={`bg-white flex flex-col rounded-lg shadow p-4 space-y-2 ${MinimiseOptions.Medication===false?"md:col-span-1":"md:col-span-3"} ${MinimiseOptions.Medication===false&&'h-[110px]'}`}>
  <h2 className="text-lg font-semibold text-teal-600">Medication</h2>
 {MinimiseOptions.Medication &&<div>< MedicationSchedule/> <MobileMedicationSchedule/></div>}
 <div className="flex items-center justify-between w-full mt-4">
     {MinimiseOptions.Medication && (
    <button
      className="bg-white/30 backdrop-blur-md border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200"
        type="button"
      onClick={()=>setRemarkStatus((prev)=>({...prev,Medication :!RemarkStatus.Medication }))}
    >
      {RemarkStatus.Medication ?"SAVE Remark":"Add Remarks"}
    </button>
  )}

  {RemarkStatus.Medication &&<textarea
  rows={4}
  placeholder="Enter your remarks here..."
  className="w-[400px] p-3 border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
  value={formData.Mobilityremarks || ""}
  onChange={(e) => handleChange("Mobilityremarks", e.target.value)}
/>
}

<div className="ml-auto">
 <button
  className="bg-teal-600 hover:bg-teal-700  text-white font-semibold px-3 cursor-pointer py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out  md:w-auto"
    type="button"
  onClick={()=>setMinimizeOptions((prev:any)=>({...prev,Medication:!MinimiseOptions.Medication}))}
>
   {MinimiseOptions.Medication?"Hide":"Show"}
</button>
</div>
</div>
</div>

        <div id="Patient Details" className="bg-white rounded-lg shadow p-4 space-y-3 md:col-span-3">
          <h2 className="text-lg font-semibold text-teal-600">Weight</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {["<40","40", "50", "60", "70", "80", "90", "100", "110", "120", "120+"].map((w) => (
              <label key={w} className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded">
                <input
                  type="radio"
                  name="patientWeight"
                  value={w}
                  checked={
                    Number(formData.patientWeight) === Number(w) ||
                    Number(formData.patientWeight) === Number(w) + Number(addingWeight)||
                   formData.patientWeight === w
                
                  }
                  onChange={() => handleChange("patientWeight", w)}
                  className="mr-2 accent-purple-600"
                />
                {w} kg
              </label>
            ))}
          </div>
          {formData.patientWeight !== '<40' && formData.patientWeight !== '120+' &&
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((each: any) => (
              <button
                type="button"
                key={each}
                onClick={() => {
                  setaddingWeight(each);
                  const current = parseInt(formData.patientWeight || "0", 10) || 0;
                  handleChange("patientWeight", String(current + each));
                }}
                className="mt-3 px-2 py-1 bg-gray-400 text-white rounded-md text-[10px] sm:text-xs"
              >
                + {each} kg
              </button>
            ))}
         
          </div>}
             {formData.patientWeight && (
              <div className="flex justify-center">
              <p className="mt-3 w-[200px] text-center bg-pink-400  p-2 text-white rounded-md text-xs sm:text-sm">
                {formData.patientWeight}kg Patient Weight
              </p>
              </div>
            )}
                 <button   type="button" className="bg-white/30 backdrop-blur-md  border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={()=>setRemarkStatus((prev)=>({...prev,Weight :!RemarkStatus.Weight }))} > {RemarkStatus.Weight ?"SAVE Remark":"Add Remarks"} </button>
           {RemarkStatus.Weight &&<textarea
  rows={4}
  placeholder="Enter your remarks here..."
  className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
  value={formData.WeightRemarks || ""}
  onChange={(e) => handleChange("WeightRemarks", e.target.value)}
/>
}
        </div>

        <div id="Height" className="bg-white rounded-lg shadow p-4 space-y-3 md:col-span-2">
          <h2 className="text-lg font-semibold text-teal-600">Height</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {["4.0", "5.0", "6.0"].map((h) => (
              <label key={h} className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded">
                <input
                  type="radio"
                  name="patientHeight"
                  value={h}
                  checked={
                    Number(formData.patientHeight) === Number(h) ||
                    Number(formData.patientHeight) === Number(h) + Number(addedheight)
                  }
                  onChange={() => handleChange("patientHeight", h)}
                  className="mr-2 accent-purple-600"
                />
                {h} ft
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((each: any) => (
              <button
                type="button"
                key={each}
                onClick={() => {
                  setaddedheight(each);
                  const current = parseFloat(formData.patientHeight || "0") || 0;
                  handleChange("patientHeight", (current + each).toFixed(1));
                }}
                className="mt-3 px-2 py-1 bg-gray-500 text-white rounded-md text-[10px] sm:text-xs"
              >
                +{each} ft
              </button>
            ))}
            {formData.patientHeight && (
              <p className="mt-3 bg-pink-400 p-2 text-white rounded-md text-xs sm:text-sm">
                {formData.patientHeight}ft Patient Height
              </p>
            )}
          </div>
            <button   type="button" className="bg-white/30 backdrop-blur-md  border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={()=>setRemarkStatus((prev)=>({...prev,Height :!RemarkStatus.Height }))} > {RemarkStatus.Height ?"SAVE Remark":"Add Remarks"} </button>
           {RemarkStatus.Height &&<textarea
  rows={4}
  placeholder="Enter your remarks here..."
  className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
  value={formData.HeightRemarks || ""}
  onChange={(e) => handleChange("HeightRemarks", e.target.value)}
/>
}
        </div>

        <div id="Comfortable Languages" className="bg-white rounded-lg shadow p-4 space-y-3">
          <h2 className="text-lg font-semibold text-teal-600">Comfortable Languages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {["Telugu", "Hindi", "English", "Other"].map((lang) => (
              <div key={lang} className="flex flex-col">
                <label className="flex items-center text-sm bg-purple-50 px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={
                      lang === "Other"
                        ? formData.comfortableLanguages.some((l: string) =>
                            l.startsWith("Other")
                          )
                        : formData.comfortableLanguages.includes(lang)
                    }
                    onChange={() => {
                      if (lang === "Other") {
                        setFormData((prev: any) => {
                          const hasOther = prev.comfortableLanguages.some((l: string) =>
                            l.startsWith("Other")
                          );
                          return {
                            ...prev,
                            comfortableLanguages: hasOther
                              ? prev.comfortableLanguages.filter(
                                  (l: string) => !l.startsWith("Other")
                                )
                              : [...prev.comfortableLanguages, "Other:"],
                          };
                        });
                      } else {
                        handleCheckboxChange("comfortableLanguages", lang);
                      }
                    }}
                    className="mr-2 accent-purple-600"
                  />
                  {lang}
                </label>
                {lang === "Other" &&
                  formData.comfortableLanguages.some((l: string) =>
                    l.startsWith("Other")
                  ) && (
                    <input
                      type="text"
                      placeholder="Enter Other Language"
                      className="mt-1 w-full border rounded-lg p-2 text-sm"
                      value={
                        formData.comfortableLanguages.find((l: string) =>
                          l.startsWith("Other")
                        )?.replace("Other:", "") || ""
                      }
                      onChange={(e) => {
                        const customValue = `Other:${e.target.value}`;
                        setFormData((prev: any) => {
                          const filtered = prev.comfortableLanguages.filter(
                            (l: string) => !l.startsWith("Other")
                          );
                          return {
                            ...prev,
                            comfortableLanguages: [...filtered, customValue],
                          };
                        });
                      }}
                    />
                  )}
              </div>
            ))}
          </div>
        </div>

        {[
          {
            title: "Home Assistance",
            field: "patientHomeAssistance",
            options: ["Diaper", "Bathing", "Bedding", "Brushing"],
          },
          {
            title: "Home Needs",
            field: "patientHomeNeeds",
            options: ["Diaper", "BP Monitor", "Sugar Monitor", "Water Bed"],
          },
          {
            title: "Doctor Needs",
            field: "patientDrNeeds",
            options: ["Medical Dr.", "Physio", "SLT", "BT", "OT"],
          },
          {
            title: "Health Card",
            field: "patientHealthCard",
            options: [
              "Diabetic",
              "Blood Pressure",
              "Surgery – Hip, Knee, Shoulder etc",
              "Dementia",
              "Paralysis",
            ],
          },
          {
            title: "HCP Type",
            field: "hcpType",
            options: ["HCA", "HCN", "Physio", "SLT", "BT", "OT", "Medical Equipment"],
          },
        ].map((section: any) => (
  <div key={section.field} id={section.title} className="bg-white rounded-lg shadow p-4 space-y-2">
    <h2 className="text-lg font-semibold text-teal-600">{section.title}</h2>
    {section.options.map((opt: any) => (
      <label key={opt} className="flex items-center text-sm">
        <input
          type="checkbox"
          checked={formData[section.field]?.includes(opt)}
          onChange={() => handleCheckboxChange(section.field, opt)}
          className="mr-2 accent-purple-600"
        />
        {opt}
      </label>
    ))}

    <button
      className="bg-white/30 backdrop-blur-md mt-5 border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200"
        type="button"
      onClick={() =>
  setRemarkStatus(prev => ({
    ...prev,
    [section.field as keyof RemarkStatusType]: !prev[section.field as keyof RemarkStatusType],
  }))
}

    >
      {RemarkStatus[section.field as keyof RemarkStatusType] ? "SAVE Remark" : "Add Remarks"}
    </button>

    {RemarkStatus[section.field as keyof RemarkStatusType] && (
      <textarea
        rows={4}
        placeholder="Enter your remarks here..."
        className="w-[400px] p-3 mt-2 border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
        value={formData[`${section.field}Remarks`] || ""}
        onChange={(e) => handleChange(`${section.field}Remarks`, e.target.value)}
      />
    )}

    {section.title === "Doctor Needs" && (
      <div className="flex flex-col gap-2">
        {formData.patientDrNeeds.map((each: string) => {
          if (each === "Medical Dr.") {
            return (
              <select
                key="MedicalDr"
                className="w-full border rounded-lg p-2"
                onChange={(e) => handleChange("MedicalDrSpecialisation", e.target.value)}
              >
                <option>Choose Medical Dr specialization</option>
                {medicalSpecializations.map((spec) => <option key={spec}>{spec}</option>)}
              </select>
            );
          } else if (each === "Physio") {
            return (
              <select
                key="Physio"
                className="w-full border rounded-lg p-2"
                onChange={(e) => handleChange("PhysiotherapySpecialisation", e.target.value)}
              >
                <option>Choose Physiotherapy specialization</option>
                {physioSpecializations.map((spec) => <option key={spec}>{spec}</option>)}
              </select>
            );
          }
          return null;
        })}
      </div>
    )}
  </div>
))}


        <div id="Charges" className="bg-white rounded-lg shadow p-4 space-y-2">
          <h2 className="text-lg font-semibold text-teal-600">Charges</h2>
          {["₹1200", "₹1000", "₹900", "Other"].map((charge) => (
            <div key={charge} className="flex flex-col">
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="serviceCharges"
                  value={charge}
                  checked={
                    formData.serviceCharges === charge ||
                    (charge === "Other" &&
                      !["₹1200", "₹1000", "₹900", "₹800"].includes(formData.serviceCharges))
                  }
                  onChange={() =>
                    handleChange("serviceCharges", charge === "Other" ? "" : charge)
                  }
                  className="mr-2 accent-purple-600"
                />
                {charge}
              </label>
              {charge === "Other" &&
                !["₹1200", "₹1000", "₹900", "₹800"].includes(formData.serviceCharges) && (
                  <input
                    type="text"
                    placeholder="Enter Other Amount"
                    className="mt-1 w-full border rounded-lg p-2 text-sm"
                    value={formData.serviceCharges}
                    onChange={(e) => handleChange("serviceCharges", e.target.value)}
                  />
                )}
            </div>
          ))}
          <p>Registration Charger: 1500</p>
          <div className="flex justify-between">
<p className="border flex items-center p-2 rounded-md">Total Amount: {  formData.serviceCharges==="Other"?1500:(parseFloat(formData.serviceCharges.replace(/[^0-9.]/g, '')) || 0) + DiscountPrice}</p>

 <button
    type="button"
    className="bg-green-800 hover:bg-green-600 cursor-pointer text-white font-semibold px-4 py-2 rounded-lg shadow transition-colors duration-200" onClick={()=>setDiscountPrice(0)}
  >
    Discount
  </button>
  </div>
          <p className="text-red-500">{WarningMessage}</p>
        </div>

        <div id="Additional Comments" className="flex flex-col md:ml-2  md:w-[400px] ">
          

          <label className="font-bold mb-2 text-teal-600">Additional Comments</label>
          <textarea
            onChange={(e) => handleChange("AdditionalComments", e.target.value)}
            className="border-2 border-gray-400 rounded-md p-2 "
            rows={4}
            placeholder="Enter your comments here..."
          />
        </div>

<div className="flex flex-col flex-wrap items-center justify-center">
<div className="w-full md:w-[330px] mr-[20px] max-w-sm mx-auto p-6  rounded-2xl shadow-lg flex flex-col items-center gap-4 sm:max-w-md md:max-w-lg">
  <p className="text-lg font-semibold text-gray-800 tracking-tight">Add CallBack Reminder</p>

  <div className="flex flex-col sm:flex-row w-full gap-4">
    <input
      type="time"
       onChange={(e) => handleChange("RemainderTime", e.target.value)}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
    />

    <input
      type="date"
       onChange={(e) => handleChange("RemainderDate", e.target.value)}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
    />
  </div>
</div>

     <p className="text-lg md:ml-40 text-center font-semibold text-gray-800 m-2 flex">Update Client Status</p>
        <div className="flex flex-wrap justify-start md:justify-end items-end gap-2 md:gap-4  md:w-[600px] m-2">
       
          {ClientEnquiry_Filters.map((each: string, i: number) => (
            <button
              key={i}
                type="button"
              className={` md:px-1 px-1 text-[15px] md:text-[15px]  sm:py-2 text-center ${
                each === formData.ClientStatus && "border-2"
              } h-7 md:h-10 rounded-md shadow cursor-pointer ${
                filterColors[each] || "bg-gray-200 text-gray-800"
              }`}
              onClick={()=>handleChange("ClientStatus",each)}
            >
              {each}
            </button>
          ))}
        </div>
        </div>
      </div>

      <div className="text-center">
        <p
          className={`${
  statusMessage === "Your Lead Registration Completed,Riderecting to Admin Page..."
    ? "text-green-800"
    : statusMessage === "Please Select Client Status"
    ? "text-red-600"
    : "text-gray-600"
}`}

        >
          {statusMessage}
        </p>
        
        <button
          type="submit"
          className="px-4 md:mb-2 sm:px-6 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 cursor-pointer transition"
        >
          Submit Enquiry
        </button>
      </div>
    </form>
      </div>
  );
}
