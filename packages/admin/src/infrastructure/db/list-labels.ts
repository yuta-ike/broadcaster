import { LabelCollection, mongoDb } from "../../libs/db"
import type { Label } from "../../domain/model/Sponsor"

export const listLabels2 = async (): Promise<Label[]> => {
  const labels = await mongoDb
    .collection<LabelCollection>(LabelCollection.name)
    .find({})
    .sort({ order: "asc" })
    .map((doc) => ({
      id: doc._id,
      label: doc.label,
      color: doc.color,
    }))
    .toArray()

  return labels
}
