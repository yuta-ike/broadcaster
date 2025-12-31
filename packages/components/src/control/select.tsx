import { Select as BaseSelect } from "@base-ui/react/select"
import { TbCheck, TbChevronDown } from "react-icons/tb"
import { BASE_HEIGHT } from "./height.js"

type SelectItem<Id extends string> = {
  id: Id
  label: string
}

type Props<Id extends string, Item extends SelectItem<Id>> = {
  items: Item[]
  id?: string
  renderItem?: (item: Item) => React.ReactNode
} & (
  | {
      multiple?: false | undefined
      value: Id
      onValueChange?: (value: Id) => void
    }
  | {
      multiple: true
      value: Id[]
      onValueChange?: (value: Id[]) => void
    }
)

export const Select = <Id extends string, Item extends SelectItem<Id>>({
  items,
  multiple,
  onValueChange,
  value,
  renderItem,
  ...props
}: Props<Id, Item>) => {
  return (
    <BaseSelect.Root
      {...props}
      items={items.map((item) => ({
        value: item.id,
        label: item.label,
      }))}
      multiple={multiple ?? false}
      value={value}
      onValueChange={(value) => {
        console.log(value)
        if (!multiple && value == null) {
          return
        }
        if (multiple === true) {
          onValueChange?.((value as Id[] | null) ?? [])
        } else {
          onValueChange?.(value as Id)
        }
      }}
    >
      <BaseSelect.Trigger
        className="grid w-full grid-cols-[1fr_auto] items-center rounded-lg border border-slate-200 px-2.5 py-2 ring-slate-500 ring-offset-0 transition-[transform,scale,opacity] hover:not-focus-visible:border-slate-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2"
        style={{
          height: BASE_HEIGHT,
        }}
      >
        <BaseSelect.Value className="flex flex-wrap gap-1 text-start text-base">
          {(values: string[]) => {
            if (values.length === 0) {
              return "選択してください"
            }
            return items
              .filter((item) => values.includes(item.id))
              .map((item) => (renderItem ? renderItem(item) : item.label))
          }}
        </BaseSelect.Value>
        <BaseSelect.Icon>
          <TbChevronDown />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          sideOffset={1}
          className="z-10 select-none outline-none"
        >
          <BaseSelect.Popup className="broder w-full min-w-(--anchor-width) origin-(--transform-origin) rounded-lg border border-slate-200 bg-white bg-clip-padding p-1 shadow">
            <BaseSelect.ScrollUpArrow />
            <BaseSelect.List>
              {items.map((item) => (
                <BaseSelect.Item
                  key={item.id}
                  value={item.id}
                  className="flex cursor-pointer select-none items-center gap-1 p-1 pl-2 outline-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-slate-900 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-slate-100"
                >
                  <div className="w-[18px] shrink-0">
                    <BaseSelect.ItemIndicator>
                      <TbCheck size={18} />
                    </BaseSelect.ItemIndicator>
                  </div>
                  {renderItem ? renderItem(item) : item.label}
                </BaseSelect.Item>
              ))}
              {/* </select> */}
            </BaseSelect.List>
            <BaseSelect.ScrollDownArrow />
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}
