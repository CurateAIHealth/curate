"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileAudio,
  Mic,
  Play,
  Search,
  Upload,
  UserRound,
  X,
} from "lucide-react";
let terminationCache: any[] | null = null;
import { useDispatch, useSelector } from "react-redux";
import { SetDeploymentInfo, UpdateMonthFilter, UpdateYearFilter } from "@/Redux/action";
import { years } from "@/Lib/Content";
import axios from "axios";
import LoadingPopup from "../SwitchMonth/page";
import { LoadingData } from "../Loading/page";
import { GetTerminationInfoForTerminationPage } from "@/Lib/user.action";

/* =========================================================
   TYPES
========================================================= */

type AnswerType = "textarea" | "yesNo" | "text";

type CallStatus = "Not Started" | "In Progress" | "Completed";

interface Client {
  LastUpdate: any;
  id: string;
  name: string;
  hcaName: string;
  hcaId: string;
}

interface QualityQuestion {
  id: string;
  sectionId: string;
  number: string;
  question: string;
  answerType: AnswerType;
  subHeading?: string;
}

interface QualitySection {
  id: string;
  title: string;
  questions: QualityQuestion[];
}

interface QualityAnswer {
  questionId: string;
  answer: string;
}

interface CallRecording {
  file: File | null;
  url: string | null;
  publicId: string | null;
  format: string | null;
  duration: number | null;
}

interface QualityCall {
  clientId: string;
  clientName: string;
  hcaId: string;
  hcaName: string;

  callDate: string;
  calledBy: string;

  answers: QualityAnswer[];

  overallFeedback: string;
  concerns: string;

  followUpRequired: boolean;
  followUpNotes: string;
  recording: any

feedbackType:any
  status: CallStatus;
  Month: any
}

/* =========================================================
   TEST CLIENT DATA
========================================================= */

// const testClients: Client[] = [
//   {
//     id: "client-001",
//     name: "Sunrise Care",
//     hcaId: "hca-001",
//     hcaName: "Anjali Kale",
//   },
//   {
//     id: "client-002",
//     name: "Green Valley Care",
//     hcaId: "hca-002",
//     hcaName: "Priya Sharma",
//   },
//   {
//     id: "client-003",
//     name: "Care Plus Services",
//     hcaId: "hca-003",
//     hcaName: "Kavya Reddy",
//   },
//   {
//     id: "client-004",
//     name: "Happy Hearts Care",
//     hcaId: "hca-004",
//     hcaName: "Sakshi Ghatwade",
//   },
// ];

/* =========================================================
   QUESTIONS FROM YOUR EXAMPLE FILE
========================================================= */

const qualitySections: QualitySection[] = [
  {
    id: "placement",
    title: "Placement call/ first time call to Client",
    questions: [
      // A. Healthcare Assistant (HCA) / Caregiver Performance
      {
        id: "placement-1",
        sectionId: "placement",
        number: "1",
        subHeading:
          "A. Healthcare Assistant (HCA) / Caregiver Performance",
        question:
          "Is the Healthcare Assistant punctual and regular? (Only Stay Out)",
        answerType: "textarea",
      },
      {
        id: "placement-2",
        sectionId: "placement",
        number: "2",
        question:
          "Does the HCA follow proper hygiene practices (hand wash, cleanliness)?",
        answerType: "textarea",
      },
      {
        id: "placement-3",
        sectionId: "placement",
        number: "3",
        question:
          "Is the HCA polite and respectful to the patient and family?",
        answerType: "textarea",
      },
      {
        id: "placement-4",
        sectionId: "placement",
        number: "4",
        question:
          "Does the HCA understand the patient’s daily care needs?",
        answerType: "textarea",
      },
      {
        id: "placement-5",
        sectionId: "placement",
        number: "5",
        question:
          "Is the HCA attentive and alert during duty hours?",
        answerType: "textarea",
      },
      {
        id: "placement-6",
        sectionId: "placement",
        number: "6",
        question:
          "Does the HCA provide proper support for feeding, bathing, and toileting?",
        answerType: "textarea",
      },
      {
        id: "placement-7",
        sectionId: "placement",
        number: "7",
        question:
          "Does the HCA handle the patient carefully and safely?",
        answerType: "textarea",
      },
      {
        id: "placement-8",
        sectionId: "placement",
        number: "8",
        question:
          "Is the HCA emotionally supportive to the patient?",
        answerType: "textarea",
      },
      {
        id: "placement-9",
        sectionId: "placement",
        number: "9",
        question:
          "Does the HCA communicate clearly with the family?",
        answerType: "textarea",
      },
      {
        id: "placement-10",
        sectionId: "placement",
        number: "10",
        question:
          "Have you faced any issues with the HCA’s behavior or attitude?",
        answerType: "textarea",
      },
      {
        id: "placement-11",
        sectionId: "placement",
        number: "11",
        question:
          "Are nursing procedures done correctly and professionally?(Only Nurse)",
        answerType: "textarea",
      },
      {
        id: "placement-12",
        sectionId: "placement",
        number: "12",
        question:
          "Is medication given on time as prescribed?(Only Nurse)",
        answerType: "textarea",
      },
      {
        id: "placement-13",
        sectionId: "placement",
        number: "13",
        question:
          "Is wound care / injection / catheter care done properly? (Only Nurse)",
        answerType: "textarea",
      },
      {
        id: "placement-14",
        sectionId: "placement",
        number: "14",
        question:
          "Are you confident in the nurse’s clinical skills?(Only Nurse)",
        answerType: "textarea",
      },

      // B. Operations & Coordination Team
      {
        id: "placement-15",
        sectionId: "placement",
        number: "15",
        subHeading: "B. Operations & Coordination Team",
        question:
          "Is the operations team reachable when you need help?",
        answerType: "textarea",
      },
      {
        id: "placement-16",
        sectionId: "placement",
        number: "16",
        question:
          "Do they respond to calls or messages on time?",
        answerType: "textarea",
      },
      {
        id: "placement-17",
        sectionId: "placement",
        number: "17",
        question:
          "Are issues resolved quickly by the operations team?",
        answerType: "textarea",
      },
      {
        id: "placement-18",
        sectionId: "placement",
        number: "18",
        question:
          "Is replacement provided promptly if staff is absent?",
        answerType: "textarea",
      },
      {
        id: "placement-19",
        sectionId: "placement",
        number: "19",
        question:
          "Does the operations team communicate clearly and politely?",
        answerType: "textarea",
      },
      {
        id: "placement-20",
        sectionId: "placement",
        number: "20",
        question:
          "Are you informed in advance about any changes in service or leaves of the HCA/Nurse?",
        answerType: "textarea",
      },
      {
        id: "placement-21",
        sectionId: "placement",
        number: "21",
        question:
          "How well does the team handle emergencies?",
        answerType: "textarea",
      },
      {
        id: "placement-22",
        sectionId: "placement",
        number: "22",
        question:
          "Are you satisfied with response time during urgent situations?",
        answerType: "textarea",
      },
      {
        id: "placement-23",
        sectionId: "placement",
        number: "23",
        question:
          "Has any serious issue been ignored or delayed?",
        answerType: "textarea",
      },
      {
        id: "placement-24",
        sectionId: "placement",
        number: "24",
        question:
          "Do you feel supported during critical situations?",
        answerType: "textarea",
      },

      // C. Professionalism & Trust
      {
        id: "placement-25",
        sectionId: "placement",
        number: "25",
        subHeading: "C. Professionalism & Trust",
        question:
          "Do you feel your patient is safe under our care?",
        answerType: "textarea",
      },
      {
        id: "placement-26",
        sectionId: "placement",
        number: "26",
        question:
          "Do you trust the caregiver/nurse assigned to you?",
        answerType: "textarea",
      },
      {
        id: "placement-27",
        sectionId: "placement",
        number: "27",
        question:
          "Are patient privacy and dignity maintained?",
        answerType: "textarea",
      },
      {
        id: "placement-28",
        sectionId: "placement",
        number: "28",
        question:
          "Has there been any misconduct or inappropriate behavior?",
        answerType: "textarea",
      },
      {
        id: "placement-29",
        sectionId: "placement",
        number: "29",
        question:
          "Are company rules and commitments followed?",
        answerType: "textarea",
      },

      // D. Payment & Transparency
      {
        id: "placement-30",
        sectionId: "placement",
        number: "30",
        subHeading: "D. Payment & Transparency",
        question:
          "Are service charges explained clearly to you?",
        answerType: "textarea",
      },
      {
        id: "placement-31",
        sectionId: "placement",
        number: "31",
        question:
          "Are bills and payment timelines communicated properly?",
        answerType: "textarea",
      },
      {
        id: "placement-32",
        sectionId: "placement",
        number: "32",
        question:
          "Do you feel the payment process is transparent?",
        answerType: "textarea",
      },
      {
        id: "placement-33",
        sectionId: "placement",
        number: "33",
        question:
          "Have you faced any confusion regarding billing?",
        answerType: "textarea",
      },

      // E. Overall Service Experience
      {
        id: "placement-34",
        sectionId: "placement",
        number: "34",
        subHeading: "E. Overall Service Experience",
        question:
          "How long have you been using our home care services?",
        answerType: "textarea",
      },
      {
        id: "placement-35",
        sectionId: "placement",
        number: "35",
        question:
          "Would you recommend our services to others? Why or why not?",
        answerType: "textarea",
      },
      {
        id: "placement-36",
        sectionId: "placement",
        number: "36",
        question:
          "Do you feel the services provided match what was promised initially?",
        answerType: "textarea",
      },
      {
        id: "placement-37",
        sectionId: "placement",
        number: "37",
        question:
          "Are you satisfied with the value for money of our services?",
        answerType: "textarea",
      },

      // F. Improvement & Feedback
      {
        id: "placement-38",
        sectionId: "placement",
        number: "38",
        subHeading: "F. Improvement & Feedback",
        question:
          "What do you like most about our service?",
        answerType: "textarea",
      },
      {
        id: "placement-39",
        sectionId: "placement",
        number: "39",
        question:
          "What do you dislike or feel needs improvement?",
        answerType: "textarea",
      },
      {
        id: "placement-40",
        sectionId: "placement",
        number: "40",
        question:
          "Is there anything you feel we failed to provide?",
        answerType: "textarea",
      },
      {
        id: "placement-41",
        sectionId: "placement",
        number: "41",
        question:
          "What changes would you suggest to improve our service?",
        answerType: "textarea",
      },
    ],
  },

  {
    id: "random-checkin",
    title: "Random Client Check-in Call",
    questions: [
      {
        id: "random-checkin-1",
        sectionId: "random-checkin",
        number: "1",
        question:
          "Hello Sir/Madam, we are just calling to check in and see how everything is going with the care service. Is everything going well so far?",
        answerType: "textarea",
      },
      {
        id: "random-checkin-2",
        sectionId: "random-checkin",
        number: "2",
        question:
          "How is the caregiver/nurse doing with the patient? Are you comfortable with the service?",
        answerType: "textarea",
      },
      {
        id: "random-checkin-3",
        sectionId: "random-checkin",
        number: "3",
        question:
          "Is the caregiver/nurse punctual and regular as expected?",
        answerType: "textarea",
      },
      {
        id: "random-checkin-4",
        sectionId: "random-checkin",
        number: "4",
        question:
          "Is the caregiver/nurse taking proper care of the patient and following the daily care requirements?",
        answerType: "textarea",
      },
      {
        id: "random-checkin-5",
        sectionId: "random-checkin",
        number: "5",
        question:
          "Is the patient comfortable with the caregiver/nurse?",
        answerType: "textarea",
      },
      {
        id: "random-checkin-6",
        sectionId: "random-checkin",
        number: "6",
        question:
          "Are you happy with the caregiver/nurse's behaviour, communication, and attitude towards the patient and family?",
        answerType: "textarea",
      },
      {
        id: "random-checkin-7",
        sectionId: "random-checkin",
        number: "7",
        question:
          "Is there anything you feel the caregiver/nurse should improve or do differently?",
        answerType: "textarea",
      },
      {
        id: "random-checkin-8",
        sectionId: "random-checkin",
        number: "8",
        question:
          "Have you faced any issue recently regarding the care service or the staff?",
        answerType: "textarea",
      },
      {
        id: "random-checkin-9",
        sectionId: "random-checkin",
        number: "9",
        question:
          "Is our operations team supporting you properly whenever you need assistance?",
        answerType: "textarea",
      },
      {
        id: "random-checkin-10",
        sectionId: "random-checkin",
        number: "10",
        question:
          "Is there anything else you would like us to know or anything you would like our team to help you with?",
        answerType: "textarea",
      },
      {
        id: "random-checkin-11",
        sectionId: "random-checkin",
        number: "11",
        question: "Note:",
        answerType: "textarea",
      },
    ],
  },
];
const terminationSections: QualitySection[] = [
  {
    id: "termination",
    title: "Termination Feedback",
    questions: [
      {
        id: "termination-1",
        sectionId: "termination",
        number: "1",
        question: "Termination Reason",
        answerType: "textarea",
      },
      {
        id: "termination-2",
        sectionId: "termination",
        number: "2",
        question: "Specific Issue",
        answerType: "textarea",
      },
      {
        id: "termination-3",
        sectionId: "termination",
        number: "3",
        question: "Operations Issue",
        answerType: "textarea",
      },
      {
        id: "termination-4",
        sectionId: "termination",
        number: "4",
        question: "Price Issue",
        answerType: "textarea",
      },
      {
        id: "termination-5",
        sectionId: "termination",
        number: "5",
        question: "Patient condition improved",
        answerType: "textarea",
      },
      {
        id: "termination-6",
        sectionId: "termination",
        number: "6",
        question: "Alternative provider",
        answerType: "textarea",
      },
      {
        id: "termination-7",
        sectionId: "termination",
        number: "7",
        question: "Would consider returning",
        answerType: "textarea",
      },
      {
        id: "termination-8",
        sectionId: "termination",
        number: "8",
        question: "Action required",
        answerType: "textarea",
      },
      {
        id: "termination-9",
        sectionId: "termination",
        number: "9",
        question: "Note",
        answerType: "textarea",
      },
   
    ],
  },
];
const replacementSections: QualitySection[] = [
  {
    id: "replacement",
    title: "Replacement Call – Client Feedback",
    questions: [
      // A. Reason for Replacement
      {
        id: "replacement-1",
        sectionId: "replacement",
        number: "1",
        subHeading: "A. Reason for Replacement",
        question:
          "May I confirm the reason for the previous caregiver/nurse replacement?",
        answerType: "textarea",
      },
      {
        id: "replacement-2",
        sectionId: "replacement",
        number: "2",
        question:
          "Was the replacement due to the caregiver/nurse going on leave, performance concerns, compatibility issues, or another reason?",
        answerType: "textarea",
      },
      {
        id: "replacement-3",
        sectionId: "replacement",
        number: "3",
        question:
          "Was there anything specific about the previous caregiver/nurse that you were unhappy with?",
        answerType: "textarea",
      },
      {
        id: "replacement-4",
        sectionId: "replacement",
        number: "4",
        question:
          "Was the reason for replacement explained and handled properly by our team?",
        answerType: "textarea",
      },

      // B. New HCA / Nurse – Initial Feedback
      {
        id: "replacement-5",
        sectionId: "replacement",
        number: "5",
        subHeading: "B. New HCA / Nurse – Initial Feedback",
        question:
          "How has the new caregiver/nurse been performing so far?",
        answerType: "textarea",
      },
      {
        id: "replacement-6",
        sectionId: "replacement",
        number: "6",
        question:
          "Is the new caregiver/nurse punctual and regular?",
        answerType: "textarea",
      },
      {
        id: "replacement-7",
        sectionId: "replacement",
        number: "7",
        question:
          "Is the caregiver/nurse polite, respectful, and comfortable with the patient and family?",
        answerType: "textarea",
      },
      {
        id: "replacement-8",
        sectionId: "replacement",
        number: "8",
        question:
          "Does the caregiver/nurse understand and follow the patient's daily care requirements?",
        answerType: "textarea",
      },
      {
        id: "replacement-9",
        sectionId: "replacement",
        number: "9",
        question:
          "Is the caregiver/nurse attentive and careful while providing care?",
        answerType: "textarea",
      },
      {
        id: "replacement-10",
        sectionId: "replacement",
        number: "10",
        question:
          "Are you satisfied with the way feeding, bathing, toileting, mobility, and other required care are being handled?",
        answerType: "textarea",
      },
      {
        id: "replacement-11",
        sectionId: "replacement",
        number: "11",
        question:
          "For Nurse: Are nursing procedures and medication being handled correctly and on time?",
        answerType: "textarea",
      },
      {
        id: "replacement-12",
        sectionId: "replacement",
        number: "12",
        question:
          "Do you feel the new caregiver/nurse is a better fit for the patient?",
        answerType: "textarea",
      },

      // C. Patient & Family Comfort
      {
        id: "replacement-13",
        sectionId: "replacement",
        number: "13",
        subHeading: "C. Patient & Family Comfort",
        question:
          "Is the patient comfortable with the new caregiver/nurse?",
        answerType: "textarea",
      },
      {
        id: "replacement-14",
        sectionId: "replacement",
        number: "14",
        question:
          "Have you noticed any improvement after the replacement?",
        answerType: "textarea",
      },
      {
        id: "replacement-15",
        sectionId: "replacement",
        number: "15",
        question:
          "Do you have any concerns about the caregiver/nurse's behaviour, attitude, or way of working?",
        answerType: "textarea",
      },
      {
        id: "replacement-16",
        sectionId: "replacement",
        number: "16",
        question:
          "Do you feel your patient is safe and properly cared for under the new staff?",
        answerType: "textarea",
      },

      // D. Replacement & Operations Team
      {
        id: "replacement-17",
        sectionId: "replacement",
        number: "17",
        subHeading: "D. Replacement & Operations Team",
        question:
          "Were you informed properly about the replacement?",
        answerType: "textarea",
      },
      {
        id: "replacement-18",
        sectionId: "replacement",
        number: "18",
        question:
          "Was the replacement arranged within a reasonable time?",
        answerType: "textarea",
      },
      {
        id: "replacement-19",
        sectionId: "replacement",
        number: "19",
        question:
          "Did our operations team respond promptly to your calls or messages during the replacement?",
        answerType: "textarea",
      },
      {
        id: "replacement-20",
        sectionId: "replacement",
        number: "20",
        question:
          "Was the handover from the previous caregiver/nurse to the new caregiver/nurse handled properly?",
        answerType: "textarea",
      },
      {
        id: "replacement-21",
        sectionId: "replacement",
        number: "21",
        question:
          "Is there anything you expected from our team during the replacement that was not provided?",
        answerType: "textarea",
      },

      // E. Final Check
      {
        id: "replacement-22",
        sectionId: "replacement",
        number: "22",
        subHeading: "E. Final Check",
        question:
          "Overall, are you satisfied with the new caregiver/nurse?",
        answerType: "textarea",
      },
      {
        id: "replacement-23",
        sectionId: "replacement",
        number: "23",
        question:
          "Is there anything you would like the new caregiver/nurse to improve?",
        answerType: "textarea",
      },
      {
        id: "replacement-24",
        sectionId: "replacement",
        number: "24",
        question:
          "Is there anything you would like our operations team to follow up on?",
        answerType: "textarea",
      },
      {
        id: "replacement-25",
        sectionId: "replacement",
        number: "25",
        question:
          "Do you have any immediate concern that you would like us to address today?",
        answerType: "textarea",
      },
    ],
  },
];

interface Client {
  id: string;
  name: string;
  hcaName: string;
  hcaId: string;

  patientName: string;
  enrollmentDate: string;
  terminated: string;
  team: string;
  note: string;
  status: string;

  // This should come from your feedback data
  feedbackStatus: "Pending" | "Completed";
}

const ClientFeedback: React.FC = () => {
  const [selectedClient, setSelectedClient] =
    useState<Client | null>(null);
  const [finelScreenMessage, setfinelScreenMessage] = useState("")
  const [recordingMessage, setRecordingMessage] = useState("");
  const [searchClient, setSearchClient] =
    useState<string>("");

  const [callStarted, setCallStarted] =
    useState<boolean>(false);

  const [currentSectionIndex, setCurrentSectionIndex] =
    useState<number>(0);

  const [answers, setAnswers] =
    useState<QualityAnswer[]>([]);

  const [overallFeedback, setOverallFeedback] =
    useState<string>("");

  const [concerns, setConcerns] =
    useState<string>("");

  const [followUpRequired, setFollowUpRequired] =
    useState<boolean>(false);

  const [followUpNotes, setFollowUpNotes] =
    useState<string>("");
  const [isSwitchingMonth, setIsSwitchingMonth] = useState(false);
  const [recording, setRecording] =
    useState<CallRecording | null>(null);
const [TerminationInfo,setTerminationInfo]=useState([])
const [ReplacementInfo,setReplacementInfo]=useState([])
  const [saved, setSaved] =
    useState<boolean>(false);
  const DeploymentInfo = useSelector((state: any) => state.AdminDeployment)
  const SearchMonth = useSelector((state: any) => state.FilterMonth)
  const SearchYear = useSelector((state: any) => state.FilterYear)
const [PreviewType, setPreviewType] = useState<
  "Deployment" | "Replacement" | "Termination"
>("Deployment");
  const [feedbackFilter, setFeedbackFilter] = useState<
    "Pending" | "Completed"
  >("Pending");
const allSections = useMemo(() => {
  switch (PreviewType) {
    case "Termination":
      return terminationSections;

    case "Replacement":
      return replacementSections;

    case "Deployment":
    default:
      return qualitySections;
  }
}, [PreviewType]);
  const [ClientFeedbackInfo, setClientFeedbackInfo] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const dispatch = useDispatch()
  const month = `${SearchMonth}-${SearchYear}`;
  useEffect(() => {
    const GetClientData = async () => {
      try {


        const response = await axios.post(
          "/api/ClientFeedBackInfo",
          {
            month,
          }
        );

        console.log(
          "Client Feedback Information -----",
          response
        );

        if (response.data?.success) {
          setClientFeedbackInfo(response.data.data || []);
          setIsChecking(false)
        } else {
          setClientFeedbackInfo([]);
        }
      } catch (error) {
        console.error(
          "Get Client Feedback Error -----",
          error
        );

        setClientFeedbackInfo([]);
      }
    };

    if (SearchMonth && SearchYear) {
      GetClientData();
    }
  }, [SearchMonth, SearchYear]);

const GetPlacementFeedback = (
  clientId: string,
  hcaId: string
) => {
  return (
    ClientFeedbackInfo
      .filter((each: any) =>
        String(each.clientId).trim() === String(clientId).trim() &&
        String(each.hcaId).trim() === String(hcaId).trim() &&
        String(each.feedbackType).trim() === "Deployment" &&
        String(each.status).trim() === "Completed"
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.callDate).getTime() -
          new Date(a.callDate).getTime()
      )[0] ?? null
  );
};
  const GetClientFeedback = (
    month: string,
    clientId: string,
    hcaId: string
  ) => {
    return (
      ClientFeedbackInfo.find((each: any) => {
        return (
          String(each.Month).trim() === String(month).trim() &&
          String(each.clientId).trim() === String(clientId).trim() &&
          String(each.hcaId).trim() === String(hcaId).trim()
        );
      }) ?? null
    );
  };
console.log ("Check for Current Task----",GetClientFeedback(month,"fb9832ee-c4fd-4632-be73-67dd0b539db6","391a2c83-3ef3-4029-a215-7539cbc66707"))

  const currentSection =
    allSections[currentSectionIndex];

  const totalSections = allSections.length;

  const progress =
    ((currentSectionIndex + 1) / totalSections) * 100;
const FetchTerminationData = async () => {
      try {
           setIsChecking(true);
        if (terminationCache) {
          setTerminationInfo(terminationCache);
          
   setPreviewType("Termination")
          setIsChecking(false);
          return;
        }

    const FetchData = await GetTerminationInfoForTerminationPage(SearchMonth, SearchYear)


      
      
        
        const Result: any = FetchData?.map((each: any) => ({
          id: each.ClientId,
          name: each.ClientName,
          hcaId: each.HCAid,
          hcaName: each.HCAName,
          patientName: each.patientName?.trim() || "Not Available",




          enrollmentDate: each.StartDate,
          terminated: "Terminated",
          status: "Terminated",
          team: each.Team || 1,

          note: each.Note || "",
          feedbackStatus: GetClientFeedback(
            `${SearchMonth}-${SearchYear}`,
            each.ClientId,
            each.HCAid

          )?.status || "Pending",
          Month: GetClientFeedback(
            `${SearchMonth}-${SearchYear}`,
            each.ClientId,
            each.HCAid

          )?.Month || "",
          compliteInfo: GetClientFeedback(
            `${SearchMonth}-${SearchYear}`,
            each.ClientId,
            each.HCAid

          ) || null,

          LastUpdate:GetClientFeedback(
          `${SearchMonth}-${SearchYear}`,
            each.ClientId,
            each.HCAid



      )?.updatedAt||null,







          /*
           * IMPORTANT:
           * This field must come from your feedback data.
           *
           * If no feedback exists, it is Pending.
           */

        })) ?? [];

console.log ("Check for Current Task----",Result)
        setTerminationInfo(Result);
     setPreviewType("Termination")
        setIsChecking(false);
      } catch (err) {
        setIsChecking(false);
      }
    };


    const GetReplasementData=async()=>{
      try{
   setIsChecking(true)
     const response = await axios.post("/api/qualityreplasement", {
      month: SearchMonth,
      year: SearchYear,
    });
const FetchDataReplasementData=response.data.data||[]
   console.log("ReplasmentData------",response.data.data) 

    const Result: any = FetchDataReplasementData?.map((each: any) => ({
          id: each.ClientId,
          name: each.ClientName,
          hcaId: each.HCAId,
          hcaName: each.HCAName,
          patientName: each.patientName?.trim() || "Not Available",




          enrollmentDate: each.StartDate,
          Replacement: "Replacement",
          status: "Replacement",
          team: each.Team || 1,

          note: each.Note || "",
          feedbackStatus: GetClientFeedback(
            `${SearchMonth}-${SearchYear}`,
            each.ClientId,
            each.HCAId

          )?.status || "Pending",
          Month: GetClientFeedback(
            `${SearchMonth}-${SearchYear}`,
            each.ClientId,
            each.HCAId

          )?.Month || "",
          compliteInfo: GetClientFeedback(
            `${SearchMonth}-${SearchYear}`,
            each.ClientId,
            each.HCAId

          ) || null,
 LastUpdate:GetClientFeedback(
          `${SearchMonth}-${SearchYear}`,
            each.ClientId,
            each.HCAId


      )?.updatedAt||null,






          /*
           * IMPORTANT:
           * This field must come from your feedback data.
           *
           * If no feedback exists, it is Pending.
           */

        })) ?? [];

             setReplacementInfo(Result);
             setIsChecking(false)
      }catch(err:any){

      }

    }
  const clients: Client[] = useMemo(() => {
    if (!Array.isArray(DeploymentInfo)||!Array.isArray(TerminationInfo)|| !Array.isArray(ReplacementInfo)) {
      return [];
    }

  return PreviewType==="Replacement"?ReplacementInfo:  PreviewType==="Termination"?TerminationInfo:  DeploymentInfo.map((item: any) => ({
      id: item.ClientId,
      name: item.ClientName?.trim() || "Unknown Client",
      hcaName: item.HCAName?.trim() || "Not Assigned",
      hcaId: item.HCAId || "",

      patientName: item.patientName?.trim() || "Not Available",

      enrollmentDate: item.StartDate || "N/A",

      terminated:
        item.Status === "Terminated"
          ? item.EndDate || "N/A"
          : "NA",

      team: item.Team || 1,

      note: item.Note || "",

      status: item.Status || "Active",

      /*
       * IMPORTANT:
       * This field must come from your feedback data.
       *
       * If no feedback exists, it is Pending.
       */
      feedbackStatus: GetClientFeedback(
        `${SearchMonth}-${SearchYear}`,
        item.ClientId,
        item.HCAId

      )?.status || "Pending",
      Month: GetClientFeedback(
        `${SearchMonth}-${SearchYear}`,
        item.ClientId,
        item.HCAId

      )?.Month || "",
      compliteInfo: GetClientFeedback(
        `${SearchMonth}-${SearchYear}`,
        item.ClientId,
        item.HCAId

      )||null,
     LastUpdate:
  GetClientFeedback(
    `${SearchMonth}-${SearchYear}`,
    item.ClientId,
    item.HCAId
  )?.updatedAt || null,
    }));
    
  }, [DeploymentInfo, ClientFeedbackInfo, SearchMonth, SearchYear,TerminationInfo,PreviewType]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name
          .toLowerCase()
          .includes(searchClient.toLowerCase()) ||
        client.patientName
          .toLowerCase()
          .includes(searchClient.toLowerCase()) ||
        client.hcaName
          .toLowerCase()
          .includes(searchClient.toLowerCase());

      const matchesStatus =
        client.feedbackStatus === feedbackFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchClient, feedbackFilter]);

  /* =========================================================
     ANSWER HANDLING
  ========================================================= */

  const getAnswer = (questionId: string): string => {
    return (
      answers.find(
        (answer) => answer.questionId === questionId
      )?.answer || ""
    );
  };

  const updateAnswer = (
    questionId: string,
    value: string
  ) => {
    setAnswers((previous) => {
      const existingIndex = previous.findIndex(
        (answer) =>
          answer.questionId === questionId
      );

      if (existingIndex === -1) {
        return [
          ...previous,
          {
            questionId,
            answer: value,
          },
        ];
      }

      const updated = [...previous];

      updated[existingIndex] = {
        ...updated[existingIndex],
        answer: value,
      };

      return updated;
    });
  };

  /* =========================================================
     RECORDING
  ========================================================= */
  const GetMonthFreshData = async (r: string) => {
    try {

      setIsSwitchingMonth(true);
      dispatch(UpdateMonthFilter(r));

      const userId = localStorage.getItem("UserId");

      const { data } = await axios.post(
        "/api/AdminPageInfo",
        {
          userId,
          Month: `${SearchYear}-${r}`,
        }
      );



      console.log("Check New Data", data.data.deployedLength);

      dispatch(SetDeploymentInfo(data.data.deployedLength));
      setIsSwitchingMonth(false);

    } catch (error) {
      console.error("GetMonthFreshData Error:", error);

    }
  };
  const handleRecordingUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecordingMessage("Please Wait....")
    const file = event.target.files?.[0];

    if (!file) return;

    const maxSize = 100 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Recording must be less than 100MB.");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);





    const res = await axios.post('/api/Upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setRecordingMessage('recording Uploded sucessfully!')
    setRecording({
      file,
      url: res.data.url,
      publicId: null,
      format: file.type,
      duration: null,
    });
  };

  /* =========================================================
     START CALL
  ========================================================= */
const openCompletedFeedback = (client: Client & { compliteInfo?: any }) => {
  if (!client) return;

  const savedFeedback = client.compliteInfo;

  console.log("Opening Completed Feedback:", savedFeedback);

  // Load previously saved answers
  setAnswers(
    Array.isArray(savedFeedback?.answers)
      ? savedFeedback.answers
      : []
  );

  // Load final feedback fields
  setOverallFeedback(savedFeedback?.overallFeedback || "");
  setConcerns(savedFeedback?.concerns || "");
  setFollowUpRequired(
    Boolean(savedFeedback?.followUpRequired)
  );
  setFollowUpNotes(
    savedFeedback?.followUpNotes || ""
  );

  // Load recording if available
  if (savedFeedback?.recording) {
    setRecording({
      file: null,
      url: savedFeedback.recording,
      publicId: null,
      format: null,
      duration: null,
    });
  } else {
    setRecording(null);
  }

  // Open questionnaire
  setSelectedClient(client);
  setCurrentSectionIndex(0);
  setCallStarted(true);
  setSaved(false);
};
  const startCall = () => {
    if (!selectedClient) return;
  setAnswers([]);
  setOverallFeedback("");
  setConcerns("");
  setFollowUpRequired(false);
  setFollowUpNotes("");
  setRecording(null);
    setCallStarted(true);
    setCurrentSectionIndex(0);
    setSaved(false);
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const saveQualityCall = async () => {
  if (!selectedClient) return;

  setfinelScreenMessage("Please Wait.......");

  // Get the correct question sections for the selected PreviewType
  let activeSections: QualitySection[];

  if (PreviewType === "Replacement") {
    activeSections = replacementSections;
  } else if (PreviewType === "Termination") {
    activeSections = terminationSections;
  } else {
    activeSections = qualitySections;
  }

  // Get only the questions belonging to the selected section type
  const activeQuestionIds = activeSections.flatMap((section) =>
    section.questions.map((question) => question.id)
  );

  // Save only answers belonging to the current PreviewType
  const filteredAnswers: QualityAnswer[] = answers.filter((answer) =>
    activeQuestionIds.includes(answer.questionId)
  );

  const qualityCall: QualityCall = {
    clientId: selectedClient.id,
    clientName: selectedClient.name,

    hcaId: selectedClient.hcaId,
    hcaName: selectedClient.hcaName,

    callDate: new Date().toISOString(),
    calledBy: "Current Admin",

    answers: filteredAnswers,

    overallFeedback,
    concerns,

    followUpRequired,
    followUpNotes,

    recording: recording?.url,

    // Deployment / Replacement / Termination
    feedbackType: PreviewType,

    status: "Completed",
    Month: `${SearchMonth}-${SearchYear}`,
  };

  console.log("QUALITY CALL:", qualityCall);

  try {
    const PostClientFeedBack = await axios.post(
      "/api/ClientFeedback",
      {
        qualityCall,
      }
    );

    console.log(
      "Check Data Post Status----",
      PostClientFeedBack
    );

    setSaved(true);
  } catch (error) {
    console.error("Save Quality Call Error:", error);
  }
};

  /* =========================================================
     CLIENT SELECTION SCREEN
  ========================================================= */
  if (isChecking) {
    return (
      <LoadingData />

    );
  }
  if (!callStarted) {
    return (
      <div className="space-y-6">

        {/* Header */}
       <div className="w-full space-y-6">
  {/* =========================================================
      HEADER + ACTIONS
  ========================================================= */}
  <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
    
    {/* Header */}
    <div className="min-w-0 flex-1">
      <h2 className="break-words text-xl font-bold text-slate-800 sm:text-2xl lg:text-3xl">
        Client Quality Call
      </h2>

      <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500 sm:text-base">
        Conduct the standard quality and retention questionnaire
        with the client/HCA.
      </p>
    </div>

    {/* =========================================================
        ACTIONS
    ========================================================= */}
    <div className="flex w-full shrink-0 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 shadow-sm sm:w-fit">
      
      <div className="grid w-full grid-cols-3 gap-1 sm:flex sm:w-auto">
        
        {/* DEPLOYMENTS */}
        <button
          type="button"
          onClick={() => setPreviewType("Deployment")}
          className={`flex min-h-[44px] min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold transition-all duration-200 sm:gap-2 sm:px-4 sm:text-sm ${
            PreviewType === "Deployment"
              ? "bg-white text-[#1392d3] shadow-md ring-1 ring-slate-200"
              : "text-slate-500 hover:bg-white/70 hover:text-slate-700"
          }`}
        >
          {PreviewType === "Deployment" && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" />
          )}

          <span className="truncate">
            Deployments
          </span>
        </button>

        {/* REPLACEMENTS */}
        <button
          type="button"
          onClick={() => {
            setPreviewType("Replacement");
            GetReplasementData();
          }}
          className={`flex min-h-[44px] min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold transition-all duration-200 sm:gap-2 sm:px-4 sm:text-sm ${
            PreviewType === "Replacement"
              ? "bg-white text-[#1392d3] shadow-md ring-1 ring-slate-200"
              : "text-slate-500 hover:bg-white/70 hover:text-slate-700"
          }`}
        >
          {PreviewType === "Replacement" && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" />
          )}

          <span className="truncate">
            Replacements
          </span>
        </button>

        {/* TERMINATIONS */}
        <button
          type="button"
          onClick={() => {
            setPreviewType("Termination");
            FetchTerminationData();
          }}
          className={`flex min-h-[44px] min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold transition-all duration-200 sm:gap-2 sm:px-4 sm:text-sm ${
            PreviewType === "Termination"
              ? "bg-white text-[#ff1493] shadow-md ring-1 ring-slate-200"
              : "text-slate-500 hover:bg-white/70 hover:text-slate-700"
          }`}
        >
          {PreviewType === "Termination" && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" />
          )}

          <span className="truncate">
            Terminations
          </span>
        </button>

      </div>
    </div>
  </div>

  {/* =========================================================
      CLIENT SUMMARY CARDS
  ========================================================= */}
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    
    {/* TOTAL CLIENTS */}
    <div className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm font-medium text-[#58708f]">
          Total Clients
        </p>

        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#1392d3]" />
      </div>

      <div className="mt-3">
        <span className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
          {clients.length}
        </span>
      </div>
    </div>

    {/* PENDING FEEDBACK */}
    <div className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm font-medium text-[#58708f]">
          Pending Feedback
        </p>

        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff1493]" />
      </div>

      <div className="mt-3">
        <span className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
          {
            clients.filter(
              (client) => client.feedbackStatus === "Pending"
            ).length
          }
        </span>
      </div>
    </div>

    {/* COMPLETED FEEDBACK */}
    <div className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm font-medium text-[#58708f]">
          Completed Feedback
        </p>

        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#50c896]" />
      </div>

      <div className="mt-3">
        <span className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
          {
            clients.filter(
              (client) => client.feedbackStatus === "Completed"
            ).length
          }
        </span>
      </div>
    </div>

  </div>
</div>

        {/* Client Selection */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">



          <div className="p-5">

            <div className="mb-5 w-full">
  <div className="flex flex-col gap-4">

    {/* Top Row: Search + Filters */}
    <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">

      {/* Search */}
      <div className="relative w-full lg:flex-1 lg:max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={searchClient}
          onChange={(e) => setSearchClient(e.target.value)}
          placeholder="Search client..."
          className="
            h-11 w-full rounded-xl
            border border-slate-300
            bg-slate-50
            py-2.5 pl-10 pr-4
            text-sm text-slate-700
            outline-none
            transition
            focus:border-[#1392d3]
            focus:bg-white
            focus:ring-2
            focus:ring-[#1392d3]/20
          "
        />
      </div>

      {/* Month + Year */}
      <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto">
        <select
          value={SearchMonth}
          onChange={(e) => GetMonthFreshData(e.target.value)}
          className="
            h-11 w-full
            min-w-0 sm:w-[140px]
            rounded-xl
            border border-slate-300
            bg-white
            px-3
            text-sm text-slate-700
            outline-none
            transition
            focus:border-[#1392d3]
            focus:ring-2
            focus:ring-[#1392d3]/20
          "
        >
          <option value="">All Months</option>

          {[...Array(12)].map((_, i) => (
            <option key={i} value={`${i + 1}`}>
              {new Date(0, i).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        <select
          value={SearchYear}
          onChange={(e) =>
            dispatch(UpdateYearFilter(e.target.value))
          }
          className="
            h-11 w-full
            min-w-0 sm:w-[120px]
            rounded-xl
            border border-slate-300
            bg-white
            px-3
            text-sm text-slate-700
            outline-none
            transition
            focus:border-[#1392d3]
            focus:ring-2
            focus:ring-[#1392d3]/20
          "
        >
          <option value="">All Years</option>

          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Feedback Filters */}
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">

      {/* Pending */}
      <button
        type="button"
        onClick={() => setFeedbackFilter("Pending")}
        className={`
          flex min-h-[44px] w-full
          items-center justify-center
          gap-2 rounded-xl
          px-4 py-2.5
          text-sm font-semibold
          transition-all duration-200
          ${
            feedbackFilter === "Pending"
              ? "bg-[#1392d3] text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:border-[#1392d3] hover:text-[#1392d3]"
          }
        `}
      >
        <Clock3 size={17} className="shrink-0" />

        <span>Pending</span>

        <span
          className={`
            rounded-full px-2 py-0.5 text-xs
            ${
              feedbackFilter === "Pending"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
            }
          `}
        >
          {
            clients.filter(
              (client) => client.feedbackStatus === "Pending"
            ).length
          }
        </span>
      </button>

      {/* Completed */}
      <button
        type="button"
        onClick={() => setFeedbackFilter("Completed")}
        className={`
          flex min-h-[44px] w-full
          items-center justify-center
          gap-2 rounded-xl
          px-4 py-2.5
          text-sm font-semibold
          transition-all duration-200
          ${
            feedbackFilter === "Completed"
              ? "bg-[#50c896] text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:border-[#50c896] hover:text-[#50c896]"
          }
        `}
      >
        <CheckCircle2 size={17} className="shrink-0" />

        <span>Completed</span>

        <span
          className={`
            rounded-full px-2 py-0.5 text-xs
            ${
              feedbackFilter === "Completed"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
            }
          `}
        >
          {
            clients.filter(
              (client) => client.feedbackStatus === "Completed"
            ).length
          }
        </span>
      </button>

    </div>
  </div>
</div>
            <LoadingPopup
              open={isSwitchingMonth}
              title="Switching Month"
              description="Updating dashboard data..."
            />

            {/* Feedback Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        S.no
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        Client name
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        Pt name
                      </th>
    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Last Update
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        Enrollment date
                      </th>

                      {/* <th className="px-4 py-3 text-left font-semibold text-slate-600">
            Terminated
          </th> */}

                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        Team
                      </th>



                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        Feedback
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client, index) => {
                        const isSelected =
                          selectedClient?.id === client.id;

                        return (
                          <tr
                            key={index}
                            onClick={() => setSelectedClient(client)}
                            className={`cursor-pointer border-b border-slate-100 transition last:border-b-0 ${isSelected
                                ? "bg-sky-50"
                                : "hover:bg-slate-50"
                              }`}
                          >
                            {/* S.no */}
                            <td className="px-4 py-4 font-medium text-slate-600">
                              {index + 1}
                            </td>

                            {/* Client */}
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#1392d3]">
                                  <UserRound size={17} />
                                </div>

                                <div>
                                  <p className="font-semibold text-slate-800">
                                    {client.name}
                                  </p>

                                  <p className="mt-0.5 text-xs text-slate-400">
                                    HCA: {client.hcaName}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Patient */}
                            <td className="px-4 py-4 text-slate-700">
                              {client.patientName}
                            </td>
 <td className="px-4 py-4 text-slate-700">
  {client.LastUpdate ? (
    new Date(client.LastUpdate).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  ) : (
    <div className="group relative inline-block">
      <button
        type="button"
        className="cursor-pointer text-blue-600 underline"
      >
        View
      </button>

      {/* Tooltip Popup */}
      <div
        className="
          pointer-events-none absolute
          bottom-full left-1/2 z-50
          mb-2 -translate-x-1/2
          whitespace-nowrap
          rounded-lg bg-slate-800
          px-3 py-2
          text-xs font-medium text-white
          opacity-0 shadow-lg
          transition-opacity duration-200
          group-hover:opacity-100
        "
      >
        Not Updated in Previous Month

        {/* Arrow */}
        <div
          className="
            absolute left-1/2 top-full
            -translate-x-1/2
            border-x-4 border-t-4
            border-x-transparent border-t-slate-800
          "
        />
      </div>
    </div>
  )}
</td>

                            {/* Enrollment */}
                            <td className="px-4 py-4 text-slate-600">
                              {client.enrollmentDate}
                            </td>

                            {/* Terminated */}
                            {/* <td className="px-4 py-4 text-slate-600">
                  {client.terminated}
                </td> */}

                            {/* Team */}
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center rounded-lg border border-[#1392d3]/20 bg-[#1392d3]/10 px-3 py-1.5 text-xs font-semibold text-[#1392d3]">
                                {client.team}
                              </span>
                            </td>


                            {/* Status */}
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${client.status === "Active"
                                    ? "bg-emerald-50 text-[#50c896]"
                                    : client.status === "Terminated"
                                      ? "bg-pink-50 text-[#ff1493]"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                              >
                                {client.status}
                              </span>
                            </td>

                            {/* Feedback */}
                            <td className="px-4 py-4">
                              {client.feedbackStatus === "Completed" ? (
                                <button
                                  type="button"
                                  onClick={(event) => {
  event.stopPropagation();

  openCompletedFeedback(client);
}}
                                  className="
        inline-flex items-center gap-2
        rounded-lg px-4 py-2
        text-xs font-semibold
        bg-emerald-50
        text-[#50c896]
        hover:bg-emerald-100
        transition
      "
                                >
                                  <CheckCircle2 size={15} />
                                  Completed
                                </button>
                              ) : (
                                <button
                                  type="button"
                                 onClick={(e) => {
  e.stopPropagation();

  setAnswers([]);
  setOverallFeedback("");
  setConcerns("");
  setFollowUpRequired(false);
  setFollowUpNotes("");
  setRecording(null);

  setSelectedClient(client);
  startCall()
}}
                                  className="
        inline-flex items-center gap-2
        rounded-lg px-4 py-2
        text-xs font-semibold
        bg-sky-50
        text-[#1392d3]
        hover:bg-sky-100
        transition
      "
                                >
                                  <Mic size={15} />
                                  Start Feedback
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-6 py-12 text-center"
                        >
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                              <Search size={24} />
                            </div>

                            <p className="mt-3 font-semibold text-slate-700">
                              No {feedbackFilter.toLowerCase()} feedback
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              No clients match your current search or filter.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        {/* Selected Client */}
  

      </div>
    );
  }

  /* =========================================================
     COMPLETED
  ========================================================= */

  if (saved) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">

        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#50c896]">
            <CheckCircle2 size={34} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            Quality Call Saved
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The quality call for{" "}
            <span className="font-semibold">
              {selectedClient?.name}
            </span>{" "}
            has been completed successfully.
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left">

            <p className="text-xs text-slate-400">
              Assigned HCA
            </p>

            <p className="mt-1 font-semibold text-slate-700">
              {selectedClient?.hcaName}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">

              <div>
                <p className="text-xs text-slate-400">
                  Questions
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {answers.length}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Recording
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {recording ? "Attached" : "Not Attached"}
                </p>
              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={() => {
              setCallStarted(false);
              setSelectedClient(null);
              setSaved(false);
              setAnswers([]);
              setRecording(null);
              setCurrentSectionIndex(0);
              setOverallFeedback("");
              setConcerns("");
              setFollowUpRequired(false);
              setFollowUpNotes("");
            }}
            className="mt-6 rounded-xl bg-[#1392d3] px-6 py-3 text-sm font-semibold text-white"
          >
            Start Another Call
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     FINAL SUMMARY SCREEN
  ========================================================= */

  if (currentSectionIndex === totalSections) {
    return (
      <FinalCallScreen
        selectedClient={selectedClient!}
        overallFeedback={overallFeedback}
        setOverallFeedback={setOverallFeedback}
        concerns={concerns}
        setConcerns={setConcerns}
        followUpRequired={followUpRequired}
        setFollowUpRequired={setFollowUpRequired}
        followUpNotes={followUpNotes}
        setFollowUpNotes={setFollowUpNotes}
        recording={recording}
        recordingMessage={recordingMessage}
        finelScreenMessage={finelScreenMessage}
        onRecordingUpload={handleRecordingUpload}
        onBack={() =>
          setCurrentSectionIndex(totalSections - 1)
        }
        onSave={saveQualityCall}
      />
    );
  }

  /* =========================================================
     QUESTIONNAIRE
  ========================================================= */
const downloadPDF = async (client: any) => {
  try {
    setfinelScreenMessage(
      `Preparing ${client.name}'s PDF... Please wait.`
    );

    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    let y = 18;

    const addPageIfNeeded = (heightNeeded = 10) => {
      if (y + heightNeeded > pageHeight - 15) {
        doc.addPage();
        y = 18;
      }
    };

    // ==========================================
    // TITLE
    // ==========================================

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");

    doc.text(
      `${client.name} - Feedback`,
      margin,
      y
    );

    y += 10;

    // ==========================================
    // QUESTIONS + ANSWERS
    // ==========================================

    allSections.forEach((section) => {
      addPageIfNeeded(15);

      // Section title
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");

      const sectionTitle = doc.splitTextToSize(
        section.title,
        contentWidth
      );

      doc.text(
        sectionTitle,
        margin,
        y
      );

      y += sectionTitle.length * 6 + 5;

      // Questions
      section.questions.forEach((question, index) => {
        const answer =
          String(getAnswer(question.id) || "").trim() ||
          "No answer provided";

        // ==========================================
        // QUESTION
        // ==========================================

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        const questionNumber =
          question.number || `${index + 1}`;

        const questionText =
          `Q${questionNumber}. ${question.question}`;

        const questionLines =
          doc.splitTextToSize(
            questionText,
            contentWidth
          );

        addPageIfNeeded(
          questionLines.length * 5 + 8
        );

        doc.text(
          questionLines,
          margin,
          y
        );

        y += questionLines.length * 5 + 3;

        // ==========================================
        // ANSWER
        // ==========================================

        doc.setFont("helvetica", "normal");

        const answerLines =
          doc.splitTextToSize(
            `Answer: ${answer}`,
            contentWidth
          );

        addPageIfNeeded(
          answerLines.length * 5 + 8
        );

        doc.text(
          answerLines,
          margin,
          y
        );

        y += answerLines.length * 5 + 7;
      });

      y += 4;
    });

    // ==========================================
    // DOWNLOAD
    // ==========================================

    doc.save(
      `${client.name}_Feedback.pdf`
    );

    setfinelScreenMessage(
      `${client.name}'s PDF has been downloaded successfully.`
    );

    setTimeout(() => {
      setfinelScreenMessage("");
    }, 3000);

  } catch (error: any) {
    console.error(
      "Download PDF Error:",
      error
    );

    alert(
      error?.message ||
        "Failed to download feedback PDF."
    );
  }
};
  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="flex items-center gap-2">

            <button
  type="button"
  onClick={() => {setCallStarted(false),setSelectedClient(null)}}
   
  className="
    inline-flex items-center justify-center gap-2
    rounded-xl
    border border-slate-200
    bg-teal-800
    text-white
    px-4 py-2.5
    text-sm font-semibold
   cursor-pointer
    shadow-sm
    transition-all duration-200
    hover:border-slate-300
    hover:bg-slate-50
    hover:text-slate-800
    hover:shadow
    active:scale-[0.98]
    focus:outline-none
    focus:ring-2
    focus:ring-slate-300
    focus:ring-offset-2
  "
>
  <ArrowLeft
    size={17}
    strokeWidth={2.2}
    className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
  />

  <span>Back</span>
</button>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Quality Call
                </h2>

                <p className="text-sm text-slate-500">
                  {selectedClient?.name}
                  {" • "}
                  {selectedClient?.hcaName}
                </p>
              </div>

            </div>

          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2">

            <Clock3
              size={16}
              className="text-[#1392d3]"
            />

            <span className="text-sm font-medium text-slate-600">
              Section {currentSectionIndex + 1} of{" "}
              {totalSections}
            </span>

          </div>

        </div>

        {/* Progress */}
        <div className="mt-5">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-500">
              Overall Progress
            </span>

            <span className="text-xs font-bold text-[#1392d3]">
              {Math.round(progress)}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-[#1392d3] transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* Section Navigation */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

        <div className="flex min-w-max gap-2">

          {allSections.map((section, index) => {

            const isActive =
              currentSectionIndex === index;

            const isCompleted =
              currentSectionIndex > index;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() =>
                  setCurrentSectionIndex(index)
                }
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${isActive
                    ? "bg-[#1392d3] text-white"
                    : isCompleted
                      ? "bg-emerald-50 text-[#50c896]"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
              >

                {isCompleted ? (
                  <Check size={14} />
                ) : (
                  <span>
                    {index + 1}
                  </span>
                )}

                {section.title}

              </button>
            );
          })}

          <button
            type="button"
            onClick={() =>
              setCurrentSectionIndex(totalSections)
            }
            className="rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
          >
            Final Summary
          </button>

        </div>

      </div>

      {/* Current Section */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

       <div className="border-b border-slate-200 p-5">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

    {/* Section Title */}
      <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#1392d3]">
        Client Feedback
      </p>

      <h2 className="mt-1 break-words text-xl font-bold text-slate-800">
        {currentSection.title}
      </h2>
    </div>
  {finelScreenMessage && (
    <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700">
      <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
      <span>{finelScreenMessage}</span>
    </div>
  )}
  {/* PDF ONLY CONTENT */}

    {/* Download - Completed Only */}
    {selectedClient?.feedbackStatus === "Completed" && (
      <button
        type="button"
   onClick={()=>downloadPDF(selectedClient)}
        className="
          inline-flex min-h-[42px] shrink-0
          items-center justify-center gap-2
          rounded-xl
          border border-emerald-200
          bg-emerald-50
          px-4 py-2.5
          text-sm font-semibold
          text-[#50c896]
          transition-all duration-200
          hover:bg-emerald-100
          hover:border-emerald-300
          active:scale-[0.98]
          focus:outline-none cursor-pointer
          focus:ring-2
          focus:ring-emerald-200
          sm:w-auto
        "
      >
        <Download size={16} />
        <span>Download</span>
      </button>
    )}

  </div>
</div>

        <div
  className="space-y-6 p-5"
  id="DownloadPortion"
  style={{
    color: "#1e293b",
    backgroundColor: "#ffffff",
  }}
>
  {currentSection.questions.map((question) => {
    const answer = getAnswer(question.id);

    return (
      <React.Fragment key={question.id}>
        {question.subHeading && (
          <div className="pt-2">
            <h3
              className="text-base font-bold"
              style={{ color: "#1e293b" }}
            >
              {question.subHeading}
            </h3>
          </div>
        )}

        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: "#e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          <div className="flex gap-4">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
              style={{
                backgroundColor: "#1392d3",
                color: "#ffffff",
              }}
            >
              {question.number}
            </div>

            <div className="flex-1">
              <p
                className="text-sm font-semibold leading-6"
                style={{
                  color: "#1e293b",
                }}
              >
                {question.question}
              </p>

              <div className="mt-4">
                <textarea
                  value={answer}
                  onChange={(e) =>
                    updateAnswer(question.id, e.target.value)
                  }
                  rows={4}
                  placeholder="Enter the answer given during the call..."
                  className="w-full resize-none rounded-xl border p-4 text-sm outline-none transition"
                  style={{
                    borderColor: "#cbd5e1",
                    backgroundColor: "#ffffff",
                    color: "#334155",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#1392d3";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(19, 146, 211, 0.10)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#cbd5e1";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  })}
</div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-slate-200 p-5">

          <button
            type="button"
            disabled={currentSectionIndex === 0}
            onClick={() =>
              setCurrentSectionIndex(
                (previous) => previous - 1
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={17} />
            Previous
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrentSectionIndex(
                (previous) => previous + 1
              )
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#1392d3] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {currentSectionIndex ===
              totalSections - 1
              ? "Final Summary"
              : "Next"}

            <ArrowRight size={17} />
          </button>

        </div>

      </div>

    </div>
  );
};

/* =========================================================
   FINAL CALL SCREEN
========================================================= */

interface FinalCallScreenProps {
  selectedClient: Client;
  overallFeedback: string;
  setOverallFeedback: React.Dispatch<
    React.SetStateAction<string>
  >;
  concerns: string;
  setConcerns: React.Dispatch<
    React.SetStateAction<string>
  >;
  followUpRequired: boolean;
  setFollowUpRequired: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  followUpNotes: string;
  setFollowUpNotes: React.Dispatch<
    React.SetStateAction<string>
  >;
  recording: CallRecording | null;
  recordingMessage: string;
  finelScreenMessage: string;
  onRecordingUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onBack: () => void;
  onSave: () => void;
}

const FinalCallScreen: React.FC<
  FinalCallScreenProps
> = ({
  selectedClient,
  overallFeedback,
  setOverallFeedback,
  concerns,
  setConcerns,
  followUpRequired,
  setFollowUpRequired,
  followUpNotes,
  setFollowUpNotes,
  recording,
  recordingMessage,
  finelScreenMessage,
  onRecordingUpload,
  onBack,
  onSave,
}) => {
console.log("Check d---",selectedClient)
    return (
      <div className="space-y-6">

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex w-full flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
  
  {/* Left: Icon + Heading */}
  <div className="flex min-w-0 items-start gap-3">
    
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#50c896] sm:h-12 sm:w-12">
      <CheckCircle2 size={21} strokeWidth={2.2} />
    </div>

    <div className="min-w-0">
      <h2 className="break-words text-lg font-bold leading-tight text-slate-800 sm:text-xl">
        Quality Call Summary
      </h2>

      <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
        Complete the final details before saving the call.
      </p>
    </div>
  </div>

  {/* Right: Back Button */}
  <button
    type="button"
    onClick={onBack}
    className="
      inline-flex min-h-[44px] w-full shrink-0
      items-center justify-center gap-2
      rounded-xl
      border border-slate-200
      bg-white
      px-4 py-2.5
      text-sm font-semibold text-slate-600
      shadow-sm
      transition-all duration-200
      hover:border-slate-300
      hover:bg-slate-50
      hover:text-slate-800
      hover:shadow-md
      active:scale-[0.98]
      focus:outline-none
      focus:ring-2
      focus:ring-[#1392d3]/20
      sm:w-auto sm:px-5
    "
  >
    <ArrowLeft size={17} strokeWidth={2.2} />
    <span>Back to Questions</span>
  </button>

</div>

        </div>

        {/* Client */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-3">

            <InfoBox
              label="Client"
              value={selectedClient.name}
            />

            <InfoBox
              label="Assigned HCA"
              value={selectedClient.hcaName}
            />

            <InfoBox
              label="Call Date"
              value={new Date().toLocaleDateString("en-IN")}
            />

          </div>

        </div>

        {/* Overall Feedback */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <label className="text-sm font-bold text-slate-800">
            Overall Feedback
          </label>

          <p className="mt-1 text-xs text-slate-400">
            Add the overall outcome of the quality call.
          </p>

          <textarea
            value={overallFeedback}
            onChange={(e) =>
              setOverallFeedback(e.target.value)
            }
            rows={5}
            placeholder="Enter overall feedback..."
            className="mt-4 w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none focus:border-[#1392d3]"
          />

        </div>

        {/* Concerns */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <label className="text-sm font-bold text-slate-800">
            Concerns / Issues
          </label>

          <textarea
            value={concerns}
            onChange={(e) =>
              setConcerns(e.target.value)
            }
            rows={4}
            placeholder="Enter any concerns or issues..."
            className="mt-4 w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none focus:border-[#ff1493]"
          />

        </div>

        {/* Follow Up */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm font-bold text-slate-800">
            Follow-up Required?
          </p>

          <div className="mt-4 flex gap-3">

            <button
              type="button"
              onClick={() =>
                setFollowUpRequired(true)
              }
              className={`rounded-xl border px-6 py-3 text-sm font-semibold ${followUpRequired
                  ? "border-[#ff1493] bg-pink-50 text-[#ff1493]"
                  : "border-slate-200 text-slate-600"
                }`}
            >
              Yes
            </button>

            <button
              type="button"
              onClick={() =>
                setFollowUpRequired(false)
              }
              className={`rounded-xl border px-6 py-3 text-sm font-semibold ${!followUpRequired
                  ? "border-[#50c896] bg-emerald-50 text-[#50c896]"
                  : "border-slate-200 text-slate-600"
                }`}
            >
              No
            </button>

          </div>

          {followUpRequired && (
            <textarea
              value={followUpNotes}
              onChange={(e) =>
                setFollowUpNotes(e.target.value)
              }
              rows={4}
              placeholder="What follow-up is required?"
              className="mt-4 w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none focus:border-[#ff1493]"
            />
          )}

        </div>

        {/* Recording */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-4">

            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <FileAudio
                size={18}
                className="text-[#ff1493]"
              />
              Call Recording
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Upload the recording of the completed quality call.
            </p>

          </div>

          {!recording ? (
            <>
              <input
                type="file"
                id="call-recording"
                accept="audio/*"
                onChange={onRecordingUpload}
                className="hidden"
              />

              <label
                htmlFor="call-recording"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-[#ff1493] hover:bg-pink-50"
              >

                <div className="rounded-2xl bg-pink-50 p-4 text-[#ff1493]">
                  <Upload size={24} />
                </div>

                <p className="mt-3 font-semibold text-slate-700">
                  Upload Call Recording
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  MP3, WAV, M4A, WEBM
                </p>

              </label>
            </>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-white p-3 text-[#50c896]">
                  <FileAudio size={22} />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-semibold text-slate-800">
                    {recording.file?.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Recording attached
                  </p>

                </div>

                {recording.url && (
                  <a
                    href={recording.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white p-2 text-[#1392d3]"
                  >
                    <Play size={16} />
                  </a>
                )}

              </div>

            </div>
          )}
          {recordingMessage && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-pink-100 bg-pink-50 px-4 py-3 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-pink-500" />
              </div>

              <p className="text-sm font-medium leading-6 text-pink-700">
                {recordingMessage}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600"
          >
            <ArrowLeft size={17} />
            Back to Questions
          </button>
          {finelScreenMessage ? <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 shadow-sm">
            <p className="text-sm font-medium leading-6 text-blue-700">
              {finelScreenMessage}
            </p>
          </div> :
          <div>
          {selectedClient.feedbackStatus!=="Completed"&&
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#50c896] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              <Check size={18} />
              Save Quality Call
            </button>}
             </div>
          }
        </div>

      </div>
    );
  };

/* =========================================================
   INFO BOX
========================================================= */

interface InfoBoxProps {
  label: string;
  value: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  label,
  value,
}) => (
  <div className="rounded-xl bg-slate-50 p-4">

    <p className="text-xs text-slate-400">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-slate-800">
      {value}
    </p>

  </div>
);

export default ClientFeedback;