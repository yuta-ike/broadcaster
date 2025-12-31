"use client"

import { Button } from "broadcaster-components/button.js"
import { authClient } from "../../../libs/better-auth/client.js"

const Page = () => {
  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.replace("/signin")
  }

  return (
    <>
      <title>ログアウト</title>
      <div className="p-4">
        <Button type="button" onClick={handleSignOut}>
          ログアウトする
        </Button>
      </div>
    </>
  )
}

export default Page
