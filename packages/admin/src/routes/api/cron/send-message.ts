import { createFileRoute } from "@tanstack/react-router"
import { sendScheduledSlackMessageController } from "../../../controller/slack-message-send-scheduled-message.js"
import { toErrorResponse } from "../../../libs/error-response.js"

export const Route = createFileRoute("/api/cron/send-message")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const result = await sendScheduledSlackMessageController()
          return new Response(result, { status: 200 })
        } catch (error) {
          return toErrorResponse(error)
        }
      },
    },
  },
})
