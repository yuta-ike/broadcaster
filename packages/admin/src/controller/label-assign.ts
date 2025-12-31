"use server"

import { unstable_getHeaders } from "waku/server"
import { createSponsorLabels } from "../infrastructure/db/create-sponsor-label.js"
import { verifySession } from "../libs/better-auth/server.js"
import { LabelAssignSchema } from "./label-assign-schema.js"

export const assignLabelsController = async (raw: LabelAssignSchema) => {
  await verifySession(unstable_getHeaders())

  const input = LabelAssignSchema.parse(raw)

  await createSponsorLabels(input.sponsorIds, input.labelIds)
}
