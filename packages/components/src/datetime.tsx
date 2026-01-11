import { format as formatDate, formatDistanceToNowStrict } from "date-fns"
import { ja } from "date-fns/locale"
import { TbClock } from "react-icons/tb"
import { Tooltip } from "./tooltip.js"

export const FORMATS = {
  datetime: "yyyy/MM/dd HH:mm",
}

type Props = {
  children: Date | undefined | null
  format?: string
  fallback?: React.ReactNode
}

export const Datetime = ({ children, format, fallback }: Props) => {
  if (children != null) {
    return (
      <Tooltip hint={children.toISOString()}>
        <time
          dateTime={children.toISOString()}
          className="flex items-center gap-1"
        >
          <TbClock />
          {format != null
            ? formatDate(children, format)
            : formatDistanceToNowStrict(children, {
                locale: ja,
                addSuffix: true,
              })}
        </time>
      </Tooltip>
    )
  } else {
    return <span>{fallback ?? "-"}</span>
  }
}
