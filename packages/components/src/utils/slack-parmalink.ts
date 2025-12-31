export const parseSlackPermalink = (
  url: string,
  slackWorkspaceDomain: string,
) => {
  const slackLinkRegex = new RegExp(
    `^\\s*https://${slackWorkspaceDomain}/archives/(?<channel>.+)/p(?<timestamp>\\d{16})\\s*$`,
  )

  const result = slackLinkRegex.exec(url)?.groups
  if (result == null) {
    return
  }
  const channel = result.channel
  const timestamp = result.timestamp
  if (channel == null || timestamp == null) {
    return
  }

  return {
    channel,
    timestamp: `${timestamp.slice(0, 10)}.${timestamp.slice(10)}`,
  }
}
