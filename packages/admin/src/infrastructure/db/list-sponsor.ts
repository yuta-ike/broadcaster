import { db } from "broadcaster-db/db.js"
import type { Sponsor } from "../../domain/model/Sponsor.js"

export const listSponsors = async (): Promise<Sponsor[]> => {
  const rows = await db.query.sponsor.findMany({
    with: {
      slackUsers: true,
      labels: {
        orderBy: (label, { asc }) => [asc(label.order)],
      },
    },
    orderBy: (sponsor, { asc }) => [asc(sponsor.readableId)],
  })

  return rows.map(
    (row) =>
      ({
        id: row.id,
        name: row.name,
        readableId: row.readableId,
        slackChannelId: row.slackChannelId ?? undefined,
        slackUsers: row.slackUsers.map((user) => user.slackUserId),
        labels: row.labels.map((label) => ({
          id: label.id,
          label: label.label,
          color: label.color,
        })),
      }) satisfies Sponsor,
  )
}
