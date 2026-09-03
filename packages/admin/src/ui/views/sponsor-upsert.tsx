import { Combobox } from "broadcaster-components/control/combobox.js"
import { Input } from "broadcaster-components/control/input.js"
import { MultiCombobox } from "broadcaster-components/control/multi-combobox.js"
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
import { listSlackUsersController } from "../../controller/slack-users-list.js"
import { CheckboxOption } from "broadcaster-components/control/checkbox.js"
import { TbExternalLink, TbLoader } from "react-icons/tb"
import { SlackUserChip } from "../components/slack-user-chip.js"
import { Link } from "@tanstack/react-router"

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

export const SponsorUpsertForm = ({ sponsor, labels, initValue, onComplete }: Props) => {
  const { values, setValue, getValidValues, registerInput, errors } = useForm(
    SponsorUpsertFormSchema,
    initValue ?? defaultValue,
  )

  const {
    status: slackStatus,
    data: slackChannels,
    revalidate,
  } = useQuery(() => listSlackChannelsController(), { lazy: true })

  const {
    data: slackUsers,
    status: slackUsersStatus,
    revalidate: revalidateSlackUsers,
  } = useQuery(
    () =>
      values.slackChannelId === ""
        ? Promise.resolve(null)
        : listSlackUsersController({ data: { channelId: values.slackChannelId } }),
    {
      lazy: true,
    },
    [values.slackChannelId],
  )

  const groupedSlackUsers = Object.groupBy(slackUsers ?? [], (user) => user.kind)
  const guestUsers = [
    ...(groupedSlackUsers.connect ?? []),
    ...(groupedSlackUsers.multi_channel_guest ?? []),
    ...(groupedSlackUsers.single_channel_guest ?? []),
  ]

  const [_, startTransition] = useTransition()

  const handleSubmit = () => {
    "use server"

    startTransition(async () => {
      const value = getValidValues()
      if (value == null) {
        return
      }
      await upsertSponsorControllerFn({
        data: {
          rawId: sponsor?.id ?? null,
          raw: value,
        },
      })
      onComplete?.()
    })
  }

  const labelMap = new Map(labels.map((label) => [label.label, label]))

  return (
    <Form action={handleSubmit}>
      {/* タイトル */}
      <FormControl label="スポンサー名" required error={errors.name}>
        <Input {...registerInput("text", "name")} placeholder="テスト株式会社" />
      </FormControl>

      {/* スポンサーID（readbaleId） */}
      <FormControl
        label="スポンサーID"
        required
        support="英数字、ハイフン、アンダースコアが使用可能です"
        error={errors.readableId}
      >
        <Input {...registerInput("text", "readableId")} placeholder="test-corp" />
      </FormControl>

      {/* SlackチャンネルID */}
      <FormControl label="Slackチャンネル" error={errors.slackChannelId}>
        <Combobox
          items={
            slackChannels?.data?.map((channel) => ({
              id: channel.id,
              label: channel.name,
              channel,
            })) ??
            // まだデータをフェッチしていない場合で sponsor が指定されている場合は、現在の値を表示するために現在のsponsorのチャンネルを選択肢として表示しておく
            (sponsor?.slackChannel != null
              ? [
                  {
                    id: sponsor.slackChannel.id,
                    label: sponsor.slackChannel.name,
                    channel: sponsor.slackChannel,
                  },
                ]
              : [])
          }
          value={values.slackChannelId}
          onValueChange={(value) => setValue("slackChannelId", value)}
          isOptionLoading={slackStatus === "loading"}
          onOpen={() => {
            if (slackStatus === "not-started" || slackChannels?.err === "SLACK_TOKEN_NOT_FOUND") {
              revalidate()
            }
          }}
          renderItem={({ channel }) => <SlackChannelDisplay channel={channel} />}
        />
        {slackChannels?.err === "SLACK_TOKEN_NOT_FOUND" && (
          <div className="mt-2 text-sm text-rose-400">
            先にSlack連携を実施してください
            <Link
              to="/slack"
              target="_blank"
              className="text-sky-500 mx-1 underline hover:no-underline transition inline-flex items-center"
            >
              Slack連携する
              <TbExternalLink className="inline-block" />
            </Link>
          </div>
        )}
      </FormControl>

      {/* SlackユーザーID */}
      <FormControl label="メンション先" error={errors.slackUserIds}>
        {slackUsers == null ? (
          <div className="bg-white px-3 py-2 rounded-lg border border-slate-400 text-sm text-slate-400">
            {slackUsersStatus === "loading" ? (
              <div className="flex gap-1 items-center">
                <TbLoader className="animate-spin" />
                取得中...
              </div>
            ) : sponsor == null ? (
              "先にチャンネルを選択してください"
            ) : (
              <button
                type="button"
                onClick={() => revalidateSlackUsers()}
                className="text-sky-600 underline hover:no-underline transition"
              >
                ユーザーを見る
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white p-3 rounded-lg border border-slate-400 flex flex-col gap-2">
            {0 < guestUsers.length && (
              <>
                <h3 className="text-sm text-slate-800">ゲスト・Connectアカウント</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {guestUsers.map((user) => (
                    <CheckboxOption
                      key={user.id}
                      checked={values.slackUserIds.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue("slackUserIds", [...new Set([...values.slackUserIds, user.id])])
                        } else {
                          setValue(
                            "slackUserIds",
                            values.slackUserIds.filter((id) => id !== user.id),
                          )
                        }
                      }}
                    >
                      <SlackUserChip user={user} />
                    </CheckboxOption>
                  ))}
                </div>
                <hr className="my-1 border-slate-300" />
              </>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {groupedSlackUsers.normal?.map((user) => (
                <CheckboxOption
                  key={user.id}
                  checked={values.slackUserIds.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setValue("slackUserIds", [...new Set([...values.slackUserIds, user.id])])
                    } else {
                      setValue(
                        "slackUserIds",
                        values.slackUserIds.filter((id) => id !== user.id),
                      )
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <img src={user.iconUrl} width={20} height={20} className="rounded-full" />
                    {user.displayName || user.name}
                  </div>
                </CheckboxOption>
              ))}
            </div>
          </div>
        )}
        <div className="text-sm mt-1">
          ※ 30人以上の参加者がいるチャンネルは一部のユーザーのみ表示されます
        </div>
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
          renderItem={(item) => (
            <LabelDisplay key={item.id} style="dot" label={labelMap.get(item.label)!} />
          )}
          placeholder="ラベル名"
        />
      </FormControl>

      <div>
        <SubmitButton type="submit">{sponsor == null ? "作成" : "更新"}</SubmitButton>
      </div>
    </Form>
  )
}
