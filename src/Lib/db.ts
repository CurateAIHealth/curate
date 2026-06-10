import dns from "dns";
import { MongoClient } from "mongodb";

// Force Google DNS for SRV lookups (MongoDB Atlas)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = process.env.MONGODB_URI!;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);

    global._mongoClientPromise = client.connect().catch((err) => {
      console.error("MongoDB Connection Failed:", err);

      // Allow reconnect attempt on next request
      global._mongoClientPromise = undefined;

      throw err;
    });
  }

  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);

  clientPromise = client.connect().catch((err) => {
    console.error("MongoDB Connection Failed:", err);
    throw err;
  });
}

export default clientPromise;