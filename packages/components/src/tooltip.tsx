import { useId } from "react"

type Props = {
  title?: string
  children: React.ReactNode
  hint: React.ReactNode
}

export const Tooltip = ({ title, children, hint }: Props) => {
  const id = useId()
  return (
    <>
      <button
        type="button"
        className="inline underline decoration-slate-400 decoration-dotted"
        popoverTarget={id}
        title={title ?? (typeof hint === "string" ? hint : undefined)}
      >
        {children}
      </button>
      <div
        popover=""
        id={id}
        className="m-[initial] max-w-[min(100%,600px)] rounded-lg border border-slate-200 bg-white/90 p-1 text-sm shadow backdrop-blur-sm [position-area:bottom_span-right]"
      >
        {hint}
      </div>
    </>
  )
}
