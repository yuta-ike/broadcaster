import { CheckboxOption } from "broadcaster-components/control/checkbox.js"
import { Input } from "broadcaster-components/control/input.js"
import { RadioPanel } from "broadcaster-components/control/radio-panel.js"
import { FormControl } from "broadcaster-components/form/form-control.js"
import { format } from "date-fns/format"
import { useState } from "react"

type Props = {
  scheduledAt: Date | "Immediate"
  onChangeScheduledAt: (value: Date | "Immediate") => void
}

export const ScheduleInput = ({ scheduledAt, onChangeScheduledAt }: Props) => {
  const [checkTommorowMorning, setCheckTommorowMorning] = useState(false)

  return (
    <RadioPanel.Root>
      <RadioPanel.Panel
        name="schedule"
        checked={scheduledAt === "Immediate"}
        onChecked={(checked) => {
          if (checked) {
            onChangeScheduledAt("Immediate")
          }
        }}
        label="即時送信"
      />

      <RadioPanel.Hr />

      <RadioPanel.Panel
        name="schedule"
        checked={scheduledAt instanceof Date}
        onChecked={(checked) => {
          if (checked) {
            onChangeScheduledAt(new Date())
          }
        }}
        label="予約送信"
      >
        {scheduledAt instanceof Date && (
          <div className="flex flex-col gap-4">
            <FormControl label="送信予約日時">
              <Input
                type="datetime-local"
                disabled={checkTommorowMorning}
                value={format(scheduledAt, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => onChangeScheduledAt(new Date(e.target.value))}
              />
            </FormControl>

            <CheckboxOption
              checked={checkTommorowMorning}
              onChange={(e) => {
                setCheckTommorowMorning(e.target.checked)
                if (e.target.checked) {
                  onChangeScheduledAt(getTomorrowMorning())
                }
              }}
            >
              明日朝8時に送信
            </CheckboxOption>
          </div>
        )}
      </RadioPanel.Panel>
    </RadioPanel.Root>
  )
}

const getTomorrowMorning = () => {
  const now = new Date()
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    8,
    0,
    0,
    0,
  )
  return tomorrow
}
