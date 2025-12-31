"use server"

import { unstable_getHeaders } from "waku/server"
import z from "zod"
import { changeLabelsOrder } from "../infrastructure/db/change-labels-order.js"
import { verifySession } from "../libs/better-auth/server.js"

export const changeLabelsOrderController = async (rawIds: string[]) => {
  await verifySession(unstable_getHeaders())

  const ids = z.array(z.uuid()).parse(rawIds)
  try {
    await changeLabelsOrder(ids)
  } catch (e) {
    console.error("Failed to change labels order:", e)
    throw e
  }
}
