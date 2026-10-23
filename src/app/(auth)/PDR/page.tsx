  'use client'

  import React, { useCallback, useEffect, useState } from 'react'
  import {
    Heart, User, Stethoscope, Pill, CalendarDays, Droplet, BedDouble, BadgeCheck, ShowerHead,
    Users,
    Pencil,
    Save,
    BadgeInfo,
    BookOpenText,
    CircleEllipsis,
    MessageSquare,
    QrCode,
    FileText,
    Upload,
  } from 'lucide-react'
  import Preview from '@/Components/Preview/page'
  import PreviewComponent from '@/Components/Preview/page'
  import { useDispatch, useSelector } from 'react-redux'
  import { Refresh, UpdateClientSuggetion, UpdateFetchedInformation, UpdatePreviewStatus, } from '@/Redux/action'
  import { indianFamilyRelations, LeadSources, medicalSpecializations, physioSpecializations, ClientEnquiry_Filters, PDRspecialityOptions, treatmentOptions, mobilityAids, breathingEquipments, nutritionFeeds, Allergiesoptions, mealTimings, DiabeticSpecifications, FootItems, HygineOptions, floorTypes, washroomAccessories, Vitals_Options, Mobility_excercise_Options, sampleData, fields } from '@/Lib/Content'
  import MobileMedicationSchedule from '@/Components/MedicationMobileView/page'
  import MedicationSchedule from '@/Components/Medications/page'
  import { CheckboxGroup } from '@/Components/CheckboxGroup'
  import axios from 'axios'
import { GetHCACEmailandContact, GetUsersFullInfo, SuitableHCPUpdate, UpdateHCAnstatus, UpdateInvoice, UpdateNewserviceCharges, UpdatePaymentForStaff } from '@/Lib/user.action'
import { useRouter } from 'next/navigation'
import { getDaysBetween, getHCAContactNumber, GetHCPFullName } from '@/Lib/Actions'
import DatePopup from '@/Components/MissingDateRange/page'
import { UpdateInvoicePageStatus } from '@/Redux/reducer'
import OTPValidationPopup from '@/Components/OTPValidationPopup/page'
  type EditingKeys = 'PatientCardEditing' | 'ClientCardEditing' | 'PatientDetails' | 'AdditionalInformation' | 'OtherInformation' | 'EquipmentDetails' | 'Hygiene' | 'Medication';


type OTPSource = "sms" | "email" | "whatsapp";
type OTPType = "client" | "hca";
interface PrepareOTPParams {
  type: OTPType;
  source: OTPSource;
  otp: string;
}


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
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:border-[#00A9A5]/35 hover:shadow-[0_8px_24px_rgba(15,118,110,0.07)]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
              {label}
            </label>
            {!editable && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A9A5]" />
            )}
          </div>
          {editable ? (
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Enter ${label}`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#00A9A5] focus:bg-white focus:ring-4 focus:ring-[#00A9A5]/10"
            />
          ) : (
            <p className={`min-h-[24px] text-sm leading-6 ${value ? "font-semibold text-slate-800" : "text-slate-400"}`}>
              {value || "Not provided"}
            </p>
          )}
        </div>
      );
    }


  type StringMap = Record<string, string>;
  export default function DataCollectionForm() {
  const [users, setUsers] = useState<any>([]);
    const [showRemark, setShowRemark] = useState<Record<string, boolean>>({});
    const [showScanner, setShowScanner] = useState(false);
    const [PlacementValidate,setPlacementValidate]=useState(false)
    const [EditHealthcareProfessional,setEditHealthcareProfessional]=useState(false)
    const [UploadStatusMessage,setUploadStatusMessage]=useState("")
    const [StatusMessage,setStatusMessage]=useState("")
    const [form, setForm] = useState<StringMap>({});
    const [dateWarning, setDateWarning] = useState("");
    const[showPlacementSuccess ,setShowPlacementSuccess]=useState(false)
    const [isInvoiseEditing, setisInvoiseEditing] = React.useState(false);
    const [otherInputs, setOtherInputs] = useState<StringMap>({});
    const [AdvanceAmount,setAdvanceAmount]=useState<any>("")
    const [ShowBillEdit,setShowBillEdit]=useState(false)
    const [EditMessage,setEditMessage]=useState("")
      const [selectedHCP,setselectedHCP]=useState<any>()
    const [isEditing, setIsEditing] = useState({ PatientCardEditing: false, ClientCardEditing: false, PatientDetails: false, AdditionalInformation: false, OtherInformation: false, EquipmentDetails: false, Hygiene: false, Medication: false });
    const dispatch = useDispatch()
    const ShowPreviewData = useSelector((state: any) => state.CurrentPreview)
const [service, setService] = useState("");
  const [otherService, setOtherService] = useState("");
  const [showOTPValidation, setShowOTPValidation] =
      useState(false);
    const UserFullInfo=useSelector((state:any)=>state.AdminFullInfo)
    const [imphcaInfo,setImphcaInfo]=useState<any>({})
     const loggedInEmail = useSelector((state: any) => state.LoggedInEmail)
    const [isOTPSubmitting, setIsOTPSubmitting] =
      useState(false);
  const [ShowDateRangePopUp,setShowDateRangePopUp]=useState(false)
  const [ValidateDetails,SetValidateDetails]=useState<any>({})
 
  const [InvoiseInformation, setInvoiseInformation] = useState<any>({
  enrollmentFee: "",
  dayPrice: "",
  startDate: "",
  endDate: "",
  hcaPrice: "Loading.....",
  hcaName:"Loading....",
  serviceDays: "",
});
  const DeploaymentInformation = useSelector(
    (state: any) => state.DeploaymentData
  );

  const options = [
    "Business Vendor",
    "Baby Care",
    "Physio Service",
    "Other",
  ];
const reduxFormData = useSelector(
  (state: any) => state.RegisterdUsersFullInformation
);

const [formData, setFormData] = useState<any>({});
const router=useRouter()

useEffect(() => {
  const fetchData = async () => {
    if (!reduxFormData) return;

    setFormData(reduxFormData);

    const fullInformation = await GetUsersFullInfo();
  setUsers(fullInformation)
 setFormData((prev: any) => ({
    ...prev,
    ClientAgreementFront: "",
    ClientAgreementBack: "",
    ClientAgreementFullPdf:""
  }));
    const cleanNumber = (val: any) => {
      if (!val) return "";
      const cleaned = String(val).replace(/[^\d.]/g, "");
      return cleaned ? Number(cleaned) : "";
    };

    const hcaData = fullInformation
      ?.map((each: any) => each?.HCAComplitInformation)
      ?.find((info: any) => info?.UserId === DeploaymentInformation.HCA_Id);

    setInvoiseInformation((prev: any) => ({
      ...prev,
      enrollmentFee: cleanNumber(reduxFormData.RegistrationFee) || 0,
      dayPrice: cleanNumber(reduxFormData.serviceCharges),
      hcaPrice:  Math.round(Number(cleanNumber(hcaData?.PaymentforStaff)) / 30) || 0,
      hcaName:GetHCPFullName(UserFullInfo,DeploaymentInformation.HCA_Id)||""

     
    }));
  };

  fetchData();
}, [reduxFormData]);



const handleInvoiseChange = (key: any, value: any) => {
  setInvoiseInformation((prev: any) => {
    const updated = {
      ...prev,
      [key]: value,
    };

    if (key === "startDate" || key === "endDate") {
      updated.serviceDays = getDaysBetween(
        updated.startDate,
        updated.endDate
      );

      if (updated.startDate && updated.endDate) {
        const start = new Date(updated.startDate);
        const end = new Date(updated.endDate);

        const isSameMonth =
          start.getMonth() === end.getMonth() &&
          start.getFullYear() === end.getFullYear();

        setDateWarning(
          isSameMonth
            ? ""
            : "⚠ Both Service Start and End Dates in Same Month!"
        );
      } else {
        setDateWarning("");
      }
    }

    return updated;
  });
};

    const handleChange = (key: string, value: any) => {
      setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

const handleImageChange = useCallback(
  async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const inputName = e.target.name;

    if (!file) return;

    // Validate file size (10 MB maximum)
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max allowed is 10MB.");
      e.target.value = "";
      return;
    }

    // Full Client Agreement must be a PDF
    const isFullAgreementPdf = inputName === "ClientAgreementFullPdf";

    if (isFullAgreementPdf) {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        alert("Please upload the complete Client Agreement as a PDF file.");
        e.target.value = "";
        return;
      }
    } else {
      // Allowed formats for other upload fields
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "video/webm",
        "video/ogg",
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Only image, video, or PDF files are allowed.");
        e.target.value = "";
        return;
      }
    }

    setUploadStatusMessage("Please Wait Uploading Document");

    const formDataData = new FormData();
    formDataData.append("file", file);

    try {
      const res = await axios.post("/api/Upload", formDataData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const url = res?.data?.url;

      if (!url) {
        throw new Error("Upload API did not return a file URL.");
      }

      setFormData((prev: any) => ({
        ...prev,
        [inputName]: url,
      }));

      setUploadStatusMessage("Document Uploaded Successfully");
    } catch (error: any) {
      console.error("Upload failed:", error);
      setUploadStatusMessage("Upload Failed");
      alert("Document upload failed. Please try again.");
    } finally {
      // Allows selecting the same file again
      e.target.value = "";
    }
  },
  []
);

    const handleSave = async (Item: EditingKeys) => {
     

      setIsEditing((prev) => ({ ...prev, [Item]: !prev[Item] }));
    };
    const toggleRemark = (section: any) => {
      setShowRemark((prev: any) => ({ ...prev, [section]: !prev[section] }))
    }

    //   const handleSubmit = (e: any) => {
    //     e.preventDefault()

    //     const PreviewData: any = { ...form, Inputs: { ...otherInputs }, Medications: medications }
    //     setFinelPrewData(PreviewData)
    //     console.log("Submitted Data----", PreviewData.administerBy)
    //    dispatch(UpdatePreviewStatus(false))
    //   }
    //   const addMedication = () => {
    //     setMedications(prev => [...prev, { medicationName: '', dose: '', quantity: '', route: '', administerBy: '', medTime: '', reviewDate: '' }]);
    //   };
    //   const RemoveMedication = () => {
    //     setMedications(prev => prev.slice(0, prev.length - 1))
    //   }
    //   const renderAddRemark = (section: any) => (
    //     <div className="flex justify-end gap-2 mt-4">



    //       {showRemark[section] && (

    //         <textarea
    //           name={`${section}Remark`}
    //           placeholder="Enter your remark...."
    //           className="p-2 shadow-lg border-1 text-center rounded-md  w-full text-gray-800"
    //           onChange={(e) => handleOtherChange(`${section}Remark`, e.target.value)}
    //         />

    //       )}

    //       <button type="button" onClick={() => toggleRemark(section)} className="px-2 cursor-pointer  h-8 text-center py-1 bg-green-600 text-white rounded">
    //         Add Remark
    //       </button>
    //     </div>
    //   )

    // const handleNewChange = (key: string, value: any) => {
    //     setFormData((prev:any) => ({ ...prev, [key]: value }));
    //   };

    //   const handleMedicationChange = (index: number, e: any) => {
    //     const { name, value } = e.target;
    //     const newMeds: any = [...medications];
    //     newMeds[index][name] = value;
    //     setMedications(newMeds);
    //   };

 const filterProfilePic = (users || []).map(
        (each: any) => each?.HCAComplitInformation ?? {}
      );
  const Finel = filterProfilePic.map((each: any) => ({
    id: each.UserId,
    FirstName: each.HCPFirstName,
    AadharNumber: each.HCPAdharNumber,
    Age: each.Age,
    userType: each.userType,
    Location: each['Permanent Address']||'',
    Email: each.HCPEmail,
    Contact: each.HCPContactNumber,
    CurrentStatus:each.CurrentStatus,
    userId: each.UserId,
    VerificationStatus: each.VerificationStatus,
    DetailedVerification: each.FinelVerification,
    EmailVerification: each.EmailVerification,
    ClientStatus: each.ClientStatus,
    Status: each.Status,
    provider:each.provider,
    payTerms:each.payTerms
  }));



  const HCA_List = Finel.filter((each: any) => {
  const typeMatch =
    ["healthcare-assistant", "HCA", "HCP", "HCPT"].includes(each.userType);

  const isNotAssigned =
    !each.Status?.some((s: string) => s === "Assigned");

  const isValidCurrentStatus =
    !["Sick", "Leave", "Terminated"].includes(each.CurrentStatus);

  return typeMatch && isNotAssigned && isValidCurrentStatus;
});

const updateInvoiceEditedInformation = async () => {
  
  setShowBillEdit((prev) => !prev);


  if (!ShowBillEdit) return;

  try {
    setEditMessage("Updating invoice and payment details, please wait...");


    const payment = Math.round(
      Number(InvoiseInformation?.hcaPrice || 0) * 30
    ).toString();

  
    const [updateDayPrice, hcpPaymentUpdated] = await Promise.all([
      UpdateNewserviceCharges(
        reduxFormData?.userId,
        InvoiseInformation?.dayPrice
      ),
      UpdatePaymentForStaff(
        DeploaymentInformation?.HCA_Id,
        payment
      ),
    ]);

    
    const messages = [];

    if (updateDayPrice?.success) {
      messages.push("Day price updated successfully");
    }

    if (hcpPaymentUpdated?.success) {
      messages.push("HCP payment updated successfully");
    }

    setEditMessage(
      messages.length
        ? messages.join(" & ")
        : "Update completed"
    );
  } catch (error:any) {
    console.error("Update invoice error:", error);

    setEditMessage(
      error?.message || "Failed to update invoice details"
    );
  }
};

 if (!formData || Object.keys(formData).length === 0) {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Loading patient data...</p>
    </div>
  );
}
  const handleOTPValidation = async ({
  clientOTP,
  clientSource,
  hcaOTP,
  hcaSource,
}: {
  clientOTP: string;
  clientSource: OTPSource;
  hcaOTP: string;
  hcaSource: OTPSource;
}) => {
  // Prevent duplicate submissions
  if (isOTPSubmitting) {
    return;
  }

  try {
    setIsOTPSubmitting(true);

    /*
     * ============================================================
     * BASIC VALIDATION
     * ============================================================
     */

    const normalizedClientOTP = String(clientOTP ?? "").trim();
    const normalizedHCAOTP = String(hcaOTP ?? "").trim();

    const validSources: OTPSource[] = [
      "sms",
      "email",
      "whatsapp",
    ];

    if (!validSources.includes(clientSource)) {
 alert("Invalid client verification method.");
 return;
    }

    if (!validSources.includes(hcaSource)) {
     alert("Invalid HCA verification method.");
     return;
    }

    /*
     * OTP should normally be 6 numeric digits.
     * Do not accept arbitrary strings.
     */
    const OTP_REGEX = /^\d{6}$/;

    if (!OTP_REGEX.test(normalizedClientOTP)) {
      alert("Please enter a valid 6-digit Client OTP.");
      return;

    }

    if (!OTP_REGEX.test(normalizedHCAOTP)) {
      alert("Please enter a valid 6-digit HCA OTP.");
      return;
    }

    /*
     * ============================================================
     * REQUIRED USER / PLACEMENT INFORMATION
     * ============================================================
     */

    const clientId =
      DeploaymentInformation?.Client_Id ||
      formData?.userId;

    const hcaId =
      DeploaymentInformation?.HCA_Id;

    const validatorEmail =
      typeof loggedInEmail === "string"
        ? loggedInEmail.trim().toLowerCase()
        : "";

    if (!clientId) {
      alert("Client information is missing. Please refresh the page and try again.");
      return;
    }

    if (!hcaId) {
      alert("HCA information is missing. Please refresh the page and try again.");
      return;
    }

    if (!validatorEmail) {
      alert("Your login session could not be verified. Please sign in again.");
      return;
    }


    const validationInformation = {
      ClientSource: clientSource,
      HCASource: hcaSource,
      ValidateBy: validatorEmail,
      ClientOTP: normalizedClientOTP,
      HCPOTP: normalizedHCAOTP,

      ClientOTPVerified: true,
      HCAOTPVerified: true,

      VerifiedAt: new Date().toISOString(),

      ClientId: clientId,
      HCAId: hcaId,
    };

    SetValidateDetails(validationInformation);

    /*
     * Close popup only after successful verification.
     */
    setShowOTPValidation(false);
setShowPlacementSuccess(true)
    /*
     * Continue with placement validation.
     */
    setPlacementValidate(true);

  } catch (error: unknown) {
    console.error("OTP verification failed");


    let message =
      "OTP verification failed. Please check the OTPs and try again.";


    /*
     * Keep popup open so the user can retry.
     */
    setShowOTPValidation(true);

    /*
     * Use your existing status state instead of alert().
     */
    setStatusMessage(message);

  } finally {
    setIsOTPSubmitting(false);
  }
};

  const PrepareOTPValidation = async (
  type: OTPType,
  source: OTPSource,
  otp: string
) => {
  try {
    /*
     * ============================================================
     * GET PERSON DETAILS
     * ============================================================
     *
     * Replace these fields with the actual fields from your data.
     */
const data = { ...formData, InvoiseInformation, HCAId: DeploaymentInformation.HCA_Id };
    const recipientName =
      type === "client"
        ? data?.patientName || data?.FirstName || "Client"
        : GetHCPFullName(UserFullInfo, data?.HCAId) || "HCA";

    // const recipientPhone =
    //   type === "client"
    //     ? data?.ContactNumber || data?.contact
    //     : getHCAContactNumber(UserFullInfo, data?.HCAId) || "9347877159";
    //     console.log("Check Info======",data)

        const recipientPhone ="8977975659"

//     const recipientEmail = type === "client"?data?.
// Email
//  || data?.email:imphcaInfo?.email || data?.email || ""
   
// const recipientEmail =  type === "client"?data?.Email:imphcaInfo?.email

const recipientEmail ="admin@curatehealth.in"
alert(recipientPhone)
alert(recipientEmail)
    const concernPerson =
      data?.ConcernPerson ||
      "Care Coordinator";

    const concernPhone =
      data?.ConcernPersonPhone ||
      "+91 XXXXX XXXXX";

    const emergencyNumber =
      data?.EmergencyNumber ||
      "+91 XXXXX XXXXX";

    /*
     * ============================================================
     * DATE / TIME
     * ============================================================
     */

    const startDate = data?.InvoiseInformation?.startDate;
    const endDate = data?.InvoiseInformation?.endDate;

    const formatDate = (value: any) => {
      if (!value) return "-";

      const date = new Date(value);

      if (isNaN(date.getTime())) {
        return "-";
      }

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const formatTime = (value: any) => {
      if (!value) return "-";

      const date = new Date(value);

      if (isNaN(date.getTime())) {
        return "-";
      }

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const visitDate = formatDate(startDate);

    const startTime = formatTime(startDate);

    const endTime = formatTime(endDate);

    /*
     * ============================================================
     * SUBJECT
     * ============================================================
     */

    const subject =
      "OTP Confirmation Required – Curate Care Placement";

    /*
     * ============================================================
     * PLAIN TEXT MESSAGE
     * ============================================================
     */
const logoUrl =
  "https://www.curatehealthservices.com/Icons/Curate-logoq.png";
const textMessage =
  type === "client"
    ? `
Dear ${recipientName},

Thank you for choosing Curate Health Services LLP to provide care and support for your loved one at home. We truly appreciate your trust in us, and we are committed to providing safe, respectful, compassionate, and reliable care.

To help you and your family have a smooth experience, please find the Client Information Booklet attached with this email. It contains important information about our services.

We kindly request you to go through the booklet carefully and keep it available for reference throughout the care period. It is designed to make the responsibilities and expectations clear for both the family and our caregivers.

Our goal is to ensure that your loved one receives the best possible care while maintaining a comfortable and respectful environment for everyone involved.

If you have any questions or concerns at any time, please do not hesitate to contact us. Our team is always here to support you.

OTP: ${otp}

Please provide the OTP only after you have read and understood the above information.

Thank you once again for placing your trust in Curate Health Services LLP. We look forward to working with you and your family.

Warm regards,
Curate Team


Need help?

If you have any questions or would like to discuss this Placement, please contact our care coordination team at info@curatehealth.in or Phone: +91 73860 45659.
`.trim()
    : `
Date: ${visitDate}
Visit Time: ${startTime} – ${endTime}

Confirmation

By providing the OTP below, you confirm that:

• You are willing and comfortable to provide care to the patient.
• You are aware of the care requirements communicated to you.
• You know who to contact at Curate if you have any concerns regarding the client, care delivery, working arrangements, or any other issue.
• During Curate working hours, you can contact ${concernPerson} on ${concernPhone}.
• For urgent concerns outside working hours, Curate's 24/7 emergency contact is ${emergencyNumber}.

If you have any concern about your safety, the patient condition, the care environment, or your ability to continue the assignment, please contact Curate through the appropriate channel immediately.

OTP: ${otp}

Please provide the OTP only after you have read and understood the above information and are comfortable proceeding with the assignment.

Thank you,
Curate Care Team


Need help?

If you have any questions or would like to discuss this Placement, please contact our care coordination team at info@curatehealth.in or Phone: +91 73860 45659.
`.trim();

    /*
     * ============================================================
     * HTML EMAIL
     * ============================================================
     */

const htmlMessage =
  type === "client"
    ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f7f9;
  font-family:Arial,Helvetica,sans-serif;
">

  <div style="
    max-width:650px;
    margin:30px auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 4px 20px rgba(0,0,0,0.08);
  ">

    <!-- HEADER -->
    <div style="
      background:#0f766e;
      padding:18px 25px;
    ">

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>

          <td width="55" valign="middle" style="
            width:55px;
            padding-right:12px;
          ">

            <img
              src="${logoUrl}"
              alt="Curate Health Care"
              width="45"
              height="45"
              style="
                display:block;
                width:45px;
                height:45px;
                object-fit:contain;
                border-radius:6px;
                background:#ffffff;
                padding:4px;
              "
            />

          </td>

          <td valign="middle">

            <div style="
              color:#ffffff;
              font-size:20px;
              font-weight:bold;
              line-height:1.2;
            ">
              Curate Health Care Service
            </div>

            <div style="
              color:#d9fffa;
              font-size:12px;
              margin-top:4px;
            ">
              Client Information & OTP Confirmation
            </div>

          </td>

        </tr>
      </table>

    </div>


    <!-- BODY -->
    <div style="padding:30px;">

      <p style="
        font-size:16px;
        color:#333333;
        margin-top:0;
      ">
        Dear <strong>${recipientName}</strong>,
      </p>


      <p style="
        font-size:15px;
        color:#444444;
        line-height:1.7;
      ">
        Thank you for choosing
        <strong>Curate Health Services LLP</strong>
        to provide care and support for your loved one at home.
      </p>


      <p style="
        font-size:15px;
        color:#444444;
        line-height:1.7;
      ">
        We truly appreciate your trust in us, and we are committed to
        providing safe, respectful, compassionate, and reliable care.
      </p>


      <!-- INFORMATION BOX -->
      <div style="
        background:#f0fdfa;
        border:1px solid #ccfbf1;
        border-radius:10px;
        padding:20px;
        margin:25px 0;
      ">

        <h3 style="
          margin:0 0 12px;
          color:#0f766e;
          font-size:18px;
        ">
          Client Information Booklet
        </h3>

        <p style="
          margin:0;
          color:#444444;
          line-height:1.7;
          font-size:14px;
        ">
          To help you and your family have a smooth experience,
          please find the <strong>Client Information Booklet</strong>
          attached with this email. It contains important information
          about our services.
        </p>

      </div>


      <p style="
        font-size:15px;
        color:#444444;
        line-height:1.7;
      ">
        We kindly request you to go through the booklet carefully and
        keep it available for reference throughout the care period.
      </p>


      <p style="
        font-size:15px;
        color:#444444;
        line-height:1.7;
      ">
        It is designed to make the responsibilities and expectations
        clear for both the family and our caregivers.
      </p>


      <p style="
        font-size:15px;
        color:#444444;
        line-height:1.7;
      ">
        Our goal is to ensure that your loved one receives the best
        possible care while maintaining a comfortable and respectful
        environment for everyone involved.
      </p>


      <p style="
        font-size:15px;
        color:#444444;
        line-height:1.7;
      ">
        If you have any questions or concerns at any time, please do
        not hesitate to contact us. Our team is always here to support you.
      </p>


      <!-- OTP -->
      <div style="
        text-align:center;
        margin:30px 0;
        padding:25px;
        background:#f0fdfa;
        border-radius:10px;
        border:1px solid #ccfbf1;
      ">

        <p style="
          margin:0 0 10px;
          color:#555555;
          font-size:14px;
        ">
          Your Verification OTP
        </p>

        <div style="
          font-size:36px;
          font-weight:bold;
          letter-spacing:8px;
          color:#0f766e;
        ">
          ${otp}
        </div>

        <p style="
          margin:15px 0 0;
          color:#666666;
          font-size:13px;
        ">
          Please provide this OTP only after reading and understanding
          the information provided above.
        </p>

      </div>


      <p style="
        font-size:15px;
        color:#444444;
        line-height:1.7;
      ">
        Thank you once again for placing your trust in
        <strong>Curate Health Services LLP</strong>.
        We look forward to working with you and your family.
      </p>


      <p style="
        margin-top:30px;
        color:#333333;
        line-height:1.6;
      ">
        Warm regards,<br />
        <strong>Curate Team</strong>
      </p>

    </div>


    <!-- FOOTER -->
    <div style="
      background:#f8fafc;
      padding:20px 30px;
      border-top:1px solid #e5e7eb;
      color:#555555;
      font-size:13px;
      text-align:center;
    ">

      <strong>Need help?</strong>

      <p style="margin:8px 0;">
        If you have any questions or would like to discuss this Placement,
        please contact our care coordination team.
      </p>

      <p style="margin:8px 0;">
        Email:
        <a
          href="mailto:info@curatehealth.in"
          style="color:#0f766e;"
        >
          info@curatehealth.in
        </a>
      </p>

      <p style="margin:8px 0;">
        Phone: +91 73860 45659
      </p>

      <p style="
        margin:15px 0 0;
        color:#9ca3af;
        font-size:11px;
      ">
        © ${new Date().getFullYear()} Curate Health Care Pvt. Ltd.
      </p>

    </div>

  </div>

</body>
</html>
`
    : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f7f9;
  font-family:Arial,Helvetica,sans-serif;
">

  <div style="
    max-width:650px;
    margin:30px auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 4px 20px rgba(0,0,0,0.08);
  ">

    <!-- HEADER -->
    <div style="
      background:#0f766e;
      padding:18px 25px;
    ">

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>

          <td width="55" valign="middle" style="
            width:55px;
            padding-right:12px;
          ">

            <img
              src="${logoUrl}"
              alt="Curate Health Care"
              width="45"
              height="45"
              style="
                display:block;
                width:45px;
                height:45px;
                object-fit:contain;
                border-radius:6px;
                background:#ffffff;
                padding:4px;
              "
            />

          </td>

          <td valign="middle">

            <div style="
              color:#ffffff;
              font-size:20px;
              font-weight:bold;
            ">
              Curate Health Care Service
            </div>

            <div style="
              color:#d9fffa;
              font-size:12px;
              margin-top:4px;
            ">
              OTP Confirmation Required
            </div>

          </td>

        </tr>
      </table>

    </div>


    <!-- BODY -->
    <div style="padding:30px;">

      <p style="
        font-size:16px;
        color:#333333;
      ">
        Hello <strong>${recipientName}</strong>,
      </p>


      <!-- PLACEMENT DETAILS -->
      <div style="
        background:#f0fdfa;
        border:1px solid #ccfbf1;
        border-radius:10px;
        padding:20px;
        margin:20px 0;
      ">

        <h3 style="
          margin:0 0 15px;
          color:#0f766e;
        ">
          Placement Details
        </h3>

        <p style="margin:8px 0;">
          <strong>Date:</strong> ${visitDate}
        </p>

        <p style="margin:8px 0;">
          <strong>Visit Time:</strong>
          ${startTime} – ${endTime}
        </p>

      </div>


      <!-- CONFIRMATION -->
      <h3 style="
        color:#0f766e;
        margin-top:25px;
      ">
        Confirmation
      </h3>

      <p style="
        color:#444444;
        line-height:1.6;
      ">
        By providing the OTP below, you confirm that:
      </p>


      <ul style="
        color:#444444;
        line-height:1.7;
        padding-left:22px;
      ">

        <li>
          You are willing and comfortable to provide care to the patient.
        </li>

        <li>
          You are aware of the care requirements communicated to you.
        </li>

        <li>
          You know who to contact at Curate if you have any concerns
          regarding the client, care delivery, working arrangements,
          or any other issue.
        </li>

        <li>
          During Curate working hours, you can contact
          <strong>${concernPerson}</strong>
          on <strong>${concernPhone}</strong>.
        </li>

        <li>
          For urgent concerns outside working hours,
          Curate's 24/7 emergency contact is
          <strong>${emergencyNumber}</strong>.
        </li>

      </ul>


      <!-- SAFETY -->
      <div style="
        background:#fff7ed;
        border-left:4px solid #f97316;
        padding:15px;
        margin:25px 0;
        border-radius:6px;
      ">

        <strong style="color:#c2410c;">
          Safety Notice
        </strong>

        <p style="
          margin:8px 0 0;
          color:#7c2d12;
          line-height:1.5;
        ">
          If you have any concern about your safety, the patient's
          condition, the care environment, or your ability to continue
          the assignment, please contact Curate immediately.
        </p>

      </div>


      <!-- OTP -->
      <div style="
        text-align:center;
        margin:30px 0;
        padding:25px;
        background:#f0fdfa;
        border-radius:10px;
      ">

        <p style="
          margin:0 0 10px;
          color:#555555;
          font-size:14px;
        ">
          Your Verification OTP
        </p>

        <div style="
          font-size:36px;
          font-weight:bold;
          letter-spacing:8px;
          color:#0f766e;
        ">
          ${otp}
        </div>

      </div>


      <p style="
        color:#444444;
        line-height:1.6;
      ">
        Please provide the OTP only after you have read and understood
        the above information and are comfortable proceeding with the
        assignment.
      </p>


      <p style="
        margin-top:30px;
        color:#333333;
      ">
        Thank you,<br />
        <strong>Curate Care Team</strong>
      </p>

    </div>


    <!-- FOOTER -->
    <div style="
      background:#f8fafc;
      padding:20px 30px;
      border-top:1px solid #e5e7eb;
      color:#555555;
      font-size:13px;
      text-align:center;
    ">

      <strong>Need help?</strong>

      <p style="margin:8px 0;">
        If you have any questions or would like to discuss this Placement,
        please contact our care coordination team.
      </p>

      <p style="margin:8px 0;">
        Email:
        <a
          href="mailto:info@curatehealth.in"
          style="color:#0f766e;"
        >
          info@curatehealth.in
        </a>
      </p>

      <p style="margin:8px 0;">
        Phone: +91 73860 45659
      </p>

      <p style="
        margin:15px 0 0;
        color:#9ca3af;
        font-size:11px;
      ">
        © ${new Date().getFullYear()} Curate Health Care Pvt. Ltd.
      </p>

    </div>

  </div>

</body>
</html>
`;

    /*
     * ============================================================
     * SEND EMAIL
     * ============================================================
     */

    if (source === "email") {

      if (!recipientEmail) {
        throw new Error(
          `${type} email address is not available`
        );
      }

      const response = await axios.post(
        "/api/MailSend",
        {
          to:recipientEmail || "tsiddu805@gmail.com",

          subject,

          html: htmlMessage,
        }
      );

      return response.data;
    }


    /*
     * ============================================================
     * SEND SMS
     * ============================================================
     */

    if (source === "sms") {

      if (!recipientPhone) {
        throw new Error(
          `${type} phone number is not available`
        );
      }

      /*
       * Replace this endpoint with your SMS API.
       *
       * Example:
       *
       * await axios.post("/api/SendSMS", {
       *   to: recipientPhone,
       *   message: textMessage,
       * });
       */

      const response = await axios.post(
        "/api/SendSMS",
        {
          to: recipientPhone,

          message: textMessage,
        }
      );

      return response.data;
    }


    /*
     * ============================================================
     * SEND WHATSAPP
     * ============================================================
     */

if (source === "whatsapp") {
  if (!recipientPhone) {
    throw new Error(`${type} phone number is not available`);
  }

  // Remove spaces, +, -, brackets, etc.
  const phone = recipientPhone;

  // Make sure the number contains the country code
  // Example: 919987579436
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    textMessage
  )}`;

  // Open WhatsApp in a new desktop browser tab
  window.open(whatsappUrl, "_blank");

  return {
    success: true,
    method: "whatsapp-desktop",
    phone,
  };
}

    throw new Error(
      "Unsupported OTP platform"
    );

  } catch (error) {

    console.error(
      "PrepareOTPValidation Error:",
      error
    );

    throw error;
  }
};


const PreviewHCAInfo = async () => {
  try {
    // Show OTP screen immediately
    setShowOTPValidation(true);

    // Start DB request immediately
    const hcaInfoPromise = GetHCACEmailandContact(
      DeploaymentInformation?.HCA_Id
    );

    // Scroll without blocking the API request
    requestAnimationFrame(() => {
      document
        .getElementById("OTPValidationScreen")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });

    const hcaInfo = await hcaInfoPromise;

    if (hcaInfo) {
      setImphcaInfo(hcaInfo);
    }
  } catch (error) {
    console.error("PreviewHCAInfo Error:", error);
  }
};

    return (
      <div>{ShowPreviewData ?
        <div className="min-h-screen bg-[#f4f8f8] px-0 pb-10 sm:px-3 lg:px-6"><div className="mx-auto max-w-[1440px]">
             <DatePopup
        isOpen={ShowDateRangePopUp}
        title="Missing Date Range"
        message="Kindly provide both the start date and end date to proceed."
        onClose={() => setShowDateRangePopUp(false)}
      />
          <div className="sticky top-0 z-40 mb-5 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_4px_20px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:rounded-2xl sm:px-5 lg:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3">

                  <img src="/Icons/Curate-logo.png" alt="Curate" className="h-11 w-11 rounded-xl bg-white object-contain p-1" />
              
                <div className="min-w-0">
                  {/* <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-bold uppercase tracking-[0.16em] text-[#008f8b]">Curate Health Care</span>
                    <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 sm:inline-flex">PDR</span>
                  </div> */}
                  <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                   Patient Daily Routine Assessment
                  </h1>
                  {/* <p className="text-xs text-slate-500">Personalised care assessment & service planning</p> */}
                </div>
              </div>
              <button
                onClick={()=>{ 
                  router.replace('/PDRView');
                  dispatch(Refresh(""))}}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-[#005f61] sm:w-auto"
              >
                PDR Dashboard
              </button>
            </div>
          </div>

          {/* <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Care Plan", "Active"],
              ["Assessment", "In Progress"],
              ["Patient", formData?.patientName || "—"],
              ["Review", "Required"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                <p className="mt-1 truncate text-sm font-bold text-slate-800">{value}</p>
              </div>
            ))}
          </div> */}



          <main className="w-full px-0 sm:px-1">
            <div className="relative w-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8 mb-6 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#00A9A5] before:via-[#00A9A5]/50 before:to-transparent">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
                <div className="flex min-w-0 flex-wrap items-center gap-3 mb-2">
                  <img src='Icons/telecommuting.gif' className="h-11 w-11 rounded-2xl bg-[#e8f8f7] p-2 object-contain ring-1 ring-[#00A9A5]/10" />
                  <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg lg:text-xl">Personal & Family Details</h2>
               
                </div>

                <button
                  onClick={() => (isEditing.ClientCardEditing ? handleSave('ClientCardEditing') : setIsEditing((prev) => ({ ...prev, ClientCardEditing: !prev.ClientCardEditing })))}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm
                              ${isEditing.ClientCardEditing ? 'bg-[#005f61] text-white hover:bg-[#004b4d] shadow-[#00A9A5]/10' : 'bg-slate-900 text-white hover:bg-[#005f61]'}`}
                >
                  {isEditing.ClientCardEditing ? <Save size={18} /> : <Pencil size={18} />}
                  {isEditing.ClientCardEditing ? "Save" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                <FieldItem
                  label="Current/Previous Occupation"
                  value={formData?.Current_Previous_Occupation}
                  editable={isEditing.ClientCardEditing}
                  onChange={(val) => handleChange("Current_Previous_Occupation", val)}

                />
                <FieldItem
                  label="Hobbies"
                  value={formData?.Hobbies}
                  editable={isEditing.ClientCardEditing}
                  onChange={(val) => handleChange("Hobbies", val)}

                />




                <CheckboxGroup
                  label="Relation to Patient"
                  options={indianFamilyRelations}
                  selected={formData?.RelationtoPatient ?? []}
                  editable={isEditing.ClientCardEditing}
                  onChange={(val) => handleChange("RelationtoPatient", val)}

                />


                <FieldItem
                  label="Remarks"
                  value={formData?.ClientCardRemarks}
                  editable={isEditing.ClientCardEditing}
                  onChange={(val) => handleChange("ClientCardRemarks", val)}

                />

                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
  {EditHealthcareProfessional ? (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">
        Select Healthcare Professional
      </label>
      <select
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        onChange={async (e) => {
                          try {
                            setStatusMessage("Please wait, assigning healthcare professional...");
                            const selectedHCP = HCA_List.find(
                              (hca: any) => hca.userId === e.target.value
                            );
                            if (!selectedHCP) {
                              setStatusMessage("Invalid healthcare professional selected");
                              return;
                            }
                            setselectedHCP(selectedHCP);
                            if (formData?.SuitableHCP) {
                              await UpdateHCAnstatus(formData.SuitableHCP, "Active");
                            }
                            const updateResponse = await SuitableHCPUpdate(
                              DeploaymentInformation.Client_Id,
                              DeploaymentInformation.HCA_Id,
                              selectedHCP.userId
                            );
                            if (updateResponse.success) {
                              await UpdateHCAnstatus(selectedHCP.userId, "Active");
                            }
 setFormData((prev: any) => ({ ...prev, SuitableHCP: selectedHCP.userId }));
                            setStatusMessage(updateResponse.message);
                            router.push('/PDRView')
                          } catch (error) {
                            console.error("HCP assignment error:", error);
                            setStatusMessage("Something went wrong while assigning healthcare professional");
                          }
                        }}

      >
        <option value="">Choose an HCP</option>
  {HCA_List.map((each:any) => (
    <option key={each.id} value={each.userId}>
      {each.FirstName}
    </option>
  ))}
      </select>
    </div>
  ) : (
    <div className="space-y-1">
      <p className="text-xs text-gray-500">
        Assigned Healthcare Professional
      </p>
      <p className="text-sm font-semibold text-gray-800">
    {GetHCPFullName(UserFullInfo,DeploaymentInformation.HCA_Id)||"Loading...."}
      </p>
    </div>
  )}

  <button
  onClick={()=>{ router.push("/Clientsuggetions")
      dispatch(UpdateClientSuggetion(formData.userId))}}
    className="inline-flex items-center justify-center rounded-lg border border-teal-600
               px-4 py-2 text-sm font-medium text-teal-600 cursor-pointer
               hover:bg-teal-50 transition"
  >
    Change Healthcare Professional
  </button>
 {StatusMessage && (
  <p
    className={`text-sm font-medium ${
      StatusMessage.includes("Please wait")
        ? "text-yellow-600"
        : StatusMessage.includes("Successfully")
        ? "text-green-600"
        : "text-slate-600"
    }`}
  >
    {StatusMessage}
  </p>
)}

</div>


   <div className="w-full max-w-sm flex flex-col gap-3">
    
      <label className="text-sm font-medium text-gray-700">
        Select Service to Skip Follwing Info
      </label>

      <select
        value={service}
        onChange={(e) => {
          setService(e.target.value);
          if (e.target.value !== "Other") setOtherService("");
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {service === "Other" && (
        <input
          type="text"
          placeholder="Enter other service"
          value={otherService}
          onChange={(e) => setOtherService(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>

              </div>
            </div>

            <div className="relative w-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8 mb-6 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#00A9A5] before:via-[#00A9A5]/50 before:to-transparent">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
                <div className="flex min-w-0 flex-wrap items-center gap-3 mb-2">
                  <img src='Icons/health-checkup.gif' className="h-11 w-11 rounded-2xl bg-[#e8f8f7] p-2 object-contain ring-1 ring-[#00A9A5]/10" />
                  <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg lg:text-xl">Present Health</h2>
                </div>
                <button
                  onClick={() => (isEditing.PatientCardEditing ? handleSave('PatientCardEditing') : setIsEditing((prev) => ({ ...prev, PatientCardEditing: !prev.PatientCardEditing })))}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm
                              ${isEditing.PatientCardEditing ? 'bg-[#005f61] text-white hover:bg-[#004b4d] shadow-[#00A9A5]/10' : 'bg-slate-900 text-white hover:bg-[#005f61]'}`}
                >
                  {isEditing.PatientCardEditing ? <Save size={18} /> : <Pencil size={18} />}
                  {isEditing.PatientCardEditing ? "Save" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <FieldItem
                  label="Present Illness"
                  value={formData?.Present_Illness}
                  editable={isEditing.PatientCardEditing}
                  onChange={(val) => handleChange("Present_Illness", val)}

                />


                <CheckboxGroup
                  label="Speciality Areas"
                  options={PDRspecialityOptions}
                  selected={formData?.Speciality_Areas}
                  editable={isEditing.PatientCardEditing}
                  onChange={(val) => handleChange("Speciality_Areas", val)}

                />
                <CheckboxGroup
                  label="Ongoing Treatment"
                  options={treatmentOptions}
                  selected={formData?.OnGoing_Treatment}
                  editable={isEditing.PatientCardEditing}
                  onChange={(val) => handleChange("OnGoing_Treatment", val)}

                />
                <FieldItem
                  label="Present Health Remarks"
                  value={formData?.PresentHealthRemarks}
                  editable={isEditing.PatientCardEditing}
                  onChange={(val) => handleChange("PresentHealthRemarks", val)}

                />


              </div>
            </div>
            {/* <div className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 md:w-[49%]">
                <div className="flex  flex-row justify-between items-start items-center mb-6 ">
                <div className="flex min-w-0 flex-wrap items-center gap-3 mb-2">
                <img src='Icons/medical-care.gif' className="h-11 w-11 rounded-2xl bg-[#e8f8f7] p-2 object-contain ring-1 ring-[#00A9A5]/10" />
                <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg lg:text-xl">Treatment</h2>
              </div>

                <button
                  onClick={() => (isEditing.PatientDetails? handleSave('PatientDetails') : setIsEditing((prev)=>({...prev,PatientDetails:!prev.PatientDetails})))}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm
                              ${isEditing.PatientDetails? 'bg-[#005f61] text-white hover:bg-[#004b4d] shadow-[#00A9A5]/10' : 'bg-slate-900 text-white hover:bg-[#005f61]'}`}
                >
                  {isEditing.PatientDetails ? <Save size={18} /> : <Pencil size={18} />}
                  {isEditing.PatientDetails ? "Save" : "Edit"}
                </button>
              </div>
        
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  
                  <CheckboxGroup
                  label="OnGoing Treatment"
                  options={treatmentOptions}
                  selected={formData.OnGoing_Treatment}
                  editable={isEditing.PatientDetails}
                  onChange={(val) => handleChange("OnGoing_Treatment", val)}
                  
                />
        
      
        
                <FieldItem
                  label="Treatment Remarks"
                  value={formData.TreatmentRemarks}
                  editable={isEditing.PatientDetails}
                  onChange={(val) => handleChange("TreatmentRemarks", val)}
                
                />
        
                
                
              </div>
            </div> */}
            <div className="relative w-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8 mb-6 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#00A9A5] before:via-[#00A9A5]/50 before:to-transparent">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
                <div className="flex min-w-0 flex-wrap items-center gap-3 mb-2">
                  <img src='Icons/wheelchair.gif' className="h-11 w-11 rounded-2xl bg-[#e8f8f7] p-2 object-contain ring-1 ring-[#00A9A5]/10" />
                  <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg lg:text-xl">Functional Assessments</h2>
                </div>
                <button
                  onClick={() => (isEditing.AdditionalInformation ? handleSave('AdditionalInformation') : setIsEditing((prev) => ({ ...prev, AdditionalInformation: !prev.AdditionalInformation })))}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm
                              ${isEditing.AdditionalInformation ? 'bg-[#005f61] text-white hover:bg-[#004b4d] shadow-[#00A9A5]/10' : 'bg-slate-900 text-white hover:bg-[#005f61]'}`}
                >
                  {isEditing.AdditionalInformation ? <Save size={18} /> : <Pencil size={18} />}
                  {isEditing.AdditionalInformation ? "Save" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">



                <FieldItem
                  label="patientHeight (Feet's)"
                  value={formData?.patientHeight}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("patientHeight", val)}

                />



                <CheckboxGroup
                  label="Balance"
                  options={["Yes", "No", "Stable"]}
                  selected={formData?.Balance?? []}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("Balance", val)}

                />
                <CheckboxGroup
                  label="History Of Fall"
                  options={["Yes", "No",]}
                  selected={formData?.History_of_Fall}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("History_of_Fall", val)}

                />
                <CheckboxGroup
                  label="Hearing Loss"
                  options={["Yes", "No",]}
                  selected={formData?.Hearing_Loss}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("Hearing_Loss", val)}

                />
                <CheckboxGroup
                  label="Visual Impairment"
                  options={["Yes", "No",]}
                  selected={formData?.Visual_Impairment}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("Visual_Impairment", val)}

                />
                <CheckboxGroup
                  label="Depression"
                  options={["Yes", "No",]}
                  selected={formData?.Depression}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("Depression", val)}

                />

                <CheckboxGroup
                  label="Confusion"
                  options={["Yes", "No",]}
                  selected={formData?.Confusion}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("Confusion", val)}

                />
                <CheckboxGroup
                  label="Frequent Urination"
                  options={["Yes", "No",]}
                  selected={formData?.Frequent_Urination}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("Frequent_Urination", val)}

                />
                <CheckboxGroup
                  label="Sleep Issues"
                  options={["Yes", "No",]}
                  selected={formData?.Sleep_Issues}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("Sleep_Issues", val)}

                />

                <CheckboxGroup
                  label="Anxiety"
                  options={["Yes", "No",]}
                  selected={formData?.Anxiety}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("Anxiety", val)}

                />

                <CheckboxGroup
                  label="Mobility Aids"
                  options={mobilityAids}
                  selected={formData?.Mobility_Aids}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("Mobility_Aids", val)}
                  multiple = {true}

                />






                <CheckboxGroup
                  label="Floor Type"
                  options={floorTypes}
                  selected={formData?.Floor_Type}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("Floor_Type", val)}

                />
                <CheckboxGroup
                  label="Washroom Accessories"
                  options={washroomAccessories}
                  selected={formData?.Washroom_Accessories}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("Washroom_Accessories", val)}

                />
                <FieldItem
                  label="Functional Assessments Remarks"
                  value={formData?.FunctionalAssessmentsRemarks}
                  editable={isEditing.AdditionalInformation}
                  onChange={(val) => handleChange("FunctionalAssessmentsRemarks", val)}

                />
              </div>
            </div>
            <div className="relative w-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8 mb-6 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#00A9A5] before:via-[#00A9A5]/50 before:to-transparent">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
                <div className="flex min-w-0 flex-wrap items-center gap-3 mb-2">
                  <img src='Icons/surgery-room.gif' className="h-11 w-11 rounded-2xl bg-[#e8f8f7] p-2 object-contain ring-1 ring-[#00A9A5]/10" />
                  <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg lg:text-xl">Equipment Use</h2>
                </div>

                <button
                  onClick={() => (isEditing.EquipmentDetails ? handleSave('EquipmentDetails') : setIsEditing((prev) => ({ ...prev, EquipmentDetails: !prev.EquipmentDetails })))}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm
                              ${isEditing.EquipmentDetails ? 'bg-[#005f61] text-white hover:bg-[#004b4d] shadow-[#00A9A5]/10' : 'bg-slate-900 text-white hover:bg-[#005f61]'}`}
                >
                  {isEditing.EquipmentDetails ? <Save size={18} /> : <Pencil size={18} />}
                  {isEditing.EquipmentDetails ? "Save" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                <CheckboxGroup
                  label="Breathing Equipment"
                  options={breathingEquipments}
                  selected={formData?.Breathing_Equipment}
                  editable={isEditing.EquipmentDetails}

                  onChange={(val) => handleChange("Breathing_Equipment", val)}

                />

                <FieldItem
                  label="Equipment Remark"
                  value={formData?.EquipmentRemark}
                  editable={isEditing.EquipmentDetails}
                  onChange={(val) => handleChange("EquipmentRemark", val)}

                />





              </div>
            </div>
            <div className="relative w-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8 mb-6 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#00A9A5] before:via-[#00A9A5]/50 before:to-transparent">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
                <div className="flex min-w-0 flex-wrap items-center gap-3 mb-2">
                  <img src='Icons/hand-washing.gif' className="h-11 w-11 rounded-2xl bg-[#e8f8f7] p-2 object-contain ring-1 ring-[#00A9A5]/10" />
                  <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg lg:text-xl">Hygiene & Elimination</h2>
                </div>

                <button
                  onClick={() => (isEditing.Hygiene ? handleSave('Hygiene') : setIsEditing((prev) => ({ ...prev, Hygiene: !prev.Hygiene })))}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm
                              ${isEditing.Hygiene ? 'bg-[#005f61] text-white hover:bg-[#004b4d] shadow-[#00A9A5]/10' : 'bg-slate-900 text-white hover:bg-[#005f61]'}`}
                >
                  {isEditing.Hygiene ? <Save size={18} /> : <Pencil size={18} />}
                  {isEditing.Hygiene ? "Save" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                <CheckboxGroup
                  label="Oral Care (Brushing & Face Fash)"
                  options={['Yes', 'No']}
                  selected={formData?.Brushing_FaceFash}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("Brushing_FaceFash", val)}

                />

                <CheckboxGroup
                  label="Patient Room (Cleaning)"
                  options={['Yes', 'No']}
                  selected={formData?.PatientRoomCleaning}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("PatientRoomCleaning", val)}

                />
                <CheckboxGroup
                  label=" Patient BathRoom (Cleaning)"
                  options={['Yes', 'No']}
                  selected={formData?.PatientBathRoomCleaning}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("PatientBathRoomCleaning", val)}

                />
                <CheckboxGroup
                  label="Dressing & Grooming"
                  options={['Yes', 'No']}
                  selected={formData?.Dressing_Grooming}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("Dressing_Grooming", val)}

                />
                <CheckboxGroup
                  label="Nail Care"
                  options={['Yes', 'No']}
                  selected={formData?.NailCare}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("NailCare", val)}

                />     <CheckboxGroup
                  label="Assisting in suctioning ?"
                  options={['Yes', 'No']}
                  selected={formData?.Assisting_in_suctioning}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("Assisting_in_suctioning", val)}

                />     <CheckboxGroup
                  label="Is Gloves Available ?"
                  options={['Yes', 'No']}
                  selected={formData?.Gloves_Availability}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("Gloves_Availability", val)}

                />

                <CheckboxGroup
                  label="Bed Making (Machine Wash)"
                  options={HygineOptions}
                  selected={formData?.BedMaking}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("BedMaking", val)}

                /><CheckboxGroup
                  label="Patient Clothes (Machine Wash)"
                  options={HygineOptions}
                  selected={formData?.PatientClothes}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("PatientClothes", val)}

                />
                <CheckboxGroup
                  label="Patient Bathing"
                  options={["Bed Bath", "Sponge Bath", "Water Bathing"]}
                  selected={formData?.PatientBathing}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("PatientBathing", val)}

                />
                <CheckboxGroup
                  label="Hair Wash"
                  options={["Weekly Once", "Weekly Twice", "Alternate Day", "Daily"]}
                  selected={formData?.HairWash}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("HairWash", val)}

                />
                <CheckboxGroup
                  label="Patient Indipendent of Elimination"
                  options={["Yes", 'No']}
                  selected={formData?.Patient_Indipendent_Elimination}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("Patient_Indipendent_Elimination", val)}

                />
                <CheckboxGroup
                  label="Comode"
                  options={["Indian", "Western"]}
                  selected={formData?.Comode}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("Comode", val)}

                />

                {formData?.Patient_Indipendent_Elimination === 'No' && <CheckboxGroup
                  label="Diaper"
                  options={["Yes", "No"]}
                  selected={formData?.Diaper}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("Diaper", val)}

                />}
                {formData?.Patient_Indipendent_Elimination === 'No' && <CheckboxGroup
                  label="Urine"
                  options={["Bottle Collection", "Catheter", "Diaper"]}
                  selected={formData?.Urine}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("Urine", val)}

                />}
                <FieldItem
                  label="Hygiene & Elimination"
                  value={formData?.Eliminationremarks}
                  editable={isEditing.Hygiene}
                  onChange={(val) => handleChange("Eliminationremarks", val)}

                />
              </div>
            </div>
            <div className="relative w-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8 mb-6 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#00A9A5] before:via-[#00A9A5]/50 before:to-transparent">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">
                <div className="flex min-w-0 flex-wrap items-center gap-3 mb-2">
                  <img src='Icons/nutrition-plan.gif' className="w-10 h-10 text-rose-700" />
                  <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg lg:text-xl">Nutrition & Hydration</h2>
                </div>
                <button
                  onClick={() => (isEditing.PatientDetails ? handleSave('PatientDetails') : setIsEditing((prev) => ({ ...prev, PatientDetails: !prev.PatientDetails })))}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm
                              ${isEditing.PatientDetails ? 'bg-[#005f61] text-white hover:bg-[#004b4d] shadow-[#00A9A5]/10' : 'bg-slate-900 text-white hover:bg-[#005f61]'}`}
                >
                  {isEditing.PatientDetails ? <Save size={18} /> : <Pencil size={18} />}
                  {isEditing.PatientDetails ? "Save" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                <CheckboxGroup
                  label="Feeding Methode"
                  options={nutritionFeeds}
                  selected={formData?.Feeding_Method}
                  editable={isEditing.PatientDetails}

                  onChange={(val) => handleChange("Feeding_Method", val)}

                />

                <CheckboxGroup
                  label="Hydration"
                  options={["1Ltr", "2Ltr", "3Ltr", "4Ltr", "Other"]}
                  selected={formData?.HydrationWaterLevel}
                  editable={isEditing.PatientDetails}

                  onChange={(val) => handleChange("HydrationWaterLevel", val)}

                />
                {formData?.HydrationWaterLevel === "Other" &&
                  <FieldItem
                    label="DocterAdvisedHydrationWaterLevel"
                    value={formData?.DocterAdvisedHydrationWaterLevel}
                    editable={isEditing.PatientDetails}
                    onChange={(val) => handleChange("DocterAdvisedHydrationWaterLevel", val)}

                  />
                }
                <CheckboxGroup
                  label="Juice"
                  options={["Morning", "Afternoon", "Evening", 'Night']}
                  selected={formData?.Juice}
                  editable={isEditing.PatientDetails}

                  onChange={(val) => handleChange("Juice", val)}

                />
                <CheckboxGroup
                  label="Allergies"
                  options={['Yes', 'No']}
                  selected={formData?.Allergies}
                  editable={isEditing.PatientDetails}

                  onChange={(val) => handleChange("Allergies", val)}

                />

                {formData?.Allergies === 'Yes' && <CheckboxGroup
                  label="AllergyOption"
                  options={Allergiesoptions}
                  selected={formData?.AllergyOption}
                  editable={isEditing.PatientDetails}

                  onChange={(val) => handleChange("AllergyOption", val)}

                />}

                <CheckboxGroup
                  label="Diabetic"
                  options={['Yes', 'No']}
                  selected={formData?.Doabatic}
                  editable={isEditing.PatientDetails}

                  onChange={(val) => handleChange("Doabatic", val)}

                />

                {formData?.Doabatic === "Yes" &&
                  <CheckboxGroup
                    label="DoabaticPlan"
                    options={mealTimings}
                    selected={formData?.DoabaticPlan}
                    editable={isEditing.PatientDetails}

                    onChange={(val) => handleChange("DoabaticPlan", val)}

                  />}

                {formData?.Doabatic === "Yes" &&
                  <CheckboxGroup
                    label="DiabeticSpecification"
                    options={DiabeticSpecifications}
                    selected={formData?.DiabeticSpecification}
                    editable={isEditing.PatientDetails}

                    onChange={(val) => handleChange("DiabeticSpecification", val)}

                  />}
                <CheckboxGroup
                  label="FoodPreparation"
                  options={FootItems}
                  selected={formData?.FoodPreparation}
                  editable={isEditing.PatientDetails}

                  onChange={(val) => handleChange("FoodPreparation", val)}

                />
                {formData?.FoodPreparation === "OtherItem" &&
                  <FieldItem
                    label="FoodPreparationInputs"
                    value={formData?.FoodPreparationInputs}
                    editable={isEditing.PatientDetails}
                    onChange={(val) => handleChange("FoodPreparationInputs", val)}

                  />}
                <FieldItem
                  label="Nutrition remarks"
                  value={formData?.Nutritionremarks}
                  editable={isEditing.PatientDetails}
                  onChange={(val) => handleChange("Nutritionremarks", val)}

                />

              </div>
            </div>

            <div className="relative w-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8 mb-6 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#00A9A5] before:via-[#00A9A5]/50 before:to-transparent">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">

                <div className="flex min-w-0 flex-wrap items-center gap-3 mb-2">
                  <img src='Icons/vital-Monitaring.png' className="h-11 w-11 rounded-2xl bg-[#e8f8f7] p-2 object-contain ring-1 ring-[#00A9A5]/10" />
                  <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg lg:text-xl">Vitals Monitoring & Mobility</h2>
                </div>
                <button
                  onClick={() => (isEditing.OtherInformation ? handleSave('OtherInformation') : setIsEditing((prev) => ({ ...prev, OtherInformation: !prev.OtherInformation })))}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm
                              ${isEditing.OtherInformation ? 'bg-[#005f61] text-white hover:bg-[#004b4d] shadow-[#00A9A5]/10' : 'bg-slate-900 text-white hover:bg-[#005f61]'}`}
                >
                  {isEditing.OtherInformation ? <Save size={18} /> : <Pencil size={18} />}
                  {isEditing.OtherInformation ? "Save" : "Edit"}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">




                <CheckboxGroup
                  label="Temperature"
                  options={Vitals_Options}
                  selected={formData?.Temperature}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("Temperature", val)}

                />
                {formData?.Temperature === 'Specify Time' && <input
                  type="time"

                  placeholder="Specify time"
                  className="w-[120px] h-[50px] border rounded-lg p-2 mt-2"
                  value={formData?.Temperature || ''}
                  onChange={(e) => handleChange("Temperature", e.target.value)}
                />}
                <CheckboxGroup
                  label="Pulse"
                  options={Vitals_Options}
                  selected={formData?.Pulse}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("Pulse", val)}

                />
                {formData?.Pulse === 'Specify Time' && <input
                  type="time"
                  placeholder="Specify time"
                  className="w-[120px] h-[50px] border rounded-lg p-2 mt-2"
                  value={formData?.Pulse || ''}
                  onChange={(e) => handleChange("Pulse", e.target.value)}
                />}
                <CheckboxGroup
                  label="Oxygen   Saturation"
                  options={Vitals_Options}
                  selected={formData?.OxygenSaturation}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("OxygenSaturation", val)}

                />
                {formData?.OxygenSaturation === 'Specify Time' && <input
                  type="time"
                  placeholder="Specify time"
                  className="w-[120px] h-[50px] border rounded-lg p-2 mt-2"
                  value={formData?.OxygenSaturation || ''}
                  onChange={(e) => handleChange("OxygenSaturation", e.target.value)}
                />}
                <CheckboxGroup
                  label="Blood Pressure"
                  options={Vitals_Options}
                  selected={formData?.BloodPressure}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("BloodPressure", val)}

                />
                {formData?.BloodPressure === 'Specify Time' && <input
                  type="time"
                  placeholder="Specify time"
                  className="w-[120px] h-[50px] border rounded-lg p-2 mt-2"
                  value={formData?.BloodPressure || ''}
                  onChange={(e) => handleChange("BloodPressure", e.target.value)}
                />}


                <CheckboxGroup
                  label="Passive Exercises"
                  options={Mobility_excercise_Options}
                  selected={formData?.PassiveExercises}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("PassiveExercises", val)}

                />
                <CheckboxGroup
                  label="Active Exercises"
                  options={Mobility_excercise_Options}
                  selected={formData?.ActiveExercises}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("ActiveExercises", val)}

                />
                <CheckboxGroup
                  label="Resisted Exercises"
                  options={Mobility_excercise_Options}
                  selected={formData?.ResistedExercises}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("ResistedExercises", val)}

                />
                <CheckboxGroup
                  label="Walking"
                  options={['Yes', 'No']}
                  selected={formData?.Walking}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("Walking", val)}

                />
                <CheckboxGroup
                  label="Assistant Requirment"
                  options={["One Assistant Required", "Two Assistants Required", "Independent"]}
                  selected={formData?.AssistanceRequire}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("AssistanceRequire", val)}

                />
                <CheckboxGroup
                  label="HIV Status"
                  options={['Positive', 'Negative', 'Prefer not to disclose']}
                  selected={formData?.HIV}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("HIV", val)}

                />


                <FieldItem
                  label="Mobility Remarks"
                  value={formData?.Mobilityremarks}
                  editable={isEditing.OtherInformation}
                  onChange={(val) => handleChange("Mobilityremarks", val)}

                />











              </div>
            </div>
            <div className="relative w-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-6 lg:p-7 mb-6 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#00A9A5] before:via-[#00A9A5]/50 before:to-transparent">
              <div className="flex  flex-row justify-between items-start items-center mb-6 ">

                <div className="flex min-w-0 flex-wrap items-center gap-3 mb-2">
                  <img src='Icons/tablet.gif' className="h-11 w-11 rounded-2xl bg-[#e8f8f7] p-2 object-contain ring-1 ring-[#00A9A5]/10" />
                  <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg lg:text-xl">Medication List</h2>
                </div>
              
                <button
                  onClick={() => (isEditing.Medication ? handleSave('Medication') : setIsEditing((prev) => ({ ...prev, Medication: !prev.Medication })))}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm
                              ${isEditing.Medication ? 'bg-[#005f61] text-white hover:bg-[#004b4d] shadow-[#00A9A5]/10' : 'bg-slate-900 text-white hover:bg-[#005f61]'}`}
                >
                  {isEditing.Medication ? <Save size={18} /> : <Pencil size={18} />}
                  {isEditing.Medication ? "Save" : "Edit"}
                </button>
              </div>
              {isEditing.Medication &&
                <div>< MedicationSchedule /> <MobileMedicationSchedule /></div>}
            </div>
            <div className='flex flex-col gap-4 w-full'>
              {formData?.PhysioScore === 0 && (
                <p className="animate-blink bg-red-600 text-white text-center font-bold py-2 px-6 rounded-lg shadow-lg">
                  Physio Required
                </p>

              )}



  {/* <div className="w-full mb-6">

        <label className="text-sm font-medium text-gray-700 mb-1">
          Advance Amount Paid
        </label>

        <div className="relative mb-2">
          <span className="absolute left-3 top-2.5 text-gray-500">₹</span>

          <input
            type="text"
            placeholder="Enter amount"
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg 
                      shadow-sm text-gray-800 bg-white
                      focus:outline-none focus:ring-2 focus:ring-teal-500
                      transition-all"
                      onChange={(e) => setAdvanceAmount(Number(e.target.value) || 0)}

          />
        </div>

    
        <button
          onClick={() => setShowScanner(!showScanner)}
          className="text-xs px-3 py-1 cursor-pointer rounded-md border border-teal-500 
                    text-teal-700 hover:bg-teal-50 flex items-center gap-1 transition"
        >
          <QrCode size={14} />
          {showScanner ? "Hide UPI Scanner" : "Show UPI Scanner"}
        </button>


        {showScanner && (
          <div className="mt-3 p-4 border border-gray-300 rounded-lg shadow-sm bg-white animate-fadeIn">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Scan to Pay</h3>

            <div className="w-full flex items-center justify-center">
              <img
                src="Icons/PaymentScanner.png"
                alt="UPI Scanner"
                className="w-40 h-40 object-contain rounded-lg shadow"
              />
            </div>
          </div>
        )}
      </div> */}

      {showPlacementSuccess && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20">
    <div className="w-[280px] rounded-xl bg-white p-5 text-center shadow-xl">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
        ✓
      </div>

      <p className="text-sm font-semibold text-gray-900">
        Placement OTP Validation Successful
      </p>

      <button
        onClick={() =>{
           setShowPlacementSuccess(false)
             const ScrollResult = document.getElementById("placement-validate-section")
        ScrollResult?.scrollIntoView({ behavior: "smooth" })
        
        } }
        className="mt-4 rounded-lg bg-black px-4 py-2 text-xs font-medium text-white"
      >
        OK
      </button>
    </div>
  </div>
)}

<div id="OTPValidationScreen">
  <OTPValidationPopup
   
               ImpData={{ ...formData, InvoiseInformation,HCAId:DeploaymentInformation.HCA_Id}}
        isOpen={showOTPValidation}
        onClose={() => {
          if (!isOTPSubmitting) {
            setShowOTPValidation(false);
          }
        }}

    onSendOTP={async ({
  type,
  source,
  otp,
}) => {
 

  const SendOTPresponse = await PrepareOTPValidation( type,
  source,
  otp)
}}
        isSubmitting={isOTPSubmitting}
        onSubmit={handleOTPValidation}
      />
</div>
     
<div className="w-full mb-6">
<div className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl p-6 sm:p-10">

  {/* Header */}
  <div className="flex justify-between items-center mb-8">
    <div className="flex items-center gap-4">
      <img
        src="Icons/InvoiceWithRuppenIcon.png"
        alt="Invoice Icon"
        className="w-8 h-8 object-contain"
      />
      
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-800">
          Invoice Information 
        </h2>
        <p className="text-sm text-gray-400">
          Fill in billing and service details
        </p>
      </div>
    </div>
   {EditMessage && (
    <p className="text-sm md:text-base text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-zinc-800 px-4 py-3 rounded-xl shadow-sm leading-relaxed tracking-wide border border-gray-200 dark:border-zinc-700">
      {EditMessage}
    </p>
   )}

   {dateWarning && (
  <p className="text-red-500 text-sm mt-2">
    {dateWarning}
  </p>
)}
<button
  onClick={updateInvoiceEditedInformation}
               className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer
                              ${ShowBillEdit? 'bg-teal-600 text-white hover:bg-[#1392d3]' : 'bg-teal-600  text-white hover:bg-blue-600'}`}
>
  {ShowBillEdit ? (
    <>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>

      Save 
    </>
  ) : (
    <>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 5h2m-1-1v2m-7 9v4h4l10-10-4-4L5 15z"
        />
      </svg>

      Edit 
    </>
  )}
</button>
  </div>

  {/* Fields */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
   {fields.map((field: any, index: number) => {
  const value = InvoiseInformation[field.key];

  const isDateField =
    field.key === "startDate" || field.key === "endDate";

  const isDisabled = !isDateField && !ShowBillEdit;

  return (
    <div key={index} className="flex flex-col">
  
      <label
        htmlFor={field.key}
        className="text-sm font-medium text-gray-600 mb-1"
      >
        {field.label}
      </label>
{field.key==="hcaName"?<p className="border shadow-lg bg-gray-200 rounded-md w-fit p-1 font-bold  leading-snug tracking-wide drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]">
  {value}
</p>:
      <input
  id={field.key}
  type={
    field.key === "hcaPrice" &&
    InvoiseInformation.hcaPrice === "Loading....."
      ? "text"
      : field.type || "number"
  }
  placeholder={field.placeholder}
  value={
    field.key === "hcaPrice" &&
    InvoiseInformation.hcaPrice === "Loading....."
      ? "Loading....."
      : Number.isNaN(value)
        ? "Loading..."
        : value ?? ""
  }
  onChange={(e) =>
    handleInvoiseChange(field.key, e.target.value)
  }
  disabled={
    field.key === "serviceDays" ||
    (field.key === "hcaPrice" &&
      InvoiseInformation.hcaPrice === "Loading.....")
      ? true
      : isDisabled
  }
  className={`w-full rounded-xl border px-4 py-2.5 text-gray-700
    placeholder-gray-400 transition-all duration-200 outline-none shadow-sm
    ${
      isDisabled
        ? "bg-gray-100 border-gray-200 cursor-not-allowed"
        : "bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    }`}
/>}
    </div>
  );
})}
  </div>

  {/* Profit Calculation */}
  {(() => {
  const toNumber = (val: any) => {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

const dayPrice = toNumber(InvoiseInformation.dayPrice);
const hcaPrice = toNumber(InvoiseInformation.hcaPrice);
const serviceDays = toNumber(InvoiseInformation.serviceDays);

const startDate = InvoiseInformation.startDate;
const endDate = InvoiseInformation.endDate;

if (!serviceDays) return null;

// Calculations
const dayProfit = dayPrice - hcaPrice;
const invoiceProfit = dayProfit * serviceDays;

const dayProfitPercent =
  dayPrice > 0 ? (dayProfit / dayPrice) * 100 : 0;

const invoiceTotal = dayPrice * serviceDays;

const invoiceProfitPercent =
  invoiceTotal > 0 ? (invoiceProfit / invoiceTotal) * 100 : 0;

const isProfit = invoiceProfit >= 0;

    return (
 <div
  className={`mt-8 rounded-2xl border shadow-sm p-6 transition-all duration-300
  ${
    isProfit
      ? "bg-gradient-to-br from-green-50 to-white border-green-100"
      : "bg-gradient-to-br from-red-50 to-white border-red-100"
  }`}
>
  {/* Header */}
  <div className="flex justify-between items-center mb-4">
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        Service Summary
      </p>
      <p className="text-sm font-medium text-gray-700">
        {startDate} → {endDate} • {serviceDays} days
      </p>
    </div>
   <div
      className={`w-22 h-12 flex items-center justify-center rounded-xl text-lg  font-bold
      ${
        isProfit
          ? "bg-green-100 text-green-600 p-2"
          : "bg-red-100 text-red-500 p-2"
      }`}
    >
      {isProfit ? "↑ Profit" : "↓ Loss"}
    </div>
  </div>

  {/* Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    
    {/* Day Profit */}
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <p className="text-xs text-gray-400 mb-1">Day Profit</p>
      <p className="text-sm font-semibold text-gray-800">
         {dayProfit.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {dayProfitPercent.toFixed(1)}%
      </p>
    </div>

    {/* Invoice Profit */}
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <p className="text-xs text-gray-400 mb-1">Invoice Profit</p>
      <p className="text-sm font-semibold text-gray-800">
        ₹{invoiceProfit.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {invoiceProfitPercent.toFixed(1)}%
      </p>
    </div>

  </div>
</div>
    );
  })()}

  {/* <div className="mt-6 flex justify-end">
  {!isInvoiseEditing ? (
    <button
      type="button"
      onClick={() =>setisInvoiseEditing(true)}
      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer transition"
    >
      Edit
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setisInvoiseEditing(false)}
      className="px-4 py-2 rounded-xl bg-teal-800 text-white text-sm font-medium hover:shadow-lg cursor-pointer transition"
    >
    Save
    </button>
  )}
</div> */}
</div>
</div>
{!PlacementValidate&&
<button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer transition" onClick={PreviewHCAInfo}>
  Validate Placement
</button>}

{PlacementValidate&&
<div
  className="max-w-md bg-white rounded-2xl shadow-md p-6 space-y-5"
  id="placement-validate-section"
>
  <h3 className="text-lg font-semibold text-slate-800">
    Upload Client Agreement
  </h3>

  <p className="text-sm text-slate-500">
    Upload the Front Side  and Back Side , or upload the
    complete agreement as a single PDF.
  </p>

  {/* Front and Back Side Upload */}
  <div className="flex flex-col sm:flex-row gap-4">
    {/* Front Side */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-700 mb-2">
        Front Side <span className="text-red-500">*</span>
      </p>

      {!formData?.ClientAgreementFront ? (
        <label
          htmlFor="agreementFront"
          className="flex flex-col items-center justify-center gap-2
                     border-2 border-dashed border-emerald-300
                     rounded-xl p-5 cursor-pointer
                     hover:bg-emerald-50 transition"
        >
          <svg
            className="w-8 h-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16V12M7 12V8M7 12H3M21 12h-4m-2 4l-3 3m0 0l-3-3m3 3V10"
            />
          </svg>

          <span className="text-sm font-medium text-slate-700">
            Upload Front Side
          </span>

          <input
            id="agreementFront"
            name="ClientAgreementFront"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      ) : (
        <div className="flex flex-col gap-3 border border-green-200 bg-green-50 rounded-xl p-4">
          <p className="text-sm font-medium text-slate-800">
            <span className="text-green-600">✓</span> Front Side Uploaded
          </p>

          <label
            htmlFor="agreementFront"
            className="text-sm font-medium text-emerald-600 cursor-pointer hover:underline"
          >
            Replace Front Side
            <input
              id="agreementFront"
              name="ClientAgreementFront"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      )}
    </div>

    {/* Back Side - Optional */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-700 mb-2">
        Back Side <span className="text-red-500">*</span>
      </p>

      {!formData?.ClientAgreementBack ? (
        <label
          htmlFor="agreementBack"
          className="flex flex-col items-center justify-center gap-2
                     border-2 border-dashed border-emerald-300
                     rounded-xl p-5 cursor-pointer
                     hover:bg-emerald-50 transition"
        >
          <svg
            className="w-8 h-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16V12M7 12V8M7 12H3M21 12h-4m-2 4l-3 3m0 0l-3-3m3 3V10"
            />
          </svg>

          <span className="text-sm font-medium text-slate-700">
            Upload Back Side
          </span>

          <input
            id="agreementBack"
            name="ClientAgreementBack"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      ) : (
        <div className="flex flex-col gap-3 border border-green-200 bg-green-50 rounded-xl p-4">
          <p className="text-sm font-medium text-slate-800">
            <span className="text-green-600">✓</span> Back Side Uploaded
          </p>

          <label
            htmlFor="agreementBack"
            className="text-sm font-medium text-emerald-600 cursor-pointer hover:underline"
          >
            Replace Back Side
            <input
              id="agreementBack"
              name="ClientAgreementBack"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      )}
    </div>
  </div>

  {/* OR Divider */}
  <div className="flex items-center gap-4">
    <div className="flex-1 border-t border-slate-200" />
    <span className="text-sm font-medium text-slate-400">OR</span>
    <div className="flex-1 border-t border-slate-200" />
  </div>

  {/* Full Agreement PDF Upload */}
  <div>
    <p className="text-sm font-medium text-slate-700 mb-2">
      Complete Agreement (PDF)
    </p>

    <label
      htmlFor="agreementFullPdf"
      className="flex items-center gap-3 border-2 border-dashed
                 border-blue-300 rounded-xl p-4 cursor-pointer
                 hover:bg-blue-50 transition"
    >
      <div className="flex items-center justify-center w-11 h-11
                      rounded-lg bg-blue-100 text-blue-600 shrink-0"
      >
        <FileText size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">
          Upload Full Agreement PDF
        </p>
        <p className="text-xs text-slate-500">
          PDF file only
        </p>
      </div>

      <Upload size={20} className="text-blue-600" />

      <input
        id="agreementFullPdf"
        name="ClientAgreementFullPdf"
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleImageChange}
      />
    </label>
  </div>

  {UploadStatusMessage && (
    <p
      className={`
        mt-3 px-5 py-3 rounded-xl text-center text-sm font-semibold
        transition-all duration-300 ease-in-out
        ${
          UploadStatusMessage.toLowerCase().includes("wait") ||
          UploadStatusMessage.toLowerCase().includes("uploading")
            ? "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse"
            : UploadStatusMessage.toLowerCase().includes("success")
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }
      `}
    >
      {UploadStatusMessage}
    </p>
  )}
</div>
      }

{PlacementValidate&&
              <button
                type="button"
                onClick={() => {
                  
                  if(InvoiseInformation.startDate===""||InvoiseInformation.endDate===''){
                    setShowDateRangePopUp(true)
                    return
                  }

                 const hasFrontAndBack =
  !!formData?.ClientAgreementFront &&
  !!formData?.ClientAgreementBack;

const hasFullPdf =
  !!formData?.ClientAgreementFullPdf;

if (!hasFrontAndBack && !hasFullPdf) {
  alert(
    "Please upload either both Front and Back Sides of the Client Agreement or the complete Agreement PDF."
  );
  return;
}
                  
                  dispatch(UpdatePreviewStatus(false));const payload = {
  ...formData,
  UpdatedAt: formData?.UpdatedAt
    ? new Date(formData.UpdatedAt).toISOString()
    : null,
};

dispatch(UpdateFetchedInformation(payload));
}}
                className="w-[200-px] cursor-pointer  text-center md:w-auto flex items-center justify-center gap-2 px-4 py-3 md:px-5 md:py-2 text-sm md:text-base font-medium rounded-xl shadow-sm transition-shadow duration-150
          bg-gradient-to-r from-[#00A9A5] to-[#005f61] text-white hover:shadow-lg active:shadow-md
          focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00A9A5]/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >



                <span>Preview </span>
              </button>}
            </div>
          </main>
          </div>
        </div> :(
  formData && Object.keys(formData).length > 0 ? (
    <PreviewComponent
        data={{ ...formData, InvoiseInformation,HCAId:DeploaymentInformation.HCA_Id}}
      Advance={Number(AdvanceAmount) || 0}
      ValidationData={ValidateDetails}
    />
  ) : (
    <div className="flex justify-center p-10">
      Preparing preview…
    </div>
  )
)

      }</div>
    )
  }



