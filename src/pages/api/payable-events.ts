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
  let closed = false;
  let heartbeat: NodeJS.Timeout | null = null;
  let changeStream: any = null;

  try {
    const client = await clientPromise;
    const db = client.db("CurateInformation");

    // SSE Headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    });

    if ((res as any).flushHeaders) {
      (res as any).flushHeaders();
    }

    const send = (payload: unknown) => {
      if (closed || res.writableEnded || res.destroyed) return;

      try {
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      } catch (err) {
        console.error("SSE Write Error:", err);
      }
    };

    // Initial Connection
    send({
      status: "connected",
      database: "CurateInformation",
      time: new Date().toISOString(),
    });

    // Keep the SSE connection alive
    heartbeat = setInterval(() => {
      if (!closed && !res.writableEnded && !res.destroyed) {
        res.write(": heartbeat\n\n");
      }
    }, 25000);

    /**
     * Watch the ENTIRE DATABASE
     * Every collection will trigger an event.
     */
    changeStream = db.watch([], {
      fullDocument: "updateLookup",
    });

    changeStream.on("change", (change: any) => {
      send({
        refresh: true,
        database: change.ns?.db,
        collection: change.ns?.coll,
        operation: change.operationType,
        id: change.documentKey?._id ?? null,
        clusterTime: change.clusterTime ?? null,
        time: new Date().toISOString(),
      });
    });

    changeStream.on("error", async (err: Error) => {
      console.error("Mongo Change Stream Error:", err);

      send({
        error: true,
        message: "Change stream error",
      });

      await cleanup();
    });

    changeStream.on("close", async () => {
      console.log("Change stream closed.");
      await cleanup();
    });

    req.on("close", async () => {
      console.log("Client disconnected.");
      await cleanup();
    });

    async function cleanup() {
      if (closed) return;

      closed = true;

      if (heartbeat) {
        clearInterval(heartbeat);
        heartbeat = null;
      }

      try {
        if (changeStream) {
          await changeStream.close();
        }
      } catch (err) {
        console.error("Error closing Change Stream:", err);
      }

      if (!res.writableEnded) {
        res.end();
      }
    }
  } catch (err) {
    console.error("SSE Initialization Error:", err);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to establish SSE connection.",
      });
    }

    if (!res.writableEnded) {
      res.end();
    }
  }
}