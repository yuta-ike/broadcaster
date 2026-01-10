import { Combobox as BaseCombobox } from "@base-ui/react/combobox"
import { useRef } from "react"
import { TbCheck, TbChevronDown, TbX } from "react-icons/tb"
import { BASE_HEIGHT } from "./height.js"

type SelectItem<Id extends string> = {
  id: Id
  label: string
}

type Props<Id extends string, Item extends SelectItem<Id>> = {
  id?: string
  items: Item[]
  value: Id[]
  onValueChange?: (value: Id[]) => void
  placeholder?: string
  renderItem?: (item: Item) => React.ReactNode
}

export const MultiCombobox = <Id extends string, Item extends SelectItem<Id>>({
  id,
  value,
  onValueChange,
  items,
  placeholder,
  renderItem,
}: Props<Id, Item>) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemMap = new Map(items.map((item) => [item.id, item]))

  return (
    <BaseCombobox.Root
      items={items}
      value={value}
      onValueChange={(value) => onValueChange?.(value)}
      multiple
    >
      <div className="flex w-full flex-col gap-1">
        <BaseCombobox.Chips
          className="flex flex-wrap items-center gap-0.5 rounded-md border border-gray-200 px-1.5 py-1 outline-none ring-slate-500 ring-offset-0 transition placeholder:text-slate-300 focus-within:ring-1 focus-within:ring-offset-2 hover:not-focus-within:border-slate-400"
          ref={containerRef}
          style={{
            minHeight: BASE_HEIGHT,
          }}
        >
          <BaseCombobox.Value>
            {(value: Id[]) => (
              <>
                {value.map((id) => {
                  const item = itemMap.get(id)!
                  return (
                    <BaseCombobox.Chip
                      key={id}
                      className="flex cursor-pointer items-center gap-0.5 rounded-lg border border-slate-200 p-0.5 text-gray-900 text-sm outline-none focus-within:bg-slate-400 focus-within:text-gray-50 [@media(hover:hover)]:data-highlighted:bg-blue-800 [@media(hover:hover)]:data-highlighted:text-gray-50"
                      aria-label={item.label}
                    >
                      {renderItem != null ? renderItem(item) : item.label}
                      <BaseCombobox.ChipRemove
                        className="rounded-full p-1 hover:bg-gray-200"
                        aria-label="取り除く"
                      >
                        <TbX />
                      </BaseCombobox.ChipRemove>
                    </BaseCombobox.Chip>
                  )
                })}
                <BaseCombobox.Input
                  id={id}
                  placeholder={value.length === 0 ? placeholder : undefined}
                  className="flex-1 rounded-md border-0 bg-transparent pl-2 text-base text-gray-900 outline-none placeholder:text-slate-300"
                />
                <TbChevronDown />
              </>
            )}
          </BaseCombobox.Value>
        </BaseCombobox.Chips>
      </div>

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner
          className="z-50 outline-none"
          sideOffset={4}
          anchor={containerRef}
        >
          <BaseCombobox.Popup className="dark:-outline-offset-1 max-h-[min(var(--available-height),23rem)] w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain rounded-md bg-[canvas] py-2 text-gray-900 shadow-gray-200 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-95 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:shadow-none dark:outline-gray-300">
            <BaseCombobox.Empty className="px-4 py-2 empty:m-0 empty:p-0">
              見つかりません。
            </BaseCombobox.Empty>
            <BaseCombobox.List>
              {(item: Item) => (
                <BaseCombobox.Item
                  key={item.id}
                  className="grid cursor-pointer select-none grid-cols-[1rem_1fr] items-center gap-2 py-1 pr-4 pl-2 text-base leading-4 outline-none [@media(hover:hover)]:data-highlighted:relative [@media(hover:hover)]:data-highlighted:z-0 [@media(hover:hover)]:data-highlighted:before:absolute [@media(hover:hover)]:data-highlighted:before:inset-x-2 [@media(hover:hover)]:data-highlighted:before:inset-y-0 [@media(hover:hover)]:data-highlighted:before:z-[-1] [@media(hover:hover)]:data-highlighted:before:rounded-sm [@media(hover:hover)]:data-highlighted:before:bg-slate-100"
                  value={item.id}
                >
                  <BaseCombobox.ItemIndicator className="col-start-1">
                    <TbCheck size={20} />
                  </BaseCombobox.ItemIndicator>
                  <div className="col-start-2">
                    {renderItem != null ? renderItem(item) : item.label}
                  </div>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  )
}
