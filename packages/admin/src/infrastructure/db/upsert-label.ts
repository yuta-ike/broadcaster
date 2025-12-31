import { db } from "broadcaster-db/db.js"
import { labelTable } from "broadcaster-db/schema.js"

export const upsertLabel = async (
  id: string,
  data: { label: string; color: string },
) => {
  const maxOrderPlan = await db.query.label.findFirst({
    orderBy: (label, { desc }) => [desc(label.order)],
  })

  await db
    .insert(labelTable)
    .values({
      id,
      label: data.label,
      color: data.color,
      order: maxOrderPlan ? maxOrderPlan.order + 1 : 0,
    })
    .onConflictDoUpdate({
      set: {
        label: data.label,
        color: data.color,
      },
      target: labelTable.id,
    })
}
