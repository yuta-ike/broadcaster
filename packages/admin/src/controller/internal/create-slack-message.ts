import type { MessageTemplate } from "../../domain/model/Message.js"
import { saveMessage } from "../../infrastructure/db/save-message.js"
import { sendSlackMessage } from "./send-slack-message.js"
export const createSlackMessage = async (input: MessageTemplate) => {
  // メッセージ内容をDBに保存
  const message = await saveMessage(input)

  // 即時送信の場合は送信処理
  if (input.scheduledAt === "Immediate") {
    await sendSlackMessage(message)
  }
}
