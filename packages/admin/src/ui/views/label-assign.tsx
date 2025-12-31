"use client"

import { CheckboxOption } from "broadcaster-components/control/checkbox.js"
import { Form } from "broadcaster-components/form/form.js"
import { FormControl } from "broadcaster-components/form/form-control.js"
import { SubmitButton } from "broadcaster-components/form/form-submit-button.js"
import { useForm } from "broadcaster-components/libs/use-form.js"
import { useTransition } from "react"
import { assignLabelsController } from "../../controller/label-assign.js"
import { LabelAssignSchema } from "../../controller/label-assign-schema.js"
import type { Label, Sponsor } from "../../domain/model/Sponsor.js"
import { LabelDisplay } from "../components/label-display.js"
import { SponsorsInput } from "../parts/SponsorsInput.js"

type Props = {
  sponsors: Sponsor[]
  labels: Label[]
  onComplete?: () => Promise<void>
}

export const LabelAssignForm = ({ labels, sponsors, onComplete }: Props) => {
  const { values, setValue, getValidValues, registerMultipleCheckbox } =
    useForm(LabelAssignSchema, {
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

  return (
    <Form action={handleSubmit}>
      <FormControl label="追加するラベル" required>
        <div className="flex flex-wrap gap-x-8 gap-y-4 rounded border border-slate-200 p-4">
          {labels.map((label) => (
            <CheckboxOption
              key={label.id}
              {...registerMultipleCheckbox("labelIds", label.id)}
            >
              <LabelDisplay label={label} />
            </CheckboxOption>
          ))}
        </div>
      </FormControl>

      <FormControl label="対象" required>
        <SponsorsInput
          values={values.sponsorIds}
          onChange={(vals) => setValue("sponsorIds", vals)}
          labels={labels}
          sponsors={sponsors}
        />
      </FormControl>
      <div>
        <SubmitButton type="submit">追加</SubmitButton>
      </div>
    </Form>
  )
}
