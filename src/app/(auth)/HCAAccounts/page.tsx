"use client";
let cachedUsersFullInfo: any[] = [];
let cachedDeploymentInfo: any[] = [];

let cachedRegisterdUsers: any[] = [];
import React, { useEffect, useMemo, useState } from "react";
import { CircleX, Info, Minimize2, Search, Slice, Users } from "lucide-react";
import { months, years } from "@/Lib/Content";
import { UpdateMonthFilter, UpdateYearFilter } from "@/Redux/action";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LoadingData } from "@/Components/Loading/page";
import { GetAllUsersData, PostINPayblePage, updateExpense, UpdatePassword, UpdatePaymentVerificationStatusInDb } from "@/Lib/user.action";
import { AssignSuitableIcon, getDaysInMonth, toProperCaseLive } from "@/Lib/Actions";
import PopupToast from "@/Components/ExpencesPopUp/page";
import axios from "axios";

type Transaction = {
  id: string;
  field: "advance" | "hostel" | "other" | "incentives" | "others";
  previousAmount: number;
  changedAmount: number;
  newAmount: number;
  description: string;
  createdAt: string;
  action: "added" | "reduced";
  UpdatedBy:any

};

type PayrollRow = {
  Clientid: any;
  HCAId: any;
  HCAName: any;
  id: number;
  name: string;
  payment: number;
  advance: number;
  hostel: number;
  other: number;
  incentives: number;
  others: number;
  advanceDescription: string;
  hostelDescription: string;
  otherDescription: string;
  incentivesDescription: string;
  othersDescription: string;
  transactions: Transaction[];
  attendanceInfo:any,
  CompliteAttendeceSummery:any,
  Expences:any
};
type User = any;
type Deployment = any;
type Replace = any;
type Termination=any;
export default function HCAPayrollTable() {
  const [search, setSearch] = useState("");
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [selectedTransactions, setSelectedTransactions] =
    useState<PayrollRow | null>(null);
  const [originalValues, setOriginalValues] = useState<Record<number, PayrollRow>>(
    {}
  );
  const [active, setActive] = useState("hca");
    const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
const [showFullMonth,setShowFullMonth]=useState(false)
  const SearchMonth = useSelector((state: any) => state.FilterMonth);
  const SearchYear = useSelector((state: any) => state.FilterYear);
const [attendanceInfo,setAttendenceInfo]=useState<any>()
  const [ClientsInformation, setClientsInformation] = useState<Deployment[]>([]);
      const [RegisterdUsers,setRegisterdUsers]=useState<any[]>([])
        const [users, setUsers] = useState<User[]>([]);
   const [ActionStatusMessage,SetActionStatusMessage]= useState<any>("");
    const [isChecking, setIsChecking] = useState(true);
   const loggedInEmail=useSelector((state:any)=>state.LoggedInEmail)
   const router=useRouter()
     const dispatch = useDispatch();
    const [data, setData] = useState<any[]>([])

  // const [data, setData] = useState<PayrollRow[]>([
  //   {
  //     id: 1,
  //     name: "Srinivas",
  //     payment: 10000,
  //     advance: 2000,
  //     hostel: 1000,
  //     other: 500,
  //     incentives: 1000,
  //     others: 300,
  //     advanceDescription: "",
  //     hostelDescription: "",
  //     otherDescription: "",
  //     incentivesDescription: "",
  //     othersDescription: "",
  //     transactions: [],
  //   },
  //   {
  //     id: 2,
  //     name: "Ramesh Kumar",
  //     payment: 14500,
  //     advance: 1500,
  //     hostel: 900,
  //     other: 400,
  //     incentives: 1200,
  //     others: 600,
  //     advanceDescription: "",
  //     hostelDescription: "",
  //     otherDescription: "",
  //     incentivesDescription: "",
  //     othersDescription: "",
  //     transactions: [],
  //   },
  //   {
  //     id: 3,
  //     name: "Anitha Devi",
  //     payment: 12000,
  //     advance: 1000,
  //     hostel: 700,
  //     other: 300,
  //     incentives: 900,
  //     others: 400,
  //     advanceDescription: "",
  //     hostelDescription: "",
  //     otherDescription: "",
  //     incentivesDescription: "",
  //     othersDescription: "",
  //     transactions: [],
  //   },
  //   {
  //     id: 4,
  //     name: "Kiran Reddy",
  //     payment: 18000,
  //     advance: 2500,
  //     hostel: 1500,
  //     other: 1000,
  //     incentives: 2000,
  //     others: 900,
  //     advanceDescription: "",
  //     hostelDescription: "",
  //     otherDescription: "",
  //     incentivesDescription: "",
  //     othersDescription: "",
  //     transactions: [],
  //   },
  //   {
  //     id: 5,
  //     name: "Mahesh",
  //     payment: 16000,
  //     advance: 1800,
  //     hostel: 1200,
  //     other: 700,
  //     incentives: 1700,
  //     others: 500,
  //     advanceDescription: "",
  //     hostelDescription: "",
  //     otherDescription: "",
  //     incentivesDescription: "",
  //     othersDescription: "",
  //     transactions: [],
  //   },
  // ]);

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
  } = await GetAllUsersData();
  
        if (!mounted) return;
  
        cachedUsersFullInfo = usersResult ?? [];
        cachedDeploymentInfo = placementInfo ?? [];
   
      cachedRegisterdUsers=RegisterdUsers??[]
        setUsers([...cachedUsersFullInfo]);
        setClientsInformation([...cachedDeploymentInfo]);
   
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
const GetHCPPayment = (A: any) => {
  if (!users?.length || !A) return 0;

  const payment =
    users
      ?.map((each: any) => each?.HCAComplitInformation)
      ?.find((info: any) => info?.UserId === A)
      ?.["PaymentforStaff"] ?? 0;

  return Number(payment) || 0;
};

const getExpenseList = (userId: string) => {
  if (!users?.length || !userId) return null;

  return users.find(
    (each: any) =>
      each?.HCAComplitInformation?.UserId === userId
  )?.HCAComplitInformation.MonthlyExpenses
;
};

const getTransactions = (userId: string) => {
  if (!users?.length || !userId) return null;

  return users.find(
    (each: any) =>
      each?.HCAComplitInformation?.UserId === userId
  )?.HCAComplitInformation.Transactions
;
};
 

const DeployInformation = ClientsInformation.map((each: any) => {
     const attendanceSummary = each.Attendance.reduce(
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
        const Expenses=getExpenseList(each.HCAId)
        const Transactions=getTransactions(each.HCAId)
  const MonthlyExpensesInfo =
  Array.isArray(Expenses)
    ? Expenses.find(
        (exp: any) => exp.Month === `${SearchMonth}-${SearchYear}`
      )
    : null;
  return {
    ...each,
    Clientid: each.ClientId,
    name: each.HCAName,
    transactions: MonthlyExpensesInfo?.Transactions||[],
    attendanceInfo: each.Attendance,
    PaymentVerficationStatus:each.PaymentVerificationStatus||"Process",
    CompliteAttendeceSummery: attendanceSummary,
    PreviewINPaymentPage:each.PreviewINPaymentPage||"Enabled",
    Expences: MonthlyExpensesInfo?.DueAmounts[0]||MonthlyExpensesInfo?.DueAmounts || {
      advance: 0,
      hostel: 0,
      other: 0,
      incentives: 0,
      others: 0,
      advanceDescription: "",
      hostelDescription: "",
      otherDescription: "",
      incentivesDescription: "",
      othersDescription: "",
    }


  };
});

useEffect(() => {
  const filtered = DeployInformation.filter((item) =>
    matchesSearchAndMonth(
      item,
      search,
      SearchMonth,
      SearchYear
    )
  );

  setData(filtered);
}, [ClientsInformation, search, SearchMonth, SearchYear]);

const NumberOfDaysInMonth = getDaysInMonth(
  Number(SearchMonth),
  Number(SearchYear)
);
console.log("Check Information------",DeployInformation)

const UpdatePaymentStatus=async(HCAId:any,ClientId:any,status:any)=>{
  setPopup({
      isOpen: true,
      message: "Please Wait Updating Payment Status...",
      type: "loading",
    });
  const value = status
 
    const MonthInfo=`${SearchYear}-${SearchMonth}`
    const UpdatedinDB=await UpdatePaymentVerificationStatusInDb(HCAId,ClientId,value,MonthInfo)
    console.log("Check Updated Payment Status----",UpdatedinDB)
    if(UpdatedinDB.success){
      
      setData((prev) =>
      prev.map((item) =>
        item.HCAId === HCAId    ? { ...item, PaymentVerficationStatus: value }
        : item
      )
    ); 

     setPopup({
        isOpen: true,
        message: "Payment Status Updated successfully!",
        type: "success",
      });
    }else{
        setPopup({
        isOpen: true,
        message:UpdatedinDB.message || "Failed to update payment status",
        type: "error",
      });
    }
    
  }

  const UpdatePayablePage=async(row:any,totalAmount:any)=>{
    try{
       setPopup({
      isOpen: true,
      message: "Generating payable page details...",
      type: "loading",
    });
     const MonthInfo=`${SearchYear}-${SearchMonth}`
     console.log("Check Row Information for Payable Page----",row.ClientId,row.HCAId,MonthInfo)
    const UpdatedinDB=await PostINPayblePage(row.HCAId,row.ClientId,MonthInfo,row,totalAmount)
    console.log("Check Updated Payment Status----",UpdatedinDB)
    if(UpdatedinDB.success){
      
      setData((prev) =>
      prev.map((item) =>
        item.HCAId ===row. HCAId    ? { ...item, PreviewINPaymentPage: "Disabled" }
        : item
      )
    ); 

     setPopup({
        isOpen: true,
        message: UpdatedinDB.message || "Moved to Payable Page successfully!",
        type: "success",
      });
    }else{
        setPopup({
        isOpen: true,
        message: UpdatedinDB.message || "Failed to post payment record",
        type: "error",
      });
    }
    }catch(err){}
  }
  const getTotal = (row: PayrollRow) =>
    row.payment -
    row.advance -
    row.hostel -
    row.other +
    row.incentives +
    row.others;

  const formatCurrency = (amount: number,present: any, halfDay: any, absent:any) =>{
    const FullPayment=Number(present)*Number(amount)
    const HalfDayAmount=Number(halfDay)*Number(amount)/2
     return Math.round(FullPayment + HalfDayAmount);
  };

 const handleSave = async (row: PayrollRow) => {

  setPopup({
      isOpen: true,
      message: "Posting Payment Record...",
      type: "loading",
    });
  const originalRow = originalValues[row.Clientid];
  if (!originalRow) return;

  const editableFields = [
    ["advance", "advanceDescription"],
    ["hostel", "hostelDescription"],
    ["other", "otherDescription"],
    ["incentives", "incentivesDescription"],
    ["others", "othersDescription"],
  ];

  const newTransactions: Transaction[] = [];

  editableFields.forEach(([amountField, descField]) => {
    const oldValue =
      originalRow.Expences[
        amountField as keyof PayrollRow["Expences"]
      ] as number;

    const newValue =
      row.Expences[
        amountField as keyof PayrollRow["Expences"]
      ] as number;

    const description =
      row.Expences[
        descField as keyof PayrollRow["Expences"]
      ] as string;

    if (oldValue !== newValue) {
      newTransactions.push({
        id: crypto.randomUUID(),
        field: amountField as Transaction["field"],
        previousAmount: oldValue,
        changedAmount: Math.abs(newValue - oldValue),
        newAmount: newValue,
        description,
        createdAt: new Date().toLocaleString(),
        action: newValue > oldValue ? "added" : "reduced",
        UpdatedBy:loggedInEmail
      });
    }
  });

  setData((prev) =>
    prev.map((item) =>
      item.Clientid === row.Clientid
        ? {
            ...item,
            Expences: row.Expences,
            transactions: [...item.transactions, ...newTransactions],
          }
        : item
    )
  );
console.log("Check loggedInEmail",loggedInEmail)
    const UpdatingExpenses = await updateExpense(
    row.HCAId,
    row.Expences,
    loggedInEmail,
    newTransactions,
    `${SearchMonth}-${SearchYear}`
  );
console.log("Check Updated Expenses----",UpdatingExpenses)
  if(UpdatingExpenses.success){
     const res:any=await axios.post("/api/Slack", {
  userIds: ["U0992KS6811", "U04RYNQJJF7"],
  isHighlight: true,
  message: {
    title: "New Expence/Incentive Updated",
    body: `Expense/incentive records have been updated for ${row.HCAName} the latest changes`,
  },
});
 setPopup({
        isOpen: true,
        message: "Payment Record Posted successfully!",
        type: "success",
      });
  }else{  
     setPopup({
        isOpen: true,
        message: UpdatingExpenses.message || "Failed to post payment record",
        type: "error",
      });
  
  }
  

  setEditingRowId(null);

  setOriginalValues((prev) => {
    const updated = { ...prev };
    delete updated[row.Clientid];
    return updated;
  });
};
const handleChange = (
  id: number,
  field: keyof PayrollRow["Expences"],
  value: string | number
) => {
  setData((prev) =>
    prev.map((row) =>
      row.Clientid === id
        ? {
            ...row,
            Expences: {
              ...row.Expences,
              [field]:
                typeof row.Expences[field] === "number"
                  ? value === ""
                    ? 0
                    : Number(value)
                  : value,
            },
          }
        : row
    )
  );
};

  const fields = [
    ["advance", "advanceDescription", "advance"],
    ["hostel", "hostelDescription", "Hostel"],
    ["other", "otherDescription", "Other"],
    ["incentives", "incentivesDescription", "Incentives"],
    ["others", "othersDescription", "Others"],
  ];
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
    <div className="w-full min-h-screen bg-[#f4f7fb] p-3 md:p-6 overflow-x-hidden">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div  className="flex items-center gap-4 justify-between w-full">
        

          <div className="flex items-center gap-4">
              <img
            src="/Icons/Curate-logoq.png"
            alt="Company Logo"
            className="h-12 w-12 object-contain"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
         Process
            </h1>
            <p className="text-sm text-[#64748b]">
              Payroll Management Dashboard
            </p>
            </div>
          </div>
          <button
onClick={() => router.push("/SubAccountings")}
          className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
        >
          Accounts Dashboard
        </button>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full justify-end">
         


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
          </div>
        </div>
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

    <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
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
  <table className="w-full table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
               <th className=" p-2 md:p-4 text-left text-[10px] sm:text-xs md:text-sm whitespace-normal break-words">S No</th>
              <th className=" p-2 md:p-4 text-left text-[10px] sm:text-xs md:text-sm whitespace-normal break-words">HCA </th>
                            <th className="p-2 md:p-4 text-left text-[10px] sm:text-xs md:text-sm whitespace-normal break-words">TimeSheet</th>
              <th className=" p-2 md:p-4 text-left text-[10px] sm:text-xs md:text-sm whitespace-normal break-words">Payment</th>
              <th className=" p-4 text-left">Advance</th>
              <th className=" p-4 text-left">Hostel</th>
              <th className=" p-4 text-left">Other</th>
              <th className=" p-4 text-left">Incentives</th>
              <th className="p-4 text-left">Others</th>
              <th className=" w-[250px] p-4 text-center">
                Action
              </th>
              <th className=" p-4 text-left">Total</th>
              <th className=" p-4 text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {data.filter((row) => row.PreviewINPaymentPage !== "Disabled")
  .map((row:any,Ind:any) => {
     
const PresentDays=row?.CompliteAttendeceSummery.present
const HalfDays=row?.CompliteAttendeceSummery.halfDay
const HCPPayment:any=GetHCPPayment(row.HCAId)||0
              const isEditing = editingRowId === row.HCAId;
              const MinusItems=Number(row.Expences.advance)+Number(row.Expences.hostel)+Number(row.Expences.other)
              const Additems=Number(row.Expences.others)+Number(row.Expences.incentives)
         const dailyPayment = formatCurrency(
  HCPPayment / 30.41666666666667,
  PresentDays,
  HalfDays,
  0
);

const totalExpenses =
  Number(row.Expences?.advance || 0) +
  Number(row.Expences?.hostel || 0) +
  Number(row.Expences?.other || 0);

              return (
                <tr key={Ind} className="border-b">
                      <td className="p-4 text-center font-semibold">{Ind+1}</td>
                 <td className="p-2 md:p-4 text-[10px] sm:text-xs md:text-sm break-words font-semibold">  

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
                  <td className="p-4"><button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out active:scale-95"
                    onClick={() => {
                      setShowFullMonth(true)
                      setAttendenceInfo(row)
                    }}>
                    View
                  </button></td>

 

                  <td className="p-4">{formatCurrency(HCPPayment/30.41666666666667,PresentDays,HalfDays,0)}</td>

  {fields.map(([amountField, descField, label]) => (
  <td key={amountField} className="p-3">
    {isEditing ? (
      <div className="space-y-2">
        <input
          type="text"
         
          value={row.Expences[amountField as keyof PayrollRow["Expences"]]}
          onChange={(e) =>
            handleChange(
              row.Clientid,
              amountField as keyof PayrollRow["Expences"],
              e.target.value
            )
          }
          className="w-full h-10 px-3 border rounded-lg"
        />

        <input
          type="text"
          placeholder={`${label} Description`}
          value={row.Expences[descField as keyof PayrollRow["Expences"]]}
          onChange={(e) =>
            handleChange(
              row.Clientid,
              descField as keyof PayrollRow["Expences"],
              e.target.value
            )
          }
          className="w-full h-10 px-3 border rounded-lg"
        />
        {["advance", "hostel", "other"].includes(amountField) &&
  (  Number(row.Expences?.[amountField as keyof PayrollRow["Expences"]] || 0) > dailyPayment || totalExpenses > dailyPayment) && (
    <div className="text-red-600 text-[10px]">
    ⚠ Expenses exceed HCA Payment
    </div>
)}
      </div>
    ) : (
      <div>
        <div>
          {row.Expences[amountField as keyof PayrollRow["Expences"]]}
        </div>

      
      </div>
    )}
  </td>
))}

                  <td className="w-[260px] px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          if (isEditing) {
                            handleSave(row);
                          } else {
                            setOriginalValues((prev) => ({
                              ...prev,
                              [row.Clientid]: {
  ...row,
  Expences: { ...row.Expences },
},
                            }));
                            setEditingRowId(row.HCAId);
                          }
                        }}
                        className={`h-10 px-3 cursor-pointer flex items-center justify-center gap-2 rounded-xl border text-sm font-medium whitespace-nowrap ${
                          isEditing
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-900 border-slate-300"
                        }`}
                        
                      >
                        {isEditing ? "Save" : "Edit"}
                      </button>
<select
defaultValue={row.PaymentVerficationStatus}
  className={`px-4 py-2 rounded-xl border border-slate-300 ${row.PaymentVerficationStatus === "Process" ? "bg-pink-300" : "bg-green-500"} text-sm font-medium shadow-sm focus:outline-none focus:ring-2  ${row.PaymentVerficationStatus === "Process" ? "focus:ring-pink-500" : "focus:ring-green-500"}`}
  onChange={(e) => {
    UpdatePaymentStatus(row.HCAId,row.Clientid, e.target.value);  
  }}
>
  <option value="Process" >
    Process
  </option>
  <option value="Save" >
    Save
  </option>
</select>
                      <button
                     disabled={row.PaymentVerficationStatus==="Process"}
                        className={`h-10 px-3 flex items-center  justify-center gap-2 rounded-xl ${row.PaymentVerficationStatus === "Process" ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 cursor-pointer"} text-white text-sm font-medium`}
                        onClick={() => {
                          UpdatePayablePage(row,(formatCurrency(HCPPayment/ 30.41666666666667,PresentDays,HalfDays,0)+Additems-MinusItems))
                        }}
                      >
                        Pay 
                      </button>
                    </div>
                  </td>

                  <td className="p-4 font-bold">
                    {formatCurrency(HCPPayment/ 30.41666666666667,PresentDays,HalfDays,0)+Additems-MinusItems}
                  </td>

                  <td className="p-4 font-bold text-center">
                    <button
                      onClick={() => setSelectedTransactions(row)}
                      className="h-10 px-4 mx-auto flex items-center justify-center rounded-xl bg-indigo-600 text-white text-sm font-medium cursor-pointer"
                    >
                      Financial History
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedTransactions && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl max-h-[85vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <img
                  src="/Icons/Curate-logoq.png"
                  className="h-12"
                  alt="Company Logo"
                />
                <h2 className="text-2xl font-bold text-[#0f172a] text-center">
                  {selectedTransactions.name} Earnings and expenditures
                </h2>
              </div>

              <button
                onClick={() => setSelectedTransactions(null)}
                className="cursor-pointer"
              >
                <CircleX />
              </button>
            </div>

            {selectedTransactions.transactions.length === 0 ? (
              <p className="text-gray-500">No Expenses found</p>
            ) : (
              <div className="space-y-4">
                {selectedTransactions.transactions
                  .slice()
                  .reverse()
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="border rounded-2xl p-4 bg-[#f8fafc]"
                    >
                      <div className="flex justify-between items-center mb-2">
<h3
  className={`font-bold capitalize text-lg ${
    transaction.field === "advance" ||
    transaction.field === "hostel" ||
    transaction.field === "other"
      ? "text-red-600"
      : "text-green-600"
  }`}
>
                          {transaction.field} {
    transaction.field === "advance" ||
    transaction.field === "hostel" ||
    transaction.field === "other"
      ?"-":"+"}
                        </h3>
                        <span
                          className={`text-sm font-semibold ${
                            transaction.action === "added"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.action.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-[#334155]">
                        <p>
                          Previous Amount: 
                          {transaction.previousAmount.toLocaleString()}
                        </p>
                        <p>
                          Changed Amount: 
                          {transaction.changedAmount.toLocaleString()}
                        </p>
                        <p>
                          New Total: {transaction.newAmount.toLocaleString()}
                        </p>
                        <p>
                          Description:{" "}
                          {transaction.description || "No description"}
                        </p>
                        <p>Date: {transaction.createdAt}</p>
                        <p>Acknowledged by: {transaction.UpdatedBy}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

