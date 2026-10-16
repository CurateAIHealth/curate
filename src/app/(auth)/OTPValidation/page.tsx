"use client";

import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  CheckCircle2,
  CircleX,
  Filter,
  RotateCcw,
  BriefcaseBusiness,
  RefreshCw,
  Snowflake,
  UserRoundX,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ServiceType = "Placement" | "Replacement" | "Freeze" | "Termination";
type ServiceStatus = "Active" | "Pending" | "Completed" | "On Hold";
type OtpStatus = "Verified" | "Pending";
type OtpSource = "Gmail" | "WhatsApp" | "Phone Call" | "Website" | "Text Message";

interface ServiceRecord {
  ServiceId: string;
  ClientName: string;
  HCAName: string;
  ServiceState: string;
  ServiceType: ServiceType;
  ServiceDate: string;
  Status: ServiceStatus;
  ContactNumber: string;
  Notes: string;
  ClientSource: OtpSource;
  HcaSource: OtpSource;
  ClientOtpStatus: OtpStatus;
  HcaOtpStatus: OtpStatus;
  ValidatedBy: string;
  VerifiedAt: string;
}

const INDIAN_STATES_AND_UTS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CURRENT_MONTH = String(new Date().getMonth() + 1).padStart(2, "0");
const CURRENT_YEAR = String(new Date().getFullYear());

// TEST DATA: Replace this array with your API/MongoDB records later.
// The OTP fields below are sample values for the new verification-table design.
const TEST_SERVICE_DATA: ServiceRecord[] = [
  { ServiceId: "SRV-1001", ClientName: "Rajiv", HCAName: "Priya Reddy", ServiceState: "Telangana", ServiceType: "Placement", ServiceDate: "2026-10-02", Status: "Active", ContactNumber: "9876543210", Notes: "New HCA placement", ClientSource: "Gmail", HcaSource: "WhatsApp", ClientOtpStatus: "Verified", HcaOtpStatus: "Verified", ValidatedBy: "Siddu", VerifiedAt: "2026-10-14T20:38:00" },
  { ServiceId: "SRV-1002", ClientName: "Priya Sharma", HCAName: "Kiran Kumar", ServiceState: "Andhra Pradesh", ServiceType: "Placement", ServiceDate: "2026-10-04", Status: "Active", ContactNumber: "9876501234", Notes: "Awaiting client confirmation", ClientSource: "WhatsApp", HcaSource: "Gmail", ClientOtpStatus: "Verified", HcaOtpStatus: "Verified", ValidatedBy: "Siddu", VerifiedAt: "2026-10-14T20:38:00" },
  { ServiceId: "SRV-1003", ClientName: "Arun Kumar", HCAName: "Divya Lakshmi", ServiceState: "Gujarat", ServiceType: "Placement", ServiceDate: "2026-10-13", Status: "Active", ContactNumber: "9876123450", Notes: "Placement active", ClientSource: "Phone Call", HcaSource: "WhatsApp", ClientOtpStatus: "Verified", HcaOtpStatus: "Verified", ValidatedBy: "Admin", VerifiedAt: "2026-10-14T20:38:00" },
  { ServiceId: "SRV-1004", ClientName: "Sneha Reddy", HCAName: "Anusha Rao", ServiceState: "Karnataka", ServiceType: "Replacement", ServiceDate: "2026-10-05", Status: "Completed", ContactNumber: "9123456780", Notes: "Replacement completed", ClientSource: "Gmail", HcaSource: "Phone Call", ClientOtpStatus: "Verified", HcaOtpStatus: "Pending", ValidatedBy: "Siddu", VerifiedAt: "2026-10-14T20:38:00" },
  { ServiceId: "SRV-1005", ClientName: "Kiran Raju", HCAName: "Rahul Sharma", ServiceState: "Maharashtra", ServiceType: "Replacement", ServiceDate: "2026-10-07", Status: "Pending", ContactNumber: "9988776655", Notes: "Replacement HCA required", ClientSource: "WhatsApp", HcaSource: "Gmail", ClientOtpStatus: "Pending", HcaOtpStatus: "Verified", ValidatedBy: "Admin", VerifiedAt: "2026-10-14T20:38:00" },
  { ServiceId: "SRV-1006", ClientName: "Anjali", HCAName: "Naveen Reddy", ServiceState: "Telangana", ServiceType: "Replacement", ServiceDate: "2026-10-14", Status: "Pending", ContactNumber: "9876012345", Notes: "Client requested replacement", ClientSource: "Website", HcaSource: "WhatsApp", ClientOtpStatus: "Pending", HcaOtpStatus: "Pending", ValidatedBy: "Siddu", VerifiedAt: "2026-10-14T20:38:00" },
  { ServiceId: "SRV-1007", ClientName: "Vamsi Krishna", HCAName: "Meghana Das", ServiceState: "Tamil Nadu", ServiceType: "Freeze", ServiceDate: "2026-10-08", Status: "On Hold", ContactNumber: "9090901234", Notes: "Service temporarily paused", ClientSource: "Gmail", HcaSource: "Website", ClientOtpStatus: "Verified", HcaOtpStatus: "Verified", ValidatedBy: "Admin", VerifiedAt: "2026-10-14T20:38:00" },
  { ServiceId: "SRV-1008", ClientName: "City Health Partners", HCAName: "Vamsi Krishna", ServiceState: "Telangana", ServiceType: "Freeze", ServiceDate: "2026-10-09", Status: "Pending", ContactNumber: "9012345678", Notes: "Awaiting freeze approval", ClientSource: "Text Message", HcaSource: "WhatsApp", ClientOtpStatus: "Pending", HcaOtpStatus: "Verified", ValidatedBy: "Siddu", VerifiedAt: "2026-10-14T20:38:00" },
  { ServiceId: "SRV-1009", ClientName: "New Life Clinic", HCAName: "Pooja Singh", ServiceState: "Rajasthan", ServiceType: "Freeze", ServiceDate: "2026-10-14", Status: "On Hold", ContactNumber: "9765432109", Notes: "Temporary hold requested", ClientSource: "Website", HcaSource: "Phone Call", ClientOtpStatus: "Pending", HcaOtpStatus: "Pending", ValidatedBy: "Admin", VerifiedAt: "2026-10-14T20:38:00" },
  { ServiceId: "SRV-1010", ClientName: "Wellness Home Care", HCAName: "Sneha Reddy", ServiceState: "Kerala", ServiceType: "Termination", ServiceDate: "2026-10-10", Status: "Completed", ContactNumber: "9345678901", Notes: "Service ended", ClientSource: "Gmail", HcaSource: "WhatsApp", ClientOtpStatus: "Verified", HcaOtpStatus: "Verified", ValidatedBy: "Siddu", VerifiedAt: "2026-10-14T20:38:00" },
  { ServiceId: "SRV-1011", ClientName: "Prime Support Clinic", HCAName: "Arjun Nair", ServiceState: "Delhi", ServiceType: "Termination", ServiceDate: "2026-10-12", Status: "Pending", ContactNumber: "9898989898", Notes: "Termination review pending", ClientSource: "WhatsApp", HcaSource: "Gmail", ClientOtpStatus: "Verified", HcaOtpStatus: "Pending", ValidatedBy: "Admin", VerifiedAt: "2026-10-14T20:38:00" },
  { ServiceId: "SRV-1012", ClientName: "Unity Health Group", HCAName: "Suresh Babu", ServiceState: "Uttar Pradesh", ServiceType: "Termination", ServiceDate: "2026-10-14", Status: "Completed", ContactNumber: "9654321098", Notes: "Termination confirmed", ClientSource: "Phone Call", HcaSource: "Text Message", ClientOtpStatus: "Verified", HcaOtpStatus: "Verified", ValidatedBy: "Siddu", VerifiedAt: "2026-10-14T20:38:00" },
];

const TABS: { label: ServiceType; icon: typeof BriefcaseBusiness }[] = [
  { label: "Placement", icon: BriefcaseBusiness },
  { label: "Replacement", icon: RefreshCw },
  { label: "Freeze", icon: Snowflake },
  { label: "Termination", icon: UserRoundX },
];

const otpStatusStyles: Record<OtpStatus, string> = {
  Verified: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
  Pending: "border-rose-200 bg-rose-50/80 text-rose-600",
};

const formatDate = (value: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

const formatSource = (source: OtpSource) => source === "WhatsApp" ? "Whats App" : source;

export default function ServiceManagementDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ServiceType>("Placement");
  const [serviceState, setServiceState] = useState("All States");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [monthFilter, setMonthFilter] = useState(CURRENT_MONTH);
  const [yearFilter, setYearFilter] = useState(CURRENT_YEAR);

  const stats = useMemo(() => ({
    total: TEST_SERVICE_DATA.length,
    placement: TEST_SERVICE_DATA.filter((x) => x.ServiceType === "Placement").length,
    replacement: TEST_SERVICE_DATA.filter((x) => x.ServiceType === "Replacement").length,
    freeze: TEST_SERVICE_DATA.filter((x) => x.ServiceType === "Freeze").length,
    termination: TEST_SERVICE_DATA.filter((x) => x.ServiceType === "Termination").length,
  }), []);

  const tabData = useMemo(() => TEST_SERVICE_DATA.filter((item) => item.ServiceType === activeTab), [activeTab]);
  const filteredData = useMemo(() => {
    const search = query.trim().toLowerCase();
    return tabData.filter((item) => {
      const matchesState = serviceState === "All States" || item.ServiceState === serviceState;
      const matchesStatus = statusFilter === "All Statuses" || item.Status === statusFilter;
      const matchesMonth = monthFilter === "All Months" || item.ServiceDate.slice(5, 7) === monthFilter;
      const matchesYear = yearFilter === "All Years" || item.ServiceDate.slice(0, 4) === yearFilter;
      const matchesSearch = [item.ServiceId, item.ClientName, item.HCAName, item.ServiceState, item.ContactNumber, item.Notes, item.ClientSource, item.HcaSource, item.ClientOtpStatus, item.HcaOtpStatus, item.ValidatedBy]
        .some((value) => String(value ?? "").toLowerCase().includes(search));
      return matchesState && matchesStatus && matchesMonth && matchesYear && matchesSearch;
    });
  }, [tabData, serviceState, statusFilter, monthFilter, yearFilter, query]);

  const resetFilters = () => {
    setServiceState("All States");
    setStatusFilter("All Statuses");
    setMonthFilter("All Months");
    setYearFilter("All Years");
    setQuery("");
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8fdf9] via-[#eefcfb] to-[#f4fefd] p-3 sm:p-4 md:p-6">
      <div className="mx-auto max-w-[1800px] space-y-5">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img src="/Icons/Curate-logoq.png" className="h-12 w-auto" alt="Company Logo" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">Service Management</h1>
                <p className="mt-1 text-xs font-medium text-slate-400">Manage placements, replacements, freeze and termination</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-teal-700">{stats.total} Records</span>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">Showing {filteredData.length} records</span>
              <button onClick={() => router.push("/DashBoard")} className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-[#00A9A5] to-[#005f61] px-4 py-2 font-semibold text-white shadow-lg transition hover:from-[#01cfc7] hover:to-[#00403e] sm:w-auto">DashBoard</button>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/60 p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Filter size={16} className="mr-1 text-slate-500" />
              {TABS.map(({ label, icon: Icon }) => {
                const active = activeTab === label;
                const count = TEST_SERVICE_DATA.filter((item) => item.ServiceType === label).length;
                return <button key={label} type="button" onClick={() => setActiveTab(label)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${active ? "border-[#0EA5A3] bg-[#0EA5A3] text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50"}`}>
                  <Icon size={14} /> {label} <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{count}</span>
                </button>;
              })}
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 transition focus-within:border-[#0EA5A3] focus-within:ring-2 focus-within:ring-[#0EA5A3]/10 lg:max-w-xs">
                <MapPin size={17} className="shrink-0 text-slate-400" />
                <select value={serviceState} onChange={(e) => setServiceState(e.target.value)} aria-label="Filter by service state" className="w-full bg-transparent text-sm text-slate-700 outline-none">
                  <option value="All States">All Service States</option>
                  {INDIAN_STATES_AND_UTS.map((state) => <option key={state} value={state}>{state}</option>)}
                </select>
              </label>
              <div className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 transition focus-within:border-[#0EA5A3] focus-within:ring-2 focus-within:ring-[#0EA5A3]/10 lg:max-w-sm">
                <Search size={18} className="shrink-0 text-slate-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search client, HCP, contact..." className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status" className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-[#0EA5A3] lg:max-w-[180px]">
                {["All Statuses", "Active", "Pending", "Completed", "On Hold"].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} aria-label="Filter by month" className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-[#0EA5A3]">
                <option value="All Months">All Months</option>
                {MONTHS.map((month, index) => <option key={month} value={String(index + 1).padStart(2, "0")}>{month}</option>)}
              </select>
              <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} aria-label="Filter by year" className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-[#0EA5A3]">
                <option value="All Years">All Years</option>
                {[...new Set([...TEST_SERVICE_DATA.map((item) => item.ServiceDate.slice(0, 4)), CURRENT_YEAR])].sort().map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
              <button type="button" onClick={resetFilters} className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100"><RotateCcw size={13} /> Reset</button>
            </div>
          </div>
        </div>

        {/* OTP verification table styled to match the supplied screenshot. */}
        <div className="overflow-hidden rounded-sm border border-slate-100 bg-white/95 shadow-sm">
          <div className="max-h-[65vh] overflow-auto">
            <table className="w-full min-w-[1250px] border-collapse text-left">
              <thead className="sticky top-0 z-20 bg-[#dff9f7]">
                <tr className="text-xs font-extrabold uppercase tracking-wide text-[#073f3d]">
                  {["S.No", "Client", "Client Source", "HCA Source", "Client OTP Status", "HCA OTP Status", "Validated By", "Verified At"].map((heading) => <th key={heading} className="border-b border-r border-teal-100 px-5 py-5 last:border-r-0">{heading}</th>)}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.ServiceId} className="border-b border-slate-100 text-sm transition-colors hover:bg-[#f7fffe]">
                    <td className="whitespace-nowrap px-5 py-5 text-slate-500">{index + 1}</td>
                    <td className="whitespace-nowrap px-5 py-5 font-bold text-slate-900">{item.ClientName || "Not Provided"}</td>
                    <td className="px-5 py-5"><span className="inline-flex whitespace-nowrap rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{formatSource(item.ClientSource)}</span></td>
                    <td className="px-5 py-5"><span className="inline-flex whitespace-nowrap rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{formatSource(item.HcaSource)}</span></td>
                    <td className="px-5 py-5"><span className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold ${otpStatusStyles[item.ClientOtpStatus]}`}>{item.ClientOtpStatus === "Verified" ? <CheckCircle2 size={16} /> : <CircleX size={16} />} {item.ClientOtpStatus}</span></td>
                    <td className="px-5 py-5"><span className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold ${otpStatusStyles[item.HcaOtpStatus]}`}>{item.HcaOtpStatus === "Verified" ? <CheckCircle2 size={16} /> : <CircleX size={16} />} {item.HcaOtpStatus}</span></td>
                    <td className="whitespace-nowrap px-5 py-5 text-base text-slate-900">{item.ValidatedBy || "—"}</td>
                    <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-500">{formatDate(item.VerifiedAt)}</td>
                  </tr>
                ))}
                {filteredData.length === 0 && <tr><td colSpan={8} className="px-5 py-16 text-center"><div className="flex flex-col items-center gap-2"><Search size={28} className="text-slate-300" /><p className="font-semibold text-slate-600">No {activeTab.toLowerCase()} records found</p><p className="text-xs text-slate-400">Try changing your state, search, status, or date filters.</p></div></td></tr>}
              </tbody>
            </table>
          </div>
         
        </div>
      </div>
    </div>
  );
}
