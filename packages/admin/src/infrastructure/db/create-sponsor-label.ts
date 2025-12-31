import { db } from "broadcaster-db/db.js"
import { sponsorLabelTable } from "broadcaster-db/schema.js"

export const createSponsorLabels = async (
  sponsorIds: string[],
  labelIds: string[],
) => {
  await db
    .insert(sponsorLabelTable)
    .values(
      sponsorIds.flatMap((sponsorId) =>
        labelIds.map((labelId) => ({
          sponsorId,
          labelId,
        })),
      ),
    )
    .onConflictDoNothing()
}
