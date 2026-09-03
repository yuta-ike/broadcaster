import type { MessageTemplate, MessageTemplateWithDetail } from "../../domain/model/Message.js"
import { MessageCollection, mongoDb } from "../../libs/db.js"
import { randomUUID } from "node:crypto"
import { getSponsors } from "./get-sponsors.js"
import { getLabels } from "./get-labels.js"

export const saveMessage = async (message: MessageTemplate): Promise<MessageTemplateWithDetail> => {
  const id = randomUUID()
  const now = new Date()
  const scheduledAt = message.scheduledAt === "Immediate" ? now : message.scheduledAt

  await mongoDb.collection<MessageCollection>(MessageCollection.name).insertOne({
    _id: id,
    message: message.message,
    addMention: message.addMention,
    scheduledAt: scheduledAt.toISOString(),
    sentAt: null,
    sendStatus: "pending",
    target: message.target,
    createdAt: now.toISOString(),
  })

  const target =
    message.target.type === "Sponsor"
      ? {
          type: "Sponsor" as const,
          sponsors: await getSponsors(message.target.sponsorIds),
        }
      : {
          type: "Label" as const,
          labels: await getLabels(message.target.labelIds),
        }

  return {
    id,
    message: message.message,
    addMention: message.addMention,
    scheduledAt,
    sentAt: null,
    sendStatus: "pending",
    target,
    createdAt: now,
  }
}
