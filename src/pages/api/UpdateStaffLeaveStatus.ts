
import type { NextApiRequest, NextApiResponse } from "next";
import { UpdateStaffLeaveStatus } from "@/Lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const {
      UserId,
      AttendanceDate,
      ApprovalStatus,
      loggedInEmail,
    } = req.body || {};

    if (!UserId || !AttendanceDate || !loggedInEmail) {
      return res.status(400).json({
        success: false,
        message: "UserId, AttendanceDate and loggedInEmail are required",
      });
    }

    const allowedStatuses = ["Approved", "Rejected", "Revert"];

    if (!allowedStatuses.includes(ApprovalStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ApprovalStatus",
      });
    }

    const result = await UpdateStaffLeaveStatus({
      UserId,
      AttendanceDate,
      ApprovalStatus,
      loggedInEmail,
    });

    if (!result?.success) {
      return res.status(400).json({
        success: false,
        message: result?.message || "Unable to process leave request",
      });
    }

    return res.status(200).json(result);

  } catch (error: any) {
    console.error("UpdateStaffLeaveStatus API error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update leave request",
    });
  }
}
