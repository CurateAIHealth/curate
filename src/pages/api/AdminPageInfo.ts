
import { GetDashboardData } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    console.time("API_DASHBOARD");

    const result = await GetDashboardData(req.body.userId);

    console.timeEnd("API_DASHBOARD");

    return res.status(200).json(result);
  } catch (error) {
    console.error("Dashboard API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}