import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts"
import { ListTagsFunctionDefinition } from "../functions/list-tags.ts"

export const BroadcastMessageWorkflow = DefineWorkflow({
  callback_id: "broadcast_message_workflow",
  title: "Slackメッセージを一斉送信",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
})

const BroadcastMessageForm = BroadcastMessageWorkflow.addStep(
  ListTagsFunctionDefinition,
  {
    channel_id: "C08FTJQLX8F",
    interactivity: BroadcastMessageWorkflow.inputs.interactivity,
  },
)

export default BroadcastMessageForm
