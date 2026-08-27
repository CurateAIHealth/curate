"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Clock3,
  CheckCircle2,
  FileText,
  Eye,
  UserCheck,
  UserRound,
  GraduationCap,
  HeartPulse,
  CalendarOff,
  UserX,
  Phone,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Upload,
  Save,
} from "lucide-react";
import { useSelector } from "react-redux";
import { GetClientId, GetClientName, GetHCPFullName } from "@/Lib/Actions";
import axios from "axios";
import { LoadingData } from "../Loading/page";

/* =========================================================
   TYPES
========================================================= */

type FeedbackStatus = "Pending" | "Completed";

type HCAStatus =
  | "Active"
  | "Bench"
  | "Training"
  | "Sick"
  | "Leave"
  | "Terminated";

type FeedbackRole =
  | "Role 1"
  | "Role 2"
  | "Role 3"
  | "Random HCA Call"
  | "Termination";

interface Question {
  id: string;
  question: string;
  type: "textarea" | "select";
  required?: boolean;
  options?: string[];
  subLabel?: string;
}

interface FeedbackSection {
  id: string;
  role: FeedbackRole;
  title: string;
  description: string;
  questions: Question[];
  visibleFor: HCAStatus[];
}

interface AudioRecording {
  url: string;
  duration?: number;
}

interface SavedFeedback {
  UserId: string;
  ClientId:any
  SectionId: string;
  Role: FeedbackRole;
  answers: Record<string, string>;
  recordings: Record<string, AudioRecording>;
  Recording: string | null;
  completedAt: string;
  Month: string;
  Type: string;
}

/* =========================================================
   STATUS CONFIG
========================================================= */

const statusConfig: Record<
  HCAStatus,
  {
    label: string;
    icon: React.ReactNode;
    activeClass: string;
    inactiveClass: string;
    badgeClass: string;
  }
> = {
  Active: {
    label: "Active",
    icon: <UserCheck size={17} />,
    activeClass: "bg-purple-600 text-white shadow-sm",
    inactiveClass:
      "border border-purple-200 bg-white text-purple-600 hover:bg-purple-50",
    badgeClass: "bg-purple-100 text-purple-700",
  },

  Bench: {
    label: "Bench",
    icon: <UserRound size={17} />,
    activeClass: "bg-orange-500 text-white shadow-sm",
    inactiveClass:
      "border border-orange-200 bg-white text-orange-600 hover:bg-orange-50",
    badgeClass: "bg-orange-100 text-orange-700",
  },

  Training: {
    label: "Training",
    icon: <GraduationCap size={17} />,
    activeClass: "bg-yellow-500 text-white shadow-sm",
    inactiveClass:
      "border border-yellow-200 bg-white text-yellow-700 hover:bg-yellow-50",
    badgeClass: "bg-yellow-100 text-yellow-700",
  },

  Sick: {
    label: "Sick",
    icon: <HeartPulse size={17} />,
    activeClass: "bg-blue-500 text-white shadow-sm",
    inactiveClass:
      "border border-blue-200 bg-white text-blue-600 hover:bg-blue-50",
    badgeClass: "bg-blue-100 text-blue-700",
  },

  Leave: {
    label: "Leave",
    icon: <CalendarOff size={17} />,
    activeClass: "bg-red-500 text-white shadow-sm",
    inactiveClass:
      "border border-red-200 bg-white text-red-600 hover:bg-red-50",
    badgeClass: "bg-red-100 text-red-700",
  },

  Terminated: {
    label: "Terminated",
    icon: <UserX size={17} />,
    activeClass: "bg-slate-700 text-white shadow-sm",
    inactiveClass:
      "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
    badgeClass: "bg-slate-100 text-slate-700",
  },
};

/* =========================================================
   ROLE 1
   24 HOURS ACTIVITY OF ONE PATIENT
   ACTIVE ONLY
========================================================= */

const role1Activities = [
  {
    time: "06:00 – 07:00",
    activity: "Morning Wake-up, Hygiene, Medication & Hydration",
  },
  {
    time: "07:00 – 08:00",
    activity: "Breakfast, Rest & Light Conversation",
  },
  {
    time: "08:00 – 09:00",
    activity: "Physical Therapy & Bathroom Care",
  },
  {
    time: "09:00 – 10:00",
    activity: "Engagement Activity & Hydration",
  },
  {
    time: "10:00 – 11:00",
    activity: "Bathing & Rest",
  },
  {
    time: "11:00 – 12:00",
    activity: "Midday Engagement",
  },
  {
    time: "12:00 – 13:00",
    activity: "Lunch & Bathroom Care",
  },
  {
    time: "13:00 – 14:00",
    activity: "Afternoon Nap",
  },
  {
    time: "14:00 – 15:00",
    activity: "Wake-up, Hydration & Medication",
  },
  {
    time: "15:00 – 16:00",
    activity: "Snack, Conversation & Cognitive Engagement",
  },
  {
    time: "16:00 – 17:00",
    activity: "Bathroom Care & Physical Therapy",
  },
  {
    time: "17:00 – 18:00",
    activity: "Evening Rest & Dinner",
  },
  {
    time: "18:00 – 19:00",
    activity: "Hydration & Evening Engagement",
  },
  {
    time: "19:00 – 20:00",
    activity: "Bathroom Care, Medication & Relaxation",
  },
  {
    time: "20:00 – 21:00",
    activity: "Bedtime Hygiene",
  },
  {
    time: "21:00 – 22:00",
    activity: "Night Rest & Monitoring",
  },
  {
    time: "22:00 – 23:00",
    activity: "Night Rest & Monitoring",
  },
  {
    time: "23:00 – 00:00",
    activity: "Overnight Monitoring",
  },
  {
    time: "00:00 – 01:00",
    activity: "Overnight Monitoring",
  },
  {
    time: "01:00 – 02:00",
    activity: "Overnight Monitoring",
  },
  {
    time: "02:00 – 03:00",
    activity: "Overnight Monitoring",
  },
  {
    time: "03:00 – 04:00",
    activity: "Overnight Monitoring",
  },
  {
    time: "04:00 – 05:00",
    activity: "Overnight Monitoring",
  },
  {
    time: "05:00 – 06:00",
    activity: "Overnight Monitoring & Morning Preparation",
  },
];

/* =========================================================
   ROLE 2
   FAMILY BACKGROUND ANALYSIS & JOB NEED
   ALL STATUS
========================================================= */

const role2Groups = [
  {
    id: "stability",
    title:
      "1. Understand stability, family support, and possible conflicts with work schedule.",
    questions: [
      "Can you tell me about your family (parents, spouse, children, dependents)?",
      "Who do you live with right now?",
      "Are there any family members who depend on you financially or for care?",
      "Does your family happy about your working in Hyderabad, and who will take care of your family in your absence?",
    ],
  },

  {
    id: "income",
    title:
      "2. Assess if the person needs the job and income, which can affect retention.",
    questions: [
      "What are your main sources of income at home?",
      "What are your main monthly expenses or financial responsibilities?",
      "If you did not get this job, how would you manage your finances?",
      "Are you currently supporting anyone’s education, healthcare, or debts?",
    ],
  },

  {
    id: "passion",
    title:
      "3. Identify genuine passion vs. “just a job” mindset.",
    questions: [
      "Why did you choose to apply for a caregiving role?",
      "Have you cared for elderly or dependent people before? Tell me about your experience.",
      "What do you enjoy most about this type of work?",
      "What challenges do you find most difficult in caregiving?",
    ],
  },

  {
    id: "retention",
    title:
      "4. Clarify how long they realistically plan to stay.",
    questions: [
      "How long do you see yourself working in this position?",
      "Do you see caregiving as a long-term career or a temporary step?",
      "Where do you see yourself in 2–3 years?",
      "If we offered training for skill development, would you stay longer?",
    ],
  },

  {
    id: "job-demands",
    title:
      "5. Check willingness to meet the job’s demands.",
    questions: [
      "Are you comfortable working 24-hour shifts / live-in arrangements?",
      "Did company tell you about holidays if required and the leave/permanent employee arrangements?",
      "Do you have any commitments that might require frequent leave?",
    ],
  },

  {
    id: "own-decision",
    title:
      "6. Ensure the decision to work here is their own.",
    questions: [
      "Who encouraged you to apply for this job?",
      "Did anyone pressure or force you to take this role?",
      "Is this job your personal choice, or mainly for family reasons?",
    ],
  },

  {
    id: "short-term",
    title:
      "7. Spot early signs of short-term mindset.",
    questions: [
      "What would make you leave this job early?",
      "What keeps you happy in a workplace?",
      "Have you left any job suddenly before? Why?",
      "If there is a conflict at work, how do you handle it?",
    ],
  },
];

/* =========================================================
   ROLE 3
   WELFARE PARAMETERS
   ACTIVE ONLY
========================================================= */

const role3Questions = [
  {
    id: "food-water",
    parameter: "Food & Water Quality",
    question:
      "Is the food quantity, taste, and timing satisfactory? Is clean water always available?",
  },
  {
    id: "sleeping",
    parameter: "Sleeping Arrangements",
    question:
      "Do you have a proper, safe, and private place to sleep?",
  },
  {
    id: "bathroom",
    parameter: "Bathroom & Hygiene Access",
    question:
      "Is there a clean bathroom with necessary facilities available for your use?",
  },
  {
    id: "rest-breaks",
    parameter: "Rest & Breaks",
    question:
      "Do you get enough rest and breaks during your 24-hour duty?",
  },
  {
    id: "domestic-work",
    parameter: "Domestic Work Boundaries",
    question:
      "Are you asked to do work unrelated to caregiving duties?",
  },
  {
    id: "physical-safety",
    parameter: "Physical Safety",
    question:
      "Do you feel physically safe in the client's home?",
  },
  {
    id: "harassment",
    parameter: "Harassment & Misconduct",
    question:
      "Have you faced any verbal, physical, or emotional harassment?",
  },
  {
    id: "reporting",
    parameter: "Reporting & Response",
    question:
      "Do you know how to report problems and does the company respond quickly?",
  },
  {
    id: "privacy",
    parameter: "Personal Space & Privacy",
    question:
      "Do you have personal space for rest and private phone calls?",
  },
  {
    id: "respect",
    parameter: "Respect from Client's Family",
    question:
      "Are you treated with respect by the client’s family?",
  },
  {
    id: "training",
    parameter: "Training & Support",
    question:
      "Have you received enough training and feel supported by your supervisor?",
  },
];

/* =========================================================
   RANDOM HCA CALL
   ACTIVE ONLY
========================================================= */

const randomCallGroups = [
  {
    id: "general-wellbeing",
    title: "A. General Wellbeing",
    questions: [
      "How are you feeling about the work and the current placement?",
      "Are you comfortable working with this patient and family?",
      "How are things going at the client's home overall?",
      "Do you feel comfortable continuing with this patient?",
      "Is there anything about the current placement that is making you uncomfortable?",
    ],
  },

  {
    id: "patient-family",
    title: "B. Patient & Family",
    questions: [
      "How is your relationship with the patient?",
      "How is the family treating you on a day-to-day basis?",
      "Do you feel the family respects you and your caregiving role?",
      "Are you being asked to do any work apart from your caregiving responsibilities?",
      "Is the family giving you enough time to eat, rest, bathe and take care of yourself?",
      "Do you feel the family is helping you when the patient's condition becomes difficult?",
      "Is there any behaviour from the patient or family that is difficult for you to manage?",
    ],
  },

  {
    id: "workload-rest",
    title: "C. Workload & Rest",
    questions: [
      "Are you getting enough sleep during your 24-hour duty?",
      "Are you getting proper breaks during the day?",
      "Are there any patient-care activities that you find physically or mentally difficult?",
      "Is there anything about the patient's current condition that you are struggling to manage?",
      "Do you feel the workload is reasonable for one caregiver?",
    ],
  },

  {
    id: "operations-support",
    title: "D. Operations Support",
    questions: [
      "When you have a problem at the client's home, are you able to reach our operations team?",
      "When you call or message the team, do they respond on time?",
      "When you have raised a concern, has the team actually helped you solve it?",
      "Is there any concern you reported to our team that is still not resolved?",
      "Do you feel supported by the company when you are facing a difficult situation?",
    ],
  },

  {
    id: "salary-benefits",
    title: "E. Salary & Benefits — Ask Indirectly",
    questions: [
      "Are you satisfied with your current salary compared with the work and responsibility you are handling?",
      "Do you feel the salary is fair for the patient's care requirements and duty hours?",
      "Is there anything about salary, incentives, leave, travel, or other benefits that you would like us to improve?",
      "If we could improve something about your current employment, what would be most important to you?",
    ],
  },
];

/* =========================================================
   TERMINATION
   TERMINATED ONLY

   Mandatory questions are deliberately LAST.
========================================================= */

const terminationQuestions = [
  {
    id: "patient-reason",
    question:
      "Patient reason — Patient difficult / dementia / night duty / personal care",
  },
  {
    id: "client-family",
    question:
      "Client family — Domestic work / disrespect / excessive monitoring / communication",
  },
  {
    id: "salary",
    question:
      "Salary — Low salary / another company paying more",
  },
  {
    id: "operations",
    question:
      "Operations — Calls not answered / complaint not resolved / no support",
  },
  {
    id: "leave",
    question:
      "Leave — Family emergency / long leave / leave not approved",
  },
  {
    id: "studies",
    question:
      "Studies — Genuine education requirement",
  },
  {
    id: "marriage",
    question:
      "Marriage — Genuine marriage/family reason",
  },
  {
    id: "health-personal",
    question:
      "Health/personal — Personal circumstances",
  },
  {
    id: "location",
    question:
      "Location — Wants job near hometown",
  },
  {
    id: "accommodation-food",
    question:
      "Accommodation/food — Food / bathroom / sleeping / privacy",
  },
  {
    id: "workload",
    question:
      "Workload — 24-hour duty / insufficient sleep / patient dependency",
  },
  {
    id: "other-job",
    question:
      "Other job — Better opportunity",
  },
  {
    id: "patient-no-longer-needs-care",
    question:
      "Patient no longer needs care — Service completed",
  },
  {
    id: "other",
    question:
      "Other — Specify exact reason",
  },

  /* ==============================
     MANDATORY - ALWAYS LAST
  ============================== */

  {
    id: "actual-reason",
    question: "Actual reason identified",
    mandatory: true,
  },
  {
    id: "secondary-reason",
    question: "Secondary reason",
    mandatory: true,
  },
  {
    id: "reason-resolved",
    question: "Can the reason be resolved?",
    mandatory: true,
    options: ["Yes", "No", "Maybe"],
  },
  {
    id: "hca-continue",
    question: "If resolved, will HCA continue?",
    mandatory: true,
    options: ["Yes", "No", "Maybe"],
  },
];

/* =========================================================
   BUILD FEEDBACK SECTIONS
========================================================= */

const feedbackSections: FeedbackSection[] = [
  /* =======================================================
     ROLE 1
  ======================================================= */

  {
    id: "role-1-24-hours",
    role: "Role 1",
    title: "Role 1 — 24hrs Activity of One Patient",
    description:
      "Record the HCA's activity for the 24-hour patient-care schedule.",
    visibleFor: ["Active"],

    questions: role1Activities.map(
      (activity, index) => ({
        id: `role1-${index + 1}`,
question:
  `${activity.time} — ${activity.activity}\n\nRecord the actual activity / observation.`,
        type: "textarea" as const,
        required: true,
      })
    ),
  },

  /* =======================================================
     ROLE 2
  ======================================================= */
...role2Groups.map(
  (group): FeedbackSection => ({
    id: `role-2-${group.id}`,

    role: "Role 2",

    title: group.title,

    description:
      "Family Background Analysis and job need.",

    // ROLE 2 → ALL STATUS EXCEPT TERMINATED
    visibleFor: [
      "Active",
      "Bench",
      "Training",
      "Sick",
      "Leave",
    ],

    questions: group.questions.map(
      (question, index) => ({
        id: `role2-${group.id}-${index + 1}`,

        question,

        type: "textarea" as const,

        required: true,

        subLabel:
          String.fromCharCode(65 + index),
      })
    ),
  })
),

  /* =======================================================
     ROLE 3
  ======================================================= */

  {
    id: "role-3-welfare",
    role: "Role 3",
    title:
      "Role 3 — Welfare Parameters Analysis at Client Place",
    description:
      "Analyze welfare, safety, rest, privacy and support at the client's place.",
    visibleFor: ["Active"],

    questions: role3Questions.map(
      (item, index) => ({
        id: `role3-${item.id}`,
        question:
          `${index + 1}. ${item.parameter}\n\n${item.question}`,
        type: "textarea" as const,
        required: true,
      })
    ),
  },

  /* =======================================================
     RANDOM HCA CALL
  ======================================================= */

  ...randomCallGroups.map(
    (group): FeedbackSection => ({
      id: `random-call-${group.id}`,
      role: "Random HCA Call",
      title: `Random HCA Call — ${group.title}`,
      description:
        "Random HCA call for placement, wellbeing and retention monitoring.",
      visibleFor: ["Active"],

      questions: group.questions.map(
        (question, index) => ({
          id: `random-${group.id}-${index + 1}`,
          question,
          type: "textarea" as const,
          required: true,
        })
      ),
    })
  ),

  /* =======================================================
     TERMINATION
  ======================================================= */

  {
    id: "termination",
    role: "Termination",
    title: "Termination",
    description:
      "Identify and document the reason for termination.",

    visibleFor: ["Terminated"],

    questions: terminationQuestions.map(
      (item, index) => ({
        id: `termination-${item.id}`,

        question: item.mandatory
          ? `MANDATORY — ${item.question}`
          : item.question,

        type: item.options
          ? ("select" as const)
          : ("textarea" as const),

        required: true,

        options: item.options,

        subLabel: item.mandatory
          ? undefined
          : `${index + 1}`,
      })
    ),
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

const HCAFeedback: React.FC = () => {
  const users = useSelector(
    (state: any) => state.AdminUsers
  );

  const UserFullInfo = useSelector(
    (state: any) => state.AdminFullInfo
  );

  const [isChecking, setIsChecking] =
    useState(true);
const [qualityStatus, setQualityStatus] =
  useState<Record<string, any>>({});
  const [ImportedData, setImportedData] =
    useState<any[]>([]);

  const [feedbackFilter, setFeedbackFilter] =
    useState<FeedbackStatus>("Pending");

  const [statusFilter, setStatusFilter] =
    useState<HCAStatus>("Active");

  const [search, setSearch] =
    useState("");

  const [selectedHCA, setSelectedHCA] =
    useState<any | null>(null);

  const [selectedSections, setSelectedSections] =
    useState<FeedbackSection[]>([]);

  const [feedbackMode, setFeedbackMode] =
    useState<"create" | "view" | null>(null);

  /*
   * Local state is only used for immediate UI refresh.
   * MongoDB remains the source of truth.
   */
  const [savedFeedback, setSavedFeedback] =
    useState<
      Record<string, SavedFeedback>
    >({});
const currentDate = new Date();

const [selectedMonth, setSelectedMonth] =
  useState<number>(currentDate.getMonth() + 1);

const [selectedYear, setSelectedYear] =
  useState<number>(currentDate.getFullYear());
  /* =======================================================
     HCA DATA
  ======================================================= */
console.log("Check selectedHCA------",)
  const hcaData = useMemo(() => {
    return Array.isArray(users)
      ? users.filter(
          (each: any) =>
            each?.userType ===
            "healthcare-assistant"
        )
      : [];
  }, [users]);

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const yearOptions = useMemo(() => {
  const currentYear = new Date().getFullYear();

  const startYear = 2020;
  const endYear = currentYear + 1;

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => endYear - index
  );
}, []);

useEffect(() => {
  if (!hcaData.length) return;

  const FetchQualityStatus = async () => {
    try {
      const results = await Promise.all(
        hcaData.map(async (hca: any) => {
          const userId = String(
            hca?.userId ||
            hca?._id ||
            hca?.id ||
            ""
          );

          if (!userId) {
            return null;
          }

          try {
            const response = await axios.post(
              "/api/GetQualityStatus",
              {
                UserId: userId,
              }
            );

            console.log(
              "check Task Response------",
              response
            );

            return {
              userId,
              status: response?.data,
            };

          } catch (error) {
            console.error(
              `Quality status failed for ${userId}`,
              error
            );

            return null;
          }
        })
      );

      // IMPORTANT: This runs AFTER Promise.all completes
      console.log(
        "========== ALL QUALITY RESULTS =========="
      );

      console.log(
        "check Task Results------",
        results
      );

      const statusMap: Record<
        string,
        any
      > = {};

      results.forEach((item) => {
        if (!item?.userId) return;

        statusMap[item.userId] =
          item.status;
      });

      console.log(
        "========== QUALITY STATUS MAP =========="
      );

      console.log(
        "statusMap------",
        statusMap
      );

      setQualityStatus(statusMap);

    } catch (error) {
      console.error(
        "FetchQualityStatus failed:",
        error
      );
    }
  };

  FetchQualityStatus();

}, [hcaData]);

console.log ("Find-----",qualityStatus)
  /* =======================================================
     FETCH QUALITY DATA
  ======================================================= */

  useEffect(() => {
    const FetchData = async () => {
      try {
        setIsChecking(true);

        const response = await axios.get(
          "/api/GetQualityData"
        );

        const data =
          response?.data?.data.data;

        setImportedData(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "GetQualityData failed:",
          error
        );

        setImportedData([]);
      } finally {
        setIsChecking(false);
      }
    };

    FetchData();
  }, []);

  /* =======================================================
     CURRENT MONTH
  ======================================================= */



  /* =======================================================
     USER ID
  ======================================================= */

  const getUserId = (item: any) => {
    return String(
      item?.userId ||
        item?._id ||
        item?.id ||
        ""
    );
  };

  /* =======================================================
     COMPLETED SECTION IDS
  ======================================================= */

const getCompletedSectionIds = (
  userId: string
): string[] => {

  const normalizedUserId =
    String(userId);

  const quality =
    qualityStatus?.[normalizedUserId];

  if (!quality) {
    return [];
  }

  const selectedMonthValue =
    `${selectedMonth}-${selectedYear}`;

  /*
   * IMPORTANT:
   * Use the records belonging to this
   * particular HCA from qualityStatus.
   */
  const records = Array.isArray(
    quality?.records
  )
    ? quality.records
    : [];

  /*
   * Records for selected Month/Year only.
   */
  const monthlyRecords =
    records.filter(
      (item: any) =>
        String(item?.Month) ===
        selectedMonthValue
    );

  const completedIds: string[] = [];

  /*
   * =====================================================
   * FAMILY BACKGROUND
   *
   * LIFETIME
   *
   * Month is intentionally NOT checked.
   * =====================================================
   */

  const familyBackgroundCompleted =
    records.some(
      (item: any) => {

        if (
          item?.Role !== "Role 2"
        ) {
          return false;
        }

        const answers =
          item?.answers;

        if (
          !answers ||
          typeof answers !== "object"
        ) {
          return false;
        }

        return Object.keys(
          answers
        ).some(
          (key) =>
            key.startsWith(
              "role2-stability-"
            ) &&
            String(
              answers[key] || ""
            ).trim()
        );
      }
    );

  if (
    familyBackgroundCompleted
  ) {
    completedIds.push(
      "role-2-stability"
    );
  }

  /*
   * =====================================================
   * ROLE 1
   *
   * MONTHLY
   * =====================================================
   */

  const role1Completed =
    monthlyRecords.some(
      (item: any) =>
        item?.Role === "Role 1" &&
        item?.SectionId ===
          "role-1-24-hours"
    );

  if (role1Completed) {
    completedIds.push(
      "role-1-24-hours"
    );
  }

  /*
   * =====================================================
   * ROLE 2
   *
   * FAMILY BACKGROUND = LIFETIME
   * OTHER ROLE 2 QUESTIONS = MONTHLY
   * =====================================================
   */

  const role2MonthlyCompleted =
    monthlyRecords.some(
      (item: any) =>
        item?.Role === "Role 2"
    );

  if (
    role2MonthlyCompleted
  ) {
    feedbackSections
      .filter(
        (section) =>
          section.role ===
            "Role 2" &&
          section.id !==
            "role-2-stability"
      )
      .forEach(
        (section) => {
          completedIds.push(
            section.id
          );
        }
      );
  }

  /*
   * =====================================================
   * ROLE 3
   *
   * MONTHLY
   * =====================================================
   */

  const role3Completed =
    monthlyRecords.some(
      (item: any) =>
        item?.Role === "Role 3" &&
        item?.SectionId ===
          "role-3-welfare"
    );

  if (role3Completed) {
    completedIds.push(
      "role-3-welfare"
    );
  }

  /*
   * =====================================================
   * RANDOM HCA CALL
   *
   * MONTHLY
   * =====================================================
   */

  const randomCallCompleted =
    monthlyRecords.some(
      (item: any) =>
        item?.Role ===
        "Random HCA Call"
    );

  if (
    randomCallCompleted
  ) {
    feedbackSections
      .filter(
        (section) =>
          section.role ===
          "Random HCA Call"
      )
      .forEach(
        (section) => {
          completedIds.push(
            section.id
          );
        }
      );
  }

  /*
   * =====================================================
   * TERMINATION
   *
   * MONTHLY
   * =====================================================
   */

  const terminationCompleted =
    monthlyRecords.some(
      (item: any) =>
        item?.Role ===
          "Termination" ||
        item?.SectionId ===
          "termination"
    );

  if (
    terminationCompleted
  ) {
    completedIds.push(
      "termination"
    );
  }

  return Array.from(
    new Set(completedIds)
  );
};
  /* =======================================================
     AVAILABLE SECTIONS
  ======================================================= */

  const getAvailableSections = (
    item: any
  ): FeedbackSection[] => {
    const userId =
      getUserId(item);

    const status =
      item?.CurrentStatus as HCAStatus;

    const completedIds =
      getCompletedSectionIds(
        userId
      );

    return feedbackSections.filter(
      (section) =>
        section.visibleFor.includes(
          status
        ) &&
        !completedIds.includes(
          section.id
        )
    );
  };

  /* =======================================================
     COMPLETED SECTION COUNT
  ======================================================= */
const hasSavedFeedback = (item: any): boolean => {
  
  const completedSections =
    getCompletedSectionIds(getUserId(item));
console.log ("Check for UserId-------",getUserId(item))
  return completedSections.length > 0;
};
  const getCompletedSectionsCount = (
    item: any
  ) => {
    const status =
      item?.CurrentStatus as HCAStatus;

    const applicableSections =
      feedbackSections.filter(
        (section) =>
          section.visibleFor.includes(
            status
          )
      );

    const completedIds =
      getCompletedSectionIds(
        getUserId(item)
      );
console.log ('Found-----',completedIds)
    return applicableSections.filter(
      (section) =>
        completedIds.includes(
          section.id
        )
    ).length;
  };

  /* =======================================================
     STATUS COUNT
  ======================================================= */

  const getStatusCount = (
    status: HCAStatus
  ) => {
    return hcaData.filter(
      (item: any) =>
        item?.CurrentStatus === status
    ).length;
  };

  const totalHCACount =
    hcaData.length;

  /* =======================================================
     PENDING / COMPLETED
     
     An HCA is Pending if at least one
     applicable section remains.
  ======================================================= */

  const getHCAFeedbackStatus = (
    item: any
  ): FeedbackStatus => {
    const available =
      getAvailableSections(item);
console.log ("Check Current Issue-----",available)
    return available.length > 0
      ? "Pending"
      : "Completed";
  };

 const pendingCount = hcaData.filter(
  (item: any) =>
    item?.CurrentStatus === statusFilter &&
    getHCAFeedbackStatus(item) === "Pending"
).length;

const completedCount = hcaData.filter(
  (item: any) =>
    item?.CurrentStatus === statusFilter &&
    getHCAFeedbackStatus(item) === "Completed"
).length;

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredHCAData =
    useMemo(() => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      return hcaData.filter(
        (item: any) => {
          const fullName = `
            ${item?.HCPFirstName || ""}
            ${item?.HCPSurName || ""}
            ${item?.LastName || ""}
          `
            .toLowerCase()
            .trim();

          const matchesSearch =
            !searchText ||
            fullName.includes(
              searchText
            ) ||
            String(
              item?.CurrentAddress ||
                ""
            )
              .toLowerCase()
              .includes(
                searchText
              ) ||
            String(
              item?.PermanentState ||
                ""
            )
              .toLowerCase()
              .includes(
                searchText
              ) ||
            String(
              item?.HCPContactNumber ||
                item?.ContactNumber ||
                ""
            )
              .toLowerCase()
              .includes(
                searchText
              ) ||
            String(
              item?.CurrentStatus ||
                ""
            )
              .toLowerCase()
              .includes(
                searchText
              );

          const matchesHCAStatus =
            item?.CurrentStatus ===
            statusFilter;

          const feedbackStatus =
            getHCAFeedbackStatus(
              item
            );

          const matchesFeedbackStatus =
            feedbackStatus ===
            feedbackFilter;

          return (
            matchesSearch &&
            matchesHCAStatus &&
            matchesFeedbackStatus
          );
        }
      );
    }, [
   hcaData,
  search,
  statusFilter,
  feedbackFilter,
  qualityStatus,
  selectedMonth,
  selectedYear,
  savedFeedback,
    ]);

  /* =======================================================
     START FEEDBACK
  ======================================================= */

  const handleStartFeedback = (
    item: any
  ) => {
    const sections =
      getAvailableSections(item);

    if (
      sections.length === 0
    ) {
      alert(
        "All applicable feedback has already been completed for this month."
      );
      return;
    }

    setSelectedHCA(item);

    setSelectedSections(
      sections
    );

    setFeedbackMode(
      "create"
    );
  };

  /* =======================================================
     VIEW FEEDBACK
  ======================================================= */

 const handleViewFeedback = (item: any) => {
  const userId = getUserId(item);
console.log("Next Step----",userId)
  const status = item?.CurrentStatus as HCAStatus;

  const applicable = feedbackSections.filter(
    (section) =>
      section.visibleFor.includes(status)
  );

  const userQualityStatus = qualityStatus?.[userId];

  
  setSelectedHCA(item);

  setSelectedSections(applicable);

  setFeedbackMode("view");
};

  /* =======================================================
     CLOSE
  ======================================================= */

  const closeFeedback = () => {
    setSelectedHCA(null);

    setSelectedSections([]);

    setFeedbackMode(null);
  };

  /* =======================================================
     FEEDBACK SCREEN
  ======================================================= */

  if (
    selectedHCA &&
    feedbackMode
  ) {
    return (
  <FeedbackScreen
  hca={selectedHCA}
  mode={feedbackMode}
  sections={selectedSections}
  selectedMonth={selectedMonth}
  selectedYear={selectedYear}
existingFeedback={
  feedbackMode === "view"
    ? qualityStatus?.[
        getUserId(selectedHCA)
      ]
    : undefined
}
  onBack={closeFeedback}
        onSave={(
          feedback
        ) => {
          setSavedFeedback(
            (previous) => ({
              ...previous,
              [`${feedback.UserId}-${feedback.SectionId}`]:
                feedback,
            })
          );

          /*
           * Remove completed section
           * immediately from current screen.
           */
     setSelectedSections((previous) => {
  if (feedback.Role === "Role 2") {
    return previous.filter(
      (section) => section.role !== "Role 2"
    );
  }

  if (feedback.Role === "Random HCA Call") {
    return previous.filter(
      (section) =>
        section.role !== "Random HCA Call"
    );
  }

  return previous.filter(
    (section) =>
      section.id !== feedback.SectionId
  );
});

          /*
           * If other sections remain,
           * stay on the feedback screen.
           */
          setFeedbackMode(
            "create"
          );

          /*
           * If all sections are complete,
           * return to list.
           */
         setTimeout(() => {
  setSelectedSections((current) => {
    if (current.length === 0) {
      closeFeedback();
    }

    return current;
  });
}, 100);
        }}
      />
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (isChecking) {
    return <LoadingData />;
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="space-y-6">

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <SummaryCard
          title="Total HCP"
          value={
            totalHCACount
          }
          color="#1392d3"
        />

        <SummaryCard
          title="Pending Feedback"
          value={
            pendingCount
          }
          color="#ff1493"
        />

        <SummaryCard
          title="Completed Feedback"
          value={
            completedCount
          }
          color="#50c896"
        />

        <SummaryCard
          title="Active HCA"
          value={
            getStatusCount(
              "Active"
            )
          }
          color="#9333ea"
        />

      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* ===================================================
            HEADER
        =================================================== */}

       <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
  {/* =====================================================
      HEADER
  ===================================================== */}
  <div className="px-4 py-4 sm:px-5">

    {/* TITLE */}
    {/* <div className="mb-4">
      <h2 className="text-lg font-bold leading-tight text-slate-800">
        HCA Feedback
      </h2>

      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
        Placement and monthly feedback tracking
      </p>
    </div> */}

    {/* =================================================
        FILTERS
    ================================================= */}
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

      {/* =================================================
          FEEDBACK STATUS
      ================================================= */}
      <div className="min-w-0">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Feedback Status
        </p>

        <div className="grid grid-cols-2 gap-2">

          {/* Pending */}
          <button
            type="button"
            onClick={() => setFeedbackFilter("Pending")}
            className={`
              flex h-10 min-w-0 items-center justify-between
              rounded-xl border px-3
              text-xs font-semibold
              transition-all duration-200
              sm:text-sm
              ${
                feedbackFilter === "Pending"
                  ? "border-[#f2c94c] bg-[#fff8dc] text-[#b7791f]"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#f2c94c]"
              }
            `}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <Clock3
                size={14}
                className="shrink-0 text-[#b7791f]"
              />
              <span className="truncate">Pending</span>
            </span>

            <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#fff1b8] px-1.5 text-[10px] font-bold text-[#b7791f]">
              {pendingCount}
            </span>
          </button>

          {/* Completed */}
          <button
            type="button"
            onClick={() => setFeedbackFilter("Completed")}
            className={`
              flex h-10 min-w-0 items-center justify-between
              rounded-xl border px-3
              text-xs font-semibold
              transition-all duration-200
              sm:text-sm
              ${
                feedbackFilter === "Completed"
                  ? "border-[#50c896] bg-[#eafaf4] text-[#278f69]"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#50c896]"
              }
            `}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <CheckCircle2
                size={14}
                className="shrink-0 text-[#278f69]"
              />
              <span className="truncate">Completed</span>
            </span>

            <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#d9f5e9] px-1.5 text-[10px] font-bold text-[#278f69]">
              {completedCount}
            </span>
          </button>

        </div>
      </div>

      {/* =================================================
          FEEDBACK MONTH
      ================================================= */}
      <div className="min-w-0">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Feedback Month
        </p>

        <div className="grid grid-cols-2 gap-2">

          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(Number(e.target.value))
            }
            className="
              h-10 w-full min-w-0
              rounded-xl
              border border-slate-200
              bg-white
              px-3
              text-xs font-semibold text-slate-700
              outline-none
              focus:border-[#1392d3]
              focus:ring-2 focus:ring-[#1392d3]/10
              sm:text-sm
            "
          >
            {monthOptions.map((month) => (
              <option
                key={month.value}
                value={month.value}
              >
                {month.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(Number(e.target.value))
            }
            className="
              h-10 w-full min-w-0
              rounded-xl
              border border-slate-200
              bg-white
              px-3
              text-xs font-semibold text-slate-700
              outline-none
              focus:border-[#1392d3]
              focus:ring-2 focus:ring-[#1392d3]/10
              sm:text-sm
            "
          >
            {yearOptions.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* =================================================
          HCA STATUS
      ================================================= */}
      <div className="min-w-0">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          HCA Status
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

          {(Object.keys(statusConfig) as HCAStatus[]).map(
            (status) => {
              const config = statusConfig[status];
              const count = getStatusCount(status);
              const selected = statusFilter === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`
                    flex h-10 min-w-0
                    items-center justify-between
                    gap-1
                    rounded-xl
                    border
                    px-2.5
                    text-[11px]
                    font-semibold
                    transition-all duration-200
                    sm:px-3
                    sm:text-xs
                    ${
                      selected
                        ? config.activeClass
                        : config.inactiveClass
                    }
                  `}
                >
                  <span className="flex min-w-0 items-center gap-1">
                    <span className="shrink-0">
                      {config.icon}
                    </span>

                    <span className="truncate">
                      {config.label}
                    </span>
                  </span>

                  <span
                    className={`
                      flex h-5 min-w-5 shrink-0
                      items-center justify-center
                      rounded-full
                      px-1
                      text-[9px]
                      font-bold
                      ${
                        selected
                          ? "bg-white/20 text-white"
                          : config.badgeClass
                      }
                    `}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}

        </div>
      </div>

    </div>
  </div>
</div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="overflow-x-auto">

         <HCATable
  data={filteredHCAData}
  RequiredFilterData={ImportedData}
  UserFullInfo={UserFullInfo}
  onStartFeedback={handleStartFeedback}
  onViewFeedback={handleViewFeedback}
  getFeedbackStatus={getHCAFeedbackStatus}
  getAvailableSections={getAvailableSections}
  getCompletedSectionsCount={getCompletedSectionsCount}
  hasSavedFeedback={hasSavedFeedback}
/>

        </div>

      </div>
    </div>
  );
};

/* =========================================================
   HCA TABLE
========================================================= */

interface HCATableProps {
  data: any[];
  RequiredFilterData: any[];
  UserFullInfo: any[];

  onStartFeedback: (item: any) => void;

  onViewFeedback: (item: any) => void;

  getFeedbackStatus: (
    item: any
  ) => FeedbackStatus;

  getAvailableSections: (
    item: any
  ) => FeedbackSection[];

  getCompletedSectionsCount: (
    item: any
  ) => number;

  hasSavedFeedback: (
    item: any
  ) => boolean;
}

const HCATable: React.FC<HCATableProps> = ({
  data,
  UserFullInfo,
  onStartFeedback,
  onViewFeedback,
  getFeedbackStatus,
  getAvailableSections,
  getCompletedSectionsCount,
  hasSavedFeedback,
}) => {
  const DeploymentInfo=useSelector((state:any)=>state.AdminDeployment)
    const users = useSelector(
    (state: any) => state.AdminUsers
  );
  return (
   <table className="w-full min-w-[1250px] table-fixed">

      <thead>
        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

          <th className="px-5 py-4">
            S.No
          </th>

          <th className="px-5 py-4">
            HCA Name
          </th>

          <th className="px-5 py-4">
           Client Name
          </th>

          <th className="px-5 py-4">
            Contact
          </th>

          <th className="px-5 py-4">
            State
          </th>

          <th className="px-5 py-4">
            Experience
          </th>

          <th className="px-5 py-4">
            Completed
          </th>

          <th className="px-5 py-4">
            Feedback
          </th>

        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">

        {data.length > 0 ? (
          data.map(
            (
              item,
              index
            ) => {
console.log(
"Check Current Information-----",item
)
              const status =
                item?.CurrentStatus as HCAStatus;

              const config =
                statusConfig[
                  status
                ];
const hasPreviousFeedback =
  hasSavedFeedback(item);

const availableSections =
  getAvailableSections(item);

const hasAvailableFeedback =
  availableSections.length > 0;
const ClientId=GetClientId(DeploymentInfo,item?.userId)
const feedbackStatus =
  getFeedbackStatus(item);
const applicableCount =
  feedbackSections.filter(
    (section) =>
      section.visibleFor.includes(status)
  ).length;
const completedCount =
  getCompletedSectionsCount(item);
              return (
                <tr
                  key={
                    item?.userId ||
                    item?._id ||
                    index
                  }
                  className="transition hover:bg-slate-50"
                >

                  {/* S.NO */}

                  <td className="px-5 py-4 text-sm font-semibold text-slate-500">
                    {
                      index + 1
                    }
                  </td>

                  {/* NAME */}

                  <td className="px-5 py-4">

                    <span className=" text-slate-800">
                      {GetHCPFullName(
                        UserFullInfo,
                        item?.userId
                      )}
                    </span>

                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">
{GetClientName(users,ClientId)}

                  </td>

                  {/* PHONE */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2 text-sm text-slate-600">

                      <Phone
                        size={
                          15
                        }
                        className="text-[#1392d3]"
                      />

                      {
                        item?.HCPContactNumber ||
                        item?.ContactNumber ||
                        "—"
                      }

                    </div>

                  </td>

                  {/* STATE */}

                  <td className="px-5 py-4">

                    <span className="inline-flex rounded-lg bg-[#1392d3]/10 px-3 py-1.5 text-xs font-semibold text-[#1392d3]">
                      {
                        item?.PermanentState ||
                        "Telangana"
                      }
                    </span>

                  </td>

                  {/* EXPERIENCE */}

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {
                      item?.Experience ||
                      "Fresher"
                    }
                  </td>

                  {/* COMPLETED */}

                  <td className="px-5 py-4">

                    <div className="flex flex-col gap-1">

                      <span className="text-sm font-semibold text-slate-700">
                        {
                          completedCount
                        }{" "}
                        /{" "}
                        {
                          applicableCount
                        }
                      </span>

                      <span className="text-xs text-slate-400">
                        sections completed
                      </span>

                    </div>

                  </td>

                  {/* FEEDBACK */}

                  <td className="px-5 py-4">

                  <div className="flex flex-wrap gap-2">

  {hasPreviousFeedback && (
    <button
      type="button"
      onClick={() =>
      {
        onViewFeedback(item)
        console.log("Check View Information----",)
      }
      }
      className="inline-flex items-center gap-2 rounded-xl border border-[#50c896]/30 bg-[#50c896]/10 px-2 py-2.5 text-xs font-semibold text-[#278f69] transition hover:bg-[#50c896] hover:text-white"
    >
      <Eye size={16} />
      View Feedback
    </button>
  )}

  {hasAvailableFeedback && (
    <button
      type="button"
      onClick={() =>
        onStartFeedback({ClientId,...item})
      }
      className="inline-flex items-center gap-2 rounded-xl bg-[#1392d3] px-2 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#107eaf]"
    >
      <FileText size={16} />
      Start Feedback
    </button>
  )}

</div>

                  </td>

                </tr>
              );
            }
          )
        ) : (
          <EmptyTable
            colSpan={
              8
            }
          />
        )}

      </tbody>

    </table>
  );
};

/* =========================================================
   FEEDBACK SCREEN
========================================================= */

interface FeedbackScreenProps {
  hca: any;
  mode: "create" | "view";
  sections: FeedbackSection[];
  selectedMonth: number;
  selectedYear: number;
  existingFeedback?: any;
  onBack: () => void;
  onSave: (
    feedback: SavedFeedback
  ) => void;
}

const FeedbackScreen: React.FC<
  FeedbackScreenProps
> = ({
  hca,
  mode,
  sections,
  selectedMonth,
  selectedYear,
  existingFeedback,
  onBack,
  onSave,
}) => {
  const [answers, setAnswers] =
    useState<
      Record<string, string>
    >({});

  const [recordings, setRecordings] =
    useState<
      Record<
        string,
        AudioRecording
      >
    >({});

  const [
    UploadStatusMessage,
    setUploadStatusMessage,
  ] = useState("");

  const [
    AudioFile,
    setAudioFile,
  ] = useState<
    string | null
  >(null);

  const [
    openSections,
    setOpenSections,
  ] = useState<
    Record<string, boolean>
  >(
    Object.fromEntries(
      sections.map(
        (
          section,
          index
        ) => [
          section.id,
          index === 0,
        ]
      )
    )
  );

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  /* UI ONLY: role-level slide navigation. Existing save/API logic is unchanged. */
  const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  if (
    mode !== "view" ||
    !existingFeedback ||
    sections.length === 0
  ) {
    return;
  }

  console.log(
    "========== PREVIEW DATA =========="
  );

  console.log(
    "EXISTING FEEDBACK:",
    existingFeedback
  );

  /*
   * ==========================================
   * GET ALL SAVED DATA
   * ==========================================
   */

  const savedRoles = [
    existingFeedback?.Role1?.data,

    existingFeedback?.Role2?.data,

    existingFeedback?.Role3?.data,

    existingFeedback?.RandomHCA?.data ||
      existingFeedback?.RandomHCACall?.data,

    existingFeedback?.Termination
  ].filter(Boolean);

  console.log(
    "SAVED ROLES:",
    savedRoles
  );

  /*
   * ==========================================
   * MERGE ALL ANSWERS
   * ==========================================
   */

  const mergedAnswers: Record<
    string,
    string
  > = {};

  savedRoles.forEach((roleData: any) => {
    if (
      roleData?.answers &&
      typeof roleData.answers === "object"
    ) {
      Object.assign(
        mergedAnswers,
        roleData.answers
      );
    }
  });

  /*
   * ==========================================
   * MERGE RECORDINGS
   * ==========================================
   */

  const mergedRecordings: Record<
    string,
    AudioRecording
  > = {};

  savedRoles.forEach((roleData: any) => {
    if (
      roleData?.recordings &&
      typeof roleData.recordings === "object"
    ) {
      Object.assign(
        mergedRecordings,
        roleData.recordings
      );
    }
  });

  /*
   * ==========================================
   * AUDIO
   * ==========================================
   */

  const savedAudio =
    savedRoles.find(
      (roleData: any) =>
        roleData?.Recording
    )?.Recording || null;

  console.log(
    "MERGED ANSWERS:",
    mergedAnswers
  );

  console.log(
    "MERGED RECORDINGS:",
    mergedRecordings
  );

  console.log(
    "AUDIO:",
    savedAudio
  );

  /*
   * ==========================================
   * SET PREVIEW DATA
   * ==========================================
   */

  setAnswers(
    mergedAnswers
  );

  setRecordings(
    mergedRecordings
  );

  setAudioFile(
    savedAudio
  );

}, [
  mode,
  existingFeedback,
  sections,
]);
  /* =======================================================
     UPDATE ANSWER
  ======================================================= */

  const updateAnswer = (
    questionId: string,
    value: string
  ) => {
    if (
      mode === "view"
    ) {
      return;
    }

    setAnswers(
      (previous) => ({
        ...previous,
        [questionId]:
          value,
      })
    );
  };

  /* =======================================================
     SAVE CURRENT SECTION
  ======================================================= */

  const handleSaveSection = async (
    section: FeedbackSection
  ) => {
    if (
      mode === "view"
    ) {
      return;
    }

    const missingQuestion =
      section.questions.find(
        (question) =>
          question.required &&
          !String(
            answers[
              question.id
            ] || ""
          ).trim()
      );

    if (
      missingQuestion
    ) {
      alert(
        `Please answer: ${missingQuestion.question}`
      );

      /*
       * Open the section
       * where validation failed.
       */
      setOpenSections(
        (previous) => ({
          ...previous,
          [section.id]:
            true,
        })
      );

      return;
    }

    try {
      setIsSaving(true);

      const userId =
        String(
          hca?.userId ||
            hca?._id ||
            hca?.id ||
            ""
        );


        const ImpClientId=  String(
          hca?.ClientId 
         
        );

      if (!userId) {
        alert(
          "HCA UserId is missing."
        );
        return;
      }

      const feedback:
        SavedFeedback = {
        UserId:
          userId,

          
ClientId:ImpClientId,



        SectionId:
          section.id,

        Role:
          section.role,

        answers:
          answers,

        recordings:
          recordings,

        Recording:
          AudioFile,

        completedAt:
          new Date().toISOString(),

        Month:
          `${selectedMonth}-${selectedYear}`,

        Type:
          "HCA",
      };

      const response =
        await axios.post(
          "/api/QualityPost",
          {
            feedback,
          }
        );

      console.log(
        "Quality Save Response:",
        response?.data
      );

      if (
        !response?.data
          ?.success
      ) {
        throw new Error(
          "Feedback was not saved"
        );
      }

      /*
       * Tell parent that this section
       * has been completed.
       */
      onSave(
        feedback
      );

    } catch (error) {
      console.error(
        "Save feedback failed:",
        error
      );

      alert(
        "Failed to save feedback. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };
const handleSaveRole2 = async (
  role2Sections: FeedbackSection[]
) => {
  if (mode === "view") return;

  /* ============================================
     VALIDATE ALL ROLE 2 QUESTIONS
  ============================================ */

  for (const section of role2Sections) {
    const missingQuestion =
      section.questions.find(
        (question) =>
          question.required &&
          !String(
            answers[question.id] || ""
          ).trim()
      );

    if (missingQuestion) {
      alert(
        `Please answer: ${missingQuestion.question}`
      );

      setOpenSections(
        (previous) => ({
          ...previous,
          [section.id]: true,
        })
      );

      return;
    }
  }

  try {
    setIsSaving(true);

    const userId = String(
      hca?.userId ||
        hca?._id ||
        hca?.id ||
        ""
    );

        const ImpClientId=  String(
          hca?.ClientId ||
          ""
        );
        
    if (!userId) {
      alert("HCA UserId is missing.");
      return;
    }

    const feedback: SavedFeedback = {
      UserId: userId,
ClientId:ImpClientId,
      // ONE SECTION ID FOR ENTIRE ROLE 2
      SectionId: "role-2",

      Role: "Role 2",

      answers: answers,

      recordings: recordings,

      Recording: AudioFile,

      completedAt:
        new Date().toISOString(),

      Month:`${selectedMonth}-${selectedYear}`,

      Type: "HCA",
    };

    const response =
      await axios.post(
        "/api/QualityPost",
        {
          feedback,
        }
      );

    console.log(
      "Role 2 Save Response:",
      response?.data
    );

    if (
      !response?.data?.success
    ) {
      throw new Error(
        "Role 2 feedback was not saved"
      );
    }

    onSave(feedback);

  } catch (error) {

    console.error(
      "Role 2 save failed:",
      error
    );

    alert(
      "Failed to save Role 2 feedback. Please try again."
    );

  } finally {

    setIsSaving(false);
  }
};

const handleSaveRole3 = async (
  role3Sections: FeedbackSection[]
) => {
  if (mode === "view") return;

  // Validate all Role 3 questions
  for (const section of role3Sections) {
    const missingQuestion = section.questions.find(
      (question) =>
        question.required &&
        !String(
          answers[question.id] || ""
        ).trim()
    );

    if (missingQuestion) {
      alert(
        `Please answer: ${missingQuestion.question}`
      );

      setOpenSections((previous) => ({
        ...previous,
        [section.id]: true,
      }));

      return;
    }
  }

  try {
    setIsSaving(true);

    const userId = String(
      hca?.userId ||
        hca?._id ||
        hca?.id ||
        ""
    );
    const ImpClientId=  String(
          hca?.ClientId ||
          ""
        );
        
    if (!userId) {
      alert("HCA UserId is missing.");
      return;
    }

    const feedback: SavedFeedback = {
      UserId: userId,
ClientId:ImpClientId,
      // ONE RECORD FOR ENTIRE ROLE 3
      SectionId: "role-3-welfare",

      Role: "Role 3",

      answers: answers,

      recordings: recordings,

      Recording: AudioFile,

      completedAt:
        new Date().toISOString(),

      Month:`${selectedMonth}-${selectedYear}`,

      Type: "HCA",
    };

    const response = await axios.post(
      "/api/QualityPost",
      {
        feedback,
      }
    );

    console.log(
      "Role 3 Save Response:",
      response?.data
    );

    if (!response?.data?.success) {
      throw new Error(
        "Role 3 feedback was not saved"
      );
    }

    onSave(feedback);

  } catch (error) {
    console.error(
      "Role 3 save failed:",
      error
    );

    alert(
      "Failed to save Role 3 feedback. Please try again."
    );
  } finally {
    setIsSaving(false);
  }
};


 const downloadPDF = async (ImpFileName:any) => {
     try {
   
       const element = document.getElementById("DownloadSection");
 
       if (!element) {
         throw new Error("Transaction history HTML not found");
       }
 
       const { default: html2pdf } = await import("html2pdf.js");
 
      const options: any = {
        margin: 5,
      
      pagebreak: {
  mode: ["css", "legacy"],
},
        filename: `${ImpFileName}-Feedback.pdf`,
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      } as any;

      await html2pdf().from(element).set(options).save();

     } catch (error: any) {
       console.error("Download PDF Error:", error);
 
       alert(
         error?.message ||
           "Failed to download transaction history."
       );
     }
   };
  /* =======================================================
     AUDIO UPLOAD
  ======================================================= */
const handleSaveRandomCall = async (
  randomCallSections: FeedbackSection[]
) => {
  if (mode === "view") return;

  /* ============================================
     VALIDATE ALL RANDOM CALL QUESTIONS
  ============================================ */

  for (const section of randomCallSections) {
    const missingQuestion =
      section.questions.find(
        (question) =>
          question.required &&
          !String(
            answers[question.id] || ""
          ).trim()
      );

    if (missingQuestion) {
      alert(
        `Please answer: ${missingQuestion.question}`
      );

      setOpenSections(
        (previous) => ({
          ...previous,
          [section.id]: true,
        })
      );

      return;
    }
  }

  try {
    setIsSaving(true);

    const userId = String(
      hca?.userId ||
        hca?._id ||
        hca?.id ||
        ""
    );
   const ImpClientId=  String(
          hca?.ClientId ||
          ""
        );
        
    if (!userId) {
      alert("HCA UserId is missing.");
      return;
    }

    const feedback: SavedFeedback = {
      UserId: userId,
ClientId:ImpClientId,
      // ONE ID FOR THE ENTIRE RANDOM CALL
      SectionId: "random-hca-call",

      Role: "Random HCA Call",

      answers,

      recordings,

      Recording: AudioFile,

      completedAt:
        new Date().toISOString(),

      Month:`${selectedMonth}-${selectedYear}`,

      Type: "HCA",
    };

    const response =
      await axios.post(
        "/api/QualityPost",
        {
          feedback,
        }
      );

    console.log(
      "Random HCA Call Save Response:",
      response?.data
    );

    if (!response?.data?.success) {
      throw new Error(
        "Random HCA Call was not saved"
      );
    }

    onSave(feedback);

  } catch (error) {

    console.error(
      "Random HCA Call save failed:",
      error
    );

    alert(
      "Failed to save Random HCA Call. Please try again."
    );

  } finally {

    setIsSaving(false);
  }
};
  const handleAudioUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      console.log(
        "handleAudioUpload CALLED"
      );

      const file =
        e.target.files?.[0];

      console.log(
        "Selected File:",
        file
      );

      if (!file) {
        alert(
          "No file selected"
        );
        return;
      }

      if (
        file.size >
        10 *
          1024 *
          1024
      ) {
        alert(
          "Audio file too large. Max allowed is 10MB."
        );

        e.target.value =
          "";

        return;
      }

      if (
        !file.type.startsWith(
          "audio/"
        )
      ) {
        alert(
          "Only audio files are allowed."
        );

        e.target.value =
          "";

        return;
      }

      setUploadStatusMessage(
        "Please Wait Uploading Audio...."
      );

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      try {
        const response =
          await axios.post(
            "/api/Upload",
            formData
          );

        console.log(
          "UPLOAD RESPONSE:",
          response?.data
        );

        const url =
          response?.data
            ?.url;

        if (url) {
          setAudioFile(
            String(url)
          );

          setUploadStatusMessage(
            "Audio Uploaded Successfully"
          );
        } else {
          setUploadStatusMessage(
            "Upload completed but URL was not returned"
          );
        }
      } catch (error) {
        console.error(
          "Audio upload failed:",
          error
        );

        setUploadStatusMessage(
          "Audio Upload Failed"
        );
      }
    };

  /* =======================================================
     NO SECTIONS
  ======================================================= */

  if (
    sections.length === 0
  ) {
    return (
      <div className="space-y-6">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <button
            type="button"
            onClick={
              onBack
            }
            className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-[#1392d3] hover:text-[#1392d3]"
          >
            <ArrowLeft
              size={
                19
              }
            />
          </button>

          <div className="rounded-xl bg-[#50c896]/10 p-5">

            <p className="font-semibold text-[#278f69]">
              All applicable feedback sections have been completed for this month.
            </p>

          </div>

        </div>

      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen space-y-6 bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={
                onBack
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#1392d3] hover:text-[#1392d3]"
            >
              <ArrowLeft
                size={
                  19
                }
              />
            </button>

            <div>

              <h2 className="text-lg font-bold text-slate-800">
                {mode ===
                "view"
                  ? "View HCA Feedback"
                  : "HCA Feedback"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete each available feedback section separately.
              </p>

            </div>

          </div>
  <button
  type="button"
  onClick={onBack}
  className="
    inline-flex h-10 items-center justify-center gap-2
    rounded-xl
    border border-slate-200
    bg-white
    px-3
    text-sm font-medium text-slate-600
    shadow-sm
    transition-all duration-200
    hover:-translate-x-0.5
    hover:border-[#1392d3]
    hover:bg-[#1392d3]/5
    hover:text-[#1392d3]
    hover:shadow-md
    active:scale-95
  "
  aria-label="Back"
>
  <ArrowLeft size={18} strokeWidth={2} />

  <span className="hidden sm:inline">
    Back
  </span>
</button>
        </div>

      </div>

      {/* =====================================================
          HCA INFORMATION
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-4">

          <h3 className="text-base font-bold text-slate-800">
            HCA Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Basic information of the healthcare assistant.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <InfoBox
            label="HCA Name"
            value={`${hca?.HCPFirstName || ""} ${
              hca?.HCPSurName ||
              hca?.LastName ||
              ""
            }`}
          />

          <InfoBox
            label="Status"
            value={
              hca?.CurrentStatus ||
              "—"
            }
          />

          <InfoBox
            label="Contact"
            value={
              hca?.HCPContactNumber ||
              hca?.ContactNumber ||
              "—"
            }
          />

          <InfoBox
            label="State"
            value={
              hca?.PermanentState ||
              "Telangana"
            }
          />

        </div>

      </div>

      {/* =====================================================
          ROLE SLIDES — UI ONLY
          One slide per role. All sections/questions for the
          active role are displayed together.
      ===================================================== */}
      {(() => {
        const slideRoles: FeedbackRole[] = [
          "Role 1",
          "Role 2",
          "Role 3",
          "Random HCA Call",
          "Termination",
        ];

        const availableRoles = slideRoles.filter((role) =>
          sections.some((section) => section.role === role)
        );

        const activeRole = availableRoles[currentSlide];
        const activeSections = sections.filter(
          (section) => section.role === activeRole
        );

        const isFirstSlide = currentSlide === 0;
        const isLastSlide = currentSlide === availableRoles.length - 1;

        const goToPreviousSlide = () => {
          if (!isFirstSlide) {
            setCurrentSlide((previous) => previous - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        };

        const goToNextSlide = () => {
          if (!isLastSlide) {
            setCurrentSlide((previous) => previous + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        };

        if (!activeRole) return null;

        const roleTitle: Record<FeedbackRole, string> = {
          "Role 1": "Role 1 — Complete Feedback",
          "Role 2": "Role 2 — Complete All Questions",
          "Role 3": "Role 3 — Welfare Parameters Analysis",
          "Random HCA Call": "Random HCA Call — Complete All Questions",
          "Termination": "Termination — Complete All Questions",
        };

        return (
          <div className="space-y-5">
            {/* =================================================
                SLIDE PROGRESS
            ================================================= */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1392d3]">
                    Feedback Progress
                  </p>
                  <h3 className="mt-1 text-base font-bold text-slate-800 sm:text-lg">
                    {activeRole}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Slide {currentSlide + 1} of {availableRoles.length} · All questions for this role are on one slide.
                  </p>
                </div>
<div className="flex flex-wrap items-center gap-2">
  {availableRoles.map((role, index) => (
    <div
      key={role}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
        index === currentSlide
          ? "border-[#1392d3] bg-[#1392d3] text-white shadow-sm"
          : index < currentSlide
            ? "border-[#50c896] bg-[#50c896]/10 text-[#278f69]"
            : "border-[#f2c94c] bg-[#fff8dc] text-[#b7791f]"
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
        {index + 1}
      </span>

      <span className="hidden sm:inline">
        {role}
      </span>
    </div>
  ))}
</div>
              </div>
            </div>

            {/* =================================================
                ONE OUTER CARD FOR THE ENTIRE ROLE
            ================================================= */}
<div
  className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#ffffff] shadow-sm"
  id="DownloadSection"
>
  <div
    className="border-b border-[#e2e8f0] px-5 py-5 sm:px-7"
    style={{
      background:
        "linear-gradient(to right, rgba(19,146,211,0.05), #ffffff, rgba(80,200,150,0.05))",
    }}
  >
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <span
          className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
          style={{
            backgroundColor: "rgba(19,146,211,0.10)",
            color: "#1392d3",
          }}
        >
          {activeRole}
        </span>

        <h3 className="mt-2 text-lg font-bold text-[#1e293b] sm:text-xl">
          {roleTitle[activeRole]}
        </h3>

        <p className="mt-1 text-sm leading-6 text-[#64748b]">
          Complete all questions below. There is no section-to-section Next button.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => downloadPDF(hca?.HCPFirstName)}
          type="button"
          className="inline-flex min-h-8 cursor-pointer items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold shadow-sm transition-all"
          style={{
            borderColor: "#1392d3",
            backgroundColor: "#ffffff",
            color: "#1392d3",
          }}
        >
          <FileText size={17} />
          Download
        </button>

        <div
          className="shrink-0 rounded-xl px-4 py-3 text-center"
          style={{
            border: "1px solid rgba(19,146,211,0.15)",
            backgroundColor: "rgba(19,146,211,0.05)",
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
            Sections in this slide
          </p>

          <p className="mt-0.5 text-xl font-bold text-[#1392d3]">
            {activeSections.length}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div className="space-y-6 p-4 sm:p-6 lg:p-7">
    {activeSections.map((section, sectionIndex) => (
      <div
        key={section.id}
        className="overflow-hidden rounded-2xl border bg-[#f8fafc]"
        style={{
          borderColor: "#e2e8f0",
          backgroundColor: "rgba(248,250,252,0.60)",
        }}
      >
        <div className="border-b border-[#e2e8f0] bg-[#ffffff] px-4 py-4 sm:px-5">
          <div className="flex items-start gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
              style={{
                backgroundColor: "rgba(19,146,211,0.10)",
                color: "#1392d3",
              }}
            >
              {sectionIndex + 1}
            </div>

            <div className="min-w-0">
              <span
                className="inline-flex rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide"
                style={{
                  backgroundColor: "rgba(19,146,211,0.10)",
                  color: "#1392d3",
                }}
              >
                {activeRole}
              </span>

              <h4 className="mt-1 text-sm font-bold leading-6 text-[#1e293b] sm:text-base">
                {section.title}
              </h4>

              {section.description && (
                <p className="mt-1 text-xs leading-5 text-[#64748b] sm:text-sm">
                  {section.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 p-4 sm:p-5">
          {section.questions.map((question, questionIndex) => (
            <div
              key={question.id}
              className={`space-y-2.5 ${
                question.question.startsWith("MANDATORY")
                  ? "rounded-xl p-4"
                  : ""
              }`}
              style={
                question.question.startsWith("MANDATORY")
                  ? {
                      border: "1px solid #fecaca",
                      backgroundColor: "rgba(254,242,242,0.60)",
                    }
                  : undefined
              }
            >
              <label className="block whitespace-pre-line text-sm font-semibold leading-6 text-[#334155]">
                {question.subLabel ? (
                  <span className="mr-2 font-bold text-[#1392d3]">
                    {question.subLabel}.
                  </span>
                ) : (
                  !question.question.startsWith("MANDATORY") && (
                    <span className="mr-2 text-[#94a3b8]">
                      Q{questionIndex + 1}.
                    </span>
                  )
                )}

                {question.question}

                {question.required && (
                  <span className="ml-1 text-[#ef4444]">*</span>
                )}
              </label>

              {question.type === "select" ? (
                <select
                  value={answers[question.id] || ""}
                  disabled={mode === "view"}
                  onChange={(e) =>
                    updateAnswer(question.id, e.target.value)
                  }
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 text-sm outline-none transition"
                  style={
                    mode === "view"
                      ? {
                          backgroundColor: "#f1f5f9",
                          color: "#475569",
                        }
                      : {
                          backgroundColor: "#ffffff",
                          color: "#334155",
                        }
                  }
                >
                  <option value="">Select Answer</option>

                  {question.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    updateAnswer(question.id, e.target.value)
                  }
                  readOnly={mode === "view"}
                  rows={
                    question.question.startsWith("MANDATORY") ? 3 : 4
                  }
                  placeholder={
                    mode === "view"
                      ? "No answer recorded"
                      : "Enter feedback..."
                  }
                  className="w-full resize-none rounded-xl border border-[#cbd5e1] px-4 py-3 text-sm leading-6 text-[#334155] outline-none transition"
                  style={{
                    backgroundColor:
                      mode === "view" ? "#f1f5f9" : "#ffffff",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>

  {/* =================================================
      ROLE-LEVEL ACTIONS
  ================================================= */}
  <div
    className="border-t border-[#e2e8f0] px-4 py-4 sm:px-6 sm:py-5"
    style={{
      backgroundColor: "rgba(248,250,252,0.70)",
    }}
  >
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={goToPreviousSlide}
        disabled={isFirstSlide}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#ffffff] px-5 py-3 text-sm font-semibold text-[#475569] shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft size={17} />
        Previous Role
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {mode === "create" && activeRole === "Role 2" && (
          <button
            type="button"
            disabled={isSaving}
            onClick={() => {
              handleSaveRole2(activeSections);
              if (!isSaving && !isLastSlide) goToNextSlide();
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: "#50c896",
              color: "#ffffff",
            }}
          >
            {isSaving ? <Save size={17} /> : <Check size={17} />}
            {isSaving
              ? "Saving Role 2..."
              : isLastSlide
              ? "Complete Role 2"
              : "Complete Role 2 & Next"}
          </button>
        )}

        {mode === "create" && activeRole === "Role 3" && (
          <button
            type="button"
            disabled={isSaving}
            onClick={() => {
              handleSaveRole3(activeSections);
              if (!isSaving && !isLastSlide) goToNextSlide();
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: "#50c896",
              color: "#ffffff",
            }}
          >
            {isSaving ? <Save size={17} /> : <Check size={17} />}
            {isSaving
              ? "Saving Role 3..."
              : isLastSlide
              ? "Complete Role 3"
              : "Complete Role 3 & Next"}
          </button>
        )}

        {mode === "create" && activeRole === "Random HCA Call" && (
          <button
            type="button"
            disabled={isSaving}
            onClick={() => {
              handleSaveRandomCall(activeSections);
              if (!isSaving && !isLastSlide) goToNextSlide();
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: "#50c896",
              color: "#ffffff",
            }}
          >
            {isSaving ? <Save size={17} /> : <Check size={17} />}
            {isSaving
              ? "Saving Random HCA Call..."
              : isLastSlide
              ? "Complete Random HCA Call"
              : "Complete Random HCA Call & Next"}
          </button>
        )}

        {mode === "create" && activeRole === "Role 1" && (
          <button
            type="button"
            disabled={isSaving}
            onClick={() => {
              activeSections.forEach((section) => {
                handleSaveSection(section);
              });

              if (!isSaving && !isLastSlide) goToNextSlide();
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: "#50c896",
              color: "#ffffff",
            }}
          >
            <Check size={17} />
            Complete Role 1 & Next
          </button>
        )}

        {mode === "create" &&
          activeRole === "Termination" &&
          activeSections[0] && (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveSection(activeSections[0])}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor: "#50c896",
                color: "#ffffff",
              }}
            >
              <Check size={17} />
              Complete Termination
            </button>
          )}

        {mode === "view" && !isLastSlide && (
          <button
            type="button"
            onClick={goToNextSlide}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition"
            style={{
              backgroundColor: "#1392d3",
              color: "#ffffff",
            }}
          >
            Next Role
            <ChevronDown size={17} className="-rotate-90" />
          </button>
        )}
      </div>
    </div>
  </div>
</div>
          </div>
        );
      })()}

      {/* =====================================================
          AUDIO UPLOAD
      ===================================================== */}

      {mode ===
        "create" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="font-semibold text-slate-800">
                Call Recording
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Upload the HCA call recording if required.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-3">

              <input
                type="file"
                id="callRecord"
                accept="audio/*"
                className="hidden"
                onChange={
                  handleAudioUpload
                }
              />

              <label
                htmlFor="callRecord"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#1392d3] bg-white px-5 py-3 text-sm font-semibold text-[#1392d3] shadow-sm transition hover:bg-[#1392d3] hover:text-white"
              >
                <Upload
                  size={
                    17
                  }
                />

                Upload Call Record
              </label>

              {UploadStatusMessage && (
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
                  {
                    UploadStatusMessage
                  }
                </p>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

/* =========================================================
   FEEDBACK SECTION CARD
========================================================= */

interface FeedbackSectionCardProps {
  section: FeedbackSection;
  sectionIndex: number;
  answers: Record<string, string>;
  open: boolean;
  readOnly: boolean;
  isSaving: boolean;

  onToggle: () => void;

  onAnswerChange: (
    questionId: string,
    value: string
  ) => void;

  onSaveSection?: (
    section: FeedbackSection
  ) => void;

  showSaveButton?: boolean;
}

const FeedbackSectionCard: React.FC<
  FeedbackSectionCardProps
> = ({
  section,
  sectionIndex,
  answers,
  open,
  readOnly,
  isSaving,
  onToggle,
  onAnswerChange,
  onSaveSection,
  showSaveButton = true,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* ===================================================
          HEADER
      =================================================== */}

      <button
        type="button"
        onClick={
          onToggle
        }
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50"
      >

        <div className="flex items-center gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1392d3]/10 text-sm font-bold text-[#1392d3]">
            {
              sectionIndex +
              1
            }
          </div>

          <div>

            <div className="mb-1">

              <span className="rounded-full bg-[#1392d3]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1392d3]">
                {
                  section.role
                }
              </span>

            </div>

            <h3 className="font-bold text-slate-800">
              {
                section.title
              }
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {
                section.description
              }
            </p>

          </div>

        </div>

        {open ? (
          <ChevronUp
            size={
              20
            }
            className="shrink-0 text-slate-400"
          />
        ) : (
          <ChevronDown
            size={
              20
            }
            className="shrink-0 text-slate-400"
          />
        )}

      </button>

      {/* ===================================================
          BODY
      =================================================== */}

      {open && (
        <div className="border-t border-slate-200 p-5">

          <div className="space-y-6">

            {section.questions.map(
              (
                question,
                questionIndex
              ) => (
                <div
                  key={
                    question.id
                  }
                  className={`space-y-2 ${
                    question.question.startsWith(
                      "MANDATORY"
                    )
                      ? "rounded-xl border border-red-200 bg-red-50/50 p-4"
                      : ""
                  }`}
                >

                  <label className="block whitespace-pre-line text-sm font-semibold leading-6 text-slate-700">

                    {question.subLabel ? (
                      <span className="mr-2 font-bold text-[#1392d3]">
                        {
                          question.subLabel
                        }.
                      </span>
                    ) : (
                      !question.question.startsWith(
                        "MANDATORY"
                      ) && (
                        <span className="mr-2 text-slate-400">
                          Q
                          {questionIndex +
                            1}
                          .
                        </span>
                      )
                    )}

                    {
                      question.question
                    }

                    {question.required && (
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    )}

                  </label>

                  {question.type ===
                  "select" ? (
                    <select
                      value={
                        answers[
                          question.id
                        ] ||
                        ""
                      }
                      disabled={
                        readOnly
                      }
                      onChange={(
                        e
                      ) =>
                        onAnswerChange(
                          question.id,
                          e.target.value
                        )
                      }
                      className={`w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition ${
                        readOnly
                          ? "cursor-default bg-slate-50 text-slate-600"
                          : "bg-white text-slate-700 focus:border-[#1392d3] focus:ring-2 focus:ring-[#1392d3]/10"
                      }`}
                    >
                      <option value="">
                        Select Answer
                      </option>

                      {question.options?.map(
                        (
                          option
                        ) => (
                          <option
                            key={
                              option
                            }
                            value={
                              option
                            }
                          >
                            {
                              option
                            }
                          </option>
                        )
                      )}

                    </select>
                  ) : (
                    <textarea
                      value={
                        answers[
                          question.id
                        ] ||
                        ""
                      }
                      onChange={(
                        e
                      ) =>
                        onAnswerChange(
                          question.id,
                          e.target.value
                        )
                      }
                      readOnly={
                        readOnly
                      }
                      rows={
                        question.question.startsWith(
                          "MANDATORY"
                        )
                          ? 3
                          : 4
                      }
                      placeholder={
                        readOnly
                          ? "No answer recorded"
                          : "Enter feedback..."
                      }
                      className={`w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition ${
                        readOnly
                          ? "cursor-default bg-slate-50"
                          : "bg-white focus:border-[#1392d3] focus:ring-2 focus:ring-[#1392d3]/10"
                      }`}
                    />
                  )}

                </div>
              )
            )}

          </div>

          {/* =================================================
              SECTION SAVE
          ================================================= */}

        {!readOnly && showSaveButton && (
  <div className="mt-8 flex justify-end border-t border-slate-200 pt-5">

    <button
      type="button"
      disabled={isSaving}
      onClick={() =>
        onSaveSection?.(section)
      }
      className="inline-flex items-center gap-2 rounded-xl bg-[#50c896] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#43b889] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSaving ? (
        <>
          <Save size={17} />
          Saving...
        </>
      ) : (
        <>
          <Check size={17} />
          Complete {section.role}
        </>
      )}
    </button>

  </div>
)}

        </div>
      )}

    </div>
  );
};

/* =========================================================
   INFO BOX
========================================================= */

const InfoBox = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {
          label
        }
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {
          value ||
          "—"
        }
      </p>

    </div>
  );
};

/* =========================================================
   SUMMARY CARD
========================================================= */

interface SummaryCardProps {
  title: string;
  value: number;
  color: string;
}

const SummaryCard: React.FC<
  SummaryCardProps
> = ({
  title,
  value,
  color,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {
          title
        }
      </p>

      <div className="mt-2 flex items-center gap-3">

        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor:
              color,
          }}
        />

        <p className="text-2xl font-bold text-slate-800">
          {
            value
          }
        </p>

      </div>

    </div>
  );
};

/* =========================================================
   EMPTY TABLE
========================================================= */

const EmptyTable = ({
  colSpan,
}: {
  colSpan: number;
}) => {
  return (
    <tr>

      <td
        colSpan={
          colSpan
        }
        className="px-5 py-12 text-center"
      >

        <div className="flex flex-col items-center justify-center">

          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

            <FileText
              size={
                22
              }
              className="text-slate-400"
            />

          </div>

          <p className="font-semibold text-slate-600">
            No HCA found
          </p>

          <p className="mt-1 text-sm text-slate-400">
            There are no records matching your filters.
          </p>

        </div>

      </td>

    </tr>
  );
};

export default HCAFeedback;