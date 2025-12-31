import z from "zod"

const variablesSchema = z.object({
  mentions: z.string().array(),
  sponsorName: z.string(),
  planName: z.string(),
})

type Variable = z.infer<typeof variablesSchema>

export const resolveMessageTemplate = (
  messageTemplate: string,
  variables: Variable,
) => {
  const templateVars = variablesSchema.parse(variables)
  const resolved = messageTemplate
    .replaceAll(/{{\s+mentions\s+}}/, templateVars.mentions.join(" "))
    .replaceAll(/{{\s+sponsorName\s+}}/, templateVars.sponsorName)
    .replaceAll(/{{\s+planName\s+}}/, templateVars.planName)
  return resolved
}
