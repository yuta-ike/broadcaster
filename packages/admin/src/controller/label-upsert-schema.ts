import z from "zod"

export const LabelUpsertFormSchema = z.object({
  label: z.string().min(1, "ラベル名は必須です"),
  color: z
    .string()
    .min(1, "カラーコードは必須です")
    .refine((val) => /^#([0-9A-Fa-f]{6})$/.test(val), {
      message: "カラーコードは#RRGGBB形式で指定してください",
    }),
})
