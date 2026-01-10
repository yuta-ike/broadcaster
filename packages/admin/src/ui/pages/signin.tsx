"use client"

import { Button } from "broadcaster-components/button.js"
import { authClient } from "../../libs/better-auth/client.js"

const Page = () => {
  const handleSignin = async () => {
    await authClient.signIn.social({
      provider: "google",
      // Preview URLでログインする場合、OAuthのredirectURIを本番環境のURLに設定する。
      // そのため、元のURLに戻すためにcallbackURLを指定する。
      callbackURL: window.location.origin,
    })
  }

  return (
    <div>
      <title>ログイン</title>
      <div className="p-4">
        <Button type="button" onClick={handleSignin}>
          Googleアカウントでログイン
        </Button>
      </div>
    </div>
  )
}

export default Page
