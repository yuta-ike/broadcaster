import { listLabelsController } from "../../../controller/label-list.js"
import { m2mAuthClient } from "../../../libs/m2m-auth.js"

export const GET = async (request: Request): Promise<Response> => {
  await m2mAuthClient.verify(request.headers)

  const labels = await listLabelsController()
  return Response.json(labels, { status: 200 })
}
