
import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
const ApiKey = process.env.SENDGRID_API_KEY;
if (!ApiKey) {
  throw new Error('Missing SendGrid API Key');
}
sgMail.setApiKey(ApiKey);


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { to, subject, html } = req.body;

  try {
    await sgMail.send({ to, from: 'admin@curatehealth.in', subject, html });
    res.status(200).json({ success: true });
  } catch (error: any) {
console.log("EmailError---",error)
    res.status(500).json({ success: false, error: error.message });
  }
}
