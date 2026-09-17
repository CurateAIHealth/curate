
import { GetTrainings } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try{
if(req.method!=="GET"){
    return res.status(405).json({
           success: false,
        error: "Method not allowed",
    })

   
}



    const result:any =await GetTrainings();
    
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