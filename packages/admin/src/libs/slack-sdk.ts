import { WebClient } from "@slack/web-api"
import type { SlackChannel } from "../domain/model/SlackChannel.js"
import { chunk } from "../utils/chunk.js"
import { safeLoop } from "../utils/loop.js"

const SLACK_TOKEN = process.env.SLACK_TOKEN

if (SLACK_TOKEN == null) {
  throw new Error("SLACK_TOKEN is not defined")
}

const slack = new WebClient(SLACK_TOKEN)

type PostMessageItem = {
  channel: string
  text: string
}

export class SlackSdk {
  #client: WebClient

  constructor(client: WebClient) {
    this.#client = client
  }

  async postMessage({ channel, text }: PostMessageItem) {
    await this.#client.chat.postMessage({
      channel,
      text,
    })
  }

  async bulkPostMessage(items: PostMessageItem[]) {
    for (const chunked of chunk(items, 5)) {
      await Promise.all(
        chunked.map((item) =>
          this.postMessage({
            channel: item.channel,
            text: item.text,
          }),
        ),
      )
    }
  }

  async getMessage({
    channel,
    timestamp,
  }: {
    channel: string
    timestamp: string
  }) {
    const res = await this.#client.conversations.history({
      channel,
      latest: timestamp,
      inclusive: true,
      limit: 1,
    })
    return res.messages?.[0] || null
  }

  async getChannels() {
    const channels: SlackChannel[] = []

    await safeLoop(async (cursor: string | null) => {
      const res = await this.#client.conversations.list({
        exclude_archived: true,
        types: "public_channel,private_channel",
        cursor: cursor ?? undefined,
      })

      channels.push(
        ...(res.channels?.flatMap((channel) =>
          channel.id == null || channel.name == null
            ? []
            : {
                id: channel.id,
                name: channel.name,
                kind: channel.is_private
                  ? ("private" as const)
                  : ("public" as const),
                isExtShared: channel.is_ext_shared || false,
              },
        ) ?? []),
      )

      return res.response_metadata?.next_cursor || null
    }, 5)

    return channels
  }
}

export const slackSdk = new SlackSdk(slack)
