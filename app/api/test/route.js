import { MongoClient } from 'mongodb';

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    return Response.json({ status: "✅ Atlas connection successful!" });
  } catch (e) {
    return Response.json({ error: "❌ Connection failed", details: e.message });
  } finally {
    await client.close();
  }
}