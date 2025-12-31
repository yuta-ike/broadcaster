"use client"

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { ComponentProps } from "react"
import { TbGripVertical } from "react-icons/tb"

type Props<Item extends { id: string }> = {
  items: Item[]
  onChangeItems: (items: Item[]) => void
  children: React.ReactNode
}

export const SortableRoot = <Item extends { id: string }>({
  items,
  onChangeItems,
  children,
}: Props<Item>) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over != null && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      const updated = arrayMove(items, oldIndex, newIndex)
      onChangeItems(updated)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext strategy={verticalListSortingStrategy} items={items}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

type SortableItemProps<Type extends React.ElementType> = {
  id: string
  children: React.ReactNode
  as?: Type
} & ComponentProps<Type>

export const SortableItem = <Type extends React.ElementType>({
  id,
  children,
  as,
  ...rest
}: SortableItemProps<Type>) => {
  const { attributes, setNodeRef, transform, transition } = useSortable({ id })

  const Component = as || "div"

  return (
    <Component
      {...rest}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
    >
      {children}
    </Component>
  )
}

type SortHandleProps = {
  id: string
  disabled?: boolean
}

export const SortHandle = ({ id, disabled }: SortHandleProps) => {
  const { listeners, setActivatorNodeRef } = useSortable({ id })
  return (
    <button
      type="button"
      {...listeners}
      ref={setActivatorNodeRef}
      disabled={disabled}
      className="cursor-move! select-none p-2 text-slate-400 hover:text-slate-600"
    >
      <TbGripVertical />
    </button>
  )
}
