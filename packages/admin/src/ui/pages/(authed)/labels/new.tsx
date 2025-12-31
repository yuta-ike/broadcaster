import { unstable_redirect } from "waku/router/server"
import { PageSection } from "../../../components/page-section.js"
import { LabelUpsertForm } from "../../../views/label-upsert.js"

const Page = async () => {
  return (
    <>
      <title>ラベル追加</title>
      <PageSection title="ラベル追加">
        <LabelUpsertForm
          label={null}
          onComplete={async () => {
            "use server"
            unstable_redirect("/labels")
          }}
        />
      </PageSection>
    </>
  )
}

export default Page
