import type { MessageTemplateWithDetail } from "../../domain/model/Message.js"
import { LabelCollection, MessageCollection, mongoDb, SponsorCollection } from "../../libs/db.js"
import type { Label, Sponsor } from "../../domain/model/Sponsor.js"

export const listMessages = async (): Promise<MessageTemplateWithDetail[]> => {
  const rows = await mongoDb
    .collection<MessageCollection>(MessageCollection.name)
    .find()
    .sort({
      createdAt: "desc",
    })
    .toArray()

  const sponsorIds = rows.flatMap((row) =>
    row.target.type === "Sponsor" ? row.target.sponsorIds : [],
  )

  const [sponsorsRows, labelsRows] = await Promise.all([
    mongoDb
      .collection<SponsorCollection>(SponsorCollection.name)
      .find({
        _id: {
          $in: sponsorIds,
        },
      })
      .toArray(),
    mongoDb.collection<LabelCollection>(LabelCollection.name).find().toArray(),
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
        slackChannel:
          row.slackChannel == null
            ? undefined
            : {
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
    sentAt: row.sentAt == null ? null : new Date(row.sentAt),
    sendStatus: row.sendStatus,
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
    createdAt: new Date(row.createdAt),
  }))
}
