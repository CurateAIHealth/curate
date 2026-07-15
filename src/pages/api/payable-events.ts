import clientPromise from "@/Lib/db";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("CurateInformation");

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const encoder = new TextEncoder();

          const changeStream = db
            .collection("PayableINPaymentPage")
            .watch();

          changeStream.on("change", () => {
            controller.enqueue(
              encoder.encode(`data: refresh\n\n`)
            );
          });

          req.signal.addEventListener("abort", async () => {
            await changeStream.close();
            controller.close();
          });
        } catch (err) {
          console.error("Change Stream Error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}