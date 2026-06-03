"use client";
let cachedUsersFullInfo: any[] = [];
let cachedDeploymentInfo: any[] = [];

let cachedRegisterdUsers: any[] = [];
let cachedPayableData:any[]=[]
type User = any;
type Deployment = any;
type Replace = any;
type Termination=any;
import { useEffect, useState } from "react";
import { CircleSlash2, CornerUpLeft, Eye, Info, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUsersData, PostINPayblePage, PostINRejectionDb, PostINSuccesfulPaymentsDb, UpdateStatusEnable } from "@/Lib/user.action";
import { LoadingData } from "@/Components/Loading/page";
import { years } from "@/Lib/Content";
import { UpdateMonthFilter, UpdateYearFilter } from "@/Redux/action";
import PopupToast from "@/Components/ExpencesPopUp/page";
import { AssignSuitableIcon, toProperCaseLive } from "@/Lib/Actions";

export default function HCAPaymentTable() {
const [data] = useState([
  {
    id: 1,
    UserType: "Client",
    name: "Roshani Sunkatrao",
    total: 540000,
    refund: 15000,
    refundDate: "2026-05-28",
    reject: 0,
    revert: 1,
    neft: "HCA2026001",
    amount: 540000,
    paid: true,
  },

  {
    id: 3,
    UserType: "Client",
    name: "Priyanka",
    total: 499000,
    refund: 10000,
    refundDate: "2026-05-24",
    reject: 1,
    revert: 2,
    neft: "HCA2026003",
    amount: 499000,
    paid: false,
  },
  
  {
    id: 6,
    UserType: "Client",
    name: "Kavita Koko",
    total: 546000,
    refund: 20000,
    refundDate: "2026-05-30",
    reject: 0,
    revert: 0,
    neft: "",
    amount: 546000,
    paid: true,
  },
  
  {
    id: 8,
    UserType: "Client",
    name: "Sanjana",
    total: 460000,
    refund: 12000,
    refundDate: "2026-05-22",
    reject: 1,
    revert: 1,
    neft: "HCA2026008",
    amount: 460000,
    paid: false,
  },
]);
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
const [userTypeFilter, setUserTypeFilter] = useState("All");
const [selectedUser, setSelectedUser] = useState<any>(null);
const [attendanceInfo,setAttendenceInfo]=useState<any>()
const [ShowRejectPopup,setShowRejectPopup]=useState(false) 
const [RejectionReason,SetRejectionReason]=useState("") 
const [NeftTransactionNumber,setNeftTransactionNumber]=useState("")
  const [search, setSearch] = useState("");
  const [ClientsInformation, setClientsInformation] = useState<Deployment[]>([]);
  const [paybleData,setPaybleData]=useState<any[]>([])
      const [RegisterdUsers,setRegisterdUsers]=useState<any[]>([])
        const [users, setUsers] = useState<User[]>([]);
const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [ActionStatusMessage,SetActionStatusMessage]= useState<any>("");
   const [isChecking, setIsChecking] = useState(true);
     const loggedInEmail=useSelector((state:any)=>state.LoggedInEmail)
       const SearchMonth = useSelector((state: any) => state.FilterMonth);
       const SearchYear = useSelector((state: any) => state.FilterYear);
  const router=useRouter()
  const dispatch=useDispatch()
  useEffect(() => {
    if(loggedInEmail===""){
      router.push("/DashBoard")
    }
    let mounted = true;
  
    const isSuccessUpdate = ActionStatusMessage?.includes("Successfully");
  
    const fetchData = async () => {
      try {

        setIsChecking(true);
   
        if (!isSuccessUpdate && cachedDeploymentInfo?.length > 0) {
          setUsers([...cachedUsersFullInfo]);
          setClientsInformation([...cachedDeploymentInfo]);
          setRegisterdUsers([...cachedRegisterdUsers])
          setPaybleData([...cachedPayableData])
          return;
        }
  
        // const [
        //   RegisterdUsers,
        //   usersResult,
        //   placementInfo,
        //   replacementInfo,
        //   terminationInfo,
        // ] = await Promise.all([
        //    GetRegidterdUsers() ,
        //   GetUsersFullInfo(),
        //   GetDeploymentInfo(),
        //   GetReplacementInfo(),
        //   GetTerminationInfo(),
        // ]);
        const {
    RegisterdUsers,
    usersResult,
    placementInfo,
    replacementInfo,
    terminationInfo,
    ExportedPayableData
  } = await GetAllUsersData();
  
        if (!mounted) return;
  
        cachedUsersFullInfo = usersResult ?? [];
        cachedDeploymentInfo = placementInfo ?? [];
   cachedPayableData=ExportedPayableData??[]
      cachedRegisterdUsers=RegisterdUsers??[]
        setUsers([...cachedUsersFullInfo]);
        setClientsInformation([...cachedDeploymentInfo]);
   setPaybleData([...cachedPayableData])
         setRegisterdUsers([...cachedRegisterdUsers])
  
      
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setIsChecking(false);
      }
    };
  
    fetchData();
  
    return () => {
      mounted = false;
    };
  }, [ActionStatusMessage]);

const PayableDataformation = paybleData.map((each: any) => {
    console.log("Each Payable Record:", each); // Debug log to check the structure of each record
  return {
    ...each,
     UserType: "HCA",
    Clientid: each.ClientId,
    HCAid: each.HCAId,
    name: each.HCAName,
    total: each.GrandTotalAmount||0,
    advance: each.Expences.advance||0,
    hostelFee: each.Expences.hostel||0,
    Other:each.Expences.other||0,
    others: each.Expences.others||0,
    incentive: each.Expences.incentives||0,
    reject: 0,
    revert: 0,
    neft:each.NeftNumber|| "",
    amount:each.GrandTotalAmount||0,
    paid: each.PaidStatus ||false,
Month: each.Month
    }



});
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

useEffect(() => {
   const filtered = PayableDataformation.filter((item) =>
    matchesSearchAndMonth(
      item,
      search,
      SearchMonth,
      SearchYear
    )
  );

  setPaybleData(filtered);
}, [ClientsInformation, search, SearchMonth, SearchYear]);

const UpdateRevertStatus = async (ClientId:any,HCAId:any,Month:any) => {
try{
  setPopup({
      isOpen: true,
      message: "Please Wait Updating Payment Status...",
      type: "loading",
    });
const PostINPayblePageResult = await UpdateStatusEnable(HCAId,ClientId,Month);
   if(PostINPayblePageResult.success){
      
    

     setPopup({
        isOpen: true,
        message:"Revert Status Updated successfully!",
        type: "success",
      });
    }else{
        setPopup({
        isOpen: true,
        message:PostINPayblePageResult.message || "Failed to update payment status",
        type: "error",
      });
    }
}catch(err){
  console.error("Error updating revert status:", err);
}
}

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

const PostSuccesfullPayment=async()=>{
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
    const PostinDb=await PostINSuccesfulPaymentsDb(selectedUser,ExportNeftNumber,MonthInfo)
    if(PostinDb.success){
      setPaybleData((prevData) =>
        prevData.map((item) =>
          item.HcaId === selectedUser.HcaId ? { ...item, neft: NeftTransactionNumber } : item
        )
      );
      setPopup({
        isOpen: true,
        message: "Successful payment information recorded successfully!",
        type: "success",
      });
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


     const GetHCPType = (A: any) => {
    if (!RegisterdUsers?.length || !A) return "Not Entered";

    const CurrentPreviewUserType:any =
      RegisterdUsers.filter((each:any)=>each.userId===A)

    return CurrentPreviewUserType[0]?.PreviewUserType ?? "Not Entered";
  };

const filteredData =
  userTypeFilter === "All"
    ? data
    : data.filter((item) => item.UserType === userTypeFilter);
    if (isChecking) {
      return (
    <LoadingData/>
  
      );
    }
  return (
    
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-5 md:px-8 py-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
        

          <div className="flex items-center gap-4">
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
 <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl">
  {["All", "Client", "HCA"].map((type) => (
    <button
      key={type}
      onClick={() => setUserTypeFilter(type)}
      className={`h-8 px-4 rounded-lg text-sm font-semibold transition-all ${
        userTypeFilter === type
          ? "bg-[#1392d3] text-white shadow-sm"
          : "text-slate-600 hover:text-[#1392d3]"
      }`}
    >
      {type}
      {" "}
      (
      {type === "All"
        ? data.length
        : data.filter((item) => item.UserType === type).length}
      )
    </button>
  ))}
</div>
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
        <div className="overflow-auto max-h-[650px]">
          {paybleData.length===0?<div className="h-[100vh] flex flex-col items-center justify-center py-12 px-6 rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-cyan-50 shadow-md">
 
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
                {/* <th className="px-5 py-4 text-center whitespace-nowrap">
                  Time Sheet
                </th> */}

                <th className=" px-5 py-4 text-center whitespace-nowrap">
                  Total
                </th>

              

                <th className=" px-5 py-4 text-center whitespace-nowrap">
                  NEFT Ref No
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
       
              {paybleData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-200 hover:bg-sky-50 transition-all duration-200"
                >
                  <td className="sticky left-0 bg-white px-5 py-5 font-bold text-slate-800">
                    {index + 1}
                  </td>

                  <td className="sticky left-[80px] bg-white px-5 py-5 font-semibold text-slate-800">
                    <div className="relative flex gap-2 items-center justify-between w-[100px]  group ">
                    
                     
                    
                    
                        <span className="hover:underline font-semibold text-xm break-words leading-tight">
                          {toProperCaseLive(row.name)}{row.clientid}
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
                  {/* <td className="px-5 py-5 text-center">
                  <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out active:scale-95"
                  >
  View 
</button>
                  </td> */}

                  <td className="px-5 py-5 text-center font-bold text-slate-800">
                    {row.total}
                  </td>

       

                  <td className="px-5 py-5 text-center">
                    {row.neft? <span className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700">
                      {row.neft}
                    </span>:<input type="text" placeholder="Enter NEFT Ref No" className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700" onChange={(e) => setNeftTransactionNumber(e.target.value)}/>}
                   
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
  UpdateRevertStatus(row.ClientId,row.HCAid,row.Month)
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
                PostSuccesfullPayment()
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