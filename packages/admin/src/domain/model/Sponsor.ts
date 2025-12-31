export type Sponsor = {
  id: string
  name: string
  readableId: string
  slackChannelId?: string
  slackUsers: string[]
  labels: Label[]
}

export type Label = {
  id: string
  label: string
  color: string
}

export const getSponsorRelatedVariablesForTemplate = (sponsor: Sponsor) => {
  return {
    SPONSOR_NAME: sponsor.name,
    SPONSOR_READABLE_ID: sponsor.readableId,
    SPONSOR_MENTIONS: sponsor.slackUsers
      .map((userId) => `<@${userId}>`)
      .join(" "),
  }
}
