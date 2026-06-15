import {
  GetDashboardData,
  ClearDashboardCache,
} from "@/Lib/auth";
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
    const {
      userId,
      refreshType,
    }: {
      userId: string;
      refreshType?:
        | "profile"
        | "registeredUsers"
        | "fullInfo"
        | "deployment";
    } = req.body;

    console.time("API_DASHBOARD");

    if (refreshType) {
      ClearDashboardCache(userId, refreshType);

      console.log(
        `Dashboard cache cleared for ${refreshType}`
      );
    }

    const result = await GetDashboardData(userId);

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