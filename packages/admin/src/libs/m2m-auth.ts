import z from "zod"
import { parseBearer } from "../utils/bearer.js"
import { safeParseJson } from "../utils/json.js"

const M2M_API_TOKENS = process.env.M2M_API_TOKENS
if (M2M_API_TOKENS == null) {
  throw new Error("M2M_API_TOKENS is not set in environment variables.")
}

const result = z
  .record(z.string(), z.string())
  .safeParse(safeParseJson(M2M_API_TOKENS))

if (!result.success) {
  console.error(result)
  throw new Error("M2M_API_TOKENS is not a valid JSON object.")
}

const createM2mAuthClient = (apiKeys: Record<string, string>) => {
  return {
    // NOTE: 一応非同期にしとく
    async verify(headers: Headers) {
      const token = parseBearer(headers)
      if (token == null) {
        console.error("No Bearer token found in headers:", headers)
        throw new Error("Unauthorized")
      }
      const apiKeyEntry = Object.entries(apiKeys).find(
        ([, value]) => value === token,
      )
      if (apiKeyEntry == null) {
        console.error("Invalid API key token:", token)
        throw new Error("Unauthorized")
      }
      const [appName, apiKey] = apiKeyEntry
      return { appName, apiKey }
    },
  }
}

export const m2mAuthClient = createM2mAuthClient(result.data)
