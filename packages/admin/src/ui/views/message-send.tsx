"use client"

import { CheckboxOption } from "broadcaster-components/control/checkbox.js"
import { Form } from "broadcaster-components/form/form.js"
import { FormControl } from "broadcaster-components/form/form-control.js"
import { SubmitButton } from "broadcaster-components/form/form-submit-button.js"
import { useForm } from "broadcaster-components/libs/use-form.js"
import { SlackEditor } from "broadcaster-components/slack-editor.js"
import { useTransition } from "react"
import { getMessageController } from "../../controller/message-get.js"
import type { MessageRefSchema } from "../../controller/message-get-schema.js"
import { createAndSendSlackMessageController } from "../../controller/slack-message-create-and-send.js"
import { CreateAndSendSlackMessageSchema } from "../../controller/slack-message-create-and-send-schema.js"
import type { Label, Sponsor } from "../../domain/model/Sponsor.js"
import { VariableTable } from "../components/variable-list.js"
import { ScheduleInput } from "../parts/ScheduleInput.js"
import { SponsorsInput } from "../parts/SponsorsInput.js"

const SLACK_WORKSPACE_DOMAIN = process.env.WAKU_PUBLIC_SLACK_WORKSPACE_DOMAIN
if (SLACK_WORKSPACE_DOMAIN == null) {
  throw new Error("WAKU_PUBLIC_SLACK_WORKSPACE_DOMAIN is not defined")
}

type Props = {
  sponsors: Sponsor[]
  labels: Label[]
  onComplete?: () => void
  initMessage?: string
}

export const SendMessageForm = ({
  sponsors,
  labels,
  initMessage,
  onComplete,
}: Props) => {
  const {
    values,
    setValue,
    registerTextarea,
    getValidValues,
    registerSingleCheckbox,
  } = useForm(CreateAndSendSlackMessageSchema, {
    message: initMessage ?? "",
    addMention: true,
    scheduledAt: "Immediate" as Date | "Immediate",
    targetType: "Label" as "Label" | "Sponsor",
    sponsorIds: [] as string[],
    labelIds: [] as string[],
  })

  const [_, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      const value = getValidValues()
      if (value == null) {
        return
      }
      await createAndSendSlackMessageController(value)
      onComplete?.()
    })
  }

  const handleGetMessage = async (ref: MessageRefSchema) => {
    const body = await getMessageController(ref)
    return body ?? null
  }

  return (
    <Form action={handleSubmit}>
      {/* タイトル */}
      <FormControl label="メッセージ" required>
        <SlackEditor
          {...registerTextarea("message")}
          onChange={(value) => setValue("message", value)}
          placeholder="提出期限が迫っています"
          rows={10}
          getMessage={handleGetMessage}
          option={{
            slackWorkspaceDomain: SLACK_WORKSPACE_DOMAIN,
          }}
        />
        <div className="mt-2">
          <VariableTable />
        </div>
      </FormControl>
      {/* メンション */}
      <FormControl label="メンション" required>
        <div className="mt-2">
          <CheckboxOption {...registerSingleCheckbox("addMention")}>
            担当者をメンションする
          </CheckboxOption>
        </div>
      </FormControl>

      {/* 送信先 */}
      <FormControl label="送信先" required>
        <SponsorsInput
          targetType={values.targetType}
          onChangeTargetType={(val) => setValue("targetType", val)}
          sponsorIds={values.sponsorIds}
          onChangeSponsorIds={(vals) => setValue("sponsorIds", vals)}
          labelIds={values.labelIds}
          onChangeLabelIds={(vals) => setValue("labelIds", vals)}
          labels={labels}
          sponsors={sponsors}
        />
      </FormControl>

      {/* 送信タイミング */}
      <FormControl label="送信日時" required>
        <ScheduleInput
          scheduledAt={values.scheduledAt}
          onChangeScheduledAt={(val) => setValue("scheduledAt", val)}
        />
      </FormControl>
      <div>
        <SubmitButton type="submit">送信</SubmitButton>
      </div>
    </Form>
  )
}
