

import { GetReasonsInfoInfo, GetReplacementInfo, GetUsersFullInfoForRepleament } from "@/Lib/user.action";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.time("TOTAL_REPLACEMENT_API");

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    console.time("DB_CALLS");

    const [
      placementInformation,
      replacementReasons,
      hcpFullInfo,
    ] = await Promise.all([
      GetReplacementInfo(),
      GetReasonsInfoInfo(),
      GetUsersFullInfoForRepleament(),
    ]);

    console.timeEnd("DB_CALLS");

    return res.status(200).json({
      success: true,
      placementInformation,
      replacementReasons,
      hcpFullInfo,
    });
  } catch (error) {
    console.error("Replacement API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch replacement data",
    });
  } finally {
    console.timeEnd("TOTAL_REPLACEMENT_API");
  }
}