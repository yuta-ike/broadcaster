import { db } from "broadcaster-db/db.js"

export const getLabels = async (labelIds: string[]) => {
  const rows = await db.query.label.findMany({
    where: {
      id: {
        in: labelIds,
      },
    },
  })

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    color: row.color,
  }))
}
