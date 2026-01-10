import {
  type MessageTemplate,
  resolveMessageTemplate,
} from "../../domain/model/Message.js"
import { getSponsorRelatedVariablesForTemplate } from "../../domain/model/Sponsor.js"
import { getSponsors } from "../../infrastructure/db/get-sponsors.js"
import { getSponsorsByLabels } from "../../infrastructure/db/get-sponsors-by-labels.js"
import { slackSdk } from "../../libs/slack-sdk.js"

export const sendSlackMessage = async (message: MessageTemplate) => {
  const sponsors =
    message.target.type === "Sponsor"
      ? await getSponsors(message.target.sponsorIds)
      : await getSponsorsByLabels(message.target.labelIds)

  const messageItems = sponsors.flatMap((sponsor) => {
    if (sponsor.slackChannelId == null) {
      return []
    }

    const variables = getSponsorRelatedVariablesForTemplate(sponsor)

    // addMentionがtrueの場合、担当者のメンションを含める
    const baseMessage = message.addMention
      ? `{{SPONSOR_MENTIONS}}\n${message.message}`
      : message.message

    return {
      channel: sponsor.slackChannelId,
      text: resolveMessageTemplate(baseMessage, variables),
    }
  })

  await slackSdk.bulkPostMessage(messageItems)
}
