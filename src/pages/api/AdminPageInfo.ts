import {
  GetDashboardData,
  ClearDashboardCache,
  ClearProfileCache,
} from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

type RefreshType =
  | "profile"
  | "registeredUsers"
  | "fullInfo"
  | "deployment";

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
      refreshType?: RefreshType | RefreshType[];
    } = req.body;

    console.time("API_DASHBOARD");

    if (refreshType) {
      const refreshArray = Array.isArray(refreshType)
        ? refreshType
        : [refreshType];

      // Clear profile cache (user-specific)
      if (refreshArray.includes("profile")) {
        ClearProfileCache(userId);

        console.log(
          `Profile cache cleared for user ${userId}`
        );
      }

      // Clear global dashboard cache
      const dashboardTypes = refreshArray.filter(
        (type): type is
          | "registeredUsers"
          | "fullInfo"
          | "deployment" =>
          type !== "profile"
      );

      if (dashboardTypes.length > 0) {
        ClearDashboardCache(dashboardTypes);

        console.log(
          `Dashboard cache cleared for ${dashboardTypes.join(
            ", "
          )}`
        );
      }
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