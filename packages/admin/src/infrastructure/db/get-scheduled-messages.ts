import { db } from "broadcaster-db/db"
import type { MessageTemplate } from "../../domain/model/Message"

export const getScheduledMessages = async (): Promise<MessageTemplate[]> => {
  const rows = await db.query.message.findMany({
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
      targetLabels: true,
      targetSponsors: true,
    },
  })

  return rows.map(
    (row) =>
      ({
        message: row.message,
        addMention: row.addMention,
        scheduledAt: row.scheduledAt ?? "Immediate",
        target:
          0 < row.targetLabels.length
            ? {
                type: "Label",
                labelIds: row.targetLabels.map((tl) => tl.labelId),
              }
            : {
                type: "Sponsor",
                sponsorIds: row.targetSponsors.map((ts) => ts.sponsorId),
              },
      }) satisfies MessageTemplate,
  )
}
