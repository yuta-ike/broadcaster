import { Manifest } from "deno-slack-sdk/mod.ts"
import { GenerateBroadcasterWeb } from "./src/functions/generate-broadcaster-web.ts"
import { BroadcastMessageWorkflow } from "./src/workflows/broadcast-message.ts"
import { RegisterSponsorWorkflow } from "./src/workflows/register-sponsor.ts"

export default Manifest({
  name: "Broadcaster",
  description: "Slack上で一斉送信を行うアプリです。",
  icon: "assets/icon.png",
  functions: [GenerateBroadcasterWeb],
  workflows: [BroadcastMessageWorkflow, RegisterSponsorWorkflow],
  outgoingDomains: [
    "broadcaster-slack.vercel.app",
    //  "localhost"
  ],
  botScopes: [
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "channels:read",
    "triggers:write",
    "triggers:read",
  ],
})
