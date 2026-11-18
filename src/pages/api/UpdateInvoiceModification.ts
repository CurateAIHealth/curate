
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
      ClientId,
      Invoice,
      ServiceStartDate,
      additionalCharges,
      freezeDaysRefund,
    } = req.body;
console.log("Get Data-------", req.body)
    // Validate invoice identification
    if (!ClientId || !Invoice) {
      return res.status(400).json({
        success: false,
        message: "ClientId and Invoice are required.",
      });
    }

    if (!additionalCharges || typeof additionalCharges !== "object") {
      return res.status(400).json({
        success: false,
        message: "Additional charges are required.",
      });
    }

    const chargeFields = [
      "lateFee",
      "chequeCollectionCharges",
      "bounceCheque",
      "equipmentBedRentMonth",
    ];

    for (const field of chargeFields) {
      const value = Number(additionalCharges[field]);

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid amount for ${field}`,
        });
      }
    }

    // Connect MongoDB
    const client = await clientPromise;
    const db = client.db("CurateInformation");

    const collection = db.collection("Invoices");

    const updateData: any = {
      additionalCharges: {
        lateFee: Number(additionalCharges.lateFee),
        chequeCollectionCharges: Number(
          additionalCharges.chequeCollectionCharges
        ),
        bounceCheque: Number(additionalCharges.bounceCheque),
        equipmentBedRentMonth: Number(
          additionalCharges.equipmentBedRentMonth
        ),
           updatedAt: new Date().toISOString(),
      },
    };

    // Push freeze dates only when a date range is provided
    if (freezeDaysRefund?.fromDate || freezeDaysRefund?.toDate) {
      if (
        !freezeDaysRefund.fromDate ||
        !freezeDaysRefund.toDate ||
        freezeDaysRefund.fromDate > freezeDaysRefund.toDate
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid freeze date range.",
        });
      }

      updateData.freezeDaysRefund = {
        fromDate: freezeDaysRefund.fromDate,
        toDate: freezeDaysRefund.toDate,
            RefundDays:freezeDaysRefund.RefundDays,
              Amount:freezeDaysRefund.Amount,
        updatedAt: new Date().toISOString(),
      };
    }

    // Push new objects into existing arrays
    const updateResult = await collection.updateOne(
      {
        ClienId: ClientId,
       SeriviceStartDate:ServiceStartDate
      },
      {
        $push: {
          additionalCharges: updateData.additionalCharges,
          ...(updateData.freezeDaysRefund
            ? {
                freezeDaysRefund: updateData.freezeDaysRefund,
              }
            : {}),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found for the provided ClientId and Invoice number.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice modifications saved successfully.",
      modified: updateResult.modifiedCount,
    });

  } catch (error: any) {
    console.error("Update Invoice Modification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save invoice modifications.",
      error: error.message,
    });
  }
}
