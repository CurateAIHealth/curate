import type { NextApiRequest, NextApiResponse } from "next";
import { GetReasonsInfoInfo } from "@/Lib/user.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const data = await GetReasonsInfoInfo();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch replacement reasons:", error);

    return res.status(500).json({
      error: "Failed to fetch replacement reasons",
    });
  }
}