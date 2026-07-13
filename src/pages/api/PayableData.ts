
import { GetPayableData } from "@/Lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.time("TOTAL_API_ROUTE");

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
 const data = await GetPayableData()
    console.timeEnd("GetApplicationData");
return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GetApplicationData Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch data",
    });
  } finally {
    console.timeEnd("TOTAL_API_ROUTE");
  }
}