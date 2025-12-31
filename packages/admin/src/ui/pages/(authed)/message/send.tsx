import { parseSlackPermalink } from "broadcaster-components/utils/slack-parmalink.js"
import type { PageProps } from "waku/router"
import { getMessageController } from "../../../../controller/message-get.js"
import { listLabels } from "../../../../infrastructure/db/list-labels.js"
import { listSponsors } from "../../../../infrastructure/db/list-sponsor.js"
import { promiseAllMap } from "../../../../utils/promise-all.js"
import { PageSection } from "../../../components/page-section.js"
import { SendMessageForm } from "../../../views/message-send.js"

const SLACK_WORKSPACE_DOMAIN = process.env.WAKU_PUBLIC_SLACK_WORKSPACE_DOMAIN
if (SLACK_WORKSPACE_DOMAIN == null) {
  throw new Error("WAKU_PUBLIC_SLACK_WORKSPACE_DOMAIN is not defined")
}

const Page = async ({ query }: PageProps<"/message/send">) => {
  const slackPermalink = new URLSearchParams(query).get("slack") ?? undefined
  const parsed =
    slackPermalink == null
      ? null
      : parseSlackPermalink(
          decodeURIComponent(slackPermalink),
          SLACK_WORKSPACE_DOMAIN,
        )

  const { sponsors, labels, slackMessage } = await promiseAllMap({
    sponsors: listSponsors(),
    labels: listLabels(),
    slackMessage: parsed == null ? null : getMessageController(parsed),
  })

  return (
    <>
      <title>Slack一斉送信</title>
      <PageSection title="Slack一斉送信">
        <SendMessageForm
          sponsors={sponsors}
          labels={labels}
          initMessage={slackMessage ?? undefined}
        />
      </PageSection>
    </>
  )
}

export default Page

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const
}
