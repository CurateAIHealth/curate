import type { NextApiRequest, NextApiResponse } from "next";
import { GetClietFeedBackInfo } from "@/Lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { month } = req.body;

    if (!month || typeof month !== "string") {
      return res.status(400).json({
        success: false,
        error: "Month is required",
      });
    }

    const result = await GetClietFeedBackInfo(month);

    return res
      .status(result.success ? 200 : 500)
      .json(result);
  } catch (error) {
    console.error("ClientFeedBackInfo API Error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to fetch client feedback information",
    });
  }
}