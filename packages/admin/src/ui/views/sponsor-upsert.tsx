"use client"

import { Combobox } from "broadcaster-components/control/combobox.js"
import { Input } from "broadcaster-components/control/input.js"
import { MultiCombobox } from "broadcaster-components/control/multi-combobox.js"
import { MultiInput } from "broadcaster-components/control/multi-input.js"
import { Form } from "broadcaster-components/form/form.js"
import { FormControl } from "broadcaster-components/form/form-control.js"
import { SubmitButton } from "broadcaster-components/form/form-submit-button.js"
import { useForm } from "broadcaster-components/libs/use-form.js"
import { useQuery } from "broadcaster-components/utils/use-query.js"
import { useTransition } from "react"
import type z from "zod"
import { listSlackChannelsController } from "../../controller/slack-channels-list.js"
import { SponsorUpsertFormSchema } from "../../controller/sponsor-upsert-schema.js"
import { upsertSponsorControllerFn } from "../../controller/sponsor-upsert-serverfn.js"
import type { SlackChannel } from "../../domain/model/SlackChannel.js"
import type { Label, Sponsor } from "../../domain/model/Sponsor.js"
import { LabelDisplay } from "../components/label-display.js"
import { SlackChannelDisplay } from "../components/slack-channel-display.js"

type Props = {
  sponsor: Sponsor | null
  labels: Label[]
  initValue?: z.infer<typeof SponsorUpsertFormSchema>
  listSlackChannels?: () => Promise<SlackChannel[]>
  onComplete?: () => void
}

const defaultValue = {
  name: "",
  readableId: "",
  slackChannelId: "",
  slackUserIds: [] as string[],
  labels: [] as string[],
} satisfies z.infer<typeof SponsorUpsertFormSchema>

export const SponsorUpsertForm = ({
  sponsor,
  labels,
  initValue,
  onComplete,
}: Props) => {
  const {
    values,
    setValue,
    registerCustom,
    getValidValues,
    registerInput,
    errors,
  } = useForm(SponsorUpsertFormSchema, initValue ?? defaultValue)

  const { data: slackChannels } = useQuery(() => listSlackChannelsController())

  const [_, startTransition] = useTransition()

  const handleSubmit = () => {
    "use server"

    startTransition(async () => {
      const value = getValidValues()
      if (value == null) {
        return
      }
      await upsertSponsorControllerFn(sponsor?.id ?? null, value)
      onComplete?.()
    })
  }

  const labelMap = new Map(labels.map((label) => [label.label, label]))

  return (
    <Form action={handleSubmit}>
      {/* タイトル */}
      <FormControl label="スポンサー名" required error={errors.name}>
        <Input
          {...registerInput("text", "name")}
          placeholder="テスト株式会社"
        />
      </FormControl>

      {/* スポンサーID（readbaleId） */}
      <FormControl
        label="スポンサーID"
        required
        support="英数字、ハイフン、アンダースコアが使用可能です"
        error={errors.readableId}
      >
        <Input
          {...registerInput("text", "readableId")}
          placeholder="test-corp"
        />
      </FormControl>

      {/* SlackチャンネルID */}
      <FormControl label="SlackチャンネルID" error={errors.slackChannelId}>
        <Combobox
          items={
            slackChannels?.map((channel) => ({
              id: channel.id,
              label: channel.name,
              channel,
            })) ?? []
          }
          value={values.slackChannelId}
          onValueChange={(value) => setValue("slackChannelId", value)}
          placeholder="チャンネル名を入力して検索"
          renderItem={({ channel }) => (
            <SlackChannelDisplay channel={channel} />
          )}
        />
      </FormControl>

      {/* SlackユーザーID */}
      <FormControl
        label="SlackユーザーID（複数可、改行区切り）"
        error={errors.slackUserIds}
      >
        <MultiInput
          {...registerCustom("slackUserIds", {
            encode: (value) => value.join("\n"),
            decode: (e) =>
              e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter((s) => s.length > 0),
          })}
          placeholder="UABCDE012345"
        />
      </FormControl>

      {/* ラベル */}
      <FormControl label="ラベル" error={errors.labels}>
        <MultiCombobox
          items={labels.map(({ label }) => ({
            id: label,
            label: label,
          }))}
          value={values.labels}
          onValueChange={(value) => setValue("labels", value)}
          renderItem={(item) => {
            const label = labelMap.get(item.label)!
            return <LabelDisplay key={item.id} label={label} />
          }}
        />
      </FormControl>

      <div>
        <SubmitButton type="submit">
          {sponsor == null ? "作成" : "更新"}
        </SubmitButton>
      </div>
    </Form>
  )
}
