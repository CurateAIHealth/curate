import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const abhaNumber = searchParams.get("abhaNumber");

  if (!abhaNumber) {
    return NextResponse.json(
      { error: "Missing ABHA Number" },
      { status: 400 }
    );
  }

  try {

    const tokenResponse = await axios.post(
      "https://healthidsbx.abdm.gov.in/api/v1/auth/token",
      {
        clientId: 'SBXID_010773',
        clientSecret: 'b9ff1d0e-53d8-4219-b7e0-7d111bd555c4',
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const accessToken = tokenResponse.data?.accessToken;
    if (!accessToken) {
      throw new Error("Failed to retrieve access token from ABHA API");
    }

    const abhaResponse = await axios.get(
      `https://healthidsbx.abdm.gov.in/api/v1/account/profile/${abhaNumber}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

   
    return NextResponse.json(abhaResponse.data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching ABHA user:", error.response?.data || error);
    return NextResponse.json(
      { error: "Failed to fetch ABHA user details" },
      { status: 500 }
    );
  }
}
