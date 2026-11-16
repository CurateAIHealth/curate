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
  Download,
  Settings2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { GetClientId, GetClientName, GetHCPFullName, GetPermanentState } from "@/Lib/Actions";
import axios from "axios";
import { LoadingData } from "../Loading/page";
import QualityQuestionManager from "@/Components/QualityQuestionManager/page";
import { IndianStates } from "@/Lib/Content";
import { SetDeploymentInfo, UpdateMonthFilter } from "@/Redux/action";
import LoadingPopup from "../SwitchMonth/page";

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
  | "HCA Status Review"
  | "Role 3"
  | "Random HCA Call"
  | "Termination"
  | "HCA Feedback";

interface Question {
  id: string;
  question: string;
  type: "textarea" | "select";
  required?: boolean;
  options?: string[];
  subLabel?: string;
  active?: boolean;
  order?: number;
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

interface PopupMessageProps {
  message: string;
  onClose: () => void;
}

const PopupMessage: React.FC<PopupMessageProps> = ({
  message,
  onClose,
}) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-6 pointer-events-none">
      <div
        role="alert"
        aria-live="assertive"
        className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <p className="text-sm font-semibold text-slate-800">
            Notification
          </p>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-slate-600">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 6-12 12" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

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




/* In-memory only: avoid persistent storage for potentially sensitive feedback. */
const QUALITY_CACHE_TTL_MS = 30_000;
const qualityStatusCache = new Map<
  string,
  { value: any; expiresAt: number }
>();
const qualityStatusRequests = new Map<string, Promise<any>>();
let qualityDataCache:
  | { value: any[]; expiresAt: number }
  | undefined;
let qualityDataRequest: Promise<any[]> | undefined;

const fetchQualityStatus = (userId: string): Promise<any> => {
  const cached = qualityStatusCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.value);
  }

  const pending = qualityStatusRequests.get(userId);
  if (pending) return pending;

  const request = axios
    .post("/api/GetQualityStatus", { UserId: userId })
    .then((response) => {
      const value = response?.data;
      qualityStatusCache.set(userId, {
        value,
        expiresAt: Date.now() + QUALITY_CACHE_TTL_MS,
      });
      return value;
    })
    .finally(() => qualityStatusRequests.delete(userId));

  qualityStatusRequests.set(userId, request);
  return request;
};

const fetchQualityData = (): Promise<any[]> => {
  if (qualityDataCache && qualityDataCache.expiresAt > Date.now()) {
    return Promise.resolve(qualityDataCache.value);
  }
  if (qualityDataRequest) return qualityDataRequest;

  qualityDataRequest = axios
    .get("/api/GetQualityData")
    .then((response) => {
      const data = response?.data?.data?.data;
      const value = Array.isArray(data) ? data : [];
      qualityDataCache = {
        value,
        expiresAt: Date.now() + QUALITY_CACHE_TTL_MS,
      };
      return value;
    })
    .finally(() => {
      qualityDataRequest = undefined;
    });

  return qualityDataRequest;
};

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
const [feedbackSections, setFeedbackSections] =
  useState<FeedbackSection[]>([]);

const [trashQuestions, setTrashQuestions] =
  useState<any[]>([]);

const [questionsLoading, setQuestionsLoading] =
  useState(true);
  const [isChecking, setIsChecking] =
    useState(false);
  const [popupMessage, setPopupMessage] = useState("");
const [qualityStatus, setQualityStatus] =
  useState<Record<string, any>>({});
  const [qualityRefreshVersion, setQualityRefreshVersion] =
    useState(0);
  const [ImportedData, setImportedData] =
    useState<any[]>([]);

  const [feedbackFilter, setFeedbackFilter] =
    useState<FeedbackStatus>("Pending");

  const [statusFilter, setStatusFilter] =
    useState<HCAStatus>("Active");

  const [search, setSearch] =
    useState("");
const [showQuestionManager, setShowQuestionManager] =
  useState(false);
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
const [SelectedServiceStates, setSelectedServiceStates] = useState("Telangana");
const dispatch = useDispatch();
  const [isSwitchingMonth, setIsSwitchingMonth] = useState(false);
const [selectedMonth, setSelectedMonth] =
  useState<number>(currentDate.getMonth() + 1);

const [selectedYear, setSelectedYear] =
  useState<number>(currentDate.getFullYear());
  /* =======================================================
     HCA DATA
  ======================================================= */

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
  let cancelled = false;

  const loadQuestions = async () => {
    try {
      const response = await axios.get(
        "/api/HCPQualityQuestions"
      );

      if (cancelled) return;

      const config = response.data?.data;

      if (config && Array.isArray(config.sections)) {
        setFeedbackSections(config.sections);

        setTrashQuestions(
          Array.isArray(config.trashQuestions)
            ? config.trashQuestions
            : []
        );
      } else {
        // MongoDB is empty: retain defaults temporarily
        // until the user runs the one-time initialization.
        setFeedbackSections([]);
        setTrashQuestions([]);
      }
    } catch (error) {
      console.error("HCP Questions Loading Error:", error);

      if (!cancelled) {
        setPopupMessage("Unable to load questions from MongoDB.");
      }
    } finally {
      if (!cancelled) {
        setQuestionsLoading(false);
      }
    }
  };

  loadQuestions();

  return () => {
    cancelled = true;
  };
}, []);
useEffect(() => {
  let cancelled = false;
  if (!hcaData.length) {
    setQualityStatus({});
    return () => {
      cancelled = true;
    };
  }





  const fetchStatuses = async () => {
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
            return {
              userId,
              status: await fetchQualityStatus(userId),
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
    


      const statusMap: Record<
        string,
        any
      > = {};

      results.forEach((item) => {
        if (!item?.userId) return;

        statusMap[item.userId] =
          item.status;
      });

     

    

      if (!cancelled) {
        setQualityStatus((previous) => ({
          ...previous,
          ...statusMap,
        }));
      }

    } catch (error) {
      console.error(
        "FetchQualityStatus failed:",
        error
      );
    }
  };

  fetchStatuses();

  return () => {
    cancelled = true;
  };
}, [hcaData, qualityRefreshVersion]);


  /* =======================================================
     FETCH QUALITY DATA
  ======================================================= */

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const data = await fetchQualityData();
        if (cancelled) return;
        setImportedData(
          data
        );
           setIsChecking(true);
      } catch (error) {
        if (cancelled) return;
        console.error(
          "GetQualityData failed:",
          error
        );
   setIsChecking(false);
        setImportedData([]);
      } 
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     CURRENT MONTH
  ======================================================= */

const activeFeedbackSections = useMemo(() => {
  return feedbackSections.map((section) => ({
    ...section,
  questions: (section.questions ?? []).filter(
  (question: any) => question.active !== false
),
  }));
}, [feedbackSections]);

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

  // The combined feedback submission contains every applicable section.
  if (
    monthlyRecords.some(
      (item: any) => item?.Role === "HCA Feedback"
    )
  ) {
    return feedbackSections.map((section) => section.id);
  }

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
/* =====================================================
   HCA STATUS REVIEW
   MONTHLY
===================================================== */

const hcaStatusReviewCompleted =
  monthlyRecords.some(
    (item: any) =>
      item?.Role === "HCA Status Review"
  );

if (hcaStatusReviewCompleted) {
  feedbackSections
    .filter(
      (section) =>
        section.role === "HCA Status Review"
    )
    .forEach((section) => {
      completedIds.push(section.id);
    });
}

/* =====================================================
   HCA STATUS REVIEW
   MONTHLY
===================================================== */



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

    return applicableSections.filter(
      (section) =>
        completedIds.includes(
          section.id
        )
    ).length;
  };
const getCompletedMainSectionsCount = (
  item: any
): number => {
  const userId = getUserId(item);

  const quality = qualityStatus?.[userId];

  if (!quality) {
    return 0;
  }

  const records = Array.isArray(quality?.records)
    ? quality.records
    : [];

  const selectedMonthValue =
    `${selectedMonth}-${selectedYear}`;

  const status =
    item?.CurrentStatus as HCAStatus;

const mainRoles: FeedbackRole[] = [
  "Role 1",
  "Role 2",
  "HCA Status Review",
  "Role 3",
  "Random HCA Call",
  "Termination",
];

  const applicableRoles = mainRoles.filter((role) =>
    feedbackSections.some(
      (section) =>
        section.role === role &&
        section.visibleFor.includes(status)
    )
  );

  const hasCombinedFeedback = records.some(
    (record: any) =>
      record?.Role === "HCA Feedback" &&
      String(record?.Month) === selectedMonthValue
  );

  if (hasCombinedFeedback) {
    return applicableRoles.length;
  }

  const completedRoles = applicableRoles.filter(
    (role) => {

      /* ==========================================
         ROLE 2
         Lifetime completion
      ========================================== */

      if (role === "Role 2") {
        return records.some(
          (record: any) =>
            record?.Role === "Role 2"
        );
      }
/* ==========================================
   HCA STATUS REVIEW
   Monthly completion
========================================== */

if (role === "HCA Status Review") {
  return records.some(
    (record: any) =>
      record?.Role === "HCA Status Review" &&
      String(record?.Month ?? "").trim() === selectedMonthValue
  );
}
      /* ==========================================
         OTHER ROLES
         Monthly completion
      ========================================== */

      return records.some(
        (record: any) =>
          record?.Role === role &&
          String(record?.Month) ===
            selectedMonthValue
      );
    }
  );

  return completedRoles.length;
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

  // Wait until questions are loaded
  if (questionsLoading) {
    return "Pending";
  }

  const status = item?.CurrentStatus as HCAStatus;

  const mainRoles: FeedbackRole[] = [
    "Role 1",
    "Role 2",
    "HCA Status Review",
    "Role 3",
    "Random HCA Call",
    "Termination",
  ];

  const applicableRoles = mainRoles.filter((role) =>
    feedbackSections.some(
      (section) =>
        section.role === role &&
        Array.isArray(section.visibleFor) &&
        section.visibleFor.includes(status)
    )
  );

  if (applicableRoles.length === 0) {
    return "Completed";
  }

  const completedCount = getCompletedMainSectionsCount(item);

  return completedCount >= applicableRoles.length
    ? "Completed"
    : "Pending";
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
            feedbackStatus ===feedbackFilter;
const preferredWorkingState =
            item?.PreferdWorkingStatus || "Telangana";
          const matchesServiceState =
            preferredWorkingState === SelectedServiceStates;
          return (
            matchesSearch &&
            matchesHCAStatus &&
            matchesServiceState &&
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
  SelectedServiceStates
    ]);
console.log("Hcp Data----",filteredHCAData)
console.log ("Find-----",hcaData)
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
      setPopupMessage(
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
  setSelectedHCA(item);

  const status = item?.CurrentStatus as HCAStatus;

  setSelectedSections(
    feedbackSections.filter((section) =>
      section.visibleFor.includes(status)
    )
  );

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
  UserFullInfo={UserFullInfo}
existingFeedback={
  feedbackMode === "view"
    ? qualityStatus?.[getUserId(selectedHCA)]
    : undefined
}
  onBack={closeFeedback}
        onSave={(
          feedback
        ) => {
          setQualityStatus((previous) => {
            const userId = String(feedback.UserId);
            const currentStatus = previous[userId] || {};
            const currentRecords = Array.isArray(currentStatus.records)
              ? currentStatus.records
              : [];

            return {
              ...previous,
              [userId]: {
                ...currentStatus,
                records: [
                  ...currentRecords.filter(
                    (record: any) =>
                      !(
                        record?.Role === feedback.Role &&
                        record?.SectionId === feedback.SectionId &&
                        String(record?.Month) === String(feedback.Month)
                      )
                  ),
                  feedback,
                ],
              },
            };
          });
          qualityStatusCache.delete(String(feedback.UserId));
          setQualityRefreshVersion((version) => version + 1);

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
  if (feedback.Role === "HCA Feedback") {
    return [];
  }

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
// const GetMonthFreshData = async (r: string) => {
//   try {
  
//     setIsSwitchingMonth(true);
//     dispatch(UpdateMonthFilter(r));

//     const userId = localStorage.getItem("UserId");

//    const { data } = await axios.post(
//   "/api/AdminPageInfo",
//   {
//     userId,
//     Month: `${selectedYear}-${r}`,
//   }
// );



//     console.log("Check New Data", data.data.deployedLength);

//     dispatch(SetDeploymentInfo(data.data.deployedLength));
//     setSelectedMonth(parseInt(r));
//  setIsSwitchingMonth(false);
    
//   } catch (error) {
//     console.error("GetMonthFreshData Error:", error);
 
//   }
// };
  // if (isChecking) {
  //   return <LoadingData />;
  // }

if (showQuestionManager) {
  return (
    <QualityQuestionManager
      onBack={() => setShowQuestionManager(false)}
      sections={feedbackSections}
      trashQuestions={trashQuestions}
      onSaveConfig={(updatedSections, updatedTrash) => {
        setFeedbackSections(updatedSections);
        setTrashQuestions(updatedTrash);
      }}
    />
  );
}


  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="space-y-6">
      <PopupMessage message={popupMessage} onClose={() => setPopupMessage("")} />

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
    QUESTION MANAGEMENT
===================================================== */}


<div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

  {/* Left: Section Info */}
  <div className="flex items-center gap-2">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1392d3]/10">
      <Settings2 size={18} className="text-[#1392d3]" />
    </div>

    <div>
      <p className="text-sm font-semibold text-slate-800">
        Question Management
      </p>
      <p className="text-xs text-slate-500">
        Manage and customize questions
      </p>
    </div>
  </div>

  {/* Right: Loading + Action */}
  <div className="flex items-center gap-3">

    {questionsLoading && (
      <div className="flex items-center gap-2 text-xs font-medium text-[#1392d3]">
        <Loader2 size={14} className="animate-spin" />
        Loading questions...
      </div>
    )}

    <button
      type="button"
      onClick={() => setShowQuestionManager(true)}
      disabled={questionsLoading}
      className="
        inline-flex items-center gap-2
        rounded-xl
        bg-gradient-to-r from-[#1392d3] to-[#087bb8]
        px-4 py-2.5
        text-sm font-semibold text-white
        shadow-md shadow-[#1392d3]/20
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-lg hover:shadow-[#1392d3]/30
        active:translate-y-0
        disabled:cursor-not-allowed disabled:opacity-50
      "
    >
      <Settings2 size={17} />
      Manage Questions
      <ChevronRight size={16} />
    </button>

  </div>
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
  disabled={!isChecking}
  className={`
    flex h-10 min-w-0 items-center justify-between
    rounded-xl border px-3
    text-xs font-semibold
    transition-all duration-200
    sm:text-sm
    ${
      !isChecking
        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
        : feedbackFilter === "Completed"
          ? "border-[#50c896] bg-[#eafaf4] text-[#278f69]"
          : "border-slate-200 bg-white text-slate-600 hover:border-[#50c896]"
    }
  `}
>
  <span className="flex min-w-0 items-center gap-1.5">
    {!isChecking ? (
      <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
    ) : (
      <CheckCircle2
        size={14}
        className="shrink-0 text-[#278f69]"
      />
    )}

    <span className="truncate">
      {!isChecking ? "Loading..." : "Completed"}
    </span>
  </span>

  {isChecking && (
    <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#d9f5e9] px-1.5 text-[10px] font-bold text-[#278f69]">
      {completedCount}
    </span>
  )}
</button>


        </div>
      </div>

      {/* =================================================
          FEEDBACK MONTH
      ================================================= */}

       
      <div className="min-w-0">
        <div className="relative">
                        <select
                          value={SelectedServiceStates}
                          onChange={(e) => setSelectedServiceStates(e.target.value)}
                          className="w-full text-center h-10 appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-700 outline-none transition-all hover:border-gray-400 focus:border-[#1392d3] focus:ring-2 focus:ring-[#1392d3]/20"
                        >
                        
                    
                          {IndianStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                    
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                      </div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Feedback Month
        </p>

        <div className="grid grid-cols-2 gap-2">

          <select
            value={selectedMonth}
            onChange={
              
              // (e)=>GetMonthFreshData(e.target.value)
       (e) => {       setSelectedMonth(Number(e.target.value))}
              
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
    <LoadingPopup
              open={isSwitchingMonth}
              title="Switching Month"
              description="Updating dashboard data..."
            />
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

  feedbackSections={feedbackSections}

  getUserId={getUserId}
  getCompletedSectionIds={getCompletedSectionIds}

  onStartFeedback={handleStartFeedback}
  onViewFeedback={handleViewFeedback}
  getFeedbackStatus={getHCAFeedbackStatus}
  getAvailableSections={getAvailableSections}
  getCompletedSectionsCount={getCompletedSectionsCount}
  getCompletedMainSectionsCount={getCompletedMainSectionsCount}
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
feedbackSections: FeedbackSection[]; // ADD THIS
  getUserId: (item: any) => string;

  getCompletedSectionIds: (
    userId: string
  ) => string[];

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

  getCompletedMainSectionsCount: (
    item: any
  ) => number;

  hasSavedFeedback: (
    item: any
  ) => boolean;
}

const HCATable: React.FC<HCATableProps> = ({
  data,
  UserFullInfo,
   feedbackSections,
  getUserId,
  getCompletedSectionIds,
  onStartFeedback,
  onViewFeedback,
  getFeedbackStatus,
  getAvailableSections,
  getCompletedSectionsCount,
  getCompletedMainSectionsCount,
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
const mainRoles: FeedbackRole[] = [
  "Role 1",
  "Role 2",
  "HCA Status Review",
  "Role 3",
  "Random HCA Call",
  "Termination",
];

const applicableRoles: FeedbackRole[] = mainRoles.filter(
  (role: FeedbackRole) =>
    feedbackSections.some(
      (section: FeedbackSection) =>
        section.role === role &&
        section.visibleFor.includes(status)
    )
);
const applicableCount = applicableRoles.length;
const completedCount = Math.min(
  getCompletedMainSectionsCount(item),
  applicableCount
);
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
                      )||item.FirstName}
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
                        GetPermanentState(UserFullInfo, item?.userId) ||
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
  UserFullInfo: any;
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
  UserFullInfo,
  existingFeedback,
  onBack,
  onSave,
}) => {
  const [popupMessage, setPopupMessage] = useState("");
  const [answers, setAnswers] =
    useState<
      Record<string, string>
    >({});
const [DownloadMessage, setDownloadMessage] = useState("");
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
  if (mode !== "view" || !existingFeedback) {
    return;
  }

  // Support the records structure returned by GetQualityStatus.
  const records = Array.isArray(existingFeedback?.records)
    ? existingFeedback.records
    : [];

  // Keep compatibility with the existing role-based structure.
  const legacyRoles = [
    existingFeedback?.Role1?.data,
    existingFeedback?.Role2?.data,
    existingFeedback?.Role3?.data,
    existingFeedback?.RandomHCA?.data ||
      existingFeedback?.RandomHCACall?.data,
    existingFeedback?.Termination?.data ||
      existingFeedback?.Termination,
  ].filter(Boolean);

  const savedRoles = [...records, ...legacyRoles];

  const mergedAnswers: Record<string, string> = {};
  const mergedRecordings: Record<string, AudioRecording> = {};

  savedRoles.forEach((record: any) => {
    if (record?.answers && typeof record.answers === "object") {
      Object.assign(mergedAnswers, record.answers);
    }

    if (
      record?.recordings &&
      typeof record.recordings === "object"
    ) {
      Object.assign(mergedRecordings, record.recordings);
    }
  });

  const savedAudio =
    [...savedRoles]
      .reverse()
      .find((record: any) => record?.Recording)?.Recording ||
    null;

  setAnswers(mergedAnswers);
  setRecordings(mergedRecordings);
  setAudioFile(savedAudio);
}, [mode, existingFeedback]);

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

  const UserFullInfo = useSelector(
    (state: any) => state.AdminFullInfo
  );
    const missingQuestion =
      section.questions.find(
        (question) =>
          !String(
            answers[
              question.id
            ] || ""
          ).trim()
      );

    if (
      missingQuestion
    ) {
      setPopupMessage(
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
        setPopupMessage(
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

      setPopupMessage(
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
          !String(
            answers[question.id] || ""
          ).trim()
      );

    if (missingQuestion) {
      setPopupMessage(
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
      setPopupMessage("HCA UserId is missing.");
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

    setPopupMessage(
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
        !String(
          answers[question.id] || ""
        ).trim()
    );

    if (missingQuestion) {
      setPopupMessage(
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
      setPopupMessage("HCA UserId is missing.");
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

    setPopupMessage(
      "Failed to save Role 3 feedback. Please try again."
    );
  } finally {
    setIsSaving(false);
  }
};

const handleSaveAllFeedback = async () => {
  let operationLog = "";
  const reportOperation = (operation: string) => {
    operationLog = operationLog
      ? `${operationLog}\n${operation}`
      : operation;
    setPopupMessage(operationLog);
  };

  reportOperation("Save all feedback started.");

  if (mode === "view") {
    reportOperation("Save cancelled: feedback is in view-only mode.");
    return;
  }

  reportOperation("Checking required questions...");
  for (const section of sections) {
    reportOperation(`Checking ${section.title || section.role}...`);
    const missingQuestion = section.questions.find(
      (question) => !String(answers[question.id] || "").trim()
    );

    if (missingQuestion) {
      reportOperation(`Validation failed. Please answer: ${missingQuestion.question}`);
      setOpenSections((previous) => ({
        ...previous,
        [section.id]: true,
      }));
      const roleIndex = [
        "Role 1",
        "Role 2",
        "HCA Status Review",
        "Role 3",
        "Random HCA Call",
        "Termination",
      ]
        .filter((role) => sections.some((item) => item.role === role))
        .indexOf(section.role);
      if (roleIndex >= 0) setCurrentSlide(roleIndex);
      return;
    }
  }

  reportOperation("All required questions are answered.");

  try {
    setIsSaving(true);
    reportOperation("Preparing feedback for saving...");

    const userId = String(
      hca?.userId || hca?._id || hca?.id || ""
    );

    if (!userId) {
      reportOperation("Save stopped: HCA UserId is missing.");
      return;
    }

    const feedback: SavedFeedback = {
      UserId: userId,
      ClientId: String(hca?.ClientId || ""),
      SectionId: "hca-feedback",
      Role: "HCA Feedback",
      answers,
      recordings,
      Recording: AudioFile,
      completedAt: new Date().toISOString(),
      Month: `${selectedMonth}-${selectedYear}`,
      Type: "HCA",
    };

    reportOperation("Sending feedback to the server...");
    const response = await axios.post("/api/QualityPost", { feedback });

    if (!response?.data?.success) {
      throw new Error("HCA feedback was not saved");
    }

    reportOperation("Feedback saved successfully.");
    onSave(feedback);
  } catch (error) {
    console.error("Save all HCA feedback failed:", error);
    reportOperation("Save failed. Please try again.");
  } finally {
    setIsSaving(false);
    reportOperation("Save operation finished.");
  }
};

const downloadPDF = async (
  ImpFileName: string,
  activeRole?: FeedbackRole
) => {
  try {
    setDownloadMessage(`Please Wait Preparing ${ImpFileName} Feedback.......`);

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
 const logoDataUrl="/Icons/Curate-logoq.png"
  
    try {
   
    } catch (logoError) {
      console.warn("Could not load the company logo for the PDF:", logoError);
    }

    const addPageIfNeeded = (heightNeeded = 10) => {
      if (y + heightNeeded > pageHeight - 15) {
        doc.addPage();
        y = 18;
      }
    };

    // Company logo and title
    if (logoDataUrl ) {
      doc.addImage(logoDataUrl,  margin, 8, 26, 18);
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${ImpFileName} - HCA Feedback`,
      logoDataUrl ? margin + 31 : margin,
      y
    );

    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Month: ${selectedMonth}-${selectedYear}`,
      margin,
      y
    );

    y += 10;

    /*
     * =====================================================
     * QUESTIONS + ANSWERS ONLY
     * =====================================================
     */

    // Export only the role currently displayed, except Random HCA Call,
    // which intentionally retains the full-feedback export.
    const sectionsToDownload =
      activeRole && activeRole !== "Random HCA Call"
        ? sections.filter((section) => section.role === activeRole)
        : sections;

    sectionsToDownload.forEach((section) => {
      addPageIfNeeded(15);

      // Role / Section heading
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");

      const sectionTitle = doc.splitTextToSize(
        section.title,
        contentWidth
      );

      doc.text(sectionTitle, margin, y);

      y += sectionTitle.length * 6 + 5;

      section.questions.forEach((question, index) => {
        const answer =
          String(answers?.[question.id] || "").trim() ||
          "No answer recorded";

        /*
         * QUESTION
         */
        addPageIfNeeded(20);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        const questionText =
          `${index + 1}. ${question.question}`;

        const questionLines =
          doc.splitTextToSize(
            questionText,
            contentWidth
          );

        doc.text(
          questionLines,
          margin,
          y
        );

        y += questionLines.length * 5 + 3;

        /*
         * ANSWER
         */
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

    doc.save(`${ImpFileName}-Feedback.pdf`);

    setDownloadMessage(
      `Downloaded ${ImpFileName} Feedback`
    );

    setTimeout(() => {
      setDownloadMessage("");
    }, 5000);

  } catch (error: any) {
    console.error(
      "Download PDF Error:",
      error
    );

    setPopupMessage(
      error?.message ||
        "Failed to download feedback."
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
          !String(
            answers[question.id] || ""
          ).trim()
      );

    if (missingQuestion) {
      setPopupMessage(
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
      setPopupMessage("HCA UserId is missing.");
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

    setPopupMessage(
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
     

      const file =
        e.target.files?.[0];

      

      if (!file) {
        setPopupMessage(
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
        setPopupMessage(
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
        setPopupMessage(
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
      <PopupMessage message={popupMessage} onClose={() => setPopupMessage("")} />

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
                Complete all feedback sections, then submit once on the final slide.
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
  value={GetHCPFullName(UserFullInfo, hca?.userId) || "Not Provided"}
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
  "HCA Status Review",
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
          "HCA Status Review": "HCA Status Review — Complete All Questions",
          "Random HCA Call": "Random HCA Call — Complete All Questions",
          "Termination": "Termination — Complete All Questions",
          "HCA Feedback": ""
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
               
{DownloadMessage && (
  <div className="fixed right-5 top-5 z-[9999] w-[340px] max-w-[calc(100vw-2rem)]">
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-xl ring-1 ring-slate-900/5">
      
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          DownloadMessage.includes("Downloaded")
            ? "bg-emerald-50 text-emerald-600"
            : "bg-blue-50 text-[#1392d3]"
        }`}
      >
        {DownloadMessage.includes("Downloaded") ? (
          <CheckCircle2 size={20} strokeWidth={2.5} />
        ) : (
          <Download size={20} strokeWidth={2.5} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-800">
          {DownloadMessage.includes("Downloaded")
            ? "Download Complete"
            : "Preparing Download"}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {DownloadMessage.includes("Downloaded")
            ? DownloadMessage
            : DownloadMessage}
        </p>
      </div>

    </div>
  </div>
)}
                </div>
<div className="flex flex-wrap items-center gap-2">
  {availableRoles.map((role, index) => (
    <button
      key={role}
      type="button"
      onClick={() => {
        setCurrentSlide(index);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
        index === currentSlide
          ? "border-[#1392d3] bg-[#1392d3] text-white shadow-sm"
          : index < currentSlide
            ? "border-[#50c896] bg-[#50c896]/10 text-[#278f69] hover:border-[#50c896] hover:bg-[#50c896]/20"
            : "border-[#f2c94c] bg-[#fff8dc] text-[#b7791f] hover:border-[#f2c94c] hover:bg-[#fff1b8]"
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
        {index + 1}
      </span>

      <span className="hidden sm:inline">
        {role}
      </span>
    </button>
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
    {mode === "view" && (
  <button
    onClick={() =>
      downloadPDF(
        `${hca?.FirstName || ""} ${hca?.Surname || ""}`.trim(),
        activeRole
      )
    }
    type="button"
    className="inline-flex min-h-8 cursor-pointer items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold shadow-sm transition-all"
    style={{
      borderColor: "#1392d3",
      backgroundColor: "#ffffff",
      color: "#1392d3",
    }}
  >
    <Download size={17} />
    Download
  </button>
)}

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
                  <span
  className="
    mr-2 inline-flex items-center justify-center
    rounded-md
    bg-gradient-to-r from-[#e8f4fb] to-[#dff1fa]
    px-2 py-0.5
    text-xs font-extrabold
    text-[#1392d3]
    shadow-sm
    ring-1 ring-[#1392d3]/10
    align-middle
  "
>
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
        {mode === "create" && (
          <button
            type="button"
            disabled={isSaving}
            onClick={() => {
              if (isLastSlide) {
                handleSaveAllFeedback();
              } else {
                goToNextSlide();
              }
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: "#50c896", color: "#ffffff" }}
          >
            {isSaving ? <Save size={17} /> : <Check size={17} />}
            {isSaving
              ? "Saving All Feedback..."
              : isLastSlide
                ? "Submit All Feedback"
                : "Next Role"}
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