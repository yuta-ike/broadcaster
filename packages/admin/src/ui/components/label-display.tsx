import type { Label } from "../../domain/model/Sponsor.js"
import { getForegroundColor } from "../../utils/getForegroundColor.js"

type LabelDisplayProps = {
  label: Label
  style?: "pill" | "dot"
}

export const LabelDisplay = ({ label, style }: LabelDisplayProps) => {
  if (style === "pill") {
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
  } else {
    return (
      <div className="flex w-max items-center gap-1 rounded-full px-2 py-0.5">
        <div
          className="h-3.5 w-3.5 rounded-full"
          style={{
            backgroundColor: label.color,
          }}
        />
        {label.label}
      </div>
    )
  }
}
