export type SlackChannel = {
  id: string
  name: string
  kind: "public" | "private"
  isExtShared: boolean
}
