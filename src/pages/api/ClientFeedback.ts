import { InsertClietFeedBackInfo } from "@/Lib/auth";
import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

type ApiResponse = {
  success: boolean;
  message?: string;
  error?: string;
  insertedId?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only POST is supported
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const feedback = req.body?.qualityCall;

    // Validate request body
    if (
      !feedback ||
      typeof feedback !== "object" ||
      Array.isArray(feedback)
    ) {
      return res.status(400).json({
        success: false,
        error: "Valid feedback information is required",
      });
    }

    // Insert feedback
    const result = await InsertClietFeedBackInfo(feedback);

    // Handle failed insertion
    if (!result.success) {
      const statusCode =
        result.error?.toLowerCase().includes("already exists")
          ? 409
          : 400;

      return res.status(statusCode).json({
        success: false,
        error: result.error,
      });
    }

    // Successful creation
    return res.status(201).json({
      success: true,
      message:
        result.message ||
        "Client feedback saved successfully",
      insertedId: result.insertedId,
    });
  } catch (error: unknown) {
    console.error(
      "InsertClientFeedback API Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Unable to save client feedback",
    });
  }
}