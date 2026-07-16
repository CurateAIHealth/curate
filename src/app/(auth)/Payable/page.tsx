"use client";

let cachedPayableData:any[]=[]
type User = any;
type Deployment = any;
type Replace = any;
type Termination=any;
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, CircleSlash2, CornerUpLeft, Eye, Info, Menu, Minimize2, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { DeletePayableRecord, GetAllUsersData, PostINPayblePage, PostINRejectionDb, PostINSuccesfulPaymentsDb, UpdateStatusEnable, UpdateStatusEnableinRepleasment, UpdateStatusEnableiNTermination } from "@/Lib/user.action";
import { LoadingData } from "@/Components/Loading/page";
import { months, PayablemenuItems, SuccussfulmenuItems, years } from "@/Lib/Content";
import { UpdateMonthFilter, UpdateYearFilter } from "@/Redux/action";
import PopupToast from "@/Components/ExpencesPopUp/page";
import { AssignSuitableIcon, toProperCaseLive } from "@/Lib/Actions";
import axios from "axios";

export default function HCAPaymentTable() {

  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
  const [showFullMonth,setShowFullMonth]=useState(false)
// const [userTypeFilter, setUserTypeFilter] = useState("On Service");
const [selectedUser, setSelectedUser] = useState<any>(null);
const [attendanceInfo,setAttendenceInfo]=useState<any>()
const [ShowRejectPopup,setShowRejectPopup]=useState(false) 
const [RejectionReason,SetRejectionReason]=useState("") 
const [NeftTransactionNumber,setNeftTransactionNumber]=useState("")
  const [search, setSearch] = useState("");
const [menuOpen, setMenuOpen] = useState(false);
  const [paybleData,setPaybleData]=useState<any[]>([])
   const [selectedBank, setSelectedBank] = useState("");
     
        const RegisterdUsers=useSelector((state:any)=>state.AdminUsers)
        const users=useSelector((state:any)=>state.AdminFullInfo)
        const ClientsInformation=useSelector((state:any)=>state.AdminDeployment)
const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [ActionStatusMessage,SetActionStatusMessage]= useState<any>("");
   const [isChecking, setIsChecking] = useState(true);
     const loggedInEmail=useSelector((state:any)=>state.LoggedInEmail)
       const SearchMonth = useSelector((state: any) => state.FilterMonth);
       const SearchYear = useSelector((state: any) => state.FilterYear);
  const router=useRouter()
  const dispatch=useDispatch()
 
const payableCache = {
  data: null as any[] | null,
  promise: null as Promise<any[]> | null,
};
useEffect(() => {
  // Wait until data fetching is completed
  if (isChecking) return;

  if (
    RegisterdUsers.length === 0 ||
    users.length === 0 ||
    ClientsInformation.length === 0
  ) {
    router.replace("/");
  }
}, [
  isChecking,
  RegisterdUsers,
  users,
  ClientsInformation,
  router,
]);
useEffect(() => {
  let mounted = true;

  const fetchData = async (forceRefresh = false) => {
    try {
      // ✅ Use cache
      if (!forceRefresh && payableCache.data) {
        console.log("📦 Using Cached Payable Data");

        if (mounted) {
          cachedPayableData = payableCache.data;
          setPaybleData([...cachedPayableData]);
        }

        return;
      }

      // ✅ Prevent duplicate requests
      if (!forceRefresh && payableCache.promise) {
        console.log("⏳ Waiting for existing request...");

        const data = await payableCache.promise;

        if (!mounted) return;

        cachedPayableData = data;
        setPaybleData([...cachedPayableData]);

        return;
      }

      console.log("🌐 Fetching Fresh Payable Data...");
      setIsChecking(true);

      payableCache.promise = axios
        .get("/api/PayableData")
        .then((res) => res.data.data.ExportedPayableData ?? []);

      const payableData = await payableCache.promise;

      payableCache.data = payableData;
      payableCache.promise = null;

      if (!mounted) return;

      cachedPayableData = payableData;
      setPaybleData([...cachedPayableData]);

      console.log("✅ Cache Updated");
    } catch (err) {
      payableCache.promise = null;
      console.error(err);
    } finally {
      if (mounted) {
        setIsChecking(false);
      }
    }
  };

  // Initial load
  fetchData();

  // Create ONE SSE connection
  const eventSource = new EventSource("/api/payable-events");

  eventSource.onopen = () => {
    console.log("✅ SSE Connected");
  };

  eventSource.onmessage = (event) => {
    console.log("📩 Mongo Event:", event.data);

    try {
      const message = JSON.parse(event.data);

      if (message.refresh) {
        console.log("🔄 Collection changed. Refreshing cache...");

        // Clear cache
        payableCache.data = null;

        // Fetch fresh data
        fetchData(true);
      }
    } catch {
      console.log("Received:", event.data);
    }
  };

  eventSource.onerror = (err) => {
    console.error("❌ SSE Error", err);
  };

  return () => {
    mounted = false;
    eventSource.close();
    console.log("🔌 SSE Disconnected");
  };
}, []);


console.log ("Check for UserInfo-----",selectedUser)
 const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate(); 
};
const NumberOfDaysInMonth = getDaysInMonth(
  Number(SearchMonth),
  Number(SearchYear)
);
  const matchesSearchAndMonth = (
  item: any,
  searchText: string,
  searchMonth: string, 
  searchYear: string
) => {
  const search = searchText?.toLowerCase() || "";

  const name = item.name?.toLowerCase() || "";
  const email = item.email?.toLowerCase() || "";
  const contact = item.contact?.toLowerCase() || "";
  const hca = item.HCA_Name?.toLowerCase() || "";

  const matchesSearch =
    !search ||
    name.includes(search) ||
    email.includes(search) ||
    contact.includes(search) ||
    hca.includes(search);

  if (!searchMonth && !searchYear) return matchesSearch;
  if (!item.StartDate) return false;


  const [day, month, year] = item.StartDate.split("/");

  if (!month || !year) return false;

  const monthNumber = Number(month); 

  const matchesMonth =
    !searchMonth || monthNumber === Number(searchMonth);

  const matchesYear =
    !searchYear || Number(year) === Number(searchYear);

  return matchesSearch && matchesMonth && matchesYear;
};



const PayableDataformation = useMemo(() => {
  return paybleData.map((each: any) => ({
    ...each,

    UserType: "HCA",
    Clientid: each.ClientId,
    HCAid: each.HCAId,
    name: each.HCAName,
    attendanceInfo: each.Attendance ?? [],

    total: each.GrandTotalAmount ?? 0,
    advance: each.Expences?.advance ?? 0,
    hostelFee: each.Expences?.hostel ?? 0,
    Other: each.Expences?.other ?? 0,
    others: each.Expences?.others ?? 0,
    incentive: each.Expences?.incentives ?? 0,

    reject: 0,
    revert: 0,

    neft: each.NeftNumber ?? "",
    amount: each.GrandTotalAmount ?? 0,
    paid: each.PaidStatus ?? false,

    Month: each.Month,
    PaymentType: each.PaymentType,
  }));
}, [paybleData]);


const filteredPayableData = useMemo(() => {
  const searchText = search.trim().toLowerCase();

  return PayableDataformation.filter((item: any) => {



    // 2. Search
    const matchesSearch =
      !searchText ||
      item.name?.toLowerCase().includes(searchText) ||
      item.ClientName?.toLowerCase().includes(searchText) ||
      item.HCAName?.toLowerCase().includes(searchText) ||
      item.HCAContact?.toString().includes(searchText) ||
      item.ClientContact?.toString().includes(searchText);

    // 3. Month and Year
    const [itemYear, itemMonth] = String(item.Month ?? "")
      .split("-")
      .map(Number);

    const matchesMonth =
      !SearchMonth || itemMonth === Number(SearchMonth);

    const matchesYear =
      !SearchYear || itemYear === Number(SearchYear);

    return (
   
      matchesSearch &&
      matchesMonth &&
      matchesYear
    );
  });
}, [
  PayableDataformation,
  search,
  SearchMonth,
  SearchYear,
  
]);


console.log("Selected Month:", SearchMonth);
console.log("Selected Year:", SearchYear);
console.log(
  "All Payment Types:",
  PayableDataformation.map((item) => item.PaymentType)
);
console.log(
  "All Payable Months:",
  PayableDataformation.map((item) => item.Month)
);
console.log("Check for Payable Data------", filteredPayableData);

const UpdateRevertStatus = async (
  ClientId: any,
  HCAId: any,
  Month: any,
  ImpDate: any,
  Info: any
) => {
  try {
    setPopup({
      isOpen: true,
      message: "Please Wait Updating Payment Status...",
      type: "loading",
    });

    const paymentTypes = Array.isArray(Info.PaymentSources)
      ? Info.PaymentSources
      : [Info.PaymentType];

    const payableResult = await DeletePayableRecord(
      HCAId,
      ClientId,
      Month
    );

    if (!payableResult.success) {
      setPopup({
        isOpen: true,
        message: payableResult.message,
        type: "error",
      });
      return;
    }

    if (paymentTypes.includes("OnService Payments")) {
      await UpdateStatusEnable(
        HCAId,
        ClientId,
        Month
      );
    }


    if (paymentTypes.includes("Replacement Payments")) {
      await UpdateStatusEnableinRepleasment(
        HCAId,
        ClientId,
        Month
      );
    }

   
    if (paymentTypes.includes("Termination Payments")) {
      await UpdateStatusEnableiNTermination(
        HCAId,
        ClientId,
        Month,
        ImpDate
      );
    }

    setPopup({
      isOpen: true,
      message: "Reverted Successfully!",
      type: "success",
    });

    setPaybleData((prev) =>
      prev.filter(
        (item) =>
          !(
            item.HCAId === HCAId &&
            item.ClientId === ClientId &&
            item.Month === Month
          )
      )
    );
  } catch (err) {
    console.error(err);

    setPopup({
      isOpen: true,
      message: "Something went wrong",
      type: "error",
    });
  }
};

const PostRejctedReason=async()=>{
  try{
    if(RejectionReason.trim()===""){
      setPopup({
      isOpen: true,
      message: "Please enter a rejection reason before submitting.",
      type: "error",
    });
    return;
    }
setPopup({
      isOpen: true,
      message: "Please Wait Recording Rejection Reason...",
      type: "loading",
    });
     const MonthInfo=`${SearchYear}-${SearchMonth}`
    const PostinDb=await PostINRejectionDb(selectedUser,RejectionReason,MonthInfo)
    if(PostinDb.success){
      setPopup({
        isOpen: true,
        message: "Rejection reason recorded successfully!",
        type: "success",
      });
         setPaybleData((prevData) =>
  prevData.filter(
    (item) => item.HcaId !== selectedUser.HcaId
  )
);
   setTimeout(()=>{
       setShowRejectPopup(false)
   },2000)
    }else{
      setPopup({
        isOpen: true,
        message: PostinDb.message || "Failed to record rejection reason",
        type: "error",
      });
    }
  }catch(err:any){
    console.error("Error posting rejection reason:", err);
  }
}

const PostSuccesfullPayment=async(ImpId:any)=>{
  try{
    if(NeftTransactionNumber.trim()===""&&selectedUser?.neft===""){
setPopup({
      isOpen: true,
      message: "Please enter NEFT reference number before confirming payment.",
      type: "error",
    });
    return;
  }

  setPopup({
      isOpen: true,
      message: "Please Wait Recording Successful Payment Information...",
      type: "loading",
    });
     const MonthInfo=`${SearchYear}-${SearchMonth}`
     const ExportNeftNumber=NeftTransactionNumber||selectedUser?.neft
     console.log("PaymentInfo to be posted:", ExportNeftNumber,MonthInfo)
    const PostinDb=await PostINSuccesfulPaymentsDb(selectedUser,ExportNeftNumber,MonthInfo,ImpId,selectedBank)
    if(PostinDb.success){
   
      setPopup({
        isOpen: true,
        message: "Successful payment information recorded successfully!",
        type: "success",
      });
       window.location.reload()
    }else{
      setPopup({
        isOpen: true,
        message: PostinDb.message || "Failed to record rejection reason",
        type: "error",
      });
    }
  }catch(err:any){
    console.error("Error posting rejection reason:", err);
  }
}
   const GetHCPGender = (A: any) => {
    if (!users?.length || !A) return "Not Entered";

    const address =
      users
        ?.map((each: any) => each?.HCAComplitInformation)
        ?.find((info: any) => info?.UserId === A)
      ?.['Gender']||"Not Provided";

    return address ?? "Not Entered";
  };
 const GetHCPFullName = (A: any) => {
  if (!users?.length || !A) return "";

  const info = users
    ?.map((each: any) => each?.HCAComplitInformation)
    ?.find((info: any) => info?.UserId === A);

  if (!info) return "";

  const fullName = [
    info.HCPSurName,
    info.HCPFirstName,
    info.LastName,
  ]
    .filter(Boolean)
    .join(" ");

  return fullName;
};


     const GetHCPType = (A: any) => {
    if (!RegisterdUsers?.length || !A) return "Not Entered";

    const CurrentPreviewUserType:any =
      RegisterdUsers.filter((each:any)=>each.userId===A)

    return CurrentPreviewUserType[0]?.PreviewUserType ?? "Not Entered";
  };


      function DayBadge({ status }: { status: any }) {
  const Wrapper = ({ children }: any) => (
    <div className="flex items-center justify-center w-full">
      {children}
    </div>
  );

  if (status === "P") {
    return (
      <Wrapper>
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full border-2 text-emerald-600 bg-white shadow-sm">
          {status}
        </span>
      </Wrapper>
    );
  }

  if (status === "HP") {
    return (
      <Wrapper>
        <div className="relative w-8 h-8 rounded-full border-2 border-emerald-500 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-semibold text-emerald-600">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-emerald-500" />
          <span className="relative z-10">HP</span>
        </div>
      </Wrapper>
    );
  }

  if (status === "A") {
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
    if (isChecking) {
      return (
    <LoadingData/>
  
      );
    }
  return (
    
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-5 md:px-8 py-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
        

        <div className="relative flex items-center gap-3">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 shrink-0 items-center cursor-pointer justify-center rounded-lg border border-slate-200 hover:bg-slate-100"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        {menuOpen && (
                      <div className="absolute left-0 top-full z-50 mt-3 w-72 max-w-[90vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5">
                        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Advance Payment Options
                          </p>
                        </div>
            
                        <div className="py-2">
                          {PayablemenuItems.map((item) => {
                            const Icon = item.icon;
            
                            return (
                              <button
                                key={item.title}
                                onClick={() => {
                                  setMenuOpen(false);
                               router.push(item.route);
                                }}
                                className="group flex w-full items-center cursor-pointer justify-between px-5 py-3 transition hover:bg-teal-50 hover:text-teal-700"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="rounded-lg bg-slate-100 p-2 group-hover:bg-teal-100">
                                    <Icon size={18} />
                                  </div>
            
                                  <span className="font-medium">{item.title}</span>
                                </div>
            
                                <ChevronRight
                                  size={18}
                                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-600"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
              <img
            src="/Icons/Curate-logoq.png"
            alt="Company Logo"
            className="h-12 w-12 object-contain"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
         Payable
            </h1>
            <p className="text-sm text-[#64748b]">
              Payroll Management Dashboard
            </p>
            </div>
          </div>
    

            <div className="flex flex-col md:flex-row gap-3">

                <div className="relative min-w-[250px] flex-1 max-w-[350px]">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-2xl border border-[#d9e2ec] bg-white pl-12 pr-4 text-black"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={SearchMonth}
              onChange={(e) => dispatch(UpdateMonthFilter(e.target.value))}
              className="w-[140px] h-[40px] rounded-xl border border-gray-300 px-3 text-sm bg-white text-gray-800"
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
              onChange={(e) => dispatch(UpdateYearFilter(e.target.value))}
              className="w-[120px] h-[40px] rounded-xl border border-gray-300 px-3 text-sm bg-white text-gray-800"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
                 <button
onClick={() => router.push("/SubAccountings")}
          className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
        >
          Accounts Dashboard
        </button>
          </div>
            </div>
            
          </div>
        </div>
{showInfoPopup && selectedUser && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
      <div className="sticky top-0 z-20 bg-[#1392d3] px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center">
            <img
              src="/Icons/Curate-logoq.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Payment Information
            </h2>

            <p className="text-sky-100">
              {selectedUser.UserType} Details
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInfoPopup(false)}
          className="h-10 w-10 rounded-xl bg-white/20 text-white text-2xl hover:bg-white/30 transition-all"
        >
          ×
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-slate-500 text-sm">Name</p>
            <p className="font-bold text-lg">{selectedUser.name}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-slate-500 text-sm">User Type</p>
            <p className="font-bold text-lg">{selectedUser.UserType}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-slate-500 text-sm">Total Amount</p>
            <p className="font-bold text-lg">
              {selectedUser.total.toLocaleString()}
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <p className="text-slate-500 text-sm">Payable Amount</p>
            <p className="font-bold text-xl text-green-600">
              {selectedUser.amount.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-slate-500 text-sm">NEFT Ref No</p>
            <p className="font-bold text-lg">
              {selectedUser.neft || "Pending"}
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-slate-500 text-sm">Paid Status</p>

            <p
              className={`font-bold text-lg ${
                selectedUser.paid
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {selectedUser.paid ? "Paid" : "Pending"}
            </p>
          </div>

              
        </div>

        {selectedUser.UserType === "Client" && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-[#1392d3] mb-4">
              Client Information
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <p className="text-slate-500 text-sm">
                  Refund Amount
                </p>

                <p className="text-2xl font-bold text-red-600 mt-2">
                  {selectedUser.refund?.toLocaleString()}
                </p>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <p className="text-slate-500 text-sm">
                  Refund Date
                </p>

                <p className="text-2xl font-bold mt-2">
                  {selectedUser.refundDate}
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedUser.UserType === "HCA" && (
          <div className="mt-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
              <h3 className="text-xl font-bold text-[#1392d3]">
                HCA Financial Breakdown
              </h3>

              
            </div>

           <div className="space-y-6">
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 to-emerald-500 p-2 shadow-xl">
    <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-white/80 text-xs font-medium tracking-wide uppercase">
          Final Payable Amount
        </p>

        <h2 className="text-2xl font-bold text-white mt-2">
          {selectedUser.amount?.toLocaleString()}
        </h2>

        <p className="text-white/70 text-sm mt-2">
          Net amount after deductions & incentives
        </p>
      </div>

      <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
        <span className="text-3xl">💰</span>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
    <div className="bg-white border border-amber-100 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm font-medium">
          Advance
        </p>
        <span className="text-xl">📉</span>
      </div>

      <p className="text-3xl font-bold text-amber-600 mt-3">
        {selectedUser.advance?.toLocaleString()}
      </p>
    </div>

    <div className="bg-white border border-red-100 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm font-medium">
          Hostel Fee
        </p>
        <span className="text-xl">🏠</span>
      </div>

      <p className="text-3xl font-bold text-red-600 mt-3">
        {selectedUser.hostelFee?.toLocaleString()}
      </p>
    </div>

    <div className="bg-white border border-red-100 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm font-medium">
          Other Deductions
        </p>
        <span className="text-xl">➖</span>
      </div>

      <p className="text-3xl font-bold text-red-600 mt-3">
        {selectedUser.Other?.toLocaleString()}
      </p>
    </div>

    <div className="bg-white border border-green-100 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm font-medium">
          Other Incentives
        </p>
        <span className="text-xl">🎁</span>
      </div>

      <p className="text-3xl font-bold text-green-600 mt-3">
        {selectedUser.others?.toLocaleString()}
      </p>
    </div>

    <div className="bg-white border border-green-100 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm font-medium">
          Incentive
        </p>
        <span className="text-xl">🚀</span>
      </div>

      <p className="text-3xl font-bold text-green-600 mt-3">
        {selectedUser.incentive?.toLocaleString()}
      </p>
    </div>
  </div>
</div>

            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-3xl p-6">
              <h4 className="font-bold text-slate-800 mb-5">
                Salary Summary
              </h4>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <p className="text-slate-500 text-sm">
                    Gross Salary
                  </p>

                  <p className="text-xl font-bold">
                    {selectedUser.total?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">
                    Deductions
                  </p>

                  <p className="text-xl font-bold text-red-600">
                    
                    {(
                      (selectedUser.advance || 0) +
                      (selectedUser.hostelFee || 0) +
                      (selectedUser.other || 0)
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">
                    Incentives
                  </p>

                  <p className="text-xl font-bold text-green-600">
                    {selectedUser.incentive?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">
                    Net Pay
                  </p>

                  <p className="text-2xl font-bold text-[#1392d3]">
                    {selectedUser.amount?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    <PopupToast
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        logo="/Icons/Curate-logoq.png"
        duration={4000}
        autoClose={false}
        showProgress={true}
        onClose={() =>
          setPopup((prev) => ({ ...prev, isOpen: false }))
        }
      />

      {ShowRejectPopup&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
  <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
    
  

    <div className="p-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1392d3]/10">
          <img
            src="/Icons/Curate-logoq.png"
            alt="Company Logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        <h2 className="text-xl font-bold text-slate-800">
          Reject Request
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Please provide a reason for rejection. This information will be shared with the concerned team.
        </p>
      </div>
  <PopupToast
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        logo="/Icons/Curate-logoq.png"
        duration={4000}
        autoClose={false}
        showProgress={true}
        onClose={() =>
          setPopup((prev) => ({ ...prev, isOpen: false }))
        }
      />
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Rejection Reason
        </label>

        <textarea
          rows={4}
          onChange={(e) => SetRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all focus:border-[#1392d3] focus:ring-4 focus:ring-[#1392d3]/10"
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className="flex-1 rounded-2xl cursor-pointer border border-slate-200 px-4 py-3 font-medium text-slate-600 transition hover:bg-slate-50"
          onClick={() => setShowRejectPopup(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="flex-1 rounded-2xl bg-[#ff1493] px-4 py-3 cursor-pointer font-medium text-white shadow-lg shadow-[#ff1493]/20 transition hover:bg-[#e01284]"
          onClick={PostRejctedReason}
        >
          Reject
        </button>
      </div>
    </div>

  </div>
</div>}

   {showFullMonth && (
  <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-2">
    <div className="bg-white w-[70vw] h-[96vh] rounded-xl shadow-xl overflow-hidden flex flex-col">
      {(() => {
        const attendanceSummary = attendanceInfo.attendanceInfo?.reduce(
          (acc: any, att: any) => {
            const hcp = att.HCPAttendence === true;
            const admin = att.AdminAttendece === true;

            if (hcp && admin) {
              acc.present += 1;
            } else if (hcp || admin) {
              acc.halfDay += 1;
            } else {
              acc.absent += 1;
            }

            return acc;
          },
          {
            present: 0,
            halfDay: 0,
            absent: 0,
          }
        );

        return (
          <>
            <div className="flex items-center justify-between px-4 py-3  shrink-0">
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
                    {attendanceInfo.HCAName}
                  </p>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800">
                    Attendance Dashboard
                  </h2>
                  <p className="text-xs text-gray-400">
                    {
                      months.find(
                        (month) =>
                          month.value === String(SearchMonth).padStart(2, "0")
                      )?.name
                    }{" "}
                    {SearchYear}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowFullMonth(false)}
                className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                <Minimize2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 px-4 py-3 bg-gray-50 shrink-0">
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                <p className="text-xs text-green-600 font-medium">
                  Present Days
                </p>
                <p className="text-xl font-bold text-green-700">
                  {attendanceSummary?.present || 0}
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                <p className="text-xs text-amber-600 font-medium">Half Days</p>
                <p className="text-xl font-bold text-amber-700">
                  {attendanceSummary?.halfDay || 0}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                <p className="text-xs text-red-600 font-medium">Absent Days</p>
                <p className="text-xl font-bold text-red-700">
                  {attendanceSummary?.absent || 0}
                </p>
              </div>
            </div>

            <div className="flex-1 p-2 md:p-3">
              <div className="grid grid-cols-7 gap-2 h-full">
                {Array.from({ length: NumberOfDaysInMonth }, (_, i) => {
                  const today = new Date().getDate();

                  const dayInfo = attendanceInfo.attendanceInfo?.find(
                    (att: any) => {
                      const day = new Date(att.AttendenceDate).getDate();
                      return day === i + 1;
                    }
                  );

                  const hcp = dayInfo?.HCPAttendence === true;
                  const admin = dayInfo?.AdminAttendece === true;

                  let dayStatus = "-";

                  if (dayInfo) {
                    if (hcp && admin) {
                      dayStatus = "P";
                    } else if (hcp || admin) {
                      dayStatus = "HP";
                    } else {
                      dayStatus = "A";
                    }
                  }

                  const clientName = dayInfo?.Client_Name ?? "";
                  const UpdatedBy = dayInfo?.UpdatedBy ?? "-";
                  const AbsentReason = dayInfo?.Reason ?? "-";
                  const isFutureDate = i + 1 > today;

                  return (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col items-center justify-center p-1 min-h-0"
                    >
                      <span className="text-[10px] font-semibold text-gray-500 uppercase">
                        Day {i + 1}
                      </span>

                      {dayStatus === "-" ? (
                        <>
                          <span
                            className={`text-[8px] w-fit font-medium font-semibold px-2 py-1 rounded bg-gray-300 text-gray-500 border-gray-300`}
                          >
                            Not Marked
                          </span>

                          <span className="text-[8px] text-gray-400 truncate max-w-[70px]">
                            {clientName}
                          </span>
                        </>
                      ) : (
                        <>
                          <DayBadge status={dayStatus} />

                          {clientName && (
                            <span className="text-[8px] text-center leading-tight px-1 line-clamp-2">
                              {clientName}
                            </span>
                          )}

                          {UpdatedBy && UpdatedBy !== "-" && (
                            <div className="relative group mt-1">
                              <div className="p-[2px] rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
                                <Info className="w-3 h-3 text-gray-500" />
                              </div>

                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-2 rounded whitespace-nowrap z-50">
                                <div>Marked by: {UpdatedBy}</div>

                                {AbsentReason &&
                                  dayStatus !== "P" && (
                                    <div className="mt-1 border-t border-gray-700 pt-1">
                                      Reason: {AbsentReason}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
      })()}
    </div>
  </div>
)}
        <div className="overflow-auto max-h-[650px]">
          {filteredPayableData.length===0?
          
          
          <div className="h-[100vh] flex flex-col items-center justify-center py-12 px-6 rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-cyan-50 shadow-md">
 
  <img
     src="/Icons/Curate-logoq.png"
    alt="Company Logo"
    className="w-20 h-20 mb-4 object-contain"
  />



 
  <h3 className="text-xl font-bold text-[#1392d3] mb-2">
    No Data Available
  </h3>


  <p className="text-gray-600 text-center max-w-md">
    We couldn't find any records for the selected criteria. Try changing the
    filters or check back later.
  </p>

 
 
</div>:
          <table className="min-w-[1400px] w-full">
            <thead className="sticky top-0 z-30">
              <tr className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
                <th className="sticky left-0 z-40  px-5 py-4 text-left whitespace-nowrap">
                  S.No
                </th>

                <th className="sticky left-[80px] z-40  px-5 py-4 text-left whitespace-nowrap min-w-[260px]">
                   Name
                </th>
 <th className="px-5 py-4 text-center whitespace-nowrap">
                  Info
                </th>
                <th className="px-5 py-4 text-center whitespace-nowrap">
                  Time Sheet
                </th>

                <th className=" px-5 py-4 text-center whitespace-nowrap">
                  Total
                </th>

              

             
                <th className=" px-5 py-4 text-center whitespace-nowrap">
              Bank&Neft Info
                </th>

                <th className=" px-5 py-4 text-center whitespace-nowrap">
                  Amount
                </th>
  <th className="px-5 py-4 text-center whitespace-nowrap">
                  Reject
                </th>

                <th className=" px-5 py-4 text-center whitespace-nowrap">
                  Revert
                </th>
                
                <th className=" px-5 py-4 text-center whitespace-nowrap">
                  Paid Status
                </th>
              </tr>
            </thead>

            <tbody>
       
              {filteredPayableData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-200 hover:bg-sky-50 transition-all duration-200"
                >
                  <td className="sticky left-0 bg-white px-5 py-5 font-bold text-slate-800">
                    {index + 1}
                  </td>

                <td className="p-2 md:p-4 text-[10px] sm:text-xs md:text-sm break-words font-semibold">  
                
                  <div className="relative flex gap-2 items-center justify-between w-[110px]  group ">
                
                 
                
                
                    <span className="hover:underline font-semibold text-xm break-words leading-tight">
                    {GetHCPFullName(row.HCAId)
                  ? GetHCPFullName(row.HCAId)
                  : `${toProperCaseLive(row.name)} ${row.clientid}`}
                    </span>
                
                     <img
                      className="h-4 w-4"
                      src={
                        AssignSuitableIcon(
                          GetHCPGender(row.HCAId),
                          GetHCPType(row.HCAId)
                        ).image
                      }
                    />
                    <div
                      className="absolute -top-12 left-1/2 -translate-x-1/2
                                 opacity-0 group-hover:opacity-100
                                 translate-y-2 group-hover:translate-y-0
                                 transition-all duration-300 ease-out
                                 bg-gradient-to-br from-[#00A9A5] to-[#005f61]
                                 text-white text-xs font-medium
                                 px-3 py-2 rounded-xl shadow-xl
                                 whitespace-nowrap pointer-events-none z-50"
                    >
                      {
                        AssignSuitableIcon(
                          GetHCPGender(row.HCAId),
                          GetHCPType(row.HCAId)
                        ).caseType
                      }
                    </div>
                
                  </div>
                
                                 </td>

                 <td className="px-5 py-5 text-center">
  <button
    onClick={() => {
      setSelectedUser(row);
      setShowInfoPopup(true);
    }}
    className="inline-flex items-center gap-2 bg-yellow-500 cursor-pointer hover:bg-yellow-400 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all"
  >
    <Info size={18} />
  </button>
</td>
                  <td className="px-5 py-5 text-center">
                  <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out active:scale-95"
                   onClick={() => {
                      setShowFullMonth(true)
                      setAttendenceInfo(row)
                    }}
                  >
  View 
</button>
                  </td>

                  <td className="px-5 py-5 text-center font-bold text-slate-800">
                    {row.total}
                  </td>

       

                
                   <td className="px-5 py-5 text-center">
  {row.neft ? (
    <span className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700">
      {row.neft}
    </span>
  ) : (
    <div className="flex flex-col gap-2 items-center">
      <select
        className="w-48 bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1392d3]"
        onChange={(e) => setSelectedBank(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Select Bank
        </option>
        <option value="SBI">State Bank of India (SBI)</option>
        <option value="HDFC">HDFC Bank</option>
        <option value="ICICI">ICICI Bank</option>
      </select>

      <input
        type="text"
        placeholder="Enter NEFT Ref No"
        className="w-48 bg-slate-100 border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1392d3]"
        onChange={(e) => setNeftTransactionNumber(e.target.value)}
      />
    </div>
  )}
</td>

                  <td className="px-5 py-5 text-center font-bold text-[#50c896] text-lg">
                    {row.amount}
                  </td>
         <td className="px-5 py-5 text-center">
  <button
    className="inline-flex items-center cursor-pointer hover:shadow-lg justify-center min-w-[90px] h-10 px-4 rounded-xl bg-red-600 text-white font-semibold shadow-md hover:opacity-90 transition-all"
   onClick={()=>{
    setShowRejectPopup(true)
    setSelectedUser(row)
   }}
  >
        <CircleSlash2 />
  </button>
</td>

<td className="px-5 py-5 text-center">
<button className="inline-flex items-center gap-2 bg-green-600 cursor-pointer hover:shadow-lg text-white px-5 py-2 rounded-xl font-semibold"
onClick={() => { 
  UpdateRevertStatus(row.ClientId,row.HCAid,row.Month,row.StartDate,row)
 }}
>
                    <CornerUpLeft size={16} />
                    Revert 
                  </button>
</td>
                  <td className="px-5 py-5 text-center">
                   <button
             
              className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
              onClick={() => {
                setSelectedUser(row);
                PostSuccesfullPayment(row.HCAid)
              }}
            >
              Paid
            </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>}
        </div>
      </div>
 
  );
}