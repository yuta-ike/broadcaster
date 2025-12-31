import type { Label } from "../../domain/model/Sponsor.js"
import { getForegroundColor } from "../../utils/getForegroundColor.js"

type LabelDisplayProps = {
  label: Label
}

export const LabelDisplay = ({ label }: LabelDisplayProps) => {
  return (
    <div
      style={{
        backgroundColor: label.color,
        color: getForegroundColor(label.color),
      }}
      className="w-max rounded-full px-2 py-0.5 text-[13px]"
    >
      {label.label}
    </div>
  )
}
