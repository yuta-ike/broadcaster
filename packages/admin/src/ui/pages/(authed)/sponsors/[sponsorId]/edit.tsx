import type { PageProps } from "waku/router"
import { unstable_notFound, unstable_redirect } from "waku/router/server"
import { listLabelsController } from "../../../../../controller/label-list.js"
import { getSponsorController } from "../../../../../controller/sponsor-get.js"
import { promiseAllMap } from "../../../../../utils/promise-all.js"
import { PageSection } from "../../../../components/page-section.js"
import { SponsorUpsertForm } from "../../../../views/sponsor-upsert.js"

const Page = async ({ sponsorId }: PageProps<"/sponsors/[sponsorId]/edit">) => {
  const { sponsor, labels } = await promiseAllMap({
    sponsor: getSponsorController(sponsorId),
    labels: listLabelsController(),
  })
  if (sponsor == null) {
    unstable_notFound()
  }

  return (
    <>
      <title>{sponsor.name}</title>
      <PageSection title={sponsor.name}>
        <SponsorUpsertForm
          sponsor={sponsor}
          labels={labels}
          initValue={{
            name: sponsor.name,
            readableId: sponsor.readableId,
            slackChannelId: sponsor.slackChannelId ?? "",
            slackUserIds: sponsor.slackUsers,
            labels: sponsor.labels.map((label) => label.label),
          }}
          onComplete={async () => {
            "use server"
            unstable_redirect("/sponsors")
          }}
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
