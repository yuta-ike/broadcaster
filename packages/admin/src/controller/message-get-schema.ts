import z from "zod"

export const MessageRefSchema = z.object({
  channel: z.string().min(1),
  timestamp: z.string().min(1),
})

export type MessageRefSchema = z.infer<typeof MessageRefSchema>
