import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"
import { getApiClient } from "../libs/api-client.ts"

export const ListTagsFunctionDefinition = DefineFunction({
  callback_id: "list_tags_function",
  title: "List tags",
  description: "List tags",
  source_file: "src/functions/list-tags.ts",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "channel",
      },
    },
    required: ["interactivity", "channel_id"],
  },
})

export default SlackFunction(
  ListTagsFunctionDefinition,
  async ({ inputs, event, client, env }) => {
    const apiClient = getApiClient(env.M2M_API_TOKEN)

    const labels = await apiClient.getLabels()
    const resp = await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: {
        type: "modal",
        callback_id: "first-page",
        notify_on_close: true,
        title: { type: "plain_text", text: "My App" },
        submit: { type: "plain_text", text: "Next" },
        close: { type: "plain_text", text: "Close" },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Test block with multi static select",
            },
            accessory: {
              action_id: "select_label",
              type: "multi_static_select",
              placeholder: {
                type: "plain_text",
                text: "Select items",
              },
              options:
                labels?.map((label) => ({
                  value: label.id,
                  text: {
                    type: "plain_text",
                    text: label.label,
                  },
                })) ?? [],
            },
          },
          {
            type: "input",
            element: {
              type: "rich_text_input",
              action_id: "rich_text_input-action",
            },
            label: {
              type: "plain_text",
              text: "Label",
              emoji: true,
            },
            optional: false,
          },
        ],
      },
    })

    if (!resp.ok) {
      const res = await client.functions.completeError({
        function_execution_id: event.function_execution_id,
        error: `could not post message: ${JSON.stringify(resp)}`,
      })
      return {
        ...res,
        error: res.error ?? "Error",
      }
    }

    return {
      completed: false,
    }
  },
)
