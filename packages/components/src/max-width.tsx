import { Tooltip } from "./tooltip.js"
import { cn } from "./utils/cn.js"

type Props = {
  children: React.ReactNode
  maxWidth: number
  maxLine?: number
  className?: string
}
export const MaxWidth = ({ children, maxWidth, maxLine, className }: Props) => {
  return (
    <Tooltip hint={children}>
      <div
        style={{ maxWidth: `${maxWidth}px`, "--max-line-count": maxLine }}
        className={cn("line-clamp-(--max-line-count)", className)}
      >
        {children}
      </div>
    </Tooltip>
  )
}
