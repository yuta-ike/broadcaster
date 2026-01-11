import type { MessageTemplateWithDetail } from "../../../domain/model/Message"

type Row = {
  scheduledAt: Date | null
  id: string
  createdAt: Date
  updatedAt: Date
  message: string
  addMention: boolean
  sendImmediately: boolean
  sentAt: Date | null
  targetSponsors: {
    name: string
    id: string
    readableId: string
    slackChannelId: string | null
    createdAt: Date
    updatedAt: Date
    labels: {
      label: string
      id: string
      color: string
      createdAt: Date
      updatedAt: Date
      order: number
    }[]
    slackUsers: {
      createdAt: Date
      slackUserId: string
      sponsorId: string
    }[]
  }[]
  targetLabels: {
    label: string
    id: string
    color: string
    createdAt: Date
    updatedAt: Date
    order: number
  }[]
}

export const parseMessageRow = (row: Row): MessageTemplateWithDetail => {
  return {
    id: row.id,
    message: row.message,
    addMention: row.addMention,
    scheduledAt: row.scheduledAt ?? "Immediate",
    createdAt: row.createdAt,
    sentAt: row.sentAt,
    target:
      0 < row.targetLabels.length
        ? {
            type: "Label",
            labels: row.targetLabels.map((label) => ({
              id: label.id,
              label: label.label,
              color: label.color,
            })),
          }
        : {
            type: "Sponsor",
            sponsors: row.targetSponsors.map((sponsor) => ({
              id: sponsor.id,
              name: sponsor.name,
              readableId: sponsor.readableId,
              slackChannelId: sponsor.slackChannelId ?? undefined,
              slackUsers: sponsor.slackUsers.map((user) => user.slackUserId),
              labels: sponsor.labels,
            })),
          },
  }
}
