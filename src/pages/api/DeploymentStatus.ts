import { UpdateDeploymentStatus } from "@/Lib/auth";
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
    console.log("API START", Date.now());

    const {
      ClientId,
      HCAId,
      Month,
      Status,
    } = req.body;

    const result = await UpdateDeploymentStatus(
      ClientId,
      HCAId,
      Month,
      Status
    );

    console.log("API END", Date.now());

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}