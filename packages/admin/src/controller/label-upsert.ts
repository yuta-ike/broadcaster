"use server"

import { unstable_getHeaders } from "waku/server"
import type z from "zod"
import { upsertLabel } from "../infrastructure/db/upsert-label.js"
import { verifySession } from "../libs/better-auth/server.js"
import { LabelUpsertFormSchema } from "./label-upsert-schema.js"

export const upsertLabelController = async (
  labelId: string | null,
  raw: z.infer<typeof LabelUpsertFormSchema>,
) => {
  await verifySession(unstable_getHeaders())

  const input = LabelUpsertFormSchema.parse(raw)

  const id = labelId ?? crypto.randomUUID()

  await upsertLabel(id, {
    label: input.label,
    color: input.color,
  }).catch(console.error)
}
