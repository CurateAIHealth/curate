 "use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  ImagePlus,
  Mail,
  MessageCircle,
  ShieldCheck,
  UserCheck,
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  Users,
  Minimize2,
  KeyRound,
  RefreshCw,
  Pencil,
  Trash,
  Plus,
  Phone,
} from "lucide-react";
import { GetEmail, getHCAContactNumber, GetHCPFullName } from "@/Lib/Actions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import RepleasementHCPPopup from "../RelasementHCPPopup/page";
import { GetHCACEmailandContact, GetUserInformation, HCASalaryUpdate, UpdateReason, UpdateReplacmentData, UpdateUserCurrentstatusInHCPView } from "@/Lib/user.action";
import { useRouter } from "next/navigation";
import { SetDeploymentInfo } from "@/Redux/action";
import SalaryPopup from "../HCPSalary/page";

type YesNo = "Yes" | "No" | "";
type OTPRecipient = "HCA" | "CLIENT" | "ADMIN" | "NEWHCA"|"NEWHCPCLIENT";
type OTPMode = "WHATSAPP" | "GMAIL" | "SMS";
type LeavingMode = "Own HCP" | "Drop" | "Other" | "";

interface OTPState {
  sent: boolean;
  verified: boolean;
  value: string;
  error: string;
  VerifiedBy  :any
  VerifiedAt:any
}

interface HCAReplacementParentData {
  Address: string;
  ClientAttendance: any[];
  Client_Id: string;
  EndDate: string;
  HCAContact: string;
  HCA_Id: string;
  HCA_Name: string;
  Month: string;
  MonthlyServiceCharge: string | number;
  PatientName: string;
  Patient_PhoneNumber: string;
  Replacement: any;
  RreferralName: string;
  ServiceCharge: string | number;
  ServiceState: string;
  StartDate: string;
  Status: string;
  Team: number | string;
  TerminatedTimeSheet: any[];
  TimeSheet: any[];
  Type: string[];
  ad: number | string;
  cPay: string | number;
  cTotal: string | number;
  contact: string;
  days: string[];
  email: string;
  hcpPay: string | number;
  hcpSource: string;
  hcpTotal: string | number;
  hpd: number | string;
  invoice: string;
  location: string;
  name: string;
  pd: number | string;
}

interface HCAReplacementProps {
  show: boolean;
  onShowChange: (value: boolean) => void;
  data: HCAReplacementParentData;
  onSubmit: (data: any) => void;
    filterProfilePic:any,
  HCA_List:any,
  
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
const EMPTY_OTP: OTPState = {
  sent: false,
  verified: false,
  value: "",
  error: "",
  VerifiedBy:"",
  VerifiedAt:""

};

export default function HCAReplacement({
  show,
  onShowChange,
  data,
  onSubmit,
  filterProfilePic,
  HCA_List,
}: HCAReplacementProps) {
  const {
    Address,
    ClientAttendance,
    Client_Id,
    EndDate,
    HCAContact,
    HCA_Id,
    HCA_Name,
    Month,
    MonthlyServiceCharge,
    PatientName,
    Patient_PhoneNumber,
    Replacement,
    RreferralName,
    ServiceCharge,
    ServiceState,
    StartDate,
    Status,
    Team,
    TerminatedTimeSheet,
    TimeSheet,
    Type,
    ad,
    cPay,
    cTotal,
    contact,
    days,
    email,
    hcpPay,
    hcpSource,
    hcpTotal,
    hpd,
    invoice,
    location,
    name,
    pd,
  } = data;

  const clientName = name;
  const patientName = PatientName;
  const hcaName = HCA_Name;
  const hcaRegistrationNumber = HCA_Id;
  const hcaStartDate = StartDate;
  const hcaGender = Type?.[0] || "";

  const [hcaImage,sethcaImage]=useState("")
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
 const [newTerminationReason, setNewTerminationReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [terminationReasons, setTerminationReasons] = useState<string[]>([
  
    ]);
 const [UpdatedCareTakerStatus, setUpdatedCareTakerStatus] = useState("")
  const [checkRequested, setCheckRequested] = useState<YesNo>("");
  const [checkDone, setCheckDone] = useState<YesNo>("");
  const [checkNote, setCheckNote] = useState("");
  const [hcpcheckNote,sethcpCheckNote]=useState("")
 const [selectedAssignHCP, setselectedAssignHCP] = useState<any>()
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);

  const [clientConcern, setClientConcern] = useState<YesNo>("");
  const [clientConcernNote, setClientConcernNote] = useState("");

  const [companyConcern, setCompanyConcern] = useState<YesNo>("");
  const [companyConcernNote, setCompanyConcernNote] = useState("");
 const [ActionStatusMessage, SetActionStatusMessage] = useState<any>("");
  const [leavingMode, setLeavingMode] = useState<LeavingMode>("");
  const [otherLeavingMode, setOtherLeavingMode] = useState("");
 const [replacementReasons, setReplacementReasons] = useState<string[]>([

  ]);
    const [ShowReassignmentPopUp, setShowReassignmentPopUp] = useState(false)
      const [selectedCase, setSelectedCase] = useState<any>(data);
    const [selectedHCP, setselectedHCP] = useState<any>()
    const [ShowEditReasons, setShowEditReasons] = useState(false)
      const [newReplacementReason, setNewReplacementReason] = useState("");
  const [otpModes, setOtpModes] = useState<Record<"HCA" | "CLIENT" | "NEWHCA"|"NEWHCPCLIENT", OTPMode>>({
    HCA: "GMAIL",
    CLIENT: "GMAIL",
    NEWHCA: "GMAIL",
    NEWHCPCLIENT: "GMAIL",
    
    
  });
const [HCPVerificationOTP, setHCPVerificationOTP] = useState("");
  const [ClientVerificationOTP, setClientVerificationOTP] = useState("");
   const [newClientVerificationOTP, setnewClientVerificationOTP] = useState("");
  const [AdminVerificationOTP, setAdminVerificationOTP] = useState("");
  const [otp, setOtp] = useState<Record<OTPRecipient, OTPState>>({
 
    HCA: { ...EMPTY_OTP,VerifiedBy:"",VerifiedAt:"" },
    CLIENT: { ...EMPTY_OTP ,VerifiedBy:"",VerifiedAt:""},
    ADMIN: { ...EMPTY_OTP,VerifiedBy:"",VerifiedAt:"" },
    NEWHCA: { ...EMPTY_OTP ,VerifiedBy:"",VerifiedAt:""},
    NEWHCPCLIENT:{ ...EMPTY_OTP ,VerifiedBy:"",VerifiedAt:""},

  });
    const [ShowCareTakerPriceUpdate, setShowCareTakerPriceUpdate] = useState(false)
  const [showWarning, setShowWarning] = useState(false);
    const [showHCAList, setShowHCAList] = useState(false);
  const [otpSending, setOtpSending] = useState<OTPRecipient | null>(null);
  const [otpVerifying, setOtpVerifying] = useState<OTPRecipient | null>(null);
  const [preparingQuestions, setpreparingQuestions] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [otherReason, setOtherReason] = useState("");
    const [HCPEmail, setHCPEmail] = useState("Loading");
    const [NewHCPMail,SetNewHCPMail]=useState("Loading");
    const [newHCPVerificationOTP, setNewHCPVerificationOTP] =
  useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
const UserFullInfo=useSelector((state:any)=>state.AdminFullInfo)
const users=useSelector((state:any)=>state.AdminUsers)
  const isFemale = hcaGender?.toLowerCase() === "female";
 const loggedInEmail = useSelector((state: any) => state.LoggedInEmail)
 const dispatch=useDispatch()
 const router=useRouter()
useEffect(() => {
  const GetEmail = async () => {
    try {
      const ResultEmail: any =
        await GetHCACEmailandContact(hcaRegistrationNumber);

sethcaImage(ResultEmail.
ProfilePic)
      setHCPEmail(ResultEmail?.
email || "");
    } catch (error) {
      console.error("Failed to get HCP email:", error);
      setHCPEmail("");
    }
  };

  if (hcaRegistrationNumber) {
    GetEmail();
  }
}, [hcaRegistrationNumber]);
const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

  const handleCheckDone = (value: "Yes" | "No") => {
    setCheckDone(value);

    if (value === "Yes") {
      setPrivacyConfirmed(false);
      setShowPrivacyPopup(true);
    } else {
      setPrivacyConfirmed(false);
      setShowPrivacyPopup(false);
    }
  };

  const handleOTPModeChange = (
    recipient: "HCA" | "CLIENT" | "NEWHCA"|"NEWHCPCLIENT",
    mode: OTPMode
  ) => {
    setOtpModes((previous) => ({
      ...previous,
      [recipient]: mode,
    }));

    setOtp((previous) => ({
      ...previous,
      [recipient]: {
        ...previous[recipient],
        sent: false,
        verified: false,
        value: "",
        error: "",
      },
    }));
  };

  const sendOTP = async (recipient: OTPRecipient) => {
  try {
    setOtpSending(recipient);

    // ============================================================
    // 1. GENERATE OTP
    // ============================================================

    const NewOTP = generateOTP();

    // ============================================================
    // 2. GET RECIPIENT DETAILS
    // ============================================================

    const Client_Email = GetEmail(users, Client_Id);
    const HCP_Email = HCPEmail;

    const Client_Contact = data.Patient_PhoneNumber;

    const HCP_Contact = getHCAContactNumber(
      UserFullInfo,
      hcaRegistrationNumber
    );

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
    let recipientPhone = "8977975659";
    let recipientName =recipient === "CLIENT"?clientName: "HCP";

//     if (recipient === "CLIENT") {
//       recipientEmail = Client_Email || "";
//       recipientPhone = Client_Contact || "";
//       recipientName = clientName || "Client";
//     }



//      if (recipient === "NEWHCPCLIENT") {
//   recipientEmail = Client_Email || "";
//       recipientPhone = Client_Contact || "";
//       recipientName = clientName || "Client";
//     }

//        if (recipient === "NEWHCA") {
//      recipientEmail =NewHCPMail
// ;
    
//       recipientPhone = getHCAContactNumber(UserFullInfo,selectedHCP?.userId)
//       recipientName = clientName || "Client";

// ;
    

//     }

//     if (recipient === "HCA") {
//       recipientEmail =HCPEmail||HCP_Email;
//       recipientPhone = getHCAContactNumber(UserFullInfo,hcaRegistrationNumber)
//       recipientName = hcaName || "HCP";
//     }

//     if (recipient === "ADMIN") {
//       recipientEmail = Admin_Email;
//       recipientName = "Admin";
//     }

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
   if (mode === "GMAIL"&&recipient==="NEWHCA") {

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



setNewHCPVerificationOTP(NewOTP)

   

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

   
   
if(mode === "WHATSAPP"&&recipient==="NEWHCA") {

setNewHCPVerificationOTP(NewOTP)
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

     if (mode === "GMAIL"&&recipient==="CLIENT"||recipient==="NEWHCPCLIENT") {

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
setnewClientVerificationOTP((NewOTP))

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
    if(mode === "WHATSAPP"&&recipient==="CLIENT"||recipient==="NEWHCPCLIENT") {

setClientVerificationOTP(NewOTP)
setnewClientVerificationOTP((NewOTP))
    // ============================================================
    // 8. SEND THROUGH WHATSAPP
    // ============================================================
     
const textMessage=`Dear ${clientName || "Client"},

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
alert(recipient)
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
      if(newHCPVerificationOTP===value&&recipient==="NEWHCA"){
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
       if(newClientVerificationOTP===value&&recipient==="NEWHCPCLIENT"){
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

  const handleOTPValue = (
    recipient: OTPRecipient,
    value: string
  ) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 6);

    setOtp((previous) => ({
      ...previous,
      [recipient]: {
        ...previous[recipient],
        value: cleanValue,
        verified: false,
        error: "",
      },
    }));
  };

  const handleTechnicalIssue = async (
    recipient: "HCA" | "CLIENT" | "NEWHCA"|"NEWHCPCLIENT"
  ) => {
    setOtp((previous) => ({
      ...previous,
      ADMIN: {
        ...previous.ADMIN,
        sent: true,
        verified: false,
        value: "",
        error: "",
      },
    }));
   
const AdminUI=document.getElementById("ADMINOTPCARD")
AdminUI?.scrollIntoView({behavior:'smooth'})
    await sendOTP("ADMIN");
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadedImages((previous) => [
      ...previous,
      ...files,
    ]);

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setUploadedImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const validateParentData = () => {
    const requiredFields: Record<string, unknown> = {
      Address,
      ClientAttendance,
      Client_Id,
      EndDate,
      HCAContact,
      HCA_Id,
      HCA_Name,
      Month,
      MonthlyServiceCharge,
      PatientName,
      Patient_PhoneNumber,
      Replacement,
      RreferralName,
      ServiceCharge,
      ServiceState,
      StartDate,
      Status,
      Team,
      TerminatedTimeSheet,
      TimeSheet,
      Type,
      ad,
      cPay,
      cTotal,
      contact,
      days,
      email,
      hcpPay,
      hcpSource,
      hcpTotal,
      hpd,
      invoice,
      location,
      name,
      pd,
    };

    const missing = Object.entries(requiredFields)
      .filter(([, value]) => {
        if (value === undefined || value === null) return true;
        if (typeof value === "string" && !value.trim()) return true;
        if (Array.isArray(value) && value.length === 0) return true;
        return false;
      })
      .map(([key]) => key);

    if (missing.length) {
      alert(
        `Mandatory parent data is missing:\n\n${missing.join(", ")}`
      );
      return false;
    }

    if (!Client_Id.trim() || !HCA_Id.trim()) {
      alert("Client_Id and HCA_Id are mandatory for additional data lookup.");
      return false;
    }

    return true;
  };

  const validateBeforeSubmit = () => {
    if (!validateParentData()) return false;

    if (!endDate) {
      alert("Please select HCA End Date.");
      return false;
    }

    if (!endTime) {
      alert("Please select HCA End Time.");
      return false;
    }

    if (!reason.trim()) {
      alert("Please enter the reason for replacement.");
      return false;
    }

    if (!checkRequested) {
      alert("Please select whether HCA check was requested by client.");
      return false;
    }

    if (!checkDone) {
      alert("Please select whether the HCA check is done.");
      return false;
    }

    if (checkDone === "Yes" && !privacyConfirmed) {
      alert("Please confirm the privacy requirement.");
      setShowPrivacyPopup(true);
      return false;
    }

    if (!clientConcern) {
      alert("Please select Client Concern.");
      return false;
    }

    if (clientConcern === "Yes" && !clientConcernNote.trim()) {
      alert("Please enter Client Concern details.");
      return false;
    }

    if (!companyConcern) {
      alert("Please select Company Concern.");
      return false;
    }

    if (companyConcern === "Yes" && !companyConcernNote.trim()) {
      alert("Please enter Company Concern details.");
      return false;
    }

    if (!leavingMode) {
      alert("Please select Mode of Leaving.");
      return false;
    }

    if (leavingMode === "Other" && !otherLeavingMode.trim()) {
      alert("Please specify the mode of leaving.");
      return false;
    }

    const hcaVerified = otp.HCA.verified;
    const clientVerified = otp.CLIENT.verified;

    if (!hcaVerified || !clientVerified) {
      alert(
        "HCA OTP and Client OTP must both be verified before submitting."
      );
      return false;
    }

    if (otp.ADMIN.sent && !otp.ADMIN.verified) {
      alert(
        "Admin OTP was sent because of a technical issue. Please verify Admin OTP before submitting."
      );
      return false;
    }

    return true;
  };

  

   const UpdateReplacement = async (
      Available_HCP: any,
      Exsting_HCP: any
    ) => {
      try {
        SetActionStatusMessage("Please wait...");
  
        // Price validation
        if (Available_HCP?.HCPPrice === "Not Provided") {
          SetActionStatusMessage("");
          setShowReassignmentPopUp(false);
          setShowCareTakerPriceUpdate(true);
          return;
        }
  
        // Basic validation
        if (!Available_HCP?.userId || !Exsting_HCP?.HCA_Id) {
          SetActionStatusMessage("Invalid HCP information.");
          return;
        }
  
        const localValue = localStorage.getItem("UserId");
  
        if (!localValue?.trim()) {
          SetActionStatusMessage(
            "User session expired. Please login again."
          );
          return;
        }
  
        // Get logged-in user information
        const Sign_in_UserInfo: any =
          await GetUserInformation(localValue);
  
        if (!Sign_in_UserInfo) {
          SetActionStatusMessage(
            "Unable to fetch user details."
          );
          return;
        }
  
        // Update replacement reason
        const postReasonRes = await UpdateReason(
          Available_HCP.userId,
          Exsting_HCP.HCA_Id,
          selectedReason,
          otherReason,
          endDate,
          endTime
        );
  
        if (!postReasonRes?.success) {
          SetActionStatusMessage(
            "Failed to update replacement reason."
          );
          return;
        }
       
          const ExistingHCPStatusUpdate = await UpdateUserCurrentstatusInHCPView(
            Exsting_HCP.HCA_Id,
            UpdatedCareTakerStatus?.trim() || "Bench",
            loggedInEmail
          )
          if (!ExistingHCPStatusUpdate?.success) {
            SetActionStatusMessage(
              ExistingHCPStatusUpdate?.message ||
              "Replacement was created, but existing HCP status could not be updated."
            );
            return;
          }
        
  
  
  
  
        const AvailableHCPStatusUpdate = await UpdateUserCurrentstatusInHCPView(
          Available_HCP.userId,
          "Active",
          loggedInEmail
        )
        const ImpReplacementInformation = {
          LeavingMode: leavingMode,
          otherLeavingMode: otherLeavingMode,
          privacyConfirmed: privacyConfirmed ? "Yes" : "No",
          clientConcern: clientConcern,
          clientConcernNote: clientConcernNote,
          companyConcern: companyConcern,
          companyConcernNote: companyConcernNote,
          checkDone:checkDone

        }
  
        const TimeStampData = `${Sign_in_UserInfo?.FirstName || ""} ${Sign_in_UserInfo?.LastName || ""
          }, Email: ${Sign_in_UserInfo?.Email || ""}`;
  
        // Update replacement data
        const UpdateReplacmentInfo =
          await UpdateReplacmentData(
            Available_HCP,
            Exsting_HCP,
            TimeStampData,
            endDate,
            endTime,
            selectedCase.Client_Id,
            selectedCase.Month,
            selectedCase.name,
            selectedCase.HCA_Name,
            selectedCase.StartDate,
            otp,
            ImpReplacementInformation
  
          );
  
        if (!UpdateReplacmentInfo?.success) {
          SetActionStatusMessage(
            "Replacement update failed."
          );
          return;
        }
  
  
  
  
  
  
  
        if (!AvailableHCPStatusUpdate?.success) {
          SetActionStatusMessage(
            AvailableHCPStatusUpdate?.message ||
            "Replacement was updated, but available HCP status could not be updated."
          );
          return;
        }
        SetActionStatusMessage(
          "Replacement Updated, Please Wait Fetching Updated Data..."
        );
  
        const userId = localStorage.getItem("UserId");
  
        if (userId) {
          const { data } = await axios.post(
            "/api/AdminPageInfo",
            {
              userId,
              refreshType: [
                "registeredUsers",
                "deployment",
              ],
            }
          );
  
  
  
          dispatch(
            SetDeploymentInfo(
              data?.data?.deployedLength || 0
            )
          );
        }
  
        setTimeout(() => {
         onShowChange(false)
        }, 400);
      } catch (err: any) {
        console.error(
          "UpdateReplacement Error:",
          err?.response?.data || err
        );
  
        SetActionStatusMessage(
          err?.message ||
          "Something went wrong. Please try again."
        );
      }
    };
 const GetHCPGender = (A: any) => {
    if (!UserFullInfo?.length || !A) return "Not Entered";

    const address =
      UserFullInfo
        ?.map((each: any) => each?.HCAComplitInformation)
        ?.find((info: any) => info?.UserId === A)
      ?.['Gender']||"Not Provided";

    return address ?? "Not Entered";
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
  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => onShowChange(false)}
          className="w-full flex items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-[#F0F7FC] via-white to-[#EFFAF7] hover:from-[#E8F3FA] transition cursor-pointer"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#145DA0] text-white shadow-sm shrink-0">
              <UserCheck size={21} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                HCP Replacement
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Replacement request and verification
              </p>
            </div>
          </div>
          <div className="flex items-center text-[#145DA0] shrink-0">
            {show ? <Minimize2 size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
 <SalaryPopup
          open={ShowCareTakerPriceUpdate}
          defaultSalary={""}
          StatusMsg={ActionStatusMessage}
          title={selectedHCP?.FirstName || selectedAssignHCP?.FirstName}
          onClose={() => setShowCareTakerPriceUpdate(false)}
          onSubmit={async (value) => {
            const currentDate = new Date().toLocaleDateString("en-IN");
            const UpdateSalary = await HCASalaryUpdate(selectedHCP?.id || selectedAssignHCP?.id, value, loggedInEmail, currentDate, "Performance Hike")
            if (UpdateSalary.success) {
              SetActionStatusMessage(`${selectedHCP?.FirstName || selectedAssignHCP?.FirstName} ${UpdateSalary.message}`)
              setTimeout(() => {
                setShowCareTakerPriceUpdate(false)
              }, 2300)
            }

          }}
        />
        {show && (
          <div className="p-4 sm:p-6 space-y-6">
            <section>
              <SectionTitle
                title="Client Information"
                icon={<Users size={17} />}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReadOnlyField label="Client Name" value={clientName} />
                <ReadOnlyField label="Patient Name" value={patientName} />
              </div>
            </section>

            {/* <section>
              <SectionTitle
                title="Service & Deployment Information"
                icon={<Users size={17} />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ReadOnlyField label="Client ID" value={Client_Id} />
                <ReadOnlyField label="HCA ID" value={HCA_Id} />
                <ReadOnlyField label="Client Name" value={name} />
                <ReadOnlyField label="Patient Name" value={PatientName} />
                <ReadOnlyField label="HCA Contact" value={HCAContact} />
                <ReadOnlyField label="Client Contact" value={contact} />
                <ReadOnlyField label="Patient Phone" value={Patient_PhoneNumber} />
                <ReadOnlyField label="Service State" value={ServiceState} />
                <ReadOnlyField label="Location" value={location} />
                <ReadOnlyField label="Month" value={Month} />
                <ReadOnlyField label="Start Date" value={StartDate} />
                <ReadOnlyField label="End Date" value={EndDate} />
                <ReadOnlyField label="Status" value={Status} />
                <ReadOnlyField label="Team" value={String(Team)} />
                <ReadOnlyField label="Service Charge" value={String(ServiceCharge)} />
                <ReadOnlyField label="Monthly Service Charge" value={String(MonthlyServiceCharge)} />
                <ReadOnlyField label="Client Pay" value={String(cPay)} />
                <ReadOnlyField label="Client Total" value={String(cTotal)} />
                <ReadOnlyField label="HCP Pay" value={String(hcpPay)} />
                <ReadOnlyField label="HCP Total" value={String(hcpTotal)} />
                <ReadOnlyField label="Referral Source" value={RreferralName} />
                <ReadOnlyField label="HCP Source" value={hcpSource} />
                <ReadOnlyField label="Invoice" value={invoice} />
                <ReadOnlyField label="HCA/Type" value={Type.join(", ")} />
                <ReadOnlyField label="Address" value={Address} />
              </div>
            </section> */}

            <section>
              <SectionTitle
                title="Current HCP Information"
                icon={<UserCheck size={17} />}
              />
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex justify-center sm:justify-start shrink-0">
                    {hcaImage ? (
                      <img
                        src={hcaImage}
                        alt={hcaName || "HCP"}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#EAF4FF] text-[#145DA0] flex items-center justify-center">
                        <UserCheck size={34} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ReadOnlyField
                      label="HCP Registration Number"
                      value={getHCAContactNumber(UserFullInfo,hcaRegistrationNumber)}
                    />
                    <ReadOnlyField label="HCP Name" value={GetHCPFullName(UserFullInfo,hcaRegistrationNumber)} />
                    <ReadOnlyField
                      label="HCP Start Date & Time"
                      value={hcaStartDate}
                    />
                    <ReadOnlyField
                      label="HCP Gender"
                      value={GetHCPGender(hcaRegistrationNumber)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* <section>
              <SectionTitle
                title="Attendance & TimeSheet Information"
                icon={<CalendarDays size={17} />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ReadOnlyField label="Attendance Records" value={String(ClientAttendance.length)} />
                <ReadOnlyField label="TimeSheet Records" value={String(TimeSheet.length)} />
                <ReadOnlyField label="Terminated TimeSheet Records" value={String(TerminatedTimeSheet.length)} />
                <ReadOnlyField label="Days Count" value={String(days.length)} />
              </div>
            </section> */}

            <section>
              <SectionTitle
                title="Replacement Details"
                icon={<CalendarDays size={17} />}
              />

          

       
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
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 ">
                <InputField
                  label="HCP End Date"
                  type="date"
                  value={endDate}
                  onChange={setEndDate}
                  icon={<CalendarDays size={17} />}
                />
                <InputField
                  label="HCP End Time"
                  type="time"
                  value={endTime}
                  onChange={setEndTime}
                  icon={<Clock size={17} />}
                />
              </div>
<RepleasementHCPPopup
          open={showHCAList}
          ClientInformation={data}
          onClose={() => { setShowHCAList(false)}}
          filteredHcps={filterProfilePic}
          onAssign={async(hcp) => {

            const selected = HCA_List.find(
              (hca: any) => hca.userId === hcp.UserId
            );
         
            
            setselectedHCP(selected);
            setselectedAssignHCP(selected)
            setShowHCAList(false);
            const NewHCPEmail: any =
        await GetHCACEmailandContact(selected.userId);

        SetNewHCPMail(NewHCPEmail?.
email || "");
          


          }}
          onUpdate={(hcp) => console.log("Updated HCP:", hcp.UserId)}
        />
             <div className="flex items-center justify-between bg-white shadow-md rounded-2xl p-4 border border-gray-200 mt-2">
             
                                                         <div>
                                                           <p className="text-sm text-gray-500 mb-1">New HCP Status</p>
             
                                                           <p className="text-base font-semibold text-gray-800">
                                                             {selectedHCP
                                                               ? `Selected: ${GetHCPFullName(UserFullInfo,selectedHCP?.userId)}`
                                                               : "No HCP selected"}
                                                           </p>
                                                         </div>
                                                         
             
                                                         <button
                                                           onClick={() => {
                                                             setShowHCAList(!showHCAList);
                                                             setShowReassignmentPopUp(false);
                                                           }}
                                                           className={`px-2 py-2 rounded-xl text-[10px] cursor-pointer transition-all duration-300 shadow-sm
                   ${showHCAList
                                                               ? "bg-red-500 hover:bg-red-600 text-white"
                                                               : "bg-teal-600 hover:bg-teal-700 text-white"
                                                             }`}
                                                         >
                                                           {selectedHCP ? "Replace HCP" : "Show Available List"}
                                                         </button>
             
                                                       </div>
                                                       <div className="mt-4">
                                                          {selectedHCP && (
                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                            <OTPCard
                  recipient="NEWHCA"
                                                     
                  name={selectedHCP ?GetHCPFullName(UserFullInfo,selectedHCP?.userId): ""}
                  mode={otpModes.NEWHCA}
                  state={otp.NEWHCA}
                  sending={otpSending === "NEWHCA"}
                  verifying={otpVerifying === "NEWHCA"}
                  onModeChange={(mode) =>
                    handleOTPModeChange("NEWHCA", mode)
                  }
                  onValueChange={(value) =>
                    handleOTPValue("NEWHCA", value)
                  }
                  onSend={() => sendOTP("NEWHCA")}
                  onVerify={() => verifyOTP("NEWHCA")}
                  onTechnicalIssue={() =>{ handleTechnicalIssue("NEWHCA")}}
                  Patient_PhoneNumber={getHCAContactNumber(UserFullInfo,selectedHCP?.userId)}
                  Email={NewHCPMail}
                />
                     
                 <OTPCard
                  recipient="NEWHCPCLIENT"
                  name={clientName}
                  mode={otpModes.NEWHCPCLIENT}
                  state={otp.NEWHCPCLIENT}
                  sending={otpSending === "NEWHCPCLIENT"}
                  verifying={otpVerifying === "NEWHCPCLIENT"}
                  onModeChange={(mode) =>
                    handleOTPModeChange("NEWHCPCLIENT", mode)
                  }
                  onValueChange={(value) =>
                    handleOTPValue("NEWHCPCLIENT", value)
                  }
                  onSend={() => sendOTP("NEWHCPCLIENT")}
                  onVerify={() => verifyOTP("NEWHCPCLIENT")}
                  onTechnicalIssue={() => handleTechnicalIssue("NEWHCPCLIENT")}
                  Patient_PhoneNumber={data.Patient_PhoneNumber}
                         Email={GetEmail(users,Client_Id)}
                />
                  </div>
                                                          )}
                                                         </div>
                  <div className="w-full">

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
      Manage {GetHCPFullName(UserFullInfo, hcaRegistrationNumber)} Status
    </option>

    <option value="Available">🟢 Available</option>
    <option value="Sick">🟡 Sick</option>
    <option value="Leave">🔵 Leave</option>
    <option value="Bench">🟣 Bench</option>
    <option value="Terminated">🔴 Terminated</option>
  </select>
</div>
</div>       
                {endTime && (() => {
                                    const [h, m] = endTime.split(":").map(Number);
                                    const totalMinutes = h * 60 + m;

                                    const ELEVEN_THIRTY = 11 * 60 + 30;
                                    const THREE_PM = 15 * 60;

                                    let oldStatus = "";
                                    let newStatus = "";
                                    let oldPayment = "";
                                    let newPayment = "";

                                    if (totalMinutes < ELEVEN_THIRTY) {
                                      oldStatus = "Absent";
                                      newStatus = "Present";
                                      oldPayment = "0%";
                                      newPayment = "100%";
                                    } else if (totalMinutes < THREE_PM) {
                                      oldStatus = "Half Day";
                                      newStatus = "Half Day";
                                      oldPayment = "50%";
                                      newPayment = "50%";
                                    } else {
                                      oldStatus = "Present";
                                      newStatus = "Absent";
                                      oldPayment = "100%";
                                      newPayment = "0%";
                                    }

                                    return (
                                      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 mt-4">
                                        <h3 className="text-sm font-semibold text-blue-900 mb-3">
                                          Attendance & Payment Preview
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4 text-sm">

                                          <div className="bg-white rounded-lg p-3 border">
                                            <p className="font-semibold text-gray-700 mb-2">
                                              Existing HCA
                                            </p>

                                            <p>
                                              <span className="text-gray-500">Attendance:</span>{" "}
                                              <span className="font-semibold">{oldStatus}</span>
                                            </p>

                                            <p>
                                              <span className="text-gray-500">Payment:</span>{" "}
                                              <span className="font-semibold">{oldPayment}</span>
                                            </p>
                                          </div>

                                          <div className="bg-white rounded-lg p-3 border">
                                            <p className="font-semibold text-gray-700 mb-2">
                                              New HCA
                                            </p>

                                            <p>
                                              <span className="text-gray-500">Attendance:</span>{" "}
                                              <span className="font-semibold">{newStatus}</span>
                                            </p>

                                            <p>
                                              <span className="text-gray-500">Payment:</span>{" "}
                                              <span className="font-semibold">{newPayment}</span>
                                            </p>
                                          </div>

                                        </div>

                                        <p className="text-xs text-gray-600 mt-3">
                                          Attendance and payment will be calculated automatically based on the selected replacement time.
                                        </p>
                                      </div>
                                    );
                                  })()}
            </section>

            <section>
              <SectionTitle
                title="HCP Check & Privacy"
                icon={<ShieldCheck size={17} />}
              />

              <div className="rounded-2xl border border-slate-300 bg-white p-4 sm:p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <YesNoField
                      label="HCP check requested by client?"
                      value={checkRequested}
                      onChange={setCheckRequested}
                    />
                    {checkRequested === "Yes" && (
                  <>
                    <div className="mt-5 rounded-xl border border-[#BFEBDD] bg-[#F1FCF8] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={17} className="text-[#087F5B]" />
                        <label className="text-sm font-semibold text-slate-700">
                          HCP Check Notes
                        </label>
                      </div>

                      <textarea
                        value={hcpcheckNote}
                        onChange={(event) => sethcpCheckNote(event.target.value)}
                        placeholder="Write details about the check..."
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none resize-none focus:border-[#087F5B] focus:ring-2 focus:ring-[#087F5B]/10"
                      />
                    </div>

                    <div className="mt-4 rounded-xl border border-[#B8D5E8] bg-[#F4FAFE] p-4">
                      <div className="flex gap-3 items-start">
                        <ShieldCheck size={19} className="text-[#145DA0] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#145DA0]">
                            Privacy requirement
                          </p>
                          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-5">
                            The check must be performed by an appropriate family member/caregiver and must be completed in a suitable private place.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <YesNoField
                      label="Check done?"
                      value={checkDone}
                      onChange={handleCheckDone}
                    />
                  </div>
                </div>

                {checkDone === "Yes" && (
                  <>
                    <div className="mt-5 rounded-xl border border-[#BFEBDD] bg-[#F1FCF8] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={17} className="text-[#087F5B]" />
                        <label className="text-sm font-semibold text-slate-700">
                          Check Notes
                        </label>
                      </div>

                      <textarea
                        value={checkNote}
                        onChange={(event) => setCheckNote(event.target.value)}
                        placeholder="Write details about the check..."
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none resize-none focus:border-[#087F5B] focus:ring-2 focus:ring-[#087F5B]/10"
                      />
                    </div>

                    <div className="mt-4 rounded-xl border border-[#B8D5E8] bg-[#F4FAFE] p-4">
                      <div className="flex gap-3 items-start">
                        <ShieldCheck size={19} className="text-[#145DA0] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#145DA0]">
                            Privacy requirement
                          </p>
                          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-5">
                            The check must be performed by an appropriate family member/caregiver and must be completed in a suitable private place.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            <section>
              <SectionTitle
                title="Client Concern"
                icon={<AlertTriangle size={17} />}
              />

              <div className="rounded-2xl border border-slate-400 p-4">
                <YesNoField
                  label="Has the client raised any concern?"
                  value={clientConcern}
                  onChange={setClientConcern}
                />

                {clientConcern === "Yes" && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Concern Details
                    </label>
                    <textarea
                      value={clientConcernNote}
                      onChange={(event) =>
                        setClientConcernNote(event.target.value)
                      }
                      placeholder="Write the client's concern..."
                      rows={4}
                      className="w-full rounded-xl border border-slate-400 px-4 py-3 text-sm outline-none resize-none focus:border-[#145DA0] focus:ring-2 focus:ring-[#145DA0]/10"
                    />
                  </div>
                )}
              </div>
            </section>

            <section>
              <SectionTitle
                title="Company Concern"
                icon={<AlertTriangle size={17} />}
              />

              <div className="rounded-2xl border border-slate-400 p-4">
                <YesNoField
                  label="Has the company raised any concern?"
                  value={companyConcern}
                  onChange={setCompanyConcern}
                />

                {companyConcern === "Yes" && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Concern Details
                    </label>
                    <textarea
                      value={companyConcernNote}
                      onChange={(event) =>
                        setCompanyConcernNote(event.target.value)
                      }
                      placeholder="Write the company's concern..."
                      rows={4}
                      className="w-full rounded-xl border border-slate-400 px-4 py-3 text-sm outline-none resize-none focus:border-[#145DA0] focus:ring-2 focus:ring-[#145DA0]/10"
                    />
                  </div>
                )}
              </div>
            </section>

            <section>
              <SectionTitle
                title="Mode of Leaving"
                icon={<UserCheck size={17} />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Own HCP", "Drop", "Other"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setLeavingMode(mode as LeavingMode)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition cursor-pointer ${
                      leavingMode === mode
                        ? "border-[#145DA0] bg-[#145DA0] text-white shadow-sm"
                        : "border-slate-400 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {leavingMode === "Other" && (
                <input
                  value={otherLeavingMode}
                  onChange={(event) => setOtherLeavingMode(event.target.value)}
                  placeholder="Specify mode of leaving..."
                  className="mt-3 w-full rounded-xl border border-slate-400 px-4 py-3 text-sm outline-none focus:border-[#145DA0] focus:ring-2 focus:ring-[#145DA0]/10"
                />
              )}
            </section>

            <section>
              <SectionTitle
                title="OTP Verification"
                icon={<Send size={17} />}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <OTPCard
                  recipient="HCA"
                  name={GetHCPFullName(UserFullInfo,hcaRegistrationNumber)}
                  mode={otpModes.HCA}
                  state={otp.HCA}
                  sending={otpSending === "HCA"}
                  verifying={otpVerifying === "HCA"}
                  onModeChange={(mode) =>
                    handleOTPModeChange("HCA", mode)
                  }
                  onValueChange={(value) =>
                    handleOTPValue("HCA", value)
                  }
                  onSend={() => sendOTP("HCA")}
                  onVerify={() => verifyOTP("HCA")}
                  onTechnicalIssue={() => handleTechnicalIssue("HCA")}
                  Patient_PhoneNumber={getHCAContactNumber(UserFullInfo,hcaRegistrationNumber)}
                  Email={HCPEmail}
                />

                <OTPCard
                  recipient="CLIENT"
                  name={clientName}
                  mode={otpModes.CLIENT}
                  state={otp.CLIENT}
                  sending={otpSending === "CLIENT"}
                  verifying={otpVerifying === "CLIENT"}
                  onModeChange={(mode) =>
                    handleOTPModeChange("CLIENT", mode)
                  }
                  onValueChange={(value) =>
                    handleOTPValue("CLIENT", value)
                  }
                  onSend={() => sendOTP("CLIENT")}
                  onVerify={() => verifyOTP("CLIENT")}
                  onTechnicalIssue={() => handleTechnicalIssue("CLIENT")}
                  Patient_PhoneNumber={data.Patient_PhoneNumber}
                         Email={GetEmail(users,Client_Id)}
                />
              </div>
      <div className="mt-4" id="ADMINOTPCARD">
              {otp.ADMIN.sent && (
          
                  <OTPCard
                    recipient="ADMIN"
                    name="Admin"
                    mode="GMAIL"
                    state={otp.ADMIN}
                    sending={otpSending === "ADMIN"}
                    verifying={otpVerifying === "ADMIN"}
                    onModeChange={() => undefined}
                    onValueChange={(value) =>
                      handleOTPValue("ADMIN", value)
                    }
                    onSend={() => sendOTP("ADMIN")}
                    onVerify={() => verifyOTP("ADMIN")}
                  />
             
              )}
   </div>
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <div className="flex gap-2 items-start">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      OTP validation is required
                    </p>
                    <p className="mt-1">
                      Both HCP and Client OTPs must be verified before the replacement can be submitted. If WhatsApp/Gmail delivery has a technical problem, use the Admin fallback and verify the Admin OTP.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <SectionTitle
                title="Upload Images"
                icon={<ImagePlus size={17} />}
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                hidden
                onChange={handleImageUpload}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full min-h-32 rounded-2xl border-2 border-dashed border-[#B8D5E8] bg-[#F5FAFD] hover:bg-[#EDF6FB] transition flex flex-col items-center justify-center gap-2 text-[#145DA0] px-4 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E3F0F9] flex items-center justify-center">
                  <ImagePlus size={25} />
                </div>
                <span className="font-semibold text-sm">
                  Upload Image
                </span>
                <span className="text-xs text-slate-500">
                  JPG, PNG, WEBP or GIF
                </span>
              </button>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {uploadedImages.map((file, index) => (
                    <ImagePreview
                      key={`${file.name}-${index}`}
                      file={file}
                      index={index}
                      onRemove={removeImage}
                    />
                  ))}
                </div>
              )}
            </section>
          {ActionStatusMessage&&
<div className="rounded-xl border border-teal-300 bg-teal-100 p-3 text-sm text-center font-medium text-teal-800 shadow-sm">
  {ActionStatusMessage}
</div>}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onShowChange(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                  onClick={() => UpdateReplacement(selectedHCP, selectedCase)}
                disabled={otp.HCA.verified !== true || otp.CLIENT.verified !== true || !privacyConfirmed}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#145DA0] hover:bg-[#0F4C81] text-white font-semibold text-sm shadow-sm transition cursor-pointer"
              >
                Submit Replacement
              </button>
            </div>
          </div>
        )}
      </div>

      {showPrivacyPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg my-auto rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={23} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    Privacy Check Required
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please confirm before continuing
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPrivacyPopup(false);
                  setCheckDone("");
                  setPrivacyConfirmed(false);
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3 items-start">
                  <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                  <div className="text-sm text-amber-800 space-y-2">
                    <p className="font-semibold">Privacy requirements</p>
                    <p>
                      The HCA check must be performed by a family member/caregiver of the appropriate gender.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#B8D5E8] bg-[#F4FAFE] p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Required person
                </p>
                <p className="mt-1 font-bold text-[#145DA0]">
                  {isFemale
                    ? "Female HCA → Female family member/caregiver"
                    : "Male HCA → Male family member/caregiver"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                The check must be carried out in a suitable private place. Privacy and dignity must be maintained.
              </div>

              <label className="flex gap-3 items-start cursor-pointer rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={privacyConfirmed}
                  onChange={(event) =>
                    setPrivacyConfirmed(event.target.checked)
                  }
                  className="mt-1 w-4 h-4 accent-[#145DA0]"
                />
                <span className="text-sm text-slate-600 cursor-pointer leading-5">
                  I confirm that the gender requirement and privacy requirements have been explained and will be followed.
                </span>
              </label>
            </div>

            <div className="px-5 sm:px-6 py-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPrivacyPopup(false);
                  setCheckDone("");
                  setPrivacyConfirmed(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 font-semibold text-sm text-slate-600"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!privacyConfirmed}
                onClick={() => setShowPrivacyPopup(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#145DA0] text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Confirm Check
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionTitle({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-[#EAF4FF] text-[#145DA0] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
        {title}
      </h3>
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="min-w-0">
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">
        {label}
      </label>
      <div className="rounded-xl bg-slate-50 border border-slate-400 px-4 py-3 text-sm font-medium text-slate-700 min-h-[46px] flex items-center break-words">
        {value || "—"}
      </div>
    </div>
  );
}

function InputField({
  label,
  type,
  value,
  onChange,
  icon,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-400 px-4 py-3 pl-10 text-sm text-slate-700 outline-none focus:border-[#145DA0] focus:ring-2 focus:ring-[#145DA0]/10"
        />
      </div>
    </div>
  );
}

function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNo;
  onChange: (value: "Yes" | "No") => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        {label}
      </label>

      <div className="grid grid-cols-2 gap-3 max-w-sm">
        <button
          type="button"
          onClick={() => onChange("Yes")}
          className={`rounded-xl border px-5 py-2.5 font-semibold text-sm transition cursor-pointer ${
            value === "Yes"
              ? "bg-[#087F5B] border-[#087F5B] text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Yes
        </button>

        <button
          type="button"
          onClick={() => onChange("No")}
          className={`rounded-xl border px-5 py-2.5 font-semibold text-sm transition cursor-pointer ${
            value === "No"
              ? "bg-[#C0392B] border-[#C0392B] text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

function OTPCard({
  recipient,
  name,
  mode,
  state,
  sending,
  verifying,
  onModeChange,
  onValueChange,
  onSend,
  onVerify,
  onTechnicalIssue,
  Patient_PhoneNumber,
  Email
}: {
  recipient: OTPRecipient;
  name?: string;
  mode: OTPMode;
  state: OTPState;
  sending: boolean;
  verifying: boolean;
  onModeChange: (mode: OTPMode) => void;
  onValueChange: (value: string) => void;
  onSend: () => void;
  onVerify: () => void;
  onTechnicalIssue?: () => void;
  Patient_PhoneNumber?: string;
  Email?: string;
}) {
  const isHCA = recipient === "HCA";
  const isAdmin = recipient === "ADMIN";
const otpMethodName =
  mode === "WHATSAPP"
    ? "WhatsApp"
    : mode === "GMAIL"
    ? "Gmail"
    : "SMS";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div
        className={`p-4 ${
          isAdmin
            ? "bg-[#FFF7E8]"
            : isHCA
            ? "bg-[#EAF4FF]"
            : "bg-[#EAFBF7]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isAdmin
                ? "bg-amber-100 text-amber-600"
                : isHCA
                ? "bg-[#D7EAFF] text-[#145DA0]"
                : "bg-[#D5F5EC] text-[#087F5B]"
            }`}
          >
            {isAdmin ? (
              <ShieldCheck size={21} />
            ) : mode === "WHATSAPP" ? (
              <MessageCircle size={21} />
            ) : (
              <Mail size={21} />
            )}
          </div>

          <div className="min-w-0">
            <h4 className="font-bold text-slate-800">
           {recipient==="HCA" ? `Existing HCP  OTP` : `${recipient} OTP`}
            </h4>

            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {name || (isHCA ? "HCA" : recipient === "CLIENT" ? "Client" : "Admin")}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {!isAdmin && (
          <>
            <p className="text-sm text-slate-500 mb-3">
              Select how you want to send the verification OTP.
            </p>

        
<div className="grid grid-cols-3 gap-2">
    <button
    type="button"
    onClick={() => onModeChange("SMS")}
    className={`rounded-xl border px-2 py-3 text-left transition ${
      mode === "SMS"
        ? "border-purple-600 bg-purple-50 text-purple-700"
        : "border-slate-200 text-slate-500 hover:bg-slate-50"
    }`}
  >
    <div className="flex items-center gap-1.5">
      <Phone size={16} />
      <span className="text-xs font-semibold">SMS</span>
    </div>
    <p className="mt-1 text-[10px]">{Patient_PhoneNumber || "Not available"}</p>
  </button>
  

  <button
    type="button"
    onClick={() => onModeChange("GMAIL")}
    className={`rounded-xl border px-2 py-3 text-left transition ${
      mode === "GMAIL"
        ? "border-blue-600 bg-blue-50 text-blue-700"
        : "border-slate-200 text-slate-500 hover:bg-slate-50"
    }`}
  >
    <div className="flex items-center gap-1.5">
      <Mail size={16} />
      <span className="text-xs font-semibold">Gmail</span>
    </div>
    <p className="mt-1 text-[10px]">{Email || "Not provided"}</p>
  </button>
  <button
    type="button"
    onClick={() => onModeChange("WHATSAPP")}
    className={`rounded-xl border px-2 py-3 text-left transition ${
      mode === "WHATSAPP"
        ? "border-green-600 bg-green-50 text-green-700"
        : "border-slate-200 text-slate-500 hover:bg-slate-50"
    }`}
  >
    <div className="flex items-center gap-1.5">
      <MessageCircle size={16} />
      <span className="text-xs font-semibold">WhatsApp</span>
    </div>
    <p className="mt-1 text-[10px]">{Patient_PhoneNumber || "Not available"}</p>
  </button>


</div>


          </>
        )}

        {isAdmin && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            Technical issue fallback. Admin OTP is sent by Gmail for manual verification.
          </div>
        )}

        <button
          type="button"
          disabled={sending || state.verified}
          onClick={onSend}
          className={`w-full mt-4 rounded-xl px-4 py-3 font-semibold text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
            state.verified
              ? "bg-emerald-100 text-emerald-700"
              : isAdmin
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : isHCA
              ? "bg-[#145DA0] hover:bg-[#0F4C81] text-white"
              : "bg-[#087F5B] hover:bg-[#066A4C] text-white"
          } disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {sending ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <span>Sending...</span>
            </>
          ) : state.verified ? (
            <>
              <CheckCircle2 size={17} />
              <span>OTP Verified</span>
            </>
          ) : state.sent ? (
            <>
              <RefreshCw size={17} />
              <span>Resend OTP via {otpMethodName}</span>
            </>
          ) : (
            <>
              <Send size={17} />
              <span>Send OTP via {otpMethodName}</span>
            </>
          )}
        </button>

        {state.sent && !state.verified && (
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Enter 6-digit OTP
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <KeyRound
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={state.value}
                  onChange={(event) =>
                    onValueChange(event.target.value)
                  }
                  placeholder="Enter OTP"
                  className="w-full rounded-xl border border-slate-400 pl-10 pr-3 py-3 text-sm outline-none tracking-[0.25em] focus:border-[#145DA0] focus:ring-2 focus:ring-[#145DA0]/10"
                />
              </div>

              <button
                type="button"
                disabled={verifying}
                onClick={onVerify}
                className="px-4 rounded-xl bg-[#087F5B] hover:bg-[#066A4C] text-white text-sm font-semibold disabled:opacity-60"
              >
                {verifying ? "Checking..." : "Verify"}
              </button>
            </div>
          </div>
        )}

        {state.verified && (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700 flex items-center gap-2">
            <CheckCircle2 size={17} />
            <span>OTP verified successfully.</span>
          </div>
        )}

        {state.error && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
            {state.error}
          </div>
        )}

        {!isAdmin && onTechnicalIssue && (
          <button
            type="button"
            onClick={onTechnicalIssue}
            disabled={sending}
            className="w-full mt-3 rounded-xl cursor-pointer border border-amber-200 bg-amber-50 text-amber-700 px-3 py-2.5 text-xs font-semibold hover:bg-amber-100 transition disabled:opacity-50"
          >
            Technical issue? Send OTP to Admin
          </button>
        )}
      </div>
    </div>
  );
}

function ImagePreview({
  file,
  index,
  onRemove,
}: {
  file: File;
  index: number;
  onRemove: (index: number) => void;
}) {
  const [preview] = useState(() => URL.createObjectURL(file));

  return (
    <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <img
        src={preview}
        alt={file.name}
        className="w-full h-28 sm:h-32 object-cover"
      />

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white text-slate-600 shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
      >
        <X size={15} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1.5">
        <p className="text-[10px] text-white truncate">
          {file.name}
        </p>
      </div>
    </div>
  );
}
