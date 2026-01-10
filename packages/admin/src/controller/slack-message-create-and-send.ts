"use server"

import { unstable_getHeaders } from "waku/server"
import type z from "zod"
import { verifySession } from "../libs/better-auth/server.js"
import { createSlackMessage } from "./internal/create-slack-message.js"
import { CreateAndSendSlackMessageSchema } from "./slack-message-create-and-send-schema.js"

export const createAndSendSlackMessageController = async (
  raw: z.infer<typeof CreateAndSendSlackMessageSchema>,
) => {
  await verifySession(unstable_getHeaders())

  const input = CreateAndSendSlackMessageSchema.parse(raw)

  await createSlackMessage({
    message: input.message,
    addMention: input.addMention,
    scheduledAt: input.scheduledAt,
    target:
      0 < input.sponsorIds.length
        ? {
            type: "Sponsor",
            sponsorIds: input.sponsorIds,
          }
        : {
            type: "Label",
            labelIds: input.labelIds,
          },
  })
}
