"use server"

import { unstable_getHeaders } from "waku/server"
import { data } from "../cache/slack-channels-list.cache.js"
import type { SlackChannel } from "../domain/model/SlackChannel.js"
import { verifySession } from "../libs/better-auth/server.js"

export const listSlackChannelsController = async (): Promise<
  SlackChannel[]
> => {
  await verifySession(unstable_getHeaders())
  return Array.isArray(data) ? data : []
}
