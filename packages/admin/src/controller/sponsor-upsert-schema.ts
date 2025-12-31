import z from "zod"

export const SponsorUpsertFormSchema = z.object({
  name: z.string().min(1, "スポンサー名は必須です"),
  readableId: z.string().min(1, "スポンサーIDは必須です"),
  slackChannelId: z.string(),
  slackUserIds: z.array(z.string()),
  labels: z.array(z.string()),
})
