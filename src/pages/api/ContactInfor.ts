import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const abhaNumber = req.query.abhaNumber as string;

  if (!abhaNumber) {
    return res.status(400).json({ error: "Missing ABHA Number" });
  }

  try {
    const tokenResponse = await axios.post(
      "https://healthidsbx.abdm.gov.in/api/v1/auth/token",
      {
        clientId: "SBXID_010773",
        clientSecret: "b9ff1d0e-53d8-4219-b7e0-7d111bd555c4",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const accessToken = tokenResponse.data?.accessToken;
    if (!accessToken) {
      throw new Error("Failed to retrieve access token from ABHA API");
    }

    const abhaResponse = await axios.get(
      `https://healthidsbx.abdm.gov.in/api/v1/account/profile/${abhaNumber}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.status(200).json(abhaResponse.data);
  } catch (error: any) {
    console.error("Error fetching ABHA user:", error.response?.data || error);
    return res
      .status(500)
      .json({ error: "Failed to fetch ABHA user details" });
  }
}
