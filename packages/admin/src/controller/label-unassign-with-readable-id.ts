import { deleteSponsorLabels } from "../infrastructure/db/delete-sponsor-label.js"
import { getLabelByName } from "../infrastructure/db/get-label-by-name.js"
import { getSponsorByReadableId } from "../infrastructure/db/get-sponsor-by-readbale-id.js"

export const unassignLabelWithReadableIdController = async (input: {
  readableId: string
  label: string
}) => {
  const sponsor = await getSponsorByReadableId(input.readableId)
  const label = await getLabelByName(input.label)

  if (sponsor == null || label == null) {
    return false
  }

  await deleteSponsorLabels(sponsor.id, label.id)
  return true
}
