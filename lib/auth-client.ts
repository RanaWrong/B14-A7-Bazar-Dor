import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || "https://b14-a7-bazar-dor-blond.vercel.app",
});

export const { signIn, signUp, signOut, useSession } = authClient;
