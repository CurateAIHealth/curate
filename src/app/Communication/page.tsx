"use client";

import { Update_Main_Filter_Status } from "@/Redux/action";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const clients = [
  {
    _id: "1",
    patientName: "Kondaiah",
    location: "Puppalaguda",
    email: "client1@gmail.com",
    clientStatus: "Waiting List",
    leadSource: "Google",
    invoiceStatus: "Pending",
  },
  {
    _id: "2",
    patientName: "Durga Nayak",
    location: "Kukatpally",
    email: "client2@gmail.com",
    clientStatus: "Converted",
    leadSource: "Google",
    invoiceStatus: "Paid",
  },
  {
    _id: "3",
    patientName: "Mukkera Subamma",
    location: "Warangal",
    email: "client3@gmail.com",
    clientStatus: "Lost",
    leadSource: "Reference",
    invoiceStatus: "Pending",
  },
];

const hcas = [
  {
    _id: "101",
    name: "Paulsital Behera",
    location: "Odisha",
    email: "hca1@gmail.com",
    currentStatus: "Active",
    userType: "HCA",
  },
  {
    _id: "102",
    name: "Bommathi Madhavi",
    location: "Andhra Pradesh",
    email: "hca2@gmail.com",
    currentStatus: "Bench",
    userType: "HCN",
  },
  {
    _id: "103",
    name: "Madavi Shilpa",
    location: "Hyderabad",
    email: "hca3@gmail.com",
    currentStatus: "Leave",
    userType: "HCA",
  },
];

export default function BulkMessagePage() {
  const [tab, setTab] = useState<"clients" | "hcas">("clients");

  const [clientFilters, setClientFilters] = useState<string[]>([]);
  const [hcaFilters, setHcaFilters] = useState<string[]>([]);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const dispatch=useDispatch()

  const toggleClientFilter = (value: string) => {
    setClientFilters((prev) =>
      prev.includes(value)
        ? prev.filter((x) => x !== value)
        : [...prev, value]
    );
  };

  const toggleHcaFilter = (value: string) => {
    setHcaFilters((prev) =>
      prev.includes(value)
        ? prev.filter((x) => x !== value)
        : [...prev, value]
    );
  };
  const handleLogout = () => {
    
 
      window.location.href ='/DashBoard';
    dispatch(Update_Main_Filter_Status(""))
 
  };
  const filteredClients = useMemo(() => {
    if (!clientFilters.length) return clients;

    return clients.filter(
      (client) =>
        clientFilters.includes(client.clientStatus) ||
        clientFilters.includes(client.invoiceStatus)
    );
  }, [clientFilters]);

  const filteredHCAs = useMemo(() => {
    if (!hcaFilters.length) return hcas;

    return hcas.filter(
      (hcp) =>
        hcaFilters.includes(hcp.currentStatus) ||
        hcaFilters.includes(hcp.location)
    );
  }, [hcaFilters]);

  const selectedCount =
    tab === "clients"
      ? filteredClients.length
      : filteredHCAs.length;

  return (
<div className="w-full min-w-0 overflow-x-hidden bg-slate-50 min-h-screen px-3 py-4 sm:px-4 md:px-6">



 <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-5 lg:p-6 mb-4 lg:mb-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

<div className="flex flex-1 items-center gap-3 min-w-0">
      <img
        src="/Icons/Curate-logoq.png"
        className="h-10 sm:h-11 lg:h-12 flex-shrink-0"
        alt="Company Logo"
      />

      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 break-words">
          Communication
        </h1>

        <p className="text-xs sm:text-sm lg:text-base text-slate-500 leading-relaxed">
          Send Emails to Clients and Healthcare Assistants
        </p>
      </div>
    </div>

    <button
      onClick={handleLogout}
      className="
        w-full
        sm:w-auto
     sm:min-w-[160px]
        px-4
        py-3
        bg-gradient-to-br
        from-[#00A9A5]
        to-[#005f61]
        hover:from-[#01cfc7]
        hover:to-[#00403e]
        text-white
        rounded-xl
        font-semibold
        shadow-md
        cursor-pointer
        transition-all
      "
    >
      Dashboard
    </button>

  </div>
</div>



<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
    <p className="text-slate-500 text-sm">
      Total Clients
    </p>

    <h2 className="text-2xl sm:text-3xl font-bold text-[#1392d3] mt-2">
      {clients.length}
    </h2>
  </div>

  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
    <p className="text-slate-500 text-sm">
      Total HCAs
    </p>

    <h2 className="text-2xl sm:text-3xl font-bold text-[#50c896] mt-2">
      {hcas.length}
    </h2>
  </div>

  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
    <p className="text-slate-500 text-sm">
      Selected Recipients
    </p>

    <h2 className="text-2xl sm:text-3xl font-bold text-[#ff1493] mt-2">
      {selectedCount}
    </h2>
  </div>

</div>



  <div className="mb-6">

<div className="flex w-full sm:w-fit bg-white rounded-2xl p-1 shadow-sm border border-slate-200">

      <button
        onClick={() => setTab("clients")}
        className={`px-6 py-2 rounded-xl cursor-pointer font-medium transition-all ${
          tab === "clients"
            ? "bg-[#1392d3] text-white"
            : "text-slate-600"
        }`}
      >
        Clients
      </button>

      <button
        onClick={() => setTab("hcas")}
        className={`px-6 py-2 rounded-xl font-medium cursor-pointer transition-all ${
          tab === "hcas"
            ? "bg-[#50c896] text-white"
            : "text-slate-600"
        }`}
      >
        HCAs
      </button>

    </div>

  </div>

 

<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
  

    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-slate-800">
          Filters
        </h2>

        <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
          {tab === "clients" ? "Clients" : "HCAs"}
        </span>
      </div>

      {tab === "clients" && (
        <>
          <p className="font-medium text-slate-700 mb-3">
            Client Status
          </p>

          {[
            "Waiting List",
            "Converted",
            "Lost",
            "Pending",
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 mb-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-[#1392d3]"
                onChange={() =>
                  toggleClientFilter(item)
                }
              />
              {item}
            </label>
          ))}
        </>
      )}

      {tab === "hcas" && (
        <>
          <p className="font-medium text-slate-700 mb-3">
            HCA Status
          </p>

          {[
            "Active",
            "Bench",
            "Leave",
          
   
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 mb-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-[#50c896]"
                onChange={() =>
                  toggleHcaFilter(item)
                }
              />
              {item}
            </label>
          ))}
        </>
      )}
    </div>

    

   <div className="lg:col-span-3 min-w-0 space-y-6">

    

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b bg-slate-50 flex justify-between items-center">

          <h2 className="font-semibold text-lg">
            Selected Recipients
          </h2>

          <span className="bg-[#1392d3]/10 text-[#1392d3] px-4 py-1 rounded-full font-medium">
            {selectedCount}
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="text-left py-4 px-5">
                  Name
                </th>

                <th className="text-left py-4 px-5">
                  Location
                </th>

                <th className="text-left py-4 px-5">
                  Email
                </th>

              </tr>

            </thead>

            <tbody>

              {tab === "clients" &&
                filteredClients.map((client) => (
                  <tr
                    key={client._id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      {client.patientName}
                    </td>

                    <td className="px-5 py-4">
                      {client.location}
                    </td>

                    <td className="px-5 py-4">
                      {client.email}
                    </td>
                  </tr>
                ))}

              {tab === "hcas" &&
                filteredHCAs.map((hcp) => (
                  <tr
                    key={hcp._id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      {hcp.name}
                    </td>

                    <td className="px-5 py-4">
                      {hcp.location}
                    </td>

                    <td className="px-5 py-4">
                      {hcp.email}
                    </td>
                  </tr>
                ))}

            </tbody>

          </table>

        </div>

      </div>

    

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

        <h2 className="font-semibold text-xl mb-5">
          Compose Message
        </h2>

        <input
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
          placeholder="Email Subject"
          className="
            w-full
            border
            border-slate-300
            rounded-xl
            p-3
            mb-4
            focus:outline-none
            focus:ring-2
            focus:ring-[#1392d3]
          "
        />

        <textarea
          rows={8}
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Type your message..."
          className="
            w-full
            border
            border-slate-300
            rounded-xl
            p-3
            focus:outline-none
            focus:ring-2
            focus:ring-[#1392d3]
          "
        />

        <button
         className="
mt-5
w-full
sm:w-auto
bg-[#1392d3]
hover:bg-[#0f7bb3]
text-white
px-8
py-3
rounded-xl
cursor-pointer
font-semibold
transition-colors
"
          onClick={() => {
            console.log({
              subject,
              message,
              recipients:
                tab === "clients"
                  ? filteredClients
                  : filteredHCAs,
            });

            alert(
              `Sending mail to ${selectedCount} users`
            );
          }}
        >
          Send Email To {selectedCount} Users
        </button>

      </div>

    </div>

  </div>

</div>
  );
}