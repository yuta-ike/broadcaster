// biome-ignore lint/correctness/noUnusedVariables: entry point
const main = () => {
  const baseUrl =
    PropertiesService.getScriptProperties().getProperty("API_BASE_URL")
  const apiKey = PropertiesService.getScriptProperties().getProperty("API_KEY")

  try {
    const response = UrlFetchApp.fetch(`${baseUrl}/api/cron/send-message`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      muteHttpExceptions: true,
    })
    const responseCode = response.getResponseCode()
    const responseBody = response.getContentText()

    console.log(`Response Code: ${responseCode}`)
    console.log(`Response Body: ${responseBody}`)
  } catch (e) {
    console.error(
      `Error: ${e != null && typeof e === "object" && "message" in e ? e.message : e}`,
    )
  }
}
