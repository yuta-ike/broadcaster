import type { ComponentProps } from "react"
import { BASE_HEIGHT } from "./height.js"

type Props = ComponentProps<"input">

export const Input = (props: Props) => {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-slate-200 px-2.5 py-2 outline-none ring-slate-500 ring-offset-0 transition placeholder:text-slate-300 not-disabled:hover:not-focus-visible:border-slate-400 not-disabled:focus-visible:ring-1 not-disabled:focus-visible:ring-offset-2 disabled:bg-slate-100 disabled:text-slate-400"
      style={{
        height: BASE_HEIGHT,
      }}
    />
  )
}
