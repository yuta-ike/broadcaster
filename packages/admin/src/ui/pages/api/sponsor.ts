import z from "zod"
import { upsertSponsorController } from "../../../controller/sponsor-upsert.js"
import { m2mAuthClient } from "../../../libs/m2m-auth.js"

const inputSchema = z.object({
  name: z.string(),
  readableId: z.string().refine((val) => /^[a-zA-Z0-9-_]+$/.test(val), {
    message:
      "readableId must contain only alphanumeric characters, hyphens, or underscores",
  }),
  slackUserIds: z.array(z.string()),
  slackChannelId: z.string(),
  labels: z.array(z.string()).nullish(),
})

export const POST = async (request: Request): Promise<Response> => {
  await m2mAuthClient.verify(request.headers)

  const json = await request.json()
  const input = inputSchema.parse(json)

  const sponsorId = await upsertSponsorController(null, {
    name: input.name,
    readableId: input.readableId,
    slackUserIds: input.slackUserIds,
    slackChannelId: input.slackChannelId,
    labels: input.labels ?? [],
  })

  return Response.json({ id: sponsorId }, { status: 200 })
}
