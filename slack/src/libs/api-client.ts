const buildApiClient = (baseUrl: string) => (apiKey: string) => {
  return {
    createSponsor: async (input: {
      name: string
      readableId: string
      slackUserIds: string[]
      slackChannelId: string
      labels: string[] | undefined
    }) => {
      const url = new URL("/api/sponsor", baseUrl)
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey || "secret"}`,
        },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        console.error("Failed to create sponsor:", await res.text())
        throw new Error(`Failed to create sponsor: ${res.statusText}`)
      }
      const json = await res.json()
      return json as { id: string }
    },
    getLabels: async () => {
      const url = new URL("/api/label", baseUrl)
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey || "secret"}`,
        },
      })
      if (!res.ok) {
        return null
      }

      const data = await res.json()
      return data as { id: string; label: string }[]
    },
  }
}

export const getApiClient = buildApiClient(
  "https://broadcaster-slack.vercel.app",
  // "http://localhost:3000",
)
