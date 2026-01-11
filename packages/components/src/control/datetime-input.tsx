import { format, formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"
import { Input } from "./input.js"

type Props = {
  value: Date
  onChange: (value: Date) => void
  disabled?: boolean
}

export const DatetimeInput = ({ value, onChange, ...rest }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(new Date(e.target.value))
  }

  const distance = formatDistanceToNow(value, { addSuffix: true, locale: ja })

  return (
    <div className="relative">
      <Input
        {...rest}
        type="datetime-local"
        value={format(value, "yyyy-MM-dd'T'HH:mm")}
        onChange={handleChange}
      />
      <span className="-translate-y-1/2 absolute top-1/2 right-2 pr-10 text-gray-500 text-xs">
        {distance}
      </span>
    </div>
  )
}
