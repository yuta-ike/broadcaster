import { db } from "broadcaster-db/db.js"
import { sponsorLabelTable } from "broadcaster-db/schema.js"
import { and, eq } from "drizzle-orm"

export const deleteSponsorLabels = async (
  sponsorId: string,
  labelId: string,
) => {
  await db
    .delete(sponsorLabelTable)
    .where(
      and(
        eq(sponsorLabelTable.sponsorId, sponsorId),
        eq(sponsorLabelTable.labelId, labelId),
      ),
    )
}
