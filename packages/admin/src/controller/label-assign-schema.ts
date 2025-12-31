import z from "zod"

export const LabelAssignSchema = z.object({
  sponsorIds: z.array(z.uuid()).min(1, "スポンサーを選択してください"),
  labelIds: z.array(z.uuid()).min(1, "ラベルを選択してください"),
})

export type LabelAssignSchema = z.infer<typeof LabelAssignSchema>
