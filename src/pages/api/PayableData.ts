import { GetPayableData } from "@/Lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.time("TOTAL_API_ROUTE");

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { ImpMonth } = req.body;

    if (!ImpMonth) {
      return res.status(400).json({
        success: false,
        message: "ImpMonth is required",
      });
    }

    console.time("GetPayableData");

    const data = await GetPayableData(ImpMonth);

    console.timeEnd("GetPayableData");

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GetPayableData Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch data",
    });
  } finally {
    console.timeEnd("TOTAL_API_ROUTE");
  }
}