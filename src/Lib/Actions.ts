
  import crypto from "crypto";
  import bcrypt from "bcryptjs";
  
  export const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  export const isValidAadhar = (a: string) => /^\d{12}$/.test(a.replace(/\s/g, ''))
export const normalizeDate = (value: any) => {
  if (!value) return null;

  // Firestore Timestamp
  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  // JS Date
  if (value instanceof Date) {
    return value.toISOString();
  }

  // ISO string or number
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  return null;
};


export function calculateAgeIndianFormat(dob:any) {
  // dob is "DD/MM/YYYY"
  const [day, month, year] = dob.split('/');
  // Rearrange to "YYYY-MM-DD" which is standard
  const dobISO = `${year}-${month}-${day}`;
  const birthDate = new Date(dobISO);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}





const algorithm = "aes-256-cbc";

// const secretKey = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!, "hex");
const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

if (!encryptionKey) {
  throw new Error("NEXT_PUBLIC_ENCRYPTION_KEY is missing");
}

const secretKey = Buffer.from(encryptionKey, "hex");

export function encrypt(text: any) {
  const value = text == null ? "" : String(text);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted,
  };
}
export const safeDecrypt = (value: any) => {
  try {
    if (
      value &&
      typeof value === "object" &&
      "iv" in value &&
      "content" in value
    ) {
      return decrypt(value);
    }
    return value;
  } catch (err) {
    console.warn("Decryption failed:", err);
    return value;
  }
};
export function decrypt(hash: { iv: any; content: any }) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex")
  );

  let decrypted = decipher.update(hash.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted; 
}


export function hashValue(value: any) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function verifySHA256(password: any, hashed: any) {
  return hashValue(password) === hashed;
}




export function rupeeToNumber(value:any) {
  if (value == null) return 0;

  const num = Number(
    value
      .toString()
      .replace(/[₹,]/g, '')
      .trim()
  );

  return Number(num.toFixed(2));
}

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate(); 
};
export  const getDaysInMonthForMonthName = (monthName: string, year: number): number => {
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

  if (isNaN(monthIndex)) {
    throw new Error("Invalid month name");
  }

  return new Date(year, monthIndex + 1, 0).getDate();
};
const currentYear = new Date().getFullYear();

export const years = Array.from(
  { length: 6 }, 
  (_, i) => currentYear - 4 + i
);

export const getDaysBetween = (date1: any, date2: any) => {
  const parseDate = (input: any) => {
    if (input instanceof Date) return input;
    if (typeof input === "number") return new Date(input);

    let str = String(input).trim();

    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(str)) {
      const parts = str.includes("/") ? str.split("/") : str.split("-");
      const [day, month, year] = parts;
      return new Date(`${year}-${month}-${day}`);
    }

    return new Date(str);
  };

  const d1 = parseDate(date1);
  const d2 = parseDate(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1; // 👈 fix
};

export const getDueDaysStatus = (targetDate: any) => {
  const parseDate = (input: any) => {
    if (input instanceof Date) return input;
    if (typeof input === "number") return new Date(input);

    let str = String(input).trim();

    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(str)) {
      const parts = str.includes("/") ? str.split("/") : str.split("-");
      const [day, month, year] = parts;
      return new Date(`${year}-${month}-${day}`);
    }

    return new Date(str);
  };

  const today = new Date();
  const due = parseDate(targetDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

 
  if (diffDays > 0) return diffDays;           
  if (diffDays === 0) return 0;               
  return `Extention Overdue by ${Math.abs(diffDays)} day`;
};

export const numberToWords=(num: any)=> {
  if (num === 0) return "zero";

  const belowTwenty = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
    "sixteen", "seventeen", "eighteen", "nineteen"
  ];

  const tens = [
    "", "", "twenty", "thirty", "forty", "fifty",
    "sixty", "seventy", "eighty", "ninety"
  ];

  const thousands = ["", "thousand", "million", "billion"];

  function word(n: number): string {
    if (n < 20) return belowTwenty[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + belowTwenty[n % 10] : "");
    if (n < 1000)
      return (
        belowTwenty[Math.floor(n / 100)] +
        " hundred" +
        (n % 100 ? " " + word(n % 100) : "")
      );
    return "";
  }

  let result = "";
  let i = 0;

  while (num > 0) {
    if (num % 1000 !== 0) {
      result =
        word(num % 1000) +
        (thousands[i] ? " " + thousands[i] : "") +
        (result ? " " + result : "");
    }
    num = Math.floor(num / 1000);
    i++;
  }

  return result;
}



import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { popularAreas } from "./Content";

export const GeneratePDF = async (invoiceData:any) => {
  try {
    const pdfRef = document.getElementById("invoice-pdf-area");
    if (!pdfRef) return null;

 
    const canvas = await html2canvas(pdfRef, { 
        scale: 3,      
        useCORS: true,  
        allowTaint: true
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save(`${invoiceData.number || "invoice"}.pdf`);

    return { status: true, message: "Invoice downloaded successfully!" };
  } catch (err) {
    
  }
};


export   const toCamelCase = (value?: string | null) => {
    if (!value) return "Not Provided";

    return value
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };
export const toProperCaseLive = (value?: unknown) => {
  const str = typeof value === "string" ? value : "";

  const endsWithSpace = str.endsWith(" ");

  const formatted = str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return endsWithSpace ? formatted + " " : formatted;
};

export const extractAreasFromAddress = (address: string): string[] => {
  if (!address) return [];

  // Common words we DON'T want as areas
  const ignoreWords = [
    "flat", "floor", "road", "rd", "street", "st",
    "lane", "ln", "colony", "colny", "residency",
    "tower", "villa", "apartment", "apt",
    "near", "opp", "beside",
    "hyderabad", "secunderabad", "telangana",
  ];

  const parts = address
    .toLowerCase()
    .split(",")
    .map(p => p.trim())
    .filter(Boolean);

  const areas = parts.filter(part => {
    // remove pincodes & pure numbers
    if (/\d{3,}/.test(part)) return false;

    // ignore if contains any unwanted keyword
    return !ignoreWords.some(word => part.includes(word));
  });

  // Capitalize properly
  return [...new Set(areas)].map(area =>
    area
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
};

export const GenerateBillPDF = async (invoiceData: any) => {
  try {
    const pdfRef = document.getElementById("invoice-pdf-area");
    if (!pdfRef) {
      return { status: false, message: "PDF area not found" };
    }

    const canvas = await html2canvas(pdfRef, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",

      // ✅ CRITICAL FIX FOR oklab / lab
      onclone: (clonedDoc) => {
        const allElements = clonedDoc.querySelectorAll("*");

        allElements.forEach((el: any) => {
          const style = clonedDoc.defaultView?.getComputedStyle(el);

          if (!style) return;

          // Replace unsupported color formats
          if (style.color?.includes("oklab") || style.color?.includes("lab")) {
            el.style.color = "#000000";
          }

          if (
            style.backgroundColor?.includes("oklab") ||
            style.backgroundColor?.includes("lab")
          ) {
            el.style.backgroundColor = "#ffffff";
          }

          if (
            style.borderColor?.includes("oklab") ||
            style.borderColor?.includes("lab")
          ) {
            el.style.borderColor = "#cccccc";
          }

          // Remove shadows & filters (often use oklab internally)
          el.style.boxShadow = "none";
          el.style.filter = "none";
        });
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save(`${invoiceData.number || "invoice"}.pdf`);

    return { status: true, message: "Invoice downloaded successfully!" };
  } catch (err) {
    console.error("PDF Error ----", err);
    return { status: false, message: "PDF generation failed" };
  }
};


const normalize = (text = "") =>
  text.toLowerCase().replace(/,/g, "").trim();

export const getPopularArea = (address = "") => {
  const text = normalize(address);

  for (const area of popularAreas) {
    if (area.keywords.some(k => text.includes(k))) {
      return area.name;
    }
  }

  return "Hyderabad"; // safe fallback
};

export const AssignSuitableIcon = (A: any, B: any) => {
  const gender = A?.toLowerCase();
  const type = B?.toUpperCase();

  let image = "/Icons/DefaultProfileIcon.png";

  switch (type) {
    case "HCA":
      if (gender === "male") image = "/Icons/HCAMale.png";
      if (gender === "female") image = "/Icons/HCAFemale.png";
      break;

    case "HCN":
      if (gender === "male") image = "/Icons/HCNMale.png";
      if (gender === "female") image = "/Icons/HCNFemale.png";
      break;

    case "HCP":
      if (gender === "male") image = "/Icons/HCPMale.png";
      if (gender === "female") image = "/Icons/HCPFemale.png";
      break;
  }

  return {
    image,        
    caseType: type || "DEFAULT"  
  };
};


export const getBase64Image = async (url: any) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return `data:image/png;base64,${base64}`;
};


export const getHCATypeDescription = (Type: any) => {
  switch(Type){
case "HCA":
  return "Healthcare Assistants";
  case "HCN":
    return "Healthcare Nurses";
    case "HCP":
      return "Healthcare Professionals";
      case "HCC":
        return "Healthcare Companions";
        default:      
        null
  }
}

const parseDate = (dateString: string) => {
  if (!dateString) return null;

  const [day, month, year] = dateString.split("/").map(Number);

  if (!day || !month || !year) return null;

  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  return date;
};
export const GetAwaitInfoData = (ClientsInformation: any[]) => {
  return ClientsInformation.filter((client: any) => {
    if (!client.EndDate) return false;
 const now = new Date();
    const endDate = parseDate(client.EndDate);
    if (!endDate) return false;

    const reminderStartDate = new Date(endDate);
    reminderStartDate.setDate(reminderStartDate.getDate() - 3);
    reminderStartDate.setHours(0, 0, 0, 0);

    return now >= reminderStartDate;
  }).map((each: any) => {
    const normalizedAttendance =
      Array.isArray(each.Attendance) && each.Attendance.length > 0
        ? each.Attendance.map((att: any) => {
            const hcp =
              att.HCPAttendence ??
              att.HCPAttendance ??
              att.hcpAttendence ??
              false;

            const admin =
              att.AdminAttendece ??
              att.AdminAttendence ??
              att.AdminAttendance ??
              att.adminAttendence ??
              false;

            return {
              date: att.AttendenceDate,
              status: hcp && admin
                ? "Present"
                : hcp || admin
                ? "Half Day"
                : "Absent",
            };
          })
        : [];

    return {
      Client_Id: each.ClientId,
      HCA_Id: each.HCAId,
      Address: each.Address,
      name: each.ClientName,
      email: each.ClientEmail,
      contact: each.ClientContact,
      HCAContact: each.HCAContact,
      HCA_Name: each.HCAName,
      location: each.Address,
      TimeSheet: normalizedAttendance,
      TerminatedAttendece: each.Attendance,
      PatientName: each.patientName,
      Patient_PhoneNumber: each.patientPhone,
      RreferralName: each.referralName,
      Type: each.Type,
      Status: each.Status,
      cPay: each.cPay,
      cTotal: each.cTotal,
      hcpPay: each.hcpPay,
      hcpSource: each.hcpSource,
      hcpTotal: each.hcpTotal,
      invoice: each.invoice,
      ServiceCharge: each.CareTakerPrice,
      StartDate: each.StartDate,
      EndDate: each.EndDate,
      Month: each.Month,
      Replacement: each.Replacement,
      ServiceState: each.ServiceState || "Not Provided",
   
    };
  });
};


const StaffNames: Record<string, string> = {
  "admin@curatehealth.in": "Admin",
  "tsiddu805@gmail.com": "Sidd",
  "panducurate@gmail.com": "Pandu",
  "info@curatehealth.in": "Info",
  "gouricurate@gmail.com": "Gouri",
  "kirancuratehealth@gmail.com": "Kiran",
  "srivanikasham@curatehealth.in": "Srivani Kasham",
  "sravanthicurate@gmail.com": "Sravanthi",
  "srinivasnew0803@gmail.com": "Srinivas",
  "rpandu823@gmail.com": "R. Pandu",
  "shreeshmacurate@gmail.com": "Shreeshma",
};

export const GetStaffName = (email?: string): string => {
  if (!email) return "Not Provided";
  return StaffNames[email.trim().toLowerCase()] ?? email;
};


type MarginResult = {
  marginAmount: number;
  marginPercentage: number;
};

export const calculateMargin = (
  clientDailyAmount: number,
  caretakerDailyAmount: number
): MarginResult => {
  const marginAmount = clientDailyAmount - caretakerDailyAmount;

  const marginPercentage =
    clientDailyAmount > 0
      ? Math.round((marginAmount / clientDailyAmount) * 100)
      : 0;

  return {
    marginAmount: Math.round(marginAmount),
    marginPercentage,
  };
};

const parseIndianDate = (dateString: string) => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const getMonthKey = (
  startDateString: string,
  endDateString: string
) => {
  if (!startDateString || !endDateString) return [];

  const startDate = parseIndianDate(startDateString);
  const endDate = parseIndianDate(endDateString);

  const monthKeys: string[] = [];

  const current = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  );

  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    1
  );

  while (current <= end) {
    monthKeys.push(
      `${current.getFullYear()}-${String(
        current.getMonth() + 1
      ).padStart(2, "0")}`
    );

    current.setMonth(current.getMonth() + 1);
  }

  return monthKeys;
};


export const GetHCPFullName = (users: any[], userId: any): string => {
  if (!Array.isArray(users) || !users.length || !userId) {
    return "";
  }

  const info = users
    .map((each: any) => each?.HCAComplitInformation)
    .find((info: any) => info?.UserId === userId);

  if (!info) {
    return "";
  }

  const fullName = [
    info?.HCPSurName,
    info?.HCPFirstName,
    info?.LastName,
  ]
    .filter(Boolean)
    .join(" ");

  return fullName;
};

export const GetPreviewUserType = (Regusers: any[], ImpUserid: string) => {
  const Task = Regusers?.find(
    (each: any) => each?.userId === ImpUserid
  );

  return Task?.PreviewUserType || "HCP";
};
export const parseFlexibleDate = (value: any): Date | null => {
  if (!value) return null;

  // Already a Date
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  // Mongo / JSON date object
  if (typeof value === "object" && value.$date) {
    const date = new Date(value.$date);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const str = String(value).trim();

  if (!str) return null;

  // Timestamp
  if (/^\d+$/.test(str)) {
    const date = new Date(Number(str));
    return isNaN(date.getTime()) ? null : date;
  }

  // ISO / normal JS date
  if (
    /^\d{4}-\d{2}-\d{2}/.test(str) ||
    /^\d{4}\/\d{2}\/\d{2}/.test(str)
  ) {
    const date = new Date(str);
    return isNaN(date.getTime()) ? null : date;
  }

  // DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const parts = str.split(/[\/\-\.]/);

  if (parts.length === 3) {
    let [a, b, c] = parts.map(Number);

    if (
      !isNaN(a) &&
      !isNaN(b) &&
      !isNaN(c) &&
      c >= 1000
    ) {
      // Assume DD/MM/YYYY
      const date = new Date(c, b - 1, a);

      if (
        !isNaN(date.getTime()) &&
        date.getDate() === a &&
        date.getMonth() === b - 1 &&
        date.getFullYear() === c
      ) {
        return date;
      }

      // Also support MM/DD/YYYY
      const usDate = new Date(c, a - 1, b);

      if (!isNaN(usDate.getTime())) {
        return usDate;
      }
    }
  }

  // Final fallback
  const date = new Date(str);

  return isNaN(date.getTime()) ? null : date;
};

export const GetEmail = (
  users: any[],
  userId: string
): string => {
  return (
    users.find(
      (each: any) => each?.userId === userId
    )?.Email || ""
  );
};