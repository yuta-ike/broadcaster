import { getSponsorByChannel } from "../infrastructure/db/get-sponsor-by-channel.js"

export const getSponsorByChannelController = async (channel: string) => {
  const sponsor = await getSponsorByChannel(channel)
  return sponsor
}
