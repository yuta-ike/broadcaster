import { db } from "broadcaster-db/db.js"
import type { Sponsor } from "../../domain/model/Sponsor.js"

export const getSponsors = async (sponsorIds: string[]): Promise<Sponsor[]> => {
  const rows = await db.query.sponsor.findMany({
    where: {
      id: { in: sponsorIds },
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
