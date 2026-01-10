import { Combobox as BaseCombobox } from "@base-ui/react/combobox"
import { useRef } from "react"
import { TbChevronDown, TbHash, TbSearch } from "react-icons/tb"
import { BASE_HEIGHT } from "./height.js"

type SelectItem<Id extends string> = {
  id: Id
  label: string
}

type Props<Id extends string, Item extends SelectItem<Id>> = {
  id?: string
  items: Item[]
  value: Id
  onValueChange?: (value: Id) => void
  placeholder?: string
  renderItem?: (item: Item) => React.ReactNode
}

export const Combobox = <Id extends string, Item extends SelectItem<Id>>({
  id,
  value,
  onValueChange,
  items,
  renderItem,
}: Props<Id, Item>) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemMap = new Map(items.map((item) => [item.id, item]))

  return (
    <BaseCombobox.Root
      items={items}
      value={value}
      onValueChange={(value) => {
        if (value != null) {
          onValueChange?.(value)
        }
      }}
    >
      <BaseCombobox.Trigger
        id={id}
        className="flex w-full items-center gap-1 rounded-md border border-gray-200 bg-transparent px-1.5 py-1 pl-2 text-base text-gray-900 outline-none ring-slate-500 ring-offset-0 transition placeholder:text-slate-300 focus-within:ring-1 focus-within:ring-offset-2 hover:not-focus-within:border-slate-400"
        style={{
          minHeight: BASE_HEIGHT,
        }}
      >
        <BaseCombobox.Value>
          {(value) => {
            const item = itemMap.get(value)
            if (item == null) {
              return <span className="text-slate-300">選択してください</span>
            }
            return renderItem?.(item) ?? item.label
          }}
        </BaseCombobox.Value>
        <BaseCombobox.Icon className="ml-auto flex">
          <TbChevronDown />
        </BaseCombobox.Icon>
      </BaseCombobox.Trigger>

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner
          className="z-50 outline-none"
          sideOffset={4}
          align="start"
          anchor={containerRef}
        >
          <BaseCombobox.Popup className="dark:-outline-offset-1 max-h-96 max-w-(--available-width) origin-(--transform-origin) overflow-y-auto rounded-lg bg-[canvas] text-gray-900 shadow-gray-200 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] [--input-container-height:3rem] data-ending-style:scale-90 data-starting-style:scale-90 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:shadow-none dark:outline-gray-300">
            <div className="sticky top-0 flex items-center border-b border-b-slate-200 bg-white pl-2.5">
              <TbSearch size={18} className="shrink-0" />
              <div className="mr-1 ml-3 shrink-0 text-slate-800">
                <TbHash />
              </div>
              <BaseCombobox.Input
                placeholder="チャンネル名"
                className="w-full rounded-lg py-2 pr-2.5 placeholder:text-slate-300 focus:outline-none"
              />
            </div>
            <BaseCombobox.Empty className="p-4 pl-10 text-sm empty:m-0 empty:p-0">
              見つかりません
            </BaseCombobox.Empty>
            <BaseCombobox.List>
              {(item: Item) => (
                <BaseCombobox.Item
                  key={item.id}
                  className="cursor-pointer select-none items-center gap-2 p-2 pl-10 text-base leading-4 outline-none hover:bg-slate-100 data-highlighted:bg-slate-200"
                  value={item.id}
                >
                  {renderItem != null ? renderItem(item) : item.label}
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  )
}
