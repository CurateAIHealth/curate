import { GetUsersFullInfoForRepleament } from "@/Lib/user.action";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const data = await GetUsersFullInfoForRepleament();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch HCP info" },
      { status: 500 }
    );
  }
}