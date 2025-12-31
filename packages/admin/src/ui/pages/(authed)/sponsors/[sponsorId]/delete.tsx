import type { PageProps } from "waku/router"
import { unstable_redirect } from "waku/router/server"
import { getSponsorController } from "../../../../../controller/sponsor-get.js"
import { PageSection } from "../../../../components/page-section.js"
import { SponsorDeleteForm } from "../../../../views/sponsor-delete.js"

const Page = async ({
  sponsorId,
}: PageProps<"/sponsors/[sponsorId]/delete">) => {
  const sponsor = await getSponsorController(sponsorId)

  return (
    <>
      <title>{sponsor.name}｜スポンサー削除</title>
      <PageSection title="スポンサー削除">
        <SponsorDeleteForm
          sponsor={sponsor}
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
