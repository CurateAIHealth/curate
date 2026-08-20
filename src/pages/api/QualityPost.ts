import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

import {
  InsertQualityInfo,
} from "@/Lib/auth";

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

    const feedback =
      req.body?.feedback;

    if (!feedback) {
      return res.status(400).json({
        success: false,
        error: "Feedback is required",
      });
    }

    const result =
      await InsertQualityInfo(feedback);

    if (!result.success) {
      return res.status(
        result.locked ||
        result.alreadyCompleted
          ? 409
          : 400
      ).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error(
      "QualityPost API Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Unable to save Quality feedback",
    });
  }
}