import { db } from "broadcaster-db/db.js"
import type { MessageTemplateWithDetail } from "../../domain/model/Message.js"

export const listMessages = async (): Promise<MessageTemplateWithDetail[]> => {
  const rows = await db.query.message.findMany({
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
    orderBy: (message, { desc }) => [desc(message.createdAt)],
  })

  return rows.map(
    (row) =>
      ({
        id: row.id,
        message: row.message,
        addMention: row.addMention,
        scheduledAt: row.scheduledAt ?? "Immediate",
        createdAt: row.createdAt,
        sentAt: row.sentAt,
        target:
          0 < row.targetLabels.length
            ? {
                type: "Label",
                labels: row.targetLabels.map((label) => ({
                  id: label.id,
                  label: label.label,
                  color: label.color,
                })),
              }
            : {
                type: "Sponsor",
                sponsors: row.targetSponsors.map((sponsor) => ({
                  id: sponsor.id,
                  name: sponsor.name,
                  readableId: sponsor.readableId,
                  slackChannelId: sponsor.slackChannelId ?? undefined,
                  slackUsers: sponsor.slackUsers.map(
                    (user) => user.slackUserId,
                  ),
                  labels: sponsor.labels,
                })),
              },
      }) satisfies MessageTemplateWithDetail,
  )
}
