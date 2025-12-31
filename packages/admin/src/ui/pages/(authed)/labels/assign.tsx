import { unstable_redirect } from "waku/router/server"
import { listLabelsController } from "../../../../controller/label-list.js"
import { listSponsorsController } from "../../../../controller/sponsor-list.js"
import { promiseAllMap } from "../../../../utils/promise-all.js"
import { PageSection } from "../../../components/page-section.js"
import { LabelAssignForm } from "../../../views/label-assign.js"

const Page = async () => {
  const { sponsors, labels } = await promiseAllMap({
    sponsors: listSponsorsController(),
    labels: listLabelsController(),
  })
  return (
    <>
      <title>ラベル付与</title>
      <PageSection title="ラベル付与">
        <LabelAssignForm
          sponsors={sponsors}
          labels={labels}
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
