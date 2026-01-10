import { db } from "broadcaster-db/db.js"
import type { Sponsor } from "../../domain/model/Sponsor.js"

export const getSponsorsByLabels = async (
  labelIds: string[],
): Promise<Sponsor[]> => {
  const rows = await db.query.sponsor.findMany({
    where: {
      labels: {
        id: {
          in: labelIds,
        },
      },
    },
    with: {
      labels: {
        orderBy: (label, { asc }) => [asc(label.order)],
      },
      slackUsers: true,
    },
  })

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    readableId: row.readableId,
    slackChannelId: row.slackChannelId ?? undefined,
    slackUsers: row.slackUsers.map((user) => user.slackUserId),
    labels: row.labels,
  }))
}
