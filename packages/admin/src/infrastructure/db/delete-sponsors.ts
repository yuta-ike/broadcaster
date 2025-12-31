import { db } from "broadcaster-db/db.js"
import { sponsorTable } from "broadcaster-db/schema.js"
import { inArray } from "drizzle-orm"

export const deleteSponsors = async (sponsorIds: string[]) => {
  await db.delete(sponsorTable).where(inArray(sponsorTable.id, sponsorIds))
}
