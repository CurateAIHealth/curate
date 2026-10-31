"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    CalendarDays, ChevronDown, Clock, UserCheck, Users, ShieldCheck,
    MessageCircle, Mail, Send, CheckCircle2, AlertTriangle, RefreshCw,
    KeyRound, X, Plus, Trash2, Snowflake,
    Smartphone,
    Trash,
    Pencil,
} from "lucide-react";
import { GetEmail, getHCAContactNumber, GetHCPFullName } from "@/Lib/Actions";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteDeployMent,
  InserTerminationData,
  PostReason,
  UpdateUserContactVerificationstatus,
  GetHCACEmailandContact,
  UpdateUserCurrentstatusInHCPView,
} from "@/Lib/user.action";
import { SetDeploymentInfo } from "@/Redux/action";
import axios from "axios";

type YesNo = "Yes" | "No" | "";
type OTPMode = "WHATSAPP" | "GMAIL" | "SMS";
type OTPRecipient = "HCA" | "CLIENT" | "HCP_MODE_OF_LEAVE" | "ADMIN";
interface OTPState {
  sent: boolean;
  verified: boolean;
  value: string;
  error: string;
  VerifiedBy  :any
  VerifiedAt:any
}
type ParentData = Record<string, any> & {
    Address?: string; Client_Id?: string; HCA_Id?: string; HCA_Name?: string;
    HCAContact?: string; PatientName?: string; Patient_PhoneNumber?: string;
    StartDate?: string; EndDate?: string; Type?: string[]; name?: string;
    contact?: string; email?: string; location?: string; Status?: string;
};

export interface HCATerminationProps {
    Type:any
    show: boolean;
    onShowChange: (value: boolean) => void;
    data: ParentData;
    /** Optional image URL for the currently assigned HCA. */
    hcaImage?: string;
    /** Override if your API route differs. */
    otpEndpoint?: string;
    /** Optional initial reason list; API results are merged with these. */
    initialReasons?: string[];
}

const EMPTY_OTP: OTPState = {
  sent: false,
  verified: false,
  value: "",
  error: "",
  VerifiedBy:"",
  VerifiedAt:""

};

const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#145DA0] focus:ring-2 focus:ring-[#145DA0]/10";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

function indianDateTime(date = new Date()) {
    return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata", day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
    });
}
const CurrentTimeInfo= new Date().toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
})
export default function HCATermination({
    Type,show, onShowChange, data, hcaImage = "", otpEndpoint = "/api/replacement-otp", initialReasons = [],
}: HCATerminationProps) {
    const dispatch = useDispatch();
    const TerminationInfo = data;
    console.log("Check Dataa----",TerminationInfo)
    const clientName = String(data?.name ?? data?.ClientName ?? "");
    const patientName = String(data?.PatientName ?? "");
    const hcaName = String(data?.HCA_Name ?? "");
    const hcaId = String(data?.HCA_Id ?? "");
    const clientId = String(data?.Client_Id ?? "");
    const hcaGender = Array.isArray(data?.Type) ? String(data.Type[0] ?? "") : String(data?.Gender ?? "");
const [HCPVerificationOTP, setHCPVerificationOTP] = useState("");
  const [ClientVerificationOTP, setClientVerificationOTP] = useState("");
    const [AdminVerificationOTP, setAdminVerificationOTP] = useState("");
    const [terminationDate, setTerminationDate] = useState("");
    const [terminationTime, setTerminationTime] = useState("");
     const [otherReason, setOtherReason] = useState("");
       const [selectedReason, setSelectedReason] = useState("");
        const [replacementReasons, setReplacementReasons] = useState<string[]>([
       
         ]);
           const [preparingQuestions, setpreparingQuestions] = useState(false)
                 const [newReplacementReason, setNewReplacementReason] = useState("");
                   const [ShowEditReasons, setShowEditReasons] = useState(false)
                    const [ActionStatusMessage, SetActionStatusMessage] = useState<any>("");
                      const [terminationReasons, setTerminationReasons] = useState<string[]>([
                      
                        ]);
                         const [newTerminationReason, setNewTerminationReason] = useState("");
     const [UpdatedCareTakerStatus, setUpdatedCareTakerStatus] = useState("")
    const [reason, setReason] = useState("");
    const [reasonNote, setReasonNote] = useState("");
  const loggedInEmail = useSelector((state: any) => state.LoggedInEmail)
    const [newReason, setNewReason] = useState("");
    const [showReasonManager, setShowReasonManager] = useState(false);
    const [checkRequested, setCheckRequested] = useState<YesNo>("");
    const [clientConcern, setClientConcern] = useState<YesNo>("");
      const [HCPEmail, setHCPEmail] = useState("Loading");
      const [hcpProfilePic,sethcpProfilePic]=useState("")
    const [clientConcernNote, setClientConcernNote] = useState("");
    const [otpModes, setOtpModes] = useState<Record<"HCA" | "CLIENT" | "HCP_MODE_OF_LEAVE", OTPMode>>({ HCA: "WHATSAPP", CLIENT: "WHATSAPP", HCP_MODE_OF_LEAVE: "WHATSAPP" });
      const [otp, setOtp] = useState<Record<OTPRecipient, OTPState>>({
     
        HCA: { ...EMPTY_OTP,VerifiedBy:"",VerifiedAt:"" },
        CLIENT: { ...EMPTY_OTP ,VerifiedBy:"",VerifiedAt:""},
        ADMIN: { ...EMPTY_OTP,VerifiedBy:"",VerifiedAt:"" },
        HCP_MODE_OF_LEAVE: { ...EMPTY_OTP,VerifiedBy:"",VerifiedAt:"" },
     
    
      }); const [otpSending, setOtpSending] = useState<OTPRecipient | null>(null);
    const [otpVerifying, setOtpVerifying] = useState<OTPRecipient | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const submissionInProgress = useRef(false);
    const [formError, setFormError] = useState("");
const UserFullInfo=useSelector((state:any)=>state.AdminFullInfo)
const users=useSelector((state:any)=>state.AdminUsers)
const HCAContactInfo=getHCAContactNumber(UserFullInfo,hcaId)
const SearchMonth = useSelector((state: any) => state.FilterMonth);
       const SearchYear = useSelector((state: any) => state.FilterYear);
useEffect(() => {
  const GetEmail = async () => {
    try {
      const ResultEmail: any =
        await GetHCACEmailandContact(hcaId);

sethcpProfilePic(ResultEmail.
ProfilePic)
      setHCPEmail(ResultEmail?.
email || "");
    } catch (error) {
      console.error("Failed to get HCP email:", error);
      setHCPEmail("");
    }
  };

  if (hcaId) {
    GetEmail();
  }
}, [hcaId]);

const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

    const otpVerifiedCount = useMemo(() => [otp.CLIENT.verified, otp.HCA.verified, otp.HCP_MODE_OF_LEAVE.verified].filter(Boolean).length, [otp]);

    const updateOTP = (recipient: OTPRecipient, changes: Partial<OTPState>) => {
        setOtp((previous) => ({ ...previous, [recipient]: { ...previous[recipient], ...changes } }));
    };

    const changeMode = (recipient: "HCA" | "CLIENT" | "HCP_MODE_OF_LEAVE", mode: OTPMode) => {
        setOtpModes((previous) => ({ ...previous, [recipient]: mode }));
        updateOTP(recipient, { sent: false, verified: false, value: "", error: "", VerifiedAt: undefined, VerifiedBy: undefined });
    };

      const sendOTP = async (recipient: OTPRecipient) => {
  try {

    if(recipient==="ADMIN"){
          setOtp((previous) => ({
      ...previous,

      [recipient]: {
        ...previous[recipient],

        sent: true,

        verified: false,

        value: "",

        error: "",
      },
    }));
        const AdminUI=document.getElementById("AdminView")
        AdminUI?.scrollIntoView({behavior:"smooth"})
    }
    setOtpSending(recipient);

    // ============================================================
    // 1. GENERATE OTP
    // ============================================================

    const NewOTP = generateOTP();

    // ============================================================
    // 2. GET RECIPIENT DETAILS
    // ============================================================

    const Client_Email = GetEmail(users, clientId);
    const HCP_Email = HCPEmail;

    const Client_Contact = data.Patient_PhoneNumber;

    const HCP_Contact =HCAContactInfo

    const Admin_Email = "admin@curatehealth.in";

    // ============================================================
    // 3. DETERMINE MODE
    // ============================================================

    const mode =
      recipient === "ADMIN"
        ? "GMAIL"
        : otpModes[recipient];

    // ============================================================
    // 4. DETERMINE EMAIL / PHONE
    // ============================================================

    let recipientEmail = Admin_Email;
    let recipientPhone = "";
    let recipientName =recipient === "HCA"? hcaName:clientName;

    // if (recipient === "CLIENT") {
    //   recipientEmail = Client_Email || "";
    //   recipientPhone = Client_Contact || "";
    //   recipientName = clientName || "Client";
    // }


    
    // if (recipient === "CLIENT") {
    //  recipientEmail ="tsiddu805@gmail.com" ;
    //   recipientPhone = "9347877159" 
    //   recipientName = clientName || "Client";
    // }
   

    // if (recipient === "HCA") {
    //   recipientEmail =HCP_Email||"tsiddu805@gmail.com" ;
    //   recipientPhone = HCP_Contact||"9347877159" 
    //   recipientName = hcaName || "HCA";
    // }

    // if (recipient === "ADMIN") {
    //   recipientEmail = Admin_Email;
    //   recipientName = "Admin";
    // }

    // ============================================================
    // 5. VALIDATE DESTINATION
    // ============================================================

    if (mode === "GMAIL" && !recipientEmail) {
      throw new Error(
        `${recipientName} email address is not available.`
      );
    }

    if (mode === "WHATSAPP" && !recipientPhone) {
      throw new Error(
        `${recipientName} WhatsApp number is not available.`
      );
    }

    // ============================================================
    // 6. OTP MESSAGE
    // ============================================================


    // ============================================================
    // 7. SEND THROUGH GMAIL
    // ============================================================

    if (mode === "GMAIL"&&recipient==="HCA") {

      const subject =
        "Curate Health - OTP Verification";

     

const htmlMessage = `
<div style="
  font-family: Arial, Helvetica, sans-serif;
  max-width: 620px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
">
  <p style="
    margin: 0 0 20px;
    font-size: 16px;
    color: #1e293b;
    font-weight: 600;
  ">
    Dear ${hcaName || "HCP"},
  </p>

  <h2 style="
    margin: 0 0 16px;
    font-size: 20px;
    color: #145DA0;
  ">
    HCP Termination Verification
  </h2>

  <p style="
    margin: 0 0 18px;
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
  ">
    You are receiving this OTP to verify the termination of your
    current placement with Curate Health.
    Please review the termination details below before proceeding.
  </p>

  <div style="
    background-color: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
  ">
    <h3 style="
      margin: 0 0 16px;
      font-size: 16px;
      color: #9a3412;
    ">
      Termination Details
    </h3>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>HCP Name:</strong> ${hcaName || "N/A"}
    </p>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Client Name:</strong> ${clientName || "N/A"}
    </p>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Patient Name:</strong> ${patientName || "N/A"}
    </p>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Termination Date:</strong>
      ${terminationDate || "Not specified"}
    </p>

    <p style="
      margin: 0;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Termination Reason:</strong>
      ${
        selectedReason === "Other"
          ? otherReason || "Not specified"
          : selectedReason || "Not specified"
      }
    </p>
  </div>

  <p style="
    margin: 0 0 18px;
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
  ">
    Please verify the information above. By providing the OTP,
    you confirm that you have reviewed the termination details
    and agree to proceed with the verification process.
    If any information is incorrect, contact the Curate Care Team
    before sharing the OTP.
  </p>

  <div style="
    text-align: center;
    margin: 28px 0;
  ">
    <p style="
      margin: 0 0 10px;
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    ">
      Your Verification OTP
    </p>

    <div style="
      display: inline-block;
      background-color: #145DA0;
      color: #ffffff;
      padding: 16px 32px;
      border-radius: 12px;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 8px;
    ">
      ${NewOTP}
    </div>
  </div>

  <p style="
    margin: 0 0 16px;
    font-size: 13px;
    color: #64748b;
    line-height: 1.7;
  ">
    This OTP is confidential. Do not share it with anyone unless
    you intend to authorize this termination verification.
  </p>

  <p style="
    margin: 0 0 8px;
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
  ">
    Thank you,
  </p>

  <p style="
    margin: 0;
    font-size: 15px;
    color: #145DA0;
    font-weight: 700;
  ">
    Curate Care Team
  </p>
</div>
`;




setHCPVerificationOTP(NewOTP)

      

      await axios.post("/api/MailSend", {
        to: recipientEmail,
        subject,
        html: htmlMessage,
      });
       setOtp((previous) => ({
      ...previous,

      [recipient]: {
        ...previous[recipient],

        sent: true,

        verified: false,

        value: "",

        error: "",
      },
    }));
    }

   
   
if(mode === "WHATSAPP"&&recipient==="HCA") {

setHCPVerificationOTP(NewOTP)
    // ============================================================
    // 8. SEND THROUGH WHATSAPP
const terminationEffectiveAt = [terminationDate, terminationTime]
  .filter(Boolean)
  .join(" ") || "the date specified in the termination request";
    const terminationOtpContext = `This OTP is requested to verify the termination of your current placement with ${clientName || "the client"}.`;
  const otpMessage = `
Curate Health - HCP Termination Verification

Dear ${recipientName || "User"},

${terminationOtpContext}

Termination Details:
Client: ${clientName || "N/A"}
Patient: ${patientName || "N/A"}
HCP: ${hcaName || "N/A"}
Termination Date: ${terminationEffectiveAt}
Reason: ${selectedReason === "Other" ? otherReason : selectedReason || "N/A"}

🔐 Verification OTP: ${NewOTP}

Please verify the termination details before sharing this OTP.
Do not share this OTP unless you are comfortable proceeding with the verification.

Curate Health Services LLP
`.trim();
  
  const whatsappUrl = `https://wa.me/${recipientPhone}?text=${encodeURIComponent(
    otpMessage
  )}`;

  // Open WhatsApp in a new desktop browser tab
  window.open(whatsappUrl, "_blank");
setOtp((previous) => ({
      ...previous,

      [recipient]: {
        ...previous[recipient],

        sent: true,

        verified: false,

        value: "",

        error: "",
      },
    }));
  return {
    success: true,
    method: "whatsapp-desktop",
    recipientPhone,
    };}
  

   
   


     if (mode === "GMAIL"&&recipient==="CLIENT") {

      const subject =
        "Curate Health - OTP Verification";

     

const htmlMessage = `
<div style="
  font-family: Arial, Helvetica, sans-serif;
  max-width: 620px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
">
  <p style="
    margin: 0 0 20px;
    font-size: 16px;
    color: #1e293b;
    font-weight: 600;
  ">
    Dear ${clientName || "Client"},
  </p>

  <h2 style="
    margin: 0 0 16px;
    font-size: 20px;
    color: #145DA0;
  ">
    HCP Termination Verification
  </h2>

  <p style="
    margin: 0 0 18px;
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
  ">
    You are receiving this OTP to verify the termination of the
    current HCP placement for your patient.
    Please review the termination details below before proceeding.
  </p>

  <div style="
    background-color: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
  ">
    <h3 style="
      margin: 0 0 16px;
      font-size: 16px;
      color: #9a3412;
    ">
      Termination Details
    </h3>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Client Name:</strong> ${clientName || "N/A"}
    </p>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Patient Name:</strong> ${patientName || "N/A"}
    </p>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>HCP Name:</strong> ${hcaName || "N/A"}
    </p>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Termination Date:</strong>
      ${terminationDate || "Not specified"}
    </p>

    <p style="
      margin: 0;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Termination Reason:</strong>
      ${
        selectedReason === "Other"
          ? otherReason || "Not specified"
          : selectedReason || "Not specified"
      }
    </p>
  </div>

  <p style="
    margin: 0 0 18px;
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
  ">
    Please review the termination information carefully.
    By providing the OTP, you confirm that you have reviewed
    these details and agree to proceed with the termination
    verification. If any information is incorrect, contact the
    Curate Care Team before sharing the OTP.
  </p>

  <div style="
    text-align: center;
    margin: 28px 0;
  ">
    <p style="
      margin: 0 0 10px;
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    ">
      Your Verification OTP
    </p>

    <div style="
      display: inline-block;
      background-color: #145DA0;
      color: #ffffff;
      padding: 16px 32px;
      border-radius: 12px;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 8px;
    ">
      ${NewOTP}
    </div>
  </div>

  <p style="
    margin: 0 0 16px;
    font-size: 13px;
    color: #64748b;
    line-height: 1.7;
  ">
    This OTP is confidential. Do not share it with anyone unless
    you intend to authorize this termination verification.
  </p>

  <p style="
    margin: 0 0 8px;
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
  ">
    Thank you,
  </p>

  <p style="
    margin: 0;
    font-size: 15px;
    color: #145DA0;
    font-weight: 700;
  ">
    Curate Care Team
  </p>
</div>
`;




setClientVerificationOTP(NewOTP)


     

      await axios.post("/api/MailSend", {
        to: recipientEmail,
        subject,
        html: htmlMessage,
      });
       alert(`OTP Deliverd to ${recipientEmail}`)
       setOtp((previous) => ({
      ...previous,

      [recipient]: {
        ...previous[recipient],

        sent: true,

        verified: false,

        value: "",

        error: "",
      },
    }));
    }
    if(mode === "WHATSAPP"&&recipient==="CLIENT") {

setClientVerificationOTP(NewOTP)

    // ============================================================
    // 8. SEND THROUGH WHATSAPP
    // ============================================================
     

const terminationEffectiveAt = [terminationDate, terminationTime]
  .filter(Boolean)
  .join(" ") || "the date specified in the termination request";

const terminationOtpContext =
  recipient === "CLIENT"
    ? `This OTP is requested to verify the termination of the current HCP placement for ${patientName || "the patient"}.`
    : recipient === "HCA"
    ? `This OTP is requested to verify the termination of your current placement with ${clientName || "the client"}.`
    : "This OTP is requested for admin verification of the HCP termination process.";

const otpMessage = `
Curate Health - HCP Termination Verification

Dear ${recipientName || "User"},

${terminationOtpContext}

Termination Details:
Client: ${clientName || "N/A"}
Patient: ${patientName || "N/A"}
HCP: ${hcaName || "N/A"}
Termination Date: ${terminationEffectiveAt}
Reason: ${selectedReason === "Other" ? otherReason : selectedReason || "N/A"}

🔐 Verification OTP: ${NewOTP}

Please verify the termination details before sharing this OTP.
Do not share this OTP unless you are comfortable proceeding with the verification.

Curate Health Services LLP
`.trim();

  
  const whatsappUrl = `https://wa.me/${recipientPhone}?text=${encodeURIComponent(
    otpMessage
  )}`;

  // Open WhatsApp in a new desktop browser tab
  window.open(whatsappUrl, "_blank");
setOtp((previous) => ({
      ...previous,

      [recipient]: {
        ...previous[recipient],

        sent: true,

        verified: false,

        value: "",

        error: "",
      },
    }));
  return {
    success: true,
    method: "whatsapp-desktop",
    recipientPhone,
    };}


        

             if (mode === "GMAIL"&&recipient==="ADMIN") {

      const subject =
        "Curate Health - OTP Verification";

     setAdminVerificationOTP(NewOTP)

const htmlMessage = `
<div style="
  font-family: Arial, Helvetica, sans-serif;
  max-width: 620px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
">
  <p style="
    margin: 0 0 20px;
    font-size: 16px;
    color: #1e293b;
    font-weight: 600;
  ">
    Dear ${clientName || "Client"},
  </p>

  <h2 style="
    margin: 0 0 16px;
    font-size: 20px;
    color: #145DA0;
  ">
    HCP Termination Verification
  </h2>

  <p style="
    margin: 0 0 18px;
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
  ">
    You are receiving this OTP to verify the termination of the
    current HCP placement for your patient.
    Please review the termination details below before proceeding.
  </p>

  <div style="
    background-color: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
  ">
    <h3 style="
      margin: 0 0 16px;
      font-size: 16px;
      color: #9a3412;
    ">
      Termination Details
    </h3>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Client Name:</strong> ${clientName || "N/A"}
    </p>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Patient Name:</strong> ${patientName || "N/A"}
    </p>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>HCP Name:</strong> ${hcaName || "N/A"}
    </p>

    <p style="
      margin: 0 0 10px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Termination Date:</strong>
      ${terminationDate || "Not specified"}
    </p>

    <p style="
      margin: 0;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    ">
      <strong>Termination Reason:</strong>
      ${
        selectedReason === "Other"
          ? otherReason || "Not specified"
          : selectedReason || "Not specified"
      }
    </p>
  </div>

  <p style="
    margin: 0 0 18px;
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
  ">
    Please review the termination information carefully.
    By providing the OTP, you confirm that you have reviewed
    these details and agree to proceed with the termination
    verification. If any information is incorrect, contact the
    Curate Care Team before sharing the OTP.
  </p>

  <div style="
    text-align: center;
    margin: 28px 0;
  ">
    <p style="
      margin: 0 0 10px;
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    ">
      Your Verification OTP
    </p>

    <div style="
      display: inline-block;
      background-color: #145DA0;
      color: #ffffff;
      padding: 16px 32px;
      border-radius: 12px;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 8px;
    ">
      ${NewOTP}
    </div>
  </div>

  <p style="
    margin: 0 0 16px;
    font-size: 13px;
    color: #64748b;
    line-height: 1.7;
  ">
    This OTP is confidential. Do not share it with anyone unless
    you intend to authorize this termination verification.
  </p>

  <p style="
    margin: 0 0 8px;
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
  ">
    Thank you,
  </p>

  <p style="
    margin: 0;
    font-size: 15px;
    color: #145DA0;
    font-weight: 700;
  ">
    Curate Care Team
  </p>
</div>
`;




setClientVerificationOTP(NewOTP)

      

      await axios.post("/api/MailSend", {
        to: recipientEmail,
        subject,
        html: htmlMessage,
      });
       setOtp((previous) => ({
      ...previous,

      [recipient]: {
        ...previous[recipient],

        sent: true,

        verified: false,

        value: "",

        error: "",
      },
    }));
    }
    // ============================================================
    // 9. SUCCESS
    // ============================================================

    setOtp((previous) => ({
      ...previous,

      [recipient]: {
        ...previous[recipient],

        sent: true,

        verified: false,

        value: "",

        error: "",
      },
    }));

    

  } catch (error: any) {

    console.error(
      `❌ Failed to send ${recipient} OTP`,
      error
    );

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "OTP could not be sent. Please try again.";

    setOtp((previous) => ({
      ...previous,

      [recipient]: {
        ...previous[recipient],

        sent: false,

        verified: false,

        value: "",

        error: errorMessage,
      },
    }));

  } finally {

    setOtpSending(null);

  }
};

  const verifyOTP = async (recipient: OTPRecipient) => {
    const value = otp[recipient].value.trim();

    if (!otp[recipient].sent) {
      setOtp((previous) => ({
        ...previous,
        [recipient]: {
          ...previous[recipient],
          error: "Please send the OTP first.",
        },
      }));
      return false;
    }

    if (!/^\d{6}$/.test(value)) {
      setOtp((previous) => ({
        ...previous,
        [recipient]: {
          ...previous[recipient],
          error: "Enter the 6-digit OTP.",
        },
      }));
      return false;
    }

    try {
      setOtpVerifying(recipient);

      if(HCPVerificationOTP===value&&recipient==="HCA"){
         setOtp((previous) => ({
        ...previous,
        [recipient]: {
          ...previous[recipient],
          verified: true,
          error: "",
          VerifiedBy:loggedInEmail,
          VerifiedAt:CurrentTimeInfo
        },
      }));
        return true;
      }
  if(ClientVerificationOTP===value&&recipient==="CLIENT"){
         setOtp((previous) => ({
        ...previous,
        [recipient]: {
          ...previous[recipient],
          verified: true,
          error: "",
              VerifiedBy:loggedInEmail,
          VerifiedAt:CurrentTimeInfo
        },
      }));
        return true;
      }
    
     
       if(AdminVerificationOTP===value&&recipient==="ADMIN"){
         setOtp((previous) => ({
        ...previous,
        [recipient]: {
          ...previous[recipient],
          verified: true,
          error: "",
              VerifiedBy:loggedInEmail,
          VerifiedAt:CurrentTimeInfo
        },
      }));
        return true;
      }else{
        setOtp((previous) => ({
        ...previous,
        [recipient]: {
          ...previous[recipient],
          verified: false,
          error:
      
            "OTP verification failed.",
        },
      }));

      return false;
      }
   

    
    } catch (error: any) {
      setOtp((previous) => ({
        ...previous,
        [recipient]: {
          ...previous[recipient],
          verified: false,
          error:
            error?.message ||
            "OTP verification failed.",
        },
      }));

      return false;
    } finally {
      setOtpVerifying(null);
    }
  };

  const GetQutions = async (QutionsType: any) => {
      try {
        setpreparingQuestions(true)
  
        const GetQutionsfromDb = await axios.post("/api/questions", {
          Type: QutionsType
        })
        if (GetQutionsfromDb.data.success) {
  
          if (QutionsType === "Replacement") {
            setReplacementReasons(GetQutionsfromDb.data.GetQuestions || []);
          } else if (QutionsType === "Termination") {
            setTerminationReasons(GetQutionsfromDb.data.GetQuestions || []);
          }
         
              setpreparingQuestions(false)
        }
  
      } catch (err: any) {
  
      }
    }
    const AddReason = async (
      type: "replacement" | "termination"
    ) => {
      const value =
        type === "replacement"
          ? newReplacementReason.trim()
          : newTerminationReason.trim();
    
      if (!value) return;
    
      const reasons =
        type === "replacement"
          ? replacementReasons
          : terminationReasons;
    
      // Check for duplicates
      if (
        reasons.some(
          (reason) => reason.toLowerCase() === value.toLowerCase()
        )
      ) {
        SetActionStatusMessage("This reason already exists.");
        return;
      }
    
      try {
        SetActionStatusMessage("Please Wait adding Reason....")
        const response = await axios.post("/api/UpdateQuestions", {
          Type: type,
          Reason: value,
            Action: "add",
        });
    
        if (response.data.success) {
          if (type === "replacement") {
            setReplacementReasons((prev) => [...prev, value]);
            setNewReplacementReason("");
          } else {
            setTerminationReasons((prev) => [...prev, value]);
            setNewTerminationReason("");
          } 
    
          SetActionStatusMessage("Reason added successfully.");
        } else {
          SetActionStatusMessage(
            response.data.message || "Failed to add reason."
          );
        }
      } catch (error) {
        console.error("Error adding reason:", error);
        SetActionStatusMessage("Failed to add reason. Please try again.");
      }
    };
    
     const DeleteReason = async (
      type: "replacement" | "termination",
      reason: string
    ) => {
      if (reason === "Other") return;
    
      if (!window.confirm(`Delete "${reason}"?`)) return;
    
      try {
        const response = await axios.post("/api/UpdateQuestions", {
          Type: type,
          Reason: reason,
          Action: "delete",
        });
    
        if (response.data.success) {
          if (type === "replacement") {
            setReplacementReasons((prev) =>
              prev.filter((item) => item !== reason)
            );
          } else {
            setTerminationReasons((prev) =>
              prev.filter((item) => item !== reason)
            );
          }
    
          if (selectedReason === reason) {
            setSelectedReason("");
          }
    
          SetActionStatusMessage("Reason deleted successfully.");
        } else {
          SetActionStatusMessage(
            response.data.message || "Failed to delete reason."
          );
        }
      } catch (error) {
        console.error("Error deleting reason:", error);
        SetActionStatusMessage("Failed to delete reason. Please try again.");
      }
    };
       const UpdateTerminationInformation = async () => {
  if (submitting || submissionInProgress.current) return;

  if (!TerminationInfo) {
    SetActionStatusMessage("Unable to submit. Required information is missing.");
    return;
  }

  const {
    HCA_Id, Client_Id, Month, HCA_Name, name, email, contact, location,
    HCAContact, TimeSheet, ClientAttendance, TerminatedTimeSheet,
  } = TerminationInfo;
  const reject = (message: string) => {
    setFormError(message);
    SetActionStatusMessage(message);
  };

  if (!Client_Id || !HCA_Id || Month == null) {
    reject("Client, HCP, or deployment month information is missing.");
    return;
  }
  // Admin verification overrides the requirement for both Client and HCP verification.
  if (!otp.ADMIN.verified && !(otp.CLIENT.verified && otp.HCA.verified)) {
    const missing = [!otp.CLIENT.verified ? "Client" : "", !otp.HCA.verified ? "HCP" : ""]
      .filter(Boolean).join(" and ");
    reject(`Please complete ${missing} OTP verification before submitting.`);
    return;
  }
  if (!selectedReason.trim()) return reject("Please select a termination reason.");
  if (selectedReason === "Other" && !otherReason.trim()) return reject("Please specify the termination reason.");
  if (!terminationDate || !terminationTime) return reject("Please enter the termination date and time.");
  if (clientConcern === "Yes" && !clientConcernNote.trim()) return reject("Please enter the client concern details.");

  let userId: string | null = null;
  try {
    userId = window.localStorage.getItem("UserId");
  } catch {
    // Storage may be unavailable in restricted browser contexts.
  }
  if (!userId?.trim()) {
    reject("Unable to identify the signed-in user. Please sign in again before submitting.");
    return;
  }

  submissionInProgress.current = true;
  setSubmitting(true);
  setFormError("");
  const identifiers = { clientId: String(Client_Id), hcaId: String(HCA_Id) };
  const logStep = (step: string, outcome: string, startedAt: number, httpStatus?: number, errorCode?: string) => {
    console.info("[HCATermination]", {
      step, ...identifiers, outcome, elapsedMs: Date.now() - startedAt,
      ...(httpStatus ? { httpStatus } : {}), ...(errorCode ? { errorCode } : {}),
    });
  };
  const runStep = async (
  step: string,
  action: () => Promise<any>,
  fallback: string
) => {
  const startedAt = Date.now();

  try {
    console.info(`[HCATermination] ${step} started`);

    const result = await action();

    console.log(`[HCATermination] ${step} response:`, result);

    const body = result?.data ?? result;

    const success =
      result === true ||
      body?.success === true ||
      body?.status === "success";

    if (!success) {
      throw new Error(
        body?.message ||
        body?.error ||
        fallback
      );
    }

    logStep(step, "succeeded", startedAt, result?.status);

    return result;

  } catch (error: any) {

    console.error(`[HCATermination] ${step} FAILED:`, {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      code: error?.code,
    });

    logStep(
      step,
      "failed",
      startedAt,
      error?.response?.status,
      error?.code || "REQUEST_FAILED"
    );

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      fallback
    );
  }
};

  try {
    const finalCareTakerStatus = UpdatedCareTakerStatus?.trim() || "Bench";
    SetActionStatusMessage("Step 1 of 5: Updating the HCP's current status...");
    await runStep("update_hcp_status", () => UpdateUserCurrentstatusInHCPView(HCA_Id, finalCareTakerStatus, loggedInEmail), "Could not confirm the HCP status update.");
alert(Client_Id)
    SetActionStatusMessage("Step 2 of 5: Updating the client's contact verification status...");
    await runStep("update_client_verification", () => UpdateUserContactVerificationstatus(Client_Id, "Lost"), "Could not confirm the client verification update.");

    SetActionStatusMessage("Step 3 of 5: Removing the deployment...");
    await runStep("delete_deployment", () => DeleteDeployMent(Client_Id, HCA_Id, Month), "Deployment deletion failed or could not be confirmed.");

    SetActionStatusMessage("Step 4 of 5: Saving the termination reason...");
    await runStep("save_termination_reason", () => PostReason(HCA_Id, Client_Id, selectedReason, otherReason, terminationDate, terminationTime), "Could not confirm the termination reason was saved.");

    SetActionStatusMessage("Step 4 of 5: Saving termination details...");
    await runStep("save_termination_details", () => InserTerminationData(
      Client_Id, HCA_Id, HCA_Name, name, email, contact, location, HCAContact,
      TimeSheet, ClientAttendance, TerminatedTimeSheet, TerminationInfo.ServiceState, otp
    ), "Could not confirm the termination details were saved.");

    // Refresh failure is separate from the already-saved termination writes.
    const refreshStartedAt = Date.now();
    logStep("refresh_dashboard", "started", refreshStartedAt);
    try {
     
      const response = await axios.post("/api/AdminPageInfo", {
        userId, Month: `${SearchYear}-${SearchMonth}`,
        refreshType: ["registeredUsers", "deployment"],
      });
      
      dispatch(SetDeploymentInfo(response.data?.data?.deployedLength || 0));
      logStep("refresh_dashboard", "succeeded", refreshStartedAt, response.status);
      SetActionStatusMessage("Termination completed successfully. Dashboard data is refreshed.");
    } catch (error: any) {
      logStep("refresh_dashboard", "failed", refreshStartedAt,
        typeof error?.response?.status === "number" ? error.response.status : undefined,
        typeof error?.code === "string" ? error.code : "REFRESH_FAILED");
      SetActionStatusMessage("Termination was saved successfully, but the dashboard could not be refreshed. Please retry the dashboard refresh.");
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Termination could not be completed. Please contact support before retrying.";
    setFormError(errorMessage);
    SetActionStatusMessage(`Termination stopped before all updates were confirmed: ${errorMessage}`);
  } finally {
    submissionInProgress.current = false;
    setSubmitting(false);
  }
};

    if (!show) return (
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button type="button" onClick={() => onShowChange(true)} className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-4 py-4 text-left sm:px-6">
                <span className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#145DA0] text-white"><Snowflake size={22} /></span><span><strong className="block text-base text-slate-800">HCP Termination</strong><small className="text-slate-500">Termination request and verification</small></span></span><ChevronDown size={20} className="text-[#145DA0]" />
            </button>
        </div>
    );

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            
            <button type="button" onClick={() => onShowChange(false)} className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-4 py-4 text-left sm:px-6">
                <span className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#145DA0] text-white"><Snowflake size={22} /></span><span><strong className="block text-base text-slate-800">HCP Termination</strong><small className="text-slate-500">Termination request and verification</small></span></span><X size={19} className="text-slate-500" />
      
            </button>
            <div className="space-y-6 p-4 sm:p-6">
              
                <SectionTitle title="Client & Patient Information" icon={<Users size={17} />} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <ReadOnlyField label="Client Name" value={clientName} /><ReadOnlyField label="Patient Name" value={patientName} />
                    <ReadOnlyField label="Client Contact" value={String(data?.contact ?? data?.Patient_PhoneNumber ?? "")} /><ReadOnlyField label="Client Email" value={String(data?.email ?? "")} /><ReadOnlyField label="Address" value={String(data?.Address ?? data?.location ?? "")} />
                </div>
                <SectionTitle title="Current HCP Information" icon={<UserCheck size={17} />} />
                <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[100px_1fr]">
                    <div className="flex justify-center sm:justify-start">{hcpProfilePic ? <img src={hcpProfilePic} alt={hcaName} className="h-24 w-24 rounded-2xl border object-cover" /> : <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-sky-100 text-[#145DA0]"><UserCheck size={32} /></div>}</div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><ReadOnlyField label="HCP Name" value={GetHCPFullName(UserFullInfo, hcaId)} /><ReadOnlyField label="HCP Contact" value={HCAContactInfo} /><ReadOnlyField label="HCP Start Date & Time" value={String(data?.StartDate ?? "")} /><ReadOnlyField label="Gender / Type" value={hcaGender} /><ReadOnlyField label="Current Status" value={String(data?.Status ?? "")} /></div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-500">
                      Reason for Termination
                    </label>
                    {terminationReasons.length > 1 && (
                      <button type="button" onClick={() => setShowEditReasons(!ShowEditReasons)}
                        className="rounded-lg bg-blue-600 px-2 py-2 text-white transition-colors hover:bg-blue-700">
                        <Pencil size={18} />
                      </button>
                    )}
                  </div>
                  {terminationReasons.length < 1 ? (
                    <button type="button" disabled={preparingQuestions}
                      onClick={() => GetQutions("Termination")}
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-blue-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70">
                      <span>{preparingQuestions ? "Loading reasons..." : "Choose reason"}</span>
                      {preparingQuestions && <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm">
                        <option value="">Select a termination reason</option>
                        {terminationReasons.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                      {ShowEditReasons && (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input value={newTerminationReason} onChange={(e) => setNewTerminationReason(e.target.value)}
                              placeholder="Enter new termination reason" className="flex-1 rounded-lg border px-3 py-2 text-sm" />
                            <button type="button" onClick={() => AddReason("termination")}
                              className="rounded-lg bg-blue-600 px-4 py-2 text-white"><Plus size={18} /></button>
                          </div>
                          {terminationReasons.map((item) => (
                            <div key={item} className="flex items-center justify-between rounded-lg border px-3 py-2">
                              <span className="text-sm">{item}</span>
                              {item !== "Other" && <button type="button" onClick={() => DeleteReason("termination", item)}
                                className="text-red-500 hover:text-red-700"><Trash size={16} /></button>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {selectedReason === "Other" && (
                    <textarea rows={3} placeholder="Please specify the termination reason" value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      className="mt-2 w-full resize-none rounded-xl border border-gray-300 bg-white/90 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  )}
                </div>
                <section>
                  <SectionTitle title="Termination Details" icon={<CalendarDays size={17} />} />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Termination Date" type="date" value={terminationDate} onChange={setTerminationDate} />
                    <Field label="Termination Time" type="time" value={terminationTime} onChange={setTerminationTime} />
                  </div>
                </section>
                <section><SectionTitle title="OTP Verification" icon={<KeyRound size={17} />} /><p className="mb-3 text-xs text-slate-500">Verified {otpVerifiedCount} of 2 required OTPs.</p><div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <OTPCard title="Client OTP" 
                    name={clientName} 
                    recipient="CLIENT" 
                    mode={otpModes.CLIENT}
                     state={otp.CLIENT} 
                     sending={otpSending === "CLIENT"} 
                     verifying={otpVerifying === "CLIENT"} 
                     onMode={(mode) => changeMode("CLIENT", mode)} 
                     onValue={(value) => updateOTP("CLIENT", { value: value.replace(/\D/g, "").slice(0, 6), verified: false, error: "" })} 
                     onSend={() => sendOTP("CLIENT")} 
                     onVerify={() => verifyOTP("CLIENT")} 
                     onAdminFallback={() => sendOTP("ADMIN")}
                     Contact={data?.Patient_PhoneNumber}
                   Email={GetEmail(users, clientId)} />
                   
                    <OTPCard title="HCP OTP"
                     name={GetHCPFullName(UserFullInfo, hcaId)}
                      recipient="HCA" 
                      mode={otpModes.HCA}
                       state={otp.HCA} 
                       sending={otpSending === "HCA"}
                        verifying={otpVerifying === "HCA"}
                         onMode={(mode) => changeMode("HCA", mode)}
                          onValue={(value) => updateOTP("HCA", { value: value.replace(/\D/g, "").slice(0, 6), verified: false, error: "" })} 
                          onSend={() => sendOTP("HCA")} 
                          onVerify={() => verifyOTP("HCA")} 
                          onAdminFallback={() => sendOTP("ADMIN")}
                          Contact={HCAContactInfo}
                        Email={HCPEmail} />
                </div>

                    {otp.ADMIN.sent && <div className="mt-4" id="AdminView">
                        <OTPCard title="Admin Fallback OTP" 
                        name="Admin" recipient="ADMIN"
                         mode="GMAIL" 
                        state={otp.ADMIN} sending={otpSending === "ADMIN"} 
                        verifying={otpVerifying === "ADMIN"} onMode={() => undefined}
                         onValue={(value) => updateOTP("ADMIN", { value: value.replace(/\D/g, "").slice(0, 6), verified: false, error: "" })}
                          onSend={() => sendOTP("ADMIN")} onVerify={() => verifyOTP("ADMIN")} 
                          onAdminFallback={() => sendOTP("ADMIN")}  Contact={"89779 75659"}
                        Email={"admin@curatehealth.in"}
    /></div>}
   
                </section>
                {ActionStatusMessage&&
                <div role="status" aria-live="polite" className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm text-center font-medium shadow-sm ${submitting ? "border-sky-300 bg-sky-50 text-sky-800" : "border-teal-300 bg-teal-100 text-teal-800"}`}>
                  {submitting && <RefreshCw size={16} className="shrink-0 animate-spin" />}
                  <span>{ActionStatusMessage}</span>
</div>}

<div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row"><button type="button" onClick={() => onShowChange(false)} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600">Cancel</button><button type="button" disabled={
  (!(otp.CLIENT.verified && otp.HCA.verified) && !otp.ADMIN.verified) ||
  submitting
} onClick={UpdateTerminationInformation} className="flex items-center justify-center gap-2 rounded-xl bg-[#145DA0] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{submitting ? "Submitting..." : <><UserCheck size={17} /> Submit Termination</>}</button></div>
            </div>
     
        </div>
    );
}

function SectionTitle({ title, icon }: { title: string; icon: React.ReactNode }) {
    return <div className="mb-3 flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-[#145DA0]">{icon}</span><h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">{title}</h3></div>;
}
function ReadOnlyField({ label, value }: { label: string; value?: string }) {
    return <div className="min-w-0"><label className={labelClass}>{label}</label><div className="flex min-h-[42px] items-center break-words rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">{value || "—"}</div></div>;
}
function Field({ label, type, value, onChange, min }: { label: string; type: string; value: string; onChange: (value: string) => void; min?: string }) {
    return <div><label className={labelClass}>{label}</label><input className={inputClass} type={type} min={min} value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}
function YesNoField({ label, value, onChange }: { label: string; value: YesNo; onChange: (value: "Yes" | "No") => void }) {
    return <div><p className="mb-3 text-sm font-semibold text-slate-700">{label}</p><div className="grid max-w-sm grid-cols-2 gap-3">{(["Yes", "No"] as const).map((item) => <button key={item} type="button" onClick={() => onChange(item)} className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${value === item ? item === "Yes" ? "border-emerald-700 bg-emerald-700 text-white" : "border-rose-700 bg-rose-700 text-white" : "border-slate-300 bg-white text-slate-600"}`}>{item}</button>)}</div></div>;
}



function OTPCard({
    title,
    name,
    recipient,
    mode,
    state,
    sending,
    verifying,
    onMode,
    onValue,
    onSend,
    onVerify,
    onAdminFallback, 
    Contact,
    Email,
}: {
    title: string;
    name: string;
    recipient: OTPRecipient;
    mode: OTPMode;
    state: OTPState;
    sending: boolean;
    verifying: boolean;
    onMode: (mode: OTPMode) => void;
    onValue: (value: string) => void;
    onSend: () => void;
    onVerify: () => void;
    onAdminFallback: () => void; // NEW
    Contact: any;
    Email: any;
}) {
    const admin = recipient === "ADMIN";

    const channelOptions: {
        value: OTPMode;
        label: string;
        icon: React.ReactNode;
        activeClass: string;
    }[] = [
        {
            value: "WHATSAPP",
            label: "WhatsApp",
            icon: <MessageCircle size={16} />,
            activeClass:
                "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        },
        {
            value: "GMAIL",
            label: "Gmail",
            icon: <Mail size={16} />,
            activeClass:
                "border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-200",
        },
        {
            value: "SMS",
            label: "Text Message",
            icon: <Smartphone size={16} />,
            activeClass:
                "border-violet-500 bg-violet-50 text-violet-700 ring-1 ring-violet-200",
        },
    ];

    const selectedChannel = channelOptions.find(
        (option) => option.value === mode
    );

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            {/* Card Header */}
            <div
                className={`flex items-center gap-3 border-b border-slate-100 px-3 py-3 ${
                    admin ? "bg-amber-50" : "bg-slate-50"
                }`}
            >
                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        admin
                            ? "bg-amber-100 text-amber-700"
                            : "bg-sky-100 text-[#145DA0]"
                    }`}
                >
                    {mode === "WHATSAPP" ? (
                        <MessageCircle size={19} />
                    ) : mode === "SMS" ? (
                        <Smartphone size={19} />
                    ) : (
                        <Mail size={19} />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800">
                        {title}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                        {name || recipient}
                    </p>
                </div>

                {state.verified && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 size={13} />
                        Verified
                    </span>
                )}
            </div>

            <div className="space-y-3 p-3">
                {/* Delivery Options with Contact Details */}
                {!admin && (
                    <div className="grid grid-cols-3 gap-2">
                        {channelOptions.map((option) => {
                            const active = mode === option.value;

                            const detail =
                                option.value === "GMAIL"
                                    ? Email
                                    : Contact;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    aria-pressed={active}
                                    disabled={
                                        sending || state.verified
                                    }
                                    onClick={() =>
                                        onMode(option.value)
                                    }
                                    title={`${option.label}: ${
                                        detail || "Not available"
                                    }`}
                                    className={`flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border p-2 text-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                                        active
                                            ? option.activeClass
                                            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    <span>{option.icon}</span>

                                    <span className="text-[11px] font-bold sm:text-xs">
                                        {option.label}
                                    </span>

                                    <span
                                        className="w-full truncate text-[10px] font-medium text-slate-500"
                                    >
                                        {detail || "Not available"}
                                    </span>

                                
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Send OTP */}
                <button
                    type="button"
                    disabled={sending || state.verified}
                    onClick={onSend}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#145DA0] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#104b82] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {sending ? (
                        <>
                            <RefreshCw
                                size={15}
                                className="animate-spin"
                            />
                            Sending...
                        </>
                    ) : state.verified ? (
                        <>
                            <CheckCircle2 size={16} />
                            OTP Verified
                        </>
                    ) : (
                        <>
                            <Send size={15} />
                            {state.sent
                                ? `Resend OTP${
                                      admin
                                          ? ""
                                          : ` via ${selectedChannel?.label ?? "Gmail"}`
                                  }`
                                : `Send OTP via ${
                                      admin
                                          ? "Gmail"
                                          : selectedChannel?.label ?? "Gmail"
                                  }`}
                        </>
                    )}
                </button>
                {title!=="Admin Fallback OTP"&&
<button
        type="button"
        onClick={onAdminFallback}
        disabled={sending || verifying || state.verified}
        className="mt-1 flex w-full items-center justify-center gap-2
        rounded-xl border border-amber-300 bg-amber-50
        px-3 py-2 text-xs font-semibold text-amber-800
        transition-colors hover:bg-amber-100
        disabled:cursor-not-allowed disabled:opacity-50"
    >
        <AlertTriangle size={14} />
       Technical issue? Send OTP to Admin
    </button>}
                {/* OTP Input and Verification */}
                {state.sent && !state.verified && (
                    <div className="flex gap-2">
                        <div className="relative min-w-0 flex-1">
                            <KeyRound
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                value={state.value}
                                placeholder="Enter 6-digit OTP"
                                aria-label={`${title} verification code`}
                                onChange={(event) =>
                                    onValue(
                                        event.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6)
                                    )
                                }
                                className={`${inputClass} min-w-0 pl-9 tracking-[0.2em]`}
                            />
                        </div>

                        <button
                            type="button"
                            disabled={
                                verifying ||
                                state.value.length !== 6
                            }
                            onClick={onVerify}
                            className="flex shrink-0 items-center justify-center gap-1 rounded-xl bg-emerald-700 px-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {verifying ? (
                                <>
                                    <RefreshCw
                                        size={14}
                                        className="animate-spin"
                                    />
                                    Checking
                                </>
                            ) : (
                                "Verify"
                            )}
                        </button>
                    </div>
                )}

                {/* Verification Status */}
                {state.verified && (
                    <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                        <CheckCircle2
                            size={15}
                            className="mt-0.5 shrink-0 text-emerald-700"
                        />
                        <div>
                            <p className="text-xs font-semibold text-emerald-800">
                                Verification successful
                            </p>
                         
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {state.error && (
                    <div
                        role="alert"
                        className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                    >
                        {state.error}
                    </div>
                )}
            </div>
        </div>
    );
}



