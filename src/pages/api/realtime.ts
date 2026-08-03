import type { NextApiRequest, NextApiResponse } from "next";
import { subscribe } from "@/Lib/ChangeWatcher";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  // Initial connection message
  res.write(
    `data: ${JSON.stringify({
      type: "connected",
    })}\n\n`
  );

  // Keep the connection alive
  const heartbeat = setInterval(() => {
    res.write(
      `data: ${JSON.stringify({
        type: "heartbeat",
      })}\n\n`
    );
  }, 20000);

  // Listen for MongoDB changes
  const unsubscribe = subscribe((data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
    res.end();

    console.log("🔴 SSE Client Disconnected");
  });
}