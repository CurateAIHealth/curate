"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  CalendarDays,
  MapPin,
  ArrowUpRight,
  Eye,
  X,
  List,
  Pencil,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import {
  GetInvoiceInfoforInvoicePage,
  GetInvoiceInfoforAdvanceFilterInvoicePage,
} from "@/Lib/user.action";
import { getDaysBetween, parseFlexibleDate } from "@/Lib/Actions";
import { LoadingData } from "@/Components/Loading/page";
import { IndianStates, teams } from "@/Lib/Content";
import EmptyState from "@/Components/NoDeployments/page";
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

export default function ModifyInvoicePage() {
  const now = new Date();

  // Existing filter state and behavior retained.
  const [monthFilter, setMonthFilter] = useState<any>(now.getMonth() + 1);
  const [activeTeam, setActiveTeam] = useState<number | "All">("All");
  const [yearFilter, setYearFilter] = useState(String(now.getFullYear()));
  const [SelectedServiceStates, setSelectedServiceStates] =
    useState("Telangana");
  const [FetchedInfo, setFetchedInfo] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [isAdvancedFilterActive, setIsAdvancedFilterActive] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterMessage, setFilterMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [lateFee, setLateFee] = useState("500");
  const [chequeCollectionCharges, setChequeCollectionCharges] = useState("500");
  const [bounceCheque, setBounceCheque] = useState("500");
  const [equipmentBedRentMonth, setEquipmentBedRentMonth] = useState("0");
  // Freeze-days refund is represented by a date range (From Date and To Date).
  const [freezeFromDate, setFreezeFromDate] = useState("");
  const [freezeToDate, setFreezeToDate] = useState("");
  const [modifyMessage, setModifyMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const openModifyInvoice = (item: any) => {
    setSelectedInvoice(item);
    setLateFee("500");
    setChequeCollectionCharges("500");
    setBounceCheque("500");
    setEquipmentBedRentMonth("0");
    setFreezeFromDate("");
    setFreezeToDate("");
    setModifyMessage("");
  };

 
const handleSaveInvoiceChanges = async () => {
  if (!selectedInvoice) return;

  if (
    (freezeFromDate && !freezeToDate) ||
    (!freezeFromDate && freezeToDate)
  ) {
    setModifyMessage(
      "Please select both Freeze From Date and Freeze To Date."
    );
    return;
  }

  if (
    freezeFromDate &&
    freezeToDate &&
    freezeFromDate > freezeToDate
  ) {
    setModifyMessage(
      "Freeze From Date cannot be after Freeze To Date."
    );
    return;
  }

  const amounts = [
    lateFee,
    chequeCollectionCharges,
    bounceCheque,
    equipmentBedRentMonth,
  ];

  if (
    amounts.some(
      (value) =>
        value.trim() !== "" &&
        (!Number.isFinite(Number(value)) || Number(value) < 0)
    )
  ) {
    setModifyMessage(
      "Please enter valid non-negative amounts for all charges."
    );
    return;
  }

  const ClientId =
    selectedInvoice.ClientId ||
    selectedInvoice.ClienId ||
    selectedInvoice.Client_Id;


  const Invoice =
    selectedInvoice.Invoice ||
    selectedInvoice.number;
const ServiceStartDate= selectedInvoice.ServiceStartDate
  if (!ClientId || !Invoice) {
    setModifyMessage("Client ID or Invoice number is missing.");
    return;
  }

  const payload = {
    ClientId,
    ServiceStartDate,
    Invoice,

    additionalCharges: {
      lateFee: Number(lateFee || 0),
      chequeCollectionCharges: Number(
        chequeCollectionCharges || 0
      ),
      bounceCheque: Number(bounceCheque || 0),
      equipmentBedRentMonth: Number(
        equipmentBedRentMonth || 0
      ),
    },

    freezeDaysRefund: {
      fromDate: freezeFromDate,
      toDate: freezeToDate,
      RefundDays:getDaysBetween(freezeFromDate,freezeToDate),
      Amount:getDaysBetween(freezeFromDate,freezeToDate)*Number(selectedInvoice.CareTakeChare)
    },
  };

  try {
    setIsSaving(true);
    setModifyMessage("");

    const response = await fetch(
      "/api/UpdateInvoiceModification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Unable to update invoice."
      );
    }

    setModifyMessage(
      "Invoice modifications saved successfully!"
    );

    console.log("Invoice Modification Saved:", result);

    // Refresh invoice records
    await refreshRefunds(false);

    // Close popup after successful save
    setSelectedInvoice(null);

  } catch (error: any) {
    console.error("Invoice Modification Error:", error);

    setModifyMessage(
      error.message || "Something went wrong while saving."
    );
  } finally {
    setIsSaving(false);
  }
};

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

        setLoadError("");

        const response: any = await GetInvoiceInfoforInvoicePage(
          monthFilter,
          yearFilter
        );

      console.log("Find Data-----",response)

        setFetchedInfo(response);
      } catch (error) {
        console.error("Error fetching invoice records:", error);
        setLoadError("Unable to load invoice records. Please try again.");
      } finally {
        if (showLoader) setIsChecking(false);
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
      setFilterMessage("Fetching invoice records...");

      const response = await GetInvoiceInfoforAdvanceFilterInvoicePage(
        fromDate,
        toDate
      );

      setFetchedInfo(response);
      setIsAdvancedFilterActive(true);
      setFilterMessage(`${Array.isArray(response) ? response.length : 0} invoice records found.`);
      setShowAdvancedFilter(false);
    } catch (error) {
      console.error("Advanced invoice filter error:", error);
      setFilterMessage("Failed to fetch invoice records.");
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
          !item?.ServiceState || item.ServiceState === "Telangana"
            ? "Telangana"
            : item.ServiceState||"Telangana",
        Team: getTeamNumber(clientId),
        TotalServiceAmount: serviceAmount,
        RefundAmount: Number(item?.RefundAmount || 0),
        RefundDays: Number(item?.RefundDays || 0),
        RefundDate: item?.RefundDate || "",
        HACAttendeceforRefund: Array.isArray(item?.HACAttendeceforRefund)
          ? item.HACAttendeceforRefund
          : [],
      };
    });
  }, [FetchedInfo, getTeamNumber]);
console.log("Find Issues------",FetchedInfo)
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



    // Existing Service State filter retained.
    if (SelectedServiceStates !== "All") {
      data = data.filter(
        (item: any) => item.ServiceState||"Telangana" === SelectedServiceStates
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
    SelectedServiceStates,
    activeTeam,
  ]);

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



  const handleDashboardNavigation = () => Router.push("/DashBoard");

  if (isChecking) return <LoadingData />;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 px-3 py-4 text-slate-800 ">
      
      <div className="mx-auto w-full  space-y-4 sm:space-y-5">
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
                Invoice Management
              </h1>
              <p className="mt-0.5 text-xs text-slate-500">
                Review, manage and modify client invoices
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
              Invoice overview
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Filter invoice records by service location, team and service period.
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
                placeholder="Search client or patient name, or client ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
              {search.trim() && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                  Search filter active
                </span>
              )}
            </div>

           
          </div>

          
        </section>

        {/* Invoice table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Invoice records
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Client service and invoice details
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
                title="No Invoice Records Found"
                description="No invoice records match the selected filters. Try changing the search or filters."
              />
            </div>
          ) : (
            <>
              {/* Desktop/tablet table */}
              <div className="hidden w-full overflow-x-auto xl:block">
                <table className="w-full min-w-[1250px] border-collapse text-left">
                  <thead className="sticky top-0 bg-teal-600">
                    <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-white">
                      <th className="px-4 py-3 font-semibold">Client Name</th>
                      <th className="px-4 py-3 font-semibold">Patient Name</th>
                      <th className="px-3 py-3 font-semibold">Service Start</th>
                      <th className="px-3 py-3 font-semibold">Service State</th>
                      <th className="px-3 py-3 font-semibold">Team</th>
                   
                   
                      <th className="px-4 py-3 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRefunds.map((item: any, index: number) => (
                      <tr
                        key={`${item.ClientId}-${item.ServiceStartDate}-${index}`}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="max-w-[210px] px-4 py-3">
                          <p className="truncate text-xs font-semibold text-slate-800">
                            {item.ClientName || "-"}
                          </p>
                      
                        </td>
                     <td className="max-w-[210px] px-4 py-3">
                          <p className="truncate text-xs font-semibold text-slate-800">
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
                    
                       
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => openModifyInvoice(item)}
                              aria-label="Modify invoice"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            >
                              <Pencil size={13} strokeWidth={2.2} />
                              Modify Invoice
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
                {filteredRefunds.map((item: any, index: number) => (
                  <article
                    key={`${item.ClientId}-${item.ServiceStartDate}-${index}`}
                    className="min-w-0 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {item.ClientName || "-"}
                        </h3>
                      
                        <p className="mt-1 text-xs text-slate-500">
                          {item.PatientName || "-"}
                        </p>
                      </div>
                    
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
                  
                  
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                        
                          setShowDetails(true);
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        <Eye size={14} />
                        Invoice details
                      </button>
                      <button
                        type="button"
                        onClick={() => openModifyInvoice(item)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-700 px-3 py-2.5 text-xs font-semibold text-white hover:bg-teal-800"
                      >
                        Modify invoice
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

             
            </>
          )}
        </section>
      </div>

      {/* Modify invoice modal */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-[2px] sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedInvoice(null);
          }}
        >
          <div className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100dvh-2.5rem)]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">Modify Invoice</h2>
                <p className="mt-1 text-xs text-slate-500">Review client information and enter invoice adjustments.</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modify invoice popup"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              <section>
                <h3 className="mb-3 text-sm font-bold text-slate-800">Client Information</h3>
                <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                  {[
                    ["Client Name", selectedInvoice.ClientName],
                    ["Patient Name", selectedInvoice.PatientName],
             
                    ["Service Start Date", formatDate(selectedInvoice.ServiceStartDate)],
                    ["Service State", selectedInvoice.ServiceState],
                    ["Team", selectedInvoice.Team === "Not Entered" ? selectedInvoice.Team : `Team ${selectedInvoice.Team}`],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-500">{label}</p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value || "-"}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-bold text-slate-800">Additional Invoice Charges</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { label: "Late fee", value: lateFee, setter: setLateFee },
                    { label: "Cheque collection charges", value: chequeCollectionCharges, setter: setChequeCollectionCharges },
                    { label: "Bounce cheque", value: bounceCheque, setter: setBounceCheque },
                    { label: "Equipment - Bed / Rent - Month", value: equipmentBedRentMonth, setter: setEquipmentBedRentMonth },
                  ].map((field) => (
                    <label key={field.label} className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{field.label} (₹)</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.value}
                        onChange={(event) => field.setter(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        placeholder="0.00"
                      />
                    </label>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-teal-50 px-3 py-3">
                  <span className="text-xs font-semibold text-teal-800">Additional Charges Total</span>
                  <span className="text-sm font-bold text-teal-800">
                    {formatCurrency(Number(lateFee || 0) + Number(chequeCollectionCharges || 0) + Number(bounceCheque || 0) + Number(equipmentBedRentMonth || 0))}
                  </span>
                </div>
              </section>

           
<section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
  {/* Section Header */}
  <div className="flex items-center gap-3 border-b border-amber-100 bg-amber-50/70 px-4 py-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
      <CalendarDays size={19} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-slate-900">
        Refund for Freeze Days
      </h3>
      <p className="mt-0.5 text-xs text-slate-500">
        Select the freeze period to calculate applicable days.
      </p>
    </div>
  </div>

  <div className="space-y-4 p-4">
    {/* Date Inputs */}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-600">
          Freeze From Date
        </span>
        <div className="relative">
          <CalendarDays
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="date"
            value={freezeFromDate}
            max={freezeToDate || undefined}
            onChange={(event) => setFreezeFromDate(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-600">
          Freeze To Date
        </span>
        <div className="relative">
          <CalendarDays
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="date"
            value={freezeToDate}
            min={freezeFromDate || undefined}
            onChange={(event) => setFreezeToDate(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </label>
    </div>

    {/* Freeze Days Summary */}
    <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div>
        <p className="text-xs font-semibold text-amber-800">
          Total Freeze Days
        </p>
        <p className="mt-1 text-[11px] text-amber-700">
          Based on selected date range
        </p>
      </div>

      <div className="flex h-14 min-w-20 items-center justify-center rounded-xl bg-white px-4 shadow-sm">
        <span className="text-2xl font-bold tabular-nums text-amber-700">
          {freezeFromDate && freezeToDate
            ? getDaysBetween(freezeFromDate, freezeToDate)
            : 0}
        </span>
        <span className="ml-1 text-xs font-medium text-slate-500">
          Days
        </span>
      </div>
    </div>
  </div>
</section>


              {modifyMessage && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800" role="status">
                  {modifyMessage}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
             <button
  type="button"
  onClick={handleSaveInvoiceChanges}
  disabled={isSaving}
  className="rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSaving ? "Saving Changes..." : "Save Invoice Changes"}
</button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced date filter */}
      {showAdvancedFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-[2px] sm:p-5">
          <div className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2.5rem)] sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Filter invoices by service date
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Select a date range to retrieve invoice records.
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

    
    </main>
  );
}
