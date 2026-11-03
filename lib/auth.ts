import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import dns from "node:dns";

// Fix Windows Node.js DNS SRV resolution for MongoDB Atlas
if (process.env.MONGODB_URI?.startsWith("mongodb+srv://")) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {}
}

// Optional MongoDB adapter connection
let dbAdapter: ReturnType<typeof mongodbAdapter> | undefined = undefined;

if (process.env.MONGODB_URI) {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB_NAME || "bazardor");
    dbAdapter = mongodbAdapter(db);
  } catch (error) {
    console.error("Failed to connect to MongoDB for BetterAuth:", error);
  }
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "REMOVED_SECRET",
  baseURL: process.env.BETTER_AUTH_URL || "https://b14-a7-bazar-dor-blond.vercel.app",
  trustedOrigins: [
    "https://b14-a7-bazar-dor-blond.vercel.app",
    "http://localhost:3000",
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
  ],
  ...(dbAdapter ? { database: dbAdapter } : {}),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
});
