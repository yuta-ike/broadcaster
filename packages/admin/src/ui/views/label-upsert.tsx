"use client"

import { Input } from "broadcaster-components/control/input.js"
import { Form } from "broadcaster-components/form/form.js"
import { FormControl } from "broadcaster-components/form/form-control.js"
import { SubmitButton } from "broadcaster-components/form/form-submit-button.js"
import { useForm } from "broadcaster-components/libs/use-form.js"
import { useTransition } from "react"
import type z from "zod"
import { upsertLabelController } from "../../controller/label-upsert.js"
import { LabelUpsertFormSchema } from "../../controller/label-upsert-schema.js"
import type { Label } from "../../domain/model/Sponsor.js"

type Props = {
  label: Label | null
  initValue?: z.infer<typeof LabelUpsertFormSchema>
  onComplete?: () => void
}

const defaultValue = {
  label: "",
  color: "#CCCCCC",
} satisfies z.infer<typeof LabelUpsertFormSchema>

export const LabelUpsertForm = ({ label, initValue, onComplete }: Props) => {
  const { getValidValues, registerInput, errors } = useForm(
    LabelUpsertFormSchema,
    initValue ?? defaultValue,
  )

  const [_, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      const value = getValidValues()
      if (value == null) {
        return
      }
      await upsertLabelController(label?.id ?? null, value)
      onComplete?.()
    })
  }

  return (
    <Form action={handleSubmit}>
      {/* タイトル */}
      <FormControl label="ラベル名" required error={errors.label}>
        <Input
          {...registerInput("text", "label")}
          placeholder="プラチナスポンサー"
        />
      </FormControl>

      {/* スポンサーID（readbaleId） */}
      <FormControl label="カラーコード" required error={errors.color}>
        <Input {...registerInput("color", "color")} placeholder="#CCCCCC" />
      </FormControl>

      <div>
        <SubmitButton type="submit">
          {label == null ? "作成" : "更新"}
        </SubmitButton>
      </div>
    </Form>
  )
}
