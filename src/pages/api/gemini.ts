
import { GEMINI_MODEL, geminiAI } from "@/Lib/gemini";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { prompt } = req.body || {};

    if (
      typeof prompt !== "string" ||
      !prompt.trim() ||
      prompt.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid prompt is required (maximum 2000 characters).",
      });
    }

    let result: any = null;
    let lastError: any = null;

    // Retry temporary Gemini errors
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(
          `Gemini Request Attempt: ${attempt}/${maxAttempts}`
        );

        result = await geminiAI.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt.trim(),
          config: {
            maxOutputTokens: 500,
          },
        });

        break;

      } catch (error: any) {
        lastError = error;

        const status = error?.status;

        console.error(`Gemini Attempt ${attempt} Failed:`, {
          status,
          message: error?.message,
        });

        const retryableStatuses = [
          429, 500, 502, 503, 504,
        ];

        if (
          !retryableStatuses.includes(status) ||
          attempt === maxAttempts
        ) {
          break;
        }

        // Exponential backoff: 2s, 4s
        await new Promise((resolve) =>
          setTimeout(resolve, attempt * 2000)
        );
      }
    }

    if (!result) {
      const errorStatus = lastError?.status || 500;

      return res.status(
        [429, 503, 504].includes(errorStatus)
          ? errorStatus
          : 500
      ).json({
        success: false,
        model: GEMINI_MODEL,
        message:
          lastError?.message ||
          "Gemini request failed after multiple attempts.",
        status: errorStatus,
      });
    }

    return res.status(200).json({
      success: true,
      model: GEMINI_MODEL,
      response: result.text || "",
    });

  } catch (error: any) {
    console.error("GEMINI API ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.message || "Unknown Gemini error",
      status: error?.status || 500,
    });
  }
}
