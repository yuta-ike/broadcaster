import { listSponsors } from "../infrastructure/db/list-sponsor.js"

export const listSponsorsController = async () => {
  const sponsors = await listSponsors()
  return sponsors
}
