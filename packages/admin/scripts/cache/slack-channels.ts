import { writeFile } from "node:fs/promises"
import { slackSdk } from "../../src/libs/slack-sdk.js"

const main = async () => {
  const channels = await slackSdk.getChannels()
  const url = new URL(
    "../../src/cache/slack-channels-list.cache.js",
    import.meta.url,
  )
  await writeFile(url, `export const data = ${JSON.stringify(channels)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
