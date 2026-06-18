import type { NextApiRequest, NextApiResponse } from "next";
import { GetUsersFullInfoForRepleament } from "@/Lib/user.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await GetUsersFullInfoForRepleament();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch HCP info",
    });
  }
}