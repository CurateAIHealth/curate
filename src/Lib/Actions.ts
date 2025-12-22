
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

const secretKey = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!, "hex");

export function encrypt(text: any) {
  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted,
  };
}

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







export const getDaysBetween=(date1: any, date2: any)=> {

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
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}



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
    console.log("PDF Error ----", err);
  }
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




