import { sendScheduledSlackMessageController } from "../../../../controller/slack-message-send-scheduled-message"
import { m2mAuthClient } from "../../../../libs/m2m-auth"

export const GET = async (request: Request): Promise<Response> => {
  await m2mAuthClient.verify(request.headers)

  await sendScheduledSlackMessageController()

  return new Response("Done", { status: 200 })
}
