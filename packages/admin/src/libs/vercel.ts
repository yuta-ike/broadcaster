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
  const productionUrl =
    process.env.VERCEL === "1"
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.BASE_URL

  const baseUrl =
    process.env.VERCEL === "1"
      ? process.env.VERCEL_ENV === "production"
        ? productionUrl
        : isPreview
          ? `https://${process.env.VERCEL_URL}`
          : undefined
      : process.env.BASE_URL

  console.log("BASE: ", baseUrl)
  return {
    isPreview,
    baseUrl,
    productionUrl,
  }
}

export const urls = getUrls()
