import { CheckboxOption } from "broadcaster-components/control/checkbox.js"
import { RadioOption } from "broadcaster-components/control/radio.js"
import { Activity, useId, useState } from "react"
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

  const [checkedOption, setCheckedOption] = useState<"Label" | "Sponsor">(
    "Label",
  )

  const id = useId()

  return (
    <div>
      <div className="flex flex-col rounded-lg border border-slate-200">
        <div className="group p-3">
          <RadioOption
            name={`${id}-sponsor-input-tab`}
            checked={checkedOption === "Label"}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedOption("Label")
                onChange([])
              }
            }}
          >
            ラベルで指定する
          </RadioOption>
          <Activity mode={checkedOption === "Label" ? "visible" : "hidden"}>
            <div className="flex flex-col pl-7">
              <hr className="broder-t my-3 border-t-slate-200" />
              <div className="flex flex-wrap gap-4">
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
                      indeterminate={
                        0 < selected.size && selected.size < labeled.size
                      }
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
            </div>
          </Activity>
        </div>
        <hr className="border-t border-t-slate-200" />
        <div className="group p-3">
          <RadioOption
            name={`${id}-sponsor-input-tab`}
            checked={checkedOption === "Sponsor"}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedOption("Sponsor")
                onChange([])
              }
            }}
          >
            個別に指定する
          </RadioOption>
          <Activity mode={checkedOption === "Sponsor" ? "visible" : "hidden"}>
            <div className="flex flex-col pl-7">
              <hr className="broder-t my-3 border-t-slate-200" />
              <div className="flex flex-wrap gap-4">
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
            </div>
          </Activity>
        </div>
      </div>
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
