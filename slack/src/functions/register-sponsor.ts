import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"
import { getApiClient } from "../libs/api-client.ts"

export const RegisterSponsorFunction = DefineFunction({
  callback_id: "register_sponsor",
  title: "スポンサーを登録する",
  description: "スポンサーを登録する",
  source_file: "src/functions/register-sponsor.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        title: "チャンネル",
      },
      sponsor_name: {
        type: Schema.types.string,
        title: "スポンサー名",
      },
      sponsor_readable_id: {
        type: Schema.types.string,
        title: "スポンサーID",
      },
      sponsor_slack_user_ids: {
        type: Schema.types.array,
        title: "スポンサーのSlackユーザーID一覧",
        items: {
          type: Schema.slack.types.user_id,
        },
      },
      labels: {
        type: Schema.types.string,
        title: "ラベル",
        description: "改行区切りで複数入力可能です",
      },
    },
    required: [
      "channel_id",
      "sponsor_name",
      "sponsor_readable_id",
      "sponsor_slack_user_ids",
    ],
  },
  output_parameters: {
    properties: {
      broadcaster_url: {
        type: Schema.types.string,
        description: "URL of the broadcaster web page",
      },
    },
    required: ["broadcaster_url"],
  },
})

export default SlackFunction(
  RegisterSponsorFunction,
  async ({ inputs, env }) => {
    const apiClient = getApiClient(env.M2M_API_TOKEN)

    const res = await apiClient.createSponsor({
      name: inputs.sponsor_name,
      readableId: inputs.sponsor_readable_id,
      slackUserIds: inputs.sponsor_slack_user_ids,
      slackChannelId: inputs.channel_id,
      labels: inputs.labels
        ?.split("\n")
        .map((label) => label.trim())
        .filter((label) => label.length > 0),
    })

    return {
      outputs: {
        broadcaster_url: `https://broadcaster-slack.vercel.app/sponsors/${encodeURIComponent(res.id)}`,
      },
    }
  },
)
