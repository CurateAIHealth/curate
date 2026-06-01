"use client";

import { useState } from "react";
import { CircleSlash2, CornerUpLeft, Eye, Info } from "lucide-react";

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
    id: 2,
    UserType: "HCA",
    name: "Reddyvari",
    total: 529500,
    advance: 5000,
    hostelFee: 2500,
    others: 1200,
    incentive: 8000,
    reject: 0,
    revert: 0,
    neft: "",
    amount: 529500,
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
    id: 4,
    UserType: "HCA",
    name: "Kratika",
    total: 520000,
    advance: 3000,
    hostelFee: 1500,
    others: 750,
    incentive: 6000,
    reject: 0,
    revert: 0,
    neft: "",
    amount: 520000,
    paid: true,
  },
  {
    id: 5,
    UserType: "HCA",
    name: "Khushiyavishnu",
    total: 485030,
    advance: 7000,
    hostelFee: 2000,
    others: 1800,
    incentive: 5000,
    reject: 2,
    revert: 1,
    neft: "HCA2026005",
    amount: 485030,
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
    id: 7,
    UserType: "HCA",
    name: "Kanchan",
    total: 520000,
    advance: 4500,
    hostelFee: 1800,
    others: 950,
    incentive: 7500,
    reject: 0,
    revert: 0,
    neft: "HCA2026007",
    amount: 520000,
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
const [userTypeFilter, setUserTypeFilter] = useState("All");
const [selectedUser, setSelectedUser] = useState<any>(null);
const [showInfoPopup, setShowInfoPopup] = useState(false);

const filteredData =
  userTypeFilter === "All"
    ? data
    : data.filter((item) => item.UserType === userTypeFilter);

  return (
    
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-5 md:px-8 py-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-md flex items-center justify-center border border-slate-100">
                <img
                  src="/Icons/Curate-logoq.png"
                  alt="Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-[#1392d3]">
                 Payroll Management Dashboard
                </h1>

                
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
              <input
                type="text"
                placeholder="Search ..."
                className="h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#1392d3] min-w-[250px]"
              />

              <select className="h-12 px-4 rounded-xl border border-slate-200 outline-none">
                <option>May</option>
                <option>June</option>
                <option>July</option>
              </select>

              <select className="h-12 px-4 rounded-xl border border-slate-200 outline-none">
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
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
              ₹{selectedUser.total.toLocaleString()}
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <p className="text-slate-500 text-sm">Payable Amount</p>
            <p className="font-bold text-xl text-green-600">
              ₹{selectedUser.amount.toLocaleString()}
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
                  ₹{selectedUser.refund?.toLocaleString()}
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

              <div className="bg-[#1392d3]/10 border border-[#1392d3]/20 rounded-2xl px-5 py-3">
                <p className="text-xs text-slate-500">
                  Final Payable Amount
                </p>

                <p className="text-2xl font-bold text-[#1392d3]">
                  ₹{selectedUser.amount?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                <p className="text-slate-500 text-sm">
                  Advance
                </p>

                <p className="text-2xl font-bold text-amber-600 mt-2">
                  ₹{selectedUser.advance?.toLocaleString()}
                </p>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <p className="text-slate-500 text-sm">
                  Hostel Fee
                </p>

                <p className="text-2xl font-bold text-red-600 mt-2">
                  ₹{selectedUser.hostelFee?.toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-slate-500 text-sm">
                  Others
                </p>

                <p className="text-2xl font-bold text-slate-700 mt-2">
                  ₹{selectedUser.others?.toLocaleString()}
                </p>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                <p className="text-slate-500 text-sm">
                  Incentive
                </p>

                <p className="text-2xl font-bold text-green-600 mt-2">
                  ₹{selectedUser.incentive?.toLocaleString()}
                </p>
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
                    ₹{selectedUser.total?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">
                    Deductions
                  </p>

                  <p className="text-xl font-bold text-red-600">
                    ₹
                    {(
                      (selectedUser.advance || 0) +
                      (selectedUser.hostelFee || 0) +
                      (selectedUser.others || 0)
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">
                    Incentives
                  </p>

                  <p className="text-xl font-bold text-green-600">
                    ₹{selectedUser.incentive?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">
                    Net Pay
                  </p>

                  <p className="text-2xl font-bold text-[#1392d3]">
                    ₹{selectedUser.amount?.toLocaleString()}
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
        <div className="overflow-auto max-h-[650px]">
          <table className="min-w-[1400px] w-full">
            <thead className="sticky top-0 z-30">
              <tr className="text-white bg-teal-800">
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
              {filteredData.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-200 hover:bg-sky-50 transition-all duration-200"
                >
                  <td className="sticky left-0 bg-white px-5 py-5 font-bold text-slate-800">
                    {index + 1}
                  </td>

                  <td className="sticky left-[80px] bg-white px-5 py-5 font-semibold text-slate-800">
                    {row.name}
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
                    <button className="inline-flex items-center gap-2 bg-[#1392d3] hover:bg-[#0f82bb] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all">
                      <Eye size={18} />
                      View
                    </button>
                  </td>

                  <td className="px-5 py-5 text-center font-bold text-slate-800">
                    ₹{row.total.toLocaleString()}
                  </td>

       

                  <td className="px-5 py-5 text-center">
                    {row.neft? <span className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700">
                      {row.neft}
                    </span>:<input type="text" placeholder="Enter NEFT Ref No" className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700" />}
                   
                  </td>

                  <td className="px-5 py-5 text-center font-bold text-[#50c896] text-lg">
                    ₹{row.amount.toLocaleString()}
                  </td>
         <td className="px-5 py-5 text-center">
  <button
    className="inline-flex items-center justify-center min-w-[90px] h-10 px-4 rounded-xl bg-red-600 text-white font-semibold shadow-md hover:opacity-90 transition-all"
   
  >
        <CircleSlash2 />
  </button>
</td>

<td className="px-5 py-5 text-center">
  <button
    className="inline-flex items-center justify-center min-w-[90px] h-10 px-4 rounded-xl bg-[#1392d3] text-white font-semibold shadow-md hover:opacity-90 transition-all"
    
  >
        <CornerUpLeft /> 
  </button>
</td>
                  <td className="px-5 py-5 text-center">
                 <button className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150">Paid</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
  );
}