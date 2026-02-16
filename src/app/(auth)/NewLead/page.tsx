"use client";

import { LoadingData } from "@/Components/Loading/page";
import MobileMedicationSchedule from "@/Components/MedicationMobileView/page";
import MedicationSchedule from "@/Components/Medications/page";
import { normalizeDate } from "@/Lib/Actions";
import { ClientEnquiry_Filters, filterColors, Headings, Health_Card, healthcareServices, HomeAssistance, hyderabadAreas, indianFamilyRelations, IndianLanguages, LeadSources, Main_Filters, medicalSpecializations, Patient_Home_Supply_Needs, patientCategories, physioSpecializations, SERVICE_SUBTYPE_MAP,  } from "@/Lib/Content";
import { GetRegidterdUsers, GetUserInformation, UpdateNewLeadInformation } from "@/Lib/user.action";
import { Refresh, Update_Current_Client_Status, Update_Main_Filter_Status, UpdateFetchedInformation } from "@/Redux/action";
import { a } from "framer-motion/client";
import { AlertCircle, Info, ListFilter, LogOut, PhoneCall, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
type ServiceWithSubType = keyof typeof SERVICE_SUBTYPE_MAP;

type FormData = {
  hcpType: string[];
  serviceSubTypes: Partial<Record<ServiceWithSubType, string>>;
};

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
    serviceSubTypes:{},
    NumberOfCareTakers:{},
    OnCallSerive:'',
    sessions:{},
    ServiceWorkingHours:{},
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
    Temperature: '',
    Pulse: '',
    OxygenSaturation: '',
    BloodPressure: '',
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
    Current_Previous_Occupation: "",
    Hobbies: [],
    Present_Illness: "",
    Speciality_Areas: "",
    OnGoing_Treatment: "",
    Balance: "",
    History_of_Fall: "",
    Hearing_Loss: "",
    Visual_Impairment: "",
    Depression: "",
    Confusion: "",
    Frequent_Urination: "",
    Sleep_Issues: "",
    Anxiety: "",
    Mobility_Aids: "",
    Breathing_Equipment: "",
    Feeding_Method: "",
    Floor_Type: "",
    Washroom_Accessories: "",
    PhysioScore: 0,
    PresentHealthRemarks: '',
    TreatmentRemarks: "",
    FunctionalAssessmentsRemarks: "",
    EquipmentRemark: "",
    VerificationStatus: "Pending",
    TermsAndConditions: "Accepted",
    EmailVerification: true,
    FinelVerification: false,
    LeadDate: new Date().toISOString(),
    ServiceArea: '',
    ClientStatus: "Waiting List",
  });
  const [heightCm, setHeightCm] = useState("");

  const [DiscountStatus, SetDiscountStatus] = useState(true)
  const [visible, setVisible] = useState(true);
  const [WarningMessage, setWarningMessage] = useState("");
  const [DiscountPrice, setDiscountPrice] = useState<any>(1500)
  const [ClientDiscount, SetClientDiscount] = useState<any>(0)
  const [PhysioScore, SetPhysioScore] = useState(0)
  const [addingWeight, setaddingWeight] = useState<any>("");
  const [ShowOtherOnGoinCall,setShowOtherOnGoinCall]=useState(false)
  const [ShowOtherServiceArea,setShowOtherServiceArea]=useState(false)
  const [statusMessage, setStatusMessage] = useState("");
  const [addedheight, setaddedheight] = useState<any>();
  const [FetchedInfo,setFetchedInfo]=useState<any>()
  const [TimeStameDetails, setTimeStameDetails] = useState("setTimeStameDetails")
  const [showTooltip, setShowTooltip] = useState(false);
  const [ImportedVendors, setImportedVendors] = useState<any>([])
  const [isChecking, setIsChecking] = useState(true);
  const [MinimiseOptions, setMinimizeOptions] = useState({ Hygiene: false, Nutrition: false, Vitals: false, Elimination: false, Mobility: false, Medication: false })
  const [RemarkStatus, setRemarkStatus] = useState({
    Hygiene: false, Nutrition: false, Vitals: false, Elimination: false, Mobility: false, ClientCard: false, PatientCard: false, PatientDetails: false, Weight: false, Height: false, patientHomeAssistance: false,
    patientHomeNeeds: false,
    patientDrNeeds: false,
    patientHealthCard: false,
    hcpType: false,
    Medication: false
  })
  const [Options, setOptions] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const MedicationData = useSelector((each: any) => each.MedicationInfo)
  const PDRFilledUser=useSelector((each:any)=>each.FillPdrUserId)
  const FinelPostingData = { ...formData, serviceCharges: formData.serviceCharges, RegistrationFee: DiscountPrice - ClientDiscount, Medications: MedicationData }

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
const extractOtherValue = (value: string) =>
  value.startsWith("Other:")
    ? value.slice(6)
    : "";
const allowedServices = [
  "Healthcare Assistant Service (HCAS)",
  "Healthcare Nursing Service (HCNS)",
  "Oncall Service (OCS)",
];

const handleOtherChange = (field: string, value: string) => {
  setFormData((prev: any) => {
    const raw = prev[field];
    const values = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.values)
      ? raw.values
      : [];

    const filtered = values.filter((v: string) => !v.startsWith("Other:"));

    return {
      ...prev,
      [field]: value
        ? [...filtered, `Other: ${value}`]
        : [...filtered, "Other:"],
    };
  });
};
const toProperCaseLive = (value: string) => {
  const endsWithSpace = value.endsWith(" ");

  const formatted = value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(" ")
    .map(word =>
      word ? word.charAt(0).toUpperCase() + word.slice(1) : ""
    )
    .join(" ");

  return endsWithSpace ? formatted + " " : formatted;
};




  useEffect(() => {
    const Fetch = async () => {
      const localValue = localStorage.getItem('UserId');
      const [Sign_in_UserInfo, RegisterdUsers,GetUserInfo] = await Promise.all([
        GetUserInformation(localValue),
        GetRegidterdUsers(),
        GetUserInformation(PDRFilledUser)
      ]);
      setImportedVendors(RegisterdUsers.filter((each: any) => each.userType === "Vendor"))
      setTimeStameDetails(`${Sign_in_UserInfo?.FirstName} ${Sign_in_UserInfo.LastName}, Email: ${Sign_in_UserInfo.Email}`)
     console.log('Check for Post Datat-----', GetUserInfo
)
setFetchedInfo(GetUserInfo)
setFormData({...formData,clientPhone:GetUserInfo?.ContactNumber,
clientEmail:GetUserInfo?.Email,
clientName:GetUserInfo?.FirstName,
NewLead:GetUserInfo?.LeadDate,
ClientStatus:GetUserInfo?.ClientStatus,
Source:GetUserInfo?.NewLead,
patientWeight:GetUserInfo?.patientWeight,
serviceCharges:GetUserInfo?.serviceCharges,
  patientHealthCard: GetUserInfo?.HealthCard
    ? GetUserInfo.HealthCard.split(",").map((v: string) => v.trim())
    : [],
  comfortableLanguages: GetUserInfo?.PreferredLanguage
    ? GetUserInfo.PreferredLanguage.split(",").map((v: string) => v.trim())
    : [],
ServiceArea:GetUserInfo?.Location,
hcpType: Array.isArray(GetUserInfo?.ServiceType)
  ? GetUserInfo.ServiceType
  : typeof GetUserInfo?.ServiceType === "string"
    ? GetUserInfo.ServiceType.split(",").map((v: string) => v.trim())
    : [],







})

    }
    Fetch()
    setIsChecking(false)
  }, [])
const handleCheckboxChange = (field: string, option: string) => {
  setFormData((prev: any) => {
    const raw = prev[field];
    const values = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.values)
      ? raw.values
      : [];

    if (option === "Other") {
      const hasOther = values.some((v: string) => v.startsWith("Other:"));

      return {
        ...prev,
        [field]: hasOther
          ? values.filter((v: string) => !v.startsWith("Other:"))
          : [...values, "Other:"],
      };
    }

    return {
      ...prev,
      [field]: values.includes(option)
        ? values.filter((v: string) => v !== option)
        : [...values, option],
    };
  });
};

const handleCmChange = (value: string) => {
  setHeightCm(value);

  const cm = parseFloat(value);
  if (!cm || cm <= 0) return;


  const feet = cm / 30.48;

  setaddedheight(""); 
  handleChange("patientHeight", feet.toFixed(1));
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
    dispatch(Update_Main_Filter_Status(""))
    router.push('/DashBoard');
 dispatch(Refresh(""))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ClientStatus || formData.ClientStatus.trim() === "") {
      setStatusMessage("Please Select Client Status");
      return;
    }
    setStatusMessage("Please Wait...");
    const generatedUserId = uuidv4();

    const FinelPostingData = { ...formData, serviceCharges: formData.serviceCharges?formData.serviceCharges:FetchedInfo.serviceCharges, RegistrationFee: DiscountPrice - ClientDiscount?DiscountPrice - ClientDiscount:FetchedInfo.RegistrationFee, Medications: MedicationData, userId: FetchedInfo.userId, SuitableHCP: "" }
console.log("Check Response-----",FinelPostingData)
    const PostResult = await UpdateNewLeadInformation(FinelPostingData);
    if (PostResult.success) {
     
        const data = await GetUserInformation(FetchedInfo.userId);

      setStatusMessage(`${PostResult.message},Riderecting to PDR....`);

      dispatch(
        UpdateFetchedInformation({
          ...data,
          updatedAt: normalizeDate(data?.updatedAt),
          createdAt: normalizeDate(data?.createdAt),
        })
      );

      router.push("/PDR");
     
      
      // dispatch(Update_Current_Client_Status(formData.ClientStatus))
      // const Timer = setInterval(() => {
      //   router.push("/AdminPage")
      // }, 1200)

      // return () => clearInterval(Timer)
    }
  };
const requiresSubType = (hcpTypes = []) => {
  const servicesWithSubTypes = [
    "Physiotherapy Service (PTS)",
    "Behaviour Health Service (BHS)",
    "Occupational Therapy Service (OTS)",
    "Speech & Language Therapy Service (SPTS)"
  ];

  return hcpTypes.some(type => servicesWithSubTypes.includes(type));
};
const hasSubTypes = (service: any): service is ServiceWithSubType => {
  return service in SERVICE_SUBTYPE_MAP;
};


  const FilterdImportedVendorName = ImportedVendors.map((each: any) => each.VendorName)
    if (isChecking) {
      return (
        <LoadingData/>
      );
    }
  
  return (
    <div

      className="w-full   bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-xl flex flex-col gap-6"
    >
      <div className="sticky top-0 z-50 bg-gray-50 flex items-center w-full gap-2 sm:gap-4 p-2">

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <ListFilter type="button" className="cursor-pointer" onClick={() => setOptions(prev => !prev)} />

          <img
            src="/Icons/Curate-logo.png"
            alt="Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-rose-500 p-2 shadow-sm"
          />

          <h1 className="text-base sm:text-lg md:text-xl font-medium text-[#ff1493] tracking-wide leading-snug flex items-center justify-center gap-2">
            Call Enquiry & Firsthand Info  <p
            className={`${statusMessage === "Your Lead Registration Completed,Riderecting to Admin Page..."
                ? "text-green-800"
                : statusMessage === "Please Select Client Status"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}

          >
            {statusMessage}
          </p>
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
                onClick={() => UpdatePreview(each)}
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
  value={formData.clientName || ""}
  onChange={(e) =>
    handleChange("clientName", toProperCaseLive(e.target.value))
  }
/>


            <input
              type="text"
              placeholder="Client Phone"
              className="w-full border rounded-lg p-2"
              value={formData.clientPhone||''}
              onChange={(e) => handleChange("clientPhone", e.target.value)}
            />
            <input
              type="email"
              placeholder="Client Email"
              className="w-full border rounded-lg p-2"
              value={formData.clientEmail||""}
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
            <div>
              <div>
  <p>Relation to Patient</p>

  {(() => {
    const inputValue =
      typeof formData.RelationtoPatient === "string"
        ? formData.RelationtoPatient
        : "";

    const filteredSuggestions =
      inputValue.trim() === "" ||
      indianFamilyRelations.some(
        (item: string) =>
          item.toLowerCase() === inputValue.toLowerCase()
      )
        ? []
        : indianFamilyRelations.filter((item: string) =>
            item.toLowerCase().includes(inputValue.toLowerCase())
          );

    return (
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Type Relation"
          value={inputValue}
          onChange={(e) =>
            handleChange("RelationtoPatient", e.target.value)
          }
          className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {filteredSuggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto">
            {filteredSuggestions.map((s: string) => (
              <div
                key={s}
                onClick={() =>
                  handleChange("RelationtoPatient", s)
                }
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })()}
</div>


            </div>
        <div>
<p className="flex items-center gap-2 font-medium relative">
  Lead Source :

  <span className="relative group inline-flex">
    <AlertCircle
      size={16}
      className="text-red-500 cursor-pointer"
    />

    <span
      className="
        absolute left-1/2 top-full mt-2 -translate-x-1/2
        w-72
        rounded-lg bg-gray-900 text-white text-xs
        px-3 py-2
        opacity-0 scale-95
        group-hover:opacity-100 group-hover:scale-100
        transition-all duration-200
        shadow-lg
        z-50 pointer-events-none
      "
    >
      This is a key field. All salary calculations are derived based on the selected name.
    </span>
  </span>
</p>


  {(() => {
    const options = [...FilterdImportedVendorName, ...LeadSources];

    const inputValue =
      typeof formData.Source === "string" ? formData.Source : "";

    const filteredSuggestions =
      inputValue.trim() === "" ||
      options.some(
        (item: string) =>
          item.toLowerCase() === inputValue.toLowerCase()
      )
        ? []
        : options.filter((item: string) =>
            item.toLowerCase().includes(inputValue.toLowerCase())
          );

    return (
      <div className="relative w-full">
        <input
          type="text"
          
          placeholder="Type Lead"
          value={inputValue||formData.Source||''}
          onChange={(e) =>
            handleChange("Source", e.target.value)
          }
          className="w-full border rounded-md text-center py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {filteredSuggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto">
            {filteredSuggestions.map((s: string) => (
              <div
                key={s}
                onClick={() =>
                  handleChange("Source", s)
                }
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 text-center"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })()}

  {formData.Source === "Other" && (
    <input
      type="text"
      placeholder="Enter New Lead Name"
      className="w-[300px] border rounded-lg p-2 m-2"
      value={formData.Source||''}
      onChange={(e) => handleChange("Source", e.target.value)}
    />
  )}
</div>

            <div className="flex flex-col gap-2 max-w-xs">

              <label className="flex items-center gap-2 font-medium relative">

                Lead Date
              </label>


              <input
                type="date"
                value={ formData.NewLead||''}
                className="
      h-11 w-full px-4
      rounded-xl
      bg-white
      border border-slate-300
      text-sm font-medium text-slate-700
      shadow-sm

      transition-all duration-200 ease-in-out

      hover:border-slate-400 hover:shadow-md
      focus:outline-none
      focus:border-[#62e0d9]
      focus:ring-2 focus:ring-[#caf0f8]
    "
                onChange={(e) => handleChange("LeadDate", e.target.value)}
              />

            </div>


            {/* <button type="button" className="bg-white/30 backdrop-blur-md border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={() => setRemarkStatus((prev) => ({ ...prev, ClientCard: !RemarkStatus.ClientCard }))} > {RemarkStatus.ClientCard ? "SAVE Remark" : "Add Remarks"} </button>
            {RemarkStatus.ClientCard && <textarea
              rows={4}
              placeholder="Enter your remarks here..."
              className="w-[400px] p-3 border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
              value={formData.ClientCardRemarks || ""}
              onChange={(e) => handleChange("ClientCardRemarks", toProperCaseLive(e.target.value))}
            />
            } */}
          </div>

          <div id="Patient Card – ID" className="bg-white rounded-lg shadow p-4 flex flex-col space-y-3">
            <h2 className="text-lg font-semibold text-teal-600">Patient Card – ID</h2>
            <input
              type="text"
              placeholder="Patient Name"
              className="w-full border rounded-lg p-2"
              value={formData.patientName||''}
              onChange={(e) => handleChange("patientName", toProperCaseLive(e.target.value))}

            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full border rounded-lg p-2"
              value={formData.patientPhone||''}
              onChange={(e) => handleChange("patientPhone", e.target.value)}
            />
            <input
              type="number"
              placeholder="Age"
              className="w-full border rounded-lg p-2"
              value={formData.patientAge||''}
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
              {/* <button type="button" className="bg-white/30 backdrop-blur-md  border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={() => setRemarkStatus((prev) => ({ ...prev, PatientCard: !RemarkStatus.PatientCard }))} > {RemarkStatus.PatientCard ? "SAVE Remark" : "Add Remarks"} </button>
              {RemarkStatus.PatientCard && <textarea
                rows={4}
                placeholder="Enter your remarks here..."
                className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
                value={formData.PatientCardCardRemarks || ""}
                onChange={(e) => handleChange("PatientCardCardRemarks", toProperCaseLive(e.target.value))}
              />
              } */}
            </div>

          </div>

          <div className="bg-white rounded-lg shadow p-4 space-y-3">
            <h2 className="text-lg font-semibold text-teal-600">Patient Details</h2>
            <div>
  <h3 className="font-medium text-sm">Patient Type</h3>

  {(() => {
    const patientTypeOptions = [
      "Independent Patients",
      "Support Care Patients",
      "Wheel Chair - self propel",
      "Wheel Chair - Dependent",
      "Semi Bedridden - Limited Mobility",
      "Completely Bedridden",
      "Paralysis/Stroke Patients",
      "Post Surgery care",
      "Fractures/Injury",
    ];

    const inputValue = formData.patientType || "";

 const filteredSuggestions =
  inputValue.trim() === "" ||
  patientTypeOptions.some(
    (item) => item.toLowerCase() === inputValue.toLowerCase()
  )
    ? []
    : patientTypeOptions.filter((item) =>
        item.toLowerCase().includes(inputValue.toLowerCase())
      );


    return (
      <div className="relative w-[90%]">
        <input
          type="text"
          placeholder="Enter Patient Type"
          value={inputValue}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              patientType: e.target.value,
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {filteredSuggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto">
            {filteredSuggestions.map((s) => (
              <div
                key={s}
                onClick={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    patientType: s,
                  }))
                }
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })()}
</div>

           <div>
  <h3 className="font-medium text-sm">Current Location</h3>

  {(() => {
    const locationOptions = ["Hospital", "Rehab", "Home",];

    const inputValue =
      typeof formData.patientCurrentLocation === "string"
        ? formData.patientCurrentLocation
        : "";

    const filteredSuggestions =
      inputValue.trim() === "" ||
      locationOptions.some(
        (item) => item.toLowerCase() === inputValue.toLowerCase()
      )
        ? []
        : locationOptions.filter((item) =>
            item.toLowerCase().includes(inputValue.toLowerCase())
          );

    return (
      <div className="relative w-[90%]">
        <input
          type="text"
          placeholder="Enter location"
          value={inputValue}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              patientCurrentLocation: e.target.value,
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {filteredSuggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto">
            {filteredSuggestions.map((s) => (
              <div
                key={s}
                onClick={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    patientCurrentLocation: s,
                  }))
                }
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })()}
</div>

            <div>
              <h3 className="font-medium text-sm">Service Location</h3>
              <input
                type="text"
                placeholder="Enter Service Location"
                className="w-full border rounded-lg p-2"
                value={formData.serviceLocation||''}
                onChange={(e) => handleChange("serviceLocation", toProperCaseLive(e.target.value))}

             
              />
            </div>
          <div className="flex flex-col gap-2 max-w-xs">
  <label className="font-medium text-sm tracking-wide text-gray-800">
    Service Area
  </label>

  {(() => {
    const inputValue =
      typeof formData.ServiceArea === "string"
        ? formData.ServiceArea
        : "";

    const filteredSuggestions =
      inputValue.trim() === "" ||
      hyderabadAreas.some(
        (item: any) => item.toLowerCase() === inputValue.toLowerCase()
      )
        ? []
        : hyderabadAreas.filter((item: any) =>
            item.toLowerCase().includes(inputValue.toLowerCase())
          );

    return (
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Type service area"
          value={inputValue}
          onChange={(e) =>
            setFormData({
              ...formData,
              ServiceArea: toProperCaseLive(e.target.value),
            })
          }
          className="
            h-11 w-full px-4
            rounded-xl
            bg-white
            border border-slate-300
            text-sm font-medium text-slate-700
            shadow-sm
            transition-all duration-200 ease-in-out
            hover:border-slate-400 hover:shadow-md
            focus:outline-none
            focus:border-[#62e0d9]
            focus:ring-2 focus:ring-[#caf0f8]
          "
        />

        {filteredSuggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-md max-h-52 overflow-y-auto">
            {filteredSuggestions.map((s: any) => (
              <div
                key={s}
                onClick={() =>
                  setFormData({
                    ...formData,
                    ServiceArea: s,
                  })
                }
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })()}
</div>

            {/* <button type="button" className="bg-white/30 backdrop-blur-md mt-20 border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={() => setRemarkStatus((prev) => ({ ...prev, PatientDetails: !RemarkStatus.PatientDetails }))} > {RemarkStatus.PatientDetails ? "SAVE Remark" : "Add Remarks"} </button>
            {RemarkStatus.PatientDetails && <textarea
              rows={4}
              placeholder="Enter your remarks here..."
              className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
              value={formData.PatientDetailsCardRemarks || ""}
              onChange={(e) => handleChange("PatientDetailsCardRemarks", toProperCaseLive(e.target.value))}
            />
            } */}


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
                      Number(formData.patientWeight) === Number(w) ||
                      Number(formData.patientWeight) === Number(w) + Number(addingWeight) ||
                      formData.patientWeight === w

                    }
                    onChange={() =>{setaddingWeight(""); handleChange("patientWeight", w)}}
                    className="mr-2 accent-purple-600"
                  />
                  {w} kg
                </label>
              ))}
            </div>
          {formData.patientWeight !== "<40" && formData.patientWeight !== "120+" && (
  <div className="flex flex-wrap gap-2 items-center justify-center">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((each: number) => {
      const isActive = addingWeight === each;

      return (
        <button
          type="button"
          key={each}
          onClick={() => {
            setaddingWeight(each);
            const current =
              parseInt(formData.patientWeight || "0", 10) || 0;
            handleChange("patientWeight", String(current + each));
          }}
          className={`
            mt-3 px-3 py-1.5
            rounded-lg text-[10px] sm:text-xs font-semibold
            transition-all duration-200

           ${
            isActive
              ? "bg-white text-gray-800 border border-gray-400 shadow-sm"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }
          `}
        >
          + {each} kg
        </button>
      );
    })}
  </div>
)}

            {formData.patientWeight && (
              <div className="flex justify-center">
                <p className="mt-3 w-[200px] text-center bg-pink-400  p-2 text-white rounded-md text-xs sm:text-sm">
                  {formData.patientWeight}kg Patient Weight
                </p>
              </div>
            )}
            {/* <button type="button" className="bg-white/30 backdrop-blur-md  border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={() => setRemarkStatus((prev) => ({ ...prev, Weight: !RemarkStatus.Weight }))} > {RemarkStatus.Weight ? "SAVE Remark" : "Add Remarks"} </button>
            {RemarkStatus.Weight && <textarea
              rows={4}
              placeholder="Enter your remarks here..."
              className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
              value={formData.WeightRemarks || ""}
              onChange={(e) => handleChange("WeightRemarks", toProperCaseLive(e.target.value))}
            />
            } */}
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
                    onChange={() =>{setaddedheight(""); handleChange("patientHeight", h)}}
                    className="mr-2 accent-purple-600"
                  />
                  {h} ft
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-center">
             <div className="flex flex-wrap gap-2 items-center justify-center">
  {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((each: number) => {
    const isActive = addedheight === each;

    return (
      <button
        type="button"
        key={each}
        onClick={() => {
          setaddedheight(each);
          const current =
            parseFloat(formData.patientHeight || "0") || 0;
          handleChange(
            "patientHeight",
            (current + each).toFixed(1)
          );
        }}
        className={`
          mt-3 px-3 py-1.5
          rounded-lg text-[10px] sm:text-xs font-semibold
          transition-all duration-200

          ${
            isActive
              ? "bg-white text-gray-800 border border-gray-400 shadow-sm"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }
        `}
      >
        +{each} ft
      </button>
    );
  })}
</div>

              {formData.patientHeight && (
                <p className="mt-3 bg-pink-400 p-2 text-white rounded-md text-xs sm:text-sm">
                  {formData.patientHeight}ft Patient Height
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-col items-center gap-1">
  <label className="text-xs font-semibold text-gray-600">
    Enter Height (CM)
  </label>

  <input
    type="number"
    placeholder="e.g. 170"
    value={heightCm}
    onChange={(e) => handleCmChange(e.target.value)}
    className="w-[130px] px-3 py-1.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
  />
</div>

            {/* <button type="button" className="bg-white/30 backdrop-blur-md  border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={() => setRemarkStatus((prev) => ({ ...prev, Height: !RemarkStatus.Height }))} > {RemarkStatus.Height ? "SAVE Remark" : "Add Remarks"} </button>
            {RemarkStatus.Height && <textarea
              rows={4}
              placeholder="Enter your remarks here..."
              className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
              value={formData.HeightRemarks || ""}
              onChange={(e) => handleChange("HeightRemarks", toProperCaseLive(e.target.value))}
            />
            } */}
          </div>

         <div id="Comfortable Languages" className="bg-white rounded-lg shadow p-4 space-y-3">
  <h2 className="text-lg font-semibold text-teal-600">Comfortable Languages</h2>

  {(() => {
    const inputValue =
      Array.isArray(formData.comfortableLanguages) &&
      formData.comfortableLanguages.length > 0
        ? formData.comfortableLanguages[0]
        : "";

    const filteredSuggestions =
      inputValue.trim() === "" ||
      IndianLanguages.some(
        (item: any) => item.toLowerCase() === inputValue.toLowerCase()
      )
        ? []
        : IndianLanguages.filter((item: any) =>
            item.toLowerCase().includes(inputValue.toLowerCase())
          );

    return (
      <div className="relative max-w-xs">
        <input
          type="text"
          placeholder="Enter language"
          value={inputValue}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              comfortableLanguages: [e.target.value],
            }))
          }
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {filteredSuggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-48 overflow-y-auto">
            {filteredSuggestions.map((s: any) => (
              <div
                key={s}
                onClick={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    comfortableLanguages: [s],
                  }))
                }
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })()}
</div>



{[
  {
    title: "Home Assistance",
    field: "patientHomeAssistance",
    options: HomeAssistance,
  },
  {
    title: "Home Needs",
    field: "patientHomeNeeds",
    options: Patient_Home_Supply_Needs,
  },
  {
    title: "Doctor Needs",
    field: "patientDrNeeds",
    options: ["Medical Dr.", "Physio", "SLT", "BT", "OT", "Other"],
  },
  {
    title: "Health Card",
    field: "patientHealthCard",
    options: Health_Card,
  },
  {
    title: "Service Type",
    field: "hcpType",
    options: healthcareServices,
  },
].map((section: any) => {
  const raw = formData[section.field];

  const values = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.values)
    ? raw.values
    : [];

  const clean = (v: string) =>
    typeof v === "string" ? v.replace(/^Other:\s*/i, "") : "";

  const inputValue = values?.[0] || "";
  const cleanInput = clean(inputValue);

  const filteredSuggestions =
    cleanInput.trim() === "" ||
    section.options.some(
      (item: string) =>
        item.toLowerCase() === cleanInput.toLowerCase()
    )
      ? []
      : section.options.filter((item: string) =>
          item.toLowerCase().includes(cleanInput.toLowerCase())
        );

  return (
    <div
      key={section.field}
      id={section.title}
      className="bg-white rounded-lg shadow p-4 space-y-2"
    >
      <h2 className="text-lg font-semibold text-teal-600">
        {section.title}
      </h2>

      <div className="relative w-[90%]">
        <input
          type="text"
          placeholder={`Enter ${section.title}`}
          value={cleanInput||formData[stringify(section.title)]||""}
          onChange={(e) =>
            handleOtherChange(
              section.field,
              toProperCaseLive(e.target.value)
            )
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {filteredSuggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto">
            {filteredSuggestions.map((s: string) => (
              <div
                key={s}
                onClick={() =>
                  handleOtherChange(section.field, s)
                }
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {section.title === "Service Type" &&
        (Array.isArray(values) ? values : []).map((opt: string) =>
          hasSubTypes(clean(opt)) &&
          (formData.hcpType || []).some(
            (v: string) => clean(v) === clean(opt)
          ) ? (
            <div
              key={opt}
              className="ml-6 mt-3 pl-4 border-l-2 border-teal-200"
            >
              <div className="flex flex-wrap gap-5">
                {SERVICE_SUBTYPE_MAP[clean(opt)]?.map(
                  (type: string) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={
                          formData.serviceSubTypes?.[
                            clean(opt)
                          ] === type
                        }
                        onChange={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            serviceSubTypes: {
                              ...prev.serviceSubTypes,
                              [clean(opt)]: type,
                            },
                          }))
                        }
                        className="accent-teal-600"
                      />
                      {type}
                    </label>
                  )
                )}
              </div>

              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="text-gray-700">
                  Number of Sessions
                </span>
                <input
                  type="number"
                  value={formData.sessions?.[clean(opt)] ?? 0}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      sessions: {
                        ...prev.sessions,
                        [clean(opt)]: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-20 border border-gray-300 rounded-md px-2 py-1 text-center"
                />
              </div>

              {allowedServices.includes(clean(opt)) && (
                <div className="flex gap-3 text-sm items-center justify-center rounded-md transition-all duration-200 ease-out border-l-3 border-teal-200 shadow-lg p-1 hover:bg-gray-50 hover:rounded-md hover:px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">
                      No. of People
                    </span>
                    <input
                      type="number"
                      value={
                        formData.NumberOfCareTakers?.[
                          clean(opt)
                        ] ?? 0
                      }
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          NumberOfCareTakers: {
                            ...prev.NumberOfCareTakers,
                            [clean(opt)]: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-16 border cursor-pointer border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="cursor-pointer accent-teal-600"
                        checked={
                          formData.ServiceWorkingHours?.[
                            clean(opt)
                          ] === "12-Hr"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            ServiceWorkingHours: {
                              ...prev.ServiceWorkingHours,
                              [clean(opt)]: e.target.checked
                                ? "12-Hr"
                                : "",
                            },
                          }))
                        }
                      />
                      <span>12-Hr</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="cursor-pointer accent-teal-600"
                        checked={
                          formData.ServiceWorkingHours?.[
                            clean(opt)
                          ] === "24-Hr"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            ServiceWorkingHours: {
                              ...prev.ServiceWorkingHours,
                              [clean(opt)]: e.target.checked
                                ? "24-Hr"
                                : "",
                            },
                          }))
                        }
                      />
                      <span>24-Hr</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          ) : null
        )}

      {/* <button
        className="bg-white/30 backdrop-blur-md mt-5 border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200"
        type="button"
        onClick={() =>
          setRemarkStatus((prev) => ({
            ...prev,
            [section.field as keyof RemarkStatusType]:
              !prev[
                section.field as keyof RemarkStatusType
              ],
          }))
        }
      >
        {RemarkStatus[
          section.field as keyof RemarkStatusType
        ]
          ? "SAVE Remark"
          : "Add Remarks"}
      </button>

      {RemarkStatus[
        section.field as keyof RemarkStatusType
      ] && (
        <textarea
          rows={4}
          placeholder="Enter your remarks here..."
          className="w-[400px] p-3 mt-2 border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
          value={formData[`${section.field}Remarks`] || ""}
          onChange={(e) =>
            handleChange(
              `${section.field}Remarks`,
              toProperCaseLive(e.target.value)
            )
          }
        />
      )} */}

      {section.title === "Doctor Needs" && (
        <div className="flex flex-col gap-2">
          {(Array.isArray(values) ? values : []).map(
            (each: string) => {
              const cleanEach = clean(each);

              if (cleanEach === "Medical Dr.") {
                return (
                  <select
                    key="MedicalDr"
                    className="w-full border rounded-lg p-2"
                    onChange={(e) =>
                      handleChange(
                        "MedicalDrSpecialisation",
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Choose Medical Dr specialization
                    </option>
                    {medicalSpecializations.map((spec) => (
                      <option key={spec}>{spec}</option>
                    ))}
                  </select>
                );
              }

              if (cleanEach === "Physio") {
                return (
                  <select
                    key="Physio"
                    className="w-full border rounded-lg p-2"
                    onChange={(e) =>
                      handleChange(
                        "PhysiotherapySpecialisation",
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Choose Physiotherapy specialization
                    </option>
                    {physioSpecializations.map((spec) => (
                      <option key={spec}>{spec}</option>
                    ))}
                  </select>
                );
              }

              return null;
            }
          )}
        </div>
      )}
    </div>
  );
})}



          {/* <div id="Charges" className="bg-white rounded-lg shadow p-4 space-y-2">
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
            <div>
              <p>Registration Charger: 1500</p>
              {DiscountStatus ? (
                <button
                  onClick={() => SetDiscountStatus(false)}
                  className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg
               hover:bg-teal-700 transition shadow-sm"
                >
                  Add Discount
                </button>
              ) : (
                <input
                  type="number"
                  placeholder="Enter Registration discount"
                  onChange={(e) => SetClientDiscount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
               focus:outline-none focus:ring-2 focus:ring-teal-500 
               text-gray-700"
                />
              )}


            </div>
            <div className="flex flex-col gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200">

              <p className="text-gray-700 text-sm font-medium">
               Charge Per Day:{" "}
                <span className="font-semibold text-teal-700">
                  {formData.serviceCharges}
                </span>
              </p>

              <p className="text-gray-700 text-sm font-medium">
                Registration Fee:{" "}
                <span className="font-semibold text-teal-700">
                  ₹{DiscountPrice - ClientDiscount}
                </span>
              </p>

              <p
                className="border border-teal-400 bg-teal-50 text-teal-800 
               font-semibold rounded-lg px-4 py-3 shadow-sm 
               flex items-center justify-between"
              >
                <span>Total Amount</span>
                <span>
                  ₹{formData.serviceCharges === "Other"
                    ? 1500
                    : (parseFloat(formData.serviceCharges.replace(/[^0-9.]/g, "")) || 0) +
                    DiscountPrice -
                    ClientDiscount}
                </span>
              </p>

            </div>

            <p className="text-red-500">{WarningMessage}</p>
          </div> */}

          <div id="Additional Comments" className="flex flex-col md:ml-2  md:w-[400px] ">


            <label className="font-bold mb-2 text-teal-600">Additional Comments</label>
           <textarea
  value={formData.AdditionalComments || ""}
  onChange={(e) =>
    handleChange(
      "AdditionalComments",
      toProperCaseLive(e.target.value)
    )
  }
  className="border-2 border-gray-400 rounded-md p-2 w-full"
  rows={4}
  placeholder="Enter your comments here..."
/>

          </div>

          {/* <div className="flex flex-col flex-wrap items-center justify-center">
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

              {["None","Processing", "Converted", "Waiting List", "Lost", ].map((each: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  className={` md:px-1 px-1 text-[15px] md:text-[15px]  sm:py-2 text-center ${each === formData.ClientStatus && "border-2"
                    } h-7 md:h-10 rounded-md shadow cursor-pointer ${filterColors[each] || "bg-gray-200 text-gray-800"
                    }`}
                  onClick={() => handleChange("ClientStatus", each)}
                >
                  {each}
                </button>
              ))}
            </div>
          </div> */}
        </div>

        <div className="text-center">
          <p
            className={`${statusMessage === "Your Lead Registration Completed,Riderecting to Admin Page..."
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
      Fill Pdr
          </button>
        </div>
      </form>
    </div>
  );
}
