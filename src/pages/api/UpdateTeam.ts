import { UpdateClientTeam } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ err: "Method Not Allowed" })
        }


        const {Month,HCA_Id,Client_Id,team } = req.body;

        if (!Client_Id) {
            return res.status(400).json({ error: "ClientId required" });
        }

        if (!HCA_Id) {
            return res.status(400).json({ error: "HCPId required" });
        }
        if (!Month) {
            return res.status(400).json({ error: "DeployMonth required" });
        }
        if (!team) {
            return res.status(400).json({ error: "TeamValue required" });
        }
        const result = await UpdateClientTeam(Client_Id,
            HCA_Id,
            Month,
            team);



        return res.status(200).json(result);
    } catch (err: any) {
 console.error("TeamUpdated API Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    }
}