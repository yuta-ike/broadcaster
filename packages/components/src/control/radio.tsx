import type { ComponentProps } from "react"
import { TbCircle } from "react-icons/tb"

type Props = Omit<ComponentProps<"input">, "type" | "className">

export const Radio = (props: Props) => {
  return (
    <div className="relative grid h-max w-max place-items-center rounded-full border border-slate-800 bg-white p-1 ring-slate-800 group-hover/radio:ring-2 group-hover/radio:ring-slate-200 has-checked:border-slate-800 has-not-checked:border-slate-300 has-checked:bg-slate-800 has-checked:text-white has-not-checked:text-slate-200 has-focus-visible:ring-2 has-focus-visible:ring-offset-2">
      <input
        {...props}
        type="radio"
        className="peer absolute inset-0 cursor-pointer opacity-0"
      />
      <TbCircle
        size={10}
        strokeWidth={0}
        className="pointer-events-none fill-white"
      />
    </div>
  )
}

export const RadioOption = ({
  children,
  ...props
}: Props & { children: React.ReactNode }) => {
  return (
    <label className="group/radio peer grid cursor-pointer select-none grid-cols-[auto_1fr] items-center gap-2">
      <Radio {...props} />
      <div>{children}</div>
    </label>
  )
}
