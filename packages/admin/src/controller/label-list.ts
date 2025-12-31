import { listLabels } from "../infrastructure/db/list-labels.js"

export const listLabelsController = async () => {
  return await listLabels()
}
