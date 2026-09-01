import type { Sponsor } from "../../domain/model/Sponsor.js"
import { mongoDb, SponsorCollection } from "../../libs/db.js"
import { getLabels } from "./get-labels.js"

export const getSponsorsByLabels = async (targetLabelIds: string[]): Promise<Sponsor[]> => {
  const docs = await mongoDb
    .collection<SponsorCollection>(SponsorCollection.name)
    .find({
      labelIds: {
        $in: targetLabelIds,
      },
    })
    .toArray()

  const labelIds = docs.flatMap((doc) => doc.labelIds)
  const labels = await getLabels(labelIds)
  const labelMap = new Map(labels.map((doc) => [doc.id, doc]))

  return docs.map((doc) => {
    return {
      id: doc._id,
      name: doc.name,
      readableId: doc.readableId,
      slackChannel:
        doc.slackChannel == null
          ? undefined
          : {
              id: doc.slackChannel.id,
              name: doc.slackChannel.name,
              kind: doc.slackChannel.kind,
              isExtShared: doc.slackChannel.isExtShared,
            },
      slackUsers: [],
      labels: doc.labelIds
        .map((labelId) => {
          const label = labelMap.get(labelId)
          if (label == null) {
            console.warn("Label not found", labelId)
          }
          return label
        })
        .filter((label) => label != null),
    }
  })
}
