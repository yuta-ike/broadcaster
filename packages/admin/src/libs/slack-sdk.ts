import { type Block, WebClient } from "@slack/web-api"
import type { SlackChannel } from "../domain/model/SlackChannel.js"
import { safeLoop } from "../utils/loop.js"
import { waitFor } from "../utils/wait.js"

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN

if (SLACK_BOT_TOKEN == null) {
  throw new Error("SLACK_BOT_TOKEN is not defined")
}

const slack = new WebClient(SLACK_BOT_TOKEN)

export type PostMessageItem = {
  channel: string
  text?: string
  blocks?: Block[]
}

export class SlackSdk {
  #client: WebClient

  constructor(client: WebClient) {
    this.#client = client
  }

  async postMessage({ channel, text, blocks }: PostMessageItem) {
    await this.#client.chat.postMessage({
      channel,
      text,
      username: "一斉送信",
      parse: "full",
      blocks: blocks ?? [],
      unfurl_links: false,
    })
  }

  async bulkPostMessage(items: PostMessageItem[]) {
    for (const item of items) {
      await this.postMessage({
        channel: item.channel,
        text: item.text,
        blocks: item.blocks,
      })
      await waitFor(1000 * 1.1)
    }
  }

  async getMessage({ channel, timestamp }: { channel: string; timestamp: string }) {
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
                kind: channel.is_private ? ("private" as const) : ("public" as const),
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
