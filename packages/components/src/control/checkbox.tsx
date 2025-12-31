import { type ComponentProps, useEffect, useRef } from "react"
import { TbCheck, TbMinus } from "react-icons/tb"

type Props = Omit<ComponentProps<"input">, "type" | "className"> & {
  indeterminate?: boolean
}

export const Checkbox = ({ indeterminate, ...props }: Props) => {
  const innerRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    const elm = innerRef.current
    if (elm == null) {
      return
    }
    if (indeterminate && elm.checked) {
      elm.indeterminate = true
    } else {
      elm.indeterminate = false
    }
  }, [indeterminate])

  return (
    <div className="relative grid h-max w-max place-items-center rounded border border-slate-800 bg-white p-[3px] ring-slate-800 group-hover/checkbox:ring-2 group-hover/checkbox:ring-slate-200 has-checked:border-slate-800 has-indeterminate:border-slate-800 has-not-checked:border-slate-300 has-checked:bg-slate-800 has-indeterminate:bg-slate-800 has-checked:text-white has-indeterminate:text-white has-not-checked:text-slate-200 has-focus-visible:ring-2 has-focus-visible:ring-offset-2">
      <input
        {...props}
        type="checkbox"
        className="peer absolute inset-0 cursor-pointer opacity-0"
        ref={innerRef}
      />
      <TbCheck
        size={14}
        strokeWidth={3}
        className="pointer-events-none peer-indeterminate:hidden"
      />
      <TbMinus
        size={14}
        strokeWidth={4}
        className="pointer-events-none hidden peer-indeterminate:block"
      />
    </div>
  )
}

export const CheckboxOption = ({
  children,
  ...props
}: Props & { children: React.ReactNode }) => {
  return (
    <label className="group/checkbox grid cursor-pointer select-none grid-cols-[auto_1fr] items-center gap-2">
      <Checkbox {...props} />
      <div>{children}</div>
    </label>
  )
}
