import { MessageCollection, mongoDb } from "../../libs/db"

export const updateMessageAsAlreadySent = async (id: string) => {
  await mongoDb.collection<MessageCollection>(MessageCollection.name).updateOne(
    {
      _id: id,
    },
    {
      $set: {
        sentAt: new Date().toISOString(),
        sendStatus: "sent",
      },
    },
  )
}
