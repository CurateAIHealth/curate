"use client";

import { VendorFieldMap } from "@/Lib/Content";
import {  UpdateVendorInformation } from "@/Lib/user.action";
import { CurrentReferdVendorId, Updateformregisterdusertype, UpdateVendorPopUpStatus } from "@/Redux/action";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
interface Section {
  title?: string;
  items: string[];
}

interface Props {
  mainTitle: string;
  sections: Section[];
}

export default function CommonMedicalSection({ mainTitle, sections }: Props) {
  const [InputFormData, setFormData] = useState<{ [key: string]: any }>({});
  const [StatusMessage, setStatusMessage] = useState("");
  const dispatch = useDispatch();
  const Router = useRouter();

  const handleChange = (label: string, value: any) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

const handleImageChange = useCallback(
  async (e: React.ChangeEvent<HTMLInputElement>) => {
      setStatusMessage(`Please Wait Uploading ${ e.target.name}`);
    const file = e.target.files?.[0];
    const inputName = e.target.name;
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max allowed is 10MB.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported file type.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/Upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

  
      setFormData((prev: any) => ({
        ...prev,
        [inputName]: res.data.url,
      }));
      setStatusMessage(`${inputName}Successfully Uploaded`)
    } catch (error: any) {
      console.error("Upload failed:", error.message);
    }
  },
  []
);

  const getInputType = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("email")) return "email";
    if (l.includes("password")) return "password";
    if (l.includes("phone") || l.includes("mobile")) return "tel";
    if (l.includes("contact")) return "tel";
    return "text";
  };

  const FilterData = Object.values(InputFormData).some((each) => each === "");

 

const PostData =async () => {
  
  if (FilterData === true) {
    setStatusMessage("Looks like some fields are missing. Please fill them in.");
    return;
  }

 setStatusMessage("Please Wait....")
  const finalData: { [key: string]: any } = {};

  Object.keys(InputFormData).forEach((key) => {
    finalData[key] = InputFormData[key];  
  });
 const normalizeVendorInput = (formData: any) => {
  const normalized: any = {};

  Object.keys(formData).forEach((label) => {
    const backendKey = VendorFieldMap[label];

    if (backendKey) {
      normalized[backendKey] = formData[label];
    }
  });

  return normalized;
};


  const generatedUserId = uuidv4();
const payload = {
  ...normalizeVendorInput(InputFormData),
  userId: generatedUserId,
  userType: 'Vendor',
  VerificationStatus: "Pending",
  TermsAndConditions: "Accepted",
  EmailVerification: false,
  FinelVerification: false,
};
 
const Argu = mainTitle=== "Business Vendor Form" ?  "Healthcare Assistant":"patient" ;
 console.log('Posted Data----',payload);
   const result = await UpdateVendorInformation(payload);
      if (result.success===true) {
 
        setStatusMessage(result.message);

        if ((mainTitle === "Business Vendor Form") || (mainTitle === "HCP vendor Form")) {
          dispatch(CurrentReferdVendorId(payload.userId))
          dispatch(Updateformregisterdusertype(Argu));
        
            dispatch(UpdateVendorPopUpStatus(true))

        }

        return;
      }


 
};




  const attachmentList: string[] = [];

  sections.forEach((sec) => {
    sec.items.forEach((label) => {
      const l = label.toLowerCase();

      if (l.includes("aadhar")) attachmentList.push("Aadhar Attachment");
      if (l.includes("pan") && !l.includes("company"))
        attachmentList.push("PAN Attachment");
      if (l.includes("company pan"))
        attachmentList.push("Company PAN Attachment");
      if (l.includes("bank account"))
        attachmentList.push("Bank Proof Attachment");
      if (l.includes("company registration"))
        attachmentList.push("Company Registration Certificate");
    });
  });

 
  const inputSections = sections.filter(
    (s) => !(s.title || "").toLowerCase().includes("terms")
  );

  const termsSection = sections.find((s) =>
    (s.title || "").toLowerCase().includes("terms")
  );
  console.log('First Posted Data----',InputFormData);
  return (
    <div
      className="
        w-full rounded-3xl border border-[#d9e7ff]/60 
        bg-white/60 backdrop-blur-xl 
        shadow-[0_12px_40px_rgba(0,60,120,0.15)]
        overflow-hidden
      "
    >

      <div
        className="
          px-10 py-8 flex items-center justify-between
          bg-gradient-to-br from-[#e9f3ff] via-[#f5f9ff] to-[#e9f3ff]
          border-b border-[#d9e7ff]
        "
      >
        <div>
          <h1 className="text-4xl font-semibold text-[#ff1493] tracking-tight">
            {mainTitle}
          </h1>
          <p className="text-[#50c896] mt-2 text-lg">
            Provide complete details for processing
          </p>
        </div>

        <img
          src="Icons/Curate-logoq.png"
          onClick={()=>Router.push("/DashBoard")} 
          className="h-20 w-20 object-contain"
          alt="Logo"
        />
      </div>

      <div className="px-10 py-12 space-y-14">


        {inputSections.map((sec, idx) => (
          <div key={idx} className="space-y-8">
            {sec.title && (
              <h2
                className="
                  text-2xl font-semibold text-[#00446e]
                  pl-4 border-l-[5px] border-[#79b7ff]
                "
              >
                {sec.title}
              </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sec.items.map((label, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <label className="text-[#003b6f] font-medium text-[15px]">
                    {label}
                  </label>

                  <input
                    type={getInputType(label)}
                    className={`
                      px-4 py-3 bg-white/70 border border-[#d7e7ff]
                      rounded-2xl shadow-sm 
                      focus:ring-2 focus:ring-[#75aaff] 
                      focus:border-[#75aaff] transition ${label.includes("PAN") ? "uppercase" : ""}
                    `}
                    value={InputFormData[label] || ""}
                    onChange={(e) => handleChange(label, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {attachmentList.length > 0 && (
          <div className="space-y-6">
            <h2
              className="
                text-2xl font-semibold text-[#00446e]
                pl-4 border-l-[5px] border-[#79b7ff]
              "
            >
              Attachments
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {attachmentList.map((att, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <label className="text-[#003b6f] font-medium text-[15px]">
                    {att}
                  </label>

                  {InputFormData[att]?<img  src={InputFormData[att]}/>:<input
                    type="file"
                    name={att}
                    className="
                      px-4 py-3 bg-white/70 border border-[#d7e7ff]
                      rounded-2xl shadow-sm cursor-pointer
                      focus:ring-2 focus:ring-[#75aaff] 
                      focus:border-[#75aaff]
                    "
                    onChange={handleImageChange}
                  />}
                </div>
              ))}
            </div>
          </div>
        )}


        {termsSection && (
          <div className="space-y-6">
            <h2
              className="
                text-2xl font-semibold text-[#00446e]
                pl-4 border-l-[5px] border-[#79b7ff]
              "
            >
              {termsSection.title}
            </h2>

            <div
              className="
                bg-[#f5f9ff]/70 border border-[#d7e7ff]
                rounded-2xl p-6 shadow-inner space-y-3
              "
            >
              {termsSection.items.map((item, j) => (
                <p key={j} className="text-[#003b6f] text-[16px]">
                  • {item}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

  
   
        <p className="text-center mb-2 text-gray-600 font-semibold">
       {StatusMessage}
        </p>
    


      <div className="flex justify-center shadow-lg ">
          <button
            className="
              px-6 py-2.5 bg-white border mb-4 cursor-pointer
              border-blue-500 text-blue-600 font-semibold rounded-lg
              shadow-sm hover:bg-blue-50 hover:text-blue-700
            "
            onClick={PostData}
          >
            Register
          </button>
        </div>
    </div>
  );
}
