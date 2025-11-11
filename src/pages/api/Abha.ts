import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { abhaNumber } = req.body;
  if (!abhaNumber) return res.status(400).json({ error: "ABHA number is required" });

  try {
    // 1️⃣ Get session token from ABDM Gateway (sandbox)
    const tokenResp = await axios.post("https://dev.abdm.gov.in/gateway/v0.5/sessions", {
      clientId: process.env.ABHA_CLIENT_ID || "SBXID_010773",
      clientSecret: process.env.ABHA_CLIENT_SECRET || "b9ff1d0e-53d8-4219-b7e0-7d111bd555c4",
    });

    const accessToken = tokenResp.data?.accessToken;
    if (!accessToken) throw new Error("No access token received from gateway");

    // 2️⃣ Call ABHA profile endpoint via the gateway
    const response = await axios.get(
      `https://dev.abdm.gov.in/gateway/v0.5/healthid/account/profile/${abhaNumber}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return res.status(200).json(response.data);
  } catch (err: any) {
    console.error("ABHA Fetch Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed to fetch ABHA details",
      message: err.response?.data || err.message,
    });
  }
}
