
import { GetReplacementInfo } from "@/Lib/auth";
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
   
const { month, year } = req.body;
    if (!month||!year) {
      return res.status(400).json({
        success: false,
        message: "ImpMonth is required",
      });
    }

    console.time("GetPayableData");
console.log ("Check for imp Data-----",`${month}-${year}`)

    const data = await GetReplacementInfo(month, year);

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