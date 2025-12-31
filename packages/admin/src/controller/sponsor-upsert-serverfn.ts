"use server"

import { unstable_getHeaders } from "waku/server"
import type z from "zod"
import { verifySession } from "../libs/better-auth/server.js"
import { upsertSponsorController } from "./sponsor-upsert.js"
import type { SponsorUpsertFormSchema } from "./sponsor-upsert-schema.js"

export const upsertSponsorControllerFn = async (
  rawId: string | null,
  raw: z.infer<typeof SponsorUpsertFormSchema>,
) => {
  await verifySession(unstable_getHeaders())
  return upsertSponsorController(rawId, raw)
}
