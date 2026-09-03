import { getScheduledMessages } from "../infrastructure/db/get-scheduled-messages.js"
import { updateMessageAsFailed } from "../infrastructure/db/update-message-as-failed.js"
import { waitFor } from "../utils/wait.js"
import { sendSlackMessage } from "./internal/send-slack-message.js"

const MAX_SCHEDULE_DELAY_MS = 24 * 60 * 60 * 1000

export const sendScheduledSlackMessageController = async () => {
  console.info("Start sending scheduled messages")

  const scheduledMessages = await getScheduledMessages()

  console.info(`Found ${scheduledMessages.length} scheduled messages to send`)

  const result = { success: 0, failure: 0 }
  for (const scheduledMessage of scheduledMessages) {
    if (
      scheduledMessage.scheduledAt !== "Immediate" &&
      Date.now() - scheduledMessage.scheduledAt.getTime() >= MAX_SCHEDULE_DELAY_MS
    ) {
      console.warn(`Skipping scheduled message ${scheduledMessage.id}: it is at least one day late`)
      await updateMessageAsFailed(scheduledMessage.id)
      result.failure++
      continue
    }

    try {
      await sendSlackMessage(scheduledMessage)
      result.success++
    } catch (error) {
      console.error("Error sending scheduled message:", error)
      result.failure++
    }
    await waitFor(1000) // 1秒待機
  }

  console.info(`Processed ${scheduledMessages.length} scheduled messages`)
  console.info(`Success: ${result.success}, Failure: ${result.failure}`)

  return `Processed ${scheduledMessages.length} scheduled messages. Success: ${result.success}, Failure: ${result.failure}`
}
