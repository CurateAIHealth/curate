import { StaffAttendecebyDate } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export  default async function handler (req:NextApiRequest,res:NextApiResponse){
try{
if(req.method!=="POST"){
return res.status(405).json({message:"Methode Not Allowed"})
}

const {selectedDate}=req.body
if(!selectedDate){
    return res.status(405).json({message:"Attendece Date Missing"})
}

const AttendeceResuls= await StaffAttendecebyDate(selectedDate)

return res.status(200).json({AttendeceResuls})
}catch(err:any){

}
}