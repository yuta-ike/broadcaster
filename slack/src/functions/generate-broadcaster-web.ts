import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"

export const GenerateBroadcasterWeb = DefineFunction({
  callback_id: "generate_broadcaster_web",
  title: "一斉送信のウェブ画面のURLを生成する",
  description: "一斉送信のウェブ画面のURLを生成する",
  source_file: "src/functions/generate-broadcaster-web.ts",
  input_parameters: {
    properties: {
      message_ctx: {
        type: Schema.slack.types.message_context,
        title: "チャンネル",
        description: "一斉送信するメッセージ",
      },
    },
    required: ["message_ctx"],
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
  GenerateBroadcasterWeb,
  ({ inputs: { message_ctx }, env }) => {
    const slackDomain = env.SLACK_WORKSPACE_DOMAIN
    const permalink = `https://${slackDomain}/archives/${message_ctx.channel_id}/p${message_ctx.message_ts.replace(".", "")}`

    return {
      outputs: {
        broadcaster_url: `https://broadcaster-slack.vercel.app/message/send?slack=${encodeURIComponent(permalink)}`,
      },
    }
  },
)
