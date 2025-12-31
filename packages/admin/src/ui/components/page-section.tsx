import type React from "react"

type Props = {
  title: string
  leading?: React.ReactNode
  children?: React.ReactNode
}

export const PageSection = ({ title, leading, children }: Props) => {
  return (
    <section>
      <div className="flex items-center justify-between border-b border-b-slate-200 p-4">
        <h2 className="font-bold text-xl">{title}</h2>
        {leading}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}
