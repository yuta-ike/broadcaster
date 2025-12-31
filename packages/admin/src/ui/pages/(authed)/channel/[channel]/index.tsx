import type { PageProps } from "waku/router"
import { unstable_notFound, unstable_redirect } from "waku/router/server"
import { getSponsorByChannelController } from "../../../../../controller/sponsor-get-by-channel.js"

const Page = async ({ channel }: PageProps<"/channel/[channel]">) => {
  const sponsor = await getSponsorByChannelController(channel)

  if (sponsor != null) {
    unstable_redirect(`/sponsors/${sponsor.id}/edit`)
  }

  return unstable_notFound()
}

export default Page

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const
}
