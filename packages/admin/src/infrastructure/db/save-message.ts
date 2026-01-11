import { db } from "broadcaster-db/db.js"
import {
  messageLabelTable,
  messageSponsorTable,
  messageTable,
} from "broadcaster-db/schema.js"
import type {
  MessageTemplate,
  MessageTemplateWithDetail,
} from "../../domain/model/Message.js"
import { parseMessageRow } from "./helper/message.js"

export const saveMessage = async (
  message: MessageTemplate,
): Promise<MessageTemplateWithDetail> => {
  return await db.transaction(async (tx) => {
    const rows = await tx
      .insert(messageTable)
      .values({
        message: message.message,
        addMention: message.addMention,
        scheduledAt:
          message.scheduledAt === "Immediate" ? null : message.scheduledAt,
        sendImmediately: message.scheduledAt === "Immediate",
        sentAt: null,
      })
      .returning()
    const messageId = rows[0]!.id

    if (message.target.type === "Sponsor") {
      await tx.insert(messageSponsorTable).values(
        message.target.sponsorIds.map((sponsorId) => ({
          messageId,
          sponsorId,
        })),
      )
    } else {
      await tx.insert(messageLabelTable).values(
        message.target.labelIds.map((labelId) => ({
          messageId,
          labelId,
        })),
      )
    }

    // Query
    const created = await db.query.message.findFirst({
      where: {
        scheduledAt: {
          lte: new Date(),
        },
        sendImmediately: false,
        sentAt: {
          isNull: true,
        },
      },
      with: {
        targetLabels: {
          orderBy: (label, { asc }) => [asc(label.order)],
        },
        targetSponsors: {
          with: {
            slackUsers: true,
            labels: {
              orderBy: (label, { asc }) => [asc(label.order)],
            },
          },
        },
      },
    })
    return parseMessageRow(created!)
  })
}
