import { unstable_redirect } from "waku/router/server"
import { listLabelsController } from "../../../../controller/label-list.js"
import { listSlackChannelsController } from "../../../../controller/slack-channels-list.js"
import { PageSection } from "../../../components/page-section.js"
import { SponsorUpsertForm } from "../../../views/sponsor-upsert.js"

const Page = async () => {
  const labels = await listLabelsController()

  return (
    <>
      <title>スポンサー管理</title>
      <PageSection title="スポンサー登録">
        <SponsorUpsertForm
          sponsor={null}
          labels={labels}
          listSlackChannels={listSlackChannelsController}
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
