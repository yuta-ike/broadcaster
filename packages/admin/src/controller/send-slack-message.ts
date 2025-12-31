"use server"

import { unstable_getHeaders } from "waku/server"
import type z from "zod"
import { resolveMessageTemplate } from "../domain/model/Message.js"
import { getSponsorRelatedVariablesForTemplate } from "../domain/model/Sponsor.js"
import { getSponsors } from "../infrastructure/db/get-sponsors.js"
import { verifySession } from "../libs/better-auth/server.js"
import { slackSdk } from "../libs/slack-sdk.js"
import { SendSlackMessageSchema } from "./send-slack-message-schema.js"

export const sendSlackMessageController = async (
  raw: z.infer<typeof SendSlackMessageSchema>,
) => {
  await verifySession(unstable_getHeaders())

  const input = SendSlackMessageSchema.parse(raw)

  const sponsors = await getSponsors(input.sponsorIds)

  const messageItems = sponsors.flatMap((sponsor) => {
    if (sponsor.slackChannelId == null) {
      return []
    }

    const variables = getSponsorRelatedVariablesForTemplate(sponsor)

    // addMentionがtrueの場合、担当者のメンションを含める
    const baseMessage = input.addMention
      ? `{{SPONSOR_MENTIONS}}\n${input.message}`
      : input.message

    return {
      channel: sponsor.slackChannelId,
      text: resolveMessageTemplate(baseMessage, variables),
    }
  })

  await slackSdk.bulkPostMessage(messageItems)
}
