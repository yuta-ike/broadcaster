import { db } from "broadcaster-db/db.js"
import {
  labelTable,
  sponsorLabelTable,
  sponsorSlackUserTable,
  sponsorTable,
} from "broadcaster-db/schema.js"
import { eq } from "drizzle-orm"

export const upsertSponsor = async (
  sponsorId: string,
  sponsor: {
    name: string
    readableId: string
    slackChannelId: string
    slackUserIds: string[]
    labels: string[]
  },
) => {
  await db.transaction(async (tx) => {
    // sponsors
    const result = await tx
      .insert(sponsorTable)
      .values({
        id: sponsorId,
        name: sponsor.name,
        readableId: sponsor.readableId,
        slackChannelId: sponsor.slackChannelId,
      })
      .onConflictDoUpdate({
        set: {
          name: sponsor.name,
          readableId: sponsor.readableId,
          slackChannelId: sponsor.slackChannelId,
        },
        target: sponsorTable.id,
      })
      .returning({ id: sponsorTable.id })

    const insertedId = result[0]?.id
    if (insertedId == null) {
      throw new Error("Failed to insert or find sponsor")
    }

    // sponsor_slack_users
    if (sponsorId != null) {
      await tx
        .delete(sponsorSlackUserTable)
        .where(eq(sponsorSlackUserTable.sponsorId, sponsorId))
    }
    if (0 < sponsor.slackUserIds.length) {
      await tx.insert(sponsorSlackUserTable).values(
        sponsor.slackUserIds.map((slackUserId) => ({
          slackUserId,
          sponsorId: insertedId,
        })),
      )
    }

    // labels
    if (0 < sponsor.labels.length) {
      const maxOrderPlan = await tx.query.label.findFirst({
        orderBy: (label, { desc }) => [desc(label.order)],
      })

      await tx
        .insert(labelTable)
        .values(
          sponsor.labels.map((label, i) => ({
            id: crypto.randomUUID(),
            label,
            color: "#cccccc",
            order: maxOrderPlan == null ? 0 : maxOrderPlan.order + 1 + i,
          })),
        )
        .onConflictDoNothing({
          target: labelTable.label,
        })
    }

    // sponsor_label (delete)
    if (sponsorId != null) {
      await tx
        .delete(sponsorLabelTable)
        .where(eq(sponsorLabelTable.sponsorId, sponsorId))
    }

    if (0 < sponsor.labels.length) {
      // label
      const newLabels = await tx.query.label.findMany({
        where: {
          label: {
            in: sponsor.labels,
          },
        },
      })
      // sponsor_label (insert)
      await tx
        .insert(sponsorLabelTable)
        .values(
          newLabels.map((label) => ({
            labelId: label.id,
            sponsorId: insertedId,
          })),
        )
        .onConflictDoNothing()
    }

    return
  })
}
