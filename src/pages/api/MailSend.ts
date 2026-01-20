import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { to, subject, html, pdfBase64 } = req.body;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST, 
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD, 
  },
});


    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      // attachments: [
      //   {
      //     filename: "invoice.pdf",
      //     content: pdfBase64,
      //     encoding: "base64",
      //   },
      // ],
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Nodemailer Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Email sending failed",
    });
  }
}
