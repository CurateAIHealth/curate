"use client";

import MobileMedicationSchedule from "@/Components/MedicationMobileView/page";
import MedicationSchedule from "@/Components/Medications/page";
import { ClientEnquiry_Filters, filterColors, Headings, Health_Card, healthcareServices, HomeAssistance, hyderabadAreas, indianFamilyRelations, IndianLanguages, LeadSources, Main_Filters, medicalSpecializations, Patient_Home_Supply_Needs, patientCategories, physioSpecializations, SERVICE_SUBTYPE_MAP,  } from "@/Lib/Content";
import { GetRegidterdUsers, GetUserInformation, UpdateNewLeadInformation } from "@/Lib/user.action";
import { Update_Current_Client_Status } from "@/Redux/action";
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
    LeadDate: '',
    ServiceArea: '',
    ClientStatus: "",
  });
  const [DiscountStatus, SetDiscountStatus] = useState(true)
  const [visible, setVisible] = useState(true);
  const [WarningMessage, setWarningMessage] = useState("");
  const [DiscountPrice, setDiscountPrice] = useState<any>(1500)
  const [ClientDiscount, SetClientDiscount] = useState<any>(0)
  const [PhysioScore, SetPhysioScore] = useState(0)
  const [addingWeight, setaddingWeight] = useState<any>("");
  const [statusMessage, setStatusMessage] = useState("");
  const [addedheight, setaddedheight] = useState<any>();
  const [TimeStameDetails, setTimeStameDetails] = useState("setTimeStameDetails")
  const [showTooltip, setShowTooltip] = useState(false);
  const [ImportedVendors, setImportedVendors] = useState<any>([])
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
      const [Sign_in_UserInfo, RegisterdUsers] = await Promise.all([
        GetUserInformation(localValue),
        GetRegidterdUsers(),
      ]);
      setImportedVendors(RegisterdUsers.filter((each: any) => each.userType === "Vendor"))
      setTimeStameDetails(`${Sign_in_UserInfo.FirstName} ${Sign_in_UserInfo.LastName}, Email: ${Sign_in_UserInfo.Email}`)
    }
    Fetch()
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

    const FinelPostingData = { ...formData, serviceCharges: formData.serviceCharges, RegistrationFee: DiscountPrice - ClientDiscount, Medications: MedicationData, userId: generatedUserId, SuitableHCP: "" }

    const PostResult = await UpdateNewLeadInformation(FinelPostingData);
    if (PostResult.success) {
      setStatusMessage(`${PostResult.message},Riderecting to Admin Page...`);
      dispatch(Update_Current_Client_Status(formData.ClientStatus))
      const Timer = setInterval(() => {
        router.push("/AdminPage")
      }, 1200)

      return () => clearInterval(Timer)
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
const hasSubTypes = (service: string): service is ServiceWithSubType => {
  return service in SERVICE_SUBTYPE_MAP;
};

  console.log('Check for Post Datat-----', formData.NumberOfCareTakers
)
  const FilterdImportedVendorName = ImportedVendors.map((each: any) => each.VendorName)
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

            <select className="w-full border rounded-lg p-2" onChange={(e) => handleChange("RelationtoPatient", e.target.value)}>
              <option>Choose Relation</option>
              {indianFamilyRelations.map((each: any) => <option key={each}>{each}</option>)}
            </select>
            <div>


              <p className="flex items-center gap-2 font-medium relative">
                Lead Source :

                <span className="relative group">
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
        z-50
      "
                  >
                    This is a key field. All salary calculations are derived based on the selected name.
                  </span>
                </span>
              </p>




              <select className="w-full border rounded-md text-center" onChange={(e) => handleChange("Source", e.target.value)}>
                <option className="bg-gray-400">Choose Lead</option>
                {[...FilterdImportedVendorName, ...LeadSources].map((each: any) => <option key={each}>{each}</option>)}
              </select>
              {formData.Source === "Other" && <input
                type="text"
                placeholder="Enter New Lead Name"
                className="w-[300px] border rounded-lg p-2 m-2"
                value={formData.NewLead}
                onChange={(e) => handleChange("NewLead", e.target.value)}
              />}
            </div>
            <div className="flex flex-col gap-2 max-w-xs">

              <label className="flex items-center gap-2 font-medium relative">

                Lead Date
              </label>


              <input
                type="date"
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


            <button type="button" className="bg-white/30 backdrop-blur-md border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={() => setRemarkStatus((prev) => ({ ...prev, ClientCard: !RemarkStatus.ClientCard }))} > {RemarkStatus.ClientCard ? "SAVE Remark" : "Add Remarks"} </button>
            {RemarkStatus.ClientCard && <textarea
              rows={4}
              placeholder="Enter your remarks here..."
              className="w-[400px] p-3 border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
              value={formData.ClientCardRemarks || ""}
              onChange={(e) => handleChange("ClientCardRemarks", toProperCaseLive(e.target.value))}
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
              onChange={(e) => handleChange("patientName", toProperCaseLive(e.target.value))}

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
              <button type="button" className="bg-white/30 backdrop-blur-md  border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={() => setRemarkStatus((prev) => ({ ...prev, PatientCard: !RemarkStatus.PatientCard }))} > {RemarkStatus.PatientCard ? "SAVE Remark" : "Add Remarks"} </button>
              {RemarkStatus.PatientCard && <textarea
                rows={4}
                placeholder="Enter your remarks here..."
                className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
                value={formData.PatientCardCardRemarks || ""}
                onChange={(e) => handleChange("PatientCardCardRemarks", toProperCaseLive(e.target.value))}
              />
              }
            </div>

          </div>

          <div className="bg-white rounded-lg shadow p-4 space-y-3">
            <h2 className="text-lg font-semibold text-teal-600">Patient Details</h2>
            <div>
              <h3 className="font-medium text-sm">Patient Type</h3>
             <div className="flex flex-col gap-2">
  {patientCategories.map((t) => {
    const isOther = t === "Other";
    const isSelected =
      isOther
        ? formData.patientType?.startsWith("Other:")
        : formData.patientType === t;

    return (
      <div key={t} className="space-y-1">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() =>
              setFormData((prev: any) => ({
                ...prev,
                patientType: isOther ? "Other:" : t,
              }))
            }
            className="mr-2 accent-purple-600"
          />
          {t}
        </label>

      
        {isOther && isSelected && (
          <div className="ml-6 flex items-center border border-gray-300 rounded-md overflow-hidden w-[90%]">
            <span className="bg-gray-100 px-3 py-1.5 text-sm text-gray-600">
              Other:
            </span>
            <input
              type="text"
              placeholder="Enter value"
              value={formData.patientType.replace("Other:", "")}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  patientType: `Other: ${e.target.value.trimStart()}`,
                }))
              }
              className="flex-1 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        )}
      </div>
    );
  })}
</div>

            </div>
            <div>
              <h3 className="font-medium text-sm">Current Location</h3>
          <div className="flex flex-col gap-2">
  {["Hospital", "Rehab", "Home", "Other"].map((loc) => {
    const rawLocation = formData.patientCurrentLocation;
    const locationValue =
      typeof rawLocation === "string" ? rawLocation : "";

    const isOther = loc === "Other";
    const isSelected = isOther
      ? locationValue.startsWith("Other:")
      : locationValue === loc;

    return (
      <div key={loc} className="space-y-1">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() =>
              setFormData((prev: any) => ({
                ...prev,
                patientCurrentLocation: isOther ? "Other:" : loc,
              }))
            }
            className="mr-2 accent-purple-600"
          />
          {loc}
        </label>

        {isOther && isSelected && (
          <div className="ml-6 flex items-center border border-gray-300 rounded-md overflow-hidden w-[90%]">
            <span className="bg-gray-100 px-3 py-1.5 text-sm text-gray-600">
              Other:
            </span>
            <input
              type="text"
              placeholder="Enter location"
              value={locationValue.replace("Other:", "")}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  patientCurrentLocation: `Other: ${e.target.value.trimStart()}`,
                }))
              }
              className="flex-1 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        )}
      </div>
    );
  })}
</div>

            </div>
            <div>
              <h3 className="font-medium text-sm">Service Location</h3>
              <input
                type="text"
                placeholder="Enter Service Location"
                className="w-full border rounded-lg p-2"
                value={formData.serviceLocation}
                onChange={(e) => handleChange("serviceLocation", toProperCaseLive(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-2 max-w-xs">

              <label className="font-medium text-sm   tracking-wide text-gray-800">
                Service Area
              </label>

              <select
                onChange={(e: any) => handleChange("ServiceArea", e.target.value)}
                className="
      h-11 w-full px-4
      rounded-xl
      bg-white
      border border-slate-300
      text-sm font-medium text-slate-700
      shadow-sm
      cursor-pointer

      transition-all duration-200 ease-in-out

      hover:border-slate-400 hover:shadow-md
      focus:outline-none
      focus:border-[#62e0d9]
      focus:ring-2 focus:ring-[#caf0f8]
    "
              >
                <option value="">Select service area</option>

                {hyderabadAreas.map((each: any) => (
                  <option key={each} value={each}>
                    {each}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" className="bg-white/30 backdrop-blur-md mt-20 border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={() => setRemarkStatus((prev) => ({ ...prev, PatientDetails: !RemarkStatus.PatientDetails }))} > {RemarkStatus.PatientDetails ? "SAVE Remark" : "Add Remarks"} </button>
            {RemarkStatus.PatientDetails && <textarea
              rows={4}
              placeholder="Enter your remarks here..."
              className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
              value={formData.PatientDetailsCardRemarks || ""}
              onChange={(e) => handleChange("PatientDetailsCardRemarks", toProperCaseLive(e.target.value))}
            />
            }


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
            <button type="button" className="bg-white/30 backdrop-blur-md  border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={() => setRemarkStatus((prev) => ({ ...prev, Weight: !RemarkStatus.Weight }))} > {RemarkStatus.Weight ? "SAVE Remark" : "Add Remarks"} </button>
            {RemarkStatus.Weight && <textarea
              rows={4}
              placeholder="Enter your remarks here..."
              className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
              value={formData.WeightRemarks || ""}
              onChange={(e) => handleChange("WeightRemarks", toProperCaseLive(e.target.value))}
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
            <button type="button" className="bg-white/30 backdrop-blur-md  border border-teal-500 w-[160px] text-blue-500 cursor-pointer font-semibold px-1 py-2 rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-200" onClick={() => setRemarkStatus((prev) => ({ ...prev, Height: !RemarkStatus.Height }))} > {RemarkStatus.Height ? "SAVE Remark" : "Add Remarks"} </button>
            {RemarkStatus.Height && <textarea
              rows={4}
              placeholder="Enter your remarks here..."
              className="w-[400px] p-3 mt-2  border-1 ml-2 border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
              value={formData.HeightRemarks || ""}
              onChange={(e) => handleChange("HeightRemarks", toProperCaseLive(e.target.value))}
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
                          ? formData.comfortableLanguages.some((l: any) => l.startsWith("Other"))
                          : formData.comfortableLanguages.includes(lang)
                      }
                      onChange={() => {
                        if (lang === "Other") {
                          setFormData((prev: any) => {
                            const hasOther = prev.comfortableLanguages.some((l: any) =>
                              l.startsWith("Other")
                            );

                            return {
                              ...prev,
                              comfortableLanguages: hasOther
                                ? prev.comfortableLanguages.filter(
                                  (l: any) => !l.startsWith("Other")
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
                    formData.comfortableLanguages.some((l: any) => l.startsWith("Other")) && (
                      <div>
                        <select
                          className="mt-1 w-full border rounded-lg p-2 text-sm"
                          value={
                            (() => {
                              const otherValue = formData.comfortableLanguages.find((l: any) =>
                                l.startsWith("Other")
                              );
                              return otherValue ? otherValue.replace("Other:", "") : "";
                            })()
                          }
                          onChange={(e) => {
                            const value = e.target.value;

                            setFormData((prev: any) => {
                              return {
                                ...prev,
                                comfortableLanguages: [
                                  ...prev.comfortableLanguages.filter(
                                    (l: any) => !l.startsWith("Other")
                                  ),
                                  value ? `Other:${value}` : "Other",
                                ],
                              };
                            });
                          }}
                        >
                          <option value="">Select Language</option>

                          {IndianLanguages.map((l) => (
                            <option key={l} value={l}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                </div>
              ))}
            </div>
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
              options: ["Medical Dr.", "Physio", "SLT", "BT", "OT","Other"],
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
          ].map((section: any) => (
            <div key={section.field} id={section.title} className="bg-white rounded-lg shadow p-4 space-y-2">
          
              <h2 className="text-lg font-semibold text-teal-600">{section.title}</h2>

 {section.options.map((opt: string) => {
  const raw = formData[section.field];
  const values = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.values)
    ? raw.values
    : [];

  const isOther = opt === "Other";
  const otherValue = values.find(
    (v: string) => typeof v === "string" && v.startsWith("Other:")
  );

  return (
    <div key={opt} className="flex gap-2 items-center space-y-2">
      <label className="flex items-center text-sm gap-2">
        <input
          type="checkbox"
          checked={
            isOther
              ? Boolean(otherValue)
              : values.includes(opt)
          }
          onChange={() => handleCheckboxChange(section.field, opt)}
          className="accent-purple-600"
        />
        {opt}
      </label>
       {formData.hcpType.includes(opt)&&
<div>
  {opt === "Oncall Service (OCS)" ? 
    <div>
      
      <select
  className="
    mt-2 w-full
    text-xs font-medium text-gray-700
    bg-white
    border border-gray-200
    rounded-xl
    px-3 py-2
    shadow-sm
    cursor-pointer
    transition-all duration-200
 ml-auto
  flex flex-col items-center justify-center
    focus:outline-none
    focus:ring-2 focus:ring-blue-500
    focus:border-blue-500

    hover:border-blue-400
  "
  onChange={(e)=>handleChange("OnCallSerive",e.target.value)}
>
  <option value="">Choose Service Type</option>
  <option value="Injection12">Injection</option>
  <option value="Dressing">Dressing</option>
  <option value="Other">Other</option>
</select>
{formData.OnCallSerive === "Other" && (
  <input
    type="text"
    placeholder="Specify other service"
     onChange={(e)=>handleChange("OnCallSerive",e.target.value)}
    className="
      mt-2 w-full
      text-xs font-medium text-gray-700
      bg-white
      border border-gray-200
      rounded-xl
      px-3 py-2
      shadow-sm
      transition-all duration-200

      placeholder:text-gray-400
      hover:border-blue-400

      focus:outline-none
      focus:ring-2 focus:ring-blue-500
      focus:border-blue-500
    "
  />
)}

</div>
:
       <div className="
  ml-auto
  flex flex-col items-center justify-center
  p-4
  rounded-2xl
  bg-white
  border border-gray-100
  shadow-[0_15px_45px_rgba(0,0,0,0.25)]
  hover:-translate-y-0.5
  transition-all duration-200
">

     <div className="flex items-center gap-2 text-xs bg-gray-50 border rounded-md px-2 py-1">
        <span className="whitespace-nowrap text-[10px]">No. of People</span>
        <input
          type="number"
          value={formData.NumberOfCareTakers?.[opt] ?? 0}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              NumberOfCareTakers: {
                ...prev.NumberOfCareTakers,
                [opt]: Number(e.target.value),
              },
            }))
          }
          className="w-14 text-center border rounded px-1 py-0.5 text-sm"
        />
      </div>
      <div className="flex gap-2 mt-1">
  <label className="flex items-center gap-2 px-1 py-1.5 rounded-full border 
                    bg-white cursor-pointer hover:bg-gray-100 transition">
    <input
      type="checkbox"
      className="h-4 w-4 accent-blue-600"
    />
    <span className="text-[10px] font-semibold">
      12-Hr
    </span>
  </label>

  <label className="flex items-center gap-2 px-1 py-1.5 rounded-full border 
                    bg-white cursor-pointer hover:bg-gray-100 transition">
    <input
      type="checkbox"
      className="h-4 w-4 accent-blue-600"
    />
    <span className="text-[10px] font-semibold">
      24-Hr
    </span>
  </label>
</div>

      </div>
      
    }

</div>

     
      }
     

      {isOther && otherValue && (
  <div className="ml-6 flex items-center w-[90%] border border-gray-300 rounded-md overflow-hidden">
    
    {/* Prefix */}
    <span className="bg-gray-100 px-3 py-1.5 text-sm text-gray-600 whitespace-nowrap">
      Other:
    </span>

    {/* Input */}
    <input
      type="text"
      value={extractOtherValue(otherValue)}
      onChange={(e) =>
        handleOtherChange(
          section.field,
          toProperCaseLive(e.target.value)
        )
      }
      placeholder="Enter value"
      className="
        flex-1 px-3 py-1.5
        text-sm
        focus:outline-none
        focus:ring-2 focus:ring-teal-500
      "
    />
  </div>
)}

    </div>
  );

 
})}


{section.title==="Service Type"&&
<div>
  {formData.hcpType.map((service: any) => {
    if (!hasSubTypes(service)) return null;

    const subTypes = SERVICE_SUBTYPE_MAP[service];
    const selectedValue = formData.serviceSubTypes?.[service] || "";

    return (
      <div
        key={service}
        className="mt-5 border p-1 flex flex-col items-center rounded-md shadow-lg"
      >
        <p className="text-sm font-semibold mb-2">
          {service} – Sub Type
        </p>

        <div className="flex flex-wrap items-center gap-4">
          {subTypes.map((type: any) => (
            <label
              key={type}
              className="flex items-center gap-1 text-[12px]"
            >
              <input
                type="checkbox"
                checked={selectedValue === type}
                onChange={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    serviceSubTypes: {
                      ...prev.serviceSubTypes,
                      [service]: type,
                    },
                  }))
                }
              />
              {type}
            </label>
          ))}
        </div>

           <div className="mt-3 flex items-center gap-2 text-sm">
          <span>Number Of Sessions</span>
          <input
            type="number"
            value={formData.sessions?.[service] ?? 0}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                sessions: {
                  ...prev.sessions,
                  [service]: Number(e.target.value),
                },
              }))
            }
            className="w-15 text-center border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
    );
  })}
</div>

}


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
                  onChange={(e) => handleChange(`${section.field}Remarks`, toProperCaseLive(e.target.value))}
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
          </div>

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

              {["Processing", "Converted", "Waiting List", "Lost",].map((each: string, i: number) => (
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
          </div>
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
            Submit Enquiry
          </button>
        </div>
      </form>
    </div>
  );
}
