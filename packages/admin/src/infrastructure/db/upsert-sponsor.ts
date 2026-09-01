import type { SlackChannel } from "../../domain/model/SlackChannel"
import { mongoDb, SponsorCollection } from "../../libs/db"
import { getLabelsByNames } from "./get-label-by-name"

export const upsertSponsor = async (
  sponsorId: string,
  sponsor: {
    name: string
    readableId: string
    slackChannel: SlackChannel
    slackUserIds: string[]
    labels: string[]
  },
) => {
  const labels = await getLabelsByNames(sponsor.labels)
  const labelMap = new Map(labels.map((label) => [label.label, label]))

  await mongoDb.collection<SponsorCollection>(SponsorCollection.name).updateOne(
    {
      _id: sponsorId,
    },
    {
      $set: {
        name: sponsor.name,
        readableId: sponsor.readableId,
        slackChannel: {
          id: sponsor.slackChannel.id,
          name: sponsor.slackChannel.name,
          kind: sponsor.slackChannel.kind,
          isExtShared: sponsor.slackChannel.isExtShared,
        },
        slackUserIds: sponsor.slackUserIds,
        labelIds: sponsor.labels
          .map((labelName) => {
            const label = labelMap.get(labelName)
            if (label == null) {
              console.warn("Label not found", label)
            }
            return label?.id
          })
          .filter((label) => label != null),
      },
    },
    {
      upsert: true,
    },
  )
}
