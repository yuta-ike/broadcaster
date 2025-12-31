import { Button } from "broadcaster-components/button.js"
import { TbPlus } from "react-icons/tb"
import { Link } from "waku"
import { listSponsorsController } from "../../../../controller/sponsor-list.js"
import { PageSection } from "../../../components/page-section.js"
import { SponsorListView } from "../../../views/sponsor-list.js"

export default async function Page() {
  const sponsors = await listSponsorsController()

  return (
    <>
      <title>スポンサー管理</title>
      <PageSection
        title="スポンサー管理"
        leading={
          <Button prefix={<TbPlus />} as={Link} to="/sponsors/new">
            スポンサー追加
          </Button>
        }
      >
        <SponsorListView sponsors={sponsors} />
      </PageSection>
    </>
  )
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const
}
