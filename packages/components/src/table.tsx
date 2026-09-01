import type { ComponentProps, Ref } from "react"

const Root = (props: ComponentProps<"table">) => (
  <table
    className="border-separate border-spacing-0 overflow-hidden rounded-lg bg-white border border-slate-200 data-full-width:w-full"
    {...props}
  />
)
const THead = ({ children }: { children?: React.ReactNode }) => (
  <thead className="bg-stone-100 px-3 py-2 text-start font-bold text-sm">{children}</thead>
)
const TBody = ({ children }: { children?: React.ReactNode }) => <tbody>{children}</tbody>
const TFoot = ({ children }: { children?: React.ReactNode }) => <tfoot>{children}</tfoot>
const Tr = ({
  children,
  highlight = false,
  ref,
  ...props
}: {
  children?: React.ReactNode
  highlight?: boolean
  ref?: Ref<HTMLTableRowElement>
} & ComponentProps<"tr">) => (
  <tr
    {...props}
    ref={ref}
    data-highlight={highlight ? "true" : undefined}
    className="even:bg-slate-100 hover:bg-slate-200 data-highlight:bg-orange-100"
  >
    {children}
  </tr>
)
const Th = ({ children }: { children?: React.ReactNode }) => (
  <th className="px-3 py-2 text-sm text-start">{children}</th>
)
const Td = ({ children }: { children?: React.ReactNode }) => (
  <td className="px-3 py-2 text-sm">{children}</td>
)

export const Table = {
  Root,
  THead,
  TBody,
  TFoot,
  Tr,
  Th,
  Td,
}
