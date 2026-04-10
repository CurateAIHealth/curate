"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, XCircle, Bell, Eye } from "lucide-react";
import axios from "axios";
import { EditAttendanceByClientId, GetNotificationsInformation, HCASalaryUpdate, UpdateNotificationType } from "@/Lib/user.action";
import { useRouter } from "next/navigation";
import { LoadingData } from "@/Components/Loading/page";
import { useDispatch, useSelector } from "react-redux";
import { Refresh } from "@/Redux/action";

type FilterType = "All" | "Pending" | "Approved" | "Rejected" | "Read";

interface NotificationItem {
  NotifyEmploys: any;
  patientName: any;
  clientName: any;
  position: any;
  candidateName: any;
  Department: any;
  HCPId: string;
  Date: any;
  _id: string;
  Type: "LEAVE_REQUEST" | "EXPENSE_REQUEST" | "INFO" | "SYSTEM"|"HCP Salary Request" |"Refund Request" | "Attendance Edit Request" | "New Referral Request"|"New Call Enquiry";
  ReferenceId?: string;
  UserId: string;
  EmployeeName?: string;
  Message: string;
   referralType?: "staff" | "lead";
  Meta?: any;
  Status: "Pending" | "Approved" | "Rejected" | "Read";
  IsRead: boolean;
  ActionTaken: boolean;
  CreatedAt: string;
}

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
const [selectedItem, setSelectedItem] = useState<any>(null);
const [ShowBankInfo, setShowBankInfo] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("All");
    const updatedStatusMsg=useSelector((each:any)=>each.GlobelRefresh)
const router=useRouter()
const dispatch=useDispatch()
const [refreshKey, setRefreshKey] = useState(0);
  const loggedInEmail=useSelector((state:any)=>state.LoggedInEmail)
const fetchNotifications = async () => {
  try {
    setLoading(true);
    const res: any = await GetNotificationsInformation();
    setNotifications(res || []);
  } catch (err) {
    console.error("Fetch Notifications Error", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
   if(loggedInEmail===""){
    router.push("/DashBoard")
  }
  fetchNotifications();
 
}, [refreshKey]);


  const filteredNotifications = useMemo(() => {
    if (filter === "All") return notifications;
    return notifications.filter((n) => n.Status === filter);
  }, [notifications, filter]);

  
const handleAction = async (
  info: any,
  action: "Approved" | "Rejected",
  dept: "HCP" | "Accounts"
) => {
  const phoneNumbers: Record<string, string> = {
    HCP: "7386145659",
    Accounts: "9392801069", 
  };

  const getPhone = () => phoneNumbers[dept] || phoneNumbers.HCP;

  const sendWhatsApp = (message: string) => {
    const phone = getPhone();
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const updateStatusSafe = async () => {
    const res = await UpdateNotificationType(info?.HCPId||info?.ReferalId, action);
    if (!res?.success) throw new Error("Notification update failed");
  };

  try {
    if (!info?.HCPId) {
      dispatch(Refresh("Invalid notification data."));
      return;
    }

    if (dept === "HCP") {


      if (action === "Approved" && info?.Type === "Attendance Edit Request") {
        console.log("Info for Attendance Edit Request Approval----", info);
        const response = await EditAttendanceByClientId(
          info?.ClientId,
          info?.HCPId,
          info?.yearMonth,
          info?.flexDate,
          info?.status,
          loggedInEmail
        );

        if (response?.success) {
          sendWhatsApp(
            `Attendance updated successfully for ${info?.
HCPName
} on ${info?.flexDate}.`
          );
          updateStatusSafe();
           dispatch(Refresh("Attendance update Successfully."));
           return
        } else {
          dispatch(Refresh("Attendance update failed."));
          return;
        }
      }
      if (action === "Rejected") {
        await updateStatusSafe();

        sendWhatsApp(
          `HCP ${info?.HCPName} salary request was rejected.`
        );

        dispatch(Refresh("Rejected successfully."));
        setRefreshKey((prev) => prev + 1);
        return;
      }

      const res = await HCASalaryUpdate(
        info?.HCPId,
        info?.RequestedSalary,
        loggedInEmail
      );

      if (!res?.success) {
        dispatch(Refresh("Salary update failed."));
        return;
      }

      await updateStatusSafe();

      sendWhatsApp(
        `HCP ${info?.HCPName} salary updated to ${info?.RequestedSalary}.`
      );

      dispatch(Refresh("Salary updated successfully."));
      setRefreshKey((prev) => prev + 1);
      return;
    }

   
   

      

      if (action === "Rejected") {
        await updateStatusSafe();

        sendWhatsApp(
          `${info?.ClientName} refund request was rejected.`
        );

        dispatch(Refresh("Rejected successfully."));
        setRefreshKey((prev) => prev + 1);
        return;
      }

      await updateStatusSafe();

      sendWhatsApp(
        `${info?.ClientName} request approved and processed successfully.`
      );

      dispatch(Refresh("Processed successfully."));
      setRefreshKey((prev) => prev + 1);
      return;
    
  } catch (err: any) {
    console.error("Error:", err);
    dispatch(Refresh(err.message || "Something went wrong."));
  } finally {
    setActionLoading(null);
  }
};
  const handleLogout = () => {
    
    router.push('/DashBoard');

  };
 
  if (loading) {
    return <LoadingData />
  }

  if (!loading && notifications.length === 0) {
    return <p className="text-slate-500 text-sm">No notifications found.</p>;
  }


  return (
    <div className="space-y-6">

 {showModal && selectedItem && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <div className="bg-white rounded-2xl shadow-lg w-[500px] p-6 relative">

      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        ✖
      </button>

  
     <div className="flex items-center justify-between 
     w-full border-l-4 border-blue-500 pl-4 mb-4 shadow-sm p-1 rounded-md">
     <img
    src="/Icons/Curate-logo.png"
  
    alt="Logo"
    className="w-10 h-10  rounded-xl"
  />
       <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Refund Details
      </h2>
      </div>

   
      <div className="space-y-2 text-sm text-gray-600">
        <p><b>Client:</b> {selectedItem.ClientName}</p>
        <p><b>HCP:</b> {selectedItem.HCPName}</p>
        {/* <p><b>Service Days:</b> {selectedItem.ServiceDays}</p> */}
        <p><b>Working Days:</b> {selectedItem.WorkingDays}</p>
        <p><b>Refund Days:</b> {selectedItem.RefundDays}</p>
        <p><b>Amount:</b> ₹{selectedItem.resultAmount}</p>
          <p><b>Status:</b> {selectedItem.Status}</p>
           <p><b>isProfit:</b> {selectedItem.isProfit?"Yes":"No"}</p>
<div className="flex items-center gap-4 mb-2">
  <p className="font-semibold text-gray-700">
    Bank Info
  </p>

  <button
    onClick={() => setShowBankInfo(!ShowBankInfo)}
    className="flex items-center justify-center w-8 h-8 rounded-full border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
  >
    <Eye size={16} />
  </button>
</div>
{ShowBankInfo&&<div className="mt-3">
  

  <div className="bg-gray-50 border rounded-lg p-3 text-sm space-y-1">
    <p><b>Account Holder:</b> {selectedItem.BankInformation.accountHolder || "-"}</p>
    <p><b>Account Number:</b> {selectedItem.BankInformation.accountNumber || "-"}</p>
    <p><b>IFSC:</b> {selectedItem.BankInformation.ifsc || "-"}</p>
    <p><b>Bank Name:</b> {selectedItem.BankInformation.bankName || "-"}</p>
    <p><b>Branch:</b> {selectedItem.BankInformation.branch || "-"}</p>


      <p>
        <b>Passbook:</b>{" "}
        <a
          href={selectedItem.BankInformation.passBook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View File
        </a>
      </p>
    
  </div>
</div>}
      
        <p className="mt-3 text-gray-700">
          <b>Message:</b> {selectedItem.Message}
        </p>
      </div>

      <div className="flex justify-end mt-5">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-full bg-blue-450 cursor-pointer hover:bg-gray-200 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
 <div className="
  relative
 
  px-5 py-3
  flex items-center justify-between
  bg-gradient-to-br from-[#00A9A5] to-[#005f61]
  backdrop-blur-xl
  border border-white/30
  shadow-sm
">


  <div className="flex items-center gap-3">
     <img
    src="https://curate-pearl.vercel.app/Icons/Curate-logoq.png"
    alt="Curate Health Care"
    className="h-9 w-auto opacity-90"
  />

    <div>
      
      <h2 className="text-xl font-semibold text-white">
        Notifications
      </h2>
      <p className="text-white text-xs">
        System alerts, requests & updates
      </p>
    </div>
     <div className="p-2 rounded-xl ">
      <Bell className="text-white" size={28} />
    </div>
  </div>

         <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
            >
              DashBoard
            </button>

</div>


   
      <div className="flex items-center justify-between p-3 flex-wrap">
      <div className="flex gap-4 items-center">
          {(["All", "Pending", "Approved", "Rejected", "Read",] as FilterType[]).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${
                  filter === status
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }
              `}
            >
              {status}
            </button>
          )
        )}
      </div>
  {updatedStatusMsg && (
  <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 shadow-sm">
    {updatedStatusMsg}
  </div>
)}
      </div>

   <div className="space-y-6">
  {filteredNotifications.map((item, _id) => (
    <div key={item._id}>
{(
  item.Type === "LEAVE_REQUEST" ||
  item.Type === "New Referral Request" || 
  (item.Type === "HCP Salary Request" && loggedInEmail === "kirancuratehealth@gmail.com") ||
  (item.Type === "New Call Enquiry" &&item.NotifyEmploys.includes(loggedInEmail))||
  
  item.Type === "EXPENSE_REQUEST" ||
  ((item.Type === "Refund Request" || item.Type === "Attendance Edit Request") &&
    (loggedInEmail === "shreeshmacurate@gmail.com" ||
      loggedInEmail === "srinivasnew0803@gmail.com" ||
      loggedInEmail === "srivanikasham@curatehealth.in@gmail.com"))
) &&
      (filter === "All" || item.Status === filter) && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm hover:shadow-md transition-all">

            <div className="flex items-start gap-4 w-full">

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-sm
                ${
                  item.Status === "Pending"
                    ? "bg-amber-500"
                    : item.Status === "Approved"
                    ? "bg-emerald-500"
                    : item.Status === "Rejected"
                    ? "bg-rose-500"
                    : "bg-slate-400"
                }`}
              >
                {item.Type?.slice(0, 2)}
              </div>

              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-800 bg-rose-200 p-1 rounded-lg">
                    {item.Type}
                  </h3>

                  
                </div>

           <p className="text-sm text-slate-600 mt-1 leading-relaxed">
  {item.Type === "New Referral Request" ? (
    <>
      {item.referralType === "staff" && (
        <>
          👤 <b>{item.candidateName}</b> applied for{" "}
          <b>{item.position}</b>
        </>
      )}

      {item.referralType === "lead" && (
        <>
          🏥 Client: <b>{item.clientName}</b> - Patient{" "}
          <b>{item.patientName}</b>
        </>
      )}
    </>
  ) : (
    item.Message
  )}
</p>

               
              </div>
            </div>
            {item.Type === "Refund Request" && (
  <button
    className="px-4 py-2 rounded-full border cursor-pointer border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 text-sm font-medium"
    onClick={() => {
      setSelectedItem(item);
      console.log("Selected Item for Modal:", item);
      setShowModal(true);
    }}
  >
    <Eye/>
  </button>
)}
{item.Status!=="Approved"&& 

            <div>
              {item.Type==="New Call Enquiry"?<button className="group cursor-pointer relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 rounded-lg shadow-md hover:shadow-lg hover:from-teal-600 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1 transition-all duration-200">
  
  <span className="tracking-wide">Action</span>

</button>:<div className="flex gap-2 shrink-0">
              <button
                onClick={() =>
                  handleAction(item, "Approved", item.Department)
                }
                disabled={actionLoading === item._id}
                className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50"
              >
                <CheckCircle size={16} />
                Approve
              </button>

              <button
                onClick={() =>
                  handleAction(item, "Rejected", item.Department)
                }
                disabled={actionLoading === item._id}
                className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
              >
                <XCircle size={16} />
                Reject
              </button>
            </div>}
              </div>}
          </div>
        )}
    </div>
  ))}
</div>
    </div>
  );
}
