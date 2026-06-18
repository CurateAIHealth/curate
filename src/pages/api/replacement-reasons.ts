import { GetReasonsInfoInfo } from "@/Lib/user.action";
import { NextResponse } from "next/server";


export async function GET() {
  const data = await GetReasonsInfoInfo();
  return NextResponse.json(data);
}