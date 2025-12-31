import { db } from "broadcaster-db/db.js"

export const getLabelByName = async (label: string) => {
  const row = await db.query.label.findFirst({
    where: {
      label,
    },
  })

  if (row == null) {
    return null
  }

  return {
    id: row.id,
    label: row.label,
    color: row.color,
  }
}
