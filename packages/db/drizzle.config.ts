import { defineConfig } from "drizzle-kit"

const POSTGRES_URL = process.env.POSTGRES_URL
if (POSTGRES_URL == null) {
  throw new Error("POSTGRES_URL is not defined")
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: POSTGRES_URL,
  },
})
