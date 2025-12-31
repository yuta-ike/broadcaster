import type { ComponentProps } from "react"
import { BASE_HEIGHT } from "./height.js"

type Props = ComponentProps<"input">

export const Input = (props: Props) => {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-slate-200 px-2.5 py-2 ring-slate-500 ring-offset-0 transition placeholder:text-slate-300 hover:not-focus-visible:border-slate-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2"
      style={{
        height: BASE_HEIGHT,
      }}
    />
  )
}
