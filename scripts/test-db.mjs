import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import dns from "node:dns";

// Fix Windows Node.js DNS SRV resolution issue with MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

// Simple .env reader without extra dependency
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

async function checkMongoDB() {
  console.log("🔍 Checking MongoDB Configuration...\n");
  const env = loadEnv();
  const uri = process.env.MONGODB_URI || env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || env.MONGODB_DB_NAME || "bazardor";

  if (!uri) {
    console.log("❌ MONGODB_URI is not set in .env");
    return;
  }

  if (uri.includes("<username>") || uri.includes("<password>") || uri.includes("xxxxx")) {
    console.log("⚠️ Placeholder URI detected in .env:");
    console.log(`   ${uri}\n`);
    console.log("👉 Please update .env with your actual MongoDB Atlas or local MongoDB connection string.");
    console.log("   Example for Atlas: mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority");
    console.log("   Example for Local: mongodb://127.0.0.1:27017\n");
    return;
  }

  console.log("📡 Attempting connection to MongoDB...");
  console.log(`   Target Database: ${dbName}`);

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    const pingResult = await db.command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    console.log("   Ping response:", pingResult);

    const collections = await db.listCollections().toArray();
    console.log(`   Collections found (${collections.length}):`, collections.map(c => c.name).join(", ") || "(none yet - BetterAuth will auto-create on first sign up)");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  } finally {
    await client.close();
  }
}

checkMongoDB();
