import type React from "react"
import { TbAlertCircle, TbInfoCircle } from "react-icons/tb"

type Props = {
  label: string
  children?: React.ReactNode
  description?: string
  support?: string
  id?: string
  required?: boolean
  error?: string | undefined
}

export const FormControl = ({
  label,
  children,
  id,
  required,
  description,
  support,
  error,
}: Props) => {
  return (
    <div
      className="before:-left-4 relative flex w-full flex-col gap-1 before:absolute before:inset-y-0 before:w-1 before:rounded-sm data-error:before:bg-red-500"
      data-error={error != null ? "" : undefined}
    >
      <label htmlFor={id} className="block text-md">
        {label}
        {required && (
          <span className="ml-2 text-red-600 text-xs">{"必須"}</span>
        )}
      </label>
      {description && (
        <div className="text-slate-600 text-sm">{description}</div>
      )}
      <div>{children}</div>
      {support && (
        <div className="flex items-center text-slate-600 text-sm">
          <TbInfoCircle className="mr-0.5" />
          {support}
        </div>
      )}
      {error && (
        <div className="flex items-center text-red-600 text-sm">
          <TbAlertCircle className="mr-0.5" />
          {error}
        </div>
      )}
    </div>
  )
}
