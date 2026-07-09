import { UpdateDeploymentStatus, UpdateRefundAmount } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
  

   const {
  Client_Id,
  StartDate,
  ClientRefundAmount,
} = req.body.data;
  console.log("API START Data", req.body);
    const result = await UpdateRefundAmount(
      Client_Id,
      StartDate,
      ClientRefundAmount
    );

    console.log("API END Data", result);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}