
            
    import { PostReferal, PostReferalRequest } from "@/Lib/user.action";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
export default function ReferralPopup({ onClose }:{ onClose:()=>void }) {
  const [type, setType] = useState("staff");
const [SatatusMessage,setStatusMessage]=useState("")
  const [formData, setFormData] = useState({
 
    candidateName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    company: "",
    relationship: "",


    clientName: "",
    patientName: "",
    location: "",
    referralSource: "",
    referredBy: "",

   
    percentage: "",
    amount: "",
    notes: "",
  });

  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 
  const handleSubmit = async () => {
    try {
        setStatusMessage("Please Wait......");
        const ReferalId=uuidv4()
      const payload = {
        ReferalId,
        type, 
        ...formData,
      };
const data: any =await PostReferal(payload)



if(data.success){   
      setStatusMessage("Referral submitted successfully ✅")
      const PostNotification= await PostReferalRequest(payload)
      setTimeout(() => {
        onClose()
      }, 2000)

    }else{
      setStatusMessage("Error submitting referral ❌")
    }

    
    } catch (err) {
      console.error(err);
      setStatusMessage("Error submitting referral");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] rounded-xl shadow-lg">

       <div className="flex items-center gap-3 m-2">
                 <img src="/Icons/Curate-logo.png" className="h-8" />
            <h2 className="text-lg font-semibold">Referral Submission</h2>
         </div>

       
        <div className="flex gap-2 px-6 pt-4">
          <button
            onClick={() => setType("staff")}
            className={`px-4 py-1 rounded-lg ${
              type === "staff" ? "bg-teal-700 text-white" : "bg-gray-100"
            }`}
          >
            Staff Referral
          </button>

          <button
            onClick={() => setType("lead")}
            className={`px-4 py-1 rounded-lg ${
              type === "lead" ? "bg-teal-700 text-white" : "bg-gray-100"
            }`}
          >
            Lead Referral
          </button>
        </div>

        <div className="p-6 grid grid-cols-3 gap-4">

      
          {type === "staff" && (
            <>
              <input name="candidateName" onChange={handleChange} className="border p-2 rounded" placeholder="Candidate Name" />
        <input
  type="email"
  name="email"
  required
  value={formData.email || ""}
  onChange={(e) => {
    handleChange(e);
  }}
  placeholder="Email"
  className="border p-2 rounded"
/>
{formData.email &&
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
    <p className="mt-1 text-xs text-red-500">Enter a valid email</p>
  )}

<input
  type="tel"
  name="phone"
  required
  value={formData.phone || ""}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      handleChange({
        target: { name: "phone", value },
      });
    }
  }}
  placeholder="10-digit phone number"
  className="border p-2 rounded"
/>
{formData.phone &&
  !/^[6-9]\d{9}$/.test(formData.phone) && (
    <p className="mt-1 text-xs text-red-500">
      Enter a valid Indian mobile number
    </p>
  )}

              <input name="position" onChange={handleChange} className="border p-2 rounded" placeholder="Position" />
              <input name="experience" onChange={handleChange} className="border p-2 rounded" placeholder="Experience" />
              <input name="company" onChange={handleChange} className="border p-2 rounded" placeholder="Current Company" />

              <select name="relationship" onChange={handleChange} className="border p-2 rounded">
                <option value="">Relationship</option>
                <option>Friend</option>
                <option>Colleague</option>
              </select>
            </>
          )}

          {type === "lead" && (
            <>
              <input name="clientName" onChange={handleChange} className="border p-2 rounded" placeholder="Client Name" />
              <input name="patientName" onChange={handleChange} className="border p-2 rounded" placeholder="Patient Name" />
              <input name="location" onChange={handleChange} className="border p-2 rounded" placeholder="Location" />

              <input name="phone" onChange={handleChange} className="border p-2 rounded" placeholder="Phone Number" />
   <input name="referralSource" onChange={handleChange} className="border p-2 rounded" placeholder="Referral Source" />
              {/* <select name="referralSource" onChange={handleChange} className="border p-2 rounded">
                <option value="">Referral Source</option>
                <option>Doctor</option>
                <option>Hospital</option>
                <option>Website</option>
                <option>Walk-in</option>
              </select> */}

              <input name="referredBy" onChange={handleChange} className="border p-2 rounded" placeholder="Referred By" />
            </>
          )}

         
          <input
            name="percentage"
            type="number"
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Agreed %"
          />

          <input
            name="amount"
            type="number"
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Referral Amount (₹)"
          />

          <textarea
            name="notes"
            onChange={handleChange}
            className="border p-2 rounded col-span-3"
            placeholder="Notes"
          ></textarea>

        </div>

    
        <div className="flex items-center  px-6 pb-6">
            {SatatusMessage&&
       <div
  className={`w-full text-center mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
    SatatusMessage?.toLowerCase().includes("success")
      ? "bg-green-100 text-green-700"
      : SatatusMessage?.toLowerCase().includes("error")
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700"
  }`}
>
  <span>
    {SatatusMessage?.toLowerCase().includes("success") && "✅"}
    {SatatusMessage?.toLowerCase().includes("error") && "❌"}
    {!SatatusMessage?.toLowerCase().includes("success") &&
      !SatatusMessage?.toLowerCase().includes("error") && "ℹ️"}
  </span>

  <p>{SatatusMessage}</p>
</div>}
      <div className=" w-full flex itmes-center justify-end gap-4">
           <button
            onClick={()=>
      onClose()}
            className="bg-gray-500 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
            <button
            onClick={handleSubmit}
            className="bg-teal-700 text-white px-6 py-2 cursor-pointer rounded-lg hover:bg-teal-800"
          >
            Submit
          </button>
      </div>
        </div>

      </div>
    </div>
  );
}