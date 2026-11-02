
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
    const {
      Client_Id,
      Client_Name,
      HCA_Id,
      HCA_Name,
      date,
      status,
      Reason = "",
      UpdatedBy,
    } = req.body;

    if (!Client_Id || !HCA_Id || !date || !status || !UpdatedBy) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!["Present", "Half Day", "Absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance status",
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Termination");
      const replacementCollection = db.collection("Replacement");

    const dateISO = `${date}T00:00:00.000Z`;
    const now = new Date().toISOString();
const isPresent = status === "Present";
const isAbsent = status === "Absent";

const hcpAttendance = isPresent
  ? true
  : isAbsent
    ? false
    : true;

const adminAttendance = isPresent
  ? true
  : isAbsent
    ? false
    : false;


      const replacementInfo = await replacementCollection.findOne(
      {
        ClientId: Client_Id,

        // Selected attendance date must be BEFORE replacement
        ReplacementDate: {
          $gt: date,
        },

        // Ensure historical client attendance exists
        ClientAttendance: {
          $elemMatch: {
            $or: [
              { dateKey: date },
              { AttendanceDate: new Date(dateISO) },
            ],
          },
        },

        // Ensure historical HCP attendance exists
        Attendance: {
          $elemMatch: {
            $or: [
              { dateKey: date },
              { AttendenceDate: new Date(dateISO) },
            ],
          },
        },
      },
      {
        sort: {
          ReplacementDate: 1,
        },
      }
    );
     if (replacementInfo) {

      console.log(
        "[CLIENT ATTENDANCE] Historical replacement found:",
        {
          ClientId: Client_Id,
          PreviousHCA: replacementInfo.HCAName,
          NewHCA: replacementInfo.NewHCAName,
          ReplacementDate: replacementInfo.ReplacementDate,
          AttendanceDate: date,
        }
      );

      const replacementResult = await replacementCollection.updateOne(
        {
          _id: replacementInfo._id,

          ClientAttendance: {
            $elemMatch: {
              $or: [
                { dateKey: date },
                { AttendanceDate: new Date(dateISO) },
              ],
            },
          },

          Attendance: {
            $elemMatch: {
              $or: [
                { dateKey: date },
                { AttendenceDate: new Date(dateISO) },
              ],
            },
          },
        },
        {
          $set: {
            // CLIENT ATTENDANCE
            "ClientAttendance.$[clientAtt].Status": status,
            "ClientAttendance.$[clientAtt].Reason": Reason,
            "ClientAttendance.$[clientAtt].UpdatedAt": now,
            "ClientAttendance.$[clientAtt].UpdatedBy": UpdatedBy,

            // PREVIOUS HCP ATTENDANCE
            "Attendance.$[hcpAtt].HCPAttendence": hcpAttendance,
            "Attendance.$[hcpAtt].AdminAttendece": adminAttendance,
            "Attendance.$[hcpAtt].UpdatedAt": now,
            "Attendance.$[hcpAtt].UpdatedBy": UpdatedBy,
          },
        },
        {
          arrayFilters: [
            {
              $or: [
                { "clientAtt.dateKey": date },
                {
                  "clientAtt.AttendanceDate": new Date(dateISO),
                },
              ],
            },
            {
              $or: [
                { "hcpAtt.dateKey": date },
                {
                  "hcpAtt.AttendenceDate": new Date(dateISO),
                },
              ],
            },
          ],
        }
      );

      if (replacementResult.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Historical replacement attendance not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Historical replacement attendance updated successfully",
        collection: "Replacement",
        previousHCA: replacementInfo.HCAName,
        replacementDate: replacementInfo.ReplacementDate,
        attendanceDate: date,
        modifiedCount: replacementResult.modifiedCount,
      });
    }
    const result = await collection.updateOne(
      {
        ClientId: Client_Id,
        HCAid: HCA_Id,
        ClientAttendance: {
          $elemMatch: {
            $or: [
              { dateKey: date },
              { AttendanceDate: dateISO },
            ],
          },
        },
        Attendence: {
          $elemMatch: {
            $or: [
              { dateKey: date },
              { AttendenceDate: dateISO },
            ],
          },
        },
      },
      {
        $set: {
          "ClientAttendance.$[clientAtt].Status": status,
          "ClientAttendance.$[clientAtt].Reason": Reason,
          "ClientAttendance.$[clientAtt].UpdatedAt": now,
          "ClientAttendance.$[clientAtt].UpdatedBy": UpdatedBy,

          "Attendence.$[hcpAtt].HCPAttendence": hcpAttendance,
  "Attendence.$[hcpAtt].AdminAttendece": adminAttendance,
          "Attendence.$[hcpAtt].UpdatedAt": now,
          "Attendence.$[hcpAtt].UpdatedBy": UpdatedBy,
        },
      },
      {
        arrayFilters: [
          {
            $or: [
              { "clientAtt.dateKey": date },
              { "clientAtt.AttendanceDate": dateISO },
            ],
          },
          {
            $or: [
              { "hcpAtt.dateKey": date },
              { "hcpAtt.AttendenceDate": dateISO },
            ],
          },
        ],
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found for this client and date",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client attendance updated successfully",
      modifiedCount: result.modifiedCount,
    });

  } catch (error: any) {
    console.error("UPDATE CLIENT ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
