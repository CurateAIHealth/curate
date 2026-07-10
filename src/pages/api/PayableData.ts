
import { GetAllUsersData } from "@/Lib/auth";
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
    console.log("API REQUEST START", Date.now());

    console.time("GetApplicationData");
    const data = await GetAllUsersData()
    console.timeEnd("GetApplicationData");

    console.log("deploymentInfo:", data?.deploymentInfo?.length || 0);
    console.log("registeredUsers:", data?.registeredUsers?.length || 0);
    console.log("usersFullInfo:", data?.usersFullInfo?.length || 0);

    console.log("API REQUEST END", Date.now());

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