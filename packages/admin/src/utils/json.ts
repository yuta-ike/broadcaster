export const safeParseJson = (jsonString: string) => {
  try {
    return JSON.parse(jsonString)
  } catch {
    return null
  }
}
