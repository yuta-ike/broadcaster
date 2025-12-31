import { CheckboxOption } from "broadcaster-components/control/checkbox.js"
import type { Label, Sponsor } from "../../domain/model/Sponsor.js"
import { LabelDisplay } from "../components/label-display.js"

type Props = {
  values: string[]
  onChange: (values: string[]) => void
  labels: Label[]
  sponsors: Sponsor[]
}

export const SponsorsInput = ({
  values,
  onChange,
  labels,
  sponsors,
}: Props) => {
  const grouped = groupByLabels(sponsors)

  return (
    <div className="overflow-hidden rounded border border-slate-200">
      <div className="flex flex-wrap gap-4 p-4">
        <CheckboxOption
          checked={values.length === sponsors.length}
          onChange={(e) => {
            if (e.target.checked) {
              onChange(sponsors.map(({ id }) => id))
            } else {
              onChange([])
            }
          }}
        >
          全選択
        </CheckboxOption>
      </div>
      <hr className="border-t border-t-slate-200" />
      <div className="flex flex-wrap gap-4 p-4">
        {labels.map((label) => {
          const labeled = new Set(grouped.get(label.id) ?? [])
          if (labeled.size === 0) {
            return null
          }

          const selected = new Set(values).intersection(labeled)
          return (
            <CheckboxOption
              key={label.id}
              checked={0 < selected.size}
              indeterminate={0 < selected.size && selected.size < labeled.size}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...values, ...labeled])
                } else {
                  onChange(values.filter((id) => !labeled.has(id)))
                }
              }}
            >
              <LabelDisplay label={label} />
            </CheckboxOption>
          )
        })}
      </div>
      <details className="border-slate-200 border-t">
        <summary className="cursor-pointer select-none px-4 py-2 hover:bg-slate-50">
          個別に指定する
        </summary>
        <div className="flex flex-wrap gap-4 p-4">
          {sponsors.map((sponsor) => (
            <CheckboxOption
              key={sponsor.id}
              checked={values.includes(sponsor.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...values, sponsor.id])
                } else {
                  onChange(values.filter((id) => id !== sponsor.id))
                }
              }}
            >
              {sponsor.name}
            </CheckboxOption>
          ))}
        </div>
      </details>
    </div>
  )
}

const groupByLabels = (sponsors: Sponsor[]) => {
  const groupedMap = new Map<string, string[]>()
  sponsors.forEach((sponsor) => {
    sponsor.labels.forEach((label) => {
      if (!groupedMap.has(label.id)) {
        groupedMap.set(label.id, [])
      }
      groupedMap.get(label.id)!.push(sponsor.id)
    })
  })
  return groupedMap
}
