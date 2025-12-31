import { Button } from "broadcaster-components/button.js"
import { Table } from "broadcaster-components/table.js"
import { TbEdit, TbTrash } from "react-icons/tb"
import { Link } from "waku"
import type { Sponsor } from "../../domain/model/Sponsor.js"
import { LabelDisplay } from "../components/label-display.js"

type SponsorListViewProps = {
  sponsors: Sponsor[]
}

export const SponsorListView = ({ sponsors }: SponsorListViewProps) => {
  return (
    <Table.Root>
      <Table.THead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>スポンサー名</Table.Th>
          <Table.Th>ラベル</Table.Th>
          <Table.Th>Slack Channel ID</Table.Th>
          <Table.Th>操作</Table.Th>
        </Table.Tr>
      </Table.THead>
      <Table.TBody>
        {sponsors.map((sponsor) => (
          <Table.Tr key={sponsor.readableId}>
            <Table.Td>{sponsor.readableId}</Table.Td>
            <Table.Td>{sponsor.name}</Table.Td>
            <Table.Td>
              <div className="flex flex-wrap gap-2">
                {sponsor.labels.map((label) => (
                  <LabelDisplay key={label.label} label={label} />
                ))}
              </div>
            </Table.Td>
            <Table.Td>{sponsor.slackChannelId}</Table.Td>
            <Table.Td>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  as={Link}
                  to={`/sponsors/${sponsor.id}/edit`}
                  prefix={<TbEdit />}
                >
                  編集
                </Button>
                <Button
                  variant="secondary"
                  as={Link}
                  to={`/sponsors/${sponsor.id}/delete`}
                  prefix={<TbTrash />}
                >
                  削除
                </Button>
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.TBody>
    </Table.Root>
  )
}
