"use client"
import SessionExpiredPopup from "@/Components/LoginSesion/page";
import PermissionDeniedPopup from "@/Components/Permission/page";
import { TAB_ACCESS_CONTROL } from "@/Lib/Content";
import { Update_Main_Filter_Status, UpdateUserType } from "@/Redux/action";
import {
  User,
  IndianRupee,
  ReceiptIndianRupee,
  HandCoins,
  Building2,
  BadgeCheck,
  CircleX,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AccountingSub(){
      const stats=useSelector((state:any)=>state.DashBoardCount)
        const [showPermissionPopup, setShowPermissionPopup] = useState(false);
          const [LoginEmailPop,setLoginEmailPop]=useState(false)
 

  const loggedInEmail = useSelector((state: any) => state.LoggedInEmail)
        const router = useRouter()
        const dispatch=useDispatch()
      const tabs = useMemo(
  () => [
    {
      name: "Timesheet",
      count: stats.timesheetcount,
      icon: User,
      bg: "bg-green-500",
    },
  
    {
      name: "HCA Payment",
      count: stats.HCAPaymentCount || 0,
      icon: HandCoins,
      bg: "bg-blue-500",
    },
    {
      name: "Client Payment",
      count: stats.ClientPaymentCount || 0,
      icon: Building2,
      bg: "bg-cyan-500",
    },
    {
      name: "Payable",
      count: stats.PaymentCompleteAccountingCount || 0,
      icon: BadgeCheck,
      bg: "bg-emerald-500",
    },
    {
      name: "Reject",
      count: stats.RejectListCount || 0,
      icon: CircleX,
      bg: "bg-red-500",
    },
    {
      name: "Paid",
      count: stats.SuccessfulPaymentsCount || 0,
      icon: CheckCircle2,
      bg: "bg-teal-500",
    },
    {
      name: "Invoices",
      count: stats.invoiceCount,
      icon: ReceiptIndianRupee,
      bg: "bg-lime-500",
    },
  ],
  [stats]
);

const handleLogout = () => {
  
  router.push("/DashBoard");
}
  const canAccessTab = useCallback(
    (tab: string, email: string | null) => {
      if (!email) return false;
      if (TAB_ACCESS_CONTROL.ALL?.includes(email)) return true;
      return TAB_ACCESS_CONTROL[tab]?.includes(email);
    },
    []
  );

       const Switching = (name: string) => {
      
         if (!loggedInEmail){
      setLoginEmailPop(true)
 return;
    }
      
          if (!canAccessTab(name, loggedInEmail)) {
            setShowPermissionPopup(true);
            return;
          }
      // setShowSideHeadingsPopuo(true)
      
          switch (name) {
  case "Call Enquiry":
      case "Deployment":
    
        dispatch(Update_Main_Filter_Status(name));
        dispatch(UpdateUserType("patient"));
        router.push("/AdminPage");
        break;
        case "Timesheet":
           router.push("/TimeSheet");
              break;
            case "Pending PDR":
              router.push("/PDRView");
              break;
            case "Vendors":
              router.push("/VendorsPanel");
              break;
      
            case "Document Compliance":
              router.push("/Documents");
              break;
      
            case "Invoices":
              router.push("/Invoices");
              break;
            case "Payments":
              router.push("/PaymentsInfo");
              break;
      
            case "HCA Payment":
              router.push("/HCAAccounts");
              break;
      
            case "Client Payment":
              router.push("/ClientAccounts");
              break;
      
               case "Accounts":
              router.push("/Accounts");
              break;

              case "Payable":
                router.push("/Payable");
                break;
                 case "Reject":
                router.push("/RejectPayments");
                break;
      
                 case "Paid":
                router.push("/SuccessfulPayments");
                break;
      
      
            case "Notifications":
              router.push("/Notifications");
              break;
          }
        };
      
    return(
        <div>
 <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-lg mb-8">
  <div
    className="absolute top-0 left-0 h-full w-2"
    style={{ backgroundColor: "#1392d3" }}
  />

  <div className="p-4 pl-8">
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
          <img
            src="/Icons/Curate-logoq.png"
            alt="Company Logo"
            className="w-16 h-16 object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Accounting Dashboard 
          </h1>

       <p className="text-gray-500 mt-2">
  Monitor financial transactions, revenue, expenses, advances, and accounting operations in real time.
</p>

       
        </div>
      </div>

      <div className="hidden md:flex gap-3">
       

            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
            >
              DashBoard
            </button>
      </div>
    </div>
  </div>
</div>
  <SessionExpiredPopup
          isOpen={LoginEmailPop}
          logoSrc="/Icons/Curate-logoq.png"
          onClose={() => setLoginEmailPop(false)}
          onRefresh={() => window.location.reload()}
          onLoginAgain={() => {
            localStorage.removeItem("UserId");
           router.push("/login")
          }
          }
        />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                    
                      <PermissionDeniedPopup
                              open={showPermissionPopup}
                              onClose={() => setShowPermissionPopup(false)}
                            />
              {tabs.map((tab: any, index) => (
                <div
                  className="cursor-pointer"
                  key={tab.name}
                  onClick={
                    () => { if (tab.name !== "Call Enquiry") { Switching(tab.name) } }
                  }
                >

                  <div
                    key={tab.name}
                    className="flex flex-col items-center cursor-pointer hover:shadow-lg justify-center bg-white rounded-xl shadow-md border border-gray-100 p-3 sm:p-1 transition-transform hover:scale-[1.05]"
                  >

                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md ${tab.bg}`}
                    >
                      <tab.icon size={20} className="text-white" />
                    </div>


                    <p
                      className="mt-2 sm:mt-3 text-xs sm:text-sm hover:underline font-semibold cursor-pointer text-gray-900 text-center"
                      onClick={
                        () => { if (tab.name === "Call Enquiry") { Switching(tab.name) } }
                      }
                    >
                      {tab.name}
                    </p>



                    <div className="relative group inline-block">
                      <h2 className="text-base sm:text-lg font-bold text-gray-700 mt-1 cursor-pointer">
                        {tab.count || 0}
                      </h2>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max max-w-xs rounded-md bg-gray-800 text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap text-center">
                        {tab.count > 0
                          ? `${tab.count.toLocaleString()} ${tab.name} processed this month 📊`
                          : "No payments processed this month ❌"}
                      </div>
                    </div>



                    <div className="mt-2 flex flex-wrap justify-center gap-2">
              

                      {tab.name === "Call Enquiry" && (
                        <div className="flex items-center gap-2">
                          {/* <button
                        type="button"
                          onClick={UpdateNewLead}
                          className="rounded-md cursor-pointer text-xs px-2 py-1
      bg-gradient-to-r from-blue-400 to-blue-500
      text-white font-medium
      hover:from-teal-400 transition"
                        >
                          + New Lead
                        </button> */}

                    
                        </div>
                      )}

                    </div>
                  </div>
                </div>

              ))}
            </div>
            </div>
    )
}