import { NextApiRequest, NextApiResponse } from "next";
import { GetQualityStatus } from "@/Lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }

    const UserId = req.body?.UserId;

    if (!UserId) {
      return res.status(400).json({
        success: false,
        error: "UserId is required",
      });
    }

    const result = await GetQualityStatus(
      String(UserId)
    );

    return res.status(
      result.success ? 200 : 500
    ).json(result);

  } catch (error) {
    console.error(
      "GetQualityStatus API Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Unable to get Quality status",
    });
  }
}