"use server"

import { unstable_getHeaders } from "waku/server"
import z from "zod"
import { deleteLabels } from "../infrastructure/db/delete-labels.js"
import { verifySession } from "../libs/better-auth/server.js"

export const deleteLabelController = async (raw: string) => {
  await verifySession(unstable_getHeaders())

  const labelId = z.uuid().parse(raw)

  return await deleteLabels([labelId])
}
