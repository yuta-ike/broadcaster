import type { PageProps } from "waku/router"
import { unstable_redirect } from "waku/router/server"
import { getLabelController } from "../../../../../controller/label-get.js"
import { PageSection } from "../../../../components/page-section.js"
import { LabelUpsertForm } from "../../../../views/label-upsert.js"

const Page = async ({ labelId }: PageProps<"/labels/[labelId]/edit">) => {
  const label = await getLabelController(labelId)

  return (
    <>
      <title>{label.label}｜ラベル編集</title>
      <PageSection title="ラベル編集">
        <LabelUpsertForm
          label={label}
          initValue={{
            label: label.label,
            color: label.color,
          }}
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

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const
}
