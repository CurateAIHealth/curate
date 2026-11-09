
import type { NextApiRequest, NextApiResponse } from "next";
import { Updatedailystatus } from "@/Lib/auth";

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
      Status,
      EmployeeName,
      LeaveType,
      Description,
      Month
    } = req.body || {};

    if (!UserId || !AttendanceDate || !Status || !EmployeeName|| !Month) {
      return res.status(400).json({
        success: false,
        message: "Required attendance details are missing.",
      });
    }

    const result = await Updatedailystatus({
      UserId,
      AttendanceDate,
      Status,
      LeaveType,
      Description,
      EmployeeName,
      Month
    });

    if (!result?.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);

  } catch (error: any) {
    console.error("UpdateDailyStaffAttendance API error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update attendance.",
    });
  }
}
