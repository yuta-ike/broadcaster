import { useEffect, useRef, useState } from "react"
import { TbCheck, TbCopy } from "react-icons/tb"

type Timer = ReturnType<typeof setTimeout>

type Props = {
  text: string
}

export const CopyButton = ({ text }: Props) => {
  const [isCopied, setIsCopied] = useState(false)
  const timerRef = useRef<Timer | null>(null)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await navigator.clipboard.writeText(text)
    setIsCopied(true)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => setIsCopied(false), 2000)
    e.stopPropagation()
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded p-1 text-slate-400 hover:bg-slate-200"
    >
      {isCopied ? <TbCheck size={14} /> : <TbCopy size={14} />}
    </button>
  )
}
