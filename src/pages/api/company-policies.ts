import { PostCompanyPolicy } from "@/Lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";

type ApiResponse = {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
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

    const { uploadedPolicy } = req.body ?? {};

    // Validate request body
    if (!uploadedPolicy) {
      return res.status(400).json({
        success: false,
        error: "Uploaded policy is required",
      });
    }

    // Save policy
    const result = await PostCompanyPolicy(uploadedPolicy);

    if (!result?.success) {
      return res.status(400).json({
        success: false,
        error: result?.error || "Failed to save company policy",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company policy saved successfully",
    });
  } catch (error) {
    console.error("CompanyPolicy API Error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to save company policy",
    });
  }
}