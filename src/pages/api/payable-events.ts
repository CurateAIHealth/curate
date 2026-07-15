import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/Lib/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("CurateInformation");

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Initial handshake
  res.write("data: connected\n\n");

  const changeStream = db
    .collection("PayableINPaymentPage")
    .watch([], { fullDocument: "updateLookup" });

  changeStream.on("change", (change) => {
    console.log("Mongo Changed:", change.operationType);

    res.write(
      `data: ${JSON.stringify({
        type: change.operationType,
        refresh: true,
      })}\n\n`
    );
  });

  req.on("close", async () => {
    console.log("SSE Closed");
    await changeStream.close();
    res.end();
  });
}