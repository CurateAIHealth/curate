'use client';

import { GetHCPFullName } from "@/Lib/Actions";
import {
  GetDeploymentInfo,
  GetDeploymentInfoinPreview,
  GetInvoiceInfo,
  GetInvoiceLength,
  GetUserPDRInfo,
  GetUserPDRInfoinPreview,
  InsertDeployment,
  PostInvoice,
  UpdateHCAnstatus,
  UpdateHCAnstatusInFullInformation,
  UpdatePDR,
  UpdatePdrStatus,
  UpdateUserContactVerificationstatus,
} from "@/Lib/user.action";
import { SetDeploymentInfo, UpdatePreviewStatus } from "@/Redux/action";
import axios from "axios";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface PreviewProps {
  data: any;
  Advance: any;
  ValidationData: any;
}

const F = (v: any) =>
  v !== null && v !== "" && v !== undefined ? v : "Not Provided";

type BadgeListProps = {
  list?: any;
};

  type OperationStatus = "waiting" | "running" | "completed" | "failed" | "skipped";

type OperationStep = {
  id: string;
  label: string;
  status: OperationStatus;
  detail?: string;
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

const PreviewComponent: React.FC<PreviewProps> = ({ data, Advance, ValidationData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
console.log("Check----",ValidationData)
  const reduxData = useSelector(
    (state: any) => state.RegisterdUsersFullInformation
  );


const [operationSteps, setOperationSteps] = useState<OperationStep[]>([]);
const [isSubmitting, setIsSubmitting] = useState(false);

const updateStep = (
  id: string,
  status: OperationStatus,
  detail?: string
) => {
  setOperationSteps((prev) =>
    prev.map((step) =>
      step.id === id ? { ...step, status, detail } : step
    )
  );
};
  const DeploaymentInformation = useSelector(
    (state: any) => state.DeploaymentData
  );
  
  const TimeStampInfo = useSelector(
    (state: any) => state.TimeStampInfo
  );
  const UserFullInfo=useSelector((state:any)=>state.AdminFullInfo)

  const [UpdatedData, setFormData] = useState(reduxData);
  const [selectedRecord, setSelectedRecord] = useState(false);
  const [UpdatingStatus, setUpdatingStatus] = useState(
    "Finalizing PDR update…"
  );
  const SearchMonth=useSelector((state:any)=>state.FilterMonth) 
  const SearchYear=useSelector((state:any)=>state.FilterYear) 

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
 const isSuccess = UpdatingStatus === "PDR updated successfully. Redirecting to invoices..."||"PDR created successfully. Redirecting...";
  const UpdateEdit = () => {
    dispatch(UpdatePreviewStatus(true));
  };

//   const UpdatePDRInfo = async () => {
//     try {
//       setSelectedRecord(true);

//       const UpdatePDRInfoInDB = await UpdatePDR(data.userId, UpdatedData);
//       if (!UpdatePDRInfoInDB.success) {
//         setUpdatingStatus("Failed! Try again.");
//         return;
//       }

//       const InvoiceList: any = await GetInvoiceInfo();
//       const GetPdrInfo = await GetUserPDRInfo(data.userId);

//       if (!GetPdrInfo.success || !GetPdrInfo.data) {
//         setUpdatingStatus("Error fetching PDR info");
//         return;
//       }

//       const PDRStatus = GetPdrInfo.data.PDRStatus === false;
      
//       const InvoiceNo = `#INV#${new Date().getFullYear()}_${
//         InvoiceList.length + 1
//       }`;
//       const CurrentMonth = `${new Date().getFullYear()}-${
//         new Date().getMonth() + 1
//       }`;

//       if (PDRStatus) {
//         const DeploymentList: any = await GetDeploymentInfo();
//         const Today = new Date();

//         const DeploymentAttendence = [
//           {
//             AttendenceDate: Today,
//             HCPAttendence: true,
//             AdminAttendece: true,
//           },
//         ];

//         const LastDateOfMonth = new Date(
//           Today.getFullYear(),
//           Today.getMonth() + 1,
//           0
//         ).toLocaleDateString("en-IN");

//         const DateofToday = Today.toLocaleDateString("en-IN");
//         const CurrentServiceCharge = String(
//           UpdatedData?.serviceCharges || ""
//         ).replace(/,/g, "");

//         const DeploymentInvoice = `BSV${new Date().getFullYear()}_${
//           DeploymentList.length + 1
//         }`;

//         const PostDeployment=await InsertDeployment(
//           DateofToday,
//           LastDateOfMonth,
//           "Active",
//           DeploaymentInformation.location,
//           DeploaymentInformation.contact,
//           DeploaymentInformation.name,
//           DeploaymentInformation.PatientName,
//           DeploaymentInformation.Patient_PhoneNumber,
//           DeploaymentInformation.RreferralName,
//           DeploaymentInformation.HCA_Id,
//           DeploaymentInformation.Client_Id,
//           DeploaymentInformation.HCA_Name,
//           DeploaymentInformation.HCAContact,
//           "Google",
//           "Not Provided",
//           "PP",
//           "21000",
//           "700",
//           "1800",
//           CurrentServiceCharge,
//           CurrentMonth,
//           DeploymentAttendence,
//           TimeStampInfo,
//           DeploymentInvoice,
//           DeploaymentInformation.Type,
//           data.serviceCharges,
//         );

//             const [invoiceRes, pdrStatusRes] = await Promise.all([
//         PostInvoice(UpdatedData, Advance, InvoiceNo),
//          UpdatePdrStatus(data.userId)
//       ]);
//          if (!invoiceRes?.success || !pdrStatusRes?.success) {
//         setUpdatingStatus("Invoice or PDR status update failed");
//         return;
//       }
//         if(PostDeployment.success){
// setUpdatingStatus("PDR Created successfully. Redirecting to invoices...");
//    setTimeout(() => {
//       router.push("/Invoices");
//     }, 3000);
//         }else{
//            setUpdatingStatus("Something went wrong!");
//            return
//         }
        
//       }

//       setUpdatingStatus("PDR updated successfully. Redirecting to invoices...");
//         setTimeout(() => {
//       router.push("/Invoices");
//     }, 3000);
//     } catch {
//       setUpdatingStatus("Something went wrong!");
//     }
//   };



const UpdatePDRInfo = async () => {
  if (isSubmitting) return;

  setIsSubmitting(true);
  setSelectedRecord(true);
  setUpdatingStatus("Preparing PDR update...");

  const steps: OperationStep[] = [
    {
      id: "pdr",
      label: "Updating PDR information",
      status: "waiting",
    },
    {
      id: "fetch",
      label: "Fetching PDR details",
      status: "waiting",
    },
    {
      id: "counts",
      label: "Fetching invoice and deployment counts",
      status: "waiting",
    },
    {
      id: "deployment",
      label: "Creating deployment",
      status: "waiting",
    },
    {
      id: "invoice",
      label: "Creating invoice",
      status: "waiting",
    },
    {
      id: "status",
      label: "Updating PDR status",
      status: "waiting",
    },
    {
      id: "refresh",
      label: "Refreshing deployment data",
      status: "waiting",
    },
    {
      id: "redirect",
      label: "Opening invoices",
      status: "waiting",
    },
  ];

  setOperationSteps(steps);

  const skipStep = (id: string, detail: string) => {
    updateStep(id, "skipped", detail);
  };

  const failStep = (
    id: string,
    message: string
  ) => {
    updateStep(id, "failed", message);
    setUpdatingStatus(message);
  };

  try {
    // STEP 1: Update PDR information
    updateStep("pdr", "running", "Saving PDR changes...");

    const updateRes = await UpdatePDR(
      data.userId,
      UpdatedData
    );

    if (!updateRes?.success) {
      failStep("pdr", "Failed to update PDR information.");
      return;
    }

    updateStep("pdr", "completed", "PDR information saved.");

    // STEP 2: Fetch PDR details
    updateStep("fetch", "running", "Checking current PDR status...");

    const pdrRes = await GetUserPDRInfoinPreview(
      DeploaymentInformation.Client_Id,
      DeploaymentInformation.HCA_Id
    );

    if (!pdrRes?.success || !pdrRes?.data) {
      failStep("fetch", "Failed to fetch PDR details.");
      return;
    }

    updateStep("fetch", "completed", "PDR details retrieved.");

    const isNewPDR = pdrRes.data.PDRStatus === false;

    // EXISTING PDR: No new deployment or invoice
    if (!isNewPDR) {
      skipStep("counts", "Not required for an existing PDR.");
      skipStep("deployment", "No new deployment required.");
      skipStep("invoice", "No new invoice required.");
      skipStep("status", "No new PDR status update required.");
      skipStep("refresh", "No deployment refresh required.");

      updateStep(
        "redirect",
        "running",
        "Opening the invoices page..."
      );

      setUpdatingStatus("PDR updated successfully. Redirecting...");

      updateStep("redirect", "completed", "Redirecting to invoices.");

      setTimeout(() => {
        router.push("/Invoices");
      }, 1500);

      return;
    }

    // STEP 3: Get invoice and deployment counts
    updateStep(
      "counts",
      "running",
      "Retrieving current record counts..."
    );

    const [invoiceList, deploymentList] = await Promise.all([
      GetInvoiceLength(),
      GetDeploymentInfoinPreview(),
    ]);

    updateStep(
      "counts",
      "completed",
      "Record counts retrieved."
    );

    // Prepare invoice and deployment information
    const today = new Date();

    const currentMonth =
      `${today.getFullYear()}-${today.getMonth() + 1}`;

    const invoiceNo =
      `#INV_${(invoiceList ?? 0) + 1}_${SearchMonth}_${SearchYear}`;

    const deploymentInvoice =
      `BSV${today.getFullYear()}_${deploymentList + 1}`;

    const attendance = [
      {
        AttendenceDate: today,
        HCPAttendence: true,
        AdminAttendece: true,
      },
    ];

    const clientAttendance = [
      {
        AttendenceDate: today,
        AttendeceStatus: "Present",
      },
    ];

    const serviceStartDate = new Date(
      data.InvoiseInformation.startDate
    );

    const serviceEndDate = new Date(
      data.InvoiseInformation.endDate
    );

    if (
      Number.isNaN(serviceStartDate.getTime()) ||
      Number.isNaN(serviceEndDate.getTime())
    ) {
      failStep("deployment", "Invalid service start or end date.");
      skipStep("invoice", "Stopped because service dates are invalid.");
      skipStep("status", "Stopped because service dates are invalid.");
      skipStep("refresh", "Stopped because service dates are invalid.");
      skipStep("redirect", "Resolve the date error before continuing.");
      return;
    }

    const lastDateOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).toLocaleDateString("en-IN");

    const serviceCharge = String(
      UpdatedData?.serviceCharges || ""
    ).replace(/,/g, "");

    // STEP 4: Create deployment
    updateStep(
      "deployment",
      "running",
      "Registering service dates and attendance..."
    );

    const deploymentRes = await InsertDeployment(
      serviceStartDate.toLocaleDateString("en-IN"),
      serviceEndDate.toLocaleDateString("en-IN"),
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
      serviceCharge,
      currentMonth,
      attendance,
      TimeStampInfo,
      deploymentInvoice,
      DeploaymentInformation.Type,
      data.serviceCharges,
      clientAttendance,
      DeploaymentInformation.ServiceState,
      ValidationData
    );

    if (!deploymentRes?.success) {
      failStep("deployment", "Deployment creation failed.");
      skipStep("invoice", "Stopped after deployment failure.");
      skipStep("status", "Stopped after deployment failure.");
      skipStep("refresh", "Deployment was not confirmed.");
      skipStep("redirect", "Resolve the deployment error first.");
      return;
    }

    updateStep(
      "deployment",
      "completed",
      "Deployment created successfully."
    );

    // Prepare invoice data
    const updatedDataWithInvoice = {
      ...UpdatedData,
      ServiceStartDate: serviceStartDate.toLocaleDateString("en-IN"),
      ServiceEndDate: serviceEndDate.toLocaleDateString("en-IN"),
      HCAId: data.HCAId,
      ClientAgreementFront: data.ClientAgreementFront,
      ClientAgreementBack: data.ClientAgreementBack,
      ClientAgreementFullPdf: data.ClientAgreementFullPdf,
      ServiceState: DeploaymentInformation.ServiceState,
    };

    // STEP 5: Create invoice
    updateStep(
      "invoice",
      "running",
      `Creating invoice ${invoiceNo}...`
    );

    const invoiceRes = await PostInvoice(
      updatedDataWithInvoice,
      Advance,
      invoiceNo
    );

    if (!invoiceRes?.success) {
      failStep("invoice", "Invoice creation failed.");
      skipStep("status", "Stopped because invoice creation failed.");
      skipStep("refresh", "Invoice creation needs attention.");
      skipStep("redirect", "Resolve the invoice error first.");
      return;
    }

    updateStep(
      "invoice",
      "completed",
      `Invoice ${invoiceNo} created successfully.`
    );

    // STEP 6: Update PDR status
    updateStep(
      "status",
      "running",
      "Updating PDR status..."
    );

    const statusRes = await UpdatePdrStatus(
      DeploaymentInformation.Client_Id,
      DeploaymentInformation.HCA_Id
    );

    if (!statusRes?.success) {
      failStep("status", "PDR status update failed.");
      skipStep("refresh", "PDR status update needs attention.");
      skipStep("redirect", "Resolve the status error first.");
      return;
    }

    updateStep(
      "status",
      "completed",
      "PDR status updated successfully."
    );

    // STEP 7: Refresh deployment information
    updateStep(
      "refresh",
      "running",
      "Refreshing dashboard deployment data..."
    );

    const userId = localStorage.getItem("UserId");

    const resultData =await axios.post(
  "/api/AdminPageInfo",
  {
    userId,
    Month: `${SearchYear}-${SearchYear}`,
  refreshType: "deployment",
  }
);

console.log("Check For Updated Data-----",resultData)
dispatch(SetDeploymentInfo(resultData .data.deployedLength));
    updateStep(
      "refresh",
      "completed",
      "Deployment data refreshed successfully."
    );

    // STEP 8: Redirect
    updateStep(
      "redirect",
      "running",
      "Preparing the invoices page..."
    );

    setUpdatingStatus(
      "PDR created successfully. Redirecting to invoices..."
    );

    updateStep(
      "redirect",
      "completed",
      "All requested operations completed."
    );

    setTimeout(() => {
      router.push("/Invoices");
    }, 1500);

  } catch (error) {
    console.error("[UpdatePDRInfo] Failed:", error);

    setUpdatingStatus(
      "An unexpected error occurred. Check the failed operation."
    );

    setOperationSteps((previous) => {
      const runningIndex = previous.findIndex(
        (step) => step.status === "running"
      );

      if (runningIndex === -1) return previous;

      return previous.map((step, index) =>
        index === runningIndex
          ? {
              ...step,
              status: "failed",
              detail: "The operation failed unexpectedly.",
            }
          : step
      );
    });
  } finally {
    setIsSubmitting(false);
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
<div className="rounded-3xl border border-gray-200 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] overflow-hidden">
  
  <div className="px-5 py-4">
    
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-gray-400 font-semibold">
          Invoice Overview
        </p>

        <h2 className="mt-1 text-xl font-bold text-gray-900">
          {data?.FirstName}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

        <div className="group relative overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          
          <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-cyan-100 opacity-40 -mr-6 -mt-6" />

          <p className="relative text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-700">
            HCA Name
          </p>

          <h3 className="relative mt-1 text-sm font-bold text-gray-900 truncate">
            {/* {data?.InvoiseInformation?.hcaName} */}
          {GetHCPFullName(UserFullInfo,data.HCAId)}
          </h3>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          
          <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-orange-100 opacity-40 -mr-6 -mt-6" />

          <p className="relative text-[10px] font-semibold uppercase tracking-[0.15em] text-orange-700">
            HCA Price
          </p>

          <h3 className="relative mt-1 text-sm font-bold text-orange-600">
            ₹{data?.InvoiseInformation?.hcaPrice}
          </h3>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-purple-50/70 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          
          <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-purple-100 opacity-40 -mr-6 -mt-6" />

          <p className="relative text-[10px] font-semibold uppercase tracking-[0.15em] text-purple-700">
            Client Charges
          </p>

          <h3 className="relative mt-1 text-sm font-bold text-purple-700">
            ₹{data?.serviceCharges}
          </h3>
        </div>

      </div>
    </div>
  </div>

  <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-3">
    
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />

        <p className="text-xs text-gray-600">
          <span className="font-semibold text-gray-800">
            Start Date:
          </span>{" "}
          {new Date(
            data?.InvoiseInformation?.startDate
          ).toLocaleDateString("en-IN")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-rose-500" />

        <p className="text-xs text-gray-600">
          <span className="font-semibold text-gray-800">
            End Date:
          </span>{" "}
          {new Date(
            data?.InvoiseInformation?.endDate
          ).toLocaleDateString("en-IN")}
        </p>
      </div>

    </div>
  </div>
</div>

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
     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
    <div
      className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdr-popup-title"
    >
      {/* Header */}
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              {operationSteps.some(
                (step) => step.status === "running"
              ) ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              ) : (
                <span className="text-lg font-bold text-blue-600">
                  ✓
                </span>
              )}
            </div>

            <div>
              <h2
                id="pdr-popup-title"
                className="text-base font-bold text-gray-900"
              >
                Processing PDR
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Please keep this window open while we process your request.
              </p>
            </div>
          </div>

         
        </div>
      </div>

      {/* Operation Steps */}
      <div className="max-h-[55vh] space-y-4 overflow-y-auto px-5 py-5">
        {operationSteps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
              {step.status === "completed" ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  ✓
                </span>
              ) : step.status === "failed" ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                  ✕
                </span>
              ) : step.status === "running" ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] text-gray-400">
                  {index + 1}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1 pb-1">
              <p
                className={`text-sm font-semibold ${
                  step.status === "failed"
                    ? "text-red-600"
                    : step.status === "completed"
                    ? "text-green-700"
                    : step.status === "running"
                    ? "text-blue-700"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </p>

              {step.detail && (
                <p
                  className={`mt-1 break-words text-xs leading-5 ${
                    step.status === "failed"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            {operationSteps.some(
              (step) => step.status === "failed"
            )
              ? "Processing encountered an error."
              : operationSteps.length > 0 &&
                operationSteps.every(
                  (step) => step.status === "completed"
                )
              ? "All operations completed successfully."
              : "Please wait..."}
          </p>

          
        </div>
      </div>
    </div>
  </div>
      )}
    </div>
  );
};

export default PreviewComponent;  