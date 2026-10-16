
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
    const {
      ClientId,
      HCAId,
      Month,
      Status,
      FreezeInformation,
    } = req.body;

    // Validate required fields
    if (!ClientId || !HCAId || !Month || !Status) {
      return res.status(400).json({
        success: false,
        message: "ClientId, HCAId, Month, and Status are required.",
      });
    }

    // Validate freeze information
    if (
      FreezeInformation &&
      typeof FreezeInformation !== "object"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid FreezeInformation payload.",
      });
    }

    // Update deployment status and freeze information
    const result = await UpdateDeploymentStatus(
      ClientId,
      HCAId,
      Month,
      Status,
      FreezeInformation
    );

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("DeploymentStatus API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}