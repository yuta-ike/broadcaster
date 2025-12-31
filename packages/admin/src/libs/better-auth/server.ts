import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "broadcaster-db/db.js"
import {
  accountTable,
  sessionTable,
  userTable,
  verificationTable,
} from "broadcaster-db/schema.js"
import { z } from "zod"
import { urls } from "../vercel.js"
import { verifiedPlugin } from "./verified-plugin.js"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

if (GOOGLE_CLIENT_ID == null || GOOGLE_CLIENT_SECRET == null) {
  throw new Error(
    "Google OAuth credentials are not set in environment variables.",
  )
}

const WHITELIST_ACCOUNT_DOMAINS = z
  .array(
    z.string().refine((domain) => /[a-zA-Z0-9]+\.[a-zA-Z]{2,}/.test(domain), {
      message: "Invalid domain format",
    }),
  )
  .parse(process.env.WHITELIST_ACCOUNT_DOMAINS?.split(","))

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      verification: verificationTable,
      account: accountTable,
      session: sessionTable,
      user: userTable,
    },
  }),
  baseURL: urls.baseUrl,
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectURI: new URL(
        "/api/auth/callback/google",
        urls.productionUrl,
      ).toString(),
    },
  },
  plugins: [
    verifiedPlugin({
      whitelistDomains: WHITELIST_ACCOUNT_DOMAINS,
    }),
  ],
})

export const getSession = async (headers: Record<string, string>) =>
  await auth.api.getSession({
    headers: new Headers(headers),
  })

export const verifySession = async (headers: Record<string, string>) => {
  const session = await getSession(headers)
  if (session == null) {
    throw new Error("Unauthorized")
  }
}
