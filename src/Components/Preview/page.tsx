'use client';

import { GetInvoiceInfo, GetTimeSheetInfo, GetUserPDRInfo, InsertDeployment, PostInvoice, UpdateHCAnstatus, UpdateHCAnstatusInFullInformation, UpdatePDR, UpdatePdrStatus, UpdateUserContactVerificationstatus } from "@/Lib/user.action";
import { UpdatePreviewStatus } from "@/Redux/action";
import { TimeStamp } from "@/Redux/reducer";
import { data } from "framer-motion/client";
import { SquarePen, Type } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface PreviewProps {
  data: any;
  Advance:any
}

const F = (v: any) => (v !== null && v !== "" && v !== undefined ? v : "Not Provided");

const BadgeList = ({ list }: { list: any[] }) => (
  <div className="flex flex-wrap gap-2 mt-1">
    {list?.length > 0
      ? list.map((item, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full border border-pink-300"
          >
            {item}
          </span>
        ))
      : "Not Provided"}
  </div>
);

const InfoItem = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between text-sm py-1">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-gray-900">{F(value)}</span>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-b border-dashed border-gray-300 pb-4 mb-5">
    <h2 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wide">
      {title}
    </h2>
    {children}
  </div>
);


const PreviewComponent: React.FC<PreviewProps> = ({ data,Advance }) => {
  const dispatch = useDispatch();
  const [UpdatedData, setFormData] = useState(useSelector((state: any) => state.RegisterdUsersFullInformation));
    console.log('Check for Document00-----',data)
  const [selectedRecord, setSelectedRecord] = useState<any>(false);
   const [UpdatingStatus,setUpdatingStatus]=useState("Finalizing PDR update…")
   const DeploaymentInformation=useSelector((state:any)=>state.DeploaymentData)
   const TimeStamp=useSelector((state:any)=>state.TimeStampInfo)
   console.log("PDR Info ======", DeploaymentInformation);
   const Router=useRouter()
  const UpdateEdit = () => {
    dispatch(UpdatePreviewStatus(true));
  };


const UpdatePDRInfo = async () => {
  try {
    setSelectedRecord(true);

  
    const UpdatePDRInfoInDB = await UpdatePDR(data.userId, UpdatedData);

    if (!UpdatePDRInfoInDB.success) {
      setUpdatingStatus("Failed! Try again.");
      return;
    }


    const PlacementInformation: any = await GetInvoiceInfo();


    const GetPdrInfo = await GetUserPDRInfo(data.userId);
   

    if (!GetPdrInfo.success || !GetPdrInfo.data) {
      setUpdatingStatus("Error fetching PDR info");
      return;
    }

    const PDRStatus = GetPdrInfo.data.PDRStatus ===false;

  

    const Invoise = `#INV#${new Date().getFullYear()}_${PlacementInformation.length + 1}`;
 const CurrentMonth=`${new Date().getFullYear()}-${new Date().getMonth()+1}`



    if (PDRStatus === true) {
      // const UpdateStatus = await UpdateUserContactVerificationstatus(DeploaymentInformation.Client_Id, "Placced")
      // const UpdateHcaStatus = await UpdateHCAnstatus(DeploaymentInformation.HCA_Id, "Assigned")
      // const UpdatedHCPStatusInCompliteInformation = await UpdateHCAnstatusInFullInformation(DeploaymentInformation.HCA_Id)
      const PlacementInformation: any = await GetTimeSheetInfo();
      const DateOfCurrentDay = new Date()
      const DeploymentAttendence = [{ AttendenceDate: DateOfCurrentDay, HCPAttendence: true, AdminAttendece: true }]
      const LastDateOfMonth = new Date(DateOfCurrentDay.getFullYear(), DateOfCurrentDay.getMonth() + 1, 0)
        .toLocaleDateString('en-IN');
        const DateofToday=new Date().toLocaleDateString('In-en')
const CurrentServiceCharge=UpdatedData.serviceCharges = String(UpdatedData.serviceCharges || "").replace(/,/g, "");
 const nextCounter = PlacementInformation.length + 1;
const DeploymentInvoise = `BSV${new Date().getFullYear()}_${nextCounter}_${new Date().getTime()}`;
const PostDeployment = await InsertDeployment(
  DateofToday,               
  LastDateOfMonth,          
  "Active",                  
  DeploaymentInformation.location,          
  DeploaymentInformation.contact,            
  DeploaymentInformation.name,               
  DeploaymentInformation.PatientName,       
  DeploaymentInformation.Patient_PhoneNumber,
  DeploaymentInformation.RreferralName,      
  DeploaymentInformation.HCA_Id,             
  DeploaymentInformation.Client_Id,          
  DeploaymentInformation.HCA_Name,           
  DeploaymentInformation.HCAContact,        
  "Google",                                
  "Not Provided",                           
  "PP",                                  
  "21000",                                  
  "700",                                  
  "1800",                                    
  CurrentServiceCharge,                      
  CurrentMonth,                              
  DeploymentAttendence,                      
  TimeStamp,                                 
  DeploymentInvoise,                        
  DeploaymentInformation.Type                                  
);

      const PostInvoiceData=await PostInvoice(UpdatedData, Advance, Invoise);
      const Check=await UpdatePdrStatus(data.userId);
      console.log("Test Deployment-----",Check)
      console.log("Check Invoice Post===",PostInvoiceData)
    }


    setUpdatingStatus("Updated Successfully");

  
    setTimeout(() => {
      Router.push("/Invoices");
    }, 1500);

  } catch (err: any) {
    console.error("Update PDR Error:", err);
    setUpdatingStatus("Something went wrong!");
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-b from-gray-50 to-white shadow-xl rounded-xl border border-gray-200 font-sans">
  
      <div className="text-center border-b border-dashed border-gray-400 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-widest">
          PATIENT DAILY ROUTINE (PDR) PREVIEW
        </h1>
      </div>

    
      <Section title="Patient Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem
            label="Patient Name"
            value={data.patientName}
          />
          


          <InfoItem
            label="Relation to Patient"
            value={data.RelationtoPatient}
          />
          <InfoItem
            label="Patient Age"
            value={data.patientAge}
          />
          <InfoItem
            label="Gender"
            value={data.patientGender}
          />
          <InfoItem
            label="Occupation"
            value={data.Current_Previous_Occupation}
          />
          <InfoItem
            label="Current Location"
            value={data.patientCurrentLocation}
          />
        </div>
      </Section>

   
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Balance" value={data.Balance} />
          <InfoItem label="Sleep Issues" value={data.Sleep_Issues} />
          <InfoItem label="Depression" value={data.Depression} />
          <InfoItem label="Anxiety" value={data.Anxiety} />
          <InfoItem label="Hearing Loss" value={data.Hearing_Loss} />
          <InfoItem label="Visual Impairment" value={data.Visual_Impairment} />
          <InfoItem
            label="History of Fall"
            value={data.History_of_Fall}
          />
          <InfoItem
            label="Frequent Urination"
            value={data.Frequent_Urination}
          />
          <InfoItem label="Main Point for Patient" value={data.MainpointforPatient} />
        </div>
      </Section>
{selectedRecord && (
    <div
  className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
  onClick={() => setSelectedRecord(null)}
>
  <div
    onClick={(e) => e.stopPropagation()}
    className="
      bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl 
      p-8 w-[90%] max-w-md relative animate-scaleIn border border-gray-200
    "
  >
 

 
    <div className="flex flex-col items-center justify-center pt-6 pb-4">

    
      {UpdatingStatus !== "Updated Successfully" ? (
        <>
        
          <div className="relative h-14 w-14 mb-6">
            <div className="h-full w-full border-4 border-gray-300 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <p className="text-lg font-semibold text-gray-700 animate-pulse">
            {UpdatingStatus}
          </p>
        </>
      ) : (
        <>
         
          <div className="mb-4 animate-successPop">
            <svg
              className="h-20 w-20 text-green-500"
              viewBox="0 0 130.2 130.2"
            >
              <circle
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                cx="65.1"
                cy="65.1"
                r="62.1"
              />
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                points="100.2,40.2 51.5,88.8 29.8,67.5"
              />
            </svg>
          </div>

          <p className="text-xl font-bold text-green-600">
            {UpdatingStatus}
          </p>
        </>
      )}
    </div>
  </div>
</div>


      )}

      <Section title="Medical Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem
            label="Present Illness"
            value={data.Present_Illness}
          />
          <InfoItem
            label="Ongoing Treatment"
            value={data.OnGoing_Treatment}
          />
          <InfoItem
            label="Medical Dr Specialisation"
            value={data.MedicalDrSpecialisation}
          />
          <InfoItem
            label="Speciality Areas"
            value={data.Speciality_Areas}
          />
          <InfoItem label="Physio Score" value={data.PhysioScore} />
          <InfoItem
            label="Physiotherapy Specialisation"
            value={data.PhysiotherapySpecialisation}
          />
          <InfoItem label="Oxygen Saturation" value={data.OxygenSaturation} />
          <InfoItem label="Pulse" value={data.Pulse} />
          <InfoItem label="Temperature" value={data.Temperature} />
        </div>
      </Section>

   
      <Section title="Mobility & Assistance">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Mobility" value={data.Mobility} />
          <InfoItem label="Mobility Aids" value={data.Mobility_Aids} />
          <InfoItem
            label="Assistance Required"
            value={data.AssistanceRequire}
          />
          <InfoItem label="Walking" value={data.Walking} />
        </div>
      </Section>

   
      <Section title="Home & Living Environment">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Floor Type" value={data.Floor_Type} />
          <InfoItem
            label="Washroom Accessories"
            value={data.Washroom_Accessories}
          />
          <InfoItem
            label="Patient Room Cleaning"
            value={data.PatientRoomCleaning}
          />
        </div>
      </Section>


      <Section title="Hygiene & Care">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Hygiene" value={data.Hygiene} />
          <InfoItem
            label="Hygiene Remarks"
            value={data.Hygieneremarks}
          />
          <InfoItem label="Nail Care" value={data.NailCare} />
          <InfoItem label="Hair Wash" value={data.HairWash} />
        </div>
      </Section>


      <Section title="Diet & Nutrition">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Nutrition" value={data.Nutrition} />
          <InfoItem
            label="Nutrition Remarks"
            value={data.Nutritionremarks}
          />
          <InfoItem label="Food Allergies" value={data.Allergies} />
          <InfoItem label="Juice" value={data.Juice} />
          <InfoItem label="Food Preparation" value={data.FoodPreparation} />
          <InfoItem
            label="Special Food"
            value={data.SpecialFoodItem}
          />
        </div>
      </Section>


      <Section title="Hobbies">
        <BadgeList list={data.Hobbies || []} />
      </Section>

   
      <Section title="Medications">
        {Array.isArray(data.Medications) && data.Medications.length > 0 ? (
          data.Medications.map((med: any, index: number) => (
            <div
              key={index}
              className="border rounded-lg p-3 bg-white shadow-sm mb-3"
            >
              <InfoItem label="Medication Name" value={med?.medicationName} />
              <InfoItem label="Dose" value={med?.dose} />
              <InfoItem label="Route" value={med?.route} />
              <InfoItem label="Quantity" value={med?.quantity} />
            </div>
          ))
        ) : (
          <div className="text-gray-500">No Medications Provided</div>
        )}
      </Section>

     
      <Section title="Remarks">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem
            label="General Remarks"
            value={data.TreatmentRemarks}
          />
          <InfoItem
            label="Client Remarks"
            value={data.ClientCardRemarks}
          />
          <InfoItem
            label="Other Remarks"
            value={data.PatientDetailsCardRemarks}
          />
        </div>
      </Section>

 
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={UpdateEdit}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 rounded-md text-white hover:bg-pink-700"
        >
          <SquarePen className="w-4 h-4" />
          <span>Edit</span>
        </button>

        <button className="px-4 py-2 bg-teal-600 rounded-md text-white hover:bg-teal-700" onClick={UpdatePDRInfo}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default PreviewComponent;
