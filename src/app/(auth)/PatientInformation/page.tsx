"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetUserInformation } from "@/Lib/user.action";
import {
  Users,
  Heart,
  Stethoscope,
  CalendarCheck,
  Pencil,
  LogOut,
  Droplets,
  Activity,
  Dumbbell,
  Pill,
  Utensils,
  Sparkles,
  HandHelping,
  FileText,
  Save,
  MessageSquare,
  BadgeInfo,
  BookOpenText,
  CircleEllipsis,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ClientEnquiry_Filters, indianFamilyRelations, LeadSources, medicalSpecializations, physioSpecializations } from "@/Lib/Content";
import { UpdateFetchedInformation } from "@/Redux/action";
import { CheckboxGroup } from "@/Components/CheckboxGroup";

type EditingKeys = 'PatientCardEditing' | 'ClientCardEditing'|'PatientDetails'|'AdditionalInformation'|'OtherInformation';
interface UserInfoProps {
  userId: string;
}

interface UserInformation {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  hobbies?: string[];
  [key: string]: any;
}

export default function UserInformation() {
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [formData, setFormData] = useState<UserInformation>({});
  const [isEditing, setIsEditing] = useState({PatientCardEditing:false,ClientCardEditing:false,PatientDetails:false,AdditionalInformation:false,OtherInformation:false});
  const [isLoading, setIsLoading] = useState(true);
    const userId = useSelector((state: any) => state?.UserDetails)
    const dispatch=useDispatch()

    function FieldItem({
  label,
  value,
  editable,
  onChange,
}: {
  label: string;
  value?: string;
  editable: boolean;
  onChange: (val: string) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-gray-800  font-bold text-md mb-1">{label}</label>
      {editable ? (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label}`}
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
      ) : (
        <p className="text-gray-800 min-h-[24px]">{value || "Unfilled"}</p>
      )}
    </div>
  );
}


const router=useRouter()
  // Fetch user data from DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetUserInformation(userId);
        console.log("Test Data-----",data)
        const defaultData: UserInformation = {
          name: "",
          email: "",
          phone: "",
          gender: "",
          hobbies: [],
        };
        setUserInfo({ ...defaultData, ...data }); 
        setFormData({ ...defaultData, ...data });
        dispatch(UpdateFetchedInformation(data))
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);


  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/AdminPage");
  };
  const handleSave = async (Item:EditingKeys) => {
    console.log("Saving Updated Data:", formData);

    setIsEditing((prev)=>({...prev, [Item]:!prev[Item]}));
  };

   if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading user data...</p>
        </div>
      </div>
    );

  return (
   

<div className=" flex flex-col min-h-screen bg-gray-50">

<header className="w-full bg-white shadow-md py-3 sm:py-4 px-4 p-3 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
 
    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#ff1493] text-center sm:text-left">
      Patient Information Summary
    </h1>

   
    <button onClick={handleLogout} className="bg-gray-500 cursor-pointer text-white px-3 py-2 rounded-md" > <LogOut className="inline mr-2" size={16} /> Admin Table </button>
  </div>
</header>



  <main className="w-full flex flex-wrap  p-2 ">
    <div className=" w-full bg-white rounded-2xl shadow-lg p-3 mb-6 mb-6 md:w-[49%]">
      <div className="flex  flex-row justify-between items-start items-center mb-6 ">
        <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
            <Users /> Client Card
          </h2>
        <button
          onClick={() => (isEditing.ClientCardEditing ? handleSave('ClientCardEditing') : setIsEditing((prev)=>({...prev,ClientCardEditing:!prev.ClientCardEditing})))}
          className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                      ${isEditing.ClientCardEditing ? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
        >
          {isEditing.ClientCardEditing ? <Save size={18} /> : <Pencil size={18} />}
          {isEditing.ClientCardEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         <FieldItem
          label="Client Full Name"
          value={formData.FirstName}
          editable={isEditing.ClientCardEditing}
          onChange={(val) => handleChange("FirstName", val)}
         
        />
        <FieldItem
          label="Client ContactNumber"
          value={formData.ContactNumber}
          editable={isEditing.ClientCardEditing}
          onChange={(val) => handleChange("ContactNumber", val)}
         
        />

        <FieldItem
          label="Client Email"
          value={formData.Email}
          editable={isEditing.ClientCardEditing}
          onChange={(val) => handleChange("Email", val)}
       
        />

        <CheckboxGroup
          label="Main point for Patient"
          options={["Yes","No"]}
          selected={formData.MainpointforPatient}
          editable={isEditing.ClientCardEditing}
          onChange={(val) => handleChange("MainpointforPatient", val)}
          
        />

          <CheckboxGroup
          label="Main point for Patient"
          options={["Yes","No"]}
          selected={formData.MainpointforPatient}
          editable={isEditing.ClientCardEditing}
          onChange={(val) => handleChange("MainpointforPatient", val)}
          
        />

  <CheckboxGroup
          label="Name of Main point for Patient "
          options={["Yes","No"]}
          selected={formData.MainpointforPatientInfo}
          editable={isEditing.ClientCardEditing}
          onChange={(val) => handleChange("MainpointforPatientInfo", val)}
          
        />
          <CheckboxGroup
          label="Relation to Patient"
          options={indianFamilyRelations}
          selected={formData.RelationtoPatient}
          editable={isEditing.ClientCardEditing}
          onChange={(val) => handleChange("RelationtoPatient", val)}
          
        />
         <CheckboxGroup
          label="Lead Source"
          options={LeadSources}
          selected={formData.Source}
          editable={isEditing.ClientCardEditing}
          onChange={(val) => handleChange("Source", val)}
          
        />

          <FieldItem
          label="ClientCardRemarks"
          value={formData.ClientCardRemarks}
          editable={isEditing.ClientCardEditing}
          onChange={(val) => handleChange("ClientCardRemarks", val)}
       
        />

       
      </div>
    </div>

    <div className="w-full bg-white rounded-2xl shadow-lg p-3 mb-6 md:ml-2 md:w-[50%]" >
       <div className="flex  flex-row justify-between items-start items-center mb-6 ">
        <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
           <Heart /> Patient Card
          </h2>
        <button
          onClick={() => (isEditing.PatientCardEditing? handleSave('PatientCardEditing') : setIsEditing((prev)=>({...prev,PatientCardEditing:!prev.PatientCardEditing})))}
          className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                      ${isEditing.PatientCardEditing? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
        >
          {isEditing.PatientCardEditing ? <Save size={18} /> : <Pencil size={18} />}
          {isEditing.PatientCardEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         <FieldItem
          label="Patient Full Name"
          value={formData.patientName}
          editable={isEditing.PatientCardEditing}
          onChange={(val) => handleChange("patientName", val)}
         
        />
        <FieldItem
          label="Patient ContactNumber"
          value={formData.patientPhone}
          editable={isEditing.PatientCardEditing}
          onChange={(val) => handleChange("patientPhone", val)}
         
        />

        <FieldItem
          label="Patient Age"
          value={formData.patientAge}
          editable={isEditing.PatientCardEditing}
          onChange={(val) => handleChange("patientAge", val)}
       
        />

        <CheckboxGroup
          label="Patient Gender"
          options={["Male", "Female", "Other"]}
          selected={formData.patientGender}
          editable={isEditing.PatientCardEditing}
          onChange={(val) => handleChange("patientGender", val)}
          
        />

         <FieldItem
          label="Patient Abha Id"
          value={formData.AbhaId}
          editable={isEditing.PatientCardEditing}
          onChange={(val) => handleChange("AbhaId", val)}
       
        />
   <FieldItem
          label="Patient CardRemarks"
          value={formData.PatientCardCardRemarks}
          editable={isEditing.PatientCardEditing}
          onChange={(val) => handleChange("PatientCardCardRemarks", val)}
         
        />
       
      </div>
    </div>
      <div className="w-full bg-white rounded-2xl shadow-lg p-3 mb-6 md:w-[49%]">
       <div className="flex  flex-row justify-between items-start items-center mb-6 ">
        <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
           <MessageSquare /> Patient Details
          </h2>
        <button
          onClick={() => (isEditing.PatientDetails? handleSave('PatientDetails') : setIsEditing((prev)=>({...prev,PatientDetails:!prev.PatientDetails})))}
          className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                      ${isEditing.PatientDetails? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
        >
          {isEditing.PatientDetails ? <Save size={18} /> : <Pencil size={18} />}
          {isEditing.PatientDetails ? "Save" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         
         <CheckboxGroup
          label="Patient Type"
          options={["Bed Ridden", "Semi Bed Ridden", "Wheel Chair", "Full Mobile", "Post Operative"]}
          selected={formData.patientType}
          editable={isEditing.PatientDetails}
          onChange={(val) => handleChange("patientType", val)}
          
        />

          <CheckboxGroup
          label="Current Location"
          options={["Hospital", "Rehab", "Home"]}
          selected={formData.patientCurrentLocation}
          editable={isEditing.PatientDetails}
          onChange={(val) => handleChange("patientCurrentLocation", val)}
          
        />

        <FieldItem
          label="Patient serviceLocation"
          value={formData.serviceLocation}
          editable={isEditing.PatientDetails}
          onChange={(val) => handleChange("serviceLocation", val)}
       
        />

          <FieldItem
          label="PatientDetailsCard Remarks"
          value={formData.PatientDetailsCardRemarks}
          editable={isEditing.PatientDetails}
          onChange={(val) => handleChange("PatientDetailsCardRemarks", val)}
       
        />
       
      </div>
    </div>
      <div className="bg-white rounded-2xl shadow-lg p-3 mb-6 md:ml-2 md:w-[50%]">
       <div className="flex  flex-row justify-between items-start items-center mb-6 ">
        <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
           <BadgeInfo  /> Additional Information
          </h2>
        <button
          onClick={() => (isEditing.AdditionalInformation? handleSave('AdditionalInformation') : setIsEditing((prev)=>({...prev,AdditionalInformation:!prev.AdditionalInformation})))}
          className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                      ${isEditing.AdditionalInformation? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
        >
          {isEditing.AdditionalInformation ? <Save size={18} /> : <Pencil size={18} />}
          {isEditing.AdditionalInformation ? "Save" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         
          <FieldItem
          label="PatientWeight (KG's)"
          value={formData.patientWeight}
          editable={isEditing.AdditionalInformation}
          onChange={(val) => handleChange("patientWeight", val)}
       
        />

         <FieldItem
          label="patientHeight (Feet's)"
          value={formData.patientHeight}
          editable={isEditing.AdditionalInformation}
          onChange={(val) => handleChange("patientHeight", val)}
       
        />



          <CheckboxGroup
          label="Comfortable Languages"
          options={["Telugu", "Hindi", "English", "Other"]}
          selected={formData.comfortableLanguages}
          editable={isEditing.AdditionalInformation}
          multiple={true}
          onChange={(val) => handleChange("comfortableLanguages", val)}
          
        />

       

          
       
      </div>
    </div>
       <div className="w-full bg-white rounded-2xl shadow-lg p-3 mb-6 ">
       <div className="flex  flex-row justify-between items-start items-center mb-6 ">
        <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
           <BookOpenText  />Medical Information
          </h2>
        <button
          onClick={() => (isEditing.PatientDetails? handleSave('PatientDetails') : setIsEditing((prev)=>({...prev,PatientDetails:!prev.PatientDetails})))}
          className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                      ${isEditing.PatientDetails? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
        >
          {isEditing.PatientDetails ? <Save size={18} /> : <Pencil size={18} />}
          {isEditing.PatientDetails ? "Save" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         
         <CheckboxGroup
          label="Home Assistance"
          options={ ["Diaper", "Bathing", "Bedding", "Brushing"]}
          selected={formData.patientHomeAssistance}
          editable={isEditing.PatientDetails}
          multiple={true}
          onChange={(val) => handleChange("patientHomeAssistance", val)}
          
        />

        <CheckboxGroup
          label="Patient HomeNeeds"
          options={ ["Diaper", "BP Monitor", "Sugar Monitor", "Water Bed"]}
          selected={formData.patientHomeNeeds}
          editable={isEditing.PatientDetails}
          multiple={true}
          onChange={(val) => handleChange("patientHomeNeeds", val)}
          
        />

          <CheckboxGroup
          label="Patient HomeNeeds"
          options={ ["Medical Dr.", "Physio", "SLT", "BT", "OT"]}
          selected={formData.patientDrNeeds}
          editable={isEditing.PatientDetails}
          multiple={true}
          onChange={(val) => handleChange("patientDrNeeds", val)}
          
        />
{formData?.patientDrNeeds.includes("Medical Dr.")&&<CheckboxGroup
          label=" Medical Dr specialization"
          options={medicalSpecializations}
          selected={formData.MedicalDrSpecialisation}
          editable={isEditing.PatientDetails}
       
          onChange={(val) => handleChange("MedicalDrSpecialisation", val)}
          
        />}
   {formData.patientDrNeeds.includes("Physio")&&<CheckboxGroup
          label="PhysiotherapySpecialisation"
          options={physioSpecializations}
          selected={formData.PhysiotherapySpecialisation}
          editable={isEditing.PatientDetails}
      
          onChange={(val) => handleChange("PhysiotherapySpecialisation", val)}
          
        />}

       <CheckboxGroup
          label="Health Card"
          options={ [
              "Diabetic",
              "Blood Pressure",
              "Surgery – Hip, Knee, Shoulder etc",
              "Dementia",
              "Paralysis",
            ]}
          selected={formData.patientHealthCard}
          editable={isEditing.PatientDetails}
        multiple={true}
          onChange={(val) => handleChange("patientHealthCard", val)}
          
        />
          <CheckboxGroup
          label="HCP Type"
          options={ ["HCA", "HCN", "Physio", "SLT", "BT", "OT", "Medical Equipment"]}
          selected={formData.hcpType}
          editable={isEditing.PatientDetails}
        multiple={true}
          onChange={(val) => handleChange("hcpType", val)}
          
        />
          
       
      </div>
    </div>
    <div className="w-full bg-white rounded-2xl shadow-lg p-3 mb-6 md:ml-2 md:w-[50%]">
       <div className="flex  flex-row justify-between items-start items-center mb-6 ">
        <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
           <CircleEllipsis   /> Other Information
          </h2>
        <button
          onClick={() => (isEditing.OtherInformation? handleSave('OtherInformation') : setIsEditing((prev)=>({...prev,OtherInformation:!prev.OtherInformation})))}
          className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                      ${isEditing.OtherInformation? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
        >
          {isEditing.OtherInformation ? <Save size={18} /> : <Pencil size={18} />}
          {isEditing.OtherInformation ? "Save" : "Edit"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         
          <FieldItem
          label="ServiceCharges"
          value={formData.serviceCharges}
          editable={isEditing.OtherInformation}
          onChange={(val) => handleChange("serviceCharges", val)}
       
        />

        
            <CheckboxGroup
              label="Client Status"
              options={ClientEnquiry_Filters}
              selected={formData.ClientStatus}
              editable={isEditing.OtherInformation}
         
              onChange={(val) => handleChange("ClientStatus", val)}

            />
   
    
    
      
         <FieldItem
          label="PatientHealthCard Remarks"
          value={formData.patientHealthCardRemarks}
          editable={isEditing.OtherInformation}
          
          onChange={(val) => handleChange("patientHealthCardRemarks", val)}
       
        />
        <FieldItem
          label="PatientDrNeeds Remarks"
          value={formData.patientDrNeedsRemarks}
          editable={isEditing.OtherInformation}
          
          onChange={(val) => handleChange("patientDrNeedsRemarks", val)}
       
        />
           <FieldItem
          label="hcpTypeRemarks Remarks"
          value={formData.hcpTypeRemarks}
          editable={isEditing.OtherInformation}
          
          onChange={(val) => handleChange("hcpTypeRemarks", val)}
       
        />
   
      
      
      
       <FieldItem
          label="WeightRemarks"
          value={formData.WeightRemarks}
          editable={isEditing.OtherInformation}
          
          onChange={(val) => handleChange("WeightRemarks", val)}
       
        />
         <FieldItem
          label="HeightRemarks"
          value={formData.HeightRemarks}
          editable={isEditing.OtherInformation}
          
          onChange={(val) => handleChange("HeightRemarks", val)}
       
        />
         <FieldItem
          label="PatientHomeAssistanceRemarks"
          value={formData.AdditionalComments}
          editable={isEditing.OtherInformation}
          
          onChange={(val) => handleChange("patientHomeAssistanceRemarks", val)}
       
        />
         <FieldItem
          label="patientHomeNeedsRemarks"
          value={formData.patientHomeNeedsRemarks}
          editable={isEditing.OtherInformation}
          
          onChange={(val) => handleChange("patientHomeNeedsRemarks", val)}
       
        />
   <FieldItem
          label="AdditionalComments"
          value={formData.AdditionalComments}
          editable={isEditing.OtherInformation}
          
          onChange={(val) => handleChange("AdditionalComments", val)}
       
        />

        

       

          
       
      </div>
    </div>
<div className="flex flex-col items-center justify-center m-auto p-4 space-y-4 w-full max-w-md sm:max-w-lg md:max-w-2xl">
  {/* Info Section */}
  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left">
    <img
      src="Icons/call.gif"
      alt="Info Icon"
      className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full object-cover"
    />
    <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-snug">
      <span className="text-gray-900 underline font-semibold">Info Collected by: </span>
      {formData.TimeStampInfo || "Not Entered"}
    </p>
  </div>


  <button
    onClick={() => router.push("/PDR")}
    className="w-full sm:w-auto px-6 py-3 cursor-pointer bg-green-800 hover:bg-green-600 active:bg-green-700 text-white text-sm sm:text-base rounded-lg font-medium transition-all duration-200 ease-in-out"
  >
    Add PDR
  </button>
</div>

  </main>

</div>



  
   
  );
}






