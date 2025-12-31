"use server"

import { unstable_getHeaders } from "waku/server"
import { verifySession } from "../libs/better-auth/server.js"
import { slackSdk } from "../libs/slack-sdk.js"
import { MessageRefSchema } from "./message-get-schema.js"

export const getMessageController = async (raw: MessageRefSchema) => {
  await verifySession(unstable_getHeaders())

  const input = MessageRefSchema.parse(raw)
  try {
    const message = await slackSdk.getMessage({
      channel: input.channel,
      timestamp: input.timestamp,
    })
    return message?.text
  } catch (e) {
    console.error(e)
  }
}
