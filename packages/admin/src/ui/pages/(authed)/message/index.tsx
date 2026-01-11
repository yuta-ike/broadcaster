import { Button } from "broadcaster-components/button.js"
import { TbPlus } from "react-icons/tb"
import { Link } from "waku"
import { listMessages } from "../../../../infrastructure/db/list-messages.js"
import { PageSection } from "../../../components/page-section.js"
import { MessageListView } from "../../../views/message-list.js"

export default async function Page() {
  const messages = await listMessages()

  return (
    <>
      <title>メッセージ管理</title>
      <PageSection
        title="メッセージ管理"
        leading={
          <Button prefix={<TbPlus />} as={Link} to="/message/send">
            送信
          </Button>
        }
      >
        <MessageListView messages={messages} />
      </PageSection>
    </>
  )
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const
}
