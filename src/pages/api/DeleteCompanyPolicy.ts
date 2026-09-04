import { DeleteCompanyPolicy } from "@/Lib/auth";
import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "DELETE") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }

    const { id } = req.body ?? {};

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Company policy ID is required",
      });
    }

    const result = await DeleteCompanyPolicy(id);

    if (!result?.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Delete Company Policy API Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Unable to delete company policy",
    });
  }
}