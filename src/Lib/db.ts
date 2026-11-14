
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local or set MONGODB_URI");
}

client = new MongoClient(uri);

if (!global._mongoClientPromise) {
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;