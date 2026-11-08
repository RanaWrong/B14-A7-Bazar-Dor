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

// No fallback secret: a value committed to this public repository would let anyone forge sessions.
// better-auth also refuses to start without BETTER_AUTH_SECRET; this check makes the reason explicit.
const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
if (betterAuthSecret && /^your-|changeme|example/i.test(betterAuthSecret)) {
  throw new Error("BETTER_AUTH_SECRET is a placeholder. Generate one: openssl rand -base64 48");
}
if (
  !betterAuthSecret &&
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE !== "phase-production-build"
) {
  throw new Error("BETTER_AUTH_SECRET is required in production.");
}

export const auth = betterAuth({
  secret: betterAuthSecret,
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
