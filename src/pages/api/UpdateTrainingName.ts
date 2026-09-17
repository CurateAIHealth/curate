import { UpdateFileName } from "@/Lib/auth";
import { error } from "console";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handlet(req:NextApiRequest,res:NextApiResponse) {

const {ImportedDetails,NewName}=req.body
    try{
if(req.method!=="POST"){
return res.status(405).json({ err: "Method Not Allowed" })
}

if(!ImportedDetails||!NewName){
return res.status(400).json({error:"Missing Imported Details to Edit"})
}

     const result = await UpdateFileName(ImportedDetails,NewName);

     return res.status(200).json({result})
    }catch(err:any){

    }
    
}