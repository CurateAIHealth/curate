"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    CalendarDays, ChevronDown, Clock, UserCheck, Users, ShieldCheck,
    MessageCircle, Mail, Send, CheckCircle2, AlertTriangle, RefreshCw,
    KeyRound, X, Plus, Trash2, Snowflake,
    Smartphone,
    Trash,
    Pencil,
} from "lucide-react";
import { GetEmail, getHCAContactNumber, GetHCPFullName } from "@/Lib/Actions";
import { useSelector } from "react-redux";
import { GetHCACEmailandContact, UpdateUserCurrentstatusInHCPView } from "@/Lib/user.action";
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

export interface HCAFreezeProps {
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
export default function HCAFreeze({
    Type,show, onShowChange, data, hcaImage = "", otpEndpoint = "/api/replacement-otp", initialReasons = [],
}: HCAFreezeProps) {
    const clientName = String(data?.name ?? data?.ClientName ?? "");
    const patientName = String(data?.PatientName ?? "");
    const hcaName = String(data?.HCA_Name ?? "");
    const hcaId = String(data?.HCA_Id ?? "");
    const clientId = String(data?.Client_Id ?? "");
    const hcaGender = Array.isArray(data?.Type) ? String(data.Type[0] ?? "") : String(data?.Gender ?? "");
const [HCPVerificationOTP, setHCPVerificationOTP] = useState("");
  const [ClientVerificationOTP, setClientVerificationOTP] = useState("");
    const [AdminVerificationOTP, setAdminVerificationOTP] = useState("");
    const [freezeStartDate, setFreezeStartDate] = useState("");
    const [freezeStartTime, setFreezeStartTime] = useState("");
    const [freezeEndDate, setFreezeEndDate] = useState("");
    const [freezeEndTime, setFreezeEndTime] = useState("");
    const [expectedFreezeDays, setExpectedFreezeDays] = useState(4);
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
    const [formError, setFormError] = useState("");
const UserFullInfo=useSelector((state:any)=>state.AdminFullInfo)
const users=useSelector((state:any)=>state.AdminUsers)
const HCAContactInfo=getHCAContactNumber(UserFullInfo,hcaId)
console.log("Check Contact-----",data)
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

    let recipientEmail = "";
    let recipientPhone = "";
    let recipientName = "";

    if (recipient === "CLIENT") {
      recipientEmail = Client_Email || "";
      recipientPhone = Client_Contact || "";
      recipientName = clientName || "Client";
    }


    
    // if (recipient === "CLIENT") {
    //  recipientEmail ="tsiddu805@gmail.com" ;
    //   recipientPhone = "9347877159" 
    //   recipientName = clientName || "Client";
    // }
   

    if (recipient === "HCA") {
      recipientEmail =HCP_Email||"tsiddu805@gmail.com" ;
      recipientPhone = HCP_Contact||"9347877159" 
      recipientName = hcaName || "HCA";
    }

    if (recipient === "ADMIN") {
      recipientEmail = Admin_Email;
      recipientName = "Admin";
    }

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

    const otpMessage = `
Your Curate Health verification OTP is ${NewOTP}.

Please enter this OTP to complete the verification process.

This OTP is confidential. Do not share it with anyone.

Curate Health Services LLP
    `.trim();

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
      Dear ${hcaName || "HCA"},
    </p>

    <p style="
      margin: 0 0 18px;
      font-size: 15px;
      color: #334155;
      line-height: 1.7;
    ">
      Before providing the OTP, please read and confirm the following:
    </p>

    <div style="
      background-color: #fefce8;
      border: 1px solid #fde68a;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    ">

      <p style="
        margin: 0 0 16px;
        font-size: 15px;
        color: #334155;
        line-height: 1.7;
      ">
        By sharing the OTP, you confirm that you feel safe to travel
        independently, using your own preferred mode of transport.
      </p>

      <p style="
        margin: 0 0 16px;
        font-size: 15px;
        color: #334155;
        line-height: 1.7;
      ">
        If you choose to travel alone using your own transport, this is
        your personal choice and responsibility. Once the OTP is provided,
        Curate will not be responsible for your personal travel
        arrangements, mode of transport, or any incident arising from
        your decision to travel independently.
      </p>

      <p style="
        margin: 0;
        font-size: 15px;
        color: #334155;
        line-height: 1.7;
        font-weight: 600;
      ">
        Please provide the OTP only if you are comfortable with the above
        and feel safe to proceed.
      </p>

    </div>

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
        Your OTP
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

      console.log(
        `Sending ${recipient} OTP through Gmail`,
        {
          email: recipientEmail,
          otp: NewOTP,
        }
      );

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
    // ============================================================
const textMessage=`Dear ${hcaName || "HCA"},

Before providing the OTP, please read and confirm the following:

By sharing the OTP, you confirm that you feel safe to travel independently, using your own preferred mode of transport.

If you choose to travel alone using your own transport, this is your personal choice and responsibility. Once the OTP is provided, Curate will not be responsible for your personal travel arrangements, mode of transport, or any incident arising from your decision to travel independently.

Please provide the OTP only if you are comfortable with the above and feel safe to proceed.

🔐 OTP: *${NewOTP}*

Thank you,
Curate Care Team`
  
  const whatsappUrl = `https://wa.me/${recipientPhone}?text=${encodeURIComponent(
    textMessage
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

    <p style="
      margin: 0 0 18px;
      font-size: 15px;
      color: #334155;
      line-height: 1.7;
    ">
      Before providing the OTP, please read and confirm the following:
    </p>

    <div style="
      background-color: #fefce8;
      border: 1px solid #fde68a;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    ">

      <p style="
        margin: 0 0 16px;
        font-size: 15px;
        color: #334155;
        line-height: 1.7;
      ">
        By sharing the OTP, you confirm that you feel safe to travel
        independently, using your own preferred mode of transport.
      </p>

      <p style="
        margin: 0 0 16px;
        font-size: 15px;
        color: #334155;
        line-height: 1.7;
      ">
        If you choose to travel alone using your own transport, this is
        your personal choice and responsibility. Once the OTP is provided,
        Curate will not be responsible for your personal travel
        arrangements, mode of transport, or any incident arising from
        your decision to travel independently.
      </p>

      <p style="
        margin: 0;
        font-size: 15px;
        color: #334155;
        line-height: 1.7;
        font-weight: 600;
      ">
        Please provide the OTP only if you are comfortable with the above
        and feel safe to proceed.
      </p>

    </div>

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
        Your OTP
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


      console.log(
        `Sending ${recipient} OTP through Gmail`,
        {
          email: recipientEmail,
          otp: NewOTP,
        }
      );

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

const freezeReason =
  selectedReason === "Other"
    ? otherReason.trim()
    : selectedReason.trim();

const freezeDetails = `
Freeze Action: HCP Freeze Request
Client Name: ${clientName || "N/A"}
Patient Name: ${patientName || "N/A"}
HCP Name: ${hcaName || "N/A"}
HCP ID: ${hcaId || "N/A"}
Reason: ${freezeReason || "Not specified"}
Freeze Start: ${freezeStartDate || "N/A"} ${freezeStartTime || ""}
Expected Freeze End: ${freezeEndDate || "N/A"} ${freezeEndTime || ""}
Expected Freeze Duration: ${expectedFreezeDays} days
Additional Notes: ${reasonNote.trim() || "None"}
Updated HCP Status: ${UpdatedCareTakerStatus || "Bench"}
`.trim();
    if(mode === "WHATSAPP"&&recipient==="CLIENT") {

setClientVerificationOTP(NewOTP)

    // ============================================================
    // 8. SEND THROUGH WHATSAPP
    // ============================================================
     
const textMessage=`
Dear ${recipientName || "User"},

Curate Health is processing an HCP Freeze Request. Please review the details below before providing your verification OTP.

${freezeDetails}

By sharing this OTP, you confirm that you have reviewed the freeze request details and acknowledge the request for verification.

Please do not share this OTP with anyone other than the authorized verification process.

Your Freeze Request Verification OTP: ${NewOTP}

This OTP is confidential and should only be used to verify this Freeze action.

Thank you,
Curate Care Team
Curate Health Services LLP
`.trim();

  
  const whatsappUrl = `https://wa.me/${recipientPhone}?text=${encodeURIComponent(
    textMessage
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
setAdminVerificationOTP(NewOTP)
      const subject =
        "Curate Health - OTP Verification";

    
        




const htmlMessage =`
<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:28px;background:#f8fafc;border:1px solid #dbeafe;border-radius:16px;color:#334155;">
  <h2 style="color:#145DA0;margin-top:0;">HCP Freeze Request Verification</h2>

  <p>Dear ${recipientName || "User"},</p>

  <p>Please review the following Freeze request details before providing your verification OTP.</p>

  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;white-space:pre-line;line-height:1.8;">
    ${freezeDetails.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
  </div>

  <p>By sharing this OTP, you confirm that you have reviewed the freeze request details and acknowledge the request for verification.</p>

  <div style="text-align:center;margin:28px 0;">
    <p style="font-size:13px;color:#64748b;font-weight:600;">FREEZE VERIFICATION OTP</p>
    <div style="display:inline-block;background:#145DA0;color:#fff;padding:16px 30px;border-radius:12px;font-size:30px;font-weight:700;letter-spacing:8px;">
      ${NewOTP}
    </div>
  </div>

  <p style="color:#b91c1c;font-size:13px;">Keep this OTP confidential and use it only for the authorized verification process.</p>

  <p>Thank you,<br/><strong style="color:#145DA0;">Curate Care Team</strong><br/>Curate Health Services LLP</p>
</div>
`;


setClientVerificationOTP(NewOTP)

      console.log(
        `Sending ${recipient} OTP through Gmail`,
        {
          email: recipientEmail,
          otp: NewOTP,
        }
      );

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

    console.log(
      `✅ ${recipient} OTP sent successfully through ${mode}`
    );

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
  
          if(QutionsType==="Replacement"){
   setReplacementReasons(GetQutionsfromDb.
            data.GetQuestions)
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
       const UpdateFreezeInformation = async () => {
  if (submitting) return;

  SetActionStatusMessage("Please Wait.......")



  try {
    setFormError("");

    if (!data?.Client_Id || !data?.HCA_Id || !data?.Month) {
      const message = "Client, HCP, or deployment month information is missing.";
      setFormError(message);
      SetActionStatusMessage(message);
      return;
    }
// Admin OTP verification overrides Client and HCP OTP requirements.
if (
  !otp.ADMIN.verified &&
  (!otp.CLIENT.verified || !otp.HCA.verified)
) {
  const missing = [
    !otp.CLIENT.verified ? "Client" : "",
    !otp.HCA.verified ? "HCP" : "",
  ]
    .filter(Boolean)
    .join(" and ");

  const message = `Please complete ${missing} OTP verification before submitting.`;

  setFormError(message);
  SetActionStatusMessage(message);
  return;
}
    if (!selectedReason.trim()) {
      setFormError("Please select a freeze reason.");
      return;
    }

    if (selectedReason === "Other" && !otherReason.trim()) {
      setFormError("Please specify the freeze reason.");
      return;
    }

    if (!freezeStartDate || !freezeStartTime || !freezeEndDate || !freezeEndTime) {
      setFormError("Please complete the freeze start and end dates and times.");
      return;
    }

    const start = new Date(`${freezeStartDate}T${freezeStartTime}`);
    const end = new Date(`${freezeEndDate}T${freezeEndTime}`);

    if (
      !Number.isFinite(start.getTime()) ||
      !Number.isFinite(end.getTime()) ||
      end <= start
    ) {
      setFormError("Freeze end date and time must be after the start date and time.");
      return;
    }

    if (!Number.isFinite(expectedFreezeDays) || expectedFreezeDays < 1) {
      setFormError("Expected freeze days must be at least 1.");
      return;
    }

    if (clientConcern === "Yes" && !clientConcernNote.trim()) {
      setFormError("Please enter the client concern details.");
      return;
    }

    const currentHCAStatus = UpdatedCareTakerStatus || "Bench";

    const freezeInformation = {
      Reason: selectedReason.trim(),
      OtherReason: selectedReason === "Other" ? otherReason.trim() : "",
      FreezeStartDate: freezeStartDate,
      FreezeStartTime: freezeStartTime,
      FreezeEndDate: freezeEndDate,
      FreezeEndTime: freezeEndTime,
      ExpectedFreezeDays: Number(expectedFreezeDays),
      AdditionalNotes: reasonNote.trim(),
      UpdatedCareTakerStatus: currentHCAStatus,
      CheckRequestedByClient: checkRequested,
      ClientConcern: clientConcern,
      ClientConcernNote: clientConcern === "Yes" ? clientConcernNote.trim() : "",
      OTPVerification: {
        CLIENT: {
          verified: otp.CLIENT.verified,
          VerifiedBy: otp.CLIENT.VerifiedBy || "",
          VerifiedAt: otp.CLIENT.VerifiedAt || "",
          Mode: otpModes.CLIENT,
        },
        HCA: {
          verified: otp.HCA.verified,
          VerifiedBy: otp.HCA.VerifiedBy || "",
          VerifiedAt: otp.HCA.VerifiedAt || "",
          Mode: otpModes.HCA,
        },
        ADMIN: {
          verified: otp.ADMIN.verified,
          VerifiedBy: otp.ADMIN.VerifiedBy || "",
          VerifiedAt: otp.ADMIN.VerifiedAt || "",
          Mode: "GMAIL",
        },
      },
      UpdatedBy: loggedInEmail || "",
      UpdatedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    SetActionStatusMessage("Please wait... submitting Freeze Request.");

    // Update the HCP's current status.
    await UpdateUserCurrentstatusInHCPView(
     hcaId,
      currentHCAStatus,
      loggedInEmail
    );

    // Save deployment status and the complete freeze request payload.
    const response = await axios.post("/api/DeploymentStatus", {
      ClientId: data.Client_Id,
      HCAId: data.HCA_Id,
      Month: data.Month,
      Status: "Freeze",
      FreezeInformation: freezeInformation,
    });

    const updateFreezeStatus = response?.data;

    if (!updateFreezeStatus?.success) {
      throw new Error(
        updateFreezeStatus?.message || "Failed to update deployment status."
      );
    }

    SetActionStatusMessage(
      updateFreezeStatus.message || "Freeze request submitted successfully."
    );

   
    setTimeout(() => onShowChange(false), 1500);
  } catch (err: any) {
    console.error("UpdateFreezeInformation Error:", err);

    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to submit freeze request. Please try again.";

    setFormError(errorMessage);
    SetActionStatusMessage(errorMessage);
  } finally {
    setSubmitting(false);
  }
};

    if (!show) return (
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button type="button" onClick={() => onShowChange(true)} className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-4 py-4 text-left sm:px-6">
                <span className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#145DA0] text-white"><Snowflake size={22} /></span><span><strong className="block text-base text-slate-800">HCP Freeze</strong><small className="text-slate-500">Freeze request and verification</small></span></span><ChevronDown size={20} className="text-[#145DA0]" />
            </button>
        </div>
    );

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            
            <button type="button" onClick={() => onShowChange(false)} className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-4 py-4 text-left sm:px-6">
                <span className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#145DA0] text-white"><Snowflake size={22} /></span><span><strong className="block text-base text-slate-800">HCP Freeze</strong><small className="text-slate-500">Freeze request and verification</small></span></span><X size={19} className="text-slate-500" />
      
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
                                                  <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-500">
                    Reason for Replacement
                  </label>
                
                  {replacementReasons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setShowEditReasons(!ShowEditReasons)}
                      className="rounded-lg bg-blue-600 px-2 cursor-pointer py-2 text-white hover:bg-blue-700 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                  )}
                </div>
                                                    {replacementReasons.length < 1 ?
                                                      <button
                                                        disabled={preparingQuestions}
                                                        onClick={() => GetQutions("Replacement")}
                                                        className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 cursor-pointer
                             text-sm font-medium shadow-sm hover:bg-gray-50 hover:border-blue-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             transition-all duration-200 flex items-center justify-between gap-3
                             disabled:opacity-70 disabled:cursor-not-allowed"
                                                      >
                                                        <span>Choose reason</span>
                
                                                        {preparingQuestions ? (
                                                          <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                          <span className="text-gray-400 text-xs">▼</span>
                                                        )}
                                                      </button> :
                                                      <div className="space-y-3">
                                                        <select
                                                          value={selectedReason}
                                                          onChange={(e) => setSelectedReason(e.target.value)}
                                                          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
                                                        >
                
                
                                                          {replacementReasons.map((reason) => (
                                                            <option key={reason} value={reason}>
                                                              {reason}
                                                            </option>
                                                          ))}
                                                        </select>
                                                          
                                                        {ShowEditReasons &&
                                                        <div>
                                                          <div className="flex gap-2">
                                                            <input
                                                              type="text"
                                                              value={newReplacementReason}
                                                              onChange={(e) => setNewReplacementReason(e.target.value)}
                                                              placeholder="Enter new replacement reason"
                                                              className="flex-1 rounded-lg border px-3 py-2 text-sm"
                                                            />
                
                                                            <button
                                                              type="button"
                                                              onClick={() => AddReason("replacement")}
                                                              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                                                            >
                                                              <Plus size={18} />
                                                            </button>
                                                         
                                                          </div>
                                                          <div className="space-y-2">
                                                            {replacementReasons.map((reason) => (
                                                              <div
                                                                key={reason}
                                                                className="flex items-center justify-between rounded-lg border px-3 py-2"
                                                              >
                                                                <span className="text-sm">{reason}</span>
                
                                                                {reason !== "Other" && (
                                                                  <button
                                                                    type="button"
                                                                    onClick={() => DeleteReason("replacement", reason)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                  >
                                                                    <Trash size={16} />
                                                                  </button>
                                                                )}
                                                              </div>
                                                            ))}
                                                            </div>
                                                          </div>}
                                                      </div>}
                                                  </div>
                                                    {selectedReason === "Other" && (
                                                    <textarea
                                                      rows={3}
                                                      placeholder="Please specify"
                                                      value={otherReason}
                                                      onChange={(e) => setOtherReason(e.target.value)}
                                                      className="
                              w-full rounded-xl bg-white/90 border border-gray-300 mt-2
                              px-4 py-2.5 text-sm resize-none
                              focus:outline-none focus:ring-2 focus:ring-blue-400
                            "
                                                    />
                                                  )}
                <section><SectionTitle title="Freeze Details" icon={<CalendarDays size={17} />} />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Freeze Start Date" type="date" value={freezeStartDate} onChange={setFreezeStartDate} /><Field label="Freeze Start Time" type="time" value={freezeStartTime} onChange={setFreezeStartTime} />
                        <Field label="Expected Freeze End Date" type="date" value={freezeEndDate} onChange={setFreezeEndDate} /><Field label="Expected Freeze End Time" type="time" value={freezeEndTime} onChange={setFreezeEndTime} />
                        <Field label="Expected Freeze Time (days)" type="number" min="1" value={String(expectedFreezeDays)} onChange={(value) => setExpectedFreezeDays(Math.max(1, Number(value) || 1))} />
                       
                    </div>
                    <div className="mt-4"><label className={labelClass}>Additional Notes (optional)</label><textarea rows={3} className={inputClass} value={reasonNote} onChange={(event) => setReasonNote(event.target.value)} placeholder="Add details about the freeze request..." /></div>
                      </section>
                <div className="w-full mt-2">
                  <div className="flex items-center gap-2 mb-2 px-1">
                
                
                  <div className="flex items-center gap-3">
                  <span className="h-8 w-1 rounded-full bg-indigo-500" />
                
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-700">
                    Update Current HCP Status
                  </span>
                </div>
                  </div>
                
                  <select
                    className={`
                      w-full
                      appearance-none
                      rounded-2xl
                      border-2
                      px-5
                      py-4
                      text-sm
                      font-bold
                      text-center
                      cursor-pointer
                      shadow-md
                      transition-all
                      duration-200
                      outline-none
                
                      hover:shadow-lg
                      hover:-translate-y-[1px]
                
                      ${
                        UpdatedCareTakerStatus === "Available"
                          ? "bg-emerald-50 border-emerald-400 text-emerald-800 focus:ring-4 focus:ring-emerald-100"
                          : UpdatedCareTakerStatus === "Sick"
                          ? "bg-amber-50 border-amber-400 text-amber-800 focus:ring-4 focus:ring-amber-100"
                          : UpdatedCareTakerStatus === "Leave"
                          ? "bg-blue-50 border-blue-400 text-blue-800 focus:ring-4 focus:ring-blue-100"
                          : UpdatedCareTakerStatus === "Bench"
                          ? "bg-purple-50 border-purple-400 text-purple-800 focus:ring-4 focus:ring-purple-100"
                          : UpdatedCareTakerStatus === "Terminated"
                          ? "bg-red-50 border-red-400 text-red-800 focus:ring-4 focus:ring-red-100"
                          : "bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border-indigo-400 text-indigo-700 focus:ring-4 focus:ring-indigo-100"
                      }
                    `}
                    value={UpdatedCareTakerStatus || ""}
                    onChange={(e) => setUpdatedCareTakerStatus(e.target.value)}
                  >
                    <option value="">
                      Manage {GetHCPFullName(UserFullInfo, hcaId)} Status
                    </option>
                
                    <option value="Available">🟢 Available</option>
                    <option value="Sick">🟡 Sick</option>
                    <option value="Leave">🔵 Leave</option>
                    <option value="Bench">🟣 Bench</option>
                    <option value="Terminated">🔴 Terminated</option>
                  </select>
                </div>
                <section><SectionTitle title="HCP Check Requested by Client" icon={<ShieldCheck size={17} />} /><YesNoField label="Did the client request an HCP check?" value={checkRequested} onChange={setCheckRequested} /></section>
                <section><SectionTitle title="Client Concern" icon={<AlertTriangle size={17} />} /><YesNoField label="Has the client raised any concern?" value={clientConcern} onChange={setClientConcern} />{clientConcern === "Yes" && <div className="mt-4"><label className={labelClass}>Concern Details</label><textarea className={inputClass} rows={3} value={clientConcernNote} onChange={(event) => setClientConcernNote(event.target.value)} placeholder="Describe the client's concern..." /></div>}</section>
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
<div className="rounded-xl border border-teal-300 bg-teal-100 p-3 text-sm text-center font-medium text-teal-800 shadow-sm">
  {ActionStatusMessage}
</div>}

<div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row"><button type="button" onClick={() => onShowChange(false)} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600">Cancel</button><button type="button" disabled={
  (!otp.CLIENT.verified &&
   !otp.HCA.verified &&
   !otp.ADMIN.verified) ||
  submitting
} onClick={UpdateFreezeInformation} className="flex items-center justify-center gap-2 rounded-xl bg-[#145DA0] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{submitting ? "Submitting..." : <><Snowflake size={17} /> Submit Freeze Request</>}</button></div>
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
        Technical issue? Send Admin fallback OTP
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



