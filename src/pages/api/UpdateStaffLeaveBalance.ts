

import { UpdateLeavesInfo } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed",
      });
    }

    const { UserId,CasualLeaves,SickLeaves } = req.body;
console.log ("Check UserId----",UserId)
    if (!UserId ) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

const GetData=await UpdateLeavesInfo(UserId,CasualLeaves,SickLeaves)

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
