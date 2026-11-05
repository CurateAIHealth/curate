import clientPromise from "@/Lib/db";
import type { NextApiRequest, NextApiResponse } from "next";




export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    const {
      amount,
      billDate,
      employeeId,
      employeeName,
      expenseType,
      paidTo,
      paymentAccount,
      reason,
      receipt,
      submissionDate,
      gst,
      tds,
    } = req.body;

    // Validate required fields
    if (
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !billDate ||
      !employeeId ||
      !employeeName?.trim() ||
      !expenseType
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid expense amount.",
      });
    }

      const client = await clientPromise;
    const db = client.db("CurateInformation");
    const collection = db.collection("Expences");

    const expenseData = {
      amount: numericAmount,
      billDate,
      employeeId,
      employeeName: employeeName.trim(),
      expenseType,
      gst: gst || "",
      paidTo: paidTo || "",
      paymentAccount: paymentAccount || "",
      reason: reason || "",
      receipt: receipt || "",
      submissionDate: submissionDate || new Date().toISOString().split("T")[0],
      tds: tds || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(expenseData);

    return res.status(201).json({
      success: true,
      message: "Expense submitted successfully.",
      expenseId: result.insertedId,
      data: expenseData,
    });

  } catch (error) {
    console.error("Expense Submission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit expense.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}