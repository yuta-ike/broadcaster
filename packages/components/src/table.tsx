import type { ComponentProps } from "react"
import { cn } from "./utils/cn.js"

const Root = (props: ComponentProps<"table">) => (
  <table
    className={cn(
      "border-separate border-spacing-0 overflow-hidden rounded-lg border border-slate-200",
      "[&>thead>tr>th]:bg-stone-100 [&>thead>tr>th]:px-3 [&>thead>tr>th]:py-2 [&>thead>tr>th]:text-start [&>thead>tr>th]:font-bold [&>thead>tr>th]:text-sm",
      "[&>tbody>tr]:even:bg-slate-100 [&>tbody>tr]:hover:bg-slate-200",
      "[&>tbody>tr>td]:px-3 [&>tbody>tr>td]:py-2 [&>thead>tr>td]:text-sm",
      "data-full-width:w-full",
    )}
    {...props}
  />
)
const THead = (props: ComponentProps<"thead">) => <thead {...props} />
const TBody = (props: ComponentProps<"tbody">) => <tbody {...props} />
const TFoot = (props: ComponentProps<"tfoot">) => <tfoot {...props} />
const Tr = (props: ComponentProps<"tr">) => <tr {...props} />
const Th = (props: ComponentProps<"th">) => <th {...props} />
const Td = (props: ComponentProps<"td">) => <td {...props} />

export const Table = {
  Root,
  THead,
  TBody,
  TFoot,
  Tr,
  Th,
  Td,
}
