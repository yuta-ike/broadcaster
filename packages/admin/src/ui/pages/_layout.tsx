import type { ReactNode } from "react"

// biome-ignore lint/correctness/useImportExtensions: css import
import "../styles.css"

type RootLayoutProps = { children: ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <meta name="robots" content="noindex" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      {children}
    </>
  )
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const
}
