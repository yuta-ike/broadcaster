type Urls = {
  /** プレビュー環境かどうか */
  isPreview: boolean
  /** プレビュー環境の場合はプレビューURL、本番環境の場合は本番URL */
  baseUrl: string | undefined
  /** 環境によらず、本番環境のURL */
  productionUrl: string | undefined
}

const getUrls = (): Urls => {
  const isPreview = process.env.VERCEL_ENV === "preview"
  const productionUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

  const baseUrl: string | undefined =
    process.env.VERCEL === "1"
      ? process.env.VERCEL_ENV === "production"
        ? productionUrl
        : isPreview
          ? `https://${process.env.VERCEL_URL}`
          : undefined
      : undefined

  return {
    isPreview,
    baseUrl,
    productionUrl,
  }
}

export const urls = getUrls()
