"use client"

import { Form } from "broadcaster-components/form/form.js"
import { SubmitButton } from "broadcaster-components/form/form-submit-button.js"
import { deleteSponsorController } from "../../controller/sponsor-delete.js"
import type { Sponsor } from "../../domain/model/Sponsor.js"

type Props = {
  sponsor: Sponsor
  onComplete?: () => void
}
export const SponsorDeleteForm = ({ sponsor, onComplete }: Props) => {
  const handleSubmit = async () => {
    await deleteSponsorController(sponsor.id)
    onComplete?.()
  }

  return (
    <Form action={handleSubmit}>
      <div className="flex items-baseline gap-2">
        {sponsor.name}
        を削除しますか？
      </div>
      <div>
        <SubmitButton type="submit">削除</SubmitButton>
      </div>
    </Form>
  )
}
