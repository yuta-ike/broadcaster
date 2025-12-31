import type { ComponentProps } from "react"

export const Form = (props: ComponentProps<"form">) => (
  <form {...props} className="flex w-full max-w-[600px] flex-col gap-6 p-4" />
)
