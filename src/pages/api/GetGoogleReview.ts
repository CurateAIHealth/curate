import { GetGoogleReview } from "@/Lib/auth";
import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only POST is allowed
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);

      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }


   

    const result = await GetGoogleReview(
    );

    // Handle service/database failure
    if (!result.success) {
      console.error(
        "GetGoogleReview API - Fetch failed:",
        result.error
      );

      return res.status(500).json({
        success: false,
        error: result.error,
        data: [],
      });
    }

    // Successful fetch
    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "GetGoogleReview API Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Unable to fetch Google Review information",
      data: [],
    });
  }
}