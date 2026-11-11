
import clientPromise from "@/Lib/db";
import type { NextApiRequest, NextApiResponse } from "next";


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
    const { ClientId, HCAid, StartDate } = req.body;
console.log("GetTerminalClientAttendance Request Body:", req.body);
    if (!ClientId || !HCAid || !StartDate) {
      return res.status(400).json({
        success: false,
        message: "ClientId, HCAid and StartDate are required",
      });
    }

       const client = await clientPromise;
    const db = client.db("CurateInformation");
    const result: any = await db.collection("Termination").findOne(
  {
    ClientId: ClientId,
    HCAid: HCAid,
    StartDate: StartDate,
  },
  {
    projection: {
      _id: 0,
      ClientAttendance: 1,
      EndDate: 1,
      ServiceCharge:1
    },
  }
);

const ClientAttendance = result?.ClientAttendance || [];

    return res.status(200).json({
      success: true,
      ClientAttendance: result,
    });

  } catch (error) {
    console.error("GetTerminalClientAttendance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
