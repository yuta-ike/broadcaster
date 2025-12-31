import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts"
import type { Trigger } from "deno-slack-sdk/types.ts"
import type { RegisterSponsorWorkflow } from "../workflows/register-sponsor.ts"

const registerSponsorTrigger: Trigger<
  typeof RegisterSponsorWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: "Register Sponsor",
  description: "スポンサー登録を行います",
  workflow: "#/workflows/register_sponsor_workflow",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
}

export default registerSponsorTrigger
