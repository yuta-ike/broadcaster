import { db } from "broadcaster-db/db.js"
import type { MessageTemplateWithDetail } from "../../domain/model/Message.js"
import { parseMessageRow } from "./helper/message.js"

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

  return rows.map(parseMessageRow)
}
