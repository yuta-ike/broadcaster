import { Button } from "broadcaster-components/button.js"
import { TbPlus } from "react-icons/tb"
import { Link } from "waku"
import { listLabelsController } from "../../../../controller/label-list.js"
import { PageSection } from "../../../components/page-section.js"
import { LabelListView } from "../../../views/label-list.js"

export default async function Page() {
  const labels = await listLabelsController()

  return (
    <>
      <title>ラベル管理</title>
      <PageSection
        title="ラベル管理"
        leading={
          <Button prefix={<TbPlus />} as={Link} to="/labels/new">
            ラベル追加
          </Button>
        }
      >
        <LabelListView labels={labels} />
      </PageSection>
    </>
  )
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const
}
