import { Datetime, FORMATS } from "broadcaster-components/datetime.js"
import { MaxWidth } from "broadcaster-components/max-width.js"
import { Table } from "broadcaster-components/table.js"
import type { MessageTemplateWithDetail } from "../../domain/model/Message.js"
import { LabelDisplay } from "../components/label-display.js"

type MessageListViewProps = {
  messages: MessageTemplateWithDetail[]
}

export const MessageListView = ({ messages }: MessageListViewProps) => {
  return (
    <Table.Root>
      <Table.THead>
        <Table.Tr>
          <Table.Th>メッセージ</Table.Th>
          <Table.Th>送信予定</Table.Th>
          <Table.Th>送信日時</Table.Th>
          <Table.Th>送信対象</Table.Th>
          <Table.Th>作成日時</Table.Th>
        </Table.Tr>
      </Table.THead>
      <Table.TBody>
        {messages.map((message) => (
          <Table.Tr key={message.id}>
            <Table.Td>
              <MaxWidth maxWidth={300} maxLine={3} className="text-xs">
                {message.message}
              </MaxWidth>
            </Table.Td>
            <Table.Td>
              <Datetime fallback="即時" format={FORMATS.datetime}>
                {message.scheduledAt === "Immediate"
                  ? null
                  : message.scheduledAt}
              </Datetime>
            </Table.Td>
            <Table.Td>
              <Datetime format={FORMATS.datetime}>{message.sentAt}</Datetime>
            </Table.Td>
            <Table.Td>
              <div className="flex flex-wrap gap-1 text-sm">
                {message.target.type === "Label"
                  ? message.target.labels.map((label) => (
                      <LabelDisplay key={label.id} label={label} />
                    ))
                  : message.target.sponsors.map((sponsor) => (
                      <div key={sponsor.id}>{sponsor.name}</div>
                    ))}
              </div>
            </Table.Td>
            <Table.Td>
              <Datetime>{message.createdAt}</Datetime>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.TBody>
    </Table.Root>
  )
}
