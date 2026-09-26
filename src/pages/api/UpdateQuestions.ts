
import clientPromise from "@/Lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Request Not Allowed",
    });
  }

  try {
    const { Type, Reason, Action } = req.body;

    if (!Type || !Reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Type and Reason are required.",
      });
    }

    const questionField =
      Type === "replacement"
        ? "ReplacementQuestions"
        : Type === "termination"
        ? "TerminationQuestions"
        : null;

    if (!questionField) {
      return res.status(400).json({
        success: false,
        message: "Invalid Type.",
      });
    }

    if (Reason.trim() === "Other" && Action === "delete") {
      return res.status(400).json({
        success: false,
        message: "The Other reason cannot be deleted.",
      });
    }

    if (Action && !["add", "delete"].includes(Action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Action.",
      });
    }

    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Questions");

    const result =
      Action === "delete"
        ? await collection.updateOne(
            { [questionField]: Reason.trim() },
            {
              $pull: {
                [questionField]: Reason.trim(),
              },
            }
          )
        : await collection.updateOne(
            { [questionField]: { $exists: true } },
            {
              $addToSet: {
                [questionField]: Reason.trim(),
              },
            }
          );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message:
          Action === "delete"
            ? "Reason not found."
            : "Questions document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        Action === "delete"
          ? result.modifiedCount > 0
            ? "Reason deleted successfully."
            : "Reason not found."
          : result.modifiedCount > 0
          ? "Reason added successfully."
          : "Reason already exists.",
    });
  } catch (error) {
    console.error("UpdateQuestions API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update questions.",
    });
  }
}