import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts"
import { RegisterSponsorFunction } from "../functions/register-sponsor.ts"

export const RegisterSponsorWorkflow = DefineWorkflow({
  callback_id: "register_sponsor_workflow",
  title: "スポンサー登録フロー",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity", "channel"],
  },
})

const form = RegisterSponsorWorkflow.addStep(Schema.slack.functions.OpenForm, {
  title: "Send a greeting",
  interactivity: RegisterSponsorWorkflow.inputs.interactivity,
  submit_label: "Create",
  fields: {
    elements: [
      {
        name: "sponsor_name",
        title: "スポンサー名",
        type: Schema.types.string,
      },
      {
        name: "sponsor_readable_id",
        title: "スポンサーID",
        type: Schema.types.string,
      },
      {
        name: "sponsor_slack_user_ids",
        title: "スポンサーのSlackユーザーID一覧",
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.user_id,
        },
      },
      {
        name: "labels",
        title: "ラベル",
        description: "改行区切りで複数入力可能です",
        type: Schema.types.string,
        long: true,
      },
      {
        name: "channel",
        title: "チャンネル",
        type: Schema.slack.types.channel_id,
        default: RegisterSponsorWorkflow.inputs.channel,
      },
    ],
    required: [
      "sponsor_name",
      "sponsor_readable_id",
      "sponsor_slack_user_ids",
      "channel",
    ],
  },
})

RegisterSponsorWorkflow.addStep(RegisterSponsorFunction, {
  channel_id: RegisterSponsorWorkflow.inputs.channel,
  sponsor_name: form.outputs.fields.sponsor_name,
  sponsor_readable_id: form.outputs.fields.sponsor_readable_id,
  sponsor_slack_user_ids: form.outputs.fields.sponsor_slack_user_ids,
  labels: form.outputs.fields.labels,
})

RegisterSponsorWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: RegisterSponsorWorkflow.inputs.channel,
  message: `スポンサー登録が完了しました :tada:`,
})
