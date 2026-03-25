"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, XCircle, Bell } from "lucide-react";
import axios from "axios";
import { GetNotificationsInformation, HCASalaryUpdate, UpdateNotificationType } from "@/Lib/user.action";
import { useRouter } from "next/navigation";
import { LoadingData } from "@/Components/Loading/page";
import { useDispatch, useSelector } from "react-redux";
import { Refresh } from "@/Redux/action";

type FilterType = "All" | "Pending" | "Approved" | "Rejected" | "Read";

interface NotificationItem {
  Department: any;
  HCPId: string;
  Date: any;
  _id: string;
  Type: "LEAVE_REQUEST" | "EXPENSE_REQUEST" | "INFO" | "SYSTEM"|"HCP Salary Request" |"Refund Request";
  ReferenceId?: string;
  UserId: string;
  EmployeeName?: string;
  Message: string;
  Meta?: any;
  Status: "Pending" | "Approved" | "Rejected" | "Read";
  IsRead: boolean;
  ActionTaken: boolean;
  CreatedAt: string;
}

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
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
  Dept:any
) => {
  try {
    if (!info?.HCPId) {
      dispatch(Refresh("Invalid notification data."));
      return;
    }

if(Dept==="HCP"){
      const phoneNumber = "7386145659";

    if (action === "Rejected") {
      const updateStatus = await UpdateNotificationType(info.HCPId, action);

      if (!updateStatus?.success) {
        dispatch(Refresh("Failed to update notification status."));
        return;
      }

      const message = `Hi, unfortunately HCP ${info.HCPName} salary request was not approved. Please contact management for more information.`;

      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

      window.open(whatsappURL, "_blank");

      dispatch(Refresh("Salary request rejected and notification updated successfully."));
      setRefreshKey(prev => prev + 1);
      return;
    }

    const updateSalary = await HCASalaryUpdate(
      info.HCPId,
      info.RequestedSalary,
      loggedInEmail
    );

    if (!updateSalary?.success) {
      dispatch(Refresh("Salary update failed."));
      return;
    }
   const Successmessage = `Hi,  ${info.HCPName} HCP Salary request was  approved. Please contact management for more information.`;

      const SuccesswhatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        Successmessage
      )}`;

      window.open(SuccesswhatsappURL, "_blank");
    const updateStatus = await UpdateNotificationType(info.HCPId, action);

    if (!updateStatus?.success) {
      dispatch(Refresh("Salary updated but notification status update failed."));
      return;
    }

    const message = `Hi, the requested salary for HCP ${info.HCPName} has been updated to ${info.RequestedSalary}. Please check the application.`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");

    dispatch(Refresh("Salary updated and notification processed successfully."));
    setRefreshKey(prev => prev + 1);
    return
}

if(Dept==="Accounts"){
  const phoneNumber = "7386145659";

    if (action === "Rejected") {
      const updateStatus = await UpdateNotificationType(info.HCPId, action);

      if (!updateStatus?.success) {
        dispatch(Refresh("Failed to update notification status."));
        return;
      }

      const message = `Hi, unfortunately  ${info.ClientName} Refund request was not approved. Please contact management for more information.`;

      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

      window.open(whatsappURL, "_blank");

      dispatch(Refresh("Salary request rejected and notification updated successfully."));
      setRefreshKey(prev => prev + 1);
      return;
    }

  
   const Successmessage = `Hi,  ${info.ClientName} Refund request was  approved. Please contact management for more information.`;

      const SuccesswhatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        Successmessage
      )}`;

      window.open(SuccesswhatsappURL, "_blank");
    const updateStatus = await UpdateNotificationType(info.HCPId, action);

    if (!updateStatus?.success) {
      dispatch(Refresh("Salary updated but notification status update failed."));
      return;
    }

    const message = `Hi, the requested salary for HCP ${info.HCPName} has been updated to ${info.RequestedSalary}. Please check the application.`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");

    dispatch(Refresh("Salary updated and notification processed successfully."));
    setRefreshKey(prev => prev + 1);
    return
}
  } catch (err) {
    console.error("Notification Action Error:", err);
    dispatch(Refresh("Something went wrong. Please try again."));
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

    
      <div className="space-y-4">
        {filteredNotifications.map((item,_id) => (
          <div  key={item._id}>
             {(
  item.Type === "LEAVE_REQUEST" ||
  (item.Type === "HCP Salary Request" && loggedInEmail === "kirancuratehealth@gmail.com") ||
  item.Type === "EXPENSE_REQUEST" ||
  (item.Type === "Refund Request" &&
    (loggedInEmail === "shreeshmacurate@gmail.com" ||
     loggedInEmail === "srivanikasham@curatehealth.in@gmail.com"))
) && item.Status === "Pending" && (
          <div
           
            className="relative bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all p-6 flex justify-between items-start"
          >
      
            <span
              className={`absolute left-0 top-6 h-12 w-1 rounded-r-full
                ${
                  item.Status === "Pending"
                    ? "bg-yellow-400"
                    : item.Status === "Approved"
                    ? "bg-green-500"
                    : item.Status === "Rejected"
                    ? "bg-red-500"
                    : "bg-slate-400"
                }
              `}
            />

           
            <div className="pl-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase">
                {item.Type}
              </h3>

              <p className="text-slate-700 mt-1">
                {item.Message}
              </p>

              <p className="text-xs text-slate-400 mt-2">
            {item.Date}
              </p>
            </div>

           
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleAction(
                      item,
                        "Approved",
                           item.Department
                      )
                    }
                    disabled={actionLoading === item._id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                  
                    <CheckCircle size={16} />
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleAction(
                      item,
                        "Rejected",
                        item.Department
                      )
                    }
                    disabled={actionLoading === item._id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
             
          </div>
           )}
             </div>
             
        ))}
      </div>
    </div>
  );
}
