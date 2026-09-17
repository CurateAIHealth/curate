import { DeleteTraing } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try{

        const {DeleteInformation}=req.body
if(req.method!=="POST"){

    return res.status(405).json({Message:"Method Not Allowed"})

}
if (!DeleteInformation){
return res.status(400).json({Message:"Missing Delete Information"})
}


const DeleteTraingResults= await DeleteTraing(DeleteInformation)
res.status(200).json(DeleteTraingResults)
    }catch(err:any){

    }
}