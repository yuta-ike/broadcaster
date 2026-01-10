import z from "zod"

export const CreateAndSendSlackMessageSchema = z
  .object({
    message: z.string().min(1, "本文は必須です"),
    addMention: z.boolean(),
    scheduledAt: z.union([z.date(), z.literal("Immediate")]),
    targetType: z.enum(["Sponsor", "Label"]),
    sponsorIds: z.array(z.string()),
    labelIds: z.array(z.string()),
  })
  .refine(
    (input) => {
      return !(input.targetType === "Sponsor" && input.sponsorIds.length === 0)
    },
    {
      path: ["sponsorIds"],
      error: "スポンサーを1つ以上選択してください",
    },
  )
  .refine(
    (input) => {
      return !(input.targetType === "Label" && input.labelIds.length === 0)
    },
    {
      path: ["labelIds"],
      error: "ラベルを1つ以上選択してください",
    },
  )
