import type React from "react"
import type { ComponentProps } from "react"
import { cn } from "./utils/cn.js"

type Props<Type extends React.ElementType> = {
  children: string
  variant?: "primary" | "secondary"
  type?: ComponentProps<"button">["type"]
  prefix?: React.ReactNode
  as?: Type
} & Omit<
  ComponentProps<Type>,
  "type" | "children" | "prefix" | "as" | "variant"
>

export const Button = <Type extends React.ElementType = "button">({
  children,
  type = "button",
  variant = "primary",
  prefix: Prefix,
  as,
  ...rest
}: Props<Type>) => {
  const Component = as || "button"
  return (
    <Component
      type={type}
      {...rest}
      data-variant={variant}
      className={cn(
        "flex min-w-16 items-center justify-center gap-1 rounded-lg border px-3 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2 active:translate-y-px disabled:cursor-not-allowed",
        // variant=primary
        "data-[variant=primary]:border-slate-800 data-[variant=primary]:bg-slate-800 data-[variant=primary]:text-white data-[variant=primary]:disabled:bg-slate-600 data-[variant=primary]:not-disabled:hover:bg-slate-800/90",
        // variant=secondary
        "data-[variant=secondary]:border-slate-200 data-[variant=secondary]:bg-white data-[variant=secondary]:text-slate-800 data-[variant=secondary]:disabled:bg-slate-200 data-[variant=secondary]:not-disabled:hover:bg-slate-100",
      )}
    >
      {Prefix}
      <span>{children}</span>
    </Component>
  )
}
