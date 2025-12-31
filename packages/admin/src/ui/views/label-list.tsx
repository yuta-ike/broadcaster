"use client"

import { Button } from "broadcaster-components/button.js"
import { Table } from "broadcaster-components/table.js"
import { useOptimistic, useTransition } from "react"
import { TbEdit, TbTrash } from "react-icons/tb"
import { Link, useRouter } from "waku"
import { changeLabelsOrderController } from "../../controller/label-order.js"
import type { Label } from "../../domain/model/Sponsor.js"
import { SortableItem, SortableRoot, SortHandle } from "../../libs/sortable.js"
import { LabelDisplay } from "../components/label-display.js"

type Props = {
  labels: Label[]
}

export const LabelListView = ({ labels: rawLabels }: Props) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleChangeItemOrders = (updatedLabels: Label[]) => {
    setOptimisticLabels(updatedLabels)
    startTransition(async () => {
      await changeLabelsOrderController(updatedLabels.map((label) => label.id))
      await router.reload()
    })
  }

  const [labels, setOptimisticLabels] = useOptimistic<Label[], Label[]>(
    rawLabels,
    (_, newMessage) => newMessage,
  )

  return (
    <SortableRoot items={labels} onChangeItems={handleChangeItemOrders}>
      <Table.Root>
        <Table.THead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>ラベル</Table.Th>
            <Table.Th>操作</Table.Th>
          </Table.Tr>
        </Table.THead>
        <Table.TBody>
          {labels.map((label) => (
            <SortableItem key={label.id} id={label.id} as={Table.Tr}>
              <Table.Td>
                <SortHandle id={label.id} disabled={isPending} />
              </Table.Td>
              <Table.Td>
                <LabelDisplay label={label} />
              </Table.Td>
              <Table.Td>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    as={Link}
                    to={`/labels/${label.id}/edit`}
                    prefix={<TbEdit />}
                  >
                    編集
                  </Button>
                  <Button
                    variant="secondary"
                    as={Link}
                    to={`/labels/${label.id}/delete`}
                    prefix={<TbTrash />}
                  >
                    削除
                  </Button>
                </div>
              </Table.Td>
            </SortableItem>
          ))}
        </Table.TBody>
      </Table.Root>
    </SortableRoot>
  )
}
