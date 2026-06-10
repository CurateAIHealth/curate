
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://admin:KLWwnX3yKGrnPn4W@cluster0.pbueca9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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