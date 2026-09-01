import { MongoClient } from "mongodb"
import z from "zod"

const client = new MongoClient(process.env.MONGODB_URI!)
export const mongoDb = client.db("broadcaster")

export const initMongoDb = async () => {
  // Create Index
  await mongoDb
    .collection(SlackTokenCollection.name)
    .createIndex({ expiredAt: 1 }, { expireAfterSeconds: 0 })
}

export const SponsorCollection = {
  name: "sponsors",
  schema: z.object({
    _id: z.string(),
    name: z.string(),
    readableId: z.string(),
    slackChannel: z
      .object({
        id: z.string(),
        name: z.string(),
        kind: z.enum(["public", "private"]),
        isExtShared: z.boolean(),
      })
      .nullable(),
    slackUserIds: z.array(z.string()),
    labelIds: z.array(z.string()),
  }),
}
export type SponsorCollection = z.infer<typeof SponsorCollection.schema>

export const LabelCollection = {
  name: "labels",
  schema: z.object({
    _id: z.string(),
    label: z.string(),
    color: z.string(),
    order: z.int(),
  }),
}
export type LabelCollection = z.infer<typeof LabelCollection.schema>

export const MessageCollection = {
  name: "messages",
  schema: z.object({
    _id: z.string(),
    message: z.string(),
    addMention: z.boolean(),
    scheduledAt: z.iso.datetime(),
    sentAt: z.iso.datetime().nullable(),
    target: z.discriminatedUnion("type", [
      z.object({
        type: z.literal("Sponsor"),
        sponsorIds: z.array(z.string()),
      }),
      z.object({
        type: z.literal("Label"),
        labelIds: z.array(z.string()),
      }),
    ]),
    createdAt: z.iso.datetime(),
  }),
}
export type MessageCollection = z.infer<typeof MessageCollection.schema>

export const SlackTokenCollection = {
  name: "slack_tokens",
  schema: z.object({
    _id: z.string(),
    encryptedToken: z.string(),
    createdAt: z.iso.datetime(),
    expiredAt: z.date(),
  }),
}
export type SlackTokenCollection = z.infer<typeof SlackTokenCollection.schema>
