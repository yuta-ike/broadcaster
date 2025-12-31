import { unassignLabelWithReadableIdController } from "../../../../../../controller/label-unassign-with-readable-id.js"
import { m2mAuthClient } from "../../../../../../libs/m2m-auth.js"

export const POST = async (request: Request): Promise<Response> => {
  await m2mAuthClient.verify(request.headers)

  const result = new URL(request.url).pathname.match(
    /^\/api\/label\/(?<readableId>[^/]+)\/(?<label>[^/]+)\/remove\/?/,
  )

  const readableId = result?.groups?.readableId
  const label = result?.groups?.label

  if (readableId == null || label == null) {
    return Response.json({ message: "Invalid parameters" }, { status: 400 })
  }

  const success = await unassignLabelWithReadableIdController({
    readableId,
    label,
  })

  if (success) {
    return Response.json({ message: "Success" }, { status: 200 })
  } else {
    return Response.json(
      { message: "Sponsor or label not found" },
      { status: 404 },
    )
  }
}
