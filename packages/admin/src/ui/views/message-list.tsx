import { Datetime, FORMATS } from "broadcaster-components/datetime.js"
import { Table } from "broadcaster-components/table.js"
import type { MessageTemplateWithDetail } from "../../domain/model/Message.js"
import { LabelDisplay } from "../components/label-display.js"
import { UnstyledSlackPreview } from "broadcaster-components/slack-preview.js"
import { parseMrkdwn } from "slack-parser/index.js"

type MessageListViewProps = {
  messages: MessageTemplateWithDetail[]
}

export const MessageListView = ({ messages }: MessageListViewProps) => {
  return (
    <Table.Root>
      <Table.THead>
        <Table.Tr>
          <Table.Th>ステータス</Table.Th>
          <Table.Th>メッセージ</Table.Th>
          <Table.Th>送信対象</Table.Th>
          <Table.Th>送信日時</Table.Th>
          <Table.Th>作成日時</Table.Th>
        </Table.Tr>
      </Table.THead>
      <Table.TBody>
        {messages.map((message) => (
          <Table.Tr key={message.id} highlight={message.sentAt == null}>
            {/* ステータス */}
            <Table.Td>
              {message.sentAt == null ? (
                <div className="border border-orange-400 bg-orange-200 rounded-full w-max px-2 py-1 leading-none text-orange-700 text-xs">
                  未送信
                </div>
              ) : (
                <div className="border border-blue-500 bg-blue-100 rounded-full w-max px-2 py-1 leading-none text-blue-800 text-xs">
                  送信済
                </div>
              )}
            </Table.Td>

            {/* メッセージ */}
            <Table.Td>
              <div className="overflow-y-auto max-h-[250px]">
                <UnstyledSlackPreview message={parseMrkdwn(message.message).document} />
              </div>
            </Table.Td>

            {/* 送信対象 */}
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

            {/* 送信日時 */}
            <Table.Td>
              <Datetime>
                {message.scheduledAt == "Immediate" ? new Date() : message.scheduledAt}
              </Datetime>
            </Table.Td>

            {/* 作成日時 */}
            <Table.Td>
              <Datetime format={FORMATS.datetime}>{message.createdAt}</Datetime>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.TBody>
    </Table.Root>
  )
}
