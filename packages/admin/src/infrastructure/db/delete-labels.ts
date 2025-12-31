import { db } from "broadcaster-db/db.js"
import { labelTable } from "broadcaster-db/schema.js"
import { inArray } from "drizzle-orm"

export const deleteLabels = async (labelIds: string[]) => {
  await db.delete(labelTable).where(inArray(labelTable.id, labelIds))
}
