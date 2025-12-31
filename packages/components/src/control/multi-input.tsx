import type { ComponentProps } from "react"

type Props = ComponentProps<"textarea"> & {
  rows?: number
}

export const MultiInput = ({ rows, ...props }: Props) => {
  return (
    <textarea
      {...props}
      className="field-sizing-content min-h-[calc(3lh+10px)] w-full rounded-lg border border-slate-200 px-2.5 py-2 ring-slate-500 ring-offset-0 transition placeholder:text-slate-300 hover:not-focus-visible:border-slate-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:bg-slate-100"
      style={{
        height: rows ? `${rows}lh` : undefined,
      }}
    />
  )
}
