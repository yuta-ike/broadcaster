export type MessageTemplate = {
  message: string
  addMention: boolean
  scheduledAt: Date | "Immediate"
  target:
    | {
        type: "Sponsor"
        sponsorIds: string[]
      }
    | {
        type: "Label"
        labelIds: string[]
      }
}

const getPlaceholderMatcher = (key: string): RegExp => {
  return new RegExp(`{{\\s*${key}\\s*}}`, "g")
}

export const resolveMessageTemplate = (
  template: string,
  variables: Record<string, string>,
): string => {
  let message = template
  for (const [key, value] of Object.entries(variables)) {
    const matcher = getPlaceholderMatcher(key)
    message = message.replaceAll(matcher, value)
  }
  return message
}
