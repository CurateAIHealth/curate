import { GetCompanyPolicies } from "@/Lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";

type ApiResponse = {
  success: boolean;
  data?: any[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);

      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }

    const result = await GetCompanyPolicies();

    if (!result?.success) {
      return res.status(400).json({
        success: false,
        error: result?.error || "Failed to fetch company policies",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data || [],
    });
  } catch (error) {
    console.error("CompanyPolicy API Error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to fetch company policies",
    });
  }
}