import { db } from "broadcaster-db/db.js"

export const getSponsorByChannel = async (channel: string) => {
  const row = await db.query.sponsor.findFirst({
    where: {
      slackChannelId: channel,
    },
    with: {
      labels: {
        orderBy: (label, { asc }) => [asc(label.order)],
      },
      slackUsers: true,
    },
  })

  if (row == null) {
    return null
  }

  return {
    id: row.id,
    name: row.name,
    readableId: row.readableId,
    slackChannelId: row.slackChannelId ?? undefined,
    slackUsers: row.slackUsers.map((user) => user.slackUserId),
    labels: row.labels,
  }
}
