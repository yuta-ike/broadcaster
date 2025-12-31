import { getSponsors } from "../infrastructure/db/get-sponsors.js"

export const getSponsorController = async (sponsorId: string) => {
  const result = await getSponsors([sponsorId])
  if (result.length === 0) {
    throw new Error("Sponsor not found")
  }

  return result[0]!
}
