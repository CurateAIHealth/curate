
import clientPromise from "@/Lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      Message: "Method Not Allowed",
    });
  }

  const clientId = req.body?.ClienId;

  if (!clientId) {
    return res.status(400).json({
      Message: "Required Client Id Missing",
    });
  }

  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");

    const invoices = await db.collection("Invoices").find(
      { ClienId: clientId.trim() },
      {
        projection: {
          _id: 0,
          SeriviceStartDate:1,
          RoundedTotal: 1,
          balanceDue: 1,
          Trasaction: 1,
          additionalCharges:1,
          freezeDaysRefund:1,
        },
      }
    ).toArray();



    return res.status(200).json({
      ClientId: clientId.trim(),
      TotalInvoices: invoices.length,
CompliteClientTransactionInfo:invoices
     
    });

  } catch (error: unknown) {
    console.error("Failed to retrieve invoice summary:", error);

    return res.status(500).json({
      Message: "Internal Server Error",
    });
  }
}
