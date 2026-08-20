import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

import {
  GetQualityInfo,
} from "@/Lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }

    const result =
      await GetQualityInfo();

    return res.status(
      result.success ? 200 : 500
    ).json(result);

  } catch (error) {
    console.error(
      "GetQualityData API Error:",
      error
    );

    return res.status(500).json({
      success: false,
      data: [],
      error:
        "Unable to get Quality information",
    });
  }
}