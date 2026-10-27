
import { FetchLeavesInfo } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed",
      });
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

const GetData=await FetchLeavesInfo(userId)

    return res.status(200).json({
     GetData
    });
  } catch (err: unknown) {
    console.error("GetLeavesInfo Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
