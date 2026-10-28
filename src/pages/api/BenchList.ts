import { GetBenchList } from "@/Lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try{
if(req.method!=="GET"){
    return res.status(405).json({message:'Methode Not Allowed'})
}


const getBechData=await GetBenchList()

return res.status(200).json({getBechData})
    }catch(err:any){

    }

}