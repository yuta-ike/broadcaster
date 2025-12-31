import { db } from "broadcaster-db/db.js"

export const listLabels = async () => {
  const rows = await db.query.label.findMany({
    orderBy: (label, { asc }) => [asc(label.order)],
  })

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    color: row.color,
  }))
}
