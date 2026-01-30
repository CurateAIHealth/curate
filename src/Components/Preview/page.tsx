'use client';

import {
  GetDeploymentInfo,
  GetInvoiceInfo,
  GetUserPDRInfo,
  InsertDeployment,
  PostInvoice,
  UpdateHCAnstatus,
  UpdateHCAnstatusInFullInformation,
  UpdatePDR,
  UpdatePdrStatus,
  UpdateUserContactVerificationstatus,
} from "@/Lib/user.action";
import { UpdatePreviewStatus } from "@/Redux/action";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface PreviewProps {
  data: any;
  Advance: any;
}

const F = (v: any) =>
  v !== null && v !== "" && v !== undefined ? v : "Not Provided";

type BadgeListProps = {
  list?: any;
};

function BadgeList({ list }: BadgeListProps) {
  // Normalize data safely
  const safeList: string[] = Array.isArray(list)
    ? list
    : typeof list === "string"
    ? [list]
    : [];

  if (safeList.length === 0) {
    return (
      <span className="text-gray-400 text-sm">
        Not specified
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {safeList.map((item: string, i: number) => (
        <span
          key={i}
          className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full border border-pink-300"
        >
          {item}
        </span>
      ))}
    </div>
  );
}




const InfoItem = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between gap-3 min-w-0 text-sm py-1">
    <span className="text-gray-600 truncate">{label}</span>
    <span className="font-medium text-gray-900 truncate text-right">
      {F(value)}
    </span>
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

const PreviewComponent: React.FC<PreviewProps> = ({ data, Advance }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const reduxData = useSelector(
    (state: any) => state.RegisterdUsersFullInformation
  );
  const DeploaymentInformation = useSelector(
    (state: any) => state.DeploaymentData
  );
  const TimeStampInfo = useSelector(
    (state: any) => state.TimeStampInfo
  );

  const [UpdatedData, setFormData] = useState(reduxData);
  const [selectedRecord, setSelectedRecord] = useState(false);
  const [UpdatingStatus, setUpdatingStatus] = useState(
    "Finalizing PDR update…"
  );

  useEffect(() => {
    setFormData(reduxData);
  }, [reduxData]);

  useEffect(() => {
    if (UpdatingStatus === "Updated Successfully") {
      const t = setTimeout(() => {
        router.replace("/Invoices");
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [UpdatingStatus, router]);

  if (!data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Loading preview…
      </div>
    );
  }

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

      const InvoiceList: any = await GetInvoiceInfo();
      const GetPdrInfo = await GetUserPDRInfo(data.userId);

      if (!GetPdrInfo.success || !GetPdrInfo.data) {
        setUpdatingStatus("Error fetching PDR info");
        return;
      }

      const PDRStatus = GetPdrInfo.data.PDRStatus === false;

      console.log("Check PDR Status=======", GetPdrInfo.data.PDRStatus)
      
      const InvoiceNo = `#INV#${new Date().getFullYear()}_${
        InvoiceList.length + 1
      }`;
      const CurrentMonth = `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }`;

      if (PDRStatus) {
        const DeploymentList: any = await GetDeploymentInfo();
        const Today = new Date();

        const DeploymentAttendence = [
          {
            AttendenceDate: Today,
            HCPAttendence: true,
            AdminAttendece: true,
          },
        ];

        const LastDateOfMonth = new Date(
          Today.getFullYear(),
          Today.getMonth() + 1,
          0
        ).toLocaleDateString("en-IN");

        const DateofToday = Today.toLocaleDateString("en-IN");
        const CurrentServiceCharge = String(
          UpdatedData?.serviceCharges || ""
        ).replace(/,/g, "");

        const DeploymentInvoice = `BSV${new Date().getFullYear()}_${
          DeploymentList.length + 1
        }`;

        const PostDeployment=await InsertDeployment(
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
          TimeStampInfo,
          DeploymentInvoice,
          DeploaymentInformation.Type
        );

            const [invoiceRes, pdrStatusRes] = await Promise.all([
        PostInvoice(UpdatedData, Advance, InvoiceNo),
         UpdatePdrStatus(data.userId)
      ]);
         if (!invoiceRes?.success || !pdrStatusRes?.success) {
        setUpdatingStatus("Invoice or PDR status update failed");
        return;
      }
        if(PostDeployment.success){
setUpdatingStatus("PDR updated successfully. Redirecting to invoices...");
   setTimeout(() => {
      router.push("/Invoices");
    }, 3000);
        }else{
           setUpdatingStatus("Something went wrong!");
           return
        }
        
      }

      setUpdatingStatus("PDR updated successfully. Redirecting to invoices...");
        setTimeout(() => {
      router.push("/Invoices");
    }, 3000);
    } catch {
      setUpdatingStatus("Something went wrong!");
    }
  };




  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden bg-gray-50">
      <div className="px-3 sm:px-6 py-4 max-w-4xl w-full mx-auto">
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 p-4 sm:p-6 overflow-x-hidden">

          <div className="text-center border-b border-dashed border-gray-400 pb-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-widest">
              PATIENT DAILY ROUTINE (PDR) PREVIEW.
            </h1>
          </div>

         

          <Section title="Patient Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Patient Name" value={data?.patientName} />
              <InfoItem label="Relation to Patient" value={data?.RelationtoPatient} />
              <InfoItem label="Patient Age" value={data?.patientAge} />
              <InfoItem label="Gender" value={data?.patientGender} />
              <InfoItem label="Occupation" value={data?.Current_Previous_Occupation} />
              <InfoItem label="Current Location" value={data?.patientCurrentLocation} />
            </div>
          </Section>

          <Section title="Basic Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Balance" value={data?.Balance} />
              <InfoItem label="Sleep Issues" value={data?.Sleep_Issues} />
              <InfoItem label="Depression" value={data?.Depression} />
              <InfoItem label="Anxiety" value={data?.Anxiety} />
              <InfoItem label="Hearing Loss" value={data?.Hearing_Loss} />
              <InfoItem label="Visual Impairment" value={data?.Visual_Impairment} />
              <InfoItem label="History of Fall" value={data?.History_of_Fall} />
              <InfoItem label="Frequent Urination" value={data?.Frequent_Urination} />
              <InfoItem label="Main Point for Patient" value={data?.MainpointforPatient} />
            </div>
          </Section>

          <Section title="Medical Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Present Illness" value={data?.Present_Illness} />
              <InfoItem label="Ongoing Treatment" value={data?.OnGoing_Treatment} />
              <InfoItem label="Medical Dr Specialisation" value={data?.MedicalDrSpecialisation} />
              <InfoItem label="Speciality Areas" value={data?.Speciality_Areas} />
              <InfoItem label="Physio Score" value={data?.PhysioScore} />
              <InfoItem label="Physiotherapy Specialisation" value={data?.PhysiotherapySpecialisation} />
              <InfoItem label="Oxygen Saturation" value={data?.OxygenSaturation} />
              <InfoItem label="Pulse" value={data?.Pulse} />
              <InfoItem label="Temperature" value={data?.Temperature} />
            </div>
          </Section>

          <Section title="Mobility & Assistance">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Mobility" value={data?.Mobility} />
              <InfoItem label="Mobility Aids" value={data?.Mobility_Aids} />
              <InfoItem label="Assistance Required" value={data?.AssistanceRequire} />
              <InfoItem label="Walking" value={data?.Walking} />
            </div>
          </Section>

          <Section title="Home & Living Environment">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Floor Type" value={data?.Floor_Type} />
              <InfoItem label="Washroom Accessories" value={data?.Washroom_Accessories} />
              <InfoItem label="Patient Room Cleaning" value={data?.PatientRoomCleaning} />
            </div>
          </Section>

          <Section title="Hygiene & Care">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Hygiene" value={data?.Hygiene} />
              <InfoItem label="Hygiene Remarks" value={data?.Hygieneremarks} />
              <InfoItem label="Nail Care" value={data?.NailCare} />
              <InfoItem label="Hair Wash" value={data?.HairWash} />
            </div>
          </Section>

          <Section title="Diet & Nutrition">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Nutrition" value={data?.Nutrition} />
              <InfoItem label="Nutrition Remarks" value={data?.Nutritionremarks} />
              <InfoItem label="Food Allergies" value={data?.Allergies} />
              <InfoItem label="Juice" value={data?.Juice} />
              <InfoItem label="Food Preparation" value={data?.FoodPreparation} />
              <InfoItem label="Special Food" value={data?.SpecialFoodItem} />
            </div>
          </Section>

          <Section title="Hobbies">
            <BadgeList list={data?.Hobbies || []} />
          </Section>

          <Section title="Medications">
            {Array.isArray(data?.Medications) && data?.Medications.length > 0 ? (
              data?.Medications.map((med: any, index: number) => (
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
              <InfoItem label="General Remarks" value={data?.TreatmentRemarks} />
              <InfoItem label="Client Remarks" value={data?.ClientCardRemarks} />
              <InfoItem label="Other Remarks" value={data?.PatientDetailsCardRemarks} />
            </div>
          </Section>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-6">
            <button
              type="button"
              onClick={UpdateEdit}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 rounded-md text-white hover:bg-pink-700"
            >
              <SquarePen className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button
              className="px-4 py-2 bg-teal-600 rounded-md text-white hover:bg-teal-700"
              onClick={UpdatePDRInfo}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md">
            <div className="flex flex-col items-center justify-center">
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
                <p className="text-xl font-bold text-green-600">
                  {UpdatingStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewComponent;
