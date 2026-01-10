import { db } from "broadcaster-db/db.js"
import { messageTable } from "broadcaster-db/schema.js"
import { eq } from "drizzle-orm"

export const updateMessageSentAt = async (id: string) => {
  await db
    .update(messageTable)
    .set({ sentAt: new Date() })
    .where(eq(messageTable.id, id))
}
