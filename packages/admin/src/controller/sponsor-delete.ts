"use server"

import { unstable_getHeaders } from "waku/server"
import z from "zod"
import { deleteSponsors } from "../infrastructure/db/delete-sponsors.js"
import { verifySession } from "../libs/better-auth/server.js"

export const deleteSponsorController = async (raw: string) => {
  await verifySession(unstable_getHeaders())

  const sponsorId = z.uuid().parse(raw)

  return await deleteSponsors([sponsorId])
}
