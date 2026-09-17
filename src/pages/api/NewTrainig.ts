import { InsertNewTraining } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try{
if(req.method!=="POST"){
    return res.status(405).json({
           success: false,
        error: "Method not allowed",
    })

   
}
   const newMaterial =
      req.body?.feedback;

    if (!newMaterial) {
      return res.status(400).json({
        success: false,
        error: "Feedback is required",
      });
    }


    const result:any =await InsertNewTraining(newMaterial);
    
        if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
    
     
    }catch(err:any){
  console.error("InsertNewTraining API Error:", err);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: err?.message || "Something went wrong",
    });
    }
}