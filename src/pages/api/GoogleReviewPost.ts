import { InsertGoogleReview } from "@/Lib/auth";
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

    const postData = req.body?.postData;

 

    // Validate request body
    if (
      !postData ||
      typeof postData !== "object" ||
      Array.isArray(postData)
    ) {
      return res.status(400).json({
        success: false,
        error: "Valid Google Review information is required",
      });
    }

    // Insert into MongoDB
    const result = await InsertGoogleReview(postData);

    // Handle insertion failure
    if (!result.success) {
      console.error(
        "InsertGoogleReview API - Insert failed:",
        result.error
      );

      return res.status(500).json(result);
    }

    // Success
    return res.status(201).json(result);
  } catch (error) {
    console.error(
      "InsertGoogleReview API Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Unable to save Google Review information",
    });
  }
}