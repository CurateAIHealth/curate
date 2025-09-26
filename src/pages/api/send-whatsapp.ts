import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { clientNumber, hcaNumber } = req.body;

const message = "Thank you for being a valued member of Curate. Your placement has been successfully confirmed ✅. We’ll begin our services with your assigned HCA starting today.";
const mediaUrl = "https://curatehealthservices.com/wp-content/uploads/2024/10/cropped-logo-removebg-preview-1.png"; 
   
    const config = {
      auth: {
        username: process.env.TWILIO_ACCOUNT_SID!,
        password: process.env.TWILIO_AUTH_TOKEN!,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

   
    const clientRes = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        From: "whatsapp:+14155238886",
        To: `whatsapp:${clientNumber}`,
        Body: message,
        MediaUrl: mediaUrl,
      }),
      config
    );

  
    const hcaRes = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        From: "whatsapp:+14155238886",
        To: `whatsapp:${hcaNumber}`,
        Body: message,
        MediaUrl: mediaUrl,
      }),
      config
    );

    return res.status(200).json({
      success: true,
      client: clientRes.data,
      hca: hcaRes.data,
    });

    
  } catch (error: any) {
    console.error("Twilio Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
}
