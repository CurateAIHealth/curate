"use client";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

let replacementTerminationCache: {
  data: {
    replacementInfo: any[];
    terminationInfo: any[];
  } | null;
  timestamp: number;
  promise: Promise<any> | null;
} = {
  data: null,
  timestamp: 0,
  promise: null,
};
import React, { useEffect, useMemo, useState } from "react";
import { ChevronRight, CircleX, Info, Menu, Minimize2, Search, Slice, Users, X } from "lucide-react";
import { menuItems, months, years } from "@/Lib/Content";
import { UpdateMonthFilter, UpdateYearFilter } from "@/Redux/action";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LoadingData } from "@/Components/Loading/page";
import { GetAllUsersData, PostINPayblePage, PostINPayblePageforRepleasments, PostINPayblePageforTermination, updateExpense, UpdatePassword, UpdatePaymentVerificationStatusInDb, UpdatePaymentVerificationStatusInReplacementDb, UpdatePaymentVerificationStatusInTerminationDb } from "@/Lib/user.action";
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
const RegisterdUsers=useSelector((state:any)=>state.AdminUsers)
const users=useSelector((state:any)=>state.AdminFullInfo)
const ClientsInformation=useSelector((state:any)=>state.AdminDeployment)

     const [activeStatus, setActiveStatus] = useState("Process");
const [menuOpen, setMenuOpen] = useState(false);
const statuses = ["Process", "Save", "Hold", "Rejected"];
      const [ReplacementInformation, setReplacementInformation] = useState<Replace[]>([]);
      const [TerminationInformation, setTerminationInformation] = useState<Termination[]>([]);
   
   const [ActionStatusMessage,SetActionStatusMessage]= useState<any>("");
    const [isChecking, setIsChecking] = useState(false);
   const loggedInEmail=useSelector((state:any)=>state.LoggedInEmail)
   const router=useRouter()
     const dispatch = useDispatch();
    const [data, setData] = useState<any[]>([])
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
const fetchData = async (forceRefresh = false) => {
  const now = Date.now();

  // Use cache if valid
  if (
    !forceRefresh &&
    replacementTerminationCache.data &&
    now - replacementTerminationCache.timestamp < CACHE_DURATION
  ) {
    const { replacementInfo, terminationInfo } =
      replacementTerminationCache.data;

    setReplacementInformation(replacementInfo);
    setTerminationInformation(terminationInfo);
    return;
  }

  // Prevent duplicate simultaneous requests
  if (replacementTerminationCache.promise && !forceRefresh) {
    setIsChecking(true);

    try {
      const data = await replacementTerminationCache.promise;

      setReplacementInformation(data.replacementInfo);
      setTerminationInformation(data.terminationInfo);
    } finally {
      setIsChecking(false);
    }

    return;
  }

  setIsChecking(true);

  replacementTerminationCache.promise = axios
    .get("/api/Replacmentterminationinfo")
    .then((res) => res.data.data);

  try {
    const data = await replacementTerminationCache.promise;

    replacementTerminationCache = {
      data,
      timestamp: Date.now(),
      promise: null,
    };

    setReplacementInformation(data.replacementInfo);
    setTerminationInformation(data.terminationInfo);
  } catch (error) {
    replacementTerminationCache.promise = null;
    console.error("Failed to fetch replacement/termination data:", error);
  } finally {
    setIsChecking(false);
  }
};

  fetchData();


}, [
 
]);

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
const GetSalaryHistory= (userId: string) => {
  if (!users?.length || !userId) return null;

  return users.find(
    (each: any) =>
      each?.HCAComplitInformation?.UserId === userId
  )?.HCAComplitInformation.SalaryHistory
;
};
 
const DeployInformation= useMemo(() => {
return  ClientsInformation.map((each: any) => {
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
    SalaryHistory: GetSalaryHistory(each.HCAId),
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
}, [
    ClientsInformation,
    users,
    RegisterdUsers,
    SearchMonth,
    SearchYear
]);
// const DeployInformation = ClientsInformation.map((each: any) => {
//      const attendanceSummary = each.Attendance.reduce(
//           (acc: any, att: any) => {
//             const hcp = att.HCPAttendence === true;
//             const admin = att.AdminAttendece === true;

//             if (hcp && admin) {
//               acc.present += 1;
//             } else if (hcp || admin) {
//               acc.halfDay += 1;
//             } else {
//               acc.absent += 1;
//             }

//             return acc;
//           },
//           {
//             present: 0,
//             halfDay: 0,
//             absent: 0,
//           }
//         );
//         const Expenses=getExpenseList(each.HCAId)
//         const Transactions=getTransactions(each.HCAId)
//   const MonthlyExpensesInfo =
//   Array.isArray(Expenses)
//     ? Expenses.find(
//         (exp: any) => exp.Month === `${SearchMonth}-${SearchYear}`
//       )
//     : null;
//   return {
//     ...each,
//     Clientid: each.ClientId,
//     name: each.HCAName,
//     transactions: MonthlyExpensesInfo?.Transactions||[],
//     SalaryHistory: GetSalaryHistory(each.HCAId),
//     attendanceInfo: each.Attendance,
//     PaymentVerficationStatus:each.PaymentVerificationStatus||"Process",
//     CompliteAttendeceSummery: attendanceSummary,
//     PreviewINPaymentPage:each.PreviewINPaymentPage||"Enabled",
//     Expences: MonthlyExpensesInfo?.DueAmounts[0]||MonthlyExpensesInfo?.DueAmounts || {
//       advance: 0,
//       hostel: 0,
//       other: 0,
//       incentives: 0,
//       others: 0,
//       advanceDescription: "",
//       hostelDescription: "",
//       otherDescription: "",
//       incentivesDescription: "",
//       othersDescription: "",
//     }


//   };
// });
const ReplasementAttendece=useMemo(() => {
    return ReplacementInformation.map((each: any) => {
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
     SalaryHistory: GetSalaryHistory(each.HCAId),
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

}, [
    ReplacementInformation,
    users,
    RegisterdUsers,
    SearchMonth,
    SearchYear
]);

// const ReplasementAttendece=ReplacementInformation.map((each: any) => {
//      const attendanceSummary = each.Attendance.reduce(
//           (acc: any, att: any) => {
//             const hcp = att.HCPAttendence === true;
//             const admin = att.AdminAttendece === true;

//             if (hcp && admin) {
//               acc.present += 1;
//             } else if (hcp || admin) {
//               acc.halfDay += 1;
//             } else {
//               acc.absent += 1;
//             }

//             return acc;
//           },
//           {
//             present: 0,
//             halfDay: 0,
//             absent: 0,
//           }
//         );
//         const Expenses=getExpenseList(each.HCAId)
//         const Transactions=getTransactions(each.HCAId)
//   const MonthlyExpensesInfo =
//   Array.isArray(Expenses)
//     ? Expenses.find(
//         (exp: any) => exp.Month === `${SearchMonth}-${SearchYear}`
//       )
//     : null;
//   return {
//     ...each,
//     Clientid: each.ClientId,
//     name: each.HCAName,
//      SalaryHistory: GetSalaryHistory(each.HCAId),
//     transactions: MonthlyExpensesInfo?.Transactions||[],
//     attendanceInfo: each.Attendance,
//     PaymentVerficationStatus:each.PaymentVerificationStatus||"Process",
//     CompliteAttendeceSummery: attendanceSummary,
//     PreviewINPaymentPage:each.PreviewINPaymentPage||"Enabled",
//     Expences: MonthlyExpensesInfo?.DueAmounts[0]||MonthlyExpensesInfo?.DueAmounts || {
//       advance: 0,
//       hostel: 0,
//       other: 0,
//       incentives: 0,
//       others: 0,
//       advanceDescription: "",
//       hostelDescription: "",
//       otherDescription: "",
//       incentivesDescription: "",
//       othersDescription: "",
//     }


//   };
// });

const TerminatedData=useMemo(() => {
    return TerminationInformation.map((each: any) => {

     const attendanceSummary = (each.Attendence || []).reduce(
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
 
        const Expenses=getExpenseList(each.HCAid)
        const Transactions=getTransactions(each.HCAid)
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
    HCAId:each.HCAid,
     SalaryHistory: GetSalaryHistory(each.HCAId),
    transactions: MonthlyExpensesInfo?.Transactions||[],
    attendanceInfo: each.Attendence,
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

}, [
    TerminationInformation,
    users,
    RegisterdUsers,
    SearchMonth,
    SearchYear
]);
// const TerminatedData=TerminationInformation.map((each: any) => {

//      const attendanceSummary = (each.Attendence || []).reduce(
//           (acc: any, att: any) => {
//             const hcp = att.HCPAttendence === true;
//             const admin = att.AdminAttendece === true;

//             if (hcp && admin) {
//               acc.present += 1;
//             } else if (hcp || admin) {
//               acc.halfDay += 1;
//             } else {
//               acc.absent += 1;
//             }
  
//             return acc;
//           },
//           {
//            present: 0,
//             halfDay: 0,
//             absent: 0,
//           }
//         );
 
//         const Expenses=getExpenseList(each.HCAid)
//         const Transactions=getTransactions(each.HCAid)
//   const MonthlyExpensesInfo =
//   Array.isArray(Expenses)
//     ? Expenses.find(
//         (exp: any) => exp.Month === `${SearchMonth}-${SearchYear}`
//       )
//     : null;
//   return {
//     ...each,
//     Clientid: each.ClientId,
//     name: each.HCAName,
//     HCAId:each.HCAid,
//      SalaryHistory: GetSalaryHistory(each.HCAId),
//     transactions: MonthlyExpensesInfo?.Transactions||[],
//     attendanceInfo: each.Attendence,
//     PaymentVerficationStatus:each.PaymentVerificationStatus||"Process",
//     CompliteAttendeceSummery: attendanceSummary,
//     PreviewINPaymentPage:each.PreviewINPaymentPage||"Enabled",
//     Expences: MonthlyExpensesInfo?.DueAmounts[0]||MonthlyExpensesInfo?.DueAmounts || {
//       advance: 0,
//       hostel: 0,
//       other: 0,
//       incentives: 0,
//       others: 0,
//       advanceDescription: "",
//       hostelDescription: "",
//       otherDescription: "",
//       incentivesDescription: "",
//       othersDescription: "",
//     }


//   };
// });



const mergedPayments = useMemo(() => {
  return [
    ...DeployInformation.map((item: { attendanceInfo: any; }) => ({
      ...item,
      PreviewInfo:"OnService Payments",
      attendanceInfo: item.attendanceInfo || [],
    })),

    ...ReplasementAttendece.map(item => ({
      ...item,
            PreviewInfo:"Replacement Payments",
      attendanceInfo: item.attendanceInfo || [],
    })),

    ...TerminatedData.map(item => ({
      ...item,
            PreviewInfo:"Termination Payments",
      attendanceInfo: item.attendanceInfo || [],
    })),
  ];
}, [
  DeployInformation,
  ReplasementAttendece,
  TerminatedData,
]);

const filtered = useMemo(() => {
  return mergedPayments.filter((item) =>
    item.PaymentVerficationStatus===activeStatus&&
    matchesSearchAndMonth(
      item,
      search,
      SearchMonth,
      SearchYear
    )
  );
}, [
  mergedPayments,
  search,
  activeStatus,
  SearchMonth,
  SearchYear,
]);

useEffect(() => {
  setData(filtered);
}, [filtered]);

const grouped = Object.values(
  mergedPayments.reduce((acc: any, item: any) => {
    if (!acc[item.HCAId]) {
      acc[item.HCAId] = {
        ...item,
        attendanceInfo: [...(item.attendanceInfo || [])],
        Sources: [item.Source],
      };
    } else {
      acc[item.HCAId].attendanceInfo.push(
        ...(item.attendanceInfo || [])
      );

      acc[item.HCAId].Sources.push(item.Source);
    }

    return acc;
  }, {})
);
// const ReplacementAttendenceinformation= ReplacementInformation.map((each: any) => {
//      const attendanceSummary = each.Attendance.reduce(
//           (acc: any, att: any) => {
//             const hcp = att.HCPAttendence === true;
//             const admin = att.AdminAttendece === true;

//             if (hcp && admin) {
//               acc.present += 1;
//             } else if (hcp || admin) {
//               acc.halfDay += 1;
//             } else {
//               acc.absent += 1;
//             }

//             return acc;
//           },
//           {
//             present: 0,
//             halfDay: 0,
//             absent: 0,
//           }
//         );
//         const Expenses=getExpenseList(each.HCAId)
//         const Transactions=getTransactions(each.HCAId)
//   const MonthlyExpensesInfo =
//   Array.isArray(Expenses)
//     ? Expenses.find(
//         (exp: any) => exp.Month === `${SearchMonth}-${SearchYear}`
//       )
//     : null;
//   return {
//     ...each,
//     Clientid: each.ClientId,
//     name: each.HCAName,
//     transactions: MonthlyExpensesInfo?.Transactions||[],
//     attendanceInfo: each.Attendance,
//     PaymentVerficationStatus:each.PaymentVerificationStatus||"Process",
//     CompliteAttendeceSummery: attendanceSummary,
//     PreviewINPaymentPage:each.PreviewINPaymentPage||"Enabled",
//     Expences: MonthlyExpensesInfo?.DueAmounts[0]||MonthlyExpensesInfo?.DueAmounts || {
//       advance: 0,
//       hostel: 0,
//       other: 0,
//       incentives: 0,
//       others: 0,
//       advanceDescription: "",
//       hostelDescription: "",
//       otherDescription: "",
//       incentivesDescription: "",
//       othersDescription: "",
//     }


//   };
// });
// console.log("Check Replacementinformation----",ReplacementAttendenceinformation)




const NumberOfDaysInMonth = getDaysInMonth(
  Number(SearchMonth),
  Number(SearchYear)
);


const UpdatePaymentStatus=async(HCAId:any,ClientId:any,status:any,Info:any)=>{
  setPopup({
      isOpen: true,
      message: "Please Wait Updating Payment Status...",
      type: "loading",
    });
  const value = status
  
   const MonthInfo=`${SearchYear}-${SearchMonth}`
    const UpdatedinDB:any=await UpdatePaymentVerificationStatusInDb(HCAId,ClientId,value,MonthInfo,Info.StartDate,Info.PreviewInfo)

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
        message: "Failed to update payment status",
        type: "error",
      });
    }

 return
 
    

  
  }

  

  const UpdatePayablePage=async(row:any,totalAmount:any)=>{
    try{
       setPopup({
      isOpen: true,
      message: "Generating payable page details...",
      type: "loading",
    });
     const MonthInfo=`${SearchYear}-${SearchMonth}`
    
  if(row.PreviewInfo==="OnService Payments"){
      const UpdatedinDB=await PostINPayblePage(row.HCAId,row.ClientId,MonthInfo,row,totalAmount)
   
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
  }
    if(row.PreviewInfo==="Replacement Payments"){
      const UpdatedinDB=await PostINPayblePageforRepleasments(row.HCAId,row.ClientId,MonthInfo,row,totalAmount)
 
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
  }
   if(row.PreviewInfo==="Termination Payments"){
      const UpdatedinDB=await PostINPayblePageforTermination(row.HCAId,row.ClientId,MonthInfo,row,totalAmount,row.
StartDate)
   
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
const formatCurrency = (
  attendanceInfo: any[],
  salaryHistory: any[],
  currentSalary: number,
  searchMonth: number,
  searchYear: number
) => {
  if (!attendanceInfo?.length) return 0;

  const history =
    salaryHistory && salaryHistory.length
      ? [...salaryHistory].sort(
          (a: any, b: any) =>
            new Date(a.EffectiveFrom).getTime() -
            new Date(b.EffectiveFrom).getTime()
        )
      : [
          {
            Salary: currentSalary,
            EffectiveFrom: "2000-01-01",
          },
        ];

  let total = 0;

  attendanceInfo.forEach((attendance: any) => {
const attendanceDate = new Date(attendance.AttendenceDate);
attendanceDate.setHours(0, 0, 0, 0);

    let salary = currentSalary;
if (
    attendanceDate.getMonth() + 1 !== searchMonth ||
    attendanceDate.getFullYear() !== searchYear
  ) {
    return;
  }
 
  const attendanceKey = attendance.AttendenceDate.toString().substring(0, 10);

for (const item of history) {
  const effectiveKey = item.EffectiveFrom.toString().substring(0, 10);

  if (effectiveKey <= attendanceKey) {
    salary = Number(item.Salary);
  } else {
    break;
  }
}

    const daysInMonth = getDaysInMonth(
      attendanceDate.getMonth() + 1,
      attendanceDate.getFullYear()
    );

   const dailySalary = Math.floor(salary / daysInMonth);


    const hcp = attendance.HCPAttendence === true;
    const admin = attendance.AdminAttendece === true;

    if (hcp && admin) {
      total += dailySalary;
    } else if (hcp || admin) {
      total += dailySalary / 2;
    }
  });

  return Math.ceil(total);
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

    const UpdatingExpenses = await updateExpense(
    row.HCAId,
    row.Expences,
    loggedInEmail,
    newTransactions,
    `${SearchMonth}-${SearchYear}`
  );

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
  hcaId:any,
  field: keyof PayrollRow["Expences"],
  value: string | number
) => {
  setData((prev) =>
    prev.map((row) =>
      row.Clientid === id&&row.HCAId===hcaId
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
    <div className="w-full min-h-screen bg-[#f4f7fb] p-3 md:p-2 overflow-x-hidden">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex items-center justify-between w-full rounded-2xl bg-white p-4 shadow-sm">

  {/* Left */}
  <div className="flex items-center gap-3">
    {/* Mobile Menu */}
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 "
    >
      {menuOpen ? <X size={22} /> : <Menu size={22} />}
    </button>

    {/* Logo */}
    <img
      src="/Icons/Curate-logoq.png"
      alt="Company Logo"
      className="h-11 w-11 md:h-12 md:w-12 object-contain"
    />

    {/* Title */}
    <div>
      <h1 className="text-xl font-bold text-slate-900 md:text-3xl">
        Process
      </h1>

      <p className="hidden text-sm text-slate-500 sm:block">
        Payroll Management Dashboard
      </p>
    </div>
  </div>

  {/* Desktop Button */}
  <button
    onClick={() => (window.location.href = "/SubAccountings")}
    className="hidden lg:flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 font-semibold text-white shadow transition hover:bg-teal-700"
  >
    Accounts Dashboard
  </button>

  {/* Mobile Dropdown */}
  {menuOpen && (
  <div className="absolute left-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">

    {/* Header */}
    <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Avandce Payment Options
      </p>
    </div>

    {/* Menu Items */}
    <div className="py-2">
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.title}
            onClick={() => {
              setMenuOpen(false);
            router.push(item.route)
            }}
            className="group flex w-full items-center justify-between px-5 py-3 transition-all duration-200 hover:bg-teal-50 hover:text-teal-700 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2 transition group-hover:bg-teal-100">
                <Icon size={18} />
              </div>

              <span className="font-medium">
                {item.title}
              </span>
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
</div>
        
        <div className="flex flex-wrap gap-3 w-full justify-between items-center">
         
<div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
  {/* Left Section */}
  <div className="flex flex-wrap gap-3">
    {statuses.map((status) => (
      <button
        key={status}
        onClick={() => setActiveStatus(status)}
        className={`rounded-xl px-5 cursor-pointer py-2.5 text-sm font-semibold transition-all duration-200 border whitespace-nowrap
          ${
            activeStatus === status
              ? "bg-teal-600 text-white border-teal-600 shadow-lg scale-105"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-teal-500 hover:text-teal-600"
          }`}
      >
        {status}
      </button>
    ))}
  </div>

  {/* Right Section */}
  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
    {/* Search */}
    <div className="relative w-full sm:min-w-[260px] xl:min-w-[320px]">
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
      />
    </div>

    {/* Filters */}
    <div className="flex gap-3 sm:w-auto">
      <select
        value={SearchMonth}
        onChange={(e) => dispatch(UpdateMonthFilter(e.target.value))}
        className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 sm:w-[150px] sm:flex-none"
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
        className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 sm:w-[130px] sm:flex-none"
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
              <div className="rounded-lg bg-[#f0fdf4] border border-[#dcfce7] p-3 text-center">
                <p className="text-xs text-[#16a34a] font-medium">
                  Present Days
                </p>
                <p className="text-xl font-bold text-[#15803d]">
                  {attendanceSummary?.present || 0}
                </p>
              </div>

              <div className="rounded-lg bg-[#fffbeb] border border-[#fde68a] p-3 text-center">
                <p className="text-xs text-[#d97706] font-medium">Half Days</p>
                <p className="text-xl font-bold text-[#b45309]">
                  {attendanceSummary?.halfDay || 0}
                </p>
              </div>

              <div className="rounded-lg bg-[#fef2f2] border border-[#fecaca] p-3 text-center">
                <p className="text-xs text-[#dc2626] font-medium">Absent Days</p>
                <p className="text-xl font-bold text-[#b91c1c]">
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
                <th className=" p-4 text-left">TDS</th>
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
    row.attendanceInfo,
    row.SalaryHistory,
    HCPPayment,
    Number(SearchMonth),
    Number(SearchYear)
);
const TDSAmount=dailyPayment*1/100
const totalExpenses =
  Number(row.Expences?.advance || 0) +
  Number(row.Expences?.hostel || 0) +
  Number(row.Expences?.other || 0);

              return (
                <tr key={Ind} className="border-b">
                      <td className="p-4 text-center font-semibold">{Ind+1}</td>
                 <td className="p-2 md:p-4 text-[10px] sm:text-xs md:text-sm break-words font-semibold">  

  <div className="relative flex gap-2 items-center justify-between w-[110px]  group ">

 


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
                  

 

                 

<td className="p-4">
  <div className="flex items-center gap-2">
    <span>
      {dailyPayment}
    </span>

    <div className="relative group">
      <Info
        size={16}
        className="text-blue-500 cursor-pointer hover:text-blue-600"
      />

      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 hidden w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-lg group-hover:block">
  <p className="font-semibold mb-2"> {row.name}Payment Info</p>
<p> {row.PreviewInfo}</p>
  <p className="mt-2">
    <span className="font-medium">Per Day:</span>{" "}
    {
      Math.round((HCPPayment / getDaysInMonth(SearchMonth, SearchYear)))
    }
  </p>
    <p>
    <span className="font-medium">Present Days:</span>{" "}
    {
      PresentDays
    }
  </p>
    <p>
    <span className="font-medium">Half Days:</span>{" "}
    {
    HalfDays
    }
  </p>
   <p>
    <span className="font-medium">Total Payment:</span>{" "}
     {dailyPayment}
  </p>
{row.SalaryHistory?.length > 0 && (
  <div>
  <p>
    * Salary hiked from{" "}
    {new Date(row.SalaryHistory[row.SalaryHistory.length - 1].EffectiveFrom).toLocaleDateString("en-In")}
  </p>
    <p>
    * Per Day  Befor{" "}
    {new Date(row.SalaryHistory[row.SalaryHistory.length - 1].EffectiveFrom).toLocaleDateString("en-In")} {Math.round(Number(row.SalaryHistory[0].Salary)/ getDaysInMonth(SearchMonth, SearchYear))}
  </p>
  </div>
)}
</div>

    </div>
  </div>
</td>
                    <td className="w-[60px] px-4 py-3">
                 {dailyPayment*1/100}
                 </td>

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
              row.HCAId,
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
              row.HCAId,
              descField as keyof PayrollRow["Expences"],
              e.target.value
            )
          }
          className="w-full h-10 px-3 border rounded-lg"
        />
        {["advance", "hostel", "other"].includes(amountField) &&
  (  Number(row.Expences?.[amountField as keyof PayrollRow["Expences"]] || 0) > dailyPayment || totalExpenses > dailyPayment) && (
    <div className="text-[#dc2626] text-[10px]">
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
                        value={row.PaymentVerficationStatus}
  className={`px-4 py-2 rounded-xl border border-slate-300 ${row.PaymentVerficationStatus === "Process" ? "bg-pink-300" : "bg-[#22c55e]"} text-sm font-medium shadow-sm focus:outline-none focus:ring-2  ${row.PaymentVerficationStatus === "Process" ? "focus:ring-pink-500" : "focus:ring-[#16a34a]"}`}
  onChange={(e) => {
    UpdatePaymentStatus(row.HCAId,row.Clientid, e.target.value,row);  
  }}
>
  <option value="Process" >
    Process
  </option>
   <option value="Hold" >
    Hold
  </option>
   <option value="Reject" >
    Reject
  </option>
  <option value="Save" >
    Save
  </option>
</select>
                      <button
                     disabled={row.PaymentVerficationStatus==="Process"}
                        className={`h-10 px-3 flex items-center  justify-center gap-2 rounded-xl ${row.PaymentVerficationStatus === "Process" ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 cursor-pointer"} text-white text-sm font-medium`}
                        onClick={() => {
                          UpdatePayablePage(row,(dailyPayment+Additems-MinusItems-TDSAmount))
                        }}
                      >
                        Pay 
                      </button>
                    </div>
                  </td>

                  <td className="p-4 font-bold">
                    {dailyPayment+Additems-MinusItems-dailyPayment*1/100}
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
      ? "text-[#dc2626]"
      : "text-[#16a34a]"
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
                              ? "text-[#16a34a]"
                              : "text-[#dc2626]"
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

