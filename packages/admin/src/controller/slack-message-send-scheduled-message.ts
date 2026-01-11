import { getScheduledMessages } from "../infrastructure/db/get-scheduled-messages.js"
import { waitFor } from "../utils/wait.js"
import { sendSlackMessage } from "./internal/send-slack-message.js"

export const sendScheduledSlackMessageController = async () => {
  console.info("Start sending scheduled messages")

  const scheduledMessages = await getScheduledMessages()

  console.info(`Found ${scheduledMessages.length} scheduled messages to send`)

  for (const scheduledMessage of scheduledMessages) {
    try {
      await sendSlackMessage(scheduledMessage)
    } catch (error) {
      console.error("Error sending scheduled message:", error)
    }
    await waitFor(1000) // 1秒待機
  }

  console.info(`Sent ${scheduledMessages.length} scheduled messages`)

  return scheduledMessages
}
