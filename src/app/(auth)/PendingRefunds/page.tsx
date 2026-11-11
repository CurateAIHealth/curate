"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Search,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CalendarDays,
  Users,
  MapPin,
  Wallet,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Eye,
  X,
  RefreshCw,
  List,
  Minimize2,
  Info,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import {
  GetInvoiceInfoforInvoicePage,
  GetInvoiceInfoforAdvanceFilterInvoicePage,
} from "@/Lib/user.action";
import { getDaysInMonth, parseFlexibleDate, rupeeToNumber } from "@/Lib/Actions";
import { LoadingData } from "@/Components/Loading/page";
import { IndianStates, teams } from "@/Lib/Content";
import EmptyState from "@/Components/NoDeployments/page";
import axios from "axios";

type RefundStatus =
  | "Pending Refund"
  | "Partially Refunded"
  | "Completed Refund"
  | "No Refund";

const REFUND_STATUS_OPTIONS = [
  "All",
  "Pending Refund",
  "Partially Refunded",
  "Completed Refund",
  "No Refund",
] as const;
const getDateKey = (value: any): string => {
  const date = parseDateOnly(value);

  return date
    ? date.toISOString().split("T")[0]
    : "";
};
const parseDateOnly = (value: any): Date | null => {
  if (!value) return null;

  if (value instanceof Date) {
    if (isNaN(value.getTime())) return null;

    return new Date(
      Date.UTC(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate()
      )
    );
  }

  const str = String(value).trim();

  let year: number;
  let month: number;
  let day: number;

  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    [year, month, day] = str
      .slice(0, 10)
      .split("-")
      .map(Number);
  } else {
    [day, month, year] = str
      .split(/[/-]/)
      .map(Number);
  }

  if (!year || !month || !day) return null;

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};
const getInclusiveDays = (
  start: any,
  end: any
): number => {
  const startDate = parseDateOnly(start);
  const endDate = parseDateOnly(end);

  if (
    !startDate ||
    !endDate ||
    endDate < startDate
  ) {
    return 0;
  }

  return (
    Math.floor(
      (endDate.getTime() - startDate.getTime()) /
        86400000
    ) + 1
  );
};
const formatCurrency = (value: unknown) =>
  `₹${(Number(value) || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value: unknown) => {
  if (!value) return "-";
  const parsed =
    value instanceof Date
      ? value
      : parseFlexibleDate(value as string);

  if (!parsed || Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getRefundStatus = (record: any): RefundStatus => {
  const refundAmount = Number(record?.RefundAmount || 0);
  const refundDays = Number(record?.RefundDays || 0);
  const hasRefundDate = Boolean(record?.RefundDate);

  if (refundAmount > 0 && hasRefundDate) return "Completed Refund";
  if (refundAmount > 0) return "Partially Refunded";
  if (refundDays > 0) return "Pending Refund";

  return "No Refund";
};

const statusClasses: Record<RefundStatus, string> = {
  "Pending Refund": "border-amber-200 bg-amber-50 text-amber-700",
  "Partially Refunded": "border-blue-200 bg-blue-50 text-blue-700",
  "Completed Refund": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "No Refund": "border-slate-200 bg-slate-100 text-slate-600",
};

const statusIcon = (status: RefundStatus) => {
  switch (status) {
    case "Pending Refund":
      return <Clock3 size={13} />;
    case "Partially Refunded":
      return <AlertCircle size={13} />;
    case "Completed Refund":
      return <CheckCircle2 size={13} />;
    default:
      return <X size={13} />;
  }
};
function DayBadge({ status }: { status: any }) {
 
  const Wrapper = ({ children }: any) => (
    <div className="flex items-center justify-center w-full">
      {children}
    </div>
  );

  if (status === "P"||status === "Present") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 text-emerald-600 bg-white shadow-sm">
       P
        </span>
      </Wrapper>
    );
  }

  if (status === "HP"||status === "Half Day") {
    return (
      <Wrapper>
        <div className="relative w-8 h-8 rounded-full border-2 border-emerald-500 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-semibold text-emerald-600">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-emerald-500" />
          <span className="relative z-10">HP</span>
        </div>
      </Wrapper>
    );
  }

  if (status === "A"||status === "Absent") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 border-rose-600 text-rose-600 bg-white shadow-sm">
          {status}
        </span>
      </Wrapper>
    );
  }

  if (status === "NA") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 border-gray-500 text-gray-600 bg-white shadow-sm">
          {status}
        </span>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border border-gray-400 text-gray-500 bg-white shadow-sm">
        {status}
      </span>
    </Wrapper>
  );
}
function StatusBadge({ status }: { status: RefundStatus }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClasses[status]}`}
    >
      {statusIcon(status)}
      {status}
    </span>
  );
}

function KpiCard({
  title,
  value,
  helper,
  icon,
  tone,
}: {
  title: string;
  value: string | number;
  helper: string;
  icon: ReactNode;
  tone: "teal" | "blue" | "amber" | "green" | "slate" | "violet";
}) {
  const tones = {
    teal: "bg-teal-50 text-teal-700 ring-teal-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">{helper}</p>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function RefundManagementPage() {
  const now = new Date();

  // Existing filter state and behavior retained.
  const [monthFilter, setMonthFilter] = useState<any>(now.getMonth() + 1);
  const [activeTeam, setActiveTeam] = useState<number | "All">("All");
  const [yearFilter, setYearFilter] = useState(String(now.getFullYear()));
  const [SelectedServiceStates, setSelectedServiceStates] =
    useState("Telangana");
const [EndDate,setEndDate]=useState()
const [ImpServiceCharge,setImpServiceCharge]=useState(0)
  const [attendanceError, setAttendanceError] = useState("");
  const [ClientAttendanceInfo,setClientAttendanceInfo]=useState<any>()
  const [isAttendanceLoading, setIsAttendanceLoading] = useState<any | null>(null);
  const [FetchedInfo, setFetchedInfo] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [refundStatusFilter, setRefundStatusFilter] =
    useState<(typeof REFUND_STATUS_OPTIONS)[number]>("All");
  const [page, setPage] = useState(1);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [isAdvancedFilterActive, setIsAdvancedFilterActive] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterMessage, setFilterMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [ShowUpdateAttendece, SetShowUpdateAttendece] = useState(false)
      const [AttenseceInformation, setAttenseceInformation] = useState<any>()
         const [AbsentReason, setAbsentReason] = useState("")
           const [EditDate, setEditDate] = useState<any>()
     const loggedInEmail = useSelector((state: any) => state.LoggedInEmail)
     const [status, setStatus] = useState("Active");
       const [ActionStatusMessage, SetActionStatusMessage] = useState<any>("");
         const month = useSelector((state: any) => state.FilterMonth)
         const year = useSelector((state: any) => state.FilterYear)
  const RegUserInfo = useSelector((state: any) => state.AdminUsers);
  const Router = useRouter();
  const pageSize = 10;

  const getTeamNumber = useCallback(
    (clientId: any) => {
      if (!Array.isArray(RegUserInfo) || !clientId) return "Not Entered";

      const patient = RegUserInfo.find(
        (user: any) =>
          user?.userType === "patient" && user?.userId === clientId
      );

      return patient?.Team != null ? Number(patient.Team) : "Not Entered";
    },
    [RegUserInfo]
  );

  const refreshRefunds = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) setIsChecking(true);
        else setIsRefreshing(true);

        setLoadError("");

        const response: any = await GetInvoiceInfoforInvoicePage(
          monthFilter,
          yearFilter
        );

        const refundRecords = Array.isArray(response)
          ? response.filter(
              (item: any) =>
                Number(item?.RefundAmount || 0) > 0 ||
                Boolean(item?.RefundDate) ||
                Number(item?.RefundDays || 0) > 0 ||
                (Array.isArray(item?.HACAttendeceforRefund) &&
                  item.HACAttendeceforRefund.length > 0)
            )
          : [];

        setFetchedInfo(refundRecords);
      } catch (error) {
        console.error("Error fetching refund records:", error);
        setLoadError("Unable to load refund records. Please try again.");
      } finally {
        if (showLoader) setIsChecking(false);
        setIsRefreshing(false);
      }
    },
    [monthFilter, yearFilter]
  );

  useEffect(() => {
    if (Array.isArray(RegUserInfo) && RegUserInfo.length === 0) {
      Router.push("/");
      return;
    }

    refreshRefunds(true);
  }, [monthFilter, yearFilter, RegUserInfo, Router, refreshRefunds]);

  const getAdvanceFilterData = async () => {
    if (!fromDate || !toDate) {
      setFilterMessage("Please select both From Date and To Date.");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setFilterMessage("From Date cannot be after To Date.");
      return;
    }

    try {
      setFilterMessage("Fetching refund records...");

      const response = await GetInvoiceInfoforAdvanceFilterInvoicePage(
        fromDate,
        toDate
      );

      const refundRecords = Array.isArray(response)
        ? response.filter(
            (item: any) =>
              Number(item?.RefundAmount || 0) > 0 ||
              Boolean(item?.RefundDate) ||
              Number(item?.RefundDays || 0) > 0 ||
              (Array.isArray(item?.HACAttendeceforRefund) &&
                item.HACAttendeceforRefund.length > 0)
          )
        : [];

      setFetchedInfo(refundRecords);
      setIsAdvancedFilterActive(true);
      setPage(1);
      setFilterMessage(`${refundRecords.length} refund records found.`);
      setShowAdvancedFilter(false);
    } catch (error) {
      console.error("Advanced refund filter error:", error);
      setFilterMessage("Failed to fetch refund records.");
    }
  };


const EditAttendence = async (): Promise<void> => {
  if (!AttenseceInformation?.Client_Id || !EditDate) {
    SetActionStatusMessage("Attendance information is missing");
    return;
  }

  if (!status) {
    SetActionStatusMessage("Please select a valid status");
    return;
  }

  try {
    SetActionStatusMessage("Updating attendance...");

    const payload = {
      Client_Id: AttenseceInformation.Client_Id,
      Client_Name: AttenseceInformation.Client_Name,
      HCA_Id: AttenseceInformation.HCA_Id,
      HCA_Name: AttenseceInformation.HCA_Name,
      date: EditDate,
      status,
      Reason:
        status === "Absent" || status === "Half Day"
          ? AbsentReason
          : "",
      UpdatedBy: loggedInEmail,
    };

    // 1. Update attendance in database
    const response = await axios.post(
      "/api/UpdateClientAttendanceStatus",
      payload
    );

    if (
      response.status < 200 ||
      response.status >= 300 ||
      !response.data ||
      typeof response.data !== "object" ||
      response.data.success !== true
    ) {
      SetActionStatusMessage(
        response.data?.message || "Attendance update failed"
      );
      return;
    }

    // 2. Update the selected attendance record
    const updatedRecord = {
      ...AttenseceInformation,
      dateKey: EditDate,
      AttendanceDate: EditDate,
      Status: status,
      Reason: payload.Reason,
      UpdatedBy: loggedInEmail,
      UpdatedAt: response.data.updatedAt || new Date().toISOString(),
    };

    // 3. Update local attendance array
    const rawCurrentAttendance = ClientAttendanceInfo?.ClientAttendance;
    const currentAttendance = Array.isArray(rawCurrentAttendance)
      ? rawCurrentAttendance
      : rawCurrentAttendance && typeof rawCurrentAttendance === "object"
        ? [rawCurrentAttendance]
        : [];

    const attendanceIndex = currentAttendance.findIndex(
      (item: any) =>
        getDateKey(item?.dateKey || item?.AttendanceDate) === EditDate
    );

    let updatedAttendance: any[];

    if (attendanceIndex !== -1) {
      updatedAttendance = currentAttendance.map(
        (item: any, index: number) =>
          index === attendanceIndex
            ? { ...item, ...updatedRecord }
            : item
      );
    } else {
      updatedAttendance = [...currentAttendance, updatedRecord];
    }

    // 4. Recalculate refund details using updated attendance
    const startDate = ClientAttendanceInfo?.StartDate;
    const endDate = EndDate || ClientAttendanceInfo?.EndDate;

    const totalServiceDays = getInclusiveDays(
      startDate,
      endDate
    );

    const startKey = getDateKey(startDate);
    const endKey = getDateKey(endDate);

    // Count unique Present dates
    const presentDateKeys = new Set<string>();

    updatedAttendance.forEach((attendance: any) => {
      const dateKey = getDateKey(
        attendance?.dateKey || attendance?.AttendanceDate
      );

      const attendanceStatus = String(
        attendance?.Status || ""
      ).trim().toLowerCase();

      if (
        dateKey &&
        dateKey >= startKey &&
        dateKey <= endKey &&
        attendanceStatus === "present"
      ) {
        presentDateKeys.add(dateKey);
      }
    });

    const presentDays = presentDateKeys.size;

    // Refund calculations
    const RefundDays = Math.max(
      0,
      totalServiceDays - presentDays
    );

    const serviceCharge =
      ImpServiceCharge ?? ClientAttendanceInfo?.ServiceCharge ?? 0;
    const perDayCharge = Number(
      rupeeToNumber(serviceCharge).toFixed(2)
    );

    const ServiceBill = Number(
      (presentDays * perDayCharge).toFixed(2)
    );

    const ClientRefundAmount = Number(
      (RefundDays * perDayCharge).toFixed(2)
    );

    // 5. Update attendance dashboard immediately
    const updatedClientAttendanceInfo = {
      ...ClientAttendanceInfo,
      ClientAttendance: updatedAttendance,
      PresentDays: presentDays,
      TotalServiceDays: totalServiceDays,
      RefundDays,
      ServiceBill,
      RefundAmount: ClientRefundAmount,
    };

    setClientAttendanceInfo(updatedClientAttendanceInfo);

    // Update selected record
    setAttenseceInformation(updatedRecord);

    // 6. Update matching invoice/refund record locally
    setFetchedInfo((previous: any[]) =>
      previous.map((invoice: any) => {
        const invoiceClientId =
          invoice?.ClienId ??
          invoice?.Client_Id ??
          invoice?.ClientId ??
          invoice?.ClientID;

        const invoiceStartDate =
          invoice?.SeriviceStartDate ??
          invoice?.ServiceStartDate ??
          invoice?.StartDate ??
          invoice?.DeployDate;

        const isSameClient =
          String(invoiceClientId) ===
          String(ClientAttendanceInfo?.ClientId);

        const isSameService =
          getDateKey(invoiceStartDate) ===
          getDateKey(startDate);

        if (!isSameClient || !isSameService) {
          return invoice;
        }

        const updatedInvoice = {
          ...invoice,

          // Recalculated attendance details
          PresentDays: presentDays,
          TotalServiceDays: totalServiceDays,
          RefundDays,

          // Recalculated financial details
          ServiceBill,
          RefundAmount: ClientRefundAmount,

          // Updated attendance records
          HACAttendeceforRefund: updatedAttendance,
        };

        return {
          ...updatedInvoice,
          RefundStatus: getRefundStatus(updatedInvoice),
        };
      })
    );

    // Also update an already-open refund details modal
    setSelectedRefund((previous: any) => {
      if (!previous) return previous;

      const previousClientId =
        previous?.ClienId ??
        previous?.Client_Id ??
        previous?.ClientId ??
        previous?.ClientID;

      const previousStartDate =
        previous?.SeriviceStartDate ??
        previous?.ServiceStartDate ??
        previous?.StartDate ??
        previous?.DeployDate;

      if (
        String(previousClientId) !==
          String(ClientAttendanceInfo?.ClientId) ||
        getDateKey(previousStartDate) !== getDateKey(startDate)
      ) {
        return previous;
      }

      const updatedRefund = {
        ...previous,
        PresentDays: presentDays,
        TotalServiceDays: totalServiceDays,
        RefundDays,
        ServiceBill,
        RefundAmount: ClientRefundAmount,
        HACAttendeceforRefund: updatedAttendance,
      };

      return {
        ...updatedRefund,
        RefundStatus: getRefundStatus(updatedRefund),
      };
    });

    console.log("REFUND RECALCULATION:", {
      totalServiceDays,
      presentDays,
      RefundDays,
      perDayCharge,
      ServiceBill,
      ClientRefundAmount,
    });


    const data={
       Client_Id:AttenseceInformation.Client_Id,
      StartDate:ClientAttendanceInfo?.StartDate,
      ClientRefundAmount,
   
      RefundDays:RefundDays,
    
      
HCA_Id:AttenseceInformation.HCA_Id
    }
    const updateresponse = await axios.post("/api/RefundfromPendingrefund", {
      data,
    });
    if (
      updateresponse.status < 200 ||
      updateresponse.status >= 300 ||
      !updateresponse.data ||
      typeof updateresponse.data !== "object" ||
      updateresponse.data.success !== true
    ) {
      const refundMessage =
        typeof updateresponse.data?.message === "string"
          ? updateresponse.data.message
          : "Refund update failed";
      console.error("Refund update rejected after attendance was saved", {
        status: updateresponse.status,
      });
      SetActionStatusMessage(
        `Attendance was updated, but the refund update failed: ${refundMessage}`
      );
      return;
    }
    SetActionStatusMessage(
      "Attendance and refund calculations updated successfully"
    );

    setTimeout(() => {
      SetShowUpdateAttendece(false);
      SetActionStatusMessage("");
      setAbsentReason("");
    }, 1500);

  } catch (error: any) {
    console.error("EditAttendence Error:", error);

    const attendanceWasUpdated =
      error?.config?.url?.includes("RefundfromPendingrefund");
    SetActionStatusMessage(
      attendanceWasUpdated
        ? `Attendance was updated, but the refund update failed: ${error?.response?.data?.message || error?.message || "Please retry."}`
        : error?.response?.data?.message ||
            error?.message ||
            "Something went wrong while updating attendance"
    );
  }
};


  const refundRecords = useMemo(() => {
    return FetchedInfo.map((item: any) => {
      const clientId =
        item?.ClienId ??
        item?.Client_Id ??
        item?.ClientId ??
        item?.ClientID ??
        "";

      const serviceStartDate =
        item?.SeriviceStartDate ??
        item?.ServiceStartDate ??
        item?.StartDate ??
        item?.DeployDate ??
        "";

      const serviceAmount =
        Number(item?.RoundedTotal) ||
        Number(item?.TotalServiceAmount) ||
        Number(item?.CareTakeChare || item?.CareTakeCharge || 0) +
          Number(item?.RegistrationFee || 0);

      return {
        ...item,
        ClientId: clientId,
        ClientName: item?.ClientName || item?.name || item?.Patient || "-",
        PatientName: item?.Patient || item?.patientName || item?.name || "-",
        ServiceStartDate: serviceStartDate,
        ServiceState:
          !item?.ServiceState || item.ServiceState === "Not Provided"
            ? "Telangana"
            : item.ServiceState,
        Team: getTeamNumber(clientId),
        TotalServiceAmount: serviceAmount,
        RefundAmount: Number(item?.RefundAmount || 0),
        RefundDays: Number(item?.RefundDays || 0),
        RefundDate: item?.RefundDate || "",
        HACAttendeceforRefund: Array.isArray(item?.HACAttendeceforRefund)
          ? item.HACAttendeceforRefund
          : [],
        RefundStatus: getRefundStatus(item),
      };
    });
  }, [FetchedInfo, getTeamNumber]);

  const filteredRefunds = useMemo(() => {
    let data = [...refundRecords];

    // Existing Month + Year filtering retained.
    if (
      !isAdvancedFilterActive &&
      (monthFilter !== "All" || yearFilter !== "All")
    ) {
      data = data.filter((item: any) => {
        const date = parseFlexibleDate(
          item?.ServiceStartDate ??
            item?.SeriviceStartDate ??
            item?.StartDate ??
            item?.DeployDate
        );

        if (!date) return false;

        const monthMatches =
          monthFilter === "All" ||
          date.getMonth() + 1 === Number(monthFilter);

        const yearMatches =
          yearFilter === "All" ||
          date.getFullYear() === Number(yearFilter);

        return monthMatches && yearMatches;
      });
    }

    // Client name and client ID search.
    if (search.trim()) {
      const query = search.trim().toLowerCase();

      data = data.filter((item: any) => {
        const clientName = String(item?.ClientName || "").toLowerCase();
        const patientName = String(item?.PatientName || "").toLowerCase();
        const clientId = String(item?.ClientId || "").toLowerCase();
        const contact = String(item?.contact || "").toLowerCase();

        return (
          clientName.includes(query) ||
          patientName.includes(query) ||
          clientId.includes(query) ||
          contact.includes(query)
        );
      });
    }

    if (refundStatusFilter !== "All") {
      data = data.filter(
        (item: any) => item.RefundStatus === refundStatusFilter
      );
    }

    // Existing Service State filter retained.
    if (SelectedServiceStates !== "All") {
      data = data.filter(
        (item: any) => item.ServiceState === SelectedServiceStates
      );
    }

    // Existing Team filter retained.
    if (activeTeam !== "All") {
      data = data.filter((item: any) => item.Team === activeTeam);
    }

    return data;
  }, [
    refundRecords,
    isAdvancedFilterActive,
    monthFilter,
    yearFilter,
    search,
    refundStatusFilter,
    SelectedServiceStates,
    activeTeam,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRefunds.length / pageSize));
  const paginatedRefunds = filteredRefunds.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const requestedMonth = Number(month ?? monthFilter);
  const requestedYear = Number(year ?? yearFilter);
  const calendarMonth =
    Number.isInteger(requestedMonth) && requestedMonth >= 1 && requestedMonth <= 12
      ? requestedMonth
      : now.getMonth() + 1;
  const calendarYear =
    Number.isInteger(requestedYear) && requestedYear >= 1
      ? requestedYear
      : now.getFullYear();
  const NumberOfDaysInMonth = getDaysInMonth(calendarMonth, calendarYear);
  useEffect(() => {
    setPage(1);
  }, [
    search,
    refundStatusFilter,
    SelectedServiceStates,
    activeTeam,
    monthFilter,
    yearFilter,
    isAdvancedFilterActive,
  ]);

  const totalRefundAmount = filteredRefunds.reduce(
    (sum: number, item: any) => sum + Number(item.RefundAmount || 0),
    0
  );

  const pendingRefunds = filteredRefunds.filter(
    (item: any) => item.RefundStatus === "Pending Refund"
  );
  const partialRefunds = filteredRefunds.filter(
    (item: any) => item.RefundStatus === "Partially Refunded"
  );
  const completedRefunds = filteredRefunds.filter(
    (item: any) => item.RefundStatus === "Completed Refund"
  );

  // Uses recorded refund amounts for records not marked as completed.
  // No estimated or hardcoded refund amount is generated.
  const pendingRefundAmount = filteredRefunds.reduce(
    (sum: number, item: any) =>
      item.RefundStatus === "Pending Refund" ||
      item.RefundStatus === "Partially Refunded"
        ? sum + Number(item.RefundAmount || 0)
        : sum,
    0
  );

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: 11 },
    (_, index) => currentYear - 5 + index
  );



  const resetAdvancedFilter = () => {
    setIsAdvancedFilterActive(false);
    setFromDate("");
    setToDate("");
    setFilterMessage("");
    refreshRefunds(true);
  };

const GetClientAttendance = async (item: any) => {
  setIsAttendanceLoading(item.ClientId);
  setAttendanceError("");

  try {
    const response = await axios.post(
      "/api/GetTerminalClientAttendance",
      {
        ClientId: item.ClientId,
        HCAid: item.HCAId,
        StartDate: item.SeriviceStartDate,
      }
    );

  

    const body = response?.data;
    if (
      response.status < 200 ||
      response.status >= 300 ||
      !body ||
      typeof body !== "object" ||
      body.success !== true
    ) {
      throw new Error(
        typeof body?.message === "string"
          ? body.message
          : "The attendance service returned an invalid response."
      );
    }

      const rawAttendance = body.ClientAttendance;
      const attendanceContainer =
        rawAttendance && typeof rawAttendance === "object" && !Array.isArray(rawAttendance)
          ? rawAttendance
          : {};

      // Normalize attendance into an array
      const attendanceArray = Array.isArray(rawAttendance)
        ? rawAttendance
        : Array.isArray(attendanceContainer.ClientAttendance)
          ? attendanceContainer.ClientAttendance
          : Array.isArray(attendanceContainer.attendance)
            ? attendanceContainer.attendance
            : Array.isArray(attendanceContainer.data)
              ? attendanceContainer.data
            : rawAttendance && typeof rawAttendance === "object"
              ? (rawAttendance.dateKey || rawAttendance.AttendanceDate || rawAttendance.Status)
                ? [rawAttendance]
                : []
              : [];

      const serviceEndDate =
        attendanceContainer.EndDate ?? body.EndDate ?? body.endDate ?? item.EndDate;
      const serviceCharge =
        attendanceContainer.ServiceCharge ??
        body.ServiceCharge ??
        body.serviceCharge ??
        item.ServiceCharge;
      if (!serviceEndDate || serviceCharge == null || !Number.isFinite(rupeeToNumber(serviceCharge))) {
        throw new Error("Attendance response is missing the service end date or service charge.");
      }

      const UpdatedClientData = {
        ClientAttendance: attendanceArray,
        ClientId: item.ClientId,
        EndDate: serviceEndDate,
        HCA_Id: item.HCAId,
        ServiceCharge: serviceCharge,
        StartDate: item.SeriviceStartDate,
        TimeSheetAttendence: item.TimeSheetAttendence,

        clientName: item.ClientName,
        contact: item.contact,
        hcaName: item.HCA_Name,
        location: "Manikonda",
        status: "Terminated",
      };

      setEndDate(serviceEndDate as any);
      setImpServiceCharge(rupeeToNumber(serviceCharge));
      setClientAttendanceInfo(UpdatedClientData);
      return attendanceArray;
  } catch (error) {
    console.error("Attendance API request failed", {
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    setAttendanceError(
      axios.isAxiosError(error)
        ? error.response?.data?.message || "Unable to load attendance. Please try again."
        : error instanceof Error
          ? error.message
          : "Unable to load attendance. Please try again."
    );
    return [];
  } finally {
    setIsAttendanceLoading(null);
  }
};

  const handleDashboardNavigation = () => Router.push("/DashBoard");

  if (isChecking) return <LoadingData />;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 px-3 py-4 text-slate-800 sm:px-5 sm:py-6 lg:px-7">
      {ClientAttendanceInfo && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white w-full sm:w-[90vw] md:w-[80vw] lg:w-[60vw] h-[85vh] sm:h-[82vh] md:h-[80vh] lg:h-[76vh] max-w-4xl rounded-xl shadow-xl overflow-hidden flex flex-col">
      
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow">
                  <img
                    src="/Icons/Curate-logoq.png"
                    alt="Company Logo"
                    className="h-6 w-6 object-contain"
                  />
                </div>
      
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#ff1493] font-semibold">
                    {
                      ClientAttendanceInfo?.clientName ||
                      "Client Attendance"}
                  </p>
      
                  <h2 className="text-lg md:text-xl font-bold text-slate-800">
                    Client Attendance Dashboard
                  </h2>
      
                 
                </div>
              </div>
      
              <button
                onClick={() => {setClientAttendanceInfo(null)}}
                className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                <Minimize2 size={16} />
              </button>
            </div>
      
            {/* Calendar */}
            <div className="flex-1 p-2 md:p-3 min-h-0">
              <div className="grid grid-cols-7 gap-2 h-full">
                {Array.from(
                  { length: NumberOfDaysInMonth },
                  (_, i) => {
      
                    const dateKey = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-${String(
                      i + 1
                    ).padStart(2, "0")}`;
      
                    // Find Client Attendance
                  const attendanceList = Array.isArray(
  ClientAttendanceInfo?.ClientAttendance
)
  ? ClientAttendanceInfo.ClientAttendance
  : [];

const attendanceRecord =
  attendanceList.find((item: any) => {
    const itemDate = String(
      item?.dateKey || item?.AttendanceDate || ""
    ).split("T")[0];

    return itemDate === dateKey;
  }) || null;
      console.log("Check Attendance Record",attendanceRecord)
                    // Client Information
                    const clientName =
                      attendanceRecord?.
      Client_Name
       ?? "";
      
                    const UpdatedUser =
                      attendanceRecord?.UpdatedBy ?? "";
      
                    const attendanceAbsentReason =
                      attendanceRecord?.Reason ?? "";
      
                    // Attendance Status
                    let AttendecStatus = "-";
      
                    if (attendanceRecord) {
                      const status = String(
                        attendanceRecord?.Status || ""
                      ).trim().toLowerCase();
      
                    if (status === "present") {
  AttendecStatus = "P";
} else if (status === "absent") {
  AttendecStatus = "A";
} else if (status === "half day") {
  AttendecStatus = "HP";
}
                    }
           const today = new Date();
                        const currentDateObj = new Date(calendarYear, calendarMonth - 1, i + 1);
                        const isFuture = currentDateObj > today;
                    return (
                      <div
                        key={dateKey}
                        className="rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col items-center justify-center p-1"
                      >
                        <span className="text-[10px] font-semibold text-gray-500 uppercase">
                          Day {i + 1}
                        </span>
      
                        {AttendecStatus === "-" ? (
                          <>
                            <div className="rounded-full bg-gray-100 flex items-center justify-center mt-1">
                              <span className="text-[8px] w-fit font-semibold px-2 py-1 rounded bg-gray-300 text-gray-500">
                                Not Marked
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <DayBadge status={AttendecStatus} />
      
                            {clientName && (
                              <span className="text-[8px] text-center leading-tight px-1 line-clamp-2">
                                {clientName}
                              </span>
                            )}
      
                            {UpdatedUser && (
                              <div className="relative group mt-1">
                                <div className="p-[2px] rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
                                  <Info className="w-3 h-3 text-gray-500" />
                                </div>
      
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-2 rounded whitespace-nowrap z-50">
                                  <div>
                                    Marked by: {UpdatedUser}
                                  </div>
      
                                  {attendanceAbsentReason &&
                                    AttendecStatus !== "P" && (
                                      <div className="mt-1 border-t border-gray-700 pt-1">
                                        Reason: {attendanceAbsentReason}
                                      </div>
                                    )}
      
                                  <div className="mt-1">
                                    Client: {clientName}
                                  </div>
                                  
                                </div>
                               <span
                          onClick={() => {
                                if (isFuture) return;
                                SetShowUpdateAttendece(true);
                                setEditDate(dateKey);
                                setStatus(attendanceRecord?.Status || "");
                                setAbsentReason(attendanceRecord?.Reason || "");
                                setAttenseceInformation(attendanceRecord)
                              }}
                              className={`text-[8px] px-2 py-[2px] rounded-full mt-1 cursor-pointer ${isFuture 
                                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                  : "bg-slate-700 text-white hover:bg-slate-800"
                                }`}
                            >
                              Edit
                            </span>
                               {ShowUpdateAttendece && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center ">
                                              <div className="w-full max-w-sm  bg-white shadow-md">
                                                <div className="flex items-center justify-between border-b px-2 py-3">
                                                  <p className="text-base font-semibold text-gray-800">
                                                    Edit Attendance{EditDate}
                                                  </p>
                            
                                                  <button
                                                    onClick={() => SetShowUpdateAttendece(!ShowUpdateAttendece)}
                                                    className="flex justify-end cursor-pointer rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-black"
                                                  >
                                                    <X size={14} />
                                                  </button>
                                                </div>
                            
                                                <div className="px-5 py-4">
                                                  <label className="mb-2 block text-sm font-medium text-gray-600">
                                                    Attendance Status{EditDate}
                                                  </label>
                            
                                                  <select
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value as any)}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                                  >
                                                    <option value="">Choose Attendance</option>
                                                    <option value="Present">Present</option>
                                                    <option value="Half Day">Half Day</option>
                                                    <option value="Absent">Absent</option>
                                                  </select>
                                                </div>
                            
                                                {/* {(status === "Absent" || status === "Half Day") && (
                                                  <div className="mt-3 px-5">
                                                    <label className="mb-2 block text-sm font-medium text-gray-600">
                                                      Enter Reason for {status}
                                                    </label>
                            
                                                    <input
                                                      type="text"
                                                      placeholder="Enter reason..."
                                                      value={AbsentReason}
                                                      onChange={(e) => setAbsentReason(e.target.value)}
                                                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                                    />
                                                  </div>
                                                )} */}
                            
                                                {/* {EditDate !== new Date().toISOString().split("T")[0] && (
                                          <div className="flex flex-col border-b px-5 py-3">
                                            <label className="text-xs font-semibold text-gray-800">
                                              Reason for Attendance Edit
                                            </label>
                            
                                            <input
                                              type="text"
                                              value={AttendeceEditReason}
                                              placeholder="Enter Here....."
                                              onChange={(e: any) => SetAttendeceEditReason(e.target.value)}
                                              className="mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                            />
                                          </div>
                                        )} */}
                            
                                                <div>
                                                  {ActionStatusMessage && (
                                                    <p
                                                      className={`mt-2 text-sm font-medium px-1 py-2 text-xs text-center rounded-lg ${ActionStatusMessage?.includes("success") ||
                                                          ActionStatusMessage?.includes("✅")
                                                          ? "text-green-700"
                                                          : "text-red-700"
                                                        }`}
                                                    >
                                                      {ActionStatusMessage}
                                                    </p>
                                                  )}
                            
                                                  <div className="flex w-full justify-end gap-2 border-t px-5 py-3">
                                                    <button
                                                      onClick={() => SetShowUpdateAttendece(!ShowUpdateAttendece)}
                                                      className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                                    >
                                                      Cancel
                                                    </button>
                            
                                                    <button
                                                      className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
                                                      onClick={EditAttendence }
                                                    >
                                                      Save
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                              </div>
      
                              
                            )}
                          </>
                        )}
                      </div>
                      
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-[1600px] space-y-4 sm:space-y-5">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOptions((value) => !value)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label="Open navigation"
              >
                <List size={22} />
              </button>

              {showOptions && (
                <div className="absolute left-0 top-12 z-30 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  {[
                    ["Call Enquiry", () => Router.push("/AdminPage")],
                    ["HCP List", () => Router.push("/AdminPage")],
                    ["Deployment", () => Router.push("/AdminPage")],
                    ["Invoice", () => Router.push("/Invoices")],
                    ["PDR", () => Router.push("/PDRView")],
                    ["Payments", () => Router.push("/PaymentsInfo")],
                  ].map(([label, action]: any) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        action();
                        setShowOptions(false);
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-teal-700"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <img
              src="https://curate-pearl.vercel.app/Icons/UpdateCurateLogo.png"
              alt="Curate Health Services"
              className="h-9 w-auto shrink-0 object-contain sm:h-11"
            />

            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Refund Management
              </h1>
              <p className="mt-0.5 text-xs text-slate-500">
                Review, track and manage client refunds
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
            {/* Existing Team filter */}
            <div className="flex max-w-full items-center gap-1.5 overflow-x-auto rounded-xl bg-slate-100 p-1 lg:max-w-[min(70vw,720px)]">
              <button
                type="button"
                onClick={() => setActiveTeam("All")}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  activeTeam === "All"
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All Teams
              </button>
              {teams.map((team: any) => (
                <button
                  key={team}
                  type="button"
                  onClick={() => setActiveTeam(team)}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    activeTeam === team
                      ? "bg-white text-teal-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Team {team}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleDashboardNavigation}
              className="w-full shrink-0 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 lg:w-auto"
            >
              Dashboard
            </button>
          </div>
        </header>

        {/* Preserved Service State, Month and Year filters */}
        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Refund overview
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Filter refund records by service location, team and service period.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <MapPin size={15} className="shrink-0 text-slate-400" />
              <span className="text-xs text-slate-500">Service State</span>
              <select
                value={SelectedServiceStates}
                onChange={(event) =>
                  setSelectedServiceStates(event.target.value)
                }
                className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="All">All States</option>
                {IndianStates.map((state: string) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </label>

            {!isAdvancedFilterActive && (
              <>
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <CalendarDays size={15} className="shrink-0 text-slate-400" />
                  <span className="text-xs text-slate-500">Month</span>
                  <select
                    value={monthFilter}
                    onChange={(event) => setMonthFilter(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-slate-700 outline-none"
                  >
                    <option value="All">All Months</option>
                    {Array.from({ length: 12 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {new Date(0, index).toLocaleString("en", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <CalendarDays size={15} className="shrink-0 text-slate-400" />
                  <span className="text-xs text-slate-500">Year</span>
                  <select
                    value={yearFilter}
                    onChange={(event) => setYearFilter(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-slate-700 outline-none"
                  >
                    <option value="All">All Years</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setFilterMessage("");
                setShowAdvancedFilter(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
            >
              <CalendarDays size={15} />
              Date range
            </button>

            {isAdvancedFilterActive && (
              <button
                type="button"
                onClick={resetAdvancedFilter}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <RotateCcw size={14} />
                Reset dates
              </button>
            )}
          </div>
        </section>

        {/* KPI cards */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <KpiCard
            title="Total Refund Amount"
            value={formatCurrency(totalRefundAmount)}
            helper="Recorded refund value"
            icon={<Wallet size={19} />}
            tone="teal"
          />
          <KpiCard
            title="Total Refund Records"
            value={filteredRefunds.length}
            helper="Matching current filters"
            icon={<Users size={19} />}
            tone="blue"
          />
         
        </section>

        {/* Search and status controls */}
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search client name or client ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <span className="text-xs font-medium text-slate-500">
                Refund status
              </span>
              <select
                value={refundStatusFilter}
                onChange={(event: any) =>
                  setRefundStatusFilter(event.target.value)
                }
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-teal-500 sm:w-auto sm:min-w-[190px]"
              >
                {REFUND_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => refreshRefunds(false)}
                disabled={isRefreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={14}
                  className={isRefreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

          
            </div>
          </div>

          
        </section>

        {/* Refund table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Refund records
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Client service and refund details
              </p>
            </div>
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredRefunds.length} records
            </span>
          </div>

          {loadError && (
            <div className="m-4 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-rose-700">{loadError}</p>
              <button
                type="button"
                onClick={() => refreshRefunds(true)}
                className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Try again
              </button>
            </div>
          )}

          {filteredRefunds.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No Refund Records Found"
                description="No refund records match the selected filters. Try changing the search or filters."
              />
            </div>
          ) : (
            <>
              {/* Desktop/tablet table */}
              <div className="hidden w-full overflow-x-auto xl:block">
                <table className="w-full min-w-[1250px] border-collapse text-left">
                  <thead className="sticky top-0 bg-teal-600">
                    <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-white">
                      <th className="px-4 py-3 font-semibold">Client</th>
                     
                      <th className="px-3 py-3 font-semibold">Service Start</th>
                      <th className="px-3 py-3 font-semibold">Service State</th>
                      <th className="px-3 py-3 font-semibold">Team</th>
                      <th className="px-3 py-3 text-right font-semibold">
                        Service Amount
                      </th>
                      <th className="px-3 py-3 text-right font-semibold">
                        Refund Days
                      </th>
                      <th className="px-3 py-3 text-right font-semibold">
                        Refund Amount
                      </th>
                      <th className="px-3 py-3 font-semibold">Refund Date</th>
                      <th className="px-3 py-3 text-center font-semibold">
                        Attendance
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedRefunds.map((item: any, index: number) => (
                      <tr
                        key={`${item.ClientId}-${item.ServiceStartDate}-${index}`}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="max-w-[210px] px-4 py-3">
                          <p className="truncate text-xs font-semibold text-slate-800">
                            {item.ClientName || "-"}
                          </p>
                          <p className="mt-1 truncate text-[10px] text-slate-400">
                            {item.PatientName || "-"}
                          </p>
                        </td>
                    
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-600">
                          {formatDate(item.ServiceStartDate)}
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-600">
                          {item.ServiceState || "-"}
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                            {item.Team === "Not Entered"
                              ? item.Team
                              : `Team ${item.Team}`}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-right text-xs font-medium text-slate-700">
                          {formatCurrency(item.TotalServiceAmount)}
                        </td>
                        <td className="px-3 py-3 text-right text-xs text-slate-600">
                          {item.RefundDays || 0}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-right text-xs font-bold text-teal-700">
                          {formatCurrency(item.RefundAmount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-600">
                          {formatDate(item.RefundDate)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => GetClientAttendance(item)}
                            disabled={isAttendanceLoading===item.ClientId}
                            aria-busy={isAttendanceLoading===item.ClientId}
                            className="group inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-3 py-2 text-xs font-semibold text-teal-800 shadow-sm transition-all duration-200 ease-in-out hover:border-teal-500 hover:from-teal-700 hover:to-teal-800 hover:text-white hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                          >
                            {isAttendanceLoading===item.ClientId ? (
                              <RefreshCw size={15} className="animate-spin" />
                            ) : (
                              <Eye
                                size={15}
                                className="transition-transform duration-200 group-hover:scale-110"
                              />
                            )}
                            {isAttendanceLoading===item.ClientId ? "Loading..." : "Preview"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRefund(item);
                                setShowDetails(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              <Eye size={13} />
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                console.log("Proceed with refund:", item)
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-teal-800"
                            >
                              Proceed
                              <ArrowUpRight size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile and tablet cards */}
              <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 xl:hidden">
                {paginatedRefunds.map((item: any, index: number) => (
                  <article
                    key={`${item.ClientId}-${item.ServiceStartDate}-${index}`}
                    className="min-w-0 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {item.ClientName || "-"}
                        </h3>
                        <p className="mt-1 break-all font-mono text-[10px] text-slate-400">
                          {item.ClientId || "-"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.PatientName || "-"}
                        </p>
                      </div>
                      <StatusBadge status={item.RefundStatus} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-3">
                      <div>
                        <p className="text-[10px] text-slate-400">
                          Service start
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {formatDate(item.ServiceStartDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">
                          Service state
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {item.ServiceState || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Team</p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {item.Team === "Not Entered"
                            ? item.Team
                            : `Team ${item.Team}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">
                          Service amount
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {formatCurrency(item.TotalServiceAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Refund days</p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {item.RefundDays || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">
                          Refund amount
                        </p>
                        <p className="mt-1 text-xs font-bold text-teal-700">
                          {formatCurrency(item.RefundAmount)}
                        </p>
                      </div>
                      <div className="col-span-2 sm:col-span-3">
                        <p className="text-[10px] text-slate-400">Refund date</p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {formatDate(item.RefundDate)}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center justify-between sm:col-span-3">
                        <p className="text-[10px] text-slate-400">Attendance</p>
                        <button
                          type="button"
                          onClick={() => GetClientAttendance(item)}
                          disabled={isAttendanceLoading}
                          aria-busy={isAttendanceLoading}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800 transition hover:border-teal-500 hover:bg-teal-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                        >
                          {isAttendanceLoading ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <Eye size={14} />
                          )}
                          {isAttendanceLoading ? "Loading..." : "Preview"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRefund(item);
                          setShowDetails(true);
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        <Eye size={14} />
                        View details
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          console.log("Proceed with refund:", item)
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-700 px-3 py-2.5 text-xs font-semibold text-white hover:bg-teal-800"
                      >
                        Proceed
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Page {page} of {totalPages}
                  <span className="mx-2 text-slate-300">•</span>
                  {filteredRefunds.length} total records
                </p>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    <ChevronLeft size={14} />
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Advanced date filter */}
      {showAdvancedFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-[2px] sm:p-5">
          <div className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2.5rem)] sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Filter by service date
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Select a date range to retrieve refund records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvancedFilter(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close date filter"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                  From date
                </span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => setFromDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                  To date
                </span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => setToDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>
              {filterMessage && (
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  {filterMessage}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setFilterMessage("");
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={getAdvanceFilterData}
                className="rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-teal-800"
              >
                Apply filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund detail viewer */}
      {showDetails && selectedRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-[2px] sm:p-5">
          <div className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2.5rem)]">
            <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Refund details
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedRefund.ClientName || "Client"} ·{" "}
                  
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close refund details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
              {[
                ["Client name", selectedRefund.ClientName],
             
                ["Patient", selectedRefund.PatientName],
                ["Service start date", formatDate(selectedRefund.ServiceStartDate)],
                ["Service state", selectedRefund.ServiceState],
                ["Team", selectedRefund.Team],
                ["Total service amount", formatCurrency(selectedRefund.TotalServiceAmount)],
                ["Refund days", selectedRefund.RefundDays],
                ["Refund amount", formatCurrency(selectedRefund.RefundAmount)],
                ["Refund date", formatDate(selectedRefund.RefundDate)],
                [
                  "Refund attendance records",
                  selectedRefund.HACAttendeceforRefund?.length || 0,
                ],
              ].map(([label, value]: any) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                    {value ?? "-"}
                  </p>
                </div>
              ))}

             
            </div>

            <div className="flex justify-end border-t border-slate-200 px-4 py-4 sm:px-5">
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
