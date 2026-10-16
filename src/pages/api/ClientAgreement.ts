import { getClientagreementfromDb } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { ImpClient } = req.body 
   
console.log(
'Check',ImpClient
)
    if (!ImpClient) {
      return res.status(400).json({
        success: false,
        message: "Client Information Required",
      });
    }

    const agreementDocuments = await getClientagreementfromDb(ImpClient);

    return res.status(200).json({
      success: true,
      data: agreementDocuments,
    });
  } catch (error) {
    console.error("Client agreement fetch failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch client agreement at this time.",
    });
  }
}