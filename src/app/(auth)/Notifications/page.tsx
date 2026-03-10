"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, XCircle, Bell } from "lucide-react";
import axios from "axios";
import { GetNotificationsInformation } from "@/Lib/user.action";
import { useRouter } from "next/navigation";
import { LoadingData } from "@/Components/Loading/page";

type FilterType = "All" | "Pending" | "Approved" | "Rejected" | "Read";

interface NotificationItem {
  Date: any;
  _id: string;
  Type: "LEAVE_REQUEST" | "EXPENSE_REQUEST" | "INFO" | "SYSTEM"|"HCP Salary Request";
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
const router=useRouter()

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
    fetchNotifications();
  }, []);


  const filteredNotifications = useMemo(() => {
    if (filter === "All") return notifications;
    return notifications.filter((n) => n.Status === filter);
  }, [notifications, filter]);

  
  const handleAction = async (
    notificationId: string,
    referenceId: string | undefined,
    type: string,
    action: "Approved" | "Rejected"
  ) => {
    if (!referenceId) return;

    try {
      setActionLoading(notificationId);

      await axios.post("/api/notification-action", {
        notificationId,
        referenceId,
        type,
        action,
      });

      await fetchNotifications();
    } catch (err) {
      console.error("Notification Action Error", err);
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


   
      <div className="flex gap-3 flex-wrap">
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

    
      <div className="space-y-4">
        {filteredNotifications.map((item) => (
          <div
            key={item._id}
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

            {(item.Type === "LEAVE_REQUEST" || item.Type==="HCP Salary Request"||
              item.Type === "EXPENSE_REQUEST") &&
              item.Status === "Pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleAction(
                        item._id,
                        item.ReferenceId,
                        item.Type,
                        "Approved"
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
                        item._id,
                        item.ReferenceId,
                        item.Type,
                        "Rejected"
                      )
                    }
                    disabled={actionLoading === item._id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
