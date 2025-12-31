import z from "zod"

export const SendSlackMessageSchema = z.object({
  message: z.string().min(1, "本文は必須です"),
  addMention: z.boolean(),
  sponsorIds: z.array(z.string()).min(1, "送信先は必須です"),
})
