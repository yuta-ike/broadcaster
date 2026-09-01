import type { Sponsor } from "../../domain/model/Sponsor"
import { mongoDb, SponsorCollection } from "../../libs/db"
import { getLabels } from "./get-labels"

export const getSponsorByReadableId = async (readableId: string): Promise<Sponsor> => {
  const doc = await mongoDb.collection<SponsorCollection>(SponsorCollection.name).findOne({
    readableId,
  })

  if (doc == null) {
    throw new Error("Sponsor not found")
  }

  const labels = await getLabels(doc?.labelIds)
  const labelMap = new Map(labels.map((doc) => [doc.id, doc]))

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
}
