import { useEffect, useRef, useState } from "react"

export const useCopy = () => {
  const [hasCopied, setHasCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  const copy = async (text: string) => {
    try {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current)
      }

      await navigator.clipboard.writeText(text)

      setHasCopied(true)
      timerRef.current = setTimeout(() => setHasCopied(false), 2500)
    } catch {}
  }

  useEffect(() => {
    return () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return { copy, hasCopied }
}
