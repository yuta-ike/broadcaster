import type { MessageTemplateWithDetail } from "../../domain/model/Message.js"
import type { Label, Sponsor } from "../../domain/model/Sponsor.js"
import { LabelCollection, MessageCollection, mongoDb, SponsorCollection } from "../../libs/db.js"

export const getScheduledMessages = async (): Promise<MessageTemplateWithDetail[]> => {
  const rows = await mongoDb
    .collection<MessageCollection>(MessageCollection.name)
    .find({
      scheduledAt: {
        $lte: new Date().toISOString(),
      },
      sentAt: null,
    })
    .toArray()

  const sponsorIds = rows.flatMap((row) =>
    row.target.type === "Sponsor" ? row.target.sponsorIds : [],
  )
  const labelIds = rows.flatMap((row) => (row.target.type === "Label" ? row.target.labelIds : []))

  const [sponsorsRows, labelsRows] = await Promise.all([
    mongoDb
      .collection<SponsorCollection>(SponsorCollection.name)
      .find({
        _id: {
          $in: sponsorIds,
        },
      })
      .toArray(),
    mongoDb
      .collection<LabelCollection>(LabelCollection.name)
      .find({
        _id: {
          $in: labelIds,
        },
      })
      .toArray(),
  ] as const)

  // Label
  const labels = labelsRows.map(
    (row) =>
      ({
        id: row._id,
        label: row.label,
        color: row.color,
      }) satisfies Label,
  )
  const labelsMap = new Map(labels.map((label) => [label.id, label]))

  // Sponsor
  const sponsors = sponsorsRows.map(
    (row) =>
      ({
        id: row._id,
        name: row.name,
        readableId: row.readableId,
        slackChannel: {
          id: row.slackChannel.id,
          name: row.slackChannel.name,
          kind: row.slackChannel.kind,
          isExtShared: row.slackChannel.isExtShared,
        },
        slackUsers: row.slackUserIds,
        labels: row.labelIds
          .map((labelId) => labelsMap.get(labelId))
          .filter((label) => label != null),
      }) satisfies Sponsor,
  )
  const sponsorsMap = new Map(sponsors.map((sponsor) => [sponsor.id, sponsor]))

  return rows.map((row) => ({
    id: row._id,
    message: row.message,
    addMention: row.addMention,
    scheduledAt: new Date(row.scheduledAt),
    target:
      row.target.type === "Sponsor"
        ? {
            type: "Sponsor",
            sponsors: row.target.sponsorIds
              .map((sponsorId) => sponsorsMap.get(sponsorId))
              .filter((sponsor) => sponsor != null),
          }
        : {
            type: "Label",
            labels: row.target.labelIds
              .map((labelId) => labelsMap.get(labelId))
              .filter((label) => label != null),
          },
    sentAt: row.sentAt == null ? null : new Date(row.sentAt),
    createdAt: new Date(row.createdAt),
  }))
}
