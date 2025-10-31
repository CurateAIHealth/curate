import axios, { AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

interface SessionResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

interface AbhaUserResponse {

  abhaNumber: string;
  name: string;
  gender?: string;
  dateOfBirth?: string;
  [key: string]: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const abhaNumber = req.query.abhaNumber as string;

  if (!abhaNumber) {
    return res.status(400).json({ error: "ABHA number is required" });
  }

  try {
 
    const tokenResponse: AxiosResponse<SessionResponse> = await axios.post(
      "https://dev.abdm.gov.in/gateway/v0.5/sessions",
      {
        clientId: process.env.ABDM_CLIENT_ID,
        clientSecret: process.env.ABDM_CLIENT_SECRET,
      }
    );

    const accessToken = tokenResponse.data.accessToken;


    const abhaResponse: AxiosResponse<AbhaUserResponse> = await axios.get(
      `${process.env.ABDM_BASE_URL}/users/${abhaNumber}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json(abhaResponse.data);
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch ABHA details",
      message: error.response?.data || error.message,
    });
  }
}
