import { GetQuestionsfromDatabase } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Request Not Allowed",
    });
  }

  try {
    const { Type } = req.body;

    // Validate Type
    if (!Type) {
      return res.status(400).json({
        success: false,
        message: "Questions Type Required",
      });
    }

    // Fetch questions based on Type
    const GetQuestions = await GetQuestionsfromDatabase(Type);

    return res.status(200).json({
      success: true,
      GetQuestions,
    });
  } catch (error) {
    console.error("GetQuestions API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
}