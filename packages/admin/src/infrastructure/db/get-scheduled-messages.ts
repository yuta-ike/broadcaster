import { db } from "broadcaster-db/db.js"
import type { MessageTemplateWithDetail } from "../../domain/model/Message.js"
import { parseMessageRow } from "./helper/message.js"

export const getScheduledMessages = async (): Promise<
  MessageTemplateWithDetail[]
> => {
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

  return rows.map(parseMessageRow)
}
