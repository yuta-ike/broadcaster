import { MessageCollection, mongoDb } from "../../libs/db.js"

export const updateMessageAsFailed = async (id: string) => {
  await mongoDb.collection<MessageCollection>(MessageCollection.name).updateOne(
    {
      _id: id,
      sentAt: null,
    },
    {
      $set: {
        sendStatus: "failed",
      },
    },
  )
}
