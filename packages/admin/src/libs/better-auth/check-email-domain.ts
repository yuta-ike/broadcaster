export const checkEmailDomain = (
  email: string,
  whitelistDomains: string[],
): boolean => {
  return whitelistDomains.some((domain) => email.endsWith(`@${domain}`))
}
