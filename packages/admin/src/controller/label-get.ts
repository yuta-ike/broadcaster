import { getLabels } from "../infrastructure/db/get-labels.js"

export const getLabelController = async (labelId: string) => {
  const labels = await getLabels([labelId])

  if (labels.length === 0) {
    throw new Error("Label not found")
  }

  return labels[0]!
}
