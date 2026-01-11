"use client"

import { MultiCombobox } from "broadcaster-components/control/multi-combobox.js"
import { Form } from "broadcaster-components/form/form.js"
import { FormControl } from "broadcaster-components/form/form-control.js"
import { SubmitButton } from "broadcaster-components/form/form-submit-button.js"
import { useForm } from "broadcaster-components/libs/use-form.js"
import { useTransition } from "react"
import { assignLabelsController } from "../../controller/label-assign.js"
import { LabelAssignSchema } from "../../controller/label-assign-schema.js"
import type { Label, Sponsor } from "../../domain/model/Sponsor.js"
import { LabelDisplay } from "../components/label-display.js"
import { SponsorInput } from "../parts/SponsorInput.js"

type Props = {
  sponsors: Sponsor[]
  labels: Label[]
  onComplete?: () => Promise<void>
}

export const LabelAssignForm = ({ labels, sponsors, onComplete }: Props) => {
  const { values, setValue, getValidValues } = useForm(LabelAssignSchema, {
    sponsorIds: [] as string[],
    labelIds: [] as string[],
  })

  const [_, startTransition] = useTransition()

  const handleSubmit = async () => {
    const value = getValidValues()
    if (value == null) {
      return
    }
    startTransition(async () => {
      await assignLabelsController(value)
      await onComplete?.()
    })
  }

  const labelMap = new Map(labels.map((label) => [label.label, label]))

  return (
    <Form action={handleSubmit}>
      <FormControl label="追加するラベル" required>
        <MultiCombobox
          items={labels.map(({ label }) => ({
            id: label,
            label: label,
          }))}
          value={values.labelIds}
          onValueChange={(value) => setValue("labelIds", value)}
          renderItem={(item) => (
            <LabelDisplay
              key={item.id}
              style="dot"
              label={labelMap.get(item.label)!}
            />
          )}
          placeholder="ラベル名"
        />
      </FormControl>
      <FormControl label="対象スポンサー" required>
        <SponsorInput
          sponsors={sponsors}
          value={values.sponsorIds}
          onChange={(vals) => setValue("sponsorIds", vals)}
        />
      </FormControl>

      <div>
        <SubmitButton type="submit">追加</SubmitButton>
      </div>
    </Form>
  )
}
