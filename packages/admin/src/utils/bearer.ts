export const parseBearer = (headers: Headers) => {
  // NOTE: 空文字の場合もフォールバックするので || を使う
  const authHeader =
    headers.get("authorization") || headers.get("Authorization")
  if (authHeader == null) {
    return null
  }

  const match = authHeader.match(/^Bearer (?<token>.+)$/)

  return match?.groups?.token ?? null
}
