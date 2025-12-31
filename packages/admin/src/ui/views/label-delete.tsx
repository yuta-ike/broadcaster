"use client"

import { Form } from "broadcaster-components/form/form.js"
import { SubmitButton } from "broadcaster-components/form/form-submit-button.js"
import { deleteLabelController } from "../../controller/label-delete.js"
import type { Label } from "../../domain/model/Sponsor.js"
import { LabelDisplay } from "../components/label-display.js"

type Props = {
  label: Label
  onComplete?: () => void
}
export const LabelDeleteForm = ({ label, onComplete }: Props) => {
  const handleSubmit = async () => {
    await deleteLabelController(label.id)
    onComplete?.()
  }

  return (
    <Form action={handleSubmit}>
      <div className="flex items-baseline gap-2">
        <LabelDisplay label={label} />
        を削除しますか？
      </div>
      <div>
        <SubmitButton type="submit">削除</SubmitButton>
      </div>
    </Form>
  )
}
