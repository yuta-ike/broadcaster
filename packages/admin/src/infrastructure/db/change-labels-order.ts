import { db } from "broadcaster-db/db.js"
import { labelTable } from "broadcaster-db/schema.js"
import { inArray, sql } from "drizzle-orm"

export const changeLabelsOrder = async (ids: string[]) => {
  if (0 < ids.length) {
    await db
      .update(labelTable)
      .set({
        order: sql`CASE ${labelTable.id} ${sql.join(
          ids.map((id, index) => sql`WHEN ${id} THEN ${index}::int`),
          sql` `,
        )} END`,
      })
      .where(inArray(labelTable.id, ids))
  }
}
