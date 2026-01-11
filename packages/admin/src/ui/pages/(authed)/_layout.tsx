import type { ReactNode } from "react"
import { Link } from "waku"
import { unstable_getHeaders } from "waku/server"
import { getSession } from "../../../libs/better-auth/server.js"
import { UnauthorizedDisplay } from "../../components/unauthorized-display.js"

type RootLayoutProps = { children: ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getSession(unstable_getHeaders())

  if (session == null) {
    return <UnauthorizedDisplay />
  }

  return (
    <div
      className="min-h-screen"
      style={{
        display: "grid",
        gridTemplate: `
          "header  header" 60px
          "sidebar main  " 1fr /
          240px    1fr
        `,
      }}
    >
      <header
        style={{
          gridArea: "header",
        }}
        className="flex items-center justify-between border-b border-b-slate-200 p-1"
      >
        <div className="px-2 py-1 font-bold text-lg italic">Broadcaster</div>
      </header>
      <nav
        style={{
          gridArea: "sidebar",
        }}
        className="flex flex-col gap-1 border-r border-r-slate-200 p-1"
      >
        <Link
          to="/message/send"
          className="w-full rounded px-3 py-3 hover:bg-slate-100"
        >
          Send Message
        </Link>
        <Link
          to="/message"
          className="w-full rounded px-3 py-3 hover:bg-slate-100"
        >
          Messages
        </Link>
        <Link
          to="/sponsors"
          className="w-full rounded px-3 py-3 hover:bg-slate-100"
        >
          Sponsors
        </Link>
        <Link
          to="/labels/assign"
          className="w-full rounded px-3 py-3 hover:bg-slate-100"
        >
          Label Assign
        </Link>
        <Link
          to="/labels"
          className="w-full rounded px-3 py-3 hover:bg-slate-100"
        >
          Labels
        </Link>
        <Link
          to="/signout"
          className="w-full rounded px-3 py-3 hover:bg-slate-100"
        >
          Sign Out
        </Link>
      </nav>
      <main
        style={{
          gridArea: "main",
        }}
      >
        {children}
      </main>
    </div>
  )
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const
}
