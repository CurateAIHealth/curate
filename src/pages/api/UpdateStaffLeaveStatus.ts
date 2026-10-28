import { StaffAttendecebyDate, UpdateStaffLeaveStatus } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Methode Not Allowed" })
        }

        const { UserId,
            AttendanceDate,
            ApprovalStatus,loggedInEmail,employee } = req.body
        if (!UserId ||
            !AttendanceDate ||
            !ApprovalStatus||!loggedInEmail!) {
            return res.status(405).json({ message: "Attendece Date Missing" })
        }

        const AttendeceResuls = await UpdateStaffLeaveStatus( req.body)

        return res.status(200).json({ AttendeceResuls })
    } catch (err: any) {

    }
}