import { unstable_redirect } from "waku/router/server"

export default async function HomePage() {
  unstable_redirect("/message/send")
}
